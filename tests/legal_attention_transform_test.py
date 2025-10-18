#!/usr/bin/env python3
"""
Tests for Legal Attention Transform
==================================

Test suite for the transformer-style attention mechanism for legal inference.
"""

import unittest
import numpy as np
import sys
import os
from datetime import datetime

# Add the lex-inference-engine to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'lex-inference-engine'))

from legal_attention_transform import (
    LegalAttentionTransform, 
    LegalInferenceEngine,
    LegalElement, 
    GuiltHypothesis,
    LegalLens,
    PositionalEncoding,
    create_bantjies_case_example
)


class TestLegalAttentionTransform(unittest.TestCase):
    """Test cases for Legal Attention Transform"""
    
    def setUp(self):
        """Set up test fixtures"""
        self.transform = LegalAttentionTransform(model_dim=64, num_heads=7)
        
        # Create test legal elements
        self.test_elements = [
            LegalElement(
                id="test_action_1",
                element_type="action", 
                content="Agent A performs action X",
                agent="agent_a",
                timestamp=datetime(2025, 1, 1),
                legal_significance=0.8,
                causal_depth=1
            ),
            LegalElement(
                id="test_fact_1",
                element_type="fact",
                content="Event Y occurred",
                legal_significance=0.6,
                causal_depth=0
            ),
            LegalElement(
                id="test_norm_1", 
                element_type="norm",
                content="Rule Z prohibits action X",
                legal_significance=0.9,
                deontic_obligations=["prohibition_z"]
            )
        ]
        
        # Create test guilt hypotheses
        self.test_hypotheses = [
            GuiltHypothesis(
                id="hypothesis_1",
                agent="agent_a",
                charge="violation of rule Z",
                evidence=["test_action_1", "test_norm_1"]
            ),
            GuiltHypothesis(
                id="hypothesis_2", 
                agent="agent_b",
                charge="negligence",
                evidence=["test_fact_1"]
            )
        ]
    
    def test_initialization(self):
        """Test Legal Attention Transform initialization"""
        self.assertEqual(self.transform.model_dim, 64)
        self.assertEqual(self.transform.num_heads, 7)
        self.assertEqual(len(self.transform.legal_lenses), 7)
        
        # Check weight matrices are initialized
        for lens in self.transform.legal_lenses:
            self.assertIn(lens, self.transform.W_q)
            self.assertIn(lens, self.transform.W_k)  
            self.assertIn(lens, self.transform.W_v)
            
        # Check positional encodings
        for enc_type in PositionalEncoding:
            self.assertIn(enc_type, self.transform.pos_encodings)
    
    def test_legal_element_to_vector(self):
        """Test legal element vector conversion"""
        element = self.test_elements[0]
        vector = element.to_vector(64)
        
        self.assertEqual(vector.shape, (64,))
        self.assertGreaterEqual(np.sum(vector), 0)  # Should have some non-zero values
        self.assertEqual(vector[-1], element.legal_significance)  # Last element should be legal significance
    
    def test_guilt_hypothesis_to_query(self):
        """Test guilt hypothesis query vector conversion"""
        hypothesis = self.test_hypotheses[0]
        query_vector = hypothesis.to_query_vector(64)
        
        self.assertEqual(query_vector.shape, (64,))
        self.assertGreaterEqual(np.sum(query_vector), 0)  # Should have some non-zero values
    
    def test_positional_encoding(self):
        """Test positional encoding addition"""
        embeddings = self.transform.add_positional_encoding(self.test_elements)
        
        self.assertEqual(embeddings.shape, (len(self.test_elements), self.transform.model_dim))
        
        # Check that embeddings are different (positional encoding was added)
        base_embedding = self.test_elements[0].to_vector(self.transform.model_dim)
        self.assertFalse(np.array_equal(embeddings[0], base_embedding))
    
    def test_softmax(self):
        """Test softmax implementation"""
        x = np.array([[1, 2, 3], [4, 5, 6]])
        result = self.transform.softmax(x)
        
        # Check output shape
        self.assertEqual(result.shape, x.shape)
        
        # Check rows sum to 1
        np.testing.assert_allclose(np.sum(result, axis=1), [1.0, 1.0], atol=1e-6)
        
        # Check all values are positive
        self.assertTrue(np.all(result >= 0))
    
    def test_scaled_dot_product_attention(self):
        """Test scaled dot-product attention mechanism"""
        seq_len, d_k = 3, 8
        Q = np.random.randn(seq_len, d_k)
        K = np.random.randn(seq_len, d_k)
        V = np.random.randn(seq_len, d_k)
        
        output, weights = self.transform.scaled_dot_product_attention(Q, K, V)
        
        # Check output shapes
        self.assertEqual(output.shape, (seq_len, d_k))
        self.assertEqual(weights.shape, (seq_len, seq_len))
        
        # Check attention weights sum to 1
        np.testing.assert_allclose(np.sum(weights, axis=1), np.ones(seq_len), atol=1e-6)
        
        # Check weights are non-negative
        self.assertTrue(np.all(weights >= 0))
    
    def test_multi_head_attention(self):
        """Test multi-head attention mechanism"""
        result = self.transform.multi_head_attention(self.test_hypotheses, self.test_elements)
        
        # Check result structure
        self.assertIn('final_output', result)
        self.assertIn('head_outputs', result)
        self.assertIn('head_weights', result)
        self.assertIn('queries', result)
        self.assertIn('elements', result)
        
        # Check dimensions
        expected_queries = len(self.test_hypotheses)
        expected_elements = len(self.test_elements)
        
        self.assertEqual(result['final_output'].shape[0], expected_queries)
        self.assertEqual(len(result['head_outputs']), len(self.transform.legal_lenses))
        
        # Check all legal lenses are represented
        for lens in self.transform.legal_lenses:
            self.assertIn(lens.name, result['head_weights'])
    
    def test_cross_attention_counterfactual(self):
        """Test cross-attention for counterfactual reasoning"""
        actual_world = self.test_elements[:2]
        possible_world = self.test_elements[1:]  # Overlapping but different
        
        output, weights = self.transform.cross_attention_counterfactual(actual_world, possible_world)
        
        # Check shapes
        self.assertEqual(output.shape[0], len(actual_world))
        self.assertEqual(weights.shape, (len(actual_world), len(possible_world)))
        
        # Check attention weights are valid
        np.testing.assert_allclose(np.sum(weights, axis=1), np.ones(len(actual_world)), atol=1e-6)
    
    def test_self_attention_event_space(self):
        """Test self-attention over event space"""
        output, weights = self.transform.self_attention_event_space(self.test_elements)
        
        num_elements = len(self.test_elements)
        
        # Check shapes
        self.assertEqual(output.shape[0], num_elements)
        self.assertEqual(weights.shape, (num_elements, num_elements))
        
        # Check attention weights are valid
        for i in range(num_elements):
            np.testing.assert_allclose(np.sum(weights[i]), 1.0, atol=1e-6)


