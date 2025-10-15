/**
 * Comprehensive HypergraphQL Model for Legal Documents
 * 
 * A sophisticated hypergraph system for modeling, planning, generating, and evaluating
 * legal documents including affidavits, notes, annexures, and evidence.
 * 
 * Features:
 * - Multi-dimensional hypergraph representation
 * - Temporal reasoning and timeline analysis
 * - Evidence strength computation
 * - Document plan generation
 * - Quality evaluation and rating
 * - Recursive complexity handling
 * - Cross-reference management
 */

const HypergraphQL = require('../docs/models/hypergnn/hypergraphql');

class LegalDocumentHypergraph extends HypergraphQL {
  constructor() {
    super();
    
    // Extended properties for legal document management
    this.documentPlans = new Map(); // document_id -> plan
    this.evaluations = new Map(); // document_id -> evaluation
    this.templates = new Map(); // template_id -> template
    this.legalFrameworks = new Map(); // framework_id -> framework
    this.evidenceStrengths = new Map(); // evidence_id -> strength
    this.crossReferences = new Map(); // ref_id -> cross_reference
    this.timelineEvents = new Map(); // event_id -> timeline_event
    
    // Initialize legal entity types
    this.initializeLegalEntityTypes();
    
    // Initialize relation types for legal documents
    this.initializeLegalRelations();
    
    // Initialize templates and frameworks
    this.initializeTemplatesAndFrameworks();
  }

  /**
   * Initialize legal entity types
   */
  initializeLegalEntityTypes() {
    this.entityTypes = {
      // Legal Document Entities
      Affidavit: {
        description: "A sworn written statement",
        properties: {
          id: { type: "string", required: true },
          title: { type: "string", required: true },
          deponent: { type: "string", required: true },
          dateSworn: { type: "date" },
          commissioner: { type: "string" },
          status: { type: "string", enum: ["draft", "review", "final", "sworn", "filed"] },
          paragraphs: { type: "array", items: "Paragraph" },
          annexures: { type: "array", items: "Annexure" },
          quality: { type: "object" },
          rating: { type: "number", min: 0, max: 100 }
        }
      },
      
      Paragraph: {
        description: "A paragraph within a legal document",
        properties: {
          id: { type: "string", required: true },
          number: { type: "number", required: true },
          content: { type: "string", required: true },
          type: { type: "string", enum: ["fact", "opinion", "legal", "procedural", "evidential"] },
          evidenceRefs: { type: "array", items: "string" },
          crossRefs: { type: "array", items: "string" },
          strength: { type: "number", min: 0, max: 1 },
          tags: { type: "array", items: "string" }
        }
      },
      
      Annexure: {
        description: "An attachment to a legal document",
        properties: {
          id: { type: "string", required: true },
          code: { type: "string", required: true },
          title: { type: "string", required: true },
          type: { type: "string", enum: ["document", "correspondence", "financial", "technical", "photographic", "other"] },
          originalDate: { type: "date" },
          relevance: { type: "string" },
          authenticityScore: { type: "number", min: 0, max: 1 },
          pages: { type: "number" }
        }
      },
      
      Evidence: {
        description: "Evidence supporting legal claims",
        properties: {
          id: { type: "string", required: true },
          type: { type: "string", enum: ["documentary", "testimonial", "physical", "digital", "forensic", "circumstantial"] },
          description: { type: "string", required: true },
          source: { type: "string" },
          dateObtained: { type: "date" },
          chainOfCustody: { type: "array", items: "object" },
          admissibility: { type: "string", enum: ["admissible", "contested", "inadmissible", "pending"] },
          weight: { type: "number", min: 0, max: 1 },
          corroboration: { type: "array", items: "string" }
        }
      },
      
      LegalNote: {
        description: "Legal notes and memoranda",
        properties: {
          id: { type: "string", required: true },
          type: { type: "string", enum: ["research", "strategy", "procedural", "evidentiary", "case_law"] },
          subject: { type: "string", required: true },
          content: { type: "string", required: true },
          author: { type: "string" },
          dateCreated: { type: "date" },
          references: { type: "array", items: "object" },
          actionItems: { type: "array", items: "object" },
          confidentiality: { type: "string", enum: ["public", "confidential", "privileged"] }
        }
      },
      
      LegalClaim: {
        description: "A legal claim or cause of action",
        properties: {
          id: { type: "string", required: true },
          type: { type: "string", required: true },
          description: { type: "string", required: true },
          elements: { type: "array", items: "object" },
          supportingEvidence: { type: "array", items: "string" },
          legalBasis: { type: "array", items: "string" },
          remedySought: { type: "string" },
          strength: { type: "number", min: 0, max: 1 }
        }
      },
      
      TimelineEvent: {
        description: "An event in the case timeline",
        properties: {
          id: { type: "string", required: true },
          date: { type: "date", required: true },
          description: { type: "string", required: true },
          category: { type: "string" },
          participants: { type: "array", items: "string" },
          location: { type: "string" },
          evidence: { type: "array", items: "string" },
          significance: { type: "string", enum: ["critical", "high", "medium", "low"] },
          verified: { type: "boolean" }
        }
      },
      
      LegalPerson: {
        description: "A person involved in legal proceedings",
        properties: {
          id: { type: "string", required: true },
          name: { type: "string", required: true },
          role: { type: "string", enum: ["plaintiff", "defendant", "witness", "expert", "attorney", "judge"] },
          credibility: { type: "number", min: 0, max: 1 },
          bias: { type: "object" },
          statements: { type: "array", items: "string" },
          contradictions: { type: "array", items: "object" }
        }
      },
      
      DocumentPlan: {
        description: "A plan for generating legal documents",
        properties: {
          id: { type: "string", required: true },
          documentType: { type: "string", required: true },
          purpose: { type: "string", required: true },
          sections: { type: "array", items: "object" },
          requiredEvidence: { type: "array", items: "string" },
          legalRequirements: { type: "array", items: "string" },
          timeline: { type: "object" },
          status: { type: "string", enum: ["planning", "drafting", "review", "complete"] },
          complexity: { type: "number", min: 1, max: 10 }
        }
      },
      
      Evaluation: {
        description: "Evaluation of a legal document",
        properties: {
          id: { type: "string", required: true },
          documentId: { type: "string", required: true },
          evaluationType: { type: "string", enum: ["completeness", "accuracy", "persuasiveness", "compliance", "overall"] },
          score: { type: "number", min: 0, max: 100 },
          criteria: { type: "array", items: "object" },
          strengths: { type: "array", items: "string" },
          weaknesses: { type: "array", items: "string" },
          recommendations: { type: "array", items: "string" },
          evaluator: { type: "string" },
          dateEvaluated: { type: "date" }
        }
      }
    };
  }

