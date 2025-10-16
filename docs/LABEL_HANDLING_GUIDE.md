# Label Handling Guide for GitHub Actions

## Overview

This guide documents the correct approach for handling complex multi-word labels (e.g., `"priority: critical"`) in GitHub Actions workflows and Node.js scripts.

## Problem Statement

When creating GitHub issues programmatically with labels that contain spaces and special characters (like colons), proper handling is required to ensure:

1. Labels are correctly passed to the GitHub CLI (`gh`) or GitHub API
2. Shell interpretation doesn't break or misparse the labels
3. Security is maintained (no command injection vulnerabilities)

## Solution: Use `spawnSync` with Array Arguments

### ✅ Correct Approach (Current Implementation)

```javascript
const { spawnSync } = require('child_process');

// Build arguments as an array
const args = [
  'issue', 'create',
  '--title', 'Issue Title',
  '--body', 'Issue body'
];

// Add labels to the array
const labels = ['bug', 'priority: critical', 'enhancement'];
labels.forEach(label => {
  args.push('--label', label);
});

// Use spawnSync with array of arguments
const result = spawnSync('gh', args, { 
  encoding: 'utf8',
  env: process.env
});

if (result.status === 0) {
  console.log('Issue created:', result.stdout.trim());
} else {
  console.error('Error:', result.stderr);
}
```

**Why this works:**
- Arguments are passed directly to the command without shell interpretation
- Spaces and special characters in labels are preserved exactly
- No risk of command injection
- More secure and reliable

### ❌ Problematic Approach (Avoid)

```javascript
// DON'T DO THIS - Has potential issues
const command = `gh issue create --title "Title" --label "priority: critical"`;
execSync(command);

// OR THIS - Relies on shell parsing
const command = `gh ${args.map(arg => JSON.stringify(arg)).join(' ')}`;
execSync(command);
```

**Why this is problematic:**
- Relies on shell to correctly parse quoted strings
- Requires proper escaping of special characters
- Potential for command injection if inputs aren't sanitized
- Different shells may parse differently

## Label Formats Supported

The following label formats are fully supported:

| Label Format | Example | Notes |
|--------------|---------|-------|
| Simple | `bug`, `enhancement` | Standard alphanumeric labels |
| With dashes | `workflow-reliability-alert` | Dashes work in all contexts |
| With colons | `priority: critical` | Need proper quoting |
| With spaces | `must-do: phase 1` | Need proper quoting |
| Multi-word | `label with spaces` | Need proper quoting |

## Implementation in Different Contexts

### 1. Node.js Scripts (batch-create-issues.js)

```javascript
async createGitHubIssue(item, categoryInfo) {
  const args = ['issue', 'create', '--title', item.title, '--body', body];
  
  // Add labels - works with any label format
  const allLabels = [...categoryInfo.labels, 'batch-created'];
  allLabels.forEach(label => {
    args.push('--label', label);
  });
  
  // Execute with spawnSync
  const result = spawnSync('gh', args, { 
    encoding: 'utf8',
    env: process.env
  });
  
  if (result.status !== 0) {
    throw new Error(result.stderr || 'GitHub CLI command failed');
  }
  
  return result.stdout.trim();
}
```

### 2. Bash Scripts in GitHub Actions Workflows

```bash
# Parse labels from JSON array
labels_json='["bug","priority: critical","enhancement"]'

# Build args array
gh_args=("issue" "create" "--title" "$title" "--body" "$body")

# Extract labels from JSON and add to args
if [ "$labels_json" != "[]" ] && [ "$labels_json" != "null" ]; then
  while IFS= read -r label; do
    if [ -n "$label" ] && [ "$label" != "null" ]; then
      gh_args+=("--label" "$label")
    fi
  done < <(echo "$labels_json" | jq -r '.[]' 2>/dev/null || echo "")
fi

# Execute with proper array expansion
gh "${gh_args[@]}"
```

**Key points:**
- Use bash arrays (`gh_args=()`)
- Use proper array expansion (`"${gh_args[@]}"`)
- Use `jq -r '.[]'` to extract labels from JSON
- Quote variables that may contain spaces

### 3. GitHub Actions with actions/github-script