class TestLegalInferenceEngine(unittest.TestCase):
    """Test cases for Legal Inference Engine"""
    
    def setUp(self):
        """Set up test fixtures"""
        self.engine = LegalInferenceEngine(model_dim=32, num_heads=4)  # Smaller for testing
    
    def test_initialization(self):
        """Test engine initialization"""
        self.assertIsNotNone(self.engine.attention_transform)
        self.assertEqual(len(self.engine.case_elements), 0)
        self.assertEqual(len(self.engine.guilt_hypotheses), 0)
    
    def test_add_elements_and_hypotheses(self):
        """Test adding legal elements and hypotheses"""
        element = LegalElement(
            id="test_element",
            element_type="action",
            content="Test action",
            legal_significance=0.5
        )
        
        hypothesis = GuiltHypothesis(
            id="test_hypothesis",
            agent="test_agent",
            charge="test_charge"
        )
        
        self.engine.add_legal_element(element)
        self.engine.add_guilt_hypothesis(hypothesis)
        
        self.assertEqual(len(self.engine.case_elements), 1)
        self.assertEqual(len(self.engine.guilt_hypotheses), 1)
        self.assertEqual(self.engine.case_elements[0].id, "test_element")
        self.assertEqual(self.engine.guilt_hypotheses[0].id, "test_hypothesis")
    
    def test_run_inference_empty(self):
        """Test inference with no elements or hypotheses"""
        with self.assertRaises((IndexError, ValueError)):
            self.engine.run_inference()
    
    def test_run_inference_with_data(self):
        """Test inference with actual data"""
        # Add test data
        element = LegalElement(
            id="test_action",
            element_type="action",
            content="Agent performed harmful action",
            agent="test_agent",
            legal_significance=0.8
        )
        
        hypothesis = GuiltHypothesis(
            id="guilt_hypothesis", 
            agent="test_agent",
            charge="harmful action",
            evidence=["test_action"]
        )
        
        self.engine.add_legal_element(element)
        self.engine.add_guilt_hypothesis(hypothesis)
        
        result = self.engine.run_inference()
        
        # Check result structure
        self.assertIn('guilt_scores', result)
        self.assertIn('attention_analysis', result)
        self.assertIn('legal_reasoning', result)
        self.assertIn('confidence_metrics', result)
        self.assertIn('invariant_patterns', result)
        
        # Check guilt scores
        self.assertIn('guilt_hypothesis', result['guilt_scores'])
        self.assertIsInstance(result['guilt_scores']['guilt_hypothesis'], float)
        
        # Check reasoning is generated
        self.assertIsInstance(result['legal_reasoning'], list)
        self.assertGreater(len(result['legal_reasoning']), 0)


