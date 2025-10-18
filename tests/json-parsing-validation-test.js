/**
 * JSON Parsing Validation Test
 * Tests proper JSON parsing for workflow output with edge cases and error handling
 */

const fs = require('fs');
const path = require('path');

class JSONParsingValidationTest {
  constructor() {
    this.testResults = {
      passed: 0,
      failed: 0,
      errors: []
    };
  }

  addError(error) {
    this.testResults.errors.push(error);
    this.testResults.failed++;
  }

  addPass() {
    this.testResults.passed++;
  }

  // Test valid JSON structure
  testValidJSONStructure() {
    console.log('🧪 Testing valid JSON structure...');
    
    if (!fs.existsSync('todo-issues.json')) {
      this.addError('todo-issues.json file not found');
      return false;
    }

    try {
      const content = fs.readFileSync('todo-issues.json', 'utf8');
      const data = JSON.parse(content);
      
      // Test required fields
      const requiredFields = ['summary', 'issues', 'generated_at', 'generator_version'];
      for (const field of requiredFields) {
        if (!data[field]) {
          this.addError(`Missing required field: ${field}`);
          return false;
        }
      }
      
      // Test summary structure
      const summaryFields = ['total_issues', 'priorities', 'files_processed'];
      for (const field of summaryFields) {
        if (!data.summary[field]) {
          this.addError(`Missing summary field: ${field}`);
          return false;
        }
      }
      
      // Test priorities structure
      const priorityFields = ['critical', 'high', 'medium', 'low'];
      for (const field of priorityFields) {
        if (typeof data.summary.priorities[field] !== 'number') {
          this.addError(`Invalid priority field: ${field}`);
          return false;
        }
      }
      
      // Test issues array
      if (!Array.isArray(data.issues)) {
        this.addError('Issues field is not an array');
        return false;
      }
      
      console.log('✅ Valid JSON structure test passed');
      this.addPass();
      return true;
      
    } catch (error) {
      this.addError(`JSON parsing failed: ${error.message}`);
      return false;
    }
  }

  // Test individual issue structure
  testIssueStructure() {
    console.log('🧪 Testing individual issue structure...');
    
    try {
      const data = JSON.parse(fs.readFileSync('todo-issues.json', 'utf8'));
      
      if (data.issues.length === 0) {
        this.addError('No issues found to test');
        return false;
      }
      
      // Test first few issues
      for (let i = 0; i < Math.min(5, data.issues.length); i++) {
        const issue = data.issues[i];
        
        // Required fields
        const requiredFields = ['title', 'body', 'labels', 'source'];
        for (const field of requiredFields) {
          if (!issue[field]) {
            this.addError(`Issue ${i}: Missing field ${field}`);
            return false;
          }
        }
        
        // Labels must be array
        if (!Array.isArray(issue.labels)) {
          this.addError(`Issue ${i}: Labels is not an array`);
          return false;
        }
        
        // Title must be string
        if (typeof issue.title !== 'string') {
          this.addError(`Issue ${i}: Title is not a string`);
          return false;
        }
        
        // Body must be string
        if (typeof issue.body !== 'string') {
          this.addError(`Issue ${i}: Body is not a string`);
          return false;
        }
        
        // Source must be object
        if (typeof issue.source !== 'object') {
          this.addError(`Issue ${i}: Source is not an object`);
          return false;
        }
      }
      
      console.log('✅ Issue structure test passed');
      this.addPass();
      return true;
      
    } catch (error) {
      this.addError(`Issue structure test failed: ${error.message}`);
      return false;
    }
  }

