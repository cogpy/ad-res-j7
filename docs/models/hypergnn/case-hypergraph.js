/**
 * Case-Specific Hypergraph Implementation
 * 
 * Builds a hypergraph representation of Case 2025-137857
 * using link tuples to connect entities, events, and evidence.
 */

const HypergraphQL = require('./hypergraphql');

/**
 * Build Case 2025-137857 Hypergraph
 */
function buildCase2025137857Hypergraph() {
  const hg = new HypergraphQL();

  // Add People Entities
  hg.addEntity('peter-faucitt', 'Person', {
    name: 'Peter Andrew Faucitt',
    role: 'Applicant',
    description: 'Applicant in Case 2025-137857'
  });

  hg.addEntity('jacqueline-faucitt', 'Person', {
    name: 'Jacqueline Faucitt',
    role: 'Respondent',
    description: 'First Respondent in Case 2025-137857',
    alias: 'Jax'
  });

  hg.addEntity('daniel-faucitt', 'Person', {
    name: 'Daniel James Faucitt',
    role: 'Respondent',
    description: 'Second Respondent in Case 2025-137857'
  });

  hg.addEntity('rynette-farrar', 'Person', {
    name: 'Rynette Farrar',
    role: 'Coordinator',
    description: 'Primary orchestrator in revenue hijacking scheme',
    centralityScore: 0.78
  });

  hg.addEntity('son-addarory', 'Person', {
    name: 'Addarory (Son)',
    role: 'Technical Facilitator',
    description: 'Technical facilitator for domain registration',
    centralityScore: 0.65
  });

  hg.addEntity('gayane-williams', 'Person', {
    name: 'Gayane Williams',
    role: 'Witness',
    description: 'Key witness with direct knowledge of instructions'
  });

  // Add Company Entities
  hg.addEntity('regima', 'Company', {
    name: 'RegimA',
    description: 'Business operations targeted in revenue hijacking'
  });

  // Add Event Entities
  hg.addEntity('event-2025-04-14-bank-letter', 'Event', {
    name: 'Bank Account Change Fraud',
    date: '2025-04-14',
    description: 'Fraudulent redirection of client payments',
    category: 'Revenue Diversion Setup',
    severity: 'Critical'
  });

  hg.addEntity('event-2025-05-22-shopify-audit', 'Event', {
    name: 'Shopify Audit Trail Destruction',
    date: '2025-05-22',
    description: 'Systematic audit trail destruction',
    category: 'Evidence Destruction',
    severity: 'Critical',
    financialImpact: 3141647.70
  });

  hg.addEntity('event-2025-05-29-domain-registration', 'Event', {
    name: 'Domain Registration by Son',
    date: '2025-05-29',
    description: 'Identity fraud using son\'s name for customer hijacking',
    category: 'Family Conspiracy',
    severity: 'High'
  });

  hg.addEntity('event-2025-06-20-gee-gayane-email', 'Event', {
    name: 'Administrative Instruction Coordination',
    date: '2025-06-20',
    description: 'Coordination evidence between Pete and administrative personnel',
    category: 'Instruction Coordination',
    severity: 'Medium'
  });

  hg.addEntity('event-2025-07-08-warehouse-popi', 'Event', {
    name: 'Business Sabotage and POPI Violations',
    date: '2025-07-08',
    description: 'Warehouse access issues and data protection violations',
    category: 'Business Sabotage',
    severity: 'High'
  });

  // Add Evidence Entities
  hg.addEntity('evidence-jf8a', 'Evidence', {
    name: 'JF8A Documentation Log',
    evidenceType: 'correspondence',
    reference: 'JF8A',
    priority: 'Critical',
    description: 'IT expenses and R500K payment documentation'
  });

  hg.addEntity('evidence-forensic-index', 'Evidence', {
    name: 'Forensic Evidence Index',
    evidenceType: 'analysis',
    reference: 'FORENSIC_EVIDENCE_INDEX',
    priority: 'Critical',
    description: 'Complete forensic analysis of revenue hijacking scheme'
  });

  hg.addEntity('evidence-shopify-reports', 'Evidence', {
    name: 'Shopify Historical Performance Reports',
    evidenceType: 'financial',
    reference: 'shopify_reports',
    priority: 'Critical',
    description: 'Pre and post-hijacking revenue data'
  });

  // Add Date Entities for Timeline
  hg.addEntity('date-2025-04-14', 'Date', {
    date: '2025-04-14',
    description: 'Start of revenue hijacking scheme'
  });

  hg.addEntity('date-2025-07-08', 'Date', {
    date: '2025-07-08',
    description: 'End of 85-day criminal scheme period'
  });

  // Add Link Tuples - Person to Event connections
  hg.addLinkTuple('peter-faucitt', 'involved-in', 'event-2025-04-14-bank-letter', {
    role: 'alleged-perpetrator',
    evidence: ['timeline-documents', 'bank-statements']
  });

  hg.addLinkTuple('rynette-farrar', 'orchestrated', 'event-2025-04-14-bank-letter', {
    role: 'primary-orchestrator',
    centralityIncrease: 0.06
  });

  hg.addLinkTuple('peter-faucitt', 'involved-in', 'event-2025-05-22-shopify-audit', {
    role: 'alleged-perpetrator',
    evidence: ['audit-trail-analysis'],
    timing: 'after-confrontation',
    consciousnessOfGuilt: true
  });

  hg.addLinkTuple('son-addarory', 'facilitated', 'event-2025-05-29-domain-registration', {
    role: 'technical-facilitator',
    centralityIncrease: 0.30
  });

  hg.addLinkTuple('rynette-farrar', 'coordinated', 'event-2025-05-29-domain-registration', {
    role: 'coordinator',
    familyConspiracy: true
  });

  hg.addLinkTuple('gayane-williams', 'witnessed', 'event-2025-06-20-gee-gayane-email', {
    role: 'key-witness',
    testimony: 'direct-knowledge'
  });

  hg.addLinkTuple('peter-faucitt', 'coordinated-with', 'gayane-williams', {
    via: 'event-2025-06-20-gee-gayane-email',
    nature: 'administrative-instructions'
  });

  // Add Link Tuples - Person to Person relationships
  hg.addLinkTuple('jacqueline-faucitt', 'respondent-with', 'daniel-faucitt', {
    relationship: 'co-respondents',
    case: '2025-137857'
  });

  hg.addLinkTuple('peter-faucitt', 'applicant-against', 'jacqueline-faucitt', {
    relationship: 'legal-dispute',
    case: '2025-137857'
  });

  hg.addLinkTuple('peter-faucitt', 'applicant-against', 'daniel-faucitt', {
    relationship: 'legal-dispute',
    case: '2025-137857'
  });

  hg.addLinkTuple('rynette-farrar', 'family-of', 'son-addarory', {
    relationship: 'mother-son',
    conspiracyRole: 'coordinated'
  });

  // Add Link Tuples - Person to Company
  hg.addLinkTuple('jacqueline-faucitt', 'owns', 'regima', {
    role: 'business-owner',
    with: 'daniel-faucitt'
  });

  hg.addLinkTuple('daniel-faucitt', 'owns', 'regima', {
    role: 'business-owner',
    with: 'jacqueline-faucitt'
  });

  // Add Link Tuples - Event to Evidence
  hg.addLinkTuple('event-2025-04-14-bank-letter', 'documented-in', 'evidence-forensic-index', {
    category: 'Revenue Diversion Setup',
    evidenceGrade: 'A'
  });

  hg.addLinkTuple('event-2025-05-22-shopify-audit', 'documented-in', 'evidence-shopify-reports', {
    category: 'Evidence Destruction',
    evidenceGrade: 'A',
    financialImpact: 3141647.70
  });

  hg.addLinkTuple('event-2025-05-22-shopify-audit', 'documented-in', 'evidence-forensic-index', {
    category: 'Evidence Destruction',
    evidenceGrade: 'A'
  });

  hg.addLinkTuple('event-2025-06-20-gee-gayane-email', 'referenced-in', 'evidence-jf8a', {
    category: 'Instruction Coordination',
    witnessEvidence: true
  });

  // Add Link Tuples - Event to Date
  hg.addLinkTuple('event-2025-04-14-bank-letter', 'occurred-on', 'date-2025-04-14', {
    timeline: 'scheme-start'
  });

  hg.addLinkTuple('event-2025-07-08-warehouse-popi', 'occurred-on', 'date-2025-07-08', {
    timeline: 'scheme-end',
    duration: '85-days'
  });

  // Add Link Tuples - Event to Event (temporal sequence)
  hg.addLinkTuple('event-2025-04-14-bank-letter', 'precedes', 'event-2025-05-22-shopify-audit', {
    daysBetween: 38,
    escalationPattern: true
  });

  hg.addLinkTuple('event-2025-05-22-shopify-audit', 'precedes', 'event-2025-05-29-domain-registration', {
    daysBetween: 7,
    escalationPattern: true
  });

  hg.addLinkTuple('event-2025-05-29-domain-registration', 'precedes', 'event-2025-06-20-gee-gayane-email', {
    daysBetween: 22
  });

  hg.addLinkTuple('event-2025-06-20-gee-gayane-email', 'precedes', 'event-2025-07-08-warehouse-popi', {
    daysBetween: 18
  });

  // Add Link Tuples - Company to Event
  hg.addLinkTuple('regima', 'targeted-by', 'event-2025-04-14-bank-letter', {
    impact: 'revenue-diversion'
  });

  hg.addLinkTuple('regima', 'targeted-by', 'event-2025-05-22-shopify-audit', {
    impact: 'business-shutdown',
    financialLoss: 3141647.70
  });

  return hg;
}

