#!/usr/bin/env node

/**
 * Cleanup Duplicate GitHub Issues
 * 
 * This script identifies and closes duplicate GitHub issues based on:
 * - Exact title matches
 * - Similar titles (normalized comparison)
 * - Descriptive text that shouldn't be issues
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class DuplicateIssueCleaner {
  constructor() {
    this.issues = [];
    this.duplicates = new Map(); // Map of issue number to array of duplicate numbers
    this.descriptiveIssues = []; // Issues that are just descriptions, not tasks
    this.closedCount = 0;
    this.dryRun = true; // Default to dry run for safety
  }

  /**
   * Load all issues from the repository
   */
  async loadIssues(includesClosed = false) {
    try {
      console.log(`📋 Loading ${includesClosed ? 'all' : 'open'} issues...`);
      const repo = process.env.GITHUB_REPOSITORY || 'cogpy/ad-res-j7';
      const state = includesClosed ? 'all' : 'open';
      
      // Get issues in batches
      let allIssues = [];
      let page = 1;
      let hasMore = true;
      
      while (hasMore) {
        try {
          const output = execSync(
            `gh api "repos/${repo}/issues?state=${state}&per_page=100&page=${page}"`,
            {
              encoding: 'utf8',
              stdio: ['pipe', 'pipe', 'pipe']
            }
          );
          
          const issues = JSON.parse(output);
          if (issues.length === 0) {
            hasMore = false;
          } else {
            allIssues = allIssues.concat(issues);
            page++;
            
            // Stop after 10 pages to avoid too many API calls
            if (page > 10) {
              console.log('⚠️ Limiting to first 1000 issues');
              hasMore = false;
            }
          }
        } catch (error) {
          // No more pages
          hasMore = false;
        }
      }
      
      // Filter out pull requests
      this.issues = allIssues.filter(issue => !issue.pull_request);
      
      console.log(`✅ Loaded ${this.issues.length} ${includesClosed ? '' : 'open '}issues`);
      return this.issues;
    } catch (error) {
      console.error('❌ Failed to load issues:', error.message);
      process.exit(1);
    }
  }

  /**
   * Normalize a title for comparison
   */
  normalizeTitle(title) {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/g, '') // Remove punctuation
      .replace(/\s+/g, ' ')     // Normalize whitespace
      .trim();
  }

  /**
   * Check if a title is descriptive rather than actionable
   */
  isDescriptiveTitle(title) {
    const descriptivePatterns = [
      /^current coverage/i,
      /^peter's causation/i,
      /^disproportionate relief/i,
      /^peter's participation/i,
      /^demonstrate /i,
      /^show /i,
      /^provide /i,
      /^include /i,
      /^highlight /i,
      /^emphasize /i,
      /^add external validation/i,
      /timing correlation/i,
      /director loan account/i,
      /established practice/i,
      /bad faith/i,
      /point.?by.?point/i,
      /general refutation/i,
      /business norms/i,
      /loan account credit/i,
      /informal model/i,
      /accounting records/i,
      /pretext evidence/i,
      /\*\*.*\*\*:/, // Bold text with colon
      /^\[?J[FD]\d+[A-Z]?:?/i, // JF/JD references
    ];

    return descriptivePatterns.some(pattern => pattern.test(title));
  }

  /**
   * Find duplicate issues
   */
  findDuplicates() {
    console.log('\n🔍 Analyzing issues for duplicates...');
    
    // Sort issues by creation date (oldest first)
    const sortedIssues = [...this.issues].sort((a, b) => 
      new Date(a.created_at) - new Date(b.created_at)
    );

    // Group by normalized title
    const titleGroups = new Map();
    
    for (const issue of sortedIssues) {
      const normalized = this.normalizeTitle(issue.title);
      
      if (!titleGroups.has(normalized)) {
        titleGroups.set(normalized, []);
      }
      titleGroups.get(normalized).push(issue);
    }

    // Identify duplicates (keep oldest)
    for (const [normalized, group] of titleGroups) {
      if (group.length > 1) {
        const [original, ...duplicates] = group;
        this.duplicates.set(original.number, duplicates.map(d => d.number));
        
        console.log(`\n📦 Duplicate group: "${group[0].title}"`);
        console.log(`  ✅ Keep: #${original.number} (created ${original.created_at})`);
        duplicates.forEach(dup => {
          console.log(`  ❌ Close: #${dup.number} (created ${dup.created_at})`);
        });
      }
    }

    // Find descriptive issues that shouldn't exist
    for (const issue of sortedIssues) {
      if (this.isDescriptiveTitle(issue.title)) {
        this.descriptiveIssues.push(issue);
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`  - Found ${this.duplicates.size} issues with duplicates`);
    console.log(`  - Total duplicate issues to close: ${Array.from(this.duplicates.values()).flat().length}`);
    console.log(`  - Found ${this.descriptiveIssues.length} descriptive issues`);
  }

  /**
   * Close duplicate issues
   */
  async closeDuplicates() {
    if (this.dryRun) {
      console.log('\n🔍 DRY RUN MODE - No issues will be closed\n');
    } else {
      console.log('\n🚀 Closing duplicate issues...\n');
    }

    // Close duplicates
    for (const [original, duplicates] of this.duplicates) {
      for (const duplicate of duplicates) {
        await this.closeIssue(duplicate, `Duplicate of #${original}`, 'duplicate');
      }
    }

    // Close descriptive issues
    for (const issue of this.descriptiveIssues) {
      // Check if it's already in a duplicate group
      const isAlreadyDuplicate = Array.from(this.duplicates.values())
        .flat()
        .includes(issue.number);
      
      if (!isAlreadyDuplicate) {
        await this.closeIssue(
          issue.number, 
          'This appears to be descriptive text rather than an actionable task. Closing to keep issues focused on actual work items.',
          'not_planned'
        );
      }
    }

    if (!this.dryRun) {
      console.log(`\n✅ Closed ${this.closedCount} issues`);
    }
  }

  /**
   * Close a single issue
   */
  async closeIssue(issueNumber, comment, reason = 'completed') {
    const issue = this.issues.find(i => i.number === issueNumber);
    const title = issue ? issue.title : 'Unknown';
    
    if (this.dryRun) {
      console.log(`[DRY RUN] Would close #${issueNumber}: "${title}"`);
      console.log(`          Reason: ${comment}`);
      return;
    }

    try {
      // Add comment explaining why we're closing
      execSync(
        `gh issue comment ${issueNumber} --body "${comment}\n\n*Closed automatically by duplicate cleanup script*"`,
        { stdio: 'ignore' }
      );

      // Close the issue
      execSync(
        `gh issue close ${issueNumber} --reason ${reason}`,
        { stdio: 'ignore' }
      );

      console.log(`✅ Closed #${issueNumber}: "${title}"`);
      this.closedCount++;
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`❌ Failed to close #${issueNumber}: ${error.message}`);
    }
  }

  /**
   * Generate a summary report
   */
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      totalIssues: this.issues.length,
      duplicateGroups: this.duplicates.size,
      duplicatesToClose: Array.from(this.duplicates.values()).flat().length,
      descriptiveIssues: this.descriptiveIssues.length,
      closedCount: this.closedCount,
      dryRun: this.dryRun,
      duplicates: {},
      descriptive: []
    };

    // Add duplicate details
    for (const [original, duplicates] of this.duplicates) {
      const originalIssue = this.issues.find(i => i.number === original);
      report.duplicates[original] = {
        title: originalIssue ? originalIssue.title : 'Unknown',
        duplicates: duplicates
      };
    }

    // Add descriptive issue details
    report.descriptive = this.descriptiveIssues.map(issue => ({
      number: issue.number,
      title: issue.title
    }));

    // Save report
    const reportPath = path.join(process.cwd(), 'duplicate-cleanup-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`\n📄 Report saved to: ${reportPath}`);
    return report;
  }

  /**
   * Main execution
   */
  async run(options = {}) {
    this.dryRun = options.dryRun !== false; // Default to true
    
    console.log('🧹 GitHub Issue Duplicate Cleanup Tool');
    console.log('=====================================\n');
    
    // Check GitHub CLI
    try {
      execSync('gh --version', { stdio: 'ignore' });
    } catch (error) {
      console.error('❌ GitHub CLI (gh) is not installed or not in PATH');
      process.exit(1);
    }

    // Check authentication
    try {
      execSync('gh auth status', { stdio: 'ignore' });
    } catch (error) {
      console.error('❌ Not authenticated with GitHub CLI. Run: gh auth login');
      process.exit(1);
    }

    // Load issues
    await this.loadIssues();

    // Find duplicates
    this.findDuplicates();

    // Close duplicates
    await this.closeDuplicates();

    // Generate report
    this.generateReport();

    console.log('\n✨ Cleanup complete!');
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {
    dryRun: !args.includes('--execute')
  };

  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
GitHub Issue Duplicate Cleanup Tool

Usage:
  cleanup-duplicate-issues.js [options]

Options:
  --execute     Actually close issues (default is dry run)
  --help, -h    Show this help message

Examples:
  # Dry run (preview what would be closed)
  node cleanup-duplicate-issues.js
  
  # Execute cleanup
  node cleanup-duplicate-issues.js --execute

Safety:
  - By default, runs in dry run mode
  - Creates a report of all actions
  - Adds comments before closing issues
  - Preserves oldest issue in duplicate groups
`);
    process.exit(0);
  }

  const cleaner = new DuplicateIssueCleaner();
  cleaner.run(options).catch(error => {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  });
}

module.exports = DuplicateIssueCleaner;