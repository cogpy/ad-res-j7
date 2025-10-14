const glob = require('glob');

console.log("Updated glob patterns:");
console.log("MD files found by glob:");
const mdFiles = glob.sync('**/*.md', { 
  ignore: ['node_modules/**', 'vendor/**', 'bower_components/**', 'jspm_packages/**', '.bundle/**', 'target/**', 'build/**', 'dist/**', '.git/**', 'README.md'] 
});
mdFiles.forEach(f => console.log("  ", f));

console.log("\nJSON files found by glob:");
const jsonFiles = glob.sync('**/*.json', { 
  ignore: ['node_modules/**', 'vendor/**', 'bower_components/**', 'jspm_packages/**', '.bundle/**', 'target/**', 'build/**', 'dist/**', '.git/**', 'package*.json'] 
});
jsonFiles.forEach(f => console.log("  ", f));

console.log("\nFiles that would be found WITHOUT exclusions:");
const allMd = glob.sync('**/*.md', { ignore: ['.git/**'] });
const nodeModulesMd = allMd.filter(f => f.includes('node_modules/'));
console.log("MD files in node_modules:", nodeModulesMd);

const allJson = glob.sync('**/*.json', { ignore: ['.git/**'] });
const nodeModulesJson = allJson.filter(f => f.includes('node_modules/'));
console.log("JSON files in node_modules:", nodeModulesJson);
