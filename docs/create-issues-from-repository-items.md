# Create Issues from Repository Items

This documentation covers the tools and workflows for creating GitHub issues from repository items, enabling efficient batch processing of tasks, todos, and action items.

## Overview

The repository includes several tools for creating GitHub issues:

1. **Interactive Script** (`scripts/create-issue-from-repository-item.js`) - Interactive CLI for creating single issues
2. **Batch Processor** (`scripts/batch-create-issues.js`) - Advanced batch processing with categorization
3. **GitHub Action** (`.github/workflows/create-issues-from-repository-items.yml`) - Automated workflow integration

## Supported Input Formats

The tools can parse repository items in multiple formats:

### Format 1: Markdown Links with Issue Numbers
```
[Disproportionate Relief: Interdict creates more harm than alleged misconduct](https://github.com/cogpy/ad-res-j7/issues/278) #278
[Test basic workflow functionality with this simple task](https://github.com/cogpy/ad-res-j7/issues/276) #276
```

### Format 2: Plain Text with Issue Numbers
```
81 Disproportionate Relief: Interdict creates more harm than alleged misconduct #278
82 Test basic workflow functionality with this simple task #276
```

### Format 3: Simple List
```
1. Add external validation (accountant letters, SARS compliance, bank relationships)
2. Include comprehensive financial analysis showing profitable operations
3. Demonstrate Peter's bad faith through timeline analysis
```

## Using the Interactive Script

The interactive script provides a user-friendly CLI for creating single issues:

```bash
# Run in interactive mode
node scripts/create-issue-from-repository-item.js

# Create from command line
node scripts/create-issue-from-repository-item.js "Issue Title" "Issue description"
```

### Interactive Mode Features

1. **Choose input method**: From repository items or manual entry
2. **Parse multiple formats**: Automatically detects item format
3. **Preview before creation**: Review issue content before submitting
4. **Customization options**: Add labels, milestone, assignees

## Using the Batch Processor

The batch processor is designed for creating multiple issues efficiently:

```bash
# Basic usage (reads from stdin)
cat repository-items.txt | node scripts/batch-create-issues.js

# Read from file
node scripts/batch-create-issues.js --file items.txt

# Dry run to preview
node scripts/batch-create-issues.js --file items.txt --dry-run

# Custom batch size
node scripts/batch-create-issues.js --file items.txt --batch-size 10
```

### Features

1. **Duplicate Detection**: Automatically skips existing issues
2. **Smart Categorization**: Categorizes items based on content
3. **Rate Limiting**: Processes in batches to avoid API limits
4. **Comprehensive Reporting**: Generates detailed summary JSON

### Automatic Categorization

Items are automatically categorized and labeled:

- **Legal**: Affidavit, court, legal matters → `legal`, `documentation`
- **Evidence**: Forensic, proof, evidence → `evidence`, `documentation`
- **Financial**: Bank, payment, accounts → `financial`, `analysis`
- **Technical**: Testing, workflow, automation → `testing`, `automation`
- **Analysis**: Timeline, analysis, demonstration → `analysis`, `documentation`

## Using the GitHub Action

The GitHub Action provides three ways to trigger issue creation:

### 1. Manual Workflow Dispatch

Navigate to Actions → "Create Issues from Repository Items" → Run workflow

Options:
- **Source**: `file`, `manual`, or `issue_comment`
- **File path**: Path to items file (if source is file)
- **Items text**: Direct input (if source is manual)
- **Dry run**: Preview without creating
- **Batch size**: Issues per batch

### 2. Issue Comment Trigger

Add a comment to any issue with:
```
/create-issues-from-items

[List your repository items here]
#123 First item
#124 Second item
#125 Third item
```

The workflow will:
1. Parse items from your comment
2. Create issues in batches
3. Reply with results summary

### 3. File-Based Processing

Create a file in your repository with items:
```bash
# Create items file
cat > repository-items.txt << EOF
[Task 1: Implement feature X](https://github.com/org/repo/issues/123) #123
[Task 2: Fix bug Y](https://github.com/org/repo/issues/124) #124
[Task 3: Update documentation](https://github.com/org/repo/issues/125) #125
EOF

# Commit and push
git add repository-items.txt
git commit -m "Add repository items for batch processing"
git push
```

Then trigger the workflow manually selecting the file.

## Best Practices

### 1. Prepare Your Items

