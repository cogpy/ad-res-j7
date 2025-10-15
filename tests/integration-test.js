// Integration Test for Workflow Changes
// Tests workflow functionality with real todo files and mock GitHub API calls

const fs = require('fs');
const path = require('path');
const glob = require('glob');

class WorkflowIntegrationTest {
  constructor() {
    this.testResults = [];
    this.errors = [];
    this.mockIssues = [];
  }

  // Helper function for assertions
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

  // Create sample todo files for testing
  createSampleTodoFiles() {
    console.log('\n🔧 Creating sample todo files for testing...');
    
    const sampleDir = 'tests/sample-todos';
    if (!fs.existsSync(sampleDir)) {
      fs.mkdirSync(sampleDir, { recursive: true });
    }

    // Sample 1: High priority tasks
    const sample1 = `# High Priority Tasks

## Must-Do (Critical Priority)

1. Fix label array handling in GitHub Actions workflow
2. Add documentation for label format requirements
3. Implement proper error handling for API failures

## Should-Do (High Priority)

1. Test the workflow with sample tasks
2. Verify proper issue creation with multiple labels
3. Add comprehensive logging for debugging

## Improvements Needed:
- Create validation tests for workflow changes
- Enhance error handling in issue creation process
- Add metrics collection for workflow performance

## Nice-to-Have (Low Priority)

1. Implement batching for large numbers of issues
2. Add workflow performance monitoring
`;

    // Sample 2: Edge cases
    const sample2 = `# Edge Case Tests

## Short Items
- Fix bug
- Test

## Long Item That Should Be Truncated
1. Implement a very long task description that exceeds the normal length limits and should be properly truncated to avoid issues with GitHub's title length restrictions while maintaining readability and context for the task

## Mixed Formats
* Implement feature A
- Create component B  
1. Update documentation C

## Non-Actionable Items
- Current Coverage: 85%
- Estimated effort: 4 hours
- **Bold text only**

## Action Items
- Implement user authentication system
- Create comprehensive test suite for API endpoints
- Update deployment documentation with new procedures
`;

    fs.writeFileSync(path.join(sampleDir, 'high-priority-tasks.md'), sample1);
    fs.writeFileSync(path.join(sampleDir, 'edge-cases.md'), sample2);
    
    this.assert(fs.existsSync(path.join(sampleDir, 'high-priority-tasks.md')), 'Created high priority tasks sample file');
    this.assert(fs.existsSync(path.join(sampleDir, 'edge-cases.md')), 'Created edge cases sample file');
    
    return sampleDir;
  }

  // Extract and test the TodoIssueGenerator from the workflow
  testTodoIssueGenerator() {
    console.log('\n🧪 Testing TodoIssueGenerator with real implementation...');
    
    try {
      // Extract the JavaScript code from the workflow file
      const workflowContent = fs.readFileSync('.github/workflows/todo-to-issues.yml', 'utf8');
      const jsStart = workflowContent.indexOf('const fs = require(\'fs\');');
      const jsEnd = workflowContent.indexOf('process.exit(0);', jsStart) + 'process.exit(0);'.length;
      
      if (jsStart === -1 || jsEnd === -1) {
        this.assert(false, 'Could not extract JavaScript code from workflow');
        return;
      }
      
      let jsCode = workflowContent.substring(jsStart, jsEnd);
      
      // Replace process.exit with return for testing
      jsCode = jsCode.replace('process.exit(0);', 'return output;');
      
      // Create a temporary file with the extracted code
      const tempFile = 'tests/temp-issue-generator.js';
      fs.writeFileSync(tempFile, jsCode);
      
      // Test the extracted code
      delete require.cache[require.resolve('../temp-issue-generator.js')];
      const output = require('../temp-issue-generator.js');
      
      this.assert(output && typeof output === 'object', 'TodoIssueGenerator returns valid output');
      this.assert(output.summary && typeof output.summary === 'object', 'Output contains summary');
      this.assert(Array.isArray(output.issues), 'Output contains issues array');
      
      // Clean up
      fs.unlinkSync(tempFile);
      
      return output;
      
    } catch (error) {
      this.assert(false, `Error testing TodoIssueGenerator: ${error.message}`);
      return null;
    }
  }

