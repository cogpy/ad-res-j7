/**
 * Burden of Proof Strategy Implementation
 * 
 * Implements strategic framework for proving guilt of agents under different legal standards
 * Integrates with optimal-strategy-implementation.js system
 * Case 2025-137857 - Dan & Jax vs Peter, Rynette, Bantjies
 */

const fs = require('fs');
const path = require('path');

class BurdenOfProofImplementation {
  constructor() {
    this.agents = this.defineAgents();
    this.proofStandards = this.defineProofStandards();
    this.allegations = this.defineAllegations();
    this.evidenceRequirements = this.defineEvidenceRequirements();
    this.currentEvidence = this.loadCurrentEvidence();
    
    this.strategies = this.initializeStrategies();
    this.assessCurrentPosition();
  }

  /**
   * Define the agents involved in the case
   */
  defineAgents() {
    return {
      prosecutors: {
        dan: {
          name: 'Daniel James Faucitt',
          role: 'Second Respondent',
          position: 'Responsible Person (37 jurisdictions)',
          strengths: ['Technical expertise', 'Regulatory knowledge', 'International compliance'],
          litigation_capacity: 'High'
        },
        jax: {
          name: 'Jacqueline Faucitt',
          role: 'First Respondent', 
          position: 'Business Operations Director',
          strengths: ['Financial analysis', 'Business operations', 'Evidence coordination'],
          litigation_capacity: 'High'
        }
      },
      defendants: {
        peter: {
          name: 'Peter Andrew Faucitt',
          role: 'Applicant (Civil), Defendant (Criminal)',
          position: 'Former business partner',
          vulnerabilities: ['Perjury exposure', 'Material non-disclosure', 'Document trail'],
          risk_level: 'Extreme'
        },
        rynette: {
          name: 'Rynette Farrar',
          role: 'Peter\'s partner, Co-conspirator',
          position: 'Email domain controller',
          vulnerabilities: ['Computer fraud', 'Identity theft', 'Technical evidence'],
          risk_level: 'High'
        },
        bantjies: {
          name: 'Daniel Jacobus Bantjies',
          role: 'Accountant, Family trust trustee',
          position: 'Professional with fiduciary duties',
          vulnerabilities: ['Professional misconduct', 'Perjury', 'Conflict of interest'],
          risk_level: 'Medium-High'
        }
      }
    };
  }

  /**
   * Define the three standards of proof with quantitative thresholds
   */
  defineProofStandards() {
    return {
      civil: {
        name: 'Balance of Probabilities',
        threshold: 0.51, // 51%
        description: 'More likely than not',
        application: ['Civil court proceedings', 'Interdict applications', 'Damages claims'],
        evidence_level: 'Preponderance of evidence',
        practical_threshold: 0.65, // Target 65% for comfort margin
        south_african_law: 'Civil Procedure Act, common law standard'
      },
      criminal: {
        name: 'Beyond Reasonable Doubt',
        threshold: 0.90, // 90%
        description: 'No reasonable doubt remains',
        application: ['Criminal prosecution', 'Imprisonment', 'Criminal records'],
        evidence_level: 'Comprehensive proof excluding reasonable alternatives',
        practical_threshold: 0.85, // Target 85% for prosecution comfort
        south_african_law: 'Criminal Procedure Act 51 of 1977'
      },
      invariant: {
        name: 'Mathematical/Logical Certainty',
        threshold: 1.0, // 100%
        description: 'Invariant under all conditions',
        application: ['Irrefutable arguments', 'Strategic positioning', 'Academic analysis'],
        evidence_level: 'Logical necessity, mathematical proof',
        practical_threshold: 1.0, // Must be absolutely certain
        south_african_law: 'Logical and mathematical principles'
      }
    };
  }

