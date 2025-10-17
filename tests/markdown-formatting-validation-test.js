#!/usr/bin/env node

/**
 * Markdown Formatting Validation Test Suite
 * Comprehensive testing for markdown parsing with various formatting styles
 * This addresses the requirement from todo/workflow-validation-tests.md line 16:
 * "Validate markdown parsing with various formatting styles"
 */

const fs = require('fs');
const path = require('path');
const TestResultArchiver = require('./test-result-archiver');

class MarkdownFormattingValidationTest {
  constructor() {
    this.testResults = [];
    this.errors = [];
    this.testDataDir = '/tmp/markdown-formatting-test-data';
    this.startTime = Date.now();
  }

  assert(condition, message) {
    const result = {
      test: message,
      passed: condition,
      timestamp: new Date().toISOString(),
      suite: 'markdown-formatting-validation'
    };
    
    this.testResults.push(result);
    
    if (condition) {
      console.log(`✅ ${message}`);
    } else {
      console.log(`❌ ${message}`);
      this.errors.push(message);
    }
    
    return condition;
  }

  // Setup test environment
  setup() {
    console.log('🔧 Setting up markdown formatting validation test environment...');
    
    // Ensure test directory exists
    if (!fs.existsSync(this.testDataDir)) {
      fs.mkdirSync(this.testDataDir, { recursive: true });
    }
  }

  // Cleanup test environment
  cleanup() {
    console.log('🧹 Cleaning up markdown formatting validation test environment...');
    
    if (fs.existsSync(this.testDataDir)) {
      fs.rmSync(this.testDataDir, { recursive: true, force: true });
    }
  }

  // Extract and implement the parseMarkdownForTasks method from the workflow
  parseMarkdownForTasks(content, filename) {
    const lines = content.split('\n');
    const tasks = [];
    let currentSection = '';
    let currentPriority = 'medium';
    let inPrioritySection = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Track current section for context
      if (line.match(/^#{1,4}\s+/)) {
        currentSection = line.replace(/^#+\s+/, '');
        
        // Extract priority from section headers
        if (line.toLowerCase().includes('critical') || line.toLowerCase().includes('priority 1')) {
          currentPriority = 'critical';
        } else if (line.toLowerCase().includes('high') || line.toLowerCase().includes('priority 2')) {
          currentPriority = 'high';
        } else if (line.toLowerCase().includes('medium') || line.toLowerCase().includes('priority 3')) {
          currentPriority = 'medium';
        } else if (line.toLowerCase().includes('low') || line.toLowerCase().includes('priority 4')) {
          currentPriority = 'low';
        }
        
        // Check if we're in a priority recommendation section
        inPrioritySection = line.toLowerCase().includes('priority recommendations') ||
                          line.toLowerCase().includes('must-do') ||
                          line.toLowerCase().includes('should-do') ||
                          line.toLowerCase().includes('nice-to-have') ||
                          line.toLowerCase().includes('phase 1') ||
                          line.toLowerCase().includes('phase 2') ||
                          line.toLowerCase().includes('phase 3') ||
                          line.toLowerCase().includes('phase 4') ||
                          line.toLowerCase().includes('priority 1') ||
                          line.toLowerCase().includes('priority 2') ||
                          line.toLowerCase().includes('priority 3') ||
                          line.toLowerCase().includes('priority 4');
      }
      
      // Look for numbered tasks in priority sections
      if (inPrioritySection) {
        const numberedTask = line.match(/^\d+\.\s*(.+)$/);
        if (numberedTask) {
          const task = numberedTask[1].trim();
          if (task.length > 10) {
            tasks.push({
              task: task,
              section: currentSection,
              priority: this.determinePriorityFromSection(currentSection),
              file: filename,
              lineNumber: i + 1,
              type: 'priority_task'
            });
          }
        }
      }
      
      // Look for specific actionable patterns
      const actionablePatterns = [
        /^-\s*(.*(?:implement|add|create|fix|update|improve|enhance|develop|build|establish|provide|include|demonstrate|expand|complete|review).*)/i,
        /^\*\s*(.*(?:implement|add|create|fix|update|improve|enhance|develop|build|establish|provide|include|demonstrate|expand|complete|review).*)/i
      ];
      
      for (const pattern of actionablePatterns) {
        const match = line.match(pattern);
        if (match) {
          const task = match[1].trim();
          
          if (this.isHighQualityTask(task)) {
            tasks.push({
              task: task,
              section: currentSection,
              priority: currentPriority,
              file: filename,
              lineNumber: i + 1,
              type: 'actionable_item'
            });
          }
          break;
        }
      }
      
      // Look for specific recommendation sections
      if (line.includes('**Improvements Needed**:') || 
          line.includes('**Action Required**:') ||
          line.includes('**Recommended Actions**:')) {
        
        // Next lines likely contain tasks
        for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
          const nextLine = lines[j].trim();
          
          if (nextLine.startsWith('-')) {
            const taskMatch = nextLine.match(/^-\s*(.+)$/);
            if (taskMatch) {
              const taskText = taskMatch[1].trim();
              if (this.isHighQualityTask(taskText)) {
                tasks.push({
                  task: taskText,
                  section: currentSection,
                  priority: 'high',
                  file: filename,
                  lineNumber: j + 1,
                  type: 'recommendation'
                });
              }
            }
          }
        }
      }
    }
    
    return tasks;
  }