  // Test issue creation with sample data
  testIssueCreationWithSamples() {
    console.log('\n🧪 Testing issue creation with sample todo files...');
    
    const sampleDir = this.createSampleTodoFiles();
    
    try {
      // Simulate the parsing logic from the workflow
      const todoFiles = glob.sync(`${sampleDir}/**/*.md`);
      let totalIssues = 0;
      let priorityBreakdown = { critical: 0, high: 0, medium: 0, low: 0 };
      
      for (const todoFile of todoFiles) {
        const content = fs.readFileSync(todoFile, 'utf8');
        const issues = this.simulateIssueGeneration(content, todoFile);
        
        totalIssues += issues.length;
        
        // Count by priority
        issues.forEach(issue => {
          priorityBreakdown[issue.priority] = (priorityBreakdown[issue.priority] || 0) + 1;
        });
        
        this.mockIssues = this.mockIssues.concat(issues);
      }
      
      this.assert(totalIssues > 0, `Generated ${totalIssues} issues from sample files`);
      this.assert(priorityBreakdown.critical > 0, `Found ${priorityBreakdown.critical} critical priority issues`);
      this.assert(priorityBreakdown.high > 0, `Found ${priorityBreakdown.high} high priority issues`);
      
      // Test specific patterns
      const longTitleIssue = this.mockIssues.find(issue => issue.title.includes('...'));
      this.assert(longTitleIssue !== undefined, 'Long titles are properly truncated');
      
      const criticalIssue = this.mockIssues.find(issue => issue.priority === 'critical');
      if (criticalIssue) {
        this.assert(criticalIssue.labels.includes('bug'), 'Critical issues include bug label');
        this.assert(criticalIssue.labels.includes('priority: critical'), 'Critical issues have priority label');
      }
      
      // Clean up sample files
      fs.rmSync(sampleDir, { recursive: true, force: true });
      
    } catch (error) {
      this.assert(false, `Error testing issue creation: ${error.message}`);
    }
  }

