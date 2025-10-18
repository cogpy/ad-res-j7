const fs = require('fs');
const path = require('path');
const HypergraphQL = require('./hypergraphql');

function buildCase2025137857Hypergraph() {
  const hg = new HypergraphQL();

  // Load entities and link tuples from the main JSON file
  const hypergraphData = JSON.parse(fs.readFileSync(path.join(__dirname, 'case-2025-137857-hypergraph.json'), 'utf8'));

  hypergraphData.entities.forEach(entity => hg.addEntity(entity.id, entity.type, entity));
  hypergraphData.linkTuples.forEach(link => hg.addLinkTuple(link.source, link.relation, link.target, link.metadata));

  // Add additional evidence from the annexures
  const annexures = JSON.parse(fs.readFileSync(path.join(__dirname, '../../..//jax-dan-response/annexures_and_evidence.md'), 'utf8'));
  annexures.forEach(annex => {
    if (!hg.entities.has(annex.id)) {
      hg.addEntity(annex.id, 'Evidence', annex);
    }
  });

  return hg;
}

if (require.main === module) {
  const hg = buildCase2025137857Hypergraph();
  fs.writeFileSync(path.join(__dirname, 'case-2025-137857-hypergraph.json'), JSON.stringify(hg.toJSON(), null, 2));
  console.log('Hypergraph rebuilt successfully.');
}

module.exports = { buildCase2025137857Hypergraph };
