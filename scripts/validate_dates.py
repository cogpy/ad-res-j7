#!/usr/bin/env python3
"""
Date Format Validation Script
Validates all dates in revenue-theft, family-trust, and financial-flows analyses

This script validates that all dates follow the consistent YYYY-MM-DD format
as required by the todo/Repository_Status_and_Critical_Evidence_Collection.md
"""

import os
import re
import json
from pathlib import Path
from typing import List, Dict, Tuple

class DateValidator:
    def __init__(self, repo_root="/home/runner/work/ad-res-j7/ad-res-j7"):
        self.repo_root = Path(repo_root)
        self.errors = []
        self.warnings = []
        self.fixes_applied = []
        
        # Date patterns to validate
        self.target_format = r'\d{4}-\d{2}-\d{2}'  # YYYY-MM-DD
        
        # Common problematic date patterns to identify
        self.problematic_patterns = [
            r'(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}',  # Month DD, YYYY or Month DD YYYY
            r'\d{1,2}\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}',  # DD Month YYYY
            r'(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},?\s+\d{4}',  # Abbreviated months
            r'\d{1,2}/\d{1,2}/\d{4}',  # MM/DD/YYYY or DD/MM/YYYY
            r'\d{1,2}-\d{1,2}-\d{4}',  # MM-DD-YYYY or DD-MM-YYYY (not YYYY-MM-DD)
        ]
        
        # Directories to analyze
        self.analysis_dirs = [
            'jax-response/revenue-theft',
            'jax-response/family-trust',  
            'jax-response/financial-flows'
        ]
        
        # Month name to number mapping
        self.month_map = {
            'January': '01', 'February': '02', 'March': '03', 'April': '04',
            'May': '05', 'June': '06', 'July': '07', 'August': '08',
            'September': '09', 'October': '10', 'November': '11', 'December': '12',
            'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
            'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
        }
    
    def find_date_violations(self, file_path: Path) -> List[Dict]:
        """Find date format violations in a file"""
        violations = []
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                lines = content.split('\n')
                
            for line_num, line in enumerate(lines, 1):
                for pattern in self.problematic_patterns:
                    matches = re.finditer(pattern, line, re.IGNORECASE)
                    for match in matches:
                        violations.append({
                            'file': str(file_path.relative_to(self.repo_root)),
                            'line_number': line_num,
                            'line_content': line.strip(),
                            'matched_text': match.group(),
                            'start_pos': match.start(),
                            'end_pos': match.end(),
                            'pattern': pattern
                        })
                        
        except Exception as e:
            self.errors.append(f"Error reading {file_path}: {e}")
            
        return violations
    
    def convert_date_to_standard(self, date_text: str) -> str:
        """Convert various date formats to YYYY-MM-DD"""
        date_text = date_text.strip()
        
        # Pattern: Month DD, YYYY or Month DD YYYY
        pattern1 = r'(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),?\s+(\d{4})'
        match = re.match(pattern1, date_text, re.IGNORECASE)
        if match:
            month_name, day, year = match.groups()
            month_num = self.month_map.get(month_name.capitalize())
            if month_num:
                return f"{year}-{month_num}-{day.zfill(2)}"
        
        # Pattern: DD Month YYYY
        pattern2 = r'(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})'
        match = re.match(pattern2, date_text, re.IGNORECASE)
        if match:
            day, month_name, year = match.groups()
            month_num = self.month_map.get(month_name.capitalize())
            if month_num:
                return f"{year}-{month_num}-{day.zfill(2)}"
        
        # Pattern: Abbreviated months
        pattern3 = r'(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2}),?\s+(\d{4})'
        match = re.match(pattern3, date_text, re.IGNORECASE)
        if match:
            month_abbr, day, year = match.groups()
            month_num = self.month_map.get(month_abbr.capitalize())
            if month_num:
                return f"{year}-{month_num}-{day.zfill(2)}"
        
        return date_text  # Return original if no pattern matches
    
    def validate_analysis_directories(self) -> Dict:
        """Validate dates in all forensic analysis directories"""
        print("🔍 Validating dates in forensic analysis directories...")
        
        all_violations = []
        
        for analysis_dir in self.analysis_dirs:
            dir_path = self.repo_root / analysis_dir
            
            if not dir_path.exists():
                self.warnings.append(f"Directory not found: {analysis_dir}")
                continue
                
            print(f"\n📁 Analyzing {analysis_dir}...")
            
            # Find all markdown and json files
            for file_pattern in ['**/*.md', '**/*.json']:
                for file_path in dir_path.glob(file_pattern):
                    violations = self.find_date_violations(file_path)
                    all_violations.extend(violations)
        
        return {
            'total_violations': len(all_violations),
            'violations_by_file': self._group_violations_by_file(all_violations),
            'all_violations': all_violations
        }
    
    def _group_violations_by_file(self, violations: List[Dict]) -> Dict:
        """Group violations by file for reporting"""
        by_file = {}
        for violation in violations:
            file_path = violation['file']
            if file_path not in by_file:
                by_file[file_path] = []
            by_file[file_path].append(violation)
        return by_file
    
    def generate_report(self, validation_results: Dict) -> str:
        """Generate a detailed validation report"""
        report = []
        report.append("# Date Format Validation Report")
        report.append("=" * 50)
        report.append("")
        
        total_violations = validation_results['total_violations']
        report.append(f"**Total Date Format Violations Found:** {total_violations}")
        report.append("")
        
        if total_violations == 0:
            report.append("✅ All dates are properly formatted in YYYY-MM-DD format!")
        else:
            report.append("❌ Date format violations found:")
            report.append("")
            
            violations_by_file = validation_results['violations_by_file']
            for file_path, violations in violations_by_file.items():
                report.append(f"## {file_path}")
                report.append(f"Violations: {len(violations)}")
                report.append("")
                
                for violation in violations:
                    report.append(f"- **Line {violation['line_number']}:** `{violation['matched_text']}`")
                    report.append(f"  - Context: `{violation['line_content'][:100]}...`")
                    suggested_fix = self.convert_date_to_standard(violation['matched_text'])
                    if suggested_fix != violation['matched_text']:
                        report.append(f"  - Suggested fix: `{suggested_fix}`")
                    report.append("")
        
        if self.warnings:
            report.append("## Warnings")
            for warning in self.warnings:
                report.append(f"⚠️  {warning}")
            report.append("")
        
        if self.errors:
            report.append("## Errors")
            for error in self.errors:
                report.append(f"❌ {error}")
        
        return "\n".join(report)
    
    def run_validation(self) -> bool:
        """Run complete date validation"""
        print("🚀 Starting date format validation...")
        print("=" * 60)
        
        validation_results = self.validate_analysis_directories()
        
        # Generate and save report
        report = self.generate_report(validation_results)
        
        report_path = self.repo_root / "date_validation_report.md"
        with open(report_path, 'w') as f:
            f.write(report)
        
        print(f"\n📋 Validation report saved to: {report_path}")
        print(f"\n📊 Summary:")
        print(f"   - Total violations: {validation_results['total_violations']}")
        print(f"   - Files with violations: {len(validation_results['violations_by_file'])}")
        print(f"   - Warnings: {len(self.warnings)}")
        print(f"   - Errors: {len(self.errors)}")
        
        # Print summary to console
        if validation_results['total_violations'] == 0:
            print("\n✅ All dates are properly formatted!")
            return True
        else:
            print(f"\n❌ {validation_results['total_violations']} date format violations found")
            print("📋 Check date_validation_report.md for details")
            return False

def main():
    validator = DateValidator()
    success = validator.run_validation()
    
    if success:
        print("\n✅ Date validation completed successfully")
        return 0
    else:
        print("\n❌ Date validation failed - violations found")
        return 1

if __name__ == "__main__":
    exit(main())