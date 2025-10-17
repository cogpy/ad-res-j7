#!/usr/bin/env python3
"""
Burden of Proof Analyzer for Legal Attention System

Implements optimal strategies and indicates burden of proof and necessary conditions 
for Dan & Jax to prove guilt of other agents (Peter, Rynette, Bantjies, etc) 
in each element specified by the body of law being considered.

Covers three legal standards:
- Civil: Balance of probabilities (>50% likelihood)
- Criminal: Beyond reasonable doubt (~95-99% certainty)
- Mathematical: Invariant of all conditions (logical certainty)
"""

import torch
import torch.nn as nn
from typing import Dict, List, Tuple, Optional, Any
from dataclasses import dataclass
from enum import Enum
import numpy as np
from collections import defaultdict
import json

from legal_attention_engine import LegalAttentionEngine, LegalEvent, Agent, Norm


class BurdenStandard(Enum):
    """Different legal standards of proof."""
    CIVIL = "balance_of_probabilities"  # >50% likelihood
    CRIMINAL = "beyond_reasonable_doubt"  # ~95-99% certainty
    MATHEMATICAL = "invariant_all_conditions"  # Logical certainty


class ProofElement(Enum):
    """Elements that must be proven in legal cases."""
    CAUSATION = "causation"  # Did agent's actions cause the harm?
    INTENT = "intent"  # Did agent intend the outcome?
    KNOWLEDGE = "knowledge"  # Did agent know of the risk/consequences?
    DUTY = "duty"  # Did agent have a legal duty?
    BREACH = "breach"  # Did agent breach their duty?
    HARM = "harm"  # Was there actual harm/damage?
    FORESEEABILITY = "foreseeability"  # Was the harm foreseeable?
    PROXIMITY = "proximity"  # Was agent proximate to the harm?


@dataclass
class ProofRequirement:
    """Requirements to prove a specific element under a given standard."""
    element: ProofElement
    standard: BurdenStandard
    threshold: float  # Probability threshold required
    evidence_types: List[str]  # Types of evidence needed
    necessary_conditions: List[str]  # Must all be satisfied
    sufficient_conditions: List[List[str]]  # Any one set suffices
    defenses_to_counter: List[str]  # Potential defenses to address


@dataclass
class GuiltAnalysis:
    """Complete guilt analysis for an agent under a specific standard."""
    agent_id: str
    agent_name: str
    standard: BurdenStandard
    overall_guilt_probability: float
    element_probabilities: Dict[ProofElement, float]
    evidence_strength: Dict[str, float]
    proof_gaps: List[str]  # What still needs to be proven
    recommended_strategy: List[str]  # Recommended actions for Dan & Jax
    counter_strategies: List[str]  # How opponent might defend


