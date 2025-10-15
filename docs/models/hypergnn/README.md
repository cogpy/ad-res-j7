# HypergraphQL with Link Tuples

A query system for legal frameworks using hypergraph structures with link tuples representing relationships between entities.

## Overview

HypergraphQL provides a powerful way to model and query complex relationships in legal cases. It uses **link tuples** - quadruples of `(source, relation, target, metadata)` - to represent connections between entities such as people, events, evidence, and companies.

## Core Concepts

### Entities

Entities represent the nodes in the hypergraph. Each entity has:
- **id**: Unique identifier
- **type**: Entity type (Person, Event, Evidence, Company, Date)
- **properties**: Additional attributes specific to the entity

### Link Tuples

Link tuples represent relationships between entities. Each tuple contains:
- **source**: Source entity ID
- **relation**: Type of relationship
- **target**: Target entity ID  
- **metadata**: Additional context (dates, evidence references, confidence scores, etc.)

### Supported Entity Types

1. **Person**: Individuals involved in the case
2. **Event**: Specific incidents or occurrences
3. **Evidence**: Documentary evidence and proof
4. **Company**: Corporate entities
5. **Date**: Timeline markers

### Common Relations

- `involved-in`: Person to Event
- `orchestrated`: Person to Event (with leadership role)
- `facilitated`: Person to Event (with support role)
- `witnessed`: Person to Event (observer)
- `documented-in`: Event to Evidence
- `referenced-in`: Event to Evidence
- `occurred-on`: Event to Date
- `precedes`: Event to Event (temporal)
- `owns`: Person to Company
- `targeted-by`: Company to Event

## Usage

### Basic Example

```javascript
const HypergraphQL = require('./hypergraphql');

// Create a new hypergraph
const hg = new HypergraphQL();

// Add entities
hg.addEntity('peter-faucitt', 'Person', {
  name: 'Peter Andrew Faucitt',
  role: 'Applicant'
});

hg.addEntity('event-2025-04-14', 'Event', {
  name: 'Bank Account Change Fraud',
  date: '2025-04-14',
  severity: 'Critical'
});

// Add link tuple
hg.addLinkTuple('peter-faucitt', 'involved-in', 'event-2025-04-14', {
  role: 'alleged-perpetrator',
  evidence: ['bank-statements']
});

// Query
const events = hg.queryEntitiesByType('Event');
const connections = hg.findConnected('peter-faucitt');
```

### Case-Specific Implementation

The `case-hypergraph.js` file provides a complete implementation for Case 2025-137857:

```javascript
const { buildCase2025137857Hypergraph } = require('./case-hypergraph');

// Build the case hypergraph
const hg = buildCase2025137857Hypergraph();

// Query all events
const events = hg.queryEntitiesByType('Event');

// Find connections
const peterConnections = hg.findConnected('peter-faucitt');

// Find path between entities
const path = hg.findPath('peter-faucitt', 'regima');

// Get statistics
const stats = hg.getStats();
```

## API Reference

### HypergraphQL Class

#### Constructor
```javascript
const hg = new HypergraphQL();
```

#### Methods

**addEntity(id, type, properties)**
- Add an entity to the hypergraph
- Returns: `this` (for chaining)

**addLinkTuple(source, relation, target, metadata)**
- Add a link tuple representing a relationship
- Returns: `this` (for chaining)

**queryEntitiesByType(type)**
- Query entities by type
- Returns: Array of entities

**queryLinksBySource(sourceId)**
- Query link tuples originating from an entity
- Returns: Array of link tuples

**queryLinksByTarget(targetId)**
- Query link tuples targeting an entity
- Returns: Array of link tuples

**queryLinksByRelation(relation)**
- Query link tuples by relation type
- Returns: Array of link tuples

**findConnected(entityId, relation?)**
- Find all entities connected to a given entity
- Optional relation filter
- Returns: Array of `{entity, link}` objects

**findPath(startId, endId, maxDepth?)**
- Find path between two entities using BFS
- Returns: Array of path steps or null if no path exists

**query(queryObject)**
- Execute complex query with filters
- Returns: Array of results

**toJSON()**
- Export hypergraph to JSON format
- Returns: Object with entities, linkTuples, relations

**fromJSON(data)**
- Import hypergraph from JSON
- Returns: `this`

**getStats()**
- Get statistics about the hypergraph
- Returns: Object with counts and distributions

## Example Queries

### 1. Find All Events in Case
```javascript
const events = hg.queryEntitiesByType('Event');
events.forEach(e => {
  console.log(`${e.name} (${e.date})`);
});
```

### 2. Find All Connections for a Person
```javascript
const connections = hg.findConnected('peter-faucitt');
connections.forEach(({ entity, link }) => {
  console.log(`${entity.name} via "${link.relation}"`);
});
```

### 3. Find Events by Specific Relation
```javascript
const orchestrated = hg.findConnected('rynette-farrar', 'orchestrated');
```

