#!/usr/bin/env node

// Comprehensive Test Runner for Workflow Validation
// Runs all validation and integration tests

const WorkflowValidator = require('./workflow-validation.test.js');
const WorkflowIntegrationTest = require('./integration-test.js');
const fs = require('fs');

class TestRunner {
  constructor() {
    this.results = {
      validation: null,
      integration: null,
      overall: {
        total_tests: 0,
        passed_tests: 0,
        failed_tests: 0,
        success_rate: 0
      }
    };
  }

  async runValidationTests() {
    console.log('📋 Running Workflow Validation Tests...\n');
    
    const validator = new WorkflowValidator();
    const success = validator.runAllTests();
    
    this.results.validation = {
      success: success,
      total: validator.testResults.length,
      passed: validator.testResults.filter(t => t.passed).length,
      failed: validator.testResults.filter(t => !t.passed).length,
      errors: validator.errors
    };
    
    return success;
  }

  async runIntegrationTests() {
    console.log('\n📋 Running Integration Tests...\n');
    
    const integrationTest = new WorkflowIntegrationTest();
    const success = integrationTest.runAllTests();
    
    this.results.integration = {
      success: success,
      total: integrationTest.testResults.length,
      passed: integrationTest.testResults.filter(t => t.passed).length,
      failed: integrationTest.testResults.filter(t => !t.passed).length,
      errors: integrationTest.errors,
      mock_issues: integrationTest.mockIssues.length
    };
    
    return success;
  }

  calculateOverallResults() {
    this.results.overall.total_tests = this.results.validation.total + this.results.integration.total;
    this.results.overall.passed_tests = this.results.validation.passed + this.results.integration.passed;
    this.results.overall.failed_tests = this.results.validation.failed + this.results.integration.failed;
    this.results.overall.success_rate = Math.round((this.results.overall.passed_tests / this.results.overall.total_tests) * 100);
  }

  printSummary() {
    console.log('\n' + '=' .repeat(80));
    console.log('📊 COMPREHENSIVE TEST SUMMARY');
    console.log('=' .repeat(80));
    
    console.log('\n🔍 Validation Tests:');
    console.log(`   ✅ Passed: ${this.results.validation.passed}/${this.results.validation.total}`);
    console.log(`   ❌ Failed: ${this.results.validation.failed}`);
    console.log(`   📈 Success Rate: ${Math.round((this.results.validation.passed / this.results.validation.total) * 100)}%`);
    
    console.log('\n🧪 Integration Tests:');
    console.log(`   ✅ Passed: ${this.results.integration.passed}/${this.results.integration.total}`);
    console.log(`   ❌ Failed: ${this.results.integration.failed}`);
    console.log(`   📈 Success Rate: ${Math.round((this.results.integration.passed / this.results.integration.total) * 100)}%`);
    console.log(`   🎯 Mock Issues Generated: ${this.results.integration.mock_issues}`);
    
    console.log('\n🎯 OVERALL RESULTS:');
    console.log(`   📝 Total Tests: ${this.results.overall.total_tests}`);
    console.log(`   ✅ Passed: ${this.results.overall.passed_tests}`);
    console.log(`   ❌ Failed: ${this.results.overall.failed_tests}`);
    console.log(`   📊 Success Rate: ${this.results.overall.success_rate}%`);
    
    if (this.results.overall.failed_tests === 0) {
      console.log('\n🎉 ALL TESTS PASSED! Workflows are validated and ready for production.');
    } else {
      console.log('\n⚠️  Some tests failed. Review the detailed results for issues to fix.');
      
      console.log('\n🔥 All Failed Tests:');
      let failureIndex = 1;
      
      if (this.results.validation.errors.length > 0) {
        console.log('   Validation Test Failures:');
        this.results.validation.errors.forEach(error => {
          console.log(`   ${failureIndex}. ${error}`);
          failureIndex++;
        });
      }
      
      if (this.results.integration.errors.length > 0) {
        console.log('   Integration Test Failures:');
        this.results.integration.errors.forEach(error => {
          console.log(`   ${failureIndex}. ${error}`);
          failureIndex++;
        });
      }
    }
    
    console.log('\n📁 Test artifacts:');
    console.log('   - tests/workflow-validation-results.json');
    console.log('   - tests/integration-test-results.json');
    console.log('   - tests/comprehensive-test-results.json');
    
    console.log('\n' + '=' .repeat(80));
  }

  saveResults() {
    this.results.generated_at = new Date().toISOString();
    this.results.test_runner_version = '1.0.0';
    
    fs.writeFileSync('tests/comprehensive-test-results.json', JSON.stringify(this.results, null, 2));
  }

  async run() {
    console.log('🚀 Starting Comprehensive Workflow Testing Suite');
    console.log('Testing GitHub Actions workflows for todo-to-issues and file-representations');
    console.log('=' .repeat(80));
    
    const startTime = Date.now();
    
    try {
      const validationSuccess = await this.runValidationTests();
      const integrationSuccess = await this.runIntegrationTests();
      
      this.calculateOverallResults();
      this.saveResults();
      this.printSummary();
      
      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      
      console.log(`⏱️  Total execution time: ${duration}s`);
      
      // Exit with appropriate code
      const overallSuccess = validationSuccess && integrationSuccess;
      process.exit(overallSuccess ? 0 : 1);
      
    } catch (error) {
      console.error('\n💥 Test runner encountered an error:');
      console.error(error.message);
      console.error(error.stack);
      process.exit(1);
    }
  }
}

// Run comprehensive tests if this file is executed directly
if (require.main === module) {
  const runner = new TestRunner();
  runner.run();
}

module.exports = TestRunner;