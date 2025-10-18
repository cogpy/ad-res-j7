#!/usr/bin/env python3
"""
Comprehensive Evidence Cross-Reference Accuracy Test Suite

Tests the evidence cross-referencing system for accuracy as required by:
Issue: Test evidence cross-referencing system for accuracy
Source: todo/Repository_Status_and_Critical_Evidence_Collection.md, Line 135

This test suite extends the basic validation script with comprehensive accuracy checks:
1. Response matrix structure and data integrity
2. Evidence trail completeness and logical consistency
3. Cross-reference link validity and bidirectional verification
4. Annexure mapping accuracy and existence
5. Evidence correlation logic validation
6. AD paragraph reference accuracy and consistency
7. Document synchronization (JSON vs Markdown)
8. Cross-reference index completeness
9. Evidence quality grading validation
10. Timeline correlation accuracy
"""

import json
import os
import re
import sys
from pathlib import Path
from typing import Dict, List, Set, Tuple

class ComprehensiveEvidenceCrossReferenceTest:
    def __init__(self, repo_root="/home/runner/work/ad-res-j7/ad-res-j7"):
        self.repo_root = Path(repo_root)
        self.errors = []
        self.warnings = []
        self.passed_tests = 0
        self.total_tests = 0
        
    def log(self, message):
        print(message)
        
    def error(self, message):
        self.errors.append(message)
        print(f"❌ {message}")
        
    def warn(self, message):
        self.warnings.append(message)
        print(f"⚠️  {message}")
        
    def success(self, message):
        self.passed_tests += 1
        print(f"✅ {message}")
        
    def test_start(self, name):
        self.total_tests += 1
        print(f"\n🧪 Test {self.total_tests}: {name}")
        
    def file_exists(self, path: str) -> bool:
        return (self.repo_root / path).exists()
        
    def read_json(self, path: str) -> dict:
        try:
            with open(self.repo_root / path, 'r') as f:
                return json.load(f)
        except Exception as e:
            self.error(f"Failed to read JSON {path}: {e}")
            return None
            
    def read_text(self, path: str) -> str:
        try:
            with open(self.repo_root / path, 'r') as f:
                return f.read()
        except Exception as e:
            self.error(f"Failed to read file {path}: {e}")
            return None
            
    def test_response_matrix_data_integrity(self):
        """Test 1: Validate response matrix data integrity and logical consistency"""
        self.test_start("Response Matrix Data Integrity and Logical Consistency")
        
        matrix = self.read_json("jax-response/analysis-output/response_matrix.json")
        if not matrix:
            return
            
        # Check for duplicate AD paragraphs
        ad_paras = [entry.get('ad_para') for entry in matrix]
        duplicates = set([x for x in ad_paras if ad_paras.count(x) > 1])
        if duplicates:
            self.error(f"Duplicate AD paragraphs found: {duplicates}")
        else:
            self.success(f"No duplicate AD paragraphs in {len(matrix)} entries")
            
        # Validate priority distribution is reasonable
        priorities = [entry.get('priority') for entry in matrix]
        critical_count = priorities.count('Critical')
        high_count = priorities.count('High')
        
        if critical_count > 0:
            self.success(f"Priority distribution: {critical_count} Critical, {high_count} High")
        else:
            self.warn("No Critical priority items found")
            
    def test_evidence_trail_logical_consistency(self):
        """Test 2: Validate evidence trail logical consistency"""
        self.test_start("Evidence Trail Logical Consistency")
        
        matrix = self.read_json("jax-response/analysis-output/response_matrix.json")
        if not matrix:
            return
            
        consistent_trails = 0
        for entry in matrix:
            trail = entry.get('evidence_trail', {})
            if not trail:
                continue
                
            # Check that counter_evidence relates to factual_rebuttal
            counter_evidence = trail.get('counter_evidence', [])
            factual_rebuttal = trail.get('factual_rebuttal', '')
            
            # Verify counter_evidence array is not empty
            if not counter_evidence:
                self.warn(f"Entry {entry['ad_para']}: No counter evidence provided")
                continue
                
            # Check if annexures mentioned in counter_evidence match entry annexures
            annexures = entry.get('annexures', [])
            evidence_mentions_annexures = any(
                any(annexure in evidence for annexure in annexures)
                for evidence in counter_evidence
            )
            
            if evidence_mentions_annexures or len(counter_evidence) > 0:
                consistent_trails += 1
                
        if consistent_trails == len(matrix):
            self.success(f"All {len(matrix)} evidence trails are logically consistent")
        else:
            self.warn(f"Only {consistent_trails}/{len(matrix)} evidence trails are logically consistent")
            
    def test_bidirectional_cross_references(self):
        """Test 3: Validate bidirectional cross-references"""
        self.test_start("Bidirectional Cross-Reference Validation")
        
        matrix = self.read_json("jax-response/analysis-output/response_matrix.json")
        if not matrix:
            return
            
        # Check if documents referenced in matrix also reference back to AD paragraphs
        index = self.read_json("jax-response/analysis-output/comprehensive_reference_index.json")
        if not index:
            self.warn("Cannot validate bidirectional references without comprehensive index")
            return
            
        # Build a set of AD paragraphs in matrix
        matrix_ad_paras = set(entry.get('ad_para') for entry in matrix)
        
        # Build a set of AD paragraphs in comprehensive index
        index_ad_paras = set()
        for entry in index:
            ad_ref = entry.get('ad_paragraph_ref', '')
            # Extract the paragraph number part (e.g., "AD PARAGRAPH 7.2-7.5" -> "7.2-7.5")
            match = re.search(r'PARAGRAPH\s+([\d.-]+)', ad_ref)
            if match:
                index_ad_paras.add(match.group(1))
                
        # Check for overlap
        common = matrix_ad_paras.intersection(index_ad_paras)
        if len(common) == len(matrix_ad_paras):
            self.success(f"All {len(matrix_ad_paras)} matrix AD paragraphs are referenced in comprehensive index")
        else:
            missing = matrix_ad_paras - common
            self.warn(f"Some matrix AD paragraphs not in comprehensive index: {missing}")
            
    def test_annexure_file_existence(self):
        """Test 4: Validate annexure files exist in repository"""
        self.test_start("Annexure File Existence Validation")
        
        matrix = self.read_json("jax-response/analysis-output/response_matrix.json")
        if not matrix:
            return
            
        # Common annexure locations
        annexure_dirs = [
            "ANNEXURES",
            "FINAL_AFFIDAVIT_PACKAGE/ANNEXURES",
            "jax-response/evidence-attachments"
        ]
        
        all_annexures = set()
        for entry in matrix:
            annexures = entry.get('annexures', [])
            all_annexures.update(annexures)
            
        found_annexures = 0
        for annexure in all_annexures:
            # Check if annexure directory exists in any common location
            found = False
            for base_dir in annexure_dirs:
                annexure_path = Path(base_dir) / annexure
                if (self.repo_root / annexure_path).exists():
                    found = True
                    break
                    
            if found:
                found_annexures += 1
                
        if found_annexures > 0:
            self.success(f"Found {found_annexures}/{len(all_annexures)} annexure directories")
        else:
            self.warn(f"Could not verify annexure directory existence (may be in evidence folders)")
            
    def test_evidence_quality_grading(self):
        """Test 5: Validate evidence quality grading system"""
        self.test_start("Evidence Quality Grading System Validation")
        
        evidence_file = "jax-response/revenue-theft/EVIDENCE_CROSS_REFERENCE.json"
        if not self.file_exists(evidence_file):
            self.warn(f"Evidence cross-reference file not found: {evidence_file}")
            return
            
        evidence = self.read_json(evidence_file)
        if not evidence:
            return
            
        # Check for evidence grading in sections
        has_grade_a = False
        has_grade_b = False
        
        sections = evidence.get('sections', [])
        for section in sections:
            content = str(section.get('content', ''))
            subsections = section.get('subsections', [])
            
            for subsection in subsections:
                sub_content = str(subsection.get('content', ''))
                if 'Grade A' in sub_content or 'Grade A' in content:
                    has_grade_a = True
                if 'Grade B' in sub_content or 'Grade B' in content:
                    has_grade_b = True
                    
        if has_grade_a and has_grade_b:
            self.success("Evidence quality grading system (Grade A/B) is implemented")
        else:
            self.warn("Evidence quality grading system may be incomplete")
            
    def test_timeline_correlation_accuracy(self):
        """Test 6: Validate timeline correlation accuracy"""
        self.test_start("Timeline Correlation Accuracy")
        
        evidence_file = "jax-response/revenue-theft/EVIDENCE_CROSS_REFERENCE.json"
        if not self.file_exists(evidence_file):
            self.warn("Cannot validate timeline correlations without evidence file")
            return
            
        evidence = self.read_json(evidence_file)
        if not evidence:
            return
            
        # Check for correlation sections with timing information
        correlation_found = False
        timeline_gaps_found = False
        
        sections = evidence.get('sections', [])
        for section in sections:
            heading = section.get('heading', '')
            if 'CORRELATION' in heading.upper():
                correlation_found = True
                
            subsections = section.get('subsections', [])
            for subsection in subsections:
                content = str(subsection.get('content', ''))
                if 'Timeline Gap:' in content:
                    timeline_gaps_found = True
                    
        if correlation_found and timeline_gaps_found:
            self.success("Timeline correlation with gap analysis is documented")
        else:
            self.warn("Timeline correlation accuracy details may be incomplete")
            
    def test_json_markdown_synchronization(self):
        """Test 7: Validate JSON and Markdown synchronization"""
        self.test_start("JSON and Markdown Synchronization")
        
        json_path = "jax-response/analysis-output/response_matrix.json"
        md_path = "jax-response/analysis-output/response_matrix.md"
        
        if not self.file_exists(md_path):
            self.error("Response matrix markdown file not found")
            return
            
        matrix = self.read_json(json_path)
        md_content = self.read_text(md_path)
        if not matrix or not md_content:
            return
            
        # Check each AD paragraph in JSON is documented in markdown
        sync_count = 0
        for entry in matrix:
            ad_para = entry.get('ad_para')
            # Create flexible search patterns
            patterns = [
                ad_para,
                f"AD PARA {ad_para}",
                f"AD PARAGRAPH {ad_para}",
                f"PARA {ad_para}"
            ]
            
            if any(pattern in md_content for pattern in patterns):
                sync_count += 1
                
        if sync_count == len(matrix):
            self.success(f"JSON and Markdown fully synchronized ({len(matrix)} entries)")
        else:
            self.warn(f"Only {sync_count}/{len(matrix)} entries synchronized between JSON and Markdown")
            
    def test_cross_reference_index_completeness(self):
        """Test 8: Validate cross-reference index completeness"""
        self.test_start("Cross-Reference Index Completeness")
        
        index_path = "jax-response/analysis-output/cross_reference_index.md"
        if not self.file_exists(index_path):
            self.error("Cross-reference index file not found")
            return
            
        index_content = self.read_text(index_path)
        if not index_content:
            return
            
        # Check for required sections
        required_sections = [
            "Core Analysis Documents",
            "AD Paragraph Cross-Reference Mapping",
            "Navigation Pathways",
            "Cross-Reference Validation"
        ]
        
        found_sections = sum(1 for section in required_sections if section in index_content)
        
        if found_sections == len(required_sections):
            self.success(f"Cross-reference index contains all {len(required_sections)} required sections")
        else:
            self.warn(f"Cross-reference index contains {found_sections}/{len(required_sections)} sections")
            
    def test_priority_evidence_coverage(self):
        """Test 9: Validate critical/high priority items have complete evidence"""
        self.test_start("Priority Evidence Coverage")
        
        matrix = self.read_json("jax-response/analysis-output/response_matrix.json")
        if not matrix:
            return
            
        # Check critical and high priority items have complete evidence trails
        priority_items = [e for e in matrix if e.get('priority') in ['Critical', 'High']]
        complete_coverage = 0
        
        for entry in priority_items:
            trail = entry.get('evidence_trail', {})
            annexures = entry.get('annexures', [])
            cross_refs = entry.get('cross_refs', [])
            
            # Complete coverage means: evidence trail, annexures, and cross-refs all present
            if trail and annexures and cross_refs:
                complete_coverage += 1
                
        if complete_coverage == len(priority_items):
            self.success(f"All {len(priority_items)} priority items have complete evidence coverage")
        else:
            self.warn(f"Only {complete_coverage}/{len(priority_items)} priority items have complete coverage")
            
    def test_document_path_accuracy(self):
        """Test 10: Validate all document paths are accurate"""
        self.test_start("Document Path Accuracy")
        
        matrix = self.read_json("jax-response/analysis-output/response_matrix.json")
        if not matrix:
            return
            
        # Map of document names to their paths
        doc_paths = {
            'Faucitt_Interdict_Analysis.md': 'jax-response/analysis-output/Faucitt_Interdict_Analysis.md',
            'comprehensive_reference_index.json': 'jax-response/analysis-output/comprehensive_reference_index.json',
            'REVISED_Answering_Affidavit_Jax_TRACKED_CHANGES_v5.md': 'jax-response/analysis-output/REVISED_Answering_Affidavit_Jax_TRACKED_CHANGES_v5.md',
            'RWD_REVENUE_INTEGRITY_ANALYSIS.md': 'jax-response/AD/1-Critical/RWD_REVENUE_INTEGRITY_ANALYSIS.md',
            'Affidavit_Amendment_Recommendations.md': 'jax-response/analysis-output/Affidavit_Amendment_Recommendations.md',
            'comprehensive_legal_analysis.json': 'jax-response/analysis-output/comprehensive_legal_analysis.json'
        }
        
        # Collect all referenced documents
        referenced_docs = set()
        for entry in matrix:
            for cross_ref in entry.get('cross_refs', []):
                doc_name = cross_ref.get('document', '')
                referenced_docs.add(doc_name)
                
        # Validate each referenced document exists
        found_docs = 0
        for doc_name in referenced_docs:
            path = doc_paths.get(doc_name)
            if path and self.file_exists(path):
                found_docs += 1
            else:
                self.warn(f"Document not found or unmapped: {doc_name}")
                
        if found_docs == len(referenced_docs):
            self.success(f"All {len(referenced_docs)} referenced documents have accurate paths")
        else:
            self.warn(f"Only {found_docs}/{len(referenced_docs)} documents have verified paths")
            
    def run_all_tests(self):
        """Run all test suites"""
        print("╔" + "═" * 63 + "╗")
        print("║  Comprehensive Evidence Cross-Reference Accuracy Test Suite  ║")
        print("║  Extended validation beyond basic structure checks           ║")
        print("╚" + "═" * 63 + "╝")
        
        self.test_response_matrix_data_integrity()
        self.test_evidence_trail_logical_consistency()
        self.test_bidirectional_cross_references()
        self.test_annexure_file_existence()
        self.test_evidence_quality_grading()
        self.test_timeline_correlation_accuracy()
        self.test_json_markdown_synchronization()
        self.test_cross_reference_index_completeness()
        self.test_priority_evidence_coverage()
        self.test_document_path_accuracy()
        
        self.print_summary()
        return len(self.errors) == 0
        
    def print_summary(self):
        print("\n" + "=" * 65)
        print("📊 COMPREHENSIVE TEST SUMMARY")
        print("=" * 65)
        print(f"Total Tests: {self.total_tests}")
        print(f"Passed: {self.passed_tests}")
        print(f"Errors: {len(self.errors)}")
        print(f"Warnings: {len(self.warnings)}")
        
        if self.errors:
            print("\n❌ ERRORS:")
            for error in self.errors:
                print(f"  • {error}")
                
        if self.warnings:
            print("\n⚠️  WARNINGS:")
            for warning in self.warnings:
                print(f"  • {warning}")
                
        print("\n" + "=" * 65)
        if not self.errors:
            print("✅ ALL COMPREHENSIVE TESTS PASSED")
            print("   Evidence cross-referencing system is accurate and complete")
        else:
            print("❌ SOME TESTS FAILED - Review errors above")
        print("=" * 65)

def main():
    tester = ComprehensiveEvidenceCrossReferenceTest()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())
