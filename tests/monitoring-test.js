/**
 * Monitoring and Alerting Test Suite
 * Tests the monitoring and alerting functionality added to workflows
 */

const fs = require('fs');
const path = require('path');

class MonitoringTestSuite {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
    this.errors = [];
  }

  test(name, testFn) {
    this.tests.push({ name, testFn });
  }

  assert(condition, message) {
    if (!condition) {
      throw new Error(`Assertion failed: ${message}`);
    }
  }

  async runTests() {
    console.log('🚀 Starting monitoring and alerting tests...');
    console.log('============================================================\n');

    for (const { name, testFn } of this.tests) {
      try {
        console.log(`🧪 Testing ${name}...`);
        await testFn();
        console.log(`✅ ${name}`);
        this.passed++;
      } catch (error) {
        console.log(`❌ ${name}: ${error.message}`);
        this.errors.push(`${name}: ${error.message}`);
        this.failed++;
      }
    }

    this.generateReport();
    return { passed: this.passed, failed: this.failed, errors: this.errors };
  }

  generateReport() {
    console.log('\n============================================================');
    console.log(`📊 Monitoring Test Summary: ${this.tests.length} tests run`);
    console.log(`✅ Passed: ${this.passed}`);
    console.log(`❌ Failed: ${this.failed}`);
    
    if (this.failed > 0) {
      console.log('\n❌ Failed tests:');
      this.errors.forEach(error => console.log(`  - ${error}`));
    }

    // Save results
    const results = {
      timestamp: new Date().toISOString(),
      total: this.tests.length,
      passed: this.passed,
      failed: this.failed,
      success_rate: ((this.passed / this.tests.length) * 100).toFixed(1),
      errors: this.errors
    };

    if (!fs.existsSync('tests/test-data/latest')) {
      fs.mkdirSync('tests/test-data/latest', { recursive: true });
    }

    fs.writeFileSync('tests/test-data/latest/monitoring-test-results.json', JSON.stringify(results, null, 2));
    console.log(`📁 Results saved to tests/test-data/latest/monitoring-test-results.json`);
  }
}

// Initialize test suite
const suite = new MonitoringTestSuite();

// Test workflow file structure and monitoring additions
suite.test('workflow monitoring workflow exists', () => {
  const workflowPath = '.github/workflows/workflow-monitoring.yml';
  suite.assert(fs.existsSync(workflowPath), `${workflowPath} should exist`);
});

suite.test('workflow monitoring has correct triggers', () => {
  const content = fs.readFileSync('.github/workflows/workflow-monitoring.yml', 'utf8');
  suite.assert(content.includes('workflow_run:'), 'Should have workflow_run trigger');
  suite.assert(content.includes('schedule:'), 'Should have scheduled trigger');
  suite.assert(content.includes('workflow_dispatch:'), 'Should have manual trigger');
});

suite.test('todo-to-issues has failure alerting', () => {
  const content = fs.readFileSync('.github/workflows/todo-to-issues.yml', 'utf8');
  suite.assert(content.includes('Report workflow failures'), 'Should have failure reporting step');
  suite.assert(content.includes('if: failure()'), 'Should trigger on failure');
  suite.assert(content.includes('workflow-failure'), 'Should use workflow-failure label');
});

suite.test('file-representations has failure alerting', () => {
  const content = fs.readFileSync('.github/workflows/file-representations.yml', 'utf8');
  suite.assert(content.includes('Report workflow failures'), 'Should have failure reporting step');
  suite.assert(content.includes('if: failure()'), 'Should trigger on failure');
  suite.assert(content.includes('file-representations'), 'Should identify the specific workflow');
});

suite.test('test-workflows has enhanced monitoring', () => {
  const content = fs.readFileSync('.github/workflows/test-workflows.yml', 'utf8');
  suite.assert(content.includes('Monitor workflow failure patterns'), 'Should have pattern monitoring');
  suite.assert(content.includes('workflow health dashboard'), 'Should update health dashboard');
  suite.assert(content.includes('workflow-reliability-alert'), 'Should create reliability alerts');
});

suite.test('monitoring dashboard documentation exists', () => {
  const dashboardPath = '.github/WORKFLOW_MONITORING.md';
  suite.assert(fs.existsSync(dashboardPath), `${dashboardPath} should exist`);
  
  const content = fs.readFileSync(dashboardPath, 'utf8');
  suite.assert(content.includes('Monitoring Dashboard'), 'Should be a monitoring dashboard');
  suite.assert(content.includes('Alert Types'), 'Should document alert types');
  suite.assert(content.includes('Response Procedures'), 'Should include response procedures');
});

suite.test('monitoring workflow has comprehensive failure analysis', () => {
  const content = fs.readFileSync('.github/workflows/workflow-monitoring.yml', 'utf8');
  suite.assert(content.includes('Analyze workflow health'), 'Should analyze workflow health');
  suite.assert(content.includes('critical_failures'), 'Should detect critical failures');
  suite.assert(content.includes('failureRate'), 'Should calculate failure rates');
  suite.assert(content.includes('workflow_health'), 'Should track workflow health');
});

