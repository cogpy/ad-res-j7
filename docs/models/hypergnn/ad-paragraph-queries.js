/**
 * AD Paragraph Hypergraph Query Examples
 * 
 * Practical examples demonstrating how to query the hypergraph
 * for legal analysis and response planning.
 */

const { buildCase2025137857Hypergraph } = require('./case-hypergraph');

/**
 * Example 1: Find all critical allegations against a respondent
 */
function findCriticalAllegations(respondentId) {
  const hg = buildCase2025137857Hypergraph();
  
  const allegations = hg.queryLinksByRelation('alleges-against')
    .filter(link => link.target === respondentId && link.metadata.priority === 1)
    .map(link => {
      const para = hg.entities.get(link.source);
      return {
        paragraph: para.name,
        topic: para.topic,
        claim: para.claim,
        allegationType: link.metadata.allegationType,
        amount: link.metadata.amount
      };
    });
  
  return allegations;
}

/**
 * Example 2: Get all paragraphs by priority level
 */
function getParagraphsByPriority(priorityLevel) {
  const hg = buildCase2025137857Hypergraph();
  
  return hg.queryEntitiesByType('ADParagraph')
    .filter(para => para.priority === priorityLevel)
    .map(para => ({
      id: para.id,
      name: para.name,
      topic: para.topic,
      claim: para.claim,
      priority: para.priority
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Example 3: Find evidence supporting specific allegations
 */
function findSupportingEvidence(paragraphId) {
  const hg = buildCase2025137857Hypergraph();
  
  const evidenceLinks = hg.queryLinksBySource(paragraphId)
    .filter(link => link.relation === 'supported-by');
  
  return evidenceLinks.map(link => {
    const evidence = hg.entities.get(link.target);
    return {
      evidenceId: evidence.id,
      evidenceName: evidence.name,
      evidenceType: link.metadata.evidenceType,
      description: link.metadata.description
    };
  });
}

/**
 * Example 4: Get section structure with contained paragraphs
 */
function getSectionStructure() {
  const hg = buildCase2025137857Hypergraph();
  
  const sections = hg.queryEntitiesByType('AffidavitSection');
  
  return sections.map(section => {
    const containedParas = hg.queryLinksByRelation('contained-in')
      .filter(link => link.target === section.id)
      .map(link => {
        const para = hg.entities.get(link.source);
        return {
          name: para.name,
          topic: para.topic,
          priority: para.priority
        };
      });
    
    return {
      sectionId: section.id,
      sectionName: section.name,
      sectionType: section.sectionType,
      paragraphCount: containedParas.length,
      paragraphs: containedParas
    };
  });
}

/**
 * Example 5: Find all allegations by type
 */
function getAllegationsByType(allegationType) {
  const hg = buildCase2025137857Hypergraph();
  
  return hg.queryLinksByRelation('alleges-against')
    .filter(link => link.metadata.allegationType === allegationType)
    .map(link => {
      const para = hg.entities.get(link.source);
      const target = hg.entities.get(link.target);
      
      return {
        paragraph: para.name,
        topic: para.topic,
        claim: para.claim,
        against: target.name,
        priority: link.metadata.priority
      };
    });
}

/**
 * Example 6: Generate response priority list
 */
function generateResponsePriorityList() {
  const hg = buildCase2025137857Hypergraph();
  
  const allParas = hg.queryEntitiesByType('ADParagraph');
  
  // Group by priority
  const grouped = {};
  allParas.forEach(para => {
    if (!grouped[para.priority]) {
      grouped[para.priority] = [];
    }
    grouped[para.priority].push({
      name: para.name,
      topic: para.topic,
      claim: para.claim
    });
  });
  
  // Sort each group and create priority list
  const priorityList = [];
  for (let p = 1; p <= 5; p++) {
    if (grouped[p]) {
      priorityList.push({
        priority: p,
        description: getPriorityDescription(p),
        count: grouped[p].length,
        paragraphs: grouped[p]
      });
    }
  }
  
  return priorityList;
}

function getPriorityDescription(priority) {
  const descriptions = {
    1: 'Critical - Comprehensive rebuttal required',
    2: 'High - Strong evidence-based response needed',
    3: 'Medium - Adequate response with context',
    4: 'Low - Brief response sufficient',
    5: 'Meaningless - Minimal or no response needed'
  };
  return descriptions[priority] || 'Unknown';
}

/**
 * Example 7: Find allegations without evidence
 */
function findAllegationsWithoutEvidence() {
  const hg = buildCase2025137857Hypergraph();
  
  const allParas = hg.queryEntitiesByType('ADParagraph');
  const parasWithEvidence = new Set(
    hg.queryLinksByRelation('supported-by').map(link => link.source)
  );
  
  return allParas
    .filter(para => !parasWithEvidence.has(para.id))
    .map(para => ({
      name: para.name,
      topic: para.topic,
      claim: para.claim,
      priority: para.priority
    }));
}

/**
 * Example 8: Get complete allegation profile
 */
function getAllegationProfile(paragraphId) {
  const hg = buildCase2025137857Hypergraph();
  
  const para = hg.entities.get(paragraphId);
  if (!para) return null;
  
  // Get who it alleges against
  const allegations = hg.queryLinksBySource(paragraphId)
    .filter(link => link.relation === 'alleges-against')
    .map(link => ({
      against: hg.entities.get(link.target).name,
      allegationType: link.metadata.allegationType,
      claim: link.metadata.claim
    }));
  
  // Get supporting evidence
  const evidence = hg.queryLinksBySource(paragraphId)
    .filter(link => link.relation === 'supported-by')
    .map(link => hg.entities.get(link.target).name);
  
  // Get containing section
  const sectionLink = hg.queryLinksBySource(paragraphId)
    .find(link => link.relation === 'contained-in');
  const section = sectionLink ? hg.entities.get(sectionLink.target).name : 'Unknown';
  
  // Get priority group members
  const priorityGroup = hg.queryLinksBySource(paragraphId)
    .filter(link => link.relation === 'priority-group')
    .map(link => hg.entities.get(link.target).name);
  
  return {
    paragraph: para.name,
    topic: para.topic,
    claim: para.claim,
    priority: para.priority,
    section: section,
    allegations: allegations,
    evidence: evidence,
    relatedParagraphs: priorityGroup
  };
}

/**
 * Example 9: Generate statistics report
 */
function generateStatisticsReport() {
  const hg = buildCase2025137857Hypergraph();
  const stats = hg.getStats();
  
  const adParas = hg.queryEntitiesByType('ADParagraph');
  const sections = hg.queryEntitiesByType('AffidavitSection');
  
  const priorityDist = {
    1: adParas.filter(p => p.priority === 1).length,
    2: adParas.filter(p => p.priority === 2).length,
    3: adParas.filter(p => p.priority === 3).length,
    4: adParas.filter(p => p.priority === 4).length,
    5: adParas.filter(p => p.priority === 5).length
  };
  
  const allegationLinks = hg.queryLinksByRelation('alleges-against');
  const evidenceLinks = hg.queryLinksByRelation('supported-by');
  
  return {
    totalEntities: stats.totalEntities,
    totalLinkTuples: stats.totalLinkTuples,
    totalRelations: stats.totalRelations,
    adParagraphs: adParas.length,
    affidavitSections: sections.length,
    priorityDistribution: priorityDist,
    totalAllegations: allegationLinks.length,
    paragraphsWithEvidence: evidenceLinks.length,
    entitiesByType: stats.entitiesByType,
    linksByRelation: stats.linksByRelation
  };
}

/**
 * Example 10: Find financial allegations with amounts
 */
function findFinancialAllegations() {
  const hg = buildCase2025137857Hypergraph();
  
  return hg.queryLinksByRelation('alleges-against')
    .filter(link => link.metadata.amount !== undefined)
    .map(link => {
      const para = hg.entities.get(link.source);
      const target = hg.entities.get(link.target);
      
      return {
        paragraph: para.name,
        topic: para.topic,
        against: target.name,
        amount: link.metadata.amount,
        allegationType: link.metadata.allegationType,
        priority: link.metadata.priority
      };
    })
    .sort((a, b) => b.amount - a.amount);
}

// Export all query functions
module.exports = {
  findCriticalAllegations,
  getParagraphsByPriority,
  findSupportingEvidence,
  getSectionStructure,
  getAllegationsByType,
  generateResponsePriorityList,
  findAllegationsWithoutEvidence,
  getAllegationProfile,
  generateStatisticsReport,
  findFinancialAllegations
};

// If run directly, demonstrate all queries
if (require.main === module) {
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('📊 AD Paragraph Hypergraph Query Examples');
  console.log('═══════════════════════════════════════════════════════\n');
  
  // Query 1
  console.log('1️⃣  Critical Allegations Against Jacqueline:');
  const jaxCritical = findCriticalAllegations('jacqueline-faucitt');
  jaxCritical.forEach((alleg, i) => {
    console.log(`   ${i + 1}. ${alleg.paragraph}`);
    console.log(`      Topic: ${alleg.topic}`);
    console.log(`      Claim: ${alleg.claim}`);
    if (alleg.amount) console.log(`      Amount: R${alleg.amount.toLocaleString()}`);
  });
  
  // Query 2
  console.log('\n2️⃣  All Priority 1 (Critical) Paragraphs:');
  const priority1 = getParagraphsByPriority(1);
  priority1.forEach((para, i) => {
    console.log(`   ${i + 1}. ${para.name}`);
    console.log(`      Topic: ${para.topic}`);
  });
  
  // Query 3
  console.log('\n3️⃣  Evidence Supporting IT Expense Claims:');
  const itEvidence = findSupportingEvidence('ad-para-7_2-7_5');
  itEvidence.forEach((ev, i) => {
    console.log(`   ${i + 1}. ${ev.evidenceName}`);
    console.log(`      Type: ${ev.evidenceType}`);
    console.log(`      Description: ${ev.description}`);
  });
  
  // Query 4
  console.log('\n4️⃣  Financial Allegations with Amounts:');
  const financial = findFinancialAllegations();
  financial.forEach((alleg, i) => {
    console.log(`   ${i + 1}. ${alleg.paragraph}`);
    console.log(`      Amount: R${alleg.amount.toLocaleString()}`);
    console.log(`      Against: ${alleg.against}`);
  });
  
  // Query 5
  console.log('\n5️⃣  Statistics Report:');
  const stats = generateStatisticsReport();
  console.log(`   Total Entities: ${stats.totalEntities}`);
  console.log(`   Total Relationships: ${stats.totalLinkTuples}`);
  console.log(`   AD Paragraphs: ${stats.adParagraphs}`);
  console.log(`   Affidavit Sections: ${stats.affidavitSections}`);
  console.log('\n   Priority Distribution:');
  Object.entries(stats.priorityDistribution).forEach(([p, count]) => {
    const pct = ((count / stats.adParagraphs) * 100).toFixed(1);
    console.log(`     Priority ${p}: ${count} (${pct}%)`);
  });
  
  // Query 6
  console.log('\n6️⃣  Section Structure Overview:');
  const sections = getSectionStructure();
  sections.forEach(section => {
    console.log(`   📑 ${section.sectionName}`);
    console.log(`      Type: ${section.sectionType}`);
    console.log(`      Contains: ${section.paragraphCount} paragraphs`);
  });
  
  console.log('\n═══════════════════════════════════════════════════════\n');
}
