/**
 * Date Validation Test
 * Tests the date validation script for forensic analyses
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('='.repeat(80));
console.log('DATE VALIDATION TEST');
console.log('='.repeat(80));
console.log();

// Test configuration
const tests = {
    passed: 0,
    failed: 0,
    total: 0
};

function runTest(name, testFn) {
    tests.total++;
    try {
        console.log(`Running: ${name}`);
        testFn();
        tests.passed++;
        console.log(`✓ PASS: ${name}\n`);
        return true;
    } catch (error) {
        tests.failed++;
        console.log(`✗ FAIL: ${name}`);
        console.log(`  Error: ${error.message}\n`);
        return false;
    }
}

// Test 1: Validation script exists
runTest('Validation script exists', () => {
    const scriptPath = path.join(__dirname, '..', 'scripts', 'validate_analysis_dates.py');
    if (!fs.existsSync(scriptPath)) {
        throw new Error(`Script not found at ${scriptPath}`);
    }
});

// Test 2: Validation script is executable
runTest('Validation script is executable', () => {
    const scriptPath = path.join(__dirname, '..', 'scripts', 'validate_analysis_dates.py');
    const stats = fs.statSync(scriptPath);
    // Check if any execute bit is set
    if ((stats.mode & 0o111) === 0) {
        throw new Error('Script is not executable');
    }
});

// Test 3: Validation script runs successfully
runTest('Validation script runs without errors', () => {
    try {
        const output = execSync('python3 scripts/validate_analysis_dates.py', {
            cwd: path.join(__dirname, '..'),
            encoding: 'utf-8',
            timeout: 30000
        });
        
        if (!output.includes('DATE VALIDATION REPORT')) {
            throw new Error('Output does not contain expected report header');
        }
    } catch (error) {
        if (error.status !== 0) {
            throw new Error(`Script exited with code ${error.status}: ${error.stderr || error.message}`);
        }
        throw error;
    }
});

// Test 4: Validation report is generated
runTest('Validation report is generated', () => {
    const reportPath = path.join(__dirname, '..', 'date_validation_report.json');
    if (!fs.existsSync(reportPath)) {
        throw new Error(`Report not found at ${reportPath}`);
    }
});

// Test 5: Validation report has correct structure
runTest('Validation report has correct structure', () => {
    const reportPath = path.join(__dirname, '..', 'date_validation_report.json');
    const reportContent = fs.readFileSync(reportPath, 'utf-8');
    const report = JSON.parse(reportContent);
    
    if (!report.summary) {
        throw new Error('Report missing summary section');
    }
    if (!('errors' in report.summary)) {
        throw new Error('Report summary missing errors count');
    }
    if (!('warnings' in report.summary)) {
        throw new Error('Report summary missing warnings count');
    }
    if (!('status' in report.summary)) {
        throw new Error('Report summary missing status');
    }
    if (!Array.isArray(report.errors)) {
        throw new Error('Report errors is not an array');
    }
    if (!Array.isArray(report.warnings)) {
        throw new Error('Report warnings is not an array');
    }
});

// Test 6: Validation passes (no errors)
runTest('Validation passes with no errors', () => {
    const reportPath = path.join(__dirname, '..', 'date_validation_report.json');
    const reportContent = fs.readFileSync(reportPath, 'utf-8');
    const report = JSON.parse(reportContent);
    
    if (report.summary.status !== 'PASS') {
        throw new Error(`Validation status is ${report.summary.status}, expected PASS`);
    }
    if (report.summary.errors > 0) {
        throw new Error(`Found ${report.summary.errors} validation errors`);
    }
});

// Test 7: All analysis directories are checked
runTest('All analysis directories are validated', () => {
    const output = execSync('python3 scripts/validate_analysis_dates.py', {
        cwd: path.join(__dirname, '..'),
        encoding: 'utf-8'
    });
    
    const requiredAnalyses = [
        'Revenue Theft Analysis',
        'Family Trust Analysis',
        'Financial Flows Analysis'
    ];
    
    for (const analysis of requiredAnalyses) {
        if (!output.includes(analysis)) {
            throw new Error(`Output does not include ${analysis} validation`);
        }
    }
});

// Test 8: Summary document exists
runTest('Date validation summary document exists', () => {
    const summaryPath = path.join(__dirname, '..', 'DATE_VALIDATION_SUMMARY.md');
    if (!fs.existsSync(summaryPath)) {
        throw new Error(`Summary document not found at ${summaryPath}`);
    }
});

// Test 9: Package.json has validation command
runTest('Package.json includes date validation command', () => {
    const packagePath = path.join(__dirname, '..', 'package.json');
    const packageContent = fs.readFileSync(packagePath, 'utf-8');
    const packageJson = JSON.parse(packageContent);
    
    if (!packageJson.scripts['validate-dates']) {
        throw new Error('Package.json missing validate-dates script');
    }
});

// Test 10: Analysis directories exist
runTest('All analysis directories exist', () => {
    const basePath = path.join(__dirname, '..', 'jax-response');
    const requiredDirs = ['revenue-theft', 'family-trust', 'financial-flows'];
    
    for (const dir of requiredDirs) {
        const dirPath = path.join(basePath, dir);
        if (!fs.existsSync(dirPath)) {
            throw new Error(`Analysis directory not found: ${dirPath}`);
        }
    }
});

// Print summary
console.log('='.repeat(80));
console.log('TEST SUMMARY');
console.log('='.repeat(80));
console.log(`Total Tests:  ${tests.total}`);
console.log(`Passed:       ${tests.passed}`);
console.log(`Failed:       ${tests.failed}`);
console.log(`Success Rate: ${((tests.passed / tests.total) * 100).toFixed(1)}%`);
console.log();

if (tests.failed === 0) {
    console.log('✓ ALL TESTS PASSED');
    process.exit(0);
} else {
    console.log('✗ SOME TESTS FAILED');
    process.exit(1);
}
