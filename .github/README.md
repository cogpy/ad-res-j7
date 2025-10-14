# GitHub Actions Workflows

This directory contains automated workflows for the AD Response J7 repository.

## Workflows

### File Representation Validator (`file-representations.yml`)

**Purpose**: Ensures every file in the repository has both markdown (`.md`) and JSON (`.json`) representations.

**When it runs**:
- On push to `main` branch
- On pull requests to `main` branch
- Manually via workflow dispatch

**What it does**:

1. **Analysis Phase**:
   - Scans the repository for all `.md` and `.json` files
   - Identifies missing counterparts (MD files without JSON, JSON files without MD)
   - Reports statistics in the job summary

2. **Generation Phase**:
   - Converts markdown files to structured JSON format with:
     - Title extraction
     - Section parsing (headings and content)
     - Metadata (source file, creation date)
   - Converts JSON files to readable markdown format
   - Preserves directory structure

3. **Validation Phase**:
   - Commits any newly generated files
   - Performs final validation to ensure 100% coverage
   - Reports success/failure in job summary

**File Structure Generated**:

For markdown files, the JSON structure includes:
```json
{
  "title": "Document Title",
  "source_file": "/path/to/source.md",
  "created_at": "ISO datetime",
  "file_type": "markdown",
  "sections": [
    {
      "heading": "Section Name",
      "level": 2,
      "content": "Section content...",
      "subsections": [
        {
          "heading": "Subsection",
          "level": 3,
          "content": "Subsection content..."
        }
      ]
    }
  ]
}
```

For JSON files, generates readable markdown with proper heading levels and content sections.

**Benefits**:
- **Dual Format Access**: Every document accessible in both human-readable (MD) and machine-readable (JSON) formats
- **Automated Maintenance**: No manual effort required to keep formats in sync
- **Structured Data**: JSON format enables programmatic analysis and processing
- **Documentation Consistency**: Ensures all documentation follows the same structural patterns

### Todo to Issues Generator (`todo-to-issues.yml`)

**Purpose**: Automatically creates GitHub issues from actionable tasks found in markdown files within the `todo/` folder.

**When it runs**:
- On push to `main` branch (when `todo/` folder files change)
- On pull requests to `main` branch (when `todo/` folder files change)
- Manually via workflow dispatch (with optional force regeneration)

**What it does**:

1. **Task Detection Phase**:
   - Scans markdown files in `todo/` directory
   - Identifies actionable tasks using multiple patterns:
     - Priority section tasks (Must-Do, Should-Do, Nice-to-Have)
     - Bullet points with action words (implement, add, create, fix, etc.)
     - Improvement sections (Improvements Needed, Action Required, etc.)
   - Applies quality filtering to exclude non-actionable content

2. **Issue Generation Phase**:
   - Creates GitHub issues with structured content
   - Assigns appropriate labels based on priority
   - Includes context (source file, section, priority, line number)
   - Prevents duplicates (unless force regeneration is enabled)

3. **Label Assignment**:
   - Base labels: `todo`, `enhancement` (all tasks)
   - Priority labels: `priority: critical`, `priority: high`, `priority: medium`, `priority: low`
   - Special handling: Critical tasks also get `bug` label

#### Label Format Requirements

The workflow supports multiple label formats and handles special characters correctly:

**Supported Label Formats:**

- **Single word labels**: `todo`, `enhancement`, `bug`
- **Multi-word labels with spaces**: `priority: critical`, `priority: high`
- **Colon-separated namespaced labels**: `priority: [level]`
- **Labels with special characters**: Automatically quoted and escaped

**Label Naming Conventions:**

Priority Labels:
- Format: `priority: [level]` where level is: `critical`, `high`, `medium`, `low`
- Examples: `priority: critical`, `priority: high`

Category Labels:
- Format: Single words or colon-separated namespaced labels
- Examples: `todo`, `enhancement`, `bug`, `documentation`

Custom Labels:
- Must follow GitHub's label naming requirements
- Can contain letters, numbers, spaces, hyphens, and underscores
- Maximum 50 characters in length
- Cannot start or end with spaces

**Technical Implementation:**

Labels are converted from JSON arrays to GitHub CLI arguments:

```javascript
// Internal JSON format
labels = ["todo", "enhancement", "priority: critical", "bug"]

// Converted to CLI arguments
--label "todo" --label "enhancement" --label "priority: critical" --label "bug"
```

**Important Notes:**
- Labels with spaces are automatically quoted for shell safety
- Special characters are preserved during conversion
- The workflow validates label format before issue creation
- Invalid labels are logged but do not prevent issue creation

**Label Assignment Rules:**

- **All tasks**: Receive `todo` and `enhancement` labels
- **Critical priority tasks**: Additionally receive `priority: critical` and `bug` labels
- **High priority tasks**: Additionally receive `priority: high` label
- **Medium priority tasks**: Additionally receive `priority: medium` label
- **Low priority tasks**: Additionally receive `priority: low` label

For complete documentation, see: [`docs/todo-to-issues-workflow.md`](../docs/todo-to-issues-workflow.md)

### Legacy Workflow (`blank.yml`)

The original CI workflow has been updated to use the same file representation validation logic. This ensures backward compatibility while providing the new functionality.

## Usage

The workflows run automatically, but you can also:

1. **Trigger manually**: Go to Actions tab → Select "File Representation Validator" → Click "Run workflow"

2. **Check results**: View the job summary for detailed statistics and any issues

3. **Local testing**: The converter script can be extracted and run locally for testing before committing changes

## Troubleshooting

If the workflow fails:

1. Check the job summary for specific error messages
2. Verify file permissions and Git configuration
3. Ensure no binary files are being processed as text
4. Check for JSON parsing errors in existing files

## Maintenance

- The workflow automatically commits generated files using the GitHub Actions bot account
- Generated files include metadata comments indicating their automated origin
- The workflow respects `.gitignore` patterns and excludes system directories