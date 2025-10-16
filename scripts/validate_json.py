#!/usr/bin/env python3
"""
JSON Validation Script for ad-res-j7 repository
Ensures all JSON files are properly formatted and parseable
"""

import json
import os
import sys
from pathlib import Path

def validate_json_file(file_path):
    """Validate a single JSON file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read().strip()
            
        if not content:
            return False, "Empty file"
            
        json.loads(content)
        return True, "Valid JSON"
        
    except json.JSONDecodeError as e:
        return False, f"JSON Parse Error: {e}"
    except UnicodeDecodeError as e:
        return False, f"Unicode Error: {e}"
    except Exception as e:
        return False, f"Unexpected Error: {e}"

def find_json_files(root_dir):
    """Find all JSON files in the directory tree"""
    json_files = []
    for root, dirs, files in os.walk(root_dir):
        # Skip hidden directories except .idx
        dirs[:] = [d for d in dirs if not d.startswith('.') or d in ['.idx']]
        
        for file in files:
            if file.endswith('.json'):
                json_files.append(os.path.join(root, file))
    return sorted(json_files)

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    root_dir = os.path.dirname(script_dir)
    
    if len(sys.argv) > 1:
        root_dir = sys.argv[1]
    
    print(f"Validating JSON files in: {root_dir}")
    print("=" * 60)
    
    json_files = find_json_files(root_dir)
    total_files = len(json_files)
    valid_files = 0
    invalid_files = []
    
    for file_path in json_files:
        rel_path = os.path.relpath(file_path, root_dir)
        is_valid, message = validate_json_file(file_path)
        
        if is_valid:
            valid_files += 1
            print(f"✓ {rel_path}")
        else:
            invalid_files.append((rel_path, message))
            print(f"✗ {rel_path}: {message}")
    
    print("\n" + "=" * 60)
    print(f"SUMMARY:")
    print(f"Total JSON files: {total_files}")
    print(f"Valid files: {valid_files}")
    print(f"Invalid files: {len(invalid_files)}")
    
    if invalid_files:
        print(f"\nINVALID FILES:")
        for file_path, error in invalid_files:
            print(f"  {file_path}: {error}")
        return 1
    else:
        print(f"\n🎉 All JSON files are valid!")
        return 0

if __name__ == "__main__":
    sys.exit(main())