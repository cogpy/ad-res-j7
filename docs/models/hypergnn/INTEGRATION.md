# HypergraphQL Integration Guide

Guide for integrating HypergraphQL with link tuples into the legal case analysis workflow.

## Overview

HypergraphQL provides a powerful query interface for exploring relationships in Case 2025-137857. This guide explains how to integrate it with existing repository structures.

## Architecture

```
Repository Structure:
├── docs/models/hypergnn/          # HypergraphQL implementation
│   ├── hypergraphql.js            # Core hypergraph class
│   ├── case-hypergraph.js         # Case-specific implementation
│   ├── case-2025-137857-hypergraph.json  # Exported data
│   ├── README.md                  # Documentation
│   ├── EXAMPLES.md                # Usage examples
│   └── INTEGRATION.md             # This file
├── tests/
│   └── hypergraphql.test.js       # Test suite
└── package.json                   # Scripts configuration
```

## Integration Points

### 1. Evidence Cross-Reference

Link tuples connect to existing evidence:

```javascript
const HypergraphQL = require('./docs/models/hypergnn/hypergraphql');
const fs = require('fs');

// Load evidence data
const forensicIndex = JSON.parse(
  fs.readFileSync('jax-response/FORENSIC_EVIDENCE_INDEX.json', 'utf8')
);

// Create hypergraph
const hg = new HypergraphQL();

// Add evidence entities from index
forensicIndex.sections.forEach(section => {
  if (section.heading.includes('CATEGORY')) {
    hg.addEntity(`evidence-${section.heading}`, 'Evidence', {
      name: section.heading,
      content: section.content
    });
  }
});
```

### 2. Timeline Integration

Connect with timeline documents:

```javascript
// Parse timeline data
const timelineData = parseTimelineDocument('jax-response/revenue-theft/14-apr-bank-letter/APR-SEP-2025.md');

timelineData.events.forEach(event => {
  hg.addEntity(event.id, 'Event', {
    name: event.name,
    date: event.date,
    description: event.description
  });

  // Add temporal links
  if (event.previousEvent) {
    hg.addLinkTuple(event.previousEvent, 'precedes', event.id, {
      daysBetween: calculateDaysBetween(event.previousDate, event.date)
    });
  }
});
```

### 3. Network Analysis Integration

Integrate with network centrality analysis:

```javascript
// Load network analysis data
const networkData = loadNetworkAnalysis('jax-response/revenue-theft/29-may-domain-registration/');

// Add to hypergraph with centrality scores
Object.entries(networkData.nodes).forEach(([id, node]) => {
  hg.addEntity(id, 'Person', {
    name: node.name,
    centralityScore: node.centrality,
    role: node.role
  });
});

// Add network connections
networkData.edges.forEach(edge => {
  hg.addLinkTuple(edge.from, edge.relation, edge.to, {
    weight: edge.weight,
    confidence: edge.confidence
  });
});
```

### 4. Financial Flow Integration

Link financial evidence to events:

```javascript
// Load financial data
const financialData = loadFinancialEvidence('evidence/shopify_reports/');

financialData.transactions.forEach(tx => {
  hg.addEntity(tx.id, 'Transaction', {
    amount: tx.amount,
    date: tx.date,
    description: tx.description
  });

  // Link to relevant events
  if (tx.relatedEvent) {
    hg.addLinkTuple(tx.relatedEvent, 'resulted-in', tx.id, {
      financialImpact: tx.amount,
      currency: 'ZAR'
    });
  }
});
```

## Query Integration

### Answering Legal Questions

Use HypergraphQL to answer specific legal questions:

```javascript
// Question: "What events is Peter Faucitt allegedly involved in?"
function findPeterInvolvement(hg) {
  const peterLinks = hg.queryLinksBySource('peter-faucitt');
  const events = peterLinks
    .filter(link => link.relation === 'involved-in')
    .map(link => hg.entities.get(link.target));
  
  return events.map(event => ({
    name: event.name,
    date: event.date,
    severity: event.severity,
    evidence: link.metadata.evidence
  }));
}

// Question: "What evidence supports Event X?"
function findEventEvidence(hg, eventId) {
  const links = hg.queryLinksBySource(eventId);
  const evidenceLinks = links.filter(l => 
    l.relation === 'documented-in' || l.relation === 'referenced-in'
  );
  
  return evidenceLinks.map(link => {
    const evidence = hg.entities.get(link.target);
    return {
      reference: evidence.reference,
      name: evidence.name,
      grade: link.metadata.evidenceGrade,
      path: `evidence/${evidence.reference}`
    };
  });
}

// Question: "How are these two people connected?"
function explainConnection(hg, person1Id, person2Id) {
  const path = hg.findPath(person1Id, person2Id);
  if (!path) return 'No connection found';
  
  const explanation = path.map(step => 
    `${step.from.name} ${step.link.relation} ${step.to.name}`
  ).join(' → ');
  
  return explanation;
}
```

