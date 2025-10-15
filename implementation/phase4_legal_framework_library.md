# Phase 4: Legal Framework Library Implementation Guide

## Overview
This guide implements the comprehensive South African legal framework library from `analyticase` into other repositories. The library provides machine-readable legal knowledge for automated reasoning, compliance checking, and precedent lookup.

## Benefits
- **Automated Legal Reasoning**: Query legal frameworks programmatically
- **Compliance Checking**: Validate actions against legal requirements
- **Precedent Lookup**: Find relevant case law and statutes
- **Structured Knowledge**: Machine-readable legal relationships
- **Multi-Branch Coverage**: Contract, delict, property, family, succession, administrative, environmental law

## Legal Framework Structure

### Directory Organization

```
lex/
├── README.md                    # Legal framework overview
├── civ/                         # Civil law frameworks
│   └── za/                      # South African jurisdiction
│       ├── south_african_civil_law.scm  # Main framework file
│       ├── contract_law.scm     # Contract law specifics
│       ├── delict_law.scm       # Delict (tort) law
│       ├── property_law.scm     # Property law
│       ├── family_law.scm       # Family law
│       ├── succession_law.scm   # Succession and estate law
│       ├── administrative_law.scm # Administrative law
│       └── environmental_law.scm  # Environmental law
├── crim/                        # Criminal law frameworks
│   └── za/                      # South African jurisdiction
│       └── criminal_law.scm     # Criminal law framework
└── tests/                       # Framework validation tests
    └── test_legal_frameworks.py # Test suite
```

## Scheme Framework Format

The legal frameworks use Scheme (Lisp-style) format for structured knowledge representation:

### Example: Contract Law Framework

```scheme
;; Contract Law Framework - South Africa

;; Contract Formation Requirements
(define contract-formation
  (and
    (consensus "Agreement between parties")
    (capacity "Legal capacity to contract")
    (lawful-object "Lawful purpose")
    (formalities "Required formalities if applicable")
    (certainty "Certain and possible performance")))

;; Essential Elements
(define essential-elements
  '((consensus . "Meeting of minds (offer + acceptance)")
    (capacity . "Parties must have legal capacity")
    (lawful-object . "Contract purpose must be lawful")
    (possibility . "Performance must be possible")
    (certainty . "Terms must be certain")))

;; Types of Contracts
(define contract-types
  '((express . "Explicitly stated terms")
    (tacit . "Implied by conduct")
    (formal . "Requires specific form (writing, etc)")
    (consensual . "No formalities required")))

;; Breach of Contract
(define breach-types
  '((positive-malperformance . "Defective performance")
    (negative-malperformance . "Failure to perform")
    (repudiation . "Refusal to perform")
    (prevention . "Making performance impossible")))

;; Remedies
(define contract-remedies
  '((specific-performance . "Court order to perform")
    (cancellation . "Terminate contract")
    (damages . "Monetary compensation")
    (rectification . "Correct errors in agreement")))

;; Key Legislation
(define contract-legislation
  '((consumer-protection-act . "Consumer Protection Act 68 of 2008")
    (electronic-comms-act . "Electronic Communications and Transactions Act 25 of 2002")
    (alienation-of-land-act . "Alienation of Land Act 68 of 1981")))

;; Notable Precedents
(define contract-precedents
  '((sasfin-v-beukes . "Good faith in contracts")
    (barkhuizen-v-napier . "Public policy and contract terms")
    (bothma-batho-v-manageweb . "Electronic contracts validity")))
```

### Example: Delict Law Framework

```scheme
;; Delict Law Framework - South Africa

;; Elements of Delict (Aquilian Action)
(define delict-elements
  (and
    (conduct "Act or omission")
    (wrongfulness "Unlawful conduct")
    (fault "Intention or negligence")
    (causation "Factual and legal causation")
    (damage "Patrimonial loss")))

;; Types of Delicts
(define delict-types
  '((aquilian-action . "General delict for patrimonial loss")
    (actio-iniuriarum . "Personality rights violation")
    (defamation . "Harm to reputation")
    (vicarious-liability . "Liability for another's acts")))

;; Defenses
(define delict-defenses
  '((consent . "Volenti non fit iniuria")
    (necessity . "Acting out of necessity")
    (self-defense . "Protecting oneself or property")
    (statutory-authority . "Authorized by law")))

;; Key Legislation
(define delict-legislation
  '((apportionment-of-damages-act . "Apportionment of Damages Act 34 of 1956")
    (prescription-act . "Prescription Act 68 of 1969")
    (raa . "Road Accident Fund Act 56 of 1996")))
```

## Implementation Files

### lex/README.md - Legal Framework Overview

