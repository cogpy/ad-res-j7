#!/usr/bin/env node

/**
 * Evidence Cross-Reference Accuracy Test Suite
 * 
 * Tests the evidence cross-referencing system for accuracy as required by:
 * Issue: Test evidence cross-referencing system for accuracy
 * Source: todo/Repository_Status_and_Critical_Evidence_Collection.md, Line 135
 * 
 * This comprehensive test validates:
 * 1. Response matrix structure and integrity
 * 2. Evidence trail documentation completeness
 * 3. Cross-reference link validity
 * 4. Annexure mapping accuracy
 * 5. Evidence correlation logic
 * 6. AD paragraph reference accuracy
 */

const fs = require('fs');
const path = require('path');

class EvidenceCrossReferenceAccuracyTest {
    constructor() {
        this.repoRoot = path.resolve(__dirname, '..');
        this.errors = [];
        this.warnings = [];
        this.passedTests = 0;
        this.totalTests = 0;
    }

    log(message) {
        console.log(message);
    }

    error(message) {
        this.errors.push(message);
        console.error(`❌ ${message}`);
    }

    warn(message) {
        this.warnings.push(message);
        console.warn(`⚠️  ${message}`);
    }

    pass(message) {
        this.passedTests++;
        console.log(`✅ ${message}`);
    }

    testStart(name) {
        this.totalTests++;
        this.log(`\n🧪 Test ${this.totalTests}: ${name}`);
    }

    fileExists(relativePath) {
        const fullPath = path.join(this.repoRoot, relativePath);
        return fs.existsSync(fullPath);
    }

    readJsonFile(relativePath) {
        const fullPath = path.join(this.repoRoot, relativePath);
        try {
            const content = fs.readFileSync(fullPath, 'utf8');
            return JSON.parse(content);
        } catch (e) {
            this.error(`Failed to read/parse JSON file ${relativePath}: ${e.message}`);
            return null;
        }
    }

    readTextFile(relativePath) {
        const fullPath = path.join(this.repoRoot, relativePath);
        try {
            return fs.readFileSync(fullPath, 'utf8');
        } catch (e) {
            this.error(`Failed to read file ${relativePath}: ${e.message}`);
            return null;
        }
    }

    // Test 1: Response Matrix JSON Structure
    testResponseMatrixStructure() {
        this.testStart('Response Matrix JSON Structure Validation');
        
        const matrixPath = 'jax-response/analysis-output/response_matrix.json';
        if (!this.fileExists(matrixPath)) {
            this.error(`Response matrix file not found: ${matrixPath}`);
            return;
        }

        const matrix = this.readJsonFile(matrixPath);
        if (!matrix) return;

        if (!Array.isArray(matrix)) {
            this.error('Response matrix must be an array');
            return;
        }

        // Validate each entry has required fields
        const requiredFields = ['ad_para', 'priority', 'topic', 'draft_section', 'annexures', 'cross_refs', 'evidence_trail'];
        let validEntries = 0;

        matrix.forEach((entry, index) => {
            const missingFields = requiredFields.filter(field => !(field in entry));
            if (missingFields.length > 0) {
                this.error(`Entry ${index} (${entry.ad_para || 'unknown'}) missing fields: ${missingFields.join(', ')}`);
            } else {
                validEntries++;
            }

            // Validate priority values
            const validPriorities = ['Critical', 'High', 'Medium', 'Low'];
            if (entry.priority && !validPriorities.includes(entry.priority)) {
                this.error(`Entry ${entry.ad_para} has invalid priority: ${entry.priority}`);
            }

            // Validate annexures is an array
            if (entry.annexures && !Array.isArray(entry.annexures)) {
                this.error(`Entry ${entry.ad_para} annexures must be an array`);
            }

            // Validate cross_refs is an array
            if (entry.cross_refs && !Array.isArray(entry.cross_refs)) {
                this.error(`Entry ${entry.ad_para} cross_refs must be an array`);
            }
        });

        if (validEntries === matrix.length) {
            this.pass(`All ${matrix.length} response matrix entries have valid structure`);
        } else {
            this.warn(`Only ${validEntries}/${matrix.length} entries have valid structure`);
        }
    }

