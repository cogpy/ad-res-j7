#!/usr/bin/env node

/**
 * Optimal Proof Strategies Test Suite
 * ===================================
 * 
 * Comprehensive test suite for validating the optimal proof strategies implementation
 * including burden of proof calculations, necessary conditions, and evidence requirements.
 */

const fs = require('fs');
const path = require('path');

class OptimalProofStrategiesTest {
  constructor() {
    this.testResults = {
      passed: 0,
      failed: 0,
      errors: []
    };
  }

  /**
   * Assert helper function
   */
  assert(condition, message) {
    if (condition) {
      this.testResults.passed++;
      console.log(`  ✅ ${message}`);
    } else {
      this.testResults.failed++;
      this.testResults.errors.push(message);
      console.log(`  ❌ ${message}`);
    }
    return condition;
  }

  /**
   * Test 1: Validate implementation file exists and is executable
   */
  testImplementationFile() {
    console.log('\n📋 Test 1: Implementation File Validation');
    
    const implementationPath = path.join(process.cwd(), 'optimal-proof-strategies.js');
    this.assert(fs.existsSync(implementationPath), 'optimal-proof-strategies.js file exists');
    
    if (fs.existsSync(implementationPath)) {
      const content = fs.readFileSync(implementationPath, 'utf8');
      this.assert(content.includes('class OptimalProofStrategies'), 'Contains OptimalProofStrategies class');
      this.assert(content.includes('generateProofStrategy'), 'Contains generateProofStrategy method');
      this.assert(content.includes('calculateBurdenOfProof'), 'Contains calculateBurdenOfProof method');
      this.assert(content.includes('determineNecessaryConditions'), 'Contains determineNecessaryConditions method');
      this.assert(content.includes('standardsOfProof'), 'Contains standards of proof definition');
      this.assert(content.includes('legalElements'), 'Contains legal elements definition');
      
      // Check for specific standards
      this.assert(content.includes('civil'), 'Includes civil standard');
      this.assert(content.includes('criminal'), 'Includes criminal standard');
      this.assert(content.includes('mathematical'), 'Includes mathematical standard');
      
      // Check threshold values
      this.assert(content.includes('0.50'), 'Includes 50% threshold for civil');
      this.assert(content.includes('0.95'), 'Includes 95% threshold for criminal');
      this.assert(content.includes('1.00'), 'Includes 100% threshold for mathematical');
    }
  }

  /**
   * Test 2: Validate generated output files
   */
  testOutputFiles() {
    console.log('\n📋 Test 2: Output Files Validation');
    
    const outputDir = path.join(process.cwd(), 'jax-dan-response');
    const matrixPath = path.join(outputDir, 'optimal_proof_strategies_matrix.json');
    const reportPath = path.join(outputDir, 'proof_strategies_implementation_report.json');
    
    this.assert(fs.existsSync(outputDir), 'jax-dan-response directory exists');
    this.assert(fs.existsSync(matrixPath), 'optimal_proof_strategies_matrix.json exists');
    this.assert(fs.existsSync(reportPath), 'proof_strategies_implementation_report.json exists');
    
    if (fs.existsSync(matrixPath)) {
      try {
        const matrix = JSON.parse(fs.readFileSync(matrixPath, 'utf8'));
        this.assert(matrix.case_context === "Dan and Jax vs Peter, Rynette, Bantjies", 'Correct case context');
        this.assert(Array.isArray(matrix.standards_covered), 'Standards covered is array');
        this.assert(matrix.standards_covered.length === 3, 'Three standards covered');
        this.assert(matrix.standards_covered.includes('civil'), 'Civil standard included');
        this.assert(matrix.standards_covered.includes('criminal'), 'Criminal standard included');
        this.assert(matrix.standards_covered.includes('mathematical'), 'Mathematical standard included');
        this.assert(typeof matrix.proof_strategies === 'object', 'Proof strategies object exists');
        this.assert(typeof matrix.summary_analysis === 'object', 'Summary analysis exists');
        this.assert(typeof matrix.strategic_recommendations === 'object', 'Strategic recommendations exist');
      } catch (error) {
        this.assert(false, `Error parsing matrix JSON: ${error.message}`);
      }
    }
    
    if (fs.existsSync(reportPath)) {
      try {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
        this.assert(report.system_overview.name === 'Optimal Proof Strategies Implementation', 'Correct system name');
        this.assert(report.coverage.total_strategies === 108, 'Correct total strategies count (2×3×6×3=108)');
        this.assert(Array.isArray(report.coverage.prosecutors), 'Prosecutors array exists');
        this.assert(Array.isArray(report.coverage.defendants), 'Defendants array exists');
        this.assert(report.coverage.prosecutors.includes('dan'), 'Dan included as prosecutor');
        this.assert(report.coverage.prosecutors.includes('jax'), 'Jax included as prosecutor');
        this.assert(report.coverage.defendants.includes('peter'), 'Peter included as defendant');
        this.assert(report.coverage.defendants.includes('rynette'), 'Rynette included as defendant');
        this.assert(report.coverage.defendants.includes('bantjies'), 'Bantjies included as defendant');
      } catch (error) {
        this.assert(false, `Error parsing report JSON: ${error.message}`);
      }
    }
  }

