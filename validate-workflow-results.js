const fs = require('fs');

/**
 * Validation script for todo-to-issues workflow
 * This validates that the workflow correctly processes todo files and generates appropriate issues
 */

class WorkflowValidator {
  constructor() {
    this.validationResults = {
      passed: 0,
      failed: 0,
      errors: []
    };
  }

  // Validate issue structure
  validateIssueStructure(issue, index) {
    const requiredFields = ['title', 'body', 'labels', 'source'];
    const sourceFields = ['task', 'section', 'priority', 'file', 'lineNumber', 'type'];
    
    // Check required top-level fields
    for (const field of requiredFields) {
      if (!issue[field]) {
        this.addError(`Issue ${index}: Missing required field '${field}'`);
        return false;
      }
    }
    
    // Check source object structure
    for (const field of sourceFields) {
      if (!issue.source[field]) {
        this.addError(`Issue ${index}: Missing required source field '${field}'`);
        return false;
      }
    }
    
    // Validate title length
    if (issue.title.length > 80) {
      this.addError(`Issue ${index}: Title exceeds 80 characters: ${issue.title.length}`);
      return false;
    }
    
    // Validate labels array
    if (!Array.isArray(issue.labels) || issue.labels.length === 0) {
      this.addError(`Issue ${index}: Invalid labels array`);
      return false;
    }
    
    // Check required labels
    if (!issue.labels.includes('todo')) {
      this.addError(`Issue ${index}: Missing 'todo' label`);
      return false;
    }
    
    if (!issue.labels.includes('enhancement')) {
      this.addError(`Issue ${index}: Missing 'enhancement' label`);
      return false;
    }
    
    return true;
  }
  
  // Validate priority handling
  validatePriorityHandling(issue, index) {
    const validPriorities = ['critical', 'high', 'medium', 'low'];
    
    if (!validPriorities.includes(issue.source.priority)) {
      this.addError(`Issue ${index}: Invalid priority '${issue.source.priority}'`);
      return false;
    }
    
    const expectedPriorityLabel = `priority: ${issue.source.priority}`;
    if (!issue.labels.includes(expectedPriorityLabel)) {
      this.addError(`Issue ${index}: Missing priority label '${expectedPriorityLabel}'`);
      return false;
    }
    
    // Critical priority should also have bug label
    if (issue.source.priority === 'critical' && !issue.labels.includes('bug')) {
      this.addError(`Issue ${index}: Critical priority missing 'bug' label`);
      return false;
    }
    
    return true;
  }
  
  // Validate body content structure
  validateBodyContent(issue, index) {
    const body = issue.body;
    
    const requiredSections = [
      '## Task Description',
      '## Context',
      '## Implementation Notes',
      '## Acceptance Criteria'
    ];
    
    for (const section of requiredSections) {
      if (!body.includes(section)) {
        this.addError(`Issue ${index}: Missing body section '${section}'`);
        return false;
      }
    }
    
    // Check for required context information
    const contextChecks = [
      'Source File:',
      'Section:',
      'Priority:',
      'Line:'
    ];
    
    for (const check of contextChecks) {
      if (!body.includes(check)) {
        this.addError(`Issue ${index}: Missing context information '${check}'`);
        return false;
      }
    }
    
    return true;
  }
  
  // Validate duplicate detection would work
  validateNoDuplicates(issues) {
    const titles = new Set();
    const duplicates = [];
    
    issues.forEach((issue, index) => {
      if (titles.has(issue.title)) {
        duplicates.push({ index, title: issue.title });
      } else {
        titles.add(issue.title);
      }
    });
    
    if (duplicates.length > 0) {
      duplicates.forEach(dup => {
        this.addError(`Duplicate title found: "${dup.title}" at index ${dup.index}`);
      });
      return false;
    }
    
    return true;
  }
  