class TestBantjiesCaseExample(unittest.TestCase):
    """Test the Bantjies case example"""
    
    def setUp(self):
        """Set up Bantjies case example"""
        self.engine = create_bantjies_case_example()
    
    def test_bantjies_case_setup(self):
        """Test Bantjies case is properly set up"""
        # Should have legal elements
        self.assertGreater(len(self.engine.case_elements), 0)
        
        # Should have guilt hypotheses
        self.assertGreater(len(self.engine.guilt_hypotheses), 0)
        
        # Check for key elements
        element_ids = [elem.id for elem in self.engine.case_elements]
        self.assertIn("bantjies_trustee_appointment", element_ids)
        self.assertIn("daniel_fraud_report", element_ids)
        self.assertIn("bantjies_holiday_dismissal", element_ids)
        
        # Check for key hypotheses
        hypothesis_ids = [hyp.id for hyp in self.engine.guilt_hypotheses]
        self.assertIn("bantjies_breach_of_fiduciary_duty", hypothesis_ids)
        self.assertIn("bantjies_conspiracy_to_defraud", hypothesis_ids)
    
    def test_bantjies_inference(self):
        """Test inference on Bantjies case"""
        result = self.engine.run_inference()
        
        # Check that Bantjies-related guilt hypotheses have high scores
        guilt_scores = result['guilt_scores']
        
        bantjies_hypotheses = [
            hyp_id for hyp_id in guilt_scores.keys() 
            if 'bantjies' in hyp_id
        ]
        
        self.assertGreater(len(bantjies_hypotheses), 0)
        
        # Bantjies should have higher guilt scores than Daniel (who is victim)
        daniel_hypotheses = [
            hyp_id for hyp_id in guilt_scores.keys()
            if 'daniel' in hyp_id
        ]
        
        if bantjies_hypotheses and daniel_hypotheses:
            max_bantjies_score = max(guilt_scores[hyp] for hyp in bantjies_hypotheses)
            max_daniel_score = max(guilt_scores[hyp] for hyp in daniel_hypotheses)
            
            # Bantjies should be more "guilty" than Daniel (victim)
            self.assertGreater(max_bantjies_score, max_daniel_score)
    
    def test_attention_hotspots(self):
        """Test that attention identifies key relationships"""
        result = self.engine.run_inference()
        
        hotspots = result['attention_analysis']['attention_hotspots']
        
        # Should have hotspots for all legal lenses
        self.assertGreater(len(hotspots), 0)
        
        # Check that interpretations are generated
        for lens, hotspot in hotspots.items():
            self.assertIn('interpretation', hotspot)
            self.assertIsInstance(hotspot['interpretation'], str)
            self.assertGreater(len(hotspot['interpretation']), 0)


