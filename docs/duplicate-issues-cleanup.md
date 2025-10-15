# Duplicate Issues Cleanup GitHub Action

This document describes the automated duplicate issues cleanup system for the repository.

## Overview

The **Duplicate Issues Cleanup** GitHub Action automatically identifies and manages duplicate GitHub issues to keep the repository organized and maintainable. It integrates with the existing `scripts/cleanup-duplicate-issues.js` script to provide a comprehensive automated solution.

## Features

### 🔍 **Smart Duplicate Detection**
- Normalizes issue titles to detect similar issues
- Groups issues by normalized title comparison
- Preserves the oldest issue in each duplicate group
- Detects descriptive issues that shouldn't be actionable tasks

### 🛡️ **Safety First**
- **Dry Run by Default**: Always runs in preview mode unless explicitly configured to execute
- **Rate Limiting**: Built-in delays to respect GitHub API limits
- **Comprehensive Logging**: Detailed logs of all actions and decisions
- **Validation**: Checks GitHub CLI authentication and permissions before running

### ⚙️ **Flexible Configuration**
- **Scheduled Runs**: Automatic daily cleanup at 3 AM UTC
- **Manual Triggers**: Run on-demand with custom parameters
- **Real-time Detection**: Triggered when new issues are created
- **Configurable Scope**: Option to include or exclude closed issues

### 📊 **Comprehensive Reporting**
- **GitHub Actions Summary**: Rich summary with metrics and findings
- **JSON Reports**: Detailed machine-readable reports
- **Artifact Storage**: Reports stored for 30 days
- **Failure Monitoring**: Automatic issue creation for workflow failures

## Usage

### Manual Execution

#### Via GitHub Actions Web UI

1. Go to **Actions** → **Duplicate Issues Cleanup**
2. Click **Run workflow**
3. Configure parameters:
   - **Dry Run**: `true` (preview) or `false` (execute)
   - **Include Closed**: `true` to analyze closed issues too
   - **Execution Mode**: `preview`, `execute`, or `report-only`

#### Via GitHub CLI

```bash
# Preview what would be cleaned up (dry run)
gh workflow run duplicate-issues-cleanup.yml

# Execute cleanup with custom parameters
gh workflow run duplicate-issues-cleanup.yml \
  -f dry_run=false \
  -f execution_mode=execute \
  -f include_closed=false
```

### Direct Script Usage

The underlying script can also be run directly:

```bash
# Preview mode (default)
node scripts/cleanup-duplicate-issues.js

# Include closed issues in analysis  
node scripts/cleanup-duplicate-issues.js --include-closed

# Execute cleanup (actually close duplicates)
node scripts/cleanup-duplicate-issues.js --execute

# Execute cleanup on all issues including closed
node scripts/cleanup-duplicate-issues.js --execute --include-closed

# Show help
node scripts/cleanup-duplicate-issues.js --help
```

## How It Works

### 1. **Issue Loading**
- Fetches all issues from the repository using GitHub API
- Filters out pull requests
- Supports both open-only and all-issues modes
- Handles pagination automatically

### 2. **Duplicate Detection**
- Normalizes issue titles by:
  - Converting to lowercase
  - Removing punctuation and special characters
  - Normalizing whitespace
- Groups issues with identical normalized titles
- Sorts by creation date (oldest first)

### 3. **Issue Classification**
- **Duplicates**: Multiple issues with same normalized title
- **Descriptive**: Issues that appear to be descriptions rather than actionable tasks
- **Valid**: Unique, actionable issues that should remain open

### 4. **Action Execution**
- **Dry Run Mode**: Logs what would be done without making changes
- **Execute Mode**: 
  - Adds explanatory comments to issues being closed
  - Closes duplicate issues with appropriate reason codes
  - Preserves the oldest issue in each group

### 5. **Reporting**
- Generates comprehensive JSON report
- Creates GitHub Actions summary with metrics
- Uploads reports as workflow artifacts

## Configuration

### Workflow Triggers

```yaml
on:
  # Scheduled daily cleanup
  schedule:
    - cron: '0 3 * * *'
  
  # Manual trigger with options
  workflow_dispatch:
    inputs:
      dry_run:
        default: 'true'
        type: boolean
      include_closed:
        default: 'false' 
        type: boolean
      execution_mode:
        default: 'preview'
        type: choice
        options: [preview, execute, report-only]
  
  # Real-time detection on new issues
  issues:
    types: [opened, edited, reopened]
```

