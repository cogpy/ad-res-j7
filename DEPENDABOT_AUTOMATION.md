# 🤖 Dependabot Automation Guide

This repository now includes automated Dependabot PR management and GitHub CLI authentication fixes.

## 📋 Overview

### New Workflows Added

1. **Dependabot Auto-Merge** (`.github/workflows/dependabot-auto-merge.yml`)
2. **GitHub CLI Authentication Fix** (`.github/workflows/github-cli-auth-fix.yml`)
3. **Dependabot Configuration** (`.github/dependabot.yml`)

## 🔄 Dependabot Auto-Merge Workflow

### What It Does

Automatically merges Dependabot pull requests when:
- ✅ All tests pass
- ✅ PR is created by `dependabot[bot]`
- ✅ Update is a **patch** or **security** update
- ✅ PR is not a draft

### Auto-Merge Criteria

| Update Type | Auto-Merge | Manual Review |
|-------------|------------|---------------|
| **Security Updates** | ✅ Yes | ❌ No |
| **Patch Updates** (1.0.0 → 1.0.1) | ✅ Yes | ❌ No |
| **Minor Updates** (1.0.0 → 1.1.0) | ❌ No | ✅ Yes |
| **Major Updates** (1.0.0 → 2.0.0) | ❌ No | ✅ Yes |

### Features

- **Smart Detection**: Automatically identifies update types
- **Test Validation**: Waits for all checks to complete before merging
- **Status Comments**: Adds explanatory comments to PRs
- **Error Handling**: Gracefully handles merge conflicts and failures
- **Comprehensive Logging**: Detailed workflow summaries

### Example Workflow

1. Dependabot creates a PR for a patch update
2. GitHub Actions runs all tests
3. Auto-merge workflow waits for tests to complete
4. If tests pass → PR is automatically merged with squash commit
5. If tests fail → PR remains open for manual review
6. Workflow adds status comment explaining the action taken

## 🔐 GitHub CLI Authentication Fix

### The Problem

Common error in CI/CD environments:
```
The value of the GITHUB_TOKEN environment variable is being used for authentication.
To have GitHub CLI store credentials instead, first clear the value from the environment.
##[error]Process completed with exit code 1.
```

### The Solution

**❌ Incorrect (causes error):**
```yaml
- name: Authenticate GitHub CLI
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  run: |
    echo "$GITHUB_TOKEN" | gh auth login --with-token
```

**✅ Correct (server-side compatible):**
```yaml
- name: Authenticate GitHub CLI (server-side)
  env:
    GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  run: |
    gh auth setup-git
```

### Key Changes

1. **Use `GH_TOKEN`** instead of `GITHUB_TOKEN` for CLI commands
2. **Use `gh auth setup-git`** for server-side authentication
3. **Avoid interactive login** commands in CI/CD environments

## ⚙️ Dependabot Configuration

### Schedule

- **npm dependencies**: Weekly on Mondays at 09:00 UTC
- **GitHub Actions**: Weekly on Mondays at 10:00 UTC
- **Docker**: Weekly on Tuesdays at 09:00 UTC

### Settings

- **Open PR Limit**: 10 for npm, 5 for actions, 3 for docker
- **Reviewers**: drzo, danregima
- **Assignees**: drzo
- **Labels**: Automatically tagged with dependency type

### Auto-Merge Compatibility

The configuration includes `allow` settings that work with our auto-merge workflow:
- Patch updates for all dependency types
- Minor updates for GitHub Actions (generally safe)

## 🚀 Getting Started

### 1. Enable Dependabot (if not already enabled)

1. Go to your repository settings
2. Navigate to "Security & analysis"
3. Enable "Dependabot alerts" and "Dependabot security updates"

### 2. Verify Workflow Permissions

Ensure your repository has the following permissions for GitHub Actions:
- **Contents**: write
- **Pull requests**: write
- **Checks**: read
- **Statuses**: read

### 3. Test the Setup

You can manually trigger the authentication fix workflow to verify everything works:

1. Go to Actions tab in your repository
2. Select "GitHub CLI Authentication Fix Reference"
3. Click "Run workflow"
4. Enable "Test GitHub CLI authentication"

## 📊 Monitoring

### Workflow Summaries

Each workflow run provides detailed summaries:
- **Auto-merge decisions** with reasoning
- **Test results** and check status
- **Error details** if something goes wrong

### PR Comments

The workflow automatically adds comments to Dependabot PRs explaining:
- Whether the PR was auto-merged or requires manual review
- The criteria used for the decision
- Next steps if manual review is needed

## 🛠️ Troubleshooting

### Common Issues

1. **Tests failing**: Auto-merge is skipped, PR remains open
2. **Merge conflicts**: Auto-merge fails gracefully, adds error comment
3. **Branch protection**: May prevent auto-merge, check repository settings

### Manual Override

To manually merge a PR that wasn't auto-merged:
1. Review the changes
2. Ensure tests pass
3. Merge using your preferred method (squash recommended)

### Disabling Auto-Merge

To disable auto-merge for specific PRs, add the label `no-auto-merge` to the PR.

## 🔍 Security Considerations

- **Security updates** are always prioritized for auto-merge
- **Major updates** always require manual review
- **Test validation** is mandatory before any auto-merge
- **Audit trail** is maintained through commit messages and comments

## 📚 References

- [GitHub CLI Manual - Authentication](https://cli.github.com/manual/gh_auth_login)
- [GitHub Actions - Using GitHub CLI](https://docs.github.com/en/actions/using-workflows/using-github-cli-in-workflows)
- [Dependabot Configuration](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file)

---

*This automation helps maintain up-to-date dependencies while ensuring code quality and security.*