/**
 * Burden of Proof Strategy Framework Tests
 * 
 * Purpose: Validate the burden of proof strategy framework implementation
 * Context: Secondary task in phase 2 structure (line 64, workflow-validation-tests.md)
 * 
 * Tests three legal standards:
 * 1. Civil standard (balance of probabilities ≥51%)
 * 2. Criminal standard (beyond reasonable doubt ≥85%)
 * 3. Mathematical standard (invariant conditions 100%)
 */

const fs = require('fs');
const path = require('path');

class BurdenOfProofTests {
    constructor() {
        this.testResults = {
            total: 0,
            passed: 0,
            failed: 0,
            errors: []
        };
        this.frameworkPath = path.join(__dirname, '..', 'BURDEN_OF_PROOF_STRATEGY_FRAMEWORK.md');
    }

    log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : '🧪';
        console.log(`${prefix} ${message}`);
    }

    runTest(testName, testFunction) {
        this.testResults.total++;
        try {
            const result = testFunction();
            if (result === true || result === undefined) {
                this.testResults.passed++;
                this.log(`${testName}`, 'success');
                return true;
            } else {
                this.testResults.failed++;
                this.testResults.errors.push(`${testName}: ${result}`);
                this.log(`${testName}: ${result}`, 'error');
                return false;
            }
        } catch (error) {
            this.testResults.failed++;
            this.testResults.errors.push(`${testName}: ${error.message}`);
            this.log(`${testName}: ${error.message}`, 'error');
            return false;
        }
    }

    testFrameworkFileExists() {
        return this.runTest('Framework file exists', () => {
            if (!fs.existsSync(this.frameworkPath)) {
                return `BURDEN_OF_PROOF_STRATEGY_FRAMEWORK.md not found at ${this.frameworkPath}`;
            }
            return true;
        });
    }

    testFrameworkStructure() {
        return this.runTest('Framework has proper structure', () => {
            const content = fs.readFileSync(this.frameworkPath, 'utf8');
            
            const requiredSections = [
                '# Burden of Proof Strategy Framework',
                '## I. Legal Standards Framework',
                '### 1.1 Civil Standard: Balance of Probabilities',
                '### 1.2 Criminal Standard: Beyond Reasonable Doubt', 
                '### 1.3 Mathematical Standard: Invariant Conditions',
                '## II. Agent-Specific Guilt Framework',
                '### 2.1 Peter Andrew Faucitt',
                '### 2.2 Rynette Farrar',
                '### 2.3 Daniel Jacobus Bantjes'
            ];

            for (const section of requiredSections) {
                if (!content.includes(section)) {
                    return `Missing required section: ${section}`;
                }
            }
            return true;
        });
    }

    testLegalStandardsDefinition() {
        return this.runTest('Legal standards properly defined', () => {
            const content = fs.readFileSync(this.frameworkPath, 'utf8');
            
            // Test civil standard threshold
            if (!content.includes('51% likelihood') && !content.includes('≥51%')) {
                return 'Civil standard threshold not properly defined';
            }
            
            // Test criminal standard threshold  
            if (!content.includes('85%+ certainty') && !content.includes('≥85%')) {
                return 'Criminal standard threshold not properly defined';
            }
            
            // Test mathematical standard
            if (!content.includes('100% logical certainty') && !content.includes('100%')) {
                return 'Mathematical standard not properly defined';
            }
            
            return true;
        });
    }

    testAgentCoverage() {
        return this.runTest('All target agents covered', () => {
            const content = fs.readFileSync(this.frameworkPath, 'utf8');
            
            const targetAgents = [
                'Peter Andrew Faucitt',
                'Rynette Farrar', 
                'Daniel Jacobus Bantjes'
            ];

            for (const agent of targetAgents) {
                if (!content.includes(agent)) {
                    return `Missing agent coverage: ${agent}`;
                }
            }
            return true;
        });
    }

    testEvidenceRequirements() {
        return this.runTest('Evidence requirements specified for each standard', () => {
            const content = fs.readFileSync(this.frameworkPath, 'utf8');
            
            // Check for evidence requirement sections
            const evidenceMarkers = [
                'Evidence Requirements:',
                'Necessary Conditions:',
                'Sufficient Evidence Package:',
                'Evidence Required for Conviction:',
                'Required Evidence:'
            ];

            let evidenceCount = 0;
            for (const marker of evidenceMarkers) {
                const matches = content.match(new RegExp(marker, 'g'));
                if (matches) {
                    evidenceCount += matches.length;
                }
            }

            if (evidenceCount < 15) {
                return `Insufficient evidence requirements specified (found ${evidenceCount}, expected ≥15)`;
            }
            return true;
        });
    }

    testImplementationGuidance() {
        return this.runTest('Implementation guidance provided', () => {
            const content = fs.readFileSync(this.frameworkPath, 'utf8');
            
            const implementationMarkers = [
                'Implementation Strategies',
                'Practical Implementation Guide',
                'Day-by-Day Action Plan',
                'Resource Allocation',
                'Quality Assurance Checkpoints'
            ];

            for (const marker of implementationMarkers) {
                if (!content.includes(marker)) {
                    return `Missing implementation guidance: ${marker}`;
                }
            }
            return true;
        });
    }

    testCaseContextIntegration() {
        return this.runTest('Integrates with existing case context', () => {
            const content = fs.readFileSync(this.frameworkPath, 'utf8');
            
            // Check for integration with existing case elements
            const caseElements = [
                'Case 2025-137857',
                'interdict',
                'material non-disclosure',
                'disproportionate harm',
                'perjury',
                'email impersonation',
                'fiduciary duty'
            ];

            for (const element of caseElements) {
                if (!content.includes(element)) {
                    return `Missing case context integration: ${element}`;
                }
            }
            return true;
        });
    }

    testMathematicalProofRequirements() {
        return this.runTest('Mathematical proof requirements specified', () => {
            const content = fs.readFileSync(this.frameworkPath, 'utf8');
            
            // Check for mathematical/logical proof elements
            const mathElements = [
                'Invariant Condition',
                'Mathematical Proof:',
                'logical impossibility',
                'cryptographic',
                'THEN:',
                'IF:',
                'AND:'
            ];

            for (const element of mathElements) {
                if (!content.includes(element)) {
                    return `Missing mathematical proof element: ${element}`;
                }
            }
            return true;
        });
    }

    testEvidenceHierarchy() {
        return this.runTest('Evidence hierarchy by standard established', () => {
            const content = fs.readFileSync(this.frameworkPath, 'utf8');
            
            // Check for evidence quality escalation
            const qualityMarkers = [
                'Evidence Quality Requirements:',
                'Primary Evidence Sources:',
                'Chain of custody',
                'Forensic analysis',
                'Expert testimony',
                'Third-party verification'
            ];

            for (const marker of qualityMarkers) {
                if (!content.includes(marker)) {
                    return `Missing evidence quality marker: ${marker}`;
                }
            }
            return true;
        });
    }

    testTimelineAndPhasing() {
        return this.runTest('Timeline and phasing properly structured', () => {
            const content = fs.readFileSync(this.frameworkPath, 'utf8');
            
            // Check for timeline elements
            const timelineMarkers = [
                'Phase 1:',
                'Phase 2:',
                'Phase 3:',
                'Days 1-',
                'Post-Interdict',
                'Evidence Collection Timeline'
            ];

            for (const marker of timelineMarkers) {
                if (!content.includes(marker)) {
                    return `Missing timeline marker: ${marker}`;
                }
            }
            return true;
        });
    }

    testSuccessMetrics() {
        return this.runTest('Success metrics and validation criteria defined', () => {
            const content = fs.readFileSync(this.frameworkPath, 'utf8');
            
            // Check for success measurement elements
            const successMarkers = [
                'Success Metrics',
                'Success Indicators',
                'Minimum Success Threshold',
                'Optimal Success Threshold',
                'confidence',
                'QA Checkpoints'
            ];

            for (const marker of successMarkers) {
                if (!content.includes(marker)) {
                    return `Missing success metric marker: ${marker}`;
                }
            }
            return true;
        });
    }

    testResourceAllocation() {
        return this.runTest('Resource allocation specified for each standard', () => {
            const content = fs.readFileSync(this.frameworkPath, 'utf8');
            
            // Check for resource planning
            const resourceMarkers = [
                'Resource Allocation',
                'Legal Team:',
                'Budget:',
                'R150,000',
                'R400,000',
                'R300,000',
                'attorneys',
                'specialists'
            ];

            let resourceCount = 0;
            for (const marker of resourceMarkers) {
                if (content.includes(marker)) {
                    resourceCount++;
                }
            }

            if (resourceCount < 6) {
                return `Insufficient resource allocation detail (found ${resourceCount}, expected ≥6)`;
            }
            return true;
        });
    }

    testLegalFrameworkCompliance() {
        return this.runTest('Legal framework compliance with South African law', () => {
            const content = fs.readFileSync(this.frameworkPath, 'utf8');
            
            // Check for South African legal references
            const legalMarkers = [
                'South African',
                'Criminal Procedure Act',
                'Electronic Communications and Transactions Act',
                'Trust Property Control Act',
                'Supreme Court of Appeal',
                'Constitutional Court'
            ];

            for (const marker of legalMarkers) {
                if (!content.includes(marker)) {
                    return `Missing South African legal reference: ${marker}`;
                }
            }
            return true;
        });
    }

    testFileSize() {
        return this.runTest('Framework document is comprehensive (adequate size)', () => {
            const stats = fs.statSync(this.frameworkPath);
            const fileSizeKB = stats.size / 1024;
            
            if (fileSizeKB < 20) {
                return `Framework document too small (${fileSizeKB.toFixed(1)}KB, expected ≥20KB)`;
            }
            
            if (fileSizeKB > 100) {
                return `Framework document too large (${fileSizeKB.toFixed(1)}KB, expected ≤100KB)`;
            }
            
            return true;
        });
    }

    runAllTests() {
        this.log('🚀 Starting Burden of Proof Strategy Framework Tests');
        this.log('============================================================');
        this.log('');

        this.log('🧪 Testing framework file existence and basic structure...');
        this.testFrameworkFileExists();
        this.testFrameworkStructure();
        this.testFileSize();

        this.log('');
        this.log('🧪 Testing legal standards definition...');
        this.testLegalStandardsDefinition();
        this.testMathematicalProofRequirements();
        this.testLegalFrameworkCompliance();

        this.log('');
        this.log('🧪 Testing agent coverage and evidence requirements...');
        this.testAgentCoverage();
        this.testEvidenceRequirements();
        this.testEvidenceHierarchy();

        this.log('');
        this.log('🧪 Testing implementation guidance...');
        this.testImplementationGuidance();
        this.testTimelineAndPhasing();
        this.testResourceAllocation();

        this.log('');
        this.log('🧪 Testing case integration and success metrics...');
        this.testCaseContextIntegration();
        this.testSuccessMetrics();

        this.log('');
        this.log('============================================================');
        this.generateReport();
    }

    generateReport() {
        const successRate = ((this.testResults.passed / this.testResults.total) * 100).toFixed(1);
        
        this.log(`📊 Test Summary: ${this.testResults.total} tests run`);
        this.log(`✅ Passed: ${this.testResults.passed}`);
        this.log(`❌ Failed: ${this.testResults.failed}`);
        this.log(`📈 Success Rate: ${successRate}%`);

        if (this.testResults.failed > 0) {
            this.log('');
            this.log('🔥 Failed Tests:');
            this.testResults.errors.forEach((error, index) => {
                this.log(`${index + 1}. ${error}`, 'error');
            });
        }

        // Save test results
        const results = {
            timestamp: new Date().toISOString(),
            framework: 'Burden of Proof Strategy Framework',
            total: this.testResults.total,
            passed: this.testResults.passed,
            failed: this.testResults.failed,
            successRate: parseFloat(successRate),
            errors: this.testResults.errors
        };

        const resultsPath = path.join(__dirname, 'burden-of-proof-test-results.json');
        fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
        this.log(`📄 Test results saved to ${resultsPath}`);

        if (this.testResults.failed === 0) {
            this.log('🎉 All burden of proof framework tests passed!', 'success');
        } else {
            this.log('⚠️  Some tests failed. Review the framework implementation.', 'error');
            process.exit(1);
        }
    }
}

// Run tests if called directly
if (require.main === module) {
    const tester = new BurdenOfProofTests();
    tester.runAllTests();
}

module.exports = BurdenOfProofTests;