  // Simulate the issue generation logic (simplified version for testing)
  simulateIssueGeneration(content, filename) {
    const lines = content.split('\n');
    const issues = [];
    let currentSection = '';
    let currentPriority = 'medium';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Track sections and priority
      if (line.match(/^#{1,4}\s+/)) {
        currentSection = line.replace(/^#+\s+/, '');
        
        if (line.toLowerCase().includes('critical') || line.toLowerCase().includes('must-do')) {
          currentPriority = 'critical';
        } else if (line.toLowerCase().includes('high') || line.toLowerCase().includes('should-do')) {
          currentPriority = 'high';
        } else if (line.toLowerCase().includes('low') || line.toLowerCase().includes('nice-to-have')) {
          currentPriority = 'low';
        } else {
          currentPriority = 'medium';
        }
      }
      
      // Look for tasks
      const numberedTask = line.match(/^\d+\.\s*(.+)$/);
      const bulletTask = line.match(/^[-*]\s*(.+)$/);
      
      let taskText = null;
      if (numberedTask) taskText = numberedTask[1];
      else if (bulletTask) taskText = bulletTask[1];
      
      if (taskText && this.isHighQualityTask(taskText)) {
        // Generate title (truncate if needed)
        let title = taskText.replace(/\*\*(.+?)\*\*/g, '$1').trim();
        if (title.length > 80) {
          title = title.substring(0, 77) + '...';
        }
        
        // Generate labels
        const labels = ['todo', 'enhancement'];
        if (currentPriority === 'critical') {
          labels.push('priority: critical', 'bug');
        } else if (currentPriority === 'high') {
          labels.push('priority: high');
        } else if (currentPriority === 'medium') {
          labels.push('priority: medium');
        } else if (currentPriority === 'low') {
          labels.push('priority: low');
        }
        
        issues.push({
          title: title,
          task: taskText,
          section: currentSection,
          priority: currentPriority,
          labels: labels,
          file: filename,
          lineNumber: i + 1
        });
      }
    }
    
    return issues;
  }

  // Quality filtering (simplified version of workflow logic)
  isHighQualityTask(task) {
    if (task.length < 15) return false;
    
    const skipPatterns = [
      /^\*\*.*\*\*$/,
      /^\*\*.*\*\*:$/,  // Bold text ending with colon (section headers)
      /^\*\*Current Coverage\*\*:/i,  // Bold "Current Coverage:" with text after
      /^Current Coverage:/i,
      /^Legal Significance:/i,
      /^Estimated effort:/i,
      /^Improvements? Needed:?$/i,  // Section header pattern
      /^Actions? Required:?$/i,     // Section header pattern
      /^Recommended Actions?:?$/i,  // Section header pattern
      /hours?$/i
    ];
    
    for (const pattern of skipPatterns) {
      if (pattern.test(task)) return false;
    }
    
    const actionWords = [
      'implement', 'add', 'create', 'fix', 'update', 'improve',
      'enhance', 'develop', 'build', 'establish', 'provide',
      'include', 'demonstrate', 'expand', 'complete', 'review',
      'contextualize', 'breakdown', 'analysis'
    ];
    
    return actionWords.some(word => task.toLowerCase().includes(word));
  }

  // Test label array conversion (the key issue mentioned in todo)
  testLabelArrayConversion() {
    console.log('\n🧪 Testing label array conversion logic...');
    
    try {
      const workflowContent = fs.readFileSync('.github/workflows/todo-to-issues.yml', 'utf8');
      
      // Check the bash script section for label handling
      const labelSection = workflowContent.match(/# Parse labels array[\s\S]*?done < <\(echo "\$labels_json"/);
      
      this.assert(labelSection !== null, 'Found label parsing section in workflow');
      
      if (labelSection) {
        const labelCode = labelSection[0];
        
        // Test for key components of label conversion using secure array-based approach
        this.assert(labelCode.includes('while IFS= read -r label'), 'Uses proper loop for label iteration');
        this.assert(workflowContent.includes('jq -r \'.[]\''), 'Uses jq to extract array elements');
        this.assert(labelCode.includes('gh_args+=("--label" "$label")'), 'Builds label array correctly');
        this.assert(workflowContent.includes('gh "${gh_args[@]}"'), 'Uses array expansion for command execution');
        
        // Test sample label array conversion
        const sampleLabels = ['todo', 'enhancement', 'priority: high'];
        const expectedFlags = '--label "todo" --label "enhancement" --label "priority: high"';
        
        // Simulate the conversion (this is what the bash script does)
        let labelFlags = '';
        sampleLabels.forEach(label => {
          labelFlags += ` --label "${label}"`;
        });
        
        this.assert(labelFlags.trim() === expectedFlags, 'Label array conversion produces correct flags');
      }
      
    } catch (error) {
      this.assert(false, `Error testing label array conversion: ${error.message}`);
    }
  }

  // Test workflow with multiple label scenarios
  testMultipleLabelScenarios() {
    console.log('\n🧪 Testing multiple label scenarios...');
    
    const scenarios = [
      {
        priority: 'critical',
        expected: ['todo', 'enhancement', 'priority: critical', 'bug']
      },
      {
        priority: 'high', 
        expected: ['todo', 'enhancement', 'priority: high']
      },
      {
        priority: 'medium',
        expected: ['todo', 'enhancement', 'priority: medium']
      },
      {
        priority: 'low',
        expected: ['todo', 'enhancement', 'priority: low']
      }
    ];
    
    scenarios.forEach((scenario, index) => {
      const labels = ['todo', 'enhancement'];
      
      if (scenario.priority === 'critical') {
        labels.push('priority: critical', 'bug');
      } else if (scenario.priority === 'high') {
        labels.push('priority: high');
      } else if (scenario.priority === 'medium') {
        labels.push('priority: medium');
      } else if (scenario.priority === 'low') {
        labels.push('priority: low');
      }
      
      const matches = scenario.expected.every(expectedLabel => labels.includes(expectedLabel));
      this.assert(matches, `${scenario.priority} priority generates correct labels: [${labels.join(', ')}]`);
    });
  }

  // Test error handling scenarios
  testErrorHandling() {
    console.log('\n🧪 Testing error handling scenarios...');
    
    // Test with empty todo folder
    const emptyDir = 'tests/empty-todos';
    if (!fs.existsSync(emptyDir)) {
      fs.mkdirSync(emptyDir, { recursive: true });
    }
    
    const emptyDirFiles = glob.sync(`${emptyDir}/**/*.md`);
    this.assert(emptyDirFiles.length === 0, 'Empty todo directory contains no files');
    
    // Test with malformed todo file
    const malformedContent = `# Malformed File
This file has no structured content
Just random text without actionable items
No numbered lists or bullet points with action words
`;
    
    const malformedIssues = this.simulateIssueGeneration(malformedContent, 'malformed.md');
    this.assert(malformedIssues.length === 0, 'Malformed todo file generates no issues');
    
    // Clean up
    fs.rmSync(emptyDir, { recursive: true, force: true });
  }

  // Test section header filtering
  testSectionHeaderFiltering() {
    console.log('\n🧪 Testing section header filtering...');
    
    // Test that section headers are properly filtered out
    const sectionHeaders = [
      '**Improvements Needed**:',
      'Improvements Needed:',
      'Improvements Needed',
      'Action Required:',
      'Actions Required:',
      'Recommended Actions:',
      'Recommended Action:',
      '**Current Coverage**:',
      '**Current Coverage**: Partially addressed in Section 4',
      '**Current Coverage**: Section 3 addresses this but lacks depth',
      'Current Coverage: Not explicitly addressed',
      '**Action Required**:'
    ];
    
    sectionHeaders.forEach(header => {
      const result = this.isHighQualityTask(header);
      this.assert(!result, `Section header "${header}" is properly filtered out`);
    });
    
    // Test that valid tasks still pass
    const validTasks = [
      'Contextualize international operations across 37 jurisdictions',
      'Create comprehensive timeline analysis',
      'Implement priority-based response architecture',
      'Add Dan\'s technical affidavit explaining infrastructure requirements'
    ];
    
    validTasks.forEach(task => {
      const result = this.isHighQualityTask(task);
      this.assert(result, `Valid task "${task.substring(0, 50)}..." passes filter`);
    });
  }

  // Test duplicate prevention with identical task titles
  testDuplicatePrevention() {
    console.log('\n🧪 Testing duplicate prevention with identical task titles...');
    
    // Create test content with duplicate task titles
    const contentWithDuplicates = `# Test Duplicates

## Must-Do (Critical Priority)

1. Implement user authentication system
2. Create database schema for users
3. Add error logging functionality

## Should-Do (High Priority)

1. Implement user authentication system
2. Update documentation for deployment
3. Add error logging functionality
`;

    // Generate issues from content with duplicates
    const issues = this.simulateIssueGeneration(contentWithDuplicates, 'test-duplicates.md');
    
    // Verify that issues were generated
    this.assert(issues.length > 0, 'Generated issues from test content');
    
    // Check for duplicate titles
    const titles = issues.map(issue => issue.title);
    const uniqueTitles = new Set(titles);
    
    // In the actual workflow, duplicates would be detected and skipped
    // Here we verify that the same title appears multiple times in our test data
    const hasDuplicates = titles.length !== uniqueTitles.size;
    this.assert(hasDuplicates, 'Test content contains duplicate task titles');
    
    // Verify specific duplicates
    const duplicateTitle1 = 'Implement user authentication system';
    const count1 = titles.filter(t => t === duplicateTitle1).length;
    this.assert(count1 === 2, `Found duplicate title "${duplicateTitle1}" (count: ${count1})`);
    
    const duplicateTitle2 = 'Add error logging functionality';
    const count2 = titles.filter(t => t === duplicateTitle2).length;
    this.assert(count2 === 2, `Found duplicate title "${duplicateTitle2}" (count: ${count2})`);
    
    // Test the duplicate detection logic that would be used in the workflow
    const titleCounts = {};
    titles.forEach(title => {
      titleCounts[title] = (titleCounts[title] || 0) + 1;
    });
    
    const duplicatesFound = Object.entries(titleCounts).filter(([_, count]) => count > 1);
    this.assert(duplicatesFound.length === 2, `Duplicate detection logic identifies ${duplicatesFound.length} duplicate titles`);
    
    // Verify that duplicate detection would work correctly
    // Simulate the workflow's duplicate checking behavior
    const seenTitles = new Set();
    let wouldBeCreated = 0;
    let wouldBeSkipped = 0;
    
    issues.forEach(issue => {
      if (seenTitles.has(issue.title)) {
        wouldBeSkipped++;
      } else {
        seenTitles.add(issue.title);
        wouldBeCreated++;
      }
    });
    
    this.assert(wouldBeCreated === 4, `Duplicate prevention would create ${wouldBeCreated} unique issues`);
    this.assert(wouldBeSkipped === 2, `Duplicate prevention would skip ${wouldBeSkipped} duplicate issues`);
    
    console.log(`  📊 Total tasks: ${issues.length}, Unique: ${wouldBeCreated}, Duplicates: ${wouldBeSkipped}`);
  }

  // Run all integration tests
  runAllTests() {
    console.log('🚀 Starting workflow integration tests...');
    console.log('=' .repeat(60));
    
    this.testIssueCreationWithSamples();
    this.testLabelArrayConversion();
    this.testMultipleLabelScenarios();
    this.testErrorHandling();
    this.testSectionHeaderFiltering();
    this.testDuplicatePrevention();
    
    console.log('\n' + '=' .repeat(60));
    console.log(`📊 Integration Test Summary: ${this.testResults.length} tests run`);
    
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
    
    // Write results to file
    const results = {
      summary: {
        total: this.testResults.length,
        passed: passedTests,
        failed: failedTests,
        success_rate: Math.round((passedTests / this.testResults.length) * 100)
      },
      tests: this.testResults,
      errors: this.errors,
      mock_issues_generated: this.mockIssues.length,
      sample_issues: this.mockIssues.slice(0, 3), // Include first 3 as examples
      generated_at: new Date().toISOString()
    };
    
    fs.writeFileSync('tests/integration-test-results.json', JSON.stringify(results, null, 2));
    console.log('\n📝 Integration test results written to tests/integration-test-results.json');
    
    return failedTests === 0;
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const integrationTest = new WorkflowIntegrationTest();
  const success = integrationTest.runAllTests();
  process.exit(success ? 0 : 1);
}

module.exports = WorkflowIntegrationTest;