class BurdenOfProofAnalyzer:
    """
    Analyzes burden of proof requirements and provides strategic guidance
    for Dan & Jax to prove guilt of other agents under different legal standards.
    """
    
    def __init__(self, legal_engine: LegalAttentionEngine):
        self.legal_engine = legal_engine
        self.proof_requirements = self._initialize_proof_requirements()
        
        # Agent mappings for the case
        self.prosecution_agents = ["dan", "jax"]  # The ones trying to prove guilt
        self.defendant_agents = ["peter", "rynette", "bantjies"]  # Potentially guilty parties
        
    def _initialize_proof_requirements(self) -> Dict[Tuple[ProofElement, BurdenStandard], ProofRequirement]:
        """Initialize proof requirements for different elements and standards."""
        requirements = {}
        
        # CAUSATION requirements
        requirements[(ProofElement.CAUSATION, BurdenStandard.CIVIL)] = ProofRequirement(
            element=ProofElement.CAUSATION,
            standard=BurdenStandard.CIVIL,
            threshold=0.51,  # >50%
            evidence_types=[
                "temporal_sequence", "but_for_test", "material_contribution",
                "expert_testimony", "documentary_evidence"
            ],
            necessary_conditions=[
                "factual_causation", "legal_causation", "no_intervening_cause"
            ],
            sufficient_conditions=[
                ["but_for_causation", "material_increase_in_risk"],
                ["direct_causation", "no_competing_causes"],
                ["substantial_factor", "foreseeability"]
            ],
            defenses_to_counter=[
                "intervening_cause", "contributory_negligence", "multiple_sufficient_causes"
            ]
        )
        
        requirements[(ProofElement.CAUSATION, BurdenStandard.CRIMINAL)] = ProofRequirement(
            element=ProofElement.CAUSATION,
            standard=BurdenStandard.CRIMINAL,
            threshold=0.95,  # Beyond reasonable doubt
            evidence_types=[
                "direct_evidence", "forensic_evidence", "expert_testimony",
                "temporal_sequence", "exclusion_of_alternatives"
            ],
            necessary_conditions=[
                "factual_causation", "legal_causation", "no_reasonable_alternative_explanation"
            ],
            sufficient_conditions=[
                ["direct_causation", "exclusion_of_alternatives", "expert_confirmation"],
                ["chain_of_custody", "forensic_evidence", "temporal_proof"]
            ],
            defenses_to_counter=[
                "reasonable_doubt", "alternative_causation", "insufficient_evidence"
            ]
        )
        
        requirements[(ProofElement.CAUSATION, BurdenStandard.MATHEMATICAL)] = ProofRequirement(
            element=ProofElement.CAUSATION,
            standard=BurdenStandard.MATHEMATICAL,
            threshold=1.0,  # Logical certainty
            evidence_types=[
                "logical_proof", "mathematical_modeling", "counterfactual_analysis",
                "invariant_relationships"
            ],
            necessary_conditions=[
                "logical_necessity", "counterfactual_dependence", "invariance_across_conditions"
            ],
            sufficient_conditions=[
                ["logical_entailment", "counterfactual_proof", "necessity_and_sufficiency"]
            ],
            defenses_to_counter=[
                "logical_inconsistency", "missing_counterfactuals", "alternative_models"
            ]
        )
        
        # INTENT requirements
        requirements[(ProofElement.INTENT, BurdenStandard.CIVIL)] = ProofRequirement(
            element=ProofElement.INTENT,
            standard=BurdenStandard.CIVIL,
            threshold=0.51,
            evidence_types=[
                "conduct_evidence", "statements", "circumstantial_evidence",
                "pattern_of_behavior", "witness_testimony"
            ],
            necessary_conditions=[
                "voluntary_action", "awareness_of_consequences"
            ],
            sufficient_conditions=[
                ["explicit_statements", "deliberate_conduct"],
                ["pattern_of_behavior", "awareness_of_risk"],
                ["circumstantial_evidence", "reasonable_inference"]
            ],
            defenses_to_counter=[
                "lack_of_intent", "mistake", "accident", "duress"
            ]
        )
        
        requirements[(ProofElement.INTENT, BurdenStandard.CRIMINAL)] = ProofRequirement(
            element=ProofElement.INTENT,
            standard=BurdenStandard.CRIMINAL,
            threshold=0.95,
            evidence_types=[
                "direct_evidence", "admissions", "conduct_evidence",
                "planning_evidence", "motive_evidence"
            ],
            necessary_conditions=[
                "specific_intent", "voluntary_action", "awareness_of_wrongfulness"
            ],
            sufficient_conditions=[
                ["explicit_admission", "planning_evidence", "deliberate_conduct"],
                ["motive", "opportunity", "conduct_inconsistent_with_innocence"]
            ],
            defenses_to_counter=[
                "lack_of_specific_intent", "mental_incapacity", "mistake_of_fact"
            ]
        )
        
        # KNOWLEDGE requirements
        requirements[(ProofElement.KNOWLEDGE, BurdenStandard.CIVIL)] = ProofRequirement(
            element=ProofElement.KNOWLEDGE,
            standard=BurdenStandard.CIVIL,
            threshold=0.51,
            evidence_types=[
                "communications", "training_records", "industry_standards",
                "expert_testimony", "circumstantial_evidence"
            ],
            necessary_conditions=[
                "opportunity_to_know", "reasonable_person_standard"
            ],
            sufficient_conditions=[
                ["actual_knowledge", "documentary_evidence"],
                ["constructive_knowledge", "industry_standards"],
                ["willful_blindness", "deliberate_ignorance"]
            ],
            defenses_to_counter=[
                "lack_of_knowledge", "reasonable_reliance", "impossibility_of_knowledge"
            ]
        )
        
        # Add more elements as needed...
        return requirements
    
    def analyze_guilt_comprehensive(self,
                                  events: List[LegalEvent],
                                  agents: List[Agent],
                                  norms: List[Norm],
                                  defendant_agent_id: str,
                                  standard: BurdenStandard) -> GuiltAnalysis:
        """
        Perform comprehensive guilt analysis for a specific agent under a given standard.
        """
        # Run legal attention inference
        with torch.no_grad():
            results = self.legal_engine(events, agents, norms)
        
        # Find the defendant agent
        defendant_agent = next((a for a in agents if a.id == defendant_agent_id), None)
        if not defendant_agent:
            raise ValueError(f"Agent {defendant_agent_id} not found")
        
        agent_idx = next(i for i, a in enumerate(agents) if a.id == defendant_agent_id)
        
        # Extract attention-based evidence
        attention_weights = results["attention_weights"]
        guilt_score = torch.sigmoid(results["guilt_scores"][0, agent_idx]).item()
        causation_score = torch.sigmoid(results["causation_scores"][0, agent_idx]).item()
        intention_score = torch.sigmoid(results["intention_scores"][0, agent_idx]).item()
        
        # Analyze each proof element
        element_probabilities = {}
        evidence_strength = {}
        proof_gaps = []
        
        # Analyze causation
        causation_prob = self._analyze_causation(
            events, agents, defendant_agent, attention_weights, causation_score, standard
        )
        element_probabilities[ProofElement.CAUSATION] = causation_prob
        
        # Analyze intent
        intent_prob = self._analyze_intent(
            events, agents, defendant_agent, attention_weights, intention_score, standard
        )
        element_probabilities[ProofElement.INTENT] = intent_prob
        
        # Analyze knowledge
        knowledge_prob = self._analyze_knowledge(
            events, agents, defendant_agent, attention_weights, standard
        )
        element_probabilities[ProofElement.KNOWLEDGE] = knowledge_prob
        
        # Determine overall guilt probability based on standard
        overall_prob = self._calculate_overall_guilt(element_probabilities, standard)
        
        # Identify proof gaps
        threshold = self.proof_requirements[(ProofElement.CAUSATION, standard)].threshold
        for element, prob in element_probabilities.items():
            if prob < threshold:
                proof_gaps.append(f"{element.value}: {prob:.3f} < {threshold:.3f}")
        
        # Generate strategic recommendations
        strategy = self._generate_prosecution_strategy(
            defendant_agent, element_probabilities, standard, events, agents
        )
        
        # Generate counter-strategies
        counter_strategy = self._generate_defense_counter_strategies(
            defendant_agent, element_probabilities, standard
        )
        
        return GuiltAnalysis(
            agent_id=defendant_agent_id,
            agent_name=defendant_agent.name,
            standard=standard,
            overall_guilt_probability=overall_prob,
            element_probabilities=element_probabilities,
            evidence_strength=evidence_strength,
            proof_gaps=proof_gaps,
            recommended_strategy=strategy,
            counter_strategies=counter_strategy
        )
    
    def _analyze_causation(self,
                          events: List[LegalEvent],
                          agents: List[Agent],
                          defendant: Agent,
                          attention_weights: Dict[str, torch.Tensor],
                          causation_score: float,
                          standard: BurdenStandard) -> float:
        """Analyze causation element for the defendant."""
        
        # Start with attention-based causation score
        base_score = causation_score
        
        # Adjust based on evidence strength
        evidence_factors = []
        
        # Temporal sequence evidence
        defendant_events = [e for e in events if e.agent_id == defendant.id]
        harm_events = [e for e in events if e.event_type == "harm"]
        
        if defendant_events and harm_events:
            # Check if defendant's actions precede harm
            defendant_times = [e.timestamp for e in defendant_events]
            harm_times = [e.timestamp for e in harm_events]
            
            if any(d_time < h_time for d_time in defendant_times for h_time in harm_times):
                evidence_factors.append(0.3)  # Temporal precedence
            
            # Check for causal chains
            causal_chains = self._trace_causal_chains(defendant_events, harm_events)
            if causal_chains:
                evidence_factors.append(0.4)  # Direct causal connection
        
        # Attention-based evidence (how strongly does model link agent to harm)
        if "agent_to_event" in attention_weights:
            agent_event_attn = attention_weights["agent_to_event"].squeeze()
            if agent_event_attn.numel() > 0:
                harm_event_indices = [i for i, e in enumerate(events) if e.event_type == "harm"]
                defendant_idx = next(i for i, a in enumerate(agents) if a.id == defendant.id)
                
                if defendant_idx < agent_event_attn.size(0) and harm_event_indices:
                    harm_attention = agent_event_attn[defendant_idx, harm_event_indices].mean().item()
                    evidence_factors.append(harm_attention * 0.5)
        
        # Combine evidence factors
        evidence_boost = sum(evidence_factors)
        adjusted_score = min(1.0, base_score + evidence_boost)
        
        # Apply standard-specific adjustments
        if standard == BurdenStandard.CRIMINAL:
            # Criminal standard requires higher certainty
            adjusted_score = adjusted_score * 0.8  # More conservative
        elif standard == BurdenStandard.MATHEMATICAL:
            # Mathematical standard requires logical proof
            if not self._has_logical_causation_proof(defendant_events, harm_events):
                adjusted_score = 0.0
        
        return adjusted_score
    
    def _analyze_intent(self,
                       events: List[LegalEvent],
                       agents: List[Agent],
                       defendant: Agent,
                       attention_weights: Dict[str, torch.Tensor],
                       intention_score: float,
                       standard: BurdenStandard) -> float:
        """Analyze intent element for the defendant."""
        
        base_score = intention_score
        evidence_factors = []
        
        # Look for explicit intent evidence
        defendant_events = [e for e in events if e.agent_id == defendant.id]
        
        for event in defendant_events:
            # Check for explicit statements or actions showing intent
            if "intent" in event.properties:
                evidence_factors.append(0.4)
            
            # Check for planning or preparation
            if event.event_type in ["planning", "preparation", "deliberation"]:
                evidence_factors.append(0.3)
            
            # Check for knowledge of consequences
            if "knowledge" in event.properties:
                knowledge_level = event.properties.get("knowledge", {})
                if "consequences" in str(knowledge_level):
                    evidence_factors.append(0.2)
        
        # Check agent's initial knowledge state
        if defendant.knowledge:
            if any("harm" in str(k) or "danger" in str(k) for k in defendant.knowledge.values()):
                evidence_factors.append(0.3)
        
        evidence_boost = sum(evidence_factors)
        adjusted_score = min(1.0, base_score + evidence_boost)
        
        # Standard-specific adjustments
        if standard == BurdenStandard.CRIMINAL:
            # Criminal intent requires specific intent
            if not self._has_specific_intent_evidence(defendant_events):
                adjusted_score = adjusted_score * 0.6
        elif standard == BurdenStandard.MATHEMATICAL:
            # Mathematical standard requires logical proof of intent
            if not self._has_logical_intent_proof(defendant_events):
                adjusted_score = 0.0
        
        return adjusted_score
    
    def _analyze_knowledge(self,
                          events: List[LegalEvent],
                          agents: List[Agent],
                          defendant: Agent,
                          attention_weights: Dict[str, torch.Tensor],
                          standard: BurdenStandard) -> float:
        """Analyze knowledge element for the defendant."""
        
        knowledge_factors = []
        
        # Check initial knowledge state
        if defendant.knowledge:
            knowledge_factors.append(0.4)
        
        # Check for knowledge-gaining events
        defendant_events = [e for e in events if e.agent_id == defendant.id]
        knowledge_events = [e for e in defendant_events if e.event_type == "observation" or 
                           "knowledge" in e.properties or e.epistemic_state]
        
        if knowledge_events:
            knowledge_factors.append(0.3)
        
        # Check for constructive knowledge (should have known)
        if defendant.obligations and any("safety" in str(obl) for obl in defendant.obligations):
            knowledge_factors.append(0.3)
        
        # Check for willful blindness
        if any("ignore" in e.description.lower() or "blind" in e.description.lower() 
               for e in defendant_events):
            knowledge_factors.append(0.4)
        
        base_score = min(1.0, sum(knowledge_factors))
        
        # Standard-specific adjustments
        if standard == BurdenStandard.CRIMINAL:
            # Criminal knowledge requires actual knowledge
            if not self._has_actual_knowledge_evidence(defendant_events):
                base_score = base_score * 0.7
        elif standard == BurdenStandard.MATHEMATICAL:
            # Mathematical standard requires provable knowledge
            if not self._has_provable_knowledge(defendant_events):
                base_score = 0.0
        
        return base_score
    
    def _calculate_overall_guilt(self,
                               element_probabilities: Dict[ProofElement, float],
                               standard: BurdenStandard) -> float:
        """Calculate overall guilt probability based on element analysis."""
        
        # For most cases, all elements must be proven
        # Use the minimum probability (weakest link)
        if not element_probabilities:
            return 0.0
        
        # Weight different elements
        weights = {
            ProofElement.CAUSATION: 0.4,
            ProofElement.INTENT: 0.3,
            ProofElement.KNOWLEDGE: 0.2,
            ProofElement.DUTY: 0.1
        }
        
        weighted_sum = 0.0
        total_weight = 0.0
        
        for element, prob in element_probabilities.items():
            weight = weights.get(element, 0.1)
            weighted_sum += prob * weight
            total_weight += weight
        
        if total_weight == 0:
            return 0.0
        
        base_prob = weighted_sum / total_weight
        
        # Apply standard-specific thresholds
        threshold = {
            BurdenStandard.CIVIL: 0.51,
            BurdenStandard.CRIMINAL: 0.95,
            BurdenStandard.MATHEMATICAL: 1.0
        }[standard]
        
        # Ensure all elements meet the threshold for the standard
        min_element_prob = min(element_probabilities.values()) if element_probabilities else 0.0
        
        if min_element_prob < threshold:
            # If any element fails to meet threshold, overall guilt is reduced
            return min(base_prob, min_element_prob)
        
        return base_prob
    
    def _generate_prosecution_strategy(self,
                                     defendant: Agent,
                                     element_probabilities: Dict[ProofElement, float],
                                     standard: BurdenStandard,
                                     events: List[LegalEvent],
                                     agents: List[Agent]) -> List[str]:
        """Generate strategic recommendations for Dan & Jax to prove guilt."""
        
        strategy = []
        threshold = self.proof_requirements.get((ProofElement.CAUSATION, standard), 
                                               ProofRequirement(ProofElement.CAUSATION, standard, 0.5, [], [], [], [])).threshold
        
        # Identify weak elements
        weak_elements = [elem for elem, prob in element_probabilities.items() if prob < threshold]
        
        strategy.append(f"OPTIMAL STRATEGY FOR DAN & JAX vs {defendant.name.upper()}")
        strategy.append(f"Standard: {standard.value}")
        strategy.append(f"Required threshold: {threshold:.1%}")
        strategy.append("")
        
        # General strategic priorities
        strategy.append("PRIORITY ACTIONS:")
        
        if ProofElement.CAUSATION in weak_elements:
            strategy.extend([
                "1. STRENGTHEN CAUSATION EVIDENCE:",
                "   - Obtain expert testimony on causal mechanisms",
                "   - Document temporal sequence of events", 
                "   - Perform but-for analysis with counterfactuals",
                "   - Rule out intervening causes",
                "   - Gather forensic evidence linking actions to harm"
            ])
        
        if ProofElement.INTENT in weak_elements:
            strategy.extend([
                "2. ESTABLISH INTENT:",
                "   - Subpoena communications and documents",
                "   - Interview witnesses about defendant's statements",
                "   - Analyze pattern of behavior for deliberate conduct",
                "   - Establish motive and opportunity",
                "   - Document planning or preparation activities"
            ])
        
        if ProofElement.KNOWLEDGE in weak_elements:
            strategy.extend([
                "3. PROVE KNOWLEDGE:",
                "   - Obtain training records and industry standards",
                "   - Document warnings or notifications given",
                "   - Show willful blindness or deliberate ignorance",
                "   - Establish constructive knowledge through position/role",
                "   - Interview colleagues about defendant's awareness"
            ])
        
        # Standard-specific strategies
        if standard == BurdenStandard.CRIMINAL:
            strategy.extend([
                "",
                "CRIMINAL STANDARD SPECIFIC TACTICS:",
                "- Ensure evidence meets admissibility standards",
                "- Anticipate and counter reasonable doubt arguments", 
                "- Build cumulative case with multiple evidence types",
                "- Exclude alternative explanations systematically",
                "- Prepare for higher scrutiny of witness credibility"
            ])
        
        elif standard == BurdenStandard.MATHEMATICAL:
            strategy.extend([
                "",
                "MATHEMATICAL STANDARD REQUIREMENTS:",
                "- Construct logical proof using formal methods",
                "- Use counterfactual analysis to show necessity",
                "- Demonstrate invariance across all possible conditions",
                "- Eliminate all logical alternative explanations",
                "- Build deductive argument chain with no gaps"
            ])
        
        # Preemptive defense counters
        strategy.extend([
            "",
            "ANTICIPATED DEFENSES & COUNTERS:",
            "- Intervening cause → Show foreseeability and proximate cause",
            "- Lack of intent → Document circumstantial evidence of intent",
            "- Contributory negligence → Argue comparative fault or last clear chance",
            "- Impossibility → Show reasonable alternatives were available",
            "- Reliance on others → Establish independent duty and knowledge"
        ])
        
        return strategy
    
    def _generate_defense_counter_strategies(self,
                                           defendant: Agent,
                                           element_probabilities: Dict[ProofElement, float],
                                           standard: BurdenStandard) -> List[str]:
        """Generate likely defense strategies to help Dan & Jax prepare."""
        
        counter_strategies = []
        
        counter_strategies.append(f"LIKELY DEFENSE STRATEGIES FOR {defendant.name.upper()}:")
        counter_strategies.append("")
        
        # Analyze weak elements from defense perspective
        strong_elements = [elem for elem, prob in element_probabilities.items() if prob > 0.7]
        weak_elements = [elem for elem, prob in element_probabilities.items() if prob < 0.5]
        
        if ProofElement.CAUSATION not in strong_elements:
            counter_strategies.extend([
                "CAUSATION CHALLENGES:",
                "- Argue intervening superseding cause",
                "- Claim multiple sufficient causes (others more responsible)",
                "- Challenge but-for causation with alternative scenarios",
                "- Argue proximate cause limitation",
                "- Question expert testimony on causal mechanisms"
            ])
        
        if ProofElement.INTENT not in strong_elements:
            counter_strategies.extend([
                "INTENT DEFENSES:",
                "- Claim lack of specific intent",
                "- Argue actions were accidental or negligent only", 
                "- Show reliance on advice of counsel/experts",
                "- Demonstrate mistake of fact or law",
                "- Claim duress or necessity defense"
            ])
        
        if ProofElement.KNOWLEDGE not in strong_elements:
            counter_strategies.extend([
                "KNOWLEDGE DEFENSES:",
                "- Deny actual knowledge of risk/consequences",
                "- Argue reasonable reliance on others' expertise",
                "- Show impossibility of knowledge at relevant time",
                "- Challenge constructive knowledge based on position",
                "- Claim information was not reasonably available"
            ])
        
        # Standard-specific defenses
        if standard == BurdenStandard.CRIMINAL:
            counter_strategies.extend([
                "",
                "CRIMINAL DEFENSE TACTICS:",
                "- Challenge evidence admissibility and chain of custody",
                "- Raise reasonable doubt about each element",
                "- Attack witness credibility and reliability", 
                "- Argue prosecutorial misconduct or bias",
                "- Seek suppression of prejudicial evidence"
            ])
        
        return counter_strategies
    
    # Helper methods for detailed analysis
    def _trace_causal_chains(self, agent_events: List[LegalEvent], harm_events: List[LegalEvent]) -> List[List[str]]:
        """Trace causal chains from agent actions to harm."""
        chains = []
        
        for agent_event in agent_events:
            for harm_event in harm_events:
                chain = self._find_causal_path(agent_event, harm_event, set())
                if chain:
                    chains.append(chain)
        
        return chains
    
    def _find_causal_path(self, start_event: LegalEvent, end_event: LegalEvent, visited: set) -> Optional[List[str]]:
        """Find causal path between two events."""
        if start_event.id == end_event.id:
            return [start_event.id]
        
        if start_event.id in visited:
            return None
        
        visited.add(start_event.id)
        
        for child_id in start_event.causal_children:
            if child_id == end_event.id:
                return [start_event.id, child_id]
            # Would need to implement full graph traversal for complex chains
        
        return None
    
    def _has_logical_causation_proof(self, agent_events: List[LegalEvent], harm_events: List[LegalEvent]) -> bool:
        """Check if there's logical proof of causation."""
        # Simplified - would implement formal logical analysis
        return any(harm.id in event.causal_children for event in agent_events for harm in harm_events)
    
    def _has_specific_intent_evidence(self, agent_events: List[LegalEvent]) -> bool:
        """Check for specific intent evidence."""
        return any("intent" in event.properties and 
                  event.properties["intent"] not in ["accidental", "negligent"] 
                  for event in agent_events)
    
    def _has_logical_intent_proof(self, agent_events: List[LegalEvent]) -> bool:
        """Check for logical proof of intent."""
        return any(event.properties.get("intent") == "deliberate" for event in agent_events)
    
    def _has_actual_knowledge_evidence(self, agent_events: List[LegalEvent]) -> bool:
        """Check for actual knowledge evidence."""
        return any(event.event_type == "observation" or event.epistemic_state 
                  for event in agent_events)
    
    def _has_provable_knowledge(self, agent_events: List[LegalEvent]) -> bool:
        """Check for provable knowledge."""
        return any(event.event_type == "observation" and 
                  "documented" in event.properties.get("evidence_type", "")
                  for event in agent_events)
    
    def generate_comprehensive_report(self,
                                    events: List[LegalEvent],
                                    agents: List[Agent],
                                    norms: List[Norm]) -> Dict[str, Any]:
        """Generate comprehensive burden of proof analysis report for all defendants."""
        
        report = {
            "case_summary": {
                "total_events": len(events),
                "total_agents": len(agents),
                "total_norms": len(norms),
                "prosecution_agents": self.prosecution_agents,
                "defendant_agents": self.defendant_agents,
                "analysis_timestamp": "2024-10-17"
            },
            "standards_analysis": {},
            "strategic_summary": {},
            "evidence_gaps": [],
            "recommendations": []
        }
        
        # Analyze each defendant under each standard
        for defendant_id in self.defendant_agents:
            if any(a.id == defendant_id for a in agents):
                report["standards_analysis"][defendant_id] = {}
                
                for standard in BurdenStandard:
                    analysis = self.analyze_guilt_comprehensive(
                        events, agents, norms, defendant_id, standard
                    )
                    
                    report["standards_analysis"][defendant_id][standard.value] = {
                        "overall_guilt_probability": analysis.overall_guilt_probability,
                        "element_probabilities": {elem.value: prob for elem, prob in analysis.element_probabilities.items()},
                        "proof_gaps": analysis.proof_gaps,
                        "recommended_strategy": analysis.recommended_strategy,
                        "counter_strategies": analysis.counter_strategies
                    }
        
        # Generate strategic summary
        report["strategic_summary"] = self._generate_strategic_summary(report["standards_analysis"])
        
        return report
    
    def _generate_strategic_summary(self, standards_analysis: Dict) -> Dict[str, Any]:
        """Generate high-level strategic summary."""
        summary = {
            "strongest_cases": [],
            "weakest_elements": [],
            "recommended_priorities": [],
            "burden_analysis": {}
        }
        
        # Analyze strength of cases across standards
        for defendant_id, standards in standards_analysis.items():
            for standard, analysis in standards.items():
                case_strength = analysis["overall_guilt_probability"]
                summary["strongest_cases"].append({
                    "defendant": defendant_id,
                    "standard": standard,
                    "strength": case_strength
                })
        
        # Sort and identify priorities
        summary["strongest_cases"].sort(key=lambda x: x["strength"], reverse=True)
        
        summary["recommended_priorities"] = [
            "Focus on civil cases first (lower burden of proof)",
            "Strengthen causation evidence as highest priority",
            "Document intent through communications and conduct patterns",
            "Establish knowledge through position and industry standards",
            "Prepare for escalation to criminal standard if civil case succeeds"
        ]
        
        return summary


