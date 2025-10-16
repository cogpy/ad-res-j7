/**
 * Affidavit Plan Generator
 * 
 * Advanced system for generating comprehensive plans for affidavits,
 * including notes, annexures, and evidence management.
 * 
 * Features:
 * - Intelligent section planning based on case analysis
 * - Evidence mapping and gap identification
 * - Annexure organization and referencing
 * - Timeline integration
 * - Strategic recommendations
 */

const LegalDocumentHypergraph = require('./legal-document-hypergraph');

class AffidavitPlanGenerator {
  constructor() {
    this.hypergraph = new LegalDocumentHypergraph();
    this.strategies = new Map();
    this.casePatterns = new Map();
    
    // Initialize strategic patterns
    this.initializeStrategies();
    this.initializeCasePatterns();
  }

  /**
   * Initialize strategic planning approaches
   */
  initializeStrategies() {
    // Defensive strategy
    this.strategies.set('defensive', {
      name: 'Defensive Strategy',
      approach: 'Focus on refuting allegations systematically',
      sections: [
        'Strong denials of false claims',
        'Evidence contradicting allegations',
        'Alternative explanations',
        'Witness testimony supporting defense',
        'Documentary proof of innocence'
      ],
      emphasis: {
        contradictions: 'high',
        alternativeNarrative: 'high',
        characterEvidence: 'medium'
      }
    });
    
    // Offensive strategy
    this.strategies.set('offensive', {
      name: 'Offensive Strategy',
      approach: 'Present strong counter-claims and expose misconduct',
      sections: [
        'Counter-allegations with evidence',
        'Pattern of misconduct by other party',
        'Damages and harm suffered',
        'Bad faith actions exposed',
        'Request for remedies'
      ],
      emphasis: {
        counterClaims: 'high',
        damages: 'high',
        badFaith: 'high'
      }
    });
    
    // Balanced strategy
    this.strategies.set('balanced', {
      name: 'Balanced Strategy',
      approach: 'Combination of defense and measured counter-claims',
      sections: [
        'Factual corrections',
        'Contextual explanations',
        'Limited counter-claims',
        'Focus on resolution',
        'Reasonable remedies'
      ],
      emphasis: {
        accuracy: 'high',
        context: 'high',
        resolution: 'medium'
      }
    });
  }

  /**
   * Initialize case patterns for pattern recognition
   */
  initializeCasePatterns() {
    // Fraud pattern
    this.casePatterns.set('fraud', {
      indicators: ['misrepresentation', 'financial loss', 'deception', 'false documents'],
      requiredEvidence: [
        'Original documents showing truth',
        'Communication proving knowledge',
        'Financial records',
        'Witness statements',
        'Expert analysis'
      ],
      keyParagraphs: [
        'Establishment of trust/relationship',
        'Specific misrepresentations',
        'Reliance on misrepresentations',
        'Resulting damages',
        'Pattern of deception'
      ]
    });
    
    // Breach of contract pattern
    this.casePatterns.set('breach', {
      indicators: ['agreement', 'non-performance', 'damages', 'breach'],
      requiredEvidence: [
        'Contract or agreement',
        'Evidence of performance by plaintiff',
        'Evidence of breach by defendant',
        'Proof of damages',
        'Attempts to remedy'
      ],
      keyParagraphs: [
        'Terms of agreement',
        'Performance by plaintiff',
        'Breach by defendant',
        'Damages suffered',
        'Mitigation attempts'
      ]
    });
    
    // Urgency/interdict pattern
    this.casePatterns.set('urgent', {
      indicators: ['irreparable harm', 'urgency', 'balance of convenience', 'interdict'],
      requiredEvidence: [
        'Evidence of imminent harm',
        'Proof of irreparability',
        'Timeline showing urgency',
        'Failed alternatives',
        'Balance of convenience factors'
      ],
      keyParagraphs: [
        'Nature of threatened harm',
        'Irreparability analysis',
        'Urgency timeline',
        'Alternative remedies exhausted',
        'Balance of convenience'
      ]
    });
  }

