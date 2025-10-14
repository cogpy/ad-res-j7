const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Test the conversion with a sample of existing files first
console.log('=== Testing File Conversion ===');

// Find a few test files
const mdFiles = glob.sync('**/*.md', { 
  ignore: ['node_modules/**', '.git/**'] 
}).slice(0, 3);

const jsonFiles = glob.sync('**/*.json', { 
  ignore: ['node_modules/**', '.git/**', 'package*.json'] 
}).slice(0, 3);

console.log('Sample MD files:', mdFiles);
console.log('Sample JSON files:', jsonFiles);

// Test markdown to JSON conversion
if (mdFiles.length > 0) {
  console.log('\n--- Testing MD to JSON ---');
  const mdContent = fs.readFileSync(mdFiles[0], 'utf8');
  console.log('Sample MD content (first 200 chars):', mdContent.substring(0, 200) + '...');
}

// Test JSON to markdown conversion
if (jsonFiles.length > 0) {
  console.log('\n--- Testing JSON to MD ---');
  const jsonContent = fs.readFileSync(jsonFiles[0], 'utf8');
  console.log('Sample JSON content (first 200 chars):', jsonContent.substring(0, 200) + '...');
}

console.log('\n=== File Analysis Complete ===');
