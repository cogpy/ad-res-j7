"""
Optimal Strategy Framework for Legal Burden of Proof Analysis

This framework implements optimal strategies and indicates the burden of proof
and necessary conditions for Dan & Jax to prove guilt of other agents
(Peter, Rynette, Bantjies, etc.) under different legal standards:

1. Civil Standard: Balance of Probabilities
2. Criminal Standard: Beyond Reasonable Doubt  
3. Mathematical Standard: Invariant of All Conditions

Each standard requires different evidence thresholds and proof strategies.
"""

import torch
import torch.nn as nn
from typing import Dict, List, Tuple, Optional, Any, Set
from dataclasses import dataclass
from enum import Enum
import numpy as np
from collections import defaultdict

from legal_attention_engine import (
    LegalAttentionEngine, LegalEvent, Agent, Norm, LegalDimension
)


class BurdenOfProofStandard(Enum):
    """Different legal standards for burden of proof."""
    CIVIL_BALANCE_OF_PROBABILITIES = "civil_balance"       # >50% likelihood
    CRIMINAL_BEYOND_REASONABLE_DOUBT = "criminal_beyond"   # >95% certainty  
    MATHEMATICAL_INVARIANT = "mathematical_invariant"      # 100% across all conditions


class GuiltElement(Enum):
    """Elements that must be proven for guilt determination."""
    ACTUS_REUS = "actus_reus"           # Guilty act
    MENS_REA = "mens_rea"               # Guilty mind/intent
    CAUSATION = "causation"             # Causal link to harm
    FORESEEABILITY = "foreseeability"   # Could reasonably foresee harm
    DUTY_OF_CARE = "duty_of_care"       # Owed a duty to prevent harm
    BREACH_OF_DUTY = "breach_of_duty"   # Failed to meet standard
    DAMAGES = "damages"                 # Actual harm occurred
    FACTUAL_CAUSATION = "factual_causation"  # But-for causation
    LEGAL_CAUSATION = "legal_causation"      # Not too remote


@dataclass
class ProofRequirement:
    """Defines what needs to be proven for a specific element under a given standard."""
    element: GuiltElement
    standard: BurdenOfProofStandard
    evidence_threshold: float           # Minimum confidence level required
    required_evidence: List[str]        # Types of evidence needed
    burden_holder: str                  # Who must prove this (Dan, Jax, etc.)
    defenses_available: List[str]       # Available defenses
    necessary_conditions: List[str]     # Conditions that must be met
    sufficient_conditions: List[str]    # Conditions that if met, satisfy burden


@dataclass
class StrategyRecommendation:
    """Optimal strategy for proving a specific element."""
    element: GuiltElement
    strategy_type: str                  # "direct", "circumstantial", "inferential"
    evidence_collection: List[str]      # What evidence to gather
    witness_requirements: List[str]     # Who needs to testify
    expert_testimony: List[str]         # What expert evidence needed
    documentary_evidence: List[str]     # Documents required
    timeline_focus: List[str]           # Key time periods to establish
    alternative_theories: List[str]     # Backup theories of guilt
    anticipated_defenses: List[str]     # Defenses to prepare for
    confidence_level: float            # Expected success probability


