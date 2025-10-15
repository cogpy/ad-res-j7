#!/usr/bin/env python3
"""
Cross-Reference Validation Script
Implementation of Section 5 - Systematic Cross-Referencing Validation

This script validates all cross-references in the systematic cross-referencing implementation
to ensure document links are accurate and complete.
"""

import json
import os
import re
from pathlib import Path

class CrossReferenceValidator:
    def __init__(self, repo_root="/home/runner/work/ad-res-j7/ad-res-j7"):
        self.repo_root = Path(repo_root)
        self.errors = []
        self.warnings = []
        
    def validate_file_exists(self, file_path, context=""):
        """Check if a referenced file exists"""
        full_path = self.repo_root / file_path
        if not full_path.exists():
            self.errors.append(f"Missing file: {file_path} (referenced in {context})")
            return False
        return True
    
    def validate_response_matrix(self):
        """Validate the response matrix JSON and MD files"""
        print("🔍 Validating Response Matrix...")
        
        # Check JSON file exists and is valid
        json_path = "jax-response/analysis-output/response_matrix.json"
        if not self.validate_file_exists(json_path, "response matrix"):
            return
            
        try:
            with open(self.repo_root / json_path, 'r') as f:
                matrix_data = json.load(f)
        except json.JSONDecodeError as e:
            self.errors.append(f"Invalid JSON in response_matrix.json: {e}")
            return
            
        # Check MD file exists
        md_path = "jax-response/analysis-output/response_matrix.md"
        self.validate_file_exists(md_path, "response matrix")
        
        # Validate each entry in the matrix
        for entry in matrix_data:
            ad_para = entry.get("ad_para", "")
            
            # Validate cross-references in each entry
            for cross_ref in entry.get("cross_refs", []):
                doc_path = cross_ref.get("document", "")
                
                # Map document names to actual paths
                if doc_path == "Faucitt_Interdict_Analysis.md":
                    full_doc_path = "jax-response/analysis-output/Faucitt_Interdict_Analysis.md"
                elif doc_path == "comprehensive_reference_index.json":
                    full_doc_path = "jax-response/analysis-output/comprehensive_reference_index.json"
                elif doc_path == "REVISED_Answering_Affidavit_Jax_TRACKED_CHANGES_v5.md":
                    full_doc_path = "jax-response/analysis-output/REVISED_Answering_Affidavit_Jax_TRACKED_CHANGES_v5.md"
                elif doc_path == "RWD_REVENUE_INTEGRITY_ANALYSIS.md":
                    full_doc_path = "jax-response/AD/1-Critical/RWD_REVENUE_INTEGRITY_ANALYSIS.md"
                elif doc_path == "Affidavit_Amendment_Recommendations.md":
                    full_doc_path = "jax-response/analysis-output/Affidavit_Amendment_Recommendations.md"
                else:
                    self.warnings.append(f"Unknown document reference: {doc_path} in AD PARA {ad_para}")
                    continue
                    
                self.validate_file_exists(full_doc_path, f"AD PARA {ad_para} cross-reference")
                
        print(f"✅ Response Matrix validation complete")
    
    def validate_cross_reference_index(self):
        """Validate the cross-reference index"""
        print("🔍 Validating Cross-Reference Index...")
        
        index_path = "jax-response/analysis-output/cross_reference_index.md"
        if not self.validate_file_exists(index_path, "cross-reference index"):
            return
            
        # Check that all referenced analysis documents exist
        analysis_docs = [
            "jax-response/analysis-output/comprehensive_reference_index.json",
            "jax-response/analysis-output/Faucitt_Interdict_Analysis.md", 
            "jax-response/analysis-output/REVISED_Answering_Affidavit_Jax_TRACKED_CHANGES_v5.md",
            "jax-response/analysis-output/Affidavit_Amendment_Recommendations.md",
            "jax-response/analysis-output/comprehensive_legal_analysis.json"
        ]
        
        for doc in analysis_docs:
            self.validate_file_exists(doc, "cross-reference index")
            
        print("✅ Cross-Reference Index validation complete")
    
    def validate_ad_paragraph_files(self):
        """Validate AD paragraph files have been updated with systematic cross-references"""
        print("🔍 Validating AD Paragraph Files...")
        
        critical_paras = [
            "jax-response/AD/1-Critical/PARA_7_2-7_5.md",
            "jax-response/AD/1-Critical/PARA_7_6.md"
        ]
        
        for para_file in critical_paras:
            if not self.validate_file_exists(para_file, "AD paragraph validation"):
                continue
                
            # Check if file contains systematic cross-reference sections
            with open(self.repo_root / para_file, 'r') as f:
                content = f.read()
                
            if "### Systematic Cross-References" not in content:
                self.warnings.append(f"Missing systematic cross-references section in {para_file}")
            
            if "#### Evidence Trail Documentation" not in content:
                self.warnings.append(f"Missing evidence trail documentation in {para_file}")
                
        print("✅ AD Paragraph Files validation complete")
    
    def validate_evidence_cross_reference(self):
        """Validate the existing evidence cross-reference structure"""
        print("🔍 Validating Evidence Cross-Reference...")
        
        evidence_ref = "jax-response/revenue-theft/EVIDENCE_CROSS_REFERENCE.md"
        self.validate_file_exists(evidence_ref, "evidence cross-reference validation")
        
        print("✅ Evidence Cross-Reference validation complete")
    
    def run_validation(self):
        """Run all validation checks"""
        print("🚀 Starting Cross-Reference Validation")
        print("=" * 50)
        
        self.validate_response_matrix()
        self.validate_cross_reference_index()  
        self.validate_ad_paragraph_files()
        self.validate_evidence_cross_reference()
        
        print("\n" + "=" * 50)
        print("📊 Validation Results:")
        
        if self.errors:
            print(f"\n❌ {len(self.errors)} Errors found:")
            for error in self.errors:
                print(f"  • {error}")
        
        if self.warnings:
            print(f"\n⚠️  {len(self.warnings)} Warnings:")
            for warning in self.warnings:
                print(f"  • {warning}")
                
        if not self.errors and not self.warnings:
            print("\n🎉 All cross-references validated successfully!")
            return True
        elif not self.errors:
            print(f"\n✅ Validation passed with {len(self.warnings)} warnings")
            return True
        else:
            print(f"\n💥 Validation failed with {len(self.errors)} errors")
            return False

def main():
    validator = CrossReferenceValidator()
    success = validator.run_validation()
    
    if success:
        print("\n✅ Cross-reference validation completed successfully")
        return 0
    else:
        print("\n❌ Cross-reference validation failed")
        return 1

if __name__ == "__main__":
    exit(main())