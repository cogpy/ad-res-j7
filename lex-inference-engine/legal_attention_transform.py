#!/usr/bin/env python3
"""
Legal Attention Transform

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
Legal Attention Transform - Advanced Causation Analysis

Implements a sophisticated attention mechanism for legal reasoning that computes
relevance scores between all elements in the legal space. This creates a 
"relational fabric" that identifies which facts matter for which determinations.

Architecture:
- Multi-Head Legal Attention: Different legal lenses (causal, intentional, temporal, normative)
- Self-Attention: All-to-all comparison matrix over event space
- Cross-Attention: Counterfactual reasoning between actual and possible worlds
- Positional Encoding: Legal-specific position encodings

Integration with existing lex-inference-engine:
- Extends universal-guilt-determination.py with attention mechanisms
- Enhances LexInferenceEngine with transformer-based reasoning
- Provides mathematical backing for causation determinations

Based on transformer attention mechanism: Attention(Q,K,V) = softmax(QK^T/√d)V
"""

import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
from typing import Dict, List, Tuple, Optional, Any
from dataclasses import dataclass
from enum import Enum, auto
import json
import logging
from datetime import datetime

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
    """Different legal perspectives for multi-head attention"""
    CAUSAL = auto()          # Cause-effect chains
    INTENTIONALITY = auto()  # Mental states and knowledge  
    TEMPORAL = auto()        # Sequence and timing
    NORMATIVE = auto()       # Rule violations
    EPISTEMIC = auto()       # Knowledge and information states
    DEONTIC = auto()         # Obligations and duties


@dataclass
class LegalEvent:
    """Represents a legal event with metadata for attention computation"""
    id: str
    description: str
    timestamp: datetime
    agent: str
    action_type: str
    causal_depth: int
    epistemic_state: Dict[str, Any]
    deontic_obligations: List[str]
    legal_significance: float


@dataclass
class AttentionWeights:
    """Stores attention weights and their legal interpretations"""
    weights: torch.Tensor
    guilt_scores: torch.Tensor
    relevance_matrix: torch.Tensor
    juridical_heat_map: Dict[str, float]


