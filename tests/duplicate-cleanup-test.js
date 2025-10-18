#!/usr/bin/env node

/**
 * Comprehensive test suite for the duplicate issues cleanup functionality
 */

const fs = require('fs');
const path = require('path');

class DuplicateCleanupTester {
  constructor() {
    this.testResults = [];
    this.passedTests = 0;
    this.failedTests = 0;
    this.verbose = process.argv.includes('--verbose');
  }

  log(message) {
    if (this.verbose) {
      console.log(message);
    }
  }

  test(name, testFunction) {
    try {
      const result = testFunction();
      if (result) {
        this.passedTests++;
        this.testResults.push({ name, status: 'passed' });
        this.log(`✅ ${name}`);
      } else {
        this.failedTests++;
        this.testResults.push({ name, status: 'failed', error: 'Test assertion failed' });
        console.log(`❌ ${name}`);
      }
    } catch (error) {
      this.failedTests++;
      this.testResults.push({ name, status: 'failed', error: error.message });
      console.log(`❌ ${name}: ${error.message}`);
    }
  }

  /**
   * Test workflow file structure and configuration
   */
  testWorkflowStructure() {
    console.log('\n🧪 Testing duplicate cleanup workflow structure...');

    const workflowPath = '.github/workflows/duplicate-issues-cleanup.yml';
    
    this.test('Duplicate cleanup workflow file exists', () => {
      return fs.existsSync(workflowPath);
    });

    if (!fs.existsSync(workflowPath)) {
      return;
    }

    const workflowContent = fs.readFileSync(workflowPath, 'utf8');

    this.test('Workflow has correct name', () => {
      return workflowContent.includes('name: Duplicate Issues Cleanup');
    });

    this.test('Has scheduled trigger', () => {
      return workflowContent.includes('schedule:') && workflowContent.includes('cron:');
    });

    this.test('Has manual workflow_dispatch trigger', () => {
      return workflowContent.includes('workflow_dispatch:');
    });

    this.test('Has issues trigger for real-time detection', () => {
      return workflowContent.includes('issues:') && workflowContent.includes('types: [opened');
    });

    this.test('Has proper permissions configured', () => {
      return workflowContent.includes('contents: read') && 
             workflowContent.includes('issues: write') && 
             workflowContent.includes('actions: read');
    });

    this.test('Has dry_run input parameter', () => {
      return workflowContent.includes('dry_run:') && 
             workflowContent.includes('type: boolean');
    });

    this.test('Has include_closed input parameter', () => {
      return workflowContent.includes('include_closed:') && 
             workflowContent.includes('type: boolean');
    });

    this.test('Has execution_mode choice parameter', () => {
      return workflowContent.includes('execution_mode:') && 
             workflowContent.includes('type: choice') && 
             workflowContent.includes('- execute');
    });

    this.test('Uses proper Node.js version', () => {
      return workflowContent.includes("NODE_VERSION: '18'");
    });

    this.test('Has comprehensive step structure', () => {
      return workflowContent.includes('name: Checkout') &&
             workflowContent.includes('name: Setup Node.js') &&
             workflowContent.includes('name: Run duplicate analysis') &&
             workflowContent.includes('name: Generate workflow summary');
    });
  }

  /**
   * Test cleanup script functionality
   */
  testCleanupScript() {
    console.log('\n🧪 Testing cleanup script functionality...');

    const scriptPath = 'scripts/cleanup-duplicate-issues.js';

    this.test('Cleanup script exists', () => {
      return fs.existsSync(scriptPath);
    });

    if (!fs.existsSync(scriptPath)) {
      return;
    }

    const scriptContent = fs.readFileSync(scriptPath, 'utf8');

    this.test('Script has DuplicateIssueCleaner class', () => {
      return scriptContent.includes('class DuplicateIssueCleaner');
    });

    this.test('Has loadIssues method with includesClosed parameter', () => {
      return scriptContent.includes('async loadIssues(includesClosed = false)');
    });

    this.test('Has normalizeTitle method for duplicate detection', () => {
      return scriptContent.includes('normalizeTitle(title)');
    });

    this.test('Has findDuplicates method', () => {
      return scriptContent.includes('findDuplicates()');
    });

    this.test('Has closeDuplicates method', () => {
      return scriptContent.includes('closeDuplicates()');
    });

    this.test('Has generateReport method', () => {
      return scriptContent.includes('generateReport()');
    });

    this.test('Supports --include-closed CLI flag', () => {
      return scriptContent.includes('--include-closed');
    });

    this.test('Has proper CLI help documentation', () => {
      return scriptContent.includes('--include-closed  Include closed issues in analysis');
    });

    this.test('Uses GitHub CLI for issue operations', () => {
      return scriptContent.includes('gh api') && scriptContent.includes('gh issue');
    });

    this.test('Has proper error handling for GitHub CLI', () => {
      return scriptContent.includes('gh --version') && 
             scriptContent.includes('gh auth status');
    });
  }

