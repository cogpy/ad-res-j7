/**
 * Date Validation Test
 * Tests for date format consistency in forensic analyses
 * 
 * Ensures all dates follow YYYY-MM-DD format as required by
 * todo/Repository_Status_and_Critical_Evidence_Collection.md
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

class DateValidationTest {
  constructor() {
    this.testResults = [];
    this.errors = [];
    this.repoRoot = process.cwd();
    
    // Date pattern validation
    this.validDatePattern = /\d{4}-\d{2}-\d{2}/;
    
    // Problematic date patterns that should not exist
    this.problematicPatterns = [
      /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}\b/gi,
      /\b\d{1,2}\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\b/gi,
      /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},?\s+\d{4}\b/gi,
      /\b\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\b/gi,
      /\b\d{1,2}\/\d{1,2}\/\d{4}\b/g,
      /\b\d{1,2}-\d{1,2}-\d{4}\b/g
    ];
    
    // Directories to validate
    this.analysisDirectories = [
      'jax-response/revenue-theft',
      'jax-response/family-trust',
      'jax-response/financial-flows'
    ];
  }
  
  assert(condition, message) {
    const result = {
      passed: condition,
      message: message,
      timestamp: new Date().toISOString()
    };
    
    this.testResults.push(result);
    
    if (condition) {
      console.log(`✅ ${message}`);
    } else {
      console.log(`❌ ${message}`);
      this.errors.push(message);
    }
  }
  
  findDateViolationsInFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      const violations = [];
      
      lines.forEach((line, index) => {
        this.problematicPatterns.forEach((pattern, patternIndex) => {
          const matches = line.match(pattern);
          if (matches) {
            violations.push({
              file: path.relative(this.repoRoot, filePath),
              line: index + 1,
              content: line.trim(),
              matches: matches,
              pattern: patternIndex
            });
          }
        });
      });
      
      return violations;
    } catch (error) {
      this.errors.push(`Error reading ${filePath}: ${error.message}`);
      return [];
    }
  }
  
  testAnalysisDirectoryDateFormats() {
    console.log('\n🧪 Testing date formats in forensic analysis directories...');
    
    let totalViolations = 0;
    let filesChecked = 0;
    
    this.analysisDirectories.forEach(dir => {
      const dirPath = path.join(this.repoRoot, dir);
      
      if (!fs.existsSync(dirPath)) {
        console.log(`⚠️  Directory not found: ${dir}`);
        return;
      }
      
      console.log(`\n📁 Checking ${dir}...`);
      
      // Find all markdown and JSON files
      const filePatterns = [
        path.join(dirPath, '**/*.md'),
        path.join(dirPath, '**/*.json')
      ];
      
      filePatterns.forEach(pattern => {
        const files = glob.sync(pattern);
        
        files.forEach(filePath => {
          filesChecked++;
          const violations = this.findDateViolationsInFile(filePath);
          
          if (violations.length > 0) {
            totalViolations += violations.length;
            console.log(`   ❌ ${path.basename(filePath)}: ${violations.length} violations`);
            
            violations.forEach(v => {
              console.log(`      Line ${v.line}: ${v.matches.join(', ')}`);
            });
          } else {
            console.log(`   ✅ ${path.basename(filePath)}: no violations`);
          }
        });
      });
    });
    
    this.assert(
      totalViolations === 0,
      `All dates follow YYYY-MM-DD format (checked ${filesChecked} files, found ${totalViolations} violations)`
    );
    
    return totalViolations === 0;
  }
  
  testDateFormatRequirement() {
    console.log('\n🧪 Testing date format requirement documentation...');
    
    // Check that the todo file specifies YYYY-MM-DD format
    const todoFile = path.join(this.repoRoot, 'todo', 'Repository_Status_and_Critical_Evidence_Collection.md');
    
    if (fs.existsSync(todoFile)) {
      const content = fs.readFileSync(todoFile, 'utf8');
      
      this.assert(
        content.includes('YYYY-MM-DD'),
        'Todo file specifies YYYY-MM-DD date format requirement'
      );
      
      this.assert(
        content.includes('Validate all dates in revenue-theft, family-trust, and financial-flows analyses'),
        'Todo file includes the specific validation task'
      );
    } else {
      this.errors.push('Todo file not found');
    }
  }
  
  testValidationScriptExists() {
    console.log('\n🧪 Testing validation script existence...');
    
    const validationScript = path.join(this.repoRoot, 'scripts', 'validate_dates.py');
    const fixScript = path.join(this.repoRoot, 'scripts', 'fix_dates.py');
    
    this.assert(
      fs.existsSync(validationScript),
      'Date validation script exists'
    );
    
    this.assert(
      fs.existsSync(fixScript),
      'Date fix script exists'
    );
  }
  
  runAllTests() {
    console.log('🚀 Starting date validation tests...');
    console.log('=' .repeat(60));
    
    this.testDateFormatRequirement();
    this.testValidationScriptExists();
    this.testAnalysisDirectoryDateFormats();
    
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
      return false;
    }
    
    console.log('\n✅ All date validation tests passed!');
    return true;
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const validator = new DateValidationTest();
  const success = validator.runAllTests();
  process.exit(success ? 0 : 1);
}

module.exports = DateValidationTest;