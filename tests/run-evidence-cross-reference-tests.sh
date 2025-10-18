#!/bin/bash
#
# Evidence Cross-Reference Test Suite Runner
# 
# Runs all evidence cross-referencing accuracy tests and generates a summary report
#

set -e

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║  Evidence Cross-Reference Test Suite Runner                  ║"
echo "║  Running comprehensive accuracy tests                         ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Test counters
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

# Test 1: Basic Validation (Python)
echo "═══════════════════════════════════════════════════════════════"
echo "Test Suite 1: Basic Cross-Reference Validation"
echo "═══════════════════════════════════════════════════════════════"
TESTS_RUN=$((TESTS_RUN + 1))
if python3 scripts/validate_cross_references.py; then
    TESTS_PASSED=$((TESTS_PASSED + 1))
    echo "✅ Basic validation PASSED"
else
    TESTS_FAILED=$((TESTS_FAILED + 1))
    echo "❌ Basic validation FAILED"
fi
echo ""

# Test 2: Comprehensive Tests (JavaScript)
echo "═══════════════════════════════════════════════════════════════"
echo "Test Suite 2: Comprehensive Accuracy Tests (JavaScript)"
echo "═══════════════════════════════════════════════════════════════"
TESTS_RUN=$((TESTS_RUN + 1))
if node tests/evidence-cross-reference-accuracy.test.js; then
    TESTS_PASSED=$((TESTS_PASSED + 1))
    echo "✅ JavaScript comprehensive tests PASSED"
else
    TESTS_FAILED=$((TESTS_FAILED + 1))
    echo "❌ JavaScript comprehensive tests FAILED"
fi
echo ""

# Test 3: Extended Tests (Python)
echo "═══════════════════════════════════════════════════════════════"
echo "Test Suite 3: Extended Accuracy Tests (Python)"
echo "═══════════════════════════════════════════════════════════════"
TESTS_RUN=$((TESTS_RUN + 1))
if python3 tests/test_evidence_cross_reference_accuracy.py; then
    TESTS_PASSED=$((TESTS_PASSED + 1))
    echo "✅ Python extended tests PASSED"
else
    TESTS_FAILED=$((TESTS_FAILED + 1))
    echo "❌ Python extended tests FAILED"
fi
echo ""

# Summary
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║  TEST SUITE SUMMARY                                           ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
echo "Total Test Suites Run: $TESTS_RUN"
echo "Test Suites Passed: $TESTS_PASSED"
echo "Test Suites Failed: $TESTS_FAILED"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo "╔═══════════════════════════════════════════════════════════════╗"
    echo "║  ✅ ALL TEST SUITES PASSED                                   ║"
    echo "║  Evidence cross-referencing system is accurate and complete  ║"
    echo "╚═══════════════════════════════════════════════════════════════╝"
    exit 0
else
    echo "╔═══════════════════════════════════════════════════════════════╗"
    echo "║  ❌ SOME TEST SUITES FAILED                                  ║"
    echo "║  Please review errors above                                   ║"
    echo "╚═══════════════════════════════════════════════════════════════╝"
    exit 1
fi
