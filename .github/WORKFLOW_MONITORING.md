# Workflow Monitoring Dashboard

## Overview

This repository includes comprehensive monitoring and alerting for all GitHub Actions workflows. The monitoring system automatically detects failures, analyzes patterns, and creates alerts when issues require attention.

## Monitored Workflows

### 🔄 Todo to Issues Generator (`todo-to-issues.yml`)
- **Purpose**: Converts todo items to GitHub issues
- **Monitoring**: Failure detection and alerting
- **Alerts**: `workflow-failure`, `todo-to-issues` labels

### 📄 File Representations (`file-representations.yml`) 
- **Purpose**: Generates file conversions and OCR processing
- **Monitoring**: Job-specific failure tracking
- **Alerts**: `workflow-failure`, `file-representations` labels

### 🧪 Automated Testing Pipeline (`test-workflows.yml`)
- **Purpose**: Continuous validation of workflow functionality
- **Monitoring**: Test failure rates and pattern detection
- **Alerts**: `automated-test-failure`, `workflow-reliability-alert` labels

### 📊 Workflow Monitoring (`workflow-monitoring.yml`)
- **Purpose**: Centralized monitoring and alerting system
- **Monitoring**: Cross-workflow health analysis
- **Alerts**: `workflow-critical-failure` for system-wide issues

## Alert Types

### 🚨 Critical Alerts
- **Trigger**: >50% failure rate across multiple runs
- **Labels**: `priority: critical`, `workflow-critical-failure`
- **Response Time**: Immediate (within 2 hours)

### ⚠️ High Priority Alerts  
- **Trigger**: Individual workflow failures
- **Labels**: `priority: high`, `workflow-failure`
- **Response Time**: Within 24 hours

### 📊 Reliability Alerts
- **Trigger**: >30% failure rate in test pipeline
- **Labels**: `workflow-reliability-alert`, `infrastructure`
- **Response Time**: Within 48 hours

### 📅 Scheduled Alerts
- **Trigger**: Daily test runs that fail
- **Labels**: `automated-test-failure`, `bug`
- **Response Time**: Next business day

## Monitoring Features

### 🔍 Failure Detection
- Real-time failure monitoring for all workflows
- Automatic issue creation with detailed context
- Duplicate prevention to avoid alert spam
- Job-specific failure analysis

### 📈 Pattern Analysis
- Historical failure rate tracking  
- Cross-workflow correlation analysis
- Trend detection for degrading performance
- Threshold-based alerting (20%, 30%, 50%)

### 🎯 Health Metrics
- Success/failure rates per workflow
- Execution time tracking
- Trigger event correlation
- Branch and actor impact analysis

### 🚨 Smart Alerting
- Prevents duplicate issues within 24-hour windows
- Adds comments to existing issues for recurring failures
- Escalates to critical alerts when multiple workflows fail
- Includes actionable troubleshooting steps

## Health Status Files

The monitoring system maintains health status files in `.github/workflow-health/`:

### Current Status Files
- `overall-status.txt` - Overall system health (healthy/warning/critical)
- `last-check.txt` - Timestamp of last monitoring check  
- `current-health.json` - Detailed health metrics per workflow
- `latest-analysis.json` - Most recent comprehensive analysis

### Historical Tracking
- Individual workflow success rates
- Failure pattern trends over time
- Alert history and resolution tracking

## Monitoring Schedule

### Continuous Monitoring
- **Workflow Run Triggers**: After every workflow completion
- **Real-time Alerts**: Immediate failure detection
- **Pattern Analysis**: After each run completion

### Periodic Health Checks  
- **Comprehensive Analysis**: Every 6 hours
- **Pattern Detection**: 24-hour rolling analysis
- **Reliability Assessment**: Daily scheduled validation

### On-Demand Monitoring
- Manual trigger support for immediate analysis
- Configurable analysis periods (default: 24 hours)
- Custom threshold testing

## Response Procedures

### For Critical Alerts (🚨)
1. **Immediate Response** (< 2 hours)
   - Check workflow run logs for immediate causes
   - Verify repository permissions and access
   - Check for infrastructure-level issues
   
2. **Emergency Mitigation**
   - Disable failing workflows if necessary
   - Implement manual processes for critical functions
   - Notify repository maintainers

3. **Resolution Tracking**
   - Document root cause analysis
   - Test fixes thoroughly
   - Monitor recovery metrics

