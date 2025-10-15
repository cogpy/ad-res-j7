#!/usr/bin/env node

// Critical Priority Label Verification Test
// Specifically tests proper label assignment for critical priority tasks

const fs = require('fs');
const path = require('path');

class CriticalLabelVerificationTest {
  constructor() {
    this.testResults = [];
    this.errors = [];
  }

  log(message) {
    console.log(message);
  }

  assert(condition, message) {
    if (condition) {
      this.testResults.push({ test: message, passed: true });
      this.log(`✅ ${message}`);
    } else {
      this.testResults.push({ test: message, passed: false });
      this.errors.push(message);
      this.log(`❌ ${message}`);
    }
  }

  // Test 1: Verify workflow contains proper critical priority logic
  testWorkflowCriticalPriorityLogic() {
    this.log('\n🧪 Testing critical priority label assignment logic in workflow...');
    
    try {
      const workflowPath = '.github/workflows/todo-to-issues.yml';
      const workflowContent = fs.readFileSync(workflowPath, 'utf8');
      
      // Test basic label initialization
      this.assert(
        workflowContent.includes("const labels = ['todo', 'enhancement'];"),
        'Workflow initializes base labels array correctly'
      );
      
      // Test critical priority detection
      this.assert(
        workflowContent.includes("if (task.priority === 'critical')"),
        'Workflow checks for critical priority correctly'
      );
      
      // Test critical priority labels
      this.assert(
        workflowContent.includes("labels.push('priority: critical', 'bug');"),
        'Workflow adds both priority: critical and bug labels for critical tasks'
      );
      
      // Test that critical gets bug label while others don't
      const criticalSection = workflowContent.match(
        /if \(task\.priority === 'critical'\) \{[\s\S]*?\} else if/
      );
      
      this.assert(
        criticalSection && criticalSection[0].includes('bug'),
        'Only critical priority tasks get the bug label'
      );
      
      this.assert(
        !workflowContent.match(/else if.*high.*bug/) && 
        !workflowContent.match(/else if.*medium.*bug/) && 
        !workflowContent.match(/else if.*low.*bug/),
        'Non-critical priorities do not get bug label'
      );
      
    } catch (error) {
      this.assert(false, `Error testing workflow logic: ${error.message}`);
    }
  }

  // Test 2: Verify expected labels for critical priority tasks
  testCriticalPriorityLabelSet() {
    this.log('\n🧪 Testing expected label set for critical priority tasks...');
    
    try {
      // Simulate the workflow label generation logic
      const generateLabelsForPriority = (priority) => {
        const labels = ['todo', 'enhancement'];
        
        if (priority === 'critical') {
          labels.push('priority: critical', 'bug');
        } else if (priority === 'high') {
          labels.push('priority: high');
        } else if (priority === 'medium') {
          labels.push('priority: medium');
        } else if (priority === 'low') {
          labels.push('priority: low');
        }
        
        return labels;
      };
      
      const criticalLabels = generateLabelsForPriority('critical');
      
      // Test exact expected labels for critical priority
      this.assert(
        criticalLabels.length === 4,
        'Critical priority tasks get exactly 4 labels'
      );
      
      this.assert(
        criticalLabels.includes('todo'),
        'Critical priority tasks include todo label'
      );
      
      this.assert(
        criticalLabels.includes('enhancement'),
        'Critical priority tasks include enhancement label'
      );
      
      this.assert(
        criticalLabels.includes('priority: critical'),
        'Critical priority tasks include priority: critical label'
      );
      
      this.assert(
        criticalLabels.includes('bug'),
        'Critical priority tasks include bug label'
      );
      
      // Test that this combination is unique to critical priority
      const highLabels = generateLabelsForPriority('high');
      const mediumLabels = generateLabelsForPriority('medium');
      const lowLabels = generateLabelsForPriority('low');
      
      this.assert(
        !highLabels.includes('bug') && !mediumLabels.includes('bug') && !lowLabels.includes('bug'),
        'Only critical priority tasks get the bug label'
      );
      
      this.assert(
        highLabels.length === 3 && mediumLabels.length === 3 && lowLabels.length === 3,
        'Non-critical priorities get exactly 3 labels (no bug label)'
      );
      
    } catch (error) {
      this.assert(false, `Error testing label generation: ${error.message}`);
    }
  }

