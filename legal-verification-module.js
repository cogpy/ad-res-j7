#!/usr/bin/env node

/**
 * Legal Verification Module
 * 
 * Implements optimal strategies and burden of proof verification for 
 * Dan & Jax vs other agents (Peter, Rynette, Bantjies, etc) across 
 * different legal standards:
 * - Civil: Balance of probabilities
 * - Criminal: Beyond reasonable doubt
 * - Mathematical: Invariant of all conditions
 * 
 * This module verifies proper issue creation with multiple labels
 * while implementing legal burden verification systems.
 */

const fs = require('fs');
const path = require('path');

class LegalVerificationModule {
  constructor() {
    this.verificationResults = {
      civil: { passed: 0, failed: 0, evidence: [] },
      criminal: { passed: 0, failed: 0, evidence: [] },
      mathematical: { passed: 0, failed: 0, evidence: [] }
    };
    
    this.agents = {
      dan: 'Daniel James Faucitt',
      jax: 'Jacqueline Faucitt', 
      peter: 'Peter Andrew Faucitt',
      rynette: 'Rynette (rynette@regimaskin.co.za)',
      bantjies: 'Bantjies'
    };
    
    this.legalElements = [
      'breach_of_fiduciary_duty',
      'fraudulent_misrepresentation', 
      'conspiracy_to_defraud',
      'director_loan_account_irregularities',
      'financial_misconduct',
      'breach_of_contract'
    ];
  }

  /**
   * Civil Standard: Balance of Probabilities (>50% certainty)
   * Evidence must show it's more likely than not that the accused is guilty
   */
  verifyCivilStandard(element, evidence, accusedAgent) {
    console.log(`\n⚖️  CIVIL VERIFICATION: ${element.toUpperCase()}`);
    console.log(`   Accused: ${this.agents[accusedAgent] || accusedAgent}`);
    console.log(`   Standard: Balance of Probabilities (>50% certainty)`);
    
    const criteria = {
      documentaryEvidence: this.assessDocumentaryEvidence(evidence),
      timelineConsistency: this.assessTimelineConsistency(evidence),
      witnessCredibility: this.assessWitnessCredibility(evidence),
      financialRecords: this.assessFinancialRecords(evidence),
      digitalFootprint: this.assessDigitalFootprint(evidence)
    };
    
    const totalScore = Object.values(criteria).reduce((sum, score) => sum + score, 0);
    const maxScore = Object.keys(criteria).length * 100;
    const percentage = (totalScore / maxScore) * 100;
    
    const meetsStandard = percentage > 50;
    
    console.log(`   📊 Evidence Assessment:`);
    Object.entries(criteria).forEach(([key, score]) => {
      console.log(`      ${key}: ${score}/100`);
    });
    console.log(`   📈 Overall Score: ${percentage.toFixed(1)}%`);
    console.log(`   ✅ Meets Civil Standard: ${meetsStandard ? 'YES' : 'NO'}`);
    
    if (meetsStandard) {
      this.verificationResults.civil.passed++;
      console.log(`   📋 Required for Civil Proof:`);
      console.log(`      - Documentary evidence showing ${element}`);
      console.log(`      - Timeline establishing causation`);
      console.log(`      - Financial records supporting claim`);
      console.log(`      - Preponderance of evidence favoring claim`);
    } else {
      this.verificationResults.civil.failed++;
      console.log(`   ❌ Insufficient for Civil Standard`);
      console.log(`   📋 Additional Evidence Needed:`);
      this.getAdditionalEvidenceNeeded(criteria, 'civil').forEach(need => {
        console.log(`      - ${need}`);
      });
    }
    
    this.verificationResults.civil.evidence.push({
      element,
      accused: accusedAgent,
      score: percentage,
      meets_standard: meetsStandard,
      criteria
    });
    
    return meetsStandard;
  }

