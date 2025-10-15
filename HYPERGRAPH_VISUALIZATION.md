# HypergraphQL Visualization for Case 2025-137857

**Case:** Peter Andrew Faucitt v. Jacqueline Faucitt et al.  
**Repository:** cogpy/ad-res-j7  
**Date:** October 15, 2025

---

## Overview

This document provides a visual and conceptual representation of the case structure as a hypergraph, enabling sophisticated querying and analysis through GraphQL.

---

## Hypergraph Structure

### Network Statistics

```
Total Nodes: 84
├── Actors: 5
├── Categories: 7
├── Paragraphs: 50
└── Evidence: 22

Total Hyperedges: 98
├── Categorization: 74
├── Supports: 22
└── Strategic Clusters: 2

Average Degree: 2.46
Network Density: 2.81%
```

---

## Node Types

### 1. Actor Nodes (5)

Parties and entities involved in the case:

```
┌─────────────────────────────────────┐
│ ACTORS                              │
├─────────────────────────────────────┤
│ • Peter Faucitt (Applicant)        │
│ • Jacqueline Faucitt (Respondent)  │
│ • Daniel Faucitt (Respondent)      │
│ • RegimA Worldwide Distribution    │
│ • RegimA Skin Treatments           │
└─────────────────────────────────────┘
```

### 2. Category Nodes (7)

Strategic themes organizing the defense:

```
┌────────────────────────────────────────────────────┐
│ STRATEGIC CATEGORIES                               │
├────────────────────────────────────────────────────┤
│ 1. Material Non-Disclosure (50 paragraphs)        │
│    └─ Central thrust: Peter failed to disclose    │
│                                                    │
│ 2. Financial Misconduct (8 paragraphs)            │
│    └─ Core allegations to rebut                   │
│                                                    │
│ 3. Responsible Person Duties (implied)            │
│    └─ Jax's non-delegable legal obligations       │
│                                                    │
│ 4. Business Disruption (2 paragraphs)             │
│    └─ Peter's own disruptive actions              │
│                                                    │
│ 5. Timing/Suspicious Patterns (implied)           │
│    └─ Strategic litigation indicators             │
│                                                    │
│ 6. Disproportionate Harm (5 paragraphs)           │
│    └─ 136:1 harm ratio (R68M vs R500K)            │
│                                                    │
│ 7. Peter's Hypocrisy (implied)                    │
│    └─ Inconsistency with historical practices     │
└────────────────────────────────────────────────────┘
```

### 3. Paragraph Nodes (50)

AD paragraphs from Peter's founding affidavit, organized by priority:

```
┌─────────────────────────────────────────────────────────────┐
│ PRIORITY LEVEL 1: CRITICAL (5 paragraphs, 1 completed)     │
├─────────────────────────────────────────────────────────────┤
│ ✓ PARA_7_2-7_5: IT Expense Discrepancies                   │
│   Evidence: 21 items | Categories: 3                        │
│                                                             │
│ ○ PARA_7_6: R500K Payment                                  │
│   Evidence: 0 items | Categories: 2                         │
│                                                             │
│ ○ PARA_7_7-7_8: R500K Payment Details                      │
│   Evidence: 1 item | Categories: 3                          │
│                                                             │
│ ○ PARA_7_9-7_11: Payment Justification                     │
│   Evidence: 0 items | Categories: 2                         │
│                                                             │
│ ○ PARA_10_5-10_10_23: Detailed Financial Allegations       │
│   Evidence: 0 items | Categories: 4                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ PRIORITY LEVEL 2: HIGH (8 paragraphs, 1 completed)         │
├─────────────────────────────────────────────────────────────┤
│ ○ PARA_3-3_10: Respondent Identification                   │
│ ○ PARA_3_11-3_13: Jax's Role                               │
│ ○ PARA_7_12-7_13: Accountant Concerns                      │
│ ✓ PARA_7_14-7_15: Documentation Requests                   │
│ ○ PARA_8-8_3: Peter's Discovery                            │
│ ○ PARA_8_4: Confrontation                                  │
│ ○ PARA_11-11_5: Urgency                                    │
│ ○ PARA_13-13_1: Interim Relief                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ PRIORITY LEVEL 3: MEDIUM (19 paragraphs, 0 completed)      │
├─────────────────────────────────────────────────────────────┤
│ Relief Sought, Urgency Details, Balance of Convenience,    │
│ Interim Relief, Costs, Service, Further Irregularities,    │
│ Pattern of Conduct, Legal Basis, etc.                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ PRIORITY LEVEL 4: LOW (17 paragraphs, 0 completed)         │
├─────────────────────────────────────────────────────────────┤
│ Introduction, Capacity, Jurisdiction, Corporate Structure, │
│ Additional Relief, Costs Details, Service Details, etc.    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ PRIORITY LEVEL 5: MEANINGLESS (1 paragraph, 0 completed)   │
├─────────────────────────────────────────────────────────────┤
│ ○ PARA_15: Conclusion                                      │
└─────────────────────────────────────────────────────────────┘
```