/**
 * Example Queries
 */
function runExampleQueries() {
  const hg = buildCase2025137857Hypergraph();

  console.log('\n=== HypergraphQL Example Queries ===\n');

  // Query 1: Find all events
  console.log('1. All Events in Case:');
  const events = hg.queryEntitiesByType('Event');
  events.forEach(e => console.log(`   - ${e.name} (${e.date})`));

  // Query 2: Find all people connected to Peter Faucitt
  console.log('\n2. People and Entities Connected to Peter Faucitt:');
  const peterConnections = hg.findConnected('peter-faucitt');
  peterConnections.forEach(({ entity, link }) => {
    console.log(`   - ${entity.name || entity.description} via "${link.relation}"`);
  });

  // Query 3: Find events orchestrated by Rynette Farrar
  console.log('\n3. Events Orchestrated by Rynette Farrar:');
  const rynetteEvents = hg.findConnected('rynette-farrar', 'orchestrated');
  rynetteEvents.forEach(({ entity }) => {
    console.log(`   - ${entity.name} (${entity.date})`);
  });

  // Query 4: Find temporal sequence of events
  console.log('\n4. Temporal Sequence of Events:');
  const precedesLinks = hg.queryLinksByRelation('precedes');
  precedesLinks.forEach(link => {
    const from = hg.entities.get(link.source);
    const to = hg.entities.get(link.target);
    console.log(`   ${from.date}: ${from.name}`);
    console.log(`        ↓ (${link.metadata.daysBetween} days)`);
    console.log(`   ${to.date}: ${to.name}\n`);
  });

  // Query 5: Find path between two entities
  console.log('\n5. Path from Peter Faucitt to RegimA:');
  const path = hg.findPath('peter-faucitt', 'regima');
  if (path) {
    path.forEach((step, i) => {
      console.log(`   ${i + 1}. ${step.from.name || step.from.description}`);
      console.log(`      --[${step.link.relation}]-->`);
    });
    console.log(`   ${path.length + 1}. ${path[path.length - 1].to.name}`);
  }

  // Query 6: Get hypergraph statistics
  console.log('\n6. Hypergraph Statistics:');
  const stats = hg.getStats();
  console.log(`   Total Entities: ${stats.totalEntities}`);
  console.log(`   Total Link Tuples: ${stats.totalLinkTuples}`);
  console.log(`   Total Relations: ${stats.totalRelations}`);
  console.log('\n   Entities by Type:');
  Object.entries(stats.entitiesByType).forEach(([type, count]) => {
    console.log(`     - ${type}: ${count}`);
  });
  console.log('\n   Links by Relation:');
  Object.entries(stats.linksByRelation).forEach(([rel, count]) => {
    console.log(`     - ${rel}: ${count}`);
  });

  // Export to JSON
  console.log('\n7. Export Hypergraph to JSON:');
  const json = hg.toJSON();
  console.log(`   Exported ${json.entities.length} entities and ${json.linkTuples.length} link tuples`);

  return hg;
}

// Run if executed directly
if (require.main === module) {
  runExampleQueries();
}

module.exports = {
  buildCase2025137857Hypergraph,
  runExampleQueries
};
