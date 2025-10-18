#!/usr/bin/env python3
"""
Date Format Fix Script
Automatically converts dates in forensic analyses to YYYY-MM-DD format

This script fixes all date format violations found in revenue-theft, 
family-trust, and financial-flows analyses to comply with the 
YYYY-MM-DD standard format requirement.
"""

import os
import re
import json
from pathlib import Path
from typing import List, Dict, Tuple

class DateFixer:
    def __init__(self, repo_root="/home/runner/work/ad-res-j7/ad-res-j7"):
        self.repo_root = Path(repo_root)
        self.fixes_applied = []
        self.errors = []
        
        # Directories to fix
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
    
    def convert_date_format(self, text: str) -> Tuple[str, int]:
        """Convert date formats to YYYY-MM-DD and return modified text with count of fixes"""
        fixes_count = 0
        
        # Pattern 1: Month DD, YYYY -> YYYY-MM-DD
        def replace_month_day_year(match):
            nonlocal fixes_count
            month_name = match.group(1)
            day = match.group(2)
            year = match.group(3)
            
            month_num = self.month_map.get(month_name.capitalize())
            if month_num:
                fixes_count += 1
                return f"{year}-{month_num}-{day.zfill(2)}"
            return match.group(0)  # Return original if month not found
        
        # Pattern 2: DD Month YYYY -> YYYY-MM-DD
        def replace_day_month_year(match):
            nonlocal fixes_count
            day = match.group(1)
            month_name = match.group(2)
            year = match.group(3)
            
            month_num = self.month_map.get(month_name.capitalize())
            if month_num:
                fixes_count += 1
                return f"{year}-{month_num}-{day.zfill(2)}"
            return match.group(0)  # Return original if month not found
        
        # Pattern: Month DD, YYYY
        text = re.sub(
            r'\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),\s+(\d{4})\b',
            replace_month_day_year,
            text,
            flags=re.IGNORECASE
        )
        
        # Pattern: Month DD YYYY (no comma)
        text = re.sub(
            r'\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})\s+(\d{4})\b',
            replace_month_day_year,
            text,
            flags=re.IGNORECASE
        )
        
        # Pattern: DD Month YYYY
        text = re.sub(
            r'\b(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})\b',
            replace_day_month_year,
            text,
            flags=re.IGNORECASE
        )
        
        # Pattern: Abbreviated months
        def replace_abbrev_month(match):
            nonlocal fixes_count
            month_abbr = match.group(1)
            day = match.group(2)
            year = match.group(3)
            
            month_num = self.month_map.get(month_abbr.capitalize())
            if month_num:
                fixes_count += 1
                return f"{year}-{month_num}-{day.zfill(2)}"
            return match.group(0)
        
        # Pattern: DD Abbreviated Month YYYY
        def replace_day_abbrev_month(match):
            nonlocal fixes_count
            day = match.group(1)
            month_abbr = match.group(2)
            year = match.group(3)
            
            month_num = self.month_map.get(month_abbr.capitalize())
            if month_num:
                fixes_count += 1
                return f"{year}-{month_num}-{day.zfill(2)}"
            return match.group(0)
        
        # Pattern: Mon DD, YYYY
        text = re.sub(
            r'\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2}),\s+(\d{4})\b',
            replace_abbrev_month,
            text,
            flags=re.IGNORECASE
        )
        
        # Pattern: Mon DD YYYY (no comma)
        text = re.sub(
            r'\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2})\s+(\d{4})\b',
            replace_abbrev_month,
            text,
            flags=re.IGNORECASE
        )
        
        # Pattern: DD Mon YYYY
        text = re.sub(
            r'\b(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})\b',
            replace_day_abbrev_month,
            text,
            flags=re.IGNORECASE
        )
        
        return text, fixes_count
    
    def fix_file(self, file_path: Path) -> Dict:
        """Fix date formats in a single file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                original_content = f.read()
            
            fixed_content, fixes_count = self.convert_date_format(original_content)
            
            if fixes_count > 0:
                # Write the fixed content back
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(fixed_content)
                
                return {
                    'file': str(file_path.relative_to(self.repo_root)),
                    'fixes_applied': fixes_count,
                    'success': True
                }
            else:
                return {
                    'file': str(file_path.relative_to(self.repo_root)),
                    'fixes_applied': 0,
                    'success': True
                }
                
        except Exception as e:
            error_msg = f"Error processing {file_path}: {e}"
            self.errors.append(error_msg)
            return {
                'file': str(file_path.relative_to(self.repo_root)),
                'fixes_applied': 0,
                'success': False,
                'error': str(e)
            }
    
    def fix_analysis_directories(self) -> Dict:
        """Fix dates in all forensic analysis directories"""
        print("🔧 Fixing date formats in forensic analysis directories...")
        
        total_files_processed = 0
        total_fixes_applied = 0
        results = []
        
        for analysis_dir in self.analysis_dirs:
            dir_path = self.repo_root / analysis_dir
            
            if not dir_path.exists():
                print(f"⚠️  Directory not found: {analysis_dir}")
                continue
                
            print(f"\n📁 Processing {analysis_dir}...")
            
            # Process all markdown and json files
            for file_pattern in ['**/*.md', '**/*.json']:
                for file_path in dir_path.glob(file_pattern):
                    result = self.fix_file(file_path)
                    results.append(result)
                    total_files_processed += 1
                    
                    if result['success']:
                        fixes_count = result['fixes_applied']
                        total_fixes_applied += fixes_count
                        if fixes_count > 0:
                            print(f"   ✅ {file_path.name}: {fixes_count} dates fixed")
                        else:
                            print(f"   ⏭️  {file_path.name}: no dates to fix")
                    else:
                        print(f"   ❌ {file_path.name}: {result.get('error', 'Unknown error')}")
        
        return {
            'total_files_processed': total_files_processed,
            'total_fixes_applied': total_fixes_applied,
            'results': results,
            'errors': self.errors
        }
    
    def generate_fix_report(self, fix_results: Dict) -> str:
        """Generate a report of applied fixes"""
        report = []
        report.append("# Date Format Fix Report")
        report.append("=" * 50)
        report.append("")
        
        total_files = fix_results['total_files_processed']
        total_fixes = fix_results['total_fixes_applied']
        
        report.append(f"**Files Processed:** {total_files}")
        report.append(f"**Total Date Fixes Applied:** {total_fixes}")
        report.append("")
        
        if total_fixes > 0:
            report.append("## Files with Applied Fixes")
            for result in fix_results['results']:
                if result['success'] and result['fixes_applied'] > 0:
                    report.append(f"- **{result['file']}**: {result['fixes_applied']} fixes")
            report.append("")
        
        if fix_results['errors']:
            report.append("## Errors")
            for error in fix_results['errors']:
                report.append(f"❌ {error}")
            report.append("")
        
        if total_fixes == 0:
            report.append("ℹ️  No date format violations found - all dates are already in YYYY-MM-DD format!")
        else:
            report.append("✅ All date format violations have been corrected to YYYY-MM-DD format.")
        
        return "\n".join(report)
    
    def run_fixes(self) -> bool:
        """Run complete date format fixes"""
        print("🚀 Starting automatic date format fixes...")
        print("=" * 60)
        
        fix_results = self.fix_analysis_directories()
        
        # Generate and save report
        report = self.generate_fix_report(fix_results)
        
        report_path = self.repo_root / "date_fix_report.md"
        with open(report_path, 'w') as f:
            f.write(report)
        
        print(f"\n📋 Fix report saved to: {report_path}")
        print(f"\n📊 Summary:")
        print(f"   - Files processed: {fix_results['total_files_processed']}")
        print(f"   - Total fixes applied: {fix_results['total_fixes_applied']}")
        print(f"   - Errors: {len(fix_results['errors'])}")
        
        if fix_results['errors']:
            print("\n❌ Some errors occurred:")
            for error in fix_results['errors']:
                print(f"   {error}")
            return False
        
        print(f"\n✅ Date format fixes completed successfully!")
        return True

def main():
    fixer = DateFixer()
    success = fixer.run_fixes()
    
    if success:
        print("\n✅ Date format fix completed successfully")
        return 0
    else:
        print("\n❌ Date format fix completed with errors")
        return 1

if __name__ == "__main__":
    exit(main())