  // Validate priority distribution is reasonable
  validatePriorityDistribution(summary) {
    const { priorities } = summary;
    const total = summary.total_issues;
    
    // Check that we have some variety in priorities
    const priorityCount = Object.values(priorities).filter(count => count > 0).length;
    
    if (priorityCount < 2) {
      this.addError('Priority distribution too narrow - expected multiple priority levels');
      return false;
    }
    
    // Critical should not be majority (indicates poor filtering)
    if (priorities.critical > total * 0.7) {
      this.addError(`Too many critical priority tasks: ${priorities.critical}/${total} (${Math.round(priorities.critical/total*100)}%)`);
      return false;
    }
    
    return true;
  }
  
  addError(error) {
    this.validationResults.errors.push(error);
    this.validationResults.failed++;
  }
  
  addPass() {
    this.validationResults.passed++;
  }
  
  // Main validation function
  validateWorkflowResults(resultsFile = 'todo-issues-test.json') {
    console.log('🔍 Validating workflow results...\n');
    
    if (!fs.existsSync(resultsFile)) {
      console.error(`❌ Results file not found: ${resultsFile}`);
      return false;
    }
    
    let data;
    try {
      data = JSON.parse(fs.readFileSync(resultsFile, 'utf8'));
    } catch (error) {
      console.error(`❌ Failed to parse results file: ${error.message}`);
      return false;
    }
    
    console.log(`📊 Validating ${data.summary.total_issues} issues from ${data.summary.files_processed} files`);
    console.log(`📈 Priority distribution: Critical: ${data.summary.priorities.critical}, High: ${data.summary.priorities.high}, Medium: ${data.summary.priorities.medium}, Low: ${data.summary.priorities.low}\n`);
    
    // Test 1: Basic structure validation
    console.log('🔸 Testing issue structure...');
    let structureValid = true;
    data.issues.forEach((issue, index) => {
      if (this.validateIssueStructure(issue, index)) {
        this.addPass();
      } else {
        structureValid = false;
      }
    });
    
    // Test 2: Priority handling validation
    console.log('🔸 Testing priority handling...');
    let priorityValid = true;
    data.issues.forEach((issue, index) => {
      if (this.validatePriorityHandling(issue, index)) {
        this.addPass();
      } else {
        priorityValid = false;
      }
    });
    
    // Test 3: Body content validation
    console.log('🔸 Testing body content structure...');
    let bodyValid = true;
    data.issues.forEach((issue, index) => {
      if (this.validateBodyContent(issue, index)) {
        this.addPass();
      } else {
        bodyValid = false;
      }
    });
    
    // Test 4: Duplicate detection
    console.log('🔸 Testing for duplicates...');
    const noDuplicates = this.validateNoDuplicates(data.issues);
    if (noDuplicates) this.addPass();
    
    // Test 5: Priority distribution
    console.log('🔸 Testing priority distribution...');
    const distributionValid = this.validatePriorityDistribution(data.summary);
    if (distributionValid) this.addPass();
    
    // Results
    console.log('\n🎯 === VALIDATION RESULTS ===');
    console.log(`✅ Passed: ${this.validationResults.passed} checks`);
    console.log(`❌ Failed: ${this.validationResults.failed} checks`);
    
    if (this.validationResults.errors.length > 0) {
      console.log('\n🚨 Errors found:');
      this.validationResults.errors.forEach(error => {
        console.log(`  • ${error}`);
      });
    } else {
      console.log('\n🎉 All validation checks passed!');
    }
    
    // Write validation report
    const validationReport = {
      timestamp: new Date().toISOString(),
      summary: {
        total_checks: this.validationResults.passed + this.validationResults.failed,
        passed: this.validationResults.passed,
        failed: this.validationResults.failed,
        success_rate: Math.round((this.validationResults.passed / (this.validationResults.passed + this.validationResults.failed)) * 100)
      },
      tests: {
        structure_validation: structureValid,
        priority_handling: priorityValid,
        body_content: bodyValid,
        duplicate_detection: noDuplicates,
        priority_distribution: distributionValid
      },
      errors: this.validationResults.errors,
      input_summary: data.summary
    };
    
    fs.writeFileSync('validation-report.json', JSON.stringify(validationReport, null, 2));
    console.log('\n📄 Validation report saved to validation-report.json');
    
    return this.validationResults.failed === 0;
  }
}

// Run validation
const validator = new WorkflowValidator();
const success = validator.validateWorkflowResults();

process.exit(success ? 0 : 1);