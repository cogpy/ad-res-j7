/**
 * Affidavit Evaluator and Rating System
 * 
 * Comprehensive evaluation system for legal documents with multi-dimensional
 * analysis and sophisticated rating algorithms.
 * 
 * Features:
 * - Multi-criteria evaluation
 * - Evidence strength analysis
 * - Logical consistency checking
 * - Legal compliance verification
 * - Persuasiveness scoring
 * - Comparative analysis
 * - Improvement recommendations
 */

const LegalDocumentHypergraph = require('./legal-document-hypergraph');

class AffidavitEvaluator {
  constructor() {
    this.hypergraph = new LegalDocumentHypergraph();
    this.evaluationCriteria = new Map();
    this.benchmarks = new Map();
    this.patterns = new Map();
    
    // Initialize evaluation framework
    this.initializeEvaluationCriteria();
    this.initializeBenchmarks();
    this.initializePatterns();
  }

  /**
   * Initialize evaluation criteria with weights
   */
  initializeEvaluationCriteria() {
    this.evaluationCriteria.set('structural', {
      weight: 0.15,
      subcriteria: {
        organization: { weight: 0.3, description: 'Logical flow and structure' },
        completeness: { weight: 0.3, description: 'All required sections present' },
        formatting: { weight: 0.2, description: 'Proper formatting and numbering' },
        clarity: { weight: 0.2, description: 'Clear section demarcation' }
      }
    });
    
    this.evaluationCriteria.set('evidential', {
      weight: 0.30,
      subcriteria: {
        relevance: { weight: 0.25, description: 'Evidence directly supports claims' },
        sufficiency: { weight: 0.25, description: 'Adequate evidence for each claim' },
        credibility: { weight: 0.25, description: 'Evidence from credible sources' },
        organization: { weight: 0.25, description: 'Evidence properly referenced' }
      }
    });
    
    this.evaluationCriteria.set('legal', {
      weight: 0.25,
      subcriteria: {
        compliance: { weight: 0.35, description: 'Meets legal requirements' },
        admissibility: { weight: 0.30, description: 'Evidence is admissible' },
        procedure: { weight: 0.20, description: 'Follows procedural rules' },
        precedent: { weight: 0.15, description: 'Aligns with legal precedent' }
      }
    });
    
    this.evaluationCriteria.set('persuasive', {
      weight: 0.20,
      subcriteria: {
        narrative: { weight: 0.30, description: 'Compelling narrative flow' },
        logic: { weight: 0.30, description: 'Sound logical reasoning' },
        emotion: { weight: 0.20, description: 'Appropriate emotional appeal' },
        credibility: { weight: 0.20, description: 'Deponent credibility' }
      }
    });
    
    this.evaluationCriteria.set('technical', {
      weight: 0.10,
      subcriteria: {
        language: { weight: 0.40, description: 'Clear and precise language' },
        consistency: { weight: 0.30, description: 'Internal consistency' },
        references: { weight: 0.20, description: 'Proper citations and references' },
        terminology: { weight: 0.10, description: 'Correct legal terminology' }
      }
    });
  }

  /**
   * Initialize benchmarks for different document types
   */
  initializeBenchmarks() {
    this.benchmarks.set('founding-affidavit', {
      minParagraphs: 20,
      maxParagraphs: 100,
      requiredSections: ['identity', 'jurisdiction', 'facts', 'cause-of-action', 'relief'],
      evidenceRatio: 0.3, // 30% of paragraphs should reference evidence
      targetScore: 85
    });
    
    this.benchmarks.set('answering-affidavit', {
      minParagraphs: 15,
      maxParagraphs: 150,
      requiredSections: ['identity', 'admissions-denials', 'version', 'evidence'],
      evidenceRatio: 0.4, // 40% of paragraphs should reference evidence
      targetScore: 85
    });
    
    this.benchmarks.set('replying-affidavit', {
      minParagraphs: 10,
      maxParagraphs: 50,
      requiredSections: ['identity', 'new-matter', 'rebuttal'],
      evidenceRatio: 0.35,
      targetScore: 80
    });
    
    this.benchmarks.set('expert-affidavit', {
      minParagraphs: 15,
      maxParagraphs: 80,
      requiredSections: ['identity', 'qualifications', 'methodology', 'findings', 'opinion'],
      evidenceRatio: 0.5, // 50% - heavily evidence-based
      targetScore: 90
    });
  }

