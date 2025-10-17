# Date Validation Quick Reference

## Overview

This document provides a quick reference for the date validation system implemented for the forensic analyses in Case 2025-137857.

## Quick Start

### Run Validation
```bash
npm run validate-dates
```

### Run Tests
```bash
npm run test:date-validation
```

### Direct Script Execution
```bash
python3 scripts/validate_analysis_dates.py
```

## What Gets Validated

### Analyses Covered
- **Revenue Theft** (`jax-response/revenue-theft/`)
- **Family Trust** (`jax-response/family-trust/`)
- **Financial Flows** (`jax-response/financial-flows/`)

### Validation Checks
1. ✓ Date format validation (YYYY-MM-DD, Month DD YYYY, etc.)
2. ✓ Date value validation (valid calendar dates)
3. ✓ Date range validation (2015-2026)
4. ✓ Folder-date matching
5. ✓ Chronological consistency
6. ✓ Cross-reference validation

## Files and Locations

### Validation Script
- **Location:** `scripts/validate_analysis_dates.py`
- **Type:** Python 3 script
- **Lines:** 285
- **Executable:** Yes

### Test Suite
- **Location:** `tests/date-validation-test.js`
- **Type:** Node.js test
- **Tests:** 10 (all passing)
- **Coverage:** Full validation workflow

### Documentation
- **Main Summary:** `DATE_VALIDATION_SUMMARY.md`
- **Quick Reference:** `docs/DATE_VALIDATION_QUICK_REFERENCE.md` (this file)
- **JSON Report:** `date_validation_report.json` (auto-generated)

## Validation Results

### Current Status
- **Status:** ✓ PASS
- **Errors:** 0
- **Warnings:** 2 (non-critical)
- **Dates Validated:** 320
- **Files Checked:** 59

### Date Statistics
- **Revenue Theft:** 240 dates
- **Family Trust:** 40 dates
- **Financial Flows:** 40 dates

## Understanding Results

### Status Meanings
- **PASS:** All dates valid, no errors
- **FAIL:** One or more invalid dates found

### Error Types
- **Format Error:** Date doesn't match expected formats
- **Value Error:** Invalid calendar date (e.g., Feb 30)
- **Range Error:** Date outside 2015-2026 range

### Warning Types
- **Folder Mismatch:** File date doesn't match folder name
- **Format Inconsistency:** Date format differs from standard

## Common Use Cases

### Before Legal Review
```bash
# Validate all dates before sending to attorney
npm run validate-dates
```

### Before Court Submission
```bash
# Run full validation and tests
npm run validate-dates && npm run test:date-validation
```

### After Adding New Evidence
```bash
# Validate dates in new analysis files
python3 scripts/validate_analysis_dates.py
```

### Check Specific Analysis
The script automatically validates all three analyses. To check a specific one, review the console output or JSON report.

## Integration with Workflows

### Package.json Scripts
```json
{
  "validate-dates": "python3 scripts/validate_analysis_dates.py",
  "test:date-validation": "node tests/date-validation-test.js"
}
```

### Pre-commit Hook (Optional)
```bash
#!/bin/bash
# Add to .git/hooks/pre-commit
npm run validate-dates
```

## Troubleshooting

### Issue: Script won't run
**Solution:** Ensure Python 3 is installed and script is executable
```bash
chmod +x scripts/validate_analysis_dates.py
```

### Issue: Tests fail
**Solution:** Run validation first, then check error messages
```bash
npm run validate-dates
npm run test:date-validation
```

### Issue: Warnings about folder dates
**Solution:** Verify README.md in the folder contains the event date

## Maintenance

### Adding New Analysis Folders
The script automatically detects new folders in:
- `jax-response/revenue-theft/`
- `jax-response/family-trust/`
- `jax-response/financial-flows/`

### Updating Date Formats
Edit `date_patterns` in `scripts/validate_analysis_dates.py` to add new formats.

### Modifying Validation Rules
Update validation logic in the `DateValidator` class methods.

## Support

### Documentation
- Full Summary: `DATE_VALIDATION_SUMMARY.md`
- Source Code: `scripts/validate_analysis_dates.py`
- Test Spec: `tests/date-validation-test.js`

### Key Dates Reference
- **Revenue Theft:** Apr 14 - Aug 29, 2025
- **Family Trust:** Mar 15 - Aug 10, 2025
- **Financial Flows:** Apr 1 - Aug 20, 2025

---

**Last Updated:** October 16, 2025  
**Version:** 1.0  
**Status:** Production Ready ✓