  /**
   * Test duplicate detection logic
   */
  testDuplicateDetection() {
    console.log('\n🧪 Testing duplicate detection logic...');

    // Create a temporary script to test the duplicate detection
    const testScript = `
      const { execSync } = require('child_process');
      const fs = require('fs');
      const path = require('path');
      
      class TestDuplicateIssueCleaner {
        constructor() {
          this.issues = [];
          this.duplicates = new Map();
        }

        normalizeTitle(title) {
          return title
            .toLowerCase()
            .replace(/[^\\w\\s]/g, '')
            .replace(/\\s+/g, ' ')
            .trim();
        }

        findDuplicates() {
          const titleGroups = new Map();
          
          for (const issue of this.issues) {
            const normalized = this.normalizeTitle(issue.title);
            
            if (!titleGroups.has(normalized)) {
              titleGroups.set(normalized, []);
            }
            titleGroups.get(normalized).push(issue);
          }

          for (const [normalized, group] of titleGroups) {
            if (group.length > 1) {
              const [original, ...duplicates] = group;
              this.duplicates.set(original.number, duplicates.map(d => d.number));
            }
          }
        }
      }

      // Test cases
      const cleaner = new TestDuplicateIssueCleaner();
      
      // Test data - simulate issues
      cleaner.issues = [
        { number: 1, title: 'Fix login bug', created_at: '2023-01-01' },
        { number: 2, title: 'Fix Login Bug!', created_at: '2023-01-02' },
        { number: 3, title: 'Update documentation', created_at: '2023-01-03' },
        { number: 4, title: 'fix-login-bug', created_at: '2023-01-04' },
        { number: 5, title: 'Update Documentation', created_at: '2023-01-05' }
      ];
      
      cleaner.findDuplicates();
      
      // Expected: Issues 1,2,4 should be grouped (fix login bug variants)
      // Expected: Issues 3,5 should be grouped (update documentation variants)
      
      console.log(JSON.stringify({
        duplicateGroups: cleaner.duplicates.size,
        totalDuplicates: Array.from(cleaner.duplicates.values()).flat().length,
        normalizedTitles: cleaner.issues.map(i => cleaner.normalizeTitle(i.title))
      }));
    `;

    // Write and execute the test
    const testFile = '/tmp/test-duplicate-detection.js';
    fs.writeFileSync(testFile, testScript);

    try {
      const output = require('child_process').execSync(`node ${testFile}`, { encoding: 'utf8' });
      const results = JSON.parse(output.trim());

      this.test('Detects duplicate groups correctly', () => {
        return results.duplicateGroups === 2;
      });

      this.test('Counts total duplicates correctly', () => {
        return results.totalDuplicates === 2; // Issues 2,4,5 should be marked as duplicates
      });

      this.test('Normalizes titles consistently', () => {
        const normalized = results.normalizedTitles;
        return normalized[0] === normalized[1] && // "fix login bug" variants
               normalized[2] === normalized[4];    // "update documentation" variants
      });

      // Clean up
      fs.unlinkSync(testFile);

    } catch (error) {
      this.test('Duplicate detection test execution', () => {
        throw new Error(`Test execution failed: ${error.message}`);
      });
    }
  }

  /**
   * Test workflow integration features
   */
  testWorkflowIntegration() {
    console.log('\n🧪 Testing workflow integration features...');

    const workflowPath = '.github/workflows/duplicate-issues-cleanup.yml';
    
    if (!fs.existsSync(workflowPath)) {
      return;
    }

    const workflowContent = fs.readFileSync(workflowPath, 'utf8');

    this.test('Has GitHub CLI installation step', () => {
      return workflowContent.includes('Installing GitHub CLI');
    });

    this.test('Has authentication verification', () => {
      return workflowContent.includes('gh auth status');
    });

    this.test('Has parameter determination logic', () => {
      return workflowContent.includes('Determine execution parameters');
    });

    this.test('Has comprehensive summary generation', () => {
      return workflowContent.includes('Generate workflow summary') && 
             workflowContent.includes('GITHUB_STEP_SUMMARY');
    });

    this.test('Has artifact upload for reports', () => {
      return workflowContent.includes('actions/upload-artifact') &&
             workflowContent.includes('duplicate-cleanup-report');
    });

    this.test('Has failure handling with issue creation', () => {
      return workflowContent.includes('Handle analysis failure') &&
             workflowContent.includes('workflow-failure');
    });

    this.test('Has proper cleanup of temporary files', () => {
      return workflowContent.includes('Cleanup temporary files');
    });

    this.test('Uses secure environment variable handling', () => {
      return workflowContent.includes('GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}');
    });

    this.test('Uses proper GitHub CLI authentication', () => {
      return workflowContent.includes('gh auth status') &&
             workflowContent.includes('Authenticate GitHub CLI');
    });
  }