  // Test malformed JSON handling
  testMalformedJSONHandling() {
    console.log('🧪 Testing malformed JSON handling...');
    
    const testCases = [
      {
        name: 'Invalid JSON syntax',
        content: '{"summary": {"total_issues": 5,}}'  // trailing comma
      },
      {
        name: 'Missing required fields',
        content: '{"issues": []}'  // missing summary
      },
      {
        name: 'Invalid issues array',
        content: '{"summary": {"total_issues": 1}, "issues": "not_an_array"}'
      },
      {
        name: 'Invalid priority structure',
        content: '{"summary": {"total_issues": 1, "priorities": "not_an_object"}, "issues": []}'
      }
    ];
    
    let passedTests = 0;
    
    for (const testCase of testCases) {
      const testFile = `test-malformed-${passedTests}.json`;
      
      try {
        fs.writeFileSync(testFile, testCase.content);
        
        // Test that our validation catches this
        let caughtError = false;
        try {
          const data = JSON.parse(testCase.content);
          
          // Check if our validation would catch missing fields
          if (!data.summary || !data.issues) {
            caughtError = true;
          }
          
          if (!Array.isArray(data.issues)) {
            caughtError = true;
          }
          
          // Check priorities structure validation
          if (data.summary && data.summary.priorities && typeof data.summary.priorities !== 'object') {
            caughtError = true;
          }
          
          if (data.summary && data.summary.priorities && typeof data.summary.priorities === 'object') {
            const priorityFields = ['critical', 'high', 'medium', 'low'];
            for (const field of priorityFields) {
              if (data.summary.priorities[field] !== undefined && typeof data.summary.priorities[field] !== 'number') {
                caughtError = true;
                break;
              }
            }
          }
          
        } catch (parseError) {
          caughtError = true;  // JSON.parse caught it
        }
        
        if (caughtError) {
          console.log(`  ✅ Correctly detected malformed JSON: ${testCase.name}`);
          passedTests++;
        } else {
          this.addError(`Failed to detect malformed JSON: ${testCase.name}`);
        }
        
        // Cleanup
        if (fs.existsSync(testFile)) {
          fs.unlinkSync(testFile);
        }
        
      } catch (error) {
        this.addError(`Error testing malformed JSON case ${testCase.name}: ${error.message}`);
      }
    }
    
    if (passedTests === testCases.length) {
      console.log('✅ Malformed JSON handling test passed');
      this.addPass();
      return true;
    } else {
      this.addError(`Only ${passedTests}/${testCases.length} malformed JSON tests passed`);
      return false;
    }
  }

  // Test label parsing validation
  testLabelParsingValidation() {
    console.log('🧪 Testing label parsing validation...');
    
    try {
      const data = JSON.parse(fs.readFileSync('todo-issues.json', 'utf8'));
      
      // Check that all issues have valid labels
      for (let i = 0; i < data.issues.length; i++) {
        const issue = data.issues[i];
        
        if (!Array.isArray(issue.labels)) {
          this.addError(`Issue ${i}: Labels is not an array`);
          return false;
        }
        
        if (issue.labels.length === 0) {
          this.addError(`Issue ${i}: No labels found`);
          return false;
        }
        
        // Check each label is valid
        for (const label of issue.labels) {
          if (typeof label !== 'string') {
            this.addError(`Issue ${i}: Label is not a string: ${label}`);
            return false;
          }
          
          if (label.length === 0) {
            this.addError(`Issue ${i}: Empty label found`);
            return false;
          }
          
          if (label.length > 50) {
            this.addError(`Issue ${i}: Label too long: ${label}`);
            return false;
          }
          
          // Check for invalid characters (GitHub label requirements)
          if (!/^[a-zA-Z0-9:\ ._-]+$/.test(label)) {
            this.addError(`Issue ${i}: Invalid label format: ${label}`);
            return false;
          }
        }
        
        // Ensure minimum required labels
        if (!issue.labels.includes('todo')) {
          this.addError(`Issue ${i}: Missing 'todo' label`);
          return false;
        }
        
        if (!issue.labels.includes('enhancement')) {
          this.addError(`Issue ${i}: Missing 'enhancement' label`);
          return false;
        }
      }
      
      console.log('✅ Label parsing validation test passed');
      this.addPass();
      return true;
      
    } catch (error) {
      this.addError(`Label parsing validation failed: ${error.message}`);
      return false;
    }
  }

