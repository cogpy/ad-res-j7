#!/usr/bin/env node

/**
 * Fix Specific Duplicate Issues
 * 
 * This script targets the specific duplicate issues mentioned in the user's list
 */

const { execSync } = require('child_process');
const fs = require('fs');

// Extract issue data from the user's list
const issuesList = `
81. [Disproportionate Relief: Interdict creates more harm than alleged misconduct](https://github.com/cogpy/ad-res-j7/issues/278) #278
82. [Test basic workflow functionality with this simple task](https://github.com/cogpy/ad-res-j7/issues/276) #276
83. [Disproportionate Relief: Interdict creates more harm than alleged misconduct](https://github.com/cogpy/ad-res-j7/issues/275) #275
84. [Peter's Causation: His unilateral actions created the problems he complains a...](https://github.com/cogpy/ad-res-j7/issues/272) #272
85. [Peter's Causation: His unilateral actions created the problems he complains a...](https://github.com/cogpy/ad-res-j7/issues/270) #270
86. [JF8A: Detailed log of all documentation provided to Peter](https://github.com/cogpy/ad-res-j7/issues/268) #268
87. [JF8: Correspondence showing attempts to provide information ✓](https://github.com/cogpy/ad-res-j7/issues/267) #267
88. [JF8: Correspondence showing attempts to provide information ✓](https://github.com/cogpy/ad-res-j7/issues/263) #263
89. [JF3A: Additional email forensics showing pattern of impersonation](https://github.com/cogpy/ad-res-j7/issues/261) #261
90. [JF3A: Additional email forensics showing pattern of impersonation](https://github.com/cogpy/ad-res-j7/issues/258) #258
91. [Add monitoring and alerting for workflow failures](https://github.com/cogpy/ad-res-j7/issues/249) #249
92. [Implement automated testing pipeline for continuous validation](https://github.com/cogpy/ad-res-j7/issues/242) #242
93. [Create comprehensive test suite for all workflow functionality](https://github.com/cogpy/ad-res-j7/issues/237) #237
94. [Current Coverage*: This is descriptive text that should not create issues](https://github.com/cogpy/ad-res-j7/issues/231) #231
95. [Ensure proper JSON parsing for workflow output](https://github.com/cogpy/ad-res-j7/issues/136) #136
96. [Test duplicate prevention with identical task titles](https://github.com/cogpy/ad-res-j7/issues/132) #132
97. [Add external validation (accountant letters, SARS compliance, bank relationsh...)](https://github.com/cogpy/ad-res-j7/issues/85) #85
98. [Add external validation (accountant letters, SARS compliance, bank relationsh...)](https://github.com/cogpy/ad-res-j7/issues/83) #83
99. [Include comprehensive financial analysis showing profitable operations](https://github.com/cogpy/ad-res-j7/issues/80) #80
100. [Demonstrate Peter's bad faith through timeline analysis](https://github.com/cogpy/ad-res-j7/issues/81) #81
101. [Create point-by-point rebuttal matrix for each sub-allegation](https://github.com/cogpy/ad-res-j7/issues/76) #76
102. [Demonstrate Peter's bad faith through timeline analysis](https://github.com/cogpy/ad-res-j7/issues/77) #77
103. [Create point-by-point rebuttal matrix for each sub-allegation](https://github.com/cogpy/ad-res-j7/issues/73) #73
104. [Current Coverage: Section 7 provides general refutation](https://github.com/cogpy/ad-res-j7/issues/71) #71
105. [Current Coverage: Section 7 provides general refutation](https://github.com/cogpy/ad-res-j7/issues/69) #69
106. [Show payment was entirely within established business norms](https://github.com/cogpy/ad-res-j7/issues/67) #67
107. [Show payment was entirely within established business norms](https://github.com/cogpy/ad-res-j7/issues/65) #65
108. [Demonstrate legitimacy of payment against loan account credit](https://github.com/cogpy/ad-res-j7/issues/63) #63
109. [Demonstrate legitimacy of payment against loan account credit](https://github.com/cogpy/ad-res-j7/issues/61) #61
110. [Provide detailed director loan account balances showing companies owe directo...](https://github.com/cogpy/ad-res-j7/issues/59) #59
111. [Highlight sudden objection as inconsistent with established practice](https://github.com/cogpy/ad-res-j7/issues/57) #57
112. [Highlight sudden objection as inconsistent with established practice](https://github.com/cogpy/ad-res-j7/issues/55) #55
113. [Demonstrate Peter's participation in this informal model](https://github.com/cogpy/ad-res-j7/issues/54) #54
114. [Demonstrate Peter's participation in this informal model](https://github.com/cogpy/ad-res-j7/issues/51) #51
115. [Current Coverage: Partially addressed in Section 4](https://github.com/cogpy/ad-res-j7/issues/49) #49
116. [Include accounting records showing proper allocation to director loan account](https://github.com/cogpy/ad-res-j7/issues/47) #47
117. [Demonstrate timing correlation with settlement negotiations (pretext evidence)](https://github.com/cogpy/ad-res-j7/issues/45) #45
`;

