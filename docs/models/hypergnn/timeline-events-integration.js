/**
 * Timeline Events Integration for Case 2025-137857
 * 
 * This script adds key timeline events to the case hypergraph
 * that demonstrate the strategic coordination and bad faith
 * underlying Peter Faucitt's interdict application.
 * 
 * Created: 2025-10-16
 */

const HypergraphQL = require('./hypergraphql');

/**
 * Add Timeline Events to Case Hypergraph
 */
function addTimelineEvents(hg) {
  
  // Add new person entity for Bantjies
  hg.addEntity('daniel-jacobus-bantjies', 'Person', {
    name: 'Daniel Jacobus Bantjies',
    role: 'Accountant/Trustee',
    description: 'Family accountant and trustee who provided perjured confirmatory affidavit',
    conflictOfInterest: true,
    perjuryCommitted: true
  });

  // 1. Kayla Pretorius Murder Event
  hg.addEntity('event-2023-kayla-murder', 'Event', {
    name: 'Kayla Pretorius Murder',
    date: '2023',
    description: 'Murder of Kayla Pretorius causing account access complications',
    category: 'Criminal Investigation',
    severity: 'Critical',
    impact: 'Estate complications, law enforcement investigation, family trauma',
    investigationStatus: 'Ongoing'
  });

  // 2. Chantal Letter Event
  hg.addEntity('event-2025-01-chantal-letter', 'Event', {
    name: 'Chantal Estate Finalization Letter',
    date: '2025-01',
    description: 'Chantal drops letter mentioning Kayla estate finalization',
    category: 'Estate Exploitation',
    severity: 'High',
    linkedTo: 'event-2023-kayla-murder'
  });

  // 3. SLG Asset Stripping Event
  hg.addEntity('event-2025-02-25-slg-asset-strip', 'Event', {
    name: 'SLG R5.2M Asset Stripping',
    date: '2025-02-25',
    description: 'R5.2M stock missing and simultaneous R5.2M invoice SLG to RST',
    category: 'Financial Fraud',
    severity: 'Critical',
    financialImpact: 5200000,
    evidence: 'Financial records, invoice documentation'
  });

  // 4. Rynette Reveals Unprocessed Transactions
  hg.addEntity('event-2025-03-30-rynette-reveals', 'Event', {
    name: 'Rynette Reveals 2 Years Unprocessed Transactions',
    date: '2025-03-30',
    description: 'Creates artificial urgency by revealing backlog, blames Daniel',
    category: 'Information Manipulation',
    severity: 'High',
    purpose: 'Manufacture crisis'
  });

  // 5. Cloud IT Systems Removal Order
  hg.addEntity('event-2025-04-22-cloud-removal', 'Event', {
    name: 'Cloud IT Systems Removal Order',
    date: '2025-04-22',
    description: 'Peter orders removal of Cloud IT systems',
    category: 'Infrastructure Sabotage',
    severity: 'High',
    impact: 'Business operations disruption'
  });

  // 6. Server Missing from Office
  hg.addEntity('event-2025-04-30-server-missing', 'Event', {
    name: 'Server Missing from Office',
    date: '2025-04-30',
    description: 'Physical server equipment goes missing',
    category: 'Evidence Tampering',
    severity: 'High',
    physicalEvidence: true
  });

  // 7. Kayla Estate Payment Query
  hg.addEntity('event-2025-05-15-kayla-query', 'Event', {
    name: 'Kayla Estate Payment Query',
    date: '2025-05-15',
    description: 'Query to Rynette about Rezonance payments regarding Kayla',
    category: 'Estate Investigation',
    severity: 'Medium',
    linkedTo: 'event-2023-kayla-murder'
  });

  // 8. Payment Cards Cancelled
  hg.addEntity('event-2025-06-07-cards-cancelled', 'Event', {
    name: 'Worldwide Payment Cards Cancelled',
    date: '2025-06-07',
    description: 'Peter cancels all business payment cards without notice',
    category: 'Financial Sabotage',
    severity: 'Critical',
    impact: 'Services suspended, documentation blocked, crisis manufactured',
    monthlyServiceCost: 75000,
    servicesAffected: 50
  });

  // 9. Shopify Orders Stopped
  hg.addEntity('event-2025-06-08-shopify-stopped', 'Event', {
    name: 'Shopify Orders Stopped',
    date: '2025-06-08',
    description: 'Shopify operations halted, audit trail missing',
    category: 'Business Disruption',
    severity: 'Critical',
    causedBy: 'event-2025-06-07-cards-cancelled',
    revenueImpact: 'R52,000 daily'
  });

  // 10. Bantjies Learns of Criminal Matters
  hg.addEntity('event-2025-06-10-bantjies-criminal', 'Event', {
    name: 'Bantjies Learns of Criminal Matters',
    date: '2025-06-10',
    description: 'Daniel Bantjies informed of criminal matters before confirmatory affidavit',
    category: 'Perjury Setup',
    severity: 'Critical',
    legalImplication: 'Knowledge before false affidavit = perjury'
  });

  // 11. Settlement Agreement Signed
  hg.addEntity('event-2025-08-06-settlement', 'Event', {
    name: 'Settlement Agreement Signed',
    date: '2025-08-06', // 8 days before Aug 14
    description: 'Settlement agreement signed 8 days before interdict filing',
    category: 'Strategic Timing',
    severity: 'Critical',
    significance: 'Proves premeditation and leverage creation'
  });

  // 12. Founding Affidavit Filed
  hg.addEntity('event-2025-08-14-affidavit-filed', 'Event', {
    name: 'Peter Files Founding Affidavit',
    date: '2025-08-14',
    description: 'Founding affidavit with material non-disclosures and perjury',
    category: 'Legal Filing',
    severity: 'Critical',
    containsPerjury: true,
    materialNonDisclosures: ['email control', 'settlement timing', 'card cancellations']
  });

  // 13. Interdict Granted
  hg.addEntity('event-2025-08-19-interdict', 'Event', {
    name: 'Ex Parte Interdict Granted',
    date: '2025-08-19',
    description: 'Court grants interdict based on false information',
    category: 'Court Order',
    severity: 'Critical',
    basedOn: 'Perjured affidavits and material non-disclosures'
  });

  // 14. Second Sage Screenshot
  hg.addEntity('event-2025-08-25-sage-screenshot', 'Event', {
    name: 'Second Sage Screenshot Confirms Email Control',
    date: '2025-08-25',
    description: 'Updated evidence confirms ongoing Rynette control of Pete@regima.com',
    category: 'Evidence Update',
    severity: 'High',
    proves: 'Continued email hijacking post-interdict'
  });

  // 15. ENS Africa Acknowledges Criminal
  hg.addEntity('event-2025-08-29-ens-acknowledges', 'Event', {
    name: 'ENS Africa Acknowledges Criminal Matters',
    date: '2025-08-29',
    description: 'Law firm acknowledges criminal matters then suppresses from Court',
    category: 'Legal Misconduct',
    severity: 'Critical',
    email: 'Received, thanks Daniel',
    suppressed: true
  });

  // 16. Investment Payout Due
  hg.addEntity('event-2026-05-investment-payout', 'Event', {
    name: 'Investment Payout Due',
    date: '2026-05',
    description: '9 months post-interdict - underlying financial motive revealed',
    category: 'Financial Motive',
    severity: 'Critical',
    significance: 'True reason for control seizure'
  });

  // Add Financial Entities
  hg.addEntity('kayla-estate', 'FinancialEntity', {
    name: 'Kayla Pretorius Estate',
    status: 'Under exploitation',
    complications: 'Murder investigation',
    linkedEvents: ['event-2023-kayla-murder', 'event-2025-01-chantal-letter']
  });

  hg.addEntity('slg-fraud-transaction', 'FinancialTransaction', {
    name: 'SLG R5.2M Fraudulent Transaction',
    amount: 5200000,
    currency: 'ZAR',
    date: '2025-02-25',
    type: 'Asset stripping',
    from: 'strategic-logistics-group',
    evidence: 'Invoice and missing stock'
  });

  // Add Relationships - Events to People
  hg.addLinkTuple('peter-faucitt', 'orchestrated', 'event-2025-06-07-cards-cancelled', {
    intent: 'Manufacture crisis',
    impact: 'Created problems he later complained about'
  });

  hg.addLinkTuple('peter-faucitt', 'filed', 'event-2025-08-14-affidavit-filed', {
    contains: 'Perjury and material non-disclosures'
  });

  hg.addLinkTuple('rynette-farrar', 'revealed', 'event-2025-03-30-rynette-reveals', {
    purpose: 'Create artificial urgency',
    blamed: 'daniel-faucitt'
  });

  hg.addLinkTuple('daniel-jacobus-bantjies', 'learned-of', 'event-2025-06-10-bantjies-criminal', {
    significance: 'Knowledge before confirmatory affidavit'
  });

  hg.addLinkTuple('daniel-jacobus-bantjies', 'suppressed', 'event-2025-08-29-ens-acknowledges', {
    action: 'Failed to disclose to Court'
  });

  // Add Relationships - Event Sequences
  hg.addLinkTuple('event-2025-06-07-cards-cancelled', 'caused', 'event-2025-06-08-shopify-stopped', {
    mechanism: 'Service payment failure',
    timeGap: '1 day'
  });

  hg.addLinkTuple('event-2025-08-06-settlement', 'preceded', 'event-2025-08-14-affidavit-filed', {
    timeGap: '8 days',
    significance: 'Strategic timing for leverage'
  });

  hg.addLinkTuple('event-2025-08-14-affidavit-filed', 'resulted-in', 'event-2025-08-19-interdict', {
    mechanism: 'Ex parte application',
    basedOn: 'False information'
  });

  hg.addLinkTuple('event-2025-08-19-interdict', 'enables-control-for', 'event-2026-05-investment-payout', {
    timeframe: '9 months',
    motive: 'Financial control'
  });

  // Add Relationships - Evidence Links
  hg.addLinkTuple('event-2025-02-25-slg-asset-strip', 'documented-by', 'slg-fraud-transaction', {
    evidenceType: 'Financial records'
  });

  hg.addLinkTuple('event-2025-06-20-gee-gayane-email', 'proves', 'event-2025-08-25-sage-screenshot', {
    what: 'Ongoing email control by Rynette'
  });

  // Add Relationships - Strategic Pattern
  hg.addLinkTuple('event-2023-kayla-murder', 'exploited-through', 'event-2025-01-chantal-letter', {
    pattern: 'Ongoing estate exploitation'
  });

  hg.addLinkTuple('event-2025-03-30-rynette-reveals', 'part-of-pattern', 'event-2025-06-07-cards-cancelled', {
    pattern: 'Manufacturing crisis for interdict'
  });

  // Add to AD Paragraph relationships
  hg.addLinkTuple('ad-para-7_12-7_13', 'references', 'event-2025-06-07-cards-cancelled', {
    context: 'Card cancellation impacts'
  });

  hg.addLinkTuple('ad-para-11-11_5', 'resulted-from', 'event-2025-08-14-affidavit-filed', {
    context: 'Interdict application'
  });

  // Financial Impact Relationships
  hg.addLinkTuple('event-2025-02-25-slg-asset-strip', 'caused-loss-of', 'regima', {
    amount: 5200000,
    type: 'Asset theft'
  });

  hg.addLinkTuple('event-2025-06-08-shopify-stopped', 'caused-loss-of', 'regima', {
    dailyAmount: 52000,
    totalLoss: 3100000,
    period: 'May-August 2025'
  });

  return {
    eventsAdded: 16,
    financialEntitiesAdded: 2,
    relationshipsAdded: 15
  };
}

// Export for use in case-hypergraph.js
module.exports = { addTimelineEvents };

// Standalone execution for testing
if (require.main === module) {
  const hg = new HypergraphQL();
  const result = addTimelineEvents(hg);
  
  console.log('Timeline Events Integration Complete:');
  console.log(`- Events Added: ${result.eventsAdded}`);
  console.log(`- Financial Entities Added: ${result.financialEntitiesAdded}`);
  console.log(`- Relationships Added: ${result.relationshipsAdded}`);
  
  // Query examples
  console.log('\nSample Queries:');
  
  // Find all events orchestrated by Peter
  const peterRelations = hg.queryByRelation('orchestrated')
    .filter(r => r.source === 'peter-faucitt');
  console.log('\nEvents orchestrated by Peter:', peterRelations.length);
  
  // Find critical timeline events
  const criticalEvents = hg.queryEntitiesByType('Event')
    .filter(e => e.severity === 'Critical');
  console.log('\nCritical Timeline Events:', criticalEvents.length);
  
  // Find events with financial impact
  const financialEvents = hg.queryEntitiesByType('Event')
    .filter(e => e.financialImpact || e.monthlyServiceCost || e.revenueImpact);
  console.log('\nEvents with Financial Impact:', financialEvents.length);
}