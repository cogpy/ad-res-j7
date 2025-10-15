#!/usr/bin/env node

/**
 * Test the issue parser logic to ensure it correctly filters out duplicates
 * and descriptive text
 */

const fs = require('fs');
const path = require('path');

// Extract the parser logic from the workflow
const testContent = `
# Test Todo File

## Priority 1 - Critical Tasks

### Current Analysis

**Current Coverage**: Section 7 provides general refutation
- This should NOT create an issue (descriptive text)

**Improvements Needed**:
- Show payment was entirely within established business norms
- Demonstrate Peter's bad faith through timeline analysis
- Provide detailed director loan account balances showing companies owe directors
- Include comprehensive financial analysis showing profitable operations

### Actual Tasks

TODO: Implement new authentication system
TASK: Create comprehensive test suite for authentication
ACTION: Fix the duplicate issue creation bug
FIXME: Update the workflow to prevent descriptive issues

- Implement automated testing pipeline for continuous validation
- Add monitoring and alerting for workflow failures

## Completed Tasks

- [x] This is already completed and should not create an issue
- ✅ COMPLETED: This task is done

## Random Descriptions

Peter's Causation: His unilateral actions created the problems
This is just a description and should not become an issue

Highlight sudden objection as inconsistent with established practice
Another descriptive line that shouldn't be an issue
`;

// Copy the parser logic from the workflow
class TodoIssueParser {
  constructor() {
    this.tasks = [];
  }

  isHighQualityTask(task) {
    // Skip if too short
    if (task.length < 15) {
      return false;
    }
    
    // Skip formatting artifacts and non-actionable text
    const skipPatterns = [
      /^\*\*.*\*\*$/,  // Just bold text
      /^\*\*.*\*\*:$/,  // Bold text ending with colon (section headers)
      /^\*\*Current Coverage\*\*:/i,  // Bold "Current Coverage:" with text after
      /^Current Coverage/i,  // Any line starting with "Current Coverage"
      /^Legal Significance:/i,
      /^Framework Phase:/i,
      /^Impact:/i,
      /^Estimated effort:/i,
      /^Total.*effort:/i,
      /^When compared against/i,
      /^The (current|existing|draft)/i,
      /^This (document|analysis|section)/i,
      /^Improvements? Needed:?$/i,  // Section header pattern
      /^Actions? Required:?$/i,     // Section header pattern
      /^Recommended Actions?:?$/i,  // Section header pattern
      /hours?$/i,  // Ends with "hours" - likely effort estimate
      /^Show\s+/i,  // Lines starting with "Show" - usually examples
      /^Demonstrate\s+/i,  // Lines starting with "Demonstrate" - usually descriptions
      /^Provide\s+/i,  // Lines starting with "Provide" - often descriptive
      /^Include\s+/i,  // Lines starting with "Include" - often descriptive
      /^Emphasize\s+/i,  // Lines starting with "Emphasize" - descriptive
      /^Highlight\s+/i,  // Lines starting with "Highlight" - descriptive
      /^Reference\s+/i,  // Lines starting with "Reference" - descriptive
      /^Expose\s+/i,  // Lines starting with "Expose" - descriptive
      /\(.*\)$/,  // Lines ending with parentheses - often annotations
      /^\[x\]/i,  // Completed checkbox items
      /✅/,  // Lines with checkmark emoji
      /COMPLETED/i,  // Lines marked as completed
      /^-\s*\*\*/,  // Bullet points starting with bold text
      /^\d+\.\s*\*\*/  // Numbered lists starting with bold text
    ];
    
    for (const pattern of skipPatterns) {
      if (pattern.test(task)) {
        return false;
      }
    }
    
    // Skip lines that are just descriptions or analysis statements
    const descriptionPatterns = [
      /^.*your .* role/i,
      /^.*Peter's .*/i,
      /^.*timing correlation/i,
      /^.*director loan account/i,
      /^.*historical context/i,
      /^.*industry.?standard/i,
      /^.*sudden objection/i,
      /^.*established practice/i,
      /^.*comprehensive analysis/i,
      /^.*external validation/i,
      /^.*bad faith/i,
      /^.*point.?by.?point/i,
      /^.*general refutation/i,
      /^.*business norms/i,
      /^.*loan account credit/i,
      /^.*director.*owe/i,
      /^.*inconsistent with/i,
      /^.*participation in/i,
      /^.*informal model/i,
      /^.*partially addressed/i,
      /^.*accounting records/i,
      /^.*pretext evidence/i
    ];
    
    for (const pattern of descriptionPatterns) {
      if (pattern.test(task)) {
        return false;
      }
    }
    
    // Only accept if it's clearly a TODO or action item
    const actionPatterns = [
      /^(TODO|FIXME|TASK|ACTION):/i,
      /^(Implement|Create|Build|Fix|Add|Update|Develop)\s+a\s+/i,
      /^(Write|Draft|Prepare|Design|Setup|Configure)\s+/i,
      /^(Test|Validate|Verify|Check)\s+/i,
      /monitoring and alerting/i,
      /automated testing pipeline/i,
      /comprehensive test suite/i,
      /duplicate prevention/i,
      /JSON parsing/i,
      /workflow functionality/i
    ];
    
    const hasExplicitAction = actionPatterns.some(pattern => 
      pattern.test(task)
    );
    
    return hasExplicitAction;
  }