```markdown
# Legal Framework Library

## Overview
This library contains machine-readable legal frameworks for South African law, enabling automated legal reasoning, compliance checking, and precedent lookup.

## Structure

### Civil Law (`civ/za/`)
- **Contract Law**: Contract formation, breach, remedies
- **Delict Law**: Torts, liability, damages
- **Property Law**: Ownership, possession, servitudes
- **Family Law**: Marriage, divorce, maintenance
- **Succession Law**: Wills, intestacy, estates
- **Administrative Law**: Government actions, judicial review
- **Environmental Law**: Conservation, pollution, impact assessment

### Criminal Law (`crim/za/`)
- **General Principles**: Actus reus, mens rea
- **Specific Offenses**: Fraud, theft, assault
- **Procedure**: Investigation, prosecution, appeals

## Usage

### Querying Frameworks

```python
from lex_framework import LegalFramework

# Load framework
framework = LegalFramework('lex/civ/za/contract_law.scm')

# Query elements
elements = framework.get_essential_elements('contract-formation')
# Returns: ['consensus', 'capacity', 'lawful-object', 'certainty']

# Find remedies
remedies = framework.get_remedies('breach-of-contract')
# Returns: ['specific-performance', 'cancellation', 'damages', 'rectification']

# Get relevant legislation
laws = framework.get_legislation('contract')
# Returns: [('Consumer Protection Act 68 of 2008', ...), ...]
```

### Compliance Checking

```python
from lex_compliance import ComplianceChecker

checker = ComplianceChecker()

# Check if action complies with framework
result = checker.validate_contract(
    has_consensus=True,
    has_capacity=True,
    lawful_object=True,
    formalities_met=True
)
# Returns: {'valid': True, 'missing_elements': []}
```

## Maintenance

- Regular updates to reflect new legislation
- Addition of new precedents
- Review of legal requirements
- Validation against current law

## Contributing

1. Follow Scheme syntax guidelines
2. Include comments explaining legal concepts
3. Reference legislation by full title and year
4. Add test cases for new frameworks
5. Update documentation

---

**Last Updated**: October 2025
```

### lex/civ/za/README.md - South African Civil Law

```markdown
# South African Civil Law Frameworks

## Overview
Comprehensive machine-readable frameworks for South African civil law across multiple branches.

## Legal Branches

### Contract Law (`contract_law.scm`)
**Covers:**
- Contract formation requirements
- Types of contracts
- Breach and remedies
- Consumer protection
- Electronic contracts

**Key Legislation:**
- Consumer Protection Act 68 of 2008
- Electronic Communications and Transactions Act 25 of 2002
- Alienation of Land Act 68 of 1981

### Delict Law (`delict_law.scm`)
**Covers:**
- Elements of delict (Aquilian action)
- Actio iniuriarum
- Defenses
- Damages

**Key Legislation:**
- Apportionment of Damages Act 34 of 1956
- Road Accident Fund Act 56 of 1996

### Property Law (`property_law.scm`)
**Covers:**
- Ownership and possession
- Real rights
- Servitudes
- Registration requirements

**Key Legislation:**
- Deeds Registries Act 47 of 1937
- Sectional Titles Act 95 of 1986

### Family Law (`family_law.scm`)
**Covers:**
- Marriage requirements and types
- Divorce grounds and procedures
- Maintenance obligations
- Parental rights

**Key Legislation:**
- Divorce Act 70 of 1979
- Maintenance Act 99 of 1998
- Children's Act 38 of 2005

### Succession Law (`succession_law.scm`)
**Covers:**
- Testamentary succession (wills)
- Intestate succession
- Estate administration
- Executor duties

**Key Legislation:**
- Wills Act 7 of 1953
- Administration of Estates Act 66 of 1965
- Intestate Succession Act 81 of 1987

### Administrative Law (`administrative_law.scm`)
**Covers:**
- Administrative action requirements
- Judicial review grounds
- PAJA procedures
- Fair administrative process

**Key Legislation:**
- Promotion of Administrative Justice Act 3 of 2000 (PAJA)
- Constitution of South Africa

### Environmental Law (`environmental_law.scm`)
**Covers:**
- Environmental rights
- Impact assessments
- Pollution control
- Conservation requirements

**Key Legislation:**
- National Environmental Management Act 107 of 1998 (NEMA)
- National Water Act 36 of 1998

## Usage Examples

### Contract Validation
```python
from lex.civ.za.contract_law import validate_contract

result = validate_contract({
    'consensus': True,
    'capacity': True,
    'lawful_object': True,
    'certainty': True
})
print(f"Valid contract: {result.valid}")
```

### Find Relevant Remedies
```python
from lex.civ.za.delict_law import get_remedies

remedies = get_remedies('wrongful-conduct')
print(f"Available remedies: {remedies}")
```

---

**Last Updated**: October 2025
```

## Testing Framework

### tests/test_legal_frameworks.py

