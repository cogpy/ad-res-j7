#!/usr/bin/env node

/**
 * File Path Validation Script
 * 
 * Validates all file paths and references in documentation files.
 * Scans markdown files for file path references and verifies their existence.
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

class FilePathValidator {
    constructor(rootDir = process.cwd()) {
        this.rootDir = rootDir;
        this.issues = [];
        this.validatedFiles = new Set();
        this.referencedFiles = new Set();
        
        // Common patterns for file references in markdown
        this.patterns = [
            // Direct file links: [text](path) or [text](./path)
            /\[([^\]]*)\]\(([^)]+\.(md|json|js|py|txt|yml|yaml|csv|pdf|docx|png|jpg|jpeg|gif|svg))\)/gi,
            // File references without links: `path/to/file.ext`
            /`([^`]*\.(md|json|js|py|txt|yml|yaml|csv|pdf|docx|png|jpg|jpeg|gif|svg))`/gi,
            // Documentation references: See filename.md
            /(?:see|refer to|check|view|in)\s+([a-zA-Z0-9_\-\/\.]+\.(md|json|js|py|txt|yml|yaml))/gi,
            // Directory references: in directory/path/
            /(?:in|under|within)\s+([a-zA-Z0-9_\-\/\.]+\/)/gi,
            // Explicit path references: path: /some/path
            /(?:path|file|directory):\s*([a-zA-Z0-9_\-\/\.]+)/gi,
            // Annexure references: ANNEXURES/JFxx/
            /ANNEXURES\/[A-Z0-9]+\/[a-zA-Z0-9_\-\/\.]+/gi,
            // Evidence package references: evidence_package_\d+/
            /evidence_package_\d+\/[a-zA-Z0-9_\-\/\.]+/gi
        ];
    }

    /**
     * Main validation function
     */
    async validate() {
        console.log('🔍 Starting file path validation...');
        console.log(`📁 Root directory: ${this.rootDir}`);
        
        // Get all markdown files
        const markdownFiles = await this.getMarkdownFiles();
        console.log(`📋 Found ${markdownFiles.length} markdown files to validate`);
        
        // Validate each markdown file
        for (const file of markdownFiles) {
            await this.validateMarkdownFile(file);
        }
        
        // Generate report
        this.generateReport();
        
        return this.issues.length === 0;
    }

    /**
     * Get all markdown files in the repository
     */
    async getMarkdownFiles() {
        try {
            const files = await glob('**/*.md', {
                cwd: this.rootDir,
                ignore: [
                    'node_modules/**',
                    '.git/**',
                    'vendor/**',
                    '**/node_modules/**'
                ]
            });
            return files.map(f => path.join(this.rootDir, f));
        } catch (error) {
            throw new Error(`Failed to find markdown files: ${error.message}`);
        }
    }

    /**
     * Validate file path references in a markdown file
     */
    async validateMarkdownFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const relativePath = path.relative(this.rootDir, filePath);
            
            console.log(`📄 Validating: ${relativePath}`);
            this.validatedFiles.add(relativePath);
            
            // Extract all potential file references
            const references = this.extractFileReferences(content, filePath);
            
            // Validate each reference
            for (const ref of references) {
                await this.validateReference(ref, filePath);
            }
            
        } catch (error) {
            this.addIssue('READ_ERROR', filePath, null, `Cannot read file: ${error.message}`);
        }
    }

    /**
     * Extract file references from markdown content
     */
    extractFileReferences(content, sourceFile) {
        const references = [];
        const lines = content.split('\n');
        
        lines.forEach((line, lineNumber) => {
            this.patterns.forEach(pattern => {
                let match;
                while ((match = pattern.exec(line)) !== null) {
                    const fullMatch = match[0];
                    let referencedPath = match[1] || match[2] || match[0];
                    
                    // Clean up the path
                    referencedPath = this.cleanPath(referencedPath);
                    
                    if (this.isValidPathReference(referencedPath)) {
                        references.push({
                            path: referencedPath,
                            sourceFile,
                            lineNumber: lineNumber + 1,
                            context: line.trim(),
                            fullMatch
                        });
                        this.referencedFiles.add(referencedPath);
                    }
                }
                pattern.lastIndex = 0; // Reset regex
            });
        });
        
        return references;
    }

    /**
     * Clean and normalize file path
     */
    cleanPath(rawPath) {
        return rawPath
            .replace(/^[`"']+|[`"']+$/g, '') // Remove quotes/backticks
            .replace(/^\.\//, '') // Remove leading ./
            .trim();
    }

    /**
     * Check if a path reference is valid for validation
     */
    isValidPathReference(pathStr) {
        // Skip URLs, empty paths, and certain patterns
        if (!pathStr || 
            pathStr.startsWith('http') || 
            pathStr.startsWith('mailto:') ||
            pathStr.startsWith('#') ||
            pathStr.length < 3 ||
            pathStr.includes('example') ||
            pathStr.includes('TODO') ||
            pathStr.includes('xxx')) {
            return false;
        }
        
        // Must have a file extension or be a directory (ends with /)
        return /\.[a-zA-Z0-9]+$/.test(pathStr) || pathStr.endsWith('/');
    }

    /**
     * Validate a single file reference
     */
    async validateReference(reference, sourceFile) {
        const { path: refPath, lineNumber, context } = reference;
        
        // Resolve absolute path
        const absolutePath = this.resolveReferencePath(refPath, sourceFile);
        
        // Check if file/directory exists
        if (!fs.existsSync(absolutePath)) {
            this.addIssue('MISSING_FILE', sourceFile, lineNumber, 
                `Referenced file/directory does not exist: ${refPath}`, context);
            return;
        }
        
        // Additional checks for specific file types
        if (refPath.endsWith('.md')) {
            this.validateMarkdownReference(absolutePath, reference);
        } else if (refPath.endsWith('.json')) {
            this.validateJsonReference(absolutePath, reference);
        }
    }

    /**
     * Resolve reference path relative to source file
     */
    resolveReferencePath(refPath, sourceFile) {
        if (path.isAbsolute(refPath)) {
            return refPath;
        }
        
        // If path starts with repository root indicators
        if (refPath.startsWith('docs/') || 
            refPath.startsWith('todo/') || 
            refPath.startsWith('ANNEXURES/') ||
            refPath.startsWith('affidavit_work/')) {
            return path.join(this.rootDir, refPath);
        }
        
        // Relative to source file directory
        const sourceDir = path.dirname(sourceFile);
        return path.resolve(sourceDir, refPath);
    }

    /**
     * Validate markdown file reference
     */
    validateMarkdownReference(filePath, reference) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            if (content.length === 0) {
                this.addIssue('EMPTY_FILE', reference.sourceFile, reference.lineNumber,
                    `Referenced markdown file is empty: ${reference.path}`, reference.context);
            }
        } catch (error) {
            this.addIssue('READ_ERROR', reference.sourceFile, reference.lineNumber,
                `Cannot read referenced file: ${reference.path} - ${error.message}`, reference.context);
        }
    }

    /**
     * Validate JSON file reference
     */
    validateJsonReference(filePath, reference) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            JSON.parse(content);
        } catch (error) {
            this.addIssue('INVALID_JSON', reference.sourceFile, reference.lineNumber,
                `Referenced JSON file is invalid: ${reference.path} - ${error.message}`, reference.context);
        }
    }

    /**
     * Add an issue to the issues list
     */
    addIssue(type, sourceFile, lineNumber, message, context = '') {
        this.issues.push({
            type,
            sourceFile: path.relative(this.rootDir, sourceFile),
            lineNumber,
            message,
            context,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Generate validation report
     */
    generateReport() {
        console.log('\n📊 FILE PATH VALIDATION REPORT');
        console.log('=====================================');
        
        console.log(`📁 Files validated: ${this.validatedFiles.size}`);
        console.log(`🔗 File references found: ${this.referencedFiles.size}`);
        console.log(`❌ Issues found: ${this.issues.length}`);
        
        if (this.issues.length === 0) {
            console.log('✅ All file path references are valid!');
            return;
        }
        
        // Group issues by type
        const issuesByType = {};
        this.issues.forEach(issue => {
            if (!issuesByType[issue.type]) {
                issuesByType[issue.type] = [];
            }
            issuesByType[issue.type].push(issue);
        });
        
        // Display issues by type
        Object.keys(issuesByType).forEach(type => {
            console.log(`\n❌ ${type} (${issuesByType[type].length} issues):`);
            issuesByType[type].forEach((issue, index) => {
                console.log(`  ${index + 1}. ${issue.sourceFile}:${issue.lineNumber || '?'}`);
                console.log(`     ${issue.message}`);
                if (issue.context) {
                    console.log(`     Context: ${issue.context}`);
                }
            });
        });
        
        // Save detailed report
        this.saveDetailedReport();
    }

    /**
     * Save detailed validation report to file
     */
    saveDetailedReport() {
        const reportPath = path.join(this.rootDir, 'file-path-validation-report.json');
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                filesValidated: this.validatedFiles.size,
                referencesFound: this.referencedFiles.size,
                issuesFound: this.issues.length,
                validationPassed: this.issues.length === 0
            },
            validatedFiles: Array.from(this.validatedFiles),
            referencedFiles: Array.from(this.referencedFiles),
            issues: this.issues
        };
        
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`\n📋 Detailed report saved: ${reportPath}`);
    }
}

// Run validation if called directly
if (require.main === module) {
    const validator = new FilePathValidator();
    validator.validate().then(success => {
        process.exit(success ? 0 : 1);
    }).catch(error => {
        console.error('❌ Validation failed:', error);
        process.exit(1);
    });
}

module.exports = FilePathValidator;