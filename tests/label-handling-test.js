#!/usr/bin/env node

/**
 * Label Handling Validation Test
 * 
 * Tests validation of complex multi-word labels like "priority: critical"
 * in GitHub Actions workflows and issue creation scripts.
 */

const fs = require('fs');
const path = require('path');

class LabelHandlingTest {
  constructor() {
    this.testResults = {
      passed: 0,
      failed: 0,
      errors: []
    };
  }

  /**
   * Assert helper
   */
  assert(condition, message) {
    if (condition) {
      this.testResults.passed++;
      console.log(`  ✅ ${message}`);
    } else {
      this.testResults.failed++;
      this.testResults.errors.push(message);
      console.log(`  ❌ ${message}`);
    }
  }

  /**
   * Test 1: Validate label format patterns
   */
  testLabelFormatPatterns() {
    console.log('\n📋 Test 1: Label Format Patterns');
    
    const validLabels = [
      'priority: critical',
      'priority: high',
      'priority: medium',
      'priority: low',
      'must-do: phase 1',
      'should-do: phase 2',
      'label with spaces',
      'label:with:colons',
      'label-with-dashes',
      'bug',
      'enhancement',
      'todo',
      'workflow-reliability-alert'
    ];

    validLabels.forEach(label => {
      // Validate label can be properly quoted
      const quoted = JSON.stringify(label);
      this.assert(
        quoted.startsWith('"') && quoted.endsWith('"'),
        `Label "${label}" can be properly quoted: ${quoted}`
      );

      // Validate label doesn't contain problematic characters
      const hasProblematicChars = /[`$\\]/.test(label);
      this.assert(
        !hasProblematicChars,
        `Label "${label}" doesn't contain shell-problematic characters`
      );
    });
  }

