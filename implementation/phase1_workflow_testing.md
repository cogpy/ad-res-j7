# Phase 1: Workflow Testing Implementation Guide

## Overview
This guide implements the comprehensive GitHub Actions testing framework from `ad-res-j7` into the other repositories.

## Implementation Steps

### Step 1: Create Test Infrastructure

Create the following directory structure in each target repository:
```
tests/
├── workflow-validation.test.js
├── integration-test.js
├── simple-workflow-test.js
├── run-all-tests.js
├── test-result-archiver.js
└── README.md
```

### Step 2: Add package.json

Create `package.json` in the root of each repository:

```json
{
  "name": "[repo-name]-workflow-tests",
  "version": "1.0.0",
  "description": "Validation tests for GitHub Actions workflows",
  "scripts": {
    "test": "node tests/run-all-tests.js",
    "test:validation": "node tests/workflow-validation.test.js",
    "test:integration": "node tests/integration-test.js",
    "test:simple": "node tests/simple-workflow-test.js",
    "test:verbose": "node tests/run-all-tests.js --verbose",
    "validate-workflows": "node tests/run-all-tests.js"
  },
  "dependencies": {
    "glob": "^11.0.3"
  },
  "keywords": [
    "github-actions",
    "workflow",
    "validation",
    "tests"
  ],
  "license": "MIT"
}
```

### Step 3: Create Test Files

#### tests/workflow-validation.test.js
```javascript
const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

/ Validation functions
function validateWorkflowStructure(workflow, filePath) {
    const errors = [];
    
    / Check required fields
    if (!workflow.name) {
        errors.push(`Missing 'name' field in ${filePath}`);
    }
    
    if (!workflow.on) {
        errors.push(`Missing 'on' trigger in ${filePath}`);
    }
    
    if (!workflow.jobs || Object.keys(workflow.jobs).length === 0) {
        errors.push(`No jobs defined in ${filePath}`);
    }
    
    return errors;
}

/ Main test runner
async function runTests() {
    console.log('🔍 Validating GitHub Actions workflows...\n');
    
    const workflowFiles = await glob('.github/workflows/*.yml');
    let totalErrors = 0;
    
    for (const file of workflowFiles) {
        const content = fs.readFileSync(file, 'utf8');
        / Basic YAML parsing (you might want to use a proper YAML parser)
        const errors = validateWorkflowStructure({}, file);
        
        if (errors.length > 0) {
            console.log(`❌ ${file}:`);
            errors.forEach(error => console.log(`   - ${error}`));
            totalErrors += errors.length;
        } else {
            console.log(`✅ ${file}`);
        }
    }
    
    console.log(`\n📊 Summary: ${workflowFiles.length} workflows checked, ${totalErrors} errors found`);
    return totalErrors === 0;
}

/ Run tests
runTests().then(success => {
    process.exit(success ? 0 : 1);
});
```

#### tests/run-all-tests.js
```javascript
const { execSync } = require('child_process');
const path = require('path');

const tests = [
    'workflow-validation.test.js',
    'integration-test.js',
    'simple-workflow-test.js'
];

console.log('🚀 Running all workflow tests...\n');

let failedTests = 0;

tests.forEach(test => {
    console.log(`\n📋 Running ${test}...`);
    console.log('='.repeat(50));
    
    try {
        execSync(`node ${path.join('tests', test)}`, { stdio: 'inherit' });
        console.log(`✅ ${test} passed`);
    } catch (error) {
        console.log(`❌ ${test} failed`);
        failedTests++;
    }
});

console.log('\n' + '='.repeat(50));
console.log(`📊 Test Summary: ${tests.length - failedTests}/${tests.length} tests passed`);

if (failedTests > 0) {
    process.exit(1);
}
```

### Step 4: Create GitHub Action for Testing

Create `.github/workflows/test-workflows.yml`:

```yaml
name: Test GitHub Workflows

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight
  workflow_dispatch:

jobs:
  test-workflows:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm install
    
    - name: Run workflow tests
      run: npm test
    
    - name: Archive test results
      if: always()
      uses: actions/upload-artifact@v4
      with:
        name: workflow-test-results
        path: |
          tests/*.log
          tests/results/
    
    - name: Create issue on failure
      if: failure() && github.event_name == 'schedule'
      uses: actions/github-script@v7
      with:
        script: |
          const issue = await github.rest.issues.create({
            owner: context.repo.owner,
            repo: context.repo.repo,
            title: `Workflow Tests Failed - ${new Date().toISOString().split('T')[0]}`,
            body: `The scheduled workflow tests failed. Please check the [workflow run](${context.serverUrl}/${context.repo.owner}/${context.repo.repo}/actions/runs/${context.runId}) for details.`,
            labels: ['bug', 'automated-test', 'workflow']
          });
          console.log(`Created issue #${issue.data.number}`);
```

### Step 5: Repository-Specific Adaptations

#### For analysss:
- Add tests for simulation workflows
- Test entity scanning workflows
- Validate emoji syntax workflow

#### For analyticase:
- Test manual workflow trigger
- Validate simulation runner workflows
- Test Docker build workflows (when added)

#### For avtomaatoctory:
- Similar to analysss but with fewer workflows

## Benefits

1. **Early Detection**: Catch workflow errors before they affect production
2. **Automated Monitoring**: Daily scheduled tests ensure ongoing reliability
3. **Issue Tracking**: Automatic issue creation for failed scheduled tests
4. **Comprehensive Coverage**: Test structure, syntax, and integration
5. **Easy Maintenance**: Centralized test infrastructure

## Next Steps

1. Run initial tests to establish baseline
2. Fix any identified issues
3. Add repository-specific test cases
4. Monitor daily test results
5. Continuously improve test coverage