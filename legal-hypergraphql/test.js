/**
 * Test Suite for Legal Document System
 * 
 * Comprehensive tests for the HypergraphQL legal document system
 */

const LegalDocumentSystem = require('./index');
const assert = require('assert');

class LegalDocumentSystemTest {
  constructor() {
    this.system = new LegalDocumentSystem();
    this.testResults = [];
  }

  async runAllTests() {
    console.log('🧪 Legal Document System Test Suite\n');
    
    const tests = [
      this.testPlanGeneration,
      this.testAffidavitGeneration,
      this.testEvaluation,
      this.testPatternDetection,
      this.testEvidenceIntegration,
      this.testTimelineAnalysis,
      this.testComplexityCalculation,
      this.testRatingSystem
    ];

    let passed = 0;
    let failed = 0;

    for (const test of tests) {
      try {
        await test.call(this);
        passed++;
        console.log(`✅ ${test.name}`);
      } catch (error) {
        failed++;
        console.log(`❌ ${test.name}: ${error.message}`);
        this.testResults.push({ test: test.name, error: error.message });
      }
    }

    console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed\n`);
    
    if (failed > 0) {
      console.log('Failed tests:');
      this.testResults.forEach(result => {
        console.log(`  - ${result.test}: ${result.error}`);
      });
    }

    return { passed, failed };
  }

  async testPlanGeneration() {
    const requirements = {
      documentType: 'answering-affidavit',
      purpose: 'Test affidavit',
      deponent: { name: 'Test User' },
      claims: ['Test claim 1', 'Test claim 2'],
      evidence: [{ id: 'test-ev-1', type: 'documentary' }],
      urgency: 'normal'
    };

    const plan = await this.system.generateAffidavitPlan(requirements);
    
    assert(plan.id, 'Plan should have an ID');
    assert(plan.structure, 'Plan should have structure');
    assert(plan.structure.sections.length > 0, 'Plan should have sections');
    assert(plan.complexityScore >= 1 && plan.complexityScore <= 10, 'Complexity should be between 1-10');
  }

  async testAffidavitGeneration() {
    // First create a plan
    const requirements = {
      documentType: 'answering-affidavit',
      purpose: 'Test affidavit',
      deponent: { name: 'Test User' },
      claims: ['Test claim'],
      evidence: [{ id: 'test-ev-1', type: 'documentary' }]
    };

    const plan = await this.system.generateAffidavitPlan(requirements);
    
    // Generate affidavit from plan
    const content = {
      title: 'Test Affidavit',
      deponent: 'Test User',
      facts: [
        { content: 'Test fact 1', tags: ['fact'] },
        { content: 'Test fact 2', tags: ['fact'], evidence: ['test-ev-1'] }
      ]
    };

    const affidavit = await this.system.generateAffidavitFromPlan(plan.id, content);
    
    assert(affidavit.id, 'Affidavit should have an ID');
    assert(affidavit.paragraphs.length > 0, 'Affidavit should have paragraphs');
    assert(affidavit.status === 'draft', 'New affidavit should be in draft status');
  }

  async testEvaluation() {
    // Create a test affidavit
    const affidavit = {
      id: 'test-affidavit-1',
      type: 'Affidavit',
      title: 'Test Affidavit',
      deponent: 'Test User',
      paragraphs: [
        { number: 1, content: 'I am the deponent.', type: 'procedural', tags: ['identity'] },
        { number: 2, content: 'The facts are true.', type: 'procedural', tags: ['knowledge'] },
        { number: 3, content: 'This is a fact.', type: 'fact', evidenceRefs: ['ev-1'] },
        { number: 4, content: 'I heard that something happened.', type: 'fact' }, // Hearsay
        { number: 5, content: 'I believe this is true.', type: 'fact' } // Speculation
      ],
      annexures: []
    };

    this.system.hypergraph.addEntity(affidavit.id, 'Affidavit', affidavit);

    const evaluation = await this.system.evaluateAffidavit(affidavit.id);
    
    assert(evaluation.id, 'Evaluation should have an ID');
    assert(typeof evaluation.overallScore === 'number', 'Should have overall score');
    assert(evaluation.overallScore >= 0 && evaluation.overallScore <= 100, 'Score should be 0-100');
    assert(evaluation.rating, 'Should have a rating');
    assert(evaluation.scores, 'Should have detailed scores');
  }

  async testPatternDetection() {
    const affidavit = {
      id: 'test-pattern-affidavit',
      type: 'Affidavit',
      title: 'Pattern Test',
      deponent: 'Test User',
      paragraphs: [
        { number: 1, content: 'I was told that the money was stolen.', type: 'fact' },
        { number: 2, content: 'I believe the defendant is guilty.', type: 'fact' },
        { number: 3, content: 'Someone said they saw him there.', type: 'fact' },
        { number: 4, content: 'It is obvious that this is fraud.', type: 'fact' }
      ]
    };

    this.system.hypergraph.addEntity(affidavit.id, 'Affidavit', affidavit);
    const evaluation = await this.system.evaluateAffidavit(affidavit.id);
    
    assert(evaluation.patternAnalysis, 'Should have pattern analysis');
    assert(evaluation.patternAnalysis.length > 0, 'Should detect patterns');
    
    const patterns = evaluation.patternAnalysis.map(p => p.pattern);
    assert(patterns.includes('hearsay'), 'Should detect hearsay');
    assert(patterns.includes('speculation'), 'Should detect speculation');
    assert(patterns.includes('argumentative'), 'Should detect argumentative language');
  }

  async testEvidenceIntegration() {
    const planGen = this.system.planGenerator;
    const evidence = [
      { id: 'ev1', type: 'documentary', description: 'Contract' },
      { id: 'ev2', type: 'financial', description: 'Bank statements' },
      { id: 'ev3', type: 'correspondence', description: 'Emails' }
    ];

    const structure = { sections: [
      { name: 'Facts', type: 'substantive' },
      { name: 'Financial Impact', type: 'substantive' }
    ]};

    const evidencePlan = planGen.planEvidenceIntegration(evidence, structure, null);
    
    assert(evidencePlan.totalEvidence === 3, 'Should count all evidence');
    assert(evidencePlan.categorized, 'Should categorize evidence');
    assert(evidencePlan.mapping, 'Should have section mapping');
  }

  async testTimelineAnalysis() {
    const timeline = [
      { date: '2025-01-01', description: 'Event 1', category: 'start' },
      { date: '2025-02-01', description: 'Event 2', category: 'fraud' },
      { date: '2025-03-01', description: 'Event 3', category: 'fraud' },
      { date: '2025-06-01', description: 'Event 4', category: 'litigation' }
    ];

    const planGen = this.system.planGenerator;
    const timelinePlan = planGen.createTimelinePlan(timeline, { name: 'fraud' });
    
    assert(timelinePlan, 'Should create timeline plan');
    assert(timelinePlan.events.length === 4, 'Should include all events');
    assert(timelinePlan.sections, 'Should group events into sections');
  }

  async testComplexityCalculation() {
    const planGen = this.system.planGenerator;
    
    const simple = planGen.calculateComplexity({
      claims: ['claim1'],
      evidence: ['ev1'],
      timeline: [],
      urgency: 'normal'
    });
    
    const complex = planGen.calculateComplexity({
      claims: ['claim1', 'claim2', 'claim3', 'claim4', 'claim5'],
      evidence: ['ev1', 'ev2', 'ev3', 'ev4', 'ev5', 'ev6'],
      timeline: ['t1', 't2', 't3', 't4', 't5'],
      respondingTo: 'other-doc',
      urgency: 'urgent'
    });
    
    assert(simple < complex, 'Complex case should have higher complexity');
    assert(simple >= 1 && simple <= 10, 'Simple complexity in range');
    assert(complex >= 1 && complex <= 10, 'Complex complexity in range');
  }

  async testRatingSystem() {
    const evaluator = this.system.evaluator;
    
    const excellent = evaluator.determineRating(92, 'answering-affidavit');
    const good = evaluator.determineRating(75, 'answering-affidavit');
    const poor = evaluator.determineRating(40, 'answering-affidavit');
    
    assert(excellent.stars > good.stars, 'Higher score should have more stars');
    assert(good.stars > poor.stars, 'Good should be better than poor');
    assert(excellent.level === 'Excellent' || excellent.level === 'Exceptional', 'High score should be excellent');
    assert(poor.level === 'Poor' || poor.level === 'Needs Improvement', 'Low score should be poor');
  }
}

// Run tests if executed directly
if (require.main === module) {
  const tester = new LegalDocumentSystemTest();
  tester.runAllTests().then(results => {
    process.exit(results.failed > 0 ? 1 : 0);
  });
}

module.exports = LegalDocumentSystemTest;