  /**
   * Generate comprehensive affidavit plan
   * @param {object} caseInfo - Information about the case
   * @returns {object} Comprehensive plan
   */
  generateComprehensivePlan(caseInfo) {
    const {
      caseType,
      respondingTo,
      claims,
      evidence,
      urgency,
      strategy = 'balanced',
      deponent,
      timeline
    } = caseInfo;
    
    // Analyze case pattern
    const pattern = this.identifyCasePattern(caseInfo);
    
    // Select strategy
    const selectedStrategy = this.strategies.get(strategy) || this.strategies.get('balanced');
    
    // Generate document structure
    const structure = this.generateDocumentStructure(pattern, selectedStrategy, caseInfo);
    
    // Plan evidence integration
    const evidencePlan = this.planEvidenceIntegration(evidence, structure, pattern);
    
    // Plan annexures
    const annexurePlan = this.planAnnexures(evidence, caseInfo);
    
    // Generate notes and recommendations
    const notes = this.generateStrategicNotes(pattern, selectedStrategy, caseInfo);
    
    // Create comprehensive plan
    const plan = {
      id: `plan-${Date.now()}`,
      caseInfo: {
        ...caseInfo,
        pattern: pattern?.name || 'general',
        strategy: selectedStrategy.name
      },
      structure,
      evidencePlan,
      annexurePlan,
      notes,
      timeline: this.createTimelinePlan(timeline, pattern),
      qualityTargets: this.setQualityTargets(urgency, pattern),
      estimatedSections: structure.sections.length,
      estimatedParagraphs: this.estimateParagraphs(structure),
      complexityScore: this.calculateComplexity(caseInfo, pattern),
      generatedAt: new Date().toISOString()
    };
    
    // Store in hypergraph
    this.hypergraph.generateDocumentPlan({
      documentType: 'answering-affidavit',
      purpose: `Respond to ${respondingTo}`,
      claims,
      evidence: evidence.map(e => e.id),
      timeline,
      respondingTo,
      urgency
    });
    
    // Also store the complete plan for retrieval
    this.hypergraph.documentPlans.set(plan.id, plan);
    
    return plan;
  }

  /**
   * Identify case pattern from case information
   */
  identifyCasePattern(caseInfo) {
    let bestMatch = null;
    let highestScore = 0;
    
    for (const [patternName, pattern] of this.casePatterns) {
      let score = 0;
      
      // Check indicators in case description
      pattern.indicators.forEach(indicator => {
        if (caseInfo.description?.toLowerCase().includes(indicator) ||
            caseInfo.claims?.some(c => c.toLowerCase().includes(indicator))) {
          score += 1;
        }
      });
      
      // Check evidence types
      pattern.requiredEvidence.forEach(reqEv => {
        if (caseInfo.evidence?.some(ev => 
          ev.type?.toLowerCase().includes(reqEv.toLowerCase()) ||
          ev.description?.toLowerCase().includes(reqEv.toLowerCase())
        )) {
          score += 0.5;
        }
      });
      
      if (score > highestScore) {
        highestScore = score;
        bestMatch = { name: patternName, ...pattern, score };
      }
    }
    
    return bestMatch;
  }

  /**
   * Generate document structure based on pattern and strategy
   */
  generateDocumentStructure(pattern, strategy, caseInfo) {
    const sections = [];
    
    // Standard opening sections
    sections.push({
      name: 'Caption and Parties',
      type: 'procedural',
      paragraphs: ['Case number', 'Parties', 'Deponent identity']
    });
    
    sections.push({
      name: 'Introduction',
      type: 'procedural',
      paragraphs: [
        'Identity and standing',
        'Knowledge basis',
        'Purpose of affidavit'
      ]
    });
    
    // Response to allegations (if answering)
    if (caseInfo.respondingTo) {
      sections.push({
        name: 'Response to Allegations',
        type: 'substantive',
        paragraphs: this.planResponseParagraphs(caseInfo.respondingTo)
      });
    }
    
    // Pattern-specific sections
    if (pattern) {
      sections.push({
        name: `${pattern.name} - Key Facts`,
        type: 'substantive',
        paragraphs: pattern.keyParagraphs
      });
    }
    
    // Strategy-specific sections
    strategy.sections.forEach(sectionDesc => {
      sections.push({
        name: sectionDesc,
        type: 'substantive',
        paragraphs: this.generateParagraphsForSection(sectionDesc, caseInfo)
      });
    });
    
    // Evidence presentation section
    sections.push({
      name: 'Supporting Evidence',
      type: 'evidential',
      paragraphs: this.planEvidenceParagraphs(caseInfo.evidence)
    });
    
    // Timeline section (if relevant)
    if (caseInfo.timeline?.length > 0) {
      sections.push({
        name: 'Chronology of Events',
        type: 'factual',
        paragraphs: this.planTimelineParagraphs(caseInfo.timeline)
      });
    }
    
    // Conclusion and prayer
    sections.push({
      name: 'Conclusion',
      type: 'procedural',
      paragraphs: [
        'Summary of position',
        'Request for relief',
        'Costs',
        'Further relief'
      ]
    });
    
    return { sections };
  }

