#!/usr/bin/env node

// Comprehensive Test Runner for Workflow Validation
// Runs all validation and integration tests

const WorkflowValidator = require('./workflow-validation.test.js');
const WorkflowIntegrationTest = require('./integration-test.js');
const ComprehensiveWorkflowTest = require('./comprehensive-workflow-test.js');
const SecurityValidationTest = require('./security-validation-test.js');
const EndToEndWorkflowTest = require('./end-to-end-workflow-test.js');
const fs = require('fs');
const TestResultArchiver = require('./test-result-archiver');

class TestRunner {
  constructor() {
    this.results = {
      validation: null,
      integration: null,
      comprehensive: null,
      security: null,
      endToEnd: null,
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

  async runComprehensiveTests() {
    console.log('\n📋 Running Comprehensive Workflow Tests...\n');
    
    const comprehensiveTest = new ComprehensiveWorkflowTest();
    const success = comprehensiveTest.runAllTests();
    
    this.results.comprehensive = {
      success: success,
      total: comprehensiveTest.testResults.length,
      passed: comprehensiveTest.testResults.filter(t => t.passed).length,
      failed: comprehensiveTest.testResults.filter(t => !t.passed).length,
      errors: comprehensiveTest.errors,
      performance_metrics: comprehensiveTest.performanceMetrics
    };
    
    return success;
  }

  async runSecurityTests() {
    console.log('\n📋 Running Security Validation Tests...\n');
    
    const securityTest = new SecurityValidationTest();
    const success = securityTest.runAllTests();
    
    this.results.security = {
      success: success,
      total: securityTest.testResults.length,
      passed: securityTest.testResults.filter(t => t.passed).length,
      failed: securityTest.testResults.filter(t => !t.passed).length,
      errors: securityTest.errors,
      security_findings: securityTest.securityFindings.length,
      critical_findings: securityTest.securityFindings.filter(f => f.severity === 'critical').length
    };
    
    return success;
  }

  async runEndToEndTests() {
    console.log('\n📋 Running End-to-End Workflow Tests...\n');
    
    const endToEndTest = new EndToEndWorkflowTest();
    const success = endToEndTest.runAllTests();
    
    this.results.endToEnd = {
      success: success,
      total: endToEndTest.testResults.length,
      passed: endToEndTest.testResults.filter(t => t.passed).length,
      failed: endToEndTest.testResults.filter(t => !t.passed).length,
      errors: endToEndTest.errors,
      simulated_issues: endToEndTest.simulatedIssues.length,
      workflow_steps: endToEndTest.workflowSteps.length
    };
    
    return success;
  }

  calculateOverallResults() {
    this.results.overall.total_tests = this.results.validation.total + 
                                       this.results.integration.total + 
                                       this.results.comprehensive.total + 
                                       this.results.security.total + 
                                       this.results.endToEnd.total;
    
    this.results.overall.passed_tests = this.results.validation.passed + 
                                        this.results.integration.passed + 
                                        this.results.comprehensive.passed + 
                                        this.results.security.passed + 
                                        this.results.endToEnd.passed;
    
    this.results.overall.failed_tests = this.results.validation.failed + 
                                        this.results.integration.failed + 
                                        this.results.comprehensive.failed + 
                                        this.results.security.failed + 
                                        this.results.endToEnd.failed;
    
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
    
    console.log('\n📋 Comprehensive Tests:');
    console.log(`   ✅ Passed: ${this.results.comprehensive.passed}/${this.results.comprehensive.total}`);
    console.log(`   ❌ Failed: ${this.results.comprehensive.failed}`);
    console.log(`   📈 Success Rate: ${Math.round((this.results.comprehensive.passed / this.results.comprehensive.total) * 100)}%`);
    
    console.log('\n🔒 Security Tests:');
    console.log(`   ✅ Passed: ${this.results.security.passed}/${this.results.security.total}`);
    console.log(`   ❌ Failed: ${this.results.security.failed}`);
    console.log(`   📈 Success Rate: ${Math.round((this.results.security.passed / this.results.security.total) * 100)}%`);
    console.log(`   🚨 Security Findings: ${this.results.security.security_findings}`);
    
    console.log('\n🎯 End-to-End Tests:');
    console.log(`   ✅ Passed: ${this.results.endToEnd.passed}/${this.results.endToEnd.total}`);
    console.log(`   ❌ Failed: ${this.results.endToEnd.failed}`);
    console.log(`   📈 Success Rate: ${Math.round((this.results.endToEnd.passed / this.results.endToEnd.total) * 100)}%`);
    console.log(`   🔄 Simulated Issues: ${this.results.endToEnd.simulated_issues}`);
    
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
      
      if (this.results.comprehensive.errors.length > 0) {
        console.log('   Comprehensive Test Failures:');
        this.results.comprehensive.errors.forEach(error => {
          console.log(`   ${failureIndex}. ${error}`);
          failureIndex++;
        });
      }
      
      if (this.results.security.errors.length > 0) {
        console.log('   Security Test Failures:');
        this.results.security.errors.forEach(error => {
          console.log(`   ${failureIndex}. ${error}`);
          failureIndex++;
        });
      }
      
      if (this.results.endToEnd.errors.length > 0) {
        console.log('   End-to-End Test Failures:');
        this.results.endToEnd.errors.forEach(error => {
          console.log(`   ${failureIndex}. ${error}`);
          failureIndex++;
        });
      }
    }
    
    console.log('\n📁 Test artifacts are archived in:');
    console.log('   - test-data/latest/ (most recent results)');
    console.log('   - test-data/archives/ (timestamped archives)');
    console.log('   - tests/ (backward compatibility copies)');
    
    console.log('\n' + '=' .repeat(80));
  }

  saveResults() {
    this.results.generated_at = new Date().toISOString();
    this.results.test_runner_version = '1.0.0';
    
    // Archive comprehensive test results to prevent merge conflicts
    const archiver = new TestResultArchiver();
    archiver.archiveTestResult('comprehensive-test-results.json', this.results, {
      testType: 'comprehensive-test',
      metadata: {
        runner_version: '1.0.0',
        test_suites: ['validation', 'integration', 'comprehensive', 'security', 'end-to-end']
      },
      summary: this.results.overall
    });
  }

  async run() {
    console.log('🚀 Starting Comprehensive Workflow Testing Suite');
    console.log('Testing GitHub Actions workflows for todo-to-issues and file-representations');
    console.log('=' .repeat(80));
    
    const startTime = Date.now();
    
    try {
      const validationSuccess = await this.runValidationTests();
      const integrationSuccess = await this.runIntegrationTests();
      const comprehensiveSuccess = await this.runComprehensiveTests();
      const securitySuccess = await this.runSecurityTests();
      const endToEndSuccess = await this.runEndToEndTests();
      
      this.calculateOverallResults();
      this.saveResults();
      this.printSummary();
      
      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      
      console.log(`⏱️  Total execution time: ${duration}s`);
      
      // Exit with appropriate code
      const overallSuccess = validationSuccess && integrationSuccess && comprehensiveSuccess && securitySuccess && endToEndSuccess;
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