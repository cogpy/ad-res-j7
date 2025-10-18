#!/usr/bin/env python3
"""
JSON File Validation Script for ad-res-j7 Repository

This script validates all JSON files in the repository to ensure they are properly
formatted and parseable, as required by the todo task:
"Ensure all JSON files are properly formatted and parseable"

Source: todo/Repository_Status_and_Critical_Evidence_Collection.md, line 137
Priority: critical
"""

import json
import os
import sys
import glob
from datetime import datetime
from pathlib import Path


class JSONValidator:
    def __init__(self, repo_path="/home/runner/work/ad-res-j7/ad-res-j7"):
        self.repo_path = repo_path
        self.results = {
            "timestamp": datetime.now().isoformat(),
            "total_files": 0,
            "valid_files": 0,
            "invalid_files": 0,
            "errors": [],
            "warnings": [],
            "file_details": []
        }
    
    def find_json_files(self):
        """Find all JSON files in the repository"""
        json_files = []
        for root, dirs, files in os.walk(self.repo_path):
            # Skip .git directory
            if '.git' in dirs:
                dirs.remove('.git')
            # Skip node_modules if present
            if 'node_modules' in dirs:
                dirs.remove('node_modules')
            
            for file in files:
                if file.endswith('.json'):
                    json_files.append(os.path.join(root, file))
        
        return sorted(json_files)
    
    def validate_json_file(self, file_path):
        """Validate a single JSON file"""
        relative_path = os.path.relpath(file_path, self.repo_path)
        file_result = {
            "file": relative_path,
            "status": "unknown",
            "error": None,
            "warnings": [],
            "size_bytes": 0
        }
        
        try:
            # Check if file exists and get size
            if not os.path.exists(file_path):
                file_result["status"] = "missing"
                file_result["error"] = "File not found"
                return file_result
            
            file_result["size_bytes"] = os.path.getsize(file_path)
            
            # Read and parse JSON
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Check for empty files
            if not content.strip():
                file_result["status"] = "empty"
                file_result["error"] = "File is empty"
                return file_result
            
            # Parse JSON
            parsed_data = json.loads(content)
            file_result["status"] = "valid"
            
            # Additional checks for quality
            self._check_json_quality(content, parsed_data, file_result)
            
        except json.JSONDecodeError as e:
            file_result["status"] = "invalid"
            file_result["error"] = f"JSON decode error: {str(e)}"
        except UnicodeDecodeError as e:
            file_result["status"] = "invalid"
            file_result["error"] = f"Unicode decode error: {str(e)}"
        except Exception as e:
            file_result["status"] = "invalid"
            file_result["error"] = f"Unexpected error: {str(e)}"
        
        return file_result
    
    def _check_json_quality(self, content, parsed_data, file_result):
        """Perform additional quality checks on valid JSON"""
        # Check for trailing commas (common issue)
        if ',}' in content or ',]' in content:
            file_result["warnings"].append("Contains trailing commas")
        
        # Check for proper indentation (basic check)
        lines = content.split('\n')
        if len(lines) > 1:
            # Check if it's minified (single line)
            if len(lines) == 1 and len(content) > 100:
                file_result["warnings"].append("Appears to be minified (single line)")
            
            # Check for mixed indentation
            indents = set()
            for line in lines:
                if line.strip():
                    leading_spaces = len(line) - len(line.lstrip(' '))
                    if leading_spaces > 0:
                        indents.add(leading_spaces % 2 == 0)  # Even/odd spacing
            
            if len(indents) > 1:
                file_result["warnings"].append("Mixed indentation detected")
        
        # Check for very large files
        if file_result["size_bytes"] > 1024 * 1024:  # 1MB
            file_result["warnings"].append(f"Large file ({file_result['size_bytes'] // 1024}KB)")
        
        # Check for empty objects/arrays at root level
        if parsed_data == {} or parsed_data == []:
            file_result["warnings"].append("Root level is empty object/array")
    
    def validate_all_files(self):
        """Validate all JSON files in the repository"""
        print("🔍 JSON File Validation Starting...")
        print(f"📁 Repository: {self.repo_path}")
        
        json_files = self.find_json_files()
        self.results["total_files"] = len(json_files)
        
        print(f"📊 Found {len(json_files)} JSON files to validate\n")
        
        # Validate each file
        for i, file_path in enumerate(json_files, 1):
            relative_path = os.path.relpath(file_path, self.repo_path)
            print(f"[{i:3d}/{len(json_files)}] Validating: {relative_path}")
            
            file_result = self.validate_json_file(file_path)
            self.results["file_details"].append(file_result)
            
            if file_result["status"] == "valid":
                self.results["valid_files"] += 1
                if file_result["warnings"]:
                    print(f"    ⚠️  Valid with warnings: {', '.join(file_result['warnings'])}")
                else:
                    print(f"    ✅ Valid")
            else:
                self.results["invalid_files"] += 1
                self.results["errors"].append({
                    "file": relative_path,
                    "error": file_result["error"]
                })
                print(f"    ❌ Invalid: {file_result['error']}")
        
        print(f"\n🎯 === VALIDATION SUMMARY ===")
        print(f"📊 Total files processed: {self.results['total_files']}")
        print(f"✅ Valid files: {self.results['valid_files']}")
        print(f"❌ Invalid files: {self.results['invalid_files']}")
        
        if self.results["invalid_files"] > 0:
            print(f"\n🚨 ISSUES FOUND:")
            for error in self.results["errors"]:
                print(f"  • {error['file']}: {error['error']}")
        
        # Count warnings
        total_warnings = sum(len(f["warnings"]) for f in self.results["file_details"])
        if total_warnings > 0:
            print(f"\n⚠️  Total warnings: {total_warnings}")
        
        return self.results["invalid_files"] == 0
    
    def save_report(self, output_file="json_validation_report.json"):
        """Save detailed validation report"""
        report_path = os.path.join(self.repo_path, output_file)
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(self.results, f, indent=2, ensure_ascii=False)
        
        print(f"\n📄 Detailed report saved to: {output_file}")
        return report_path
    
    def fix_common_issues(self, dry_run=True):
        """Attempt to fix common JSON issues"""
        print(f"\n🔧 {'DRY RUN: ' if dry_run else ''}Attempting to fix common issues...")
        
        fixed_count = 0
        for file_detail in self.results["file_details"]:
            if file_detail["status"] == "invalid":
                file_path = os.path.join(self.repo_path, file_detail["file"])
                if self._try_fix_file(file_path, dry_run):
                    fixed_count += 1
        
        if dry_run:
            print(f"🔍 Would attempt to fix {fixed_count} files")
        else:
            print(f"🔧 Fixed {fixed_count} files")
        
        return fixed_count
    
    def _try_fix_file(self, file_path, dry_run=True):
        """Try to fix common JSON issues in a file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            
            # Fix trailing commas
            content = content.replace(',}', '}').replace(',]', ']')
            
            # Try to parse the fixed content
            json.loads(content)
            
            # If we get here, the fix worked
            if content != original_content:
                if not dry_run:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(content)
                print(f"    🔧 Fixed trailing commas in: {os.path.relpath(file_path, self.repo_path)}")
                return True
            
        except Exception:
            # Fix didn't work
            pass
        
        return False


def main():
    """Main entry point"""
    validator = JSONValidator()
    
    # Validate all files
    success = validator.validate_all_files()
    
    # Save detailed report
    validator.save_report()
    
    # Try to fix issues (dry run first)
    if not success:
        validator.fix_common_issues(dry_run=True)
        
        # Ask if user wants to apply fixes
        print("\n❓ Would you like to apply automatic fixes? (y/N): ", end="", flush=True)
        response = input().lower().strip()
        
        if response in ['y', 'yes']:
            fixed_count = validator.fix_common_issues(dry_run=False)
            if fixed_count > 0:
                print(f"\n🔄 Re-validating after fixes...")
                validator = JSONValidator()  # Fresh instance
                success = validator.validate_all_files()
                validator.save_report("json_validation_report_after_fixes.json")
    
    print(f"\n🎉 JSON validation {'completed successfully' if success else 'found issues'}")
    return 0 if success else 1


if __name__ == "__main__":
    sys.exit(main())