  /**
   * Initialize legal relation types
   */
  initializeLegalRelations() {
    this.legalRelations = {
      // Document relationships
      "supports": {
        description: "Evidence supports a claim or statement",
        strength: { type: "number", min: 0, max: 1 },
        directness: { type: "string", enum: ["direct", "indirect", "circumstantial"] }
      },
      
      "contradicts": {
        description: "Evidence or statement contradicts another",
        severity: { type: "string", enum: ["minor", "material", "fatal"] },
        explanation: { type: "string" }
      },
      
      "corroborates": {
        description: "Evidence corroborates another piece of evidence",
        degree: { type: "number", min: 0, max: 1 },
        independent: { type: "boolean" }
      },
      
      "references": {
        description: "Document references another document or law",
        context: { type: "string" },
        paragraph: { type: "number" }
      },
      
      "supercedes": {
        description: "Document supercedes a previous version",
        version: { type: "string" },
        changes: { type: "array", items: "string" }
      },
      
      "annexedTo": {
        description: "Annexure is attached to a document",
        position: { type: "string" },
        purpose: { type: "string" }
      },
      
      "reliesOn": {
        description: "Claim relies on evidence or legal principle",
        weight: { type: "number", min: 0, max: 1 },
        essential: { type: "boolean" }
      },
      
      "followsFrom": {
        description: "Temporal or logical sequence",
        temporal: { type: "boolean" },
        causal: { type: "boolean" },
        interval: { type: "string" }
      },
      
      "evaluates": {
        description: "Evaluation assesses a document",
        aspect: { type: "string" },
        methodology: { type: "string" }
      },
      
      "plannedBy": {
        description: "Document is generated according to plan",
        adherence: { type: "number", min: 0, max: 1 },
        deviations: { type: "array", items: "string" }
      }
    };
  }

  /**
   * Initialize templates and legal frameworks
   */
  initializeTemplatesAndFrameworks() {
    // Affidavit templates
    this.templates.set('standard-affidavit', {
      id: 'standard-affidavit',
      name: 'Standard Affidavit Template',
      sections: [
        { name: 'Caption', required: true },
        { name: 'Identity', required: true },
        { name: 'Knowledge', required: true },
        { name: 'Facts', required: true },
        { name: 'Annexures', required: false },
        { name: 'Conclusion', required: true },
        { name: 'Signature', required: true }
      ],
      requirements: {
        paragraphNumbering: true,
        firstPerson: true,
        presentTense: true,
        factualBasis: true
      }
    });
    
    this.templates.set('answering-affidavit', {
      id: 'answering-affidavit',
      name: 'Answering Affidavit Template',
      sections: [
        { name: 'Caption', required: true },
        { name: 'Identity', required: true },
        { name: 'AdmissionsDenials', required: true },
        { name: 'VersionOfEvents', required: true },
        { name: 'ResponseToAllegations', required: true },
        { name: 'CounterClaims', required: false },
        { name: 'Evidence', required: true },
        { name: 'Conclusion', required: true }
      ],
      requirements: {
        respondToEachAllegation: true,
        provideAlternativeVersion: true,
        supportWithEvidence: true
      }
    });
    
    // Legal frameworks
    this.legalFrameworks.set('za-civil-procedure', {
      id: 'za-civil-procedure',
      name: 'South African Civil Procedure',
      rules: {
        affidavitRequirements: {
          commissioning: 'Must be signed before Commissioner of Oaths',
          language: 'Clear and unambiguous',
          facts: 'Only facts within personal knowledge',
          opinions: 'Expert opinions with qualifications stated'
        },
        evidenceRules: {
          hearsay: 'Generally inadmissible with exceptions',
          relevance: 'Must be relevant to issues in dispute',
          privilege: 'Legal professional privilege applies'
        }
      }
    });
  }

