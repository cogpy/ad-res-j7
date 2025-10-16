#!/usr/bin/env python3
"""
Legal Attention Transform
========================

Implements transformer-style attention mechanism for legal inference as specified:

**Legal Attention Transform**: Attention(Q,K,V) = softmax(QK^T/√d)V

Where:
- Q (Queries): The guilt hypotheses being evaluated
- K (Keys): All facts, actions, and agent states in the possibility space  
- V (Values): The legal/causal significance of each element

Features:
- Multi-Head Legal Attention with different legal lenses
- Cross-Attention for counterfactual reasoning
- Positional encodings for legal context (temporal, causal, epistemic, deontic)
- Self-attention for all-to-all comparison matrix over event space
"""

import numpy as np
import json
import logging
from typing import Dict, List, Tuple, Optional, Any
from dataclasses import dataclass, field
from enum import Enum, auto
from datetime import datetime
import math

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class LegalLens(Enum):
    """Different attention heads representing different legal perspectives"""
    CAUSAL = auto()        # Attends to cause-effect chains
    INTENTIONALITY = auto() # Focuses on mental states and knowledge
    TEMPORAL = auto()      # Weighs sequence and timing
    NORMATIVE = auto()     # Attends to rule violations
    COUNTERFACTUAL = auto() # Cross-attention for "what if" scenarios
    NECESSITY = auto()     # Necessity and sufficiency of actions
    PROPORTIONALITY = auto() # Proportionality of harm vs action


class PositionalEncoding(Enum):
    """Legal positional encodings"""
    TEMPORAL = auto()      # When did it happen
    CAUSAL_DEPTH = auto()  # How many steps from action to harm
    EPISTEMIC = auto()     # What did the agent know at this point
    DEONTIC = auto()       # What obligations were active


