# HypergraphQL Legal Document System

A comprehensive hypergraph-based system for planning, generating, and evaluating legal documents including affidavits, notes, annexures, and evidence management.

## 🌟 Features

### 📋 Intelligent Plan Generation
- **Multi-strategy planning**: Defensive, offensive, and balanced approaches
- **Pattern recognition**: Identifies fraud, breach, urgency patterns
- **Evidence gap analysis**: Identifies missing evidence needed for claims
- **Timeline integration**: Creates chronological narrative structures
- **Complexity assessment**: Rates document complexity on 1-10 scale

### 📄 Document Generation
- **Template-based generation**: Standard affidavit, answering affidavit, expert affidavit templates
- **Automatic paragraph numbering**: Maintains proper legal formatting
- **Evidence integration**: Links evidence to specific claims and paragraphs
- **Annexure management**: Organizes and references supporting documents
- **Cross-reference handling**: Maintains consistency across document

### 🔍 Comprehensive Evaluation
- **Multi-dimensional scoring**: 
  - Structural integrity (15%)
  - Evidential strength (30%)
  - Legal compliance (25%)
  - Persuasiveness (20%)
  - Technical quality (10%)
- **Pattern detection**: Identifies hearsay, speculation, vague language
- **Rating system**: 5-star rating with detailed feedback
- **Improvement roadmap**: Prioritized actions with time estimates

### 📊 Advanced Analytics
- **Evidence strength calculation**: Weights evidence by credibility and relevance
- **Timeline visualization**: Identifies critical periods and patterns
- **Comparative analysis**: Compare multiple affidavits
- **Quality benchmarking**: Against document type standards

## 🚀 Quick Start

```javascript
const LegalDocumentSystem = require('./legal-hypergraphql');

/ Initialize the system
const system = new LegalDocumentSystem();

/ Define case requirements
const requirements = {
  documentType: 'answering-affidavit',
  purpose: 'Respond to urgent application',
  deponent: {
    name: 'Jane Doe',
    occupation: 'Business Owner'
  },
  claims: ['Claim 1', 'Claim 2'],
  evidence: [
    { id: 'ev1', type: 'documentary', description: 'Contract' }
  ],
  urgency: 'urgent',
  strategy: 'defensive'
};

/ Generate plan
const plan = await system.generateAffidavitPlan(requirements);

/ Generate affidavit from plan
const affidavit = await system.generateAffidavitFromPlan(plan.id, content);

/ Evaluate the affidavit
const evaluation = await system.evaluateAffidavit(affidavit.id);

console.log(`Score: ${evaluation.overallScore}/100`);
console.log(`Rating: ${evaluation.rating.level}`);
```

## 📁 System Architecture

```
legal-hypergraphql/
├── index.js                    # Main system entry point
├── legal-document-hypergraph.js # Core hypergraph implementation
├── affidavit-plan-generator.js  # Intelligent plan generation
├── affidavit-evaluator.js       # Multi-dimensional evaluation
├── demo.js                      # Demonstration script
├── test.js                      # Test suite
└── README.md                    # This file
```

## 🔧 Core Components

### LegalDocumentHypergraph
The foundation class that extends HypergraphQL with legal-specific:
- Entity types (Affidavit, Evidence, LegalClaim, etc.)
- Relation types (supports, contradicts, corroborates, etc.)
- Legal frameworks and templates
- Document plan generation
- Timeline visualization

### AffidavitPlanGenerator
Sophisticated planning system that:
- Analyzes case patterns
- Selects optimal strategy
- Plans document structure
- Maps evidence to sections
- Identifies gaps and opportunities
- Generates strategic notes

### AffidavitEvaluator
Comprehensive evaluation engine that:
- Scores across 5 major criteria
- Detects problematic patterns
- Compares against benchmarks
- Generates improvement roadmaps
- Provides actionable recommendations

## 🎯 Use Cases

1. **Urgent Applications**: Generate responding affidavits quickly with proper structure
2. **Complex Litigation**: Manage hundreds of evidence items and cross-references
3. **Quality Assurance**: Evaluate drafts before filing
4. **Training**: Learn best practices through recommendations
5. **Standardization**: Ensure consistent document quality

## 📊 Evaluation Criteria

### Structural (15%)
- Organization and logical flow
- Completeness of required sections
- Proper formatting
- Clear section demarcation

### Evidential (30%)
- Relevance of evidence to claims
- Sufficiency of supporting documents
- Credibility of sources
- Proper referencing

### Legal (25%)
- Compliance with procedural rules
- Admissibility of evidence
- Proper legal form
- Precedent alignment

### Persuasive (20%)
- Compelling narrative
- Sound logical reasoning
- Appropriate tone
- Deponent credibility

### Technical (10%)
- Clear and precise language
- Internal consistency
- Proper citations
- Correct terminology

## 🏆 Rating System

- **Exceptional** (90-100): Ready for filing with minor polish
- **Excellent** (80-89): Strong document, address minor issues
- **Good** (70-79): Solid foundation, some improvements needed
- **Satisfactory** (60-69): Acceptable but needs work
- **Needs Improvement** (50-59): Significant issues to address
- **Poor** (0-49): Major revision required

## 🛠️ Advanced Features

### Pattern Detection
Automatically identifies and flags:
- Hearsay statements
- Speculation and opinion
- Argumentative language
- Vague or imprecise terms
- Internal contradictions

### Evidence Management
- Categorizes evidence by type
- Maps evidence to claims
- Identifies gaps in proof
- Suggests additional evidence
- Organizes annexures efficiently

### Timeline Analysis
- Extracts dates from text
- Identifies critical periods
- Detects chronological inconsistencies
- Visualizes event sequences
- Highlights patterns of behavior

## 📈 Performance

The system is designed to handle:
- Documents with 100+ paragraphs
- 50+ evidence items
- Complex multi-party litigation
- Urgent turnaround requirements
- Comparative analysis of multiple documents

## 🔒 Legal Compliance

Built with South African legal requirements in mind:
- Proper affidavit format
- Commissioner of Oaths requirements
- Evidence admissibility rules
- Procedural compliance
- Professional language standards

## 🚦 Testing

Run the comprehensive test suite:

```bash
node test.js
```

Tests cover:
- Plan generation
- Document creation
- Evaluation accuracy
- Pattern detection
- Evidence integration
- Timeline analysis
- Complexity calculation
- Rating system

## 📝 Example Output

```
Overall Score: 87/100
Rating: Excellent ⭐⭐⭐⭐

Detailed Scores:
structural      ████████░░ 82%
evidential      █████████░ 91%
legal           █████████░ 95%
persuasive      ████████░░ 84%
technical       ████████░░ 88%

Strengths:
✅ Strong supporting evidence
✅ Chronologically consistent
✅ Properly commissioned

Issues:
⚠️ 3 instances of potential hearsay
⚠️ Some vague date references

Recommendations:
1. Remove or qualify hearsay statements
2. Specify exact dates where possible
3. Add evidence for unsupported claims
```

## 🎓 Best Practices

1. **Plan First**: Always generate a plan before drafting
2. **Evidence Early**: Gather all evidence before starting
3. **Iterate**: Use evaluation feedback to improve
4. **Pattern Check**: Review pattern analysis carefully
5. **Timeline Focus**: Ensure chronological consistency

## 🤝 Contributing

This system demonstrates engineering excellence in legal document automation. Contributions that maintain the high standards of sophistication and completeness are welcome.

## 📄 License

This advanced legal document system is part of the Case 2025-137857 project.