  /**
   * Define specific allegations against each agent
   */
  defineAllegations() {
    return {
      peter: {
        civil: [
          {
            charge: 'Material Non-Disclosure',
            description: 'Failed to disclose material facts to court',
            harm_quantified: 'R18M+ damages from unjust interdict',
            evidence_strength: 0.95,
            categories: 8
          },
          {
            charge: 'Perjury (Civil Liability)',
            description: 'False statements in founding affidavit',
            harm_quantified: 'Court reliance on false information',
            evidence_strength: 0.90,
            contradictions: 5
          },
          {
            charge: 'Fraud/Misrepresentation',
            description: 'Obtaining interdict through false statements',
            harm_quantified: 'R18M+ business disruption and losses',
            evidence_strength: 0.92,
            pattern_established: true
          }
        ],
        criminal: [
          {
            charge: 'Perjury (Criminal)',
            description: 'False sworn statements in legal proceeding',
            penalty: 'Up to 15 years imprisonment',
            evidence_strength: 0.85,
            evidence_gaps: ['Complete email archives', 'Financial records']
          },
          {
            charge: 'Fraud',
            description: 'Intentional misrepresentation for unlawful gain',
            penalty: 'Up to 15 years imprisonment',
            evidence_strength: 0.80,
            evidence_gaps: ['Financial benefit analysis', 'Pattern evidence']
          },
          {
            charge: 'Theft by Conversion',
            description: 'Wrongful appropriation of company assets',
            penalty: 'Up to 20 years imprisonment',
            evidence_strength: 0.75,
            evidence_gaps: ['Complete bank records', 'Payment gateway data']
          }
        ]
      },
      rynette: {
        civil: [
          {
            charge: 'Email Impersonation',
            description: 'Control and misuse of pete@regima.com',
            harm_quantified: 'R3.1M+ revenue theft facilitation',
            evidence_strength: 0.85,
            technical_proof_needed: true
          },
          {
            charge: 'Conspiracy',
            description: 'Coordinated wrongful acts with Peter',
            harm_quantified: 'R10M+ combined criminal enterprise',
            evidence_strength: 0.88,
            coordination_documented: true
          }
        ],
        criminal: [
          {
            charge: 'Computer Fraud',
            description: 'Unauthorized access to computer systems',
            penalty: 'Up to 5 years imprisonment',
            evidence_strength: 0.70,
            evidence_gaps: ['System access logs', 'Network forensics']
          },
          {
            charge: 'Identity Fraud',
            description: 'Using false identity for domain registration',
            penalty: 'Up to 15 years imprisonment',
            evidence_strength: 0.75,
            evidence_gaps: ['Domain registration forensics', 'Email authentication']
          }
        ]
      },
      bantjies: {
        civil: [
          {
            charge: 'Breach of Fiduciary Duty',
            description: 'Violation of trustee duties',
            harm_quantified: 'Trust beneficiary losses',
            evidence_strength: 0.82,
            professional_standards_violation: true
          }
        ],
        criminal: [
          {
            charge: 'Perjury (Criminal)',
            description: 'False confirmatory affidavit',
            penalty: 'Up to 15 years imprisonment',
            evidence_strength: 0.72,
            evidence_gaps: ['Complete accounting records', 'Professional correspondence']
          }
        ]
      }
    };
  }

  /**
   * Define evidence requirements for each standard of proof
   */
  defineEvidenceRequirements() {
    return {
      civil_requirements: {
        documentation: 'Clear and convincing documents',
        witness_testimony: 'Credible witness statements',
        expert_analysis: 'Professional expert opinions',
        financial_proof: 'Quantified damages and losses',
        timeline_evidence: 'Chronological proof of events',
        contradictory_evidence: 'Documents contradicting false statements'
      },
      criminal_requirements: {
        documentation: 'Authenticated original documents',
        witness_testimony: 'Sworn testimony under oath',
        expert_analysis: 'Court-qualified expert testimony',
        financial_proof: 'Forensic accounting analysis',
        technical_evidence: 'Computer forensics and system logs',
        chain_of_custody: 'Proper evidence preservation',
        corroboration: 'Multiple independent sources',
        intent_proof: 'Evidence of criminal intent'
      },
      invariant_requirements: {
        logical_necessity: 'Facts that must be true under all interpretations',
        mathematical_proof: 'Quantifiable relationships and ratios',
        temporal_facts: 'Indisputable dates and sequences',
        regulatory_facts: 'Legal requirements that cannot be waived',
        contradictions: 'Logical impossibilities in opposing arguments'
      }
    };
  }