### Report Generation

Generate reports from hypergraph data:

```javascript
function generateConnectionReport(hg, personId) {
  const person = hg.entities.get(personId);
  const connections = hg.findConnected(personId);
  
  const report = {
    subject: person.name,
    role: person.role,
    totalConnections: connections.length,
    byType: {},
    timeline: []
  };
  
  // Group by entity type
  connections.forEach(({ entity, link }) => {
    const type = entity.type;
    if (!report.byType[type]) {
      report.byType[type] = [];
    }
    report.byType[type].push({
      name: entity.name,
      relation: link.relation,
      metadata: link.metadata
    });
  });
  
  // Create timeline
  const events = connections
    .filter(c => c.entity.type === 'Event')
    .sort((a, b) => new Date(a.entity.date) - new Date(b.entity.date));
  
  report.timeline = events.map(e => ({
    date: e.entity.date,
    event: e.entity.name,
    role: e.link.metadata.role
  }));
  
  return report;
}

// Generate and save report
const report = generateConnectionReport(hg, 'peter-faucitt');
fs.writeFileSync(
  'reports/peter-faucitt-connections.json',
  JSON.stringify(report, null, 2)
);
```

## API Integration

### REST API Endpoints

Example Express.js integration:

```javascript
const express = require('express');
const { buildCase2025137857Hypergraph } = require('./docs/models/hypergnn/case-hypergraph');

const app = express();
const hg = buildCase2025137857Hypergraph();

// Get all entities by type
app.get('/api/entities/:type', (req, res) => {
  const entities = hg.queryEntitiesByType(req.params.type);
  res.json(entities);
});

// Get entity connections
app.get('/api/entities/:id/connections', (req, res) => {
  const connections = hg.findConnected(req.params.id);
  res.json(connections);
});

// Find path between entities
app.get('/api/path/:from/:to', (req, res) => {
  const path = hg.findPath(req.params.from, req.params.to);
  res.json(path || { message: 'No path found' });
});

// Query with filters
app.post('/api/query', (req, res) => {
  const results = hg.query(req.body);
  res.json(results);
});

// Get statistics
app.get('/api/stats', (req, res) => {
  res.json(hg.getStats());
});

app.listen(3000, () => {
  console.log('HypergraphQL API running on port 3000');
});
```

### GraphQL Integration

Example GraphQL schema:

```graphql
type Entity {
  id: ID!
  type: String!
  name: String
  properties: JSON
}

type LinkTuple {
  source: String!
  relation: String!
  target: String!
  metadata: JSON
}

type Connection {
  entity: Entity!
  link: LinkTuple!
}

type PathStep {
  from: Entity!
  to: Entity!
  link: LinkTuple!
}

type Query {
  entity(id: ID!): Entity
  entities(type: String): [Entity!]!
  connections(entityId: ID!, relation: String): [Connection!]!
  path(from: ID!, to: ID!, maxDepth: Int): [PathStep!]
  search(query: SearchInput!): [Entity!]!
  stats: Statistics!
}

input SearchInput {
  entityType: String
  relation: String
  filters: JSON
}

type Statistics {
  totalEntities: Int!
  totalLinkTuples: Int!
  totalRelations: Int!
  entitiesByType: JSON!
  linksByRelation: JSON!
}
```

## Visualization Integration

### Mermaid Diagram Generation

Generate Mermaid diagrams from hypergraph:

```javascript
function generateMermaidDiagram(hg, entityId, depth = 2) {
  const lines = ['graph TD'];
  const visited = new Set();
  const queue = [[entityId, 0]];
  
  while (queue.length > 0) {
    const [current, currentDepth] = queue.shift();
    if (visited.has(current) || currentDepth >= depth) continue;
    visited.add(current);
    
    const entity = hg.entities.get(current);
    const connections = hg.findConnected(current);
    
    connections.forEach(({ entity: target, link }) => {
      lines.push(
        `    ${current}["${entity.name}"] -->|${link.relation}| ${target.id}["${target.name}"]`
      );
      
      if (currentDepth + 1 < depth) {
        queue.push([target.id, currentDepth + 1]);
      }
    });
  }
  
  return lines.join('\n');
}

// Generate diagram
const diagram = generateMermaidDiagram(hg, 'peter-faucitt', 2);
console.log(diagram);
```