### 4. Find Temporal Sequence
```javascript
const sequence = hg.queryLinksByRelation('precedes');
sequence.forEach(link => {
  const from = hg.entities.get(link.source);
  const to = hg.entities.get(link.target);
  console.log(`${from.date}: ${from.name}`);
  console.log(`  ↓ (${link.metadata.daysBetween} days)`);
  console.log(`${to.date}: ${to.name}`);
});
```

### 5. Find Path Between Entities
```javascript
const path = hg.findPath('peter-faucitt', 'regima');
if (path) {
  path.forEach(step => {
    console.log(`${step.from.name} --[${step.link.relation}]--> ${step.to.name}`);
  });
}
```

### 6. Get Hypergraph Statistics
```javascript
const stats = hg.getStats();
console.log(`Entities: ${stats.totalEntities}`);
console.log(`Link Tuples: ${stats.totalLinkTuples}`);
console.log(`Relations: ${stats.totalRelations}`);
```

### 7. Complex Query with Filters
```javascript
const results = hg.query({
  entityType: 'Event',
  filters: {
    properties: {
      severity: 'Critical'
    }
  }
});
```

## Running Examples

Run the case-specific example implementation:

```bash
node docs/models/hypergnn/case-hypergraph.js
```

This will output:
- All events in the case
- Connections for key individuals
- Temporal event sequences
- Path analysis between entities
- Hypergraph statistics

## Testing

Run the test suite:

```bash
npm run test:hypergraph
```

## Case 2025-137857 Implementation

The case-specific implementation includes:

### Entities
- **6 People**: Peter, Jacqueline, Daniel, Rynette, Son, Gayane
- **5 Events**: Bank letter, Shopify audit, Domain registration, Email coordination, Warehouse POPI
- **3 Evidence**: JF8A, Forensic Index, Shopify Reports
- **1 Company**: RegimA
- **2 Dates**: Timeline markers

### Link Tuples (30+ relationships)
- Person-Event connections (involvement, orchestration, facilitation)
- Person-Person relationships (legal disputes, family connections)
- Event-Evidence documentation links
- Event-Date temporal markers
- Event-Event temporal sequences
- Company-Event targeting relationships

### Key Features
- **Temporal Analysis**: Track 85-day criminal scheme progression
- **Network Centrality**: Identify key actors (Rynette: 0.78, Son: 0.65)
- **Financial Impact**: Link events to R3.1M+ documented losses
- **Evidence Grading**: Track evidence quality (Grade A, B)
- **Path Finding**: Discover connection chains between entities

## Data Model

### Entity Structure
```javascript
{
  id: "entity-id",
  type: "Person|Event|Evidence|Company|Date",
  // type-specific properties
  name: "Entity Name",
  description: "Description",
  ...
}
```

### Link Tuple Structure
```javascript
{
  source: "source-entity-id",
  relation: "relationship-type",
  target: "target-entity-id",
  metadata: {
    // context-specific data
    role: "role-in-relationship",
    evidence: ["evidence-references"],
    date: "2025-04-14",
    ...
  }
}
```

## Integration with Existing Systems

### Evidence Cross-Reference
Link tuples connect to existing evidence files:
- `evidence/correspondence/JF8A_DOCUMENTATION_LOG.md`
- `jax-response/FORENSIC_EVIDENCE_INDEX.md`
- `evidence/shopify_reports/`

### JSON Export/Import
Export hypergraph data for integration with other tools:
```javascript
const json = hg.toJSON();
// Save to file or send to API
fs.writeFileSync('case-hypergraph.json', JSON.stringify(json, null, 2));

// Import from saved data
const newHg = new HypergraphQL().fromJSON(json);
```

## Benefits

1. **Complex Relationship Modeling**: Represent multi-way relationships beyond simple graphs
2. **Flexible Querying**: Find entities, connections, paths, and patterns
3. **Metadata Rich**: Store contextual information in link tuples
4. **Timeline Analysis**: Track temporal sequences and event progressions
5. **Evidence Linking**: Connect legal arguments to supporting evidence
6. **Network Analysis**: Identify key actors and relationship patterns
7. **Path Discovery**: Find connection chains between any two entities

## Future Enhancements

- GraphQL-like query language syntax
- Visualization output (Mermaid diagrams, D3.js graphs)
- Inference rules for deriving new relationships
- Confidence scoring and uncertainty modeling
- Integration with OpenCog HGNNQL
- Real-time query optimization
- Persistent storage adapters

## References

- **GGMLEX Framework**: Advanced ML framework for legal text processing
- **HyperGNN**: Graph neural network analysis for legal frameworks
- **OpenCog HGNNQL**: Hypergraph query language integration
- **Case Documentation**: `/jax-response/FORENSIC_EVIDENCE_INDEX.md`

## License

MIT License - See repository LICENSE file