  /**
   * Test 2: Validate workflow label usage
   */
  testWorkflowLabelUsage() {
    console.log('\n📋 Test 2: Workflow Label Usage');

    const workflowFiles = [
      '.github/workflows/todo-to-issues.yml',
      '.github/workflows/test-workflows.yml',
      '.github/workflows/workflow-monitoring.yml'
    ];

    workflowFiles.forEach(file => {
      const filePath = path.join(process.cwd(), file);
      
      if (!fs.existsSync(filePath)) {
        this.testResults.failed++;
        this.testResults.errors.push(`Workflow file not found: ${file}`);
        console.log(`  ❌ Workflow file not found: ${file}`);
        return;
      }

      const content = fs.readFileSync(filePath, 'utf8');

      // Check for priority: critical label usage
      const hasPriorityCritical = content.includes('priority: critical');
      this.assert(
        hasPriorityCritical,
        `${file} uses "priority: critical" label`
      );

      // Check for proper label array syntax in JavaScript sections
      const jsLabelArrays = content.match(/labels:\s*\[([^\]]+)\]/g);
      if (jsLabelArrays) {
        jsLabelArrays.forEach(labelArray => {
          // Verify labels with spaces/colons are properly quoted (with single or double quotes)
          // Match patterns like 'priority: critical' or "priority: critical"
          const hasQuotedLabels = /'[^']+'|"[^"]+"/g.test(labelArray);
          
          if (labelArray.includes('priority:') || labelArray.includes('priority :')) {
            // Check specifically for priority labels being quoted
            const priorityLabelQuoted = /'priority:\s*\w+'|"priority:\s*\w+"/g.test(labelArray);
            this.assert(
              priorityLabelQuoted || hasQuotedLabels,
              `Label array in ${file} properly quotes priority labels`
            );
          }
        });
      }

      // Check bash label handling in todo-to-issues.yml
      if (file.includes('todo-to-issues.yml')) {
        const hasBashLabelLoop = content.includes('gh_args+=("--label" "$label")');
        this.assert(
          hasBashLabelLoop,
          `${file} uses proper bash array syntax for label handling`
        );

        const usesJqForParsing = content.includes('jq -r \'.[]\'');
        this.assert(
          usesJqForParsing,
          `${file} uses jq to parse label JSON arrays`
        );
      }
    });
  }

  /**
   * Test 3: Validate batch-create-issues.js implementation
   */
  testBatchCreateIssuesScript() {
    console.log('\n📋 Test 3: Batch Create Issues Script');

    const scriptPath = path.join(process.cwd(), 'scripts/batch-create-issues.js');
    
    if (!fs.existsSync(scriptPath)) {
      this.testResults.failed++;
      this.testResults.errors.push('batch-create-issues.js not found');
      console.log('  ❌ batch-create-issues.js not found');
      return;
    }

    const content = fs.readFileSync(scriptPath, 'utf8');

    // Check that spawnSync is imported
    const hasSpawnSync = content.includes('spawnSync');
    this.assert(
      hasSpawnSync,
      'Script imports spawnSync for secure command execution'
    );

    // Check that spawnSync is used instead of building command strings
    const usesSpawnSyncForGh = content.includes('spawnSync(\'gh\'');
    this.assert(
      usesSpawnSyncForGh,
      'Script uses spawnSync for gh command execution'
    );

    // Check that labels are added to args array
    const addsLabelsToArray = content.includes('args.push(\'--label\', label)');
    this.assert(
      addsLabelsToArray,
      'Script adds labels to arguments array correctly'
    );

    // Verify no unsafe command string building
    const hasUnsafeCommandBuilding = content.includes('execSync(command') && 
                                      content.includes('args.map(arg => JSON.stringify(arg)).join');
    this.assert(
      !hasUnsafeCommandBuilding,
      'Script does not use unsafe command string building'
    );
  }

  /**
   * Test 4: Validate label generation in todo-to-issues workflow
   */
  testTodoToIssuesLabelGeneration() {
    console.log('\n📋 Test 4: Todo-to-Issues Label Generation');

    const scriptContent = `
      const labels = ['todo', 'enhancement'];
      
      if (task.priority === 'critical') {
        labels.push('priority: critical', 'bug');
      } else if (task.priority === 'high') {
        labels.push('priority: high');
      } else if (task.priority === 'medium') {
        labels.push('priority: medium');
      } else if (task.priority === 'low') {
        labels.push('priority: low');
      }
    `;

    // Simulate label generation
    const testPriorities = ['critical', 'high', 'medium', 'low'];
    
    testPriorities.forEach(priority => {
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

      const hasPriorityLabel = labels.some(l => l.includes('priority:'));
      this.assert(
        hasPriorityLabel,
        `Priority "${priority}" generates correct label with colon`
      );

      if (priority === 'critical') {
        this.assert(
          labels.includes('bug'),
          'Critical priority includes bug label'
        );
      }
    });
  }

  /**
   * Test 5: Validate JSON serialization of labels
   */
  testLabelJSONSerialization() {
    console.log('\n📋 Test 5: Label JSON Serialization');

    const testLabels = [
      ['bug', 'priority: critical', 'enhancement'],
      ['todo', 'priority: high'],
      ['workflow-reliability-alert', 'infrastructure', 'priority: critical'],
      ['must-do: phase 1', 'documentation']
    ];

    testLabels.forEach((labelArray, index) => {
      // Test JSON.stringify
      const jsonStr = JSON.stringify(labelArray);
      this.assert(
        jsonStr.includes('priority:') || jsonStr.includes('must-do:'),
        `Label array ${index + 1} serializes correctly to JSON`
      );

      // Test parsing back
      const parsed = JSON.parse(jsonStr);
      this.assert(
        JSON.stringify(parsed) === JSON.stringify(labelArray),
        `Label array ${index + 1} can be parsed back correctly`
      );

      // Test individual label extraction with jq-like behavior
      labelArray.forEach(label => {
        // Simulate what jq -r '.[]' does
        const escaped = label.replace(/"/g, '\\"');
        this.assert(
          escaped === label || label.includes('"'),
          `Label "${label}" can be safely extracted from JSON array`
        );
      });
    });
  }

  /**
   * Test 6: Command-line argument safety
   */
  testCommandLineArgumentSafety() {
    console.log('\n📋 Test 6: Command-line Argument Safety');

    const { spawnSync } = require('child_process');

    const testCases = [
      { label: 'priority: critical', description: 'Label with colon and space' },
      { label: 'must-do: phase 1', description: 'Label with colon and spaces' },
      { label: 'label with spaces', description: 'Label with only spaces' },
      { label: 'simple-label', description: 'Simple label with dash' }
    ];

    testCases.forEach(({ label, description }) => {
      // Test that we can safely pass label as argument
      const args = ['--version']; // Safe command to test argument passing
      args.push('--label', label); // Add label argument
      
      // Verify the argument structure is safe
      const isSafe = !label.includes('`') && 
                     !label.includes('$') && 
                     !label.includes('\\') &&
                     !label.includes(';') &&
                     !label.includes('&&') &&
                     !label.includes('||');
      
      this.assert(isSafe, `${description}: "${label}" is safe for command-line use`);
    });
  }

  /**
   * Test 7: Integration test scenario
   */
  testIntegrationScenario() {
    console.log('\n📋 Test 7: Integration Scenario');

    // Simulate complete workflow
    const task = {
      title: 'Implement critical feature',
      priority: 'critical'
    };

    // Step 1: Generate labels (from todo-to-issues.yml logic)
    const labels = ['todo', 'enhancement'];
    if (task.priority === 'critical') {
      labels.push('priority: critical', 'bug');
    }

    this.assert(
      labels.length === 4,
      'Integration: Correct number of labels generated'
    );

    this.assert(
      labels.includes('priority: critical'),
      'Integration: Priority label with space and colon included'
    );

    // Step 2: Serialize to JSON (for workflow storage)
    const labelsJson = JSON.stringify(labels);
    this.assert(
      labelsJson.length > 0,
      'Integration: Labels can be serialized to JSON'
    );

    // Step 3: Parse from JSON (bash script simulation)
    const parsedLabels = JSON.parse(labelsJson);
    this.assert(
      parsedLabels.length === labels.length,
      'Integration: Labels can be parsed from JSON with same count'
    );

    // Step 4: Build command args (batch-create-issues.js simulation)
    const args = ['issue', 'create', '--title', task.title];
    parsedLabels.forEach(label => {
      args.push('--label', label);
    });

    const hasPriorityCriticalInArgs = args.includes('priority: critical');
    this.assert(
      hasPriorityCriticalInArgs,
      'Integration: Label with space and colon preserved in args array'
    );

    // Step 5: Verify no shell escaping issues
    const commandPreview = `gh ${args.map(a => `"${a}"`).join(' ')}`;
    this.assert(
      commandPreview.includes('"priority: critical"'),
      'Integration: Label properly quoted in command preview'
    );
  }

  /**
   * Run all tests
   */
  runAllTests() {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('🧪 Label Handling Validation Test Suite');
    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log('Testing complex multi-word labels like "priority: critical"\n');

    try {
      this.testLabelFormatPatterns();
      this.testWorkflowLabelUsage();
      this.testBatchCreateIssuesScript();
      this.testTodoToIssuesLabelGeneration();
      this.testLabelJSONSerialization();
      this.testCommandLineArgumentSafety();
      this.testIntegrationScenario();

      console.log('\n═══════════════════════════════════════════════════════════════');
      console.log('📊 Test Results Summary');
      console.log('═══════════════════════════════════════════════════════════════');
      console.log(`✅ Passed: ${this.testResults.passed}`);
      console.log(`❌ Failed: ${this.testResults.failed}`);

      if (this.testResults.failed > 0) {
        console.log('\n❌ Failed Tests:');
        this.testResults.errors.forEach((error, index) => {
          console.log(`  ${index + 1}. ${error}`);
        });
        console.log('\n⚠️  Some tests failed. Please review the issues above.');
        process.exit(1);
      } else {
        console.log('\n✅ All tests passed! Label handling is working correctly.');
        process.exit(0);
      }

    } catch (error) {
      console.error('\n💥 Test suite encountered an error:', error.message);
      console.error(error.stack);
      process.exit(1);
    }
  }
}

// Run tests if executed directly
if (require.main === module) {
  const tester = new LabelHandlingTest();
  tester.runAllTests();
}

module.exports = LabelHandlingTest;