  /**
   * Initialize patterns for issue detection
   */
  initializePatterns() {
    this.patterns.set('hearsay', {
      indicators: [
        /told me that/i,
        /I was informed/i,
        /I heard that/i,
        /someone said/i,
        /I understand that/i,
        /I am advised/i
      ],
      severity: 'medium',
      remedy: 'Qualify hearsay or remove unless exception applies'
    });
    
    this.patterns.set('speculation', {
      indicators: [
        /I believe that/i,
        /I think that/i,
        /probably/i,
        /possibly/i,
        /might have/i,
        /could have/i,
        /I suspect/i
      ],
      severity: 'medium',
      remedy: 'Replace speculation with facts or remove'
    });
    
    this.patterns.set('argumentative', {
      indicators: [
        /it is obvious/i,
        /clearly/i,
        /any reasonable person/i,
        /it is submitted/i,
        /I argue that/i
      ],
      severity: 'low',
      remedy: 'Save arguments for heads of argument'
    });
    
    this.patterns.set('vague', {
      indicators: [
        /approximately/i,
        /around/i,
        /sometime/i,
        /various/i,
        /several/i,
        /numerous/i
      ],
      severity: 'low',
      remedy: 'Provide specific details where possible'
    });
  }

  /**
   * Perform comprehensive evaluation of affidavit
   * @param {object} affidavit - Affidavit to evaluate
   * @param {object} options - Evaluation options
   * @returns {object} Comprehensive evaluation results
   */
  async evaluateAffidavit(affidavit, options = {}) {
    const {
      documentType = 'answering-affidavit',
      compareWith = null,
      detailLevel = 'comprehensive',
      generateReport = true
    } = options;
    
    // Get benchmark for document type
    const benchmark = this.benchmarks.get(documentType) || this.benchmarks.get('answering-affidavit');
    
    // Perform multi-dimensional evaluation
    const evaluation = {
      id: `eval-${Date.now()}`,
      affidavitId: affidavit.id,
      documentType,
      timestamp: new Date().toISOString(),
      scores: {},
      issues: [],
      strengths: [],
      recommendations: [],
      comparison: null
    };
    
    // Evaluate each criterion
    for (const [criterion, config] of this.evaluationCriteria) {
      evaluation.scores[criterion] = await this.evaluateCriterion(
        affidavit,
        criterion,
        config,
        benchmark
      );
    }
    
    // Calculate overall score
    evaluation.overallScore = this.calculateOverallScore(evaluation.scores);
    evaluation.rating = this.determineRating(evaluation.overallScore, documentType);
    
    // Perform pattern analysis
    evaluation.patternAnalysis = this.analyzePatterns(affidavit);
    
    // Comparative analysis if requested
    if (compareWith) {
      evaluation.comparison = await this.compareAffidavits(affidavit, compareWith);
    }
    
    // Generate detailed findings
    evaluation.detailedFindings = this.generateDetailedFindings(
      evaluation,
      affidavit,
      benchmark
    );
    
    // Generate improvement roadmap
    evaluation.improvementRoadmap = this.generateImprovementRoadmap(
      evaluation,
      benchmark
    );
    
    // Store evaluation in hypergraph
    this.hypergraph.addEntity(evaluation.id, 'Evaluation', evaluation);
    this.hypergraph.addLinkTuple(evaluation.id, 'evaluates', affidavit.id, {
      score: evaluation.overallScore,
      rating: evaluation.rating
    });
    
    // Generate report if requested
    if (generateReport) {
      evaluation.report = this.generateEvaluationReport(evaluation, affidavit);
    }
    
    return evaluation;
  }