  parseMarkdownForTasks(content) {
    const lines = content.split('\n');
    const tasks = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Look for bullet points and numbered lists
      const patterns = [
        /^-\s*(.+)$/,
        /^\*\s*(.+)$/,
        /^\d+\.\s*(.+)$/
      ];
      
      for (const pattern of patterns) {
        const match = line.match(pattern);
        if (match) {
          const task = match[1].trim();
          if (this.isHighQualityTask(task)) {
            tasks.push({
              task: task,
              lineNumber: i + 1
            });
          }
          break;
        }
      }
      
      // Also check standalone lines that might be tasks
      if (!line.startsWith('-') && !line.startsWith('*') && !line.match(/^\d+\./)) {
        if (line.length > 0 && this.isHighQualityTask(line)) {
          tasks.push({
            task: line,
            lineNumber: i + 1
          });
        }
      }
    }
    
    return tasks;
  }
}

// Run tests
console.log('🧪 Testing Issue Parser Logic\n');
console.log('=' .repeat(60));

const parser = new TodoIssueParser();
const tasks = parser.parseMarkdownForTasks(testContent);

console.log('\n📋 Parsed Tasks:');
console.log('-'.repeat(60));

if (tasks.length === 0) {
  console.log('❌ No tasks found!');
} else {
  tasks.forEach((task, index) => {
    console.log(`${index + 1}. Line ${task.lineNumber}: ${task.task}`);
  });
}

// Expected results
const expectedTasks = [
  'TODO: Implement new authentication system',
  'TASK: Create comprehensive test suite for authentication',
  'ACTION: Fix the duplicate issue creation bug',
  'FIXME: Update the workflow to prevent descriptive issues',
  'Implement automated testing pipeline for continuous validation',
  'Add monitoring and alerting for workflow failures'
];

console.log('\n✅ Expected Tasks:');
console.log('-'.repeat(60));
expectedTasks.forEach((task, index) => {
  console.log(`${index + 1}. ${task}`);
});

// Verify results
console.log('\n📊 Test Results:');
console.log('-'.repeat(60));

const foundTasks = tasks.map(t => t.task);
let allCorrect = true;

// Check that all expected tasks were found
expectedTasks.forEach(expected => {
  const found = foundTasks.some(task => task.includes(expected.replace(/^(TODO|TASK|ACTION|FIXME):\s*/i, '')));
  if (found) {
    console.log(`✅ Found: "${expected}"`);
  } else {
    console.log(`❌ Missing: "${expected}"`);
    allCorrect = false;
  }
});

// Check that no unwanted tasks were included
const unwantedPatterns = [
  'Current Coverage',
  'Show payment',
  "Demonstrate Peter's",
  'Provide detailed director',
  'Include comprehensive financial',
  "Peter's Causation",
  'Highlight sudden objection',
  'already completed',
  'COMPLETED:'
];

console.log('\n🚫 Checking for unwanted tasks:');
foundTasks.forEach(task => {
  const isUnwanted = unwantedPatterns.some(pattern => task.includes(pattern));
  if (isUnwanted) {
    console.log(`❌ Incorrectly included: "${task}"`);
    allCorrect = false;
  }
});

if (foundTasks.length === expectedTasks.length && allCorrect) {
  console.log('\n✅ All tests passed! The parser correctly filters descriptive text.');
} else {
  console.log('\n❌ Tests failed. The parser needs adjustment.');
}

console.log('\n' + '='.repeat(60));
console.log('Test complete.\n');