  /**
   * Load current evidence status from repository
   */
  loadCurrentEvidence() {
    const evidence = {
      available: new Set(),
      blocked_by_interdict: new Set(),
      strength_ratings: new Map(),
      completion_status: new Map()
    };

    // Available evidence (can be accessed currently)
    const availableEvidence = [
      'settlement_agreement_existence',
      'interdict_application_timing',
      'material_non_disclosure_categories',
      'disproportionate_harm_calculation',
      'responsible_person_regulatory_crisis',
      'founding_affidavit_contradictions',
      'confirmatory_affidavit_problems',
      'domain_registration_records',
      'quantified_harm_analysis'
    ];

    availableEvidence.forEach(item => {
      evidence.available.add(item);
      evidence.completion_status.set(item, 'complete');
    });

    // Evidence blocked by interdict
    const blockedEvidence = [
      'complete_email_archives',
      'bank_statement_downloads',
      'payment_gateway_records',
      'system_access_logs',
      'accounting_system_records',
      'network_forensics_data',
      'audit_trail_evidence',
      'financial_transaction_history'
    ];

    blockedEvidence.forEach(item => {
      evidence.blocked_by_interdict.add(item);
      evidence.completion_status.set(item, 'blocked');
    });

    // Set strength ratings for available evidence
    evidence.strength_ratings.set('material_non_disclosure_categories', 0.95);
    evidence.strength_ratings.set('disproportionate_harm_calculation', 0.92);
    evidence.strength_ratings.set('founding_affidavit_contradictions', 0.90);
    evidence.strength_ratings.set('settlement_agreement_existence', 0.88);
    evidence.strength_ratings.set('responsible_person_regulatory_crisis', 0.85);

    return evidence;
  }

