# Testing Pipeline - Quick Reference Guide

## Quick Commands

### Run Tests
```bash
npm test                    # All tests
npm run test:validation     # Workflow structure tests only
npm run test:integration    # Functional tests only
npm run test:verbose        # Verbose output
```

### View Results
```bash
# Summary
cat tests/comprehensive-test-results.json | jq '.summary'

# Full results
cat tests/comprehensive-test-results.json | jq '.'

# Check success rate
cat tests/comprehensive-test-results.json | jq '.overall.success_rate'
```

## Pipeline Triggers

| Trigger | When | Purpose |
|---------|------|---------|
| **Push** | Changes to main/develop | Validate commits |
| **Pull Request** | PR to main/develop | Pre-merge validation |
| **Schedule** | Daily at 2 AM UTC | Continuous monitoring |
| **Manual** | On-demand | Testing & debugging |

## Success Criteria

✅ **Pipeline Passes If:**
- Success rate ≥ 90%
- All critical validations pass
- Required workflows exist and valid

❌ **Pipeline Fails If:**
- Success rate < 90%
- Critical tests fail
- Workflow files missing/invalid

## Test Suites

### Workflow Validation (83 tests)
- YAML syntax and structure
- Trigger configuration
- Permissions and security
- Job dependencies
- Step sequences

### Integration Tests (33 tests)
- Todo file parsing
- Issue generation
- Label handling
- Quality filtering
- Error handling

## Automated Alerting

**For scheduled runs only:**
- Creates issue on failure
- Labels: `automated-test-failure`, `bug`, `priority: high`
- Includes failure details
- Links to workflow run

## Common Tasks

### Before Committing
```bash
npm test
# Ensure ≥90% pass rate
```

### Debugging Failures
```bash
npm run test:verbose
# Check detailed output
cat tests/comprehensive-test-results.json | jq '.validation.errors'
cat tests/comprehensive-test-results.json | jq '.integration.errors'
```

### Running Specific Tests
```bash
# Validation only
node tests/workflow-validation.test.js

# Integration only  
node tests/integration-test.js
```

### Viewing Test Artifacts
1. Go to GitHub Actions
2. Select workflow run
3. Download artifacts
4. View JSON reports

## Troubleshooting

### Tests Failing Locally
1. Check Node.js version (18+ required)
2. Run `npm install`
3. Verify workflow files exist
4. Check for syntax errors

### Pipeline Failing in CI
1. Check workflow run logs
2. Review step summary
3. Download test artifacts
4. Check for environmental issues

### Low Success Rate
1. Review failed tests
2. Check recent changes
3. Validate workflow syntax
4. Run tests locally

## Performance Metrics

- **Execution Time**: ~0.02s
- **Total Tests**: 118
- **Success Rate**: 92%+
- **Artifact Retention**: 30 days

## Links

- [Full Documentation](AUTOMATED_TESTING_PIPELINE.md)
- [Test Framework README](../tests/README.md)
- [Implementation Summary](../tests/IMPLEMENTATION_SUMMARY.md)
- [CI/CD Workflow](../.github/workflows/test-workflows.yml)

---

**Quick Tip**: Run `npm test` before every commit to catch issues early!