### 4. Evidence Nodes (22)

Annexures and supporting documentation:

```
┌─────────────────────────────────────────────────────────────┐
│ EVIDENCE ITEMS (22 total)                                   │
├─────────────────────────────────────────────────────────────┤
│ Comprehensive Evidence (PARA_7_2-7_5):                      │
│ • JF1, JF3, JF4, JF4A                                       │
│ • JF5, JF5A, JF5B, JF5C, JF5D, JF5E, JF5F, JF5G, JF5H, JF5I │
│ • JF6, JF6A, JF6B, JF6C, JF6D                               │
│ • PF9, PF10                                                 │
│ • IT_EXPENSES_BREAKDOWN.md                                  │
│ • IT_EXPENSES_SUMMARY.md                                    │
│                                                             │
│ Minimal Evidence (PARA_7_7-7_8):                            │
│ • JF (unspecified)                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Hyperedge Types

### 1. Categorization Edges (74)

Link paragraphs to strategic categories:

```
Paragraph ──[categorization]──> Category

Example:
PARA_7_2-7_5 ──[weight: 5]──> material_non_disclosure
PARA_7_2-7_5 ──[weight: 5]──> financial_misconduct
PARA_7_2-7_5 ──[weight: 5]──> business_disruption
```

### 2. Support Edges (22)

Link evidence to paragraphs:

```
Evidence ──[supports]──> Paragraph

