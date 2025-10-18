# HypergraphQL Quick Start Guide

Get started with HypergraphQL in 5 minutes.

## Installation

The HypergraphQL implementation is already included in this repository. No additional installation needed!

## Running Examples

### 1. Run the Case Example

See HypergraphQL in action with Case 2025-137857:

```bash
npm run hypergraph:example
```

This will display:
- All events in the case
- Peter Faucitt's connections
- Events orchestrated by Rynette Farrar
- Temporal sequence of criminal events
- Path analysis from Peter to RegimA
- Hypergraph statistics

### 2. Run the Tests

Verify the implementation:

```bash
npm run test:hypergraph
```

You should see: **64/64 tests passing (100% success rate)**

## Your First Query

Create a file `my-query.js`:

```javascript
const { buildCase2025137857Hypergraph } = require('./docs/models/hypergnn/case-hypergraph');

/ Build the hypergraph
const hg = buildCase2025137857Hypergraph();

/ Query 1: Find all people
const people = hg.queryEntitiesByType('Person');
console.log('People in the case:');
people.forEach(p => console.log(`  - ${p.name} (${p.role})`));

/ Query 2: Find Peter's involvement
const peterEvents = hg.findConnected('peter-faucitt', 'involved-in');
console.log('\nPeter is involved in:');
peterEvents.forEach(({ entity }) => {
  console.log(`  - ${entity.name} (${entity.date})`);
});

/ Query 3: Find path between entities
const path = hg.findPath('peter-faucitt', 'regima');
console.log('\nConnection path:');
path.forEach(step => {
  console.log(`  ${step.from.name} --[${step.link.relation}]--> ${step.to.name}`);
});
```

Run it:

```bash
node my-query.js
```

## Common Queries

### Find All Events

```javascript
const events = hg.queryEntitiesByType('Event');
```

### Find Connections for a Person

```javascript
const connections = hg.findConnected('peter-faucitt');
```

### Find Events by Relation

```javascript
const orchestrated = hg.queryLinksByRelation('orchestrated');
```

### Find Path Between Entities

```javascript
const path = hg.findPath('start-entity-id', 'end-entity-id');
```

### Get Statistics

```javascript
const stats = hg.getStats();
console.log('Total Entities:', stats.totalEntities);
console.log('Total Link Tuples:', stats.totalLinkTuples);
```

## Understanding Link Tuples

Link tuples connect entities with relationships:

```javascript
hg.addLinkTuple(
  'peter-faucitt',           / source entity
  'involved-in',             / relation type
  'event-2025-04-14',        / target entity
  {                          / metadata
    role: 'alleged-perpetrator',
    evidence: ['bank-statements']
  }
);
```

Each link tuple represents: **"Peter Faucitt is involved-in Event 2025-04-14 as alleged-perpetrator"**

## Key Entity Types

- **Person**: People involved in the case
- **Event**: Criminal events and incidents
- **Evidence**: Documentary evidence
- **Company**: Corporate entities
- **Date**: Timeline markers

## Key Relations

- `involved-in`: Person → Event
- `orchestrated`: Person → Event (leadership)
- `documented-in`: Event → Evidence
- `precedes`: Event → Event (temporal)
- `applicant-against`: Person → Person (legal dispute)
- `targeted-by`: Company → Event

## Exported Data

The complete hypergraph is available as JSON:

```javascript
const fs = require('fs');
const data = JSON.parse(
  fs.readFileSync('docs/models/hypergnn/case-2025-137857-hypergraph.json', 'utf8')
);

console.log('Entities:', data.entities.length);
console.log('Link Tuples:', data.linkTuples.length);
```

## Visualization

The example output shows temporal sequences:

```
2025-04-14: Bank Account Change Fraud
     ↓ (38 days)
2025-05-22: Shopify Audit Trail Destruction
     ↓ (7 days)
2025-05-29: Domain Registration by Son
```

This represents the 85-day criminal scheme progression.

## Case 2025-137857 Summary

The hypergraph models:

- **6 People**: Peter, Jacqueline, Daniel, Rynette, Son, Gayane
- **5 Events**: Criminal events from April 14 to July 8, 2025
- **3 Evidence**: JF8A, Forensic Index, Shopify Reports
- **1 Company**: RegimA (targeted business)
- **2 Dates**: Timeline markers
- **25 Link Tuples**: Relationships and connections

## Next Steps

1. **Explore More**: Check [EXAMPLES.md](./EXAMPLES.md) for advanced queries
2. **API Reference**: See [README.md](./README.md) for complete API
3. **Integration**: Read [INTEGRATION.md](./INTEGRATION.md) for system integration
4. **Customize**: Add your own entities and relationships
5. **Query**: Create custom queries for specific analyses

## Help

If you get stuck:

```bash
# Run tests for validation
npm run test:hypergraph

# Run examples to see it working
npm run hypergraph:example

# Check the documentation
cat docs/models/hypergnn/README.md
```

## Example Output

When you run `npm run hypergraph:example`, you'll see:

```
=== HypergraphQL Example Queries ===

1. All Events in Case:
   - Bank Account Change Fraud (2025-04-14)
   - Shopify Audit Trail Destruction (2025-05-22)
   - Domain Registration by Son (2025-05-29)
   - Administrative Instruction Coordination (2025-06-20)
   - Business Sabotage and POPI Violations (2025-07-08)

2. People and Entities Connected to Peter Faucitt:
   - Bank Account Change Fraud via "involved-in"
   - Shopify Audit Trail Destruction via "involved-in"
   - Gayane Williams via "coordinated-with"
   - Jacqueline Faucitt via "applicant-against"
   - Daniel James Faucitt via "applicant-against"

...and more!
```

## Quick Reference Card

| Task | Code |
|------|------|
| Get all events | `hg.queryEntitiesByType('Event')` |
| Find connections | `hg.findConnected('entity-id')` |
| Query by relation | `hg.queryLinksByRelation('relation-type')` |
| Find path | `hg.findPath('from-id', 'to-id')` |
| Get statistics | `hg.getStats()` |
| Export to JSON | `hg.toJSON()` |
| Import from JSON | `hg.fromJSON(data)` |

---

**Ready to explore?** Run `npm run hypergraph:example` now!
