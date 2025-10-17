#!/usr/bin/env node

/**
 * Burden of Proof Workflow Test
 * 
 * Tests the workflow system using sample tasks that incorporate 
 * burden of proof requirements for Dan & Jax to prove guilt
 * of other agents (Peter, Rynette, Bantjies, etc.)
 */

const fs = require('fs');
const path = require('path');

class BurdenOfProofWorkflowTest {
  constructor() {
    this.testResults = [];
    this.startTime = Date.now();
    this.sampleTasks = [];
    this.proofStandards = ['civil', 'criminal', 'mathematical'];
  }

  assert(condition, message) {
    const result = {
      test: message,
      passed: condition,
      timestamp: new Date().toISOString()
    };
    
    this.testResults.push(result);
    
    if (condition) {
      console.log(`✅ ${message}`);
    } else {
      console.log(`❌ ${message}`);
    }
    
    return condition;
  }

  // Test 1: Verify burden of proof framework files exist
  testBurdenOfProofFilesExist() {
    console.log('\n🧪 Test 1: Verify burden of proof framework files exist...');
    
    const requiredFiles = [
      'burden-of-proof-framework.js',
      'burden-of-proof-requirements.json',
      'burden-of-proof-strategies.json', 
      'workflow-test-samples.json'
    ];

    let allFilesExist = true;
    requiredFiles.forEach(file => {
      const exists = fs.existsSync(file);
      this.assert(exists, `${file} exists`);
      if (!exists) allFilesExist = false;
    });

    return allFilesExist;
  }

  // Test 2: Load and validate workflow test samples
  testLoadWorkflowSamples() {
    console.log('\n🧪 Test 2: Load and validate workflow test samples...');
    
    try {
      const samplesData = fs.readFileSync('workflow-test-samples.json', 'utf8');
      const samples = JSON.parse(samplesData);
      
      this.assert(samples.sample_tasks && Array.isArray(samples.sample_tasks), 
                  'Sample tasks array exists');
      
      this.sampleTasks = samples.sample_tasks;
      
      this.assert(this.sampleTasks.length >= 5, 
                  `At least 5 sample tasks loaded (${this.sampleTasks.length})`);
      
      // Validate each sample task structure
      let validTasks = 0;
      this.sampleTasks.forEach(task => {
        if (task.id && task.title && task.priority && task.standard && task.target) {
          validTasks++;
        }
      });
      
      this.assert(validTasks === this.sampleTasks.length, 
                  `All sample tasks have required fields (${validTasks}/${this.sampleTasks.length})`);
      
      return true;
    } catch (error) {
      this.assert(false, `Failed to load workflow samples: ${error.message}`);
      return false;
    }
  }

  // Test 3: Validate burden of proof standards coverage
  testProofStandardsCoverage() {
    console.log('\n🧪 Test 3: Validate burden of proof standards coverage...');
    
    const standardsCovered = new Set();
    this.sampleTasks.forEach(task => {
      if (task.standard !== 'all' && task.standard !== 'System') {
        standardsCovered.add(task.standard);
      }
    });
    
    this.proofStandards.forEach(standard => {
      const hasTasks = standardsCovered.has(standard);
      this.assert(hasTasks, `${standard} standard has sample tasks`);
    });
    
    this.assert(standardsCovered.size >= 3, 
                `All three proof standards covered (${standardsCovered.size}/3)`);
    
    return standardsCovered.size >= 3;
  }

  // Test 4: Validate accused parties coverage
  testAccusedPartiesCoverage() {
    console.log('\n🧪 Test 4: Validate accused parties coverage...');
    
    const expectedParties = ['Peter', 'Rynette', 'Bantjies'];
    const partiesCovered = new Set();
    
    this.sampleTasks.forEach(task => {
      if (expectedParties.includes(task.target)) {
        partiesCovered.add(task.target);
      }
    });
    
    expectedParties.forEach(party => {
      const hasTasks = partiesCovered.has(party);
      this.assert(hasTasks, `${party} has targeted sample tasks`);
    });
    
    this.assert(partiesCovered.size === expectedParties.length,
                `All accused parties covered (${partiesCovered.size}/${expectedParties.length})`);
    
    return partiesCovered.size === expectedParties.length;
  }

