# HypergraphQL Examples

Practical examples of using HypergraphQL with link tuples for legal case analysis.

## Basic Usage Example

```javascript
const HypergraphQL = require('./hypergraphql');

// Create a new hypergraph
const hg = new HypergraphQL();

// Add entities
hg.addEntity('peter-faucitt', 'Person', {
  name: 'Peter Andrew Faucitt',
  role: 'Applicant'
});

hg.addEntity('jacqueline-faucitt', 'Person', {
  name: 'Jacqueline Faucitt',
  role: 'Respondent'
});

hg.addEntity('event-2025-04-14', 'Event', {
  name: 'Bank Account Change Fraud',
  date: '2025-04-14',
  severity: 'Critical'
});

// Add link tuples to represent relationships
hg.addLinkTuple('peter-faucitt', 'involved-in', 'event-2025-04-14', {
  role: 'alleged-perpetrator',
  evidence: ['bank-statements', 'timeline-docs']
});

hg.addLinkTuple('peter-faucitt', 'applicant-against', 'jacqueline-faucitt', {
  case: '2025-137857',
  court: 'High Court of South Africa'
});

// Query the graph
console.log('All events:', hg.queryEntitiesByType('Event'));
console.log('Peter\'s connections:', hg.findConnected('peter-faucitt'));
```

## Case 2025-137857 Example

```javascript
const { buildCase2025137857Hypergraph } = require('./case-hypergraph');

// Build the complete case hypergraph
const hg = buildCase2025137857Hypergraph();

// Example 1: Find all criminal events
const events = hg.queryEntitiesByType('Event');
console.log('Criminal Events in Case:');
events.forEach(event => {
  console.log(`- ${event.date}: ${event.name} (${event.severity})`);
});

// Example 2: Analyze Peter Faucitt's involvement
const peterLinks = hg.findConnected('peter-faucitt');
console.log('\nPeter Faucitt\'s Connections:');
peterLinks.forEach(({ entity, link }) => {
  console.log(`- ${entity.name}: ${link.relation}`);
  if (link.metadata.evidence) {
    console.log(`  Evidence: ${link.metadata.evidence.join(', ')}`);
  }
});

// Example 3: Trace the conspiracy network
const rynetteConnections = hg.findConnected('rynette-farrar');
console.log('\nRynette Farrar\'s Network:');
rynetteConnections.forEach(({ entity, link }) => {
  console.log(`- ${link.relation} → ${entity.name}`);
  if (link.metadata.centralityIncrease) {
    console.log(`  Network centrality increased by ${link.metadata.centralityIncrease}`);
  }
});

// Example 4: Timeline analysis
const temporalSequence = hg.queryLinksByRelation('precedes');
console.log('\nCriminal Scheme Timeline:');
temporalSequence.forEach(link => {
  const from = hg.entities.get(link.source);
  const to = hg.entities.get(link.target);
  console.log(`${from.date}: ${from.name}`);
  console.log(`  ↓ ${link.metadata.daysBetween} days later`);
  console.log(`${to.date}: ${to.name}\n`);
});

// Example 5: Evidence mapping
const evidenceDocs = hg.queryEntitiesByType('Evidence');
console.log('Evidence Documents:');
evidenceDocs.forEach(evidence => {
  const links = hg.queryLinksByTarget(evidence.id);
  console.log(`\n${evidence.name} (${evidence.reference}):`);
  links.forEach(link => {
    const event = hg.entities.get(link.source);
    console.log(`  - Documents: ${event.name}`);
    if (link.metadata.evidenceGrade) {
      console.log(`    Grade: ${link.metadata.evidenceGrade}`);
    }
  });
});
```

## Query Examples

### 1. Find All People in the Case

```javascript
const people = hg.queryEntitiesByType('Person');
people.forEach(person => {
  console.log(`${person.name} - ${person.role}`);
});
```

### 2. Find Events by Severity

```javascript
const allEvents = hg.queryEntitiesByType('Event');
const criticalEvents = allEvents.filter(e => e.severity === 'Critical');
console.log('Critical Events:', criticalEvents.map(e => e.name));
```

### 3. Find Who Witnessed What

```javascript
const witnessLinks = hg.queryLinksByRelation('witnessed');
witnessLinks.forEach(link => {
  const witness = hg.entities.get(link.source);
  const event = hg.entities.get(link.target);
  console.log(`${witness.name} witnessed: ${event.name}`);
});
```

### 4. Find Connection Path Between Two Entities

```javascript
const path = hg.findPath('peter-faucitt', 'regima');
if (path) {
  console.log('Connection path found:');
  path.forEach((step, i) => {
    console.log(`${i + 1}. ${step.from.name}`);
    console.log(`   --[${step.link.relation}]-->`);
  });
  console.log(`${path.length + 1}. ${path[path.length - 1].to.name}`);
} else {
  console.log('No connection path found');
}
```

### 5. Find All Events Targeting a Company

```javascript
const targetingLinks = hg.queryLinksByRelation('targeted-by');
targetingLinks.forEach(link => {
  const company = hg.entities.get(link.source);
  const event = hg.entities.get(link.target);
  console.log(`${company.name} was targeted by: ${event.name}`);
  if (link.metadata.financialLoss) {
    console.log(`  Financial loss: R${link.metadata.financialLoss.toLocaleString()}`);
  }
});
```

### 6. Network Centrality Analysis