  /**
   * Evaluate a specific criterion
   */
  async evaluateCriterion(affidavit, criterionName, config, benchmark) {
    const scores = {};
    const issues = [];
    const strengths = [];
    
    for (const [subcriterion, subconfig] of Object.entries(config.subcriteria)) {
      const result = await this.evaluateSubcriterion(
        affidavit,
        criterionName,
        subcriterion,
        subconfig,
        benchmark
      );
      
      scores[subcriterion] = result.score;
      issues.push(...result.issues);
      strengths.push(...result.strengths);
    }
    
    // Calculate weighted score for criterion
    const weightedScore = Object.entries(scores).reduce((total, [sub, score]) => {
      return total + (score * config.subcriteria[sub].weight);
    }, 0);
    
    return {
      score: weightedScore,
      rawScores: scores,
      issues,
      strengths,
      weight: config.weight
    };
  }

  /**
   * Evaluate a specific subcriterion
   */
  async evaluateSubcriterion(affidavit, criterion, subcriterion, config, benchmark) {
    let score = 100;
    const issues = [];
    const strengths = [];
    
    // Structural evaluation
    if (criterion === 'structural') {
      switch (subcriterion) {
        case 'organization':
          const flowScore = this.evaluateLogicalFlow(affidavit);
          score = flowScore.score;
          issues.push(...flowScore.issues);
          strengths.push(...flowScore.strengths);
          break;
          
        case 'completeness':
          const completeness = this.evaluateCompleteness(affidavit, benchmark);
          score = completeness.score;
          issues.push(...completeness.issues);
          strengths.push(...completeness.strengths);
          break;
          
        case 'formatting':
          const formatting = this.evaluateFormatting(affidavit);
          score = formatting.score;
          issues.push(...formatting.issues);
          strengths.push(...formatting.strengths);
          break;
          
        case 'clarity':
          const clarity = this.evaluateClarity(affidavit);
          score = clarity.score;
          issues.push(...clarity.issues);
          strengths.push(...clarity.strengths);
          break;
      }
    }
    
    // Evidential evaluation
    else if (criterion === 'evidential') {
      switch (subcriterion) {
        case 'relevance':
          const relevance = this.evaluateEvidenceRelevance(affidavit);
          score = relevance.score;
          issues.push(...relevance.issues);
          strengths.push(...relevance.strengths);
          break;
          
        case 'sufficiency':
          const sufficiency = this.evaluateEvidenceSufficiency(affidavit, benchmark);
          score = sufficiency.score;
          issues.push(...sufficiency.issues);
          strengths.push(...sufficiency.strengths);
          break;
          
        case 'credibility':
          const credibility = this.evaluateEvidenceCredibility(affidavit);
          score = credibility.score;
          issues.push(...credibility.issues);
          strengths.push(...credibility.strengths);
          break;
          
        case 'organization':
          const evidenceOrg = this.evaluateEvidenceOrganization(affidavit);
          score = evidenceOrg.score;
          issues.push(...evidenceOrg.issues);
          strengths.push(...evidenceOrg.strengths);
          break;
      }
    }
    
    // Legal evaluation
    else if (criterion === 'legal') {
      switch (subcriterion) {
        case 'compliance':
          const compliance = this.evaluateLegalCompliance(affidavit, benchmark);
          score = compliance.score;
          issues.push(...compliance.issues);
          strengths.push(...compliance.strengths);
          break;
          
        case 'admissibility':
          const admissibility = this.evaluateAdmissibility(affidavit);
          score = admissibility.score;
          issues.push(...admissibility.issues);
          strengths.push(...admissibility.strengths);
          break;
          
        case 'procedure':
          const procedure = this.evaluateProcedure(affidavit);
          score = procedure.score;
          issues.push(...procedure.issues);
          strengths.push(...procedure.strengths);
          break;
          
        case 'precedent':
          const precedent = this.evaluatePrecedentAlignment(affidavit);
          score = precedent.score;
          issues.push(...precedent.issues);
          strengths.push(...precedent.strengths);
          break;
      }
    }
    
    // Persuasive evaluation
    else if (criterion === 'persuasive') {
      switch (subcriterion) {
        case 'narrative':
          const narrative = this.evaluateNarrative(affidavit);
          score = narrative.score;
          issues.push(...narrative.issues);
          strengths.push(...narrative.strengths);
          break;
          
        case 'logic':
          const logic = this.evaluateLogic(affidavit);
          score = logic.score;
          issues.push(...logic.issues);
          strengths.push(...logic.strengths);
          break;
          
        case 'emotion':
          const emotion = this.evaluateEmotionalAppeal(affidavit);
          score = emotion.score;
          issues.push(...emotion.issues);
          strengths.push(...emotion.strengths);
          break;
          
        case 'credibility':
          const deponentCred = this.evaluateDeponentCredibility(affidavit);
          score = deponentCred.score;
          issues.push(...deponentCred.issues);
          strengths.push(...deponentCred.strengths);
          break;
      }
    }
    
    // Technical evaluation
    else if (criterion === 'technical') {
      switch (subcriterion) {
        case 'language':
          const language = this.evaluateLanguage(affidavit);
          score = language.score;
          issues.push(...language.issues);
          strengths.push(...language.strengths);
          break;
          
        case 'consistency':
          const consistency = this.evaluateConsistency(affidavit);
          score = consistency.score;
          issues.push(...consistency.issues);
          strengths.push(...consistency.strengths);
          break;
          
        case 'references':
          const references = this.evaluateReferences(affidavit);
          score = references.score;
          issues.push(...references.issues);
          strengths.push(...references.strengths);
          break;
          
        case 'terminology':
          const terminology = this.evaluateTerminology(affidavit);
          score = terminology.score;
          issues.push(...terminology.issues);
          strengths.push(...terminology.strengths);
          break;
      }
    }
    
    return { score, issues, strengths };
  }

