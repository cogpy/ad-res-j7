"""
Phase 2 Secondary Task: Burden of Proof Strategies Implementation
Optimal strategies & burden of proof framework for Dan & Jax to prove guilt of other agents

Implements three legal standards:
1. Civil: Balance of probabilities (51%+ likelihood)
2. Criminal: Beyond reasonable doubt (95%+ certainty)
3. Mathematical: Invariant conditions (100% logical necessity)

Focuses on proving guilt of:
- Peter Faucitt (Applicant)
- Rynette Farrar (Peter's partner, email impersonator)  
- Daniel Jacobus Bantjies (Accountant, potential co-conspirator)
"""

from typing import Dict, List, Tuple, Optional, Any
from dataclasses import dataclass, field
from enum import Enum
import json
from pathlib import Path

class LegalStandard(Enum):
    """Legal standards of proof."""
    CIVIL = "balance_of_probabilities"
    CRIMINAL = "beyond_reasonable_doubt"
    MATHEMATICAL = "invariant_conditions"

class EvidenceType(Enum):
    """Types of evidence for guilt determination."""
    DOCUMENTARY = "documentary"
    CIRCUMSTANTIAL = "circumstantial"
    DIRECT = "direct"
    EXPERT = "expert"
    TESTIMONIAL = "testimonial"
    FINANCIAL = "financial"
    ELECTRONIC = "electronic"

@dataclass
class EvidenceRequirement:
    """Defines what evidence is needed to meet burden of proof."""
    evidence_type: EvidenceType
    description: str
    necessity: str  # "necessary", "sufficient", "supporting"
    standard_threshold: Dict[LegalStandard, float]  # Likelihood thresholds
    sources: List[str]
    verification_method: str

@dataclass
class Agent:
    """Represents an agent whose guilt needs to be proven."""
    name: str
    role: str
    alleged_crimes: List[str]
    evidence_requirements: Dict[LegalStandard, List[EvidenceRequirement]] = field(default_factory=dict)
    guilt_indicators: List[str] = field(default_factory=list)
    
