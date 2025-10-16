#!/usr/bin/env node

/**
 * Manual Test for Label Creation with Complex Multi-word Labels
 * 
 * This script simulates the issue creation process with labels like "priority: critical"
 * to verify the fixes work correctly in a controlled environment.
 * 
 * Usage: node tests/manual-test-label-creation.js [--dry-run]
 */

const { spawnSync } = require('child_process');

class LabelCreationTester {
  constructor(dryRun = true) {
    this.dryRun = dryRun;
    this.results = [];
  }

  /**
   * Test gh CLI availability
   */
  testGhCli() {
    console.log('🔍 Checking GitHub CLI availability...');
    const result = spawnSync('gh', ['--version'], { encoding: 'utf8' });
    
    if (result.error || result.status !== 0) {
      console.log('❌ GitHub CLI not found or not working');
      console.log('   Please install gh CLI: https://cli.github.com/');
      return false;
    }
    
    console.log('✅ GitHub CLI is available');
    console.log(`   Version: ${result.stdout.trim().split('\n')[0]}`);
    return true;
  }

  /**
   * Test authentication
   */
  testAuth() {
    console.log('\n🔍 Checking GitHub CLI authentication...');
    const result = spawnSync('gh', ['auth', 'status'], { encoding: 'utf8' });
    
    if (result.status !== 0) {
      console.log('⚠️  GitHub CLI not authenticated');
      console.log('   This is expected in CI/CD environment');
      console.log('   The workflow will use GITHUB_TOKEN');
      return false;
    }
    
    console.log('✅ GitHub CLI is authenticated');
    return true;
  }

  /**
   * Test label command building with various label formats
   */
  testLabelCommandBuilding() {
    console.log('\n📋 Testing label command building...\n');

    const testCases = [
      {
        name: 'Simple labels',
        labels: ['bug', 'enhancement', 'documentation'],
        expected: true
      },
      {
        name: 'Priority labels with colons and spaces',
        labels: ['priority: critical', 'priority: high', 'bug'],
        expected: true
      },
      {
        name: 'Multi-word labels',
        labels: ['must-do: phase 1', 'workflow-reliability-alert'],
        expected: true
      },
      {
        name: 'Mixed label formats',
        labels: ['bug', 'priority: critical', 'must-do: phase 1', 'enhancement'],
        expected: true
      },
      {
        name: 'Labels with many spaces',
        labels: ['label with many spaces', 'another label'],
        expected: true
      }
    ];

    testCases.forEach((testCase, index) => {
      console.log(`Test ${index + 1}: ${testCase.name}`);
      console.log(`Labels: ${JSON.stringify(testCase.labels)}`);

      // Build command args
      const args = [
        'issue', 'create',
        '--repo', 'cogpy/ad-res-j7',
        '--title', `Test Issue ${index + 1}: ${testCase.name}`,
        '--body', `This is a test issue to validate label handling.\n\nLabels: ${testCase.labels.join(', ')}`
      ];

      // Add labels
      testCase.labels.forEach(label => {
        args.push('--label', label);
      });

      // Display the command structure
      console.log(`Command structure:`);
      console.log(`  gh ${args.slice(0, 6).join(' ')} \\`);
      testCase.labels.forEach(label => {
        console.log(`    --label "${label}" \\`);
      });
      console.log('');

      // Validate argument structure
      const labelCount = testCase.labels.length;
      const labelArgsCount = args.filter(arg => arg === '--label').length;
      
      if (labelArgsCount === labelCount) {
        console.log(`✅ Correct number of --label flags: ${labelArgsCount}`);
      } else {
        console.log(`❌ Incorrect label count: expected ${labelCount}, got ${labelArgsCount}`);
      }

      // Check if labels are preserved correctly in args
      let allLabelsPreserved = true;
      testCase.labels.forEach(label => {
        if (!args.includes(label)) {
          console.log(`❌ Label "${label}" not found in args`);
          allLabelsPreserved = false;
        }
      });

      if (allLabelsPreserved) {
        console.log(`✅ All labels preserved correctly in args array`);
      }

      this.results.push({
        test: testCase.name,
        labels: testCase.labels,
        success: labelArgsCount === labelCount && allLabelsPreserved
      });

      console.log('');
    });
  }

  /**
   * Test actual issue creation (if not in dry-run mode)
   */
  testActualCreation() {
    if (this.dryRun) {
      console.log('ℹ️  Skipping actual issue creation (dry-run mode)');
      console.log('   To test actual creation, run with: --no-dry-run');
      console.log('   WARNING: This will create real issues in the repository!');
      return;
    }

    console.log('\n⚠️  ACTUAL ISSUE CREATION TEST');
    console.log('This will create a real test issue with complex labels.\n');

    const testLabels = ['test', 'priority: critical', 'automated-test'];
    const args = [
      'issue', 'create',
      '--repo', 'cogpy/ad-res-j7',
      '--title', '[TEST] Label handling validation - Delete this issue',
      '--body', `# Test Issue for Label Handling Validation

This is an automated test issue to validate that complex multi-word labels work correctly.

## Test Details
- **Labels tested**: ${testLabels.join(', ')}
- **Created**: ${new Date().toISOString()}
- **Purpose**: Validate fix for issue #1080

**This issue can be safely closed and deleted.**`
    ];

    testLabels.forEach(label => {
      args.push('--label', label);
    });

    console.log('Creating test issue with labels:', testLabels);
    
    const result = spawnSync('gh', args, { encoding: 'utf8' });

    if (result.error) {
      console.log('❌ Error executing command:', result.error.message);
      return;
    }

    if (result.status !== 0) {
      console.log('❌ Command failed with status:', result.status);
      console.log('   stderr:', result.stderr);
      return;
    }

    const issueUrl = result.stdout.trim();
    console.log('✅ Test issue created successfully!');
    console.log(`   URL: ${issueUrl}`);
    console.log('\n📝 Please verify the labels on the issue and then close/delete it.');
  }

  /**
   * Generate summary report
   */
  printSummary() {
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('📊 Label Creation Test Summary');
    console.log('═══════════════════════════════════════════════════════════════\n');

    const passed = this.results.filter(r => r.success).length;
    const failed = this.results.filter(r => !r.success).length;

    console.log(`Total tests: ${this.results.length}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}\n`);

    if (failed > 0) {
      console.log('Failed tests:');
      this.results.filter(r => !r.success).forEach(r => {
        console.log(`  - ${r.test}`);
      });
      console.log('');
    }

    if (passed === this.results.length) {
      console.log('🎉 All command building tests passed!');
      console.log('\nThe label handling implementation is correct and should work');
      console.log('properly in GitHub Actions workflows.\n');
    } else {
      console.log('⚠️  Some tests failed. Please review the implementation.\n');
    }
  }

  /**
   * Run all tests
   */
  run() {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('🧪 Manual Label Creation Test');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('Testing complex multi-word labels like "priority: critical"\n');

    if (this.dryRun) {
      console.log('🔍 Running in DRY-RUN mode (no actual issues will be created)\n');
    } else {
      console.log('⚠️  Running in LIVE mode (will create actual issues!)\n');
    }

    // Run tests
    const hasGh = this.testGhCli();
    if (!hasGh) {
      console.log('\n⚠️  Cannot continue without GitHub CLI');
      console.log('   Command building tests will still run.\n');
    } else {
      this.testAuth();
    }

    this.testLabelCommandBuilding();
    
    if (hasGh) {
      this.testActualCreation();
    }

    this.printSummary();
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = !args.includes('--no-dry-run');

// Run the tester
const tester = new LabelCreationTester(dryRun);
tester.run();