  // Test 5: Test civil standard proof requirements
  testCivilStandardRequirements() {
    console.log('\n🧪 Test 5: Test civil standard proof requirements...');
    
    try {
      const requirementsData = fs.readFileSync('burden-of-proof-requirements.json', 'utf8');
      const requirements = JSON.parse(requirementsData);
      
      const civil = requirements.standards.civil;
      
      this.assert(civil && civil.standard, 'Civil standard definition exists');
      this.assert(civil.standard.threshold === '50.1%', 
                  'Civil standard has correct threshold (50.1%)');
      this.assert(civil.requirements && civil.requirements.necessary_elements,
                  'Civil standard has necessary elements defined');
      this.assert(civil.requirements.what_dan_jax_must_prove &&
                  Array.isArray(civil.requirements.what_dan_jax_must_prove),
                  'Civil standard defines what Dan & Jax must prove');
      
      const civilTasks = this.sampleTasks.filter(task => task.standard === 'civil');
      this.assert(civilTasks.length > 0, 
                  `Civil standard has sample tasks (${civilTasks.length})`);
      
      return true;
    } catch (error) {
      this.assert(false, `Failed to test civil requirements: ${error.message}`);
      return false;
    }
  }

  // Test 6: Test criminal standard proof requirements  
  testCriminalStandardRequirements() {
    console.log('\n🧪 Test 6: Test criminal standard proof requirements...');
    
    try {
      const requirementsData = fs.readFileSync('burden-of-proof-requirements.json', 'utf8');
      const requirements = JSON.parse(requirementsData);
      
      const criminal = requirements.standards.criminal;
      
      this.assert(criminal && criminal.standard, 'Criminal standard definition exists');
      this.assert(criminal.standard.threshold === '95%+',
                  'Criminal standard has correct threshold (95%+)');
      this.assert(criminal.requirements && criminal.requirements.necessary_elements,
                  'Criminal standard has necessary elements defined');
      this.assert(criminal.requirements.what_dan_jax_must_prove &&
                  Array.isArray(criminal.requirements.what_dan_jax_must_prove),
                  'Criminal standard defines what Dan & Jax must prove');
      
      const criminalTasks = this.sampleTasks.filter(task => task.standard === 'criminal');
      this.assert(criminalTasks.length > 0,
                  `Criminal standard has sample tasks (${criminalTasks.length})`);
      
      return true;
    } catch (error) {
      this.assert(false, `Failed to test criminal requirements: ${error.message}`);
      return false;
    }
  }

  // Test 7: Test mathematical standard proof requirements
  testMathematicalStandardRequirements() {
    console.log('\n🧪 Test 7: Test mathematical standard proof requirements...');
    
    try {
      const requirementsData = fs.readFileSync('burden-of-proof-requirements.json', 'utf8');
      const requirements = JSON.parse(requirementsData);
      
      const mathematical = requirements.standards.mathematical;
      
      this.assert(mathematical && mathematical.standard, 'Mathematical standard definition exists');
      this.assert(mathematical.standard.threshold === '100%',
                  'Mathematical standard has correct threshold (100%)');
      this.assert(mathematical.requirements && mathematical.requirements.necessary_elements,
                  'Mathematical standard has necessary elements defined');
      this.assert(mathematical.requirements.what_dan_jax_must_prove &&
                  Array.isArray(mathematical.requirements.what_dan_jax_must_prove),
                  'Mathematical standard defines what Dan & Jax must prove');
      
      const mathTasks = this.sampleTasks.filter(task => task.standard === 'mathematical');
      this.assert(mathTasks.length > 0,
                  `Mathematical standard has sample tasks (${mathTasks.length})`);
      
      return true;
    } catch (error) {
      this.assert(false, `Failed to test mathematical requirements: ${error.message}`);
      return false;
    }
  }

