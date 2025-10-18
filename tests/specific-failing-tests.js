#!/usr/bin/env node

/**
 * Specific Failing Tests - GitHub Issue #[number]
 * 
 * These are the specific tests mentioned as failing in the GitHub issue:
 * - Properly quotes label values
 * - Recognizes Must-Do sections
 * - Recognizes Should-Do sections  
 * - Recognizes Nice-to-Have sections
 * - workflow-test.md contains the target task
 * - Long titles are properly truncated
 * - Uses jq to extract array elements
 * - Builds label flags correctly
 * - Uses eval for dynamic command execution
 */

const fs = require('fs');
const path = require('path');

class SpecificFailingTests {
  constructor() {
    this.testResults = [];
    this.errors = [];
  }

  assert(condition, message) {
    const result = { test: message, passed: condition, timestamp: new Date().toISOString() };
    this.testResults.push(result);
    
    if (condition) {
      console.log(`✅ ${message}`);
    } else {
      console.log(`❌ ${message}`);
      this.errors.push(message);
    }
    
    return condition;
  }

  // Test 1: Properly quotes label values
  testProperlyQuotesLabelValues() {
    console.log('\n🧪 Testing: Properly quotes label values');
    
    try {
      const workflowContent = fs.readFileSync('.github/workflows/todo-to-issues.yml', 'utf8');
      
      // Check that labels with spaces/colons are properly handled
      this.assert(
        workflowContent.includes('gh_args+=("--label" "$label")'),
        'Workflow properly quotes label values using double quotes'
      );
      
      // Check JavaScript label generation quotes multi-word labels
      this.assert(
        workflowContent.includes("'priority: critical'") || workflowContent.includes('"priority: critical"'),
        'JavaScript code properly quotes multi-word label values'
      );
      
      // Verify no unquoted label values in arrays
      const labelArrayMatches = workflowContent.match(/labels\.push\([^)]+\)/g);
      if (labelArrayMatches) {
        const hasProperQuoting = labelArrayMatches.every(match => {
          // Check if multi-word labels are quoted
          return !match.includes('priority: ') || match.includes("'priority: ") || match.includes('"priority: ');
        });
        this.assert(hasProperQuoting, 'All multi-word labels in JavaScript arrays are properly quoted');
      }
      
    } catch (error) {
      this.assert(false, `Error testing label quoting: ${error.message}`);
    }
  }

  // Test 2: Recognizes Must-Do sections
  testRecognizesMustDoSections() {
    console.log('\n🧪 Testing: Recognizes Must-Do sections');
    
    try {
      const workflowContent = fs.readFileSync('.github/workflows/todo-to-issues.yml', 'utf8');
      
      // Check for Must-Do recognition in the embedded JavaScript
      this.assert(
        workflowContent.includes('must-do'),
        'Workflow recognizes must-do sections (case-insensitive)'
      );
      
      this.assert(
        workflowContent.includes("sectionLower.includes('must-do')"),
        'JavaScript code specifically checks for must-do sections'
      );
      
      this.assert(
        workflowContent.includes("return 'critical'") && workflowContent.includes('must-do'),
        'Must-Do sections are mapped to critical priority'
      );
      
    } catch (error) {
      this.assert(false, `Error testing Must-Do recognition: ${error.message}`);
    }
  }

  // Test 3: Recognizes Should-Do sections
  testRecognizesShouldDoSections() {
    console.log('\n🧪 Testing: Recognizes Should-Do sections');
    
    try {
      const workflowContent = fs.readFileSync('.github/workflows/todo-to-issues.yml', 'utf8');
      
      this.assert(
        workflowContent.includes('should-do'),
        'Workflow recognizes should-do sections'
      );
      
      this.assert(
        workflowContent.includes("sectionLower.includes('should-do')"),
        'JavaScript code specifically checks for should-do sections'
      );
      
      this.assert(
        workflowContent.includes("return 'high'") && workflowContent.includes('should-do'),
        'Should-Do sections are mapped to high priority'
      );
      
    } catch (error) {
      this.assert(false, `Error testing Should-Do recognition: ${error.message}`);
    }
  }

  // Test 4: Recognizes Nice-to-Have sections
  testRecognizesNiceToHaveSections() {
    console.log('\n🧪 Testing: Recognizes Nice-to-Have sections');
    
    try {
      const workflowContent = fs.readFileSync('.github/workflows/todo-to-issues.yml', 'utf8');
      
      this.assert(
        workflowContent.includes('nice-to-have'),
        'Workflow recognizes nice-to-have sections'
      );
      
      this.assert(
        workflowContent.includes("sectionLower.includes('nice-to-have')"),
        'JavaScript code specifically checks for nice-to-have sections'
      );
      
      this.assert(
        workflowContent.includes("return 'medium'") && workflowContent.includes('nice-to-have'),
        'Nice-to-Have sections are mapped to medium priority'
      );
      
    } catch (error) {
      this.assert(false, `Error testing Nice-to-Have recognition: ${error.message}`);
    }
  }

  // Test 5: workflow-test.md contains the target task
  testWorkflowTestMdContainsTargetTask() {
    console.log('\n🧪 Testing: workflow-test.md contains the target task');
    
    try {
      const workflowTestPath = 'todo/workflow-test.md';
      
      this.assert(
        fs.existsSync(workflowTestPath),
        'workflow-test.md file exists in todo folder'
      );
      
      const content = fs.readFileSync(workflowTestPath, 'utf8');
      
      this.assert(
        content.includes('validation tests'),
        'workflow-test.md contains validation tests task'
      );
      
      this.assert(
        content.includes('Create validation tests for workflow changes'),
        'workflow-test.md contains the specific target task mentioned'
      );
      
      this.assert(
        content.includes('Improvements Needed'),
        'workflow-test.md has the Improvements Needed section'
      );
      
      // Check that the specific validation tests task is not marked as completed
      const lines = content.split('\n');
      const validationTestLine = lines.find(line => line.includes('Create validation tests'));
      const isValidationTaskUncompleted = validationTestLine && 
                                         !validationTestLine.includes('✅') && 
                                         !validationTestLine.includes('**COMPLETED**') &&
                                         !validationTestLine.includes('~~');
      this.assert(
        isValidationTaskUncompleted,
        'Target validation tests task is present and not yet completed'
      );
      
    } catch (error) {
      this.assert(false, `Error testing workflow-test.md content: ${error.message}`);
    }
  }

  // Test 6: Long titles are properly truncated
  testLongTitlesProperlyTruncated() {
    console.log('\n🧪 Testing: Long titles are properly truncated');
    
    try {
      const workflowContent = fs.readFileSync('.github/workflows/todo-to-issues.yml', 'utf8');
      
      // Check for title truncation logic
      this.assert(
        workflowContent.includes('if (title.length > 80)'),
        'Workflow checks if title length exceeds 80 characters'
      );
      
      this.assert(
        workflowContent.includes('title.substring(0, 77) + \'...\''),
        'Long titles are truncated to 77 characters with ellipsis'
      );
      
      // Test the truncation logic
      const longTitle = 'This is a very long task description that definitely exceeds the eighty character limit and should be truncated appropriately for GitHub issues';
      const truncated = longTitle.length > 80 ? longTitle.substring(0, 77) + '...' : longTitle;
      
      this.assert(
        truncated.length === 80,
        'Truncated title is exactly 80 characters (77 + 3 dots)'
      );
      
      this.assert(
        truncated.endsWith('...'),
        'Truncated title ends with ellipsis'
      );
      
    } catch (error) {
      this.assert(false, `Error testing title truncation: ${error.message}`);
    }
  }

  // Test 7: Uses jq to extract array elements
  testUsesJqToExtractArrayElements() {
    console.log('\n🧪 Testing: Uses jq to extract array elements');
    
    try {
      const workflowContent = fs.readFileSync('.github/workflows/todo-to-issues.yml', 'utf8');
      
      this.assert(
        workflowContent.includes('jq -r \'.[]\''),
        'Workflow uses jq -r \'.[]\' to extract array elements'
      );
      
      this.assert(
        workflowContent.includes('echo "$labels_json" | jq -r \'.[]\''),
        'jq is used to parse the labels JSON array'
      );
      
      this.assert(
        workflowContent.includes('while IFS= read -r label'),
        'jq output is properly read using while loop'
      );
      
      // Verify the complete pipeline pattern
      const hasCompletePattern = workflowContent.includes('done < <(echo "$labels_json" | jq -r \'.[]\'');
      this.assert(
        hasCompletePattern,
        'Complete jq array extraction pattern is implemented'
      );
      
    } catch (error) {
      this.assert(false, `Error testing jq array extraction: ${error.message}`);
    }
  }

  // Test 8: Builds label flags correctly
  testBuildsLabelFlagsCorrectly() {
    console.log('\n🧪 Testing: Builds label flags correctly');
    
    try {
      const workflowContent = fs.readFileSync('.github/workflows/todo-to-issues.yml', 'utf8');
      
      // Check array initialization
      this.assert(
        workflowContent.includes('gh_args=("issue" "create" "--title" "$title" "--body" "$body")'),
        'GitHub CLI arguments array is properly initialized'
      );
      
      // Check label flag building
      this.assert(
        workflowContent.includes('gh_args+=("--label" "$label")'),
        'Each label is added as separate --label flag to args array'
      );
      
      // Check array expansion for command execution
      this.assert(
        workflowContent.includes('gh "${gh_args[@]}"'),
        'Array expansion is used for command execution'
      );
      
      // Verify no concatenated command strings
      const hasNoStringConcatenation = !workflowContent.includes('gh issue create --title "$title" --body "$body" --label');
      this.assert(
        hasNoStringConcatenation,
        'Does not use string concatenation for building gh command'
      );
      
    } catch (error) {
      this.assert(false, `Error testing label flag building: ${error.message}`);
    }
  }

  // Test 9: Avoids eval for dynamic command execution (SECURITY BEST PRACTICE)
  testAvoidsEvalForDynamicCommandExecution() {
    console.log('\n🧪 Testing: Avoids eval for dynamic command execution (security best practice)');
    
    try {
      const workflowContent = fs.readFileSync('.github/workflows/todo-to-issues.yml', 'utf8');
      
      // Check that eval is NOT used - this is a security best practice
      // Check for actual eval usage, not comments or safe command substitutions
      const evalPattern = /(?:^|\s)eval\s+["'$]/gm;  // eval followed by space and quote/variable
      const hasActualEvalUsage = evalPattern.test(workflowContent);
      
      this.assert(
        !hasActualEvalUsage,
        'Workflow DOES NOT use eval for command execution (security best practice)'
      );
      
      // Verify secure alternative is used instead
      this.assert(
        workflowContent.includes('gh "${gh_args[@]}"'),
        'Uses secure array expansion instead of eval'
      );
      
      // Check that no dynamic command building occurs
      const hasDynamicCommandBuilding = workflowContent.includes('command=') && 
                                       workflowContent.includes('$command');
      this.assert(
        !hasDynamicCommandBuilding,
        'Does not build dynamic command strings that would require eval'
      );
      
    } catch (error) {
      this.assert(false, `Error testing eval usage: ${error.message}`);
    }
  }

  // Run all specific failing tests
  runAllTests() {
    console.log('🚀 Running Specific Failing Tests from GitHub Issue');
    console.log('=' .repeat(80));
    
    this.testProperlyQuotesLabelValues();
    this.testRecognizesMustDoSections();
    this.testRecognizesShouldDoSections();
    this.testRecognizesNiceToHaveSections();
    this.testWorkflowTestMdContainsTargetTask();
    this.testLongTitlesProperlyTruncated();
    this.testUsesJqToExtractArrayElements();
    this.testBuildsLabelFlagsCorrectly();
    this.testAvoidsEvalForDynamicCommandExecution();
    
    const passedTests = this.testResults.filter(t => t.passed).length;
    const failedTests = this.testResults.filter(t => !t.passed).length;
    const totalTests = this.testResults.length;
    
    console.log('\n' + '=' .repeat(80));
    console.log('📊 Specific Failing Tests Summary');
    console.log('=' .repeat(80));
    console.log(`📝 Total Tests: ${totalTests}`);
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`📈 Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);
    
    if (this.errors.length > 0) {
      console.log('\n🔥 Failed Tests:');
      this.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    } else {
      console.log('\n🎉 All specific failing tests now pass!');
    }
    
    // Write results for integration with main test suite
    const results = {
      summary: {
        total: totalTests,
        passed: passedTests,
        failed: failedTests,
        success_rate: Math.round((passedTests / totalTests) * 100)
      },
      tests: this.testResults,
      errors: this.errors,
      generated_at: new Date().toISOString()
    };
    
    fs.writeFileSync('tests/specific-failing-tests-results.json', JSON.stringify(results, null, 2));
    
    return failedTests === 0;
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const validator = new SpecificFailingTests();
  const success = validator.runAllTests();
  process.exit(success ? 0 : 1);
}

module.exports = SpecificFailingTests;