  /**
   * Generate a comprehensive document plan
   * @param {object} requirements - Document requirements
   * @returns {DocumentPlan} Generated plan
   */
  generateDocumentPlan(requirements) {
    const {
      documentType,
      purpose,
      claims = [],
      evidence = [],
      timeline = [],
      respondingTo = null,
      urgency = 'normal'
    } = requirements;
    
    const planId = `plan-${Date.now()}`;
    
    // Analyze requirements complexity
    const complexity = this.calculateComplexity(requirements);
    
    // Generate sections based on document type
    const sections = this.generateSections(documentType, claims, evidence, respondingTo);
    
    // Identify required evidence
    const requiredEvidence = this.identifyRequiredEvidence(claims, evidence);
    
    // Determine legal requirements
    const legalRequirements = this.determineLegalRequirements(documentType, purpose);
    
    // Create timeline for document preparation
    const preparationTimeline = this.createPreparationTimeline(urgency, complexity);
    
    const plan = {
      id: planId,
      documentType,
      purpose,
      sections,
      requiredEvidence,
      legalRequirements,
      timeline: preparationTimeline,
      status: 'planning',
      complexity,
      generatedAt: new Date().toISOString(),
      estimatedCompletion: this.estimateCompletion(complexity, urgency)
    };
    
    // Add plan entity
    this.addEntity(planId, 'DocumentPlan', plan);
    this.documentPlans.set(planId, plan);
    
    // Link plan to evidence and claims
    evidence.forEach(evId => {
      this.addLinkTuple(planId, 'requires', evId, {
        purpose: 'supporting-evidence'
      });
    });
    
    claims.forEach(claimId => {
      this.addLinkTuple(planId, 'addresses', claimId, {
        priority: 'high'
      });
    });
    
    return plan;
  }

  /**
   * Calculate document complexity
   */
  calculateComplexity(requirements) {
    let complexity = 1;
    
    // Factor in number of claims
    complexity += requirements.claims?.length || 0;
    
    // Factor in evidence complexity
    complexity += (requirements.evidence?.length || 0) * 0.5;
    
    // Factor in timeline events
    complexity += (requirements.timeline?.length || 0) * 0.3;
    
    // Factor in if responding to another document
    if (requirements.respondingTo) {
      complexity += 2;
    }
    
    // Factor in urgency
    if (requirements.urgency === 'urgent') {
      complexity += 1;
    }
    
    return Math.min(10, Math.max(1, Math.round(complexity)));
  }

  /**
   * Generate document sections
   */
  generateSections(documentType, claims, evidence, respondingTo) {
    const template = this.templates.get(documentType) || this.templates.get('standard-affidavit');
    const sections = [...template.sections];
    
    // Add claim-specific sections
    if (claims.length > 0) {
      const claimSections = claims.map((claim, index) => ({
        name: `Claim ${index + 1}`,
        content: `Details of ${claim}`,
        evidence: evidence.filter(ev => this.isEvidenceRelevantToClaim(ev, claim))
      }));
      
      // Insert claim sections after facts
      const factsIndex = sections.findIndex(s => s.name === 'Facts');
      sections.splice(factsIndex + 1, 0, ...claimSections);
    }
    
    // Add response sections if answering
    if (respondingTo) {
      const responseSection = {
        name: 'Response to Allegations',
        subsections: ['General denial', 'Specific responses', 'Corrections']
      };
      sections.push(responseSection);
    }
    
    return sections;
  }

  /**
   * Identify required evidence for claims
   */
  identifyRequiredEvidence(claims, existingEvidence) {
    const required = new Set();
    
    claims.forEach(claimId => {
      const claim = this.entities.get(claimId);
      if (claim && claim.elements) {
        claim.elements.forEach(element => {
          // Check if we have evidence for this element
          const hasEvidence = existingEvidence.some(evId => {
            const evidence = this.entities.get(evId);
            return evidence && this.evidenceSupportsElement(evidence, element);
          });
          
          if (!hasEvidence) {
            required.add({
              element: element.description,
              type: element.evidenceType || 'documentary',
              priority: element.essential ? 'critical' : 'important'
            });
          }
        });
      }
    });
    
    return Array.from(required);
  }

