# Todo to Issues Generator Workflow

## Overview

The Todo to Issues Generator is a GitHub Action that automatically creates GitHub issues from actionable tasks found in files within the `todo/` folder. This workflow helps transform planning documents and improvement recommendations into trackable, actionable GitHub issues.

## How It Works

### Triggering

The workflow is triggered by:
- **Push to main branch** that includes changes to files in the `todo/` folder
- **Pull requests to main branch** that include changes to files in the `todo/` folder  
- **Manual dispatch** via the GitHub Actions tab (with optional force regeneration)

### Task Identification

The workflow intelligently parses markdown files in the `todo/` folder to identify actionable tasks using multiple detection methods:

#### 1. Priority Section Tasks
Detects numbered tasks in priority sections:
- `### Must-Do (Phase 1)`
- `### Should-Do (Phase 2)` 
- `### Nice-to-Have (Phase 3-4)`
- `### Priority Recommendations`

Example:
```markdown
### Must-Do (Phase 1)
1. Add Responsible Person regulatory crisis section
2. Add settlement timing and strategic litigation section
3. Add Peter's causation section
```

#### 2. Actionable Items
Identifies bullet points and numbered items that contain action words:
- implement, add, create, fix, update, improve, enhance, develop, build
- establish, provide, include, demonstrate, expand, complete, review
- contextualize, breakdown, analysis

Example:
```markdown
- Implement priority-based response architecture
- Create comprehensive timeline analysis
- Enhance evidence architecture
```

#### 3. Improvement Sections
Finds tasks in explicitly marked improvement sections:
- `**Improvements Needed**:`
- `**Action Required**:`
- `**Recommended Actions**:`

### Quality Filtering

The workflow applies intelligent filtering to ensure only high-quality, actionable tasks become issues:

**Excludes:**
- Short text snippets (less than 15 characters)
- Formatting artifacts (bold text only)
- Section headers (e.g., `**Improvements Needed**:`, `**Action Required**:`, `**Recommended Actions**:`)
- Non-actionable descriptions (Current Coverage, Legal Significance, etc.)
- Effort estimates (text ending with "hours")
- Generic descriptive text

**Includes:**
- Tasks with explicit action words
- Clear task descriptions mentioning sections, responses, affidavits, etc.
- Items from priority sections
- Implementation-focused content

**Section Header Filtering:**
The workflow specifically filters out common section headers to prevent generic issues:
- `**Improvements Needed**:` and variations (with/without bold, with/without colon)
- `**Action Required**:` and `**Actions Required**:`
- `**Recommended Action**:` and `**Recommended Actions**:`
- `**Current Coverage**:` and variations (e.g., `**Current Coverage**: Partially addressed in Section 4`)
- Any bold text ending with a colon (e.g., `**Legal Significance**:`)

This ensures that only the actual actionable items listed under these headers become issues, not the headers themselves.

### Issue Generation

For each identified task, the workflow creates a GitHub issue with:

#### Title
Clean, concise title extracted from the task text (limited to 80 characters)

#### Content
- **Task Description**: Full task text
- **Context**: Source file, section, priority, line number
- **Implementation Notes**: Reference to source file for additional context
- **Acceptance Criteria**: Checklist for task completion

#### Labels
Automatically applied labels:
- `todo` - Marks as generated from todo files
- `enhancement` - Standard enhancement label
- Priority labels: `priority: critical`, `priority: high`, `priority: medium`, `priority: low`
- `bug` - Added for critical priority items

**Label Format Requirements:**
- Labels are generated as JSON arrays internally and converted to individual CLI arguments
- Label names can contain spaces (e.g., "priority: critical")
- Special characters in labels are automatically escaped for GitHub CLI compatibility
- Multiple labels are applied using separate `--label` flags in the CLI command
- Label conversion process: `["label1", "label2"]` → `--label "label1" --label "label2"`
##### Label Format Requirements
The workflow supports labels with various formats and special characters:
- **Spaces**: Labels like `priority: critical` are fully supported
- **Colons**: Used in priority labels (e.g., `priority: high`)
- **Hyphens**: Standard in GitHub labels (e.g., `high-priority`)
- **Special characters**: Most GitHub-compatible label characters are supported
- **Security**: Uses secure array-based argument passing to prevent shell injection vulnerabilities

### Duplicate Prevention

The workflow includes intelligent duplicate prevention:
- Checks for existing open issues with identical titles
- Skips creation if duplicate exists (unless force regeneration is enabled)
- Force regeneration option closes existing todo-related issues before creating new ones