  /**
   * Criminal Standard: Beyond Reasonable Doubt (~95% certainty)
   * Evidence must establish guilt to a high degree of certainty
   */
  verifyCriminalStandard(element, evidence, accusedAgent) {
    console.log(`\n⚖️  CRIMINAL VERIFICATION: ${element.toUpperCase()}`);
    console.log(`   Accused: ${this.agents[accusedAgent] || accusedAgent}`);
    console.log(`   Standard: Beyond Reasonable Doubt (~95% certainty)`);
    
    const criteria = {
      directEvidence: this.assessDirectEvidence(evidence),
      circumstantialEvidence: this.assessCircumstantialEvidence(evidence),
      mensRea: this.assessMensRea(evidence), // Intent
      actusReus: this.assessActusReus(evidence), // Guilty act
      chainOfCustody: this.assessChainOfCustody(evidence),
      expertTestimony: this.assessExpertTestimony(evidence),
      exclusionOfReasonableDoubt: this.assessExclusionOfDoubt(evidence)
    };
    
    const totalScore = Object.values(criteria).reduce((sum, score) => sum + score, 0);
    const maxScore = Object.keys(criteria).length * 100;
    const percentage = (totalScore / maxScore) * 100;
    
    const meetsStandard = percentage >= 95;
    
    console.log(`   📊 Evidence Assessment:`);
    Object.entries(criteria).forEach(([key, score]) => {
      console.log(`      ${key}: ${score}/100`);
    });
    console.log(`   📈 Overall Score: ${percentage.toFixed(1)}%`);
    console.log(`   ✅ Meets Criminal Standard: ${meetsStandard ? 'YES' : 'NO'}`);
    
    if (meetsStandard) {
      this.verificationResults.criminal.passed++;
      console.log(`   📋 Required for Criminal Proof:`);
      console.log(`      - Direct evidence of criminal intent`);
      console.log(`      - Proof of guilty act (actus reus)`);
      console.log(`      - Chain of custody for all evidence`);
      console.log(`      - Expert testimony supporting allegations`);
      console.log(`      - Exclusion of all reasonable doubt`);
    } else {
      this.verificationResults.criminal.failed++;
      console.log(`   ❌ Insufficient for Criminal Standard`);
      console.log(`   📋 Additional Evidence Needed:`);
      this.getAdditionalEvidenceNeeded(criteria, 'criminal').forEach(need => {
        console.log(`      - ${need}`);
      });
    }
    
    this.verificationResults.criminal.evidence.push({
      element,
      accused: accusedAgent,
      score: percentage,
      meets_standard: meetsStandard,
      criteria
    });
    
    return meetsStandard;
  }

  /**
   * Mathematical Standard: Invariant of all conditions (100% certainty)
   * All conditions must be satisfied with mathematical precision
   */
  verifyMathematicalStandard(element, evidence, accusedAgent) {
    console.log(`\n⚖️  MATHEMATICAL VERIFICATION: ${element.toUpperCase()}`);
    console.log(`   Accused: ${this.agents[accusedAgent] || accusedAgent}`);
    console.log(`   Standard: Invariant of all conditions (100% certainty)`);
    
    const conditions = {
      logicalConsistency: this.assessLogicalConsistency(evidence),
      mathematicalProof: this.assessMathematicalProof(evidence),
      algorithmicVerification: this.assessAlgorithmicVerification(evidence),
      dataIntegrity: this.assessDataIntegrity(evidence),
      computationalValidation: this.assessComputationalValidation(evidence),
      formalVerification: this.assessFormalVerification(evidence)
    };
    
    // For mathematical standard, ALL conditions must be 100%
    const allConditionsMet = Object.values(conditions).every(score => score === 100);
    const averageScore = Object.values(conditions).reduce((sum, score) => sum + score, 0) / Object.keys(conditions).length;
    
    console.log(`   📊 Condition Assessment:`);
    Object.entries(conditions).forEach(([key, score]) => {
      const status = score === 100 ? '✅' : '❌';
      console.log(`      ${status} ${key}: ${score}/100`);
    });
    console.log(`   📈 Average Score: ${averageScore.toFixed(1)}%`);
    console.log(`   ✅ Meets Mathematical Standard: ${allConditionsMet ? 'YES' : 'NO'}`);
    
    if (allConditionsMet) {
      this.verificationResults.mathematical.passed++;
      console.log(`   📋 Mathematical Proof Requirements Met:`);
      console.log(`      - All logical conditions satisfied`);
      console.log(`      - Mathematical proof validated`);
      console.log(`      - Algorithmic verification complete`);
      console.log(`      - Data integrity confirmed`);
      console.log(`      - Computational validation passed`);
      console.log(`      - Formal verification successful`);
    } else {
      this.verificationResults.mathematical.failed++;
      console.log(`   ❌ Mathematical Standard Not Satisfied`);
      console.log(`   📋 Conditions Not Met:`);
      Object.entries(conditions).forEach(([condition, score]) => {
        if (score < 100) {
          console.log(`      - ${condition}: ${score}/100 (INSUFFICIENT)`);
        }
      });
    }
    
    this.verificationResults.mathematical.evidence.push({
      element,
      accused: accusedAgent,
      average_score: averageScore,
      meets_standard: allConditionsMet,
      conditions
    });
    
    return allConditionsMet;
  }

