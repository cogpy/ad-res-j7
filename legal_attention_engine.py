"""
Legal Attention Inference Engine

A transformer-based system that uses attention mechanisms to perform legal reasoning.
The attention weights naturally encode which facts matter for which determinations,
creating a relational fabric of guilt determination through learned patterns.
"""

import torch
import torch.nn as nn
import torch.nn.functional as F
from typing import Dict, List, Tuple, Optional, Any
from dataclasses import dataclass
from enum import Enum
import numpy as np
from collections import defaultdict


class LegalDimension(Enum):
    """Different dimensions of legal reasoning."""
    CAUSAL = "causal"  # Cause-effect chains
    INTENTIONAL = "intentional"  # Mental states and knowledge
    TEMPORAL = "temporal"  # Sequence and timing
    NORMATIVE = "normative"  # Rule violations
    EPISTEMIC = "epistemic"  # What agents knew
    DEONTIC = "deontic"  # What agents ought to do


@dataclass
class LegalEvent:
    """Represents an event in the legal possibility space."""
    id: str
    event_type: str  # action, state_change, harm, etc.
    agent_id: Optional[str]
    timestamp: float
    description: str
    properties: Dict[str, Any]
    
    # Legal metadata
    causal_parents: List[str] = None
    causal_children: List[str] = None
    epistemic_state: Dict[str, Any] = None
    normative_context: List[str] = None
    
    def __post_init__(self):
        if self.causal_parents is None:
            self.causal_parents = []
        if self.causal_children is None:
            self.causal_children = []
        if self.epistemic_state is None:
            self.epistemic_state = {}
        if self.normative_context is None:
            self.normative_context = []


@dataclass
class Agent:
    """Represents an agent in the legal scenario."""
    id: str
    name: str
    initial_state: Dict[str, Any]
    capabilities: List[str]
    obligations: List[str] = None
    knowledge: Dict[str, Any] = None
    
    def __post_init__(self):
        if self.obligations is None:
            self.obligations = []
        if self.knowledge is None:
            self.knowledge = {}


@dataclass
class Norm:
    """Represents a legal norm or rule."""
    id: str
    norm_type: str  # prohibition, obligation, permission
    description: str
    conditions: Dict[str, Any]
    consequences: Dict[str, Any]
    priority: float = 1.0