  // Test new validation features
  testNewValidationFeatures() {
    console.log('🧪 Testing new validation features...');
    
    try {
      const data = JSON.parse(fs.readFileSync('todo-issues.json', 'utf8'));
      
      // Check for new fields
      if (!data.schema_version) {
        this.addError('Missing schema_version field');
        return false;
      }
      
      if (!data.summary.validation_summary) {
        this.addError('Missing validation_summary field');
        return false;
      }
      
      const validation = data.summary.validation_summary;
      
      // Check validation summary structure
      const validationFields = ['original_count', 'validated_count', 'skipped_count'];
      for (const field of validationFields) {
        if (typeof validation[field] !== 'number') {
          this.addError(`Invalid validation field: ${field}`);
          return false;
        }
      }
      
      // Check that counts make sense
      if (validation.validated_count + validation.skipped_count !== validation.original_count) {
        this.addError('Validation counts do not add up correctly');
        return false;
      }
      
      if (validation.validated_count !== data.summary.total_issues) {
        this.addError('Validated count does not match total issues');
        return false;
      }
      
      console.log('✅ New validation features test passed');
      this.addPass();
      return true;
      
    } catch (error) {
      this.addError(`New validation features test failed: ${error.message}`);
      return false;
    }
  }

  // Test duplicate prevention
  testDuplicatePrevention() {
    console.log('🧪 Testing duplicate prevention...');
    
    try {
      const data = JSON.parse(fs.readFileSync('todo-issues.json', 'utf8'));
      
      const titles = new Set();
      const duplicates = [];
      
      for (const issue of data.issues) {
        const normalizedTitle = issue.title.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
        
        if (titles.has(normalizedTitle)) {
          duplicates.push(issue.title);
        } else {
          titles.add(normalizedTitle);
        }
      }
      
      if (duplicates.length > 0) {
        this.addError(`Found ${duplicates.length} duplicate titles: ${duplicates.slice(0, 3).join(', ')}`);
        return false;
      }
      
      console.log('✅ Duplicate prevention test passed');
      this.addPass();
      return true;
      
    } catch (error) {
      this.addError(`Duplicate prevention test failed: ${error.message}`);
      return false;
    }
  }

  // Run all tests
  runAllTests() {
    console.log('🚀 Starting JSON Parsing Validation Tests');
    console.log('==========================================\n');

    const tests = [
      () => this.testValidJSONStructure(),
      () => this.testIssueStructure(),
      () => this.testMalformedJSONHandling(),
      () => this.testLabelParsingValidation(),
      () => this.testNewValidationFeatures(),
      () => this.testDuplicatePrevention()
    ];

    for (const test of tests) {
      test();
    }

    // Results
    console.log('\n🎯 === JSON PARSING VALIDATION RESULTS ===');
    console.log(`✅ Passed: ${this.testResults.passed} tests`);
    console.log(`❌ Failed: ${this.testResults.failed} tests`);

    if (this.testResults.errors.length > 0) {
      console.log('\n🚨 Errors found:');
      this.testResults.errors.forEach(error => {
        console.log(`  • ${error}`);
      });
    } else {
      console.log('\n🎉 All JSON parsing validation tests passed!');
    }

    // Save test results
    const report = {
      timestamp: new Date().toISOString(),
      test_name: 'JSON Parsing Validation',
      summary: {
        total_tests: this.testResults.passed + this.testResults.failed,
        passed: this.testResults.passed,
        failed: this.testResults.failed,
        success_rate: Math.round((this.testResults.passed / (this.testResults.passed + this.testResults.failed)) * 100)
      },
      errors: this.testResults.errors
    };

    fs.writeFileSync('json-parsing-validation-report.json', JSON.stringify(report, null, 2));
    console.log('\n📄 Test report saved to json-parsing-validation-report.json');

    return this.testResults.failed === 0;
  }
}

// Run the tests
const tester = new JSONParsingValidationTest();
const success = tester.runAllTests();

process.exit(success ? 0 : 1);