## Usage

### Automatic Usage

Simply commit changes to markdown files in the `todo/` folder. The workflow will:
1. Automatically detect the changes
2. Parse the files for actionable tasks  
3. Create corresponding GitHub issues
4. Provide a summary of created issues

### Manual Usage

1. Navigate to the **Actions** tab in the GitHub repository
2. Select the **Todo to Issues Generator** workflow
3. Click **Run workflow**
4. Optionally check **Force regeneration** to recreate all issues

### Force Regeneration

When force regeneration is enabled:
- All existing issues with the `todo` label are closed
- New issues are created for all current tasks
- Useful when task descriptions have been significantly updated

## File Format Requirements

### Supported File Types
- Markdown files (`.md`) in the `todo/` folder and its subdirectories

### Recommended Structure

For best results, structure todo files with clear sections:

```markdown
# Document Title

## Priority Recommendations

### Must-Do (Phase 1)
1. First critical task
2. Second critical task

### Should-Do (Phase 2)  
1. First important task
2. Second important task

## Detailed Improvements

### Section Name
**Improvements Needed**:
- Specific actionable item 1
- Specific actionable item 2
```

## Label Format Requirements

### Supported Label Formats

The workflow supports various label formats and handles label processing according to GitHub CLI requirements:

#### Standard Label Names
- **Single word labels**: `todo`, `enhancement`, `bug`
- **Multi-word labels with spaces**: `priority: critical`, `priority: high`, `priority: medium`, `priority: low`
- **Custom labels**: Any valid GitHub label name following standard conventions

#### Label Generation Process

1. **Internal Processing**: Labels are initially stored as JSON arrays in the workflow
2. **CLI Conversion**: JSON arrays are converted to individual `--label` arguments for GitHub CLI compatibility using `jq -r '.[]'`
3. **Escaping**: Labels containing spaces or special characters are automatically quoted for shell safety

#### Label Naming Conventions

**Priority Labels:**
- Format: `priority: [level]` where level is: `critical`, `high`, `medium`, `low`
- Example: `priority: critical`, `priority: high`

**Category Labels:**
- Format: Single words or colon-separated namespaced labels
- Examples: `todo`, `enhancement`, `bug`, `documentation`

**Custom Labels:**
- Must follow GitHub's label naming requirements
- Can contain letters, numbers, spaces, hyphens, and underscores
- Maximum 50 characters in length
- Cannot start or end with spaces
- Special characters like colons (`:`) are supported for namespaced labels

#### Label Format Validation

The workflow performs the following validation checks:

**Supported Characters:**
- Alphanumeric characters: `a-z`, `A-Z`, `0-9`
- Spaces: Fully supported (e.g., `"priority: critical"`)
- Colons: Used for namespacing (e.g., `"type: bug"`)
- Hyphens: Standard separator (e.g., `"high-priority"`)
- Underscores: Alternative separator (e.g., `"action_required"`)

**Unsupported/Problematic Characters:**
- Leading or trailing spaces are automatically trimmed
- Empty strings are filtered out
- `null` values are ignored during processing

**Length Limits:**
- Individual labels: Maximum 50 characters
- Total labels per issue: No GitHub limit, but practical limit ~20-30 labels

#### Technical Implementation

The workflow handles label conversion as follows:

```javascript
/ Internal JSON format
labels = ["todo", "enhancement", "priority: critical", "bug"]

/ Converted to CLI arguments using jq and bash array
--label "todo" --label "enhancement" --label "priority: critical" --label "bug"
```

**Label Conversion Details:**
```bash
# Parse labels array and create individual --label flags
# Uses jq to safely extract array elements and quote them properly
while IFS= read -r label; do
  gh_args+=("--label" "$label")
done < <(echo "$labels" | jq -r '.[]')
```

**Important Notes:**
- Labels with spaces are automatically quoted for shell safety
- Special characters are preserved during conversion using proper `jq` parsing
- The workflow uses secure array-based argument passing (avoids `eval`)
- Invalid labels are logged but do not prevent issue creation
- Supports all GitHub-compatible label characters including colons, spaces, and hyphens

### Label Assignment Rules

Labels are automatically assigned based on task characteristics:

- **All tasks**: Receive `todo` and `enhancement` labels
- **Critical priority tasks**: Additionally receive `priority: critical` and `bug` labels
- **High priority tasks**: Additionally receive `priority: high` label
- **Medium priority tasks**: Additionally receive `priority: medium` label
- **Low priority tasks**: Additionally receive `priority: low` label

