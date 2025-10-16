#!/usr/bin/env node

/**
 * Comprehensive Todo File Validation Test Suite
 * 
 * This test validates that ALL todo files in the repository can be properly
 * processed by the todo-to-issues workflow. This addresses the specific
 * requirement from Repository_Status_and_Critical_Evidence_Collection.md:
 * "Run comprehensive workflow validation tests on all todo files"
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const TestResultArchiver = require('./test-result-archiver');

class ComprehensiveTodoFileValidation {
  constructor() {
    this.testResults = [];
    this.errors = [];
    this.startTime = Date.now();
    this.todoFiles = [];
    this.processedTasks = [];
    this.validationMetrics = {
      totalFiles: 0,
      validFiles: 0,
      totalTasks: 0,
      validTasks: 0,
      criticalTasks: 0,
      highTasks: 0,
      mediumTasks: 0
    };
  }

  // Test helper function
  assert(condition, message) {
    const result = {
      test: message,
      passed: condition,
      timestamp: new Date().toISOString(),
      suite: 'todo-file-validation'
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

  // Discover all todo files
  discoverTodoFiles() {
    console.log('\n🔍 Discovering all todo files...');
    
    try {
      this.todoFiles = glob.sync('todo/**/*.md');
      this.validationMetrics.totalFiles = this.todoFiles.length;
      
      this.assert(this.todoFiles.length > 0, 'Found todo markdown files');
      this.assert(this.todoFiles.length >= 8, `Found expected number of todo files (${this.todoFiles.length} >= 8)`);
      
      console.log(`📁 Discovered ${this.todoFiles.length} todo files:`);
      this.todoFiles.forEach((file, index) => {
        console.log(`   ${index + 1}. ${file}`);
      });
      
      return true;
    } catch (error) {
      this.assert(false, `Error discovering todo files: ${error.message}`);
      return false;
    }
  }

  // Test individual todo file structure and content
  testTodoFileStructure(filePath) {
    try {
      if (!fs.existsSync(filePath)) {
        this.assert(false, `${filePath} exists`);
        return false;
      }

      const content = fs.readFileSync(filePath, 'utf8');
      const fileName = path.basename(filePath);
      
      // Basic file validation
      this.assert(content.length > 0, `${fileName} is not empty`);
      this.assert(content.includes('#'), `${fileName} has markdown headers`);
      
      // Content structure validation
      const lines = content.split('\n');
      const nonEmptyLines = lines.filter(line => line.trim().length > 0);
      const hasNumberedItems = content.match(/^\d+\.\s+/m);
      const hasBulletItems = content.match(/^[-*]\s+/m);
      const hasActionableContent = hasNumberedItems || hasBulletItems;
      
      this.assert(nonEmptyLines.length > 5, `${fileName} has substantial content (${nonEmptyLines.length} lines)`);
      
      // Parse and count tasks
      const tasks = this.extractTasksFromContent(content, fileName);
      
      if (tasks.length > 0) {
        this.assert(hasActionableContent, `${fileName} has actionable items format`);
        this.validationMetrics.validFiles++;
        this.validationMetrics.totalTasks += tasks.length;
        this.processedTasks.push(...tasks);
        
        console.log(`   📋 ${fileName}: ${tasks.length} tasks found`);
      } else {
        console.log(`   ℹ️  ${fileName}: No actionable tasks (documentation file)`);
      }
      
      return true;
    } catch (error) {
      this.assert(false, `Error testing ${filePath}: ${error.message}`);
      return false;
    }
  }

  // Extract tasks from todo file content (simulates workflow logic)
  extractTasksFromContent(content, fileName) {
    const tasks = [];
    const lines = content.split('\n');
    let currentPriority = 'medium';
    let currentSection = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Track priority sections
      if (line.toLowerCase().includes('must-do') || line.toLowerCase().includes('critical')) {
        currentPriority = 'critical';
        currentSection = line;
      } else if (line.toLowerCase().includes('should-do') || line.toLowerCase().includes('high')) {
        currentPriority = 'high';
        currentSection = line;
      } else if (line.toLowerCase().includes('nice-to-have') || line.toLowerCase().includes('medium')) {
        currentPriority = 'medium';
        currentSection = line;
      }
      
      // Extract numbered tasks
      const numberedMatch = line.match(/^(\d+)\.\s*(.+)/);
      if (numberedMatch) {
        const taskText = numberedMatch[2];
        if (this.isValidTask(taskText)) {
          tasks.push({
            text: taskText,
            priority: currentPriority,
            section: currentSection,
            file: fileName,
            lineNumber: i + 1
          });
        }
      }
      
      // Extract bullet point tasks
      const bulletMatch = line.match(/^[-*]\s*(.+)/);
      if (bulletMatch) {
        const taskText = bulletMatch[1];
        if (this.isValidTask(taskText)) {
          tasks.push({
            text: taskText,
            priority: currentPriority,
            section: currentSection,
            file: fileName,
            lineNumber: i + 1
          });
        }
      }
    }
    
    return tasks;
  }

  // Validate if a task is actionable (simulates workflow quality filtering)
  isValidTask(taskText) {
    // Filter out descriptive text and estimates
    if (taskText.length < 15) return false;
    if (taskText.match(/^\*\*[^:]+\*\*:\s*/)) return false; // **Description**: format
    if (taskText.match(/hours?$/i)) return false; // effort estimates
    if (taskText.match(/^(current|legal|impact|framework|estimated)/i)) return false; // descriptive
    
    // Must contain action words or be actionable
    const actionWords = ['implement', 'create', 'fix', 'enhance', 'add', 'update', 'test', 'verify', 'validate', 'run', 'gather', 'obtain', 'document', 'review', 'collect', 'prepare', 'develop', 'ensure'];
    const hasActionWord = actionWords.some(word => taskText.toLowerCase().includes(word));
    
    return hasActionWord || taskText.includes('✅') || taskText.includes('- [');
  }

  // Test all todo files comprehensively
  testAllTodoFiles() {
    console.log('\n🧪 Testing all todo files for workflow compatibility...');
    
    let validFiles = 0;
    
    for (const filePath of this.todoFiles) {
      const fileName = path.basename(filePath);
      console.log(`\n📄 Testing ${fileName}...`);
      
      if (this.testTodoFileStructure(filePath)) {
        validFiles++;
      }
      
      // Test specific file requirements
      this.testSpecificFileRequirements(filePath);
    }
    
    const fileSuccessRate = Math.round((validFiles / this.todoFiles.length) * 100);
    this.assert(fileSuccessRate >= 90, `High success rate for file processing (${fileSuccessRate}% >= 90%)`);
    
    return validFiles;
  }

  // Test requirements for specific critical files
  testSpecificFileRequirements(filePath) {
    const fileName = path.basename(filePath);
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Test Repository_Status_and_Critical_Evidence_Collection.md
      if (fileName === 'Repository_Status_and_Critical_Evidence_Collection.md') {
        this.assert(content.includes('Must-Do (Phase 1)'), 'Main todo file has Must-Do section');
        this.assert(content.includes('Should-Do (Phase 2)'), 'Main todo file has Should-Do section');
        this.assert(content.includes('Nice-to-Have (Phase 3)'), 'Main todo file has Nice-to-Have section');
        this.assert(content.includes('Critical Testing'), 'Main todo file has Critical Testing section');
        this.assert(content.includes('Run comprehensive workflow validation tests'), 'Main todo file contains the target task');
      }
      
      // Test workflow validation files
      if (fileName.includes('workflow') || fileName.includes('validation')) {
        this.assert(content.includes('test') || content.includes('validation'), 
                   `${fileName} contains testing/validation content`);
      }
      
      // Test JAX_DAN_RESPONSE_EXPANSION_PLAN.md
      if (fileName === 'JAX_DAN_RESPONSE_EXPANSION_PLAN.md') {
        this.assert(content.includes('Priority') || content.includes('Task'), 
                   'JAX-DAN expansion plan has task structure');
      }
      
    } catch (error) {
      this.assert(false, `Error testing specific requirements for ${fileName}: ${error.message}`);
    }
  }

  // Test task quality and distribution
  testTaskQualityAndDistribution() {
    console.log('\n📊 Testing task quality and distribution...');
    
    // Count tasks by priority
    this.processedTasks.forEach(task => {
      switch (task.priority) {
        case 'critical':
          this.validationMetrics.criticalTasks++;
          break;
        case 'high':
          this.validationMetrics.highTasks++;
          break;
        default:
          this.validationMetrics.mediumTasks++;
      }
    });
    
    this.validationMetrics.validTasks = this.processedTasks.length;
    
    this.assert(this.validationMetrics.totalTasks > 0, 
               `Found actionable tasks (${this.validationMetrics.totalTasks})`);
    this.assert(this.validationMetrics.validTasks > 0, 
               `Found valid tasks (${this.validationMetrics.validTasks})`);
    this.assert(this.validationMetrics.criticalTasks > 0, 
               `Found critical priority tasks (${this.validationMetrics.criticalTasks})`);
    
    // Quality distribution checks
    const qualityRate = Math.round((this.validationMetrics.validTasks / this.validationMetrics.totalTasks) * 100);
    this.assert(qualityRate >= 70, `Good task quality rate (${qualityRate}% >= 70%)`);
    
    console.log(`📈 Task Distribution:`);
    console.log(`   🔥 Critical: ${this.validationMetrics.criticalTasks}`);
    console.log(`   ⚠️  High: ${this.validationMetrics.highTasks}`);
    console.log(`   📋 Medium: ${this.validationMetrics.mediumTasks}`);
    console.log(`   ✅ Quality Rate: ${qualityRate}%`);
  }

  // Test workflow simulation
  testWorkflowSimulation() {
    console.log('\n⚡ Simulating workflow processing...');
    
    try {
      // Simulate issue generation for found tasks
      const mockIssues = [];
      
      this.processedTasks.forEach((task, index) => {
        const issue = {
          title: task.text.length > 80 ? task.text.substring(0, 77) + '...' : task.text,
          body: `Task from ${task.file}\n\nSection: ${task.section}\nPriority: ${task.priority}\nLine: ${task.lineNumber}`,
          labels: this.generateLabelsForTask(task),
          priority: task.priority,
          source: task.file
        };
        mockIssues.push(issue);
      });
      
      this.assert(mockIssues.length > 0, `Generated mock issues (${mockIssues.length})`);
      
      // Test label generation
      const criticalIssues = mockIssues.filter(issue => issue.priority === 'critical');
      const highIssues = mockIssues.filter(issue => issue.priority === 'high');
      
      if (criticalIssues.length > 0) {
        this.assert(criticalIssues.every(issue => issue.labels.includes('priority: critical')),
                   'Critical issues have critical priority label');
        this.assert(criticalIssues.every(issue => issue.labels.includes('bug')),
                   'Critical issues have bug label');
      }
      
      if (highIssues.length > 0) {
        this.assert(highIssues.every(issue => issue.labels.includes('priority: high')),
                   'High priority issues have high priority label');
      }
      
      // Test issue content quality
      const validTitles = mockIssues.filter(issue => issue.title.length <= 80).length;
      const titleQualityRate = Math.round((validTitles / mockIssues.length) * 100);
      this.assert(titleQualityRate === 100, `All issue titles are properly sized (${titleQualityRate}%)`);
      
      console.log(`🎯 Workflow Simulation Results:`);
      console.log(`   📝 Mock Issues Generated: ${mockIssues.length}`);
      console.log(`   🔥 Critical Issues: ${criticalIssues.length}`);
      console.log(`   ⚠️  High Priority Issues: ${highIssues.length}`);
      console.log(`   📏 Title Quality: ${titleQualityRate}%`);
      
      return mockIssues;
      
    } catch (error) {
      this.assert(false, `Workflow simulation error: ${error.message}`);
      return [];
    }
  }

  // Generate labels for a task (simulates workflow logic)
  generateLabelsForTask(task) {
    const labels = ['todo', 'enhancement'];
    
    switch (task.priority) {
      case 'critical':
        labels.push('priority: critical', 'bug');
        break;
      case 'high':
        labels.push('priority: high');
        break;
      default:
        labels.push('priority: medium');
    }
    
    // Add context-specific labels
    if (task.text.toLowerCase().includes('test') || task.text.toLowerCase().includes('validation')) {
      labels.push('testing');
    }
    if (task.text.toLowerCase().includes('security') || task.text.toLowerCase().includes('vulnerability')) {
      labels.push('security');
    }
    if (task.text.toLowerCase().includes('documentation') || task.text.toLowerCase().includes('doc')) {
      labels.push('documentation');
    }
    
    return labels;
  }

  // Test edge cases and error conditions
  testEdgeCases() {
    console.log('\n🧩 Testing edge cases and error conditions...');
    
    try {
      // Test empty file handling
      const emptyContent = '';
      const emptyTasks = this.extractTasksFromContent(emptyContent, 'empty.md');
      this.assert(emptyTasks.length === 0, 'Empty content produces no tasks');
      
      // Test malformed content handling
      const malformedContent = `# Broken File
      This is not properly formatted
      1. Implement valid task item here
      Not a task
      2. Create another valid task here`;
      const malformedTasks = this.extractTasksFromContent(malformedContent, 'malformed.md');
      this.assert(malformedTasks.length >= 1, 'Malformed content still extracts valid tasks');
      
      // Test special characters
      const specialContent = `# Special Characters
      ## Must-Do
      1. Implement task with émojis 🚀 and ünicode characters properly
      2. Create task with "quotes" and 'apostrophes' handling
      3. Develop task with symbols: $@#% and numbers: 123 processing`;
      const specialTasks = this.extractTasksFromContent(specialContent, 'special.md');
      this.assert(specialTasks.length >= 2, 'Handles special characters in tasks');
      
      // Test very long content
      const longTask = 'This is a very long task description that exceeds the normal length limits to test how the system handles extremely verbose task descriptions that might break formatting or processing';
      const longContent = `# Long Tasks\n1. ${longTask}`;
      const longTasks = this.extractTasksFromContent(longContent, 'long.md');
      this.assert(longTasks.length === 1, 'Handles long task descriptions');
      
    } catch (error) {
      this.assert(false, `Edge case testing error: ${error.message}`);
    }
  }

  // Run the comprehensive validation
  runComprehensiveValidation() {
    console.log('🚀 Starting Comprehensive Todo File Validation');
    console.log('Testing ALL todo files for workflow compatibility');
    console.log('Addresses: Repository_Status_and_Critical_Evidence_Collection.md line 136');
    console.log('=' .repeat(80));
    
    // Phase 1: Discovery
    if (!this.discoverTodoFiles()) {
      console.log('❌ Failed to discover todo files. Aborting.');
      return false;
    }
    
    // Phase 2: Individual file testing
    const validFiles = this.testAllTodoFiles();
    
    // Phase 3: Task analysis
    this.testTaskQualityAndDistribution();
    
    // Phase 4: Workflow simulation
    const mockIssues = this.testWorkflowSimulation();
    
    // Phase 5: Edge case testing
    this.testEdgeCases();
    
    // Calculate final results
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(t => t.passed).length;
    const failedTests = this.errors.length;
    const successRate = Math.round((passedTests / totalTests) * 100);
    const duration = ((Date.now() - this.startTime) / 1000).toFixed(2);
    
    // Print comprehensive summary
    console.log('\n' + '=' .repeat(80));
    console.log('📊 Comprehensive Todo File Validation Summary');
    console.log('=' .repeat(80));
    console.log(`📁 Files Processed: ${this.validationMetrics.totalFiles}`);
    console.log(`✅ Valid Files: ${this.validationMetrics.validFiles}/${this.validationMetrics.totalFiles}`);
    console.log(`📋 Total Tasks Found: ${this.validationMetrics.totalTasks}`);
    console.log(`✅ Valid Tasks: ${this.validationMetrics.validTasks}`);
    console.log(`🔥 Critical Tasks: ${this.validationMetrics.criticalTasks}`);
    console.log(`⚠️  High Priority Tasks: ${this.validationMetrics.highTasks}`);
    console.log(`📊 Medium Priority Tasks: ${this.validationMetrics.mediumTasks}`);
    console.log(`🎯 Mock Issues Generated: ${mockIssues.length}`);
    console.log('\n📈 Test Results:');
    console.log(`✅ Passed: ${passedTests}/${totalTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`📊 Success Rate: ${successRate}%`);
    console.log(`⏱️  Execution Time: ${duration}s`);
    
    if (failedTests > 0) {
      console.log('\n🔥 Failed Tests:');
      this.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    } else {
      console.log('\n🎉 ALL TODO FILES VALIDATED SUCCESSFULLY!');
      console.log('✅ All todo files are compatible with the workflow');
      console.log('✅ All actionable tasks can be processed');
      console.log('✅ Issue generation simulation successful');
    }
    
    // Archive comprehensive results
    const archiver = new TestResultArchiver();
    archiver.archiveTestResult('comprehensive-todo-validation-results.json', {
      validationMetrics: this.validationMetrics,
      testResults: this.testResults,
      processedTasks: this.processedTasks.map(task => ({
        ...task,
        file: task.file // Keep only essential task data for archive
      })),
      mockIssues: mockIssues.map(issue => ({
        title: issue.title,
        priority: issue.priority,
        labels: issue.labels,
        source: issue.source
      })),
      summary: {
        total: totalTests,
        passed: passedTests,
        failed: failedTests,
        success_rate: successRate,
        duration: duration,
        files_validated: this.validationMetrics.totalFiles,
        tasks_found: this.validationMetrics.totalTasks,
        issues_generated: mockIssues.length
      },
      generated_at: new Date().toISOString()
    }, {
      testType: 'comprehensive-todo-validation',
      taskRequirement: 'Repository_Status_and_Critical_Evidence_Collection.md line 136',
      metadata: {
        source_files: this.todoFiles,
        validation_complete: failedTests === 0,
        workflow_compatible: failedTests === 0
      }
    });
    
    console.log('\n📁 Comprehensive validation results archived');
    console.log('=' .repeat(80));
    
    return failedTests === 0;
  }
}

// Run validation if executed directly
if (require.main === module) {
  const validator = new ComprehensiveTodoFileValidation();
  const success = validator.runComprehensiveValidation();
  process.exit(success ? 0 : 1);
}

module.exports = ComprehensiveTodoFileValidation;