```yaml
- name: Create issue with complex labels
  uses: actions/github-script@v7
  with:
    script: |
      await github.rest.issues.create({
        owner: context.repo.owner,
        repo: context.repo.repo,
        title: 'Issue Title',
        body: 'Issue body',
        labels: ['bug', 'priority: critical', 'enhancement']
      });
```

**Key points:**
- JavaScript arrays work naturally with the GitHub API
- No special escaping needed
- Labels with spaces and colons work directly

## Testing

### Automated Tests

Run the comprehensive label handling tests:

```bash
# Test label handling validation
node tests/label-handling-test.js

# Test command building (dry-run)
node tests/manual-test-label-creation.js

# Test with actual issue creation (requires authentication)
node tests/manual-test-label-creation.js --no-dry-run
```

### Manual Verification

To manually test label creation:

1. Authenticate with GitHub CLI:
   ```bash
   gh auth login
   ```

2. Create a test issue:
   ```bash
   gh issue create \
     --repo cogpy/ad-res-j7 \
     --title "Test: Complex Labels" \
     --body "Testing label handling" \
     --label "bug" \
     --label "priority: critical" \
     --label "must-do: phase 1"
   ```

3. Verify labels appear correctly on the created issue

## Common Issues and Solutions

### Issue: Labels with spaces not working

**Problem:**
```javascript
// Wrong - shell interprets spaces
execSync(`gh issue create --label priority: critical`);
```

**Solution:**
```javascript
// Correct - use array args
spawnSync('gh', ['issue', 'create', '--label', 'priority: critical']);
```

### Issue: Labels getting split on colons

**Problem:**
```bash
# Wrong - colon may be interpreted as separator
gh issue create --label priority:critical
```

**Solution:**
```bash
# Correct - use quotes in bash
gh issue create --label "priority: critical"

# Or use bash array with proper expansion
gh_args=(issue create --label "priority: critical")
gh "${gh_args[@]}"
```

### Issue: JSON parsing errors

**Problem:**
```javascript
// Wrong - labels not properly quoted in JSON
const labels = [priority: critical]; // Syntax error
```

**Solution:**
```javascript
// Correct - proper JSON array with quoted strings
const labels = ['priority: critical', 'bug'];
const labelsJson = JSON.stringify(labels);
```

## Best Practices

1. **Always use array-based argument passing** in Node.js (`spawnSync`)
2. **Use bash arrays** in shell scripts (`gh_args=()`)
3. **Properly quote** when building command strings (though arrays are preferred)
4. **Test with complex labels** that include spaces and colons
5. **Use `jq`** for JSON parsing in bash scripts
6. **Validate labels** before passing to commands
7. **Log commands** during development (without executing) to verify structure

## Security Considerations

### Command Injection Prevention

**Vulnerable code:**
```javascript
// NEVER DO THIS - vulnerable to injection
const label = getUserInput();
execSync(`gh issue create --label ${label}`);
```

**Safe code:**
```javascript
// Safe - array args prevent injection
const label = getUserInput();
spawnSync('gh', ['issue', 'create', '--label', label]);
```

### Input Validation

Always validate label inputs:

```javascript
function isValidLabel(label) {
  // Check for problematic characters
  const hasProblematicChars = /[`$\\;]/.test(label);
  if (hasProblematicChars) {
    throw new Error(`Invalid characters in label: ${label}`);
  }
  
  // Check length
  if (label.length > 100) {
    throw new Error('Label too long');
  }
  
  return true;
}
```

## References

- GitHub CLI Documentation: https://cli.github.com/manual/gh_issue_create
- GitHub REST API - Issues: https://docs.github.com/en/rest/issues/issues
- Node.js child_process: https://nodejs.org/api/child_process.html
- Bash Arrays: https://www.gnu.org/software/bash/manual/html_node/Arrays.html

## Change History

- **2025-10-16**: Initial documentation
  - Documented `spawnSync` approach for Node.js
  - Added bash array handling examples
  - Created comprehensive test suite
  - Fixed `batch-create-issues.js` to use `spawnSync`

## Related Issues

- #1080: Fix label array handling in GitHub Actions workflow
- #1079: Validate issue creation with complex multi-word labels like "priority: critical"
