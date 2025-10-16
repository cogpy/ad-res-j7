// File Path Validation Test
// Integration test for the file path validation script

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

class FilePathValidationTest {
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

  // Test 1: Verify the validation script exists and is executable
  testScriptExists() {
    console.log('\n🧪 Testing file path validation script existence...');
    
    const scriptPath = 'scripts/validate_file_paths.py';
    this.assert(fs.existsSync(scriptPath), 'File path validation script exists');
    
    try {
      const stats = fs.statSync(scriptPath);
      this.assert(stats.mode & 0o111, 'Validation script is executable');
    } catch (error) {
      this.assert(false, `Error checking script permissions: ${error.message}`);
    }
  }

  // Test 2: Run the validation script and check its output
  async testValidationExecution() {
    console.log('\n🧪 Testing validation script execution...');
    
    return new Promise((resolve) => {
      const scriptProcess = spawn('python3', ['scripts/validate_file_paths.py', '--verbose'], {
        cwd: process.cwd(),
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let stdout = '';
      let stderr = '';

      scriptProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      scriptProcess.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      scriptProcess.on('close', (code) => {
        // The script should complete regardless of findings
        this.assert(code === 0 || code === 1, `Validation script completed with expected exit code (got ${code})`);
        this.assert(stdout.includes('File Path and Reference Validation'), 'Script produces expected output header');
        this.assert(stdout.includes('Validation Results'), 'Script produces validation results');
        this.assert(stdout.includes('Files Processed'), 'Script reports processed files');
        
        // Check for specific validation patterns
        this.assert(stdout.includes('markdown files') || stdout.includes('Markdown files'), 'Script processes markdown files');
        this.assert(stdout.includes('JSON files') || stdout.includes('json files'), 'Script processes JSON files');
        
        if (stderr && stderr.trim()) {
          console.log(`⚠️ Script stderr: ${stderr.trim()}`);
        }
        
        resolve();
      });

      scriptProcess.on('error', (error) => {
        this.assert(false, `Error running validation script: ${error.message}`);
        resolve();
      });
    });
  }

  // Test 3: Test with sample broken links
  async testBrokenLinkDetection() {
    console.log('\n🧪 Testing broken link detection...');
    
    // Create a temporary test file with broken links
    const testFile = path.join(process.cwd(), 'test-broken-links.md');
    const testContent = `# Test Document

This document contains broken links for testing:

- [Broken relative link](nonexistent-file.md)
- [Broken JSON reference](missing-data.json)
- [Valid internal link](README.md)
- [External link should be ignored](https://example.com)
- [Anchor link should be ignored](#section)

Some JSON might reference: {"file": "another-missing-file.txt"}
`;

    try {
      fs.writeFileSync(testFile, testContent);
      
      return new Promise((resolve) => {
        const scriptProcess = spawn('python3', ['scripts/validate_file_paths.py'], {
          cwd: process.cwd(),
          stdio: ['pipe', 'pipe', 'pipe']
        });

        let stdout = '';

        scriptProcess.stdout.on('data', (data) => {
          stdout += data.toString();
        });

        scriptProcess.on('close', (code) => {
          // Clean up test file
          try {
            fs.unlinkSync(testFile);
          } catch (e) {
            console.log(`⚠️ Could not clean up test file: ${e.message}`);
          }
          
          // Should detect broken links
          this.assert(stdout.includes('nonexistent-file.md') || code === 1, 'Detects broken relative links');
          this.assert(!stdout.includes('https://example.com'), 'Ignores external links');
          this.assert(!stdout.includes('#section'), 'Ignores anchor links');
          
          resolve();
        });

        scriptProcess.on('error', (error) => {
          // Clean up test file
          try {
            fs.unlinkSync(testFile);
          } catch (e) {}
          
          this.assert(false, `Error in broken link test: ${error.message}`);
          resolve();
        });
      });
    } catch (error) {
      this.assert(false, `Error creating test file: ${error.message}`);
    }
  }

  // Test report generation with smaller scope
  async testReportGeneration() {
    console.log('\n🧪 Testing validation report generation...');
    
    const reportFile = path.join(process.cwd(), 'validation-report-test.json');
    
    return new Promise((resolve) => {
      // Use a timeout to prevent hanging
      const timeout = setTimeout(() => {
        this.assert(false, 'Report generation timed out');
        resolve();
      }, 30000); // 30 second timeout
      
      const scriptProcess = spawn('python3', ['scripts/validate_file_paths.py', '--report', reportFile], {
        cwd: process.cwd(),
        stdio: ['pipe', 'pipe', 'pipe']
      });

      scriptProcess.on('close', (code) => {
        clearTimeout(timeout);
        
        try {
          this.assert(fs.existsSync(reportFile), 'Validation report file is created');
          
          if (fs.existsSync(reportFile)) {
            const reportContent = fs.readFileSync(reportFile, 'utf8');
            const report = JSON.parse(reportContent);
            
            this.assert(report.validation_type === 'file_path_validation', 'Report has correct validation type');
            this.assert(typeof report.summary === 'object', 'Report contains summary object');
            this.assert(typeof report.summary.files_checked === 'number', 'Report tracks files checked');
            this.assert(Array.isArray(report.errors), 'Report contains errors array');
            this.assert(Array.isArray(report.warnings), 'Report contains warnings array');
            this.assert(typeof report.timestamp === 'string', 'Report has timestamp');
            
            // Clean up
            fs.unlinkSync(reportFile);
          }
        } catch (error) {
          this.assert(false, `Error validating report: ${error.message}`);
          // Try to clean up
          try {
            if (fs.existsSync(reportFile)) {
              fs.unlinkSync(reportFile);
            }
          } catch (e) {}
        }
        
        resolve();
      });

      scriptProcess.on('error', (error) => {
        clearTimeout(timeout);
        this.assert(false, `Error generating report: ${error.message}`);
        resolve();
      });
    });
  }

  // Test 5: Integration with existing validation framework
  testIntegrationWithExistingFramework() {
    console.log('\n🧪 Testing integration with existing validation framework...');
    
    // Check if script can be called from npm
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    // Verify the script integrates well with existing structure
    this.assert(fs.existsSync('scripts/validate_cross_references.py'), 'Existing cross-reference validation exists');
    this.assert(fs.existsSync('tests/'), 'Test directory exists');
    this.assert(packageJson.scripts && packageJson.scripts.test, 'npm test script exists');
    
    // The new script should complement, not replace, existing validation
    this.assert(fs.existsSync('scripts/validate_file_paths.py'), 'New file path validation script exists');
  }

  // Run all tests
  async runAllTests() {
    console.log('🚀 Starting file path validation tests...');
    console.log('=' .repeat(60));
    
    this.testScriptExists();
    await this.testValidationExecution();
    await this.testBrokenLinkDetection();
    await this.testReportGeneration();
    this.testIntegrationWithExistingFramework();
    
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
    
    return failedTests === 0;
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  (async () => {
    const test = new FilePathValidationTest();
    const success = await test.runAllTests();
    process.exit(success ? 0 : 1);
  })();
}

module.exports = FilePathValidationTest;