### D3.js Integration

Export data for D3.js visualization:

```javascript
function exportForD3(hg) {
  const nodes = Array.from(hg.entities.values()).map(entity => ({
    id: entity.id,
    name: entity.name || entity.description,
    type: entity.type,
    ...entity
  }));
  
  const links = hg.linkTuples.map(link => ({
    source: link.source,
    target: link.target,
    relation: link.relation,
    ...link.metadata
  }));
  
  return { nodes, links };
}

// Export for visualization
const graphData = exportForD3(hg);
fs.writeFileSync('visualization/graph-data.json', JSON.stringify(graphData, null, 2));
```

## Automated Updates

### Sync with Evidence Repository

```javascript
const chokidar = require('chokidar');

// Watch evidence directory for changes
const watcher = chokidar.watch('evidence/**/*.md', {
  persistent: true
});

watcher.on('change', (path) => {
  console.log(`Evidence updated: ${path}`);
  // Rebuild hypergraph with new evidence
  const hg = rebuildHypergraph();
  // Save updated version
  fs.writeFileSync(
    'docs/models/hypergnn/case-2025-137857-hypergraph.json',
    JSON.stringify(hg.toJSON(), null, 2)
  );
  console.log('Hypergraph updated');
});
```

### CI/CD Integration

Add to `.github/workflows/hypergraph-update.yml`:

```yaml
name: Update Hypergraph

on:
  push:
    paths:
      - 'evidence/**'
      - 'jax-response/**'

jobs:
  update-hypergraph:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm install
      - run: node scripts/rebuild-hypergraph.js
      - run: npm run test:hypergraph
      - uses: stefanzweifel/git-auto-commit-action@v4
        with:
          commit_message: "chore: update hypergraph data"
          file_pattern: "docs/models/hypergnn/*.json"
```

## Performance Considerations

### Large Graphs

For large hypergraphs, consider:

1. **Indexing**: Add indexes for frequently queried fields
2. **Caching**: Cache frequently accessed paths and queries
3. **Lazy Loading**: Load entities on-demand
4. **Pagination**: Paginate large result sets

```javascript
class OptimizedHypergraphQL extends HypergraphQL {
  constructor() {
    super();
    this.cache = new Map();
    this.indexes = {
      byType: new Map(),
      byRelation: new Map()
    };
  }
  
  addEntity(id, type, properties) {
    super.addEntity(id, type, properties);
    // Update indexes
    if (!this.indexes.byType.has(type)) {
      this.indexes.byType.set(type, []);
    }
    this.indexes.byType.get(type).push(id);
  }
  
  queryEntitiesByType(type) {
    const ids = this.indexes.byType.get(type) || [];
    return ids.map(id => this.entities.get(id));
  }
}
```

## Best Practices

1. **Consistent Entity IDs**: Use kebab-case for entity IDs
2. **Descriptive Relations**: Use clear, specific relation names
3. **Rich Metadata**: Include relevant context in link metadata
4. **Evidence References**: Always link to source evidence
5. **Date Tracking**: Include dates in metadata for temporal analysis
6. **Grade Evidence**: Mark evidence quality (Grade A, B, C)
7. **Version Control**: Commit hypergraph JSON to version control
8. **Regular Testing**: Run tests after updates
9. **Documentation**: Document custom entities and relations
10. **Backup**: Maintain backups of hypergraph data

## Troubleshooting

### Common Issues

**Issue**: Path finding times out
- **Solution**: Reduce `maxDepth` parameter or optimize graph structure

**Issue**: Memory usage too high
- **Solution**: Use lazy loading or split into multiple hypergraphs

**Issue**: Inconsistent entity references
- **Solution**: Validate entity IDs before adding link tuples

**Issue**: JSON import fails
- **Solution**: Check JSON format matches expected schema

## Support

For questions or issues:
1. Check the [README](./README.md) for basic usage
2. Review [EXAMPLES](./EXAMPLES.md) for code samples
3. Run tests: `npm run test:hypergraph`
4. Check test output for debugging information

## Next Steps

1. Expand entity types as needed
2. Add custom query functions for specific analyses
3. Integrate with visualization tools
4. Implement persistence layer (database)
5. Add real-time updates via WebSockets
6. Create custom analyzers for pattern detection