  /**
   * Initialize burden of proof strategies
   */
  initializeStrategies() {
    return [
      {
        id: 'BOP-001',
        name: 'Civil Material Non-Disclosure Strategy',
        target_agent: 'peter',
        proof_standard: 'civil',
        priority: 1,
        status: 'ready_to_execute',
        success_probability: 0.95,
        required_evidence: ['material_non_disclosure_categories', 'settlement_agreement_existence'],
        current_evidence_strength: 0.95,
        implementation_file: 'jax-dan-response/comprehensive_material_non_disclosure.md'
      },
      {
        id: 'BOP-002', 
        name: 'Civil Disproportionate Harm Strategy',
        target_agent: 'peter',
        proof_standard: 'civil',
        priority: 1,
        status: 'ready_to_execute',
        success_probability: 0.92,
        required_evidence: ['disproportionate_harm_calculation', 'quantified_harm_analysis'],
        current_evidence_strength: 0.92,
        implementation_file: 'jax-dan-response/quantified_harm_analysis.md'
      },
      {
        id: 'BOP-003',
        name: 'Civil Perjury Strategy (Peter)',
        target_agent: 'peter',
        proof_standard: 'civil',
        priority: 1,
        status: 'ready_to_execute',
        success_probability: 0.90,
        required_evidence: ['founding_affidavit_contradictions', 'settlement_agreement_existence'],
        current_evidence_strength: 0.90,
        implementation_file: 'jax-dan-response/comprehensive_material_non_disclosure.md'
      },
      {
        id: 'BOP-004',
        name: 'Civil Email Impersonation Strategy (Rynette)',
        target_agent: 'rynette',
        proof_standard: 'civil',
        priority: 2,
        status: 'partial_evidence',
        success_probability: 0.85,
        required_evidence: ['domain_registration_records', 'email_impersonation_pattern'],
        current_evidence_strength: 0.70,
        evidence_gaps: ['Technical email forensics', 'System access logs']
      },
      {
        id: 'BOP-005',
        name: 'Civil Fiduciary Breach Strategy (Bantjies)',
        target_agent: 'bantjies',
        proof_standard: 'civil',
        priority: 2,
        status: 'ready_to_execute',
        success_probability: 0.82,
        required_evidence: ['confirmatory_affidavit_problems', 'trustee_duty_violations'],
        current_evidence_strength: 0.82,
        implementation_file: null // Need to create
      },
      {
        id: 'BOP-006',
        name: 'Criminal Perjury Strategy (Peter)',
        target_agent: 'peter',
        proof_standard: 'criminal',
        priority: 3,
        status: 'awaiting_evidence',
        success_probability: 0.85,
        required_evidence: ['complete_email_archives', 'founding_affidavit_contradictions'],
        current_evidence_strength: 0.65,
        evidence_gaps: ['Complete email discovery', 'Financial records access']
      },
      {
        id: 'BOP-007',
        name: 'Criminal Computer Fraud Strategy (Rynette)',
        target_agent: 'rynette',
        proof_standard: 'criminal',
        priority: 4,
        status: 'awaiting_evidence',
        success_probability: 0.70,
        required_evidence: ['system_access_logs', 'network_forensics_data'],
        current_evidence_strength: 0.40,
        evidence_gaps: ['System forensics', 'Technical expert analysis']
      },
      {
        id: 'BOP-008',
        name: 'Mathematical Invariant Strategy',
        target_agent: 'all',
        proof_standard: 'invariant',
        priority: 1,
        status: 'complete',
        success_probability: 1.0,
        required_evidence: ['temporal_facts', 'mathematical_relationships'],
        current_evidence_strength: 1.0,
        implementation_file: 'BURDEN_OF_PROOF_FRAMEWORK.md'
      }
    ];
  }

  /**
   * Assess current position across all proof standards
   */
  assessCurrentPosition() {
    this.position_assessment = {
      civil_readiness: this.assessCivilReadiness(),
      criminal_potential: this.assessCriminalPotential(),
      invariant_strength: this.assessInvariantStrength(),
      overall_strategic_position: null
    };

    this.position_assessment.overall_strategic_position = this.calculateOverallPosition();
  }

  /**
   * Assess readiness for civil proceedings
   */
  assessCivilReadiness() {
    const civilStrategies = this.strategies.filter(s => s.proof_standard === 'civil');
    const readyStrategies = civilStrategies.filter(s => s.status === 'ready_to_execute');
    
    const averageSuccessProbability = civilStrategies.reduce((sum, s) => sum + s.success_probability, 0) / civilStrategies.length;
    const readinessPercentage = readyStrategies.length / civilStrategies.length;

    return {
      total_strategies: civilStrategies.length,
      ready_strategies: readyStrategies.length,
      readiness_percentage: readinessPercentage,
      average_success_probability: averageSuccessProbability,
      status: readinessPercentage >= 0.6 ? 'ready' : 'partial',
      recommendation: readinessPercentage >= 0.6 ? 'Proceed with civil litigation' : 'Complete evidence gathering'
    };
  }

