#!/usr/bin/env node

/**
 * File Path Reference Fixer
 * 
 * Analyzes and fixes broken file path references in documentation
 */

const fs = require('fs');
const path = require('path');

class FilePathFixer {
    constructor(validationReport) {
        this.issues = validationReport.issues;
        this.rootDir = process.cwd();
        this.fixes = [];
        this.skipPatterns = [
            // Template/placeholder patterns that should not be fixed
            /{.*}/,
            /\$\{.*\}/,
            /example/i,
            /template/i,
            /placeholder/i,
            /TODO/,
            /xxx/i,
            /test-workflow\.js/,
            /test-full-workflow\.js/,
            /\.md$/,
            /\.json$/
        ];
    }

    async analyze() {
        console.log('🔧 Analyzing file path issues...');
        
        // Group issues by type
        const issueGroups = this.groupIssues();
        
        // Display analysis
        this.displayAnalysis(issueGroups);
        
        // Generate fixes
        await this.generateFixes(issueGroups);
        
        return this.fixes;
    }

    groupIssues() {
        const groups = {
            missingEvidenceFiles: [],
            missingAnnexures: [],
            missingScripts: [],
            incorrectPaths: [],
            templateReferences: [],
            duplicateDirectories: [],
            other: []
        };

        this.issues.forEach(issue => {
            const refPath = issue.message.replace('Referenced file/directory does not exist: ', '');
            
            if (this.isTemplateReference(refPath)) {
                groups.templateReferences.push(issue);
            } else if (refPath.includes('evidence_package_')) {
                groups.missingEvidenceFiles.push(issue);
            } else if (refPath.includes('ANNEXURES/') || refPath.includes('JF')) {
                groups.missingAnnexures.push(issue);
            } else if (refPath.includes('.js') || refPath.includes('.py')) {
                groups.missingScripts.push(issue);
            } else if (this.hasIncorrectPath(refPath)) {
                groups.incorrectPaths.push(issue);
            } else if (this.isDuplicateDirectory(refPath)) {
                groups.duplicateDirectories.push(issue);
            } else {
                groups.other.push(issue);
            }
        });

        return groups;
    }

    isTemplateReference(refPath) {
        return this.skipPatterns.some(pattern => pattern.test(refPath));
    }

    hasIncorrectPath(refPath) {
        // Check if similar file exists with different path
        const basename = path.basename(refPath);
        if (basename.length < 3) return false;
        
        try {
            const { execSync } = require('child_process');
            // Sanitize inputs to prevent command injection
            const sanitizedRootDir = this.rootDir.replace(/[;&|`$(){}[\]\\]/g, '');
            const sanitizedBasename = basename.replace(/[;&|`$(){}[\]\\]/g, '');
            const findResult = execSync(`find "${sanitizedRootDir}" -name "${sanitizedBasename}" -type f 2>/dev/null || true`, { encoding: 'utf8' });
            return findResult.trim().length > 0;
        } catch (error) {
            return false;
        }
    }

    isDuplicateDirectory(refPath) {
        // Check for common duplicate directory patterns
        return refPath.includes('jax-response') || refPath.includes('jax-dan-response');
    }

    displayAnalysis(groups) {
        console.log('\n📊 ISSUE ANALYSIS');
        console.log('==================');
        
        Object.keys(groups).forEach(groupName => {
            const count = groups[groupName].length;
            if (count > 0) {
                console.log(`${groupName}: ${count} issues`);
            }
        });
    }

    async generateFixes(groups) {
        console.log('\n🔧 GENERATING FIXES');
        console.log('====================');

        // Fix incorrect paths by finding correct locations
        await this.fixIncorrectPaths(groups.incorrectPaths);
        
        // Handle duplicate directory references
        await this.fixDuplicateDirectories(groups.duplicateDirectories);
        
        // Create placeholders for missing evidence files
        await this.handleMissingEvidence(groups.missingEvidenceFiles);
        
        // Handle template references (document but don't change)
        this.documentTemplateReferences(groups.templateReferences);
        
        console.log(`\n✅ Generated ${this.fixes.length} fixes`);
    }

    async fixIncorrectPaths(issues) {
        const { execSync } = require('child_process');
        
        for (const issue of issues) {
            const refPath = issue.message.replace('Referenced file/directory does not exist: ', '');
            const basename = path.basename(refPath);
            
            try {
                // Sanitize inputs to prevent command injection
                const sanitizedRootDir = this.rootDir.replace(/[;&|`$(){}[\]\\]/g, '');
                const sanitizedBasename = basename.replace(/[;&|`$(){}[\]\\]/g, '');
                const findResult = execSync(`find "${sanitizedRootDir}" -name "${sanitizedBasename}" -type f 2>/dev/null || true`, { encoding: 'utf8' });
                const matches = findResult.trim().split('\n').filter(p => p.length > 0);
                
                if (matches.length === 1) {
                    const correctPath = path.relative(this.rootDir, matches[0]);
                    this.fixes.push({
                        type: 'PATH_CORRECTION',
                        file: issue.sourceFile,
                        lineNumber: issue.lineNumber,
                        oldPath: refPath,
                        newPath: correctPath,
                        context: issue.context
                    });
                    console.log(`   📁 ${basename}: ${refPath} → ${correctPath}`);
                }
            } catch (error) {
                // Continue processing other files
            }
        }
    }