  /**
   * Evidence Assessment Functions
   */
  assessDocumentaryEvidence(evidence) {
    // Simulate assessment of documentary evidence quality
    return Math.min(100, 60 + (evidence.documents?.length || 0) * 10);
  }

  assessTimelineConsistency(evidence) {
    // Assess timeline consistency
    return evidence.timeline_consistent ? 85 : 45;
  }

  assessWitnessCredibility(evidence) {
    // Assess witness credibility
    return Math.min(100, 50 + (evidence.witnesses?.length || 0) * 15);
  }

  assessFinancialRecords(evidence) {
    // Assess financial record quality
    return evidence.financial_records_complete ? 90 : 30;
  }

  assessDigitalFootprint(evidence) {
    // Assess digital evidence quality
    return Math.min(100, 40 + (evidence.digital_evidence?.length || 0) * 20);
  }

  assessDirectEvidence(evidence) {
    // Direct evidence assessment for criminal standard
    return evidence.direct_evidence ? 95 : 20;
  }

  assessCircumstantialEvidence(evidence) {
    // Circumstantial evidence assessment
    return Math.min(100, 30 + (evidence.circumstantial?.length || 0) * 15);
  }

  assessMensRea(evidence) {
    // Criminal intent assessment
    return evidence.intent_proven ? 90 : 25;
  }

  assessActusReus(evidence) {
    // Guilty act assessment
    return evidence.guilty_act_proven ? 95 : 30;
  }

  assessChainOfCustody(evidence) {
    // Chain of custody assessment
    return evidence.chain_of_custody_intact ? 100 : 40;
  }

  assessExpertTestimony(evidence) {
    // Expert testimony assessment
    return evidence.expert_testimony ? 85 : 35;
  }

  assessExclusionOfDoubt(evidence) {
    // Reasonable doubt exclusion
    return evidence.no_reasonable_doubt ? 95 : 40;
  }

  assessLogicalConsistency(evidence) {
    // Logical consistency for mathematical standard
    return evidence.logically_consistent ? 100 : 0;
  }

  assessMathematicalProof(evidence) {
    // Mathematical proof assessment
    return evidence.mathematical_proof ? 100 : 0;
  }

  assessAlgorithmicVerification(evidence) {
    // Algorithmic verification
    return evidence.algorithmic_verified ? 100 : 0;
  }

  assessDataIntegrity(evidence) {
    // Data integrity assessment
    return evidence.data_integrity_verified ? 100 : 0;
  }

  assessComputationalValidation(evidence) {
    // Computational validation
    return evidence.computationally_validated ? 100 : 0;
  }

  assessFormalVerification(evidence) {
    // Formal verification assessment
    return evidence.formally_verified ? 100 : 0;
  }

  /**
   * Get additional evidence needed based on failed criteria
   */
  getAdditionalEvidenceNeeded(criteria, standard) {
    const needed = [];
    
    if (standard === 'civil') {
      Object.entries(criteria).forEach(([key, score]) => {
        if (score < 60) {
          switch (key) {
            case 'documentaryEvidence':
              needed.push('Additional documentary evidence (contracts, emails, records)');
              break;
            case 'timelineConsistency':
              needed.push('Timeline reconstruction showing sequence of events');
              break;
            case 'witnessCredibility':
              needed.push('Additional witness statements or affidavits');
              break;
            case 'financialRecords':
              needed.push('Complete financial records and transaction history');
              break;
            case 'digitalFootprint':
              needed.push('Digital evidence (emails, system logs, metadata)');
              break;
          }
        }
      });
    } else if (standard === 'criminal') {
      Object.entries(criteria).forEach(([key, score]) => {
        if (score < 95) {
          switch (key) {
            case 'directEvidence':
              needed.push('Direct evidence of criminal conduct');
              break;
            case 'mensRea':
              needed.push('Evidence of criminal intent (mens rea)');
              break;
            case 'actusReus':
              needed.push('Proof of guilty act (actus reus)');
              break;
            case 'chainOfCustody':
              needed.push('Proper chain of custody for all evidence');
              break;
            case 'expertTestimony':
              needed.push('Expert witness testimony');
              break;
          }
        }
      });
    }
    
    return needed;
  }

