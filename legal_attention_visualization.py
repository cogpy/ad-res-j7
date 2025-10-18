"""
Visualization tools for the Legal Attention Inference Engine.
Creates juridical heat maps showing which facts are legally salient for guilt determination.
"""

import torch
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from typing import Dict, List, Tuple, Optional
import matplotlib.patches as mpatches
from matplotlib.gridspec import GridSpec

from legal_attention_engine import (
    LegalEvent, Agent, Norm, LegalAttentionEngine,
    create_legal_scenario
)


class JuridicalHeatMapVisualizer:
    """
    Visualizes attention patterns as juridical heat maps.
    Shows which facts matter for which legal determinations.
    """
    
    def __init__(self, figsize: Tuple[int, int] = (16, 12)):
        self.figsize = figsize
        self.cmap = "YlOrRd"  # Yellow to Orange to Red - heat map
        self.legal_colors = {
            "causal": "#FF6B6B",      # Red - causal chains
            "intentional": "#4ECDC4",  # Teal - mental states
            "temporal": "#45B7D1",     # Blue - timing
            "normative": "#96CEB4"     # Green - rule violations
        }
        
    def plot_complete_analysis(self,
                              results: Dict[str, torch.Tensor],
                              events: List[LegalEvent],
                              agents: List[Agent],
                              norms: List[Norm],
                              save_path: Optional[str] = None):
        """
        Create a comprehensive visualization of the legal attention analysis.
        """
        fig = plt.figure(figsize=self.figsize)
        gs = GridSpec(3, 3, figure=fig, hspace=0.3, wspace=0.3)
        
        # 1. Agent-to-Event attention (top left, large)
        ax1 = fig.add_subplot(gs[0:2, 0:2])
        self._plot_agent_event_attention(ax1, results, events, agents)
        
        # 2. Guilt scores (top right)
        ax2 = fig.add_subplot(gs[0, 2])
        self._plot_guilt_scores(ax2, results, agents)
        
        # 3. Multi-head attention comparison (middle right)
        ax3 = fig.add_subplot(gs[1, 2])
        self._plot_multihead_comparison(ax3, results)
        
        # 4. Event-to-Event causal attention (bottom left)
        ax4 = fig.add_subplot(gs[2, 0])
        self._plot_event_causal_attention(ax4, results, events)
        
        # 5. Temporal flow diagram (bottom middle)
        ax5 = fig.add_subplot(gs[2, 1])
        self._plot_temporal_flow(ax5, events, results)
        
        # 6. Counterfactual analysis (bottom right)
        ax6 = fig.add_subplot(gs[2, 2])
        self._plot_counterfactual_impact(ax6, results)
        
        # Main title
        fig.suptitle("Legal Attention Inference: Juridical Heat Map Analysis", 
                    fontsize=16, fontweight='bold')
        
        if save_path:
            plt.savefig(save_path, dpi=300, bbox_inches='tight')
        
        return fig
    
    def _plot_agent_event_attention(self, ax, results, events, agents):
        """
        Plot the agent-to-event attention matrix.
        This shows which facts each agent's guilt determination depends on.
        """
        if "agent_to_event" not in results["attention_weights"]:
            ax.text(0.5, 0.5, "No agent-event attention data", 
                   ha='center', va='center', transform=ax.transAxes)
            return
        
        attn_matrix = results["attention_weights"]["agent_to_event"].squeeze().numpy()
        
        # Create labels
        agent_labels = [f"{a.name}" for a in agents]
        event_labels = [f"{e.id}: {e.description[:30]}..." for e in events]
        
        # Plot heatmap
        sns.heatmap(attn_matrix, 
                   xticklabels=event_labels,
                   yticklabels=agent_labels,
                   cmap=self.cmap,
                   annot=True,
                   fmt='.3f',
                   cbar_kws={'label': 'Attention Weight'},
                   ax=ax)
        
        ax.set_title("Agent → Event Attention\n(Which facts determine guilt)", 
                    fontsize=12, fontweight='bold')
        ax.set_xlabel("Events", fontsize=10)
        ax.set_ylabel("Agents", fontsize=10)
        
        # Rotate x labels
        plt.setp(ax.xaxis.get_majorticklabels(), rotation=45, ha='right')
        
        # Highlight high attention cells
        for i in range(attn_matrix.shape[0]):
            for j in range(attn_matrix.shape[1]):
                if attn_matrix[i, j] > 0.5:
                    ax.add_patch(plt.Rectangle((j, i), 1, 1, 
                                             fill=False, 
                                             edgecolor='black', 
                                             lw=2))
    
    def _plot_guilt_scores(self, ax, results, agents):
        """
        Plot guilt determination scores for each agent.
        """
        guilt_scores = torch.sigmoid(results["guilt_scores"]).squeeze().numpy()
        causation_scores = torch.sigmoid(results["causation_scores"]).squeeze().numpy()
        intention_scores = torch.sigmoid(results["intention_scores"]).squeeze().numpy()
        
        x = np.arange(len(agents))
        width = 0.25
        
        # Create bars
        ax.bar(x - width, guilt_scores, width, label='Guilt', color='#FF6B6B', alpha=0.8)
        ax.bar(x, causation_scores, width, label='Causation', color='#4ECDC4', alpha=0.8)
        ax.bar(x + width, intention_scores, width, label='Intention', color='#45B7D1', alpha=0.8)
        
        # Add guilty/not guilty line
        ax.axhline(y=0.5, color='black', linestyle='--', linewidth=1, alpha=0.5)
        ax.text(0.02, 0.52, 'Guilt Threshold', transform=ax.transAxes, 
               fontsize=8, va='bottom')
        
        # Formatting
        ax.set_ylabel('Score', fontsize=10)
        ax.set_title('Legal Determination Scores', fontsize=12, fontweight='bold')
        ax.set_xticks(x)
        ax.set_xticklabels([a.name for a in agents])
        ax.legend(loc='upper right', fontsize=8)
        ax.set_ylim(0, 1)
        ax.grid(axis='y', alpha=0.3)
        
        # Add guilt verdict
        for i, (agent, score) in enumerate(zip(agents, guilt_scores)):
            verdict = "GUILTY" if score > 0.5 else "NOT GUILTY"
            color = 'red' if score > 0.5 else 'green'
            ax.text(i, score + 0.05, verdict, ha='center', va='bottom',
                   fontsize=8, fontweight='bold', color=color)
    
    def _plot_multihead_comparison(self, ax, results):
        """
        Compare attention patterns across different legal reasoning heads.
        """
        if "attention_by_layer" not in results or not results["attention_by_layer"]:
            ax.text(0.5, 0.5, "No multi-head data available", 
                   ha='center', va='center', transform=ax.transAxes)
            return
        
        # Get attention weights from last layer
        last_layer_attention = results["attention_by_layer"][-1]
        
        head_names = list(last_layer_attention.keys())
        head_scores = []
        
        # Calculate average attention strength for each head
        for head_name in head_names:
            attn = last_layer_attention[head_name].squeeze()
            avg_attn = attn.mean().item()
            head_scores.append(avg_attn)
        
        # Create polar plot
        angles = np.linspace(0, 2 * np.pi, len(head_names), endpoint=False).tolist()
        head_scores += head_scores[:1]  # Complete the circle
        angles += angles[:1]
        
        ax = plt.subplot(gs[1, 2], projection='polar')
        ax.plot(angles, head_scores, 'o-', linewidth=2, color='#FF6B6B')
        ax.fill(angles, head_scores, alpha=0.25, color='#FF6B6B')
        
        ax.set_xticks(angles[:-1])
        ax.set_xticklabels([h.capitalize() for h in head_names])
        ax.set_ylim(0, max(head_scores) * 1.2)
        ax.set_title("Attention Head Activity", fontsize=12, fontweight='bold', pad=20)
        ax.grid(True)
    
    def _plot_event_causal_attention(self, ax, results, events):
        """
        Plot event-to-event attention showing causal chains.
        """
        if "event_to_event" not in results["attention_weights"]:
            ax.text(0.5, 0.5, "No event-event attention data", 
                   ha='center', va='center', transform=ax.transAxes)
            return
        
        attn_matrix = results["attention_weights"]["event_to_event"].squeeze().numpy()
        
        # Create simplified labels
        event_labels = [e.id for e in events]
        
        # Plot heatmap
        sns.heatmap(attn_matrix,
                   xticklabels=event_labels,
                   yticklabels=event_labels,
                   cmap="Blues",
                   annot=True,
                   fmt='.2f',
                   square=True,
                   cbar_kws={'label': 'Causal Attention'},
                   ax=ax)
        
        ax.set_title("Event → Event Causal Attention", fontsize=12, fontweight='bold')
        
        # Highlight strong causal connections
        threshold = 0.3
        for i in range(attn_matrix.shape[0]):
            for j in range(attn_matrix.shape[1]):
                if i != j and attn_matrix[i, j] > threshold:
                    ax.add_patch(plt.Rectangle((j, i), 1, 1,
                                             fill=False,
                                             edgecolor='darkblue',
                                             lw=2))
    
    def _plot_temporal_flow(self, ax, events, results):
        """
        Plot temporal flow of events with harm indicators.
        """
        harm_scores = torch.sigmoid(results["harm_scores"]).squeeze().numpy()
        
        timestamps = [e.timestamp for e in events]
        event_types = [e.event_type for e in events]
        
        # Color map for event types
        type_colors = {
            "observation": "#4ECDC4",
            "action": "#FF6B6B",
            "state_change": "#45B7D1",
            "harm": "#FF0000"
        }
        
        colors = [type_colors.get(t, "#888888") for t in event_types]
        sizes = [100 + harm_scores[i] * 300 for i in range(len(events))]
        
        # Plot timeline
        ax.scatter(timestamps, range(len(events)), c=colors, s=sizes, alpha=0.7, edgecolors='black')
        
        # Add event labels
        for i, event in enumerate(events):
            ax.text(event.timestamp + 0.1, i, f"{event.id}: {event.description[:20]}...",
                   va='center', fontsize=8)
        
        # Add causal arrows
        for i, event in enumerate(events):
            for child_id in event.causal_children or []:
                # Find child index
                for j, e in enumerate(events):
                    if e.id == child_id:
                        ax.arrow(event.timestamp, i, 
                               e.timestamp - event.timestamp - 0.1, j - i,
                               head_width=0.1, head_length=0.05, 
                               fc='gray', ec='gray', alpha=0.5)
        
        ax.set_xlabel("Time", fontsize=10)
        ax.set_ylabel("Event", fontsize=10)
        ax.set_title("Temporal Event Flow", fontsize=12, fontweight='bold')
        ax.grid(axis='x', alpha=0.3)
        
        # Legend
        legend_elements = [mpatches.Patch(color=color, label=etype.capitalize()) 
                          for etype, color in type_colors.items()]
        ax.legend(handles=legend_elements, loc='upper left', fontsize=8)
    
    def _plot_counterfactual_impact(self, ax, results):
        """
        Plot counterfactual analysis if available.
        """
        if results.get("counterfactual_deltas") is None:
            # Create placeholder visualization
            ax.text(0.5, 0.5, "Counterfactual Analysis\n(No alternate worlds provided)", 
                   ha='center', va='center', transform=ax.transAxes,
                   fontsize=10, style='italic')
            ax.set_title("Counterfactual Impact", fontsize=12, fontweight='bold')
            ax.axis('off')
        else:
            # Plot counterfactual deltas
            deltas = results["counterfactual_deltas"].squeeze()
            
            # Simplified visualization of counterfactual impact
            ax.imshow(deltas.mean(dim=-1).numpy(), cmap='RdBu_r', aspect='auto')
            ax.set_title("Counterfactual World Deltas", fontsize=12, fontweight='bold')
            ax.set_xlabel("Event Position")
            ax.set_ylabel("Alternate World")
            
    def plot_attention_evolution(self,
                               results: Dict[str, torch.Tensor],
                               layer_idx: int = -1,
                               save_path: Optional[str] = None):
        """
        Plot how attention patterns evolve through the layers.
        """
        fig, axes = plt.subplots(2, 2, figsize=(12, 10))
        fig.suptitle(f"Attention Evolution at Layer {layer_idx}", fontsize=14, fontweight='bold')
        
        if "attention_by_layer" not in results or not results["attention_by_layer"]:
            return fig
        
        layer_attention = results["attention_by_layer"][layer_idx]
        
        for idx, (head_name, ax) in enumerate(zip(self.legal_colors.keys(), axes.flat)):
            if head_name in layer_attention:
                attn = layer_attention[head_name].squeeze().numpy()
                
                im = ax.imshow(attn, cmap='hot', aspect='auto')
                ax.set_title(f"{head_name.capitalize()} Head", fontsize=12)
                ax.set_xlabel("Key Position")
                ax.set_ylabel("Query Position")
                
                # Add colorbar
                plt.colorbar(im, ax=ax)
        
        plt.tight_layout()
        
        if save_path:
            plt.savefig(save_path, dpi=300, bbox_inches='tight')
        
        return fig


def demonstrate_juridical_heat_maps():
    """
    Demonstrate the juridical heat map visualization.
    """
    print("Generating Juridical Heat Maps...")
    print("=" * 50)
    
    # Create engine and scenario
    engine = LegalAttentionEngine(d_model=256, n_heads=4, n_layers=4)
    events, agents, norms = create_legal_scenario()
    
    # Run inference
    with torch.no_grad():
        results = engine(events, agents, norms)
    
    # Create visualizer
    visualizer = JuridicalHeatMapVisualizer()
    
    # Generate complete analysis
    fig = visualizer.plot_complete_analysis(results, events, agents, norms,
                                           save_path="juridical_heat_map.png")
    
    # Generate attention evolution
    evolution_fig = visualizer.plot_attention_evolution(results, layer_idx=-1,
                                                      save_path="attention_evolution.png")
    
    print("\nVisualization complete!")
    print("Generated files:")
    print("  - juridical_heat_map.png: Complete legal analysis")
    print("  - attention_evolution.png: Attention patterns by head type")
    
    return fig, evolution_fig


if __name__ == "__main__":
    demonstrate_juridical_heat_maps()
    plt.show()