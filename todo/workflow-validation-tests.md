# Workflow Validation Tests

This file contains sample tasks designed to test all aspects of the todo-to-issues workflow functionality.

## Must-Do (Critical Priority)

1. Fix label array handling in GitHub Actions workflow
2. Validate issue creation with complex multi-word labels like "priority: critical"
3. Test duplicate prevention with identical task titles
4. Ensure proper JSON parsing for workflow output

## Should-Do (High Priority)

1. Test the workflow with sample tasks containing special characters
2. Verify proper issue creation with multiple labels and priorities
3. Validate markdown parsing with various formatting styles
4. Create comprehensive test coverage for edge cases

## Nice-to-Have (Low Priority)

1. Add performance benchmarking for large todo files
2. Implement advanced filtering for complex task scenarios

## Improvements Needed:
- Create validation tests for workflow changes
- Enhance error handling in issue creation process 
- Add comprehensive logging for debugging workflow issues
- Improve task detection accuracy for edge cases
- Validate label format requirements thoroughly

## **Action Required**:
- Test force regeneration functionality with existing issues
- Verify proper handling of tasks with markdown formatting **bold** and *italic* text
- Ensure correct parsing of tasks with `code blocks` and [links](http://example.com)

## Edge Case Testing

### Tasks with Various Formats

- Create unit tests for markdown parsing logic
- Implement integration tests for GitHub API interaction
- Add regression tests to prevent workflow breaking changes
- Establish performance baseline measurements for processing speed

### Special Characters and Formatting

1. Test with émojis and ünicode characters in task descriptions
2. Validate proper handling of tasks with "quotes" and 'apostrophes'
3. Ensure correct processing of tasks with numbers: 123, percentages: 50%, and symbols: $@#

### Long Task Descriptions

1. This is an intentionally very long task description that exceeds the normal 80 character limit for GitHub issue titles to test the truncation functionality and ensure it works properly without breaking the workflow or creating malformed issues in the GitHub repository system
2. Another long task with specific requirements: implement comprehensive validation framework including unit tests, integration tests, performance benchmarks, security checks, error handling improvements, documentation updates, and thorough code review processes

## Priority Section Variations

### Priority 1 Tasks
1. Critical task using Priority 1 format
2. Another critical task for duplicate testing

### Phase 2 Tasks  
1. High priority task using Phase 2 format
2. ✅ **COMPLETED** - Secondary task in phase 2 structure - Burden of proof strategies implemented for Dan & Jax to prove guilt of other agents (Peter, Rynette, Bantjies) across civil (51%), criminal (95%), and mathematical (100%) standards

### Framework Phase 3
1. Medium priority task in framework phase format
2. Another framework task for testing

## **Recommended Actions**:
- Validate workflow behavior with empty todo files
- Test handling of malformed markdown files
- Ensure graceful failure for files with syntax errors
- Verify correct behavior when no actionable tasks are found

## Quality Filter Testing

This section contains tasks that should be filtered out:

**Current Coverage**: This is descriptive text that should not create issues
**Legal Significance**: Another descriptive section to skip
**Estimated effort**: 2 hours
**Total development effort**: 8 hours

Valid tasks mixed with invalid ones:
- Create comprehensive test suite for all workflow functionality
- **Impact**: This should be filtered out as descriptive
- Implement automated testing pipeline for continuous validation
- **Framework Phase**: Should be skipped
- Add monitoring and alerting for workflow failures

## Multiple Label Testing

### Critical Section with Bug Label
1. Fix security vulnerability in authentication system
2. Resolve critical data corruption issue in database

### Enhancement Section  
1. Add new feature for improved user experience
2. Implement advanced analytics dashboard

## Force Regeneration Testing

These tasks are specifically for testing the force regeneration feature:

1. Task that will be recreated during force regeneration
2. Another task to test closing and recreating existing issues
3. Validate force regeneration closes old issues before creating new ones

---

*This file is designed to comprehensively test the todo-to-issues workflow with various scenarios, edge cases, and priority configurations.*