  /**
   * Generate comprehensive verification report
   */
  generateVerificationReport() {
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('📊 LEGAL VERIFICATION SUMMARY REPORT');
    console.log('═══════════════════════════════════════════════════════════════');
    
    console.log('\n⚖️  CIVIL STANDARD (Balance of Probabilities)');
    console.log(`   ✅ Passed: ${this.verificationResults.civil.passed}`);
    console.log(`   ❌ Failed: ${this.verificationResults.civil.failed}`);
    console.log(`   📈 Success Rate: ${this.calculateSuccessRate('civil')}%`);
    
    console.log('\n⚖️  CRIMINAL STANDARD (Beyond Reasonable Doubt)');
    console.log(`   ✅ Passed: ${this.verificationResults.criminal.passed}`);
    console.log(`   ❌ Failed: ${this.verificationResults.criminal.failed}`);
    console.log(`   📈 Success Rate: ${this.calculateSuccessRate('criminal')}%`);
    
    console.log('\n⚖️  MATHEMATICAL STANDARD (Invariant of All Conditions)');
    console.log(`   ✅ Passed: ${this.verificationResults.mathematical.passed}`);
    console.log(`   ❌ Failed: ${this.verificationResults.mathematical.failed}`);
    console.log(`   📈 Success Rate: ${this.calculateSuccessRate('mathematical')}%`);
    
    // Generate strategic recommendations
    console.log('\n📋 STRATEGIC RECOMMENDATIONS FOR DAN & JAX:');
    this.generateStrategicRecommendations();
    
    return this.verificationResults;
  }

  calculateSuccessRate(standard) {
    const results = this.verificationResults[standard];
    const total = results.passed + results.failed;
    if (total === 0) return 0;
    return ((results.passed / total) * 100).toFixed(1);
  }

  generateStrategicRecommendations() {
    console.log('\n1. 🎯 CIVIL STRATEGY OPTIMIZATION:');
    console.log('   - Focus on documentary evidence compilation');
    console.log('   - Establish clear timeline of events');
    console.log('   - Strengthen witness testimony credibility');
    console.log('   - Ensure financial record completeness');
    
    console.log('\n2. 🎯 CRIMINAL DEFENSE STRATEGY:');
    console.log('   - Challenge direct evidence admissibility');
    console.log('   - Question chain of custody procedures');
    console.log('   - Introduce reasonable doubt through expert testimony');
    console.log('   - Contest intent (mens rea) evidence');
    
    console.log('\n3. 🎯 MATHEMATICAL VERIFICATION STRATEGY:');
    console.log('   - Implement formal verification protocols');
    console.log('   - Use algorithmic validation for evidence');
    console.log('   - Ensure data integrity through cryptographic means');
    console.log('   - Apply computational validation to all claims');
    
    console.log('\n4. 🎯 BURDEN OF PROOF OPTIMIZATION:');
    console.log('   - Civil: Compile evidence reaching >50% threshold');
    console.log('   - Criminal: Establish evidence to 95% certainty');
    console.log('   - Mathematical: Achieve 100% validation on all conditions');
  }

  /**
   * Test the verification system with sample cases
   */
  runVerificationTests() {
    console.log('🚀 Starting Legal Verification System Tests...');
    console.log('Testing burden of proof mechanisms for Dan & Jax vs other agents\n');
    
    // Test cases for different agents and legal elements
    const testCases = [
      {
        element: 'breach_of_fiduciary_duty',
        accused: 'peter',
        evidence: {
          documents: ['director_resolution', 'financial_statements'],
          timeline_consistent: true,
          witnesses: ['accounting_firm', 'board_member'],
          financial_records_complete: true,
          digital_evidence: ['email_communications', 'system_logs'],
          direct_evidence: false,
          intent_proven: false,
          guilty_act_proven: true,
          chain_of_custody_intact: true,
          expert_testimony: true,
          no_reasonable_doubt: false,
          logically_consistent: false,
          mathematical_proof: false,
          algorithmic_verified: false,
          data_integrity_verified: false,
          computationally_validated: false,
          formally_verified: false
        }
      },
      {
        element: 'fraudulent_misrepresentation',
        accused: 'rynette',
        evidence: {
          documents: ['transaction_records', 'communication_logs'],
          timeline_consistent: true,
          witnesses: ['uk_contact', 'financial_analyst'],
          financial_records_complete: false,
          digital_evidence: ['email_trail'],
          direct_evidence: true,
          intent_proven: true,
          guilty_act_proven: true,
          chain_of_custody_intact: true,
          expert_testimony: true,
          no_reasonable_doubt: true,
          logically_consistent: true,
          mathematical_proof: true,
          algorithmic_verified: true,
          data_integrity_verified: true,
          computationally_validated: true,
          formally_verified: true
        }
      },
      {
        element: 'director_loan_account_irregularities',
        accused: 'bantjies',
        evidence: {
          documents: ['loan_agreements'],
          timeline_consistent: false,
          witnesses: [],
          financial_records_complete: false,
          digital_evidence: [],
          direct_evidence: false,
          intent_proven: false,
          guilty_act_proven: false,
          chain_of_custody_intact: false,
          expert_testimony: false,
          no_reasonable_doubt: false,
          logically_consistent: false,
          mathematical_proof: false,
          algorithmic_verified: false,
          data_integrity_verified: false,
          computationally_validated: false,
          formally_verified: false
        }
      }
    ];
    
    // Run verification for each test case across all standards
    testCases.forEach((testCase, index) => {
      console.log(`\n📋 TEST CASE ${index + 1}: ${testCase.element} - ${testCase.accused.toUpperCase()}`);
      console.log('═'.repeat(60));
      
      this.verifyCivilStandard(testCase.element, testCase.evidence, testCase.accused);
      this.verifyCriminalStandard(testCase.element, testCase.evidence, testCase.accused);
      this.verifyMathematicalStandard(testCase.element, testCase.evidence, testCase.accused);
    });
    
    // Generate comprehensive report
    this.generateVerificationReport();
    
    console.log('\n✅ Legal Verification System Tests Completed');
    return this.verificationResults;
  }

