#!/usr/bin/env node

/**
 * Timeline Integration Test Suite
 * Tests that all important events from the problem statement are properly integrated
 * Case: 2025-137857 - Peter Faucitt v. Jacqueline Faucitt et al.
 */

const fs = require('fs');
const path = require('path');

class TimelineIntegrationTest {
  constructor() {
    this.testResults = [];
    this.errors = [];
    
    // Required events from problem statement
    this.requiredEvents = [
      { pattern: /2017.*Shopify started by Dan.*Kayla/i, description: "2017 - Shopify started by Dan & Kayla" },
      { pattern: /2020-04-01.*Worldwide starts Shopify.*lockdown/i, description: "2020-04-01 - Worldwide starts Shopify during lockdowns" },
      { pattern: /2022-02-28.*Kachan distribution ends.*Dan automates/i, description: "2022-02-28 - Kachan distribution ends & Dan automates" },
      { pattern: /2022-11-30.*Krenance distribution ends.*Dan automates/i, description: "2022-11-30 - Krenance distribution ends & Dan automates" },
      { pattern: /2023-02-28.*R1,035,000.*overdue invoices.*RST.*ReZ/i, description: "2023-02-28 - R1,035,000+ overdue invoices RST for ReZ" },
      { pattern: /2023-01-10.*Krenance Staff.*RegimA HO.*Liezel.*Nikita/i, description: "2023-01-10 - Krenance Staff at RegimA HO (Liezel & Nikita)" },
      { pattern: /2023-04-30.*Peak.*massive thefts.*office.*Moffat arrest/i, description: "2023-04-30 - Peak of massive thefts in office (Moffat arrest)" },
      { pattern: /2023-05-05.*Liezel reports.*violation.*staff bodily autonomy/i, description: "2023-05-05 - Liezel reports violation of staff bodily autonomy" },
      { pattern: /2023-05-10.*Peter plants drugs.*Liezel.*desk.*discredit/i, description: "2023-05-10 - Peter plants drugs in Liezel's desk to discredit" },
      { pattern: /2023-05-15.*Liezel complains.*sabotage.*resigns/i, description: "2023-05-15 - Liezel complains about sabotage & resigns" },
      { pattern: /2023-06-30.*Nikita recruits.*Team members.*Resigns/i, description: "2023-06-30 - Nikita recruits Team members then Resigns" },
      { pattern: /2023-07-13.*Kayla Pretorius murdered.*Kelly dismissed/i, description: "2023-07-13 - Kayla Pretorius murdered (Kelly dismissed)" },
      { pattern: /2023-07-30.*All cards expire.*Worldwide.*temp/i, description: "2023-07-30 - All cards expire & put on Worldwide 'temp'" },
      { pattern: /2023-09-30.*RegimA EU distribution ends.*Dan automates/i, description: "2023-09-30 - RegimA EU distribution ends & Dan automates" },
      { pattern: /2024-02-14.*Pete.*Rynette.*Bantjies.*tell Dan.*wind up.*ReZ/i, description: "2024-02-14 - Pete, Rynette, Bantjies tell Dan to wind up ReZ" },
      { pattern: /2024-07.*Bantjies appointed Trustee.*FFT.*Rynette/i, description: "2024-07 - Bantjies appointed Trustee of FFT by Rynette" },
      { pattern: /2024-10-28.*Bantjies added.*trust Authority register/i, description: "2024-10-28 - Bantjies added to trust Authority register" }
    ];
    
    // Timeline files to check
    this.timelineFiles = [
      'affidavit_work/analysis/COMPREHENSIVE_TIMELINE_ANALYSIS.md',
      'jax-dan-response/evidence-attachments/comprehensive_fraud_timeline_2017_2025.md',
      'affidavit_work/analysis/TIMELINE_QUICK_REFERENCE.md',
      'affidavit_work/analysis/TIMELINE_VISUAL_DIAGRAM.md'
    ];
  }

  runAllTests() {
    console.log('🕐 Timeline Integration Tests');
    console.log('═'.repeat(50));

    try {
      this.testTimelineFileExistence();
      this.testRequiredEventsPresence();
      this.testSchemaTimelineSupport();
      this.testTimelineConsistency();
      
      this.printSummary();
      return this.testResults.every(result => result.passed);
      
    } catch (error) {
      this.errors.push(`Test execution error: ${error.message}`);
      console.error('❌ Test execution failed:', error);
      return false;
    }
  }

  testTimelineFileExistence() {
    console.log('\n📁 Testing Timeline File Existence...');
    
    for (const file of this.timelineFiles) {
      const fullPath = path.join(process.cwd(), file);
      const exists = fs.existsSync(fullPath);
      
      this.testResults.push({
        test: `Timeline file exists: ${file}`,
        passed: exists,
        message: exists ? '✅ File exists' : `❌ Missing timeline file: ${file}`
      });
      
      if (exists) {
        console.log(`  ✅ ${file}`);
      } else {
        console.log(`  ❌ ${file}`);
      }
    }
  }