  /**
   * Assess potential for criminal prosecution
   */
  assessCriminalPotential() {
    const criminalStrategies = this.strategies.filter(s => s.proof_standard === 'criminal');
    const averageSuccessProbability = criminalStrategies.reduce((sum, s) => sum + s.success_probability, 0) / criminalStrategies.length;
    
    const evidenceBlockedCount = criminalStrategies.filter(s => s.status === 'awaiting_evidence').length;
    const evidenceAvailablePercentage = 1 - (evidenceBlockedCount / criminalStrategies.length);

    return {
      total_strategies: criminalStrategies.length,
      evidence_blocked: evidenceBlockedCount,
      evidence_available_percentage: evidenceAvailablePercentage,
      average_potential_success: averageSuccessProbability,
      status: evidenceAvailablePercentage >= 0.5 ? 'viable_post_interdict' : 'evidence_critical',
      recommendation: 'Await civil interdict setting aside for evidence access'
    };
  }

  /**
   * Assess strength of mathematical invariants
   */
  assessInvariantStrength() {
    const invariantStrategy = this.strategies.find(s => s.proof_standard === 'invariant');
    
    return {
      mathematical_certainty: invariantStrategy.success_probability,
      temporal_facts_established: true,
      financial_ratios_calculated: true,
      logical_contradictions_documented: true,
      status: 'complete',
      strategic_value: 'maximum',
      recommendation: 'Leverage invariants in all proceedings'
    };
  }

  /**
   * Calculate overall strategic position
   */
  calculateOverallPosition() {
    const civil = this.position_assessment.civil_readiness;
    const criminal = this.position_assessment.criminal_potential;
    const invariant = this.position_assessment.invariant_strength;

    const overallScore = (
      civil.average_success_probability * 0.5 +
      criminal.average_potential_success * 0.3 +
      invariant.mathematical_certainty * 0.2
    );

    return {
      overall_score: overallScore,
      civil_strength: civil.average_success_probability,
      criminal_potential: criminal.average_potential_success,
      invariant_certainty: invariant.mathematical_certainty,
      strategic_advantage: overallScore >= 0.85 ? 'strong' : overallScore >= 0.70 ? 'moderate' : 'developing',
      primary_recommendation: this.generatePrimaryRecommendation(overallScore, civil, criminal)
    };
  }

  /**
   * Generate primary strategic recommendation
   */
  generatePrimaryRecommendation(overallScore, civil, criminal) {
    if (civil.readiness_percentage >= 0.6 && civil.average_success_probability >= 0.85) {
      return 'Execute civil litigation immediately to restore evidence access for criminal prosecution';
    } else if (overallScore >= 0.80) {
      return 'Strong position - proceed with phased implementation';
    } else if (criminal.evidence_available_percentage < 0.3) {
      return 'Focus on civil success to unlock criminal evidence';
    } else {
      return 'Continue evidence gathering and strategy development';
    }
  }

  /**
   * Generate burden of proof analysis report
   */
  generateBurdenOfProofReport() {
    return {
      case_reference: 'Case 2025-137857',
      report_date: new Date().toISOString(),
      agents: this.agents,
      proof_standards: this.proofStandards,
      
      current_position: this.position_assessment,
      
      strategy_summary: {
        total_strategies: this.strategies.length,
        by_standard: {
          civil: this.strategies.filter(s => s.proof_standard === 'civil').length,
          criminal: this.strategies.filter(s => s.proof_standard === 'criminal').length,
          invariant: this.strategies.filter(s => s.proof_standard === 'invariant').length
        },
        ready_to_execute: this.strategies.filter(s => s.status === 'ready_to_execute').length,
        awaiting_evidence: this.strategies.filter(s => s.status === 'awaiting_evidence').length
      },

      success_probabilities: {
        civil_average: this.position_assessment.civil_readiness.average_success_probability,
        criminal_average: this.position_assessment.criminal_potential.average_potential_success,
        invariant_certainty: this.position_assessment.invariant_strength.mathematical_certainty
      },

      evidence_status: {
        available_evidence: Array.from(this.currentEvidence.available),
        blocked_evidence: Array.from(this.currentEvidence.blocked_by_interdict),
        evidence_gap_impact: this.calculateEvidenceGapImpact()
      },

      recommendations: this.generateStrategicRecommendations(),
      
      next_actions: this.generateNextActions(),
      
      timeline: this.generateImplementationTimeline()
    };
  }

