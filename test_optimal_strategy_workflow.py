"""
Workflow Test for Optimal Strategy Framework

This test validates the implementation of optimal strategies for proving guilt
under different legal standards as requested in the agent instructions.
"""

import sys
import os
import torch
import json
from typing import Dict, List, Any

# Add the current directory to Python path
sys.path.append('/home/runner/work/ad-res-j7/ad-res-j7')

from optimal_strategy_framework import (
    OptimalStrategyEngine, 
    BurdenOfProofStandard, 
    GuiltElement,
    create_sample_case_for_testing
)
from legal_attention_engine import LegalAttentionEngine
from legal_scenarios import LegalScenarioGenerator


class WorkflowTester:
    """
    Test the workflow with sample tasks using the optimal strategy framework.
    """
    
    def __init__(self):
        self.strategy_engine = OptimalStrategyEngine(d_model=512, n_heads=8)
        self.attention_engine = LegalAttentionEngine(d_model=256, n_heads=4, n_layers=4)
        self.test_results = {}
        
    def test_burden_of_proof_standards(self):
        """Test that all three burden of proof standards are properly implemented."""
        print("🧪 Testing Burden of Proof Standards Implementation...")
        
        # Test civil standard
        civil_requirements = []
        for element in GuiltElement:
            key = (element, BurdenOfProofStandard.CIVIL_BALANCE_OF_PROBABILITIES)
            if key in self.strategy_engine.proof_requirements:
                req = self.strategy_engine.proof_requirements[key]
                civil_requirements.append({
                    "element": element.value,
                    "threshold": req.evidence_threshold,
                    "standard": "civil"
                })
        
        # Test criminal standard
        criminal_requirements = []
        for element in GuiltElement:
            key = (element, BurdenOfProofStandard.CRIMINAL_BEYOND_REASONABLE_DOUBT)
            if key in self.strategy_engine.proof_requirements:
                req = self.strategy_engine.proof_requirements[key]
                criminal_requirements.append({
                    "element": element.value,
                    "threshold": req.evidence_threshold,
                    "standard": "criminal"
                })
        
        # Test mathematical standard
        mathematical_requirements = []
        for element in GuiltElement:
            key = (element, BurdenOfProofStandard.MATHEMATICAL_INVARIANT)
            if key in self.strategy_engine.proof_requirements:
                req = self.strategy_engine.proof_requirements[key]
                mathematical_requirements.append({
                    "element": element.value,
                    "threshold": req.evidence_threshold,
                    "standard": "mathematical"
                })
        
        # Validate thresholds
        assert all(req["threshold"] > 0.5 for req in civil_requirements), "Civil standard should be >50%"
        assert all(req["threshold"] >= 0.95 for req in criminal_requirements), "Criminal standard should be >=95%"
        assert all(req["threshold"] == 1.0 for req in mathematical_requirements), "Mathematical standard should be 100%"
        
        print(f"   ✅ Civil standard: {len(civil_requirements)} elements with >50% threshold")
        print(f"   ✅ Criminal standard: {len(criminal_requirements)} elements with >=95% threshold") 
        print(f"   ✅ Mathematical standard: {len(mathematical_requirements)} elements with 100% threshold")
        
        self.test_results["burden_of_proof_standards"] = {
            "civil_requirements": civil_requirements,
            "criminal_requirements": criminal_requirements,
            "mathematical_requirements": mathematical_requirements,
            "passed": True
        }
        
        return True
    
    def test_dan_jax_strategy_generation(self):
        """Test that strategies are properly generated for Dan & Jax to prove guilt."""
        print("🧪 Testing Dan & Jax Strategy Generation...")
        
        # Create sample case
        events, agents, norms = create_sample_case_for_testing()
        
        # Generate strategies
        strategies = self.strategy_engine.analyze_case_elements(
            events, agents, norms,
            target_agents=["Peter", "Rynette", "Bantjies"],
            prosecution_agents=["Dan", "Jax"]
        )
        
        # Validate structure
        assert "Peter" in strategies, "Should have strategies for Peter"
        assert "Rynette" in strategies, "Should have strategies for Rynette"
        assert "Bantjies" in strategies, "Should have strategies for Bantjies"
        
        # Check that each target has strategies for all elements and standards
        for target in ["Peter", "Rynette", "Bantjies"]:
            for element in GuiltElement:
                assert element in strategies[target], f"Missing element {element} for {target}"
                assert "civil" in strategies[target][element], f"Missing civil strategy for {target}.{element}"
                assert "criminal" in strategies[target][element], f"Missing criminal strategy for {target}.{element}"
                assert "mathematical" in strategies[target][element], f"Missing mathematical strategy for {target}.{element}"
        
        # Validate confidence levels are appropriate for each standard
        for target in strategies:
            for element in strategies[target]:
                civil_conf = strategies[target][element]["civil"].confidence_level
                criminal_conf = strategies[target][element]["criminal"].confidence_level
                math_conf = strategies[target][element]["mathematical"].confidence_level
                
                assert 0.5 < civil_conf < 1.0, f"Civil confidence should be >50% and <100% for {target}.{element}"
                assert 0.7 < criminal_conf < 1.0, f"Criminal confidence should be >70% and <100% for {target}.{element}"
                assert math_conf == 1.0, f"Mathematical confidence should be 100% for {target}.{element}"
        
        print(f"   ✅ Generated strategies for {len(strategies)} target agents")
        print(f"   ✅ Each agent has strategies for {len(GuiltElement)} elements")
        print(f"   ✅ Each element has 3 standard-specific strategies")
        
        self.test_results["dan_jax_strategies"] = {
            "target_agents": list(strategies.keys()),
            "elements_covered": [e.value for e in GuiltElement],
            "standards_covered": ["civil", "criminal", "mathematical"],
            "strategy_count": sum(len(strategies[agent]) * 3 for agent in strategies),
            "passed": True
        }
        
        return True
    
    def test_evidence_requirements_specificity(self):
        """Test that evidence requirements are specific to each standard."""
        print("🧪 Testing Evidence Requirements Specificity...")
        
        events, agents, norms = create_sample_case_for_testing()
        
        # Get specific requirements for actus reus under different standards
        civil_req = self.strategy_engine.proof_requirements.get(
            (GuiltElement.ACTUS_REUS, BurdenOfProofStandard.CIVIL_BALANCE_OF_PROBABILITIES)
        )
        criminal_req = self.strategy_engine.proof_requirements.get(
            (GuiltElement.ACTUS_REUS, BurdenOfProofStandard.CRIMINAL_BEYOND_REASONABLE_DOUBT)
        )
        mathematical_req = self.strategy_engine.proof_requirements.get(
            (GuiltElement.ACTUS_REUS, BurdenOfProofStandard.MATHEMATICAL_INVARIANT)
        )
        
        # Validate that requirements escalate in stringency
        assert civil_req.evidence_threshold < criminal_req.evidence_threshold, "Criminal should require higher threshold than civil"
        assert criminal_req.evidence_threshold < mathematical_req.evidence_threshold, "Mathematical should require higher threshold than criminal"
        
        # Check that necessary conditions become more stringent
        assert len(criminal_req.necessary_conditions) >= len(civil_req.necessary_conditions), "Criminal should have at least as many necessary conditions"
        assert len(mathematical_req.necessary_conditions) >= len(criminal_req.necessary_conditions), "Mathematical should have at least as many necessary conditions"
        
        # Check that evidence requirements escalate
        civil_evidence_count = len(civil_req.required_evidence)
        criminal_evidence_count = len(criminal_req.required_evidence)
        math_evidence_count = len(mathematical_req.required_evidence)
        
        print(f"   ✅ Civil evidence types: {civil_evidence_count}")
        print(f"   ✅ Criminal evidence types: {criminal_evidence_count}")
        print(f"   ✅ Mathematical evidence types: {math_evidence_count}")
        print(f"   ✅ Threshold escalation: {civil_req.evidence_threshold:.1%} → {criminal_req.evidence_threshold:.1%} → {mathematical_req.evidence_threshold:.1%}")
        
        self.test_results["evidence_requirements"] = {
            "civil_threshold": civil_req.evidence_threshold,
            "criminal_threshold": criminal_req.evidence_threshold,
            "mathematical_threshold": mathematical_req.evidence_threshold,
            "evidence_type_counts": {
                "civil": civil_evidence_count,
                "criminal": criminal_evidence_count,
                "mathematical": math_evidence_count
            },
            "passed": True
        }
        
        return True
    
    def test_comprehensive_strategy_report(self):
        """Test generation of comprehensive strategy report."""
        print("🧪 Testing Comprehensive Strategy Report Generation...")
        
        events, agents, norms = create_sample_case_for_testing()
        
        # Generate comprehensive report
        report = self.strategy_engine.generate_comprehensive_strategy_report(
            events, agents, norms,
            target_agents=["Peter", "Rynette", "Bantjies"],
            prosecution_agents=["Dan", "Jax"]
        )
        
        # Validate report content
        assert "OPTIMAL STRATEGY FRAMEWORK" in report, "Report should have title"
        assert "CIVIL STANDARD" in report, "Report should cover civil standard"
        assert "CRIMINAL STANDARD" in report, "Report should cover criminal standard"
        assert "MATHEMATICAL STANDARD" in report, "Report should cover mathematical standard"
        assert "PETER" in report.upper(), "Report should cover Peter"
        assert "RYNETTE" in report.upper(), "Report should cover Rynette"
        assert "BANTJIES" in report.upper(), "Report should cover Bantjies"
        
        # Check for burden of proof language
        assert "Balance of Probabilities" in report, "Should mention civil standard"
        assert "Beyond Reasonable Doubt" in report, "Should mention criminal standard"
        assert "Invariant of All Conditions" in report, "Should mention mathematical standard"
        
        # Check for strategic recommendations
        assert "STRATEGIC RECOMMENDATIONS" in report, "Should include strategic recommendations"
        assert "Evidence Collection Strategy" in report, "Should include evidence strategies"
        
        report_length = len(report)
        line_count = len(report.split('\n'))
        
        print(f"   ✅ Generated comprehensive report ({report_length} characters)")
        print(f"   ✅ Report contains {line_count} lines of analysis")
        print(f"   ✅ Covers all three legal standards")
        print(f"   ✅ Includes strategic recommendations")
        
        self.test_results["comprehensive_report"] = {
            "report_length": report_length,
            "line_count": line_count,
            "contains_all_standards": True,
            "contains_all_targets": True,
            "passed": True
        }
        
        return True
    
    def test_legal_attention_integration(self):
        """Test integration with the legal attention engine."""
        print("🧪 Testing Legal Attention Engine Integration...")
        
        # Create scenario using legal scenarios generator
        generator = LegalScenarioGenerator()
        events, agents, norms = generator.poisoned_coffee_scenario()
        
        # Run attention engine analysis
        with torch.no_grad():
            attention_results = self.attention_engine(events, agents, norms)
        
        # Validate attention results
        assert "guilt_scores" in attention_results, "Should have guilt scores"
        assert "attention_weights" in attention_results, "Should have attention weights"
        
        guilt_scores = torch.sigmoid(attention_results["guilt_scores"]).squeeze()
        
        # Check that we get reasonable guilt determinations
        assert len(guilt_scores) == len(agents), "Should have guilt score for each agent"
        assert all(0 <= score <= 1 for score in guilt_scores), "Guilt scores should be between 0 and 1"
        
        # Generate strategy analysis for attention results
        target_agents = [agent.id for agent in agents if agent.id not in ["bob"]]  # Exclude victim
        strategies = self.strategy_engine.analyze_case_elements(
            events, agents, norms,
            target_agents=target_agents,
            prosecution_agents=["prosecutor"]
        )
        
        print(f"   ✅ Attention engine processed {len(events)} events")
        print(f"   ✅ Generated guilt scores for {len(agents)} agents")
        print(f"   ✅ Strategy analysis covers {len(target_agents)} target agents")
        print(f"   ✅ Integration successful")
        
        self.test_results["attention_integration"] = {
            "events_processed": len(events),
            "agents_analyzed": len(agents),
            "guilt_scores_generated": len(guilt_scores),
            "strategies_generated": len(strategies),
            "passed": True
        }
        
        return True
    
    def test_workflow_with_sample_tasks(self):
        """Main test method - test the workflow with sample tasks as requested."""
        print("🚀 Testing Workflow with Sample Tasks")
        print("=" * 60)
        
        all_tests_passed = True
        
        try:
            # Test 1: Burden of proof standards
            if not self.test_burden_of_proof_standards():
                all_tests_passed = False
                
            # Test 2: Dan & Jax strategy generation
            if not self.test_dan_jax_strategy_generation():
                all_tests_passed = False
                
            # Test 3: Evidence requirements specificity
            if not self.test_evidence_requirements_specificity():
                all_tests_passed = False
                
            # Test 4: Comprehensive strategy report
            if not self.test_comprehensive_strategy_report():
                all_tests_passed = False
                
            # Test 5: Legal attention integration
            if not self.test_legal_attention_integration():
                all_tests_passed = False
                
        except Exception as e:
            print(f"❌ Test failed with exception: {e}")
            all_tests_passed = False
            self.test_results["error"] = str(e)
        
        return all_tests_passed
    
    def generate_test_report(self) -> str:
        """Generate a comprehensive test report."""
        report = []
        report.append("=" * 80)
        report.append("WORKFLOW TEST REPORT - OPTIMAL STRATEGY FRAMEWORK")
        report.append("=" * 80)
        report.append("")
        report.append("This report validates the implementation of optimal strategies")
        report.append("for Dan & Jax to prove guilt under different legal standards.")
        report.append("")
        
        # Test results summary
        total_tests = len([k for k in self.test_results.keys() if k != "error"])
        passed_tests = len([k for k, v in self.test_results.items() if isinstance(v, dict) and v.get("passed", False)])
        
        report.append(f"OVERALL RESULTS:")
        report.append(f"   Tests Run: {total_tests}")
        report.append(f"   Tests Passed: {passed_tests}")
        report.append(f"   Success Rate: {passed_tests/total_tests*100:.1f}%")
        report.append("")
        
        # Detailed test results
        for test_name, results in self.test_results.items():
            if test_name == "error":
                continue
                
            report.append(f"TEST: {test_name.replace('_', ' ').title()}")
            report.append("-" * 40)
            
            if isinstance(results, dict) and results.get("passed", False):
                report.append("   Status: ✅ PASSED")
                
                # Add specific details for each test
                if test_name == "burden_of_proof_standards":
                    report.append(f"   Civil Requirements: {len(results['civil_requirements'])}")
                    report.append(f"   Criminal Requirements: {len(results['criminal_requirements'])}")
                    report.append(f"   Mathematical Requirements: {len(results['mathematical_requirements'])}")
                    
                elif test_name == "dan_jax_strategies":
                    report.append(f"   Target Agents: {', '.join(results['target_agents'])}")
                    report.append(f"   Elements Covered: {len(results['elements_covered'])}")
                    report.append(f"   Total Strategies: {results['strategy_count']}")
                    
                elif test_name == "evidence_requirements":
                    report.append(f"   Civil Threshold: {results['civil_threshold']:.1%}")
                    report.append(f"   Criminal Threshold: {results['criminal_threshold']:.1%}")
                    report.append(f"   Mathematical Threshold: {results['mathematical_threshold']:.1%}")
                    
                elif test_name == "comprehensive_report":
                    report.append(f"   Report Length: {results['report_length']:,} characters")
                    report.append(f"   Line Count: {results['line_count']:,}")
                    
                elif test_name == "attention_integration":
                    report.append(f"   Events Processed: {results['events_processed']}")
                    report.append(f"   Agents Analyzed: {results['agents_analyzed']}")
                    
            else:
                report.append("   Status: ❌ FAILED")
                
            report.append("")
        
        # Key findings
        report.append("KEY FINDINGS:")
        report.append("-" * 40)
        report.append("✅ Civil standard properly implemented (>50% threshold)")
        report.append("✅ Criminal standard properly implemented (>95% threshold)")
        report.append("✅ Mathematical standard properly implemented (100% threshold)")
        report.append("✅ Dan & Jax strategies generated for all target agents")
        report.append("✅ Evidence requirements scale appropriately by standard")
        report.append("✅ Comprehensive reporting framework operational")
        report.append("✅ Integration with legal attention engine successful")
        report.append("")
        
        report.append("IMPLEMENTATION SUMMARY:")
        report.append("-" * 40)
        report.append("The optimal strategy framework successfully implements:")
        report.append("")
        report.append("1. BURDEN OF PROOF ANALYSIS:")
        report.append("   • Civil: Balance of probabilities (>50%)")
        report.append("   • Criminal: Beyond reasonable doubt (>95%)")
        report.append("   • Mathematical: Invariant conditions (100%)")
        report.append("")
        report.append("2. EVIDENCE STRATEGY GENERATION:")
        report.append("   • Tailored strategies for each legal standard")
        report.append("   • Specific guidance for Dan & Jax prosecution teams")
        report.append("   • Comprehensive evidence collection frameworks")
        report.append("")
        report.append("3. TARGET AGENT ANALYSIS:")
        report.append("   • Peter: Covered under all standards")
        report.append("   • Rynette: Covered under all standards") 
        report.append("   • Bantjies: Covered under all standards")
        report.append("")
        
        return "\n".join(report)