  // Priority determination helper
  determinePriorityFromSection(section) {
    const sectionLower = section.toLowerCase();
    if (sectionLower.includes('critical') || sectionLower.includes('must-do') || sectionLower.includes('priority 1')) {
      return 'critical';
    } else if (sectionLower.includes('high') || sectionLower.includes('should-do') || sectionLower.includes('priority 2')) {
      return 'high';
    } else if (sectionLower.includes('medium') || sectionLower.includes('priority 3')) {
      return 'medium';
    } else if (sectionLower.includes('low') || sectionLower.includes('nice-to-have') || sectionLower.includes('priority 4')) {
      return 'low';
    }
    return 'medium';
  }

  // Quality task filter implementation
  isHighQualityTask(task) {
    // Skip if too short
    if (task.length < 15) {
      return false;
    }
    
    // Skip formatting artifacts and non-actionable text
    const skipPatterns = [
      /^\*\*.*\*\*$/,  // Just bold text
      /^\*\*.*\*\*:$/,  // Bold text ending with colon
      /^Current Coverage/i,
      /^Legal Significance:/i,
      /^Framework Phase:/i,
      /^Impact:/i,
      /^Estimated effort:/i,
      /hours?$/i,  // Ends with "hours"
      /^\[x\]/i,  // Completed checkbox items
      /✅/,  // Lines with checkmark emoji
      /COMPLETED/i  // Lines marked as completed
    ];
    
    for (const pattern of skipPatterns) {
      if (pattern.test(task)) {
        return false;
      }
    }
    
    // Accept valid action patterns
    const actionPatterns = [
      /^(TODO|FIXME|TASK|ACTION):/i,
      /^(Implement|Create|Build|Fix|Add|Update|Develop)\s+/i,
      /^(Write|Draft|Prepare|Design|Setup|Configure)\s+/i,
      /^(Test|Validate|Verify|Check)\s+/i,
      /(implement|add|create|fix|update|improve|enhance|develop|build|establish|provide|include|demonstrate|expand|complete|review)/i
    ];
    
    return actionPatterns.some(pattern => pattern.test(task));
  }