class TestIntegration(unittest.TestCase):
    """Integration tests"""
    
    def test_full_pipeline(self):
        """Test complete pipeline from setup to results"""
        # Create engine
        engine = LegalInferenceEngine(model_dim=32, num_heads=4)
        
        # Add case data
        elements = [
            LegalElement(
                id="action_1",
                element_type="action",
                content="Defendant struck victim",
                agent="defendant",
                legal_significance=0.9,
                causal_depth=1
            ),
            LegalElement(
                id="outcome_1", 
                element_type="outcome",
                content="Victim suffered injury",
                legal_significance=0.8,
                causal_depth=2
            ),
            LegalElement(
                id="norm_1",
                element_type="norm", 
                content="Assault is prohibited",
                legal_significance=0.95
            )
        ]
        
        hypotheses = [
            GuiltHypothesis(
                id="assault_charge",
                agent="defendant",
                charge="assault",
                evidence=["action_1", "outcome_1", "norm_1"]
            ),
            GuiltHypothesis(
                id="victim_status",
                agent="victim", 
                charge="no wrongdoing",
                evidence=["outcome_1"]
            )
        ]
        
        for element in elements:
            engine.add_legal_element(element)
            
        for hypothesis in hypotheses:
            engine.add_guilt_hypothesis(hypothesis)
        
        # Run inference
        result = engine.run_inference()
        
        # Validate results
        self.assertIn('guilt_scores', result)
        self.assertEqual(len(result['guilt_scores']), 2)
        
        # Defendant should have higher guilt score than victim
        defendant_score = result['guilt_scores']['assault_charge']
        victim_score = result['guilt_scores']['victim_status']
        
        self.assertGreater(defendant_score, victim_score)


def run_tests():
    """Run all tests"""
    print("🧪 LEGAL ATTENTION TRANSFORM TEST SUITE")
    print("=" * 50)
    
    # Create test suite
    loader = unittest.TestLoader()
    suite = unittest.TestSuite()
    
    # Add test cases
    suite.addTests(loader.loadTestsFromTestCase(TestLegalAttentionTransform))
    suite.addTests(loader.loadTestsFromTestCase(TestLegalInferenceEngine))
    suite.addTests(loader.loadTestsFromTestCase(TestBantjiesCaseExample))
    suite.addTests(loader.loadTestsFromTestCase(TestIntegration))
    
    # Run tests
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    
    # Report results
    print(f"\n📊 TEST RESULTS:")
    print(f"  Tests Run: {result.testsRun}")
    print(f"  Failures: {len(result.failures)}")
    print(f"  Errors: {len(result.errors)}")
    
    if result.failures:
        print(f"\n❌ FAILURES:")
        for test, traceback in result.failures:
            print(f"  {test}: {traceback}")
    
    if result.errors:
        print(f"\n💥 ERRORS:")
        for test, traceback in result.errors:
            print(f"  {test}: {traceback}")
    
    success = len(result.failures) == 0 and len(result.errors) == 0
    
    if success:
        print(f"\n✅ ALL TESTS PASSED!")
    else:
        print(f"\n❌ SOME TESTS FAILED!")
    
    return success


if __name__ == "__main__":
    run_tests()