  /**
   * Test 3: Validate standards of proof implementation
   */
  testStandardsOfProof() {
    console.log('\n📋 Test 3: Standards of Proof Validation');
    
    try {
      const OptimalProofStrategies = require('../optimal-proof-strategies.js');
      const strategies = new OptimalProofStrategies();
      
      // Test civil standard
      const civilStandard = strategies.standardsOfProof.civil;
      this.assert(civilStandard.threshold === 0.50, 'Civil standard has 50% threshold');
      this.assert(civilStandard.name === 'Balance of Probabilities', 'Civil standard has correct name');
      this.assert(civilStandard.description.includes('>50%'), 'Civil standard description includes >50%');
      this.assert(Array.isArray(civilStandard.requirements), 'Civil standard has requirements array');
      
      // Test criminal standard
      const criminalStandard = strategies.standardsOfProof.criminal;
      this.assert(criminalStandard.threshold === 0.95, 'Criminal standard has 95% threshold');
      this.assert(criminalStandard.name === 'Beyond Reasonable Doubt', 'Criminal standard has correct name');
      this.assert(criminalStandard.description.includes('>95%'), 'Criminal standard description includes >95%');
      this.assert(Array.isArray(criminalStandard.requirements), 'Criminal standard has requirements array');
      
      // Test mathematical standard
      const mathStandard = strategies.standardsOfProof.mathematical;
      this.assert(mathStandard.threshold === 1.00, 'Mathematical standard has 100% threshold');
      this.assert(mathStandard.name === 'Invariant Conditions', 'Mathematical standard has correct name');
      this.assert(mathStandard.description.includes('100%'), 'Mathematical standard description includes 100%');
      this.assert(Array.isArray(mathStandard.requirements), 'Mathematical standard has requirements array');
      
    } catch (error) {
      this.assert(false, `Error testing standards of proof: ${error.message}`);
    }
  }

  /**
   * Test 4: Validate legal elements coverage
   */
  testLegalElements() {
    console.log('\n📋 Test 4: Legal Elements Validation');
    
    try {
      const OptimalProofStrategies = require('../optimal-proof-strategies.js');
      const strategies = new OptimalProofStrategies();
      
      const expectedElements = [
        'fiduciary_breach',
        'fraud', 
        'theft',
        'corporate_misconduct',
        'conspiracy',
        'regulatory_violation'
      ];
      
      expectedElements.forEach(element => {
        this.assert(
          strategies.legalElements.hasOwnProperty(element),
          `Legal element "${element}" is defined`
        );
        
        if (strategies.legalElements[element]) {
          const elementDef = strategies.legalElements[element];
          this.assert(elementDef.name, `Element "${element}" has name`);
          this.assert(Array.isArray(elementDef.elements), `Element "${element}" has elements array`);
          this.assert(elementDef.jurisdiction, `Element "${element}" has jurisdiction`);
          this.assert(elementDef.elements.length > 0, `Element "${element}" has at least one sub-element`);
        }
      });
      
      // Test specific element details
      const fiduciaryBreach = strategies.legalElements.fiduciary_breach;
      this.assert(fiduciaryBreach.elements.includes('causation'), 'Fiduciary breach includes causation');
      this.assert(fiduciaryBreach.elements.includes('damages'), 'Fiduciary breach includes damages');
      this.assert(fiduciaryBreach.jurisdiction === 'civil', 'Fiduciary breach is civil jurisdiction');
      
      const fraud = strategies.legalElements.fraud;
      this.assert(fraud.elements.includes('intent to deceive'), 'Fraud includes intent to deceive');
      this.assert(fraud.jurisdiction === 'criminal', 'Fraud is criminal jurisdiction');
      
    } catch (error) {
      this.assert(false, `Error testing legal elements: ${error.message}`);
    }
  }