### Environment Variables

- `GITHUB_REPOSITORY`: Target repository (auto-set by GitHub Actions)
- `GITHUB_TOKEN`: Authentication token (auto-provided by GitHub Actions)

### Script Options

- `--execute`: Execute cleanup instead of dry run
- `--include-closed`: Include closed issues in analysis
- `--dry-run`: Explicitly enable dry run mode
- `--help`: Show usage information

## Safety Measures

### 1. **Default Dry Run**
- All modes default to dry run unless explicitly configured
- Clear logging distinguishes between preview and execution modes

### 2. **Rate Limiting**
- Built-in delays between API calls
- Respects GitHub API rate limits
- Gradual processing to avoid overwhelming the system

### 3. **Authentication Validation**
- Verifies GitHub CLI installation and authentication
- Checks required permissions before proceeding
- Fails safely if authentication is missing

### 4. **Comprehensive Logging**
- Detailed logs of all decisions and actions
- Clear identification of issues being processed
- Explanation of why issues are classified as duplicates

### 5. **Rollback Information**
- Reports include enough detail to understand actions taken
- Comments added to closed issues explain the reasoning
- Preserved issues maintain full context

## Monitoring and Alerts

### Automatic Failure Detection
- Creates GitHub issues when workflows fail
- Prevents duplicate failure notifications (24-hour window)
- Includes detailed failure context and troubleshooting steps

### Success Metrics
- Issues processed count
- Duplicate groups found
- Issues closed
- Processing time

### Failure Scenarios
- GitHub CLI authentication failures
- API rate limit exceeded
- Network connectivity issues
- Permission denied errors

## Troubleshooting

### Common Issues

#### Authentication Failures
```
❌ Not authenticated with GitHub CLI
```
**Solution**: The workflow handles authentication automatically. For manual script usage, run `gh auth login`.

#### No Duplicates Found
```
🎉 No duplicate issues found!
```
**Result**: This is normal and indicates a well-maintained repository.

#### Rate Limiting
```
⚠️ API rate limit approached
```
**Handling**: The script includes automatic delays and will retry after rate limit resets.

### Debug Mode

Run with verbose logging:
```bash
node scripts/cleanup-duplicate-issues.js --help
```

### Manual Verification

After cleanup, verify results by:
1. Checking the generated report in workflow artifacts
2. Reviewing closed issues for appropriate comments
3. Confirming preserved issues are the oldest in their groups

## Integration

### With Existing Workflows
The duplicate cleanup workflow is designed to work alongside existing issue management:
- Does not interfere with other automated workflows
- Respects existing issue labels and assignments
- Preserves issue history and references

### With Development Process
- Runs after business hours (3 AM UTC) to minimize disruption
- Can be triggered manually during maintenance windows
- Provides detailed reports for team review

## Best Practices

### 1. **Regular Monitoring**
- Review weekly cleanup reports
- Monitor failure notifications
- Adjust detection patterns as needed

### 2. **Team Communication**
- Notify team of scheduled cleanup times
- Review controversial closures in team meetings
- Update documentation based on cleanup insights

### 3. **Issue Creation Guidelines**
- Encourage descriptive but concise titles
- Use consistent terminology
- Leverage existing issue templates

### 4. **Customization**
- Adjust duplicate detection patterns if needed
- Modify scheduling based on team workflow
- Customize reporting format for team needs

## Testing

The functionality is thoroughly tested:

```bash
# Run all duplicate cleanup tests
npm run test:duplicate-cleanup

# Run comprehensive workflow tests
npm run test

# Validate workflow YAML syntax
npm run test:validation
```

Test coverage includes:
- Workflow structure validation
- Duplicate detection logic
- Safety feature verification
- Integration testing
- Error handling scenarios

## Support

For issues or questions:
1. Check the workflow logs in GitHub Actions
2. Review the generated reports
3. Run the test suite to verify functionality
4. Create an issue with the `workflow-failure` label for urgent problems

The system is designed to be self-monitoring and will create alerts for any operational issues.