```javascript
const people = hg.queryEntitiesByType('Person');
const centralityScores = people
  .filter(p => p.centralityScore)
  .sort((a, b) => b.centralityScore - a.centralityScore);

console.log('Network Centrality Rankings:');
centralityScores.forEach((person, i) => {
  console.log(`${i + 1}. ${person.name}: ${person.centralityScore}`);
  const connections = hg.findConnected(person.id);
  console.log(`   Connections: ${connections.length}`);
});
```

### 7. Evidence Quality Assessment

```javascript
const evidenceLinks = hg.queryLinksByRelation('documented-in');
const gradeCount = { A: 0, B: 0, C: 0 };

evidenceLinks.forEach(link => {
  if (link.metadata.evidenceGrade) {
    gradeCount[link.metadata.evidenceGrade]++;
  }
});

console.log('Evidence Quality Distribution:');
console.log(`Grade A: ${gradeCount.A}`);
console.log(`Grade B: ${gradeCount.B}`);
console.log(`Grade C: ${gradeCount.C}`);
```

### 8. Complex Query with Multiple Filters

```javascript
const results = hg.query({
  entityType: 'Event',
  filters: {
    properties: {
      severity: 'Critical'
    }
  }
});

console.log('Critical Events:');
results.forEach(event => {
  console.log(`- ${event.name} (${event.date})`);
  console.log(`  Category: ${event.category}`);
  if (event.financialImpact) {
    console.log(`  Financial Impact: R${event.financialImpact.toLocaleString()}`);
  }
});
```

## Export and Integration

### Export to JSON

```javascript
const json = hg.toJSON();
const fs = require('fs');
fs.writeFileSync('case-hypergraph.json', JSON.stringify(json, null, 2));
console.log('Hypergraph exported to case-hypergraph.json');
```

### Import from JSON

```javascript
const fs = require('fs');
const json = JSON.parse(fs.readFileSync('case-hypergraph.json', 'utf8'));

const hg = new HypergraphQL();
hg.fromJSON(json);

console.log('Hypergraph imported successfully');
console.log(`Entities: ${hg.entities.size}`);
console.log(`Link Tuples: ${hg.linkTuples.length}`);
```

### Generate Report

```javascript
const stats = hg.getStats();

console.log('=== Case Hypergraph Statistics ===\n');
console.log(`Total Entities: ${stats.totalEntities}`);
console.log(`Total Link Tuples: ${stats.totalLinkTuples}`);
console.log(`Total Relations: ${stats.totalRelations}\n`);

console.log('Entities by Type:');
Object.entries(stats.entitiesByType).forEach(([type, count]) => {
  console.log(`  ${type}: ${count}`);
});

console.log('\nRelationships by Type:');
Object.entries(stats.linksByRelation).forEach(([rel, count]) => {
  console.log(`  ${rel}: ${count}`);
});
```

## Advanced Usage

### Subgraph Extraction

```javascript
// Extract all entities and links related to a specific person
function extractSubgraph(hg, entityId) {
  const subgraph = new HypergraphQL();
  const visited = new Set();
  const queue = [entityId];

  while (queue.length > 0) {
    const current = queue.shift();
    if (visited.has(current)) continue;
    visited.add(current);

    // Add entity
    const entity = hg.entities.get(current);
    if (entity) {
      subgraph.addEntity(entity.id, entity.type, entity);
    }

    // Add connected links and entities
    const links = [
      ...hg.queryLinksBySource(current),
      ...hg.queryLinksByTarget(current)
    ];

    links.forEach(link => {
      subgraph.addLinkTuple(
        link.source,
        link.relation,
        link.target,
        link.metadata
      );

      const nextId = link.source === current ? link.target : link.source;
      if (!visited.has(nextId)) {
        queue.push(nextId);
      }
    });
  }

  return subgraph;
}

// Extract Peter's subgraph
const peterSubgraph = extractSubgraph(hg, 'peter-faucitt');
console.log('Peter Faucitt subgraph:');
console.log(peterSubgraph.getStats());
```

### Temporal Analysis

```javascript
// Find all events in a date range
function getEventsInRange(hg, startDate, endDate) {
  const events = hg.queryEntitiesByType('Event');
  return events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= new Date(startDate) && eventDate <= new Date(endDate);
  });
}

const mayEvents = getEventsInRange(hg, '2025-05-01', '2025-05-31');
console.log('Events in May 2025:', mayEvents.map(e => e.name));
```

### Shortest Path Analysis

```javascript
// Find shortest path and analyze it
const path = hg.findPath('peter-faucitt', 'regima');
if (path) {
  console.log('Shortest path from Peter to RegimA:');
  console.log(`Length: ${path.length} steps`);
  
  const relationTypes = path.map(step => step.link.relation);
  console.log('Relation sequence:', relationTypes.join(' → '));
  
  const entityTypes = [
    path[0].from.type,
    ...path.map(step => step.to.type)
  ];
  console.log('Entity type sequence:', entityTypes.join(' → '));
}
```

## Running the Examples

To run the complete case example:

```bash
npm run hypergraph:example
```

To run tests:

```bash
npm run test:hypergraph
```

To use in your own code:

```javascript
const HypergraphQL = require('./docs/models/hypergnn/hypergraphql');
const { buildCase2025137857Hypergraph } = require('./docs/models/hypergnn/case-hypergraph');

// Use the classes as shown in the examples above
```