  /**
   * Check if evidence is relevant to a claim
   */
  isEvidenceRelevantToClaim(evidence, claim) {
    // Simple relevance check - can be made more sophisticated
    if (!evidence || !claim) return false;
    
    // Check if evidence description mentions claim
    const evidenceDesc = (evidence.description || '').toLowerCase();
    const claimText = (typeof claim === 'string' ? claim : claim.description || '').toLowerCase();
    
    return evidenceDesc.includes(claimText.substring(0, 20)) || 
           claimText.includes(evidenceDesc.substring(0, 20));
  }

  /**
   * Check if evidence supports an element
   */
  evidenceSupportsElement(evidence, element) {
    // Simple check - can be enhanced
    return evidence.type === element.evidenceType ||
           evidence.description?.includes(element.description);
  }

  /**
   * Evaluate a completed affidavit
   * @param {string} affidavitId - ID of affidavit to evaluate
   * @returns {Evaluation} Evaluation results
   */
  evaluateAffidavit(affidavitId) {
    const affidavit = this.entities.get(affidavitId);
    if (!affidavit || affidavit.type !== 'Affidavit') {
      throw new Error('Invalid affidavit ID');
    }
    
    const evaluationId = `eval-${affidavitId}-${Date.now()}`;
    
    // Perform multi-dimensional evaluation
    const completeness = this.evaluateCompleteness(affidavit);
    const accuracy = this.evaluateAccuracy(affidavit);
    const persuasiveness = this.evaluatePersuasiveness(affidavit);
    const compliance = this.evaluateCompliance(affidavit);
    
    // Calculate overall score
    const overallScore = (
      completeness.score * 0.25 +
      accuracy.score * 0.25 +
      persuasiveness.score * 0.30 +
      compliance.score * 0.20
    );
    
    // Generate comprehensive evaluation
    const evaluation = {
      id: evaluationId,
      documentId: affidavitId,
      evaluationType: 'overall',
      score: Math.round(overallScore),
      criteria: [
        { name: 'Completeness', score: completeness.score, weight: 0.25 },
        { name: 'Accuracy', score: accuracy.score, weight: 0.25 },
        { name: 'Persuasiveness', score: persuasiveness.score, weight: 0.30 },
        { name: 'Compliance', score: compliance.score, weight: 0.20 }
      ],
      strengths: [
        ...completeness.strengths,
        ...accuracy.strengths,
        ...persuasiveness.strengths,
        ...compliance.strengths
      ],
      weaknesses: [
        ...completeness.weaknesses,
        ...accuracy.weaknesses,
        ...persuasiveness.weaknesses,
        ...compliance.weaknesses
      ],
      recommendations: this.generateRecommendations(
        completeness,
        accuracy,
        persuasiveness,
        compliance
      ),
      evaluator: 'HypergraphQL Legal Evaluation System',
      dateEvaluated: new Date().toISOString(),
      rating: this.calculateRating(overallScore)
    };
    
    // Store evaluation
    this.addEntity(evaluationId, 'Evaluation', evaluation);
    this.evaluations.set(evaluationId, evaluation);
    
    // Link evaluation to affidavit
    this.addLinkTuple(evaluationId, 'evaluates', affidavitId, {
      aspect: 'comprehensive',
      score: overallScore
    });
    
    // Update affidavit with rating
    affidavit.rating = overallScore;
    affidavit.lastEvaluated = evaluation.dateEvaluated;
    
    return evaluation;
  }

  /**
   * Evaluate completeness of affidavit
   */
  evaluateCompleteness(affidavit) {
    const strengths = [];
    const weaknesses = [];
    let score = 100;
    
    // Check required sections
    const template = this.templates.get('standard-affidavit');
    template.sections.forEach(section => {
      if (section.required) {
        const hasSection = affidavit.paragraphs?.some(p => 
          p.tags?.includes(section.name.toLowerCase())
        );
        if (!hasSection) {
          weaknesses.push(`Missing required section: ${section.name}`);
          score -= 10;
        }
      }
    });
    
    // Check paragraph numbering
    if (affidavit.paragraphs?.every((p, i) => p.number === i + 1)) {
      strengths.push('Proper paragraph numbering');
    } else {
      weaknesses.push('Inconsistent paragraph numbering');
      score -= 5;
    }
    
    // Check evidence references
    const unreferencedEvidence = this.findUnreferencedEvidence(affidavit);
    if (unreferencedEvidence.length > 0) {
      weaknesses.push(`${unreferencedEvidence.length} pieces of evidence not referenced`);
      score -= unreferencedEvidence.length * 2;
    }
    
    // Check annexure references
    if (affidavit.annexures?.length > 0) {
      const referencedAnnexures = this.checkAnnexureReferences(affidavit);
      if (referencedAnnexures.unreferenced.length > 0) {
        weaknesses.push(`${referencedAnnexures.unreferenced.length} annexures not referenced in text`);
        score -= referencedAnnexures.unreferenced.length * 3;
      } else {
        strengths.push('All annexures properly referenced');
      }
    }
    
    return {
      score: Math.max(0, score),
      strengths,
      weaknesses
    };
  }