    // Test 2: Evidence Trail Completeness
    testEvidenceTrailCompleteness() {
        this.testStart('Evidence Trail Documentation Completeness');

        const matrixPath = 'jax-response/analysis-output/response_matrix.json';
        const matrix = this.readJsonFile(matrixPath);
        if (!matrix) return;

        const requiredTrailFields = [
            'peters_claim',
            'factual_rebuttal', 
            'counter_evidence',
            'strategic_implications',
            'supporting_analysis'
        ];

        let completeTrails = 0;
        matrix.forEach(entry => {
            if (!entry.evidence_trail) {
                this.error(`Entry ${entry.ad_para} missing evidence_trail`);
                return;
            }

            const missingFields = requiredTrailFields.filter(
                field => !entry.evidence_trail[field]
            );

            if (missingFields.length === 0) {
                completeTrails++;
            } else {
                this.error(`Entry ${entry.ad_para} evidence trail missing: ${missingFields.join(', ')}`);
            }

            // Validate counter_evidence is an array
            if (entry.evidence_trail.counter_evidence && 
                !Array.isArray(entry.evidence_trail.counter_evidence)) {
                this.error(`Entry ${entry.ad_para} counter_evidence must be an array`);
            }
        });

        if (completeTrails === matrix.length) {
            this.pass(`All ${matrix.length} evidence trails are complete`);
        } else {
            this.warn(`Only ${completeTrails}/${matrix.length} evidence trails are complete`);
        }
    }

    // Test 3: Cross-Reference Document Existence
    testCrossReferenceDocuments() {
        this.testStart('Cross-Reference Document Existence Validation');

        const matrixPath = 'jax-response/analysis-output/response_matrix.json';
        const matrix = this.readJsonFile(matrixPath);
        if (!matrix) return;

        // Document path mappings
        const docPaths = {
            'Faucitt_Interdict_Analysis.md': 'jax-response/analysis-output/Faucitt_Interdict_Analysis.md',
            'comprehensive_reference_index.json': 'jax-response/analysis-output/comprehensive_reference_index.json',
            'REVISED_Answering_Affidavit_Jax_TRACKED_CHANGES_v5.md': 'jax-response/analysis-output/REVISED_Answering_Affidavit_Jax_TRACKED_CHANGES_v5.md',
            'RWD_REVENUE_INTEGRITY_ANALYSIS.md': 'jax-response/AD/1-Critical/RWD_REVENUE_INTEGRITY_ANALYSIS.md',
            'Affidavit_Amendment_Recommendations.md': 'jax-response/analysis-output/Affidavit_Amendment_Recommendations.md',
            'comprehensive_legal_analysis.json': 'jax-response/analysis-output/comprehensive_legal_analysis.json'
        };

        let validRefs = 0;
        let totalRefs = 0;

        matrix.forEach(entry => {
            if (!entry.cross_refs) return;

            entry.cross_refs.forEach(ref => {
                totalRefs++;
                const docName = ref.document;
                const docPath = docPaths[docName];

                if (!docPath) {
                    this.warn(`Unknown document reference in ${entry.ad_para}: ${docName}`);
                    return;
                }

                if (this.fileExists(docPath)) {
                    validRefs++;
                } else {
                    this.error(`Missing cross-reference document for ${entry.ad_para}: ${docPath}`);
                }
            });
        });

        if (validRefs === totalRefs) {
            this.pass(`All ${totalRefs} cross-reference documents exist`);
        } else {
            this.error(`Only ${validRefs}/${totalRefs} cross-reference documents exist`);
        }
    }

    // Test 4: Annexure Reference Format Validation
    testAnnexureReferences() {
        this.testStart('Annexure Reference Format Validation');

        const matrixPath = 'jax-response/analysis-output/response_matrix.json';
        const matrix = this.readJsonFile(matrixPath);
        if (!matrix) return;

        const annexurePattern = /^JF\d+[A-Z]*(-[A-Z]+)?$/;
        let validAnnexures = 0;
        let totalAnnexures = 0;

        matrix.forEach(entry => {
            if (!entry.annexures) return;

            entry.annexures.forEach(annexure => {
                totalAnnexures++;
                if (annexurePattern.test(annexure)) {
                    validAnnexures++;
                } else {
                    this.error(`Invalid annexure format in ${entry.ad_para}: ${annexure}`);
                }
            });
        });

        if (validAnnexures === totalAnnexures) {
            this.pass(`All ${totalAnnexures} annexure references follow correct format (JFxx pattern)`);
        } else {
            this.error(`Only ${validAnnexures}/${totalAnnexures} annexure references are valid`);
        }
    }