Example:
JF5G ──[weight: 1]──> PARA_7_2-7_5
IT_EXPENSES_BREAKDOWN.md ──[weight: 1]──> PARA_7_2-7_5
```

### 3. Strategic Cluster Edges (2)

Group related paragraphs into strategic clusters:

```
┌──────────────────────────────────────────────────────────┐
│ CLUSTER 1: Critical Financial Misconduct Allegations    │
├──────────────────────────────────────────────────────────┤
│ Weight: 5                                                │
│ Paragraphs:                                              │
│ • PARA_10_5-10_10_23                                     │
│ • PARA_7_2-7_5                                           │
│ • PARA_7_6                                               │
│ • PARA_7_7-7_8                                           │
│ • PARA_7_9-7_11                                          │
│                                                          │
│ Completion Rate: 20% (1/5)                               │
│ Evidence Coverage: 40% (2/5)                             │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ CLUSTER 2: Material Non-Disclosure Pattern              │
├──────────────────────────────────────────────────────────┤
│ Weight: 4                                                │
│ Paragraphs: Top 10 demonstrating material non-disclosure│
│                                                          │
│ Completion Rate: 10% (1/10)                              │
│ Evidence Coverage: 20% (2/10)                            │
└──────────────────────────────────────────────────────────┘
```

---

## GraphQL Query Examples

### Query 1: Get Critical Paragraphs with Evidence

```graphql
query GetCriticalParagraphs {
  paragraphsByPriority(level: 1) {
    name
    topic
    claim
    completed
    evidenceCount
    evidence {
      name
      evidenceType
    }
    categories {
      name
      strategicImportance
    }
  }
}
```

**Result:**

```json
{
  "data": {
    "paragraphsByPriority": [
      {
        "name": "PARA_7_2-7_5",
        "topic": "IT Expense Discrepancies",
        "claim": "Unexplained IT expenses",
        "completed": true,
        "evidenceCount": 21,
        "evidence": [
          {"name": "JF5G", "evidenceType": "annexure"},
          {"name": "IT_EXPENSES_BREAKDOWN.md", "evidenceType": "annexure"}
        ],
        "categories": [
          {"name": "material_non_disclosure", "strategicImportance": 250.0},
          {"name": "financial_misconduct", "strategicImportance": 40.0},
          {"name": "business_disruption", "strategicImportance": 10.0}
        ]
      }
    ]
  }
}
```

### Query 2: Get Evidence Coverage Analysis

```graphql
query GetEvidenceCoverage {
  evidenceCoverage {
    overallCoverage
    coverageByPriority {
      critical
      high
      medium
      low
    }
    paragraphsWithEvidence
    paragraphsWithoutEvidence
    evidenceGaps {
      paragraph {
        name
        priority
        topic
      }
      urgency
    }
  }
}
```

**Result:**

```json
{
  "data": {
    "evidenceCoverage": {
      "overallCoverage": 0.04,
      "coverageByPriority": {
        "critical": 0.40,
        "high": 0.0,
        "medium": 0.0,
        "low": 0.0
      },
      "paragraphsWithEvidence": 2,
      "paragraphsWithoutEvidence": 48,
      "evidenceGaps": [
        {
          "paragraph": {
            "name": "PARA_7_6",
            "priority": "Critical",
            "topic": "R500K Payment"
          },
          "urgency": "HIGH"
        }
      ]
    }
  }
}
```

### Query 3: Get Strategic Clusters

```graphql
query GetStrategicClusters {
  strategicClusters {
    name
    weight
    completionRate
    evidenceCoverage
    paragraphs {
      name
      priority
      completed
      evidenceCount
    }
  }
}
```

**Result:**

```json
{
  "data": {
    "strategicClusters": [
      {
        "name": "Critical Financial Misconduct Allegations",
        "weight": 5,
        "completionRate": 0.20,
        "evidenceCoverage": 0.40,
        "paragraphs": [
          {"name": "PARA_7_2-7_5", "priority": "Critical", "completed": true, "evidenceCount": 21},
          {"name": "PARA_7_6", "priority": "Critical", "completed": false, "evidenceCount": 0}
        ]
      }
    ]
  }
}
```

### Query 4: Get Critical Path Analysis

```graphql
query GetCriticalPath {
  criticalPath {
    completionBottlenecks {
      name
      priority
      evidenceCount
    }
    evidenceGaps {
      name
      priority
      topic
    }
    estimatedEffort {
      estimatedHours
      estimatedDays
      priorityBreakdown {
        critical
        high
        medium
        low
      }
    }
  }
}
```

**Result:**

```json
{
  "data": {
    "criticalPath": {
      "completionBottlenecks": [
        {"name": "PARA_7_6", "priority": "Critical", "evidenceCount": 0},
        {"name": "PARA_7_9-7_11", "priority": "Critical", "evidenceCount": 0}
      ],
      "evidenceGaps": [
        {"name": "PARA_7_6", "priority": "Critical", "topic": "R500K Payment"},
        {"name": "PARA_3-3_10", "priority": "High", "topic": "Respondent Identification"}
      ],
      "estimatedEffort": {
        "estimatedHours": 185,
        "estimatedDays": 23.1,
        "priorityBreakdown": {
          "critical": 4,
          "high": 7,
          "medium": 19,
          "low": 18
        }
      }
    }
  }
}
```

---

## Network Visualization

### Conceptual Graph Structure

```
                    ┌─────────────────┐
                    │ Material Non-   │
                    │  Disclosure     │◄─────────┐
                    │  (50 paras)     │          │
                    └────────┬────────┘          │
                             │                   │
                             │                   │
        ┌────────────────────┼───────────────────┼──────────┐
        │                    │                   │          │
        ▼                    ▼                   ▼          ▼
┌───────────────┐    ┌──────────────┐   ┌──────────────┐  ...
│ PARA_7_2-7_5  │    │  PARA_7_6    │   │ PARA_7_7-7_8 │
│  (Critical)   │    │  (Critical)  │   │  (Critical)  │
│  ✓ Completed  │    │ ○ Pending    │   │ ○ Pending    │
└───────┬───────┘    └──────────────┘   └──────┬───────┘
        │                                       │
        │                                       │
        ▼                                       ▼
┌───────────────┐                      ┌──────────────┐
│  Evidence:    │                      │  Evidence:   │
│  • JF5G       │                      │  • JF        │
│  • JF5D       │                      │              │
│  • IT_EXPENSE │                      │              │
│  • ... (21)   │                      │              │
└───────────────┘                      └──────────────┘
```

### Category Interconnections

```
┌──────────────────────────────────────────────────────────────┐
│                  STRATEGIC CATEGORY NETWORK                  │
└──────────────────────────────────────────────────────────────┘

Material Non-Disclosure (50) ──────┐
                                   │
Financial Misconduct (8) ──────────┼──► Critical Financial
                                   │    Misconduct Cluster
Disproportionate Harm (5) ─────────┘    (5 paragraphs)
                                        
                                        
Responsible Person ─────────────────► PARA_3-3_10
                                      PARA_3_11-3_13
                                      
Business Disruption ────────────────► PARA_7_2-7_5
                                      PARA_7_14-7_15
                                      
Peter's Hypocrisy ──────────────────► Multiple paragraphs
                                      (cross-cutting theme)
