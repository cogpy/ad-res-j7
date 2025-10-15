#!/usr/bin/env node

/**
 * Utility to view archived test results
 * Demonstrates how to access and use the archived test data
 */

const fs = require('fs');
const path = require('path');
const TestResultArchiver = require('./test-result-archiver');

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString();
}

function displayArchives() {
  const archiver = new TestResultArchiver();
  const archives = archiver.getRecentArchives(10);
  
  console.log('📦 Recent Test Archives\n');
  console.log('=' .repeat(80));
  
  if (archives.length === 0) {
    console.log('No archives found.');
    return;
  }
  
  archives.forEach((archive, index) => {
    console.log(`\n${index + 1}. ${archive.name}`);
    console.log(`   📅 Created: ${formatDate(archive.created)}`);
    
    if (archive.summary) {
      console.log(`   📊 Test Type: ${archive.summary.test_type}`);
      console.log(`   ✅ Passed: ${archive.summary.test_stats.passed_tests}/${archive.summary.test_stats.total_tests}`);
      console.log(`   📈 Success Rate: ${archive.summary.test_stats.success_rate}%`);
    }
  });
  
  console.log('\n' + '=' .repeat(80));
}

function displayLatestResults() {
  console.log('\n📄 Latest Test Results\n');
  console.log('=' .repeat(80));
  
  const latestDir = path.join(process.cwd(), 'test-data', 'latest');
  
  try {
    const files = fs.readdirSync(latestDir);
    
    files.forEach(file => {
      const filePath = path.join(latestDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      console.log(`\n📋 ${file}`);
      
      if (data._metadata) {
        console.log(`   🕐 Archived: ${formatDate(data._metadata.archived_at)}`);
        console.log(`   🌿 Branch: ${data._metadata.git_branch}`);
        console.log(`   📝 Commit: ${data._metadata.git_commit}`);
      }
      
      if (data.summary || data.overall) {
        const stats = data.summary || data.overall;
        console.log(`   ✅ Passed: ${stats.passed_tests || stats.passed}/${stats.total_tests || stats.total}`);
        console.log(`   📊 Success Rate: ${stats.success_rate}%`);
      }
    });
  } catch (error) {
    console.log('No latest results found.');
  }
  
  console.log('\n' + '=' .repeat(80));
}

function main() {
  console.log('🔍 Test Archive Viewer\n');
  
  displayArchives();
  displayLatestResults();
  
  console.log('\n💡 Tips:');
  console.log('   - Run tests with: npm test');
  console.log('   - Archives are stored in: test-data/archives/');
  console.log('   - Latest results in: test-data/latest/');
  console.log('   - Original files still in: tests/ (for backward compatibility)');
}

if (require.main === module) {
  main();
}

module.exports = { displayArchives, displayLatestResults };