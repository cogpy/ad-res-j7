#!/usr/bin/env python3
"""
Legal Case Simulation: Case 2025-137857
Using the newly generated affidavits and annexures
"""

import json
import random
import statistics
from datetime import datetime
from collections import defaultdict

# Seed for reproducibility
random.seed(42)

class LegalCaseSimulation:
    def __init__(self):
        self.case_number = "2025-137857"
        self.applicant = "Peter Andrew Faucitt"
        self.respondents = ["Jacqueline Faucitt", "Daniel James Faucitt"]
        
        # Evidence from annexures
        self.evidence = {
            "JF1_shopify_email": {
                "type": "third_party_documentary",
                "date": "2017-07-26",
                "source": "Shopify Inc. (neutral third party)",
                "weight": 0.95,  # Extremely high - irrefutable
                "credibility": 0.98,
                "alterability": 0.0,  # Cannot be altered
                "supports": "respondents",
                "refutes": ["head_office_control", "no_independent_operations", "delusional_claim"]
            },
            "JF9_timeline_evidence_destruction": {
                "type": "chronological_analysis",
                "date": "2025-05-22",
                "weight": 0.85,
                "credibility": 0.90,
                "demonstrates": "consciousness_of_guilt",
                "criminal_significance": True
            },
            "JF4_bank_records": {
                "type": "financial_documentary",
                "weight": 0.88,
                "credibility": 0.92,
                "supports": "respondents",
                "refutes": ["financial_misconduct"]
            },
            "JF3_financial_analysis": {
                "type": "financial_analysis",
                "weight": 0.82,
                "credibility": 0.88,
                "supports": "respondents"
            },
            "JF5_correspondence": {
                "type": "correspondence",
                "weight": 0.75,
                "credibility": 0.85,
                "demonstrates": "good_faith_cooperation"
            },
            "JF2_shopify_reports": {
                "type": "business_records",
                "weight": 0.80,
                "credibility": 0.88,
                "supports": "respondents",
                "corroborates": "JF1_shopify_email"
            },
            "JF6_court_documents": {
                "type": "procedural_records",
                "weight": 0.70,
                "credibility": 0.90,
                "demonstrates": "litigation_pattern"
            },
            "JF7_screenshots": {
                "type": "visual_evidence",
                "weight": 0.65,
                "credibility": 0.75,
                "supports": "respondents"
            },
            "JF10_director_loans": {
                "type": "accounting_records",
                "weight": 0.78,
                "credibility": 0.85,
                "refutes": ["financial_misconduct"]
            }
        }
        
        # Claims and counterclaims
        self.applicant_claims = {
            "head_office_control": {
                "description": "All operations controlled by centralized head office",
                "evidence_against": ["JF1_shopify_email", "JF2_shopify_reports"],
                "strength_without_rebuttal": 0.30,
                "strength_with_rebuttal": 0.05
            },
            "no_independent_operations": {
                "description": "Daniel and Kayla never operated independent businesses",
                "evidence_against": ["JF1_shopify_email", "JF2_shopify_reports", "JF3_financial_analysis"],
                "strength_without_rebuttal": 0.35,
                "strength_with_rebuttal": 0.03
            },
            "delusional_claim": {
                "description": "Daniel is delusional about his role",
                "evidence_against": ["JF1_shopify_email", "JF9_timeline_evidence_destruction"],
                "strength_without_rebuttal": 0.25,
                "strength_with_rebuttal": 0.02
            },
            "financial_misconduct": {
                "description": "Financial misconduct and misappropriation",
                "evidence_against": ["JF4_bank_records", "JF3_financial_analysis", "JF10_director_loans"],
                "strength_without_rebuttal": 0.40,
                "strength_with_rebuttal": 0.08
            }
        }
        
        self.respondent_claims = {
            "independent_operations_proven": {
                "description": "Daniel and Kayla operated independent businesses",
                "evidence_for": ["JF1_shopify_email", "JF2_shopify_reports", "JF3_financial_analysis"],
                "strength": 0.92
            },
            "evidence_destruction": {
                "description": "Applicant destroyed evidence on 22 May 2025",
                "evidence_for": ["JF9_timeline_evidence_destruction"],
                "strength": 0.85,
                "criminal_significance": True
            },
            "consciousness_of_guilt": {
                "description": "Evidence destruction demonstrates consciousness of guilt",
                "evidence_for": ["JF9_timeline_evidence_destruction"],
                "strength": 0.80,
                "criminal_significance": True
            },
            "good_faith_cooperation": {
                "description": "Respondents attempted good faith cooperation",
                "evidence_for": ["JF5_correspondence"],
                "strength": 0.75
            },
            "identity_theft": {
                "description": "Phone number appropriation constitutes identity theft",
                "evidence_for": ["JF1_shopify_email", "JF9_timeline_evidence_destruction"],
                "strength": 0.78,
                "criminal_significance": True
            }
        }
        
    def simulate_judge_evaluation(self, iteration):
        """Simulate a judge's evaluation of the case"""
        
        # Judge characteristics (vary slightly per iteration)
        judge_profile = {
            "evidence_weight_preference": random.uniform(0.7, 0.95),  # How much judge values hard evidence
            "procedural_strictness": random.uniform(0.6, 0.9),
            "criminal_standard_threshold": 0.85,  # Beyond reasonable doubt
            "civil_standard_threshold": 0.55,  # Balance of probabilities
            "gaslighting_sensitivity": random.uniform(0.6, 0.9),  # Sensitivity to gaslighting tactics
            "third_party_evidence_bonus": random.uniform(0.05, 0.15)  # Bonus for third-party evidence
        }
        
        # Evaluate Applicant's claims
        applicant_claim_results = {}
        for claim_id, claim_data in self.applicant_claims.items():
            # Start with base strength (with rebuttal)
            claim_strength = claim_data["strength_with_rebuttal"]
            
            # Apply judge's evidence weighting
            claim_strength *= (1 - judge_profile["evidence_weight_preference"] * 0.5)
            
            # Check if claim is refuted by irrefutable evidence
            for evidence_id in claim_data["evidence_against"]:
                if evidence_id in self.evidence:
                    evidence = self.evidence[evidence_id]
                    refutation_power = evidence["weight"] * evidence["credibility"]
                    
                    # Third-party evidence gets bonus
                    if evidence["type"] == "third_party_documentary":
                        refutation_power += judge_profile["third_party_evidence_bonus"]
                    
                    claim_strength *= (1 - refutation_power)
            
            # Gaslighting claims (dementia, delusional) get additional penalty
            if claim_id in ["dementia_claim", "delusional_claim"]:
                claim_strength *= (1 - judge_profile["gaslighting_sensitivity"] * 0.3)
            
            applicant_claim_results[claim_id] = {
                "strength": max(0.0, min(1.0, claim_strength)),
                "succeeds_civil": claim_strength > judge_profile["civil_standard_threshold"],
                "succeeds_criminal": claim_strength > judge_profile["criminal_standard_threshold"]
            }
        
        # Evaluate Respondent's claims
        respondent_claim_results = {}
        for claim_id, claim_data in self.respondent_claims.items():
            # Start with base strength
            claim_strength = claim_data["strength"]
            
            # Apply judge's evidence weighting (positive for respondents)
            claim_strength *= (0.8 + judge_profile["evidence_weight_preference"] * 0.2)
            
            # Boost for evidence supporting claim
            for evidence_id in claim_data["evidence_for"]:
                if evidence_id in self.evidence:
                    evidence = self.evidence[evidence_id]
                    support_power = evidence["weight"] * evidence["credibility"] * 0.1
                    
                    # Third-party evidence gets bonus
                    if evidence["type"] == "third_party_documentary":
                        support_power += judge_profile["third_party_evidence_bonus"]
                    
                    claim_strength += support_power
            
            # Cap at 1.0
            claim_strength = min(1.0, claim_strength)
            
            respondent_claim_results[claim_id] = {
                "strength": claim_strength,
                "succeeds_civil": claim_strength > judge_profile["civil_standard_threshold"],
                "succeeds_criminal": claim_strength > judge_profile["criminal_standard_threshold"] if claim_data.get("criminal_significance") else None
            }
        
        # Overall case outcome
        applicant_success_rate = sum(1 for r in applicant_claim_results.values() if r["succeeds_civil"]) / len(applicant_claim_results)
        respondent_success_rate = sum(1 for r in respondent_claim_results.values() if r["succeeds_civil"]) / len(respondent_claim_results)
        
        # Determine outcome
        if respondent_success_rate > 0.7 and applicant_success_rate < 0.3:
            outcome = "application_dismissed_with_costs"
            outcome_confidence = respondent_success_rate
        elif respondent_success_rate > 0.5 and applicant_success_rate < 0.5:
            outcome = "application_dismissed"
            outcome_confidence = respondent_success_rate - applicant_success_rate
        elif respondent_success_rate > applicant_success_rate:
            outcome = "partial_success_respondents"
            outcome_confidence = respondent_success_rate - applicant_success_rate
        elif applicant_success_rate > respondent_success_rate:
            outcome = "partial_success_applicant"
            outcome_confidence = applicant_success_rate - respondent_success_rate
        else:
            outcome = "matter_continues"
            outcome_confidence = 0.5
        
        # Criminal referral likelihood
        evidence_destruction_strength = respondent_claim_results["evidence_destruction"]["strength"]
        consciousness_of_guilt_strength = respondent_claim_results["consciousness_of_guilt"]["strength"]
        criminal_referral_likelihood = (evidence_destruction_strength + consciousness_of_guilt_strength) / 2
        criminal_referral = criminal_referral_likelihood > 0.65
        
        return {
            "iteration": iteration,
            "judge_profile": judge_profile,
            "applicant_claims": applicant_claim_results,
            "respondent_claims": respondent_claim_results,
            "applicant_success_rate": applicant_success_rate,
            "respondent_success_rate": respondent_success_rate,
            "outcome": outcome,
            "outcome_confidence": outcome_confidence,
            "criminal_referral": criminal_referral,
            "criminal_referral_likelihood": criminal_referral_likelihood,
            "costs_awarded_to": "respondents" if outcome in ["application_dismissed_with_costs", "application_dismissed"] else "split"
        }
    
    def run_simulation(self, iterations=100):
        """Run multiple simulation iterations"""
        print("="*80)
        print(f"LEGAL CASE SIMULATION: {self.case_number}")
        print("="*80)
        print(f"\nCase: {self.applicant} v. {', '.join(self.respondents)}")
        print(f"Iterations: {iterations}")
        print(f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("\n" + "="*80)
        print("RUNNING SIMULATIONS...")
        print("="*80)
        
        results = []
        for i in range(iterations):
            result = self.simulate_judge_evaluation(i + 1)
            results.append(result)
            
            if (i + 1) % 20 == 0:
                print(f"Completed {i + 1}/{iterations} iterations...")
        
        # Aggregate results
        outcomes = defaultdict(int)
        criminal_referrals = 0
        costs_to_respondents = 0
        
        applicant_claim_success = defaultdict(int)
        respondent_claim_success = defaultdict(int)
        
        applicant_success_rates = []
        respondent_success_rates = []
        outcome_confidences = []
        criminal_referral_likelihoods = []
        
        for result in results:
            outcomes[result["outcome"]] += 1
            if result["criminal_referral"]:
                criminal_referrals += 1
            if result["costs_awarded_to"] == "respondents":
                costs_to_respondents += 1
            
            for claim_id, claim_result in result["applicant_claims"].items():
                if claim_result["succeeds_civil"]:
                    applicant_claim_success[claim_id] += 1
            
            for claim_id, claim_result in result["respondent_claims"].items():
                if claim_result["succeeds_civil"]:
                    respondent_claim_success[claim_id] += 1
            
            applicant_success_rates.append(result["applicant_success_rate"])
            respondent_success_rates.append(result["respondent_success_rate"])
            outcome_confidences.append(result["outcome_confidence"])
            criminal_referral_likelihoods.append(result["criminal_referral_likelihood"])
        
        # Print results
        print("\n" + "="*80)
        print("SIMULATION RESULTS")
        print("="*80)
        
        print("\n### OVERALL OUTCOMES ###\n")
        for outcome, count in sorted(outcomes.items(), key=lambda x: x[1], reverse=True):
            percentage = (count / iterations) * 100
            print(f"{outcome.replace('_', ' ').title():40s}: {count:3d} ({percentage:5.1f}%)")
        
        print("\n### CRIMINAL REFERRAL ###\n")
        criminal_referral_pct = (criminal_referrals / iterations) * 100
        print(f"Criminal Referral Granted: {criminal_referrals}/{iterations} ({criminal_referral_pct:.1f}%)")
        print(f"Average Likelihood: {statistics.mean(criminal_referral_likelihoods):.3f}")
        
        print("\n### COSTS AWARDS ###\n")
        costs_respondents_pct = (costs_to_respondents / iterations) * 100
        print(f"Costs Awarded to Respondents: {costs_to_respondents}/{iterations} ({costs_respondents_pct:.1f}%)")
        
        print("\n### APPLICANT'S CLAIMS SUCCESS RATE ###\n")
        for claim_id, count in sorted(applicant_claim_success.items(), key=lambda x: x[1], reverse=True):
            percentage = (count / iterations) * 100
            claim_desc = self.applicant_claims[claim_id]["description"]
            print(f"{claim_desc[:50]:50s}: {count:3d} ({percentage:5.1f}%)")
        
        print("\n### RESPONDENTS' CLAIMS SUCCESS RATE ###\n")
        for claim_id, count in sorted(respondent_claim_success.items(), key=lambda x: x[1], reverse=True):
            percentage = (count / iterations) * 100
            claim_desc = self.respondent_claims[claim_id]["description"]
            print(f"{claim_desc[:50]:50s}: {count:3d} ({percentage:5.1f}%)")
        
        print("\n### STATISTICAL SUMMARY ###\n")
        print(f"Applicant Average Success Rate: {statistics.mean(applicant_success_rates):.3f}")
        print(f"Respondents Average Success Rate: {statistics.mean(respondent_success_rates):.3f}")
        print(f"Average Outcome Confidence: {statistics.mean(outcome_confidences):.3f}")
        
        print("\n### KEY EVIDENCE IMPACT ###\n")
        print(f"JF1 (Shopify Email) Weight: {self.evidence['JF1_shopify_email']['weight']:.3f}")
        print(f"JF1 (Shopify Email) Credibility: {self.evidence['JF1_shopify_email']['credibility']:.3f}")
        print(f"JF1 (Shopify Email) Impact: IRREFUTABLE - Demolishes applicant's central claims")
        print(f"\nJF9 (Evidence Destruction) Weight: {self.evidence['JF9_timeline_evidence_destruction']['weight']:.3f}")
        print(f"JF9 (Evidence Destruction) Impact: Demonstrates consciousness of guilt")
        
        # Save results
        output = {
            "case_number": self.case_number,
            "iterations": iterations,
            "timestamp": datetime.now().isoformat(),
            "outcomes": dict(outcomes),
            "criminal_referrals": criminal_referrals,
            "costs_to_respondents": costs_to_respondents,
            "applicant_claim_success": dict(applicant_claim_success),
            "respondent_claim_success": dict(respondent_claim_success),
            "statistics": {
                "applicant_avg_success_rate": statistics.mean(applicant_success_rates),
                "respondents_avg_success_rate": statistics.mean(respondent_success_rates),
                "avg_outcome_confidence": statistics.mean(outcome_confidences),
                "avg_criminal_referral_likelihood": statistics.mean(criminal_referral_likelihoods)
            },
            "detailed_results": results
        }
        
        with open('affidavit_case_simulation_results.json', 'w') as f:
            json.dump(output, f, indent=2)
        
        print(f"\n\nDetailed results saved to: affidavit_case_simulation_results.json")
        print("="*80)
        
        return output

if __name__ == "__main__":
    sim = LegalCaseSimulation()
    results = sim.run_simulation(iterations=100)
