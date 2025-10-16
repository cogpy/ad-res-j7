# Todo Folder

This folder includes changes and/or updates that need to be implemented in the ad-res-j7 repository.

## Purpose

The todo folder serves as a central location for tracking improvements, recommendations, and action items for Case 2025-137857. Files in this folder are automatically processed by the GitHub Actions workflow to generate tracked issues.

## Current Todo Documents

### Active Todo Files

1. **Repository_Status_and_Critical_Evidence_Collection.md** (NEW - October 13, 2025)
   - Comprehensive action plan based on repository status assessment
   - 77 total tasks across 15 priority sections
   - Critical evidence collection requirements (32 critical tasks)
   - Repository maintenance and optimization (26 high-priority tasks)
   - Affidavit preparation and quality assurance (19 medium-priority tasks)
   - 4-week timeline with clear milestones

2. **Improvements for Jax-Dan Response Based on AD Elements.md**
   - Detailed analysis of jax-dan-response against AD framework
   - Paragraph-by-paragraph improvement recommendations
   - Evidence architecture enhancements
   - Strategic narrative development

3. **Executive Summary_ Jax-Dan Response Improvements.md**
   - High-level overview of critical gaps
   - Top 5 priority recommendations
   - Current strengths and weaknesses analysis
   - Implementation roadmap

### Workflow Test Files

4. **workflow-validation-tests.md**
   - Tests for GitHub Actions workflow functionality
   - Issue generation validation
   - Label assignment verification

5. **workflow-test.md**
   - Basic workflow testing scenarios
   - Issue creation validation

6. **simple-workflow-test.md**
   - Simplified workflow test cases
   - Quick validation checks

## How It Works

### Automatic Issue Generation

When todo files are committed to the repository:

1. **GitHub Actions Trigger**: The todo-to-issues workflow automatically runs
2. **Task Detection**: Workflow parses markdown files for actionable tasks
3. **Issue Creation**: Creates GitHub issues with appropriate labels and priorities
4. **Tracking**: Each issue links back to source file and line number

### Task Format

Tasks are detected using multiple methods:

#### Priority Sections
```markdown
### Must-Do (Phase 1)
1. First critical task
2. Second critical task

### Should-Do (Phase 2)
1. First high-priority task
2. Second high-priority task

### Nice-to-Have (Phase 3)
1. First medium-priority task
2. Second medium-priority task
```

#### Actionable Items
```markdown
**Improvements Needed**:
- Implement priority-based response architecture
- Create comprehensive timeline analysis
- Enhance evidence architecture
```

### Priority Mapping

- **Must-Do (Phase 1)** → `priority: critical` + `bug` labels
- **Should-Do (Phase 2)** → `priority: high` label
- **Nice-to-Have (Phase 3)** → `priority: medium` label

All tasks automatically receive `todo` and `enhancement` labels.

## Repository Status Context

### Current State (October 13, 2025)

**Overall Readiness: 78%**

| Component | Readiness |
|-----------|-----------|
| Repository Structure | 95% ✅ |
| Evidence Organization | 85% ✅ |
| Forensic Analysis | 90% ✅ |
| Legal Arguments | 90% ✅ |
| Affidavit Drafting | 75% ⚠️ |
| Evidence Collection | 60% ⚠️ |
| Court Submission | 50% ⚠️ |

### Repository Growth

- **Directories:** 100+ (from initial 33) - **+200%+ growth**
- **Files:** 1000+ (from initial 30) - **+3200%+ growth**
- **Documented Losses:** R10.227+ million across three forensic categories
- **Affidavit Versions:** 5 versions (current: v3)
- **Strategic Arguments:** 7 key arguments established

### Critical Evidence Gaps

The following critical evidence items are still needed:

1. Responsible Person documentation (37 jurisdictions) - JF-RP1
2. Director loan account statements (3 directors) - JF-DLA1-3
3. Peter's withdrawal examples (4+) - JF-PA1-4
4. JF5 settlement agreement (draft vs final comparison)
5. ✅ **COMPLETED** - Chesno fraud documentation - JF-CHESNO1-4
6. Daniel's 8-year restoration evidence - JF-RESTORE1-4

## Usage Guidelines

### For Contributors

1. **Create New Todo Files**: Follow the priority section format shown above
2. **Use Action Words**: Include clear action verbs (implement, create, add, fix, etc.)
3. **Be Specific**: Provide clear, actionable task descriptions
4. **Include Context**: Reference relevant files, sections, or evidence codes
5. **Add JSON Companion**: Create matching .json file for structured data

### For Reviewers

1. **Check Priority Alignment**: Ensure tasks are in appropriate priority sections
2. **Verify Actionability**: Confirm tasks are specific and achievable
3. **Review Dependencies**: Identify task dependencies and sequencing
4. **Validate References**: Ensure all file references and evidence codes are correct

### For Project Managers

1. **Monitor Issue Generation**: Review created issues after todo file commits
2. **Track Progress**: Use GitHub issue labels to filter and track progress
3. **Update Priorities**: Adjust priority sections as case develops
4. **Archive Completed**: Move completed todo files to archive when done

## Workflow Documentation

For detailed information about the todo-to-issues workflow, see:
- **docs/todo-to-issues-workflow.md** - Complete workflow documentation
- **docs/label-verification-guide.md** - Label format and verification guide
- **WORKFLOW_DOCUMENTATION.md** - General workflow documentation

## Timeline and Milestones

### Week 1 (Immediate)
- Complete all Phase 1 critical evidence collection
- Archive old affidavit versions
- Update critical documentation
- Insert Paragraph 129 correction

### Week 2 (Short-term)
- Complete Phase 1 affidavit preparation
- Gather Phase 2 high-priority evidence
- Consolidate directory structures
- Verify forensic analysis

### Week 3 (Medium-term)
- Prepare for legal review
- Complete Phase 2 tasks
- Finalize evidence annexures
- Conduct comprehensive QA

### Week 4 (Pre-submission)
- Legal review and attorney consultation
- Final evidence verification
- Court submission preparation
- Final proofread and quality check

## Related Documentation

- **docs/REPOSITORY_STATUS_ASSESSMENT.md** - Comprehensive repository status analysis
- **docs/CASE_SUMMARY.md** - Case overview and background
- **REPOSITORY_STRUCTURE.md** - Repository organization guide
- **jax-response/README.md** - Current affidavit status and evidence requirements

## Notes

- All todo files are version controlled via Git
- Changes trigger automatic issue generation via GitHub Actions
- Issues are automatically labeled based on priority sections
- Duplicate prevention ensures no redundant issues are created
- Force regeneration option available for major updates

---

*Last Updated: October 13, 2025*  
*Repository: cogpy/ad-res-j7*  
*Directory: /todo/*