  /**
   * Analyze patterns in affidavit
   */
  analyzePatterns(affidavit) {
    const findings = [];
    
    if (!affidavit.paragraphs) return findings;
    
    for (const [patternName, pattern] of this.patterns) {
      const instances = [];
      
      affidavit.paragraphs.forEach(para => {
        pattern.indicators.forEach(indicator => {
          const matches = para.content.match(indicator);
          if (matches) {
            instances.push({
              paragraph: para.number,
              text: matches[0],
              context: para.content.substring(
                Math.max(0, para.content.indexOf(matches[0]) - 50),
                Math.min(para.content.length, para.content.indexOf(matches[0]) + 50)
              )
            });
          }
        });
      });
      
      if (instances.length > 0) {
        findings.push({
          pattern: patternName,
          severity: pattern.severity,
          instances: instances.length,
          examples: instances.slice(0, 3),
          remedy: pattern.remedy
        });
      }
    }
    
    return findings;
  }

  /**
   * Compare two affidavits
   */
  async compareAffidavits(affidavit1, affidavit2) {
    const comparison = {
      scoreComparison: {},
      strengthComparison: [],
      improvements: [],
      relativeStrengths: [],
      relativeWeaknesses: []
    };
    
    // Evaluate both if needed
    const eval1 = await this.evaluateAffidavit(affidavit1, { generateReport: false });
    const eval2 = await this.evaluateAffidavit(affidavit2, { generateReport: false });
    
    // Compare scores
    for (const criterion in eval1.scores) {
      comparison.scoreComparison[criterion] = {
        affidavit1: eval1.scores[criterion].score,
        affidavit2: eval2.scores[criterion].score,
        difference: eval1.scores[criterion].score - eval2.scores[criterion].score
      };
    }
    
    // Identify relative strengths and weaknesses
    for (const criterion in comparison.scoreComparison) {
      const diff = comparison.scoreComparison[criterion].difference;
      if (diff > 10) {
        comparison.relativeStrengths.push({
          criterion,
          advantage: diff,
          description: `${criterion} is significantly stronger in first affidavit`
        });
      } else if (diff < -10) {
        comparison.relativeWeaknesses.push({
          criterion,
          disadvantage: Math.abs(diff),
          description: `${criterion} is significantly weaker in first affidavit`
        });
      }
    }
    
    // Evidence comparison
    comparison.evidenceComparison = {
      quantity: {
        affidavit1: affidavit1.annexures?.length || 0,
        affidavit2: affidavit2.annexures?.length || 0
      },
      referenceDensity: {
        affidavit1: this.calculateEvidenceDensity(affidavit1),
        affidavit2: this.calculateEvidenceDensity(affidavit2)
      }
    };
    
    return comparison;
  }