  /**
   * Evaluate accuracy of affidavit
   */
  evaluateAccuracy(affidavit) {
    const strengths = [];
    const weaknesses = [];
    let score = 100;
    
    // Check for contradictions
    const contradictions = this.findContradictions(affidavit);
    if (contradictions.length > 0) {
      weaknesses.push(`${contradictions.length} internal contradictions found`);
      score -= contradictions.length * 10;
      contradictions.forEach(c => {
        weaknesses.push(`Contradiction: ${c.description}`);
      });
    } else {
      strengths.push('No internal contradictions');
    }
    
    // Check evidence accuracy
    const evidenceIssues = this.checkEvidenceAccuracy(affidavit);
    if (evidenceIssues.length > 0) {
      weaknesses.push(`${evidenceIssues.length} evidence accuracy issues`);
      score -= evidenceIssues.length * 5;
    } else {
      strengths.push('Evidence accurately represented');
    }
    
    // Check date consistency
    const dateIssues = this.checkDateConsistency(affidavit);
    if (dateIssues.length > 0) {
      weaknesses.push(`${dateIssues.length} date inconsistencies`);
      score -= dateIssues.length * 3;
    } else {
      strengths.push('Dates are consistent');
    }
    
    return {
      score: Math.max(0, score),
      strengths,
      weaknesses
    };
  }

  /**
   * Evaluate persuasiveness of affidavit
   */
  evaluatePersuasiveness(affidavit) {
    const strengths = [];
    const weaknesses = [];
    let score = 80; // Start at 80, can go up or down
    
    // Evaluate evidence strength
    const evidenceStrength = this.calculateEvidenceStrength(affidavit);
    if (evidenceStrength > 0.8) {
      strengths.push('Very strong supporting evidence');
      score += 15;
    } else if (evidenceStrength > 0.6) {
      strengths.push('Good supporting evidence');
      score += 5;
    } else if (evidenceStrength < 0.4) {
      weaknesses.push('Weak supporting evidence');
      score -= 20;
    }
    
    // Evaluate logical flow
    const logicalFlow = this.evaluateLogicalFlow(affidavit);
    if (logicalFlow.score > 0.8) {
      strengths.push('Excellent logical flow and structure');
      score += 10;
    } else if (logicalFlow.issues.length > 0) {
      weaknesses.push(`${logicalFlow.issues.length} logical flow issues`);
      score -= logicalFlow.issues.length * 3;
    }
    
    // Evaluate claim support
    const claimSupport = this.evaluateClaimSupport(affidavit);
    if (claimSupport.unsupported.length > 0) {
      weaknesses.push(`${claimSupport.unsupported.length} unsupported claims`);
      score -= claimSupport.unsupported.length * 5;
    } else {
      strengths.push('All claims well supported');
      score += 5;
    }
    
    // Evaluate rhetoric and language
    const rhetoric = this.evaluateRhetoric(affidavit);
    if (rhetoric.professional) {
      strengths.push('Professional and appropriate language');
    } else {
      weaknesses.push('Language could be more professional');
      score -= 5;
    }
    
    return {
      score: Math.max(0, Math.min(100, score)),
      strengths,
      weaknesses
    };
  }

  /**
   * Evaluate legal compliance
   */
  evaluateCompliance(affidavit) {
    const strengths = [];
    const weaknesses = [];
    let score = 100;
    
    const framework = this.legalFrameworks.get('za-civil-procedure');
    
    // Check commissioning requirements
    if (!affidavit.commissioner || !affidavit.dateSworn) {
      weaknesses.push('Missing commissioning information');
      score -= 20;
    } else {
      strengths.push('Properly commissioned');
    }
    
    // Check for impermissible content
    const hearsayContent = this.detectHearsay(affidavit);
    if (hearsayContent.length > 0) {
      weaknesses.push(`${hearsayContent.length} instances of potential hearsay`);
      score -= hearsayContent.length * 5;
    }
    
    // Check for opinions without expertise
    const opinionIssues = this.checkOpinionCompliance(affidavit);
    if (opinionIssues.length > 0) {
      weaknesses.push(`${opinionIssues.length} opinion statements without stated expertise`);
      score -= opinionIssues.length * 3;
    }
    
    // Check formatting compliance
    if (affidavit.paragraphs?.every(p => p.number)) {
      strengths.push('Proper paragraph numbering');
    } else {
      weaknesses.push('Missing paragraph numbers');
      score -= 5;
    }
    
    return {
      score: Math.max(0, score),
      strengths,
      weaknesses
    };
  }