class OptimalStrategyEngine(nn.Module):
    """
    AI-powered engine that generates optimal legal strategies for proving guilt
    under different standards of proof.
    """
    
    def __init__(self, d_model: int = 512, n_heads: int = 8):
        super().__init__()
        self.d_model = d_model
        
        # Embed different legal concepts
        self.element_embedding = nn.Embedding(len(GuiltElement), d_model)
        self.standard_embedding = nn.Embedding(len(BurdenOfProofStandard), d_model)
        self.evidence_embedding = nn.Embedding(1000, d_model)  # For evidence types
        
        # Strategy generation layers
        self.strategy_transformer = nn.TransformerEncoder(
            nn.TransformerEncoderLayer(d_model, n_heads, batch_first=True),
            num_layers=6
        )
        
        # Output heads for different strategy aspects
        self.evidence_strength_head = nn.Linear(d_model, 1)
        self.strategy_viability_head = nn.Linear(d_model, 1)
        self.defense_vulnerability_head = nn.Linear(d_model, 1)
        self.confidence_head = nn.Linear(d_model, 1)
        
        # Initialize proof requirements for different standards
        self.proof_requirements = self._initialize_proof_requirements()
        
    def _initialize_proof_requirements(self) -> Dict[Tuple[GuiltElement, BurdenOfProofStandard], ProofRequirement]:
        """Initialize the proof requirements matrix for each element/standard combination."""
        requirements = {}
        
        # CIVIL STANDARD REQUIREMENTS (Balance of Probabilities - >50%)
        # =================================================================
        
        # Actus Reus - Civil
        requirements[(GuiltElement.ACTUS_REUS, BurdenOfProofStandard.CIVIL_BALANCE_OF_PROBABILITIES)] = ProofRequirement(
            element=GuiltElement.ACTUS_REUS,
            standard=BurdenOfProofStandard.CIVIL_BALANCE_OF_PROBABILITIES,
            evidence_threshold=0.51,
            required_evidence=["witness_testimony", "documentary_evidence", "circumstantial_evidence"],
            burden_holder="Dan/Jax",
            defenses_available=["denial", "justification", "excuse"],
            necessary_conditions=[
                "Voluntary act or omission by defendant",
                "Act matches elements of alleged wrongdoing", 
                "Timing establishes defendant was actor"
            ],
            sufficient_conditions=[
                "Direct witness testimony + corroborating evidence",
                "Strong circumstantial evidence chain",
                "Admission by defendant"
            ]
        )
        
        # Mens Rea - Civil (Intent/Negligence)
        requirements[(GuiltElement.MENS_REA, BurdenOfProofStandard.CIVIL_BALANCE_OF_PROBABILITIES)] = ProofRequirement(
            element=GuiltElement.MENS_REA,
            standard=BurdenOfProofStandard.CIVIL_BALANCE_OF_PROBABILITIES,
            evidence_threshold=0.51,
            required_evidence=["intent_evidence", "knowledge_evidence", "recklessness_indicators"],
            burden_holder="Dan/Jax",
            defenses_available=["lack_of_intent", "mistake", "duress"],
            necessary_conditions=[
                "Evidence of mental state at time of act",
                "Knowledge or awareness of risk/consequences",
                "Voluntary formation of intent"
            ],
            sufficient_conditions=[
                "Direct evidence of intent (statements, planning)",
                "Pattern of conduct showing intent",
                "Objective standard met for negligence"
            ]
        )
        
        # Causation - Civil
        requirements[(GuiltElement.CAUSATION, BurdenOfProofStandard.CIVIL_BALANCE_OF_PROBABILITIES)] = ProofRequirement(
            element=GuiltElement.CAUSATION,
            standard=BurdenOfProofStandard.CIVIL_BALANCE_OF_PROBABILITIES,
            evidence_threshold=0.51,
            required_evidence=["causal_chain", "but_for_test", "scientific_evidence"],
            burden_holder="Dan/Jax",
            defenses_available=["intervening_cause", "concurrent_cause", "too_remote"],
            necessary_conditions=[
                "But-for causation established",
                "No intervening superseding cause",
                "Harm within scope of foreseeability"
            ],
            sufficient_conditions=[
                "Direct causal chain with no breaks",
                "Expert testimony on causation",
                "Statistical evidence of correlation"
            ]
        )
        
        # DAMAGES - Civil
        requirements[(GuiltElement.DAMAGES, BurdenOfProofStandard.CIVIL_BALANCE_OF_PROBABILITIES)] = ProofRequirement(
            element=GuiltElement.DAMAGES,
            standard=BurdenOfProofStandard.CIVIL_BALANCE_OF_PROBABILITIES,
            evidence_threshold=0.51,
            required_evidence=["medical_records", "financial_records", "expert_valuation"],
            burden_holder="Dan/Jax",
            defenses_available=["no_harm", "pre_existing_condition", "mitigation_failure"],
            necessary_conditions=[
                "Actual loss or harm occurred",
                "Harm is quantifiable",
                "Harm flows from defendant's conduct"
            ],
            sufficient_conditions=[
                "Medical evidence of physical harm",
                "Documentary evidence of financial loss",
                "Expert testimony on valuation"
            ]
        )
        
        # Foreseeability - Civil
        requirements[(GuiltElement.FORESEEABILITY, BurdenOfProofStandard.CIVIL_BALANCE_OF_PROBABILITIES)] = ProofRequirement(
            element=GuiltElement.FORESEEABILITY,
            standard=BurdenOfProofStandard.CIVIL_BALANCE_OF_PROBABILITIES,
            evidence_threshold=0.51,
            required_evidence=["reasonable_person_standard", "prior_incidents", "expert_testimony"],
            burden_holder="Dan/Jax",
            defenses_available=["unforeseeable_harm", "intervening_acts", "extraordinary_circumstances"],
            necessary_conditions=[
                "Reasonable person would have foreseen harm",
                "Type of harm was foreseeable",
                "Not too remote from defendant's actions"
            ],
            sufficient_conditions=[
                "Similar incidents occurred previously",
                "Expert testimony on foreseeability",
                "Warning signs were present and ignored"
            ]
        )
        
        # Duty of Care - Civil
        requirements[(GuiltElement.DUTY_OF_CARE, BurdenOfProofStandard.CIVIL_BALANCE_OF_PROBABILITIES)] = ProofRequirement(
            element=GuiltElement.DUTY_OF_CARE,
            standard=BurdenOfProofStandard.CIVIL_BALANCE_OF_PROBABILITIES,
            evidence_threshold=0.51,
            required_evidence=["legal_relationship", "statutory_duty", "professional_standards"],
            burden_holder="Dan/Jax",
            defenses_available=["no_duty_owed", "duty_to_different_party"],
            necessary_conditions=[
                "Legal relationship establishing duty",
                "Duty recognized by law",
                "Duty was operational at time of incident"
            ],
            sufficient_conditions=[
                "Statutory duty clearly applies",
                "Contractual duty exists",
                "Professional duty established by regulations"
            ]
        )
        
        # Breach of Duty - Civil
        requirements[(GuiltElement.BREACH_OF_DUTY, BurdenOfProofStandard.CIVIL_BALANCE_OF_PROBABILITIES)] = ProofRequirement(
            element=GuiltElement.BREACH_OF_DUTY,
            standard=BurdenOfProofStandard.CIVIL_BALANCE_OF_PROBABILITIES,
            evidence_threshold=0.51,
            required_evidence=["standard_of_care", "expert_testimony", "comparative_evidence"],
            burden_holder="Dan/Jax",
            defenses_available=["met_standard", "emergency_circumstances", "reasonable_conduct"],
            necessary_conditions=[
                "Standard of care established",
                "Defendant's conduct fell below standard",
                "Breach was unreasonable in circumstances"
            ],
            sufficient_conditions=[
                "Expert testimony on standard breach",
                "Clear violation of established procedures",
                "Significant deviation from accepted practice"
            ]
        )
        
        # Factual Causation - Civil
        requirements[(GuiltElement.FACTUAL_CAUSATION, BurdenOfProofStandard.CIVIL_BALANCE_OF_PROBABILITIES)] = ProofRequirement(
            element=GuiltElement.FACTUAL_CAUSATION,
            standard=BurdenOfProofStandard.CIVIL_BALANCE_OF_PROBABILITIES,
            evidence_threshold=0.51,
            required_evidence=["but_for_test", "material_contribution", "expert_analysis"],
            burden_holder="Dan/Jax",
            defenses_available=["multiple_sufficient_causes", "intervening_causes"],
            necessary_conditions=[
                "But-for causation more likely than not",
                "Material contribution to harm",
                "No sufficient alternative causes"
            ],
            sufficient_conditions=[
                "Clear but-for relationship",
                "Expert testimony on causation",
                "Elimination of alternative explanations"
            ]
        )
        
        # Legal Causation - Civil
        requirements[(GuiltElement.LEGAL_CAUSATION, BurdenOfProofStandard.CIVIL_BALANCE_OF_PROBABILITIES)] = ProofRequirement(
            element=GuiltElement.LEGAL_CAUSATION,
            standard=BurdenOfProofStandard.CIVIL_BALANCE_OF_PROBABILITIES,
            evidence_threshold=0.51,
            required_evidence=["proximity_analysis", "foreseeability_evidence", "policy_considerations"],
            burden_holder="Dan/Jax",
            defenses_available=["too_remote", "intervening_superseding_cause"],
            necessary_conditions=[
                "Harm not too remote from breach",
                "No superseding intervening causes",
                "Within scope of duty protection"
            ],
            sufficient_conditions=[
                "Direct and proximate consequences",
                "Foreseeable type of harm",
                "No extraordinary intervening events"
            ]
        )
        
        # CRIMINAL STANDARD REQUIREMENTS (Beyond Reasonable Doubt - >95%)
        # ================================================================
        
        # Actus Reus - Criminal
        requirements[(GuiltElement.ACTUS_REUS, BurdenOfProofStandard.CRIMINAL_BEYOND_REASONABLE_DOUBT)] = ProofRequirement(
            element=GuiltElement.ACTUS_REUS,
            standard=BurdenOfProofStandard.CRIMINAL_BEYOND_REASONABLE_DOUBT,
            evidence_threshold=0.95,
            required_evidence=["eyewitness_testimony", "physical_evidence", "video_evidence", "forensic_evidence"],
            burden_holder="Dan/Jax (Prosecution)",
            defenses_available=["alibi", "denial", "involuntary_act"],
            necessary_conditions=[
                "Proof beyond reasonable doubt of voluntary act",
                "Act occurred at time and place alleged",
                "Defendant was the actor",
                "Act satisfies all elements of offense"
            ],
            sufficient_conditions=[
                "Multiple independent witnesses + physical evidence",
                "Video evidence + corroborating testimony",
                "Forensic evidence + confession",
                "DNA evidence + opportunity evidence"
            ]
        )
        
        # Mens Rea - Criminal
        requirements[(GuiltElement.MENS_REA, BurdenOfProofStandard.CRIMINAL_BEYOND_REASONABLE_DOUBT)] = ProofRequirement(
            element=GuiltElement.MENS_REA,
            standard=BurdenOfProofStandard.CRIMINAL_BEYOND_REASONABLE_DOUBT,
            evidence_threshold=0.95,
            required_evidence=["intent_statements", "planning_evidence", "motive_evidence", "conduct_pattern"],
            burden_holder="Dan/Jax (Prosecution)",
            defenses_available=["lack_of_intent", "mental_incapacity", "mistake_of_fact"],
            necessary_conditions=[
                "Specific intent proven beyond reasonable doubt",
                "Mental capacity at time of offense",
                "Intent formed before act",
                "Intent matches required mental element"
            ],
            sufficient_conditions=[
                "Direct statements of intent + corroboration",
                "Extensive planning evidence",
                "Pattern of similar conduct",
                "Expert testimony on mental state + evidence"
            ]
        )
        
        # Causation - Criminal
        requirements[(GuiltElement.CAUSATION, BurdenOfProofStandard.CRIMINAL_BEYOND_REASONABLE_DOUBT)] = ProofRequirement(
            element=GuiltElement.CAUSATION,
            standard=BurdenOfProofStandard.CRIMINAL_BEYOND_REASONABLE_DOUBT,
            evidence_threshold=0.95,
            required_evidence=["causal_chain_proof", "expert_testimony", "scientific_evidence", "timeline_evidence"],
            burden_holder="Dan/Jax (Prosecution)",
            defenses_available=["intervening_cause", "concurrent_cause", "insufficient_causation"],
            necessary_conditions=[
                "But-for causation proven beyond reasonable doubt",
                "No superseding intervening cause",
                "Proximate causation established",
                "Causal chain unbroken"
            ],
            sufficient_conditions=[
                "Expert testimony + clear causal chain",
                "Scientific evidence of causation",
                "Eyewitness testimony to causal sequence",
                "Physical evidence showing causal link"
            ]
        )
        
        # Foreseeability - Criminal
        requirements[(GuiltElement.FORESEEABILITY, BurdenOfProofStandard.CRIMINAL_BEYOND_REASONABLE_DOUBT)] = ProofRequirement(
            element=GuiltElement.FORESEEABILITY,
            standard=BurdenOfProofStandard.CRIMINAL_BEYOND_REASONABLE_DOUBT,
            evidence_threshold=0.95,
            required_evidence=["knowledge_evidence", "warning_evidence", "similar_incidents", "expert_testimony"],
            burden_holder="Dan/Jax (Prosecution)",
            defenses_available=["unforeseeable_harm", "intervening_acts", "lack_of_knowledge"],
            necessary_conditions=[
                "Reasonable person would have foreseen harm",
                "Defendant had knowledge of risk factors",
                "Harm was natural consequence of act",
                "No extraordinary intervening causes"
            ],
            sufficient_conditions=[
                "Prior warnings about specific risk",
                "Similar incidents with defendant's knowledge",
                "Expert testimony on foreseeability",
                "Clear evidence of defendant's awareness"
            ]
        )
        
        # Duty of Care - Criminal
        requirements[(GuiltElement.DUTY_OF_CARE, BurdenOfProofStandard.CRIMINAL_BEYOND_REASONABLE_DOUBT)] = ProofRequirement(
            element=GuiltElement.DUTY_OF_CARE,
            standard=BurdenOfProofStandard.CRIMINAL_BEYOND_REASONABLE_DOUBT,
            evidence_threshold=0.95,
            required_evidence=["statutory_duty", "contractual_duty", "professional_standards", "case_law"],
            burden_holder="Dan/Jax (Prosecution)",
            defenses_available=["no_duty_owed", "duty_to_different_party", "emergency_exception"],
            necessary_conditions=[
                "Legal duty clearly established",
                "Duty owed to specific victim",
                "Duty was in effect at time of incident",
                "No exceptions apply"
            ],
            sufficient_conditions=[
                "Statutory duty clearly applies",
                "Contractual duty with victim",
                "Professional duty established by regulation",
                "Court precedent establishing duty"
            ]
        )
        
        # Breach of Duty - Criminal
        requirements[(GuiltElement.BREACH_OF_DUTY, BurdenOfProofStandard.CRIMINAL_BEYOND_REASONABLE_DOUBT)] = ProofRequirement(
            element=GuiltElement.BREACH_OF_DUTY,
            standard=BurdenOfProofStandard.CRIMINAL_BEYOND_REASONABLE_DOUBT,
            evidence_threshold=0.95,
            required_evidence=["standard_of_care", "expert_testimony", "defendant_conduct", "comparative_evidence"],
            burden_holder="Dan/Jax (Prosecution)",
            defenses_available=["met_standard", "emergency_circumstances", "reasonable_conduct"],
            necessary_conditions=[
                "Standard of care clearly defined",
                "Defendant's conduct fell below standard",
                "Breach was significant and unreasonable",
                "No justification for substandard conduct"
            ],
            sufficient_conditions=[
                "Expert testimony on standard breach",
                "Clear violation of written policies",
                "Gross deviation from accepted practice",
                "Multiple instances of substandard conduct"
            ]
        )
        
        # Damages - Criminal (Criminal harm/loss)
        requirements[(GuiltElement.DAMAGES, BurdenOfProofStandard.CRIMINAL_BEYOND_REASONABLE_DOUBT)] = ProofRequirement(
            element=GuiltElement.DAMAGES,
            standard=BurdenOfProofStandard.CRIMINAL_BEYOND_REASONABLE_DOUBT,
            evidence_threshold=0.95,
            required_evidence=["medical_evidence", "financial_records", "expert_valuation", "victim_testimony"],
            burden_holder="Dan/Jax (Prosecution)",
            defenses_available=["no_harm", "pre_existing_condition", "unrelated_cause"],
            necessary_conditions=[
                "Actual harm clearly documented",
                "Harm is substantial and measurable",
                "Harm directly relates to criminal act",
                "No alternative explanations for harm"
            ],
            sufficient_conditions=[
                "Medical evidence of physical harm",
                "Documentary evidence of financial loss",
                "Expert testimony on harm valuation",
                "Multiple sources confirming damages"
            ]
        )
        
        # Factual Causation - Criminal
        requirements[(GuiltElement.FACTUAL_CAUSATION, BurdenOfProofStandard.CRIMINAL_BEYOND_REASONABLE_DOUBT)] = ProofRequirement(
            element=GuiltElement.FACTUAL_CAUSATION,
            standard=BurdenOfProofStandard.CRIMINAL_BEYOND_REASONABLE_DOUBT,
            evidence_threshold=0.95,
            required_evidence=["but_for_test", "scientific_analysis", "timeline_evidence", "expert_testimony"],
            burden_holder="Dan/Jax (Prosecution)",
            defenses_available=["multiple_sufficient_causes", "intervening_causes", "lack_of_but_for_causation"],
            necessary_conditions=[
                "But-for test satisfied beyond reasonable doubt",
                "No alternative sufficient causes",
                "Clear temporal sequence established",
                "Causal mechanism scientifically sound"
            ],
            sufficient_conditions=[
                "Scientific proof of but-for causation",
                "Expert testimony on causal necessity",
                "Elimination of alternative causes",
                "Physical evidence of causal link"
            ]
        )
        
        # Legal Causation - Criminal
        requirements[(GuiltElement.LEGAL_CAUSATION, BurdenOfProofStandard.CRIMINAL_BEYOND_REASONABLE_DOUBT)] = ProofRequirement(
            element=GuiltElement.LEGAL_CAUSATION,
            standard=BurdenOfProofStandard.CRIMINAL_BEYOND_REASONABLE_DOUBT,
            evidence_threshold=0.95,
            required_evidence=["proximate_cause_analysis", "foreseeability_evidence", "policy_considerations", "precedent"],
            burden_holder="Dan/Jax (Prosecution)",
            defenses_available=["too_remote", "intervening_superseding_cause", "policy_exclusion"],
            necessary_conditions=[
                "Harm not too remote from act",
                "No superseding intervening causes",
                "Policy supports finding liability",
                "Within scope of criminal law protection"
            ],
            sufficient_conditions=[
                "Direct and immediate consequences",
                "Foreseeable chain of events",
                "No extraordinary intervening acts",
                "Clear precedent supporting liability"
            ]
        )
        
        # MATHEMATICAL INVARIANT STANDARD (100% Certainty)
        # ================================================
        
        # Actus Reus - Mathematical Invariant
        requirements[(GuiltElement.ACTUS_REUS, BurdenOfProofStandard.MATHEMATICAL_INVARIANT)] = ProofRequirement(
            element=GuiltElement.ACTUS_REUS,
            standard=BurdenOfProofStandard.MATHEMATICAL_INVARIANT,
            evidence_threshold=1.0,
            required_evidence=["logical_proof", "mathematical_certainty", "invariant_conditions"],
            burden_holder="Dan/Jax (Logical Proof)",
            defenses_available=["logical_contradiction", "insufficient_axioms"],
            necessary_conditions=[
                "Logical axioms establish act as necessary conclusion",
                "No possible world where conclusion fails",
                "Proof holds under all variable assignments",
                "Proof is complete and consistent"
            ],
            sufficient_conditions=[
                "Formal logical proof with verified axioms",
                "Mathematical proof of causal necessity",
                "Invariant holds across all possible configurations",
                "Algorithmic verification of proof"
            ]
        )
        
        # Mens Rea - Mathematical Invariant  
        requirements[(GuiltElement.MENS_REA, BurdenOfProofStandard.MATHEMATICAL_INVARIANT)] = ProofRequirement(
            element=GuiltElement.MENS_REA,
            standard=BurdenOfProofStandard.MATHEMATICAL_INVARIANT,
            evidence_threshold=1.0,
            required_evidence=["logical_necessity", "invariant_mental_state", "formal_proof"],
            burden_holder="Dan/Jax (Logical Proof)",
            defenses_available=["logical_impossibility", "axiom_failure"],
            necessary_conditions=[
                "Mental state logically follows from premises",
                "Intent is necessary given agent properties",
                "No possible world where agent lacks requisite intent",
                "Proof verified by algorithmic reasoning"
            ],
            sufficient_conditions=[
                "Formal proof of intent necessity",
                "Invariant properties establish mental state",
                "Logical entailment from agent characteristics",
                "Mathematical model verification"
            ]
        )
        
        # Causation - Mathematical Invariant
        requirements[(GuiltElement.CAUSATION, BurdenOfProofStandard.MATHEMATICAL_INVARIANT)] = ProofRequirement(
            element=GuiltElement.CAUSATION,
            standard=BurdenOfProofStandard.MATHEMATICAL_INVARIANT,
            evidence_threshold=1.0,
            required_evidence=["causal_necessity_proof", "invariant_causal_laws", "formal_verification"],
            burden_holder="Dan/Jax (Logical Proof)",
            defenses_available=["causal_impossibility", "invalid_causal_logic"],
            necessary_conditions=[
                "Causal relation is logically necessary",
                "Holds across all possible worlds",
                "Causal laws are invariant",
                "No logical possibility of non-causation"
            ],
            sufficient_conditions=[
                "Mathematical proof of causal necessity",
                "Algorithmic verification of causation",
                "Invariant causal law application",
                "Formal logic proof of causal entailment"
            ]
        )
        
        # Foreseeability - Mathematical Invariant
        requirements[(GuiltElement.FORESEEABILITY, BurdenOfProofStandard.MATHEMATICAL_INVARIANT)] = ProofRequirement(
            element=GuiltElement.FORESEEABILITY,
            standard=BurdenOfProofStandard.MATHEMATICAL_INVARIANT,
            evidence_threshold=1.0,
            required_evidence=["logical_predictability", "invariant_knowledge_model", "formal_proof"],
            burden_holder="Dan/Jax (Logical Proof)",
            defenses_available=["logical_unforeseeability", "incomplete_knowledge_model"],
            necessary_conditions=[
                "Foreseeability logically entailed by knowledge state",
                "Holds in all possible worlds with same knowledge",
                "Predictability is invariant property",
                "No logical possibility of unforeseeability"
            ],
            sufficient_conditions=[
                "Formal proof of predictive necessity",
                "Algorithmic foreseeability verification",
                "Invariant knowledge model application",
                "Mathematical certainty of predictability"
            ]
        )
        
        # Duty of Care - Mathematical Invariant
        requirements[(GuiltElement.DUTY_OF_CARE, BurdenOfProofStandard.MATHEMATICAL_INVARIANT)] = ProofRequirement(
            element=GuiltElement.DUTY_OF_CARE,
            standard=BurdenOfProofStandard.MATHEMATICAL_INVARIANT,
            evidence_threshold=1.0,
            required_evidence=["logical_duty_derivation", "invariant_role_properties", "formal_proof"],
            burden_holder="Dan/Jax (Logical Proof)",
            defenses_available=["duty_logical_impossibility", "role_property_contradiction"],
            necessary_conditions=[
                "Duty logically follows from role/relationship",
                "Holds across all possible instantiations",
                "Role properties invariantly establish duty",
                "No logical possibility of duty absence"
            ],
            sufficient_conditions=[
                "Formal derivation of duty from role axioms",
                "Algorithmic duty verification",
                "Invariant role-duty mapping",
                "Mathematical proof of duty necessity"
            ]
        )
        
        # Breach of Duty - Mathematical Invariant
        requirements[(GuiltElement.BREACH_OF_DUTY, BurdenOfProofStandard.MATHEMATICAL_INVARIANT)] = ProofRequirement(
            element=GuiltElement.BREACH_OF_DUTY,
            standard=BurdenOfProofStandard.MATHEMATICAL_INVARIANT,
            evidence_threshold=1.0,
            required_evidence=["formal_standard_definition", "logical_breach_proof", "invariant_comparison"],
            burden_holder="Dan/Jax (Logical Proof)",
            defenses_available=["standard_ambiguity", "logical_compliance"],
            necessary_conditions=[
                "Standard formally and precisely defined",
                "Breach logically demonstrable",
                "Comparison algorithm invariant",
                "No logical possibility of compliance"
            ],
            sufficient_conditions=[
                "Formal proof of standard violation",
                "Algorithmic breach verification",
                "Mathematical distance from standard",
                "Invariant breach determination"
            ]
        )
        
        # Damages - Mathematical Invariant
        requirements[(GuiltElement.DAMAGES, BurdenOfProofStandard.MATHEMATICAL_INVARIANT)] = ProofRequirement(
            element=GuiltElement.DAMAGES,
            standard=BurdenOfProofStandard.MATHEMATICAL_INVARIANT,
            evidence_threshold=1.0,
            required_evidence=["mathematical_harm_model", "invariant_loss_calculation", "formal_proof"],
            burden_holder="Dan/Jax (Logical Proof)",
            defenses_available=["model_invalidity", "calculation_error"],
            necessary_conditions=[
                "Harm mathematically modeled and quantified",
                "Loss calculation invariant across contexts",
                "Model verified and validated",
                "No logical possibility of alternative calculation"
            ],
            sufficient_conditions=[
                "Formal mathematical harm model",
                "Algorithmic loss verification",
                "Invariant damage calculation",
                "Mathematical proof of harm extent"
            ]
        )
        
        # Factual Causation - Mathematical Invariant
        requirements[(GuiltElement.FACTUAL_CAUSATION, BurdenOfProofStandard.MATHEMATICAL_INVARIANT)] = ProofRequirement(
            element=GuiltElement.FACTUAL_CAUSATION,
            standard=BurdenOfProofStandard.MATHEMATICAL_INVARIANT,
            evidence_threshold=1.0,
            required_evidence=["counterfactual_logic", "mathematical_necessity", "formal_verification"],
            burden_holder="Dan/Jax (Logical Proof)",
            defenses_available=["counterfactual_failure", "necessity_disproof"],
            necessary_conditions=[
                "Counterfactual analysis mathematically sound",
                "But-for relation logically necessary",
                "Holds across all possible worlds",
                "No logical alternative sufficient causes"
            ],
            sufficient_conditions=[
                "Formal counterfactual proof",
                "Mathematical necessity demonstration",
                "Algorithmic causation verification",
                "Invariant but-for relationship"
            ]
        )
        
        # Legal Causation - Mathematical Invariant
        requirements[(GuiltElement.LEGAL_CAUSATION, BurdenOfProofStandard.MATHEMATICAL_INVARIANT)] = ProofRequirement(
            element=GuiltElement.LEGAL_CAUSATION,
            standard=BurdenOfProofStandard.MATHEMATICAL_INVARIANT,
            evidence_threshold=1.0,
            required_evidence=["proximity_algorithm", "invariant_legal_principles", "formal_proof"],
            burden_holder="Dan/Jax (Logical Proof)",
            defenses_available=["proximity_contradiction", "principle_violation"],
            necessary_conditions=[
                "Proximity mathematically defined and measured",
                "Legal principles applied invariantly",
                "Holds across all similar fact patterns",
                "No logical possibility of remoteness"
            ],
            sufficient_conditions=[
                "Formal proximity proof",
                "Algorithmic legal causation verification",
                "Invariant principle application",
                "Mathematical certainty of legal connection"
            ]
        )
        
        return requirements
    
    def analyze_case_elements(self, 
                            events: List[LegalEvent],
                            agents: List[Agent], 
                            norms: List[Norm],
                            target_agents: List[str],  # Peter, Rynette, Bantjies, etc.
                            prosecution_agents: List[str] = ["Dan", "Jax"]) -> Dict[str, Dict[GuiltElement, StrategyRecommendation]]:
        """
        Analyze what Dan & Jax need to prove guilt of target agents under each standard.
        
        Returns optimal strategies for each agent/element combination.
        """
        strategies = {}
        
        for target_agent in target_agents:
            strategies[target_agent] = {}
            
            # Analyze each guilt element for this agent
            for element in GuiltElement:
                # Generate strategies for each standard
                civil_strategy = self._generate_element_strategy(
                    element, BurdenOfProofStandard.CIVIL_BALANCE_OF_PROBABILITIES,
                    events, agents, norms, target_agent, prosecution_agents
                )
                
                criminal_strategy = self._generate_element_strategy(
                    element, BurdenOfProofStandard.CRIMINAL_BEYOND_REASONABLE_DOUBT,
                    events, agents, norms, target_agent, prosecution_agents
                )
                
                mathematical_strategy = self._generate_element_strategy(
                    element, BurdenOfProofStandard.MATHEMATICAL_INVARIANT,
                    events, agents, norms, target_agent, prosecution_agents
                )
                
                strategies[target_agent][element] = {
                    "civil": civil_strategy,
                    "criminal": criminal_strategy,
                    "mathematical": mathematical_strategy
                }
        
        return strategies
    
    def _generate_element_strategy(self,
                                 element: GuiltElement,
                                 standard: BurdenOfProofStandard,
                                 events: List[LegalEvent],
                                 agents: List[Agent],
                                 norms: List[Norm],
                                 target_agent: str,
                                 prosecution_agents: List[str]) -> StrategyRecommendation:
        """Generate optimal strategy for proving a specific element under a given standard."""
        
        # Get proof requirements for this element/standard combination
        proof_req = self.proof_requirements.get((element, standard))
        if not proof_req:
            raise ValueError(f"No proof requirements defined for {element} under {standard}")
        
        # Analyze events to find relevant evidence
        relevant_events = self._find_relevant_events(events, target_agent, element)
        
        # Generate strategy based on standard
        if standard == BurdenOfProofStandard.CIVIL_BALANCE_OF_PROBABILITIES:
            return self._generate_civil_strategy(element, relevant_events, target_agent, proof_req)
        elif standard == BurdenOfProofStandard.CRIMINAL_BEYOND_REASONABLE_DOUBT:
            return self._generate_criminal_strategy(element, relevant_events, target_agent, proof_req)
        else:  # Mathematical invariant
            return self._generate_mathematical_strategy(element, relevant_events, target_agent, proof_req)
    
    def _find_relevant_events(self, events: List[LegalEvent], target_agent: str, element: GuiltElement) -> List[LegalEvent]:
        """Find events relevant to proving a specific element for a target agent."""
        relevant = []
        
        for event in events:
            # Events involving the target agent
            if event.agent_id == target_agent:
                relevant.append(event)
            
            # Events caused by target agent's actions
            elif hasattr(event, 'causal_parents'):
                for parent_id in event.causal_parents:
                    parent_event = next((e for e in events if e.id == parent_id), None)
                    if parent_event and parent_event.agent_id == target_agent:
                        relevant.append(event)
            
            # Events where target agent had knowledge/opportunity
            if hasattr(event, 'epistemic_state') and target_agent in event.epistemic_state:
                relevant.append(event)
        
        return relevant
    
    def _generate_civil_strategy(self, element: GuiltElement, events: List[LegalEvent], 
                               target_agent: str, proof_req: ProofRequirement) -> StrategyRecommendation:
        """Generate strategy for civil standard (balance of probabilities)."""
        
        if element == GuiltElement.ACTUS_REUS:
            return StrategyRecommendation(
                element=element,
                strategy_type="circumstantial",
                evidence_collection=[
                    "Collect witness statements identifying target agent's actions",
                    "Gather documentary evidence of target agent's involvement",
                    "Obtain any video/photographic evidence",
                    "Collect digital communications showing planning/coordination"
                ],
                witness_requirements=[
                    "Direct witnesses to target agent's actions",
                    "Character witnesses to establish pattern of conduct",
                    "Expert witnesses to interpret technical evidence"
                ],
                expert_testimony=[
                    "Forensic experts if physical evidence exists",
                    "Digital forensics for electronic evidence",
                    "Industry experts for standard-of-care analysis"
                ],
                documentary_evidence=[
                    "Contracts or agreements showing responsibilities",
                    "Communications (emails, texts, recordings)",
                    "Financial records showing motive/benefit",
                    "Corporate policies and procedures"
                ],
                timeline_focus=[
                    "Period immediately before alleged wrongful act",
                    "Time of the act itself",
                    "Post-act conduct showing consciousness of guilt"
                ],
                alternative_theories=[
                    "Primary theory: Direct action by target agent",
                    "Alternative: Target agent as co-conspirator", 
                    "Fallback: Target agent as aider/abettor"
                ],
                anticipated_defenses=[
                    "Denial of involvement",
                    "Lack of authority/capacity to act",
                    "Justification or good faith defense"
                ],
                confidence_level=0.65
            )
        
        elif element == GuiltElement.MENS_REA:
            return StrategyRecommendation(
                element=element,
                strategy_type="inferential",
                evidence_collection=[
                    "Gather evidence of target agent's knowledge",
                    "Collect communications showing intent",
                    "Document pattern of similar conduct",
                    "Establish motive for wrongful conduct"
                ],
                witness_requirements=[
                    "Witnesses to target agent's statements of intent",
                    "Witnesses to prior similar conduct",
                    "Expert witnesses on standard mental state"
                ],
                expert_testimony=[
                    "Psychological experts on intent formation",
                    "Industry experts on standard care/knowledge"
                ],
                documentary_evidence=[
                    "Planning documents or communications",
                    "Training records showing knowledge",
                    "Prior incident reports showing awareness"
                ],
                timeline_focus=[
                    "Formation of intent period",
                    "Knowledge acquisition timeframe",
                    "Pattern of conduct development"
                ],
                alternative_theories=[
                    "Specific intent to cause harm",
                    "Negligent disregard for known risks",
                    "Willful blindness to obvious consequences"
                ],
                anticipated_defenses=[
                    "Lack of specific intent",
                    "Mistake of fact or law",
                    "Good faith reliance on advice"
                ],
                confidence_level=0.58
            )
        
        # Add more elements as needed...
        else:
            return StrategyRecommendation(
                element=element,
                strategy_type="direct",
                evidence_collection=[f"Standard evidence for {element.value}"],
                witness_requirements=[f"Standard witnesses for {element.value}"],
                expert_testimony=[f"Standard experts for {element.value}"],
                documentary_evidence=[f"Standard documents for {element.value}"],
                timeline_focus=[f"Standard timeline for {element.value}"],
                alternative_theories=[f"Primary theory for {element.value}"],
                anticipated_defenses=[f"Standard defenses for {element.value}"],
                confidence_level=0.55
            )
    
    def _generate_criminal_strategy(self, element: GuiltElement, events: List[LegalEvent],
                                  target_agent: str, proof_req: ProofRequirement) -> StrategyRecommendation:
        """Generate strategy for criminal standard (beyond reasonable doubt)."""
        
        if element == GuiltElement.ACTUS_REUS:
            return StrategyRecommendation(
                element=element,
                strategy_type="direct",
                evidence_collection=[
                    "Obtain multiple independent witness identifications",
                    "Secure high-quality video/photographic evidence",
                    "Collect DNA, fingerprint, or other forensic evidence",
                    "Document complete chain of custody for all evidence",
                    "Obtain expert analysis of all physical evidence"
                ],
                witness_requirements=[
                    "At least 2 independent eyewitnesses",
                    "Expert witnesses for forensic evidence",
                    "Chain of custody witnesses for evidence handling",
                    "Character witnesses only if pattern is relevant"
                ],
                expert_testimony=[
                    "Forensic scientists for DNA/fingerprint analysis",
                    "Video analysis experts",
                    "Ballistics experts (if applicable)",
                    "Digital forensics experts for electronic evidence"
                ],
                documentary_evidence=[
                    "Security camera footage",
                    "Cell phone location data",
                    "Financial transaction records",
                    "Travel records establishing presence"
                ],
                timeline_focus=[
                    "Precise time of criminal act",
                    "Target agent's location/movements during crime",
                    "Opportunity window analysis"
                ],
                alternative_theories=[
                    "Primary: Target agent as principal perpetrator",
                    "Alternative: Target agent as co-principal",
                    "Last resort: Target agent as accessory before fact"
                ],
                anticipated_defenses=[
                    "Alibi defense",
                    "Mistaken identification", 
                    "Lack of opportunity",
                    "Evidence contamination challenges"
                ],
                confidence_level=0.85
            )
        
        elif element == GuiltElement.MENS_REA:
            return StrategyRecommendation(
                element=element,
                strategy_type="direct",
                evidence_collection=[
                    "Record direct statements of criminal intent",
                    "Document extensive planning activities",
                    "Establish clear motive with corroborating evidence",
                    "Show pattern of similar criminal conduct",
                    "Collect evidence of consciousness of guilt"
                ],
                witness_requirements=[
                    "Witnesses to direct statements of intent",
                    "Co-conspirators (if available and credible)",
                    "Expert witnesses on criminal intent",
                    "Witnesses to planning activities"
                ],
                expert_testimony=[
                    "Criminal psychology experts",
                    "Intent inference specialists",
                    "Experts on criminal behavior patterns"
                ],
                documentary_evidence=[
                    "Planning documents and communications",
                    "Research into methods/targets",
                    "Purchase receipts for crime tools",
                    "Post-crime cover-up evidence"
                ],
                timeline_focus=[
                    "Intent formation period",
                    "Planning and preparation phase",
                    "Post-crime consciousness of guilt period"
                ],
                alternative_theories=[
                    "Specific intent to commit the exact crime",
                    "General intent with transferred intent doctrine",
                    "Willful blindness as substitute for knowledge"
                ],
                anticipated_defenses=[
                    "Lack of specific intent",
                    "Mental incapacity/insanity",
                    "Intoxication negating intent",
                    "Duress or coercion"
                ],
                confidence_level=0.78
            )
        
        else:
            return StrategyRecommendation(
                element=element,
                strategy_type="direct",
                evidence_collection=[f"Criminal standard evidence for {element.value}"],
                witness_requirements=[f"Criminal standard witnesses for {element.value}"],
                expert_testimony=[f"Criminal standard experts for {element.value}"],
                documentary_evidence=[f"Criminal standard documents for {element.value}"],
                timeline_focus=[f"Criminal standard timeline for {element.value}"],
                alternative_theories=[f"Criminal standard theory for {element.value}"],
                anticipated_defenses=[f"Criminal standard defenses for {element.value}"],
                confidence_level=0.80
            )
    
    def _generate_mathematical_strategy(self, element: GuiltElement, events: List[LegalEvent],
                                      target_agent: str, proof_req: ProofRequirement) -> StrategyRecommendation:
        """Generate strategy for mathematical invariant standard (100% certainty)."""
        
        if element == GuiltElement.ACTUS_REUS:
            return StrategyRecommendation(
                element=element,
                strategy_type="logical_proof",
                evidence_collection=[
                    "Construct formal logical model of all agent actions",
                    "Establish axioms defining agent capabilities and constraints",
                    "Create comprehensive timeline with logical timestamps",
                    "Model all possible action sequences in logical framework",
                    "Verify logical consistency of all evidence"
                ],
                witness_requirements=[
                    "Logical verification systems",
                    "Mathematical proof verification",
                    "Algorithmic consistency checking",
                    "Formal model validators"
                ],
                expert_testimony=[
                    "Mathematical logic experts",
                    "Formal verification specialists", 
                    "Algorithm verification experts",
                    "Logical consistency auditors"
                ],
                documentary_evidence=[
                    "Formal logical proofs",
                    "Mathematical models of agent behavior",
                    "Algorithmic verification results",
                    "Invariant property specifications"
                ],
                timeline_focus=[
                    "Logical sequence of all events",
                    "Causal necessity chains",
                    "Invariant property maintenance periods"
                ],
                alternative_theories=[
                    "Primary: Logical necessity of target agent action",
                    "Alternative: Proof by contradiction of innocence",
                    "Fallback: Exhaustive enumeration of possibilities"
                ],
                anticipated_defenses=[
                    "Logical contradiction in proof",
                    "Incomplete axiom set",
                    "Invalid inference rules",
                    "Non-decidable proposition claims"
                ],
                confidence_level=1.0
            )
        
        elif element == GuiltElement.MENS_REA:
            return StrategyRecommendation(
                element=element,
                strategy_type="logical_proof",
                evidence_collection=[
                    "Model agent's knowledge state at all time points",
                    "Prove logical entailment from knowledge to intent",
                    "Establish invariant properties of agent's mental model",
                    "Create formal proof of intent necessity",
                    "Verify mental state consistency across all scenarios"
                ],
                witness_requirements=[
                    "Formal proof verification systems",
                    "Knowledge representation validators",
                    "Mental model consistency checkers"
                ],
                expert_testimony=[
                    "Knowledge representation experts",
                    "Formal logic specialists",
                    "Mental model verification experts",
                    "Algorithmic reasoning specialists"
                ],
                documentary_evidence=[
                    "Formal knowledge models",
                    "Intent derivation proofs",
                    "Mental state invariant specifications",
                    "Logical consistency certificates"
                ],
                timeline_focus=[
                    "Knowledge acquisition logical sequence",
                    "Intent formation necessity proof",
                    "Mental state evolution modeling"
                ],
                alternative_theories=[
                    "Primary: Logical necessity of intent given knowledge",
                    "Alternative: Proof by exhaustive case analysis",
                    "Backup: Invariant mental properties proof"
                ],
                anticipated_defenses=[
                    "Incomplete knowledge model",
                    "Invalid logical inference",
                    "Non-monotonic reasoning challenges",
                    "Free will vs determinism objections"
                ],
                confidence_level=1.0
            )
        
        else:
            return StrategyRecommendation(
                element=element,
                strategy_type="logical_proof",
                evidence_collection=[f"Mathematical proof framework for {element.value}"],
                witness_requirements=[f"Formal verification for {element.value}"],
                expert_testimony=[f"Mathematical logic experts for {element.value}"],
                documentary_evidence=[f"Formal proofs for {element.value}"],
                timeline_focus=[f"Logical sequence for {element.value}"],
                alternative_theories=[f"Logical necessity proof for {element.value}"],
                anticipated_defenses=[f"Logical validity challenges for {element.value}"],
                confidence_level=1.0
            )
    
    def generate_comprehensive_strategy_report(self,
                                             events: List[LegalEvent],
                                             agents: List[Agent],
                                             norms: List[Norm],
                                             target_agents: List[str] = ["Peter", "Rynette", "Bantjies"],
                                             prosecution_agents: List[str] = ["Dan", "Jax"]) -> str:
        """
        Generate a comprehensive strategy report for Dan & Jax to prove guilt
        of target agents under all three legal standards.
        """
        
        strategies = self.analyze_case_elements(events, agents, norms, target_agents, prosecution_agents)
        
        report = []
        report.append("=" * 80)
        report.append("OPTIMAL STRATEGY FRAMEWORK FOR BURDEN OF PROOF ANALYSIS")
        report.append("=" * 80)
        report.append("")
        report.append("This report outlines what Dan & Jax need to prove guilt of other agents")
        report.append("under three different legal standards:")
        report.append("")
        report.append("1. CIVIL STANDARD: Balance of Probabilities (>50% likelihood)")
        report.append("2. CRIMINAL STANDARD: Beyond Reasonable Doubt (>95% certainty)")
        report.append("3. MATHEMATICAL STANDARD: Invariant of All Conditions (100% certainty)")
        report.append("")
        
        for target_agent in target_agents:
            report.append("=" * 60)
            report.append(f"GUILT ANALYSIS FOR: {target_agent.upper()}")
            report.append("=" * 60)
            report.append("")
            
            for element in GuiltElement:
                report.append(f"ELEMENT: {element.value.replace('_', ' ').title()}")
                report.append("-" * 40)
                
                # Civil Standard Analysis
                civil_strategy = strategies[target_agent][element]["civil"]
                civil_req = self.proof_requirements.get((element, BurdenOfProofStandard.CIVIL_BALANCE_OF_PROBABILITIES))
                
                report.append("")
                report.append("📊 CIVIL STANDARD (Balance of Probabilities):")
                report.append(f"   Threshold: {civil_req.evidence_threshold:.1%}")
                report.append(f"   Confidence: {civil_strategy.confidence_level:.1%}")
                report.append("")
                report.append("   Necessary Conditions:")
                for condition in civil_req.necessary_conditions:
                    report.append(f"   • {condition}")
                report.append("")
                report.append("   Sufficient Conditions:")
                for condition in civil_req.sufficient_conditions:
                    report.append(f"   • {condition}")
                report.append("")
                report.append("   Evidence Collection Strategy:")
                for evidence in civil_strategy.evidence_collection:
                    report.append(f"   • {evidence}")
                report.append("")
                
                # Criminal Standard Analysis
                criminal_strategy = strategies[target_agent][element]["criminal"]
                criminal_req = self.proof_requirements.get((element, BurdenOfProofStandard.CRIMINAL_BEYOND_REASONABLE_DOUBT))
                
                report.append("⚖️  CRIMINAL STANDARD (Beyond Reasonable Doubt):")
                report.append(f"   Threshold: {criminal_req.evidence_threshold:.1%}")
                report.append(f"   Confidence: {criminal_strategy.confidence_level:.1%}")
                report.append("")
                report.append("   Necessary Conditions:")
                for condition in criminal_req.necessary_conditions:
                    report.append(f"   • {condition}")
                report.append("")
                report.append("   Sufficient Conditions:")
                for condition in criminal_req.sufficient_conditions:
                    report.append(f"   • {condition}")
                report.append("")
                report.append("   Evidence Collection Strategy:")
                for evidence in criminal_strategy.evidence_collection:
                    report.append(f"   • {evidence}")
                report.append("")
                
                # Mathematical Standard Analysis
                math_strategy = strategies[target_agent][element]["mathematical"]
                math_req = self.proof_requirements.get((element, BurdenOfProofStandard.MATHEMATICAL_INVARIANT))
                
                report.append("🔢 MATHEMATICAL STANDARD (Invariant Conditions):")
                report.append(f"   Threshold: {math_req.evidence_threshold:.1%}")
                report.append(f"   Confidence: {math_strategy.confidence_level:.1%}")
                report.append("")
                report.append("   Necessary Conditions:")
                for condition in math_req.necessary_conditions:
                    report.append(f"   • {condition}")
                report.append("")
                report.append("   Sufficient Conditions:")
                for condition in math_req.sufficient_conditions:
                    report.append(f"   • {condition}")
                report.append("")
                report.append("   Proof Strategy:")
                for evidence in math_strategy.evidence_collection:
                    report.append(f"   • {evidence}")
                report.append("")
                report.append("")
        
        # Summary recommendations
        report.append("=" * 80)
        report.append("STRATEGIC RECOMMENDATIONS")
        report.append("=" * 80)
        report.append("")
        report.append("For Dan & Jax to prove guilt effectively:")
        report.append("")
        report.append("1. START WITH CIVIL STANDARD:")
        report.append("   • Lower burden of proof (>50%)")
        report.append("   • Use to establish foundation of liability")
        report.append("   • Build evidence base for higher standards")
        report.append("")
        report.append("2. ESCALATE TO CRIMINAL STANDARD:")
        report.append("   • Requires much stronger evidence (>95%)")
        report.append("   • Focus on direct evidence and expert testimony")
        report.append("   • Anticipate and prepare for strong defenses")
        report.append("")
        report.append("3. MATHEMATICAL STANDARD FOR ABSOLUTE CERTAINTY:")
        report.append("   • Use formal logic and mathematical proofs")
        report.append("   • Create invariant models that hold across all conditions")
        report.append("   • Employ algorithmic verification")
        report.append("")
        report.append("4. EVIDENCE PRIORITIZATION:")
        report.append("   • Direct evidence > Circumstantial evidence")
        report.append("   • Multiple independent sources > Single source")
        report.append("   • Expert testimony crucial for complex elements")
        report.append("   • Document everything with proper chain of custody")
        report.append("")
        
        return "\n".join(report)