    // Test 5: Evidence Correlation Matrix Validation
    testEvidenceCorrelationMatrix() {
        this.testStart('Evidence Correlation Matrix Validation');

        const evidencePath = 'jax-response/revenue-theft/EVIDENCE_CROSS_REFERENCE.json';
        if (!this.fileExists(evidencePath)) {
            this.warn(`Evidence cross-reference file not found: ${evidencePath}`);
            return;
        }

        const evidence = this.readJsonFile(evidencePath);
        if (!evidence) return;

        // Validate structure
        if (!evidence.sections || !Array.isArray(evidence.sections)) {
            this.error('Evidence cross-reference must have sections array');
            return;
        }

        // Check for critical sections
        const criticalSections = [
            'EVIDENCE RELATIONSHIP MATRIX',
            'EVIDENCE CORRELATION DETAILS',
            'CONSPIRACY ELEMENTS CORRELATION'
        ];

        let foundSections = 0;
        evidence.sections.forEach(section => {
            const heading = section.heading ? section.heading.replace(/🔗|📊|🎯/g, '').trim() : '';
            if (criticalSections.some(cs => heading.includes(cs))) {
                foundSections++;
            }
        });

        if (foundSections >= 2) {
            this.pass(`Evidence correlation matrix contains ${foundSections}/${criticalSections.length} critical sections`);
        } else {
            this.error(`Evidence correlation matrix missing critical sections (found ${foundSections})`);
        }
    }

    // Test 6: AD Paragraph Reference Accuracy
    testADParagraphReferences() {
        this.testStart('AD Paragraph Reference Accuracy');

        const matrixPath = 'jax-response/analysis-output/response_matrix.json';
        const matrix = this.readJsonFile(matrixPath);
        if (!matrix) return;

        const adParaPattern = /^(\d+(-\d+)?(\.\d+(-\d+\.\d+)?)?)$/;
        let validRefs = 0;

        matrix.forEach(entry => {
            if (!entry.ad_para) {
                this.error('Entry missing ad_para field');
                return;
            }

            if (adParaPattern.test(entry.ad_para)) {
                validRefs++;
            } else {
                this.error(`Invalid AD paragraph format: ${entry.ad_para}`);
            }
        });

        if (validRefs === matrix.length) {
            this.pass(`All ${matrix.length} AD paragraph references follow correct format`);
        } else {
            this.error(`Only ${validRefs}/${matrix.length} AD paragraph references are valid`);
        }
    }

    // Test 7: Cross-Reference Index Integrity
    testCrossReferenceIndex() {
        this.testStart('Cross-Reference Index Integrity');

        const indexPath = 'jax-response/analysis-output/cross_reference_index.md';
        if (!this.fileExists(indexPath)) {
            this.error(`Cross-reference index not found: ${indexPath}`);
            return;
        }

        const indexContent = this.readTextFile(indexPath);
        if (!indexContent) return;

        // Check for required sections
        const requiredSections = [
            'Core Analysis Documents',
            'AD Paragraph Cross-Reference Mapping',
            'Cross-Reference Validation'
        ];

        let foundSections = 0;
        requiredSections.forEach(section => {
            if (indexContent.includes(section)) {
                foundSections++;
            } else {
                this.warn(`Cross-reference index missing section: ${section}`);
            }
        });

        if (foundSections === requiredSections.length) {
            this.pass(`Cross-reference index contains all ${requiredSections.length} required sections`);
        } else {
            this.warn(`Cross-reference index contains ${foundSections}/${requiredSections.length} required sections`);
        }
    }

    // Test 8: Response Matrix Markdown Consistency
    testResponseMatrixMarkdown() {
        this.testStart('Response Matrix Markdown Consistency');

        const mdPath = 'jax-response/analysis-output/response_matrix.md';
        if (!this.fileExists(mdPath)) {
            this.error(`Response matrix markdown not found: ${mdPath}`);
            return;
        }

        const mdContent = this.readTextFile(mdPath);
        if (!mdContent) return;

        // Load JSON for comparison
        const jsonPath = 'jax-response/analysis-output/response_matrix.json';
        const matrix = this.readJsonFile(jsonPath);
        if (!matrix) return;

        // Check that all AD paragraphs in JSON are in markdown
        let foundInMarkdown = 0;
        matrix.forEach(entry => {
            // Look for the AD para reference in markdown (flexible matching)
            const patterns = [
                entry.ad_para,
                entry.ad_para.replace('.', '\\.'),
                `PARA ${entry.ad_para}`,
                `${entry.ad_para}`
            ];
            
            if (patterns.some(pattern => mdContent.includes(pattern))) {
                foundInMarkdown++;
            } else {
                this.warn(`AD paragraph ${entry.ad_para} not found in markdown`);
            }
        });

        if (foundInMarkdown === matrix.length) {
            this.pass(`All ${matrix.length} AD paragraphs from JSON are documented in markdown`);
        } else {
            this.warn(`Only ${foundInMarkdown}/${matrix.length} AD paragraphs found in markdown`);
        }
    }