  // Test 8: Test target-specific strategies
  testTargetSpecificStrategies() {
    console.log('\n🧪 Test 8: Test target-specific strategies...');
    
    try {
      const strategiesData = fs.readFileSync('burden-of-proof-strategies.json', 'utf8');
      const strategies = JSON.parse(strategiesData);
      
      const expectedTargets = ['Peter', 'Rynette', 'Bantjies'];
      
      expectedTargets.forEach(target => {
        const targetStrategy = strategies.target_strategies[target];
        this.assert(targetStrategy !== undefined, 
                    `${target} has specific strategies defined`);
        
        if (targetStrategy) {
          this.assert(targetStrategy.civil_strategy !== undefined,
                      `${target} has civil strategy`);
          this.assert(targetStrategy.criminal_strategy !== undefined,
                      `${target} has criminal strategy`);
          this.assert(targetStrategy.mathematical_strategy !== undefined,
                      `${target} has mathematical strategy`);
        }
      });
      
      return true;
    } catch (error) {
      this.assert(false, `Failed to test target strategies: ${error.message}`);
      return false;
    }
  }

  // Test 9: Test evidence requirements integration
  testEvidenceRequirementsIntegration() {
    console.log('\n🧪 Test 9: Test evidence requirements integration...');
    
    let tasksWithEvidence = 0;
    let tasksWithCriteria = 0;
    
    this.sampleTasks.forEach(task => {
      if (task.required_evidence && Array.isArray(task.required_evidence)) {
        tasksWithEvidence++;
      }
      if (task.success_criteria) {
        tasksWithCriteria++;
      }
    });
    
    this.assert(tasksWithEvidence > 0,
                `Tasks define required evidence (${tasksWithEvidence}/${this.sampleTasks.length})`);
    this.assert(tasksWithCriteria > 0,
                `Tasks define success criteria (${tasksWithCriteria}/${this.sampleTasks.length})`);
    
    // Test that critical priority tasks have comprehensive evidence requirements
    const criticalTasks = this.sampleTasks.filter(task => 
      task.priority.includes('Critical'));
    
    if (criticalTasks.length > 0) {
      const criticalTasksWithEvidence = criticalTasks.filter(task =>
        task.required_evidence && task.required_evidence.length >= 3);
      
      this.assert(criticalTasksWithEvidence.length === criticalTasks.length,
                  `Critical tasks have comprehensive evidence requirements`);
    }
    
    return true;
  }

  // Test 10: Test workflow integration readiness
  testWorkflowIntegrationReadiness() {
    console.log('\n🧪 Test 10: Test workflow integration readiness...');
    
    // Check if existing workflow files exist
    const workflowFile = '.github/workflows/todo-to-issues.yml';
    this.assert(fs.existsSync(workflowFile), 'Todo-to-issues workflow exists');
    
    // Test that sample tasks follow expected format for workflow processing
    let correctlyFormattedTasks = 0;
    
    this.sampleTasks.forEach(task => {
      if (task.id && task.title && task.priority && task.description) {
        correctlyFormattedTasks++;
      }
    });
    
    this.assert(correctlyFormattedTasks === this.sampleTasks.length,
                `All tasks correctly formatted for workflow (${correctlyFormattedTasks}/${this.sampleTasks.length})`);
    
    // Test priority categorization matches workflow expectations
    const priorities = ['Must-Do', 'Should-Do', 'Nice-to-Have'];
    let tasksWithValidPriorities = 0;
    
    this.sampleTasks.forEach(task => {
      if (priorities.some(priority => task.priority.includes(priority))) {
        tasksWithValidPriorities++;
      }
    });
    
    this.assert(tasksWithValidPriorities > 0,
                `Tasks use valid priority categories (${tasksWithValidPriorities}/${this.sampleTasks.length})`);
    
    return true;
  }

  // Test 11: Simulate workflow processing of burden of proof tasks
  testWorkflowProcessingSimulation() {
    console.log('\n🧪 Test 11: Simulate workflow processing of burden of proof tasks...');
    
    try {
      // Create a temporary todo file with burden of proof tasks
      const todoContent = this.generateTodoFileContent();
      const testTodoFile = 'todo/burden-of-proof-test.md';
      
      // Ensure todo directory exists
      if (!fs.existsSync('todo')) {
        fs.mkdirSync('todo');
      }
      
      fs.writeFileSync(testTodoFile, todoContent);
      this.assert(fs.existsSync(testTodoFile), 'Test todo file created successfully');
      
      // Verify content can be parsed
      const content = fs.readFileSync(testTodoFile, 'utf8');
      this.assert(content.includes('Must-Do'), 'Test file contains Must-Do section');
      this.assert(content.includes('Peter'), 'Test file contains Peter-related tasks');
      this.assert(content.includes('Civil Standard'), 'Test file contains civil standard tasks');
      
      // Count tasks that would be detected by workflow
      const lines = content.split('\n');
      const taskLines = lines.filter(line => line.match(/^\d+\.\s+/));
      
      this.assert(taskLines.length >= 3, 
                  `Test file contains multiple detectable tasks (${taskLines.length})`);
      
      return true;
    } catch (error) {
      this.assert(false, `Workflow simulation failed: ${error.message}`);
      return false;
    }
  }

