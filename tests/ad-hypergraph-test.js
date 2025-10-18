#!/usr/bin/env node

/**
 * AD Hypergraph Mapping Test Suite
 * Tests the AD hypergraph mapper functionality and validates outputs
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ADHypergraphTest {
    constructor() {
        this.testResults = [];
        this.errors = [];
        this.hypergraphDir = path.join(__dirname, '..', 'ad-hypergraph-mapping');
    }

    runAllTests() {
        console.log('🔍 Running AD Hypergraph Mapping Tests...\n');
        
        try {
            this.testMapperExecution();
            this.testOutputFiles();
            this.testHypergraphJSON();
            this.testVisualizationMermaid();
            this.testComponentCategories();
            this.testHypergraphStructure();
        } catch (error) {
            this.errors.push(`Test execution error: ${error.message}`);
        }
        
        this.displayResults();
        return this.testResults.every(result => result.passed);
    }
    
    testMapperExecution() {
        console.log('Testing AD Hypergraph Mapper Execution...');
        
        try {
            // Run the AD hypergraph mapper
            const output = execSync('python3 ad_hypergraph_mapper.py', { 
                cwd: this.hypergraphDir,
                encoding: 'utf8',
                timeout: 60000 
            });
            
            const success = output.includes('AD Hypergraph Mapping Complete!') &&
                          output.includes('Found') && 
                          output.includes('AD components');
            
            this.testResults.push({
                test: 'AD Mapper Execution',
                passed: success,
                details: success ? 'Mapper executed successfully' : 'Mapper execution failed'
            });
        } catch (error) {
            this.testResults.push({
                test: 'AD Mapper Execution',
                passed: false,
                details: `Execution failed: ${error.message}`
            });
        }
    }
    
    testOutputFiles() {
        console.log('Testing Output Files Generation...');
        
        const requiredFiles = [
            'ad_hypergraph_report.md',
            'ad_hypergraph_visualization.md', 
            'ad_hypergraph.json',
            'AD_HYPERGRAPH_SUMMARY.md'
        ];
        
        for (const filename of requiredFiles) {
            const filepath = path.join(this.hypergraphDir, filename);
            const exists = fs.existsSync(filepath);
            
            let fileSize = 0;
            if (exists) {
                const stats = fs.statSync(filepath);
                fileSize = stats.size;
            }
            
            this.testResults.push({
                test: `Output File: ${filename}`,
                passed: exists && fileSize > 0,
                details: exists ? `File exists (${fileSize} bytes)` : 'File missing or empty'
            });
        }
    }
    
    testHypergraphJSON() {
        console.log('Testing Hypergraph JSON Structure...');
        
        try {
            const jsonPath = path.join(this.hypergraphDir, 'ad_hypergraph.json');
            const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
            
            // Test required JSON structure
            const hasMetadata = jsonData.metadata && 
                               jsonData.metadata.total_components > 0 &&
                               jsonData.metadata.total_nodes > 0 &&
                               jsonData.metadata.total_edges >= 0;
            
            this.testResults.push({
                test: 'Hypergraph JSON - Metadata',
                passed: hasMetadata,
                details: hasMetadata ? 
                    `Components: ${jsonData.metadata.total_components}, Nodes: ${jsonData.metadata.total_nodes}, Edges: ${jsonData.metadata.total_edges}` :
                    'Missing or invalid metadata'
            });
            
            const hasNodes = jsonData.nodes && Object.keys(jsonData.nodes).length > 0;
            this.testResults.push({
                test: 'Hypergraph JSON - Nodes',
                passed: hasNodes,
                details: hasNodes ? `${Object.keys(jsonData.nodes).length} nodes found` : 'No nodes found'
            });
            
            const hasComponents = jsonData.components && jsonData.components.length > 0;
            this.testResults.push({
                test: 'Hypergraph JSON - Components',
                passed: hasComponents,
                details: hasComponents ? `${jsonData.components.length} components found` : 'No components found'
            });
            
        } catch (error) {
            this.testResults.push({
                test: 'Hypergraph JSON Structure',
                passed: false,
                details: `JSON parsing failed: ${error.message}`
            });
        }
    }
    
    testVisualizationMermaid() {
        console.log('Testing Mermaid Visualization...');
        
        try {
            const vizPath = path.join(this.hypergraphDir, 'ad_hypergraph_visualization.md');
            const content = fs.readFileSync(vizPath, 'utf8');
            
            const hasMermaid = content.includes('```mermaid') && content.includes('graph TB');
            const hasNodes = content.includes('components)"]');
            const hasStyles = content.includes('style ') && content.includes('fill:');
            const hasLegend = content.includes('## Legend');
            
            this.testResults.push({
                test: 'Mermaid Visualization - Structure',
                passed: hasMermaid && hasNodes,
                details: hasMermaid && hasNodes ? 'Valid Mermaid diagram structure' : 'Invalid Mermaid structure'
            });
            
            this.testResults.push({
                test: 'Mermaid Visualization - Styling', 
                passed: hasStyles,
                details: hasStyles ? 'Node styling present' : 'Node styling missing'
            });
            
            this.testResults.push({
                test: 'Mermaid Visualization - Legend',
                passed: hasLegend,
                details: hasLegend ? 'Legend section present' : 'Legend missing'
            });
            
        } catch (error) {
            this.testResults.push({
                test: 'Mermaid Visualization',
                passed: false,
                details: `Visualization test failed: ${error.message}`
            });
        }
    }
    
    testComponentCategories() {
        console.log('Testing AD Component Categories...');
        
        try {
            const reportPath = path.join(this.hypergraphDir, 'ad_hypergraph_report.md');
            const reportContent = fs.readFileSync(reportPath, 'utf8');
            
            const expectedCategories = [
                'Authorization',
                'Authentication', 
                'Identity',
                'Security',
                'Directory',
                'Token',
                'Api_Auth',
                'Sso'
            ];
            
            let categoriesFound = 0;
            for (const category of expectedCategories) {
                if (reportContent.includes(`**${category}**`) && reportContent.includes('occurrences')) {
                    categoriesFound++;
                }
            }
            
            const allCategoriesFound = categoriesFound === expectedCategories.length;
            
            this.testResults.push({
                test: 'AD Component Categories',
                passed: allCategoriesFound,
                details: `${categoriesFound}/${expectedCategories.length} categories found`
            });
            
        } catch (error) {
            this.testResults.push({
                test: 'Component Categories',
                passed: false,
                details: `Category test failed: ${error.message}`
            });
        }
    }
    
    testHypergraphStructure() {
        console.log('Testing Hypergraph Structure Integrity...');
        
        try {
            const jsonPath = path.join(this.hypergraphDir, 'ad_hypergraph.json');
            const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
            
            // Validate node structure
            const nodes = Object.values(jsonData.nodes);
            const validNodes = nodes.every(node => 
                node.id && node.type && node.name && 
                Array.isArray(node.repositories) && 
                typeof node.component_count === 'number'
            );
            
            this.testResults.push({
                test: 'Hypergraph - Node Structure',
                passed: validNodes,
                details: validNodes ? 'All nodes have valid structure' : 'Invalid node structure detected'
            });
            
            // Validate edge structure 
            const edges = Object.values(jsonData.edges);
            const validEdges = edges.every(edge =>
                edge.id && edge.type && Array.isArray(edge.nodes) &&
                edge.nodes.length >= 1
            );
            
            this.testResults.push({
                test: 'Hypergraph - Edge Structure',
                passed: validEdges,
                details: validEdges ? 'All edges have valid structure' : 'Invalid edge structure detected'
            });
            
        } catch (error) {
            this.testResults.push({
                test: 'Hypergraph Structure',
                passed: false,
                details: `Structure validation failed: ${error.message}`
            });
        }
    }
    
    displayResults() {
        console.log('\n📊 AD Hypergraph Test Results:');
        console.log('================================');
        
        let passed = 0;
        let total = this.testResults.length;
        
        for (const result of this.testResults) {
            const status = result.passed ? '✅ PASS' : '❌ FAIL';
            console.log(`${status} ${result.test}: ${result.details}`);
            if (result.passed) passed++;
        }
        
        console.log(`\n📈 Summary: ${passed}/${total} tests passed (${Math.round(passed/total*100)}%)`);
        
        if (this.errors.length > 0) {
            console.log('\n🚨 Errors:');
            this.errors.forEach(error => console.log(`  - ${error}`));
        }
        
        if (passed === total) {
            console.log('\n🎉 All AD Hypergraph tests passed!');
        } else {
            console.log('\n⚠️  Some tests failed. Check output above for details.');
        }
    }
}

// Run tests if called directly
if (require.main === module) {
    const tester = new ADHypergraphTest();
    const success = tester.runAllTests();
    process.exit(success ? 0 : 1);
}

module.exports = ADHypergraphTest;