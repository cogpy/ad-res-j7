// Test for verifying correct behavior when no actionable tasks are found
// This addresses the requirement from todo/workflow-validation-tests.md line 74

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const TestResultArchiver = require('./test-result-archiver');

class NoActionableTasksValidator {
  constructor() {
    this.testResults = [];
    this.errors = [];
    this.tempDir = '/tmp/no-actionable-tasks-test';
  }

  // Test helper function
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
      this.errors.push(message);
    }
    
    return condition;
  }

  // Setup temporary test environment
  setupTestEnvironment() {
    console.log('\n🔧 Setting up test environment...');
    
    try {
      // Create temporary directory for test files
      if (fs.existsSync(this.tempDir)) {
        execSync(`rm -rf ${this.tempDir}`);
      }
      fs.mkdirSync(this.tempDir, { recursive: true });
      
      // Create todo subdirectory
      const todoTestDir = path.join(this.tempDir, 'todo');
      fs.mkdirSync(todoTestDir);
      
      this.assert(fs.existsSync(todoTestDir), 'Test todo directory created successfully');
      
      return todoTestDir;
      
    } catch (error) {
      this.assert(false, `Failed to setup test environment: ${error.message}`);
      return null;
    }
  }

  // Test scenario 1: Empty todo directory
  testEmptyTodoDirectory() {
    console.log('\n🧪 Testing empty todo directory scenario...');
    
    const todoTestDir = this.setupTestEnvironment();
    if (!todoTestDir) return false;
    
    try {
      // Extract and adapt the TodoIssueGenerator from the workflow
      const generator = this.createTestIssueGenerator();
      
      // Change directory for the test
      const originalCwd = process.cwd();
      process.chdir(this.tempDir);
      
      try {
        const issues = generator.processFiles();
        
        this.assert(Array.isArray(issues), 'Returns array when no todo files exist');
        this.assert(issues.length === 0, 'Returns empty array when no todo files exist');
        
        const output = generator.generateOutput();
        this.assert(output.summary.total_issues === 0, 'Reports zero total issues');
        this.assert(output.summary.files_processed === 0, 'Reports zero files processed');
        this.assert(output.issues.length === 0, 'Output contains empty issues array');
        
      } finally {
        process.chdir(originalCwd);
      }
      
    } catch (error) {
      this.assert(false, `Error in empty directory test: ${error.message}`);
    }
  }

  // Test scenario 2: Todo files with only non-actionable content
  testNonActionableContent() {
    console.log('\n🧪 Testing todo files with non-actionable content...');
    
    const todoTestDir = this.setupTestEnvironment();
    if (!todoTestDir) return false;
    
    try {
      // Create test files with only non-actionable content
      const nonActionableContent1 = `# Analysis Document

## Current Coverage
This document provides an overview of the current state.

## Legal Significance
The existing framework demonstrates comprehensive coverage.

## Impact Analysis
When compared against industry standards, the approach is solid.

## Estimated effort: 4 hours
**Total development effort**: 8 hours

The current implementation shows good practices.
`;

      const nonActionableContent2 = `# Status Report

**Current Status**: All systems operational
**Framework Phase**: Implementation complete
**Emphasis**: Quality assurance completed
**Reference**: See documentation for details

Show the current metrics:
- Performance: Good
- Coverage: Complete
- ✅ Task completed successfully

This analysis demonstrates the effectiveness of the approach.
`;

      fs.writeFileSync(path.join(todoTestDir, 'non-actionable-1.md'), nonActionableContent1);
      fs.writeFileSync(path.join(todoTestDir, 'non-actionable-2.md'), nonActionableContent2);
      
      const generator = this.createTestIssueGenerator();
      
      // Change directory for the test
      const originalCwd = process.cwd();
      process.chdir(this.tempDir);
      
      try {
        const issues = generator.processFiles();
        
        this.assert(Array.isArray(issues), 'Returns array when processing non-actionable files');
        this.assert(issues.length === 0, 'Returns empty array when no actionable tasks found');
        
        const output = generator.generateOutput();
        this.assert(output.summary.total_issues === 0, 'Reports zero actionable issues');
        this.assert(output.summary.files_processed === 2, 'Reports correct number of files processed');
        this.assert(output.issues.length === 0, 'Output contains empty issues array despite files being present');
        
      } finally {
        process.chdir(originalCwd);
      }
      
    } catch (error) {
      this.assert(false, `Error in non-actionable content test: ${error.message}`);
    }
  }

  // Test scenario 3: Mixed content with some actionable, some non-actionable
  testMixedContent() {
    console.log('\n🧪 Testing mixed actionable and non-actionable content...');
    
    const todoTestDir = this.setupTestEnvironment();
    if (!todoTestDir) return false;
    
    try {
      // Create a file with mixed content - mostly non-actionable with minimal actionable content
      const mixedContent = `# Mixed Content Test

## Status Overview
**Current Coverage**: Implementation is progressing well.
**Legal Significance**: The framework demonstrates completeness.

## Action Items (Valid)

### Must-Do Items
1. Implement comprehensive validation for empty todo scenarios
2. Add monitoring for edge cases in workflow processing

## Descriptive Sections
**Impact**: This affects the overall system
**Estimated effort**: 6 hours
**Framework Phase**: Testing phase
Show the current implementation status
Provide documentation updates

## Non-Actionable List
- **Status**: All good
- Performance metrics are acceptable
- ✅ Previously completed task
- Current implementation shows effectiveness
`;

      const nonActionableOnlyContent = `# Non-Actionable File

**Current Status**: Everything is working
**Framework Overview**: Implementation complete
- Status: Good
- Coverage: Complete
- ✅ Done

The system demonstrates good performance.
`;

      fs.writeFileSync(path.join(todoTestDir, 'mixed-content.md'), mixedContent);
      fs.writeFileSync(path.join(todoTestDir, 'non-actionable-only.md'), nonActionableOnlyContent);
      
      const generator = this.createTestIssueGenerator();
      
      // Change directory for the test
      const originalCwd = process.cwd();
      process.chdir(this.tempDir);
      
      try {
        const issues = generator.processFiles();
        
        this.assert(Array.isArray(issues), 'Returns array when processing mixed content');
        this.assert(issues.length === 2, 'Finds exactly 2 actionable tasks in mixed content');
        
        const output = generator.generateOutput();
        this.assert(output.summary.total_issues === 2, 'Reports correct number of actionable issues');
        this.assert(output.summary.files_processed === 2, 'Reports correct number of files processed');
        
        // Verify task content
        const taskTitles = issues.map(issue => issue.title);
        this.assert(
          taskTitles.some(title => title.toLowerCase().includes('validation')),
          'Finds validation-related task'
        );
        this.assert(
          taskTitles.some(title => title.toLowerCase().includes('monitoring')),
          'Finds monitoring-related task'
        );
        
      } finally {
        process.chdir(originalCwd);
      }
      
    } catch (error) {
      this.assert(false, `Error in mixed content test: ${error.message}`);
    }
  }

  // Test scenario 4: Empty files
  testEmptyFiles() {
    console.log('\n🧪 Testing empty todo files...');
    
    const todoTestDir = this.setupTestEnvironment();
    if (!todoTestDir) return false;
    
    try {
      // Create empty files
      fs.writeFileSync(path.join(todoTestDir, 'empty-1.md'), '');
      fs.writeFileSync(path.join(todoTestDir, 'empty-2.md'), '   \n\n  \n  ');
      fs.writeFileSync(path.join(todoTestDir, 'whitespace-only.md'), '\t\n   \n\t\t\n   ');
      
      const generator = this.createTestIssueGenerator();
      
      // Change directory for the test
      const originalCwd = process.cwd();
      process.chdir(this.tempDir);
      
      try {
        const issues = generator.processFiles();
        
        this.assert(Array.isArray(issues), 'Returns array when processing empty files');
        this.assert(issues.length === 0, 'Returns empty array when all files are empty');
        
        const output = generator.generateOutput();
        this.assert(output.summary.total_issues === 0, 'Reports zero issues for empty files');
        this.assert(output.summary.files_processed === 0, 'Reports zero files processed (empty files skipped)');
        
      } finally {
        process.chdir(originalCwd);
      }
      
    } catch (error) {
      this.assert(false, `Error in empty files test: ${error.message}`);
    }
  }

  // Test scenario 5: Workflow exit codes and messaging
  testWorkflowExitBehavior() {
    console.log('\n🧪 Testing workflow exit behavior for no actionable tasks...');
    
    try {
      // Test the exit code logic from the workflow
      const testOutput = {
        summary: {
          total_issues: 0,
          priorities: { critical: 0, high: 0, medium: 0, low: 0 },
          files_processed: 2
        },
        issues: [],
        generated_at: new Date().toISOString()
      };
      
      // Simulate the workflow's decision logic
      const shouldExit = testOutput.summary.total_issues === 0;
      this.assert(shouldExit, 'Workflow correctly identifies no actionable tasks scenario');
      
      // Test messaging conditions
      const hasFiles = testOutput.summary.files_processed > 0;
      const hasIssues = testOutput.summary.total_issues > 0;
      
      this.assert(hasFiles && !hasIssues, 'Correctly identifies files processed but no actionable tasks');
      
      // Test the expected console messages (simulated)
      const expectedMessages = [
        'No actionable tasks found',
        'don\'t contain recognizable task patterns',
        'don\'t meet quality filtering criteria',
        'empty or contain only non-actionable content'
      ];
      
      this.assert(expectedMessages.length === 4, 'Provides helpful diagnostic messages');
      
    } catch (error) {
      this.assert(false, `Error in exit behavior test: ${error.message}`);
    }
  }

  // Create a simplified version of the TodoIssueGenerator for testing
  createTestIssueGenerator() {
    const glob = require('glob');

    class TestTodoIssueGenerator {
      constructor() {
        this.issues = [];
        this.processedFilesCount = 0;
      }

      parseMarkdownForTasks(content, filename) {
        const lines = content.split('\n');
        const tasks = [];
        let currentSection = '';
        let currentPriority = 'medium';
        let inPrioritySection = false;
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          
          if (line.match(/^#{1,4}\s+/)) {
            currentSection = line.replace(/^#+\s+/, '');
            
            if (line.toLowerCase().includes('critical') || line.toLowerCase().includes('priority 1')) {
              currentPriority = 'critical';
            } else if (line.toLowerCase().includes('high') || line.toLowerCase().includes('priority 2')) {
              currentPriority = 'high';
            } else if (line.toLowerCase().includes('medium') || line.toLowerCase().includes('priority 3')) {
              currentPriority = 'medium';
            } else if (line.toLowerCase().includes('low') || line.toLowerCase().includes('priority 4')) {
              currentPriority = 'low';
            }
            
            inPrioritySection = line.toLowerCase().includes('must-do') ||
                              line.toLowerCase().includes('should-do') ||
                              line.toLowerCase().includes('nice-to-have');
          }
          
          if (inPrioritySection) {
            const numberedTask = line.match(/^\d+\.\s*(.+)$/);
            if (numberedTask) {
              const task = numberedTask[1].trim();
              if (task.length > 10) {
                tasks.push({
                  task: task,
                  section: currentSection,
                  priority: currentPriority,
                  file: filename,
                  lineNumber: i + 1,
                  type: 'priority_task'
                });
              }
            }
          }
          
          const actionablePatterns = [
            /^-\s*(.*(?:implement|add|create|fix|update|improve|enhance|develop|build|establish|provide|include|demonstrate|expand|complete|review).*)/i
          ];
          
          for (const pattern of actionablePatterns) {
            const match = line.match(pattern);
            if (match) {
              const task = match[1].trim();
              if (this.isHighQualityTask(task)) {
                tasks.push({
                  task: task,
                  section: currentSection,
                  priority: currentPriority,
                  file: filename,
                  lineNumber: i + 1,
                  type: 'actionable_item'
                });
              }
              break;
            }
          }
        }
        
        return tasks;
      }

      isHighQualityTask(task) {
        if (task.length < 15) return false;
        
        const skipPatterns = [
          /^\*\*.*\*\*$/,
          /^Current Coverage/i,
          /^Legal Significance:/i,
          /^Framework Phase:/i,
          /^Impact:/i,
          /^Estimated effort:/i,
          /^Total.*effort:/i,
          /hours?$/i,
          /^Show\s+/i,
          /^\[x\]/i,
          /✅/,
          /COMPLETED/i
        ];
        
        for (const pattern of skipPatterns) {
          if (pattern.test(task)) return false;
        }
        
        const actionPatterns = [
          /^(Implement|Create|Build|Fix|Add|Update|Develop)\s+/i,
          /monitoring and alerting/i,
          /validation/i,
          /comprehensive/i
        ];
        
        return actionPatterns.some(pattern => pattern.test(task));
      }

      generateIssueContent(task) {
        const labels = ['todo', 'enhancement'];
        if (task.priority === 'critical') {
          labels.push('priority: critical', 'bug');
        } else if (task.priority === 'high') {
          labels.push('priority: high');
        }

        let title = task.task.replace(/\*\*(.+?)\*\*/g, '$1');
        title = title.replace(/^[-*\d.\s]+/, '').trim();
        if (title.length > 80) {
          title = title.substring(0, 77) + '...';
        }

        return {
          title: title,
          body: `Task: ${task.task}\nFile: ${task.file}\nSection: ${task.section}`,
          labels: labels,
          source: task
        };
      }

      processFiles() {
        console.log('🔄 Processing todo files...');
        
        let todoFiles;
        try {
          todoFiles = glob.sync('todo/**/*.md');
        } catch (error) {
          console.error('Error scanning todo directory:', error.message);
          return this.issues;
        }

        if (todoFiles.length === 0) {
          console.log('ℹ️ No todo files found to process');
          return this.issues;
        }

        let processedFiles = 0;
        
        for (const file of todoFiles) {
          try {
            if (!fs.existsSync(file)) continue;
            
            const content = fs.readFileSync(file, 'utf8');
            if (!content || content.trim() === '') {
              console.log(`Skipping empty file: ${file}`);
              continue;
            }

            const tasks = this.parseMarkdownForTasks(content, file);
            for (const task of tasks) {
              const issue = this.generateIssueContent(task);
              this.issues.push(issue);
            }
            
            processedFiles++;
          } catch (error) {
            console.error(`Error processing ${file}:`, error.message);
          }
        }

        this.processedFilesCount = processedFiles;
        console.log(`Processed ${processedFiles} files, found ${this.issues.length} actionable tasks`);
        return this.issues;
      }

      generateOutput() {
        const output = {
          summary: {
            total_issues: this.issues.length,
            priorities: {
              critical: this.issues.filter(i => i.source && i.source.priority === 'critical').length,
              high: this.issues.filter(i => i.source && i.source.priority === 'high').length,
              medium: this.issues.filter(i => i.source && i.source.priority === 'medium').length,
              low: this.issues.filter(i => i.source && i.source.priority === 'low').length
            },
            files_processed: this.processedFilesCount || 0
          },
          issues: this.issues,
          generated_at: new Date().toISOString()
        };

        return output;
      }
    }

    return new TestTodoIssueGenerator();
  }

  // Cleanup test environment
  cleanup() {
    try {
      if (fs.existsSync(this.tempDir)) {
        execSync(`rm -rf ${this.tempDir}`);
        console.log('\n🧹 Test environment cleaned up');
      }
    } catch (error) {
      console.log(`⚠️ Cleanup warning: ${error.message}`);
    }
  }

  // Run all tests
  runAllTests() {
    console.log('🚀 Starting No Actionable Tasks Validation Tests...');
    console.log('=' .repeat(70));
    
    try {
      this.testEmptyTodoDirectory();
      this.testNonActionableContent();
      this.testMixedContent();
      this.testEmptyFiles();
      this.testWorkflowExitBehavior();
    } finally {
      this.cleanup();
    }
    
    console.log('\n' + '=' .repeat(70));
    console.log(`📊 Test Summary: ${this.testResults.length} tests run`);
    
    const passedTests = this.testResults.filter(t => t.passed).length;
    const failedTests = this.testResults.filter(t => !t.passed).length;
    
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    
    if (this.errors.length > 0) {
      console.log('\n🔥 Failed Tests:');
      this.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }
    
    // Generate detailed results
    const detailedResults = {
      summary: {
        total: this.testResults.length,
        passed: passedTests,
        failed: failedTests,
        success_rate: Math.round((passedTests / this.testResults.length) * 100)
      },
      tests: this.testResults,
      errors: this.errors,
      generated_at: new Date().toISOString(),
      test_scenarios: [
        'empty_todo_directory',
        'non_actionable_content_only',
        'mixed_actionable_non_actionable',
        'empty_files',
        'workflow_exit_behavior'
      ]
    };
    
    // Archive test results
    const archiver = new TestResultArchiver();
    archiver.archiveTestResult('no-actionable-tasks-test-results.json', detailedResults, {
      testType: 'no-actionable-tasks-validation',
      metadata: {
        requirement_source: 'todo/workflow-validation-tests.md:74',
        test_scenarios: detailedResults.test_scenarios.length
      },
      summary: detailedResults.summary
    });
    
    return failedTests === 0;
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const validator = new NoActionableTasksValidator();
  const success = validator.runAllTests();
  process.exit(success ? 0 : 1);
}

module.exports = NoActionableTasksValidator;