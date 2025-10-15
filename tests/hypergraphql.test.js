/**
 * HypergraphQL Tests
 * 
 * Test suite for HypergraphQL with link tuples functionality
 */

const HypergraphQL = require('../docs/models/hypergnn/hypergraphql');
const { buildCase2025137857Hypergraph } = require('../docs/models/hypergnn/case-hypergraph');

class HypergraphQLTest {
  constructor() {
    this.testResults = [];
    this.errors = [];
  }

  assert(condition, message) {
    const result = {
      test: message,
      passed: condition,
      timestamp: new Date().toISOString()
    };
    
    this.testResults.push(result);
    
    if (condition) {
      console.log(`✅ ${message}`);
    } else {
      console.log(`❌ ${message}`);
      this.errors.push(message);
    }
    
    return condition;
  }

  // Test basic entity operations
  testEntityOperations() {
    console.log('\n🧪 Testing Entity Operations...');
    
    const hg = new HypergraphQL();
    
    // Test adding entity
    hg.addEntity('test-person', 'Person', { name: 'Test Person' });
    this.assert(hg.entities.has('test-person'), 'Entity added successfully');
    
    // Test entity properties
    const entity = hg.entities.get('test-person');
    this.assert(entity.id === 'test-person', 'Entity ID is correct');
    this.assert(entity.type === 'Person', 'Entity type is correct');
    this.assert(entity.name === 'Test Person', 'Entity properties preserved');
    
    // Test adding multiple entities
    hg.addEntity('test-event', 'Event', { name: 'Test Event' });
    hg.addEntity('test-evidence', 'Evidence', { name: 'Test Evidence' });
    this.assert(hg.entities.size === 3, 'Multiple entities added');
    
    // Test querying by type
    const people = hg.queryEntitiesByType('Person');
    this.assert(people.length === 1, 'Query by type returns correct count');
    this.assert(people[0].name === 'Test Person', 'Query returns correct entity');
  }

  // Test link tuple operations
  testLinkTupleOperations() {
    console.log('\n🧪 Testing Link Tuple Operations...');
    
    const hg = new HypergraphQL();
    
    hg.addEntity('person1', 'Person', { name: 'Person 1' });
    hg.addEntity('person2', 'Person', { name: 'Person 2' });
    hg.addEntity('event1', 'Event', { name: 'Event 1' });
    
    // Test adding link tuple
    hg.addLinkTuple('person1', 'knows', 'person2', { since: '2020' });
    this.assert(hg.linkTuples.length === 1, 'Link tuple added');
    
    // Test link tuple structure
    const link = hg.linkTuples[0];
    this.assert(link.source === 'person1', 'Link source is correct');
    this.assert(link.relation === 'knows', 'Link relation is correct');
    this.assert(link.target === 'person2', 'Link target is correct');
    this.assert(link.metadata.since === '2020', 'Link metadata preserved');
    
    // Test relation tracking
    this.assert(hg.relations.has('knows'), 'Relation tracked in set');
    
    // Test multiple link tuples
    hg.addLinkTuple('person1', 'involved-in', 'event1');
    this.assert(hg.linkTuples.length === 2, 'Multiple link tuples added');
    this.assert(hg.relations.size === 2, 'Multiple relations tracked');
  }

  // Test query operations
  testQueryOperations() {
    console.log('\n🧪 Testing Query Operations...');
    
    const hg = new HypergraphQL();
    
    hg.addEntity('p1', 'Person', { name: 'Alice' });
    hg.addEntity('p2', 'Person', { name: 'Bob' });
    hg.addEntity('e1', 'Event', { name: 'Meeting' });
    
    hg.addLinkTuple('p1', 'organized', 'e1');
    hg.addLinkTuple('p2', 'attended', 'e1');
    
    // Test query by source
    const p1Links = hg.queryLinksBySource('p1');
    this.assert(p1Links.length === 1, 'Query by source returns correct count');
    this.assert(p1Links[0].relation === 'organized', 'Query by source returns correct link');
    
    // Test query by target
    const e1Links = hg.queryLinksByTarget('e1');
    this.assert(e1Links.length === 2, 'Query by target returns correct count');
    
    // Test query by relation
    const organizedLinks = hg.queryLinksByRelation('organized');
    this.assert(organizedLinks.length === 1, 'Query by relation returns correct count');
    
    const attendedLinks = hg.queryLinksByRelation('attended');
    this.assert(attendedLinks.length === 1, 'Query by relation filters correctly');
  }

