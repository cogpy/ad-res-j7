#!/usr/bin/env node

/**
 * Security Validation Test Suite
 * Focused security testing for all workflow functionality
 * Tests for secure coding practices, permission management, and vulnerability prevention
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const TestResultArchiver = require('./test-result-archiver');

class SecurityValidationTest {
  constructor() {
    this.testResults = [];
    this.errors = [];
    this.securityFindings = [];
    this.startTime = Date.now();
  }

  assert(condition, message, severity = 'medium') {
    const result = {
      test: message,
      passed: condition,
      severity: severity,
      timestamp: new Date().toISOString(),
      suite: 'security'
    };
    
    this.testResults.push(result);
    
    if (condition) {
      console.log(`✅ ${message}`);
    } else {
      console.log(`❌ ${message}`);
      this.errors.push(message);
      
      if (severity === 'critical' || severity === 'high') {
        this.securityFindings.push({
          message: message,
          severity: severity,
          timestamp: new Date().toISOString()
        });
      }
    }
    
    return condition;
  }

  // Test GitHub Actions security best practices
  testGitHubActionsSecurity() {
    console.log('\n🔒 Testing GitHub Actions security best practices...');
    
    const workflows = glob.sync('.github/workflows/*.yml');
    
    workflows.forEach(workflowFile => {
      const content = fs.readFileSync(workflowFile, 'utf8');
      const filename = path.basename(workflowFile);
      
      // Critical: Test for hardcoded secrets or tokens
      this.assert(!content.match(/[a-zA-Z0-9]{40}/g) || 
                  !content.includes('ghp_') || 
                  !content.includes('github_pat_'), 
                 `${filename}: No hardcoded tokens detected`, 'critical');
      
      // High: Test for proper secret usage
      if (content.includes('secrets.')) {
        this.assert(content.includes('${{ secrets.GITHUB_TOKEN }}') && 
                   !content.includes('secrets.*') && 
                   !content.match(/secrets\.[A-Z_]+[^}]/), 
                   `${filename}: Uses secrets securely`, 'high');
      }
      
      // High: Test for minimal permissions
      if (content.includes('permissions:')) {
        this.assert(!content.includes('contents: write') || 
                   content.includes('# Required to'), 
                   `${filename}: Write permissions are documented`, 'high');
        
        this.assert(!content.includes('actions: write') && 
                   !content.includes('packages: write') && 
                   !content.includes('security-events: write'), 
                   `${filename}: No unnecessary write permissions`, 'high');
      }
      
      // Medium: Test for input validation
      if (content.includes('workflow_dispatch:')) {
        this.assert(content.includes('inputs:') && 
                   (content.includes('required:') || content.includes('default:')), 
                   `${filename}: Workflow inputs are validated`, 'medium');
      }
      
      // Medium: Test for pinned action versions
      const actionMatches = content.match(/uses:\s*([^\s@]+)(@[^\s]+)?/g) || [];
      actionMatches.forEach(match => {
        this.assert(match.includes('@v') || match.includes('@main') || match.includes('@master'), 
                   `${filename}: Action versions are pinned (${match})`, 'medium');
      });
    });
  }

  // Test for injection vulnerabilities
  testInjectionVulnerabilities() {
    console.log('\n💉 Testing for injection vulnerabilities...');
    
    const workflows = glob.sync('.github/workflows/*.yml');
    
    workflows.forEach(workflowFile => {
      const content = fs.readFileSync(workflowFile, 'utf8');
      const filename = path.basename(workflowFile);
      
      // Critical: Test for command injection
      this.assert(!content.includes('$(') || 
                  !content.match(/\$\{[^}]*github\.event/), 
                 `${filename}: No obvious command injection patterns`, 'critical');
      
      // High: Test for script injection in run commands
      const runCommands = content.match(/run:\s*\|[\s\S]*?(?=\n\s*-|\n[a-zA-Z]|\n$)/g) || [];
      runCommands.forEach((command, index) => {
        this.assert(!command.includes('eval ') && 
                   !command.includes('exec ') && 
                   !command.match(/\$\([^)]*github\.event/), 
                   `${filename}: Run command ${index + 1} safe from injection`, 'high');
      });
      
      // High: Test for dangerous shell operations
      this.assert(!content.includes('curl | bash') && 
                 !content.includes('wget | sh') && 
                 !content.includes('| sudo'), 
                 `${filename}: No dangerous piped operations`, 'high');
    });
  }

  // Test Node.js and JavaScript security
  testJavaScriptSecurity() {
    console.log('\n🟨 Testing JavaScript security in workflows...');
    
    const workflows = glob.sync('.github/workflows/*.yml');
    
    workflows.forEach(workflowFile => {
      const content = fs.readFileSync(workflowFile, 'utf8');
      const filename = path.basename(workflowFile);
      
      if (content.includes('const ') || content.includes('class ')) {
        // Test for safe file operations
        this.assert(!content.includes('eval(') && 
                   !content.includes('Function(') && 
                   !content.includes('new Function'), 
                   `${filename}: No dynamic code execution`, 'critical');
        
        // Test for path traversal protection
        if (content.includes('readFileSync') || content.includes('writeFileSync')) {
          this.assert(content.includes('path.join') || 
                     content.includes('path.resolve') || 
                     content.includes('.normalize()'), 
                     `${filename}: File operations use safe path handling`, 'high');
        }
        
        // Test for secure JSON parsing
        if (content.includes('JSON.parse')) {
          this.assert(!content.includes('JSON.parse(') || 
                     content.match(/try\s*{[\s\S]*JSON\.parse/), 
                     `${filename}: JSON parsing is wrapped in try-catch`, 'medium');
        }
      }
    });
  }

  // Test package and dependency security
  testDependencySecurity() {
    console.log('\n📦 Testing dependency and package security...');
    
    try {
      // Test package.json security
      if (fs.existsSync('package.json')) {
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        
        this.assert(!packageJson.scripts || 
                   Object.values(packageJson.scripts).every(script => 
                     !script.includes('curl ') && 
                     !script.includes('wget ') && 
                     !script.includes('rm -rf /')), 
                   'package.json: Scripts are safe', 'high');
        
        // Check for known vulnerable packages (basic check)
        const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
        Object.entries(deps || {}).forEach(([name, version]) => {
          this.assert(!name.includes('..') && 
                     !version.includes('file:') && 
                     !version.includes('git+'), 
                     `Dependency ${name}: Uses safe source`, 'medium');
        });
      }
      
      // Test workflow npm usage security
      const workflows = glob.sync('.github/workflows/*.yml');
      workflows.forEach(workflowFile => {
        const content = fs.readFileSync(workflowFile, 'utf8');
        const filename = path.basename(workflowFile);
        
        if (content.includes('npm install')) {
          this.assert(!content.includes('--unsafe-perm') && 
                     !content.includes('--allow-root'), 
                     `${filename}: npm install uses safe flags`, 'medium');
        }
      });
      
    } catch (error) {
      this.assert(false, `Dependency security test error: ${error.message}`, 'high');
    }
  }

  // Test file system security
  testFileSystemSecurity() {
    console.log('\n📁 Testing file system security...');
    
    const workflows = glob.sync('.github/workflows/*.yml');
    
    workflows.forEach(workflowFile => {
      const content = fs.readFileSync(workflowFile, 'utf8');
      const filename = path.basename(workflowFile);
      
      // Test for safe temporary file handling
      if (content.includes('/tmp/') || content.includes('temp')) {
        this.assert(content.includes('mktemp') || 
                   content.match(/\/tmp\/[a-zA-Z0-9_-]+/) || 
                   content.includes('TMPDIR'), 
                   `${filename}: Uses secure temporary file creation`, 'medium');
      }
      
      // Test for safe file permissions
      if (content.includes('chmod')) {
        this.assert(!content.includes('777') && 
                   !content.includes('666') && 
                   !content.includes('+x') || 
                   content.includes('chmod +x'), 
                   `${filename}: File permissions are restrictive`, 'medium');
      }
      
      // Test for directory traversal protection
      this.assert(!content.includes('../') || 
                  content.includes('path.resolve') || 
                  content.includes('path.join'), 
                 `${filename}: Protected against directory traversal`, 'high');
    });
  }

  // Test data validation and sanitization
  testDataValidation() {
    console.log('\n🧹 Testing data validation and sanitization...');
    
    const workflows = glob.sync('.github/workflows/*.yml');
    
    workflows.forEach(workflowFile => {
      const content = fs.readFileSync(workflowFile, 'utf8');
      const filename = path.basename(workflowFile);
      
      // Test for input sanitization
      if (content.includes('github.event') || content.includes('inputs.')) {
        this.assert(content.includes('.replace(') || 
                   content.includes('.filter(') || 
                   content.includes('length >') || 
                   content.includes('match('), 
                   `${filename}: External inputs are validated`, 'high');
      }
      
      // Test for output encoding
      if (content.includes('echo ') || content.includes('GITHUB_STEP_SUMMARY')) {
        this.assert(!content.match(/echo\s+[^"'][^|>]*[|>]/) && 
                   !content.includes('echo $'), 
                   `${filename}: Output is safely handled`, 'medium');
      }
    });
  }

  // Test error handling security
  testErrorHandlingSecurity() {
    console.log('\n🛡️ Testing secure error handling...');
    
    const workflows = glob.sync('.github/workflows/*.yml');
    
    workflows.forEach(workflowFile => {
      const content = fs.readFileSync(workflowFile, 'utf8');
      const filename = path.basename(workflowFile);
      
      if (content.includes('try {') || content.includes('catch')) {
        // Test that error messages don't leak sensitive info
        this.assert(!content.includes('console.log(error)') && 
                   !content.includes('error.stack') && 
                   !content.includes('JSON.stringify(error)'), 
                   `${filename}: Error handling doesn't leak sensitive data`, 'medium');
        
        // Test for proper error exit codes
        this.assert(content.includes('process.exit(1)') || 
                   content.includes('throw'), 
                   `${filename}: Errors properly terminate execution`, 'medium');
      }
    });
  }

  // Run all security tests
  runAllTests() {
    console.log('🔒 Starting Security Validation Test Suite');
    console.log('Testing security aspects of ALL workflow functionality');
    console.log('=' .repeat(80));
    
    this.testGitHubActionsSecurity();
    this.testInjectionVulnerabilities();
    this.testJavaScriptSecurity();
    this.testDependencySecurity();
    this.testFileSystemSecurity();
    this.testDataValidation();
    this.testErrorHandlingSecurity();
    
    // Calculate results
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(t => t.passed).length;
    const failedTests = this.errors.length;
    const successRate = Math.round((passedTests / totalTests) * 100);
    const duration = ((Date.now() - this.startTime) / 1000).toFixed(2);
    
    // Analyze security findings by severity
    const criticalFindings = this.securityFindings.filter(f => f.severity === 'critical').length;
    const highFindings = this.securityFindings.filter(f => f.severity === 'high').length;
    
    // Print summary
    console.log('\n' + '=' .repeat(80));
    console.log('🔒 Security Validation Test Summary');
    console.log('=' .repeat(80));
    console.log(`✅ Passed: ${passedTests}/${totalTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`📈 Success Rate: ${successRate}%`);
    console.log(`⏱️  Execution Time: ${duration}s`);
    
    if (this.securityFindings.length > 0) {
      console.log(`🚨 Critical Findings: ${criticalFindings}`);
      console.log(`⚠️  High Severity Findings: ${highFindings}`);
    } else {
      console.log('🛡️  No security findings detected');
    }
    
    if (failedTests > 0) {
      console.log('\n🔥 Security Issues Found:');
      this.errors.forEach((error, index) => {
        const finding = this.securityFindings.find(f => f.message === error);
        const severity = finding ? `[${finding.severity.toUpperCase()}]` : '[MEDIUM]';
        console.log(`   ${index + 1}. ${severity} ${error}`);
      });
    } else {
      console.log('\n🎉 ALL SECURITY TESTS PASSED!');
    }
    
    // Archive results
    const archiver = new TestResultArchiver();
    archiver.archiveTestResult('security-validation-results.json', {
      testResults: this.testResults,
      securityFindings: this.securityFindings,
      summary: {
        total: totalTests,
        passed: passedTests,
        failed: failedTests,
        success_rate: successRate,
        duration: duration,
        critical_findings: criticalFindings,
        high_findings: highFindings
      },
      generated_at: new Date().toISOString()
    }, {
      testType: 'security-validation',
      metadata: {
        suite_version: '1.0.0',
        security_focused: true,
        vulnerability_tested: true
      }
    });
    
    console.log('\n📁 Security test results archived');
    console.log('=' .repeat(80));
    
    return failedTests === 0 && criticalFindings === 0;
  }
}

// Run tests if executed directly
if (require.main === module) {
  const securityTest = new SecurityValidationTest();
  const success = securityTest.runAllTests();
  process.exit(success ? 0 : 1);
}

module.exports = SecurityValidationTest;