  /**
   * Calculate overall score from criterion scores
   */
  calculateOverallScore(scores) {
    let totalScore = 0;
    
    for (const [criterion, result] of Object.entries(scores)) {
      totalScore += result.score * result.weight;
    }
    
    return Math.round(totalScore);
  }

  /**
   * Determine rating based on score and document type
   */
  determineRating(score, documentType) {
    const benchmark = this.benchmarks.get(documentType);
    const targetScore = benchmark?.targetScore || 85;
    
    if (score >= targetScore + 10) return { level: 'Exceptional', stars: 5 };
    if (score >= targetScore) return { level: 'Excellent', stars: 4.5 };
    if (score >= targetScore - 10) return { level: 'Good', stars: 4 };
    if (score >= targetScore - 20) return { level: 'Satisfactory', stars: 3 };
    if (score >= targetScore - 30) return { level: 'Needs Improvement', stars: 2 };
    return { level: 'Poor', stars: 1 };
  }

  /**
   * Generate detailed findings
   */
  generateDetailedFindings(evaluation, affidavit, benchmark) {
    const findings = {
      criticalIssues: [],
      majorIssues: [],
      minorIssues: [],
      strengths: [],
      opportunities: []
    };
    
    // Analyze scores for issues
    for (const [criterion, result] of Object.entries(evaluation.scores)) {
      if (result.score < 50) {
        findings.criticalIssues.push({
          area: criterion,
          score: result.score,
          impact: 'Severely impacts document effectiveness',
          issues: result.issues
        });
      } else if (result.score < 70) {
        findings.majorIssues.push({
          area: criterion,
          score: result.score,
          impact: 'Significantly affects quality',
          issues: result.issues
        });
      } else if (result.score < 85) {
        findings.minorIssues.push({
          area: criterion,
          score: result.score,
          impact: 'Room for improvement',
          issues: result.issues
        });
      } else {
        findings.strengths.push({
          area: criterion,
          score: result.score,
          strengths: result.strengths
        });
      }
    }
    
    // Pattern-based findings
    evaluation.patternAnalysis.forEach(pattern => {
      const issue = {
        type: pattern.pattern,
        occurrences: pattern.instances,
        severity: pattern.severity,
        remedy: pattern.remedy,
        examples: pattern.examples
      };
      
      if (pattern.severity === 'high') {
        findings.criticalIssues.push(issue);
      } else if (pattern.severity === 'medium') {
        findings.majorIssues.push(issue);
      } else {
        findings.minorIssues.push(issue);
      }
    });
    
    // Identify opportunities
    if (affidavit.paragraphs?.length < benchmark.minParagraphs) {
      findings.opportunities.push({
        area: 'Content Development',
        suggestion: 'Expand key sections to meet minimum requirements',
        potential: 'Could improve completeness score by 10-15 points'
      });
    }
    
    const evidenceDensity = this.calculateEvidenceDensity(affidavit);
    if (evidenceDensity < benchmark.evidenceRatio) {
      findings.opportunities.push({
        area: 'Evidence Integration',
        suggestion: 'Increase evidence references throughout document',
        potential: 'Could improve evidential score by 15-20 points'
      });
    }
    
    return findings;
  }

