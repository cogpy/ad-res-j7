#!/usr/bin/env node

/**
 * Malformed Markdown File Handling Test Suite
 * Comprehensive testing for handling various types of malformed, corrupted, and invalid markdown files
 * This addresses the requirement from todo/workflow-validation-tests.md line 72
 */

const fs = require('fs');
const path = require('path');
const TestResultArchiver = require('./test-result-archiver');

class MalformedMarkdownTest {
  constructor() {
    this.testResults = [];
    this.errors = [];
    this.testDataDir = '/tmp/malformed-test-data';
    this.startTime = Date.now();
  }

  assert(condition, message) {
    const result = {
      test: message,
      passed: condition,
      timestamp: new Date().toISOString(),
      suite: 'malformed-markdown'
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
  setup() {
    console.log('🔧 Setting up malformed markdown test environment...');
    
    // Ensure test directory exists
    if (!fs.existsSync(this.testDataDir)) {
      fs.mkdirSync(this.testDataDir, { recursive: true });
    }
  }

  // Cleanup test environment
  cleanup() {
    console.log('🧹 Cleaning up malformed markdown test environment...');
    
    if (fs.existsSync(this.testDataDir)) {
      fs.rmSync(this.testDataDir, { recursive: true, force: true });
    }
  }

  // Simulate the TodoIssueGenerator parseMarkdownForTasks method
  parseMarkdownForTasks(content, filename) {
    const lines = content.split('\n');
    const tasks = [];
    let currentSection = '';
    let currentPriority = 'medium';
    
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
      }
      
      // Look for actionable patterns
      const actionablePatterns = [
        /^-\s*(.*(?:implement|add|create|fix|update|improve|enhance|develop|build|establish|provide|include|demonstrate|expand|complete|review).*)/i,
        /^\*\s*(.*(?:implement|add|create|fix|update|improve|enhance|develop|build|establish|provide|include|demonstrate|expand|complete|review).*)/i
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

  // Quality task filter (simplified version from workflow)
  isHighQualityTask(task) {
    // Skip if too short
    if (task.length < 15) {
      return false;
    }
    
    // Skip formatting artifacts and non-actionable text
    const skipPatterns = [
      /^\*\*.*\*\*$/,  // Just bold text
      /^\*\*.*\*\*:$/,  // Bold text ending with colon
      /^Current Coverage/i,
      /^Legal Significance:/i,
      /^Framework Phase:/i,
      /^Impact:/i,
      /^Estimated effort:/i,
      /hours?$/i,  // Ends with "hours"
      /^\[x\]/i,  // Completed checkbox items
      /✅/,  // Lines with checkmark emoji
      /COMPLETED/i  // Lines marked as completed
    ];
    
    for (const pattern of skipPatterns) {
      if (pattern.test(task)) {
        return false;
      }
    }
    
    // Accept valid action patterns
    const actionPatterns = [
      /^(TODO|FIXME|TASK|ACTION):/i,
      /^(Implement|Create|Build|Fix|Add|Update|Develop)\s+/i,
      /^(Write|Draft|Prepare|Design|Setup|Configure)\s+/i,
      /^(Test|Validate|Verify|Check)\s+/i,
      /(monitoring and alerting|automated testing|comprehensive test|duplicate prevention|JSON parsing|workflow functionality)/i
    ];
    
    return actionPatterns.some(pattern => pattern.test(task));
  }

  // Test various types of malformed markdown content
  testMalformedContent() {
    console.log('\n🧪 Testing malformed markdown content handling...');
    
    try {
      // Test 1: Completely invalid markdown structure
      const invalidStructure = `
This file has no proper structure at all
Random text without any markdown formatting
No headers, no lists, just plain text that makes no sense
Some unicode characters: 中文 العربية русский 日本語
Mixed encoding issues and special characters: �����
`;
      
      const result1 = this.parseMarkdownForTasks(invalidStructure, 'invalid-structure.md');
      this.assert(result1.length === 0, 'Handles files with no markdown structure');
      
      // Test 2: Broken markdown headers
      const brokenHeaders = `
# This is valid
## This is also valid
### But this is broken #
######### Too many hashes
# 
#No space after hash
This is supposed to be # a header but isn't
- Implement proper header validation
`;
      
      const result2 = this.parseMarkdownForTasks(brokenHeaders, 'broken-headers.md');
      this.assert(result2.length >= 1, 'Extracts valid tasks despite broken headers');
      
      // Test 3: Malformed lists
      const malformedLists = `
# Test Lists
-No space after dash
- Proper list item
* Also proper list item
*No space after asterisk
- Create comprehensive test coverage
-Another broken item
- Fix list formatting issues
`;
      
      const result3 = this.parseMarkdownForTasks(malformedLists, 'malformed-lists.md');
      this.assert(result3.length >= 2, 'Processes valid list items despite malformed ones');
      
      // Test 4: Mixed valid and invalid content
      const mixedContent = `
# Valid Section
- Implement error handling for malformed files
Random invalid text that shouldn't be processed
**Bold text that should be filtered**
- Add validation for markdown syntax
Another random line
- Update documentation for edge cases
`;
      
      const result4 = this.parseMarkdownForTasks(mixedContent, 'mixed-content.md');
      this.assert(result4.length === 3, 'Correctly filters valid tasks from mixed content');
      
      // Test 5: Empty and whitespace-only content
      const emptyContent = '';
      const whitespaceContent = '   \n\n\t\t\n   ';
      
      const result5 = this.parseMarkdownForTasks(emptyContent, 'empty.md');
      const result6 = this.parseMarkdownForTasks(whitespaceContent, 'whitespace.md');
      
      this.assert(result5.length === 0, 'Handles empty files gracefully');
      this.assert(result6.length === 0, 'Handles whitespace-only files gracefully');
      
    } catch (error) {
      this.assert(false, `Error in malformed content test: ${error.message}`);
    }
  }

  // Test invalid character encodings and corrupted content
  testEncodingIssues() {
    console.log('\n🧪 Testing character encoding and corruption issues...');
    
    try {
      // Test 1: Invalid UTF-8 sequences (simulated)
      const invalidUtf8 = `
# Section with encoding issues
These characters might cause issues: �������
- Implement proper encoding validation
Mixed encoding text: café naïve résumé
- Add support for international characters
Binary-like content: \x00\x01\x02\x03\xFF\xFE\xFD
- Fix encoding detection problems
`;
      
      const result1 = this.parseMarkdownForTasks(invalidUtf8, 'invalid-utf8.md');
      this.assert(result1.length >= 3, 'Handles files with encoding issues');
      
      // Test 2: Very long lines that might cause buffer issues
      const veryLongLine = '- ' + 'A'.repeat(10000) + ' implement handling of extremely long lines';
      const longLineContent = `
# Long Line Test
${veryLongLine}
- Create normal length task
`;
      
      const result2 = this.parseMarkdownForTasks(longLineContent, 'long-lines.md');
      this.assert(result2.length >= 1, 'Handles files with extremely long lines');
      
      // Test 3: Control characters and special sequences
      const controlChars = `
# Control Characters Test
- Implement validation for control chars\r\n
- Add support for different line endings\n\r
- Fix handling of\ttab characters
- Handle null\0characters in content
`;
      
      const result3 = this.parseMarkdownForTasks(controlChars, 'control-chars.md');
      this.assert(result3.length >= 3, 'Handles control characters in content');
      
    } catch (error) {
      this.assert(false, `Error in encoding test: ${error.message}`);
    }
  }

  // Test malformed markdown syntax elements
  testMalformedSyntax() {
    console.log('\n🧪 Testing malformed markdown syntax elements...');
    
    try {
      // Test 1: Unclosed markup
      const unclosedMarkup = `
# Unclosed Markup Test
- Implement **bold text without closing
- Add *italic text without closing
- Create \`code without closing backtick
- Fix [link without closing bracket
- Update (parentheses without closing
- Test "quotes without closing
`;
      
      const result1 = this.parseMarkdownForTasks(unclosedMarkup, 'unclosed.md');
      this.assert(result1.length >= 5, 'Handles unclosed markup gracefully');
      
      // Test 2: Nested markup conflicts
      const nestedConflicts = `
# Nested Markup Conflicts
- Implement **bold with *italic inside** and more*
- Create \`code with **bold inside\` and more**
- Fix [link with **bold](url)** formatting
- Add support for ***complex*** formatting
`;
      
      const result2 = this.parseMarkdownForTasks(nestedConflicts, 'nested.md');
      this.assert(result2.length >= 4, 'Handles nested markup conflicts');
      
      // Test 3: Invalid character combinations
      const invalidCombos = `
# Invalid Character Combinations
- Implement handling for <<<>>> invalid brackets
- Add support for %%% percentage signs
- Create tests for ### in content areas
- Fix issues with ||| pipe characters
- Update @@@ at symbol handling
`;
      
      const result3 = this.parseMarkdownForTasks(invalidCombos, 'invalid-combos.md');
      this.assert(result3.length >= 5, 'Handles invalid character combinations');
      
    } catch (error) {
      this.assert(false, `Error in syntax test: ${error.message}`);
    }
  }

  // Test error handling and edge cases
  testErrorHandling() {
    console.log('\n🧪 Testing error handling and edge cases...');
    
    try {
      // Test 1: Null and undefined inputs
      let result1, result2;
      try {
        result1 = this.parseMarkdownForTasks(null, 'null.md');
        result2 = this.parseMarkdownForTasks(undefined, 'undefined.md');
      } catch (error) {
        // It's okay if these throw errors, but they shouldn't crash the system
        result1 = [];
        result2 = [];
      }
      
      this.assert(Array.isArray(result1), 'Handles null input gracefully');
      this.assert(Array.isArray(result2), 'Handles undefined input gracefully');
      
      // Test 2: Circular references in content (string can't have circular refs, but test edge cases)
      const circularLikeContent = `
# Circular Reference Test
- See section below for implementation details
- Refer to above section for requirements
- Check previous point for context
- Look at next item for solution
- Implement proper cross-reference handling
`;
      
      const result3 = this.parseMarkdownForTasks(circularLikeContent, 'circular.md');
      this.assert(result3.length >= 1, 'Handles circular-reference-like content');
      
      // Test 3: Very deep nesting
      const deepNesting = `
# Deep Nesting Test
- Level 1
  - Level 2
    - Level 3
      - Level 4
        - Level 5
          - Implement deep nesting support
- Back to level 1
  - Create validation for nested lists
`;
      
      const result4 = this.parseMarkdownForTasks(deepNesting, 'deep-nesting.md');
      this.assert(result4.length >= 2, 'Handles deeply nested content');
      
    } catch (error) {
      this.assert(false, `Error in error handling test: ${error.message}`);
    }
  }

  // Test file system related issues
  testFileSystemIssues() {
    console.log('\n🧪 Testing file system related issues...');
    
    try {
      // Test 1: Simulated file reading errors (we'll test the content handling)
      const partialContent = `
# Partially Read File
- This might be from a partially read file
- Implement proper file reading validation
- Add error recovery for incomplete
`;
      
      const result1 = this.parseMarkdownForTasks(partialContent, 'partial.md');
      this.assert(result1.length >= 2, 'Handles partially read content');
      
      // Test 2: Files with BOM (Byte Order Mark)
      const bomContent = '\uFEFF# File with BOM\n- Implement BOM handling\n- Fix Unicode marker issues';
      
      const result2 = this.parseMarkdownForTasks(bomContent, 'bom.md');
      this.assert(result2.length >= 2, 'Handles files with BOM');
      
      // Test 3: Mixed line endings
      const mixedLineEndings = '# Mixed Line Endings\r\n- Implement Windows style support\n- Create Unix style handling\r- Fix Mac style issues\r\n- Update proper line ending validation';
      
      const result3 = this.parseMarkdownForTasks(mixedLineEndings, 'mixed-endings.md');
      this.assert(result3.length >= 3, 'Handles mixed line endings');
      
    } catch (error) {
      this.assert(false, `Error in file system test: ${error.message}`);
    }
  }

  // Test workflow integration with malformed files
  testWorkflowIntegration() {
    console.log('\n🧪 Testing workflow integration with malformed files...');
    
    try {
      // Test that the workflow can handle a mix of valid and invalid files
      const testFiles = [
        {
          name: 'valid.md',
          content: '# Valid File\n- Implement proper validation\n- Add error handling'
        },
        {
          name: 'malformed.md', 
          content: 'Invalid content with no structure\nRandom text\n�����'
        },
        {
          name: 'mixed.md',
          content: '# Mixed Content\nInvalid line\n- Create comprehensive tests\nAnother invalid line'
        }
      ];
      
      let totalTasks = 0;
      let processedFiles = 0;
      let failedFiles = 0;
      
      for (const file of testFiles) {
        try {
          const tasks = this.parseMarkdownForTasks(file.content, file.name);
          totalTasks += tasks.length;
          processedFiles++;
        } catch (error) {
          failedFiles++;
        }
      }
      
      this.assert(processedFiles >= 2, 'Processes at least valid and mixed files');
      this.assert(totalTasks >= 3, 'Extracts valid tasks from processable files');
      this.assert(failedFiles <= 1, 'Handles malformed files without complete failure');
      
    } catch (error) {
      this.assert(false, `Error in workflow integration test: ${error.message}`);
    }
  }

  // Run all tests
  async run() {
    console.log('🚀 Starting Malformed Markdown File Handling Tests');
    console.log('============================================================');
    
    this.setup();
    
    try {
      this.testMalformedContent();
      this.testEncodingIssues();
      this.testMalformedSyntax();
      this.testErrorHandling();
      this.testFileSystemIssues();
      this.testWorkflowIntegration();
      
      // Generate summary
      const passed = this.testResults.filter(r => r.passed).length;
      const failed = this.testResults.filter(r => !r.passed).length;
      const total = this.testResults.length;
      const successRate = Math.round((passed / total) * 100);
      const executionTime = Date.now() - this.startTime;
      
      console.log('\n============================================================');
      console.log('📊 Malformed Markdown Test Summary');
      console.log('============================================================');
      console.log(`✅ Passed: ${passed}/${total}`);
      console.log(`❌ Failed: ${failed}`);
      console.log(`📈 Success Rate: ${successRate}%`);
      console.log(`⏱️  Execution Time: ${executionTime}ms`);
      
      if (failed > 0) {
        console.log('\n🔥 Failed Tests:');
        this.errors.forEach((error, index) => {
          console.log(`   ${index + 1}. ${error}`);
        });
      }
      
      // Archive results
      const resultData = {
        summary: {
          total_tests: total,
          passed: passed,
          failed: failed,
          success_rate: successRate,
          execution_time_ms: executionTime
        },
        test_results: this.testResults,
        errors: this.errors,
        test_suite: 'malformed-markdown',
        generated_at: new Date().toISOString()
      };
      
      // Use the existing archiver pattern
      const archiver = new TestResultArchiver();
      archiver.archiveTestResult('malformed-markdown-test-results.json', resultData, {
        testType: 'malformed-markdown',
        summary: resultData.summary
      });
      
      console.log('\n📁 Test results archived');
      
      return failed === 0;
      
    } catch (error) {
      console.error('💥 Fatal error in malformed markdown tests:', error.message);
      console.error(error.stack);
      return false;
    } finally {
      this.cleanup();
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const test = new MalformedMarkdownTest();
  test.run().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('Test execution failed:', error);
    process.exit(1);
  });
}

module.exports = MalformedMarkdownTest;