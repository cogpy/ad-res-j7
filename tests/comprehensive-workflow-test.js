#!/usr/bin/env node

/**
 * Comprehensive Workflow Test Suite
 * Tests all workflow functionality across the entire repository
 * Provides complete coverage for todo-to-issues, file-representations, and testing workflows
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const TestResultArchiver = require('./test-result-archiver');

class ComprehensiveWorkflowTest {
  constructor() {
    this.testResults = [];
    this.errors = [];
    this.startTime = Date.now();
    this.mockIssues = [];
    this.performanceMetrics = {};
  }

  // Test helper function
  assert(condition, message) {
    const result = {
      test: message,
      passed: condition,
      timestamp: new Date().toISOString(),
      suite: 'comprehensive'
    };
    
    this.testResults.push(result);
    
    if (condition) {
      console.log(`✅ ${message}`);
    } else {
      console.log(`❌ ${message}`);
      this.errors.push(message);
    }
    
    return condition;
  }

  // Performance testing for workflow processing
  testWorkflowPerformance() {
    console.log('\n🚀 Testing workflow performance characteristics...');
    
    const startTime = Date.now();
    
    try {
      // Test todo file processing speed
      const todoFiles = glob.sync('todo/*.md');
      const todoProcessStart = Date.now();
      
      let totalTasks = 0;
      todoFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        const lines = content.split('\n');
        const taskCount = lines.filter(line => 
          line.match(/^\d+\./) || 
          line.match(/^-\s+/) ||
          line.match(/^\*\s+/)
        ).length;
        totalTasks += taskCount;
      });
      
      const todoProcessTime = Date.now() - todoProcessStart;
      this.performanceMetrics.todoProcessingTime = todoProcessTime;
      this.performanceMetrics.totalTasksProcessed = totalTasks;
      
      this.assert(todoProcessTime < 5000, `Todo processing completes in reasonable time (${todoProcessTime}ms < 5000ms)`);
      this.assert(totalTasks > 0, `Found tasks to process (${totalTasks} total)`);
      
      // Test workflow file parsing speed
      const workflowParseStart = Date.now();
      const workflows = glob.sync('.github/workflows/*.yml');
      
      workflows.forEach(workflowFile => {
        const content = fs.readFileSync(workflowFile, 'utf8');
        this.assert(content.length > 100, `Workflow file ${path.basename(workflowFile)} has substantial content`);
      });
      
      const workflowParseTime = Date.now() - workflowParseStart;
      this.performanceMetrics.workflowParsingTime = workflowParseTime;
      
      this.assert(workflowParseTime < 2000, `Workflow parsing completes quickly (${workflowParseTime}ms < 2000ms)`);
      
    } catch (error) {
      this.assert(false, `Performance testing error: ${error.message}`);
    }
  }

  // Test all workflow configurations comprehensively
  testAllWorkflowConfigurations() {
    console.log('\n🔧 Testing all workflow configurations...');
    
    const workflows = [
      { file: 'todo-to-issues.yml', name: 'Todo to Issues Generator' },
      { file: 'file-representations.yml', name: 'File Representation Validator' },
      { file: 'test-workflows.yml', name: 'Automated Testing Pipeline' },
      { file: 'blank.yml', name: 'File Representation Validator' }
    ];
    
    workflows.forEach(workflow => {
      try {
        const workflowPath = `.github/workflows/${workflow.file}`;
        
        if (!fs.existsSync(workflowPath)) {
          this.assert(false, `Workflow file ${workflow.file} exists`);
          return;
        }
        
        const content = fs.readFileSync(workflowPath, 'utf8');
        
        // Test basic workflow structure
        this.assert(content.includes('name:'), `${workflow.file} has name field`);
        this.assert(content.includes('on:'), `${workflow.file} has trigger configuration`);
        this.assert(content.includes('jobs:'), `${workflow.file} has jobs configuration`);
        this.assert(content.includes('runs-on:'), `${workflow.file} specifies runner`);
        
        // Test trigger configurations
        this.assert(content.includes('push:') || content.includes('pull_request:') || content.includes('workflow_dispatch:'), 
                   `${workflow.file} has valid triggers`);
        
        // Test permissions if present
        if (content.includes('permissions:')) {
          this.assert(content.includes('contents:') || content.includes('issues:'), 
                     `${workflow.file} has appropriate permissions`);
        }
        
        // Test steps configuration
        this.assert(content.includes('steps:'), `${workflow.file} has defined steps`);
        this.assert(content.includes('uses:') || content.includes('run:'), 
                   `${workflow.file} has actionable steps`);
        
      } catch (error) {
        this.assert(false, `Error testing ${workflow.file}: ${error.message}`);
      }
    });
  }

  // Test cross-workflow integration scenarios
  testCrossWorkflowIntegration() {
    console.log('\n🔗 Testing cross-workflow integration...');
    
    try {
      // Test that test-workflows.yml can validate other workflows
      const testWorkflowContent = fs.readFileSync('.github/workflows/test-workflows.yml', 'utf8');
      
      this.assert(testWorkflowContent.includes('npm'), 'Test workflow uses npm for testing');
      this.assert(testWorkflowContent.includes('test'), 'Test workflow includes test commands');
      
      // Test that all workflows follow consistent patterns
      const workflows = glob.sync('.github/workflows/*.yml');
      const workflowPatterns = {
        ubuntu: 0,
        checkout: 0,
        node: 0
      };
      
      workflows.forEach(workflowFile => {
        const content = fs.readFileSync(workflowFile, 'utf8');
        if (content.includes('ubuntu-latest')) workflowPatterns.ubuntu++;
        if (content.includes('checkout@')) workflowPatterns.checkout++;
        if (content.includes('node')) workflowPatterns.node++;
      });
      
      this.assert(workflowPatterns.ubuntu >= 3, `Multiple workflows use ubuntu-latest (${workflowPatterns.ubuntu})`);
      this.assert(workflowPatterns.checkout >= 3, `Multiple workflows use checkout action (${workflowPatterns.checkout})`);
      
    } catch (error) {
      this.assert(false, `Cross-workflow integration test error: ${error.message}`);
    }
  }

  // Test security aspects of workflows
  testWorkflowSecurity() {
    console.log('\n🔒 Testing workflow security configurations...');
    
    try {
      const workflows = glob.sync('.github/workflows/*.yml');
      
      workflows.forEach(workflowFile => {
        const content = fs.readFileSync(workflowFile, 'utf8');
        const filename = path.basename(workflowFile);
        
        // Test for secure token usage
        if (content.includes('${{ secrets.')) {
          this.assert(content.includes('secrets.GITHUB_TOKEN'), 
                     `${filename} uses secure token references`);
        }
        
        // Test for proper permission scoping
        if (content.includes('permissions:')) {
          this.assert(!content.includes('write: all') && !content.includes('read: all'), 
                     `${filename} doesn't use overly broad permissions`);
        }
        
        // Test for input validation
        if (content.includes('inputs:')) {
          this.assert(content.includes('required:') || content.includes('default:'), 
                     `${filename} properly validates inputs`);
        }
        
        // Test against common security issues
        this.assert(!content.includes('curl | bash'), `${filename} doesn't use dangerous piped commands`);
        this.assert(!content.includes('wget | sh'), `${filename} doesn't use dangerous wget patterns`);
      });
      
    } catch (error) {
      this.assert(false, `Security testing error: ${error.message}`);
    }
  }

  // Test error handling and resilience
  testWorkflowResilience() {
    console.log('\n🛡️ Testing workflow error handling and resilience...');
    
    try {
      // Test todo-to-issues workflow error handling
      const todoWorkflow = fs.readFileSync('.github/workflows/todo-to-issues.yml', 'utf8');
      
      this.assert(todoWorkflow.includes('if:'), 'Todo workflow has conditional execution');
      this.assert(todoWorkflow.includes('try {') || todoWorkflow.includes('catch'), 
                 'Todo workflow has error handling');
      this.assert(todoWorkflow.includes('process.exit'), 'Todo workflow has explicit exit handling');
      
      // Test file-representations workflow resilience
      const fileRepWorkflow = fs.readFileSync('.github/workflows/file-representations.yml', 'utf8');
      
      this.assert(fileRepWorkflow.includes('continue-on-error') || fileRepWorkflow.includes('if:'), 
                 'File-rep workflow has error resilience');
      
      // Test test-workflows resilience
      const testWorkflow = fs.readFileSync('.github/workflows/test-workflows.yml', 'utf8');
      
      this.assert(testWorkflow.includes('exit'), 'Test workflow has proper exit handling');
      
    } catch (error) {
      this.assert(false, `Resilience testing error: ${error.message}`);
    }
  }

  // Test workflow documentation and maintainability  
  testWorkflowMaintainability() {
    console.log('\n📚 Testing workflow documentation and maintainability...');
    
    try {
      const workflows = glob.sync('.github/workflows/*.yml');
      
      workflows.forEach(workflowFile => {
        const content = fs.readFileSync(workflowFile, 'utf8');
        const filename = path.basename(workflowFile);
        
        // Test for documentation
        this.assert(content.includes('#'), `${filename} includes comments`);
        this.assert(content.split('\n').length > 20, `${filename} has substantial implementation`);
        
        // Test for maintainable structure
        const lines = content.split('\n');
        const commentLines = lines.filter(line => line.trim().startsWith('#')).length;
        const codeLines = lines.filter(line => line.trim() && !line.trim().startsWith('#')).length;
        
        if (codeLines > 50) {
          this.assert(commentLines >= codeLines * 0.1, 
                     `${filename} has adequate documentation ratio (${commentLines}/${codeLines})`);
        }
        
        // Test for version pinning
        if (content.includes('uses:')) {
          this.assert(content.includes('@v4') || content.includes('@v3'), 
                     `${filename} uses pinned action versions`);
        }
      });
      
    } catch (error) {
      this.assert(false, `Maintainability testing error: ${error.message}`);
    }
  }

  // Test workflow outputs and artifacts
  testWorkflowOutputs() {
    console.log('\n📤 Testing workflow outputs and artifacts...');
    
    try {
      // Test todo-to-issues outputs
      const todoWorkflow = fs.readFileSync('.github/workflows/todo-to-issues.yml', 'utf8');
      
      this.assert(todoWorkflow.includes('GITHUB_STEP_SUMMARY'), 
                 'Todo workflow generates step summary');
      this.assert(todoWorkflow.includes('echo'), 'Todo workflow produces output');
      
      // Test file-representations outputs
      const fileRepWorkflow = fs.readFileSync('.github/workflows/file-representations.yml', 'utf8');
      
      this.assert(fileRepWorkflow.includes('git add') || fileRepWorkflow.includes('commit'), 
                 'File-rep workflow commits changes');
      
      // Test test workflow outputs
      const testWorkflow = fs.readFileSync('.github/workflows/test-workflows.yml', 'utf8');
      
      this.assert(testWorkflow.includes('test') && testWorkflow.includes('npm'), 
                 'Test workflow runs and reports test results');
      
      // Check for proper artifact handling
      const testDirExists = fs.existsSync('test-data');
      this.assert(testDirExists, 'Test artifacts directory exists');
      
      if (testDirExists) {
        const latestExists = fs.existsSync('test-data/latest');
        const archivesExists = fs.existsSync('test-data/archives');
        
        this.assert(latestExists, 'Latest test results directory exists');
        this.assert(archivesExists, 'Test archives directory exists');
      }
      
    } catch (error) {
      this.assert(false, `Output testing error: ${error.message}`);
    }
  }

  // Run comprehensive test suite
  runAllTests() {
    console.log('🚀 Starting Comprehensive Workflow Test Suite');
    console.log('Testing ALL workflow functionality across the entire repository');
    console.log('=' .repeat(80));
    
    this.testWorkflowPerformance();
    this.testAllWorkflowConfigurations();
    this.testCrossWorkflowIntegration();
    this.testWorkflowSecurity();
    this.testWorkflowResilience();
    this.testWorkflowMaintainability();
    this.testWorkflowOutputs();
    
    // Calculate results
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(t => t.passed).length;
    const failedTests = this.errors.length;
    const successRate = Math.round((passedTests / totalTests) * 100);
    const duration = ((Date.now() - this.startTime) / 1000).toFixed(2);
    
    // Print summary
    console.log('\n' + '=' .repeat(80));
    console.log('📊 Comprehensive Workflow Test Summary');
    console.log('=' .repeat(80));
    console.log(`✅ Passed: ${passedTests}/${totalTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`📈 Success Rate: ${successRate}%`);
    console.log(`⏱️  Execution Time: ${duration}s`);
    
    if (this.performanceMetrics.todoProcessingTime) {
      console.log(`🚀 Todo Processing: ${this.performanceMetrics.todoProcessingTime}ms`);
      console.log(`📋 Tasks Processed: ${this.performanceMetrics.totalTasksProcessed}`);
    }
    
    if (failedTests > 0) {
      console.log('\n🔥 Failed Tests:');
      this.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    } else {
      console.log('\n🎉 ALL COMPREHENSIVE TESTS PASSED!');
    }
    
    // Archive results
    const archiver = new TestResultArchiver();
    archiver.archiveTestResult('comprehensive-workflow-results.json', {
      testResults: this.testResults,
      performanceMetrics: this.performanceMetrics,
      summary: {
        total: totalTests,
        passed: passedTests,
        failed: failedTests,
        success_rate: successRate,
        duration: duration
      },
      generated_at: new Date().toISOString()
    }, {
      testType: 'comprehensive-workflow',
      metadata: {
        suite_version: '1.0.0',
        performance_tested: true,
        security_tested: true,
        cross_workflow_tested: true
      }
    });
    
    console.log('\n📁 Comprehensive test results archived');
    console.log('=' .repeat(80));
    
    return failedTests === 0;
  }
}

// Run tests if executed directly
if (require.main === module) {
  const comprehensiveTest = new ComprehensiveWorkflowTest();
  const success = comprehensiveTest.runAllTests();
  process.exit(success ? 0 : 1);
}

module.exports = ComprehensiveWorkflowTest;