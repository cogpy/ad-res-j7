/**
 * Simple Example of Legal Document System
 * 
 * This demonstrates the core functionality in a clear, step-by-step manner
 */

const LegalDocumentSystem = require('./index');

async function runExample() {
  console.log('🚀 Legal Document System Example\n');
  
  // Create system
  const system = new LegalDocumentSystem();
  
  // Step 1: Create a simple affidavit directly
  console.log('📄 Creating Simple Affidavit...\n');
  
  const affidavitId = 'example-affidavit-1';
  const affidavit = {
    id: affidavitId,
    type: 'Affidavit',
    title: 'Example Answering Affidavit',
    deponent: 'Jane Doe',
    dateSworn: null,
    commissioner: null,
    status: 'draft',
    paragraphs: [
      {
        number: 1,
        content: 'I am Jane Doe, an adult female residing at 123 Main Street, Cape Town. I am the respondent in this matter.',
        type: 'procedural',
        tags: ['identity'],
        evidenceRefs: []
      },
      {
        number: 2,
        content: 'The facts herein are within my personal knowledge and are true and correct.',
        type: 'procedural',
        tags: ['knowledge'],
        evidenceRefs: []
      },
      {
        number: 3,
        content: 'The applicant\'s urgent application is an abuse of process. The alleged urgency arose in June 2025, yet he only filed in August 2025.',
        type: 'fact',
        tags: ['urgency', 'bad-faith'],
        evidenceRefs: ['ev-timeline']
      },
      {
        number: 4,
        content: 'On 14 April 2025, the applicant fraudulently diverted company funds by changing bank account details on invoices.',
        type: 'fact',
        tags: ['fraud', 'counter-claim'],
        evidenceRefs: ['ev-bank-statements', 'ev-invoices']
      },
      {
        number: 5,
        content: 'The total amount stolen through this scheme exceeds R3 million, as shown in the forensic analysis.',
        type: 'fact',
        tags: ['damages'],
        evidenceRefs: ['ev-forensic-report']
      },
      {
        number: 6,
        content: 'I deny all allegations of wrongdoing made by the applicant. His allegations are a smokescreen to avoid criminal prosecution.',
        type: 'legal',
        tags: ['denial'],
        evidenceRefs: []
      },
      {
        number: 7,
        content: 'I seek dismissal of this application with costs on the attorney-client scale.',
        type: 'procedural',
        tags: ['relief'],
        evidenceRefs: []
      }
    ],
    annexures: [
      { code: 'JD1', title: 'Bank Statements', type: 'financial' },
      { code: 'JD2', title: 'Forensic Report', type: 'technical' },
      { code: 'JD3', title: 'Timeline Analysis', type: 'document' }
    ]
  };
  
  // Add to hypergraph
  system.hypergraph.addEntity(affidavitId, 'Affidavit', affidavit);
  
  // Add some evidence entities
  const evidence = [
    {
      id: 'ev-bank-statements',
      type: 'documentary',
      description: 'Bank statements showing fraudulent transfers',
      weight: 0.9,
      admissibility: 'admissible'
    },
    {
      id: 'ev-forensic-report',
      type: 'forensic',
      description: 'Forensic analysis of financial records',
      weight: 0.95,
      admissibility: 'admissible'
    },
    {
      id: 'ev-timeline',
      type: 'documentary',
      description: 'Timeline showing 2-month delay',
      weight: 0.85,
      admissibility: 'admissible'
    }
  ];
  
  evidence.forEach(ev => {
    system.hypergraph.addEntity(ev.id, 'Evidence', ev);
  });
  
  console.log('✅ Affidavit created with:');
  console.log(`   - ${affidavit.paragraphs.length} paragraphs`);
  console.log(`   - ${affidavit.annexures.length} annexures`);
  console.log(`   - ${evidence.length} evidence items\n`);
  
  // Step 2: Evaluate the affidavit
  console.log('🔍 Evaluating Affidavit...\n');
  
  const evaluation = await system.evaluator.evaluateAffidavit(affidavit, {
    documentType: 'answering-affidavit',
    detailLevel: 'comprehensive',
    generateReport: true
  });
  
  // Display results
  console.log('📊 EVALUATION RESULTS');
  console.log('=' .repeat(50));
  console.log(`Overall Score: ${evaluation.overallScore}/100`);
  console.log(`Rating: ${evaluation.rating.level} (${evaluation.rating.stars} stars)`);
  console.log('=' .repeat(50));
  
  // Score breakdown
  console.log('\n📈 Score Breakdown:');
  Object.entries(evaluation.scores).forEach(([criterion, result]) => {
    const score = Math.round(result.score);
    console.log(`${criterion.padEnd(15)}: ${score}%`);
  });
  
  // Strengths and weaknesses
  console.log('\n💪 Top Strengths:');
  evaluation.detailedFindings.strengths.slice(0, 3).forEach(s => {
    console.log(`  ✓ ${s.area}: ${s.strengths[0] || 'Strong performance'}`);
  });
  
  if (evaluation.detailedFindings.criticalIssues.length > 0) {
    console.log('\n⚠️  Critical Issues:');
    evaluation.detailedFindings.criticalIssues.forEach(issue => {
      console.log(`  ✗ ${issue.area}: ${issue.issues[0] || issue.type}`);
    });
  }
  
  if (evaluation.detailedFindings.majorIssues.length > 0) {
    console.log('\n📋 Major Issues:');
    evaluation.detailedFindings.majorIssues.slice(0, 3).forEach(issue => {
      console.log(`  • ${issue.area}: ${issue.issues[0] || issue.type}`);
    });
  }
  
  // Recommendations
  if (evaluation.improvementRoadmap?.immediate.length > 0) {
    console.log('\n🎯 Immediate Actions:');
    evaluation.improvementRoadmap.immediate.slice(0, 3).forEach(action => {
      console.log(`  → ${action.action}`);
    });
  }
  
  // Pattern analysis
  if (evaluation.patternAnalysis?.length > 0) {
    console.log('\n🔍 Pattern Analysis:');
    evaluation.patternAnalysis.forEach(pattern => {
      console.log(`  - ${pattern.pattern}: ${pattern.instances} instances`);
    });
  }
  
  // Summary
  console.log('\n📝 SUMMARY');
  console.log('=' .repeat(50));
  if (evaluation.overallScore >= 85) {
    console.log('✅ This affidavit is ready for filing with minor improvements.');
  } else if (evaluation.overallScore >= 70) {
    console.log('⚠️  This affidavit needs some work before filing.');
  } else {
    console.log('❌ This affidavit requires significant revision.');
  }
  
  // Next steps
  console.log('\n👉 Next Steps:');
  if (evaluation.overallScore >= 85) {
    console.log('  1. Address any minor issues identified');
    console.log('  2. Have affidavit reviewed by counsel');
    console.log('  3. Schedule commissioning');
    console.log('  4. File with court');
  } else {
    console.log('  1. Address critical and major issues');
    console.log('  2. Strengthen evidence references');
    console.log('  3. Re-evaluate after revisions');
    console.log('  4. Seek legal review');
  }
  
  // Hypergraph stats
  console.log('\n📊 System Statistics:');
  const stats = system.hypergraph.getStats();
  console.log(`  - Total entities: ${stats.totalEntities}`);
  console.log(`  - Total relationships: ${stats.totalLinkTuples}`);
  console.log(`  - Entity types: ${Object.keys(stats.entitiesByType).join(', ')}`);
  
  console.log('\n✅ Example completed successfully!\n');
}

// Run the example
if (require.main === module) {
  runExample().catch(console.error);
}

module.exports = runExample;