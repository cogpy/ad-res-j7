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
- Non-actionable descriptions (Current Coverage, Legal Significance, etc.)
- Effort estimates (text ending with "hours")
- Generic descriptive text

**Includes:**
- Tasks with explicit action words
- Clear task descriptions mentioning sections, responses, affidavits, etc.
- Items from priority sections
- Implementation-focused content

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
2. **CLI Conversion**: JSON arrays are converted to individual `--label` arguments for GitHub CLI compatibility
3. **Escaping**: Labels containing spaces or special characters are automatically quoted

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

#### Technical Implementation

The workflow handles label conversion as follows:

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

### Label Assignment Rules

Labels are automatically assigned based on task characteristics:

- **All tasks**: Receive `todo` and `enhancement` labels
- **Critical priority tasks**: Additionally receive `priority: critical` and `bug` labels
- **High priority tasks**: Additionally receive `priority: high` label
- **Medium priority tasks**: Additionally receive `priority: medium` label
- **Low priority tasks**: Additionally receive `priority: low` label

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

## Maintenance

### Monitoring
- Check the Actions tab for workflow execution results
- Review the workflow summary for statistics and any issues
- Monitor the Issues tab for generated tasks

### Troubleshooting
If issues aren't being created:
1. Ensure todo files contain actionable language
2. Check that tasks are in recognizable sections (Must-Do, Should-Do, etc.)
3. Verify file changes are in the `todo/` folder
4. Review Actions logs for parsing errors
5. Check GitHub Actions permissions if getting API errors

**Label Handling Notes:**
- Labels are automatically converted from JSON arrays to individual `--label` arguments for GitHub CLI compatibility
- The workflow handles labels with spaces correctly (e.g., "priority: critical")
- Labels containing special characters are automatically escaped and quoted
- If label creation fails, check the Actions logs for specific GitHub API error messages
- Ensure repository labels exist or have proper permissions to create new labels

### Customization
The workflow can be customized by modifying:
- Action word patterns in the parsing logic
- Priority detection rules
- Quality filtering criteria
- Issue template structure

---

This workflow transforms todo documentation into actionable GitHub issues, ensuring that improvement plans and recommendations become trackable tasks that can be assigned, prioritized, and completed systematically.