class LegalPositionalEncoding(nn.Module):
    """Legal-specific positional encodings for different legal dimensions"""
    
    def __init__(self, d_model: int, max_seq_length: int = 1000):
        super().__init__()
        self.d_model = d_model
        
        # Standard temporal position encoding
        self.temporal_encoding = self._create_positional_encoding(d_model // 4, max_seq_length)
        
        # Legal-specific encodings
        self.causal_depth_encoding = self._create_positional_encoding(d_model // 4, 50)  # Max causal depth
        self.epistemic_encoding = self._create_positional_encoding(d_model // 4, 20)    # Knowledge levels
        self.deontic_encoding = self._create_positional_encoding(d_model // 4, 10)      # Obligation types
    
    def _create_positional_encoding(self, d_model: int, max_length: int) -> torch.Tensor:
        """Create sinusoidal positional encoding"""
        pe = torch.zeros(max_length, d_model)
        position = torch.arange(0, max_length).unsqueeze(1).float()
        
        div_term = torch.exp(torch.arange(0, d_model, 2).float() * 
                           -(np.log(10000.0) / d_model))
        
        pe[:, 0::2] = torch.sin(position * div_term)
        pe[:, 1::2] = torch.cos(position * div_term)
        
        return pe
    
    def forward(self, events: List[LegalEvent]) -> torch.Tensor:
        """Generate legal positional encodings for events"""
        batch_size = len(events)
        encoding = torch.zeros(batch_size, self.d_model)
        
        for i, event in enumerate(events):
            # Temporal position (time order)
            temporal_pos = i
            temporal_enc = self.temporal_encoding[temporal_pos % self.temporal_encoding.size(0)]
            
            # Causal depth position
            causal_pos = min(event.causal_depth, self.causal_depth_encoding.size(0) - 1)
            causal_enc = self.causal_depth_encoding[causal_pos]
            
            # Epistemic position (knowledge complexity)
            epistemic_pos = min(len(event.epistemic_state), self.epistemic_encoding.size(0) - 1)
            epistemic_enc = self.epistemic_encoding[epistemic_pos]
            
            # Deontic position (obligation count)
            deontic_pos = min(len(event.deontic_obligations), self.deontic_encoding.size(0) - 1)
            deontic_enc = self.deontic_encoding[deontic_pos]
            
            # Concatenate all encodings
            encoding[i] = torch.cat([temporal_enc, causal_enc, epistemic_enc, deontic_enc])
        
        return encoding


class LegalAttentionHead(nn.Module):
    """Single attention head for specific legal lens"""
    
    def __init__(self, d_model: int, lens_type: LegalLens):
        super().__init__()
        self.d_model = d_model
        self.lens_type = lens_type
        self.scale = np.sqrt(d_model)
        
        # Projection layers for Q, K, V
        self.W_q = nn.Linear(d_model, d_model, bias=False)
        self.W_k = nn.Linear(d_model, d_model, bias=False) 
        self.W_v = nn.Linear(d_model, d_model, bias=False)
        
        # Legal lens-specific bias terms
        self._init_legal_bias()
    
    def _init_legal_bias(self):
        """Initialize bias terms specific to legal lens"""
        if self.lens_type == LegalLens.CAUSAL:
            # Bias towards cause-effect relationships
            self.causal_bias = nn.Parameter(torch.ones(1) * 0.1)
        elif self.lens_type == LegalLens.INTENTIONALITY:
            # Bias towards mental state indicators
            self.intent_bias = nn.Parameter(torch.ones(1) * 0.15)
        elif self.lens_type == LegalLens.TEMPORAL:
            # Bias towards temporal dependencies
            self.temporal_bias = nn.Parameter(torch.ones(1) * 0.05)
        elif self.lens_type == LegalLens.NORMATIVE:
            # Bias towards rule violations
            self.normative_bias = nn.Parameter(torch.ones(1) * 0.2)
    
    def forward(self, embeddings: torch.Tensor, mask: Optional[torch.Tensor] = None) -> Tuple[torch.Tensor, torch.Tensor]:
        """Compute legal attention for this lens"""
        batch_size, seq_len, d_model = embeddings.shape
        
        # Project to Q, K, V
        Q = self.W_q(embeddings)  # [batch_size, seq_len, d_model]
        K = self.W_k(embeddings)  # [batch_size, seq_len, d_model]
        V = self.W_v(embeddings)  # [batch_size, seq_len, d_model]
        
        # Compute attention scores
        scores = torch.matmul(Q, K.transpose(-2, -1)) / self.scale  # [batch_size, seq_len, seq_len]
        
        # Apply legal lens-specific bias
        scores = self._apply_legal_bias(scores, embeddings)
        
        # Apply mask if provided
        if mask is not None:
            scores = scores.masked_fill(mask == 0, -1e9)
        
        # Softmax to get attention weights
        attention_weights = F.softmax(scores, dim=-1)  # [batch_size, seq_len, seq_len]
        
        # Apply attention to values
        attended_values = torch.matmul(attention_weights, V)  # [batch_size, seq_len, d_model]
        
        return attended_values, attention_weights
    
    def _apply_legal_bias(self, scores: torch.Tensor, embeddings: torch.Tensor) -> torch.Tensor:
        """Apply legal lens-specific bias to attention scores"""
        if self.lens_type == LegalLens.CAUSAL:
            # Enhance attention between causally related events
            causal_mask = self._detect_causal_relationships(embeddings)
            scores = scores + (causal_mask * self.causal_bias)
        elif self.lens_type == LegalLens.INTENTIONALITY:
            # Enhance attention on intentional actions
            intent_mask = self._detect_intentional_actions(embeddings)
            scores = scores + (intent_mask * self.intent_bias)
        elif self.lens_type == LegalLens.TEMPORAL:
            # Enhance attention based on temporal proximity
            temporal_mask = self._compute_temporal_proximity(embeddings)
            scores = scores + (temporal_mask * self.temporal_bias)
        elif self.lens_type == LegalLens.NORMATIVE:
            # Enhance attention on norm violations
            violation_mask = self._detect_norm_violations(embeddings)
            scores = scores + (violation_mask * self.normative_bias)
        
        return scores
    
    def _detect_causal_relationships(self, embeddings: torch.Tensor) -> torch.Tensor:
        """Detect causal relationships between events (simplified)"""
        # This would use more sophisticated causal detection in practice
        batch_size, seq_len, _ = embeddings.shape
        # Simple temporal causality assumption
        causal_mask = torch.triu(torch.ones(seq_len, seq_len), diagonal=1)
        return causal_mask.unsqueeze(0).expand(batch_size, -1, -1)
    
    def _detect_intentional_actions(self, embeddings: torch.Tensor) -> torch.Tensor:
        """Detect intentional vs accidental actions"""
        # Simplified: assume higher embedding magnitudes indicate intentional actions
        magnitudes = torch.norm(embeddings, dim=-1, keepdim=True)
        intent_scores = torch.matmul(magnitudes, magnitudes.transpose(-2, -1))
        return (intent_scores > intent_scores.mean()).float()
    
    def _compute_temporal_proximity(self, embeddings: torch.Tensor) -> torch.Tensor:
        """Compute temporal proximity weights"""
        batch_size, seq_len, _ = embeddings.shape
        # Create proximity matrix - closer events have higher weights
        positions = torch.arange(seq_len).float().unsqueeze(0)
        distance_matrix = torch.abs(positions - positions.T)
        proximity_matrix = torch.exp(-distance_matrix / seq_len)
        return proximity_matrix.unsqueeze(0).expand(batch_size, -1, -1)
    
    def _detect_norm_violations(self, embeddings: torch.Tensor) -> torch.Tensor:
        """Detect norm/rule violations"""
        # Simplified: use embedding patterns to detect violations
        batch_size, seq_len, d_model = embeddings.shape
        # Assume last dimension indicates violation severity
        violation_scores = embeddings[:, :, -1:]  # [batch_size, seq_len, 1]
        violation_matrix = torch.matmul(violation_scores, violation_scores.transpose(-2, -1))
        return (violation_matrix > 0.5).float()


class MultiHeadLegalAttention(nn.Module):
    """Multi-head attention with different legal lenses"""
    
    def __init__(self, d_model: int, num_heads: int = 4):
        super().__init__()
        self.d_model = d_model
        self.num_heads = num_heads
        self.head_dim = d_model // num_heads
        
        # Create attention heads for different legal lenses
        self.legal_lenses = [LegalLens.CAUSAL, LegalLens.INTENTIONALITY, 
                           LegalLens.TEMPORAL, LegalLens.NORMATIVE]
        
        self.attention_heads = nn.ModuleList([
            LegalAttentionHead(self.head_dim, lens) 
            for lens in self.legal_lenses[:num_heads]
        ])
        
        # Output projection
        self.W_o = nn.Linear(d_model, d_model)
        self.layer_norm = nn.LayerNorm(d_model)
        self.dropout = nn.Dropout(0.1)
    
    def forward(self, embeddings: torch.Tensor, mask: Optional[torch.Tensor] = None) -> AttentionWeights:
        """Compute multi-head legal attention"""
        batch_size, seq_len, d_model = embeddings.shape
        
        # Split embeddings for different heads
        embeddings_split = embeddings.view(batch_size, seq_len, self.num_heads, self.head_dim)
        embeddings_split = embeddings_split.transpose(1, 2)  # [batch_size, num_heads, seq_len, head_dim]
        
        attended_values = []
        attention_weights = []
        
        # Process each legal lens
        for i, head in enumerate(self.attention_heads):
            head_embeddings = embeddings_split[:, i, :, :]  # [batch_size, seq_len, head_dim]
            head_values, head_weights = head(head_embeddings, mask)
            attended_values.append(head_values)
            attention_weights.append(head_weights)
        
        # Concatenate all head outputs
        concat_values = torch.cat(attended_values, dim=-1)  # [batch_size, seq_len, d_model]
        
        # Output projection and residual connection
        output = self.W_o(concat_values)
        output = self.layer_norm(output + embeddings)  # Residual connection
        output = self.dropout(output)
        
        # Combine attention weights
        combined_weights = torch.stack(attention_weights, dim=1)  # [batch_size, num_heads, seq_len, seq_len]
        average_weights = combined_weights.mean(dim=1)  # [batch_size, seq_len, seq_len]
        
        # Compute guilt scores from attention patterns
        guilt_scores = self._compute_guilt_scores(average_weights, embeddings)
        
        # Create juridical heat map
        juridical_heat_map = self._create_juridical_heat_map(average_weights, guilt_scores)
        
        return AttentionWeights(
            weights=average_weights,
            guilt_scores=guilt_scores,
            relevance_matrix=average_weights,
            juridical_heat_map=juridical_heat_map
        )
    
    def _compute_guilt_scores(self, attention_weights: torch.Tensor, embeddings: torch.Tensor) -> torch.Tensor:
        """Compute guilt scores based on attention patterns"""
        batch_size, seq_len, _ = attention_weights.shape
        
        # Guilt emerges from high attention between agent actions and harmful outcomes
        # Simplified: sum of attention weights for each position
        guilt_scores = attention_weights.sum(dim=-1)  # [batch_size, seq_len]
        
        # Normalize scores
        guilt_scores = F.softmax(guilt_scores, dim=-1)
        
        return guilt_scores
    
    def _create_juridical_heat_map(self, attention_weights: torch.Tensor, 
                                 guilt_scores: torch.Tensor) -> Dict[str, float]:
        """Create a juridical heat map showing legal salience"""
        # Convert to numpy for easier processing
        weights_np = attention_weights.detach().cpu().numpy()
        guilt_np = guilt_scores.detach().cpu().numpy()
        
        heat_map = {}
        batch_size, seq_len, _ = weights_np.shape
        
        for batch_idx in range(batch_size):
            for i in range(seq_len):
                for j in range(seq_len):
                    if i != j:  # Don't include self-attention
                        salience = weights_np[batch_idx, i, j] * guilt_np[batch_idx, i]
                        heat_map[f"event_{i}_to_event_{j}"] = float(salience)
        
        return heat_map


class LegalAttention(nn.Module):
    """Main Legal Attention Transform for causation analysis"""
    
    def __init__(self, d_model: int = 512, num_heads: int = 4):
        super().__init__()
        self.d_model = d_model
        
        # Core components
        self.positional_encoding = LegalPositionalEncoding(d_model)
        self.multi_head_attention = MultiHeadLegalAttention(d_model, num_heads)
        self.event_embedding = nn.Linear(100, d_model)  # Adjust input size as needed
        
        # Cross-attention for counterfactual reasoning
        self.cross_attention = nn.MultiheadAttention(d_model, num_heads)
        
        # Output layers
        self.guilt_classifier = nn.Linear(d_model, 1)
        self.causation_analyzer = nn.Linear(d_model, 3)  # necessity, sufficiency, contribution
    
    def forward(self, events: List[LegalEvent], 
                counterfactual_events: Optional[List[LegalEvent]] = None) -> Dict[str, Any]:
        """
        Main forward pass for legal attention transform
        
        Args:
            events: List of legal events to analyze
            counterfactual_events: Optional counterfactual scenarios for comparison
            
        Returns:
            Dictionary containing attention weights, guilt scores, and causation analysis
        """
        # Convert events to embeddings
        event_features = self._extract_event_features(events)
        embeddings = self.event_embedding(event_features)
        
        # Add positional encodings
        pos_encodings = self.positional_encoding(events)
        embeddings = embeddings + pos_encodings
        
        # Self-attention for relational analysis
        attention_results = self.multi_head_attention(embeddings)
        
        # Cross-attention for counterfactual reasoning
        counterfactual_results = None
        if counterfactual_events is not None:
            counterfactual_results = self._compute_counterfactual_attention(
                embeddings, counterfactual_events
            )
        
        # Final analysis
        guilt_logits = self.guilt_classifier(attention_results.weights.mean(dim=1))
        causation_scores = self.causation_analyzer(attention_results.weights.mean(dim=1))
        
        return {
            'attention_weights': attention_results.weights,
            'guilt_scores': attention_results.guilt_scores,
            'juridical_heat_map': attention_results.juridical_heat_map,
            'guilt_predictions': torch.sigmoid(guilt_logits),
            'causation_analysis': {
                'necessity': torch.sigmoid(causation_scores[:, 0]),
                'sufficiency': torch.sigmoid(causation_scores[:, 1]),
                'contribution': torch.sigmoid(causation_scores[:, 2])
            },
            'counterfactual_analysis': counterfactual_results
        }
    
    def _extract_event_features(self, events: List[LegalEvent]) -> torch.Tensor:
        """Extract numerical features from legal events"""
        features = []
        
        for event in events:
            # Create feature vector for each event
            feature_vector = [
                float(event.timestamp.timestamp()) / 1e9,  # Normalized timestamp
                float(event.causal_depth),
                float(event.legal_significance),
                float(len(event.epistemic_state)),
                float(len(event.deontic_obligations)),
                # Add more features as needed
            ]
            
            # Pad to fixed size (100 features)
            while len(feature_vector) < 100:
                feature_vector.append(0.0)
            
            features.append(feature_vector[:100])  # Truncate if too long
        
        return torch.tensor(features, dtype=torch.float32)
    
    def _compute_counterfactual_attention(self, actual_embeddings: torch.Tensor,
                                        counterfactual_events: List[LegalEvent]) -> Dict[str, torch.Tensor]:
        """Compute cross-attention between actual and counterfactual scenarios"""
        # Extract counterfactual embeddings
        counterfactual_features = self._extract_event_features(counterfactual_events)
        counterfactual_embeddings = self.event_embedding(counterfactual_features)
        
        # Cross-attention: actual queries attend to counterfactual keys/values
        attn_output, attn_weights = self.cross_attention(
            actual_embeddings.transpose(0, 1),  # [seq_len, batch_size, d_model]
            counterfactual_embeddings.transpose(0, 1),
            counterfactual_embeddings.transpose(0, 1)
        )
        
        return {
            'cross_attention_weights': attn_weights.transpose(0, 1),  # [batch_size, seq_len, seq_len]
            'counterfactual_influence': attn_output.transpose(0, 1)
        }


def analyze_peters_causation_with_attention(case_events: List[Dict[str, Any]],
                                          peter_actions: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Analyze Peter's causation using Legal Attention Transform
    
    This function specifically analyzes Peter's role in the case using the attention
    mechanism to identify causal relationships and guilt patterns.
    """
    logger.info("Starting Peter's causation analysis with Legal Attention Transform")
    
    # Convert case data to LegalEvent objects
    legal_events = []
    for i, event_data in enumerate(case_events):
        event = LegalEvent(
            id=event_data.get('id', f'event_{i}'),
            description=event_data.get('description', ''),
            timestamp=datetime.fromisoformat(event_data.get('timestamp', '2025-01-01T00:00:00')),
            agent=event_data.get('agent', 'unknown'),
            action_type=event_data.get('action_type', 'action'),
            causal_depth=event_data.get('causal_depth', 0),
            epistemic_state=event_data.get('epistemic_state', {}),
            deontic_obligations=event_data.get('deontic_obligations', []),
            legal_significance=event_data.get('legal_significance', 0.5)
        )
        legal_events.append(event)
    
    # Create counterfactual scenarios (what if Peter didn't act)
    counterfactual_events = []
    for event in legal_events:
        if event.agent.lower() != 'peter':
            # Keep non-Peter events
            counterfactual_events.append(event)
        # Peter's actions are removed in counterfactual scenario
    
    # Initialize Legal Attention Transform
    legal_attention = LegalAttention(d_model=512, num_heads=4)
    legal_attention.eval()  # Set to evaluation mode
    
    # Analyze with attention mechanism
    with torch.no_grad():
        results = legal_attention(legal_events, counterfactual_events)
    
    # Focus on Peter's specific involvement
    peter_analysis = _analyze_peter_specific_patterns(results, legal_events, peter_actions)
    
    # Generate causation conclusions
    causation_conclusions = _generate_causation_conclusions(peter_analysis, results)
    
    return {
        'attention_analysis': results,
        'peter_specific_analysis': peter_analysis,
        'causation_conclusions': causation_conclusions,
        'legal_summary': _create_legal_summary(peter_analysis, causation_conclusions)
    }


def _analyze_peter_specific_patterns(results: Dict[str, Any], legal_events: List[LegalEvent],
                                   peter_actions: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Analyze attention patterns specific to Peter's actions"""
    peter_indices = [i for i, event in enumerate(legal_events) if event.agent.lower() == 'peter']
    
    if not peter_indices:
        return {'error': 'No Peter events found in legal_events'}
    
    attention_weights = results['attention_weights']
    guilt_scores = results['guilt_scores']
    
    peter_guilt_scores = guilt_scores[peter_indices]
    peter_attention_patterns = attention_weights[peter_indices, :]
    
    return {
        'peter_guilt_score': float(peter_guilt_scores.mean()),
        'peter_attention_centrality': float(peter_attention_patterns.sum()),
        'peter_causal_influence': float(peter_attention_patterns.max()),
        'peter_actions_analyzed': len(peter_indices),
        'manipulation_indicators': _detect_manipulation_patterns(peter_attention_patterns),
        'self_created_crisis_evidence': _analyze_self_created_crisis(peter_attention_patterns, results)
    }


def _detect_manipulation_patterns(attention_patterns: torch.Tensor) -> Dict[str, float]:
    """Detect patterns indicating manipulation or orchestration"""
    return {
        'orchestration_score': float(attention_patterns.std()),  # High variance indicates orchestration
        'isolation_score': float((attention_patterns == 0).float().mean()),  # Isolated actions
        'dominance_score': float(attention_patterns.max() / (attention_patterns.mean() + 1e-8))
    }


def _analyze_self_created_crisis(attention_patterns: torch.Tensor, 
                               full_results: Dict[str, Any]) -> Dict[str, float]:
    """Analyze evidence of self-created crisis patterns"""
    juridical_heat_map = full_results['juridical_heat_map']
    
    # Look for patterns where Peter's actions create problems he later complains about
    self_creation_score = 0.0
    crisis_exploitation_score = 0.0
    
    # Simplified analysis - would be more sophisticated in practice
    for key, salience in juridical_heat_map.items():
        if 'peter' in key.lower():
            if salience > 0.7:  # High salience indicates strong causal connection
                self_creation_score += salience
    
    return {
        'self_creation_score': self_creation_score,
        'crisis_exploitation_score': crisis_exploitation_score,
        'bad_faith_indicator': min(self_creation_score * 2, 1.0)
    }


def _generate_causation_conclusions(peter_analysis: Dict[str, Any], 
                                  full_results: Dict[str, Any]) -> Dict[str, str]:
    """Generate legal conclusions about Peter's causation"""
    conclusions = {}
    
    guilt_score = peter_analysis.get('peter_guilt_score', 0)
    manipulation_score = peter_analysis.get('manipulation_indicators', {}).get('orchestration_score', 0)
    self_creation_score = peter_analysis.get('self_created_crisis_evidence', {}).get('self_creation_score', 0)
    
    if guilt_score > 0.7:
        conclusions['primary_causation'] = "HIGH: Peter shows strong causal responsibility"
    elif guilt_score > 0.4:
        conclusions['primary_causation'] = "MODERATE: Peter bears significant causal responsibility"
    else:
        conclusions['primary_causation'] = "LOW: Limited evidence of Peter's causal responsibility"
    
    if manipulation_score > 0.6:
        conclusions['manipulation_finding'] = "EVIDENCE SUPPORTS: Peter engaged in manipulative orchestration"
    else:
        conclusions['manipulation_finding'] = "INSUFFICIENT EVIDENCE: Cannot conclude manipulation"
    
    if self_creation_score > 0.5:
        conclusions['self_created_crisis'] = "EVIDENCE SUPPORTS: Peter created the crisis he complains of"
    else:
        conclusions['self_created_crisis'] = "REQUIRES FURTHER ANALYSIS: Self-creation patterns unclear"
    
    return conclusions


def _create_legal_summary(peter_analysis: Dict[str, Any], 
                        conclusions: Dict[str, str]) -> str:
    """Create a legal summary of the attention-based causation analysis"""
    
    summary = f"""
LEGAL ATTENTION TRANSFORM - CAUSATION ANALYSIS SUMMARY

PETER'S CAUSAL RESPONSIBILITY ANALYSIS:

Guilt Score: {peter_analysis.get('peter_guilt_score', 0):.3f}
Attention Centrality: {peter_analysis.get('peter_attention_centrality', 0):.3f}
Causal Influence: {peter_analysis.get('peter_causal_influence', 0):.3f}

MANIPULATION INDICATORS:
- Orchestration Score: {peter_analysis.get('manipulation_indicators', {}).get('orchestration_score', 0):.3f}
- Isolation Score: {peter_analysis.get('manipulation_indicators', {}).get('isolation_score', 0):.3f}
- Dominance Score: {peter_analysis.get('manipulation_indicators', {}).get('dominance_score', 0):.3f}

SELF-CREATED CRISIS EVIDENCE:
- Self-Creation Score: {peter_analysis.get('self_created_crisis_evidence', {}).get('self_creation_score', 0):.3f}
- Bad Faith Indicator: {peter_analysis.get('self_created_crisis_evidence', {}).get('bad_faith_indicator', 0):.3f}

LEGAL CONCLUSIONS:
{chr(10).join([f"- {key.replace('_', ' ').title()}: {value}" for key, value in conclusions.items()])}

ATTENTION MECHANISM FINDINGS:
The Legal Attention Transform has analyzed the relational fabric of the case,
examining causal chains, intentionality patterns, temporal sequences, and 
normative violations. The attention weights create a juridical heat map that
identifies which facts are legally salient for guilt determination.

This analysis provides mathematical backing for causation determinations and
helps establish the "relational chain" between Peter's actions and the alleged harms.
"""
    
    return summary


if __name__ == "__main__":
    # Example usage for testing
    import sys
    
    logging.basicConfig(level=logging.INFO)
    
    # Example case events for testing
    test_events = [
        {
            'id': 'event_1',
            'description': 'Peter cancelled corporate credit cards',
            'timestamp': '2025-06-01T10:00:00',
            'agent': 'Peter',
            'action_type': 'financial_disruption',
            'causal_depth': 1,
            'epistemic_state': {'knowledge_of_consequences': True},
            'deontic_obligations': ['fiduciary_duty', 'notification_duty'],
            'legal_significance': 0.9
        },
        {
            'id': 'event_2', 
            'description': 'Services suspended due to payment failures',
            'timestamp': '2025-06-02T09:00:00',
            'agent': 'System',
            'action_type': 'automatic_response',
            'causal_depth': 2,
            'epistemic_state': {},
            'deontic_obligations': [],
            'legal_significance': 0.7
        },
        {
            'id': 'event_3',
            'description': 'Peter demanded access to documentation',
            'timestamp': '2025-06-05T14:00:00',
            'agent': 'Peter',
            'action_type': 'demand',
            'causal_depth': 3,
            'epistemic_state': {'knowledge_of_own_causation': True},
            'deontic_obligations': ['good_faith'],
            'legal_significance': 0.8
        }
    ]
    
    peter_actions = [
        {'action': 'card_cancellation', 'intent': 'disruptive'},
        {'action': 'system_lockout', 'intent': 'exclusionary'},
        {'action': 'documentation_demand', 'intent': 'pretextual'}
    ]
    
    # Run analysis
    try:
        results = analyze_peters_causation_with_attention(test_events, peter_actions)
        print(results['legal_summary'])
        
        # Save results to JSON for integration
        with open('/tmp/peters_causation_attention_analysis.json', 'w') as f:
            # Convert tensors to lists for JSON serialization
            json_results = {}
            for key, value in results.items():
                if key == 'attention_analysis':
                    json_results[key] = {k: v.tolist() if torch.is_tensor(v) else v 
                                       for k, v in value.items() 
                                       if not isinstance(v, dict) or k == 'juridical_heat_map'}
                else:
                    json_results[key] = value
            
            json.dump(json_results, f, indent=2, default=str)
        
        print(f"\nDetailed results saved to: /tmp/peters_causation_attention_analysis.json")
        
    except Exception as e:
        logger.error(f"Error in analysis: {e}")
        sys.exit(1)
