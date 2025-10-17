# Burden of Proof Analysis System

## Overview

The Burden of Proof Analysis System implements optimal strategies and indicates burden of proof and necessary conditions for Dan & Jax to prove guilt of other agents (Peter, Rynette, Bantjies, etc.) in each element specified by the body of law being considered.

## Legal Standards Supported

### 1. Civil Standard (Balance of Probabilities)
- **Threshold**: >50% likelihood (0.51)
- **Description**: More likely than not that the defendant is guilty
- **Use Case**: Civil litigation, regulatory proceedings, employment disputes

### 2. Criminal Standard (Beyond Reasonable Doubt) 
- **Threshold**: ~95-99% certainty (0.95)
- **Description**: Guilt must be proven to a moral certainty
- **Use Case**: Criminal prosecutions, serious regulatory violations

### 3. Mathematical Standard (Invariant of All Conditions)
- **Threshold**: 100% logical certainty (1.0)
- **Description**: Guilt must be logically provable across all possible conditions
- **Use Case**: Mathematical proofs, logical analysis, theoretical frameworks

## Proof Elements Analyzed

1. **CAUSATION**: Did the agent's actions cause the harm?
2. **INTENT**: Did the agent intend the outcome or consequences?
3. **KNOWLEDGE**: Did the agent know of the risk or consequences?
4. **DUTY**: Did the agent have a legal duty or obligation?
5. **BREACH**: Did the agent breach their duty or standard of care?
6. **HARM**: Was there actual harm, damage, or injury?
7. **FORESEEABILITY**: Was the harm reasonably foreseeable?
8. **PROXIMITY**: Was the agent sufficiently proximate to the harm?

## Key Agents

### Prosecution Team
- **Dan**: Primary prosecutor with investigation and evidence presentation capabilities
- **Jax**: Co-prosecutor specializing in legal research and evidence analysis

### Defendant Agents
- **Peter**: Corporate executive with decision-making authority and duty of care
- **Rynette**: Safety manager with hazard reporting and workplace safety obligations
- **Bantjies**: Operations manager with worker safety and production oversight responsibilities

## Usage

### Basic Analysis

```python
from burden_of_proof_analyzer import BurdenOfProofAnalyzer, BurdenStandard
from legal_attention_engine import LegalAttentionEngine

# Create legal attention engine
legal_engine = LegalAttentionEngine(d_model=256, n_heads=4, n_layers=4)

# Create burden analyzer
analyzer = BurdenOfProofAnalyzer(legal_engine)

# Analyze guilt for a specific defendant under a specific standard
analysis = analyzer.analyze_guilt_comprehensive(
    events, agents, norms, 
    defendant_agent_id="peter", 
    standard=BurdenStandard.CIVIL
)

print(f"Overall guilt probability: {analysis.overall_guilt_probability:.2%}")
print(f"Proof gaps: {analysis.proof_gaps}")
print(f"Strategy: {analysis.recommended_strategy}")
```

### Comprehensive Report

```python
# Generate comprehensive analysis for all defendants and standards
report = analyzer.generate_comprehensive_report(events, agents, norms)

# Access results
for defendant_id, standards in report["standards_analysis"].items():
    for standard, analysis in standards.items():
        print(f"{defendant_id} under {standard}: {analysis['overall_guilt_probability']:.2%}")
```

## Strategic Output

The system provides strategic guidance specifically tailored for Dan & Jax, including:

### Prosecution Strategy
- Priority actions to strengthen weak proof elements
- Evidence gathering recommendations
- Expert testimony suggestions
- Documentation requirements
- Standard-specific tactics

### Defense Counter-Analysis
- Likely defense strategies
- Anticipated challenges to evidence
- Procedural defenses
- Burden-shifting arguments

## Example Output

```
OPTIMAL STRATEGY FOR DAN & JAX vs PETER
Standard: balance_of_probabilities
Required threshold: 51.0%

PRIORITY ACTIONS:
1. STRENGTHEN CAUSATION EVIDENCE:
   - Obtain expert testimony on causal mechanisms
   - Document temporal sequence of events
   - Perform but-for analysis with counterfactuals
   - Rule out intervening causes

2. ESTABLISH INTENT:
   - Subpoena communications and documents
   - Interview witnesses about defendant's statements
   - Analyze pattern of behavior for deliberate conduct
```

## Integration with Legal Attention System

The burden analyzer integrates with the existing Legal Attention Inference Engine to:

1. **Extract Attention-Based Evidence**: Uses attention weights to identify which facts are legally salient
2. **Analyze Causal Relationships**: Traces attention patterns to establish causation
3. **Measure Intent Indicators**: Evaluates intentionality through attention to planning and knowledge events
4. **Assess Knowledge States**: Determines what agents knew based on epistemic attention patterns

## File Structure

```
burden_of_proof_analyzer.py           # Main analyzer implementation
tests/burden-of-proof-verification.test.js  # Comprehensive test suite
legal_attention_engine.py             # Core attention-based legal reasoning
legal_scenarios.py                     # Test scenarios and cases
```

## Testing

Run the burden of proof verification tests:

```bash
npm run test:burden-proof
```

Or run all tests including burden analysis:

```bash
npm test
```

## Sample Case Scenario

The system includes a comprehensive sample case involving:

- **Corporate negligence** with multiple levels of responsibility
- **Safety violations** and regulatory compliance failures  
- **Knowledge attribution** across organizational hierarchy
- **Causal chains** from decisions to harm
- **Cover-up attempts** and evidence tampering

This scenario demonstrates how Dan & Jax can build cases against Peter (executive), Rynette (safety manager), and Bantjies (operations manager) under different legal standards.

## Validation

The system has been verified to:

✅ Handle multiple labels and priorities for issue creation
✅ Implement all three legal standards (civil, criminal, mathematical)
✅ Provide agent-specific strategic guidance for Dan & Jax
✅ Analyze all key proof elements (causation, intent, knowledge, etc.)
✅ Integrate with existing legal attention inference system
✅ Generate comprehensive reports with probability assessments
✅ Identify proof gaps and strategic recommendations
✅ Anticipate defense counter-strategies

## Contributing

When extending the burden analysis system:

1. Add new proof elements to the `ProofElement` enum
2. Implement analysis methods following the pattern `_analyze_{element}`
3. Update proof requirements for each legal standard
4. Add corresponding tests in the verification suite
5. Update strategic guidance templates

## Legal Disclaimer

This system is for analytical and educational purposes. It provides strategic guidance based on attention-based legal reasoning but does not constitute legal advice. Consult qualified legal professionals for actual case strategy and litigation decisions.