  /**
   * Test 5: Validate proof strategy generation
   */
  testProofStrategyGeneration() {
    console.log('\n📋 Test 5: Proof Strategy Generation Validation');
    
    try {
      const OptimalProofStrategies = require('../optimal-proof-strategies.js');
      const strategies = new OptimalProofStrategies();
      
      // Test generating a specific strategy
      const strategy = strategies.generateProofStrategy('dan', 'peter', 'fraud', 'criminal');
      
      this.assert(typeof strategy === 'object', 'Strategy generation returns object');
      this.assert(strategy.case === 'DAN vs PETER', 'Correct case designation');
      this.assert(strategy.legal_element === 'Fraud', 'Correct legal element');
      this.assert(strategy.standard_of_proof === 'Beyond Reasonable Doubt', 'Correct standard of proof');
      this.assert(strategy.threshold === 0.95, 'Correct threshold for criminal standard');
      
      // Test burden of proof structure
      this.assert(typeof strategy.burden_of_proof === 'object', 'Burden of proof is object');
      this.assert(strategy.burden_of_proof.primary_burden === 'dan', 'Correct primary burden');
      this.assert(strategy.burden_of_proof.threshold_certainty === '95.0%', 'Correct threshold certainty');
      this.assert(Array.isArray(strategy.burden_of_proof.elements_to_prove), 'Elements to prove is array');
      this.assert(typeof strategy.burden_of_proof.burden_distribution === 'object', 'Burden distribution exists');
      
      // Test necessary conditions structure
      this.assert(typeof strategy.necessary_conditions === 'object', 'Necessary conditions is object');
      this.assert(Array.isArray(strategy.necessary_conditions.essential_elements), 'Essential elements is array');
      this.assert(Array.isArray(strategy.necessary_conditions.sufficient_combinations), 'Sufficient combinations is array');
      
      // Test evidence requirements structure
      this.assert(typeof strategy.evidence_requirements === 'object', 'Evidence requirements is object');
      this.assert(strategy.evidence_requirements.total_evidence_weight_needed === 0.95, 'Correct total evidence weight');
      this.assert(typeof strategy.evidence_requirements.evidence_categories === 'object', 'Evidence categories exist');
      
      // Test success probability structure
      this.assert(typeof strategy.success_probability === 'object', 'Success probability is object');
      this.assert(typeof strategy.success_probability.base_probability === 'number', 'Base probability is number');
      this.assert(typeof strategy.success_probability.complexity_adjusted === 'number', 'Complexity adjusted is number');
      
    } catch (error) {
      this.assert(false, `Error testing proof strategy generation: ${error.message}`);
    }
  }

