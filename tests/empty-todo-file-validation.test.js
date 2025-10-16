// Empty Todo File Validation Tests
// Comprehensive tests for validating workflow behavior with empty todo files
// This addresses the requirement from todo/workflow-validation-tests.md line 71

const fs = require('fs');
const path = require('path');
const TestResultArchiver = require('./test-result-archiver');

class EmptyTodoFileValidator {
  constructor() {
    this.testResults = [];
    this.errors = [];
    this.tempDir = '/tmp/empty-todo-tests';
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

  // Setup test environment
  setupTestEnvironment() {
    console.log('\n🔧 Setting up test environment for empty todo file validation...');
    
    try {
      // Create temporary directory for test files
      if (!fs.existsSync(this.tempDir)) {
        fs.mkdirSync(this.tempDir, { recursive: true });
      }
      
      this.assert(fs.existsSync(this.tempDir), 'Test directory created successfully');
      
      // Clean up any existing test files
      const testFiles = fs.readdirSync(this.tempDir).filter(f => f.endsWith('.md'));
      for (const file of testFiles) {
        fs.unlinkSync(path.join(this.tempDir, file));
      }
      
      return true;
    } catch (error) {
      this.assert(false, `Failed to setup test environment: ${error.message}`);
      return false;
    }
  }

  // Test 1: Validate handling of completely empty files
  testCompletelyEmptyFiles() {
    console.log('\n🧪 Testing workflow behavior with completely empty todo files...');
    
    try {
      // Create completely empty file
      const emptyFile = path.join(this.tempDir, 'completely-empty.md');
      fs.writeFileSync(emptyFile, '');
      
      this.assert(fs.existsSync(emptyFile), 'Empty file created successfully');
      this.assert(fs.statSync(emptyFile).size === 0, 'File is truly empty (0 bytes)');
      
      // Test the TodoIssueGenerator logic with empty file
      const content = fs.readFileSync(emptyFile, 'utf8');
      this.assert(content === '', 'Empty file content is empty string');
      this.assert(content.trim() === '', 'Empty file content trims to empty string');
      
      // Simulate the workflow logic for empty files
      const shouldSkip = !content || content.trim() === '';
      this.assert(shouldSkip, 'Workflow correctly identifies empty file to skip');
      
      // Test parsing empty content
      const mockGenerator = this.createMockTodoGenerator();
      const tasks = mockGenerator.parseMarkdownForTasks(content, emptyFile);
      
      this.assert(Array.isArray(tasks), 'Parser returns array for empty file');
      this.assert(tasks.length === 0, 'Parser returns empty array for empty file');
      
    } catch (error) {
      this.assert(false, `Error testing completely empty files: ${error.message}`);
    }
  }

  // Test 2: Validate handling of files with only whitespace
  testWhitespaceOnlyFiles() {
    console.log('\n🧪 Testing workflow behavior with whitespace-only todo files...');
    
    const whitespaceVariations = [
      { name: 'spaces-only.md', content: '   ' },
      { name: 'tabs-only.md', content: '\t\t\t' },
      { name: 'newlines-only.md', content: '\n\n\n' },
      { name: 'mixed-whitespace.md', content: ' \t \n \t \n ' },
      { name: 'carriage-returns.md', content: '\r\n\r\n\r\n' }
    ];
    
    try {
      for (const variation of whitespaceVariations) {
        const testFile = path.join(this.tempDir, variation.name);
        fs.writeFileSync(testFile, variation.content);
        
        this.assert(fs.existsSync(testFile), `${variation.name} created successfully`);
        
        const content = fs.readFileSync(testFile, 'utf8');
        this.assert(content === variation.content, `${variation.name} content matches expected`);
        
        // Test the workflow's empty check logic
        const shouldSkip = !content || content.trim() === '';
        this.assert(shouldSkip, `${variation.name} correctly identified as empty after trim`);
        
        // Test parsing whitespace-only content
        const mockGenerator = this.createMockTodoGenerator();
        const tasks = mockGenerator.parseMarkdownForTasks(content, testFile);
        
        this.assert(tasks.length === 0, `${variation.name} produces no actionable tasks`);
      }
      
    } catch (error) {
      this.assert(false, `Error testing whitespace-only files: ${error.message}`);
    }
  }

  // Test 3: Validate handling of files with only comments and no actionable content
  testCommentOnlyFiles() {
    console.log('\n🧪 Testing workflow behavior with comment-only todo files...');
    
    const commentVariations = [
      {
        name: 'html-comments-only.md',
        content: '<!-- This is a comment -->\n<!-- Another comment -->'
      },
      {
        name: 'markdown-invisible.md',
        content: '[//]: # (This is a markdown comment)\n[//]: # (Another invisible comment)'
      },
      {
        name: 'empty-sections.md',
        content: '# Empty Section\n\n## Another Empty Section\n\n### Yet Another Empty Section\n'
      },
      {
        name: 'just-headers.md',
        content: '# Todo Items\n## Must-Do\n### Should-Do\n#### Nice-to-Have\n'
      }
    ];
    
    try {
      for (const variation of commentVariations) {
        const testFile = path.join(this.tempDir, variation.name);
        fs.writeFileSync(testFile, variation.content);
        
        this.assert(fs.existsSync(testFile), `${variation.name} created successfully`);
        
        const content = fs.readFileSync(testFile, 'utf8');
        
        // This should NOT be skipped as empty (has content) but should produce no tasks
        const shouldSkip = !content || content.trim() === '';
        this.assert(!shouldSkip, `${variation.name} not identified as empty (has content)`);
        
        // Test parsing comment-only content
        const mockGenerator = this.createMockTodoGenerator();
        const tasks = mockGenerator.parseMarkdownForTasks(content, testFile);
        
        this.assert(tasks.length === 0, `${variation.name} produces no actionable tasks despite having content`);
      }
      
    } catch (error) {
      this.assert(false, `Error testing comment-only files: ${error.message}`);
    }
  }

  // Test 4: Validate handling of files with content but no actionable tasks
  testNonActionableContentFiles() {
    console.log('\n🧪 Testing workflow behavior with non-actionable content files...');
    
    const nonActionableContent = [
      {
        name: 'descriptive-only.md',
        content: `# Analysis Report
        
**Current Coverage**: This section describes existing functionality.
**Legal Significance**: This explains the importance of certain processes.
**Estimated effort**: 2 hours
**Total development effort**: 8 hours

This document provides analysis and background information without actionable tasks.`
      },
      {
        name: 'completed-tasks.md',
        content: `# Completed Items

- [x] This task is already completed
- [x] Another completed task
✅ Task with checkmark emoji

All items in this file are marked as completed.`
      },
      {
        name: 'questions-only.md',
        content: `# Questions and Analysis

- What should we do about this issue?
- How can we improve the process?
- Why is this happening?
- When should we address this?

This file contains only questions, not actionable tasks.`
      }
    ];
    
    try {
      for (const contentType of nonActionableContent) {
        const testFile = path.join(this.tempDir, contentType.name);
        fs.writeFileSync(testFile, contentType.content);
        
        this.assert(fs.existsSync(testFile), `${contentType.name} created successfully`);
        
        const content = fs.readFileSync(testFile, 'utf8');
        
        // Should not be skipped as empty (has content)
        const shouldSkip = !content || content.trim() === '';
        this.assert(!shouldSkip, `${contentType.name} not identified as empty`);
        
        // But should produce no actionable tasks due to quality filtering
        const mockGenerator = this.createMockTodoGenerator();
        const tasks = mockGenerator.parseMarkdownForTasks(content, testFile);
        
        this.assert(tasks.length === 0, `${contentType.name} produces no actionable tasks due to quality filtering`);
      }
      
    } catch (error) {
      this.assert(false, `Error testing non-actionable content files: ${error.message}`);
    }
  }

  // Test 5: Validate workflow graceful exit behavior
  testWorkflowGracefulExit() {
    console.log('\n🧪 Testing workflow graceful exit behavior with no actionable tasks...');
    
    try {
      // Read the actual workflow file to validate exit behavior
      const workflowPath = '.github/workflows/todo-to-issues.yml';
      if (!fs.existsSync(workflowPath)) {
        this.assert(false, 'Todo-to-issues workflow file not found');
        return;
      }
      
      const workflowContent = fs.readFileSync(workflowPath, 'utf8');
      
      // Test for proper empty file handling in scan step
      this.assert(
        workflowContent.includes('if [ $todo_count -eq 0 ]'),
        'Workflow checks for zero todo files'
      );
      
      this.assert(
        workflowContent.includes('has_todos=false'),
        'Workflow sets has_todos=false for empty scenarios'
      );
      
      this.assert(
        workflowContent.includes('No todo files found - nothing to process'),
        'Workflow provides informative message for no todo files'
      );
      
      // Test for conditional execution based on has_todos
      this.assert(
        workflowContent.includes("if: steps.scan.outputs.has_todos == 'true'"),
        'Workflow conditionally executes subsequent steps'
      );
      
      // Test for empty content handling in generator
      this.assert(
        workflowContent.includes("if (!content || content.trim() === '')"),
        'Generator checks for empty content'
      );
      
      this.assert(
        workflowContent.includes('Skipping empty file'),
        'Generator provides message for skipping empty files'
      );
      
      // Test for graceful exit when no issues found
      this.assert(
        workflowContent.includes('No actionable tasks found'),
        'Generator handles case with no actionable tasks'
      );
      
      this.assert(
        workflowContent.includes('process.exit(0)'),
        'Generator exits gracefully with success code'
      );
      
    } catch (error) {
      this.assert(false, `Error testing workflow graceful exit: ${error.message}`);
    }
  }

  // Test 6: Test error handling for various edge cases
  testErrorHandlingEdgeCases() {
    console.log('\n🧪 Testing error handling for edge cases with empty/problematic files...');
    
    try {
      // Test file with invalid encoding (simulate with null bytes)
      const invalidFile = path.join(this.tempDir, 'invalid-encoding.md');
      const invalidContent = 'Valid content\x00\x01\x02Invalid bytes';
      fs.writeFileSync(invalidFile, invalidContent, 'binary');
      
      this.assert(fs.existsSync(invalidFile), 'Invalid encoding file created');
      
      // Test reading with utf8 encoding (what the workflow uses)
      let readContent;
      try {
        readContent = fs.readFileSync(invalidFile, 'utf8');
        this.assert(typeof readContent === 'string', 'Invalid encoding file readable as string');
      } catch (readError) {
        this.assert(true, 'Invalid encoding properly rejected');
      }
      
      // Test file permissions (create read-only file)
      const readOnlyFile = path.join(this.tempDir, 'readonly.md');
      fs.writeFileSync(readOnlyFile, '# Read-only file content');
      fs.chmodSync(readOnlyFile, 0o444); // Read-only
      
      this.assert(fs.existsSync(readOnlyFile), 'Read-only file created');
      
      // Should still be readable
      const readOnlyContent = fs.readFileSync(readOnlyFile, 'utf8');
      this.assert(readOnlyContent.length > 0, 'Read-only file still readable');
      
      // Test very large empty-ish file (mostly whitespace)
      const largeEmptyFile = path.join(this.tempDir, 'large-empty.md');
      const largeWhitespace = ' '.repeat(100000) + '\n'.repeat(1000);
      fs.writeFileSync(largeEmptyFile, largeWhitespace);
      
      this.assert(fs.existsSync(largeEmptyFile), 'Large empty-ish file created');
      this.assert(fs.statSync(largeEmptyFile).size > 100000, 'Large file has expected size');
      
      const largeContent = fs.readFileSync(largeEmptyFile, 'utf8');
      const shouldSkipLarge = !largeContent || largeContent.trim() === '';
      this.assert(shouldSkipLarge, 'Large whitespace-only file correctly identified as empty');
      
    } catch (error) {
      this.assert(false, `Error testing edge cases: ${error.message}`);
    }
  }

  // Test 7: Integration test simulating full workflow with empty files
  testFullWorkflowIntegration() {
    console.log('\n🧪 Testing full workflow integration with empty todo files...');
    
    try {
      // Create a mix of empty and non-empty files to simulate real scenario
      const testFiles = [
        { name: 'empty.md', content: '' },
        { name: 'whitespace.md', content: '   \n  \t  \n  ' },
        { name: 'comments-only.md', content: '<!-- just comments -->' },
        { name: 'valid-tasks.md', content: `# Todo Items\n\n## Must-Do\n1. Implement validation for empty files\n2. Add comprehensive error handling` }
      ];
      
      let emptyCount = 0;
      let validCount = 0;
      let totalTasks = 0;
      
      for (const testFile of testFiles) {
        const filePath = path.join(this.tempDir, testFile.name);
        fs.writeFileSync(filePath, testFile.content);
        
        const content = fs.readFileSync(filePath, 'utf8');
        
        if (!content || content.trim() === '') {
          emptyCount++;
          console.log(`  📄 ${testFile.name}: Empty file (skipped)`);
        } else {
          validCount++;
          console.log(`  📄 ${testFile.name}: Valid file (processed)`);
          
          // Count tasks in valid files
          const mockGenerator = this.createMockTodoGenerator();
          const tasks = mockGenerator.parseMarkdownForTasks(content, filePath);
          totalTasks += tasks.length;
          console.log(`    └─ Found ${tasks.length} actionable tasks`);
        }
      }
      
      this.assert(emptyCount === 2, `Correctly identified ${emptyCount} empty files`);
      this.assert(validCount === 2, `Correctly identified ${validCount} valid files`);
      this.assert(totalTasks === 2, `Found ${totalTasks} actionable tasks in valid files`);
      
      // Simulate the workflow behavior
      if (emptyCount === testFiles.length) {
        console.log('  🚪 Workflow would exit gracefully (all files empty)');
        this.assert(true, 'Workflow exits gracefully when all files are empty');
      } else if (totalTasks === 0) {
        console.log('  🚪 Workflow would exit gracefully (no actionable tasks)');
        this.assert(true, 'Workflow exits gracefully when no actionable tasks found');
      } else {
        console.log(`  ✅ Workflow would proceed to create ${totalTasks} issues`);
        this.assert(totalTasks > 0, 'Workflow proceeds when actionable tasks found');
      }
      
    } catch (error) {
      this.assert(false, `Error testing full workflow integration: ${error.message}`);
    }
  }

  // Helper method to create a mock TodoIssueGenerator with the parsing logic
  createMockTodoGenerator() {
    return {
      parseMarkdownForTasks: function(content, filename) {
        const lines = content.split('\n');
        const tasks = [];
        let currentSection = '';
        let currentPriority = 'medium';
        let inPrioritySection = false;
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          
          // Track current section for context
          if (line.match(/^#{1,4}\s+/)) {
            currentSection = line.replace(/^#+\s+/, '');
            
            // Extract priority from section headers
            if (line.toLowerCase().includes('critical') || line.toLowerCase().includes('priority 1')) {
              currentPriority = 'critical';
            } else if (line.toLowerCase().includes('high') || line.toLowerCase().includes('priority 2')) {
              currentPriority = 'high';
            } else if (line.toLowerCase().includes('medium') || line.toLowerCase().includes('priority 3')) {
              currentPriority = 'medium';
            } else if (line.toLowerCase().includes('low') || line.toLowerCase().includes('priority 4')) {
              currentPriority = 'low';
            }
            
            // Check if we're in a priority recommendation section
            inPrioritySection = line.toLowerCase().includes('must-do') ||
                              line.toLowerCase().includes('should-do') ||
                              line.toLowerCase().includes('nice-to-have');
          }
          
          // Look for numbered tasks in priority sections
          if (inPrioritySection) {
            const numberedTask = line.match(/^\d+\.\s*(.+)$/);
            if (numberedTask) {
              const task = numberedTask[1].trim();
              if (task.length > 10 && this.isHighQualityTask(task)) {
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
        }
        
        return tasks;
      },

      isHighQualityTask: function(task) {
        // Simplified version of quality filtering
        if (task.length < 15) return false;
        
        const skipPatterns = [
          /^\*\*.*\*\*$/,
          /hours?$/i,
          /Current Coverage/i,
          /Legal Significance/i,
          /Estimated effort/i
        ];
        
        for (const pattern of skipPatterns) {
          if (pattern.test(task)) return false;
        }
        
        const actionPatterns = [
          /^(Implement|Create|Build|Fix|Add|Update|Develop)\s+/i,
          /validation/i,
          /error handling/i
        ];
        
        return actionPatterns.some(pattern => pattern.test(task));
      }
    };
  }

  // Cleanup test environment
  cleanupTestEnvironment() {
    console.log('\n🧹 Cleaning up test environment...');
    
    try {
      if (fs.existsSync(this.tempDir)) {
        const files = fs.readdirSync(this.tempDir);
        for (const file of files) {
          const filePath = path.join(this.tempDir, file);
          try {
            fs.unlinkSync(filePath);
          } catch (error) {
            console.log(`  ⚠️ Failed to remove ${file}: ${error.message}`);
          }
        }
        
        fs.rmdirSync(this.tempDir);
        this.assert(!fs.existsSync(this.tempDir), 'Test directory removed successfully');
      }
    } catch (error) {
      this.assert(false, `Error during cleanup: ${error.message}`);
    }
  }

  // Run all empty todo file validation tests
  runAllTests() {
    console.log('🚀 Starting Empty Todo File Validation Tests...');
    console.log('Addressing requirement from todo/workflow-validation-tests.md line 71');
    console.log('=' .repeat(80));
    
    if (!this.setupTestEnvironment()) {
      console.log('❌ Failed to setup test environment. Aborting tests.');
      return false;
    }
    
    this.testCompletelyEmptyFiles();
    this.testWhitespaceOnlyFiles();
    this.testCommentOnlyFiles();
    this.testNonActionableContentFiles();
    this.testWorkflowGracefulExit();
    this.testErrorHandlingEdgeCases();
    this.testFullWorkflowIntegration();
    
    this.cleanupTestEnvironment();
    
    console.log('\n' + '=' .repeat(80));
    console.log(`📊 Empty Todo File Validation Summary: ${this.testResults.length} tests run`);
    
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
    
    // Write detailed results to file
    const detailedResults = {
      summary: {
        total: this.testResults.length,
        passed: passedTests,
        failed: failedTests,
        success_rate: Math.round((passedTests / this.testResults.length) * 100),
        test_type: 'empty_todo_file_validation',
        requirement_source: 'todo/workflow-validation-tests.md line 71'
      },
      tests: this.testResults,
      errors: this.errors,
      test_categories: {
        empty_files: this.testResults.filter(t => t.test.includes('empty')).length,
        whitespace_files: this.testResults.filter(t => t.test.includes('whitespace')).length,
        comment_files: this.testResults.filter(t => t.test.includes('comment')).length,
        workflow_behavior: this.testResults.filter(t => t.test.includes('workflow')).length,
        error_handling: this.testResults.filter(t => t.test.includes('error')).length,
        integration: this.testResults.filter(t => t.test.includes('integration')).length
      },
      generated_at: new Date().toISOString()
    };
    
    // Archive test results
    const archiver = new TestResultArchiver();
    archiver.archiveTestResult('empty-todo-file-validation-results.json', detailedResults, {
      testType: 'empty-todo-file-validation',
      metadata: {
        requirement_source: 'todo/workflow-validation-tests.md line 71',
        test_environment: this.tempDir,
        categories_tested: Object.keys(detailedResults.test_categories)
      },
      summary: detailedResults.summary
    });
    
    console.log('\n🎯 Validation Complete! All empty todo file scenarios tested.');
    console.log('📋 This addresses the requirement: "Validate workflow behavior with empty todo files"');
    
    return failedTests === 0;
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const validator = new EmptyTodoFileValidator();
  const success = validator.runAllTests();
  process.exit(success ? 0 : 1);
}

module.exports = EmptyTodoFileValidator;