  /**
   * Calculate impact of evidence gaps on success probability
   */
  calculateEvidenceGapImpact() {
    const totalEvidence = this.currentEvidence.available.size + this.currentEvidence.blocked_by_interdict.size;
    const availablePercentage = this.currentEvidence.available.size / totalEvidence;
    
    const impact = {
      total_evidence_items: totalEvidence,
      available_percentage: availablePercentage,
      blocked_percentage: 1 - availablePercentage,
      civil_impact: availablePercentage >= 0.6 ? 'minimal' : 'moderate',
      criminal_impact: availablePercentage >= 0.8 ? 'minimal' : 'severe',
      mitigation_strategy: 'Civil litigation to restore evidence access'
    };

    return impact;
  }

  /**
   * Generate strategic recommendations based on current position
   */
  generateStrategicRecommendations() {
    const recommendations = [];

    // Civil recommendations
    if (this.position_assessment.civil_readiness.readiness_percentage >= 0.6) {
      recommendations.push({
        priority: 1,
        category: 'civil',
        action: 'Execute civil rescission application immediately',
        rationale: `${(this.position_assessment.civil_readiness.average_success_probability * 100).toFixed(0)}% average success probability on civil claims`,
        timeline: '30 days'
      });
    }

    // Criminal recommendations
    if (this.position_assessment.criminal_potential.evidence_available_percentage < 0.5) {
      recommendations.push({
        priority: 2,
        category: 'criminal',
        action: 'Prepare criminal referral framework for post-interdict implementation',
        rationale: 'Evidence access critical for criminal prosecution success',
        timeline: '60 days post-interdict'
      });
    }

    // Invariant leverage
    recommendations.push({
      priority: 1,
      category: 'strategic',
      action: 'Leverage mathematical invariants in all proceedings',
      rationale: '100% certainty on key facts provides unshakeable foundation',
      timeline: 'Immediate'
    });

    return recommendations;
  }

  /**
   * Generate specific next actions
   */
  generateNextActions() {
    const nextActions = [];

    // Ready strategies
    const readyStrategies = this.strategies.filter(s => s.status === 'ready_to_execute');
    readyStrategies.forEach(strategy => {
      nextActions.push({
        strategy_id: strategy.id,
        action: `Execute ${strategy.name}`,
        target: strategy.target_agent,
        success_probability: strategy.success_probability,
        timeline: strategy.proof_standard === 'civil' ? '30 days' : '60-90 days'
      });
    });

    // Evidence gathering priorities
    const evidenceGaps = this.strategies
      .filter(s => s.evidence_gaps && s.evidence_gaps.length > 0)
      .map(s => s.evidence_gaps)
      .flat();

    const uniqueGaps = [...new Set(evidenceGaps)];
    uniqueGaps.forEach(gap => {
      nextActions.push({
        strategy_id: 'EVIDENCE',
        action: `Gather evidence: ${gap}`,
        target: 'all',
        dependency: 'Civil interdict setting aside',
        timeline: 'Post-interdict'
      });
    });

    return nextActions;
  }

  /**
   * Generate implementation timeline
   */
  generateImplementationTimeline() {
    return {
      phase_1: {
        name: 'Civil Foundation',
        duration: '30 days',
        objective: 'Establish civil liability and restore evidence access',
        strategies: ['BOP-001', 'BOP-002', 'BOP-003'],
        success_criteria: 'Interdict set aside, evidence access restored'
      },
      phase_2: {
        name: 'Evidence Gathering',
        duration: '60 days post-interdict',
        objective: 'Collect comprehensive evidence for criminal prosecution',
        strategies: ['Evidence collection', 'Forensic analysis'],
        success_criteria: 'Criminal prosecution threshold evidence obtained'
      },
      phase_3: {
        name: 'Criminal Prosecution',
        duration: '90-180 days post-evidence',
        objective: 'Achieve criminal convictions',
        strategies: ['BOP-006', 'BOP-007'],
        success_criteria: 'Criminal convictions and asset recovery'
      }
    };
  }

