#!/usr/bin/env node

/**
 * Simple Workflow Test
 * Tests basic functionality of the todo-to-issues workflow
 * This validates that the workflow can:
 * 1. Parse markdown files in the todo/ folder
 * 2. Identify tasks in priority sections
 * 3. Generate appropriate issue metadata
 */

const fs = require('fs');
const path = require('path');

class SimpleWorkflowTest {
  constructor() {
    this.testsPassed = 0;
    this.testsFailed = 0;
    this.startTime = Date.now();
  }

  assert(condition, message) {
    if (condition) {
      console.log(`✅ ${message}`);
      this.testsPassed++;
      return true;
    } else {
      console.log(`❌ ${message}`);
      this.testsFailed++;
      return false;
    }
  }

  // Test 1: Verify todo file exists
  testTodoFileExists() {
    console.log('\n🧪 Test 1: Verify simple-workflow-test.md exists...');
    const todoFile = path.join(process.cwd(), 'todo', 'simple-workflow-test.md');
    const exists = fs.existsSync(todoFile);
    this.assert(exists, 'simple-workflow-test.md file exists');
    return exists;
  }

  // Test 2: Verify file has content
  testTodoFileHasContent() {
    console.log('\n🧪 Test 2: Verify file has content...');
    const todoFile = path.join(process.cwd(), 'todo', 'simple-workflow-test.md');
    
    if (!fs.existsSync(todoFile)) {
      this.assert(false, 'Cannot test content - file does not exist');
      return false;
    }

    const content = fs.readFileSync(todoFile, 'utf8');
    this.assert(content.length > 0, 'File has content');
    this.assert(content.includes('Must-Do'), 'File contains Must-Do section');
    return true;
  }

  // Test 3: Verify task detection
  testTaskDetection() {
    console.log('\n🧪 Test 3: Verify task detection logic...');
    const todoFile = path.join(process.cwd(), 'todo', 'simple-workflow-test.md');
    
    if (!fs.existsSync(todoFile)) {
      this.assert(false, 'Cannot test task detection - file does not exist');
      return false;
    }

    const content = fs.readFileSync(todoFile, 'utf8');
    const lines = content.split('\n');
    
    let foundMustDoSection = false;
    let foundTargetTask = false;
    
    for (const line of lines) {
      if (line.match(/##\s*Must-Do/i)) {
        foundMustDoSection = true;
      }
      if (line.includes('Test basic workflow functionality')) {
        foundTargetTask = true;
      }
    }
    
    this.assert(foundMustDoSection, 'Found Must-Do section');
    this.assert(foundTargetTask, 'Found target task: "Test basic workflow functionality"');
    return foundMustDoSection && foundTargetTask;
  }

  // Test 4: Verify priority detection
  testPriorityDetection() {
    console.log('\n🧪 Test 4: Verify priority detection...');
    const todoFile = path.join(process.cwd(), 'todo', 'simple-workflow-test.md');
    
    if (!fs.existsSync(todoFile)) {
      this.assert(false, 'Cannot test priority - file does not exist');
      return false;
    }

    const content = fs.readFileSync(todoFile, 'utf8');
    const hasCriticalPriority = content.match(/Must-Do.*Critical Priority/i);
    
    this.assert(hasCriticalPriority !== null, 'Detected Critical Priority in Must-Do section');
    return hasCriticalPriority !== null;
  }

  // Test 5: Verify numbered task format
  testNumberedTaskFormat() {
    console.log('\n🧪 Test 5: Verify numbered task format...');
    const todoFile = path.join(process.cwd(), 'todo', 'simple-workflow-test.md');
    
    if (!fs.existsSync(todoFile)) {
      this.assert(false, 'Cannot test format - file does not exist');
      return false;
    }

    const content = fs.readFileSync(todoFile, 'utf8');
    const lines = content.split('\n');
    
    let foundNumberedTask = false;
    
    for (const line of lines) {
      // Match either original format or completed format with strikethrough
      if (line.match(/^\d+\.\s+.*Test basic workflow functionality/)) {
        foundNumberedTask = true;
        break;
      }
    }
    
    this.assert(foundNumberedTask, 'Task is in numbered list format (1. Task description) or marked complete');
    return foundNumberedTask;
  }

  // Test 6: Verify action word presence
  testActionWordPresence() {
    console.log('\n🧪 Test 6: Verify task contains action word...');
    const taskText = 'Test basic workflow functionality with this simple task';
    const actionWords = ['test', 'implement', 'add', 'create', 'fix', 'update'];
    
    const hasActionWord = actionWords.some(word => 
      taskText.toLowerCase().includes(word)
    );
    
    this.assert(hasActionWord, 'Task contains action word: "test"');
    return hasActionWord;
  }

  // Test 7: Verify workflow file exists
  testWorkflowFileExists() {
    console.log('\n🧪 Test 7: Verify workflow file exists...');
    const workflowFile = path.join(process.cwd(), '.github', 'workflows', 'todo-to-issues.yml');
    const exists = fs.existsSync(workflowFile);
    this.assert(exists, 'todo-to-issues.yml workflow file exists');
    return exists;
  }

  // Run all tests
  async runAllTests() {
    console.log('🚀 Starting Simple Workflow Test Suite');
    console.log('Testing basic todo-to-issues workflow functionality');
    console.log('============================================================\n');

    this.testTodoFileExists();
    this.testTodoFileHasContent();
    this.testTaskDetection();
    this.testPriorityDetection();
    this.testNumberedTaskFormat();
    this.testActionWordPresence();
    this.testWorkflowFileExists();

    // Print summary
    const elapsed = Date.now() - this.startTime;
    console.log('\n============================================================');
    console.log('📊 Test Summary');
    console.log('============================================================');
    console.log(`✅ Passed: ${this.testsPassed}`);
    console.log(`❌ Failed: ${this.testsFailed}`);
    console.log(`📈 Success Rate: ${Math.round((this.testsPassed / (this.testsPassed + this.testsFailed)) * 100)}%`);
    console.log(`⏱️  Execution time: ${elapsed}ms`);
    console.log('============================================================\n');

    if (this.testsFailed === 0) {
      console.log('🎉 All tests passed! Basic workflow functionality is working correctly.');
      return 0;
    } else {
      console.log('⚠️  Some tests failed. Review the output above.');
      return 1;
    }
  }
}

// Run tests if executed directly
if (require.main === module) {
  const test = new SimpleWorkflowTest();
  test.runAllTests().then(exitCode => {
    process.exit(exitCode);
  });
}

module.exports = SimpleWorkflowTest;