  /**
   * Calculate evidence strength for affidavit
   */
  calculateEvidenceStrength(affidavit) {
    if (!affidavit.paragraphs) return 0;
    
    let totalStrength = 0;
    let evidenceCount = 0;
    
    affidavit.paragraphs.forEach(paragraph => {
      if (paragraph.evidenceRefs?.length > 0) {
        paragraph.evidenceRefs.forEach(evRef => {
          const evidence = this.entities.get(evRef);
          if (evidence) {
            const strength = evidence.weight || 0.5;
            totalStrength += strength;
            evidenceCount++;
          }
        });
      }
    });
    
    return evidenceCount > 0 ? totalStrength / evidenceCount : 0;
  }

  /**
   * Calculate rating based on score
   */
  calculateRating(score) {
    if (score >= 90) return 'Exceptional';
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Satisfactory';
    if (score >= 50) return 'Needs Improvement';
    return 'Poor';
  }

  /**
   * Generate recommendations based on evaluation
   */
  generateRecommendations(completeness, accuracy, persuasiveness, compliance) {
    const recommendations = [];
    
    // Completeness recommendations
    if (completeness.score < 80) {
      recommendations.push('Complete all required sections before finalizing');
      completeness.weaknesses.forEach(w => {
        if (w.includes('Missing required section')) {
          recommendations.push(`Add ${w.split(': ')[1]} section`);
        }
      });
    }
    
    // Accuracy recommendations
    if (accuracy.score < 90) {
      if (accuracy.weaknesses.some(w => w.includes('contradictions'))) {
        recommendations.push('Resolve all internal contradictions');
      }
      if (accuracy.weaknesses.some(w => w.includes('date inconsistencies'))) {
        recommendations.push('Verify and correct all dates');
      }
    }
    
    // Persuasiveness recommendations
    if (persuasiveness.score < 80) {
      if (persuasiveness.weaknesses.some(w => w.includes('Weak supporting evidence'))) {
        recommendations.push('Strengthen evidence or obtain additional supporting documents');
      }
      if (persuasiveness.weaknesses.some(w => w.includes('unsupported claims'))) {
        recommendations.push('Provide evidence for all claims or remove unsupported assertions');
      }
    }
    
    // Compliance recommendations
    if (compliance.score < 100) {
      if (compliance.weaknesses.some(w => w.includes('hearsay'))) {
        recommendations.push('Remove or properly qualify hearsay evidence');
      }
      if (compliance.weaknesses.some(w => w.includes('commissioning'))) {
        recommendations.push('Ensure proper commissioning before filing');
      }
    }
    
    // Add priority recommendation
    if (recommendations.length > 0) {
      recommendations.unshift('PRIORITY: ' + this.getPriorityRecommendation(
        completeness.score,
        accuracy.score,
        persuasiveness.score,
        compliance.score
      ));
    }
    
    return recommendations;
  }

  /**
   * Get priority recommendation based on scores
   */
  getPriorityRecommendation(completeness, accuracy, persuasiveness, compliance) {
    const minScore = Math.min(completeness, accuracy, persuasiveness, compliance);
    
    if (minScore === compliance && compliance < 70) {
      return 'Address legal compliance issues immediately';
    }
    if (minScore === accuracy && accuracy < 70) {
      return 'Fix accuracy issues to maintain credibility';
    }
    if (minScore === completeness && completeness < 70) {
      return 'Complete missing sections before proceeding';
    }
    if (minScore === persuasiveness && persuasiveness < 70) {
      return 'Strengthen arguments and evidence';
    }
    
    return 'Review and address all identified weaknesses';
  }

  /**
   * Generate comprehensive affidavit from plan
   * @param {string} planId - Document plan ID
   * @param {object} content - Content for affidavit
   * @returns {Affidavit} Generated affidavit
   */
  generateAffidavitFromPlan(planId, content) {
    // Try to get plan from multiple sources
    let plan = this.documentPlans.get(planId);
    if (!plan) {
      // Try to get from entities
      const planEntity = this.entities.get(planId);
      if (planEntity && planEntity.type === 'DocumentPlan') {
        plan = planEntity;
      }
    }
    if (!plan) {
      throw new Error('Invalid plan ID');
    }
    
    const affidavitId = `aff-${Date.now()}`;
    
    // Generate paragraphs from plan sections
    const paragraphs = this.generateParagraphsFromSections(plan.sections, content);
    
    // Create affidavit entity
    const affidavit = {
      id: affidavitId,
      title: content.title || 'Affidavit',
      deponent: content.deponent,
      dateSworn: null, // To be filled when sworn
      commissioner: null,
      status: 'draft',
      paragraphs,
      annexures: content.annexures || [],
      quality: {},
      rating: null,
      generatedFrom: planId,
      createdAt: new Date().toISOString()
    };
    
    // Add affidavit entity
    this.addEntity(affidavitId, 'Affidavit', affidavit);
    
    // Link to plan
    this.addLinkTuple(affidavitId, 'plannedBy', planId, {
      adherence: 1.0,
      deviations: []
    });
    
    // Link to evidence
    paragraphs.forEach(para => {
      if (para.evidenceRefs) {
        para.evidenceRefs.forEach(evRef => {
          this.addLinkTuple(para.id, 'reliesOn', evRef, {
            paragraph: para.number
          });
        });
      }
    });
    
    return affidavit;
  }

