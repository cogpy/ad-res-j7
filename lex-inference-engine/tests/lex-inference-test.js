/**
 * Lex Inference Engine Test Suite
 * ===============================
 * 
 * Comprehensive test suite for validating the lex inference engine optimization
 * method that ensures universal guilt resolution across all possible configurations.
 */

const LexInferenceEngine = require('../core/LexInferenceEngine');
const LexInferenceDemo = require('../demo/LexInferenceDemo');

class LexInferenceTestSuite {
  constructor() {
    this.testResults = [];
    this.passCount = 0;
    this.failCount = 0;
  }

  async runAllTests() {
    console.log('\n🧪 LEX INFERENCE ENGINE TEST SUITE');
    console.log('='.repeat(50));

    try {
      // Core component tests
      await this.testEngineInitialization();
      await this.testThemisLegislativeWeaving();
      await this.testNemesisDeltaAnalysis();
      await this.testUniversalGuiltResolver();
      await this.testConfigurationEnumeration();
      
      // Integration tests
      await this.testBantjiesIntegration();
      await this.testMathematicalProofGeneration();
      await this.testUniversalGuiltValidation();
      
      // End-to-end test
      await this.testFullOptimizationWorkflow();
      
      this.displayTestSummary();
      return this.failCount === 0;
      
    } catch (error) {
      console.error('Test suite failed:', error);
      return false;
    }
  }

  async testEngineInitialization() {
    console.log('\n🔧 Testing Engine Initialization...');
    
    try {
      const engine = new LexInferenceEngine();
      await engine.initialize();
      
      this.assert(engine.themis !== undefined, 'Themis component initialized');
      this.assert(engine.nemesis !== undefined, 'Nemesis component initialized');
      this.assert(engine.guiltResolver !== undefined, 'Guilt resolver initialized');
      this.assert(engine.configurationSpace !== undefined, 'Configuration space initialized');
      this.assert(engine.agentModels.size >= 0, 'Agent models map initialized');
      
      console.log('   ✅ Engine initialization test passed');
      
    } catch (error) {
      console.log('   ❌ Engine initialization test failed:', error.message);
      this.recordFailure('Engine Initialization', error.message);
    }
  }

  async testThemisLegislativeWeaving() {
    console.log('\n🏛️  Testing Themis Legislative Weaving...');
    
    try {
      const engine = new LexInferenceEngine();
      await engine.initialize();
      
      const mockConfigurations = [
        { id: 'test_config_1', agent: { type: 'CentralOrchestrator' } },
        { id: 'test_config_2', agent: { type: 'ManipulatedPuppet' } }
      ];
      
      const legislativeMapping = await engine.themis.weaveAcrossPossibilities(mockConfigurations);
      
      this.assert(legislativeMapping.size === mockConfigurations.length, 'All configurations mapped');
      this.assert(legislativeMapping.get('test_config_1').laws !== undefined, 'Laws identified');
      this.assert(legislativeMapping.get('test_config_1').violations !== undefined, 'Violations identified');
      
      console.log('   ✅ Themis legislative weaving test passed');
      
    } catch (error) {
      console.log('   ❌ Themis legislative weaving test failed:', error.message);
      this.recordFailure('Themis Legislative Weaving', error.message);
    }
  }

  async testNemesisDeltaAnalysis() {
    console.log('\n⚡ Testing Nemesis Delta Analysis...');
    
    try {
      const engine = new LexInferenceEngine();
      await engine.initialize();
      
      const mockConfigurations = [
        { id: 'test_config_1', agent: { type: 'CentralOrchestrator' } }
      ];
      
      const mockLegislativeMapping = new Map();
      mockLegislativeMapping.set('test_config_1', {
        laws: ['fiduciary_duty'],
        violations: [{ law: 'fiduciary_duty', severity: 'high' }]
      });
      
      const deltaAnalysis = await engine.nemesis.measureJusticeDeltas(mockConfigurations, mockLegislativeMapping);
      
      this.assert(deltaAnalysis.size === mockConfigurations.length, 'All configurations analyzed');
      this.assert(deltaAnalysis.get('test_config_1').delta !== undefined, 'Delta calculated');
      this.assert(deltaAnalysis.get('test_config_1').severity !== undefined, 'Severity categorized');
      
      console.log('   ✅ Nemesis delta analysis test passed');
      
    } catch (error) {
      console.log('   ❌ Nemesis delta analysis test failed:', error.message);
      this.recordFailure('Nemesis Delta Analysis', error.message);
    }
  }