suite.test('alert deduplication prevents spam', () => {
  const todoContent = fs.readFileSync('.github/workflows/todo-to-issues.yml', 'utf8');
  const fileRepContent = fs.readFileSync('.github/workflows/file-representations.yml', 'utf8');
  const monitorContent = fs.readFileSync('.github/workflows/workflow-monitoring.yml', 'utf8');
  
  // Check for deduplication logic
  suite.assert(todoContent.includes('existing'), 'Todo workflow should check for existing issues');
  suite.assert(fileRepContent.includes('existing'), 'File-rep workflow should check for existing issues');
  suite.assert(monitorContent.includes('recentAlert'), 'Monitoring should prevent recent duplicates');
});

suite.test('monitoring includes actionable error information', () => {
  const content = fs.readFileSync('.github/workflows/workflow-monitoring.yml', 'utf8');
  suite.assert(content.includes('Impact Assessment'), 'Should include impact assessment');
  suite.assert(content.includes('Urgent Action Plan') || content.includes('Immediate Actions'), 'Should include immediate actions');
  suite.assert(content.includes('Action Plan') || content.includes('Troubleshooting'), 'Should include actionable information');
});

suite.test('health metrics are properly tracked', () => {
  const content = fs.readFileSync('.github/workflows/workflow-monitoring.yml', 'utf8');
  suite.assert(content.includes('.github/workflow-health'), 'Should create health directory');
  suite.assert(content.includes('current-health.json'), 'Should track current health');
  suite.assert(content.includes('overall-status.txt'), 'Should track overall status');
  suite.assert(content.includes('last-check.txt'), 'Should track last check time');
});

suite.test('monitoring has appropriate permissions', () => {
  const content = fs.readFileSync('.github/workflows/workflow-monitoring.yml', 'utf8');
  suite.assert(content.includes('contents: read'), 'Should have contents read permission');
  suite.assert(content.includes('issues: write'), 'Should have issues write permission');
  suite.assert(content.includes('actions: read'), 'Should have actions read permission');
});

suite.test('monitoring covers all target workflows', () => {
  const content = fs.readFileSync('.github/workflows/workflow-monitoring.yml', 'utf8');
  suite.assert(content.includes('todo-to-issues.yml'), 'Should monitor todo-to-issues');
  suite.assert(content.includes('file-representations.yml'), 'Should monitor file-representations');
  suite.assert(content.includes('test-workflows.yml'), 'Should monitor test-workflows');
});

suite.test('failure thresholds are appropriate', () => {
  const content = fs.readFileSync('.github/workflows/workflow-monitoring.yml', 'utf8');
  suite.assert(content.includes('> 20') || content.includes('> 0.3'), 'Should have warning threshold (20% or 30%)');
  suite.assert(content.includes('> 50'), 'Should have 50% critical threshold');
});

suite.test('monitoring provides detailed failure context', () => {
  const todoContent = fs.readFileSync('.github/workflows/todo-to-issues.yml', 'utf8');
  suite.assert(todoContent.includes('failureContext'), 'Should gather failure context');
  suite.assert(todoContent.includes('runUrl'), 'Should include run URL');
  suite.assert(todoContent.includes('timestamp'), 'Should include timestamp');
  suite.assert(todoContent.includes('trigger'), 'Should include trigger information');
});

suite.test('emergency response procedures are documented', () => {
  const content = fs.readFileSync('.github/WORKFLOW_MONITORING.md', 'utf8');
  suite.assert(content.includes('Critical Alerts'), 'Should document critical alert procedures');
  suite.assert(content.includes('Response Time'), 'Should specify response times');
  suite.assert(content.includes('Emergency'), 'Should include emergency procedures');
});

suite.test('monitoring system is self-monitoring', () => {
  const content = fs.readFileSync('.github/workflows/workflow-monitoring.yml', 'utf8');
  suite.assert(content.includes('if: always()'), 'Should run cleanup regardless of status');
  suite.assert(content.includes('timeout-minutes'), 'Should have timeout protection');
});

// Test that the original task is addressed
suite.test('original todo task is addressed', () => {
  const todoContent = fs.readFileSync('todo/workflow-validation-tests.md', 'utf8');
  const lines = todoContent.split('\n');
  
  // Find line 90 and verify it contains the monitoring task
  const line90 = lines[89]; // 0-based indexing
  suite.assert(line90 && line90.includes('monitoring and alerting'), 
    'Line 90 should contain the monitoring and alerting task');
  
  // Verify we've implemented comprehensive monitoring
  const monitoringExists = fs.existsSync('.github/workflows/workflow-monitoring.yml');
  const todoHasAlerting = fs.readFileSync('.github/workflows/todo-to-issues.yml', 'utf8').includes('Report workflow failures');
  const fileRepHasAlerting = fs.readFileSync('.github/workflows/file-representations.yml', 'utf8').includes('Report workflow failures');
  
  suite.assert(monitoringExists && todoHasAlerting && fileRepHasAlerting,
    'Should have implemented comprehensive monitoring and alerting for workflow failures');
});

// Run the tests
(async () => {
  try {
    const results = await suite.runTests();
    
    if (results.failed === 0) {
      console.log('\n🎉 All monitoring tests passed! Monitoring and alerting system is properly implemented.');
      process.exit(0);
    } else {
      console.log('\n❌ Some monitoring tests failed. Please address the issues above.');
      process.exit(1);
    }
  } catch (error) {
    console.error('💥 Test suite crashed:', error);
    process.exit(1);
  }
})();