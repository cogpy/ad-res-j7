/**
 * JSON File Validation Test
 * 
 * This test ensures all JSON files in the repository are properly formatted
 * and parseable, as required by the task:
 * "Ensure all JSON files are properly formatted and parseable"
 * 
 * Source: todo/Repository_Status_and_Critical_Evidence_Collection.md, line 137
 * Priority: critical
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

class JSONValidationTest {
    constructor() {
        this.results = {
            passed: 0,
            failed: 0,
            errors: []
        };
    }

    async runPythonValidator() {
        return new Promise((resolve, reject) => {
            const pythonScript = path.join(__dirname, '..', 'scripts', 'validate_json_files.py');
            const python = spawn('python3', [pythonScript], {
                cwd: path.join(__dirname, '..'),
                stdio: ['inherit', 'pipe', 'pipe']
            });

            let stdout = '';
            let stderr = '';

            python.stdout.on('data', (data) => {
                stdout += data.toString();
            });

            python.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            python.on('close', (code) => {
                resolve({
                    code,
                    stdout,
                    stderr
                });
            });

            python.on('error', (err) => {
                reject(err);
            });
        });
    }

    async validateAllJSONFiles() {
        console.log('🧪 Running JSON File Validation Test...\n');
        
        try {
            // Run the Python validation script
            const result = await this.runPythonValidator();
            
            if (result.code === 0) {
                console.log('✅ Python JSON validator completed successfully');
                this.results.passed++;
                
                // Check if report was generated
                const reportPath = path.join(__dirname, '..', 'json_validation_report.json');
                if (fs.existsSync(reportPath)) {
                    console.log('✅ Validation report generated successfully');
                    this.results.passed++;
                    
                    // Parse and verify the report
                    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
                    
                    console.log(`📊 Validation Summary:`);
                    console.log(`   Total files: ${report.total_files}`);
                    console.log(`   Valid files: ${report.valid_files}`);
                    console.log(`   Invalid files: ${report.invalid_files}`);
                    
                    if (report.invalid_files === 0) {
                        console.log('✅ All JSON files are valid');
                        this.results.passed++;
                    } else {
                        console.log(`❌ Found ${report.invalid_files} invalid JSON files`);
                        report.errors.forEach(error => {
                            console.log(`   • ${error.file}: ${error.error}`);
                        });
                        this.results.failed++;
                        this.results.errors.push(`${report.invalid_files} JSON files are invalid`);
                    }
                    
                    // Check for warnings
                    const totalWarnings = report.file_details.reduce((sum, file) => sum + file.warnings.length, 0);
                    if (totalWarnings > 0) {
                        console.log(`⚠️  Found ${totalWarnings} warnings (quality issues)`);
                    }
                    
                } else {
                    console.log('❌ Validation report not generated');
                    this.results.failed++;
                    this.results.errors.push('Validation report not generated');
                }
                
            } else {
                console.log(`❌ Python JSON validator failed with exit code ${result.code}`);
                console.log('STDERR:', result.stderr);
                this.results.failed++;
                this.results.errors.push(`Python validator failed with exit code ${result.code}`);
            }
            
        } catch (error) {
            console.log(`❌ Error running JSON validation: ${error.message}`);
            this.results.failed++;
            this.results.errors.push(`Error running validation: ${error.message}`);
        }
    }

    async testIndividualJSONFiles() {
        console.log('\n🔍 Testing individual JSON file parsing...');
        
        const testFiles = [
            'package.json',
            'README.json',
            'EVIDENCE_MAPPING.json',
            'HYPERGRAPH_CASE_STRUCTURE.json',
            'WORKFLOW_DOCUMENTATION.json'
        ];
        
        let validFiles = 0;
        
        for (const file of testFiles) {
            const filePath = path.join(__dirname, '..', file);
            try {
                if (fs.existsSync(filePath)) {
                    const content = fs.readFileSync(filePath, 'utf8');
                    JSON.parse(content);
                    console.log(`✅ ${file} - Valid JSON`);
                    validFiles++;
                } else {
                    console.log(`⚠️  ${file} - File not found (skipping)`);
                }
            } catch (error) {
                console.log(`❌ ${file} - Invalid JSON: ${error.message}`);
                this.results.failed++;
                this.results.errors.push(`${file}: Invalid JSON - ${error.message}`);
            }
        }
        
        if (validFiles > 0) {
            console.log(`✅ Spot check: ${validFiles} JSON files parsed successfully`);
            this.results.passed++;
        }
    }

    async runTests() {
        console.log('🧪 JSON File Validation Test Suite\n');
        console.log('Purpose: Ensure all JSON files are properly formatted and parseable');
        console.log('Source: todo/Repository_Status_and_Critical_Evidence_Collection.md, line 137\n');
        
        // Test 1: Run comprehensive validation
        await this.validateAllJSONFiles();
        
        // Test 2: Individual file spot checks
        await this.testIndividualJSONFiles();
        
        // Results
        console.log('\n🎯 === JSON VALIDATION TEST RESULTS ===');
        console.log(`✅ Passed: ${this.results.passed} checks`);
        console.log(`❌ Failed: ${this.results.failed} checks`);
        
        if (this.results.errors.length > 0) {
            console.log('\n🚨 Errors found:');
            this.results.errors.forEach(error => {
                console.log(`  • ${error}`);
            });
        } else {
            console.log('\n🎉 All JSON validation tests passed!');
        }
        
        // Write test results
        const testResults = {
            timestamp: new Date().toISOString(),
            test_suite: 'json-validation',
            summary: {
                total_checks: this.results.passed + this.results.failed,
                passed: this.results.passed,
                failed: this.results.failed,
                success_rate: this.results.passed + this.results.failed > 0 
                    ? Math.round((this.results.passed / (this.results.passed + this.results.failed)) * 100)
                    : 0
            },
            errors: this.results.errors,
            purpose: 'Ensure all JSON files are properly formatted and parseable',
            source: 'todo/Repository_Status_and_Critical_Evidence_Collection.md:137'
        };
        
        fs.writeFileSync(
            path.join(__dirname, 'json-validation-test-results.json'), 
            JSON.stringify(testResults, null, 2)
        );
        console.log('\n📄 Test results saved to tests/json-validation-test-results.json');
        
        return this.results.failed === 0;
    }
}

// Run the test if this file is executed directly
if (require.main === module) {
    const test = new JSONValidationTest();
    test.runTests().then(success => {
        process.exit(success ? 0 : 1);
    }).catch(error => {
        console.error('Test execution failed:', error);
        process.exit(1);
    });
}

module.exports = JSONValidationTest;