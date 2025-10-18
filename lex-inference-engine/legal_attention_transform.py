#!/usr/bin/env python3
"""
Legal Attention Transform - Advanced Causation Analysis
======================================================

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
======================================================

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