#### Priority Section Detection

The workflow recognizes the following priority section formats:

**Critical Priority Sections:**
- `Must-Do (Critical Priority)`
- `Must-Do (Phase 1)`
- Any section containing "must-do", "phase 1", or "critical" (case-insensitive)

**High Priority Sections:**
- `Should-Do (High Priority)`
- `Should-Do (Phase 2)`
- Any section containing "should-do", "phase 2", or "high" (case-insensitive)

**Medium Priority Sections:**
- `Nice-to-Have (Medium Priority)`
- `Priority Recommendations`
- Any section containing "medium" (case-insensitive)

**Low Priority Sections:**
- `Nice-to-Have (Low Priority)`
- `Phase 3-4` sections
- Any section containing "nice-to-have", "phase 3", "phase 4", or "low" (case-insensitive)

### Label Troubleshooting

#### Common Issues and Solutions

**Labels with Spaces Not Working:**
- ✅ **Correct**: Labels like `"priority: critical"` are fully supported
- ❌ **Issue**: Ensure the workflow uses proper quoting in the GitHub CLI command
- 🔧 **Solution**: The workflow automatically quotes labels containing spaces

**Special Characters in Labels:**
- ✅ **Supported**: Colons (`:`), hyphens (`-`), underscores (`_`)
- ❌ **Avoid**: Emoji, quotes, backslashes, or other shell-special characters
- 🔧 **Solution**: Use standard alphanumeric characters and supported separators

**Label Not Appearing on Issues:**
- Check that the repository has permission to create/assign labels
- Verify the label doesn't exceed GitHub's 50-character limit
- Ensure the label text is not empty after trimming

**Duplicate Labels:**
- The workflow automatically deduplicates labels in the JSON array
- Multiple labels with different cases are treated as separate labels

### Label Format Examples

#### Valid Label Examples

```json
{
  "valid_labels": [
    "todo",
    "enhancement", 
    "priority: critical",
    "priority: high",
    "priority: medium", 
    "priority: low",
    "bug",
    "documentation",
    "feature-request",
    "help_wanted",
    "good-first-issue",
    "type: improvement",
    "area: frontend"
  ]
}
```

#### Generated GitHub CLI Commands

For a critical priority task, the workflow generates:
```bash
gh issue create \
  --title "Fix critical security vulnerability" \
  --body "Detailed description here..." \
  --label "todo" \
  --label "enhancement" \
  --label "priority: critical" \
  --label "bug"
```

For a high priority task:
```bash
gh issue create \
  --title "Implement new user dashboard" \
  --body "Detailed description here..." \
  --label "todo" \
  --label "enhancement" \
  --label "priority: high"
```

#### Label Processing Flow

1. **Task Detection**: Workflow identifies actionable tasks in markdown files
2. **Priority Assignment**: Determines priority based on section headers
3. **Label Array Creation**: Builds JSON array: `["todo", "enhancement", "priority: high"]`
4. **CLI Conversion**: Uses `jq -r '.[]'` to extract individual labels
5. **Issue Creation**: Passes each label as separate `--label "value"` argument to GitHub CLI

## Permissions

The workflow requires the following permissions:
- `contents: read` - To read repository files
- `issues: write` - To create and manage issues
- `actions: read` - To read workflow files

## Output and Monitoring

### GitHub Actions Summary

Each run provides a detailed summary including:
- Number of todo files processed
- Total actionable tasks found
- Issues created vs. skipped (duplicates)
- Breakdown by priority level

### Issue Organization

Generated issues can be easily managed through:
- **Labels**: Filter by `todo`, priority levels, or enhancement type
- **Search**: All issues include source file references
- **Tracking**: Each issue links back to the source todo file and line number

## Example Output

For a todo file containing:

```markdown
### Must-Do (Phase 1)
1. Implement priority-based response architecture
2. Add Responsible Person regulatory crisis section

**Improvements Needed**:
- Create comprehensive timeline analysis
- Enhance evidence architecture to include 50+ annexures
```

The workflow would create 4 GitHub issues with appropriate priorities and full context.

## Error Handling & Monitoring

### Enhanced Error Handling (v2.0)

The workflow includes comprehensive error handling designed to provide detailed diagnostics and graceful failure recovery:

#### File Processing Errors
- **File Access Issues**: Automatically handles missing files, permission errors, and encoding problems
- **Empty Files**: Gracefully skips empty or invalid files with appropriate logging
- **Malformed Content**: Continues processing other files when individual files contain errors
- **Summary Reporting**: Provides detailed counts of successfully processed vs failed files