  testRequiredEventsPresence() {
    console.log('\n📅 Testing Required Events Presence...');
    
    // Combine content from all timeline files
    let combinedContent = '';
    for (const file of this.timelineFiles) {
      const fullPath = path.join(process.cwd(), file);
      if (fs.existsSync(fullPath)) {
        combinedContent += fs.readFileSync(fullPath, 'utf8') + '\n';
      }
    }
    
    for (const event of this.requiredEvents) {
      const found = event.pattern.test(combinedContent);
      
      this.testResults.push({
        test: `Required event present: ${event.description}`,
        passed: found,
        message: found ? '✅ Event found' : `❌ Missing event: ${event.description}`
      });
      
      if (found) {
        console.log(`  ✅ ${event.description}`);
      } else {
        console.log(`  ❌ ${event.description}`);
      }
    }
  }

  testSchemaTimelineSupport() {
    console.log('\n🔗 Testing Schema Timeline Support...');
    
    const schemaPath = path.join(process.cwd(), 'schema.graphql');
    if (!fs.existsSync(schemaPath)) {
      this.testResults.push({
        test: 'Schema file exists',
        passed: false,
        message: '❌ Schema file not found'
      });
      return;
    }
    
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    
    // Check for timeline-related schema additions
    const timelineSupport = [
      { pattern: /TIMELINE_EVENT/i, description: "Timeline event node type" },
      { pattern: /TimelineEventNode/i, description: "Timeline event node definition" },
      { pattern: /timelineEventsByDateRange/i, description: "Timeline query by date range" },
      { pattern: /timelineEventsByPhase/i, description: "Timeline query by phase" },
      { pattern: /completeTimeline/i, description: "Complete timeline query" }
    ];
    
    for (const support of timelineSupport) {
      const found = support.pattern.test(schemaContent);
      
      this.testResults.push({
        test: `Schema supports: ${support.description}`,
        passed: found,
        message: found ? '✅ Schema support found' : `❌ Missing schema support: ${support.description}`
      });
      
      if (found) {
        console.log(`  ✅ ${support.description}`);
      } else {
        console.log(`  ❌ ${support.description}`);
      }
    }
  }

  testTimelineConsistency() {
    console.log('\n🔄 Testing Timeline Consistency...');
    
    // Check that key dates are consistent across files
    const keyDates = [
      { pattern: /2023-07-13.*Kayla Pretorius murdered/i, date: "2023-07-13", event: "Kayla murder" },
      { pattern: /2024-10-28.*Bantjies.*Authority register/i, date: "2024-10-28", event: "Bantjies authority" },
      { pattern: /2023-02-28.*R1,035,000/i, date: "2023-02-28", event: "Overdue invoices" }
    ];
    
    for (const keyDate of keyDates) {
      let consistentCount = 0;
      let totalFiles = 0;
      
      for (const file of this.timelineFiles) {
        const fullPath = path.join(process.cwd(), file);
        if (fs.existsSync(fullPath)) {
          totalFiles++;
          const content = fs.readFileSync(fullPath, 'utf8');
          if (keyDate.pattern.test(content)) {
            consistentCount++;
          }
        }
      }
      
      // Event should be in at least half of the timeline files
      const isConsistent = consistentCount >= Math.ceil(totalFiles / 2);
      
      this.testResults.push({
        test: `Timeline consistency: ${keyDate.event}`,
        passed: isConsistent,
        message: isConsistent ? 
          `✅ Event consistent across ${consistentCount}/${totalFiles} files` : 
          `❌ Event inconsistent: only ${consistentCount}/${totalFiles} files`
      });
      
      if (isConsistent) {
        console.log(`  ✅ ${keyDate.event}: ${consistentCount}/${totalFiles} files`);
      } else {
        console.log(`  ❌ ${keyDate.event}: ${consistentCount}/${totalFiles} files`);
      }
    }
  }

  printSummary() {
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(r => r.passed).length;
    const failedTests = totalTests - passedTests;
    
    console.log('\n' + '═'.repeat(50));
    console.log('📊 Timeline Integration Test Summary');
    console.log('═'.repeat(50));
    console.log(`Total Tests: ${totalTests}`);
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
    
    if (this.errors.length > 0) {
      console.log('\n🚨 Errors:');
      this.errors.forEach(error => console.log(`  ❌ ${error}`));
    }
    
    if (failedTests > 0) {
      console.log('\n❌ Failed Tests:');
      this.testResults
        .filter(r => !r.passed)
        .forEach(r => console.log(`  ❌ ${r.test}: ${r.message}`));
    }
  }
}

// Run if called directly
if (require.main === module) {
  const test = new TimelineIntegrationTest();
  const success = test.runAllTests();
  process.exit(success ? 0 : 1);
}

module.exports = TimelineIntegrationTest;