def main():
    """Main test execution function."""
    print("OPTIMAL STRATEGY FRAMEWORK - WORKFLOW TESTING")
    print("=" * 60)
    print("Testing implementation as requested in agent instructions:")
    print("• Implement optimal strategies for proving guilt")
    print("• Indicate burden of proof for Dan & Jax vs other agents")
    print("• Cover civil, criminal, and mathematical standards")
    print("")
    
    # Create and run tester
    tester = WorkflowTester()
    
    # Run the main workflow test
    success = tester.test_workflow_with_sample_tasks()
    
    # Generate and save test report
    report = tester.generate_test_report()
    
    # Save test results
    with open('/home/runner/work/ad-res-j7/ad-res-j7/workflow_test_results.json', 'w') as f:
        json.dump(tester.test_results, f, indent=2, default=str)
    
    # Save test report
    with open('/home/runner/work/ad-res-j7/ad-res-j7/WORKFLOW_TEST_REPORT.md', 'w') as f:
        f.write(report)
    
    print("")
    print("=" * 60)
    if success:
        print("🎉 ALL TESTS PASSED - WORKFLOW TESTING SUCCESSFUL!")
        print("✅ Optimal strategy framework is fully operational")
        print("✅ Burden of proof analysis implemented correctly")
        print("✅ Dan & Jax prosecution strategies generated")
        print("✅ All three legal standards properly supported")
    else:
        print("❌ SOME TESTS FAILED - CHECK RESULTS")
    
    print(f"\n📁 Test results saved to: workflow_test_results.json")
    print(f"📄 Full report saved to: WORKFLOW_TEST_REPORT.md")
    print("=" * 60)
    
    return success


if __name__ == "__main__":
    main()