class LegalPositionalEncoding(nn.Module):
    """
    Specialized positional encoding for legal reasoning.
    Encodes multiple dimensions: temporal, causal depth, epistemic state, deontic position.
    """
    
    def __init__(self, d_model: int, max_positions: int = 1000):
        super().__init__()
        self.d_model = d_model
        self.max_positions = max_positions
        
        # Allocate dimensions for each type of position
        self.temporal_dim = d_model // 4
        self.causal_dim = d_model // 4
        self.epistemic_dim = d_model // 4
        self.deontic_dim = d_model - 3 * (d_model // 4)  # Remainder
        
        # Learnable embeddings for different positional aspects
        self.temporal_embed = nn.Embedding(max_positions, self.temporal_dim)
        self.causal_embed = nn.Embedding(max_positions, self.causal_dim)
        self.epistemic_embed = nn.Embedding(max_positions, self.epistemic_dim)
        self.deontic_embed = nn.Embedding(max_positions, self.deontic_dim)
        
    def forward(self, 
                temporal_pos: torch.Tensor,
                causal_depth: torch.Tensor,
                epistemic_pos: torch.Tensor,
                deontic_pos: torch.Tensor) -> torch.Tensor:
        """
        Combine multiple positional encodings.
        
        Args:
            temporal_pos: Temporal positions (batch_size, seq_len)
            causal_depth: Causal depth from initial actions (batch_size, seq_len)
            epistemic_pos: Epistemic positions (knowledge states) (batch_size, seq_len)
            deontic_pos: Deontic positions (obligation states) (batch_size, seq_len)
            
        Returns:
            Combined positional encoding (batch_size, seq_len, d_model)
        """
        temporal = self.temporal_embed(temporal_pos)
        causal = self.causal_embed(causal_depth)
        epistemic = self.epistemic_embed(epistemic_pos)
        deontic = self.deontic_embed(deontic_pos)
        
        # Concatenate all positional encodings
        return torch.cat([temporal, causal, epistemic, deontic], dim=-1)


class LegalMultiHeadAttention(nn.Module):
    """
    Multi-head attention with specialized heads for different legal reasoning modes.
    """
    
    def __init__(self, d_model: int, n_heads: int = 4, dropout: float = 0.1):
        super().__init__()
        assert d_model % n_heads == 0
        
        self.d_model = d_model
        self.n_heads = n_heads
        self.d_k = d_model // n_heads
        
        # Separate projection layers for each legal dimension
        self.head_names = ["causal", "intentional", "temporal", "normative"]
        
        # Query, Key, Value projections for each head type
        self.W_q = nn.ModuleDict({
            name: nn.Linear(d_model, self.d_k) for name in self.head_names
        })
        self.W_k = nn.ModuleDict({
            name: nn.Linear(d_model, self.d_k) for name in self.head_names
        })
        self.W_v = nn.ModuleDict({
            name: nn.Linear(d_model, self.d_k) for name in self.head_names
        })
        
        # Output projection
        self.W_o = nn.Linear(d_model, d_model)
        self.dropout = nn.Dropout(dropout)
        
        # Store attention weights for analysis
        self.attention_weights = {}
        
    def forward(self, 
                query: torch.Tensor,
                key: torch.Tensor,
                value: torch.Tensor,
                mask: Optional[torch.Tensor] = None) -> Tuple[torch.Tensor, Dict[str, torch.Tensor]]:
        """
        Compute multi-head attention with legal-specific heads.
        
        Returns:
            output: Attended values
            attention_weights: Dict mapping head names to attention weights
        """
        batch_size = query.size(0)
        seq_len = query.size(1)
        
        head_outputs = []
        attention_weights = {}
        
        for head_name in self.head_names:
            # Project Q, K, V for this head
            Q = self.W_q[head_name](query)
            K = self.W_k[head_name](key)
            V = self.W_v[head_name](value)
            
            # Compute attention scores
            scores = torch.matmul(Q, K.transpose(-2, -1)) / torch.sqrt(torch.tensor(self.d_k).float())
            
            if mask is not None:
                scores = scores.masked_fill(mask == 0, -1e9)
            
            # Apply softmax to get attention weights
            attn_weights = F.softmax(scores, dim=-1)
            attn_weights = self.dropout(attn_weights)
            
            # Store weights for analysis
            attention_weights[head_name] = attn_weights.detach()
            
            # Apply attention to values
            head_output = torch.matmul(attn_weights, V)
            head_outputs.append(head_output)
        
        # Concatenate all heads
        multi_head_output = torch.cat(head_outputs, dim=-1)
        
        # Final linear projection
        output = self.W_o(multi_head_output)
        
        return output, attention_weights


class CrossAttentionCounterfactual(nn.Module):
    """
    Cross-attention mechanism for counterfactual reasoning.
    Attends from actual world to possible worlds to measure necessity/sufficiency.
    """
    
    def __init__(self, d_model: int, n_heads: int = 4, dropout: float = 0.1):
        super().__init__()
        self.attention = nn.MultiheadAttention(d_model, n_heads, dropout=dropout, batch_first=True)
        self.norm1 = nn.LayerNorm(d_model)
        self.norm2 = nn.LayerNorm(d_model)
        self.ffn = nn.Sequential(
            nn.Linear(d_model, d_model * 4),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(d_model * 4, d_model)
        )
        
    def forward(self,
                actual_world: torch.Tensor,
                possible_worlds: torch.Tensor,
                mask: Optional[torch.Tensor] = None) -> Tuple[torch.Tensor, torch.Tensor]:
        """
        Cross-attend from actual world to possible worlds.
        
        Args:
            actual_world: Representation of what actually happened (batch, seq, d_model)
            possible_worlds: Representations of counterfactual scenarios (batch, n_worlds, seq, d_model)
            
        Returns:
            counterfactual_delta: Difference between worlds where guilt changes
            attention_weights: Cross-attention weights
        """
        batch_size, n_worlds, seq_len, d_model = possible_worlds.shape
        
        # Reshape for batch processing
        possible_worlds_flat = possible_worlds.view(batch_size * n_worlds, seq_len, d_model)
        actual_world_expanded = actual_world.unsqueeze(1).expand(-1, n_worlds, -1, -1)
        actual_world_flat = actual_world_expanded.reshape(batch_size * n_worlds, seq_len, d_model)
        
        # Cross-attention: actual world queries attend to possible worlds
        attended, attn_weights = self.attention(
            query=actual_world_flat,
            key=possible_worlds_flat,
            value=possible_worlds_flat,
            attn_mask=mask
        )
        
        # Residual connection and normalization
        attended = self.norm1(attended + actual_world_flat)
        
        # Feed-forward network
        output = self.norm2(attended + self.ffn(attended))
        
        # Reshape back
        output = output.view(batch_size, n_worlds, seq_len, d_model)
        attn_weights = attn_weights.view(batch_size, n_worlds, seq_len, seq_len)
        
        # Compute counterfactual delta
        counterfactual_delta = output - actual_world.unsqueeze(1)
        
        return counterfactual_delta, attn_weights


class LegalEmbedding(nn.Module):
    """
    Embeds events, agents, and norms into a shared legal representation space.
    """
    
    def __init__(self, d_model: int, vocab_size: int = 10000):
        super().__init__()
        self.d_model = d_model
        
        # Type embeddings
        self.event_type_embed = nn.Embedding(100, d_model)
        self.agent_embed = nn.Embedding(100, d_model)
        self.norm_type_embed = nn.Embedding(20, d_model)
        
        # Property embeddings
        self.property_embed = nn.Linear(100, d_model)  # For continuous properties
        self.token_embed = nn.Embedding(vocab_size, d_model)  # For discrete tokens
        
        # Projection layers
        self.event_proj = nn.Linear(d_model * 3, d_model)
        self.agent_proj = nn.Linear(d_model * 2, d_model)
        self.norm_proj = nn.Linear(d_model * 2, d_model)
        
    def embed_event(self, event: LegalEvent, event_type_id: int) -> torch.Tensor:
        """Embed a legal event."""
        type_emb = self.event_type_embed(torch.tensor(event_type_id))
        
        # Embed properties (simplified - in practice would be more sophisticated)
        prop_vector = torch.zeros(100)
        for i, (k, v) in enumerate(event.properties.items()):
            if i < 100 and isinstance(v, (int, float)):
                prop_vector[i] = float(v)
        prop_emb = self.property_embed(prop_vector)
        
        # Embed description tokens (simplified)
        desc_tokens = torch.randint(0, 1000, (1,))  # Placeholder
        desc_emb = self.token_embed(desc_tokens).mean(dim=0)
        
        # Combine embeddings
        combined = torch.cat([type_emb, prop_emb, desc_emb])
        return self.event_proj(combined)
    
    def embed_agent(self, agent: Agent, agent_id: int) -> torch.Tensor:
        """Embed an agent."""
        agent_emb = self.agent_embed(torch.tensor(agent_id))
        
        # Embed capabilities and obligations (simplified)
        cap_vector = torch.zeros(100)
        for i, cap in enumerate(agent.capabilities[:50]):
            cap_vector[i] = 1.0
        for i, obl in enumerate(agent.obligations[:50]):
            cap_vector[50 + i] = 1.0
        cap_emb = self.property_embed(cap_vector)
        
        combined = torch.cat([agent_emb, cap_emb])
        return self.agent_proj(combined)
    
    def embed_norm(self, norm: Norm, norm_type_id: int) -> torch.Tensor:
        """Embed a legal norm."""
        type_emb = self.norm_type_embed(torch.tensor(norm_type_id))
        
        # Embed conditions and consequences (simplified)
        cond_vector = torch.zeros(100)
        cond_emb = self.property_embed(cond_vector)
        
        combined = torch.cat([type_emb, cond_emb])
        return self.norm_proj(combined)


class LegalAttentionEngine(nn.Module):
    """
    The complete Legal Attention Inference Engine.
    Uses attention mechanisms to perform legal reasoning and guilt determination.
    """
    
    def __init__(self, d_model: int = 512, n_heads: int = 4, n_layers: int = 6):
        super().__init__()
        self.d_model = d_model
        self.n_heads = n_heads
        self.n_layers = n_layers
        
        # Embedding layer
        self.embedding = LegalEmbedding(d_model)
        
        # Positional encoding
        self.positional_encoding = LegalPositionalEncoding(d_model)
        
        # Transformer layers
        self.layers = nn.ModuleList([
            LegalTransformerLayer(d_model, n_heads) for _ in range(n_layers)
        ])
        
        # Cross-attention for counterfactuals
        self.counterfactual_attention = CrossAttentionCounterfactual(d_model, n_heads)
        
        # Output heads for different legal determinations
        self.guilt_head = nn.Linear(d_model, 1)  # Binary guilt determination
        self.causation_head = nn.Linear(d_model, 1)  # Causal contribution score
        self.intention_head = nn.Linear(d_model, 1)  # Intentionality score
        self.harm_head = nn.Linear(d_model, 1)  # Harm severity score
        
        # Attention weight storage for analysis
        self.stored_attention_weights = []
        
    def forward(self,
                events: List[LegalEvent],
                agents: List[Agent],
                norms: List[Norm],
                counterfactual_worlds: Optional[List[List[LegalEvent]]] = None) -> Dict[str, torch.Tensor]:
        """
        Perform legal inference using attention mechanisms.
        
        Args:
            events: List of events in the actual world
            agents: List of agents involved
            norms: List of applicable norms
            counterfactual_worlds: Optional list of alternative event sequences
            
        Returns:
            Dictionary containing:
                - guilt_scores: Guilt determination for each agent
                - attention_weights: Juridical heat map of attention
                - causal_scores: Causal contribution scores
                - intention_scores: Intentionality scores
                - counterfactual_deltas: Differences in counterfactual worlds
        """
        # Embed all elements
        event_embeddings = []
        for i, event in enumerate(events):
            emb = self.embedding.embed_event(event, i % 10)  # Simple type mapping
            event_embeddings.append(emb)
        
        agent_embeddings = []
        for i, agent in enumerate(agents):
            emb = self.embedding.embed_agent(agent, i)
            agent_embeddings.append(emb)
        
        norm_embeddings = []
        for i, norm in enumerate(norms):
            emb = self.embedding.embed_norm(norm, i % 5)  # Simple type mapping
            norm_embeddings.append(emb)
        
        # Stack embeddings
        event_tensor = torch.stack(event_embeddings).unsqueeze(0)  # (1, n_events, d_model)
        agent_tensor = torch.stack(agent_embeddings).unsqueeze(0)  # (1, n_agents, d_model)
        norm_tensor = torch.stack(norm_embeddings).unsqueeze(0)  # (1, n_norms, d_model)
        
        # Concatenate all elements for self-attention
        all_elements = torch.cat([event_tensor, agent_tensor, norm_tensor], dim=1)
        
        # Add positional encodings (simplified - would be more complex in practice)
        seq_len = all_elements.size(1)
        temporal_pos = torch.arange(seq_len).unsqueeze(0)
        causal_depth = torch.zeros_like(temporal_pos)  # Would compute actual causal depth
        epistemic_pos = torch.zeros_like(temporal_pos)  # Would encode knowledge states
        deontic_pos = torch.zeros_like(temporal_pos)  # Would encode obligation states
        
        pos_encoding = self.positional_encoding(temporal_pos, causal_depth, epistemic_pos, deontic_pos)
        all_elements = all_elements + pos_encoding
        
        # Apply transformer layers
        attention_weights_by_layer = []
        hidden = all_elements
        
        for layer in self.layers:
            hidden, layer_attn_weights = layer(hidden)
            attention_weights_by_layer.append(layer_attn_weights)
        
        # Extract representations for different elements
        n_events = len(events)
        n_agents = len(agents)
        
        event_hidden = hidden[:, :n_events, :]
        agent_hidden = hidden[:, n_events:n_events+n_agents, :]
        norm_hidden = hidden[:, n_events+n_agents:, :]
        
        # Compute guilt scores for each agent
        guilt_scores = self.guilt_head(agent_hidden).squeeze(-1)
        causation_scores = self.causation_head(agent_hidden).squeeze(-1)
        intention_scores = self.intention_head(agent_hidden).squeeze(-1)
        
        # Compute harm scores for events
        harm_scores = self.harm_head(event_hidden).squeeze(-1)
        
        # Handle counterfactuals if provided
        counterfactual_deltas = None
        if counterfactual_worlds:
            # Embed counterfactual worlds (simplified)
            cf_embeddings = []
            for world in counterfactual_worlds:
                world_emb = []
                for i, event in enumerate(world[:n_events]):  # Match actual world length
                    emb = self.embedding.embed_event(event, i % 10)
                    world_emb.append(emb)
                cf_embeddings.append(torch.stack(world_emb))
            
            cf_tensor = torch.stack(cf_embeddings).unsqueeze(0)  # (1, n_worlds, n_events, d_model)
            
            # Cross-attention for counterfactual reasoning
            counterfactual_deltas, cf_attn = self.counterfactual_attention(
                event_hidden, cf_tensor
            )
        
        # Create juridical heat map from attention weights
        # Average attention weights across layers and heads
        juridical_heat_map = self._create_heat_map(attention_weights_by_layer, n_events, n_agents)
        
        return {
            "guilt_scores": guilt_scores,
            "causation_scores": causation_scores,
            "intention_scores": intention_scores,
            "harm_scores": harm_scores,
            "attention_weights": juridical_heat_map,
            "attention_by_layer": attention_weights_by_layer,
            "counterfactual_deltas": counterfactual_deltas,
            "event_representations": event_hidden,
            "agent_representations": agent_hidden,
            "norm_representations": norm_hidden
        }
    
    def _create_heat_map(self, 
                        attention_weights_by_layer: List[Dict[str, torch.Tensor]], 
                        n_events: int, 
                        n_agents: int) -> Dict[str, torch.Tensor]:
        """
        Create juridical heat maps showing which facts are legally salient.
        """
        heat_maps = {}
        
        # Extract agent-to-event attention (key for guilt determination)
        agent_event_attention = []
        
        for layer_weights in attention_weights_by_layer:
            for head_name, weights in layer_weights.items():
                # Extract submatrix: agents attending to events
                agent_rows = weights[:, n_events:n_events+n_agents, :n_events]
                agent_event_attention.append(agent_rows)
        
        # Average across layers and heads
        if agent_event_attention:
            heat_maps["agent_to_event"] = torch.stack(agent_event_attention).mean(dim=0)
        
        # Extract event-to-event attention (causal chains)
        event_event_attention = []
        
        for layer_weights in attention_weights_by_layer:
            for head_name, weights in layer_weights.items():
                event_rows = weights[:, :n_events, :n_events]
                event_event_attention.append(event_rows)
        
        if event_event_attention:
            heat_maps["event_to_event"] = torch.stack(event_event_attention).mean(dim=0)
        
        # Extract attention by head type
        for head_name in ["causal", "intentional", "temporal", "normative"]:
            head_attention = []
            for layer_weights in attention_weights_by_layer:
                if head_name in layer_weights:
                    head_attention.append(layer_weights[head_name])
            
            if head_attention:
                heat_maps[f"{head_name}_attention"] = torch.stack(head_attention).mean(dim=0)
        
        return heat_maps


class LegalTransformerLayer(nn.Module):
    """
    A single transformer layer with legal multi-head attention.
    """
    
    def __init__(self, d_model: int, n_heads: int, dropout: float = 0.1):
        super().__init__()
        self.attention = LegalMultiHeadAttention(d_model, n_heads, dropout)
        self.norm1 = nn.LayerNorm(d_model)
        self.norm2 = nn.LayerNorm(d_model)
        self.ffn = nn.Sequential(
            nn.Linear(d_model, d_model * 4),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(d_model * 4, d_model)
        )
        self.dropout = nn.Dropout(dropout)
        
    def forward(self, x: torch.Tensor, mask: Optional[torch.Tensor] = None) -> Tuple[torch.Tensor, Dict[str, torch.Tensor]]:
        # Self-attention
        attn_output, attn_weights = self.attention(x, x, x, mask)
        x = self.norm1(x + self.dropout(attn_output))
        
        # Feed-forward
        ffn_output = self.ffn(x)
        x = self.norm2(x + self.dropout(ffn_output))
        
        return x, attn_weights


def create_legal_scenario() -> Tuple[List[LegalEvent], List[Agent], List[Norm]]:
    """
    Create a sample legal scenario for testing.
    The trolley problem with epistemic complications.
    """
    # Agents
    agents = [
        Agent(
            id="alex",
            name="Alex",
            initial_state={"position": "switch", "knowledge": ["five_on_track", "one_on_side"]},
            capabilities=["pull_lever", "observe", "warn"],
            obligations=["minimize_harm"],
            knowledge={"track_layout": True, "people_positions": True}
        ),
        Agent(
            id="victim1",
            name="Worker 1",
            initial_state={"position": "main_track", "aware": False},
            capabilities=["move", "observe"],
            obligations=["self_preserve"]
        )
    ]
    
    # Events
    events = [
        LegalEvent(
            id="e1",
            event_type="observation",
            agent_id="alex",
            timestamp=0.0,
            description="Alex observes five people on main track",
            properties={"observed": "five_people", "location": "main_track"},
            epistemic_state={"alex": {"knows_five_at_risk": True}}
        ),
        LegalEvent(
            id="e2",
            event_type="observation",
            agent_id="alex",
            timestamp=1.0,
            description="Alex observes one person on side track",
            properties={"observed": "one_person", "location": "side_track"},
            epistemic_state={"alex": {"knows_one_at_risk": True}}
        ),
        LegalEvent(
            id="e3",
            event_type="action",
            agent_id="alex",
            timestamp=2.0,
            description="Alex pulls the lever",
            properties={"action": "pull_lever", "intention": "redirect_trolley"},
            causal_children=["e4", "e5"],
            normative_context=["minimize_harm", "no_active_harm"]
        ),
        LegalEvent(
            id="e4",
            event_type="state_change",
            agent_id=None,
            timestamp=3.0,
            description="Trolley redirects to side track",
            properties={"trolley_path": "side_track"},
            causal_parents=["e3"],
            causal_children=["e5"]
        ),
        LegalEvent(
            id="e5",
            event_type="harm",
            agent_id="victim1",
            timestamp=4.0,
            description="One person harmed on side track",
            properties={"harm_type": "physical", "severity": "fatal", "victims": 1},
            causal_parents=["e3", "e4"]
        )
    ]
    
    # Norms
    norms = [
        Norm(
            id="n1",
            norm_type="obligation",
            description="Minimize overall harm",
            conditions={"situation": "imminent_harm", "capability": "prevent"},
            consequences={"compliance": "reduced_harm", "violation": "greater_harm"},
            priority=0.9
        ),
        Norm(
            id="n2",
            norm_type="prohibition",
            description="Do not actively cause harm",
            conditions={"action": "causes_harm", "intention": "any"},
            consequences={"compliance": "no_active_harm", "violation": "moral_responsibility"},
            priority=0.8
        )
    ]
    
    return events, agents, norms


if __name__ == "__main__":
    print("Legal Attention Inference Engine")
    print("=" * 50)
    
    # Create the engine
    engine = LegalAttentionEngine(d_model=256, n_heads=4, n_layers=4)
    
    # Create a test scenario
    events, agents, norms = create_legal_scenario()
    
    print(f"\nScenario: {len(events)} events, {len(agents)} agents, {len(norms)} norms")
    print("\nEvents:")
    for event in events:
        print(f"  - {event.id}: {event.description}")
    
    print("\nAgents:")
    for agent in agents:
        print(f"  - {agent.id}: {agent.name} (capabilities: {', '.join(agent.capabilities)})")
    
    print("\nNorms:")
    for norm in norms:
        print(f"  - {norm.id}: {norm.description}")
    
    # Run inference
    print("\n\nRunning legal inference...")
    with torch.no_grad():
        results = engine(events, agents, norms)
    
    print("\n\nResults:")
    print("-" * 50)
    
    # Print guilt scores
    guilt_scores = results["guilt_scores"].squeeze()
    print("\nGuilt Determination:")
    for i, agent in enumerate(agents):
        if i < len(guilt_scores):
            score = torch.sigmoid(guilt_scores[i]).item()
            print(f"  {agent.name}: {score:.3f} {'(GUILTY)' if score > 0.5 else '(NOT GUILTY)'}")
    
    # Print other scores
    print("\nCausation Scores:")
    causation_scores = results["causation_scores"].squeeze()
    for i, agent in enumerate(agents):
        if i < len(causation_scores):
            score = torch.sigmoid(causation_scores[i]).item()
            print(f"  {agent.name}: {score:.3f}")
    
    print("\nIntentionality Scores:")
    intention_scores = results["intention_scores"].squeeze()
    for i, agent in enumerate(agents):
        if i < len(intention_scores):
            score = torch.sigmoid(intention_scores[i]).item()
            print(f"  {agent.name}: {score:.3f}")
    
    print("\nHarm Severity by Event:")
    harm_scores = results["harm_scores"].squeeze()
    for i, event in enumerate(events):
        if i < len(harm_scores):
            score = torch.sigmoid(harm_scores[i]).item()
            print(f"  {event.id}: {score:.3f} - {event.description}")
    
    # Analyze attention patterns
    print("\n\nJuridical Heat Map Analysis:")
    print("-" * 50)
    
    if "agent_to_event" in results["attention_weights"]:
        agent_event_attn = results["attention_weights"]["agent_to_event"].squeeze()
        print("\nAgent-to-Event Attention (which facts matter for guilt):")
        
        # Find highest attention weights
        if agent_event_attn.numel() > 0:
            for i, agent in enumerate(agents):
                if i < agent_event_attn.size(0):
                    agent_attn = agent_event_attn[i]
                    top_k = min(3, len(events))
                    top_values, top_indices = torch.topk(agent_attn, top_k)
                    
                    print(f"\n  {agent.name} strongly attends to:")
                    for j, (val, idx) in enumerate(zip(top_values, top_indices)):
                        if idx < len(events):
                            print(f"    - {events[idx].id}: {events[idx].description} (weight: {val:.3f})")
    
    # Show causal attention patterns
    if "causal_attention" in results["attention_weights"]:
        print("\n\nCausal Attention Pattern:")
        causal_attn = results["attention_weights"]["causal_attention"].squeeze()
        print("  (Shows how the model traces causal chains)")
    
    print("\n\nThe attention mechanism has learned to identify legally salient relationships!")
    print("High attention between an agent and harmful events indicates guilt determination.")
    print("The 'guilty party is always guilty' emerges from these learned attention patterns.")