# AD Paragraph Hypergraph Visualization

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                     Case 2025-137857 Hypergraph                     │
│                   With AD Paragraph Integration                      │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│  Peter Faucitt   │────authored────┐
│   (Applicant)    │                │
└─────┬────────────┘                │
      │                             ▼
      │                    ┌─────────────────────┐
      │                    │ Affidavit Sections  │
      │                    │  (9 sections)       │
      │                    └──────┬──────────────┘
      │                           │ contained-in
      │                           ▼
      │                    ┌─────────────────────┐
      │                    │   AD Paragraphs     │
      │                    │   (50 paragraphs)   │
      │                    └──────┬──────────────┘
      │                           │
      │        ┌──────────────────┼─────────────────┐
      │        │                  │                 │
      │        │ alleges-against  │ supported-by    │
      │        ▼                  ▼                 ▼
      │  ┌──────────┐      ┌──────────┐     ┌──────────┐
      │  │   Jax    │      │  Events  │     │ Evidence │
      └─▶│  & Dan   │      │          │     │          │
         └──────────┘      └──────────┘     └──────────┘
```

## Priority-Based Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│                    AD Paragraph Priority Pyramid                     │
└─────────────────────────────────────────────────────────────────────┘

                            ┌────────┐
                            │ P1: 5  │  Critical
                            │10% ███ │  Financial Allegations
                            └───┬────┘
                        ┌───────┴───────┐
                        │    P2: 8      │  High Priority
                        │   16% ████    │  Credibility Claims
                        └───────┬───────┘
                    ┌───────────┴───────────┐
                    │       P3: 19          │  Medium Priority
                    │      38% ████████     │  Supporting Claims
                    └───────────┬───────────┘
            ┌───────────────────┴───────────────────┐
            │             P4: 17                    │  Low Priority
            │            34% ███████                │  Procedural
            └───────────────────┬───────────────────┘
    ┌───────────────────────────┴───────────────────────────┐
    │                      P5: 1                            │  Meaningless
    │                     2% █                              │  Formal
    └───────────────────────────────────────────────────────┘
```

## Critical Allegations Network

```
┌─────────────────────────────────────────────────────────────────────┐
│              Priority 1 (Critical) Allegation Network                │
└─────────────────────────────────────────────────────────────────────┘

         ┌────────────────────────────────────────────────┐
         │         AD PARA 7.2-7.5                        │
         │    IT Expense Discrepancies                    │
         │         R8.85M claim                           │
         └──────────┬──────────────┬──────────────────────┘
                    │              │
         alleges-against           supported-by
                    │              │
         ┌──────────▼──────────┐   └──────────▶ Evidence: JF8A
         │                     │
         │  Jacqueline Faucitt │
         │     & Dan Faucitt   │
         │                     │
         └─────┬───────────────┘
               │
      ┌────────┴────────┬─────────────────────────┐
      │                 │                         │
      ▼                 ▼                         ▼
┌─────────────┐   ┌─────────────┐         ┌─────────────┐
│ AD PARA 7.6 │   │AD PARA 7.7-8│         │AD PARA 7.9-11│
│  R500K Pay  │   │ Pay Details │         │Justification │
└─────────────┘   └─────────────┘         └─────────────┘
      │                                           │
      └───────────────┬───────────────────────────┘
                      │
                      ▼
           ┌─────────────────────┐
           │  AD PARA 10.5-10.23 │
           │  Systematic         │
           │  Misconduct         │
           └──────┬──────────────┘
                  │
                  │ supported-by
                  ▼
        ┌─────────────────────┐
        │ Evidence:            │
        │ - Forensic Index     │
        │ - Shopify Reports    │
        └─────────────────────┘
```

## Section Organization

```
┌─────────────────────────────────────────────────────────────────────┐
│                  Affidavit Section Structure                         │
└─────────────────────────────────────────────────────────────────────┘

[0015] PURPOSE OF THIS AFFIDAVIT (Procedural)
       └─▶ Contains: PARA 1-1.3

[0025] BACKGROUND (Factual)
       ├─▶ Contains: PARA 2-2.4
       ├─▶ Contains: PARA 7-7.1
       ├─▶ Contains: PARA 7.2-7.5 ⭐ CRITICAL
       └─▶ Contains: PARA 7.6 ⭐ CRITICAL

[0045] MY ROLE AS REGULATORY RESPONSIBLE PERSON (Factual)
       ├─▶ Contains: PARA 3-3.10
       └─▶ Contains: PARA 3.11-3.13

[0068] THE INTERDICT GRANTED ON 19 AUGUST 2025 (Procedural)
       ├─▶ Contains: PARA 11-11.5
       └─▶ Contains: PARA 13-13.1

[0081] WHAT OCCURRED AFTER THE GRANTING OF THE INTERIM INTERDICT (Factual)

[0277] CRITICAL CORRECTION: JF5 AGREEMENT MANIPULATION (Rebuttal)

[0291] EVIDENCE ANALYSIS AND CLASSIFICATION (Analytical)

[0293] CONCLUSION (Procedural)

[0306] THE DELAY IN LAUNCHING THESE PROCEEDINGS (Procedural)
```

