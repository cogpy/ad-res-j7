# Legal Attention Inference Engine

A transformer-based system that uses attention mechanisms to perform legal reasoning and guilt determination. The key insight is that **attention IS the lex inference engine** - guilt emerges from learned relational patterns in attention weights, not from explicit rules.

## Core Insight

In transformers, attention computes relevance scores between all elements. For legal inference, this becomes:

- **Q (Queries)**: The guilt hypotheses being evaluated
- **K (Keys)**: All facts, actions, and agent states in the possibility space  
- **V (Values)**: The legal/causal significance of each element

The attention weights naturally encode **which facts matter for which determinations** - creating a "juridical heat map" that shows legal salience.

## Key Features

### 1. Multi-Head Legal Attention
Different attention heads represent different legal lenses:
- **Causal head**: Attends to cause-effect chains
- **Intentionality head**: Focuses on mental states and knowledge
- **Temporal head**: Weighs sequence and timing
- **Normative head**: Attends to rule violations

### 2. Specialized Positional Encodings
Legal reasoning requires special positional encodings:
- Temporal position (when did it happen)
- Causal depth (how many steps from action to harm)
- Epistemic position (what did the agent know at this point)
- Deontic position (what obligations were active)

### 3. Cross-Attention for Counterfactuals
Cross-attention between actual and possible worlds handles counterfactual reasoning:
- Attend from "what happened" to "what could have happened"
- Learn the delta between worlds where guilt changes
- Measures the **necessity and sufficiency** of actions for outcomes

### 4. Emergent Guilt Determination
The "guilty party is always guilty" property emerges because attention learns invariant patterns across all possible configurations. The mechanism discovers guilt as a stable attractor in the attention landscape.

## Architecture

```python
class LegalAttentionEngine:
    def forward(self, events, agents, norms):
        # Embed all elements in shared legal space
        embeddings = self.embed(events, agents, norms)
        
        # Add legal positional encodings
        embeddings += self.positional_encoding(
            temporal_pos, causal_depth, 
            epistemic_pos, deontic_pos
        )
        
        # Self-attention finds relational structure
        for layer in self.transformer_layers:
            embeddings, attention_weights = layer(embeddings)
        
        # These weights ARE the guilt determination
        # High attention between agent and harm = guilt
        
        return guilt_scores, attention_weights
```

## Usage

```python
from legal_attention_engine import LegalAttentionEngine, LegalEvent, Agent, Norm

# Create engine
engine = LegalAttentionEngine(d_model=256, n_heads=4, n_layers=4)

# Define scenario
events = [
    LegalEvent(id="e1", event_type="action", agent_id="alice", 
               description="Alice pulls lever", ...),
    LegalEvent(id="e2", event_type="harm", agent_id="victim",
               description="Person harmed", causal_parents=["e1"], ...)
]

agents = [
    Agent(id="alice", name="Alice", capabilities=["pull_lever"], ...)
]

norms = [
    Norm(id="n1", norm_type="prohibition", description="Do not harm", ...)
]

# Run inference
results = engine(events, agents, norms)

# Examine results
guilt_scores = results["guilt_scores"]  # Agent guilt determinations
attention_weights = results["attention_weights"]  # Juridical heat map
```

## Example Scenarios

### 1. Trolley Problem
Tests basic moral dilemmas and action/omission distinctions.

### 2. Poisoned Coffee
Tests complex causation with multiple agents and concurrent causes.

### 3. Autonomous Vehicle Dilemma
Tests algorithmic decision-making and lesser evil reasoning.

### 4. Corporate Negligence
Tests hierarchical responsibility and systemic failures.

## Visualization

The system includes juridical heat map visualizations showing:
- Which facts each agent's guilt determination depends on
- Causal attention chains between events
- Attention head specialization
- Counterfactual impact analysis

```python
from legal_attention_visualization import JuridicalHeatMapVisualizer

visualizer = JuridicalHeatMapVisualizer()
fig = visualizer.plot_complete_analysis(results, events, agents, norms)
```

## Key Properties

1. **No Explicit Rules**: Guilt emerges from attention patterns, not hard-coded logic
2. **Invariance**: The guilty party remains guilty across different configurations
3. **Interpretability**: Attention weights explain why someone is guilty
4. **Compositionality**: Complex scenarios decompose into attention relationships
5. **Counterfactual Reasoning**: Cross-attention handles "what if" scenarios

## Testing

Run the comprehensive test suite:

```bash
python test_legal_attention.py
```

This demonstrates:
- Multi-head attention captures different legal reasoning modes
- Guilt emerges from attention patterns, not explicit rules
- Attention weights form interpretable 'juridical heat maps'
- Cross-attention handles counterfactual reasoning
- The system exhibits guilt invariance properties
- 'Guilty party is always guilty' emerges naturally

## Theory

The attention mechanism doesn't enumerate all possibilities explicitly - it learns a **compressed representation** of the guilt function that generalizes across configurations. This is why attention mechanisms naturally handle:

1. **Variable-length sequences** (different numbers of agents/actions)
2. **Long-range dependencies** (distant causes)
3. **Compositional reasoning** (combining multiple factors)
4. **Learned rather than programmed logic**

The attention scores become a kind of **juridical heat map** - showing which facts are legally salient for which conclusions.

## Files

- `legal_attention_engine.py` - Core attention-based inference engine
- `legal_scenarios.py` - Complex test scenarios  
- `legal_attention_visualization.py` - Juridical heat map visualizations
- `test_legal_attention.py` - Comprehensive test suite

## Requirements

```
torch>=2.0.0
numpy>=1.20.0
matplotlib>=3.5.0
seaborn>=0.11.0
```

## Citation

This implementation demonstrates the theoretical insight that transformer attention mechanisms can encode legal reasoning, with guilt determination emerging from learned relational patterns rather than explicit rules.

The key theoretical contribution is recognizing that **attention IS the lex inference engine** - the attention weights themselves encode the juridical relationships that determine guilt.