  /**
   * Test 6: Validate burden of proof calculations
   */
  testBurdenOfProofCalculations() {
    console.log('\n📋 Test 6: Burden of Proof Calculations');
    
    try {
      const OptimalProofStrategies = require('../optimal-proof-strategies.js');
      const strategies = new OptimalProofStrategies();
      
      // Test civil standard burden
      const civilStrategy = strategies.generateProofStrategy('jax', 'rynette', 'fiduciary_breach', 'civil');
      this.assert(civilStrategy.threshold === 0.50, 'Civil standard has 50% threshold');
      this.assert(civilStrategy.burden_of_proof.threshold_certainty === '50.0%', 'Civil burden threshold correct');
      
      // Test criminal standard burden  
      const criminalStrategy = strategies.generateProofStrategy('dan', 'bantjies', 'theft', 'criminal');
      this.assert(criminalStrategy.threshold === 0.95, 'Criminal standard has 95% threshold');
      this.assert(criminalStrategy.burden_of_proof.threshold_certainty === '95.0%', 'Criminal burden threshold correct');
      
      // Test mathematical standard burden
      const mathStrategy = strategies.generateProofStrategy('jax', 'peter', 'conspiracy', 'mathematical');
      this.assert(mathStrategy.threshold === 1.00, 'Mathematical standard has 100% threshold');
      this.assert(mathStrategy.burden_of_proof.threshold_certainty === '100.0%', 'Mathematical burden threshold correct');
      
      // Test burden distribution
      const burdenDist = criminalStrategy.burden_of_proof.burden_distribution;
      this.assert(typeof burdenDist === 'object', 'Burden distribution is object');
      
      Object.keys(burdenDist).forEach(element => {
        this.assert(typeof burdenDist[element].weight === 'number', `Element "${element}" has weight`);
        this.assert(typeof burdenDist[element].evidence_threshold === 'number', `Element "${element}" has evidence threshold`);
        this.assert(typeof burdenDist[element].corroboration_required === 'boolean', `Element "${element}" has corroboration requirement`);
      });
      
    } catch (error) {
      this.assert(false, `Error testing burden of proof calculations: ${error.message}`);
    }
  }

  /**
   * Test 7: Validate necessary conditions determination
   */
  testNecessaryConditions() {
    console.log('\n📋 Test 7: Necessary Conditions Validation');
    
    try {
      const OptimalProofStrategies = require('../optimal-proof-strategies.js');
      const strategies = new OptimalProofStrategies();
      
      // Test high-standard necessary conditions (criminal)
      const criminalStrategy = strategies.generateProofStrategy('dan', 'peter', 'fraud', 'criminal');
      const criminalConditions = criminalStrategy.necessary_conditions;
      
      this.assert(Array.isArray(criminalConditions.essential_elements), 'Criminal: Essential elements is array');
      this.assert(criminalConditions.essential_elements.length > 0, 'Criminal: Has essential elements');
      
      criminalConditions.essential_elements.forEach((element, index) => {
        this.assert(element.necessity === 'absolute', `Criminal element ${index}: Necessity is absolute`);
        this.assert(element.minimum_evidence_strength === 0.95, `Criminal element ${index}: Correct evidence strength`);
        this.assert(Array.isArray(element.alternative_proof_paths), `Criminal element ${index}: Has alternative proof paths`);
      });
      
      // Test corroboration matrix for high standards
      this.assert(typeof criminalConditions.corroboration_matrix === 'object', 'Criminal: Corroboration matrix exists');
      
      // Test mathematical standard conditions
      const mathStrategy = strategies.generateProofStrategy('jax', 'bantjies', 'regulatory_violation', 'mathematical');
      const mathConditions = mathStrategy.necessary_conditions;
      
      this.assert(Array.isArray(mathConditions.sufficient_combinations), 'Mathematical: Sufficient combinations exist');
      mathConditions.sufficient_combinations.forEach((combo, index) => {
        this.assert(Array.isArray(combo.combination), `Mathematical combo ${index}: Combination is array`);
        this.assert(typeof combo.confidence === 'number', `Mathematical combo ${index}: Has confidence`);
        this.assert(combo.confidence <= 1.0, `Mathematical combo ${index}: Confidence <= 1.0`);
      });
      
    } catch (error) {
      this.assert(false, `Error testing necessary conditions: ${error.message}`);
    }
  }