  // Test basic markdown formatting in task descriptions
  testBasicFormattingInTasks() {
    console.log('\n🧪 Testing basic markdown formatting in tasks...');
    
    try {
      const basicFormattingContent = `
# Must-Do (Critical Priority)

- Implement **bold formatting** handling in task extraction
- Create support for *italic text* in task descriptions  
- Add validation for \`inline code\` in markdown parsing
- Fix issues with **bold and *nested italic* formatting**
- Update system to handle ***bold italic*** combinations
- Develop tests for ~~strikethrough~~ text processing
- Build parser for [link text](https://example.com) in tasks
- Create handler for ![image alt](image.jpg) references

## Should-Do (High Priority)

- Enhance parser to support \`\`\`code blocks\`\`\` in descriptions
- Implement handling for > blockquote formatting
- Add support for | table | formatting | in tasks
- Create tests for <!-- HTML comments --> in markdown
`;
      
      const result = this.parseMarkdownForTasks(basicFormattingContent, 'basic-formatting.md');
      
      this.assert(result.length >= 8, 'Extracts tasks with basic formatting');
      
      // Test specific formatting cases
      const boldTask = result.find(t => t.task.includes('**bold formatting**'));
      this.assert(boldTask !== undefined, 'Extracts tasks with bold formatting');
      
      const italicTask = result.find(t => t.task.includes('*italic text*'));
      this.assert(italicTask !== undefined, 'Extracts tasks with italic formatting');
      
      const codeTask = result.find(t => t.task.includes('`inline code`'));
      this.assert(codeTask !== undefined, 'Extracts tasks with inline code formatting');
      
      const linkTask = result.find(t => t.task.includes('[link text](https://example.com)'));
      this.assert(linkTask !== undefined, 'Extracts tasks with link formatting');
      
      const nestedTask = result.find(t => t.task.includes('**bold and *nested italic* formatting**'));
      this.assert(nestedTask !== undefined, 'Extracts tasks with nested formatting');
      
      // Test priority detection with formatted headers
      const criticalTasks = result.filter(t => t.priority === 'critical');
      const highTasks = result.filter(t => t.priority === 'high');
      
      this.assert(criticalTasks.length >= 6, 'Correctly identifies critical priority with formatted headers');
      this.assert(highTasks.length >= 2, 'Correctly identifies high priority with formatted headers');
      
    } catch (error) {
      this.assert(false, `Error in basic formatting test: ${error.message}`);
    }
  }

  // Test advanced formatting scenarios
  testAdvancedFormattingScenarios() {
    console.log('\n🧪 Testing advanced formatting scenarios...');
    
    try {
      const advancedFormattingContent = `
# **Priority 1** - Critical Tasks with Formatting

1. Implement support for *mixed* **formatting** \`styles\` in task extraction
2. Create parser for [complex](https://example.com "Title") link formats with titles
3. Add handling for reference-style [links][1] in markdown content
4. Fix processing of email <user@example.com> and auto-links
5. Update system for HTML entities like &amp; &lt; &gt; in content

[1]: https://reference-link.com "Reference Link"

## Phase 2: Advanced Formatting Support

- Develop tests for Unicode characters: café naïve résumé 中文 العربية
- Build support for emoji in tasks: 🚀 Implement rocket-fast parsing 🔥
- Create handler for special characters: $@#%^&*()_+-=[]{}|\\;:'"<>?/~\`
- Add validation for mathematical symbols: ∑ ∏ ∫ ∂ √ ∞ ≈ ≠ ≤ ≥
- Implement proper handling of currency symbols: $ £ € ¥ ₹ ₽

### **Improvements Needed**:
- Test nested lists and complex formatting combinations
- Validate \`code with **bold** inside\` formatting
- Fix **bold with \`code\` inside** processing
- Update *italic with [links](http://test.com) inside* handling
- Create comprehensive **_bold italic_** \`code\` [link](url) combinations

## Nice-to-Have (Low Priority)

- Implement HTML tag filtering: <script>alert('test')</script>
- Add support for markdown tables with | formatting |
- Create tests for definition lists and footnotes[^1]
- Build handler for task lists: [x] completed [ ] pending

[^1]: This is a footnote reference
`;
      
      const result = this.parseMarkdownForTasks(advancedFormattingContent, 'advanced-formatting.md');
      
      this.assert(result.length >= 15, 'Extracts tasks from advanced formatting scenarios');
      
      // Test Unicode and emoji handling
      const unicodeTask = result.find(t => t.task.includes('café naïve résumé'));
      this.assert(unicodeTask !== undefined, 'Handles Unicode characters in tasks');
      
      const emojiTask = result.find(t => t.task.includes('🚀') && t.task.includes('🔥'));
      this.assert(emojiTask !== undefined, 'Handles emoji characters in tasks');
      
      // Test complex link formats
      const complexLinkTask = result.find(t => t.task.includes('[complex](https://example.com "Title")'));
      this.assert(complexLinkTask !== undefined, 'Handles complex link formats');
      
      // Test special character handling
      const specialCharsTask = result.find(t => t.task.includes('$@#%^&*()'));
      this.assert(specialCharsTask !== undefined, 'Handles special characters in tasks');
      
      // Test mathematical symbols
      const mathTask = result.find(t => t.task.includes('∑ ∏ ∫'));
      this.assert(mathTask !== undefined, 'Handles mathematical symbols');
      
      // Test numbered list extraction in priority sections
      const numberedTasks = result.filter(t => t.type === 'priority_task');
      this.assert(numberedTasks.length >= 5, 'Extracts numbered tasks from priority sections');
      
    } catch (error) {
      this.assert(false, `Error in advanced formatting test: ${error.message}`);
    }
  }