  /**
   * Plan evidence integration throughout document
   */
  planEvidenceIntegration(evidence, structure, pattern) {
    const plan = {
      totalEvidence: evidence.length,
      categorized: this.categorizeEvidence(evidence),
      mapping: new Map(),
      unreferenced: [],
      gaps: []
    };
    
    // Map evidence to sections
    structure.sections.forEach(section => {
      const relevantEvidence = evidence.filter(ev => 
        this.isEvidenceRelevantToSection(ev, section, pattern)
      );
      
      plan.mapping.set(section.name, relevantEvidence);
    });
    
    // Identify unreferenced evidence
    evidence.forEach(ev => {
      let referenced = false;
      for (const [section, sectionEvidence] of plan.mapping) {
        if (sectionEvidence.includes(ev)) {
          referenced = true;
          break;
        }
      }
      if (!referenced) {
        plan.unreferenced.push(ev);
      }
    });
    
    // Identify evidence gaps
    if (pattern) {
      pattern.requiredEvidence.forEach(reqEv => {
        const hasEvidence = evidence.some(ev => 
          ev.type?.includes(reqEv) || ev.description?.includes(reqEv)
        );
        if (!hasEvidence) {
          plan.gaps.push({
            type: reqEv,
            importance: 'high',
            suggestion: `Obtain ${reqEv} to strengthen case`
          });
        }
      });
    }
    
    return plan;
  }

  /**
   * Plan annexures organization
   */
  planAnnexures(evidence, caseInfo) {
    const annexures = [];
    let annexureCode = 'A';
    
    // Group evidence by type
    const groupedEvidence = this.groupEvidenceByType(evidence);
    
    // Create annexures for each group
    for (const [type, items] of groupedEvidence) {
      if (items.length === 1) {
        // Single item gets its own annexure
        annexures.push({
          code: `JF${annexureCode}`,
          title: items[0].title || items[0].description,
          type: type,
          items: [items[0]],
          purpose: this.determineAnnexurePurpose(items[0], caseInfo)
        });
        annexureCode = String.fromCharCode(annexureCode.charCodeAt(0) + 1);
      } else if (items.length > 1) {
        // Multiple items grouped together
        annexures.push({
          code: `JF${annexureCode}`,
          title: `${type} Documents`,
          type: 'bundle',
          items: items,
          purpose: `Collection of ${type.toLowerCase()} evidence`
        });
        annexureCode = String.fromCharCode(annexureCode.charCodeAt(0) + 1);
      }
    }
    
    // Add special annexures for complex evidence
    const complexEvidence = evidence.filter(ev => ev.complexity === 'high');
    if (complexEvidence.length > 0) {
      annexures.push({
        code: `JF${annexureCode}`,
        title: 'Technical Analysis and Expert Evidence',
        type: 'technical',
        items: complexEvidence,
        purpose: 'Detailed technical evidence requiring explanation'
      });
    }
    
    return {
      totalAnnexures: annexures.length,
      annexures,
      crossReferenceMap: this.createCrossReferenceMap(annexures),
      indexRequired: annexures.length > 10
    };
  }

  /**
   * Generate strategic notes and recommendations
   */
  generateStrategicNotes(pattern, strategy, caseInfo) {
    const notes = {
      strategic: [],
      tactical: [],
      evidentiary: [],
      procedural: [],
      risks: []
    };
    
    // Strategic notes based on pattern
    if (pattern?.name === 'fraud') {
      notes.strategic.push('Emphasize documentary evidence over testimonial evidence');
      notes.strategic.push('Establish timeline showing knowledge and intent');
      notes.strategic.push('Focus on pattern of behavior rather than isolated incidents');
    } else if (pattern?.name === 'urgent') {
      notes.strategic.push('Lead with irreparable harm analysis');
      notes.strategic.push('Compress timeline presentation for impact');
      notes.strategic.push('Address balance of convenience early');
    }
    
    // Tactical notes based on strategy
    if (strategy.emphasis.contradictions === 'high') {
      notes.tactical.push('Systematically address each contradiction in opposing affidavit');
      notes.tactical.push('Use parallel structure to highlight inconsistencies');
    }
    
    if (strategy.emphasis.counterClaims === 'high') {
      notes.tactical.push('Separate counter-claims into distinct section');
      notes.tactical.push('Support each counter-claim with specific evidence');
    }
    
    // Evidentiary notes
    if (caseInfo.evidence?.length < 5) {
      notes.evidentiary.push('Limited evidence - focus on quality and relevance');
      notes.evidentiary.push('Consider obtaining additional corroborating evidence');
    } else {
      notes.evidentiary.push('Strong evidence base - organize thematically');
      notes.evidentiary.push('Create evidence summary table as annexure');
    }
    
    // Procedural notes
    notes.procedural.push('Ensure all annexures are properly paginated');
    notes.procedural.push('Include certificate of service');
    if (caseInfo.urgency === 'urgent') {
      notes.procedural.push('File immediately upon commissioning');
      notes.procedural.push('Serve electronically and physically');
    }
    
    // Risk assessment
    if (pattern?.score < 3) {
      notes.risks.push('Case pattern unclear - ensure comprehensive coverage');
    }
    if (caseInfo.evidence?.some(ev => ev.admissibility === 'contested')) {
      notes.risks.push('Some evidence may be challenged - prepare alternatives');
    }
    
    return notes;
  }