class BurdenOfProofStrategies:
    """
    Implements optimal strategies for Dan & Jax to prove guilt of other agents
    across three legal standards: civil, criminal, and mathematical.
    """
    
    def __init__(self):
        self.agents = self._initialize_agents()
        self.evidence_matrix = self._build_evidence_matrix()
        self.proof_strategies = self._develop_proof_strategies()
        
    def _initialize_agents(self) -> Dict[str, Agent]:
        """Initialize agents whose guilt needs to be proven."""
        agents = {}
        
        # Peter Faucitt - Primary target
        agents["peter"] = Agent(
            name="Peter Andrew Faucitt",
            role="Applicant, Company Director",
            alleged_crimes=[
                "Perjury", "Fraud", "Theft", "Obstruction of Justice",
                "Bad Faith Litigation", "Material Non-Disclosure",
                "Business Disruption", "Regulatory Violation"
            ],
            guilt_indicators=[
                "Card cancellations to create documentation gap",
                "System restrictions to prevent record retrieval",
                "False statements in founding affidavit",
                "Material non-disclosure to court",
                "Created problems then complained about them",
                "Settlement timing (2 days before interdict)",
                "Revenue diversion involvement"
            ]
        )
        
        # Rynette Farrar - Co-conspirator
        agents["rynette"] = Agent(
            name="Rynette Farrar",
            role="Peter's Partner, Email Controller",
            alleged_crimes=[
                "Email Impersonation", "Fraud", "Information Manipulation",
                "Tax Fraud", "Conspiracy", "Identity Theft"
            ],
            guilt_indicators=[
                "Control of Pete@regima.com email address",
                "Filtering and suppressing information",
                "Creating false appearance of direct communication",
                "Supporting Peter's false allegations",
                "Revenue hijacking involvement",
                "Tax underreporting participation"
            ]
        )
        
        # Daniel Jacobus Bantjies - Professional misconduct
        agents["bantjies"] = Agent(
            name="Daniel Jacobus Bantjies",
            role="Accountant, Family Trust Trustee",
            alleged_crimes=[
                "Perjury", "Breach of Fiduciary Duty", "Professional Misconduct",
                "Conspiracy", "False Attestation", "Ethics Violation"
            ],
            guilt_indicators=[
                "False statements in confirmatory affidavit",
                "Refused to investigate fraud allegations",
                "Conflict of interest as trustee",
                "Professional ethics breach",
                "Coordinated support for false allegations",
                "Breach of fiduciary duty to trust beneficiaries"
            ]
        )
        
        return agents
    
    def _build_evidence_matrix(self) -> Dict[str, Dict[LegalStandard, List[EvidenceRequirement]]]:
        """Build comprehensive evidence requirements matrix."""
        matrix = {}
        
        for agent_key, agent in self.agents.items():
            matrix[agent_key] = {}
            
            # Civil Standard Evidence Requirements
            matrix[agent_key][LegalStandard.CIVIL] = self._get_civil_evidence_requirements(agent)
            
            # Criminal Standard Evidence Requirements  
            matrix[agent_key][LegalStandard.CRIMINAL] = self._get_criminal_evidence_requirements(agent)
            
            # Mathematical Standard Evidence Requirements
            matrix[agent_key][LegalStandard.MATHEMATICAL] = self._get_mathematical_evidence_requirements(agent)
            
        return matrix
    
    def _get_civil_evidence_requirements(self, agent: Agent) -> List[EvidenceRequirement]:
        """Evidence requirements for civil standard (balance of probabilities)."""
        if agent.name == "Peter Andrew Faucitt":
            return [
                EvidenceRequirement(
                    evidence_type=EvidenceType.DOCUMENTARY,
                    description="Timeline showing Peter's card cancellations preceded documentation gaps",
                    necessity="necessary",
                    standard_threshold={LegalStandard.CIVIL: 0.51},
                    sources=["Bank records", "System logs", "Service suspension notices"],
                    verification_method="Timestamp analysis and causation mapping"
                ),
                EvidenceRequirement(
                    evidence_type=EvidenceType.DOCUMENTARY,
                    description="Court affidavit contradicted by email evidence",
                    necessity="sufficient",
                    standard_threshold={LegalStandard.CIVIL: 0.51},
                    sources=["Founding affidavit", "Email archives", "System records"],
                    verification_method="Direct contradiction identification"
                ),
                EvidenceRequirement(
                    evidence_type=EvidenceType.FINANCIAL,
                    description="Disproportionate harm ratio (36:1 minimum)",
                    necessity="supporting",
                    standard_threshold={LegalStandard.CIVIL: 0.51},
                    sources=["Financial records", "Revenue analysis", "Loss calculations"],
                    verification_method="Quantitative harm assessment"
                ),
                EvidenceRequirement(
                    evidence_type=EvidenceType.CIRCUMSTANTIAL,
                    description="Settlement timing pattern (2 days before interdict)",
                    necessity="supporting",
                    standard_threshold={LegalStandard.CIVIL: 0.51},
                    sources=["Settlement agreement", "Interdict application", "Court records"],
                    verification_method="Temporal analysis"
                )
            ]
        elif agent.name == "Rynette Farrar":
            return [
                EvidenceRequirement(
                    evidence_type=EvidenceType.ELECTRONIC,
                    description="Email system control and filtering evidence",
                    necessity="necessary",
                    standard_threshold={LegalStandard.CIVIL: 0.51},
                    sources=["Email server logs", "Pete@regima.com access records", "Message filtering rules"],
                    verification_method="Digital forensics analysis"
                ),
                EvidenceRequirement(
                    evidence_type=EvidenceType.DOCUMENTARY,
                    description="Impersonation evidence comparing sent vs received emails",
                    necessity="sufficient",
                    standard_threshold={LegalStandard.CIVIL: 0.51},
                    sources=["Email archives", "Communication logs", "Recipient confirmations"],
                    verification_method="Message flow analysis"
                )
            ]
        elif agent.name == "Daniel Jacobus Bantjies":
            return [
                EvidenceRequirement(
                    evidence_type=EvidenceType.DOCUMENTARY,
                    description="Confirmatory affidavit contradicted by own records",
                    necessity="sufficient",
                    standard_threshold={LegalStandard.CIVIL: 0.51},
                    sources=["Confirmatory affidavit", "Accounting records", "Trust documents"],
                    verification_method="Record contradiction analysis"
                ),
                EvidenceRequirement(
                    evidence_type=EvidenceType.EXPERT,
                    description="Professional ethics violation assessment",
                    necessity="supporting",
                    standard_threshold={LegalStandard.CIVIL: 0.51},
                    sources=["SAICA guidelines", "Professional conduct rules", "Expert opinion"],
                    verification_method="Professional standards comparison"
                )
            ]
        return []
    
    def _get_criminal_evidence_requirements(self, agent: Agent) -> List[EvidenceRequirement]:
        """Evidence requirements for criminal standard (beyond reasonable doubt)."""
        if agent.name == "Peter Andrew Faucitt":
            return [
                EvidenceRequirement(
                    evidence_type=EvidenceType.DIRECT,
                    description="Intentional obstruction pattern with clear mens rea",
                    necessity="necessary",
                    standard_threshold={LegalStandard.CRIMINAL: 0.95},
                    sources=["System logs", "Card cancellation records", "Email communications"],
                    verification_method="Intent analysis through action sequence"
                ),
                EvidenceRequirement(
                    evidence_type=EvidenceType.DOCUMENTARY,
                    description="Perjury evidence with willful false statements",
                    necessity="necessary", 
                    standard_threshold={LegalStandard.CRIMINAL: 0.95},
                    sources=["Court affidavit", "Contradictory evidence", "Email records"],
                    verification_method="False statement materiality analysis"
                ),
                EvidenceRequirement(
                    evidence_type=EvidenceType.FINANCIAL,
                    description="Fraud pattern with quantified damages",
                    necessity="supporting",
                    standard_threshold={LegalStandard.CRIMINAL: 0.95},
                    sources=["Transaction records", "Revenue analysis", "Bank statements"],
                    verification_method="Forensic accounting"
                )
            ]
        elif agent.name == "Rynette Farrar":
            return [
                EvidenceRequirement(
                    evidence_type=EvidenceType.ELECTRONIC,
                    description="Systematic email impersonation with intent to deceive",
                    necessity="necessary",
                    standard_threshold={LegalStandard.CRIMINAL: 0.95},
                    sources=["Email server logs", "Message headers", "Filtering rules"],
                    verification_method="Digital forensics with intent analysis"
                ),
                EvidenceRequirement(
                    evidence_type=EvidenceType.FINANCIAL,
                    description="Conspiracy in revenue diversion scheme",
                    necessity="supporting",
                    standard_threshold={LegalStandard.CRIMINAL: 0.95},
                    sources=["Banking records", "Transaction patterns", "Communication evidence"],
                    verification_method="Conspiracy pattern analysis"
                )
            ]
        elif agent.name == "Daniel Jacobus Bantjies":
            return [
                EvidenceRequirement(
                    evidence_type=EvidenceType.DOCUMENTARY,
                    description="Willful perjury in sworn affidavit",
                    necessity="necessary",
                    standard_threshold={LegalStandard.CRIMINAL: 0.95},
                    sources=["Confirmatory affidavit", "Contradictory records", "Knowledge evidence"],
                    verification_method="Willfulness determination"
                ),
                EvidenceRequirement(
                    evidence_type=EvidenceType.EXPERT,
                    description="Deliberate breach of professional fiduciary duties",
                    necessity="supporting",
                    standard_threshold={LegalStandard.CRIMINAL: 0.95},
                    sources=["Trust documents", "Professional standards", "Action evidence"],
                    verification_method="Professional misconduct analysis"
                )
            ]
        return []
    
    def _get_mathematical_evidence_requirements(self, agent: Agent) -> List[EvidenceRequirement]:
        """Evidence requirements for mathematical standard (invariant conditions)."""
        if agent.name == "Peter Andrew Faucitt":
            return [
                EvidenceRequirement(
                    evidence_type=EvidenceType.DOCUMENTARY,
                    description="Logical invariant: Peter's actions necessarily caused documentation gap",
                    necessity="necessary",
                    standard_threshold={LegalStandard.MATHEMATICAL: 1.0},
                    sources=["Temporal sequences", "Causal chains", "System dependencies"],
                    verification_method="Logical necessity proof"
                ),
                EvidenceRequirement(
                    evidence_type=EvidenceType.DOCUMENTARY,
                    description="Contradiction invariant: Affidavit statements logically incompatible with evidence",
                    necessity="sufficient",
                    standard_threshold={LegalStandard.MATHEMATICAL: 1.0},
                    sources=["Affidavit text", "Contradictory evidence", "Logical analysis"],
                    verification_method="Logical contradiction proof"
                )
            ]
        elif agent.name == "Rynette Farrar":
            return [
                EvidenceRequirement(
                    evidence_type=EvidenceType.ELECTRONIC,
                    description="System invariant: Email control necessarily enables impersonation",
                    necessity="necessary",
                    standard_threshold={LegalStandard.MATHEMATICAL: 1.0},
                    sources=["Email system architecture", "Access controls", "Message routing"],
                    verification_method="System architecture analysis"
                )
            ]
        elif agent.name == "Daniel Jacobus Bantjies":
            return [
                EvidenceRequirement(
                    evidence_type=EvidenceType.DOCUMENTARY,
                    description="Logical invariant: Trustee's duty incompatible with biased attestation",
                    necessity="necessary",
                    standard_threshold={LegalStandard.MATHEMATICAL: 1.0},
                    sources=["Trust documents", "Fiduciary duties", "Attestation content"],
                    verification_method="Duty conflict analysis"
                )
            ]
        return []
    
    def _develop_proof_strategies(self) -> Dict[str, Dict[LegalStandard, Dict[str, Any]]]:
        """Develop optimal proof strategies for each agent and standard."""
        strategies = {}
        
        for agent_key, agent in self.agents.items():
            strategies[agent_key] = {}
            
            for standard in LegalStandard:
                strategies[agent_key][standard] = {
                    "primary_approach": self._get_primary_approach(agent, standard),
                    "evidence_sequence": self._get_evidence_sequence(agent, standard),
                    "burden_satisfaction": self._get_burden_satisfaction_method(agent, standard),
                    "anticipated_defenses": self._get_anticipated_defenses(agent, standard),
                    "counter_strategies": self._get_counter_strategies(agent, standard)
                }
        
        return strategies
    
    def _get_primary_approach(self, agent: Agent, standard: LegalStandard) -> str:
        """Get primary approach for proving guilt under specific standard."""
        approaches = {
            LegalStandard.CIVIL: {
                "Peter Andrew Faucitt": "Pattern of deliberate obstruction creating the problems complained about",
                "Rynette Farrar": "Systematic email control and information manipulation",
                "Daniel Jacobus Bantjies": "Professional misconduct and false attestation"
            },
            LegalStandard.CRIMINAL: {
                "Peter Andrew Faucitt": "Intentional fraud and perjury with clear mens rea",
                "Rynette Farrar": "Criminal impersonation and conspiracy in fraud scheme",
                "Daniel Jacobus Bantjies": "Willful perjury and breach of fiduciary duty"
            },
            LegalStandard.MATHEMATICAL: {
                "Peter Andrew Faucitt": "Logical necessity of causation and contradiction invariants",
                "Rynette Farrar": "System architecture necessitating impersonation capability",
                "Daniel Jacobus Bantjies": "Logical incompatibility of fiduciary duty with biased attestation"
            }
        }
        return approaches[standard].get(agent.name, "Standard approach not defined")
    
    def _get_evidence_sequence(self, agent: Agent, standard: LegalStandard) -> List[str]:
        """Get optimal sequence for presenting evidence."""
        if agent.name == "Peter Andrew Faucitt":
            if standard == LegalStandard.CIVIL:
                return [
                    "1. Establish timeline of Peter's actions",
                    "2. Show causation between actions and documentation gaps",
                    "3. Demonstrate affidavit contradictions",
                    "4. Quantify disproportionate harm",
                    "5. Prove bad faith pattern"
                ]
            elif standard == LegalStandard.CRIMINAL:
                return [
                    "1. Establish intent through action pattern",
                    "2. Prove willful false statements (perjury)",
                    "3. Document fraud scheme elements",
                    "4. Show obstruction of justice",
                    "5. Demonstrate pattern of criminal conduct"
                ]
            elif standard == LegalStandard.MATHEMATICAL:
                return [
                    "1. Prove logical necessity of causation",
                    "2. Demonstrate contradiction invariants",
                    "3. Show system dependencies",
                    "4. Establish logical impossibility of alternative explanations"
                ]
        elif agent.name == "Rynette Farrar":
            if standard == LegalStandard.CIVIL:
                return [
                    "1. Establish email system control",
                    "2. Document filtering and suppression",
                    "3. Show impersonation pattern",
                    "4. Prove information manipulation"
                ]
            elif standard == LegalStandard.CRIMINAL:
                return [
                    "1. Prove intentional impersonation",
                    "2. Document conspiracy elements",
                    "3. Show criminal fraud participation",
                    "4. Establish intent to deceive"
                ]
            elif standard == LegalStandard.MATHEMATICAL:
                return [
                    "1. Prove system control necessity",
                    "2. Show architectural impersonation capability",
                    "3. Demonstrate logical inevitability"
                ]
        elif agent.name == "Daniel Jacobus Bantjies":
            if standard == LegalStandard.CIVIL:
                return [
                    "1. Show contradictions in attestation",
                    "2. Prove professional ethics breach",
                    "3. Document fiduciary duty violation",
                    "4. Establish bias and conflict of interest"
                ]
            elif standard == LegalStandard.CRIMINAL:
                return [
                    "1. Prove willful false attestation",
                    "2. Show criminal breach of duty",
                    "3. Document conspiracy participation",
                    "4. Establish criminal intent"
                ]
            elif standard == LegalStandard.MATHEMATICAL:
                return [
                    "1. Prove logical incompatibility of duties",
                    "2. Show necessary conflict of interest",
                    "3. Demonstrate logical contradiction"
                ]
        return ["Evidence sequence not defined"]
    
    def _get_burden_satisfaction_method(self, agent: Agent, standard: LegalStandard) -> str:
        """How to satisfy burden of proof for this agent/standard combination."""
        methods = {
            LegalStandard.CIVIL: "Preponderance of evidence showing more likely than not guilty",
            LegalStandard.CRIMINAL: "Evidence beyond reasonable doubt with clear intent and mens rea",
            LegalStandard.MATHEMATICAL: "Logical proof of necessary conditions and invariant relationships"
        }
        return methods[standard]
    
    def _get_anticipated_defenses(self, agent: Agent, standard: LegalStandard) -> List[str]:
        """Anticipated defenses from each agent."""
        defenses = {
            "Peter Andrew Faucitt": [
                "Claim actions were necessary business decisions",
                "Deny intent to obstruct or deceive",
                "Blame technical issues for documentation gaps",
                "Argue good faith reliance on advisors"
            ],
            "Rynette Farrar": [
                "Deny knowledge of impersonation consequences", 
                "Claim technical ignorance",
                "Argue legitimate email management",
                "Blame others for fraud scheme"
            ],
            "Daniel Jacobus Bantjies": [
                "Claim reliance on Peter's representations",
                "Argue professional judgment within standards",
                "Deny knowledge of material facts",
                "Claim conflict was not apparent"
            ]
        }
        return defenses.get(agent.name, ["Generic defense strategies"])
    
    def _get_counter_strategies(self, agent: Agent, standard: LegalStandard) -> List[str]:
        """Counter-strategies to overcome anticipated defenses."""
        if agent.name == "Peter Andrew Faucitt":
            return [
                "Document pattern showing deliberate, not accidental actions",
                "Prove knowledge through email evidence and system access",
                "Show technical issues were created, not encountered",
                "Demonstrate advisors were misled or complicit"
            ]
        elif agent.name == "Rynette Farrar":
            return [
                "Prove technical knowledge through system control evidence",
                "Show systematic pattern inconsistent with ignorance",
                "Document active participation in scheme",
                "Establish direct knowledge of consequences"
            ]
        elif agent.name == "Daniel Jacobus Bantjies":
            return [
                "Show access to contradictory information",
                "Prove professional standards required investigation",
                "Document actual knowledge of material facts",
                "Establish clear conflict of interest"
            ]
        return ["Standard counter-strategies not defined"]
    
    def generate_evidence_collection_plan(self, agent_key: str, standard: LegalStandard) -> Dict[str, Any]:
        """Generate specific evidence collection plan for proving agent's guilt."""
        if agent_key not in self.agents:
            return {"error": "Agent not found"}
            
        agent = self.agents[agent_key]
        requirements = self.evidence_matrix[agent_key][standard]
        strategy = self.proof_strategies[agent_key][standard]
        
        plan = {
            "agent": agent.name,
            "standard": standard.value,
            "threshold": f"{self._get_threshold(standard)*100}% certainty required",
            "primary_approach": strategy["primary_approach"],
            "evidence_requirements": [],
            "collection_sequence": strategy["evidence_sequence"],
            "burden_satisfaction": strategy["burden_satisfaction"],
            "risks_and_mitigation": {
                "anticipated_defenses": strategy["anticipated_defenses"],
                "counter_strategies": strategy["counter_strategies"]
            }
        }
        
        for req in requirements:
            plan["evidence_requirements"].append({
                "type": req.evidence_type.value,
                "description": req.description,
                "necessity": req.necessity,
                "threshold": req.standard_threshold.get(standard, 0.0),
                "sources": req.sources,
                "verification": req.verification_method
            })
        
        return plan
    
    def _get_threshold(self, standard: LegalStandard) -> float:
        """Get certainty threshold for standard."""
        thresholds = {
            LegalStandard.CIVIL: 0.51,
            LegalStandard.CRIMINAL: 0.95,
            LegalStandard.MATHEMATICAL: 1.0
        }
        return thresholds[standard]
    
    def export_comprehensive_analysis(self) -> Dict[str, Any]:
        """Export comprehensive burden of proof analysis."""
        analysis = {
            "phase": "Phase 2 Secondary Task",
            "title": "Burden of Proof Strategies for Dan & Jax",
            "description": "Optimal strategies to prove guilt of other agents across three legal standards",
            "agents": {},
            "legal_standards": {
                "civil": {
                    "name": "Balance of Probabilities",
                    "threshold": "51%+ likelihood",
                    "description": "More likely than not that agent is guilty"
                },
                "criminal": {
                    "name": "Beyond Reasonable Doubt", 
                    "threshold": "95%+ certainty",
                    "description": "No reasonable doubt of guilt with clear intent"
                },
                "mathematical": {
                    "name": "Invariant Conditions",
                    "threshold": "100% logical necessity",
                    "description": "Guilt follows necessarily from logical conditions"
                }
            },
            "evidence_collection_plans": {},
            "integration": {
                "legal_attention_engine": "burden_of_proof_strategies.py extends existing legal attention framework",
                "existing_strategies": "Builds on 70% complete strategy implementation system",
                "case_context": "Case 2025-137857 - Peter Andrew Faucitt v. Jacqueline Faucitt et al."
            }
        }
        
        # Add agent details
        for agent_key, agent in self.agents.items():
            analysis["agents"][agent_key] = {
                "name": agent.name,
                "role": agent.role,
                "alleged_crimes": agent.alleged_crimes,
                "guilt_indicators": agent.guilt_indicators
            }
        
        # Add evidence collection plans for each agent/standard combination
        for agent_key in self.agents.keys():
            analysis["evidence_collection_plans"][agent_key] = {}
            for standard in LegalStandard:
                analysis["evidence_collection_plans"][agent_key][standard.value] = \
                    self.generate_evidence_collection_plan(agent_key, standard)
        
        return analysis