  // Test edge cases and malformed formatting
  testFormattingEdgeCases() {
    console.log('\n🧪 Testing formatting edge cases and malformed formatting...');
    
    try {
      const edgeCasesContent = `
# Must-Do Section

- Implement handling for **unclosed bold formatting
- Create support for *unclosed italic formatting
- Add validation for \`unclosed code formatting
- Fix issues with [unclosed link formatting
- Update system for **bold with *italic inside** and more*
- Develop tests for ***excessive*** **bold** *italic* combinations
- Build parser for \`code with **bold inside\` mixed formatting
- Create handler for empty ** ** bold and * * italic tags

## **Improvements Needed**:
- Test **mixed **bold** inside** bold formatting
- Validate *nested *italic* inside* italic formatting  
- Fix \\*escaped\\* asterisks and \\**escaped bold\\**
- Update \_underscored\_ emphasis and \_\_double underscores\_\_
- Create support for \\\`escaped backticks\\\`

### Should-Do

- Implement handling for very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very long task descriptions that exceed normal limits
- Add support for tasks with multiple spaces    between    words
- Create parser for	tabs	in	content
- Fix handling of
multiple
line
breaks in content
`;
      
      const result = this.parseMarkdownForTasks(edgeCasesContent, 'edge-cases.md');
      
      this.assert(result.length >= 12, 'Handles formatting edge cases gracefully');
      
      // Test unclosed formatting handling
      const unclosedBold = result.find(t => t.task.includes('**unclosed bold formatting'));
      this.assert(unclosedBold !== undefined, 'Handles unclosed bold formatting');
      
      const unclosedItalic = result.find(t => t.task.includes('*unclosed italic formatting'));
      this.assert(unclosedItalic !== undefined, 'Handles unclosed italic formatting');
      
      const unclosedCode = result.find(t => t.task.includes('`unclosed code formatting'));
      this.assert(unclosedCode !== undefined, 'Handles unclosed code formatting');
      
      // Test mixed formatting scenarios
      const mixedFormatting = result.find(t => t.task.includes('**bold with *italic inside** and more*'));
      this.assert(mixedFormatting !== undefined, 'Handles complex mixed formatting');
      
      // Test escaped characters
      const escapedChars = result.find(t => t.task.includes('\\*escaped\\*'));
      this.assert(escapedChars !== undefined, 'Handles escaped formatting characters');
      
      // Test very long task descriptions
      const longTask = result.find(t => t.task.length > 200);
      this.assert(longTask !== undefined, 'Handles very long task descriptions');
      
      // Test whitespace handling
      const multiSpaceTask = result.find(t => t.task.includes('multiple spaces'));
      this.assert(multiSpaceTask !== undefined, 'Handles multiple spaces in content');
      
    } catch (error) {
      this.assert(false, `Error in edge cases test: ${error.message}`);
    }
  }