    // Test 9: Evidence Trail Cross-Reference Validation
    testEvidenceTrailCrossReferences() {
        this.testStart('Evidence Trail Cross-Reference Validation');

        const matrixPath = 'jax-response/analysis-output/response_matrix.json';
        const matrix = this.readJsonFile(matrixPath);
        if (!matrix) return;

        let validTrailRefs = 0;
        let totalTrailRefs = 0;

        matrix.forEach(entry => {
            if (!entry.evidence_trail || !entry.evidence_trail.supporting_analysis) return;

            totalTrailRefs++;
            const supportingAnalysis = entry.evidence_trail.supporting_analysis;

            // Check if it references a valid document pattern
            const validPatterns = [
                /REVISED_Answering_Affidavit_Jax.*\.md/,
                /comprehensive_reference_index\.json/,
                /Faucitt_Interdict_Analysis\.md/,
                /§\d+/  // Section reference pattern
            ];

            if (validPatterns.some(pattern => pattern.test(supportingAnalysis))) {
                validTrailRefs++;
            } else {
                this.warn(`Evidence trail in ${entry.ad_para} has unclear supporting analysis reference: ${supportingAnalysis}`);
            }
        });

        if (totalTrailRefs === 0) {
            this.warn('No evidence trail supporting analysis references found');
        } else if (validTrailRefs === totalTrailRefs) {
            this.pass(`All ${totalTrailRefs} evidence trail supporting analysis references are valid`);
        } else {
            this.warn(`${validTrailRefs}/${totalTrailRefs} evidence trail references are valid`);
        }
    }

    // Test 10: Comprehensive Reference Index Validation
    testComprehensiveReferenceIndex() {
        this.testStart('Comprehensive Reference Index Structure Validation');

        const indexPath = 'jax-response/analysis-output/comprehensive_reference_index.json';
        if (!this.fileExists(indexPath)) {
            this.error(`Comprehensive reference index not found: ${indexPath}`);
            return;
        }

        const index = this.readJsonFile(indexPath);
        if (!index) return;

        if (!Array.isArray(index)) {
            this.error('Comprehensive reference index must be an array');
            return;
        }

        // Validate each entry has required fields
        const requiredFields = ['ad_paragraph_ref', 'priority', 'action_required'];
        let validEntries = 0;

        index.forEach((entry, idx) => {
            const missingFields = requiredFields.filter(field => !(field in entry));
            if (missingFields.length === 0) {
                validEntries++;
            } else {
                if (idx < 5) { // Only report first 5 to avoid spam
                    this.warn(`Comprehensive index entry ${idx} missing fields: ${missingFields.join(', ')}`);
                }
            }
        });

        const percentValid = (validEntries / index.length * 100).toFixed(1);
        if (validEntries === index.length) {
            this.pass(`All ${index.length} comprehensive reference index entries are valid`);
        } else {
            this.warn(`${validEntries}/${index.length} (${percentValid}%) comprehensive reference entries are valid`);
        }
    }

    // Run all tests
    async runAllTests() {
        this.log('╔═══════════════════════════════════════════════════════════════╗');
        this.log('║  Evidence Cross-Reference Accuracy Test Suite                ║');
        this.log('║  Testing comprehensive evidence cross-referencing system     ║');
        this.log('╚═══════════════════════════════════════════════════════════════╝');

        this.testResponseMatrixStructure();
        this.testEvidenceTrailCompleteness();
        this.testCrossReferenceDocuments();
        this.testAnnexureReferences();
        this.testEvidenceCorrelationMatrix();
        this.testADParagraphReferences();
        this.testCrossReferenceIndex();
        this.testResponseMatrixMarkdown();
        this.testEvidenceTrailCrossReferences();
        this.testComprehensiveReferenceIndex();

        this.printSummary();
        return this.errors.length === 0;
    }

    printSummary() {
        this.log('\n' + '═'.repeat(65));
        this.log('📊 TEST SUMMARY');
        this.log('═'.repeat(65));
        this.log(`Total Tests: ${this.totalTests}`);
        this.log(`Passed: ${this.passedTests}`);
        this.log(`Errors: ${this.errors.length}`);
        this.log(`Warnings: ${this.warnings.length}`);

        if (this.errors.length > 0) {
            this.log('\n❌ FAILED TESTS:');
            this.errors.forEach(err => this.log(`  • ${err}`));
        }

        if (this.warnings.length > 0) {
            this.log('\n⚠️  WARNINGS:');
            this.warnings.forEach(warn => this.log(`  • ${warn}`));
        }

        this.log('\n' + '═'.repeat(65));
        if (this.errors.length === 0) {
            this.log('✅ ALL TESTS PASSED - Evidence cross-referencing system is accurate');
            this.log('═'.repeat(65));
        } else {
            this.log('❌ TESTS FAILED - Please address errors above');
            this.log('═'.repeat(65));
        }
    }
}

// Run tests if called directly
if (require.main === module) {
    const tester = new EvidenceCrossReferenceAccuracyTest();
    tester.runAllTests().then(success => {
        process.exit(success ? 0 : 1);
    });
}

module.exports = EvidenceCrossReferenceAccuracyTest;