// Parse issues from the list
function parseIssuesList(list) {
  const issues = [];
  const lines = list.trim().split('\n');
  
  for (const line of lines) {
    const match = line.match(/\[(.+?)\]\(.+?\/issues\/(\d+)\)\s*#(\d+)/);
    if (match) {
      issues.push({
        title: match[1],
        number: parseInt(match[2])
      });
    }
  }
  
  return issues;
}

// Group issues by title
function findDuplicateGroups(issues) {
  const groups = new Map();
  
  for (const issue of issues) {
    const normalizedTitle = issue.title.toLowerCase().trim();
    
    if (!groups.has(normalizedTitle)) {
      groups.set(normalizedTitle, []);
    }
    groups.get(normalizedTitle).push(issue);
  }
  
  // Filter to only duplicate groups
  const duplicateGroups = [];
  for (const [title, group] of groups) {
    if (group.length > 1) {
      // Sort by issue number (keep lowest)
      group.sort((a, b) => a.number - b.number);
      duplicateGroups.push({
        title: group[0].title,
        keep: group[0].number,
        close: group.slice(1).map(i => i.number)
      });
    }
  }
  
  return duplicateGroups;
}

// Issues that should be closed because they're descriptive
function getDescriptiveIssues(issues) {
  const descriptivePatterns = [
    /^current coverage/i,
    /^show\s+/i,
    /^demonstrate\s+/i,
    /^provide\s+/i,
    /^include\s+/i,
    /^highlight\s+/i,
    /^add external validation/i,
    /descriptive text that should not create issues/i
  ];
  
  return issues.filter(issue => 
    descriptivePatterns.some(pattern => pattern.test(issue.title))
  );
}

// Main execution
async function main() {
  const dryRun = !process.argv.includes('--execute');
  
  console.log('🔧 Fixing Specific Duplicate Issues');
  console.log('===================================\n');
  
  if (dryRun) {
    console.log('🔍 DRY RUN MODE - No issues will be closed\n');
  }
  
  // Parse issues
  const issues = parseIssuesList(issuesList);
  console.log(`📋 Found ${issues.length} issues in the provided list\n`);
  
  // Find duplicates
  const duplicateGroups = findDuplicateGroups(issues);
  console.log(`🔍 Found ${duplicateGroups.length} duplicate groups:\n`);
  
  for (const group of duplicateGroups) {
    console.log(`📦 "${group.title}"`);
    console.log(`   ✅ Keep: #${group.keep}`);
    console.log(`   ❌ Close: #${group.close.join(', #')}\n`);
  }
  
  // Find descriptive issues
  const descriptiveIssues = getDescriptiveIssues(issues);
  console.log(`📝 Found ${descriptiveIssues.length} descriptive issues that should be tasks:\n`);
  
  for (const issue of descriptiveIssues) {
    console.log(`   ❌ #${issue.number}: "${issue.title}"`);
  }
  
  if (!dryRun) {
    console.log('\n🚀 Closing duplicate and descriptive issues...\n');
    
    let closedCount = 0;
    
    // Close duplicates
    for (const group of duplicateGroups) {
      for (const issueNum of group.close) {
        try {
          // Check if issue is still open
          const status = execSync(`gh issue view ${issueNum} --json state -q .state`, { encoding: 'utf8' }).trim();
          
          if (status === 'OPEN') {
            // Add comment
            execSync(`gh issue comment ${issueNum} --body "Closing as duplicate of #${group.keep}\\n\\n*Closed by duplicate cleanup script*"`);
            
            // Close issue
            execSync(`gh issue close ${issueNum} --reason duplicate`);
            
            console.log(`✅ Closed #${issueNum} (duplicate of #${group.keep})`);
            closedCount++;
          } else {
            console.log(`⏭️  Skipped #${issueNum} (already closed)`);
          }
        } catch (error) {
          console.error(`❌ Failed to close #${issueNum}: ${error.message}`);
        }
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    // Close descriptive issues (but not if they're already marked as duplicates)
    const duplicateNumbers = new Set(duplicateGroups.flatMap(g => g.close));
    
    for (const issue of descriptiveIssues) {
      if (!duplicateNumbers.has(issue.number)) {
        try {
          // Check if issue is still open
          const status = execSync(`gh issue view ${issue.number} --json state -q .state`, { encoding: 'utf8' }).trim();
          
          if (status === 'OPEN') {
            // Add comment
            execSync(`gh issue comment ${issue.number} --body "This appears to be descriptive text rather than an actionable task. These items should be tracked as documentation or analysis requirements rather than GitHub issues.\\n\\n*Closed by cleanup script*"`);
            
            // Close issue
            execSync(`gh issue close ${issue.number} --reason not_planned`);
            
            console.log(`✅ Closed #${issue.number} (descriptive text)`);
            closedCount++;
          } else {
            console.log(`⏭️  Skipped #${issue.number} (already closed)`);
          }
        } catch (error) {
          console.error(`❌ Failed to close #${issue.number}: ${error.message}`);
        }
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    console.log(`\n✅ Closed ${closedCount} issues`);
  }
  
  // Generate summary
  const summary = {
    timestamp: new Date().toISOString(),
    duplicateGroups: duplicateGroups,
    descriptiveIssues: descriptiveIssues.map(i => ({ number: i.number, title: i.title })),
    totalDuplicates: duplicateGroups.reduce((sum, g) => sum + g.close.length, 0),
    totalDescriptive: descriptiveIssues.length
  };
  
  fs.writeFileSync('specific-duplicates-summary.json', JSON.stringify(summary, null, 2));
  console.log('\n📄 Summary saved to: specific-duplicates-summary.json');
  console.log('\n✨ Done!');
}

// Check for GitHub CLI
try {
  execSync('gh --version', { stdio: 'ignore' });
} catch (error) {
  console.error('❌ GitHub CLI (gh) is not installed or not in PATH');
  process.exit(1);
}

// Run
main().catch(error => {
  console.error('❌ Fatal error:', error.message);
  process.exit(1);
});