#### GitHub API Error Handling  
- **Authentication Verification**: Automatically checks GitHub CLI authentication before operations
- **Retry Logic**: Implements 3-attempt retry mechanism with exponential backoff for transient failures
- **Rate Limiting Protection**: Built-in delays between API calls to prevent rate limit errors
- **Graceful Degradation**: Falls back to basic operations when advanced features fail

#### Data Processing Errors
- **JSON Validation**: Comprehensive validation of generated data structures
- **Safe Parsing**: Error-resistant parsing with fallback to default values
- **Partial Results**: Continues with partial data when some processing steps fail
- **Error Recovery**: Creates minimal valid output even when major errors occur

#### Issue Creation Robustness
- **Duplicate Detection**: Robust duplicate checking with fallback when API calls fail
- **Validation**: Pre-validates issue data before attempting creation
- **Batch Processing**: Handles large numbers of issues with progress tracking
- **Failure Tracking**: Maintains detailed logs of which specific issues failed and why

### Monitoring

#### GitHub Actions Dashboard
- Check the Actions tab for workflow execution results
- Review the workflow summary for statistics and any issues
- Monitor the Issues tab for generated tasks

#### Enhanced Logging Features
- **Step-by-Step Progress**: Detailed logging of each processing step
- **Error Classification**: Categorizes errors by type for easier debugging  
- **Performance Metrics**: Reports processing times and success rates
- **Failure Details**: Specific information about failed operations including retry attempts

#### Workflow Summary Report
Each workflow run now provides:
- **File Processing Summary**: Successfully processed vs failed files
- **Issue Creation Results**: Created, skipped, and failed issue counts
- **Error Details**: Specific errors with context and suggested fixes
- **Performance Data**: Processing times and operation counts
- **Recovery Actions**: Automatic recovery steps taken during execution

### Troubleshooting
If issues aren't being created:
1. Ensure todo files contain actionable language
2. Check that tasks are in recognizable sections (Must-Do, Should-Do, etc.)
3. Verify file changes are in the `todo/` folder
4. Review Actions logs for parsing errors
5. Check GitHub Actions permissions if getting API errors

**Enhanced Error Handling** (v2.0):
- **File Processing**: The workflow now handles malformed files, encoding issues, and permission problems gracefully
- **API Failures**: Includes retry logic (3 attempts) for transient GitHub API failures
- **JSON Validation**: Comprehensive validation of generated data with fallback mechanisms
- **Authentication**: Automatic verification of GitHub CLI authentication before operations
- **Rate Limiting**: Built-in delays to prevent API rate limiting issues
- **Error Recovery**: Continues processing other files/tasks when individual items fail
- **Detailed Logging**: Enhanced logging with error classification and debugging information

**Common Error Scenarios**:
- **"No todo files found"**: Check that files exist in `todo/` directory with `.md` extension
- **"Failed to create issue"**: Usually indicates GitHub token permission issues or API limits
- **"Invalid JSON output"**: Indicates file parsing errors - check file encoding and content
- **"Authentication failed"**: Verify `GITHUB_TOKEN` has `issues: write` permission
- **"Duplicate issues skipped"**: Expected behavior unless force regeneration is enabled

**Note**: Labels are automatically converted from JSON arrays to individual `--label` arguments for GitHub CLI compatibility. The workflow handles labels with spaces correctly (e.g., "priority: critical").
**Label Handling Notes:**
- Labels are automatically converted from JSON arrays to individual `--label` arguments for GitHub CLI compatibility
- The workflow handles labels with spaces correctly (e.g., "priority: critical")
- Labels containing special characters are automatically escaped and quoted
- If label creation fails, check the Actions logs for specific GitHub API error messages
- Ensure repository labels exist or have proper permissions to create new labels
**Note**: Labels are automatically converted from JSON arrays to individual `--label` arguments for GitHub CLI compatibility. The workflow uses secure array-based argument passing (not `eval`) to properly handle labels with special characters, spaces, and colons (e.g., "priority: critical", "bug: high-priority").

### Customization
The workflow can be customized by modifying:
- Action word patterns in the parsing logic
- Priority detection rules
- Quality filtering criteria
- Issue template structure

---

This workflow transforms todo documentation into actionable GitHub issues, ensuring that improvement plans and recommendations become trackable tasks that can be assigned, prioritized, and completed systematically.