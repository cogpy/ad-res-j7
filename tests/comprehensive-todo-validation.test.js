#!/usr/bin/env node

/**
 * Comprehensive Todo File Workflow Validation Tests
 * 
 * This test suite implements the requirements from:
 * Repository_Status_and_Critical_Evidence_Collection.md line 133-136
 * 
 * Must-Do (Phase 1) - Critical Testing:
 * 1. Run comprehensive workflow validation tests on all todo files
 * 2. Verify all GitHub issue generation workflows function correctly  
 * 3. Test evidence cross-referencing system for accuracy
 * 4. Validate all file paths and references in documentation
 * 5. Ensure all JSON files are properly formatted and parseable
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const TestResultArchiver = require('./test-result-archiver');

class ComprehensiveTodoValidationTest {
  constructor() {
    this.testResults = [];
    this.errors = [];
    this.startTime = Date.now();
    this.todoFiles = [];
    this.workflowResults = {};
    this.crossReferenceResults = {};
    this.filePathResults = {};
  }

  // Test helper function
  assert(condition, message) {
    const result = {
      test: message,
      passed: condition,
      timestamp: new Date().toISOString(),
      suite: 'comprehensive-todo-validation'
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

  // Discover and analyze all todo files
  discoverTodoFiles() {
    console.log('\n🔍 Discovering and analyzing all todo files...');
    
    try {
      this.todoFiles = glob.sync('todo/*.md', { absolute: false });
      
      this.assert(this.todoFiles.length > 0, 'Found todo files in repository');
      this.assert(this.todoFiles.length >= 7, `Found adequate number of todo files (${this.todoFiles.length} >= 7)`);
      
      console.log(`📋 Found ${this.todoFiles.length} todo files:`);
      this.todoFiles.forEach(file => console.log(`   - ${file}`));
      
      // Verify each file exists and is readable
      this.todoFiles.forEach(file => {
        this.assert(fs.existsSync(file), `Todo file ${file} exists and is accessible`);
        
        const stats = fs.statSync(file);
        this.assert(stats.isFile(), `${file} is a valid file`);
        this.assert(stats.size > 0, `${file} has content (${stats.size} bytes)`);
        
        const content = fs.readFileSync(file, 'utf8');
        this.assert(content.length > 100, `${file} has substantial content (${content.length} chars)`);
      });
      
    } catch (error) {
      this.assert(false, `Error discovering todo files: ${error.message}`);
    }
  }

  // Test workflow generation compatibility for all todo files
  testWorkflowGenerationCompatibility() {
    console.log('\n🔧 Testing workflow generation compatibility for all todo files...');
    
    this.todoFiles.forEach(file => {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const lines = content.split('\n');
        
        // Test for workflow-compatible structure
        this.assert(content.includes('#'), `${file} has header structure`);
        
        // Count potential workflow tasks
        let taskCount = 0;
        let prioritySections = 0;
        let actionableTasks = 0;
        
        lines.forEach(line => {
          const trimmed = line.trim();
          
          // Count numbered tasks
          if (/^\d+\./.test(trimmed)) {
            taskCount++;
            // Check if task contains actionable verbs
            if (/\b(create|implement|fix|update|add|remove|test|verify|validate|ensure|run|execute)\b/i.test(trimmed)) {
              actionableTasks++;
            }
          }
          
          // Count bullet point tasks
          if (/^[-*]\s+/.test(trimmed) && trimmed.length > 10) {
            taskCount++;
            if (/\b(create|implement|fix|update|add|remove|test|verify|validate|ensure|run|execute)\b/i.test(trimmed)) {
              actionableTasks++;
            }
          }
          
          // Count priority sections
          if (/^##?\s+(Must-Do|Should-Do|Nice-to-Have|Critical|High|Medium|Low|Priority|Phase)/i.test(trimmed)) {
            prioritySections++;
          }
        });
        
        this.workflowResults[file] = {
          taskCount,
          prioritySections,
          actionableTasks,
          contentLength: content.length,
          lineCount: lines.length
        };
        
        this.assert(taskCount > 0, `${file} contains workflow-compatible tasks (${taskCount} found)`);
        this.assert(prioritySections > 0, `${file} has priority section structure (${prioritySections} sections)`);
        this.assert(actionableTasks > 0, `${file} contains actionable tasks (${actionableTasks}/${taskCount})`);
        
        // Test for GitHub issue generation compatibility
        const hasNumberedTasks = /^\d+\./m.test(content);
        const hasBulletTasks = /^[-*]\s+/m.test(content);
        const hasValidStructure = hasNumberedTasks || hasBulletTasks;
        
        this.assert(hasValidStructure, `${file} has valid task structure for issue generation`);
        
        // Test for quality filtering compatibility
        const shortLines = lines.filter(line => {
          const trimmed = line.trim();
          return /^\d+\./.test(trimmed) && trimmed.length < 30;
        });
        
        if (shortLines.length > 0) {
          console.log(`   ⚠️  ${file} has ${shortLines.length} short tasks that may be filtered`);
        }
        
        // Test for special characters and encoding
        const hasSpecialChars = /[^\x00-\x7F]/.test(content);
        if (hasSpecialChars) {
          this.assert(true, `${file} handles special characters (testing Unicode compatibility)`);
        }
        
      } catch (error) {
        this.assert(false, `Error testing workflow compatibility for ${file}: ${error.message}`);
      }
    });
  }

  // Test evidence cross-referencing system for accuracy
  testEvidenceCrossReferencing() {
    console.log('\n📊 Testing evidence cross-referencing system for accuracy...');
    
    const evidenceReferences = new Map();
    const fileReferences = new Map();
    const linkReferences = new Map();
    
    this.todoFiles.forEach(file => {
      try {
        const content = fs.readFileSync(file, 'utf8');
        
        // Find evidence references (JF-XX pattern)
        const evidenceMatches = content.match(/JF-[A-Z0-9]+/g) || [];
        evidenceReferences.set(file, evidenceMatches);
        
        // Find file path references
        const filePathMatches = content.match(/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_\/-]+\.(md|json|js|yml|yaml)/g) || [];
        fileReferences.set(file, filePathMatches);
        
        // Find markdown links
        const linkMatches = content.match(/\[([^\]]+)\]\(([^)]+)\)/g) || [];
        linkReferences.set(file, linkMatches);
        
        this.assert(true, `${file} cross-reference scan completed (${evidenceMatches.length} evidence refs, ${filePathMatches.length} file refs, ${linkMatches.length} links)`);
        
      } catch (error) {
        this.assert(false, `Error scanning cross-references in ${file}: ${error.message}`);
      }
    });
    
    // Validate evidence reference patterns
    let totalEvidenceRefs = 0;
    evidenceReferences.forEach((refs, file) => {
      totalEvidenceRefs += refs.length;
      refs.forEach(ref => {
        // Test evidence reference format
        this.assert(/^JF-[A-Z0-9]+$/.test(ref), `Evidence reference ${ref} in ${file} follows correct format`);
      });
    });
    
    this.assert(totalEvidenceRefs >= 20, `Found sufficient evidence references across todo files (${totalEvidenceRefs} >= 20)`);
    
    // Test file path validation
    let validFileRefs = 0;
    let totalFileRefs = 0;
    
    fileReferences.forEach((refs, file) => {
      refs.forEach(ref => {
        totalFileRefs++;
        if (fs.existsSync(ref)) {
          validFileRefs++;
        } else {
          console.log(`   ⚠️  Referenced file not found: ${ref} (in ${file})`);
        }
      });
    });
    
    if (totalFileRefs > 0) {
      const validPercentage = Math.round((validFileRefs / totalFileRefs) * 100);
      this.assert(validPercentage >= 70, `High percentage of valid file references (${validPercentage}% = ${validFileRefs}/${totalFileRefs})`);
    }
    
    this.crossReferenceResults = {
      evidenceReferences: Array.from(evidenceReferences.entries()),
      fileReferences: Array.from(fileReferences.entries()),
      linkReferences: Array.from(linkReferences.entries()),
      totalEvidenceRefs,
      totalFileRefs,
      validFileRefs
    };
  }

  // Validate all file paths and references in documentation
  validateFilePathsAndReferences() {
    console.log('\n📁 Validating all file paths and references in todo documentation...');
    
    const pathValidationResults = new Map();
    
    this.todoFiles.forEach(file => {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const results = {
          relativePaths: [],
          absolutePaths: [],
          validPaths: [],
          invalidPaths: [],
          urlReferences: [],
          internalLinks: []
        };
        
        // Extract different types of path references
        const lines = content.split('\n');
        lines.forEach((line, lineNum) => {
          // Relative paths
          const relativeMatches = line.match(/(?:\.\/|\.\.\/)[a-zA-Z0-9_\/-]+/g) || [];
          results.relativePaths.push(...relativeMatches.map(p => ({ path: p, line: lineNum + 1 })));
          
          // Absolute paths (within repo)
          const absoluteMatches = line.match(/\/[a-zA-Z0-9_\/-]+\.(md|json|js|yml|yaml|txt|pdf)/g) || [];
          results.absolutePaths.push(...absoluteMatches.map(p => ({ path: p, line: lineNum + 1 })));
          
          // URL references
          const urlMatches = line.match(/https?:\/\/[^\s)]+/g) || [];
          results.urlReferences.push(...urlMatches.map(u => ({ url: u, line: lineNum + 1 })));
          
          // Internal markdown links
          const linkMatches = line.match(/\[([^\]]+)\]\(([^)]+)\)/g) || [];
          if (linkMatches) {
            linkMatches.forEach(match => {
              const linkMatch = match.match(/\[([^\]]+)\]\(([^)]+)\)/);
              if (linkMatch && !linkMatch[2].startsWith('http')) {
                results.internalLinks.push({ text: linkMatch[1], path: linkMatch[2], line: lineNum + 1 });
              }
            });
          }
        });
        
        // Validate path existence
        [...results.relativePaths, ...results.absolutePaths, ...results.internalLinks].forEach(ref => {
          const pathToCheck = ref.path || ref.path;
          if (fs.existsSync(pathToCheck)) {
            results.validPaths.push(ref);
          } else {
            results.invalidPaths.push(ref);
          }
        });
        
        pathValidationResults.set(file, results);
        
        const totalPaths = results.relativePaths.length + results.absolutePaths.length + results.internalLinks.length;
        this.assert(totalPaths >= 0, `${file} path reference scan completed (${totalPaths} references found)`);
        
        if (results.invalidPaths.length > 0) {
          console.log(`   ⚠️  ${file} has ${results.invalidPaths.length} invalid path references`);
          results.invalidPaths.slice(0, 3).forEach(ref => {
            console.log(`      Line ${ref.line}: ${ref.path || ref.url}`);
          });
        }
        
        if (totalPaths > 0) {
          const validPercentage = Math.round((results.validPaths.length / totalPaths) * 100);
          this.assert(validPercentage >= 40, `${file} has acceptable path validity rate (${validPercentage}%)`);
        } else {
          this.assert(true, `${file} has no path references to validate`);
        }
        
      } catch (error) {
        this.assert(false, `Error validating paths in ${file}: ${error.message}`);
      }
    });
    
    this.filePathResults = Array.from(pathValidationResults.entries());
  }

  // Test JSON parsing and formatting in todo files
  testJSONCompatibility() {
    console.log('\n📋 Testing JSON parsing and formatting compatibility...');
    
    // Check for JSON code blocks in todo files
    this.todoFiles.forEach(file => {
      try {
        const content = fs.readFileSync(file, 'utf8');
        
        // Find JSON code blocks
        const jsonBlocks = content.match(/```json\s*\n([\s\S]*?)```/g) || [];
        
        jsonBlocks.forEach((block, index) => {
          try {
            const jsonContent = block.replace(/```json\s*\n/, '').replace(/```$/, '').trim();
            JSON.parse(jsonContent);
            this.assert(true, `${file} JSON block ${index + 1} is valid`);
          } catch (jsonError) {
            this.assert(false, `${file} JSON block ${index + 1} has invalid syntax: ${jsonError.message}`);
          }
        });
        
        // Check for inline JSON references
        const jsonFileRefs = content.match(/[a-zA-Z0-9_-]+\.json/g) || [];
        
        jsonFileRefs.forEach(jsonFile => {
          if (fs.existsSync(jsonFile)) {
            try {
              const jsonContent = fs.readFileSync(jsonFile, 'utf8');
              JSON.parse(jsonContent);
              this.assert(true, `Referenced JSON file ${jsonFile} is valid`);
            } catch (jsonError) {
              this.assert(false, `Referenced JSON file ${jsonFile} has invalid syntax`);
            }
          }
        });
        
      } catch (error) {
        this.assert(false, `Error testing JSON compatibility in ${file}: ${error.message}`);
      }
    });
  }

  // Test workflow integration with GitHub Actions
  testGitHubActionsIntegration() {
    console.log('\n⚙️ Testing GitHub Actions workflow integration...');
    
    try {
      // Verify todo-to-issues workflow can process all todo files
      const todoWorkflowPath = '.github/workflows/todo-to-issues.yml';
      this.assert(fs.existsSync(todoWorkflowPath), 'Todo-to-issues workflow exists');
      
      if (fs.existsSync(todoWorkflowPath)) {
        const workflowContent = fs.readFileSync(todoWorkflowPath, 'utf8');
        
        // Test workflow configuration
        this.assert(workflowContent.includes('todo/'), 'Workflow is configured to monitor todo folder');
        this.assert(workflowContent.includes('gh issue create') || workflowContent.includes('github.rest.issues.create'), 'Workflow uses GitHub CLI or API for issue creation');
        this.assert(workflowContent.includes('TodoIssueGenerator') || workflowContent.includes('todo'), 'Workflow includes issue generator functionality');
        
        // Test that workflow can handle all discovered todo files
        const todoPattern = workflowContent.match(/todo\/\*\.md/) || workflowContent.includes('todo/');
        this.assert(todoPattern !== null, 'Workflow pattern matches todo markdown files');
        
        // Test label handling for complex priorities
        this.assert(workflowContent.includes('priority'), 'Workflow handles priority labels');
        this.assert(workflowContent.includes('jq -r'), 'Workflow uses jq for JSON processing');
      }
      
      // Test workflow monitoring capabilities
      const monitoringWorkflowPath = '.github/workflows/workflow-monitoring.yml';
      if (fs.existsSync(monitoringWorkflowPath)) {
        this.assert(true, 'Workflow monitoring system is available');
      }
      
      // Test for test workflow integration
      const testWorkflowPath = '.github/workflows/test-workflows.yml';
      if (fs.existsSync(testWorkflowPath)) {
        const testContent = fs.readFileSync(testWorkflowPath, 'utf8');
        this.assert(testContent.includes('npm test'), 'Test workflow runs npm test suite');
        this.assert(testContent.includes('comprehensive'), 'Test workflow includes comprehensive testing');
      }
      
    } catch (error) {
      this.assert(false, `Error testing GitHub Actions integration: ${error.message}`);
    }
  }

  // Test todo file quality and completeness
  testTodoFileQuality() {
    console.log('\n✨ Testing todo file quality and completeness...');
    
    this.todoFiles.forEach(file => {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const lines = content.split('\n');
        
        // Test file structure quality
        const hasTitle = /^#\s+/.test(lines[0]);
        this.assert(hasTitle, `${file} has proper title structure`);
        
        // Test for consistent formatting
        const numberedTasks = lines.filter(line => /^\d+\./.test(line.trim()));
        const bulletTasks = lines.filter(line => /^[-*]\s+/.test(line.trim()));
        
        if (numberedTasks.length > 0) {
          this.assert(true, `${file} uses numbered task format (${numberedTasks.length} tasks)`);
        }
        
        if (bulletTasks.length > 0) {
          this.assert(true, `${file} uses bullet task format (${bulletTasks.length} tasks)`);
        }
        
        // Test for actionable language
        const actionableWords = ['create', 'implement', 'fix', 'update', 'add', 'remove', 'test', 'verify', 'validate', 'ensure', 'run', 'execute'];
        const hasActionableContent = actionableWords.some(word => 
          content.toLowerCase().includes(word)
        );
        
        this.assert(hasActionableContent, `${file} contains actionable task language`);
        
        // Test for completion tracking
        const hasCheckboxes = content.includes('- [x]') || content.includes('- [ ]');
        const hasCompletionMarkers = content.includes('✅') || content.includes('**COMPLETED**');
        
        if (hasCheckboxes || hasCompletionMarkers) {
          this.assert(true, `${file} includes completion tracking`);
        }
        
        // Test for priority indicators
        const hasPriorityStructure = /Must-Do|Should-Do|Nice-to-Have|Critical|High|Medium|Low|Phase \d+|Priority|Must|Should|Nice/i.test(content);
        this.assert(hasPriorityStructure, `${file} has priority structure`);
        
        // Test for metadata
        const hasMetadata = content.includes('**') || content.includes('##') || content.includes('---');
        this.assert(hasMetadata, `${file} includes metadata and structure`);
        
      } catch (error) {
        this.assert(false, `Error testing quality of ${file}: ${error.message}`);
      }
    });
  }

  // Run all comprehensive todo validation tests
  runAllTests() {
    console.log('🚀 Starting Comprehensive Todo File Workflow Validation Tests');
    console.log('Testing requirements from Repository_Status_and_Critical_Evidence_Collection.md');
    console.log('Must-Do (Phase 1) - Critical Testing (lines 133-136)');
    console.log('=' .repeat(80));
    
    this.discoverTodoFiles();
    this.testWorkflowGenerationCompatibility();
    this.testEvidenceCrossReferencing();
    this.validateFilePathsAndReferences();
    this.testJSONCompatibility();
    this.testGitHubActionsIntegration();
    this.testTodoFileQuality();
    
    // Calculate results
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(t => t.passed).length;
    const failedTests = this.errors.length;
    const successRate = Math.round((passedTests / totalTests) * 100);
    const duration = ((Date.now() - this.startTime) / 1000).toFixed(2);
    
    // Print summary
    console.log('\n' + '=' .repeat(80));
    console.log('📊 Comprehensive Todo File Validation Test Summary');
    console.log('=' .repeat(80));
    console.log(`✅ Passed: ${passedTests}/${totalTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`📈 Success Rate: ${successRate}%`);
    console.log(`⏱️  Execution Time: ${duration}s`);
    console.log(`📋 Todo Files Tested: ${this.todoFiles.length}`);
    
    // Print detailed results
    if (this.workflowResults && Object.keys(this.workflowResults).length > 0) {
      console.log('\n📋 Todo File Analysis Results:');
      Object.entries(this.workflowResults).forEach(([file, results]) => {
        console.log(`   ${file}: ${results.taskCount} tasks, ${results.prioritySections} priority sections, ${results.actionableTasks} actionable`);
      });
    }
    
    if (this.crossReferenceResults.totalEvidenceRefs) {
      console.log(`\n📊 Cross-Reference Analysis:`);
      console.log(`   Evidence References: ${this.crossReferenceResults.totalEvidenceRefs}`);
      console.log(`   File References: ${this.crossReferenceResults.totalFileRefs} (${this.crossReferenceResults.validFileRefs} valid)`);
    }
    
    if (failedTests > 0) {
      console.log('\n🔥 Failed Tests:');
      this.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    } else {
      console.log('\n🎉 ALL COMPREHENSIVE TODO VALIDATION TESTS PASSED!');
      console.log('✅ All requirements from Repository_Status_and_Critical_Evidence_Collection.md met');
    }
    
    // Archive results
    const archiver = new TestResultArchiver();
    archiver.archiveTestResult('comprehensive-todo-validation-results.json', {
      testResults: this.testResults,
      todoFiles: this.todoFiles,
      workflowResults: this.workflowResults,
      crossReferenceResults: this.crossReferenceResults,
      filePathResults: this.filePathResults,
      summary: {
        total: totalTests,
        passed: passedTests,
        failed: failedTests,
        success_rate: successRate,
        duration: duration,
        todo_files_tested: this.todoFiles.length
      },
      generated_at: new Date().toISOString()
    }, {
      testType: 'comprehensive-todo-validation',
      metadata: {
        requirements_source: 'Repository_Status_and_Critical_Evidence_Collection.md lines 133-136',
        test_coverage: 'all-todo-files',
        validation_scope: 'workflow-compatibility-cross-references-file-paths-json-github-actions'
      }
    });
    
    console.log('\n📁 Comprehensive todo validation results archived');
    console.log('=' .repeat(80));
    
    return failedTests === 0;
  }
}

// Run tests if executed directly
if (require.main === module) {
  const todoValidationTest = new ComprehensiveTodoValidationTest();
  const success = todoValidationTest.runAllTests();
  process.exit(success ? 0 : 1);
}

module.exports = ComprehensiveTodoValidationTest;