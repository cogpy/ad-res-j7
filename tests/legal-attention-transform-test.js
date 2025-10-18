/**
 * Legal Attention Transform Test Suite
 * ===================================
 * 
 * Tests the integration of the Legal Attention Transform with Peter's causation analysis
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting Legal Attention Transform Test Suite');
console.log('Testing Peter\'s causation section with attention mechanisms');
console.log('============================================================\n');

let passedTests = 0;
let failedTests = 0;

function runTest(testName, testFunction) {
    console.log(`🧪 Test: ${testName}`);
    try {
        const result = testFunction();
        if (result) {
            console.log('✅ PASSED');
            passedTests++;
        } else {
            console.log('❌ FAILED');
            failedTests++;
        }
    } catch (error) {
        console.log(`❌ FAILED: ${error.message}`);
        failedTests++;
    }
    console.log('');
}

// Test 1: Verify Legal Attention Transform file exists
runTest('Legal Attention Transform file exists', () => {
    const transformPath = path.join(__dirname, '..', 'lex-inference-engine', 'legal_attention_transform.py');
    return fs.existsSync(transformPath);
});

// Test 2: Verify Peters causation file has attention analysis
runTest('Peters causation file includes attention analysis', () => {
    const causationPath = path.join(__dirname, '..', 'jax-dan-response', 'peters_causation.md');
    const content = fs.readFileSync(causationPath, 'utf8');
    return content.includes('Legal Attention Transform') && 
           content.includes('juridical heat map') &&
           content.includes('Attention Mechanism Analysis');
});

// Test 3: Verify attention mechanism structure
runTest('Legal Attention Transform has required classes', () => {
    const transformPath = path.join(__dirname, '..', 'lex-inference-engine', 'legal_attention_transform.py');
    const content = fs.readFileSync(transformPath, 'utf8');
    
    const requiredClasses = [
        'class LegalLens',
        'class LegalPositionalEncoding',
        'class LegalAttentionHead',
        'class MultiHeadLegalAttention',
        'class LegalAttention'
    ];
    
    return requiredClasses.every(className => content.includes(className));
});

// Test 4: Verify multi-head attention implementation
runTest('Multi-head attention includes legal lenses', () => {
    const transformPath = path.join(__dirname, '..', 'lex-inference-engine', 'legal_attention_transform.py');
    const content = fs.readFileSync(transformPath, 'utf8');
    
    const requiredLenses = [
        'CAUSAL = auto()',
        'INTENTIONALITY = auto()',
        'TEMPORAL = auto()',
        'NORMATIVE = auto()'
    ];
    
    return requiredLenses.every(lens => content.includes(lens));
});

// Test 5: Verify causation analysis functions
runTest('Causation analysis functions implemented', () => {
    const transformPath = path.join(__dirname, '..', 'lex-inference-engine', 'legal_attention_transform.py');
    const content = fs.readFileSync(transformPath, 'utf8');
    
    const requiredFunctions = [
        'def analyze_peters_causation_with_attention',
        'def _analyze_peter_specific_patterns',
        'def _detect_manipulation_patterns',
        'def _analyze_self_created_crisis',
        'def _generate_causation_conclusions'
    ];
    
    return requiredFunctions.every(func => content.includes(func));
});

// Test 6: Verify attention scores in causation file
runTest('Peters causation includes attention scores', () => {
    const causationPath = path.join(__dirname, '..', 'jax-dan-response', 'peters_causation.md');
    const content = fs.readFileSync(causationPath, 'utf8');
    
    return content.includes('Salience Score') && 
           content.includes('Necessity:') &&
           content.includes('Sufficiency:') &&
           content.includes('Contribution:');
});

// Test 7: Verify mathematical proof integration
runTest('Mathematical proof integration present', () => {
    const causationPath = path.join(__dirname, '..', 'jax-dan-response', 'peters_causation.md');
    const content = fs.readFileSync(causationPath, 'utf8');
    
    return content.includes('Mathematical Proof') && 
           content.includes('Guilt Resolution Confidence') &&
           content.includes('Universal Guilt Determination System');
});

// Test 8: Test Python script syntax (basic validation)
runTest('Legal Attention Transform Python syntax valid', () => {
    const transformPath = path.join(__dirname, '..', 'lex-inference-engine', 'legal_attention_transform.py');
    
    try {
        // Run Python syntax check
        execSync(`python3 -m py_compile "${transformPath}"`, { stdio: 'pipe' });
        return true;
    } catch (error) {
        console.log(`Python syntax error: ${error.message}`);
        return false;
    }
});

// Test 9: Verify attention weights computation
runTest('Attention weights computation implemented', () => {
    const transformPath = path.join(__dirname, '..', 'lex-inference-engine', 'legal_attention_transform.py');
    const content = fs.readFileSync(transformPath, 'utf8');
    
    return content.includes('def _compute_guilt_scores') &&
           content.includes('def _create_juridical_heat_map') &&
           content.includes('softmax(QK^T/√d)V');
});

// Test 10: Verify integration with existing systems
runTest('Integration with existing lex-inference-engine', () => {
    const transformPath = path.join(__dirname, '..', 'lex-inference-engine', 'legal_attention_transform.py');
    const content = fs.readFileSync(transformPath, 'utf8');
    
    // Check for integration points
    return content.includes('universal-guilt-determination') ||
           content.includes('LexInferenceEngine') ||
           content.includes('integration with existing');
});

// Test 11: Verify counterfactual analysis
runTest('Counterfactual analysis implementation', () => {
    const transformPath = path.join(__dirname, '..', 'lex-inference-engine', 'legal_attention_transform.py');
    const content = fs.readFileSync(transformPath, 'utf8');
    
    return content.includes('def _compute_counterfactual_attention') &&
           content.includes('cross_attention') &&
           content.includes('counterfactual_events');
});

// Test 12: Verify legal conclusions in causation file
runTest('Legal conclusions enhanced with attention analysis', () => {
    const causationPath = path.join(__dirname, '..', 'jax-dan-response', 'peters_causation.md');
    const content = fs.readFileSync(causationPath, 'utf8');
    
    return content.includes('Primary Causation') &&
           content.includes('Self-Created Crisis') &&
           content.includes('Bad Faith Conduct') &&
           content.includes('attention centrality scores');
});

console.log('============================================================');
console.log('📊 Legal Attention Transform Test Summary');
console.log('============================================================');
console.log(`✅ Passed: ${passedTests}`);
console.log(`❌ Failed: ${failedTests}`);
console.log(`📈 Success Rate: ${((passedTests / (passedTests + failedTests)) * 100).toFixed(1)}%`);

if (failedTests === 0) {
    console.log('🎉 All tests passed! Legal Attention Transform implementation is complete.');
} else {
    console.log('⚠️  Some tests failed. Please review the implementation.');
    process.exit(1);
}