## Relationship Type Distribution

```
┌─────────────────────────────────────────────────────────────────────┐
│                     Link Tuple Statistics                            │
└─────────────────────────────────────────────────────────────────────┘

Allegation Relationships:
  alleges-against      █████ (5 links)
  describes-event      █ (1 link)

Evidence Relationships:
  supported-by         ███ (3 links)
  documented-in        ███ (3 links)
  referenced-in        █ (1 link)

Structural Relationships:
  contained-in         █████████ (9 links)
  authored             ███ (3 links)
  priority-group       ████ (4 links)

Event Relationships:
  involved-in          ██ (2 links)
  orchestrated         █ (1 link)
  facilitated          █ (1 link)
  coordinated          █ (1 link)
  witnessed            █ (1 link)
  coordinated-with     █ (1 link)
  occurred-on          ██ (2 links)
  precedes             ████ (4 links)
  targeted-by          ██ (2 links)

Party Relationships:
  respondent-with      █ (1 link)
  applicant-against    ██ (2 links)
  family-of            █ (1 link)
  owns                 ██ (2 links)
```

## Query Patterns

### 1. Find Critical Allegations Against a Person

```javascript
// Find all Priority 1 allegations against Jax
const criticalAgainstJax = hg.queryLinksByRelation('alleges-against')
  .filter(link => 
    link.target === 'jacqueline-faucitt' && 
    link.metadata.priority === 1
  )
  .map(link => hg.entities.get(link.source));

// Result: 5 critical paragraphs
```

### 2. Find Evidence Supporting Claims

```javascript
// Find all evidence supporting IT expense claims
const itEvidence = hg.queryLinksBySource('ad-para-7_2-7_5')
  .filter(link => link.relation === 'supported-by')
  .map(link => hg.entities.get(link.target));

// Result: JF8A documentation
```

### 3. Navigate Section Structure

```javascript
// Find all paragraphs in Background section
const backgroundParas = hg.queryLinksByRelation('contained-in')
  .filter(link => link.target === 'ad-section-background')
  .map(link => hg.entities.get(link.source));

// Result: Multiple financial allegation paragraphs
```

### 4. Priority-Based Filtering

```javascript
// Get all high-priority paragraphs
const highPriority = hg.queryEntitiesByType('ADParagraph')
  .filter(p => p.priority <= 2)
  .sort((a, b) => a.priority - b.priority);

// Result: 13 paragraphs (5 P1 + 8 P2)
```

### 5. Find Connected Allegations

```javascript
// Find allegations in same priority group
const relatedCritical = hg.queryLinksByRelation('priority-group')
  .filter(link => link.metadata.priorityLevel === 1)
  .map(link => ({
    from: hg.entities.get(link.source),
    to: hg.entities.get(link.target)
  }));

// Result: Chain of related critical financial allegations
```

## Integration Points

### With Existing Case Elements

```
┌─────────────────────────────────────────────────────────────────────┐
│                  Hypergraph Integration Map                          │
└─────────────────────────────────────────────────────────────────────┘

Legacy Entities (Pre-AD Integration):
├─ 6 People (Peter, Jax, Dan, Rynette, Son, Gayane)
├─ 5 Events (Bank fraud, Shopify audit, Domain reg, etc.)
├─ 3 Evidence items (JF8A, Forensic Index, Shopify Reports)
├─ 2 Dates (Scheme start/end)
└─ 1 Company (RegimA)

New AD Entities:
├─ 50 AD Paragraphs (Legal claims and allegations)
└─ 9 Affidavit Sections (Document structure)

Cross-Links:
├─ AD Paragraphs ──alleges-against──▶ People
├─ AD Paragraphs ──supported-by────▶ Evidence
├─ AD Paragraphs ──describes-event─▶ Events
├─ AD Paragraphs ──contained-in────▶ Sections
└─ Sections ──────authored─────────▶ Peter
```

## Analysis Capabilities

With the AD paragraph integration, the hypergraph now supports:

1. **Priority-Based Response Planning**
   - Focus resources on P1/P2 allegations
   - Identify quick wins in P4/P5 paragraphs

2. **Evidence Gap Analysis**
   - Find paragraphs without supporting evidence
   - Identify weak allegations

3. **Thematic Clustering**
   - Group related allegations (e.g., all IT expenses)
   - Find patterns in Peter's claims

4. **Cross-Reference Validation**
   - Verify consistency across paragraphs
   - Find contradictions

5. **Strategic Counter-Planning**
   - Map rebuttals to allegations
   - Plan annexure organization

6. **Timeline Correlation**
   - Link allegations to actual events
   - Find temporal inconsistencies

---

*Generated: 2025-10-15*  
*Hypergraph Version: v2.0 with AD Paragraph Integration*
