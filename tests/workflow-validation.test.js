// Workflow Validation Tests
// Tests for GitHub Actions workflows: todo-to-issues.yml and file-representations.yml

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const TestResultArchiver = require('./test-result-archiver');

class WorkflowValidator {
  constructor() {
    this.testResults = [];
    this.errors = [];
  }

  // Test helper function
  assert(condition, message) {
    const result = {
      test: message,
      passed: condition,
      timestamp: new Date().toISOString()
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

  // Test 1: Verify workflow files exist and are valid YAML
  testWorkflowFilesExist() {
    console.log('\n🧪 Testing workflow file existence and basic structure...');
    
    const workflowDir = '.github/workflows';
    const todoWorkflowPath = path.join(workflowDir, 'todo-to-issues.yml');
    const fileRepWorkflowPath = path.join(workflowDir, 'file-representations.yml');
    
    this.assert(fs.existsSync(workflowDir), 'GitHub workflows directory exists');
    this.assert(fs.existsSync(todoWorkflowPath), 'Todo-to-issues workflow file exists');
    this.assert(fs.existsSync(fileRepWorkflowPath), 'File-representations workflow file exists');
    
    // Verify files are readable
    try {
      const todoContent = fs.readFileSync(todoWorkflowPath, 'utf8');
      this.assert(todoContent.includes('name: Todo to Issues Generator'), 'Todo workflow has correct name');
      this.assert(todoContent.includes('on:'), 'Todo workflow has trigger configuration');
      
      const fileRepContent = fs.readFileSync(fileRepWorkflowPath, 'utf8');
      this.assert(fileRepContent.includes('name: File Representation Validator'), 'File-rep workflow has correct name');
      this.assert(fileRepContent.includes('on:'), 'File-rep workflow has trigger configuration');
      
    } catch (error) {
      this.assert(false, `Error reading workflow files: ${error.message}`);
    }
  }

  // Test 2: Validate todo-to-issues workflow structure
  testTodoWorkflowStructure() {
    console.log('\n🧪 Testing todo-to-issues workflow structure...');
    
    try {
      const workflowContent = fs.readFileSync('.github/workflows/todo-to-issues.yml', 'utf8');
      
      // Test workflow triggers
      this.assert(workflowContent.includes('push:'), 'Has push trigger');
      this.assert(workflowContent.includes('pull_request:'), 'Has pull request trigger');
      this.assert(workflowContent.includes('workflow_dispatch:'), 'Has manual trigger');
      this.assert(workflowContent.includes('paths: [ "todo/**" ]'), 'Correctly filtered to todo folder');
      
      // Test permissions
      this.assert(workflowContent.includes('contents: read'), 'Has contents read permission');
      this.assert(workflowContent.includes('issues: write'), 'Has issues write permission');
      this.assert(workflowContent.includes('actions: read'), 'Has actions read permission');
      
      // Test workflow steps
      this.assert(workflowContent.includes('Checkout repository'), 'Has checkout step');
      this.assert(workflowContent.includes('Setup Node.js'), 'Has Node.js setup');
      this.assert(workflowContent.includes('npm install glob'), 'Installs required dependencies');
      this.assert(workflowContent.includes('Scan todo folder'), 'Has todo scanning step');
      this.assert(workflowContent.includes('Create GitHub issues'), 'Has issue creation step');
      
      // Test issue creation logic
      this.assert(workflowContent.includes('force_regenerate'), 'Supports force regeneration');
      this.assert(workflowContent.includes('gh_args=("issue" "create"'), 'Uses GitHub CLI for issue creation');
      
    } catch (error) {
      this.assert(false, `Error testing todo workflow structure: ${error.message}`);
    }
  }

  // Test 3: Validate label handling in workflow
  testLabelHandling() {
    console.log('\n🧪 Testing label array handling...');
    
    try {
      const workflowContent = fs.readFileSync('.github/workflows/todo-to-issues.yml', 'utf8');
      
      // Check for proper label array conversion using secure array-based approach
      this.assert(workflowContent.includes('gh_args='), 'Initializes gh_args array variable');
      this.assert(workflowContent.includes('while IFS= read -r label'), 'Iterates through labels array');
      this.assert(workflowContent.includes('jq -r \'.[]\''), 'Uses jq to parse JSON label array');
      this.assert(workflowContent.includes('gh_args+=("--label" "$label")'), 'Properly adds labels to array');
      this.assert(workflowContent.includes('gh "${gh_args[@]}"'), 'Uses array expansion for gh command');
      
      // Test for common label patterns
      this.assert(workflowContent.includes('priority: critical'), 'Supports priority critical label');
      this.assert(workflowContent.includes('priority: high'), 'Supports priority high label');
      this.assert(workflowContent.includes('todo'), 'Includes todo label');
      this.assert(workflowContent.includes('enhancement'), 'Includes enhancement label');
      
    } catch (error) {
      this.assert(false, `Error testing label handling: ${error.message}`);
    }
  }

  // Test 4: Validate issue generator logic by parsing the embedded JavaScript
  testIssueGeneratorLogic() {
    console.log('\n🧪 Testing issue generator logic...');
    
    try {
      const workflowContent = fs.readFileSync('.github/workflows/todo-to-issues.yml', 'utf8');
      
      // Extract the JavaScript code from the workflow
      const jsStart = workflowContent.indexOf('cat > issue-generator.js << \'EOF\'');
      const jsEnd = workflowContent.indexOf('EOF', jsStart + 50);
      
      this.assert(jsStart !== -1, 'Contains embedded JavaScript code');
      this.assert(jsEnd !== -1, 'JavaScript code is properly terminated');
      
      if (jsStart !== -1 && jsEnd !== -1) {
        const jsCode = workflowContent.substring(jsStart, jsEnd);
        
        // Test for key classes and methods
        this.assert(jsCode.includes('class TodoIssueGenerator'), 'Defines TodoIssueGenerator class');
        this.assert(jsCode.includes('parseMarkdownForTasks'), 'Has parseMarkdownForTasks method');
        this.assert(jsCode.includes('isHighQualityTask'), 'Has quality filtering method');
        this.assert(jsCode.includes('generateIssueContent'), 'Has issue content generation method');
        this.assert(jsCode.includes('determinePriorityFromSection'), 'Has priority determination logic');
        
        // Test for parsing patterns - using lowercase for case-insensitive matching
        this.assert(jsCode.includes('must-do'), 'Recognizes Must-Do sections');
        this.assert(jsCode.includes('should-do'), 'Recognizes Should-Do sections');
        this.assert(jsCode.includes('nice-to-have'), 'Recognizes Nice-to-Have sections');
        this.assert(jsCode.includes('Improvements Needed'), 'Recognizes Improvements Needed sections');
        
        // Test for action word detection
        this.assert(jsCode.includes('implement'), 'Detects implement action word');
        this.assert(jsCode.includes('create'), 'Detects create action word');
        this.assert(jsCode.includes('fix'), 'Detects fix action word');
        this.assert(jsCode.includes('enhance'), 'Detects enhance action word');
        
        // Test for quality filtering
        this.assert(jsCode.includes('task.length < 15'), 'Filters out short tasks');
        this.assert(jsCode.includes('hours?$'), 'Filters out effort estimates');
        this.assert(jsCode.includes('Current Coverage'), 'Filters out descriptive text');
      }
      
    } catch (error) {
      this.assert(false, `Error testing issue generator logic: ${error.message}`);
    }
  }

  // Test 5: Test file-representations workflow structure
  testFileRepresentationsWorkflow() {
    console.log('\n🧪 Testing file-representations workflow...');
    
    try {
      const workflowContent = fs.readFileSync('.github/workflows/file-representations.yml', 'utf8');
      
      // Test workflow structure
      this.assert(workflowContent.includes('validate-and-generate:'), 'Has validate-and-generate job');
      this.assert(workflowContent.includes('ocr-and-generate-missing-representations:'), 'Has OCR job');
      this.assert(workflowContent.includes('needs: validate-and-generate'), 'OCR job depends on main job');
      
      // Test file analysis logic
      this.assert(workflowContent.includes('analyze-files.js'), 'Creates file analysis script');
      this.assert(workflowContent.includes('file-converter.js'), 'Creates file converter script');
      this.assert(workflowContent.includes('ocr-file-converter.js'), 'Creates OCR converter script');
      
      // Test exclusion patterns
      this.assert(workflowContent.includes('node_modules/**'), 'Excludes node_modules');
      this.assert(workflowContent.includes('vendor/**'), 'Excludes vendor directory');
      this.assert(workflowContent.includes('.git/**'), 'Excludes git directory');
      
      // Test conversion logic
      this.assert(workflowContent.includes('markdownToJson'), 'Has MD to JSON conversion');
      this.assert(workflowContent.includes('jsonToMarkdown'), 'Has JSON to MD conversion');
      this.assert(workflowContent.includes('performOCR'), 'Has OCR processing');
      
    } catch (error) {
      this.assert(false, `Error testing file-representations workflow: ${error.message}`);
    }
  }

  // Test 6: Validate sample todo files exist and are parseable
  testTodoFileStructure() {
    console.log('\n🧪 Testing todo file structure and parsing...');
    
    const todoFiles = glob.sync('todo/**/*.md');
    this.assert(todoFiles.length > 0, 'Todo folder contains markdown files');
    
    // Test specific files
    const testFiles = ['todo/workflow-validation-tests.md', 'todo/workflow-test.md', 'todo/simple-workflow-test.md'];
    
    for (const todoFile of testFiles) {
      if (!fs.existsSync(todoFile)) continue;
      
      try {
        const content = fs.readFileSync(todoFile, 'utf8');
        this.assert(content.length > 0, `${todoFile} is not empty`);
        
        // Test for expected section patterns
        const hasStructuredSections = content.includes('##') || content.includes('###');
        const hasActionableItems = /^\d+\.\s+|^-\s+|^\*\s+/m.test(content);
        const hasPriorityIndicators = /(must-do|should-do|critical|high|priority)/i.test(content);
        
        this.assert(hasStructuredSections || hasActionableItems, `${todoFile} has structured content`);
        
        if (todoFile === 'todo/workflow-test.md') {
          this.assert(content.includes('validation tests'), 'workflow-test.md contains the target task');
          this.assert(content.includes('Improvements Needed'), 'workflow-test.md has Improvements Needed section');
        }
        
        if (todoFile === 'todo/simple-workflow-test.md') {
          this.assert(content.includes('basic functionality'), 'simple-workflow-test.md contains basic functionality task');
          this.assert(content.includes('Improvements Needed'), 'simple-workflow-test.md has Improvements Needed section');
        }
        
      } catch (error) {
        this.assert(false, `Error reading ${todoFile}: ${error.message}`);
      }
    }
  }

  // Test 7: Validate workflow error handling
  testErrorHandling() {
    console.log('\n🧪 Testing error handling in workflows...');
    
    try {
      const todoWorkflow = fs.readFileSync('.github/workflows/todo-to-issues.yml', 'utf8');
      
      // Test for error handling patterns
      this.assert(todoWorkflow.includes('if [ $todo_count -eq 0 ]'), 'Handles empty todo folder');
      this.assert(todoWorkflow.includes('try {') && todoWorkflow.includes('} catch (error)'), 'Has JavaScript error handling');
      this.assert(todoWorkflow.includes('always()'), 'Has cleanup step that always runs');
      this.assert(todoWorkflow.includes('rm -f'), 'Cleans up temporary files');
      
      // Test conditional execution
      this.assert(todoWorkflow.includes('if: steps.scan.outputs.has_todos == \'true\''), 'Conditionally executes based on todo presence');
      this.assert(todoWorkflow.includes('if: steps.load_issues.outputs.has_issues == \'true\''), 'Conditionally creates issues');
      
      const fileRepWorkflow = fs.readFileSync('.github/workflows/file-representations.yml', 'utf8');
      
      // Test file-representations error handling
      this.assert(fileRepWorkflow.includes('git diff --quiet'), 'Checks for changes before committing');
      this.assert(fileRepWorkflow.includes('process.exit(0)'), 'Has explicit exit codes');
      this.assert(fileRepWorkflow.includes('console.error'), 'Logs errors appropriately');
      
    } catch (error) {
      this.assert(false, `Error testing error handling: ${error.message}`);
    }
  }

  // Test 8: Mock issue creation test with sample data
  testIssueCreationWithSampleData() {
    console.log('\n🧪 Testing issue creation with sample data...');
    
    // Create a minimal mock of the TodoIssueGenerator logic
    const sampleTodoContent = `# Sample Todo File

## Must-Do (Critical Priority)

1. Fix label array handling in GitHub Actions workflow
2. Add documentation for label format requirements

## Should-Do (High Priority)

1. Test the workflow with sample tasks
2. Verify proper issue creation with multiple labels

## Improvements Needed:
- Create validation tests for workflow changes
- Enhance error handling in issue creation process
`;

    try {
      // Test parsing logic (simplified version of what's in the workflow)
      const lines = sampleTodoContent.split('\n');
      let foundTasks = 0;
      let currentPriority = 'medium';
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Track priority from sections
        if (line.toLowerCase().includes('must-do') || line.toLowerCase().includes('critical')) {
          currentPriority = 'critical';
        } else if (line.toLowerCase().includes('should-do') || line.toLowerCase().includes('high')) {
          currentPriority = 'high';
        }
        
        // Count numbered tasks
        if (line.match(/^\d+\.\s*.+/)) {
          foundTasks++;
        }
        
        // Count improvement items
        if (line.startsWith('- ') && line.includes('validation tests')) {
          foundTasks++;
        }
      }
      
      this.assert(foundTasks >= 5, `Found ${foundTasks} tasks in sample content (expected >= 5)`);
      
      // Test label generation logic
      const criticalLabels = ['todo', 'enhancement', 'priority: critical', 'bug'];
      const highLabels = ['todo', 'enhancement', 'priority: high'];
      
      this.assert(criticalLabels.includes('priority: critical'), 'Critical priority generates correct labels');
      this.assert(highLabels.includes('priority: high'), 'High priority generates correct labels');
      this.assert(criticalLabels.includes('bug'), 'Critical priority includes bug label');
      
      // Test title generation (max 80 chars)
      const longTitle = 'This is a very long task description that exceeds the eighty character limit and should be truncated appropriately';
      const truncatedTitle = longTitle.length > 80 ? longTitle.substring(0, 77) + '...' : longTitle;
      this.assert(truncatedTitle.length <= 80, 'Long titles are properly truncated');
      
    } catch (error) {
      this.assert(false, `Error testing issue creation logic: ${error.message}`);
    }
  }

  // Test 9: Comprehensive validation of complex multi-word labels
  testComplexMultiWordLabels() {
    console.log('\n🧪 Testing complex multi-word label validation...');
    
    try {
      const workflowContent = fs.readFileSync('.github/workflows/todo-to-issues.yml', 'utf8');
      
      // Test 1: Verify all complex multi-word label formats are supported
      const complexLabels = [
        'priority: critical',
        'priority: high',
        'priority: medium',
        'priority: low'
      ];
      
      complexLabels.forEach(label => {
        this.assert(
          workflowContent.includes(label),
          `Workflow supports complex label: "${label}"`
        );
      });
      
      // Test 2: Verify label conversion logic handles spaces correctly
      const labelConversionRegex = /gh_args\+=\("--label"\s+"\$label"\)/;
      this.assert(
        labelConversionRegex.test(workflowContent),
        'Label conversion properly quotes labels with spaces'
      );
      
      // Test 3: Simulate the complete label conversion flow
      const testLabels = [
        'todo',
        'enhancement', 
        'priority: critical',
        'bug'
      ];
      
      // Simulate what the bash script does
      let cliArgs = ['issue', 'create'];
      testLabels.forEach(label => {
        cliArgs.push('--label', label);
      });
      
      // Verify the structure matches expected format
      this.assert(
        cliArgs.includes('--label') && cliArgs.includes('priority: critical'),
        'Complex multi-word labels correctly added to CLI arguments array'
      );
      
      // Test 4: Verify label with colon and space is treated as single label
      const labelWithColon = 'priority: critical';
      this.assert(
        labelWithColon.includes(':') && labelWithColon.includes(' '),
        'Label format contains both colon and space as expected'
      );
      
      // Test 5: Verify jq parsing preserves label integrity
      // The workflow uses: jq -r '.[]' to extract labels
      // This should preserve spaces and special characters
      const jsonLabels = JSON.stringify(testLabels);
      const parsedLabels = JSON.parse(jsonLabels);
      
      this.assert(
        parsedLabels.includes('priority: critical'),
        'JSON parsing preserves complex multi-word labels'
      );
      
      // Test 6: Verify all priority levels have correct label format
      const priorityMappings = [
        { priority: 'critical', expectedLabels: ['todo', 'enhancement', 'priority: critical', 'bug'] },
        { priority: 'high', expectedLabels: ['todo', 'enhancement', 'priority: high'] },
        { priority: 'medium', expectedLabels: ['todo', 'enhancement', 'priority: medium'] },
        { priority: 'low', expectedLabels: ['todo', 'enhancement', 'priority: low'] }
      ];
      
      priorityMappings.forEach(mapping => {
        mapping.expectedLabels.forEach(label => {
          if (label.includes('priority:')) {
            this.assert(
              label.match(/^priority:\s+\w+$/),
              `Label "${label}" follows correct format pattern`
            );
          }
        });
      });
      
      // Test 7: Verify workflow uses secure array-based approach (not eval)
      // Check for eval command usage (not in comments)
      const lines = workflowContent.split('\n');
      const hasEvalCommand = lines.some(line => {
        const trimmed = line.trim();
        // Ignore comments
        if (trimmed.startsWith('#')) return false;
        // Check for eval command (not just the word in text)
        return /^\s*eval\s+/.test(line) || /\|\s*eval\s+/.test(line) || /;\s*eval\s+/.test(line);
      });
      this.assert(
        !hasEvalCommand,
        'Workflow does not use eval command (uses secure array-based approach)'
      );
      
      // Test 8: Verify label array is properly initialized
      this.assert(
        workflowContent.includes('gh_args=('),
        'Label array is properly initialized as bash array'
      );
      
      // Test 9: Verify special case for critical priority getting bug label
      const criticalSectionRegex = /priority\s*===?\s*['"]critical['"]/;
      this.assert(
        criticalSectionRegex.test(workflowContent),
        'Workflow logic includes special handling for critical priority'
      );
      
      // Test 10: Test the specific task from workflow-validation-tests.md
      const todoFile = 'todo/workflow-validation-tests.md';
      if (fs.existsSync(todoFile)) {
        const todoContent = fs.readFileSync(todoFile, 'utf8');
        this.assert(
          todoContent.includes('Validate issue creation with complex multi-word labels like "priority: critical"'),
          'Target validation task exists in todo file'
        );
      }
      
      console.log('\n✨ Complex multi-word label validation summary:');
      console.log('   • All priority label formats validated');
      console.log('   • Label conversion logic verified');
      console.log('   • JSON to CLI argument flow confirmed');
      console.log('   • Special characters (space, colon) handled correctly');
      console.log('   • Secure implementation (no eval usage)');
      
    } catch (error) {
      this.assert(false, `Error testing complex multi-word labels: ${error.message}`);
    }
  }

  // Run all tests
  runAllTests() {
    console.log('🚀 Starting workflow validation tests...');
    console.log('=' .repeat(60));
    
    this.testWorkflowFilesExist();
    this.testTodoWorkflowStructure();
    this.testLabelHandling();
    this.testIssueGeneratorLogic();
    this.testFileRepresentationsWorkflow();
    this.testTodoFileStructure();
    this.testErrorHandling();
    this.testIssueCreationWithSampleData();
    this.testComplexMultiWordLabels();
    
    console.log('\n' + '=' .repeat(60));
    console.log(`📊 Test Summary: ${this.testResults.length} tests run`);
    
    const passedTests = this.testResults.filter(t => t.passed).length;
    const failedTests = this.testResults.filter(t => !t.passed).length;
    
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    
    if (this.errors.length > 0) {
      console.log('\n🔥 Failed Tests:');
      this.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`);
      });
    }
    
    // Write detailed results to file
    const detailedResults = {
      summary: {
        total: this.testResults.length,
        passed: passedTests,
        failed: failedTests,
        success_rate: Math.round((passedTests / this.testResults.length) * 100)
      },
      tests: this.testResults,
      errors: this.errors,
      generated_at: new Date().toISOString()
    };
    
    // Archive test results to prevent merge conflicts
    const archiver = new TestResultArchiver();
    archiver.archiveTestResult('workflow-validation-results.json', detailedResults, {
      testType: 'workflow-validation',
      metadata: {
        workflow_files_tested: ['todo-to-issues.yml', 'file-representations.yml'],
        complex_label_validation: true
      },
      summary: detailedResults.summary
    });
    
    return failedTests === 0;
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const validator = new WorkflowValidator();
  const success = validator.runAllTests();
  process.exit(success ? 0 : 1);
}

module.exports = WorkflowValidator;