def create_sample_case_scenario() -> Tuple[List[LegalEvent], List[Agent], List[Norm]]:
    """Create a sample case scenario involving Dan, Jax, Peter, Rynette, and Bantjies."""
    
    agents = [
        Agent(
            id="dan",
            name="Dan",
            initial_state={"position": "prosecutor", "location": "court"},
            capabilities=["investigate", "present_evidence", "cross_examine"],
            obligations=["prove_case", "seek_justice"],
            knowledge={"legal_standards": True, "case_facts": True}
        ),
        Agent(
            id="jax",
            name="Jax", 
            initial_state={"position": "co_prosecutor", "location": "court"},
            capabilities=["investigate", "present_evidence", "legal_research"],
            obligations=["support_prosecution", "gather_evidence"],
            knowledge={"legal_research": True, "evidence_analysis": True}
        ),
        Agent(
            id="peter",
            name="Peter",
            initial_state={"position": "defendant", "location": "office"},
            capabilities=["make_decisions", "supervise", "allocate_resources"],
            obligations=["corporate_duty_of_care", "regulatory_compliance"],
            knowledge={"safety_requirements": True, "budget_constraints": True}
        ),
        Agent(
            id="rynette",
            name="Rynette",
            initial_state={"position": "safety_manager", "location": "facility"},
            capabilities=["safety_inspections", "report_hazards", "implement_protocols"],
            obligations=["workplace_safety", "hazard_reporting"],
            knowledge={"safety_violations": True, "regulatory_standards": True}
        ),
        Agent(
            id="bantjies",
            name="Bantjies",
            initial_state={"position": "operations_manager", "location": "factory_floor"},
            capabilities=["oversee_operations", "manage_staff", "equipment_maintenance"],
            obligations=["worker_safety", "production_targets"],
            knowledge={"equipment_condition": True, "safety_procedures": True}
        )
    ]
    
    events = [
        # Peter's cost-cutting decision
        LegalEvent(
            id="e1",
            event_type="decision",
            agent_id="peter",
            timestamp=1.0,
            description="Peter cuts safety budget by 30%",
            properties={"action": "budget_cut", "amount": 0.3, "department": "safety"},
            causal_children=["e3", "e4"],
            normative_context=["corporate_duty_of_care"]
        ),
        
        # Rynette discovers safety violation
        LegalEvent(
            id="e2",
            event_type="observation",
            agent_id="rynette",
            timestamp=2.0,
            description="Rynette identifies critical safety hazard",
            properties={"hazard_type": "equipment_failure", "severity": "critical"},
            epistemic_state={"rynette": {"knows_danger": True}},
            causal_children=["e5"]
        ),
        
        # Peter pressures to delay repairs
        LegalEvent(
            id="e3",
            event_type="communication",
            agent_id="peter",
            timestamp=3.0,
            description="Peter instructs to delay expensive safety repairs",
            properties={"message": "delay_repairs", "reason": "cost_savings"},
            causal_parents=["e1"],
            causal_children=["e6"],
            normative_context=["willful_negligence"]
        ),
        
        # Rynette fails to report to authorities
        LegalEvent(
            id="e4",
            event_type="inaction",
            agent_id="rynette",
            timestamp=4.0,
            description="Rynette fails to report safety violation to authorities",
            properties={"omission": "failure_to_report", "knowledge": "critical_hazard"},
            causal_parents=["e2"],
            causal_children=["e7"],
            normative_context=["duty_to_report", "regulatory_violation"]
        ),
        
        # Bantjies implements unsafe procedures
        LegalEvent(
            id="e5",
            event_type="action",
            agent_id="bantjies",
            timestamp=5.0,
            description="Bantjies implements cost-cutting procedures ignoring safety",
            properties={"action": "implement_unsafe_procedures", "motivation": "cost_pressure"},
            causal_parents=["e1", "e3"],
            causal_children=["e7"],
            normative_context=["reckless_endangerment"]
        ),
        
        # Worker injury occurs
        LegalEvent(
            id="e6",
            event_type="harm",
            agent_id="worker_victim",
            timestamp=10.0,
            description="Worker seriously injured due to equipment failure",
            properties={"injury_type": "severe", "cause": "equipment_failure", "preventable": True},
            causal_parents=["e1", "e3", "e4", "e5"]
        ),
        
        # Cover-up attempt
        LegalEvent(
            id="e7",
            event_type="action",
            agent_id="peter",
            timestamp=11.0,
            description="Peter attempts to cover up safety violations",
            properties={"action": "destroy_documents", "intent": "hide_negligence"},
            causal_parents=["e6"],
            normative_context=["obstruction_of_justice", "tampering_with_evidence"]
        )
    ]
    
    norms = [
        Norm(
            id="n1",
            norm_type="obligation",
            description="Corporate duty of care to employees",
            conditions={"role": "corporate_officer", "employees": "present"},
            consequences={"violation": "corporate_negligence"},
            priority=0.95
        ),
        Norm(
            id="n2",
            norm_type="obligation", 
            description="Report critical safety hazards to authorities",
            conditions={"knowledge": "critical_hazard", "position": "safety_officer"},
            consequences={"violation": "regulatory_violation"},
            priority=0.9
        ),
        Norm(
            id="n3",
            norm_type="prohibition",
            description="Do not implement procedures known to be unsafe",
            conditions={"knowledge": "unsafe", "action": "implement"},
            consequences={"violation": "reckless_endangerment"},
            priority=0.85
        ),
        Norm(
            id="n4",
            norm_type="prohibition",
            description="Do not destroy evidence or obstruct justice",
            conditions={"action": "destroy_evidence", "legal_proceeding": "anticipated"},
            consequences={"violation": "obstruction_of_justice"},
            priority=1.0
        )
    ]
    
    return events, agents, norms