  // Test connection finding
  testFindConnected() {
    console.log('\n🧪 Testing Find Connected...');
    
    const hg = new HypergraphQL();
    
    hg.addEntity('a', 'Person', { name: 'A' });
    hg.addEntity('b', 'Person', { name: 'B' });
    hg.addEntity('c', 'Person', { name: 'C' });
    
    hg.addLinkTuple('a', 'knows', 'b');
    hg.addLinkTuple('a', 'works-with', 'c');
    
    // Test finding all connections
    const allConnected = hg.findConnected('a');
    this.assert(allConnected.length === 2, 'Find connected returns all connections');
    
    // Test filtering by relation
    const knowsConnected = hg.findConnected('a', 'knows');
    this.assert(knowsConnected.length === 1, 'Find connected filters by relation');
    this.assert(knowsConnected[0].entity.name === 'B', 'Find connected returns correct entity');
    
    // Test bidirectional connections
    const bConnected = hg.findConnected('b');
    this.assert(bConnected.length === 1, 'Find connected works bidirectionally');
    this.assert(bConnected[0].entity.name === 'A', 'Bidirectional connection returns correct entity');
  }

  // Test path finding
  testPathFinding() {
    console.log('\n🧪 Testing Path Finding...');
    
    const hg = new HypergraphQL();
    
    hg.addEntity('a', 'Person', { name: 'A' });
    hg.addEntity('b', 'Person', { name: 'B' });
    hg.addEntity('c', 'Person', { name: 'C' });
    hg.addEntity('d', 'Person', { name: 'D' });
    
    hg.addLinkTuple('a', 'knows', 'b');
    hg.addLinkTuple('b', 'knows', 'c');
    hg.addLinkTuple('c', 'knows', 'd');
    
    // Test direct path
    const path1 = hg.findPath('a', 'b');
    this.assert(path1 !== null, 'Path found between connected entities');
    this.assert(path1.length === 1, 'Direct path has correct length');
    
    // Test multi-hop path
    const path2 = hg.findPath('a', 'd');
    this.assert(path2 !== null, 'Multi-hop path found');
    this.assert(path2.length === 3, 'Multi-hop path has correct length');
    
    // Test path details
    this.assert(path2[0].from.name === 'A', 'Path starts at correct entity');
    this.assert(path2[2].to.name === 'D', 'Path ends at correct entity');
    
    // Test no path
    hg.addEntity('e', 'Person', { name: 'E' });
    const noPath = hg.findPath('a', 'e');
    this.assert(noPath === null, 'Returns null when no path exists');
  }

  // Test complex queries
  testComplexQueries() {
    console.log('\n🧪 Testing Complex Queries...');
    
    const hg = new HypergraphQL();
    
    hg.addEntity('p1', 'Person', { name: 'Alice', role: 'Manager' });
    hg.addEntity('p2', 'Person', { name: 'Bob', role: 'Developer' });
    hg.addEntity('e1', 'Event', { name: 'Meeting', priority: 'High' });
    hg.addEntity('e2', 'Event', { name: 'Review', priority: 'Low' });
    
    hg.addLinkTuple('p1', 'manages', 'p2');
    hg.addLinkTuple('p1', 'organized', 'e1');
    
    // Test query by type
    const result1 = hg.query({ entityType: 'Person' });
    this.assert(result1.length === 2, 'Complex query filters by type');
    
    // Test query with property filter
    const result2 = hg.query({
      entityType: 'Person',
      filters: { properties: { role: 'Manager' } }
    });
    this.assert(result2.length === 1, 'Complex query filters by properties');
    this.assert(result2[0].name === 'Alice', 'Property filter returns correct entity');
    
    // Test query with relation
    const result3 = hg.query({
      entityType: 'Person',
      relation: 'manages'
    });
    this.assert(result3.length === 2, 'Query with relation returns results');
    this.assert(result3[0].connected !== undefined, 'Query with relation includes connections');
  }

  // Test JSON import/export
  testJSONOperations() {
    console.log('\n🧪 Testing JSON Import/Export...');
    
    const hg = new HypergraphQL();
    
    hg.addEntity('p1', 'Person', { name: 'Alice' });
    hg.addEntity('e1', 'Event', { name: 'Meeting' });
    hg.addLinkTuple('p1', 'attended', 'e1', { date: '2025-01-01' });
    
    // Test export
    const json = hg.toJSON();
    this.assert(json.entities.length === 2, 'JSON export includes all entities');
    this.assert(json.linkTuples.length === 1, 'JSON export includes all link tuples');
    this.assert(json.relations.length === 1, 'JSON export includes relations');
    
    // Test import
    const hg2 = new HypergraphQL();
    hg2.fromJSON(json);
    this.assert(hg2.entities.size === 2, 'JSON import restores entities');
    this.assert(hg2.linkTuples.length === 1, 'JSON import restores link tuples');
    this.assert(hg2.relations.size === 1, 'JSON import restores relations');
    
    // Test data integrity
    const entity = hg2.entities.get('p1');
    this.assert(entity.name === 'Alice', 'Import preserves entity properties');
    
    const link = hg2.linkTuples[0];
    this.assert(link.metadata.date === '2025-01-01', 'Import preserves link metadata');
  }