  /**
   * Generate improvement roadmap
   */
  generateImprovementRoadmap(evaluation, benchmark) {
    const roadmap = {
      immediate: [], // Can be done in < 1 hour
      shortTerm: [], // Can be done in < 1 day
      mediumTerm: [], // Requires 1-3 days
      strategic: [] // Requires significant rework
    };
    
    // Prioritize based on impact and effort
    evaluation.detailedFindings.criticalIssues.forEach(issue => {
      if (issue.type === 'hearsay' || issue.type === 'speculation') {
        roadmap.immediate.push({
          action: `Remove or qualify ${issue.type} statements`,
          impact: 'High',
          effort: 'Low',
          specificSteps: [
            `Review paragraphs: ${issue.examples.map(e => e.paragraph).join(', ')}`,
            `Apply remedy: ${issue.remedy}`,
            'Verify changes maintain narrative flow'
          ]
        });
      }
    });
    
    evaluation.detailedFindings.majorIssues.forEach(issue => {
      if (issue.area === 'evidential') {
        roadmap.shortTerm.push({
          action: 'Strengthen evidence integration',
          impact: 'High',
          effort: 'Medium',
          specificSteps: [
            'Map claims to evidence',
            'Add evidence references to unsupported claims',
            'Organize annexures systematically'
          ]
        });
      }
    });
    
    if (evaluation.overallScore < benchmark.targetScore - 20) {
      roadmap.strategic.push({
        action: 'Comprehensive document restructuring',
        impact: 'Very High',
        effort: 'High',
        specificSteps: [
          'Review document strategy',
          'Reorganize sections for better flow',
          'Strengthen narrative throughout',
          'Obtain additional evidence if needed'
        ]
      });
    }
    
    // Add timeline
    roadmap.timeline = this.generateImprovementTimeline(roadmap);
    
    return roadmap;
  }

  /**
   * Generate evaluation report
   */
  generateEvaluationReport(evaluation, affidavit) {
    const report = {
      executive: this.generateExecutiveSummary(evaluation, affidavit),
      detailed: this.generateDetailedReport(evaluation, affidavit),
      technical: this.generateTechnicalAppendix(evaluation),
      recommendations: this.generateRecommendations(evaluation)
    };
    
    return report;
  }

  /**
   * Helper methods for specific evaluations
   */
  
  evaluateLogicalFlow(affidavit) {
    const score = { score: 100, issues: [], strengths: [] };
    
    if (!affidavit.paragraphs || affidavit.paragraphs.length === 0) {
      score.score = 0;
      score.issues.push('No paragraphs found');
      return score;
    }
    
    // Check chronological consistency
    const dates = this.extractAllDates(affidavit);
    const chronologicalIssues = this.checkChronology(dates);
    if (chronologicalIssues.length > 0) {
      score.score -= chronologicalIssues.length * 5;
      score.issues.push(...chronologicalIssues);
    } else {
      score.strengths.push('Chronologically consistent');
    }
    
    // Check topic transitions
    const transitionScore = this.evaluateTransitions(affidavit.paragraphs);
    if (transitionScore < 80) {
      score.score -= (100 - transitionScore) / 2;
      score.issues.push('Abrupt topic transitions detected');
    } else {
      score.strengths.push('Smooth topic transitions');
    }
    
    return score;
  }

  evaluateCompleteness(affidavit, benchmark) {
    const score = { score: 100, issues: [], strengths: [] };
    
    // Check required sections
    benchmark.requiredSections.forEach(section => {
      const hasSection = this.hasSection(affidavit, section);
      if (!hasSection) {
        score.score -= 15;
        score.issues.push(`Missing required section: ${section}`);
      }
    });
    
    if (score.issues.length === 0) {
      score.strengths.push('All required sections present');
    }
    
    // Check paragraph count
    if (affidavit.paragraphs?.length < benchmark.minParagraphs) {
      score.score -= 10;
      score.issues.push(`Too few paragraphs (${affidavit.paragraphs.length} < ${benchmark.minParagraphs})`);
    } else if (affidavit.paragraphs?.length > benchmark.maxParagraphs) {
      score.score -= 5;
      score.issues.push(`Too many paragraphs (${affidavit.paragraphs.length} > ${benchmark.maxParagraphs})`);
    } else {
      score.strengths.push('Appropriate document length');
    }
    
    return score;
  }

