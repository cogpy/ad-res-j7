#!/usr/bin/env node

/**
 * Batch Create GitHub Issues from Repository Items
 * 
 * Advanced script for creating multiple GitHub issues from repository items
 * with duplicate detection, batch processing, and workflow integration.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class BatchIssueCreator {
  constructor() {
    this.existingIssues = new Set();
    this.createdIssues = [];
    this.skippedIssues = [];
    this.failedIssues = [];
  }

  /**
   * Load existing issues to prevent duplicates
   */
  async loadExistingIssues() {
    try {
      console.log('📋 Loading existing issues...');
      const output = execSync('gh api repos/$GITHUB_REPOSITORY/issues?state=all&per_page=100 --paginate', {
        encoding: 'utf8',
        env: { ...process.env, GITHUB_REPOSITORY: process.env.GITHUB_REPOSITORY || 'cogpy/ad-res-j7' }
      });
      
      const issues = JSON.parse(output);
      issues.forEach(issue => {
        this.existingIssues.add(issue.title.toLowerCase());
      });
      
      console.log(`✅ Loaded ${this.existingIssues.size} existing issues`);
    } catch (error) {
      console.warn('⚠️ Could not load existing issues, continuing without duplicate detection');
    }
  }

  /**
   * Parse repository items from multiple formats
   */
  parseRepositoryItems(input) {
    const items = [];
    const lines = input.split('\n').filter(line => line.trim());
    
    for (const line of lines) {
      // Skip line numbers or list indices at the beginning
      const cleanLine = line.replace(/^\d+\s*/, '');
      
      // Pattern 1: [Title](URL) #number
      const pattern1 = cleanLine.match(/\[(.+?)\]\((.+?)\)\s*#(\d+)/);
      if (pattern1) {
        items.push({
          title: pattern1[1].trim(),
          url: pattern1[2],
          number: pattern1[3],
          originalLine: line
        });
        continue;
      }
      
      // Pattern 2: Title with #number at the end
      const pattern2 = cleanLine.match(/(.+?)\s*#(\d+)\s*$/);
      if (pattern2) {
        items.push({
          title: pattern2[1].trim(),
          url: null,
          number: pattern2[2],
          originalLine: line
        });
        continue;
      }
      
      // Pattern 3: Simple title (no issue number)
      if (cleanLine.length > 10) {
        items.push({
          title: cleanLine.trim(),
          url: null,
          number: null,
          originalLine: line
        });
      }
    }
    
    return items;
  }

  /**
   * Categorize items by content type
   */
  categorizeItem(item) {
    const title = item.title.toLowerCase();
    
    // Legal/Case related
    if (title.includes('affidavit') || title.includes('legal') || title.includes('court')) {
      return { category: 'legal', priority: 'high', labels: ['legal', 'documentation'] };
    }
    
    // Evidence related
    if (title.includes('evidence') || title.includes('forensic') || title.includes('proof')) {
      return { category: 'evidence', priority: 'high', labels: ['evidence', 'documentation'] };
    }
    
    // Financial related
    if (title.includes('financial') || title.includes('payment') || title.includes('account') || 
        title.includes('bank') || title.includes('sars')) {
      return { category: 'financial', priority: 'medium', labels: ['financial', 'analysis'] };
    }
    
    // Testing/Technical
    if (title.includes('test') || title.includes('workflow') || title.includes('automated')) {
      return { category: 'technical', priority: 'medium', labels: ['testing', 'automation'] };
    }
    
    // Timeline/Analysis
    if (title.includes('timeline') || title.includes('analysis') || title.includes('demonstrate')) {
      return { category: 'analysis', priority: 'medium', labels: ['analysis', 'documentation'] };
    }
    
    // Default
    return { category: 'general', priority: 'medium', labels: ['enhancement', 'todo'] };
  }

  /**
   * Generate enhanced issue body
   */
  generateIssueBody(item, categoryInfo) {
    let body = `## Overview\n\n`;
    body += `This issue addresses: **${item.title}**\n\n`;
    
    if (item.url || item.number) {
      body += `## Related Context\n\n`;
      if (item.url) {
        body += `- Source: ${item.url}\n`;
      }
      if (item.number) {
        body += `- Related to: #${item.number}\n`;
      }
      body += `\n`;
    }
    
    body += `## Category: ${categoryInfo.category.toUpperCase()}\n\n`;
    
    // Add category-specific sections
    switch (categoryInfo.category) {
      case 'legal':
        body += `### Legal Requirements\n\n`;
        body += `- [ ] Review relevant legal precedents\n`;
        body += `- [ ] Ensure compliance with court requirements\n`;
        body += `- [ ] Validate all claims with evidence\n`;
        body += `- [ ] Review for professional language and tone\n\n`;
        break;
        
      case 'evidence':
        body += `### Evidence Checklist\n\n`;
        body += `- [ ] Gather all relevant documentation\n`;
        body += `- [ ] Verify authenticity and timestamps\n`;
        body += `- [ ] Create clear chain of custody\n`;
        body += `- [ ] Prepare summary with key points highlighted\n\n`;
        break;
        
      case 'financial':
        body += `### Financial Analysis Requirements\n\n`;
        body += `- [ ] Collect all relevant financial records\n`;
        body += `- [ ] Perform reconciliation where applicable\n`;
        body += `- [ ] Document all calculations and methodologies\n`;
        body += `- [ ] Prepare clear visualizations if helpful\n\n`;
        break;
        
      case 'technical':
        body += `### Technical Implementation\n\n`;
        body += `- [ ] Review existing implementation\n`;
        body += `- [ ] Design solution approach\n`;
        body += `- [ ] Implement with proper error handling\n`;
        body += `- [ ] Add comprehensive testing\n`;
        body += `- [ ] Update documentation\n\n`;
        break;
        
      case 'analysis':
        body += `### Analysis Approach\n\n`;
        body += `- [ ] Gather all relevant data points\n`;
        body += `- [ ] Perform systematic analysis\n`;
        body += `- [ ] Document findings clearly\n`;
        body += `- [ ] Create visualizations where helpful\n`;
        body += `- [ ] Prepare executive summary\n\n`;
        break;
        
      default:
        body += `### Implementation Steps\n\n`;
        body += `- [ ] Review requirements\n`;
        body += `- [ ] Plan implementation approach\n`;
        body += `- [ ] Execute implementation\n`;
        body += `- [ ] Test and validate\n`;
        body += `- [ ] Document changes\n\n`;
    }
    
    body += `## Acceptance Criteria\n\n`;
    body += `- [ ] All requirements addressed comprehensively\n`;
    body += `- [ ] Quality standards met (accuracy, clarity, professionalism)\n`;
    body += `- [ ] Proper documentation provided\n`;
    body += `- [ ] Peer review completed if applicable\n`;
    body += `- [ ] Integration with existing work verified\n\n`;
    
    body += `---\n\n`;
    body += `*Created from repository item via batch processing tool*\n`;
    body += `*Priority: ${categoryInfo.priority.toUpperCase()}*`;
    
    return body;
  }

  /**
   * Create a single GitHub issue
   */
  async createGitHubIssue(item, categoryInfo) {
    // Check for duplicates
    if (this.existingIssues.has(item.title.toLowerCase())) {
      console.log(`⚠️ Skipping duplicate: ${item.title}`);
      this.skippedIssues.push(item);
      return null;
    }
    
    const body = this.generateIssueBody(item, categoryInfo);
    
    // Build command
    const args = [
      'issue', 'create',
      '--title', item.title,
      '--body', body
    ];
    
    // Add labels
    const allLabels = [...categoryInfo.labels, 'batch-created'];
    allLabels.forEach(label => {
      args.push('--label', label);
    });
    
    try {
      console.log(`📝 Creating: ${item.title}`);
      const command = `gh ${args.map(arg => JSON.stringify(arg)).join(' ')}`;
      const output = execSync(command, { encoding: 'utf8' });
      
      const issueUrl = output.trim();
      this.createdIssues.push({ ...item, url: issueUrl });
      console.log(`✅ Created: ${issueUrl}`);
      
      // Add to existing issues to prevent duplicates in same batch
      this.existingIssues.add(item.title.toLowerCase());
      
      return issueUrl;
    } catch (error) {
      console.error(`❌ Failed to create: ${item.title}`);
      console.error(`   Error: ${error.message}`);
      this.failedIssues.push({ ...item, error: error.message });
      return null;
    }
  }

  /**
   * Process items in batches with rate limiting
   */
  async processBatch(items, options = {}) {
    const { dryRun = false, batchSize = 5, delayMs = 1000 } = options;
    
    console.log(`\n🚀 Processing ${items.length} items in batches of ${batchSize}...\n`);
    
    if (dryRun) {
      console.log('🔍 DRY RUN MODE - No issues will be created\n');
    }
    
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      console.log(`\n📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(items.length / batchSize)}...\n`);
      
      for (const item of batch) {
        const categoryInfo = this.categorizeItem(item);
        
        if (dryRun) {
          console.log(`[DRY RUN] Would create: ${item.title}`);
          console.log(`          Category: ${categoryInfo.category}`);
          console.log(`          Priority: ${categoryInfo.priority}`);
          console.log(`          Labels: ${categoryInfo.labels.join(', ')}`);
        } else {
          await this.createGitHubIssue(item, categoryInfo);
        }
      }
      
      // Rate limiting between batches
      if (i + batchSize < items.length && !dryRun) {
        console.log(`\n⏳ Waiting ${delayMs / 1000}s before next batch...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }

  /**
   * Generate summary report
   */
  generateSummary() {
    const summary = {
      timestamp: new Date().toISOString(),
      stats: {
        total: this.createdIssues.length + this.skippedIssues.length + this.failedIssues.length,
        created: this.createdIssues.length,
        skipped: this.skippedIssues.length,
        failed: this.failedIssues.length
      },
      created: this.createdIssues,
      skipped: this.skippedIssues,
      failed: this.failedIssues
    };
    
    // Save to file
    const summaryPath = path.join(process.cwd(), 'batch-issue-creation-summary.json');
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
    
    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 BATCH CREATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total items processed: ${summary.stats.total}`);
    console.log(`✅ Successfully created: ${summary.stats.created}`);
    console.log(`⚠️ Skipped (duplicates): ${summary.stats.skipped}`);
    console.log(`❌ Failed: ${summary.stats.failed}`);
    console.log('\nSummary saved to: batch-issue-creation-summary.json');
    console.log('='.repeat(60) + '\n');
    
    return summary;
  }

  /**
   * Main execution function
   */
  async run(options = {}) {
    try {
      // Check GitHub CLI
      execSync('gh --version', { stdio: 'ignore' });
    } catch (error) {
      console.error('❌ GitHub CLI (gh) is not installed or not in PATH');
      process.exit(1);
    }
    
    // Load existing issues
    await this.loadExistingIssues();
    
    // Get input
    let input;
    if (options.file) {
      input = fs.readFileSync(options.file, 'utf8');
    } else if (options.input) {
      input = options.input;
    } else {
      // Read from stdin
      console.log('📋 Paste your repository items (press Ctrl+D when done):');
      input = fs.readFileSync(0, 'utf8');
    }
    
    // Parse items
    const items = this.parseRepositoryItems(input);
    
    if (items.length === 0) {
      console.log('❌ No valid repository items found');
      return;
    }
    
    console.log(`\n✅ Found ${items.length} repository items`);
    
    // Process in batches
    await this.processBatch(items, options);
    
    // Generate summary
    return this.generateSummary();
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {
    dryRun: args.includes('--dry-run'),
    batchSize: 5,
    delayMs: 1000
  };
  
  // Parse file option
  const fileIndex = args.indexOf('--file');
  if (fileIndex !== -1 && args[fileIndex + 1]) {
    options.file = args[fileIndex + 1];
  }
  
  // Parse batch size
  const batchIndex = args.indexOf('--batch-size');
  if (batchIndex !== -1 && args[batchIndex + 1]) {
    options.batchSize = parseInt(args[batchIndex + 1]);
  }
  
  // Show help
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Batch Create GitHub Issues from Repository Items

Usage:
  batch-create-issues.js [options]

Options:
  --file <path>        Read items from file instead of stdin
  --batch-size <n>     Number of issues to create in each batch (default: 5)
  --dry-run           Preview what would be created without actually creating
  --help, -h          Show this help message

Examples:
  # Read from stdin
  cat repository-items.txt | node batch-create-issues.js
  
  # Read from file
  node batch-create-issues.js --file items.txt
  
  # Dry run to preview
  node batch-create-issues.js --file items.txt --dry-run
  
  # Custom batch size
  node batch-create-issues.js --batch-size 10
`);
    process.exit(0);
  }
  
  // Run
  const creator = new BatchIssueCreator();
  creator.run(options).catch(error => {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  });
}

module.exports = BatchIssueCreator;