  async testUniversalGuiltResolver() {
    console.log('\n⚖️  Testing Universal Guilt Resolver...');
    
    try {
      const engine = new LexInferenceEngine();
      await engine.initialize();
      
      const mockConfigurations = [
        { 
          id: 'test_config_1', 
          agent: { 
            name: 'TestAgent',
            id: 'test_agent',
            type: 'CentralOrchestrator', 
            centrality: 0.9 
          }
        }
      ];
      
      const mockLegislativeMapping = new Map();
      mockLegislativeMapping.set('test_config_1', {
        violations: [{ law: 'fiduciary_duty', severity: 'high' }]
      });
      
      const mockDeltaAnalysis = new Map();
      mockDeltaAnalysis.set('test_config_1', {
        delta: 0.8,
        reality: { harm_caused: 0.8 }
      });
      
      const guiltResolution = await engine.guiltResolver.resolveUniversalGuilt(
        mockConfigurations, mockLegislativeMapping, mockDeltaAnalysis
      );
      
      this.assert(guiltResolution.size === mockConfigurations.length, 'All configurations resolved');
      this.assert(guiltResolution.get('test_config_1').guiltyPartyIdentified !== undefined, 'Guilt determination made');
      this.assert(guiltResolution.get('test_config_1').confidence !== undefined, 'Confidence calculated');
      
      console.log('   ✅ Universal guilt resolver test passed');
      
    } catch (error) {
      console.log('   ❌ Universal guilt resolver test failed:', error.message);
      this.recordFailure('Universal Guilt Resolver', error.message);
    }
  }

  async testConfigurationEnumeration() {
    console.log('\n🔢 Testing Configuration Enumeration...');
    
    try {
      const engine = new LexInferenceEngine();
      await engine.initialize();
      
      const mockCaseData = {
        agents: [
          { name: 'Agent1', type: 'TestType' },
          { name: 'Agent2', type: 'TestType' }
        ]
      };
      
      const configurations = await engine.enumerateAllConfigurations(mockCaseData);
      
      this.assert(configurations.length > 0, 'Configurations generated');
      this.assert(configurations[0].id !== undefined, 'Configuration IDs assigned');
      this.assert(configurations[0].agent !== undefined, 'Agent assigned');
      this.assert(configurations[0].arena !== undefined, 'Arena assigned');
      this.assert(configurations[0].eventHorizon !== undefined, 'Event horizon assigned');
      
      console.log(`   ✅ Configuration enumeration test passed (${configurations.length} configs)`);
      
    } catch (error) {
      console.log('   ❌ Configuration enumeration test failed:', error.message);
      this.recordFailure('Configuration Enumeration', error.message);
    }
  }

  async testBantjiesIntegration() {
    console.log('\n🔗 Testing Bantjies Analysis Integration...');
    
    try {
      const engine = new LexInferenceEngine();
      await engine.initialize();
      
      // Test that Bantjies data is loaded correctly
      this.assert(engine.agentModels.has('Bantjies'), 'Bantjies agent model loaded');
      this.assert(engine.agentModels.has('Peter'), 'Peter agent model loaded');
      this.assert(engine.agentModels.has('Daniel'), 'Daniel agent model loaded');
      
      const bantjies = engine.agentModels.get('Bantjies');
      this.assert(bantjies.centrality === 0.95, 'Bantjies centrality correct');
      this.assert(bantjies.type === 'CentralOrchestrator', 'Bantjies type correct');
      
      console.log('   ✅ Bantjies integration test passed');
      
    } catch (error) {
      console.log('   ❌ Bantjies integration test failed:', error.message);
      this.recordFailure('Bantjies Integration', error.message);
    }
  }