  /**
   * Create timeline plan
   */
  createTimelinePlan(timeline, pattern) {
    if (!timeline || timeline.length === 0) return null;
    
    // Sort timeline
    const sorted = [...timeline].sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
    
    // Identify critical periods
    const criticalPeriods = [];
    
    if (pattern?.name === 'fraud') {
      // Look for periods showing pattern of deception
      for (let i = 0; i < sorted.length - 1; i++) {
        if (sorted[i].category === 'deception' && 
            sorted[i + 1].category === 'deception') {
          criticalPeriods.push({
            start: sorted[i].date,
            end: sorted[i + 1].date,
            description: 'Pattern of deceptive conduct'
          });
        }
      }
    }
    
    // Create timeline sections
    const timelineSections = this.groupTimelineEvents(sorted);
    
    return {
      events: sorted,
      criticalPeriods,
      sections: timelineSections,
      visualization: {
        type: 'chronological',
        highlighting: criticalPeriods.map(p => p.start),
        annotations: this.generateTimelineAnnotations(sorted, pattern)
      }
    };
  }

  /**
   * Set quality targets based on urgency and pattern
   */
  setQualityTargets(urgency, pattern) {
    const targets = {
      completeness: 95,
      accuracy: 98,
      persuasiveness: 90,
      compliance: 100
    };
    
    if (urgency === 'urgent') {
      // Slightly lower targets for urgent matters
      targets.completeness = 90;
      targets.persuasiveness = 85;
    }
    
    if (pattern?.name === 'fraud') {
      // Higher accuracy requirement for fraud cases
      targets.accuracy = 99;
    }
    
    return targets;
  }

  /**
   * Calculate complexity score
   */
  calculateComplexity(caseInfo, pattern) {
    let complexity = 5; // Base complexity
    
    // Factor in number of claims
    complexity += Math.min(3, caseInfo.claims?.length || 0);
    
    // Factor in evidence volume
    complexity += Math.min(2, (caseInfo.evidence?.length || 0) / 10);
    
    // Factor in pattern complexity
    if (pattern?.name === 'fraud') complexity += 2;
    if (pattern?.name === 'urgent') complexity += 1;
    
    // Factor in timeline complexity
    if (caseInfo.timeline?.length > 20) complexity += 1;
    
    // Factor in response requirements
    if (caseInfo.respondingTo) complexity += 1;
    
    return Math.min(10, Math.round(complexity));
  }

  /**
   * Helper methods
   */
  
  categorizeEvidence(evidence) {
    const categories = {
      documentary: [],
      testimonial: [],
      financial: [],
      technical: [],
      correspondence: [],
      other: []
    };
    
    evidence.forEach(ev => {
      const category = ev.type || 'other';
      if (categories[category]) {
        categories[category].push(ev);
      } else {
        categories.other.push(ev);
      }
    });
    
    return categories;
  }

  groupEvidenceByType(evidence) {
    const groups = new Map();
    
    evidence.forEach(ev => {
      const type = ev.type || 'General';
      if (!groups.has(type)) {
        groups.set(type, []);
      }
      groups.get(type).push(ev);
    });
    
    return groups;
  }

  isEvidenceRelevantToSection(evidence, section, pattern) {
    // Complex relevance determination
    if (section.type === 'evidential') return true;
    
    if (section.name.includes('Counter-allegations') && 
        evidence.supports === 'counter-claim') return true;
    
    if (section.name.includes('Timeline') && 
        evidence.date) return true;
    
    if (pattern && section.name.includes(pattern.name)) {
      return pattern.requiredEvidence.some(req => 
        evidence.type?.includes(req) || 
        evidence.description?.includes(req)
      );
    }
    
    return false;
  }

