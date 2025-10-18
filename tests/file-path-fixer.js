#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

class FilePathFixer {
    constructor() {
        this.repositoryRoot = process.cwd();
        this.fixes = 0;
        this.filesModified = 0;
    }

    // Find files that might match a broken reference
    findSimilarFiles(brokenPath) {
        const basename = path.basename(brokenPath);
        const extension = path.extname(basename);
        const nameWithoutExt = path.basename(basename, extension);
        
        // Look for files with similar names
        const patterns = [
            `**/${basename}`,
            `**/${nameWithoutExt}.*`,
            `**/*${nameWithoutExt}*${extension}`,
        ];
        
        let candidates = [];
        
        for (const pattern of patterns) {
            try {
                const files = glob.sync(pattern, {
                    cwd: this.repositoryRoot,
                    ignore: ['node_modules/**', '.git/**', '__pycache__/**']
                });
                candidates = candidates.concat(files);
            } catch (error) {
                // Ignore glob errors
            }
        }
        
        return [...new Set(candidates)];
    }

    // Fix known problematic path patterns
    fixKnownPatterns(content) {
        let modified = false;
        let newContent = content;
        
        // Fix double slashes
        const doubleSlashRegex = /([^:])\/\/+/g;
        if (doubleSlashRegex.test(newContent)) {
            newContent = newContent.replace(doubleSlashRegex, '$1/');
            modified = true;
        }
        
        // Fix Windows-style path separators
        const windowsPathRegex = /([a-zA-Z0-9_-]+)\\([a-zA-Z0-9_.-]+)/g;
        if (windowsPathRegex.test(newContent)) {
            newContent = newContent.replace(windowsPathRegex, '$1/$2');
            modified = true;
        }
        
        // Fix common path issues
        const fixes = [
            // Remove leading slashes for relative paths
            { from: /\[([^\]]+)\]\(\/([^/][^)]+)\)/g, to: '[$1]($2)' },
            // Fix common typos
            { from: /analysss\//g, to: 'analysis/' },
            { from: /analasis\//g, to: 'analysis/' },
            // Fix missing file extensions
            { from: /README(?!\.)/g, to: 'README.md' },
        ];
        
        for (const fix of fixes) {
            if (fix.from.test(newContent)) {
                newContent = newContent.replace(fix.from, fix.to);
                modified = true;
            }
        }
        
        if (modified) {
            this.fixes++;
        }
        
        return { content: newContent, modified };
    }

    // Attempt to fix broken references
    async fixFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const result = this.fixKnownPatterns(content);
            
            if (result.modified) {
                fs.writeFileSync(filePath, result.content, 'utf8');
                this.filesModified++;
                console.log(`✅ Fixed patterns in: ${path.relative(this.repositoryRoot, filePath)}`);
                return true;
            }
            
            return false;
        } catch (error) {
            console.error(`❌ Error fixing ${filePath}:`, error.message);
            return false;
        }
    }

    // Main fix method
    async fix() {
        console.log('🔧 Starting automatic file path fixes...');
        console.log(`Repository root: ${this.repositoryRoot}`);
        
        // Find all markdown files
        const files = await glob('**/*.md', {
            cwd: this.repositoryRoot,
            ignore: ['node_modules/**', '.git/**', '__pycache__/**']
        });
        
        console.log(`Found ${files.length} markdown files to check`);
        
        for (const file of files) {
            const fullPath = path.join(this.repositoryRoot, file);
            await this.fixFile(fullPath);
        }
        
        console.log('\n' + '='.repeat(50));
        console.log('🔧 AUTOMATIC FIXES SUMMARY');
        console.log('='.repeat(50));
        console.log(`Files modified: ${this.filesModified}`);
        console.log(`Total fixes applied: ${this.fixes}`);
        
        if (this.filesModified > 0) {
            console.log('\n✅ Some issues were automatically fixed.');
            console.log('Run the validation script again to check remaining issues.');
        } else {
            console.log('\n ℹ️ No automatic fixes were applied.');
            console.log('Manual review may be needed for remaining issues.');
        }
    }
}

// Run fixer if called directly
if (require.main === module) {
    const fixer = new FilePathFixer();
    fixer.fix().catch(error => {
        console.error('Fix operation failed:', error);
        process.exit(1);
    });
}

module.exports = FilePathFixer;