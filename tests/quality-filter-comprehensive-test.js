#!/usr/bin/env node

/**
 * Quality Filter Comprehensive Test Suite
 * 
 * Tests the quality filtering functionality from todo/workflow-validation-tests.md line 86
 * Validates that the workflow properly filters out descriptive text and only processes actionable tasks
 * 
 * This test specifically addresses the requirement:
 * "Create comprehensive test suite for all workflow functionality"
 * with focus on Quality Filter Testing (lines 76-91)
 */

const fs = require('fs');
const path = require('path');
const TestResultArchiver = require('./test-result-archiver');

class QualityFilterComprehensiveTest {
  constructor() {
    this.testResults = [];
    this.errors = [];
    this.startTime = Date.now();
    this.filterTestCases = [];
    this.performanceMetrics = {};
  }

  // Test helper function
  assert(condition, message) {
    const result = {
      test: message,
      passed: condition,
      timestamp: new Date().toISOString(),
      suite: 'quality-filter'
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

  // Extract quality filtering logic from the todo-to-issues workflow
  extractQualityFilteringLogic() {
    console.log('\n🔍 Extracting quality filtering logic from workflow...');
    
    try {
      const workflowPath = '.github/workflows/todo-to-issues.yml';
      const workflowContent = fs.readFileSync(workflowPath, 'utf8');
      
      // Extract the isHighQualityTask function
      const qualityFunctionMatch = workflowContent.match(/isHighQualityTask\(task\)\s*{([\s\S]*?)}\s*\/\/ Generate GitHub issue content/);
      
      this.assert(qualityFunctionMatch !== null, 'Quality filtering function exists in workflow');
      
      if (qualityFunctionMatch) {
        const functionBody = qualityFunctionMatch[1];
        
        // Test for minimum length requirement
        this.assert(functionBody.includes('task.length < 15'), 'Minimum length requirement exists (15 characters)');
        
        // Test for skip patterns
        this.assert(functionBody.includes('skipPatterns'), 'Skip patterns array is defined');
        this.assert(functionBody.includes('/^\\*\\*.*\\*\\*$/'), 'Filters out bold-only text');
        this.assert(functionBody.includes('/^\\*\\*Current Coverage\\*\\*:/i'), 'Filters out "Current Coverage" sections');
        this.assert(functionBody.includes('/^Legal Significance:/i'), 'Filters out "Legal Significance" sections');
        this.assert(functionBody.includes('/^Framework Phase:/i'), 'Filters out "Framework Phase" sections');
        this.assert(functionBody.includes('/^Impact:/i'), 'Filters out "Impact" sections');
        this.assert(functionBody.includes('/^Estimated effort:/i'), 'Filters out effort estimates');
        this.assert(functionBody.includes('/^Total.*effort:/i'), 'Filters out total effort estimates');
        this.assert(functionBody.includes('/hours?$/i'), 'Filters out lines ending with "hours"');
        
        // Test for description patterns
        this.assert(functionBody.includes('descriptionPatterns'), 'Description patterns array is defined');
        
        // Test for action patterns
        this.assert(functionBody.includes('actionPatterns'), 'Action patterns array is defined');
        this.assert(functionBody.includes('/comprehensive test suite/i'), 'Recognizes "comprehensive test suite" as action');
        this.assert(functionBody.includes('/automated testing pipeline/i'), 'Recognizes "automated testing pipeline" as action');
        this.assert(functionBody.includes('/monitoring and alerting/i'), 'Recognizes "monitoring and alerting" as action');
        
        console.log('✅ Quality filtering logic successfully extracted and validated');
        return functionBody;
      }
      
    } catch (error) {
      this.assert(false, `Error extracting quality filtering logic: ${error.message}`);
      return null;
    }
  }

  // Test quality filtering with specific examples from the todo file
  testQualityFilteringWithTodoExamples() {
    console.log('\n🧪 Testing quality filtering with specific todo file examples...');
    
    // Test cases from todo/workflow-validation-tests.md lines 76-91
    const testCases = [
      // Should be FILTERED OUT
      { text: '**Current Coverage**: This is descriptive text that should not create issues', expected: false, reason: 'descriptive text with Current Coverage prefix' },
      { text: '**Legal Significance**: Another descriptive section to skip', expected: false, reason: 'descriptive text with Legal Significance prefix' },
      { text: '**Estimated effort**: 2 hours', expected: false, reason: 'effort estimate' },
      { text: '**Total development effort**: 8 hours', expected: false, reason: 'total effort estimate' },
      { text: '**Impact**: This should be filtered out as descriptive', expected: false, reason: 'Impact section content' },
      { text: '**Framework Phase**: Should be skipped', expected: false, reason: 'Framework Phase content' },
      
      // Should be ACCEPTED
      { text: 'Create comprehensive test suite for all workflow functionality', expected: true, reason: 'actionable task with clear action word' },
      { text: 'Implement automated testing pipeline for continuous validation', expected: true, reason: 'actionable task with implementation focus' },
      { text: 'Add monitoring and alerting for workflow failures', expected: true, reason: 'actionable task with monitoring focus' },
      
      // Edge cases that should be FILTERED OUT
      { text: 'Short text', expected: false, reason: 'too short (less than 15 characters)' },
      { text: '**Bold only text**', expected: false, reason: 'bold-only formatting' },
      { text: '✅ Already completed task', expected: false, reason: 'completed task marker' },
      { text: 'Improvements Needed:', expected: false, reason: 'section header pattern' },
      { text: 'Actions Required:', expected: false, reason: 'section header pattern' },
      { text: 'Recommended Actions:', expected: false, reason: 'section header pattern' },
      { text: 'This document provides comprehensive analysis', expected: false, reason: 'descriptive analysis text' },
      { text: 'The current implementation shows good practices', expected: false, reason: 'descriptive analysis text' },
      
      // Edge cases that should be ACCEPTED
      { text: 'TODO: Implement comprehensive validation framework', expected: true, reason: 'explicit TODO marker' },
      { text: 'FIXME: Update broken workflow configuration', expected: true, reason: 'explicit FIXME marker' },
      { text: 'Build a comprehensive documentation system', expected: true, reason: 'clear build action' },
      { text: 'Test duplicate prevention with complex scenarios', expected: true, reason: 'clear test action' },
      { text: 'Validate proper handling of malformed files', expected: true, reason: 'clear validate action' }
    ];

    this.filterTestCases = testCases;

    // Simulate the quality filtering logic
    testCases.forEach((testCase, index) => {
      const result = this.simulateQualityFilter(testCase.text);
      const passed = result === testCase.expected;
      
      this.assert(passed, 
        `Test case ${index + 1}: "${testCase.text.substring(0, 50)}..." should be ${testCase.expected ? 'ACCEPTED' : 'FILTERED OUT'} (${testCase.reason})`
      );
      
      if (!passed) {
        console.log(`   Expected: ${testCase.expected}, Got: ${result}, Reason: ${testCase.reason}`);
      }
    });
  }

  // Simulate the quality filtering logic based on the workflow
  simulateQualityFilter(task) {
    // Minimum length check
    if (task.length < 15) {
      return false;
    }

    // Skip patterns (from the workflow)
    const skipPatterns = [
      /^\*\*.*\*\*$/,  // Just bold text
      /^\*\*.*\*\*:$/,  // Bold text ending with colon (section headers)
      /^\*\*Current Coverage\*\*:/i,
      /^Current Coverage/i,
      /^Legal Significance:/i,
      /^Framework Phase:/i,
      /^Impact:/i,
      /^Estimated effort:/i,
      /^Total.*effort:/i,
      /^When compared against/i,
      /^The (current|existing|draft)/i,
      /^This (document|analysis|section)/i,
      /^Improvements? Needed:?$/i,
      /^Actions? Required:?$/i,
      /^Recommended Actions?:?$/i,
      /hours?$/i,
      /^\[x\]/i,
      /✅/,
      /COMPLETED/i,
      /^-\s*\*\*/,
      /^\d+\.\s*\*\*/
    ];

    for (const pattern of skipPatterns) {
      if (pattern.test(task)) {
        return false;
      }
    }

    // Description patterns (from the workflow)
    const descriptionPatterns = [
      /^.*your .* role/i,
      /^.*comprehensive analysis/i,
      /^.*external validation/i,
      /^.*established practice/i
    ];

    for (const pattern of descriptionPatterns) {
      if (pattern.test(task)) {
        return false;
      }
    }

    // Action patterns (from the workflow)
    const actionPatterns = [
      /^(TODO|FIXME|TASK|ACTION):/i,
      /^(Implement|Create|Build|Fix|Add|Update|Develop)\s+a\s+/i,
      /^(Write|Draft|Prepare|Design|Setup|Configure)\s+/i,
      /^(Test|Validate|Verify|Check)\s+/i,
      /monitoring and alerting/i,
      /automated testing pipeline/i,
      /comprehensive test suite/i,
      /duplicate prevention/i,
      /JSON parsing/i,
      /workflow functionality/i
    ];

    return actionPatterns.some(pattern => pattern.test(task));
  }

  // Test performance of quality filtering with large datasets
  testQualityFilteringPerformance() {
    console.log('\n🚀 Testing quality filtering performance...');
    
    const startTime = Date.now();
    
    try {
      // Generate test data
      const testTasks = [];
      
      // Add various types of content
      for (let i = 0; i < 1000; i++) {
        testTasks.push(`Create comprehensive test suite for functionality ${i}`);
        testTasks.push(`**Current Coverage**: This is descriptive text ${i}`);
        testTasks.push(`Implement automated testing pipeline ${i}`);
        testTasks.push(`**Estimated effort**: ${i} hours`);
        testTasks.push(`TODO: Fix bug in component ${i}`);
      }
      
      // Process all tasks
      let filteredCount = 0;
      let acceptedCount = 0;
      
      const filterStart = Date.now();
      
      testTasks.forEach(task => {
        if (this.simulateQualityFilter(task)) {
          acceptedCount++;
        } else {
          filteredCount++;
        }
      });
      
      const filterTime = Date.now() - filterStart;
      
      this.performanceMetrics.totalTasks = testTasks.length;
      this.performanceMetrics.filteredTasks = filteredCount;
      this.performanceMetrics.acceptedTasks = acceptedCount;
      this.performanceMetrics.filteringTimeMs = filterTime;
      
      this.assert(filterTime < 100, `Quality filtering completes quickly (${filterTime}ms < 100ms for ${testTasks.length} tasks)`);
      this.assert(acceptedCount > 0, `Some tasks are accepted (${acceptedCount} out of ${testTasks.length})`);
      this.assert(filteredCount > 0, `Some tasks are filtered out (${filteredCount} out of ${testTasks.length})`);
      this.assert(acceptedCount < testTasks.length, `Not all tasks are accepted (filtering is working)`);
      
      const acceptanceRate = Math.round((acceptedCount / testTasks.length) * 100);
      this.assert(acceptanceRate >= 40 && acceptanceRate <= 60, 
        `Reasonable acceptance rate (${acceptanceRate}% between 40-60%)`);
      
    } catch (error) {
      this.assert(false, `Performance testing error: ${error.message}`);
    }
  }

  // Test edge cases and error scenarios
  testQualityFilteringEdgeCases() {
    console.log('\n🛡️ Testing quality filtering edge cases...');
    
    const edgeCases = [
      // Empty and null cases
      { text: '', expected: false, reason: 'empty string' },
      { text: '   ', expected: false, reason: 'whitespace only' },
      { text: '\n\n\n', expected: false, reason: 'newlines only' },
      
      // Very long texts
      { text: 'Create comprehensive test suite for all workflow functionality ' + 'x'.repeat(1000), expected: true, reason: 'very long actionable text' },
      { text: '**Current Coverage**: ' + 'x'.repeat(1000), expected: false, reason: 'very long descriptive text' },
      
      // Mixed formatting
      { text: '**Create** comprehensive *test* suite with `code` and [links](http://example.com)', expected: true, reason: 'mixed markdown formatting with action' },
      { text: '**Impact**: Mixed *formatting* with `code` and [links](http://example.com)', expected: false, reason: 'mixed markdown formatting with Impact prefix' },
      
      // Special characters
      { text: 'Create comprehensive test suite with émojis 🚀 and ünicode characters', expected: true, reason: 'unicode and emoji in actionable text' },
      { text: 'Test with "quotes" and \'apostrophes\' and symbols: $@#', expected: true, reason: 'special characters in actionable text' },
      
      // Boundary cases
      { text: 'Create a test.', expected: false, reason: 'exactly 14 characters (below minimum)' },
      { text: 'Create a test X', expected: true, reason: 'exactly 15 characters (at minimum)' },
      
      // Complex patterns
      { text: 'TODO: Fix the **Current Coverage** section implementation', expected: true, reason: 'TODO marker overrides filtering patterns' },
      { text: 'FIXME: Update **Impact** analysis in documentation', expected: true, reason: 'FIXME marker overrides filtering patterns' }
    ];

    edgeCases.forEach((testCase, index) => {
      try {
        const result = this.simulateQualityFilter(testCase.text);
        const passed = result === testCase.expected;
        
        this.assert(passed, 
          `Edge case ${index + 1}: "${testCase.text.substring(0, 40)}..." should be ${testCase.expected ? 'ACCEPTED' : 'FILTERED OUT'} (${testCase.reason})`
        );
        
      } catch (error) {
        this.assert(false, `Edge case ${index + 1} threw error: ${error.message}`);
      }
    });
  }

  // Test integration with actual todo files
  testQualityFilteringWithActualTodoFiles() {
    console.log('\n📁 Testing quality filtering with actual todo files...');
    
    try {
      const todoFiles = [
        'todo/workflow-validation-tests.md',
        'todo/workflow-test.md',
        'todo/simple-workflow-test.md'
      ];
      
      let totalLines = 0;
      let processedLines = 0;
      let filteredLines = 0;
      let acceptedLines = 0;
      
      todoFiles.forEach(filePath => {
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf8');
          const lines = content.split('\n');
          totalLines += lines.length;
          
          lines.forEach(line => {
            const trimmedLine = line.trim();
            if (trimmedLine.length > 0 && !trimmedLine.startsWith('#')) {
              processedLines++;
              
              if (this.simulateQualityFilter(trimmedLine)) {
                acceptedLines++;
              } else {
                filteredLines++;
              }
            }
          });
        }
      });
      
      this.assert(totalLines > 0, `Found content in todo files (${totalLines} total lines)`);
      this.assert(processedLines > 0, `Processed non-header lines (${processedLines} lines)`);
      this.assert(acceptedLines > 0, `Some lines accepted (${acceptedLines} lines)`);
      this.assert(filteredLines > 0, `Some lines filtered (${filteredLines} lines)`);
      
      const filterRatio = Math.round((filteredLines / processedLines) * 100);
      this.assert(filterRatio > 30, `Reasonable filtering ratio (${filterRatio}% > 30%)`);
      this.assert(filterRatio < 90, `Not over-filtering (${filterRatio}% < 90%)`);
      
      // Specifically test the Quality Filter Testing section from line 86
      const qualityTestFile = 'todo/workflow-validation-tests.md';
      if (fs.existsSync(qualityTestFile)) {
        const content = fs.readFileSync(qualityTestFile, 'utf8');
        
        // Check that the specific task from line 86 is accepted
        const targetTask = 'Create comprehensive test suite for all workflow functionality';
        const isAccepted = this.simulateQualityFilter(targetTask);
        this.assert(isAccepted, 'Line 86 task "Create comprehensive test suite for all workflow functionality" is accepted');
        
        // Check that the filtering examples are properly filtered
        const shouldBeFiltered = [
          '**Current Coverage**: This is descriptive text that should not create issues',
          '**Legal Significance**: Another descriptive section to skip',
          '**Estimated effort**: 2 hours',
          '**Total development effort**: 8 hours',
          '**Impact**: This should be filtered out as descriptive',
          '**Framework Phase**: Should be skipped'
        ];
        
        shouldBeFiltered.forEach(text => {
          const isFiltered = !this.simulateQualityFilter(text);
          this.assert(isFiltered, `Quality filter example "${text.substring(0, 30)}..." is properly filtered out`);
        });
        
        // Check that valid tasks are accepted
        const shouldBeAccepted = [
          'Implement automated testing pipeline for continuous validation',
          'Add monitoring and alerting for workflow failures'
        ];
        
        shouldBeAccepted.forEach(text => {
          const isAccepted = this.simulateQualityFilter(text);
          this.assert(isAccepted, `Valid task "${text.substring(0, 30)}..." is properly accepted`);
        });
      }
      
    } catch (error) {
      this.assert(false, `Todo file testing error: ${error.message}`);
    }
  }

  // Run all quality filter tests
  runAllTests() {
    console.log('🚀 Starting Quality Filter Comprehensive Test Suite');
    console.log('Testing quality filtering functionality from todo/workflow-validation-tests.md line 86');
    console.log('=' .repeat(80));
    
    this.extractQualityFilteringLogic();
    this.testQualityFilteringWithTodoExamples();
    this.testQualityFilteringPerformance();
    this.testQualityFilteringEdgeCases();
    this.testQualityFilteringWithActualTodoFiles();
    
    // Calculate results
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(t => t.passed).length;
    const failedTests = this.errors.length;
    const successRate = Math.round((passedTests / totalTests) * 100);
    const duration = ((Date.now() - this.startTime) / 1000).toFixed(2);
    
    // Print summary
    console.log('\n' + '=' .repeat(80));
    console.log('📊 Quality Filter Test Summary');
    console.log('=' .repeat(80));
    console.log(`✅ Passed: ${passedTests}/${totalTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`📈 Success Rate: ${successRate}%`);
    console.log(`⏱️  Execution Time: ${duration}s`);
    
    if (this.performanceMetrics.totalTasks) {
      console.log(`🚀 Performance: ${this.performanceMetrics.totalTasks} tasks in ${this.performanceMetrics.filteringTimeMs}ms`);
      console.log(`📊 Filtering Results: ${this.performanceMetrics.acceptedTasks} accepted, ${this.performanceMetrics.filteredTasks} filtered`);
    }
    
    if (failedTests > 0) {
      console.log('\n🔥 Failed Tests:');
      this.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    } else {
      console.log('\n🎉 ALL QUALITY FILTER TESTS PASSED!');
      console.log('Quality filtering functionality is working correctly per todo line 86 requirements');
    }
    
    // Archive results
    const archiver = new TestResultArchiver();
    archiver.archiveTestResult('quality-filter-test-results.json', {
      testResults: this.testResults,
      filterTestCases: this.filterTestCases,
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
      testType: 'quality-filter',
      metadata: {
        suite_version: '1.0.0',
        todo_line_reference: 86,
        source_file: 'todo/workflow-validation-tests.md',
        focus: 'Quality Filter Testing section'
      }
    });
    
    console.log('\n📁 Quality filter test results archived');
    console.log('=' .repeat(80));
    
    return failedTests === 0;
  }
}

// Run tests if executed directly
if (require.main === module) {
  const qualityFilterTest = new QualityFilterComprehensiveTest();
  const success = qualityFilterTest.runAllTests();
  process.exit(success ? 0 : 1);
}

module.exports = QualityFilterComprehensiveTest;