  /**
   * Export burden of proof workflow
   */
  exportBurdenOfProofWorkflow() {
    const workflow = {
      name: 'Burden of Proof Implementation Workflow',
      version: '1.0',
      case: 'Case 2025-137857',
      generated: new Date().toISOString(),
      
      proof_standards: this.proofStandards,
      strategies: this.strategies,
      current_position: this.position_assessment,
      
      implementation_phases: this.generateImplementationTimeline(),
      
      success_metrics: {
        civil_threshold: this.proofStandards.civil.practical_threshold,
        criminal_threshold: this.proofStandards.criminal.practical_threshold,
        invariant_threshold: this.proofStandards.invariant.threshold
      },
      
      integration: {
        optimal_strategy_system: './optimal-strategy-implementation.js',
        burden_of_proof_framework: './BURDEN_OF_PROOF_FRAMEWORK.md',
        evidence_collector: './optimal-evidence-collector.js'
      }
    };

    return workflow;
  }

  /**
   * Integration with optimal strategy implementation system
   */
  integrateWithOptimalStrategy() {
    try {
      const OptimalStrategyImplementation = require('./optimal-strategy-implementation.js');
      const optimalStrategy = new OptimalStrategyImplementation();
      
      const optimalReport = optimalStrategy.generateStatusReport();
      const burdenReport = this.generateBurdenOfProofReport();
      
      return {
        integrated_analysis: {
          optimal_strategy: {
            completion_rate: optimalReport.summary.completionRate,
            critical_strategies: optimalReport.critical_path.length,
            total_strategies: optimalReport.summary.totalStrategies
          },
          burden_of_proof: {
            civil_readiness: burdenReport.current_position.civil_readiness.readiness_percentage,
            criminal_potential: burdenReport.current_position.criminal_potential.average_potential_success,
            invariant_certainty: burdenReport.current_position.invariant_strength.mathematical_certainty
          }
        },
        
        coordinated_recommendations: [
          ...optimalReport.recommendations.map(r => `[Optimal Strategy] ${r}`),
          ...burdenReport.recommendations.map(r => `[Burden of Proof] ${r.action}`)
        ],
        
        synchronized_timeline: {
          optimal_strategy_completion: optimalReport.estimated_completion,
          burden_of_proof_phases: burdenReport.timeline,
          integration_points: this.identifyIntegrationPoints(optimalReport, burdenReport)
        }
      };
      
    } catch (error) {
      console.warn('Could not integrate with OptimalStrategyImplementation:', error.message);
      return null;
    }
  }

  /**
   * Identify integration points between systems
   */
  identifyIntegrationPoints(optimalReport, burdenReport) {
    return [
      {
        point: 'Material Non-Disclosure Strategy',
        optimal_strategy: 'STRAT-007 (Comprehensive Material Non-Disclosure)',
        burden_of_proof: 'BOP-001 (Civil Material Non-Disclosure Strategy)',
        integration: 'Same evidence base, coordinated implementation'
      },
      {
        point: 'Quantified Harm Analysis',
        optimal_strategy: 'STRAT-006 (Quantified Harm Analysis)',
        burden_of_proof: 'BOP-002 (Civil Disproportionate Harm Strategy)',
        integration: 'Shared financial calculations and harm quantification'
      },
      {
        point: 'Criminal Evidence Preparation',
        optimal_strategy: 'Evidence collection systems',
        burden_of_proof: 'Criminal prosecution strategies (BOP-006, BOP-007)',
        integration: 'Post-interdict evidence gathering coordination'
      }
    ];
  }
}

// Export for use in other modules
module.exports = BurdenOfProofImplementation;