if __name__ == "__main__":
    print("Burden of Proof Analysis System for Dan & Jax")
    print("=" * 60)
    
    # Create legal attention engine
    legal_engine = LegalAttentionEngine(d_model=256, n_heads=4, n_layers=4)
    
    # Create burden analyzer
    analyzer = BurdenOfProofAnalyzer(legal_engine)
    
    # Create sample scenario
    events, agents, norms = create_sample_case_scenario()
    
    print(f"\nCase Overview:")
    print(f"- {len(events)} events analyzed")
    print(f"- {len(agents)} agents involved")
    print(f"- {len(norms)} legal norms applicable")
    
    # Generate comprehensive analysis
    print("\nGenerating comprehensive burden of proof analysis...")
    report = analyzer.generate_comprehensive_report(events, agents, norms)
    
    # Display summary
    print("\n" + "="*60)
    print("STRATEGIC ANALYSIS SUMMARY FOR DAN & JAX")
    print("="*60)
    
    print(f"\nProsecution Team: {', '.join(report['case_summary']['prosecution_agents'])}")
    print(f"Defendants: {', '.join(report['case_summary']['defendant_agents'])}")
    
    # Show analysis for each defendant and standard
    for defendant_id, standards in report["standards_analysis"].items():
        print(f"\n{'-'*40}")
        print(f"DEFENDANT: {defendant_id.upper()}")
        print(f"{'-'*40}")
        
        for standard, analysis in standards.items():
            print(f"\n{standard.replace('_', ' ').title()}:")
            print(f"  Overall Guilt Probability: {analysis['overall_guilt_probability']:.1%}")
            
            print("  Element Analysis:")
            for element, prob in analysis["element_probabilities"].items():
                status = "✓" if prob > 0.5 else "⚠"
                print(f"    {status} {element}: {prob:.1%}")
            
            if analysis["proof_gaps"]:
                print("  Proof Gaps:")
                for gap in analysis["proof_gaps"][:3]:  # Show first 3
                    print(f"    - {gap}")
    
    # Show strategic priorities
    print(f"\n{'='*60}")
    print("STRATEGIC RECOMMENDATIONS")
    print("="*60)
    
    for priority in report["strategic_summary"]["recommended_priorities"]:
        print(f"• {priority}")
    
    # Show strongest cases
    print(f"\nStrongest Cases (by probability):")
    for case in report["strategic_summary"]["strongest_cases"][:5]:
        print(f"  {case['defendant']} under {case['standard']}: {case['strength']:.1%}")
    
    print(f"\n{'='*60}")
    print("Analysis complete. Dan & Jax now have comprehensive burden of proof guidance.")
    print("="*60)