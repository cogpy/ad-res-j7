#!/usr/bin/env python3
"""
Date Validation Script for Revenue-Theft, Family-Trust, and Financial-Flows Analyses
Validates all dates in forensic analysis files for Case 2025-137857
"""

import os
import re
import json
from datetime import datetime
from pathlib import Path
from collections import defaultdict

class DateValidator:
    def __init__(self, base_path):
        self.base_path = Path(base_path)
        self.errors = []
        self.warnings = []
        self.info = []
        self.date_patterns = [
            # YYYY-MM-DD format
            (r'\b(\d{4})-(\d{1,2})-(\d{1,2})\b', 'YYYY-MM-DD'),
            # Month DD, YYYY format
            (r'\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),?\s+(\d{4})\b', 'Month DD, YYYY'),
            # DD Month YYYY format
            (r'\b(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})\b', 'DD Month YYYY'),
        ]
        self.month_map = {
            'january': 1, 'february': 2, 'march': 3, 'april': 4,
            'may': 5, 'june': 6, 'july': 7, 'august': 8,
            'september': 9, 'october': 10, 'november': 11, 'december': 12
        }
        self.folder_date_map = {
            'apr': 4, 'may': 5, 'june': 6, 'july': 7, 'aug': 8,
            'mar': 3, 'jan': 1, 'feb': 2, 'sep': 9, 'oct': 10,
            'nov': 11, 'dec': 12
        }
        
    def parse_date(self, date_str, format_type):
        """Parse a date string and return a datetime object or None"""
        try:
            if format_type == 'YYYY-MM-DD':
                match = re.match(r'(\d{4})-(\d{1,2})-(\d{1,2})', date_str)
                if match:
                    year, month, day = int(match.group(1)), int(match.group(2)), int(match.group(3))
                    return datetime(year, month, day)
            elif format_type == 'Month DD, YYYY':
                match = re.match(r'(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),?\s+(\d{4})', date_str)
                if match:
                    month_str, day, year = match.group(1), int(match.group(2)), int(match.group(3))
                    month = self.month_map[month_str.lower()]
                    return datetime(year, month, day)
            elif format_type == 'DD Month YYYY':
                match = re.match(r'(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})', date_str)
                if match:
                    day, month_str, year = int(match.group(1)), match.group(2), int(match.group(3))
                    month = self.month_map[month_str.lower()]
                    return datetime(year, month, day)
        except (ValueError, KeyError) as e:
            return None
        return None
    
    def validate_date_value(self, date_str, format_type, file_path, line_num):
        """Validate that a date string is a valid date"""
        date_obj = self.parse_date(date_str, format_type)
        if date_obj is None:
            self.errors.append({
                'file': str(file_path),
                'line': line_num,
                'date': date_str,
                'issue': f'Invalid date value',
                'format': format_type
            })
            return None
        
        # Check if year is in reasonable range
        if date_obj.year < 2015 or date_obj.year > 2026:
            self.warnings.append({
                'file': str(file_path),
                'line': line_num,
                'date': date_str,
                'issue': f'Date year {date_obj.year} is outside expected range (2015-2026)',
                'format': format_type
            })
        
        return date_obj
    
    def extract_dates_from_file(self, file_path):
        """Extract all dates from a file"""
        dates = []
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                lines = f.readlines()
                for line_num, line in enumerate(lines, 1):
                    for pattern, format_type in self.date_patterns:
                        matches = re.finditer(pattern, line)
                        for match in matches:
                            date_str = match.group(0)
                            date_obj = self.validate_date_value(date_str, format_type, file_path, line_num)
                            if date_obj:
                                dates.append({
                                    'date': date_str,
                                    'date_obj': date_obj,
                                    'line': line_num,
                                    'format': format_type,
                                    'context': line.strip()
                                })
        except Exception as e:
            self.errors.append({
                'file': str(file_path),
                'issue': f'Error reading file: {str(e)}'
            })
        return dates
    
    def validate_folder_date_match(self, folder_name, dates, file_path):
        """Validate that dates in files match their folder names"""
        # Extract date components from folder name (e.g., "14-apr-bank-letter" -> day=14, month=apr)
        folder_date_match = re.match(r'^(\d{1,2})-(jan|feb|mar|apr|may|june|july|aug|sep|oct|nov|dec)', folder_name.lower())
        if not folder_date_match:
            return
        
        expected_day = int(folder_date_match.group(1))
        expected_month = self.folder_date_map.get(folder_date_match.group(2))
        
        # Check if any date in the file matches the folder date
        matching_dates = [d for d in dates if d['date_obj'].day == expected_day and d['date_obj'].month == expected_month]
        
        if not matching_dates:
            self.warnings.append({
                'file': str(file_path),
                'folder': folder_name,
                'issue': f'No dates in file match folder name date (expected day={expected_day}, month={expected_month})'
            })
        else:
            self.info.append({
                'file': str(file_path),
                'folder': folder_name,
                'message': f'Found {len(matching_dates)} date(s) matching folder date'
            })
    
    def validate_chronological_order(self, analysis_type, all_dates):
        """Validate that dates are in logical chronological order within an analysis"""
        # Sort dates by their datetime object
        sorted_dates = sorted(all_dates, key=lambda x: x['date_obj'])
        
        # Check for any major gaps or anomalies
        for i in range(len(sorted_dates) - 1):
            days_diff = (sorted_dates[i+1]['date_obj'] - sorted_dates[i]['date_obj']).days
            if days_diff < 0:
                self.errors.append({
                    'analysis': analysis_type,
                    'issue': 'Dates are not in chronological order',
                    'date1': sorted_dates[i]['date'],
                    'date2': sorted_dates[i+1]['date']
                })
    
    def validate_analysis_directory(self, analysis_path, analysis_name):
        """Validate all dates in an analysis directory"""
        print(f"\n{'='*80}")
        print(f"Validating {analysis_name} Analysis")
        print(f"{'='*80}")
        
        all_dates = []
        
        # Walk through all files in the analysis directory
        for root, dirs, files in os.walk(analysis_path):
            for file in files:
                if file.endswith('.md') or file.endswith('.json'):
                    file_path = Path(root) / file
                    rel_path = file_path.relative_to(self.base_path)
                    
                    print(f"Checking: {rel_path}")
                    
                    dates = self.extract_dates_from_file(file_path)
                    if dates:
                        all_dates.extend([{**d, 'file': str(rel_path)} for d in dates])
                        print(f"  Found {len(dates)} date(s)")
                        
                        # Validate folder-date match
                        folder_name = Path(root).name
                        self.validate_folder_date_match(folder_name, dates, rel_path)
        
        # Validate chronological order
        if all_dates:
            self.validate_chronological_order(analysis_name, all_dates)
            print(f"\nTotal dates found: {len(all_dates)}")
        
        return all_dates
    
    def generate_report(self):
        """Generate a comprehensive validation report"""
        report = {
            'summary': {
                'errors': len(self.errors),
                'warnings': len(self.warnings),
                'info': len(self.info),
                'status': 'PASS' if len(self.errors) == 0 else 'FAIL'
            },
            'errors': self.errors,
            'warnings': self.warnings,
            'info': self.info
        }
        return report
    
    def print_report(self):
        """Print a human-readable validation report"""
        print(f"\n{'='*80}")
        print("DATE VALIDATION REPORT")
        print(f"{'='*80}")
        
        print(f"\nSummary:")
        print(f"  Errors:   {len(self.errors)}")
        print(f"  Warnings: {len(self.warnings)}")
        print(f"  Info:     {len(self.info)}")
        print(f"  Status:   {'✓ PASS' if len(self.errors) == 0 else '✗ FAIL'}")
        
        if self.errors:
            print(f"\n{'='*80}")
            print("ERRORS:")
            print(f"{'='*80}")
            for i, error in enumerate(self.errors, 1):
                print(f"\n{i}. {error.get('issue', 'Unknown error')}")
                for key, value in error.items():
                    if key != 'issue':
                        print(f"   {key}: {value}")
        
        if self.warnings:
            print(f"\n{'='*80}")
            print("WARNINGS:")
            print(f"{'='*80}")
            for i, warning in enumerate(self.warnings, 1):
                print(f"\n{i}. {warning.get('issue', 'Unknown warning')}")
                for key, value in warning.items():
                    if key != 'issue':
                        print(f"   {key}: {value}")
        
        if self.info and len(self.info) <= 20:
            print(f"\n{'='*80}")
            print("INFO:")
            print(f"{'='*80}")
            for i, info in enumerate(self.info, 1):
                print(f"\n{i}. {info.get('message', 'Info')}")
                for key, value in info.items():
                    if key != 'message':
                        print(f"   {key}: {value}")

def main():
    base_path = Path(__file__).parent.parent
    jax_response_path = base_path / 'jax-response'
    
    validator = DateValidator(base_path)
    
    # Validate each analysis directory
    analyses = [
        ('revenue-theft', 'Revenue Theft'),
        ('family-trust', 'Family Trust'),
        ('financial-flows', 'Financial Flows')
    ]
    
    all_analysis_dates = {}
    
    for dir_name, display_name in analyses:
        analysis_path = jax_response_path / dir_name
        if analysis_path.exists():
            dates = validator.validate_analysis_directory(analysis_path, display_name)
            all_analysis_dates[dir_name] = dates
        else:
            print(f"WARNING: Analysis directory not found: {analysis_path}")
    
    # Print and save report
    validator.print_report()
    
    # Save JSON report
    report_path = base_path / 'date_validation_report.json'
    with open(report_path, 'w') as f:
        json.dump(validator.generate_report(), f, indent=2, default=str)
    print(f"\nDetailed report saved to: {report_path}")
    
    # Return exit code based on validation status
    return 0 if len(validator.errors) == 0 else 1

if __name__ == '__main__':
    exit(main())