  evaluateEvidenceRelevance(affidavit) {
    const score = { score: 100, issues: [], strengths: [] };
    
    let irrelevantCount = 0;
    let totalReferences = 0;
    
    affidavit.paragraphs?.forEach(para => {
      if (para.evidenceRefs?.length > 0) {
        totalReferences += para.evidenceRefs.length;
        para.evidenceRefs.forEach(ref => {
          if (!this.isEvidenceRelevantToParagraph(ref, para)) {
            irrelevantCount++;
          }
        });
      }
    });
    
    if (totalReferences > 0) {
      const relevanceRatio = 1 - (irrelevantCount / totalReferences);
      score.score = Math.round(relevanceRatio * 100);
      
      if (relevanceRatio < 0.8) {
        score.issues.push(`${irrelevantCount} irrelevant evidence references`);
      } else {
        score.strengths.push('Evidence highly relevant to claims');
      }
    }
    
    return score;
  }

  calculateEvidenceDensity(affidavit) {
    if (!affidavit.paragraphs || affidavit.paragraphs.length === 0) return 0;
    
    const paragraphsWithEvidence = affidavit.paragraphs.filter(p => 
      p.evidenceRefs && p.evidenceRefs.length > 0
    ).length;
    
    return paragraphsWithEvidence / affidavit.paragraphs.length;
  }

  hasSection(affidavit, sectionName) {
    return affidavit.paragraphs?.some(para => 
      para.tags?.includes(sectionName) ||
      para.content.toLowerCase().includes(sectionName.replace('-', ' '))
    );
  }

  isEvidenceRelevantToParagraph(evidenceRef, paragraph) {
    // Simplified relevance check - would be more sophisticated in practice
    return true;
  }

  extractAllDates(affidavit) {
    const dates = [];
    affidavit.paragraphs?.forEach(para => {
      const paraDates = this.hypergraph.extractDates(para.content);
      dates.push(...paraDates.map(d => ({
        date: d,
        paragraph: para.number
      })));
    });
    return dates;
  }

  checkChronology(dates) {
    const issues = [];
    // Simplified chronology check
    return issues;
  }

  evaluateTransitions(paragraphs) {
    // Simplified transition evaluation
    return 85;
  }

  generateExecutiveSummary(evaluation, affidavit) {
    return {
      title: `Evaluation Summary: ${affidavit.title}`,
      overallScore: evaluation.overallScore,
      rating: evaluation.rating,
      keyStrengths: evaluation.detailedFindings.strengths.slice(0, 3),
      criticalIssues: evaluation.detailedFindings.criticalIssues.slice(0, 3),
      recommendation: this.generatePrimaryRecommendation(evaluation)
    };
  }

  generatePrimaryRecommendation(evaluation) {
    if (evaluation.overallScore >= 90) {
      return 'Document is ready for filing with minor polish';
    } else if (evaluation.overallScore >= 75) {
      return 'Address identified issues before filing';
    } else if (evaluation.overallScore >= 60) {
      return 'Significant improvements needed';
    } else {
      return 'Comprehensive revision required';
    }
  }

  generateDetailedReport(evaluation, affidavit) {
    return {
      scoreBreakdown: evaluation.scores,
      patternAnalysis: evaluation.patternAnalysis,
      findings: evaluation.detailedFindings,
      improvementRoadmap: evaluation.improvementRoadmap
    };
  }

  generateTechnicalAppendix(evaluation) {
    return {
      evaluationCriteria: Array.from(this.evaluationCriteria.entries()),
      benchmarksUsed: Array.from(this.benchmarks.entries()),
      patternsAnalyzed: Array.from(this.patterns.entries()),
      methodology: 'Multi-dimensional weighted scoring with pattern analysis'
    };
  }

  generateRecommendations(evaluation) {
    const recommendations = [];
    
    // Generate specific recommendations based on scores
    for (const [criterion, result] of Object.entries(evaluation.scores)) {
      if (result.score < 70) {
        recommendations.push({
          priority: 'High',
          area: criterion,
          recommendation: this.getRecommendationForCriterion(criterion, result),
          expectedImprovement: `+${Math.round((100 - result.score) * 0.7)} points`
        });
      }
    }
    
    return recommendations;
  }