# Main execution for testing and integration
if __name__ == "__main__":
    print("🎯 Phase 2 Secondary Task: Burden of Proof Strategies")
    print("=" * 60)
    
    # Initialize burden of proof strategies
    strategies = BurdenOfProofStrategies()
    
    # Generate comprehensive analysis
    analysis = strategies.export_comprehensive_analysis()
    
    # Export to JSON for integration
    output_path = Path("burden_of_proof_analysis.json")
    with open(output_path, 'w') as f:
        json.dump(analysis, f, indent=2, default=str)
    
    print(f"✅ Comprehensive burden of proof analysis exported to: {output_path}")
    
    # Display summary
    print("\n📊 Summary:")
    print(f"   Agents analyzed: {len(analysis['agents'])}")
    print(f"   Legal standards: {len(analysis['legal_standards'])}")
    print(f"   Evidence collection plans: {sum(len(plans) for plans in analysis['evidence_collection_plans'].values())}")
    
    print("\n🎯 Agent Coverage:")
    for agent_key, agent_data in analysis["agents"].items():
        print(f"   {agent_data['name']}: {len(agent_data['alleged_crimes'])} crimes, {len(agent_data['guilt_indicators'])} indicators")
    
    print("\n⚖️ Legal Standards Coverage:")
    for standard, details in analysis["legal_standards"].items():
        print(f"   {details['name']}: {details['threshold']} - {details['description']}")
    
    print("\n✅ Phase 2 Secondary Task Implementation Complete")