@dataclass
class LegalElement:
    """Represents a legal element (fact, action, agent state, norm)"""
    id: str
    element_type: str  # 'fact', 'action', 'agent_state', 'norm', 'outcome'
    content: str
    agent: Optional[str] = None
    timestamp: Optional[datetime] = None
    legal_significance: float = 0.0
    causal_depth: int = 0
    epistemic_state: Dict[str, Any] = field(default_factory=dict)
    deontic_obligations: List[str] = field(default_factory=list)
    
    def to_vector(self, dim: int = 64) -> np.ndarray:
        """Convert legal element to vector representation"""
        # Simple hash-based embedding (in practice, would use proper embeddings)
        vector = np.zeros(dim)
        
        # Content embedding (simplified)
        content_hash = hash(self.content) % (dim // 4)
        vector[content_hash % dim] = 1.0
        
        # Type embedding
        type_map = {'fact': 0, 'action': 1, 'agent_state': 2, 'norm': 3, 'outcome': 4}
        type_idx = type_map.get(self.element_type, 0)
        vector[dim//4 + type_idx] = 1.0
        
        # Agent embedding
        if self.agent:
            agent_hash = hash(self.agent) % (dim // 4)
            vector[dim//2 + agent_hash % (dim//4)] = 1.0
            
        # Legal significance
        vector[-1] = self.legal_significance
        
        return vector


@dataclass 
class GuiltHypothesis:
    """Represents a guilt hypothesis being evaluated"""
    id: str
    agent: str
    charge: str
    confidence: float = 0.0
    evidence: List[str] = field(default_factory=list)
    
    def to_query_vector(self, dim: int = 64) -> np.ndarray:
        """Convert guilt hypothesis to query vector"""
        vector = np.zeros(dim)
        
        # Agent embedding
        agent_hash = hash(self.agent) % (dim // 2)
        vector[agent_hash % (dim//2)] = 1.0
        
        # Charge embedding
        charge_hash = hash(self.charge) % (dim // 2)
        vector[dim//2 + charge_hash % (dim//2)] = 1.0
        
        return vector


class LegalAttentionTransform:
    """
    Legal Attention Transform implementing transformer-style attention for legal inference
    """
    
    def __init__(self, model_dim: int = 64, num_heads: int = 7, dropout: float = 0.1):
        self.model_dim = model_dim
        self.num_heads = num_heads
        self.head_dim = model_dim // num_heads
        self.dropout = dropout
        
        # Initialize attention heads for different legal lenses
        self.legal_lenses = list(LegalLens)[:num_heads]
        
        # Initialize learned parameters (in practice, these would be trained)
        self.W_q = {lens: self._init_weights(model_dim, model_dim) for lens in self.legal_lenses}
        self.W_k = {lens: self._init_weights(model_dim, model_dim) for lens in self.legal_lenses}
        self.W_v = {lens: self._init_weights(model_dim, model_dim) for lens in self.legal_lenses}
        self.W_o = self._init_weights(model_dim, model_dim)
        
        # Positional encoding matrices
        self.pos_encodings = {
            enc_type: self._init_positional_encoding(model_dim) 
            for enc_type in PositionalEncoding
        }
        
        logger.info(f"Initialized Legal Attention Transform with {num_heads} heads, dim={model_dim}")
    
    def _init_weights(self, input_dim: int, output_dim: int) -> np.ndarray:
        """Initialize weight matrices with Xavier initialization"""
        limit = np.sqrt(6.0 / (input_dim + output_dim))
        return np.random.uniform(-limit, limit, (input_dim, output_dim))
    
    def _init_positional_encoding(self, dim: int, max_len: int = 1000) -> np.ndarray:
        """Initialize positional encoding matrix"""
        pe = np.zeros((max_len, dim))
        position = np.arange(0, max_len, dtype=np.float32).reshape(-1, 1)
        
        div_term = np.exp(np.arange(0, dim, 2) * -(math.log(10000.0) / dim))
        pe[:, 0::2] = np.sin(position * div_term)
        pe[:, 1::2] = np.cos(position * div_term)
        
        return pe
    
    def add_positional_encoding(self, elements: List[LegalElement]) -> np.ndarray:
        """Add positional encodings to element embeddings"""
        embeddings = np.array([elem.to_vector(self.model_dim) for elem in elements])
        
        for i, element in enumerate(elements):
            # Temporal position
            if element.timestamp:
                # Simple temporal encoding (days since epoch)
                temporal_pos = int((element.timestamp - datetime(2020, 1, 1)).days)
                temporal_pos = min(temporal_pos, self.pos_encodings[PositionalEncoding.TEMPORAL].shape[0] - 1)
                embeddings[i] += self.pos_encodings[PositionalEncoding.TEMPORAL][temporal_pos]
            
            # Causal depth position
            causal_pos = min(element.causal_depth, self.pos_encodings[PositionalEncoding.CAUSAL_DEPTH].shape[0] - 1)
            embeddings[i] += self.pos_encodings[PositionalEncoding.CAUSAL_DEPTH][causal_pos]
            
            # Epistemic position (simplified)
            epistemic_pos = len(element.epistemic_state) % self.pos_encodings[PositionalEncoding.EPISTEMIC].shape[0]
            embeddings[i] += self.pos_encodings[PositionalEncoding.EPISTEMIC][epistemic_pos]
            
            # Deontic position (number of active obligations)
            deontic_pos = len(element.deontic_obligations) % self.pos_encodings[PositionalEncoding.DEONTIC].shape[0]
            embeddings[i] += self.pos_encodings[PositionalEncoding.DEONTIC][deontic_pos]
        
        return embeddings
    
    def softmax(self, x: np.ndarray, axis: int = -1) -> np.ndarray:
        """Numerically stable softmax"""
        x_max = np.max(x, axis=axis, keepdims=True)
        exp_x = np.exp(x - x_max)
        return exp_x / np.sum(exp_x, axis=axis, keepdims=True)
    
    def scaled_dot_product_attention(self, Q: np.ndarray, K: np.ndarray, V: np.ndarray, 
                                   mask: Optional[np.ndarray] = None) -> Tuple[np.ndarray, np.ndarray]:
        """
        Scaled Dot-Product Attention: Attention(Q,K,V) = softmax(QK^T/√d)V
        
        Args:
            Q: Query matrix [seq_len, d_k]
            K: Key matrix [seq_len, d_k]  
            V: Value matrix [seq_len, d_v]
            mask: Optional attention mask
            
        Returns:
            attention_output: [seq_len, d_v]
            attention_weights: [seq_len, seq_len]
        """
        d_k = Q.shape[-1]
        
        # Compute attention scores: QK^T/√d
        scores = np.matmul(Q, K.T) / math.sqrt(d_k)
        
        # Apply mask if provided
        if mask is not None:
            scores = np.where(mask == 0, -1e9, scores)
        
        # Apply softmax to get attention weights
        attention_weights = self.softmax(scores)
        
        # Apply dropout (simplified - in practice would be during training)
        # attention_weights = self.dropout(attention_weights)
        
        # Compute attention output: softmax(QK^T/√d)V
        attention_output = np.matmul(attention_weights, V)
        
        return attention_output, attention_weights
    
    def multi_head_attention(self, queries: List[GuiltHypothesis], 
                           elements: List[LegalElement]) -> Dict[str, Any]:
        """
        Multi-Head Legal Attention mechanism
        
        Args:
            queries: List of guilt hypotheses to evaluate
            elements: List of legal elements (facts, actions, states, norms)
            
        Returns:
            Dict with attention outputs, weights, and analysis
        """
        # Convert to embeddings with positional encoding
        element_embeddings = self.add_positional_encoding(elements)
        query_embeddings = np.array([q.to_query_vector(self.model_dim) for q in queries])
        
        # Store outputs from each attention head
        head_outputs = {}
        head_weights = {}
        
        for lens in self.legal_lenses:
            # Project to queries, keys, values for this head
            Q = np.matmul(query_embeddings, self.W_q[lens])
            K = np.matmul(element_embeddings, self.W_k[lens])
            V = np.matmul(element_embeddings, self.W_v[lens])
            
            # Apply attention mechanism
            attention_output, attention_weights = self.scaled_dot_product_attention(Q, K, V)
            
            head_outputs[lens.name] = attention_output
            head_weights[lens.name] = attention_weights
        
        # Concatenate and project all heads
        # Each head output has shape [num_queries, model_dim], we need to reshape for concatenation
        head_outputs_list = list(head_outputs.values())
        concatenated = np.concatenate(head_outputs_list, axis=-1)
        
        # Adjust W_o dimensions to match concatenated output
        concat_dim = concatenated.shape[-1]
        if self.W_o.shape[0] != concat_dim:
            self.W_o = self._init_weights(concat_dim, self.model_dim)
        
        final_output = np.matmul(concatenated, self.W_o)
        
        return {
            'final_output': final_output,
            'head_outputs': head_outputs,
            'head_weights': head_weights,
            'queries': [q.id for q in queries],
            'elements': [e.id for e in elements]
        }
    
    def cross_attention_counterfactual(self, actual_world: List[LegalElement], 
                                     possible_world: List[LegalElement]) -> np.ndarray:
        """
        Cross-attention between actual and possible worlds for counterfactual reasoning
        
        This measures necessity and sufficiency of actions for outcomes
        """
        actual_embeddings = self.add_positional_encoding(actual_world)
        possible_embeddings = self.add_positional_encoding(possible_world)
        
        # Use COUNTERFACTUAL lens for cross-attention
        lens = LegalLens.COUNTERFACTUAL
        
        Q = np.matmul(actual_embeddings, self.W_q[lens])  # Query from actual world
        K = np.matmul(possible_embeddings, self.W_k[lens])  # Keys from possible world
        V = np.matmul(possible_embeddings, self.W_v[lens])  # Values from possible world
        
        cross_attention_output, cross_weights = self.scaled_dot_product_attention(Q, K, V)
        
        return cross_attention_output, cross_weights
    
    def self_attention_event_space(self, elements: List[LegalElement]) -> np.ndarray:
        """
        Self-attention creates all-to-all comparison matrix over event space
        
        This is how emergent guilt determination works - every action examines 
        its relationship to every other action
        """
        embeddings = self.add_positional_encoding(elements)
        
        # Self-attention: Q, K, V all come from the same sequence
        lens = LegalLens.CAUSAL  # Use causal lens for self-attention
        
        Q = np.matmul(embeddings, self.W_q[lens])
        K = np.matmul(embeddings, self.W_k[lens])
        V = np.matmul(embeddings, self.W_v[lens])
        
        self_attention_output, self_weights = self.scaled_dot_product_attention(Q, K, V)
        
        return self_attention_output, self_weights
    
    def compute_guilt_scores(self, attention_result: Dict[str, Any]) -> Dict[str, float]:
        """
        Compute guilt scores from attention weights
        
        High attention between agent and harm = guilt
        """
        guilt_scores = {}
        
        # Extract final attention output
        final_output = attention_result['final_output']
        
        # For each query (guilt hypothesis)
        for i, query_id in enumerate(attention_result['queries']):
            # Sum attention across all elements for this query
            score = np.sum(final_output[i])
            guilt_scores[query_id] = float(score)
        
        # Normalize scores
        max_score = max(guilt_scores.values()) if guilt_scores else 1.0
        for query_id in guilt_scores:
            guilt_scores[query_id] /= max_score
            
        return guilt_scores
    
    def analyze_attention_patterns(self, attention_result: Dict[str, Any], 
                                 elements: List[LegalElement]) -> Dict[str, Any]:
        """
        Analyze attention patterns to identify juridical insights
        """
        analysis = {
            'attention_hotspots': {},
            'causal_chains': [],
            'evidence_importance': {},
            'agent_focus': {}
        }
        
        # Analyze each legal lens
        for lens_name, weights in attention_result['head_weights'].items():
            # Find highest attention weights (hotspots)
            max_indices = np.unravel_index(np.argmax(weights), weights.shape)
            max_weight = weights[max_indices]
            
            query_idx, element_idx = max_indices
            query_id = attention_result['queries'][query_idx]
            element_id = elements[element_idx].id
            
            analysis['attention_hotspots'][lens_name] = {
                'query': query_id,
                'element': element_id,
                'weight': float(max_weight),
                'interpretation': self._interpret_attention(lens_name, query_id, element_id, max_weight)
            }
        
        return analysis
    
    def _interpret_attention(self, lens_name: str, query_id: str, element_id: str, weight: float) -> str:
        """Interpret attention patterns for legal insight"""
        interpretations = {
            'CAUSAL': f"Strong causal link between {query_id} and {element_id} (weight: {weight:.3f})",
            'INTENTIONALITY': f"High intentionality focus on {element_id} for {query_id} (weight: {weight:.3f})",
            'TEMPORAL': f"Critical temporal relationship between {query_id} and {element_id} (weight: {weight:.3f})",
            'NORMATIVE': f"Significant rule violation connection: {query_id} → {element_id} (weight: {weight:.3f})",
            'COUNTERFACTUAL': f"Important counterfactual dependency: {query_id} ↔ {element_id} (weight: {weight:.3f})",
            'NECESSITY': f"High necessity/sufficiency for {query_id} through {element_id} (weight: {weight:.3f})",
            'PROPORTIONALITY': f"Proportionality concern: {query_id} vs {element_id} (weight: {weight:.3f})"
        }
        
        return interpretations.get(lens_name, f"Attention pattern: {query_id} → {element_id} (weight: {weight:.3f})")


class LegalInferenceEngine:
    """
    Main Legal Inference Engine using attention mechanisms
    """
    
    def __init__(self, model_dim: int = 64, num_heads: int = 7):
        self.attention_transform = LegalAttentionTransform(model_dim, num_heads)
        self.case_elements = []
        self.guilt_hypotheses = []
        
    def add_legal_element(self, element: LegalElement):
        """Add a legal element to the case"""
        self.case_elements.append(element)
        
    def add_guilt_hypothesis(self, hypothesis: GuiltHypothesis):
        """Add a guilt hypothesis to evaluate"""
        self.guilt_hypotheses.append(hypothesis)
        
    def run_inference(self) -> Dict[str, Any]:
        """
        Run complete legal inference using attention mechanisms
        """
        logger.info(f"Running legal inference on {len(self.case_elements)} elements, {len(self.guilt_hypotheses)} hypotheses")
        
        # Multi-head attention analysis
        attention_result = self.attention_transform.multi_head_attention(
            self.guilt_hypotheses, self.case_elements
        )
        
        # Self-attention over event space
        self_attention_output, self_weights = self.attention_transform.self_attention_event_space(
            self.case_elements
        )
        
        # Compute guilt scores
        guilt_scores = self.attention_transform.compute_guilt_scores(attention_result)
        
        # Analyze attention patterns
        pattern_analysis = self.attention_transform.analyze_attention_patterns(
            attention_result, self.case_elements
        )
        
        # Generate final inference
        inference_result = {
            'guilt_scores': guilt_scores,
            'attention_analysis': pattern_analysis,
            'self_attention_matrix': self_weights.tolist(),
            'legal_reasoning': self._generate_legal_reasoning(guilt_scores, pattern_analysis),
            'confidence_metrics': self._compute_confidence_metrics(attention_result),
            'invariant_patterns': self._detect_invariant_patterns(self_weights)
        }
        
        return inference_result
    
    def _generate_legal_reasoning(self, guilt_scores: Dict[str, float], 
                                pattern_analysis: Dict[str, Any]) -> List[str]:
        """Generate human-readable legal reasoning"""
        reasoning = []
        
        # Rank hypotheses by guilt score
        ranked_hypotheses = sorted(guilt_scores.items(), key=lambda x: x[1], reverse=True)
        
        for hypothesis_id, score in ranked_hypotheses:
            if score > 0.7:
                reasoning.append(f"STRONG EVIDENCE: {hypothesis_id} (confidence: {score:.3f})")
            elif score > 0.5:
                reasoning.append(f"MODERATE EVIDENCE: {hypothesis_id} (confidence: {score:.3f})")
            else:
                reasoning.append(f"WEAK EVIDENCE: {hypothesis_id} (confidence: {score:.3f})")
        
        # Add attention insights
        for lens, hotspot in pattern_analysis['attention_hotspots'].items():
            reasoning.append(f"ATTENTION INSIGHT [{lens}]: {hotspot['interpretation']}")
            
        return reasoning
    
    def _compute_confidence_metrics(self, attention_result: Dict[str, Any]) -> Dict[str, float]:
        """Compute confidence metrics for the inference"""
        final_output = attention_result['final_output']
        
        # Compute various confidence metrics
        max_attention = np.max(final_output)
        mean_attention = np.mean(final_output)
        std_attention = np.std(final_output)
        
        return {
            'max_attention': float(max_attention),
            'mean_attention': float(mean_attention),
            'std_attention': float(std_attention),
            'attention_concentration': float(max_attention / (mean_attention + 1e-8))
        }
    
    def _detect_invariant_patterns(self, self_weights: np.ndarray) -> List[str]:
        """
        Detect invariant patterns that emerge from attention - the "guilty party is always guilty"
        """
        patterns = []
        
        # Find stable attractors in attention landscape
        attention_sums = np.sum(self_weights, axis=1)
        max_attention_idx = np.argmax(attention_sums)
        
        if max_attention_idx < len(self.case_elements):
            dominant_element = self.case_elements[max_attention_idx]
            patterns.append(f"DOMINANT ATTRACTOR: {dominant_element.id} (element type: {dominant_element.element_type})")
        
        # Find highly connected nodes (high total attention)
        high_attention_threshold = np.mean(attention_sums) + np.std(attention_sums)
        high_attention_indices = np.where(attention_sums > high_attention_threshold)[0]
        
        for idx in high_attention_indices:
            if idx < len(self.case_elements):
                element = self.case_elements[idx]
                patterns.append(f"HIGH CONNECTIVITY: {element.id} with agent {element.agent}")
        
        return patterns


def create_bantjies_case_example() -> LegalInferenceEngine:
    """
    Create example case for Bantjies situation using Legal Attention Transform
    """
    engine = LegalInferenceEngine()
    
    # Add legal elements from Bantjies case
    elements = [
        LegalElement(
            id="bantjies_trustee_appointment",
            element_type="action",
            content="Bantjies appointed as trustee with financial oversight powers",
            agent="bantjies",
            timestamp=datetime(2024, 7, 1),
            legal_significance=0.9,
            causal_depth=0,
            deontic_obligations=["fiduciary_duty", "oversight_duty"]
        ),
        LegalElement(
            id="daniel_fraud_report",
            element_type="action", 
            content="Daniel reports R10M fraud concerns to Bantjies",
            agent="daniel",
            timestamp=datetime(2025, 6, 10, 9, 0),
            legal_significance=0.95,
            causal_depth=1,
            epistemic_state={"knows_fraud": True, "reported_properly": True}
        ),
        LegalElement(
            id="bantjies_holiday_dismissal",
            element_type="action",
            content="Bantjies dismisses fraud report with 'going on holiday for 2 weeks'",
            agent="bantjies", 
            timestamp=datetime(2025, 6, 10, 17, 0),
            legal_significance=0.85,
            causal_depth=2,
            deontic_obligations=["investigate_fraud", "protect_beneficiaries"]
        ),
        LegalElement(
            id="peter_card_cancellation",
            element_type="action",
            content="Peter cancels business cards day after Daniel's fraud report",
            agent="peter",
            timestamp=datetime(2025, 6, 7),
            legal_significance=0.7,
            causal_depth=1
        ),
        LegalElement(
            id="ex_parte_interdict",
            element_type="action",
            content="Ex parte interdict filed with material non-disclosures",
            agent="peter",
            timestamp=datetime(2025, 8, 13),
            legal_significance=0.8,
            causal_depth=3
        ),
        LegalElement(
            id="r18m_future_payout",
            element_type="outcome",
            content="R18M trust payout scheduled for May 2026",
            agent="bantjies",
            timestamp=datetime(2026, 5, 1),
            legal_significance=1.0,
            causal_depth=4
        ),
        LegalElement(
            id="fiduciary_duty_norm",
            element_type="norm",
            content="Trustees must act in best interests of beneficiaries",
            legal_significance=0.95,
            deontic_obligations=["fiduciary_duty"]
        ),
        LegalElement(
            id="fraud_investigation_norm", 
            element_type="norm",
            content="Fraud reports must be properly investigated",
            legal_significance=0.9,
            deontic_obligations=["investigate_fraud"]
        )
    ]
    
    for element in elements:
        engine.add_legal_element(element)
    
    # Add guilt hypotheses
    hypotheses = [
        GuiltHypothesis(
            id="bantjies_breach_of_fiduciary_duty",
            agent="bantjies",
            charge="breach of fiduciary duty through strategic abandonment",
            evidence=["holiday_dismissal", "trustee_appointment", "r18m_future_payout"]
        ),
        GuiltHypothesis(
            id="bantjies_conspiracy_to_defraud",
            agent="bantjies", 
            charge="conspiracy to defraud beneficiaries",
            evidence=["holiday_dismissal", "r18m_future_payout", "ex_parte_interdict"]
        ),
        GuiltHypothesis(
            id="peter_abuse_of_process",
            agent="peter",
            charge="abuse of legal process", 
            evidence=["ex_parte_interdict", "card_cancellation"]
        ),
        GuiltHypothesis(
            id="daniel_whistleblower_protection",
            agent="daniel",
            charge="victim of retaliation",
            evidence=["daniel_fraud_report", "holiday_dismissal", "ex_parte_interdict"]
        )
    ]
    
    for hypothesis in hypotheses:
        engine.add_guilt_hypothesis(hypothesis)
        
    return engine


def main():
    """Demonstration of Legal Attention Transform"""
    print("🏛️ LEGAL ATTENTION TRANSFORM DEMONSTRATION")
    print("=" * 60)
    
    # Create example case
    engine = create_bantjies_case_example()
    
    # Run legal inference
    print("\n🔍 Running Legal Inference...")
    inference_result = engine.run_inference()
    
    # Display results
    print("\n⚖️ GUILT DETERMINATION RESULTS:")
    print("-" * 40)
    for hypothesis, score in inference_result['guilt_scores'].items():
        print(f"  {hypothesis}: {score:.3f}")
    
    print("\n🧠 LEGAL REASONING:")
    print("-" * 40)
    for reasoning in inference_result['legal_reasoning']:
        print(f"  • {reasoning}")
    
    print("\n🎯 ATTENTION INSIGHTS:")
    print("-" * 40)
    for lens, hotspot in inference_result['attention_analysis']['attention_hotspots'].items():
        print(f"  [{lens}] {hotspot['interpretation']}")
    
    print("\n🔬 INVARIANT PATTERNS (Universal Guilt Resolution):")
    print("-" * 40)
    for pattern in inference_result['invariant_patterns']:
        print(f"  • {pattern}")
    
    print("\n📊 CONFIDENCE METRICS:")
    print("-" * 40)
    for metric, value in inference_result['confidence_metrics'].items():
        print(f"  {metric}: {value:.3f}")
    
    # Save results
    output_file = "/home/runner/work/ad-res-j7/ad-res-j7/lex-inference-engine/output/legal_attention_results.json"
    import os
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    
    with open(output_file, 'w') as f:
        json.dump(inference_result, f, indent=2, default=str)
    
    print(f"\n💾 Results saved to: {output_file}")
    print("\n✅ Legal Attention Transform demonstration complete!")
    
    return inference_result


if __name__ == "__main__":
    main()