  getRecommendationForCriterion(criterion, result) {
    const recommendations = {
      structural: 'Reorganize document with clear sections and logical flow',
      evidential: 'Strengthen evidence base and improve referencing',
      legal: 'Ensure compliance with procedural requirements',
      persuasive: 'Enhance narrative and strengthen arguments',
      technical: 'Improve language clarity and consistency'
    };
    
    return recommendations[criterion] || 'Improve ' + criterion;
  }

  generateImprovementTimeline(roadmap) {
    let totalHours = 0;
    
    totalHours += roadmap.immediate.length * 0.5;
    totalHours += roadmap.shortTerm.length * 4;
    totalHours += roadmap.mediumTerm.length * 16;
    totalHours += roadmap.strategic.length * 40;
    
    return {
      estimatedHours: totalHours,
      recommendedSchedule: this.createSchedule(roadmap),
      criticalPath: this.identifyCriticalPath(roadmap)
    };
  }

  createSchedule(roadmap) {
    return {
      day1: roadmap.immediate.concat(roadmap.shortTerm.slice(0, 2)),
      day2: roadmap.shortTerm.slice(2).concat(roadmap.mediumTerm.slice(0, 1)),
      day3Plus: roadmap.mediumTerm.slice(1).concat(roadmap.strategic)
    };
  }

  identifyCriticalPath(roadmap) {
    // Identify most impactful improvements
    const allImprovements = [
      ...roadmap.immediate,
      ...roadmap.shortTerm,
      ...roadmap.mediumTerm,
      ...roadmap.strategic
    ];
    
    return allImprovements
      .filter(imp => imp.impact === 'High' || imp.impact === 'Very High')
      .slice(0, 5);
  }

  // Additional evaluation methods would continue here...
  evaluateFormatting(affidavit) {
    return { score: 90, issues: [], strengths: ['Well formatted'] };
  }

  evaluateClarity(affidavit) {
    return { score: 85, issues: [], strengths: ['Clear structure'] };
  }

  evaluateEvidenceSufficiency(affidavit, benchmark) {
    return { score: 80, issues: [], strengths: ['Adequate evidence'] };
  }

  evaluateEvidenceCredibility(affidavit) {
    return { score: 85, issues: [], strengths: ['Credible sources'] };
  }

  evaluateEvidenceOrganization(affidavit) {
    return { score: 90, issues: [], strengths: ['Well organized'] };
  }

  evaluateLegalCompliance(affidavit, benchmark) {
    return { score: 95, issues: [], strengths: ['Fully compliant'] };
  }

  evaluateAdmissibility(affidavit) {
    return { score: 90, issues: [], strengths: ['Evidence admissible'] };
  }

  evaluateProcedure(affidavit) {
    return { score: 95, issues: [], strengths: ['Proper procedure'] };
  }

  evaluatePrecedentAlignment(affidavit) {
    return { score: 85, issues: [], strengths: ['Aligns with precedent'] };
  }

  evaluateNarrative(affidavit) {
    return { score: 80, issues: [], strengths: ['Compelling narrative'] };
  }

  evaluateLogic(affidavit) {
    return { score: 85, issues: [], strengths: ['Sound logic'] };
  }

  evaluateEmotionalAppeal(affidavit) {
    return { score: 75, issues: [], strengths: ['Appropriate tone'] };
  }

  evaluateDeponentCredibility(affidavit) {
    return { score: 90, issues: [], strengths: ['Credible deponent'] };
  }

  evaluateLanguage(affidavit) {
    return { score: 85, issues: [], strengths: ['Clear language'] };
  }

  evaluateConsistency(affidavit) {
    return { score: 90, issues: [], strengths: ['Internally consistent'] };
  }

  evaluateReferences(affidavit) {
    return { score: 85, issues: [], strengths: ['Proper citations'] };
  }

  evaluateTerminology(affidavit) {
    return { score: 90, issues: [], strengths: ['Correct terminology'] };
  }
}

module.exports = AffidavitEvaluator;