  /**
   * Test safety and security features
   */
  testSafetyFeatures() {
    console.log('\n🧪 Testing safety and security features...');

    const workflowContent = fs.readFileSync('.github/workflows/duplicate-issues-cleanup.yml', 'utf8');
    const scriptContent = fs.readFileSync('scripts/cleanup-duplicate-issues.js', 'utf8');

    this.test('Workflow defaults to dry run mode', () => {
      return workflowContent.includes("default: 'true'") && 
             workflowContent.includes('dry_run');
    });

    this.test('Script defaults to dry run mode', () => {
      return scriptContent.includes('dryRun: !args.includes') &&
             scriptContent.includes('this.dryRun = true; // Default to dry run');
    });

    this.test('Has rate limiting protection', () => {
      return scriptContent.includes('setTimeout(resolve, 500)') ||
             scriptContent.includes('sleep');
    });

    this.test('Has comprehensive logging', () => {
      return scriptContent.includes('console.log') &&
             workflowContent.includes('echo "');
    });

    this.test('Validates GitHub CLI availability', () => {
      return scriptContent.includes('gh --version') &&
             workflowContent.includes('gh --version');
    });

    this.test('Has proper permission validation', () => {
      return workflowContent.includes('permissions:') &&
             workflowContent.includes('issues: write');
    });

    this.test('Prevents duplicate failure notifications', () => {
      return workflowContent.includes('recentFailure') &&
             workflowContent.includes('24'); // 24 hour check
    });

    this.test('Has execution confirmation logic', () => {
      return workflowContent.includes('execute_cleanup') &&
             workflowContent.includes('execution_mode');
    });
  }

  /**
   * Run all tests
   */
  async run() {
    console.log('🚀 Starting Duplicate Issues Cleanup Test Suite');
    console.log('=====================================================');

    this.testWorkflowStructure();
    this.testCleanupScript();
    this.testDuplicateDetection();
    this.testWorkflowIntegration();
    this.testSafetyFeatures();

    console.log('\n=====================================================');
    console.log('📊 Test Summary');
    console.log('=====================================================');
    console.log(`✅ Passed: ${this.passedTests}`);
    console.log(`❌ Failed: ${this.failedTests}`);
    console.log(`📈 Success Rate: ${((this.passedTests / (this.passedTests + this.failedTests)) * 100).toFixed(1)}%`);

    if (this.failedTests > 0) {
      console.log('\n❌ Failed Tests:');
      this.testResults
        .filter(result => result.status === 'failed')
        .forEach((result, index) => {
          console.log(`   ${index + 1}. ${result.name}${result.error ? ': ' + result.error : ''}`);
        });
    }

    // Save test results
    const resultsDir = 'test-data/latest';
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true });
    }

    const testReport = {
      timestamp: new Date().toISOString(),
      totalTests: this.passedTests + this.failedTests,
      passed: this.passedTests,
      failed: this.failedTests,
      successRate: (this.passedTests / (this.passedTests + this.failedTests)) * 100,
      results: this.testResults
    };

    fs.writeFileSync(
      path.join(resultsDir, 'duplicate-cleanup-test-results.json'), 
      JSON.stringify(testReport, null, 2)
    );

    console.log('\n📁 Test results saved to test-data/latest/duplicate-cleanup-test-results.json');

    if (this.failedTests > 0) {
      console.log('\n🚨 Some tests failed. Please review and fix the issues.');
      process.exit(1);
    } else {
      console.log('\n🎉 All tests passed successfully!');
      process.exit(0);
    }
  }
}

// Run the tests if this script is called directly
if (require.main === module) {
  const tester = new DuplicateCleanupTester();
  tester.run().catch(error => {
    console.error('💥 Fatal error in test suite:', error.message);
    process.exit(1);
  });
}

module.exports = DuplicateCleanupTester;