  /**
   * Test 8: Validate comprehensive matrix generation
   */
  testComprehensiveMatrixGeneration() {
    console.log('\n📋 Test 8: Comprehensive Matrix Generation');
    
    try {
      const OptimalProofStrategies = require('../optimal-proof-strategies.js');
      const strategies = new OptimalProofStrategies();
      
      const matrix = strategies.generateComprehensiveProofMatrix();
      
      this.assert(typeof matrix === 'object', 'Matrix is object');
      this.assert(matrix.case_context === "Dan and Jax vs Peter, Rynette, Bantjies", 'Correct case context');
      this.assert(Array.isArray(matrix.standards_covered), 'Standards covered is array');
      this.assert(Array.isArray(matrix.legal_elements_covered), 'Legal elements covered is array');
      this.assert(typeof matrix.proof_strategies === 'object', 'Proof strategies is object');
      
      // Test prosecutor coverage
      strategies.agents.prosecutors.forEach(prosecutor => {
        this.assert(matrix.proof_strategies.hasOwnProperty(prosecutor), `Prosecutor "${prosecutor}" has strategies`);
        
        strategies.agents.defendants.forEach(defendant => {
          this.assert(
            matrix.proof_strategies[prosecutor].hasOwnProperty(defendant),
            `Prosecutor "${prosecutor}" has strategies for defendant "${defendant}"`
          );
          
          Object.keys(strategies.legalElements).forEach(element => {
            this.assert(
              matrix.proof_strategies[prosecutor][defendant].hasOwnProperty(element),
              `${prosecutor} vs ${defendant}: Element "${element}" covered`
            );
            
            Object.keys(strategies.standardsOfProof).forEach(standard => {
              this.assert(
                matrix.proof_strategies[prosecutor][defendant][element].hasOwnProperty(standard),
                `${prosecutor} vs ${defendant} - ${element}: Standard "${standard}" covered`
              );
            });
          });
        });
      });
      
      // Test summary analysis
      this.assert(typeof matrix.summary_analysis === 'object', 'Summary analysis exists');
      this.assert(Array.isArray(matrix.summary_analysis.strategic_insights), 'Strategic insights is array');
      this.assert(typeof matrix.summary_analysis.success_probability_by_standard === 'object', 'Success probabilities exist');
      
      // Test strategic recommendations
      this.assert(typeof matrix.strategic_recommendations === 'object', 'Strategic recommendations exist');
      this.assert(Array.isArray(matrix.strategic_recommendations.optimal_prosecution_order), 'Optimal prosecution order exists');
      
    } catch (error) {
      this.assert(false, `Error testing comprehensive matrix generation: ${error.message}`);
    }
  }

  /**
   * Test 9: Validate integration capabilities
   */
  testIntegrationCapabilities() {
    console.log('\n📋 Test 9: Integration Capabilities');
    
    try {
      const OptimalProofStrategies = require('../optimal-proof-strategies.js');
      const strategies = new OptimalProofStrategies();
      
      const report = strategies.generateImplementationReport();
      
      this.assert(typeof report === 'object', 'Implementation report is object');
      this.assert(typeof report.system_overview === 'object', 'System overview exists');
      this.assert(typeof report.coverage === 'object', 'Coverage information exists');
      this.assert(Array.isArray(report.capabilities), 'Capabilities is array');
      this.assert(typeof report.integration === 'object', 'Integration information exists');
      
      // Test integration compatibility
      const integration = report.integration;
      this.assert(Array.isArray(integration.compatible_with), 'Compatible with is array');
      this.assert(Array.isArray(integration.extends), 'Extends is array');
      
      const expectedCompatibility = [
        'optimal-strategy-implementation.js',
        'lex-inference-engine', 
        'hypergraph_resolver.py',
        'workflow validation system'
      ];
      
      expectedCompatibility.forEach(system => {
        this.assert(
          integration.compatible_with.includes(system),
          `Compatible with ${system}`
        );
      });
      
      // Test capability coverage
      const expectedCapabilities = [
        'Burden of proof calculation for each standard',
        'Necessary conditions determination',
        'Evidence requirements specification',
        'Strategic approach generation'
      ];
      
      expectedCapabilities.forEach(capability => {
        this.assert(
          report.capabilities.some(cap => cap.includes(capability.split(' ')[0])),
          `Has capability related to: ${capability}`
        );
      });
      
    } catch (error) {
      this.assert(false, `Error testing integration capabilities: ${error.message}`);
    }
  }