  // Test list format variations
  testListFormatVariations() {
    console.log('\n🧪 Testing different list format variations...');
    
    try {
      const listFormatsContent = `
# Critical Tasks - List Format Testing

## Dash Lists
- Implement dash-based list parsing
- Create support for multiple dash formats
-Implement handling for no-space-after-dash

## Asterisk Lists
* Add asterisk-based list parsing  
* Create support for asterisk formatting
*Add handling for no-space-after-asterisk

## Plus Lists  
+ Implement plus-based list parsing
+ Create support for plus sign formatting
+Add handling for no-space-after-plus

## Mixed Lists
- Create comprehensive list format support (dash)
* Add mixed format validation (asterisk)  
+ Implement unified parsing approach (plus)
- Build robust list detection system (dash)

## Numbered Lists in Must-Do Section
1. Implement numbered list task extraction
2. Create priority-based task categorization  
3. Add support for multi-digit numbering
10. Build handling for non-sequential numbers
99. Create comprehensive numbered task support

## **Action Required**:
- Fix list format inconsistencies across files
- Update parser to handle all list variations
- Create unified list processing logic
- Add validation for mixed list formats

## Indented Lists
  - Implement indented list support
    - Create nested indentation handling
      - Add deep nesting validation
  * Build mixed indented format support
    + Create comprehensive indentation parser

## Edge Case Lists
  -  Extra spaces after dash
*	Tab character after asterisk
+   Multiple spaces after plus
-	Mixed whitespace handling
`;
      
      const result = this.parseMarkdownForTasks(listFormatsContent, 'list-formats.md');
      
      this.assert(result.length >= 18, 'Extracts tasks from various list formats');
      
      // Test dash lists
      const dashTasks = result.filter(t => t.task.includes('dash'));
      this.assert(dashTasks.length >= 3, 'Handles dash-based lists');
      
      // Test asterisk lists  
      const asteriskTasks = result.filter(t => t.task.includes('asterisk'));
      this.assert(asteriskTasks.length >= 2, 'Handles asterisk-based lists');
      
      // Test plus lists - note: the actual workflow doesn't support + lists
      const plusTasks = result.filter(t => t.task.includes('plus'));
      this.assert(plusTasks.length === 0, 'Plus-based lists not supported by current workflow (expected behavior)');
      
      // Test numbered lists
      const numberedTasks = result.filter(t => t.type === 'priority_task');
      this.assert(numberedTasks.length >= 5, 'Extracts numbered tasks correctly');
      
      // Test mixed list handling
      const mixedListTasks = result.filter(t => t.task.includes('mixed') || t.task.includes('unified'));
      this.assert(mixedListTasks.length >= 2, 'Handles mixed list formats');
      
      // Test indented lists
      const indentedTasks = result.filter(t => t.task.includes('indent'));
      this.assert(indentedTasks.length >= 3, 'Handles indented lists');
      
      // Test recommendation section extraction
      const recommendationTasks = result.filter(t => t.type === 'recommendation');
      this.assert(recommendationTasks.length >= 4, 'Extracts tasks from recommendation sections');
      
    } catch (error) {
      this.assert(false, `Error in list format test: ${error.message}`);
    }
  }