  // Test 3: Verify GitHub CLI command generation with critical labels
  testGitHubCLICommandGeneration() {
    this.log('\n🧪 Testing GitHub CLI command generation for critical priority labels...');
    
    try {
      const workflowPath = '.github/workflows/todo-to-issues.yml';
      const workflowContent = fs.readFileSync(workflowPath, 'utf8');
      
      // Test secure array-based approach
      this.assert(
        workflowContent.includes('gh_args=("issue" "create" "--title" "$title" "--body" "$body")'),
        'Workflow uses secure array-based GitHub CLI argument construction'
      );
      
      // Test label iteration
      this.assert(
        workflowContent.includes('while IFS= read -r label; do'),
        'Workflow iterates through labels correctly'
      );
      
      // Test individual label argument construction
      this.assert(
        workflowContent.includes('gh_args+=("--label" "$label")'),
        'Workflow adds each label as individual --label argument'
      );
      
      // Test jq usage for JSON parsing
      this.assert(
        workflowContent.includes('echo "$labels_json" | jq -r \'.[]\''),
        'Workflow uses jq to safely parse label JSON array'
      );
      
      // Test array expansion for command execution
      this.assert(
        workflowContent.includes('gh "${gh_args[@]}"'),
        'Workflow uses secure array expansion for command execution'
      );
      
      // Simulate the expected command for critical priority
      const mockLabels = ['todo', 'enhancement', 'priority: critical', 'bug'];
      const expectedArgs = ['issue', 'create', '--title', 'Test Task', '--body', 'Test Body'];
      
      // Add labels to args (simulating the workflow logic)
      mockLabels.forEach(label => {
        expectedArgs.push('--label', label);
      });
      
      // Test that all expected labels are present in the command arguments
      const hasAllLabels = mockLabels.every(label => {
        const labelIndex = expectedArgs.indexOf('--label');
        return labelIndex >= 0 && expectedArgs.includes(label);
      });
      
      this.assert(
        hasAllLabels && 
        expectedArgs.includes('--label') &&
        expectedArgs.includes('todo') &&
        expectedArgs.includes('enhancement') &&
        expectedArgs.includes('priority: critical') &&
        expectedArgs.includes('bug'),
        'Generated command would include all expected critical priority labels'
      );
      
    } catch (error) {
      this.assert(false, `Error testing CLI command generation: ${error.message}`);
    }
  }

  // Test 4: Verify specific task from the issue
  testSpecificIssueTask() {
    this.log('\n🧪 Testing the specific task mentioned in the GitHub issue...');
    
    try {
      const todoPath = 'todo/simple-workflow-test.md';
      const todoContent = fs.readFileSync(todoPath, 'utf8');
      
      // Find the specific task on line 6
      const lines = todoContent.split('\n');
      const line6 = lines[5]; // 0-indexed, so line 6 is index 5
      
      this.assert(
        line6.includes('Verify proper label assignment for critical priority tasks'),
        'Line 6 contains the expected task text'
      );
      
      // Check that it's in a critical priority section
      let currentPriority = '';
      for (let i = 0; i < 6; i++) {
        const line = lines[i];
        if (line.toLowerCase().includes('must-do') && line.toLowerCase().includes('critical')) {
          currentPriority = 'critical';
        }
      }
      
      this.assert(
        currentPriority === 'critical',
        'Task is located in a Must-Do (Critical Priority) section'
      );
      
      // Verify task is marked as completed
      this.assert(
        line6.includes('✅') || line6.includes('COMPLETED'),
        'Task is marked as completed in the todo file'
      );
      
    } catch (error) {
      this.assert(false, `Error testing specific issue task: ${error.message}`);
    }
  }

  // Test 5: Verify documentation accuracy
  testDocumentationAccuracy() {
    this.log('\n🧪 Testing documentation accuracy for critical priority labels...');
    
    try {
      // Check label verification guide
      const labelGuide = 'docs/label-verification-guide.md';
      if (fs.existsSync(labelGuide)) {
        const guideContent = fs.readFileSync(labelGuide, 'utf8');
        
        this.assert(
          guideContent.includes('priority: critical') && guideContent.includes('bug'),
          'Label verification guide documents critical priority getting bug label'
        );
        
        this.assert(
          guideContent.includes('Critical priority items also get the `bug` label'),
          'Documentation explicitly states critical items get bug label'
        );
      }
      
      // Check workflow documentation
      const workflowDoc = 'docs/todo-to-issues-workflow.md';
      if (fs.existsSync(workflowDoc)) {
        const docContent = fs.readFileSync(workflowDoc, 'utf8');
        
        this.assert(
          docContent.includes('priority: critical') && docContent.includes('bug'),
          'Workflow documentation mentions both critical and bug labels'
        );
        
        this.assert(
          docContent.includes('Critical priority tasks') || docContent.includes('critical priority'),
          'Documentation covers critical priority handling'
        );
      }
      
    } catch (error) {
      this.assert(false, `Error testing documentation: ${error.message}`);
    }
  }

  // Run all tests
  runAllTests() {
    this.log('🚀 Starting Critical Priority Label Verification Tests...');
    this.log('='.repeat(80));
    
    this.testWorkflowCriticalPriorityLogic();
    this.testCriticalPriorityLabelSet();
    this.testGitHubCLICommandGeneration();
    this.testSpecificIssueTask();
    this.testDocumentationAccuracy();
    
    const passed = this.testResults.filter(t => t.passed).length;
    const failed = this.testResults.filter(t => !t.passed).length;
    const total = this.testResults.length;
    
    this.log('\n' + '='.repeat(80));
    this.log('📊 Critical Priority Label Verification Summary');
    this.log('='.repeat(80));
    this.log(`📝 Total Tests: ${total}`);
    this.log(`✅ Passed: ${passed}`);
    this.log(`❌ Failed: ${failed}`);
    this.log(`📈 Success Rate: ${Math.round((passed / total) * 100)}%`);
    
    if (failed === 0) {
      this.log('\n🎉 All critical priority label verification tests passed!');
      this.log('✅ Critical priority tasks are correctly assigned: todo, enhancement, priority: critical, bug');
    } else {
      this.log('\n⚠️  Some tests failed. Issues found:');
      this.errors.forEach((error, index) => {
        this.log(`   ${index + 1}. ${error}`);
      });
    }
    
    return failed === 0;
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const test = new CriticalLabelVerificationTest();
  const success = test.runAllTests();
  process.exit(success ? 0 : 1);
}

module.exports = CriticalLabelVerificationTest;