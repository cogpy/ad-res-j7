#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

class FilePathValidator {
    constructor() {
        this.results = {
            totalFiles: 0,
            totalReferences: 0,
            validReferences: 0,
            invalidReferences: 0,
            errors: []
        };
        this.repositoryRoot = process.cwd();
    }

    // Extract file path references from markdown content
    extractFileReferences(content) {
        const references = [];
        
        // Match markdown links with file paths: [text](path)
        const markdownLinkRegex = /\[([^\]]*)\]\(([^)]+)\)/g;
        let match;
        while ((match = markdownLinkRegex.exec(content)) !== null) {
            const linkPath = match[2];
            // Skip external URLs and anchors
            if (!linkPath.startsWith('http') && !linkPath.startsWith('#') && !linkPath.startsWith('mailto:')) {
                references.push({
                    type: 'markdown_link',
                    text: match[1],
                    path: linkPath,
                    fullMatch: match[0]
                });
            }
        }

        // Match code blocks with file paths: `path/to/file.ext`
        const codePathRegex = /`([^`]*\.[a-zA-Z0-9]+)`/g;
        while ((match = codePathRegex.exec(content)) !== null) {
            const filePath = match[1];
            // Filter to only include actual file paths (containing directory separators or file extensions)
            if (filePath.includes('/') || filePath.includes('\\')) {
                references.push({
                    type: 'code_block',
                    text: filePath,
                    path: filePath,
                    fullMatch: match[0]
                });
            }
        }

        // Match direct file references in text (e.g., directory/file.ext)
        const directPathRegex = /(?:^|\s)([a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_.-]+)+\.[a-zA-Z0-9]+)(?:\s|$)/gm;
        while ((match = directPathRegex.exec(content)) !== null) {
            const filePath = match[1];
            references.push({
                type: 'direct_reference',
                text: filePath,
                path: filePath,
                fullMatch: match[0]
            });
        }

        return references;
    }

    // Check if a file path exists relative to repository root
    validateFilePath(referencePath, sourceFile) {
        // Clean up the path
        let cleanPath = referencePath.trim();
        
        // Remove any query parameters or anchors
        cleanPath = cleanPath.split('?')[0].split('#')[0];
        
        // Handle relative paths
        let fullPath;
        if (path.isAbsolute(cleanPath)) {
            fullPath = cleanPath;
        } else {
            // Try relative to repository root first
            fullPath = path.join(this.repositoryRoot, cleanPath);
            
            // If not found, try relative to source file directory
            if (!fs.existsSync(fullPath)) {
                const sourceDir = path.dirname(sourceFile);
                fullPath = path.join(sourceDir, cleanPath);
            }
        }

        return fs.existsSync(fullPath);
    }

    // Validate all file references in a single file
    async validateFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const references = this.extractFileReferences(content);
            
            console.log(`\n📄 Validating ${path.relative(this.repositoryRoot, filePath)}`);
            console.log(`   Found ${references.length} file references`);
            
            this.results.totalReferences += references.length;
            
            for (const ref of references) {
                const isValid = this.validateFilePath(ref.path, filePath);
                
                if (isValid) {
                    this.results.validReferences++;
                    console.log(`   ✅ ${ref.type}: ${ref.path}`);
                } else {
                    this.results.invalidReferences++;
                    const error = {
                        file: path.relative(this.repositoryRoot, filePath),
                        reference: ref,
                        message: `File not found: ${ref.path}`
                    };
                    this.results.errors.push(error);
                    console.log(`   ❌ ${ref.type}: ${ref.path} (NOT FOUND)`);
                }
            }
            
        } catch (error) {
            console.error(`Error validating ${filePath}:`, error.message);
            this.results.errors.push({
                file: path.relative(this.repositoryRoot, filePath),
                reference: null,
                message: `Error reading file: ${error.message}`
            });
        }
    }

    // Find all markdown and documentation files
    async findDocumentationFiles() {
        const patterns = [
            '**/*.md',
            '**/*.txt',
            '**/README*'
        ];
        
        const excludePatterns = [
            'node_modules/**',
            '.git/**',
            '__pycache__/**',
            '*.min.*',
            'dist/**',
            'build/**'
        ];
        
        let allFiles = [];
        
        for (const pattern of patterns) {
            const files = await glob(pattern, {
                cwd: this.repositoryRoot,
                ignore: excludePatterns
            });
            allFiles = allFiles.concat(files.map(f => path.join(this.repositoryRoot, f)));
        }
        
        // Remove duplicates
        return [...new Set(allFiles)];
    }

    // Generate summary report
    generateReport() {
        console.log('\n' + '='.repeat(60));
        console.log('📊 FILE PATH VALIDATION SUMMARY');
        console.log('='.repeat(60));
        console.log(`Total documentation files processed: ${this.results.totalFiles}`);
        console.log(`Total file references found: ${this.results.totalReferences}`);
        console.log(`Valid references: ${this.results.validReferences}`);
        console.log(`Invalid references: ${this.results.invalidReferences}`);
        
        const successRate = this.results.totalReferences > 0 
            ? ((this.results.validReferences / this.results.totalReferences) * 100).toFixed(1)
            : 100;
        console.log(`Success rate: ${successRate}%`);
        
        if (this.results.errors.length > 0) {
            console.log('\n❌ ERRORS FOUND:');
            console.log('-'.repeat(40));
            
            for (const error of this.results.errors) {
                console.log(`\nFile: ${error.file}`);
                if (error.reference) {
                    console.log(`  Type: ${error.reference.type}`);
                    console.log(`  Reference: ${error.reference.fullMatch}`);
                    console.log(`  Path: ${error.reference.path}`);
                }
                console.log(`  Error: ${error.message}`);
            }
        } else {
            console.log('\n✅ All file path references are valid!');
        }
        
        return this.results.invalidReferences === 0;
    }

    // Main validation method
    async validate() {
        console.log('🔍 Starting file path validation...');
        console.log(`Repository root: ${this.repositoryRoot}`);
        
        const files = await this.findDocumentationFiles();
        this.results.totalFiles = files.length;
        
        console.log(`Found ${files.length} documentation files to validate`);
        
        for (const file of files) {
            await this.validateFile(file);
        }
        
        return this.generateReport();
    }
}

// Run validation if called directly
if (require.main === module) {
    const validator = new FilePathValidator();
    validator.validate().then(success => {
        process.exit(success ? 0 : 1);
    }).catch(error => {
        console.error('Validation failed:', error);
        process.exit(1);
    });
}

module.exports = FilePathValidator;