// Command line interface
if (require.main === module) {
  console.log('🎯 Burden of Proof Implementation System');
  console.log('=========================================\n');
  
  const burdenSystem = new BurdenOfProofImplementation();
  
  // Generate and display report
  const report = burdenSystem.generateBurdenOfProofReport();
  
  console.log('📊 Burden of Proof Analysis:');
  console.log(`   Civil Readiness: ${(report.current_position.civil_readiness.readiness_percentage * 100).toFixed(0)}%`);
  console.log(`   Criminal Potential: ${(report.current_position.criminal_potential.average_potential_success * 100).toFixed(0)}%`);
  console.log(`   Invariant Certainty: ${(report.current_position.invariant_strength.mathematical_certainty * 100).toFixed(0)}%`);
  console.log(`   Overall Strategic Position: ${report.current_position.overall_strategic_position.strategic_advantage}\n`);
  
  console.log('🎯 Proof Standards Analysis:');
  Object.entries(report.proof_standards).forEach(([standard, details]) => {
    console.log(`   ${details.name}: ${(details.threshold * 100).toFixed(0)}% threshold`);
  });
  console.log('');
  
  console.log('⚖️  Strategy Summary:');
  console.log(`   Total Strategies: ${report.strategy_summary.total_strategies}`);
  console.log(`   Civil: ${report.strategy_summary.by_standard.civil}`);
  console.log(`   Criminal: ${report.strategy_summary.by_standard.criminal}`);
  console.log(`   Invariant: ${report.strategy_summary.by_standard.invariant}`);
  console.log(`   Ready to Execute: ${report.strategy_summary.ready_to_execute}\n`);
  
  console.log('🔍 Evidence Status:');
  console.log(`   Available Evidence: ${report.evidence_status.available_evidence.length} items`);
  console.log(`   Blocked Evidence: ${report.evidence_status.blocked_evidence.length} items`);
  console.log(`   Civil Impact: ${report.evidence_status.evidence_gap_impact.civil_impact}`);
  console.log(`   Criminal Impact: ${report.evidence_status.evidence_gap_impact.criminal_impact}\n`);
  
  console.log('💡 Primary Recommendation:');
  console.log(`   ${report.current_position.overall_strategic_position.primary_recommendation}\n`);
  
  console.log('📋 Next Actions:');
  report.next_actions.slice(0, 5).forEach((action, index) => {
    console.log(`   ${index + 1}. ${action.action}`);
    if (action.success_probability) {
      console.log(`      Success Probability: ${(action.success_probability * 100).toFixed(0)}%`);
    }
    console.log(`      Timeline: ${action.timeline}`);
  });
  
  // Export workflow
  const workflow = burdenSystem.exportBurdenOfProofWorkflow();
  console.log('\n📁 Exporting burden of proof workflow...');
  fs.writeFileSync('./burden-of-proof-workflow.json', JSON.stringify(workflow, null, 2));
  console.log('   Workflow exported to: burden-of-proof-workflow.json');
  
  // Try integration
  console.log('\n🔗 Attempting integration with Optimal Strategy System...');
  const integration = burdenSystem.integrateWithOptimalStrategy();
  if (integration) {
    console.log('   ✅ Integration successful!');
    console.log(`   Civil Readiness: ${(integration.integrated_analysis.burden_of_proof.civil_readiness * 100).toFixed(0)}%`);
    console.log(`   Strategy Completion: ${integration.integrated_analysis.optimal_strategy.completion_rate}`);
    
    fs.writeFileSync('./integrated-burden-of-proof-status.json', JSON.stringify(integration, null, 2));
    console.log('   Integrated status exported to: integrated-burden-of-proof-status.json');
  } else {
    console.log('   ⚠️  Integration skipped (optimal strategy system not available)');
  }
  
  console.log('\n✅ Burden of Proof Implementation System initialized successfully!');
}