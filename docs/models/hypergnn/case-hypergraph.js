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

  // Add AD Paragraph Section Entities (from Peter's Founding Affidavit)
  hg.addEntity('ad-section-purpose', 'AffidavitSection', {
    name: 'PURPOSE OF THIS AFFIDAVIT',
    paragraphRef: '[0015]',
    sectionType: 'procedural'
  });

  hg.addEntity('ad-section-background', 'AffidavitSection', {
    name: 'BACKGROUND',
    paragraphRef: '[0025]',
    sectionType: 'factual'
  });

  hg.addEntity('ad-section-role', 'AffidavitSection', {
    name: 'MY ROLE AS REGULATORY RESPONSIBLE PERSON',
    paragraphRef: '[0045]',
    sectionType: 'factual'
  });

  hg.addEntity('ad-section-interdict', 'AffidavitSection', {
    name: 'THE INTERDICT GRANTED ON 19 AUGUST 2025',
    paragraphRef: '[0068]',
    sectionType: 'procedural'
  });

  hg.addEntity('ad-section-after-interdict', 'AffidavitSection', {
    name: 'WHAT OCCURRED AFTER THE GRANTING OF THE INTERIM INTERDICT',
    paragraphRef: '[0081]',
    sectionType: 'factual'
  });

  hg.addEntity('ad-section-evidence-analysis', 'AffidavitSection', {
    name: 'EVIDENCE ANALYSIS AND CLASSIFICATION',
    paragraphRef: '[0291]',
    sectionType: 'analytical'
  });

  hg.addEntity('ad-section-conclusion', 'AffidavitSection', {
    name: 'CONCLUSION',
    paragraphRef: '[0293]',
    sectionType: 'procedural'
  });

  hg.addEntity('ad-section-delay', 'AffidavitSection', {
    name: 'THE DELAY IN LAUNCHING THESE PROCEEDINGS',
    paragraphRef: '[0306]',
    sectionType: 'procedural'
  });

  // Add Critical AD Paragraphs (Priority 1)
  hg.addEntity('ad-para-7_2-7_5', 'ADParagraph', {
    name: 'AD PARAGRAPH 7.2 TO 7.5',
    topic: 'IT Expense Discrepancies',
    priority: 1,
    claim: 'Unexplained IT expenses (R8.85M over 2 years)',
    paragraphRef: '[0117]'
  });

  hg.addEntity('ad-para-7_6', 'ADParagraph', {
    name: 'AD PARAGRAPH 7.6',
    topic: 'R500K Payment',
    priority: 1,
    claim: 'Unauthorized R500,000 payment to Jax',
    paragraphRef: '[0125]'
  });

  hg.addEntity('ad-para-7_7-7_8', 'ADParagraph', {
    name: 'AD PARAGRAPH 7.7 TO 7.8',
    topic: 'R500K Payment Details',
    priority: 1,
    claim: 'Payment made without authorization',
    paragraphRef: '[0127]'
  });

  hg.addEntity('ad-para-7_9-7_11', 'ADParagraph', {
    name: 'AD PARAGRAPH 7.9 TO 7.11',
    topic: 'Payment Justification',
    priority: 1,
    claim: 'No legitimate business purpose',
    paragraphRef: '[0129]'
  });

  hg.addEntity('ad-para-10_5-10_10_23', 'ADParagraph', {
    name: 'AD PARAGRAPH 10.5 TO 10.10.23',
    topic: 'Detailed Financial Allegations',
    priority: 1,
    claim: 'Systematic financial misconduct',
    paragraphRef: '[0183]'
  });

  // Add High Priority AD Paragraphs (Priority 2)
  hg.addEntity('ad-para-3-3_10', 'ADParagraph', {
    name: 'AD PARAGRAPH 3 TO 3.10',
    topic: 'Respondent Identification',
    priority: 2,
    claim: "Jax's role and responsibilities",
    paragraphRef: '[0103]'
  });

  hg.addEntity('ad-para-3_11-3_13', 'ADParagraph', {
    name: 'AD PARAGRAPH 3.11 TO 3.13',
    topic: "Jax's Role in Companies",
    priority: 2,
    claim: 'Material non-disclosure of legal duties',
    paragraphRef: '[0105]'
  });

  hg.addEntity('ad-para-7_12-7_13', 'ADParagraph', {
    name: 'AD PARAGRAPH 7.12 TO 7.13',
    topic: 'Accountant Concerns',
    priority: 2,
    claim: 'Accountant raised concerns about documentation',
    paragraphRef: '[0133]'
  });

  hg.addEntity('ad-para-7_14-7_15', 'ADParagraph', {
    name: 'AD PARAGRAPH 7.14 TO 7.15',
    topic: 'Documentation Requests',
    priority: 2,
    claim: 'Failure to provide documentation',
    paragraphRef: '[0136]'
  });

  hg.addEntity('ad-para-8-8_3', 'ADParagraph', {
    name: 'AD PARAGRAPH 8 TO 8.3',
    topic: "Peter's Discovery",
    priority: 2,
    claim: 'Discovery of financial irregularities',
    paragraphRef: '[0149]'
  });

  hg.addEntity('ad-para-8_4', 'ADParagraph', {
    name: 'AD PARAGRAPH 8.4',
    topic: 'Confrontation',
    priority: 2,
    claim: 'Confrontation with Jax and Dan',
    paragraphRef: '[0154]'
  });

  hg.addEntity('ad-para-11-11_5', 'ADParagraph', {
    name: 'AD PARAGRAPH 11 TO 11.5',
    topic: 'Urgency',
    priority: 2,
    claim: 'Urgent relief required',
    paragraphRef: '[0196]'
  });

  hg.addEntity('ad-para-13-13_1', 'ADParagraph', {
    name: 'AD PARAGRAPH 13 TO 13.1',
    topic: 'Interim Relief',
    priority: 2,
    claim: 'Need for interim interdict',
    paragraphRef: '[0214]'
  });

  // Add Medium Priority AD Paragraphs (Priority 3)
  hg.addEntity('ad-para-7-7_1', 'ADParagraph', {
    name: 'AD PARAGRAPH 7 TO 7.1',
    topic: 'Financial Overview',
    priority: 3,
    claim: 'Overview of financial concerns',
    paragraphRef: '[0115]'
  });

  hg.addEntity('ad-para-7_16-7_17', 'ADParagraph', {
    name: 'AD PARAGRAPH 7.16 TO 7.17',
    topic: 'Additional Financial Issues',
    priority: 3,
    claim: 'Further financial irregularities',
    paragraphRef: '[0138]'
  });

  hg.addEntity('ad-para-7_18-7_20', 'ADParagraph', {
    name: 'AD PARAGRAPH 7.18 TO 7.20',
    topic: 'Financial Concerns Summary',
    priority: 3,
    claim: 'Summary of financial allegations',
    paragraphRef: '[0144]'
  });

  hg.addEntity('ad-para-8_5', 'ADParagraph', {
    name: 'AD PARAGRAPH 8.5',
    topic: 'Response to Confrontation',
    priority: 3,
    claim: 'Respondents response to confrontation',
    paragraphRef: '[0156]'
  });

  hg.addEntity('ad-para-8_6', 'ADParagraph', {
    name: 'AD PARAGRAPH 8.6',
    topic: 'Subsequent Actions',
    priority: 3,
    claim: 'Actions after confrontation',
    paragraphRef: '[0158]'
  });

  hg.addEntity('ad-para-8_7', 'ADParagraph', {
    name: 'AD PARAGRAPH 8.7',
    topic: 'Further Developments',
    priority: 3,
    claim: 'Ongoing concerns',
    paragraphRef: '[0160]'
  });

  hg.addEntity('ad-para-8_8-8_10', 'ADParagraph', {
    name: 'AD PARAGRAPH 8.8 TO 8.10',
    topic: 'Continuing Issues',
    priority: 3,
    claim: 'Pattern of conduct',
    paragraphRef: '[0162]'
  });

  hg.addEntity('ad-para-9-9_3', 'ADParagraph', {
    name: 'AD PARAGRAPH 9 TO 9.3',
    topic: 'Business Impact',
    priority: 3,
    claim: 'Impact on business operations',
    paragraphRef: '[0168]'
  });

  hg.addEntity('ad-para-9_4', 'ADParagraph', {
    name: 'AD PARAGRAPH 9.4',
    topic: 'Operational Concerns',
    priority: 3,
    claim: 'Specific operational issues',
    paragraphRef: '[0172]'
  });

  hg.addEntity('ad-para-10-10_3', 'ADParagraph', {
    name: 'AD PARAGRAPH 10 TO 10.3',
    topic: 'Relief Sought Overview',
    priority: 3,
    claim: 'Overview of relief requested',
    paragraphRef: '[0175]'
  });

  hg.addEntity('ad-para-10_4', 'ADParagraph', {
    name: 'AD PARAGRAPH 10.4',
    topic: 'Specific Relief',
    priority: 3,
    claim: 'Specific relief requested',
    paragraphRef: '[0180]'
  });

  hg.addEntity('ad-para-11_6-11_9', 'ADParagraph', {
    name: 'AD PARAGRAPH 11.6 TO 11.9',
    topic: 'Urgency Justification',
    priority: 3,
    claim: 'Further urgency justification',
    paragraphRef: '[0200]'
  });

  hg.addEntity('ad-para-12-12_1', 'ADParagraph', {
    name: 'AD PARAGRAPH 12 TO 12.1',
    topic: 'Prima Facie Right',
    priority: 3,
    claim: 'Establishment of prima facie right',
    paragraphRef: '[0206]'
  });

  hg.addEntity('ad-para-12_2', 'ADParagraph', {
    name: 'AD PARAGRAPH 12.2',
    topic: 'Right Details',
    priority: 3,
    claim: 'Details of right claimed',
    paragraphRef: '[0208]'
  });

  hg.addEntity('ad-para-12_3', 'ADParagraph', {
    name: 'AD PARAGRAPH 12.3',
    topic: 'Right Justification',
    priority: 3,
    claim: 'Justification of right',
    paragraphRef: '[0210]'
  });

  hg.addEntity('ad-para-13_2-13_2_2', 'ADParagraph', {
    name: 'AD PARAGRAPH 13.2 TO 13.2.2',
    topic: 'Harm Without Interdict',
    priority: 3,
    claim: 'Harm if interdict not granted',
    paragraphRef: '[0218]'
  });

  hg.addEntity('ad-para-13_3', 'ADParagraph', {
    name: 'AD PARAGRAPH 13.3',
    topic: 'Balance of Convenience',
    priority: 3,
    claim: 'Balance favors applicant',
    paragraphRef: '[0224]'
  });

  hg.addEntity('ad-para-14-14_2', 'ADParagraph', {
    name: 'AD PARAGRAPH 14 TO 14.2',
    topic: 'Costs',
    priority: 3,
    claim: 'Costs to follow event',
    paragraphRef: '[0240]'
  });

  hg.addEntity('ad-para-16-16_5', 'ADParagraph', {
    name: 'AD PARAGRAPH 16 TO 16.5',
    topic: 'JF5 Agreement',
    priority: 3,
    claim: 'Breach of shareholder agreement',
    paragraphRef: '[0253]'
  });

  // Add Low Priority AD Paragraphs (Priority 4)
  hg.addEntity('ad-para-1-1_3', 'ADParagraph', {
    name: 'AD PARAGRAPH 1 TO 1.3',
    topic: 'Identity and Capacity',
    priority: 4,
    claim: 'Applicant identity',
    paragraphRef: '[0098]'
  });

  hg.addEntity('ad-para-2-2_4', 'ADParagraph', {
    name: 'AD PARAGRAPH 2 TO 2.4',
    topic: 'Respondents Identity',
    priority: 4,
    claim: 'Respondents identification',
    paragraphRef: '[0101]'
  });

  hg.addEntity('ad-para-4', 'ADParagraph', {
    name: 'AD PARAGRAPH 4',
    topic: 'Notice',
    priority: 4,
    claim: 'Notice to respondents',
    paragraphRef: '[0107]'
  });

  hg.addEntity('ad-para-5', 'ADParagraph', {
    name: 'AD PARAGRAPH 5',
    topic: 'Service',
    priority: 4,
    claim: 'Service of documents',
    paragraphRef: '[0109]'
  });

  hg.addEntity('ad-para-6-6_5', 'ADParagraph', {
    name: 'AD PARAGRAPH 6 TO 6.5',
    topic: 'Jurisdiction',
    priority: 4,
    claim: 'Court jurisdiction',
    paragraphRef: '[0113]'
  });

  hg.addEntity('ad-para-10_11', 'ADParagraph', {
    name: 'AD PARAGRAPH 10.11',
    topic: 'Access to Records',
    priority: 4,
    claim: 'Request for access to records',
    paragraphRef: '[0189]'
  });

  hg.addEntity('ad-para-10_12', 'ADParagraph', {
    name: 'AD PARAGRAPH 10.12',
    topic: 'Inspection Rights',
    priority: 4,
    claim: 'Rights to inspect documents',
    paragraphRef: '[0191]'
  });

  hg.addEntity('ad-para-10_13', 'ADParagraph', {
    name: 'AD PARAGRAPH 10.13',
    topic: 'Information Requests',
    priority: 4,
    claim: 'Request for information',
    paragraphRef: '[0193]'
  });

  hg.addEntity('ad-para-12_4', 'ADParagraph', {
    name: 'AD PARAGRAPH 12.4',
    topic: 'Supporting Arguments',
    priority: 4,
    claim: 'Additional supporting arguments',
    paragraphRef: '[0212]'
  });

  hg.addEntity('ad-para-13_4', 'ADParagraph', {
    name: 'AD PARAGRAPH 13.4',
    topic: 'Further Balance Arguments',
    priority: 4,
    claim: 'Additional balance arguments',
    paragraphRef: '[0226]'
  });

  hg.addEntity('ad-para-13_5', 'ADParagraph', {
    name: 'AD PARAGRAPH 13.5',
    topic: 'No Alternative Remedy',
    priority: 4,
    claim: 'No other adequate remedy',
    paragraphRef: '[0229]'
  });

  hg.addEntity('ad-para-13_6-13_7', 'ADParagraph', {
    name: 'AD PARAGRAPH 13.6 TO 13.7',
    topic: 'Interim Relief Requirements',
    priority: 4,
    claim: 'Requirements for interim relief met',
    paragraphRef: '[0232]'
  });

  hg.addEntity('ad-para-14_3', 'ADParagraph', {
    name: 'AD PARAGRAPH 14.3',
    topic: 'Cost Order Details',
    priority: 4,
    claim: 'Details of cost order sought',
    paragraphRef: '[0244]'
  });

  hg.addEntity('ad-para-14_4', 'ADParagraph', {
    name: 'AD PARAGRAPH 14.4',
    topic: 'Scale of Costs',
    priority: 4,
    claim: 'Scale of costs requested',
    paragraphRef: '[0246]'
  });

  hg.addEntity('ad-para-14_5', 'ADParagraph', {
    name: 'AD PARAGRAPH 14.5',
    topic: 'Cost Justification',
    priority: 4,
    claim: 'Justification for cost order',
    paragraphRef: '[0248]'
  });

  hg.addEntity('ad-para-16_6', 'ADParagraph', {
    name: 'AD PARAGRAPH 16.6',
    topic: 'JF5 Agreement Details',
    priority: 4,
    claim: 'Details of agreement breach',
    paragraphRef: '[0261]'
  });

  hg.addEntity('ad-para-16_7', 'ADParagraph', {
    name: 'AD PARAGRAPH 16.7',
    topic: 'Agreement Obligations',
    priority: 4,
    claim: 'Obligations under agreement',
    paragraphRef: '[0263]'
  });

  // Add Meaningless Priority AD Paragraphs (Priority 5)
  hg.addEntity('ad-para-15', 'ADParagraph', {
    name: 'AD PARAGRAPH 15',
    topic: 'Prayer',
    priority: 5,
    claim: 'Formal prayer for relief',
    paragraphRef: '[0250]'
  });

  // Add Critical Correction Section
  hg.addEntity('ad-section-jf5-correction', 'AffidavitSection', {
    name: 'CRITICAL CORRECTION: JF5 AGREEMENT MANIPULATION',
    paragraphRef: '[0277]',
    sectionType: 'rebuttal'
  });

  // Add Link Tuples - AD Paragraphs to People
  hg.addLinkTuple('ad-para-7_2-7_5', 'alleges-against', 'jacqueline-faucitt', {
    allegationType: 'financial-misconduct',
    priority: 1,
    claim: 'IT expense irregularities'
  });

  hg.addLinkTuple('ad-para-7_2-7_5', 'alleges-against', 'daniel-faucitt', {
    allegationType: 'financial-misconduct',
    priority: 1,
    claim: 'Unauthorized IT expenditures'
  });

  hg.addLinkTuple('ad-para-7_6', 'alleges-against', 'jacqueline-faucitt', {
    allegationType: 'unauthorized-payment',
    priority: 1,
    claim: 'R500K payment without authorization',
    amount: 500000
  });

  hg.addLinkTuple('ad-para-10_5-10_10_23', 'alleges-against', 'jacqueline-faucitt', {
    allegationType: 'systematic-misconduct',
    priority: 1,
    claim: 'Pattern of financial irregularities'
  });

  hg.addLinkTuple('ad-para-10_5-10_10_23', 'alleges-against', 'daniel-faucitt', {
    allegationType: 'systematic-misconduct',
    priority: 1,
    claim: 'Complicity in financial scheme'
  });

  hg.addLinkTuple('ad-para-8_4', 'describes-event', 'event-2025-06-20-gee-gayane-email', {
    context: 'confrontation-referenced',
    priority: 2
  });

  // Add Link Tuples - AD Paragraphs to Evidence
  hg.addLinkTuple('ad-para-7_2-7_5', 'supported-by', 'evidence-jf8a', {
    evidenceType: 'documentary',
    description: 'IT expense documentation'
  });

  hg.addLinkTuple('ad-para-10_5-10_10_23', 'supported-by', 'evidence-forensic-index', {
    evidenceType: 'forensic',
    description: 'Comprehensive forensic analysis'
  });

  hg.addLinkTuple('ad-para-10_5-10_10_23', 'supported-by', 'evidence-shopify-reports', {
    evidenceType: 'financial',
    description: 'Revenue and transaction records'
  });

  // Add Link Tuples - AD Paragraphs to Sections
  hg.addLinkTuple('ad-para-1-1_3', 'contained-in', 'ad-section-purpose', {
    sectionType: 'procedural'
  });

  hg.addLinkTuple('ad-para-2-2_4', 'contained-in', 'ad-section-background', {
    sectionType: 'factual'
  });

  hg.addLinkTuple('ad-para-3-3_10', 'contained-in', 'ad-section-role', {
    sectionType: 'factual'
  });

  hg.addLinkTuple('ad-para-3_11-3_13', 'contained-in', 'ad-section-role', {
    sectionType: 'factual'
  });

  hg.addLinkTuple('ad-para-7-7_1', 'contained-in', 'ad-section-background', {
    sectionType: 'financial'
  });

  hg.addLinkTuple('ad-para-7_2-7_5', 'contained-in', 'ad-section-background', {
    sectionType: 'financial'
  });

  hg.addLinkTuple('ad-para-7_6', 'contained-in', 'ad-section-background', {
    sectionType: 'financial'
  });

  hg.addLinkTuple('ad-para-11-11_5', 'contained-in', 'ad-section-interdict', {
    sectionType: 'procedural'
  });

  hg.addLinkTuple('ad-para-13-13_1', 'contained-in', 'ad-section-interdict', {
    sectionType: 'procedural'
  });

  // Add Link Tuples - Peter as Author
  hg.addLinkTuple('peter-faucitt', 'authored', 'ad-section-purpose', {
    role: 'applicant',
    documentType: 'founding-affidavit'
  });

  hg.addLinkTuple('peter-faucitt', 'authored', 'ad-section-background', {
    role: 'applicant',
    documentType: 'founding-affidavit'
  });

  hg.addLinkTuple('peter-faucitt', 'authored', 'ad-section-conclusion', {
    role: 'applicant',
    documentType: 'founding-affidavit'
  });

  // Add Link Tuples - Priority-based clustering
  hg.addLinkTuple('ad-para-7_2-7_5', 'priority-group', 'ad-para-7_6', {
    priorityLevel: 1,
    category: 'critical-financial-allegations'
  });

  hg.addLinkTuple('ad-para-7_6', 'priority-group', 'ad-para-7_7-7_8', {
    priorityLevel: 1,
    category: 'critical-financial-allegations'
  });

  hg.addLinkTuple('ad-para-7_7-7_8', 'priority-group', 'ad-para-7_9-7_11', {
    priorityLevel: 1,
    category: 'critical-financial-allegations'
  });

  hg.addLinkTuple('ad-para-7_9-7_11', 'priority-group', 'ad-para-10_5-10_10_23', {
    priorityLevel: 1,
    category: 'critical-financial-allegations'
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