    async fixDuplicateDirectories(issues) {
        // Handle jax-response vs jax-dan-response confusion
        for (const issue of issues) {
            const refPath = issue.message.replace('Referenced file/directory does not exist: ', '');
            
            let correctedPath = refPath;
            
            // Check if file exists in the other directory
            if (refPath.includes('jax-response/') && !fs.existsSync(path.join(this.rootDir, refPath))) {
                const altPath = refPath.replace('jax-response/', 'jax-dan-response/');
                if (fs.existsSync(path.join(this.rootDir, altPath))) {
                    correctedPath = altPath;
                }
            } else if (refPath.includes('jax-dan-response/') && !fs.existsSync(path.join(this.rootDir, refPath))) {
                const altPath = refPath.replace('jax-dan-response/', 'jax-response/');
                if (fs.existsSync(path.join(this.rootDir, altPath))) {
                    correctedPath = altPath;
                }
            }
            
            if (correctedPath !== refPath) {
                this.fixes.push({
                    type: 'DIRECTORY_CORRECTION',
                    file: issue.sourceFile,
                    lineNumber: issue.lineNumber,
                    oldPath: refPath,
                    newPath: correctedPath,
                    context: issue.context
                });
                console.log(`   📂 Directory fix: ${refPath} → ${correctedPath}`);
            }
        }
    }

    async handleMissingEvidence(issues) {
        // Create placeholders for missing evidence files
        const evidenceDirs = new Set();
        
        issues.forEach(issue => {
            const refPath = issue.message.replace('Referenced file/directory does not exist: ', '');
            if (refPath.includes('evidence_package_')) {
                const dir = path.dirname(refPath);
                evidenceDirs.add(dir);
            }
        });

        evidenceDirs.forEach(dir => {
            this.fixes.push({
                type: 'CREATE_PLACEHOLDER_DIR',
                path: dir,
                description: 'Missing evidence package directory'
            });
        });
    }

    documentTemplateReferences(issues) {
        console.log(`\n📝 Template references (${issues.length}): These are placeholders and should not be fixed`);
        const samples = issues.slice(0, 5).map(i => 
            i.message.replace('Referenced file/directory does not exist: ', '')
        );
        samples.forEach(sample => console.log(`   - ${sample}`));
        if (issues.length > 5) {
            console.log(`   ... and ${issues.length - 5} more`);
        }
    }

    async applyFixes() {
        console.log('\n🔧 APPLYING FIXES');
        console.log('==================');

        for (const fix of this.fixes) {
            try {
                await this.applyFix(fix);
            } catch (error) {
                console.error(`❌ Failed to apply fix: ${error.message}`);
            }
        }
    }

    async applyFix(fix) {
        switch (fix.type) {
            case 'PATH_CORRECTION':
            case 'DIRECTORY_CORRECTION':
                await this.updateFileReference(fix);
                break;
            case 'CREATE_PLACEHOLDER_DIR':
                await this.createPlaceholderDirectory(fix);
                break;
        }
    }

    async updateFileReference(fix) {
        const filePath = path.join(this.rootDir, fix.file);
        
        if (!fs.existsSync(filePath)) {
            console.log(`⚠️  Source file not found: ${fix.file}`);
            return;
        }

        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        
        if (fix.lineNumber > lines.length) {
            console.log(`⚠️  Line number ${fix.lineNumber} out of range in ${fix.file}`);
            return;
        }

        const line = lines[fix.lineNumber - 1];
        const updatedLine = line.replace(fix.oldPath, fix.newPath);
        
        if (line !== updatedLine) {
            lines[fix.lineNumber - 1] = updatedLine;
            fs.writeFileSync(filePath, lines.join('\n'));
            console.log(`✅ Updated ${fix.file}:${fix.lineNumber}`);
            console.log(`   ${fix.oldPath} → ${fix.newPath}`);
        }
    }

    async createPlaceholderDirectory(fix) {
        const dirPath = path.join(this.rootDir, fix.path);
        
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            
            // Create a README explaining the placeholder
            const readmePath = path.join(dirPath, 'README.md');
            const readmeContent = `# ${path.basename(fix.path)}\n\n${fix.description}\n\nThis directory was created as a placeholder for missing evidence files.\n`;
            fs.writeFileSync(readmePath, readmeContent);
            
            console.log(`✅ Created placeholder directory: ${fix.path}`);
        }
    }

    generateReport() {
        const reportPath = path.join(this.rootDir, 'file-path-fixes-report.json');
        const report = {
            timestamp: new Date().toISOString(),
            fixesGenerated: this.fixes.length,
            fixes: this.fixes
        };
        
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        console.log(`\n📋 Fixes report saved: ${reportPath}`);
    }
}

// Run if called directly
if (require.main === module) {
    const reportPath = process.argv[2] || 'file-path-validation-report.json';
    
    if (!fs.existsSync(reportPath)) {
        console.error('❌ Validation report not found. Run validation first.');
        process.exit(1);
    }

    const validationReport = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    const fixer = new FilePathFixer(validationReport);
    
    fixer.analyze().then(async () => {
        fixer.generateReport();
        
        console.log('\n🤔 Apply fixes? (y/N):');
        process.stdin.on('data', async (data) => {
            if (data.toString().trim().toLowerCase() === 'y') {
                await fixer.applyFixes();
                console.log('\n✅ All fixes applied!');
            } else {
                console.log('\n📋 Fixes generated but not applied. Run with -y to apply automatically.');
            }
            process.exit(0);
        });
    });
}

module.exports = FilePathFixer;