# 🚀 Create Issues from Repository Items - Quick Start Guide

## What's New?

You can now create GitHub issues from repository items (like the list you provided) using our new tools!

## Quick Options

### Option 1: Interactive CLI (Single Issue)
```bash
node scripts/create-issue-from-repository-item.js
```
Then paste your items and select which one to create.

### Option 2: Batch Processing (Multiple Issues)
```bash
# Preview what will be created (dry run)
node scripts/batch-create-issues.js --file examples/sample-repository-items.txt --dry-run

# Actually create the issues
node scripts/batch-create-issues.js --file examples/sample-repository-items.txt
```

### Option 3: GitHub Action (Automated)

1. Go to the Actions tab
2. Select "Create Issues from Repository Items"
3. Click "Run workflow"
4. Choose your options and run

### Option 4: Issue Comment Trigger

Comment on any issue with:
```
/create-issues-from-items

[Your repository items here]
#123 First item  
#124 Second item
```

## Using Your Provided List

To create issues from the list you provided:

1. Save your list to a file:
```bash
cat > my-items.txt << 'EOF'
[Paste your full list here]
EOF
```

2. Run batch creation:
```bash
# First, preview what will be created
node scripts/batch-create-issues.js --file my-items.txt --dry-run

# If everything looks good, create them
node scripts/batch-create-issues.js --file my-items.txt
```

## Features

✅ **Smart Categorization**: Automatically categorizes and labels issues
✅ **Duplicate Detection**: Skips issues that already exist
✅ **Batch Processing**: Creates multiple issues efficiently
✅ **Rate Limiting**: Respects GitHub API limits
✅ **Comprehensive Reports**: Shows what was created, skipped, or failed

## What Gets Created?

Each issue will include:
- Original title from your list
- Appropriate labels based on content (legal, financial, technical, etc.)
- Context linking back to original issue numbers
- Structured acceptance criteria
- Priority designation

## Example Output

```
📊 BATCH CREATION SUMMARY
============================================================
Total items processed: 25
✅ Successfully created: 20
⚠️ Skipped (duplicates): 3
❌ Failed: 2

Summary saved to: batch-issue-creation-summary.json
============================================================
```

## Need Help?

- Full documentation: `docs/create-issues-from-repository-items.md`
- Test with samples: `examples/sample-repository-items.txt`
- Run with `--help` flag for options

## Get Started Now!

The simplest way to process your list:

```bash
# Save your items to a file, then:
node scripts/batch-create-issues.js --file your-items.txt --dry-run
```

Happy issue creating! 🎉