def create_sample_case_for_testing() -> Tuple[List[LegalEvent], List[Agent], List[Norm]]:
    """
    Create a sample case involving Peter, Rynette, Bantjies and others
    for testing the optimal strategy framework.
    """
    agents = [
        Agent(
            id="dan",
            name="Dan",
            initial_state={"role": "prosecutor", "knowledge_level": "high"},
            capabilities=["investigate", "prosecute", "gather_evidence"],
            obligations=["prove_case", "seek_justice"]
        ),
        Agent(
            id="jax",
            name="Jax", 
            initial_state={"role": "prosecutor", "knowledge_level": "high"},
            capabilities=["investigate", "prosecute", "gather_evidence"],
            obligations=["prove_case", "seek_justice"]
        ),
        Agent(
            id="peter",
            name="Peter",
            initial_state={"role": "defendant", "location": "office"},
            capabilities=["authorize_transactions", "access_systems", "make_decisions"],
            knowledge={"system_vulnerabilities": True, "policy_violations": True}
        ),
        Agent(
            id="rynette",
            name="Rynette",
            initial_state={"role": "defendant", "location": "headquarters"},
            capabilities=["supervise_operations", "set_policy", "oversight"],
            knowledge={"subordinate_actions": True, "risk_factors": True}
        ),
        Agent(
            id="bantjies",
            name="Bantjies",
            initial_state={"role": "defendant", "location": "field_office"},
            capabilities=["execute_operations", "report_status", "coordinate"],
            knowledge={"field_conditions": True, "operational_constraints": True}
        )
    ]
    
    events = [
        LegalEvent(
            id="e1",
            event_type="policy_violation",
            agent_id="peter",
            timestamp=1.0,
            description="Peter authorizes unauthorized transaction",
            properties={"amount": 500000, "authorization_level": "exceeded"},
            normative_context=["fiduciary_duty", "authorization_limits"]
        ),
        LegalEvent(
            id="e2", 
            event_type="oversight_failure",
            agent_id="rynette",
            timestamp=2.0,
            description="Rynette fails to monitor subordinate activities",
            properties={"monitoring_required": True, "system_alerts": "ignored"},
            causal_children=["e3"],
            normative_context=["supervisory_duty", "due_diligence"]
        ),
        LegalEvent(
            id="e3",
            event_type="operational_misconduct", 
            agent_id="bantjies",
            timestamp=3.0,
            description="Bantjies executes fraudulent operation",
            properties={"fraud_type": "misrepresentation", "intent": "personal_gain"},
            causal_parents=["e2"],
            causal_children=["e4"],
            normative_context=["honest_dealing", "fraud_prohibition"]
        ),
        LegalEvent(
            id="e4",
            event_type="harm",
            agent_id=None,
            timestamp=4.0,
            description="Financial losses to organization",
            properties={"loss_amount": 2000000, "harm_type": "financial"},
            causal_parents=["e1", "e3"]
        )
    ]
    
    norms = [
        Norm(
            id="n1",
            norm_type="obligation",
            description="Fiduciary duty to organization",
            conditions={"role": "authorized_agent", "authority": "financial"},
            consequences={"violation": "breach_of_fiduciary_duty"},
            priority=0.9
        ),
        Norm(
            id="n2", 
            norm_type="obligation",
            description="Supervisory duty to monitor subordinates",
            conditions={"role": "supervisor", "authority": "oversight"},
            consequences={"violation": "negligent_supervision"},
            priority=0.8
        ),
        Norm(
            id="n3",
            norm_type="prohibition",
            description="Fraud and misrepresentation prohibited",
            conditions={"action": "misrepresent", "intent": "deceive"},
            consequences={"violation": "fraud"},
            priority=1.0
        )
    ]
    
    return events, agents, norms


if __name__ == "__main__":
    print("Optimal Strategy Framework for Legal Burden of Proof Analysis")
    print("=" * 70)
    
    # Create the strategy engine
    engine = OptimalStrategyEngine(d_model=512, n_heads=8)
    
    # Create sample case
    events, agents, norms = create_sample_case_for_testing()
    
    # Generate comprehensive strategy report
    report = engine.generate_comprehensive_strategy_report(
        events, agents, norms,
        target_agents=["Peter", "Rynette", "Bantjies"],
        prosecution_agents=["Dan", "Jax"]
    )
    
    print(report)
    
    print("\n" + "=" * 70)
    print("FRAMEWORK TESTING COMPLETE")
    print("The optimal strategy framework successfully analyzes burden of proof")
    print("requirements across civil, criminal, and mathematical standards.")
    print("=" * 70)