### For High Priority Alerts (⚠️)
1. **Investigation** (< 24 hours)
   - Review workflow logs and error messages
   - Check for recent changes that may have caused failures
   - Verify dependencies and external services

2. **Fix Implementation**
   - Address identified issues
   - Test fixes in development environment
   - Deploy fixes with monitoring

### for Reliability Alerts (📊)  
1. **Pattern Analysis** (< 48 hours)
   - Review historical trends and patterns
   - Identify correlations with code changes or external factors
   - Assess infrastructure capacity and performance

2. **Preventive Actions**
   - Optimize workflow performance
   - Improve error handling and retry logic
   - Update monitoring thresholds if needed

## Troubleshooting Guide

### Common Failure Scenarios

#### Permission Issues
- **Symptoms**: Git push failures, issue creation failures
- **Solutions**: Check GITHUB_TOKEN permissions, verify repository settings

#### Script Errors  
- **Symptoms**: JavaScript runtime errors, syntax errors
- **Solutions**: Review embedded scripts, validate JSON parsing, check Node.js compatibility

#### Resource Limitations
- **Symptoms**: Timeouts, memory errors, rate limiting
- **Solutions**: Optimize scripts, add delays, check GitHub API limits

#### External Dependencies
- **Symptoms**: Network failures, service unavailability  
- **Solutions**: Add retry logic, implement fallback mechanisms, verify service status

### Diagnostic Commands

```bash
# Check workflow health status
cat .github/workflow-health/overall-status.txt

# View detailed health metrics  
jq '.' .github/workflow-health/current-health.json

# Check last monitoring run
cat .github/workflow-health/last-check.txt

# View recent analysis
jq '.' .github/workflow-health/latest-analysis.json
```

## Configuration

### Monitoring Thresholds
- **Critical**: >50% failure rate with ≥2 failures
- **Warning**: >30% failure rate in test pipeline
- **Reliability Alert**: >30% failure rate over 10 runs

### Alert Frequency Limits
- **Critical Alerts**: 12-hour cooldown between issues
- **High Priority**: 24-hour cooldown between issues  
- **Reliability**: No duplicates for open issues
- **Scheduled**: Daily maximum

### Analysis Periods
- **Real-time**: Individual run analysis
- **Short-term**: 6-hour rolling window  
- **Medium-term**: 24-hour rolling window
- **Long-term**: 7-day trend analysis (future enhancement)

## Metrics and Reporting

### Key Performance Indicators (KPIs)
- **Overall Success Rate**: Target >95%
- **Mean Time to Detection (MTTD)**: <5 minutes
- **Mean Time to Resolution (MTTR)**: <4 hours for critical issues
- **False Positive Rate**: <5% for alerts

### Reporting Features
- GitHub Step Summaries for each monitoring run
- Detailed issue reports with actionable information
- Historical trend analysis in health metrics
- Cross-workflow correlation analysis

## Future Enhancements

### Planned Improvements
- 📊 **Dashboard UI**: Web-based monitoring dashboard
- 📧 **External Notifications**: Slack/email integration  
- 🤖 **Auto-Recovery**: Automated retry mechanisms
- 📈 **Advanced Analytics**: ML-based failure prediction
- 🔄 **Integration Testing**: Cross-workflow dependency testing

### Monitoring Expansion
- Performance monitoring (execution times, resource usage)
- Security monitoring (permissions, secrets usage)
- Compliance monitoring (policy adherence)
- Cost monitoring (workflow execution costs)

---

## Quick Reference

### View Current Status
```bash
# Overall health
cat .github/workflow-health/overall-status.txt

# Last check time  
cat .github/workflow-health/last-check.txt
```

### Emergency Contacts
- **Repository Maintainers**: Check CODEOWNERS file
- **Infrastructure Issues**: Create issue with `infrastructure` label
- **Security Concerns**: Follow security reporting guidelines

### Useful Links
- [Workflow Runs](../../actions) - View recent workflow executions
- [Open Alerts](../../issues?q=is%3Aissue+is%3Aopen+label%3Aworkflow-failure) - Current workflow failure issues  
- [Critical Alerts](../../issues?q=is%3Aissue+is%3Aopen+label%3Aworkflow-critical-failure) - Critical system failures

---

*This monitoring system ensures reliable repository automation through proactive failure detection and rapid response capabilities.*