  // Test statistics
  testStatistics() {
    console.log('\n🧪 Testing Statistics...');
    
    const hg = new HypergraphQL();
    
    hg.addEntity('p1', 'Person', { name: 'Alice' });
    hg.addEntity('p2', 'Person', { name: 'Bob' });
    hg.addEntity('e1', 'Event', { name: 'Meeting' });
    
    hg.addLinkTuple('p1', 'knows', 'p2');
    hg.addLinkTuple('p1', 'organized', 'e1');
    hg.addLinkTuple('p2', 'attended', 'e1');
    
    const stats = hg.getStats();
    
    this.assert(stats.totalEntities === 3, 'Stats report correct entity count');
    this.assert(stats.totalLinkTuples === 3, 'Stats report correct link tuple count');
    this.assert(stats.totalRelations === 3, 'Stats report correct relation count');
    
    this.assert(stats.entitiesByType.Person === 2, 'Stats break down entities by type');
    this.assert(stats.entitiesByType.Event === 1, 'Stats count all entity types');
    
    this.assert(stats.linksByRelation.knows === 1, 'Stats break down links by relation');
    this.assert(stats.linksByRelation.organized === 1, 'Stats count all relation types');
  }

  // Test case-specific implementation
  testCase2025137857() {
    console.log('\n🧪 Testing Case 2025-137857 Implementation...');
    
    const hg = buildCase2025137857Hypergraph();
    
    // Test entity counts
    const people = hg.queryEntitiesByType('Person');
    this.assert(people.length === 6, 'Case has 6 people entities');
    
    const events = hg.queryEntitiesByType('Event');
    this.assert(events.length === 5, 'Case has 5 event entities');
    
    const evidence = hg.queryEntitiesByType('Evidence');
    this.assert(evidence.length === 3, 'Case has 3 evidence entities');
    
    // Test specific entities exist
    this.assert(hg.entities.has('peter-faucitt'), 'Peter Faucitt entity exists');
    this.assert(hg.entities.has('jacqueline-faucitt'), 'Jacqueline Faucitt entity exists');
    this.assert(hg.entities.has('regima'), 'RegimA company entity exists');
    
    // Test link tuples
    this.assert(hg.linkTuples.length >= 25, 'Case has 25+ link tuples');
    
    // Test specific relationships
    const peterLinks = hg.queryLinksBySource('peter-faucitt');
    this.assert(peterLinks.length > 0, 'Peter Faucitt has relationships');
    
    const orchestratedEvents = hg.queryLinksByRelation('orchestrated');
    this.assert(orchestratedEvents.length > 0, 'Orchestration relationships exist');
    
    // Test path finding in case
    const path = hg.findPath('peter-faucitt', 'regima');
    this.assert(path !== null, 'Path exists from Peter to RegimA');
    
    // Test statistics
    const stats = hg.getStats();
    this.assert(stats.totalEntities >= 15, 'Case has 15+ total entities');
    this.assert(stats.totalRelations >= 10, 'Case has 10+ relation types');
  }

  // Run all tests
  runAll() {
    console.log('═══════════════════════════════════════════════════════');
    console.log('🧪 HypergraphQL Test Suite');
    console.log('═══════════════════════════════════════════════════════');

    this.testEntityOperations();
    this.testLinkTupleOperations();
    this.testQueryOperations();
    this.testFindConnected();
    this.testPathFinding();
    this.testComplexQueries();
    this.testJSONOperations();
    this.testStatistics();
    this.testCase2025137857();

    // Print summary
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('📊 Test Summary');
    console.log('═══════════════════════════════════════════════════════');
    
    const passed = this.testResults.filter(r => r.passed).length;
    const failed = this.testResults.filter(r => !r.passed).length;
    const total = this.testResults.length;
    const successRate = ((passed / total) * 100).toFixed(0);

    console.log(`\n✅ Passed: ${passed}/${total}`);
    console.log(`❌ Failed: ${failed}/${total}`);
    console.log(`📊 Success Rate: ${successRate}%`);

    if (failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.errors.forEach(err => console.log(`   - ${err}`));
    } else {
      console.log('\n🎉 All tests passed!');
    }

    console.log('\n═══════════════════════════════════════════════════════\n');

    return failed === 0;
  }
}

// Run tests if executed directly
if (require.main === module) {
  const tester = new HypergraphQLTest();
  const success = tester.runAll();
  process.exit(success ? 0 : 1);
}

module.exports = HypergraphQLTest;