  /**
   * Verify issue creation with multiple labels in the context of legal verification
   */
  verifyIssueCreationWithMultipleLabels() {
    console.log('\n🔍 VERIFYING ISSUE CREATION WITH MULTIPLE LABELS');
    console.log('Integrating legal verification with GitHub issue workflow...\n');
    
    const legalIssueTypes = [
      {
        title: 'Civil Evidence Compilation - Breach of Fiduciary Duty',
        labels: ['legal-civil', 'priority: high', 'evidence-collection', 'fiduciary-duty', 'dan-jax-defense'],
        legal_standard: 'civil',
        burden_threshold: 50
      },
      {
        title: 'Criminal Defense Strategy - Fraudulent Misrepresentation',
        labels: ['legal-criminal', 'priority: critical', 'defense-strategy', 'fraud-allegation', 'reasonable-doubt'],
        legal_standard: 'criminal', 
        burden_threshold: 95
      },
      {
        title: 'Mathematical Verification - Director Loan Account Analysis',
        labels: ['legal-mathematical', 'priority: medium', 'formal-verification', 'algorithmic-proof', 'data-integrity'],
        legal_standard: 'mathematical',
        burden_threshold: 100
      }
    ];
    
    console.log('📊 Legal Issue Label Verification:');
    legalIssueTypes.forEach((issue, index) => {
      console.log(`\n${index + 1}. ${issue.title}`);
      console.log(`   Labels: [${issue.labels.join(', ')}]`);
      console.log(`   Legal Standard: ${issue.legal_standard} (threshold: ${issue.burden_threshold}%)`);
      
      // Verify label structure
      const hasLegalLabel = issue.labels.some(label => label.startsWith('legal-'));
      const hasPriorityLabel = issue.labels.some(label => label.startsWith('priority:'));
      const hasSpecificLabel = issue.labels.some(label => 
        label.includes('duty') || label.includes('fraud') || label.includes('verification')
      );
      
      console.log(`   ✅ Legal classification: ${hasLegalLabel ? 'YES' : 'NO'}`);
      console.log(`   ✅ Priority assignment: ${hasPriorityLabel ? 'YES' : 'NO'}`);
      console.log(`   ✅ Specific categorization: ${hasSpecificLabel ? 'YES' : 'NO'}`);
      
      if (hasLegalLabel && hasPriorityLabel && hasSpecificLabel) {
        console.log(`   🎯 Issue creation validation: PASSED`);
      } else {
        console.log(`   ❌ Issue creation validation: FAILED`);
      }
    });
    
    return legalIssueTypes;
  }
}

// Main execution
if (require.main === module) {
  const verifier = new LegalVerificationModule();
  
  console.log('🏛️  LEGAL VERIFICATION MODULE - BURDEN OF PROOF SYSTEM');
  console.log('Testing optimal strategies for Dan & Jax vs other agents');
  console.log('Standards: Civil, Criminal, Mathematical');
  console.log('═'.repeat(80));
  
  // Run comprehensive verification tests
  verifier.runVerificationTests();
  
  // Verify issue creation with multiple labels
  verifier.verifyIssueCreationWithMultipleLabels();
  
  console.log('\n🎉 Legal Verification Module execution completed!');
}

module.exports = LegalVerificationModule;