  determineAnnexurePurpose(evidence, caseInfo) {
    if (evidence.type === 'financial') {
      return 'Demonstrates financial impact and damages';
    }
    if (evidence.type === 'correspondence') {
      return 'Shows communication and knowledge of parties';
    }
    if (evidence.type === 'technical') {
      return 'Provides technical analysis and expert opinion';
    }
    return 'Supports factual allegations in affidavit';
  }

  createCrossReferenceMap(annexures) {
    const map = new Map();
    
    annexures.forEach(annexure => {
      annexure.items.forEach(item => {
        map.set(item.id, {
          annexureCode: annexure.code,
          pageReference: 'TBD', // To be determined after compilation
          description: item.description
        });
      });
    });
    
    return map;
  }

  groupTimelineEvents(events) {
    const sections = [];
    let currentSection = null;
    
    events.forEach(event => {
      const eventDate = new Date(event.date);
      
      if (!currentSection || 
          eventDate - new Date(currentSection.endDate) > 30 * 24 * 60 * 60 * 1000) {
        // Start new section if gap > 30 days
        currentSection = {
          title: `Period: ${event.date}`,
          startDate: event.date,
          endDate: event.date,
          events: [event]
        };
        sections.push(currentSection);
      } else {
        currentSection.events.push(event);
        currentSection.endDate = event.date;
        currentSection.title = `Period: ${currentSection.startDate} to ${event.date}`;
      }
    });
    
    return sections;
  }

  generateTimelineAnnotations(events, pattern) {
    const annotations = [];
    
    // Pattern-specific annotations
    if (pattern?.name === 'fraud') {
      const firstDeception = events.find(e => e.category === 'deception');
      if (firstDeception) {
        annotations.push({
          date: firstDeception.date,
          text: 'First documented deception',
          importance: 'high'
        });
      }
    }
    
    // General annotations for critical events
    events.forEach(event => {
      if (event.significance === 'critical') {
        annotations.push({
          date: event.date,
          text: event.description,
          importance: 'high'
        });
      }
    });
    
    return annotations;
  }

  planResponseParagraphs(respondingDocument) {
    // This would analyze the document being responded to
    // For now, return template structure
    return [
      'General denial of unfounded allegations',
      'Specific admissions (if any)',
      'Specific denials with reasons',
      'Corrections to misstatements',
      'Context and clarifications'
    ];
  }

  generateParagraphsForSection(sectionDesc, caseInfo) {
    // Generate paragraph outline based on section description
    // This is simplified - real implementation would be more sophisticated
    const paragraphs = [];
    
    if (sectionDesc.includes('denials')) {
      paragraphs.push('Categorical denial of allegation X');
      paragraphs.push('Evidence contradicting allegation X');
    }
    
    if (sectionDesc.includes('counter-allegations')) {
      caseInfo.claims?.forEach((claim, index) => {
        paragraphs.push(`Counter-claim ${index + 1}: ${claim}`);
        paragraphs.push(`Evidence supporting counter-claim ${index + 1}`);
      });
    }
    
    if (sectionDesc.includes('damages')) {
      paragraphs.push('Nature and extent of damages');
      paragraphs.push('Causal connection to wrongful acts');
      paragraphs.push('Quantum of damages');
    }
    
    return paragraphs;
  }

  planEvidenceParagraphs(evidence) {
    const paragraphs = [];
    
    // Group evidence by significance
    const critical = evidence.filter(e => e.significance === 'critical');
    const supporting = evidence.filter(e => e.significance !== 'critical');
    
    if (critical.length > 0) {
      paragraphs.push('Critical evidence overview');
      critical.forEach(ev => {
        paragraphs.push(`Analysis of ${ev.description}`);
      });
    }
    
    if (supporting.length > 0) {
      paragraphs.push('Supporting evidence summary');
      paragraphs.push('Corroboration between evidence pieces');
    }
    
    paragraphs.push('Evidence credibility and weight');
    
    return paragraphs;
  }

  planTimelineParagraphs(timeline) {
    return [
      'Overview of relevant time period',
      'Key events in chronological order',
      'Critical periods and patterns',
      'Timeline contradictions in opposing version',
      'Significance of temporal sequence'
    ];
  }

  estimateParagraphs(structure) {
    let total = 0;
    structure.sections.forEach(section => {
      total += section.paragraphs.length;
    });
    return total;
  }
}

module.exports = AffidavitPlanGenerator;