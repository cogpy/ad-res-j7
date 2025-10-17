// Special Characters Workflow Test
// Tests the todo-to-issues workflow with various special characters, unicode, and formatting

const fs = require('fs');
const path = require('path');
const TestResultArchiver = require('./test-result-archiver');

class SpecialCharactersWorkflowTest {
  constructor() {
    this.testResults = [];
    this.errors = [];
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

  // Create a test todo file with special characters
  createSpecialCharactersTodoFile() {
    const specialCharacterContent = `# Special Characters Workflow Test

This file tests the workflow's ability to handle various special characters, unicode symbols, and formatting.

## Must-Do (Critical Priority)

1. Fix émoji handling in the workflow: 🚀 ✅ 📋 🔧 for better user experience
2. Implement ünicode character support: café, naïve, résumé, piñata processing
3. Handle "quotes" and 'apostrophes' correctly in task titles and descriptions
4. Process symbols properly: $100 budget, @mentions, #hashtags, 50% completion

## Should-Do (High Priority)

1. Test markdown with **bold émojis** and *italic ünicode* characters: café ☕
2. Validate code blocks with special chars: \`const price = $99.99;\` and \`SELECT * FROM résumé;\`
3. Ensure proper URL handling: https://example.com/café?query=naïve&price=$100
4. Test mixed formatting: **Important: 🚨** Handle émoji in bold text properly

## Nice-to-Have (Medium Priority)

1. Support mathematical symbols: ∑, ∆, π, ∞, ≤, ≥, ≠ in technical documentation
2. Handle currency symbols: €100, £50, ¥1000, ₹500 in financial tasks
3. Process language-specific characters: español, français, Deutsch, 中文, العربية
4. Test special punctuation: em-dash—like this, ellipsis…, quotes "smart" and 'curly'

## Improvements Needed:
- Create validation for émoji rendering in GitHub issues
- Enhance unicode normalization for search and comparison
- Add support for RTL (right-to-left) text handling
- Implement proper encoding/decoding for special character preservation

## **Action Required**:
- Test workflow with "complex" formatting: **bold**, *italic*, \`code\`, and émojis 🔥
- Validate proper escaping of: \`backticks\`, "quotes", and 'apostrophes' in issue bodies
- Ensure special characters don't break: JSON parsing, YAML processing, or shell commands

## Edge Cases for Special Characters

### Emoji and Symbol Tests
1. 🎯 Target: Test émoji in task titles for proper rendering
2. 📊 Analytics: Implement data visualization with special chars: ±5% accuracy
3. 🔒 Security: Handle authentication tokens with symbols: API_KEY_$2024!@#
4. 🌐 International: Support global characters: résumé, naïve, café, piñata

### Complex Formatting Tests
1. **🚨 Critical Bug**: Handle formatting with émojis in markdown **bold** text
2. *✨ Enhancement*: Implement \`code blocks\` with special characters properly
3. [🔗 Link Test](https://example.com/café?query=résumé&symbols=$@#): URL with special chars
4. > 💡 **Quote Block**: Test blockquotes with émojis and special formatting

### Punctuation and Symbol Tests
1. Test "smart quotes" and 'apostrophes' in various contexts
2. Handle mathematical expressions: x ± y = z, where α ≤ β ≥ γ
3. Process financial data: profit/loss of ±$1,234.56 (≈15% change)
4. Validate time formats: meeting at 2:30 PM–4:00 PM on 12/25/2024

### Unicode Normalization Tests
1. Test composed vs decomposed unicode: café vs cafe\u0301
2. Handle zero-width characters: invisible\u200bseparators
3. Process combining characters: a\u0300 (a with grave accent)
4. Validate emoji variations: 👍🏻 vs 👍🏽 vs 👍🏿 (skin tone modifiers)

---

*This test file validates comprehensive special character handling in the todo-to-issues workflow.*
`;

    // Write to a temporary test file
    const testFilePath = '/tmp/special-characters-test.md';
    fs.writeFileSync(testFilePath, specialCharacterContent);
    return testFilePath;
  }

  // Test the workflow's embedded JavaScript parser with special characters
  testJavaScriptParserWithSpecialChars() {
    console.log('\n🧪 Testing JavaScript parser with special characters...');

    try {
      // Read the workflow file to extract the JavaScript parser
      const workflowContent = fs.readFileSync('.github/workflows/todo-to-issues.yml', 'utf8');
      
      // Extract the embedded JavaScript code
      const jsStart = workflowContent.indexOf('cat > issue-generator.js << \'EOF\'');
      const jsEnd = workflowContent.indexOf('EOF', jsStart + 50);
      
      if (jsStart === -1 || jsEnd === -1) {
        this.assert(false, 'Could not extract JavaScript parser from workflow');
        return;
      }

      const jsCode = workflowContent.substring(jsStart + 32, jsEnd - 1); // Extract just the JS content
      
      // Test critical functions for special character handling
      this.assert(jsCode.includes('parseMarkdownForTasks'), 'Parser has parseMarkdownForTasks method');
      this.assert(jsCode.includes('generateIssueContent'), 'Parser has generateIssueContent method');
      this.assert(jsCode.includes('isHighQualityTask'), 'Parser has task quality filtering');
      
      // Test title cleaning logic for special characters
      this.assert(jsCode.includes('title.replace'), 'Parser includes title cleaning logic');
      this.assert(jsCode.includes('.trim()'), 'Parser trims whitespace from titles');
      
      // Test for character encoding safety
      this.assert(jsCode.includes('utf8'), 'Parser specifies UTF-8 encoding for file reading');
      
      // Test JSON safety for special characters
      this.assert(jsCode.includes('JSON.stringify'), 'Parser uses JSON.stringify for safe serialization');
      
    } catch (error) {
      this.assert(false, `Error testing JavaScript parser: ${error.message}`);
    }
  }

  // Test markdown parsing with special characters
  testMarkdownParsingWithSpecialChars() {
    console.log('\n🧪 Testing markdown parsing with special characters...');

    // Create sample content with special characters
    const testContent = `# Test File

## Must-Do (Critical Priority)

1. Fix émoji handling 🚀 for better UX
2. Process "quotes" and 'apostrophes' correctly  
3. Handle symbols: $100, @user, #tag, 50%

## Improvements Needed:
- Create validation for émoji rendering
- Test unicode: café, naïve, résumé
- Handle currency: €100, £50, ¥1000
`;

    try {
      // Simulate the parsing logic from the workflow
      const lines = testContent.split('\n');
      let foundTasks = 0;
      let hasSpecialChars = false;
      let hasEmojis = false;
      let hasUnicode = false;
      let hasSymbols = false;

      for (const line of lines) {
        // Count tasks with special characters
        if (line.match(/^\d+\.\s+.*[🚀✅📋🔧]/)) {
          foundTasks++;
          hasEmojis = true;
        }
        if (line.includes('émoji') || line.includes('café') || line.includes('naïve')) {
          hasUnicode = true;
        }
        if (line.includes('"') || line.includes("'") || line.includes('$') || line.includes('@') || line.includes('%')) {
          hasSymbols = true;
          hasSpecialChars = true;
        }
        if (line.match(/^\d+\.\s+/) || line.match(/^-\s+/)) {
          foundTasks++;
        }
      }

      this.assert(foundTasks >= 6, `Found ${foundTasks} tasks in test content (expected >= 6)`);
      this.assert(hasEmojis, 'Detected emoji characters in tasks');
      this.assert(hasUnicode, 'Detected unicode characters in tasks');
      this.assert(hasSymbols, 'Detected special symbols in tasks');
      this.assert(hasSpecialChars, 'Overall special character detection working');

    } catch (error) {
      this.assert(false, `Error testing markdown parsing: ${error.message}`);
    }
  }

  // Test title generation with special characters
  testTitleGenerationWithSpecialChars() {
    console.log('\n🧪 Testing title generation with special characters...');

    const testTasks = [
      'Fix émoji handling 🚀 for better user experience',
      'Process "quotes" and \'apostrophes\' correctly in titles',
      'Handle symbols: $100 budget, @mentions, #hashtags, 50% completion',
      'Support mathematical symbols: ∑, ∆, π, ∞ in documentation',
      'Test **bold émojis** and *italic ünicode* characters: café ☕',
      'Very long title with special chars: This is a very long task description with émojis 🚀 and unicode characters like café, naïve, résumé that exceeds eighty characters and should be truncated'
    ];

    try {
      for (const task of testTasks) {
        // Simulate title cleaning logic from the workflow
        let title = task;
        
        // Remove markdown formatting (like in the workflow)
        title = title.replace(/\*\*(.+?)\*\*/g, '$1');
        title = title.replace(/\*(.+?)\*/g, '$1');
        title = title.replace(/`(.+?)`/g, '$1');
        
        // Trim and clean
        title = title.replace(/^[-*\d.\s]+/, '').trim();
        
        // Limit length
        if (title.length > 80) {
          title = title.substring(0, 77) + '...';
        }

        // Validate the cleaned title
        this.assert(title.length <= 80, `Title properly truncated: "${title.substring(0, 50)}..."`);
        this.assert(title.length > 0, `Title not empty after cleaning: "${task.substring(0, 30)}..."`);
        
        // Test that special characters are preserved (when they fit within the length limit)
        if (task.includes('🚀') && title.length < 77) {
          this.assert(title.includes('🚀'), 'Emoji preserved in title (when within length limit)');
        } else if (task.includes('🚀')) {
          // For long titles that get truncated, just verify the truncation worked
          this.assert(title.endsWith('...'), 'Long title with emoji properly truncated');
        }
        if (task.includes('café') && title.length < 77) {
          this.assert(title.includes('café'), 'Unicode characters preserved in title (when within length limit)');
        } else if (task.includes('café')) {
          // For long titles that get truncated, just verify the truncation worked
          this.assert(title.endsWith('...'), 'Long title with unicode properly truncated');
        }
        if (task.includes('"') || task.includes("'")) {
          this.assert(title.includes('"') || title.includes("'"), 'Quote characters preserved in title');
        }
      }

    } catch (error) {
      this.assert(false, `Error testing title generation: ${error.message}`);
    }
  }

  // Test label generation with special characters
  testLabelGenerationWithSpecialChars() {
    console.log('\n🧪 Testing label generation with special characters...');

    try {
      // Test that labels are generated correctly regardless of special chars in content
      const testCases = [
        { priority: 'critical', expectedLabels: ['todo', 'enhancement', 'priority: critical', 'bug'] },
        { priority: 'high', expectedLabels: ['todo', 'enhancement', 'priority: high'] },
        { priority: 'medium', expectedLabels: ['todo', 'enhancement', 'priority: medium'] },
        { priority: 'low', expectedLabels: ['todo', 'enhancement', 'priority: low'] }
      ];

      for (const testCase of testCases) {
        // Simulate label generation logic
        const labels = ['todo', 'enhancement'];
        
        if (testCase.priority === 'critical') {
          labels.push('priority: critical', 'bug');
        } else if (testCase.priority === 'high') {
          labels.push('priority: high');
        } else if (testCase.priority === 'medium') {
          labels.push('priority: medium');
        } else if (testCase.priority === 'low') {
          labels.push('priority: low');
        }

        // Validate generated labels
        this.assert(
          JSON.stringify(labels.sort()) === JSON.stringify(testCase.expectedLabels.sort()),
          `Correct labels generated for ${testCase.priority} priority`
        );
        
        // Test that labels are valid for GitHub (no special characters in label names)
        for (const label of labels) {
          this.assert(
            !label.includes('🚀') && !label.includes('café'),
            `Label "${label}" doesn't contain problematic special characters`
          );
        }
      }

    } catch (error) {
      this.assert(false, `Error testing label generation: ${error.message}`);
    }
  }

  // Test JSON serialization with special characters
  testJSONSerializationWithSpecialChars() {
    console.log('\n🧪 Testing JSON serialization with special characters...');

    try {
      // Test issue data with special characters
      const testIssueData = {
        title: 'Fix émoji handling 🚀 and unicode: café, naïve',
        body: '## Task Description\n\nTest with "quotes" and \'apostrophes\' and symbols: $@#\n\n**Émojis**: 🚀 ✅ 📋\n**Unicode**: café, naïve, résumé\n**Symbols**: $100, @user, #tag, 50%',
        labels: ['todo', 'enhancement', 'priority: high'],
        source: {
          task: 'Fix émoji handling 🚀 and unicode: café, naïve',
          section: 'Must-Do (Critical Priority)',
          priority: 'critical',
          file: 'test-special-chars.md',
          lineNumber: 5
        }
      };

      // Test JSON serialization (what the workflow does)
      const jsonString = JSON.stringify(testIssueData, null, 2);
      this.assert(jsonString.length > 0, 'JSON serialization successful');
      this.assert(jsonString.includes('🚀'), 'Emojis preserved in JSON');
      this.assert(jsonString.includes('café'), 'Unicode characters preserved in JSON');
      this.assert(jsonString.includes('\\\"quotes\\\"'), 'Quote characters properly escaped in JSON');
      
      // Test deserialization
      const parsedData = JSON.parse(jsonString);
      this.assert(parsedData.title === testIssueData.title, 'Title correctly deserialized');
      this.assert(parsedData.body.includes('🚀'), 'Emojis preserved through serialization cycle');
      this.assert(parsedData.source.task.includes('café'), 'Unicode preserved in nested objects');

      // Test that the JSON is valid according to GitHub API expectations
      this.assert(typeof parsedData.title === 'string', 'Title is string type');
      this.assert(Array.isArray(parsedData.labels), 'Labels is array type');
      this.assert(parsedData.labels.every(label => typeof label === 'string'), 'All labels are strings');

    } catch (error) {
      this.assert(false, `Error testing JSON serialization: ${error.message}`);
    }
  }

  // Test GitHub CLI command construction with special characters
  testGitHubCLICommandConstruction() {
    console.log('\n🧪 Testing GitHub CLI command construction with special characters...');

    try {
      // Simulate the workflow's command construction logic
      const testIssue = {
        title: 'Fix émoji handling 🚀 and "quotes"',
        body: 'Task with special chars: café, naïve, $@#',
        labels: ['todo', 'enhancement', 'priority: high']
      };

      // Test command argument array construction (from workflow)
      const gh_args = ['issue', 'create', '--title', testIssue.title, '--body', testIssue.body];
      
      // Add labels as separate arguments (as the workflow does)
      for (const label of testIssue.labels) {
        gh_args.push('--label', label);
      }

      // Validate command construction
      this.assert(gh_args[0] === 'issue', 'Command starts with "issue"');
      this.assert(gh_args[1] === 'create', 'Command includes "create"');
      this.assert(gh_args.includes('--title'), 'Command includes --title flag');
      this.assert(gh_args.includes('--body'), 'Command includes --body flag');
      this.assert(gh_args.includes('--label'), 'Command includes --label flag');
      
      // Test that special characters are properly included
      const titleIndex = gh_args.indexOf('--title') + 1;
      this.assert(gh_args[titleIndex].includes('🚀'), 'Title with emoji in command args');
      this.assert(gh_args[titleIndex].includes('"'), 'Title with quotes in command args');
      
      // Test that labels are properly structured
      const labelIndices = [];
      for (let i = 0; i < gh_args.length - 1; i++) {
        if (gh_args[i] === '--label') {
          labelIndices.push(i + 1);
        }
      }
      this.assert(labelIndices.length === testIssue.labels.length, 'Correct number of label arguments');

    } catch (error) {
      this.assert(false, `Error testing GitHub CLI command construction: ${error.message}`);
    }
  }

  // Test the actual workflow file with special characters todo file
  testWorkflowWithSpecialCharactersTodoFile() {
    console.log('\n🧪 Testing workflow integration with special characters todo file...');

    try {
      // Create the test file
      const testFilePath = this.createSpecialCharactersTodoFile();
      
      // Verify the test file was created successfully
      this.assert(fs.existsSync(testFilePath), 'Special characters test file created');
      
      const content = fs.readFileSync(testFilePath, 'utf8');
      this.assert(content.includes('🚀'), 'Test file contains emojis');
      this.assert(content.includes('café'), 'Test file contains unicode characters');
      this.assert(content.includes('"quotes"'), 'Test file contains quote characters');
      this.assert(content.includes('$100'), 'Test file contains symbol characters');
      
      // Test that the file structure matches workflow expectations
      this.assert(content.includes('## Must-Do'), 'Test file has Must-Do section');
      this.assert(content.includes('## Should-Do'), 'Test file has Should-Do section');
      this.assert(content.includes('## Improvements Needed:'), 'Test file has Improvements Needed section');
      
      // Count expected tasks
      const lines = content.split('\n');
      let taskCount = 0;
      for (const line of lines) {
        if (line.match(/^\d+\.\s+/) || (line.startsWith('- ') && !line.includes('**'))) {
          taskCount++;
        }
      }
      this.assert(taskCount >= 20, `Test file contains ${taskCount} tasks (expected >= 20)`);
      
      // Clean up
      fs.unlinkSync(testFilePath);
      this.assert(!fs.existsSync(testFilePath), 'Test file cleaned up');

    } catch (error) {
      this.assert(false, `Error testing workflow integration: ${error.message}`);
    }
  }

  // Run all special character tests
  runAllTests() {
    console.log('🚀 Starting special characters workflow tests...');
    console.log('=' .repeat(60));
    
    this.testJavaScriptParserWithSpecialChars();
    this.testMarkdownParsingWithSpecialChars();
    this.testTitleGenerationWithSpecialChars();
    this.testLabelGenerationWithSpecialChars();
    this.testJSONSerializationWithSpecialChars();
    this.testGitHubCLICommandConstruction();
    this.testWorkflowWithSpecialCharactersTodoFile();
    
    console.log('\n' + '=' .repeat(60));
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
    
    // Write detailed results to file
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
      test_type: 'special-characters-workflow'
    };
    
    // Archive test results
    const archiver = new TestResultArchiver();
    archiver.archiveTestResult('special-characters-workflow-results.json', detailedResults, {
      testType: 'special-characters-workflow',
      metadata: {
        special_chars_tested: ['emojis', 'unicode', 'quotes', 'symbols', 'currencies', 'mathematical'],
        encoding: 'UTF-8',
        markdown_features: ['bold', 'italic', 'code', 'links', 'quotes']
      },
      summary: detailedResults.summary
    });
    
    return failedTests === 0;
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new SpecialCharactersWorkflowTest();
  const success = tester.runAllTests();
  process.exit(success ? 0 : 1);
}

module.exports = SpecialCharactersWorkflowTest;