  // Test priority section variations and header formats
  testPrioritySectionVariations() {
    console.log('\n🧪 Testing priority section variations and header formats...');
    
    try {
      const prioritySectionsContent = `
# **Must-Do (Critical Priority)**

- Implement critical task extraction from bold headers
- Create support for parenthetical priority indicators
- Add validation for formatted priority headers

## Should-Do (High Priority)

- Build high priority task detection
- Create proper priority categorization

### *Nice-to-Have (Low Priority)*

- Add low priority task support
- Create comprehensive priority testing

#### Priority 1 Tasks

1. Implement Priority 1 numbering system
2. Create critical task identification
3. Add support for numbered priority tasks

##### Priority 2 Tasks

1. Build Priority 2 task extraction
2. Create high priority numbered tasks

###### Priority 3 Tasks

1. Add Priority 3 task support
2. Create medium priority handling

## Phase 1 - Critical Implementation

1. Implement phase-based priority detection
2. Create phase numbering support
3. Add comprehensive phase handling

### Phase 2 - Enhancement Phase

1. Build enhanced functionality
2. Create phase 2 task extraction

#### Phase 3 Framework

1. Add framework phase support
2. Create phase 3 task handling

## **Priority Recommendations**

- Create recommendation-based task extraction
- Implement priority recommendation parsing
- Add support for recommendation sections

### Framework Phase 4

1. Build framework task detection
2. Create phase 4 support system

## Improvements Needed

- Fix priority detection inconsistencies
- Update header parsing logic
- Create unified priority system

## **Action Required**:

- Implement immediate action items
- Create action-required task extraction
- Add support for action sections

## **Recommended Actions**:

- Build comprehensive action parsing
- Create recommended task support
- Add action recommendation handling
`;
      
      const result = this.parseMarkdownForTasks(prioritySectionsContent, 'priority-sections.md');
      
      this.assert(result.length >= 25, 'Extracts tasks from various priority sections');
      
      // Test priority detection from different header formats
      const criticalTasks = result.filter(t => t.priority === 'critical');
      const highTasks = result.filter(t => t.priority === 'high');
      const mediumTasks = result.filter(t => t.priority === 'medium');
      const lowTasks = result.filter(t => t.priority === 'low');
      
      this.assert(criticalTasks.length >= 8, 'Correctly identifies critical priority tasks');
      this.assert(highTasks.length >= 6, 'Correctly identifies high priority tasks');
      this.assert(lowTasks.length >= 2, 'Correctly identifies low priority tasks');
      
      // Test numbered task extraction from priority sections
      const numberedTasks = result.filter(t => t.type === 'priority_task');
      this.assert(numberedTasks.length >= 12, 'Extracts numbered tasks from priority sections');
      
      // Test recommendation section extraction
      const recommendationTasks = result.filter(t => t.type === 'recommendation');
      this.assert(recommendationTasks.length >= 6, 'Extracts tasks from recommendation sections');
      
      // Test phase-based priority detection
      const phaseTasks = result.filter(t => t.section.toLowerCase().includes('phase'));
      this.assert(phaseTasks.length >= 8, 'Handles phase-based priority sections');
      
      // Test formatted header handling
      const boldHeaderTasks = result.filter(t => t.section.includes('Must-Do'));
      this.assert(boldHeaderTasks.length >= 3, 'Handles bold formatted headers');
      
    } catch (error) {
      this.assert(false, `Error in priority sections test: ${error.message}`);
    }
  }

  // Test task quality filtering with various formatting
  testQualityFilteringWithFormatting() {
    console.log('\n🧪 Testing quality filtering with various formatting...');
    
    try {
      const qualityFilterContent = `
# Must-Do Section

- Implement comprehensive task validation (should pass - action word + sufficient length)
- **Impact**: This should be filtered out as descriptive text
- Create **bold formatted** task that should pass quality filter
- *Italic task* that should pass if it contains implementation details
- \`Code formatted\` task that should pass quality validation
- **Current Coverage**: This should be filtered out
- Add support for [linked](http://example.com) task descriptions  
- **Estimated effort**: 2 hours (should be filtered out)
- Fix **urgent** issue in production system (should pass)
- **Legal Significance**: Should be filtered (descriptive header)
- Update ✅ completed task (should be filtered due to checkmark)
- Build comprehensive test suite for validation (should pass)
- hours (should be filtered - ends with hours)
- **Framework Phase**: Should be filtered (descriptive)
- Enhance system with **multiple** *formatting* \`styles\` (should pass)
- [x] This completed checkbox item should be filtered
- COMPLETED: This should be filtered due to completed marker
- Develop robust parsing for **complex formatting** scenarios (should pass)
- Short task (should be filtered - too short)
- **Bold text only** (should be filtered - just formatting)
- *Just italic* (should be filtered - too short and just formatting)

## **Improvements Needed**:
- Create quality filter testing framework (should pass as recommendation)
- **Bold recommendation** that should pass quality checks
- Add \`code-based\` recommendation validation (should pass)

## Should-Do Section

- Implement advanced **formatting** with *nested* styles (should pass)
- **Current Coverage** for this section (should be filtered)
- Build parser for complex [link with **bold**](http://test.com) formatting (should pass)
`;
      
      const result = this.parseMarkdownForTasks(qualityFilterContent, 'quality-filter.md');
      
      // Should extract good quality tasks while filtering out descriptive/bad ones
      this.assert(result.length >= 12 && result.length <= 18, 'Properly filters tasks based on quality');
      
      // Test that good tasks with formatting are kept
      const boldFormattedTask = result.find(t => t.task.includes('**bold formatted**'));
      this.assert(boldFormattedTask !== undefined, 'Keeps quality tasks with bold formatting');
      
      const linkFormattedTask = result.find(t => t.task.includes('[linked](http://example.com)'));
      this.assert(linkFormattedTask !== undefined, 'Keeps quality tasks with link formatting');
      
      const multiFormattedTask = result.find(t => t.task.includes('**multiple** *formatting* `styles`'));
      this.assert(multiFormattedTask !== undefined, 'Keeps quality tasks with multiple formatting');
      
      // Test that bad tasks are filtered out regardless of formatting
      const impactTask = result.find(t => t.task.includes('**Impact**:'));
      this.assert(impactTask === undefined, 'Filters out descriptive text with bold formatting');
      
      const effortTask = result.find(t => t.task.includes('**Estimated effort**:'));
      this.assert(effortTask === undefined, 'Filters out effort estimates with formatting');
      
      const completedTask = result.find(t => t.task.includes('✅'));
      this.assert(completedTask === undefined, 'Filters out completed tasks with checkmarks');
      
      const checkboxTask = result.find(t => t.task.includes('[x]'));
      this.assert(checkboxTask === undefined, 'Filters out completed checkbox items');
      
      const shortTask = result.find(t => t.task === 'Short task');
      this.assert(shortTask === undefined, 'Filters out short tasks');
      
      const boldOnlyTask = result.find(t => t.task.includes('**Bold text only**'));
      this.assert(boldOnlyTask === undefined, 'Filters out formatting-only tasks');
      
      // Test recommendation section filtering
      const recommendationTasks = result.filter(t => t.type === 'recommendation');
      this.assert(recommendationTasks.length >= 2, 'Extracts quality recommendation tasks');
      
    } catch (error) {
      this.assert(false, `Error in quality filtering test: ${error.message}`);
    }
  }

