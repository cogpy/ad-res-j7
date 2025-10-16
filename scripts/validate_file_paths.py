#!/usr/bin/env python3
"""
File Path and Reference Validation Script
Implementation of Section 4 - Critical Testing Line 139

This script validates all file paths and references in documentation
to ensure links are accurate and files exist.
"""

import json
import os
import re
import urllib.parse
from pathlib import Path
from typing import List, Dict, Set, Tuple
import argparse

class FilePathValidator:
    def __init__(self, repo_root="/home/runner/work/ad-res-j7/ad-res-j7"):
        self.repo_root = Path(repo_root)
        self.errors = []
        self.warnings = []
        self.checked_files = set()
        self.missing_files = set()
        self.valid_files = set()
        
        # Pattern for markdown links: [text](path)
        self.markdown_link_pattern = re.compile(r'\[([^\]]*)\]\(([^)]+)\)')
        
        # Pattern for relative paths that should be checked
        self.relative_path_pattern = re.compile(r'^[^/].*\.(md|json|pdf|docx?|xlsx?|txt|csv|png|jpg|jpeg|gif|svg)$', re.IGNORECASE)
        
        # Pattern for absolute paths within repo
        self.absolute_path_pattern = re.compile(r'^/.*\.(md|json|pdf|docx?|xlsx?|txt|csv|png|jpg|jpeg|gif|svg)$', re.IGNORECASE)
        
    def is_external_link(self, path: str) -> bool:
        """Check if path is an external URL"""
        return path.startswith(('http://', 'https://', 'ftp://', 'mailto:'))
    
    def is_anchor_link(self, path: str) -> bool:
        """Check if path is just an anchor link within the same document"""
        return path.startswith('#')
    
    def resolve_relative_path(self, base_file: Path, relative_path: str) -> Path:
        """Resolve a relative path from the perspective of the base file"""
        # Handle URL fragments and query parameters
        path_parts = relative_path.split('#')[0].split('?')[0]
        
        # Decode URL encoding
        try:
            path_parts = urllib.parse.unquote(path_parts)
        except:
            pass
            
        base_dir = base_file.parent
        resolved = (base_dir / path_parts).resolve()
        
        # Ensure the resolved path is within the repository
        try:
            resolved.relative_to(self.repo_root)
            return resolved
        except ValueError:
            # Path is outside repository, return as-is for external validation
            return Path(path_parts)
    
    def validate_file_exists(self, file_path: Path, context: str = "") -> bool:
        """Check if a referenced file exists"""
        if file_path.exists():
            self.valid_files.add(str(file_path))
            return True
        else:
            self.missing_files.add(str(file_path))
            self.errors.append(f"Missing file: {file_path} (referenced in {context})")
            return False
    
    def extract_markdown_links(self, content: str, source_file: Path) -> List[Tuple[str, str, Path]]:
        """Extract all markdown links from content and resolve their paths"""
        links = []
        
        for match in self.markdown_link_pattern.finditer(content):
            link_text = match.group(1)
            link_path = match.group(2)
            
            # Skip external links and anchor links
            if self.is_external_link(link_path) or self.is_anchor_link(link_path):
                continue
            
            # Resolve the path
            if link_path.startswith('/'):
                # Absolute path from repo root
                resolved_path = self.repo_root / link_path.lstrip('/')
            else:
                # Relative path
                resolved_path = self.resolve_relative_path(source_file, link_path)
            
            links.append((link_text, link_path, resolved_path))
        
        return links
    
    def validate_markdown_file(self, md_file: Path) -> None:
        """Validate all file references in a markdown file"""
        try:
            with open(md_file, 'r', encoding='utf-8') as f:
                content = f.read()
        except UnicodeDecodeError:
            self.warnings.append(f"Could not read file due to encoding issues: {md_file}")
            return
        except Exception as e:
            self.errors.append(f"Error reading file {md_file}: {e}")
            return
        
        self.checked_files.add(str(md_file))
        
        # Extract and validate markdown links
        links = self.extract_markdown_links(content, md_file)
        
        for link_text, original_path, resolved_path in links:
            context = f"{md_file} -> [{link_text}]({original_path})"
            
            # Check if file should exist within repository
            if self.relative_path_pattern.match(original_path) or self.absolute_path_pattern.match(original_path):
                self.validate_file_exists(resolved_path, context)
            
            # Additional validation for specific file types
            if resolved_path.suffix.lower() == '.json' and resolved_path.exists():
                self.validate_json_file(resolved_path, context)
    
    def validate_json_file(self, json_file: Path, context: str = "") -> None:
        """Validate JSON file structure and any file references within it"""
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Look for file path references in JSON values
            self.check_json_for_paths(data, json_file, context)
            
        except json.JSONDecodeError as e:
            self.errors.append(f"Invalid JSON in {json_file}: {e} (referenced from {context})")
        except Exception as e:
            self.errors.append(f"Error validating JSON file {json_file}: {e}")
    
    def check_json_for_paths(self, data, json_file: Path, context: str, path: str = "") -> None:
        """Recursively check JSON data for file path references"""
        if isinstance(data, dict):
            for key, value in data.items():
                current_path = f"{path}.{key}" if path else key
                
                # Common keys that might contain file paths
                if key.lower() in ['file', 'path', 'document', 'source', 'url', 'link', 'href'] and isinstance(value, str):
                    if not self.is_external_link(value) and not self.is_anchor_link(value):
                        resolved_path = self.resolve_relative_path(json_file, value)
                        self.validate_file_exists(resolved_path, f"{context} -> JSON:{current_path}")
                
                self.check_json_for_paths(value, json_file, context, current_path)
                
        elif isinstance(data, list):
            for i, item in enumerate(data):
                current_path = f"{path}[{i}]" if path else f"[{i}]"
                self.check_json_for_paths(item, json_file, context, current_path)
                
        elif isinstance(data, str):
            # Check if the string looks like a file path
            if data and len(data) < 500:  # Reasonable path length
                if self.relative_path_pattern.match(data) or self.absolute_path_pattern.match(data):
                    resolved_path = self.resolve_relative_path(json_file, data)
                    self.validate_file_exists(resolved_path, f"{context} -> JSON:{path}")
    
    def scan_all_documentation(self) -> None:
        """Scan all markdown and JSON files in the repository"""
        print("🔍 Scanning repository for documentation files...")
        
        # Find all markdown files
        md_files = list(self.repo_root.rglob("*.md"))
        json_files = list(self.repo_root.rglob("*.json"))
        
        print(f"Found {len(md_files)} markdown files and {len(json_files)} JSON files")
        
        # Validate markdown files
        for md_file in md_files:
            # Skip files in certain directories
            relative_path = md_file.relative_to(self.repo_root)
            if any(part.startswith('.') for part in relative_path.parts):
                continue  # Skip hidden directories
            if 'node_modules' in relative_path.parts or 'vendor' in relative_path.parts:
                continue
                
            self.validate_markdown_file(md_file)
        
        # Validate standalone JSON files (not referenced from markdown)
        for json_file in json_files:
            relative_path = json_file.relative_to(self.repo_root)
            if any(part.startswith('.') for part in relative_path.parts):
                continue
            if 'node_modules' in relative_path.parts or 'vendor' in relative_path.parts:
                continue
                
            # Only validate if not already validated through markdown references
            if str(json_file) not in self.valid_files and str(json_file) not in self.missing_files:
                self.validate_json_file(json_file, f"standalone JSON file")
    
    def run_validation(self) -> bool:
        """Run complete file path validation"""
        print("🚀 Starting File Path and Reference Validation")
        print("=" * 60)
        
        self.scan_all_documentation()
        
        print("\n" + "=" * 60)
        print("📊 Validation Results:")
        
        print(f"\n📁 Files Processed:")
        print(f"  • Markdown files checked: {len(self.checked_files)}")
        print(f"  • Valid file references: {len(self.valid_files)}")
        print(f"  • Missing file references: {len(self.missing_files)}")
        
        if self.errors:
            print(f"\n❌ {len(self.errors)} Errors found:")
            for error in self.errors:
                print(f"  • {error}")
        
        if self.warnings:
            print(f"\n⚠️  {len(self.warnings)} Warnings:")
            for warning in self.warnings:
                print(f"  • {warning}")
        
        if not self.errors and not self.warnings:
            print(f"\n🎉 All file paths and references validated successfully!")
            print(f"✅ Checked {len(self.checked_files)} documentation files")
            print(f"✅ Validated {len(self.valid_files)} file references")
            return True
        elif not self.errors:
            print(f"\n✅ Validation passed with {len(self.warnings)} warnings")
            return True
        else:
            print(f"\n💥 Validation failed with {len(self.errors)} errors")
            return False
    
    def generate_report(self, output_file: str = None) -> Dict:
        """Generate a detailed validation report"""
        report = {
            "validation_type": "file_path_validation",
            "timestamp": __import__('datetime').datetime.now().isoformat(),
            "repository_root": str(self.repo_root),
            "summary": {
                "files_checked": len(self.checked_files),
                "valid_references": len(self.valid_files),
                "missing_references": len(self.missing_files),
                "errors": len(self.errors),
                "warnings": len(self.warnings),
                "success": len(self.errors) == 0
            },
            "checked_files": sorted(list(self.checked_files)),
            "valid_files": sorted(list(self.valid_files)),
            "missing_files": sorted(list(self.missing_files)),
            "errors": self.errors,
            "warnings": self.warnings
        }
        
        if output_file:
            try:
                with open(output_file, 'w') as f:
                    json.dump(report, f, indent=2)
                print(f"📄 Detailed report saved to: {output_file}")
            except Exception as e:
                print(f"⚠️ Could not save report to {output_file}: {e}")
        
        return report

def main():
    parser = argparse.ArgumentParser(description='Validate file paths and references in documentation')
    parser.add_argument('--repo-root', default='/home/runner/work/ad-res-j7/ad-res-j7',
                       help='Repository root directory')
    parser.add_argument('--report', help='Output file for detailed JSON report')
    parser.add_argument('--verbose', '-v', action='store_true',
                       help='Verbose output')
    
    args = parser.parse_args()
    
    validator = FilePathValidator(args.repo_root)
    success = validator.run_validation()
    
    if args.report:
        validator.generate_report(args.report)
    
    if success:
        print("\n✅ File path validation completed successfully")
        return 0
    else:
        print("\n❌ File path validation failed")
        return 1

if __name__ == "__main__":
    exit(main())