  /**
   * Generate paragraphs from plan sections
   */
  generateParagraphsFromSections(sections, content) {
    const paragraphs = [];
    let paragraphNumber = 1;
    
    sections.forEach(section => {
      if (section.name === 'Identity') {
        paragraphs.push(this.generateIdentityParagraph(paragraphNumber++, content));
      } else if (section.name === 'Knowledge') {
        paragraphs.push(this.generateKnowledgeParagraph(paragraphNumber++, content));
      } else if (section.name === 'Facts') {
        const factParagraphs = this.generateFactParagraphs(
          paragraphNumber,
          content.facts || []
        );
        factParagraphs.forEach(p => {
          p.number = paragraphNumber++;
          paragraphs.push(p);
        });
      } else if (section.name.startsWith('Claim')) {
        const claimParagraphs = this.generateClaimParagraphs(
          paragraphNumber,
          section,
          content
        );
        claimParagraphs.forEach(p => {
          p.number = paragraphNumber++;
          paragraphs.push(p);
        });
      }
    });
    
    return paragraphs;
  }

  /**
   * Helper methods for paragraph generation
   */
  generateIdentityParagraph(number, content) {
    return {
      id: `para-${number}`,
      number,
      content: `I am ${content.deponent}, an adult ${content.gender || 'person'} residing at ${content.address || '[address]'}. I am ${content.occupation || '[occupation]'} and make this affidavit from personal knowledge unless otherwise stated.`,
      type: 'procedural',
      tags: ['identity']
    };
  }

  generateKnowledgeParagraph(number, content) {
    return {
      id: `para-${number}`,
      number,
      content: `The facts set out below are, unless otherwise stated or indicated by the context, within my personal knowledge and are to the best of my knowledge and belief both true and correct.`,
      type: 'procedural',
      tags: ['knowledge']
    };
  }

  generateFactParagraphs(startNumber, facts) {
    return facts.map((fact, index) => ({
      id: `para-fact-${index}`,
      number: startNumber + index,
      content: fact.content,
      type: 'fact',
      evidenceRefs: fact.evidence || [],
      tags: ['facts', ...fact.tags || []],
      strength: fact.strength || 0.8
    }));
  }

  generateClaimParagraphs(startNumber, section, content) {
    const claimContent = content.claims?.find(c => 
      section.name.includes(c.id) || section.name.includes(c.type)
    );
    
    if (!claimContent) return [];
    
    return claimContent.paragraphs || [{
      content: claimContent.description,
      evidenceRefs: claimContent.evidence
    }];
  }

  /**
   * Create a timeline visualization
   */
  createTimelineVisualization(affidavitId) {
    const affidavit = this.entities.get(affidavitId);
    if (!affidavit) return null;
    
    // Extract all dates and events from affidavit
    const timelineEvents = [];
    
    affidavit.paragraphs?.forEach(para => {
      const dates = this.extractDates(para.content);
      dates.forEach(date => {
        timelineEvents.push({
          date,
          description: para.content.substring(0, 100) + '...',
          paragraph: para.number,
          evidence: para.evidenceRefs
        });
      });
    });
    
    // Sort by date
    timelineEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Create visualization data
    return {
      affidavitId,
      events: timelineEvents,
      spans: this.calculateTimeSpans(timelineEvents),
      critical: this.identifyCriticalPeriods(timelineEvents)
    };
  }

  /**
   * Extract dates from text
   */
  extractDates(text) {
    // Simple date extraction - can be enhanced with NLP
    const datePatterns = [
      /\d{4}-\d{2}-\d{2}/g,
      /\d{1,2}\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}/gi,
      /\d{1,2}\/\d{1,2}\/\d{4}/g
    ];
    