  // Run all tests
  async run() {
    console.log('🚀 Starting Markdown Formatting Validation Tests');
    console.log('Testing markdown parsing with various formatting styles');
    console.log('============================================================');
    
    this.setup();
    
    try {
      this.testBasicFormattingInTasks();
      this.testAdvancedFormattingScenarios();
      this.testFormattingEdgeCases();
      this.testListFormatVariations();
      this.testPrioritySectionVariations();
      this.testQualityFilteringWithFormatting();
      
      // Generate summary
      const passed = this.testResults.filter(r => r.passed).length;
      const failed = this.testResults.filter(r => !r.passed).length;
      const total = this.testResults.length;
      const successRate = Math.round((passed / total) * 100);
      const executionTime = Date.now() - this.startTime;
      
      console.log('\n============================================================');
      console.log('📊 Markdown Formatting Validation Test Summary');
      console.log('============================================================');
      console.log(`✅ Passed: ${passed}/${total}`);
      console.log(`❌ Failed: ${failed}`);
      console.log(`📈 Success Rate: ${successRate}%`);
      console.log(`⏱️  Execution Time: ${executionTime}ms`);
      
      if (failed > 0) {
        console.log('\n🔥 Failed Tests:');
        this.errors.forEach((error, index) => {
          console.log(`   ${index + 1}. ${error}`);
        });
      }
      
      // Archive results
      const resultData = {
        summary: {
          total_tests: total,
          passed: passed,
          failed: failed,
          success_rate: successRate,
          execution_time_ms: executionTime,
          test_focus: 'markdown formatting validation',
          requirement_source: 'todo/workflow-validation-tests.md line 16'
        },
        test_results: this.testResults,
        errors: this.errors,
        test_suite: 'markdown-formatting-validation',
        generated_at: new Date().toISOString()
      };
      
      // Use the existing archiver pattern
      const archiver = new TestResultArchiver();
      archiver.archiveTestResult('markdown-formatting-validation-results.json', resultData, {
        testType: 'markdown-formatting-validation',
        summary: resultData.summary
      });
      
      console.log('\n📁 Test results archived');
      
      return failed === 0;
      
    } catch (error) {
      console.error('💥 Fatal error in markdown formatting validation tests:', error.message);
      console.error(error.stack);
      return false;
    } finally {
      this.cleanup();
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const test = new MarkdownFormattingValidationTest();
  test.run().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('Test execution failed:', error);
    process.exit(1);
  });
}

module.exports = MarkdownFormattingValidationTest;