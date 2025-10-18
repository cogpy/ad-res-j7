# Scripts Directory

This directory contains automation scripts for maintaining the ad-res-j7 repository.

## JSON Validation

### `validate_json.py`
Validates all JSON files in the repository for proper formatting and parseability.

**Usage:**
```bash
# Validate all JSON files in the repository
python3 scripts/validate_json.py

# Validate JSON files in a specific directory
python3 scripts/validate_json.py /path/to/directory
```

**Features:**
- Validates JSON syntax and parseability
- Provides detailed error messages for invalid files
- Returns appropriate exit codes for CI/CD integration
- Processes all JSON files recursively

**Output:**
- ✓ Valid JSON files
- ✗ Invalid JSON files with error details
- Summary statistics

## Requirements

- Python 3.x
- Standard library only (no external dependencies)

## Exit Codes

- `0`: All JSON files are valid
- `1`: One or more JSON files are invalid

## Integration

This script can be integrated into:
- Pre-commit hooks
- GitHub Actions workflows
- Automated testing pipelines
- Manual quality assurance processes

## Related Documentation

See `../JSON_VALIDATION_DOCUMENTATION.md` for comprehensive documentation on JSON validation processes and best practices.