```python
"""
Test suite for legal framework validation
"""

import pytest
from lex_framework import LegalFramework
from lex_compliance import ComplianceChecker

class TestContractLaw:
    """Test contract law framework"""
    
    def test_contract_formation_elements(self):
        """Test contract formation has all required elements"""
        framework = LegalFramework('lex/civ/za/contract_law.scm')
        elements = framework.get_essential_elements('contract-formation')
        
        assert 'consensus' in elements
        assert 'capacity' in elements
        assert 'lawful-object' in elements
        assert 'certainty' in elements
    
    def test_breach_remedies(self):
        """Test breach of contract remedies"""
        framework = LegalFramework('lex/civ/za/contract_law.scm')
        remedies = framework.get_remedies('contract-breach')
        
        assert 'specific-performance' in remedies
        assert 'cancellation' in remedies
        assert 'damages' in remedies
    
    def test_compliance_checking(self):
        """Test contract compliance validation"""
        checker = ComplianceChecker()
        
        # Valid contract
        result = checker.validate_contract(
            has_consensus=True,
            has_capacity=True,
            lawful_object=True,
            formalities_met=True
        )
        assert result['valid'] == True
        
        # Invalid contract (missing consensus)
        result = checker.validate_contract(
            has_consensus=False,
            has_capacity=True,
            lawful_object=True,
            formalities_met=True
        )
        assert result['valid'] == False
        assert 'consensus' in result['missing_elements']

class TestDelictLaw:
    """Test delict law framework"""
    
    def test_delict_elements(self):
        """Test delict has all required elements"""
        framework = LegalFramework('lex/civ/za/delict_law.scm')
        elements = framework.get_essential_elements('delict')
        
        assert 'conduct' in elements
        assert 'wrongfulness' in elements
        assert 'fault' in elements
        assert 'causation' in elements
        assert 'damage' in elements
    
    def test_defenses(self):
        """Test available defenses"""
        framework = LegalFramework('lex/civ/za/delict_law.scm')
        defenses = framework.get_defenses('delict')
        
        assert 'consent' in defenses
        assert 'necessity' in defenses
        assert 'self-defense' in defenses

# Add tests for other branches...
```

## Integration with Analysis Tools

### Example: Automated Compliance Checking

```python
"""
Integrate legal framework with case analysis
"""

from lex_framework import LegalFramework
from hypergnn_framework import HyperGNNFramework

class LegalComplianceAnalyzer:
    """Analyze case for legal compliance"""
    
    def __init__(self):
        self.contract_framework = LegalFramework('lex/civ/za/contract_law.scm')
        self.delict_framework = LegalFramework('lex/civ/za/delict_law.scm')
        self.case_analyzer = HyperGNNFramework()
    
    def analyze_contract(self, case_data):
        """Analyze contract for legal compliance"""
        
        # Extract contract elements from case
        elements = self.case_analyzer.extract_contract_elements(case_data)
        
        # Check against framework
        required = self.contract_framework.get_essential_elements('contract-formation')
        
        missing = []
        for element in required:
            if element not in elements or not elements[element]:
                missing.append(element)
        
        return {
            'valid': len(missing) == 0,
            'missing_elements': missing,
            'recommendations': self._generate_recommendations(missing)
        }
    
    def _generate_recommendations(self, missing_elements):
        """Generate recommendations for missing elements"""
        recommendations = []
        
        for element in missing_elements:
            if element == 'consensus':
                recommendations.append(
                    "Obtain clear offer and acceptance to establish consensus"
                )
            elif element == 'capacity':
                recommendations.append(
                    "Verify all parties have legal capacity to contract"
                )
            # ... more recommendations
        
        return recommendations
```

## Repository-Specific Adaptations

### For ad-res-j7:
- Import relevant frameworks for Case 2025-137857
- Add compliance checking for legal responses
- Integrate with affidavit validation

### For analysss:
- Port framework structure
- Integrate with HyperGNN analysis
- Add criminal law frameworks
- Connect to entity scanning

### For avtomaatoctory:
- Basic framework implementation
- Focus on contract and delict law
- Simplified compliance checking

## Implementation Steps

### Step 1: Create Directory Structure
```bash
mkdir -p lex/civ/za
mkdir -p lex/crim/za
mkdir -p lex/tests
```

### Step 2: Copy Framework Files
- Copy .scm files from analyticase
- Adapt for repository-specific needs
- Add repository-specific frameworks

### Step 3: Create Python Integration
- Build framework parser
- Create compliance checker
- Add query interface

### Step 4: Add Tests
- Create test suite
- Validate all frameworks
- Add integration tests

### Step 5: Documentation
- Update README files
- Add usage examples
- Create integration guides

## Best Practices

1. **Regular Updates**: Keep frameworks current with new legislation
2. **Test Coverage**: All frameworks should have comprehensive tests
3. **Documentation**: Comment legal concepts clearly
4. **Precedents**: Include notable case law
5. **Cross-References**: Link related legal concepts

## Maintenance Guidelines

1. **Quarterly Reviews**: Review frameworks for legal changes
2. **Precedent Updates**: Add new case law quarterly
3. **Legislation Tracking**: Monitor new legislation
4. **Validation**: Run tests after any changes
5. **Documentation**: Keep usage examples current

---

**Last Updated**: October 2025