- **Clean formatting**: Ensure consistent formatting
- **Clear titles**: Use descriptive, actionable titles
- **Group related items**: Process similar items together

### 2. Use Dry Run First

Always test with `--dry-run` to preview:
```bash
node scripts/batch-create-issues.js --file items.txt --dry-run
```

### 3. Monitor Rate Limits

- Default batch size: 5 issues
- Default delay: 1 second between batches
- Adjust based on your API limits

### 4. Review Generated Issues

After batch creation:
1. Check the summary report
2. Review created issues for accuracy
3. Add additional context as needed
4. Assign to team members

## Output and Reporting

### Summary JSON Structure

```json
{
  "timestamp": "2025-01-15T10:30:00Z",
  "stats": {
    "total": 25,
    "created": 20,
    "skipped": 3,
    "failed": 2
  },
  "created": [
    {
      "title": "Issue title",
      "url": "https://github.com/org/repo/issues/456",
      "number": "123",
      "originalLine": "Original input line"
    }
  ],
  "skipped": [...],
  "failed": [
    {
      "title": "Failed issue",
      "error": "Error message"
    }
  ]
}
```

### GitHub Action Artifacts

The workflow saves summaries as artifacts:
- Artifact name: `batch-issue-creation-summary`
- Retention: 30 days
- Format: JSON

## Troubleshooting

### Common Issues

1. **GitHub CLI not found**
   ```bash
   # Install GitHub CLI
   brew install gh  # macOS
   sudo apt install gh  # Ubuntu/Debian
   ```

2. **Authentication failed**
   ```bash
   # Authenticate with GitHub
   gh auth login
   ```

3. **Duplicate detection not working**
   - Ensure you have permission to read issues
   - Check API rate limits
   - Verify repository permissions

4. **Items not parsing correctly**
   - Check input format matches supported patterns
   - Remove extra whitespace or special characters
   - Ensure proper line endings

### Debug Mode

Enable verbose logging:
```bash
DEBUG=* node scripts/batch-create-issues.js --file items.txt
```

## Integration with Existing Workflows

### With Todo Workflow

Combine with the todo-to-issues workflow:
1. Extract tasks from todo files
2. Format as repository items
3. Process with batch creator

### With Project Boards

After creation:
1. Use GitHub Projects to organize
2. Add to appropriate columns
3. Set priorities and deadlines

### With CI/CD

Trigger issue creation from CI:
```yaml
- name: Create tracking issues
  uses: ./.github/workflows/create-issues-from-repository-items.yml
  with:
    items_file: test-results/failed-tests.txt
```

## Security Considerations

1. **Permissions**: Requires `issues: write` permission
2. **Input validation**: All inputs are sanitized
3. **Rate limiting**: Built-in protection against API abuse
4. **Authentication**: Uses GitHub token securely

## Examples

### Example 1: Legal Document Tasks

```text
Create comprehensive affidavit response addressing all allegations #101
Add forensic evidence analysis for email impersonation claims #102
Develop timeline showing pattern of bad faith negotiations #103
```

### Example 2: Technical Implementation

```text
[Implement automated testing pipeline](https://github.com/org/repo/issues/201) #201
[Add monitoring for workflow failures](https://github.com/org/repo/issues/202) #202
[Create comprehensive test suite](https://github.com/org/repo/issues/203) #203
```

### Example 3: Mixed Format

```text
1. Financial Analysis Tasks:
   - Analyze director loan account transactions #301
   - Create payment reconciliation report #302
   
2. [Evidence Collection: Gather supporting documentation](url) #303

3. Technical improvements for workflow automation #304
```

## Contributing

To enhance these tools:

1. **Add new parsers**: Extend `parseRepositoryItems()` for new formats
2. **Improve categorization**: Add patterns to `categorizeItem()`
3. **Custom templates**: Modify `generateIssueBody()` for specific needs
4. **Workflow triggers**: Add new trigger conditions to the GitHub Action

## Summary

The repository items to issues functionality provides:

- ✅ **Flexible input parsing** for multiple formats
- ✅ **Smart categorization** with appropriate labels
- ✅ **Batch processing** with rate limiting
- ✅ **Duplicate detection** to avoid redundancy
- ✅ **Multiple interfaces** (CLI, Action, API)
- ✅ **Comprehensive reporting** and tracking
- ✅ **Integration ready** with existing workflows

Use these tools to efficiently convert any list of tasks, todos, or action items into properly tracked GitHub issues with full context and categorization.