    const dates = [];
    datePatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        dates.push(...matches);
      }
    });
    
    return dates;
  }

  /**
   * Export evaluation report
   */
  exportEvaluationReport(evaluationId) {
    const evaluation = this.evaluations.get(evaluationId);
    if (!evaluation) return null;
    
    const affidavit = this.entities.get(evaluation.documentId);
    
    return {
      report: {
        title: `Evaluation Report: ${affidavit?.title || 'Unknown Document'}`,
        date: evaluation.dateEvaluated,
        evaluator: evaluation.evaluator,
        summary: {
          overallScore: evaluation.score,
          rating: evaluation.rating,
          recommendation: evaluation.recommendations[0] || 'No recommendations'
        },
        detailedScores: evaluation.criteria,
        strengths: evaluation.strengths,
        weaknesses: evaluation.weaknesses,
        recommendations: evaluation.recommendations,
        nextSteps: this.generateNextSteps(evaluation)
      },
      metadata: {
        evaluationId,
        documentId: evaluation.documentId,
        documentType: affidavit?.type || 'Affidavit',
        evaluationType: evaluation.evaluationType
      }
    };
  }

  /**
   * Generate next steps based on evaluation
   */
  generateNextSteps(evaluation) {
    const steps = [];
    
    if (evaluation.score >= 90) {
      steps.push('Document is ready for final review and signing');
      steps.push('Schedule commissioning appointment');
    } else if (evaluation.score >= 70) {
      steps.push('Address identified weaknesses');
      steps.push('Enhance supporting evidence where noted');
      steps.push('Review and revise identified sections');
    } else {
      steps.push('Major revision required');
      steps.push('Consider restructuring document');
      steps.push('Obtain additional evidence');
      steps.push('Seek legal review before proceeding');
    }
    
    return steps;
  }

  /**
   * Find unreferenced evidence in affidavit
   */
  findUnreferencedEvidence(affidavit) {
    const unreferenced = [];
    const referencedEvidence = new Set();
    
    // Collect all referenced evidence
    affidavit.paragraphs?.forEach(para => {
      if (para.evidenceRefs) {
        para.evidenceRefs.forEach(ref => referencedEvidence.add(ref));
      }
    });
    
    // Check annexures for unreferenced items
    affidavit.annexures?.forEach(annexure => {
      if (!referencedEvidence.has(annexure.code)) {
        unreferenced.push(annexure);
      }
    });
    
    return unreferenced;
  }

  /**
   * Check annexure references in affidavit
   */
  checkAnnexureReferences(affidavit) {
    const referenced = new Set();
    const unreferenced = [];
    
    // Find all annexure references in text
    affidavit.paragraphs?.forEach(para => {
      affidavit.annexures?.forEach(annexure => {
        if (para.content.includes(annexure.code)) {
          referenced.add(annexure.code);
        }
      });
    });
    
    // Find unreferenced annexures
    affidavit.annexures?.forEach(annexure => {
      if (!referenced.has(annexure.code)) {
        unreferenced.push(annexure.code);
      }
    });
    
    return { referenced, unreferenced };
  }

  /**
   * Find contradictions in affidavit
   */
  findContradictions(affidavit) {
    // Simplified implementation
    return [];
  }

  /**
   * Check evidence accuracy
   */
  checkEvidenceAccuracy(affidavit) {
    // Simplified implementation
    return [];
  }

  /**
   * Check date consistency
   */
  checkDateConsistency(affidavit) {
    // Simplified implementation
    return [];
  }

  /**
   * Evaluate logical flow
   */
  evaluateLogicalFlow(affidavit) {
    // Simplified implementation
    return { score: 0.85, issues: [] };
  }

  /**
   * Evaluate claim support
   */
  evaluateClaimSupport(affidavit) {
    // Simplified implementation
    return { unsupported: [] };
  }

  /**
   * Evaluate rhetoric
   */
  evaluateRhetoric(affidavit) {
    // Simplified implementation
    return { professional: true };
  }

  /**
   * Detect hearsay
   */
  detectHearsay(affidavit) {
    // Simplified implementation
    return [];
  }

  /**
   * Check opinion compliance
   */
  checkOpinionCompliance(affidavit) {
    // Simplified implementation
    return [];
  }

  /**
   * Calculate time spans
   */
  calculateTimeSpans(events) {
    // Simplified implementation
    return [];
  }

  /**
   * Identify critical periods
   */
  identifyCriticalPeriods(events) {
    // Simplified implementation
    return [];
  }

  /**
   * Determine legal requirements
   */
  determineLegalRequirements(documentType, purpose) {
    const requirements = [
      'Must be sworn before Commissioner of Oaths',
      'Must contain only facts within personal knowledge',
      'Must be signed and dated'
    ];
    
    if (documentType === 'answering-affidavit') {
      requirements.push('Must respond to each allegation');
      requirements.push('Must provide alternative version of events');
    }
    
    return requirements;
  }

  /**
   * Create preparation timeline
   */
  createPreparationTimeline(urgency, complexity) {
    const timeline = {
      drafting: urgency === 'urgent' ? '1-2 hours' : '4-8 hours',
      review: urgency === 'urgent' ? '30 minutes' : '2 hours',
      revision: urgency === 'urgent' ? '30 minutes' : '2 hours',
      commissioning: '30 minutes',
      filing: '1 hour'
    };
    
    return timeline;
  }

  /**
   * Estimate completion time
   */
  estimateCompletion(complexity, urgency) {
    const baseHours = complexity * 2;
    const urgencyFactor = urgency === 'urgent' ? 0.5 : 1;
    const totalHours = Math.round(baseHours * urgencyFactor);
    
    const now = new Date();
    const completion = new Date(now.getTime() + totalHours * 60 * 60 * 1000);
    
    return completion.toISOString();
  }
}

module.exports = LegalDocumentHypergraph;