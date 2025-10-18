/**
 * Legal Document System Demonstration
 * 
 * This script demonstrates the comprehensive capabilities of the
 * HypergraphQL legal document system including:
 * - Plan generation for affidavits
 * - Document generation from plans
 * - Evaluation and rating
 * - Improvement recommendations
 */

const LegalDocumentSystem = require('./index');

async function runDemo() {
  console.log('='.repeat(60));
  console.log(' HYPERGRAPHQL LEGAL DOCUMENT SYSTEM DEMONSTRATION');
  console.log('='.repeat(60));

  // Initialize the system
  const system = new LegalDocumentSystem();

  // Demo Case: Response to Peter Faucitt's interdict application
  const caseRequirements = {
    documentType: 'answering-affidavit',
    purpose: 'Respond to urgent interdict application by Peter Faucitt',
    deponent: {
      name: 'Jacqueline Faucitt',
      occupation: 'Business Owner',
      address: 'Cape Town, South Africa',
      gender: 'female'
    },
    respondingTo: 'Founding Affidavit of Peter Andrew Faucitt dated August 2025',
    urgency: 'urgent',
    strategy: 'offensive', // Counter-claims and expose misconduct
    claims: [
      'Peter Faucitt engaged in systematic revenue theft',
      'Fraudulent bank account changes diverted R3.1 million',
      'Destruction of Shopify audit trails to hide theft',
      'False urgency - 2 month delay contradicts claims',
      'Bad faith litigation to avoid criminal prosecution'
    ],
    evidence: [
      {
        id: 'ev-001',
        type: 'documentary',
        description: 'Bank statements showing diverted payments',
        significance: 'critical',
        date: '2025-04-14'
      },
      {
        id: 'ev-002',
        type: 'forensic',
        description: 'Shopify audit trail analysis',
        significance: 'critical',
        date: '2025-05-22'
      },
      {
        id: 'ev-003',
        type: 'correspondence',
        description: 'Email from Gayane Williams confirming Peter\'s instructions',
        significance: 'high',
        date: '2025-06-20'
      },
      {
        id: 'ev-004',
        type: 'financial',
        description: 'Revenue loss calculations - R3,141,647.70',
        significance: 'critical'
      },
      {
        id: 'ev-005',
        type: 'testimonial',
        description: 'Witness statement from IT consultant',
        significance: 'high'
      }
    ],
    timeline: [
      {
        date: '2025-04-14',
        description: 'First fraudulent bank account change',
        category: 'fraud',
        significance: 'critical'
      },
      {
        date: '2025-05-22',
        description: 'Shopify audit trails destroyed',
        category: 'evidence-destruction',
        significance: 'critical'
      },
      {
        date: '2025-06-20',
        description: 'Gayane email confirming Peter\'s involvement',
        category: 'evidence',
        significance: 'high'
      },
      {
        date: '2025-08-22',
        description: 'Peter files urgent interdict (2 months after alleged urgency)',
        category: 'litigation',
        significance: 'critical'
      }
    ]
  };

  // Content for the affidavit
  const affidavitContent = {
    title: 'Answering Affidavit of Jacqueline Faucitt',
    deponent: 'Jacqueline Faucitt',
    facts: [
      {
        content: 'I am the First Respondent in this matter and the co-owner of RegimA (Pty) Ltd together with the Second Respondent.',
        tags: ['identity'],
        strength: 1.0
      },
      {
        content: 'The Applicant\'s allegations of urgency are demonstrably false. The alleged "urgent" issues supposedly arose in June 2025, yet the Applicant only filed this application on 22 August 2025 - a delay of over two months.',
        evidence: ['ev-004'],
        tags: ['urgency', 'bad-faith'],
        strength: 0.95
      },
      {
        content: 'On 14 April 2025, the Applicant orchestrated a fraudulent scheme to divert company revenues by changing bank account details on client invoices without authorization.',
        evidence: ['ev-001'],
        tags: ['fraud', 'counter-claim'],
        strength: 0.9
      },
      {
        content: 'On 22 May 2025, following confrontation about the missing funds, the Applicant systematically destroyed Shopify audit trails to conceal evidence of his theft.',
        evidence: ['ev-002'],
        tags: ['evidence-destruction', 'counter-claim'],
        strength: 0.9
      },
      {
        content: 'The total amount stolen through this scheme is R3,141,647.70, as evidenced by forensic financial analysis.',
        evidence: ['ev-004'],
        tags: ['damages', 'counter-claim'],
        strength: 0.95
      },
      {
        content: 'The Applicant\'s administrative assistant, Gayane Williams, has confirmed in writing that she acted on the Applicant\'s direct instructions in facilitating these fraudulent activities.',
        evidence: ['ev-003'],
        tags: ['witness', 'corroboration'],
        strength: 0.85
      }
    ],
    claims: [
      {
        id: 'claim-1',
        type: 'Fraudulent Misrepresentation',
        description: 'The Applicant engaged in systematic fraud by diverting company revenues',
        evidence: ['ev-001', 'ev-004'],
        paragraphs: [
          {
            content: 'The Applicant\'s conduct constitutes fraud in that he deliberately and with intent to steal, diverted legitimate company revenues to accounts under his control.',
            evidenceRefs: ['ev-001']
          }
        ]
      },
      {
        id: 'claim-2',
        type: 'Destruction of Evidence',
        description: 'The Applicant destroyed critical business records to hide his theft',
        evidence: ['ev-002', 'ev-005'],
        paragraphs: [
          {
            content: 'The deliberate destruction of Shopify audit trails constitutes both a criminal offense and demonstrates consciousness of guilt.',
            evidenceRefs: ['ev-002']
          }
        ]
      }
    ],
    annexures: [
      {
        code: 'JF1',
        title: 'Bank Statements and Forensic Analysis',
        type: 'financial'
      },
      {
        code: 'JF2',
        title: 'Shopify Audit Trail Analysis',
        type: 'technical'
      },
      {
        code: 'JF3',
        title: 'Gayane Williams Correspondence',
        type: 'correspondence'
      }
    ]
  };

  try {
    // Step 1: Generate a comprehensive plan
    console.log('\n\n📋 STEP 1: GENERATING AFFIDAVIT PLAN\n');
    const plan = await system.generateAffidavitPlan(caseRequirements);
    
    // Display plan highlights
    console.log('\n📊 Plan Analysis:');
    console.log(`- Case Pattern: ${plan.caseInfo.pattern}`);
    console.log(`- Strategy: ${plan.caseInfo.strategy}`);
    console.log(`- Complexity: ${plan.complexityScore}/10`);
    console.log(`- Sections: ${plan.estimatedSections}`);
    console.log(`- Paragraphs: ${plan.estimatedParagraphs}`);
    
    if (plan.notes?.strategic?.length > 0) {
      console.log('\n📌 Strategic Notes:');
      plan.notes.strategic.slice(0, 3).forEach(note => {
        console.log(`  • ${note}`);
      });
    }

    // Step 2: Generate affidavit from plan
    console.log('\n\n📄 STEP 2: GENERATING AFFIDAVIT FROM PLAN\n');
    
    // Get the actual plan ID from the hypergraph (it may be different)
    const planEntities = Array.from(system.hypergraph.entities.values())
      .filter(e => e.type === 'DocumentPlan');
    const actualPlanId = planEntities.length > 0 ? planEntities[0].id : plan.id;
    
    const affidavit = await system.generateAffidavitFromPlan(actualPlanId, affidavitContent);
    
    console.log(`✅ Affidavit generated with ${affidavit.paragraphs.length} paragraphs`);
    console.log(`📎 Annexures: ${affidavit.annexures.length}`);

    // Step 3: Evaluate the affidavit
    console.log('\n\n🔍 STEP 3: EVALUATING AFFIDAVIT\n');
    const evaluation = await system.evaluateAffidavit(affidavit.id, {
      documentType: 'answering-affidavit',
      detailLevel: 'comprehensive',
      generateReport: true
    });

    // Display evaluation results
    console.log('\n📊 Evaluation Results:');
    console.log('━'.repeat(40));
    console.log(`Overall Score: ${evaluation.overallScore}/100`);
    console.log(`Rating: ${evaluation.rating.level} ⭐`.repeat(evaluation.rating.stars));
    console.log('━'.repeat(40));

    console.log('\n📈 Detailed Scores:');
    Object.entries(evaluation.scores).forEach(([criterion, result]) => {
      const score = Math.round(result.score);
      const bar = '█'.repeat(Math.floor(score / 10)) + '░'.repeat(10 - Math.floor(score / 10));
      console.log(`${criterion.padEnd(15)} ${bar} ${score}%`);
    });

    // Display pattern analysis
    if (evaluation.patternAnalysis?.length > 0) {
      console.log('\n⚠️  Pattern Analysis:');
      evaluation.patternAnalysis.forEach(pattern => {
        console.log(`- ${pattern.pattern}: ${pattern.instances} instances (${pattern.severity})`);
        console.log(`  Remedy: ${pattern.remedy}`);
      });
    }

    // Display key findings
    if (evaluation.detailedFindings) {
      console.log('\n🔑 Key Findings:');
      
      if (evaluation.detailedFindings.strengths.length > 0) {
        console.log('\n✅ Strengths:');
        evaluation.detailedFindings.strengths.slice(0, 3).forEach(s => {
          console.log(`  • ${s.area}: ${s.strengths[0]}`);
        });
      }

      if (evaluation.detailedFindings.criticalIssues.length > 0) {
        console.log('\n❌ Critical Issues:');
        evaluation.detailedFindings.criticalIssues.slice(0, 3).forEach(issue => {
          console.log(`  • ${issue.area}: ${issue.issues[0]}`);
        });
      }
    }

    // Display improvement roadmap
    if (evaluation.improvementRoadmap) {
      console.log('\n🛠️  Improvement Roadmap:');
      
      if (evaluation.improvementRoadmap.immediate.length > 0) {
        console.log('\n⚡ Immediate Actions (< 1 hour):');
        evaluation.improvementRoadmap.immediate.slice(0, 2).forEach(action => {
          console.log(`  • ${action.action}`);
        });
      }

      if (evaluation.improvementRoadmap.shortTerm.length > 0) {
        console.log('\n📅 Short Term (< 1 day):');
        evaluation.improvementRoadmap.shortTerm.slice(0, 2).forEach(action => {
          console.log(`  • ${action.action}`);
        });
      }
    }

    // Step 4: Complete workflow summary
    console.log('\n\n📊 COMPLETE WORKFLOW SUMMARY\n');
    const workflow = await system.completeWorkflow(caseRequirements, affidavitContent);
    
    console.log('━'.repeat(60));
    console.log(`Workflow Status: ${workflow.summary.success ? '✅ SUCCESS' : '⚠️  NEEDS WORK'}`);
    console.log(`Ready for Filing: ${workflow.summary.readyForFiling ? 'YES' : 'NO'}`);
    console.log('━'.repeat(60));

    console.log('\n📈 Key Metrics:');
    Object.entries(workflow.summary.keyMetrics).forEach(([metric, value]) => {
      console.log(`  ${metric}: ${value}`);
    });

    console.log('\n👉 Next Steps:');
    workflow.summary.nextSteps.forEach((step, index) => {
      console.log(`  ${index + 1}. ${step}`);
    });

    // Export examples
    console.log('\n\n💾 EXPORTING RESULTS\n');
    
    // Create exports directory if it doesn't exist
    const fs = require('fs').promises;
    const path = require('path');
    const exportsDir = path.join(__dirname, 'exports');
    
    try {
      await fs.mkdir(exportsDir, { recursive: true });
      
      // Export plan
      const planPath = await system.exportPlan(plan.id, 'md');
      console.log(`✅ Plan exported to: ${planPath}`);
      
      // Export evaluation
      const evalPath = await system.exportEvaluation(evaluation.id, 'md');
      console.log(`✅ Evaluation exported to: ${evalPath}`);
    } catch (error) {
      console.log('⚠️  Export directory creation skipped');
    }

    // Hypergraph statistics
    console.log('\n\n📊 HYPERGRAPH STATISTICS\n');
    const stats = system.hypergraph.getStats();
    console.log(`Total Entities: ${stats.totalEntities}`);
    console.log(`Total Links: ${stats.totalLinkTuples}`);
    console.log('\nEntities by Type:');
    Object.entries(stats.entitiesByType).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
  }

  console.log('\n\n' + '='.repeat(60));
  console.log(' DEMONSTRATION COMPLETE');
  console.log('='.repeat(60));
}

// Run the demo
if (require.main === module) {
  runDemo().catch(console.error);
}

module.exports = runDemo;