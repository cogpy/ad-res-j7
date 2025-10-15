#!/usr/bin/env node

/**
 * Create GitHub Issue from Repository Item
 * 
 * This script allows you to create a new GitHub issue based on an existing repository item
 * or by entering details manually.
 */

const fs = require('fs');
const { execSync } = require('child_process');

class RepositoryItemIssueCreator {
  constructor() {
    this.repositoryData = null;
    this.selectedItem = null;
  }

  /**
   * Parse repository items from various formats
   */
  parseRepositoryItems(input) {
    const items = [];
    const lines = input.split('\n').filter(line => line.trim());
    
    for (const line of lines) {
      // Pattern 1: [Title](URL) #number
      const pattern1 = line.match(/\[(.+?)\]\((.+?)\)\s*#(\d+)/);
      if (pattern1) {
        items.push({
          title: pattern1[1],
          url: pattern1[2],
          number: pattern1[3],
          originalLine: line
        });
        continue;
      }
      
      // Pattern 2: Just #number at the end
      const pattern2 = line.match(/(.+?)\s*#(\d+)\s*$/);
      if (pattern2) {
        items.push({
          title: pattern2[1].trim(),
          url: null,
          number: pattern2[2],
          originalLine: line
        });
        continue;
      }
      
      // Pattern 3: Simple numbered list with title
      const pattern3 = line.match(/^\d+[\.\)]\s*(.+)/);
      if (pattern3) {
        items.push({
          title: pattern3[1].trim(),
          url: null,
          number: null,
          originalLine: line
        });
      }
    }
    
    return items;
  }

  /**
   * Create a new issue based on an existing item
   */
  createIssueFromItem(item, additionalInfo = {}) {
    const issueData = {
      title: additionalInfo.title || item.title,
      body: this.generateIssueBody(item, additionalInfo),
      labels: additionalInfo.labels || ['enhancement', 'todo'],
      milestone: additionalInfo.milestone || null,
      assignees: additionalInfo.assignees || []
    };
    
    return issueData;
  }

  /**
   * Generate issue body with context and metadata
   */
  generateIssueBody(item, additionalInfo) {
    let body = '## Description\n\n';
    
    if (additionalInfo.description) {
      body += additionalInfo.description + '\n\n';
    } else {
      body += `Task created from repository item: ${item.title}\n\n`;
    }
    
    if (item.url || item.number) {
      body += '## Related Items\n\n';
      if (item.url) {
        body += `- Original issue: ${item.url}\n`;
      } else if (item.number) {
        body += `- Related to issue #${item.number}\n`;
      }
      body += '\n';
    }
    
    body += '## Context\n\n';
    if (additionalInfo.context) {
      body += additionalInfo.context + '\n\n';
    } else {
      body += 'This issue was created from a repository item.\n\n';
    }
    
    body += '## Acceptance Criteria\n\n';
    if (additionalInfo.acceptanceCriteria) {
      body += additionalInfo.acceptanceCriteria;
    } else {
      body += `- [ ] Review the requirements
- [ ] Implement the solution
- [ ] Test the implementation
- [ ] Update documentation if needed
- [ ] Request review`;
    }
    
    body += '\n\n---\n\n';
    body += '*Created from repository item using automated tooling*';
    
    return body;
  }

  /**
   * Create issue using GitHub CLI
   */
  createGitHubIssue(issueData) {
    try {
      // Check if gh CLI is available
      execSync('gh --version', { stdio: 'ignore' });
    } catch (error) {
      throw new Error('GitHub CLI (gh) is not installed or not in PATH');
    }
    
    // Build gh command
    const args = [
      'issue', 'create',
      '--title', issueData.title,
      '--body', issueData.body
    ];
    
    // Add labels
    if (issueData.labels && issueData.labels.length > 0) {
      issueData.labels.forEach(label => {
        args.push('--label', label);
      });
    }
    
    // Add milestone if specified
    if (issueData.milestone) {
      args.push('--milestone', issueData.milestone);
    }
    
    // Add assignees
    if (issueData.assignees && issueData.assignees.length > 0) {
      issueData.assignees.forEach(assignee => {
        args.push('--assignee', assignee);
      });
    }
    
    // Execute the command
    const command = `gh ${args.map(arg => JSON.stringify(arg)).join(' ')}`;
    
    console.log('Creating GitHub issue...');
    try {
      const output = execSync(command, { encoding: 'utf8' });
      console.log('✅ Issue created successfully!');
      console.log(output.trim());
      return output.trim();
    } catch (error) {
      throw new Error(`Failed to create issue: ${error.message}`);
    }
  }

  /**
   * Interactive CLI for creating issues
   */
  async runInteractive() {
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const question = (query) => new Promise((resolve) => rl.question(query, resolve));
    
    try {
      console.log('🔧 GitHub Issue Creator from Repository Item\n');
      
      // Ask for input method
      console.log('How would you like to create the issue?');
      console.log('1. From a repository item list');
      console.log('2. Enter details manually');
      const choice = await question('\nEnter choice (1 or 2): ');
      
      let issueData;
      
      if (choice === '1') {
        console.log('\nPaste your repository items (press Enter twice when done):');
        let input = '';
        let emptyLineCount = 0;
        
        rl.on('line', (line) => {
          if (line === '') {
            emptyLineCount++;
            if (emptyLineCount >= 2) {
              rl.pause();
            }
          } else {
            emptyLineCount = 0;
            input += line + '\n';
          }
        });
        
        await new Promise(resolve => rl.once('pause', resolve));
        
        const items = this.parseRepositoryItems(input);
        
        if (items.length === 0) {
          console.log('❌ No valid repository items found');
          rl.close();
          return;
        }
        
        console.log(`\n📋 Found ${items.length} items:\n`);
        items.forEach((item, index) => {
          console.log(`${index + 1}. ${item.title}${item.number ? ` (#${item.number})` : ''}`);
        });
        
        const itemChoice = await question('\nSelect an item number (or 0 to cancel): ');
        const itemIndex = parseInt(itemChoice) - 1;
        
        if (itemIndex < 0 || itemIndex >= items.length) {
          console.log('Cancelled');
          rl.close();
          return;
        }
        
        const selectedItem = items[itemIndex];
        console.log(`\n✅ Selected: ${selectedItem.title}`);
        
        // Get additional details
        const newTitle = await question(`\nNew issue title (press Enter to keep original): `);
        const description = await question('Description (optional): ');
        const labelsInput = await question('Labels (comma-separated, default: enhancement,todo): ');
        const milestone = await question('Milestone (optional): ');
        const assigneesInput = await question('Assignees (comma-separated, optional): ');
        
        const additionalInfo = {
          title: newTitle || selectedItem.title,
          description: description || undefined,
          labels: labelsInput ? labelsInput.split(',').map(l => l.trim()) : ['enhancement', 'todo'],
          milestone: milestone || undefined,
          assignees: assigneesInput ? assigneesInput.split(',').map(a => a.trim()) : []
        };
        
        issueData = this.createIssueFromItem(selectedItem, additionalInfo);
        
      } else {
        // Manual entry
        const title = await question('\nIssue title: ');
        const description = await question('Description: ');
        const labelsInput = await question('Labels (comma-separated, default: enhancement,todo): ');
        const milestone = await question('Milestone (optional): ');
        const assigneesInput = await question('Assignees (comma-separated, optional): ');
        
        issueData = {
          title: title,
          body: this.generateIssueBody(
            { title: title },
            { description: description || 'Manually created issue' }
          ),
          labels: labelsInput ? labelsInput.split(',').map(l => l.trim()) : ['enhancement', 'todo'],
          milestone: milestone || undefined,
          assignees: assigneesInput ? assigneesInput.split(',').map(a => a.trim()) : []
        };
      }
      
      console.log('\n📝 Issue Preview:');
      console.log('================');
      console.log(`Title: ${issueData.title}`);
      console.log(`Labels: ${issueData.labels.join(', ')}`);
      if (issueData.milestone) console.log(`Milestone: ${issueData.milestone}`);
      if (issueData.assignees.length > 0) console.log(`Assignees: ${issueData.assignees.join(', ')}`);
      console.log('\nBody:');
      console.log('-----');
      console.log(issueData.body);
      console.log('================\n');
      
      const confirm = await question('Create this issue? (y/n): ');
      
      if (confirm.toLowerCase() === 'y') {
        try {
          const result = this.createGitHubIssue(issueData);
        } catch (error) {
          console.error(`\n❌ Error: ${error.message}`);
        }
      } else {
        console.log('❌ Issue creation cancelled');
      }
      
      rl.close();
      
    } catch (error) {
      console.error(`\n❌ Error: ${error.message}`);
      rl.close();
    }
  }

  /**
   * Create issue from command line arguments
   */
  createFromArgs(args) {
    if (args.length < 2) {
      console.error('Usage: create-issue-from-repository-item.js <title> [description]');
      process.exit(1);
    }
    
    const title = args[0];
    const description = args[1] || '';
    
    const issueData = {
      title: title,
      body: this.generateIssueBody(
        { title: title },
        { description: description }
      ),
      labels: ['enhancement', 'todo']
    };
    
    try {
      this.createGitHubIssue(issueData);
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
      process.exit(1);
    }
  }
}

// Main execution
if (require.main === module) {
  const creator = new RepositoryItemIssueCreator();
  
  if (process.argv.length > 2) {
    // Command line mode
    creator.createFromArgs(process.argv.slice(2));
  } else {
    // Interactive mode
    creator.runInteractive();
  }
}

module.exports = RepositoryItemIssueCreator;