```

---

## Query Patterns and Use Cases

### Pattern 1: Evidence Gap Analysis

**Use Case:** Identify which paragraphs need evidence gathering

```graphql
query FindEvidenceGaps {
  paragraphsByPriority(level: 1) {
    name
    evidenceCount
    evidenceStatus
  }
}
```

### Pattern 2: Strategic Category Analysis

**Use Case:** Understand distribution of strategic themes

```graphql
query AnalyzeCategories {
  nodes(type: CATEGORY) {
    ... on CategoryNode {
      name
      paragraphCount
      strategicImportance
    }
  }
}
```

### Pattern 3: Completion Tracking

**Use Case:** Monitor progress on case preparation

```graphql
query TrackCompletion {
  networkStats {
    nodesByType {
      paragraphs
    }
  }
  paragraphsByPriority(level: 1) {
    completed
  }
  paragraphsByPriority(level: 2) {
    completed
  }
}
```

### Pattern 4: Critical Path Optimization

**Use Case:** Determine optimal sequence for completing paragraphs

```graphql
query OptimizeCriticalPath {
  criticalPath {
    recommendedSequence {
      name
      priority
      evidenceCount
      completed
    }
  }
}
```

---

## Implementation Files

### 1. GraphQL Schema (`schema.graphql`)

Defines the complete type system for querying the hypergraph:

- **Types:** Node, ParagraphNode, CategoryNode, EvidenceNode, ActorNode, Hyperedge
- **Queries:** 15+ query types for accessing different aspects of the case
- **Mutations:** 5 mutation types for updating the hypergraph
- **Subscriptions:** Real-time updates for node changes

### 2. Example Queries (`example_queries.graphql`)

25 example queries demonstrating:

- Basic queries (metadata, paragraphs by priority)
- Strategic analysis (clusters, categories, evidence coverage)
- Advanced queries (network analysis, critical path)
- Mutations (updating completion status, adding evidence)

### 3. Python Resolver (`hypergraph_resolver.py`)

Implementation of GraphQL resolvers:

- **Classes:** Node types, hyperedge types, query resolvers
- **Functions:** Evidence coverage analysis, critical path calculation, network statistics
- **Example Output:** Demonstrates live querying of the hypergraph

---

## Key Insights from Hypergraph Analysis

### 1. Material Non-Disclosure is Central

**Finding:** Material non-disclosure category connects to all 50 paragraphs

**Implication:** Successfully establishing material non-disclosure creates cascading effect undermining entire ex parte interdict

**Query to Verify:**

```graphql
query {
  paragraphsByCategory(category: "material_non_disclosure") {
    name
  }
}
```

### 2. Critical Evidence Gap

**Finding:** 96% of paragraphs lack documented evidence (48/50)

**Implication:** Immediate evidence gathering required, especially for critical paragraphs

**Query to Identify:**

```graphql
query {
  evidenceCoverage {
    evidenceGaps {
      paragraph { name priority }
      urgency
    }
  }
}
```

### 3. Strategic Clustering Reveals Priorities

**Finding:** 5 critical paragraphs form tight cluster around financial misconduct

**Implication:** These 5 paragraphs are the core battleground; comprehensive rebuttal essential

**Query to Analyze:**

```graphql
query {
  strategicClusters {
    name
    paragraphs { name completed evidenceCount }
    completionRate
  }
}
```

### 4. Effort Estimation

**Finding:** Estimated 185 hours (23.1 days) to complete all pending paragraphs

**Implication:** Significant effort required; prioritization and parallel work streams essential

**Query to Calculate:**

```graphql
query {
  criticalPath {
    estimatedEffort {
      estimatedHours
      estimatedDays
      priorityBreakdown { critical high medium low }
    }
  }
}
```

---

## Next Steps

### 1. Deploy GraphQL Server

**Action:** Set up GraphQL server (Apollo, Hasura, or custom) to enable querying

**Benefit:** Real-time access to case structure and analytics

### 2. Build Dashboard

**Action:** Create web dashboard using GraphQL queries

**Features:**
- Completion tracking by priority
- Evidence coverage visualization
- Critical path timeline
- Network graph visualization

### 3. Integrate with Workflow

**Action:** Use GraphQL mutations to update completion status as work progresses

**Benefit:** Live tracking of case preparation progress

### 4. Extend Schema

**Action:** Add additional node types (witnesses, legal precedents, court filings)

**Benefit:** Comprehensive case management system

---

**Document Version:** 1.0  
**Last Updated:** October 15, 2025  
**GraphQL Schema Version:** 1.0