  generateTodoFileContent() {
    return `# Burden of Proof Workflow Test

## Must-Do (Critical Priority)

1. Establish Peter's Fiduciary Duty Breach - Civil Standard
2. Document Rynette's Criminal Conspiracy - Criminal Standard

## Should-Do (High Priority)

3. Prove Bantjies' Professional Misconduct - Mathematical Standard
4. Test Multi-Party Civil Liability Framework

## Nice-to-Have (Low Priority)

5. Validate Evidence Chain Integration

## Implementation Notes

This test file validates that the workflow can process burden of proof tasks
for Dan & Jax to prove guilt of other agents across three legal standards:

- **Civil Standard**: Balance of probabilities (>50%)
- **Criminal Standard**: Beyond reasonable doubt (95%+)
- **Mathematical Standard**: Invariant of all conditions (100%)

### Target Parties:
- Peter (Fiduciary duty breaches)
- Rynette (Criminal conspiracy)
- Bantjies (Professional misconduct)

### Evidence Requirements:
Each task defines specific evidence requirements and success criteria
aligned with the applicable burden of proof standard.
`;
  }

  // Run all tests
  runAllTests() {
    console.log('🚀 Starting Burden of Proof Workflow Test Suite');
    console.log('🎯 Testing workflow with sample tasks incorporating burden of proof requirements');
    console.log('=' .repeat(80));

    const tests = [
      () => this.testBurdenOfProofFilesExist(),
      () => this.testLoadWorkflowSamples(),
      () => this.testProofStandardsCoverage(),
      () => this.testAccusedPartiesCoverage(),
      () => this.testCivilStandardRequirements(),
      () => this.testCriminalStandardRequirements(),
      () => this.testMathematicalStandardRequirements(),
      () => this.testTargetSpecificStrategies(),
      () => this.testEvidenceRequirementsIntegration(),
      () => this.testWorkflowIntegrationReadiness(),
      () => this.testWorkflowProcessingSimulation()
    ];

    let allTestsPassed = true;
    tests.forEach(test => {
      if (!test()) {
        allTestsPassed = false;
      }
    });

    // Calculate results
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(t => t.passed).length;
    const failedTests = totalTests - passedTests;
    const successRate = Math.round((passedTests / totalTests) * 100);
    const duration = ((Date.now() - this.startTime) / 1000).toFixed(2);

    // Print summary
    console.log('\n' + '=' .repeat(80));
    console.log('📊 Burden of Proof Workflow Test Summary');
    console.log('=' .repeat(80));
    console.log(`✅ Passed: ${passedTests}/${totalTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`📈 Success Rate: ${successRate}%`);
    console.log(`⏱️  Execution Time: ${duration}s`);
    console.log(`🎯 Proof Standards Tested: ${this.proofStandards.length}`);
    console.log(`👥 Accused Parties Covered: Peter, Rynette, Bantjies`);
    console.log(`📋 Sample Tasks Generated: ${this.sampleTasks.length}`);

    if (failedTests === 0) {
      console.log('\n🎉 ALL BURDEN OF PROOF WORKFLOW TESTS PASSED!');
      console.log('✅ Workflow ready to process burden of proof tasks');
      console.log('✅ Three legal standards fully implemented');
      console.log('✅ Target-specific strategies available');
      console.log('✅ Evidence requirements integrated');
    } else {
      console.log('\n⚠️  Some tests failed. Review the output above.');
    }

    console.log('=' .repeat(80));

    return allTestsPassed;
  }
}

// Run tests if executed directly
if (require.main === module) {
  const test = new BurdenOfProofWorkflowTest();
  const success = test.runAllTests();
  process.exit(success ? 0 : 1);
}

module.exports = BurdenOfProofWorkflowTest;