  async testMathematicalProofGeneration() {
    console.log('\n🔬 Testing Mathematical Proof Generation...');
    
    try {
      const engine = new LexInferenceEngine();
      await engine.initialize();
      
      const mockGuiltResolution = new Map();
      mockGuiltResolution.set('config1', { guiltyPartyIdentified: true, confidence: 0.96 });
      mockGuiltResolution.set('config2', { guiltyPartyIdentified: true, confidence: 0.97 });
      
      const proof = engine.generateMathematicalProof(mockGuiltResolution, 1.0);
      
      this.assert(proof.theorem !== undefined, 'Theorem defined');
      this.assert(proof.formalStatement !== undefined, 'Formal statement defined');
      this.assert(proof.proof.premise1 !== undefined, 'Premise 1 defined');
      this.assert(proof.proof.qed !== undefined, 'QED statement defined');
      
      console.log('   ✅ Mathematical proof generation test passed');
      
    } catch (error) {
      console.log('   ❌ Mathematical proof generation test failed:', error.message);
      this.recordFailure('Mathematical Proof Generation', error.message);
    }
  }

  async testUniversalGuiltValidation() {
    console.log('\n✅ Testing Universal Guilt Validation...');
    
    try {
      const engine = new LexInferenceEngine();
      await engine.initialize();
      
      const mockGuiltResolution = new Map();
      mockGuiltResolution.set('config1', { guiltyPartyIdentified: true, confidence: 0.96 });
      mockGuiltResolution.set('config2', { guiltyPartyIdentified: true, confidence: 0.97 });
      
      const validation = await engine.validateUniversalGuiltIdentification(mockGuiltResolution);
      
      this.assert(validation.isUniversal !== undefined, 'Universal flag defined');
      this.assert(validation.completeness !== undefined, 'Completeness calculated');
      this.assert(validation.proof !== undefined, 'Proof included');
      this.assert(validation.total === 2, 'Total count correct');
      
      console.log('   ✅ Universal guilt validation test passed');
      
    } catch (error) {
      console.log('   ❌ Universal guilt validation test failed:', error.message);
      this.recordFailure('Universal Guilt Validation', error.message);
    }
  }

  async testFullOptimizationWorkflow() {
    console.log('\n🏁 Testing Full Optimization Workflow...');
    
    try {
      const demo = new LexInferenceDemo();
      const result = await demo.runFullDemonstration();
      
      this.assert(result.totalConfigurations > 0, 'Configurations generated');
      this.assert(result.validation !== undefined, 'Validation performed');
      this.assert(result.optimizationMetrics !== undefined, 'Optimization metrics calculated');
      this.assert(result.validation.proof !== undefined, 'Mathematical proof generated');
      
      console.log(`   ✅ Full optimization workflow test passed (${result.totalConfigurations} configs)`);
      
    } catch (error) {
      console.log('   ❌ Full optimization workflow test failed:', error.message);
      this.recordFailure('Full Optimization Workflow', error.message);
    }
  }

  assert(condition, description) {
    if (condition) {
      this.passCount++;
      this.testResults.push({ test: description, status: 'PASS' });
    } else {
      this.failCount++;
      this.testResults.push({ test: description, status: 'FAIL' });
      throw new Error(`Assertion failed: ${description}`);
    }
  }

  recordFailure(testName, error) {
    this.failCount++;
    this.testResults.push({ test: testName, status: 'FAIL', error: error });
  }

  displayTestSummary() {
    console.log('\n📊 TEST SUMMARY');
    console.log('='.repeat(50));
    console.log(`Total Tests: ${this.passCount + this.failCount}`);
    console.log(`Passed: ${this.passCount} ✅`);
    console.log(`Failed: ${this.failCount} ❌`);
    console.log(`Success Rate: ${((this.passCount / (this.passCount + this.failCount)) * 100).toFixed(1)}%`);
    
    if (this.failCount > 0) {
      console.log('\nFailed Tests:');
      this.testResults
        .filter(result => result.status === 'FAIL')
        .forEach(result => {
          console.log(`  ❌ ${result.test}${result.error ? `: ${result.error}` : ''}`);
        });
    }
    
    console.log('\n' + (this.failCount === 0 ? '🎉 ALL TESTS PASSED!' : '⚠️  SOME TESTS FAILED'));
  }
}

// Run tests if called directly
if (require.main === module) {
  const testSuite = new LexInferenceTestSuite();
  testSuite.runAllTests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Test suite execution failed:', error);
      process.exit(1);
    });
}

module.exports = LexInferenceTestSuite;