  /**
   * Test 10: Validate agent and defendant coverage
   */
  testAgentCoverage() {
    console.log('\n📋 Test 10: Agent and Defendant Coverage');
    
    try {
      const OptimalProofStrategies = require('../optimal-proof-strategies.js');
      const strategies = new OptimalProofStrategies();
      
      // Test agent definitions
      this.assert(Array.isArray(strategies.agents.prosecutors), 'Prosecutors is array');
      this.assert(Array.isArray(strategies.agents.defendants), 'Defendants is array');
      
      // Test prosecutor coverage (Dan and Jax)
      this.assert(strategies.agents.prosecutors.includes('dan'), 'Dan included as prosecutor');
      this.assert(strategies.agents.prosecutors.includes('jax'), 'Jax included as prosecutor');
      this.assert(strategies.agents.prosecutors.length === 2, 'Exactly 2 prosecutors');
      
      // Test defendant coverage (Peter, Rynette, Bantjies)
      this.assert(strategies.agents.defendants.includes('peter'), 'Peter included as defendant');
      this.assert(strategies.agents.defendants.includes('rynette'), 'Rynette included as defendant');
      this.assert(strategies.agents.defendants.includes('bantjies'), 'Bantjies included as defendant');
      this.assert(strategies.agents.defendants.length === 3, 'Exactly 3 defendants');
      
      // Test strategy generation for all combinations
      strategies.agents.prosecutors.forEach(prosecutor => {
        strategies.agents.defendants.forEach(defendant => {
          try {
            const strategy = strategies.generateProofStrategy(prosecutor, defendant, 'fraud', 'civil');
            this.assert(
              strategy.case === `${prosecutor.toUpperCase()} vs ${defendant.toUpperCase()}`,
              `Strategy generated for ${prosecutor} vs ${defendant}`
            );
            this.assert(
              strategy.burden_of_proof.primary_burden === prosecutor,
              `${prosecutor} has primary burden against ${defendant}`
            );
          } catch (error) {
            this.assert(false, `Error generating strategy for ${prosecutor} vs ${defendant}: ${error.message}`);
          }
        });
      });
      
    } catch (error) {
      this.assert(false, `Error testing agent coverage: ${error.message}`);
    }
  }

  /**
   * Run all tests
   */
  runAllTests() {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('🧪 Optimal Proof Strategies Test Suite');
    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log('Testing implementation of optimal strategies for Dan and Jax');
    console.log('to prove guilt under different standards of proof\n');

    try {
      this.testImplementationFile();
      this.testOutputFiles();
      this.testStandardsOfProof();
      this.testLegalElements();
      this.testProofStrategyGeneration();
      this.testBurdenOfProofCalculations();
      this.testNecessaryConditions();
      this.testComprehensiveMatrixGeneration();
      this.testIntegrationCapabilities();
      this.testAgentCoverage();

      console.log('\n═══════════════════════════════════════════════════════════════');
      console.log('📊 Test Results Summary');
      console.log('═══════════════════════════════════════════════════════════════');
      console.log(`✅ Passed: ${this.testResults.passed}`);
      console.log(`❌ Failed: ${this.testResults.failed}`);

      if (this.testResults.failed > 0) {
        console.log('\n❌ Failed Tests:');
        this.testResults.errors.forEach((error, index) => {
          console.log(`  ${index + 1}. ${error}`);
        });
        console.log('\n⚠️  Some tests failed. Please review the issues above.');
        return false;
      } else {
        console.log('\n✅ All tests passed! Optimal proof strategies implementation is working correctly.');
        console.log('\n🎯 Validation Summary:');
        console.log('   • Civil standard (>50% certainty): ✅ Implemented');
        console.log('   • Criminal standard (>95% certainty): ✅ Implemented');
        console.log('   • Mathematical standard (100% certainty): ✅ Implemented');
        console.log('   • Dan and Jax as prosecutors: ✅ Covered');
        console.log('   • Peter, Rynette, Bantjies as defendants: ✅ Covered');
        console.log('   • Burden of proof calculations: ✅ Validated');
        console.log('   • Necessary conditions determination: ✅ Validated');
        console.log('   • Evidence requirements specification: ✅ Validated');
        console.log('   • Comprehensive strategy matrix: ✅ Generated');
        return true;
      }

    } catch (error) {
      console.error('\n💥 Test suite encountered an error:', error.message);
      console.error(error.stack);
      return false;
    }
  }
}

// Run tests if executed directly
if (require.main === module) {
  const tester = new OptimalProofStrategiesTest();
  const success = tester.runAllTests();
  process.exit(success ? 0 : 1);
}

module.exports = OptimalProofStrategiesTest;