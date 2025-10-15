/**
 * Comprehensive HypergraphQL Legal Document System
 * 
 * Main entry point for the legal document generation, planning,
 * and evaluation system.
 * 
 * This system provides:
 * - Intelligent affidavit planning
 * - Document generation from plans
 * - Multi-dimensional evaluation
 * - Rating and improvement recommendations
 * - Evidence management
 * - Timeline analysis
 */

const LegalDocumentHypergraph = require('./legal-document-hypergraph');
const AffidavitPlanGenerator = require('./affidavit-plan-generator');
const AffidavitEvaluator = require('./affidavit-evaluator');
const fs = require('fs').promises;
const path = require('path');

class LegalDocumentSystem {
  constructor() {
    this.hypergraph = new LegalDocumentHypergraph();
    this.planGenerator = new AffidavitPlanGenerator();
    this.evaluator = new AffidavitEvaluator();
    
    // Load case data if available
    this.loadCaseData();
  }

  /**
   * Load existing case data
   */
  async loadCaseData() {
    try {
      // Load evidence from existing directories
      const evidencePath = path.join(__dirname, '../evidence');
      const affidavitPath = path.join(__dirname, '../affidavit_work');
      const jaxResponsePath = path.join(__dirname, '../jax-response');
      
      // Load evidence index
      const evidenceIndex = await this.loadJSON(
        path.join(jaxResponsePath, 'FORENSIC_EVIDENCE_INDEX.json')
      );
      
      if (evidenceIndex) {
        this.processEvidenceIndex(evidenceIndex);
      }
      
      console.log('Case data loaded successfully');
    } catch (error) {
      console.log('No existing case data found, starting fresh');
    }
  }

  /**
   * Load JSON file
   */
  async loadJSON(filePath) {
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return null;
    }
  }

  /**
   * Process evidence index into hypergraph
   */
  processEvidenceIndex(evidenceIndex) {
    // Add evidence entities
    if (evidenceIndex.evidence) {
      Object.entries(evidenceIndex.evidence).forEach(([category, items]) => {
        items.forEach(item => {
          const evidenceId = `evidence-${item.id || Date.now()}`;
          this.hypergraph.addEntity(evidenceId, 'Evidence', {
            type: category,
            description: item.description || item.title,
            source: item.source,
            date: item.date,
            significance: item.priority || 'medium',
            weight: this.calculateEvidenceWeight(item)
          });
        });
      });
    }
    
    // Add timeline events
    if (evidenceIndex.timeline) {
      evidenceIndex.timeline.forEach(event => {
        const eventId = `event-${event.date}-${Date.now()}`;
        this.hypergraph.addEntity(eventId, 'TimelineEvent', {
          date: event.date,
          description: event.description,
          category: event.category,
          significance: event.significance || 'medium'
        });
      });
    }
  }

  /**
   * Calculate evidence weight based on characteristics
   */
  calculateEvidenceWeight(evidence) {
    let weight = 0.5; // Base weight
    
    if (evidence.priority === 'Critical') weight += 0.3;
    else if (evidence.priority === 'High') weight += 0.2;
    
    if (evidence.type === 'documentary') weight += 0.1;
    if (evidence.verified) weight += 0.1;
    
    return Math.min(1.0, weight);
  }

  /**
   * Generate comprehensive affidavit plan
   */
  async generateAffidavitPlan(requirements) {
    console.log('\n=== Generating Affidavit Plan ===\n');
    
    // Validate requirements
    const validatedReqs = this.validateRequirements(requirements);
    
    // Generate plan using plan generator
    const plan = this.planGenerator.generateComprehensivePlan(validatedReqs);
    
    // Store plan in hypergraph
    const hypergraphPlan = this.hypergraph.generateDocumentPlan({
      documentType: validatedReqs.documentType || 'answering-affidavit',
      purpose: validatedReqs.purpose,
      claims: validatedReqs.claims || [],
      evidence: validatedReqs.evidence?.map(e => e.id) || [],
      timeline: validatedReqs.timeline || [],
      respondingTo: validatedReqs.respondingTo,
      urgency: validatedReqs.urgency || 'normal'
    });
    
    // Enhance plan with hypergraph analysis
    plan.hypergraphAnalysis = {
      evidenceGaps: this.identifyEvidenceGaps(plan),
      timelineInsights: this.analyzeTimeline(plan),
      claimStrength: this.assessClaimStrength(plan)
    };
    
    console.log(`Plan generated: ${plan.id}`);
    console.log(`Complexity score: ${plan.complexityScore}/10`);
    console.log(`Estimated sections: ${plan.estimatedSections}`);
    console.log(`Estimated paragraphs: ${plan.estimatedParagraphs}`);
    
    return plan;
  }

  /**
   * Generate affidavit from plan
   */
  async generateAffidavitFromPlan(planId, content) {
    console.log('\n=== Generating Affidavit from Plan ===\n');
    
    // Retrieve plan
    let plan = this.hypergraph.documentPlans.get(planId);
    if (!plan) {
      // Try from plan generator
      plan = this.planGenerator.hypergraph.documentPlans.get(planId);
    }
    if (!plan) {
      throw new Error('Plan not found');
    }
    
    // Generate affidavit
    const affidavit = this.hypergraph.generateAffidavitFromPlan(planId, content);
    
    // Auto-enhance affidavit based on plan
    this.enhanceAffidavit(affidavit, plan);
    
    console.log(`Affidavit generated: ${affidavit.id}`);
    console.log(`Status: ${affidavit.status}`);
    console.log(`Paragraphs: ${affidavit.paragraphs.length}`);
    
    return affidavit;
  }

  /**
   * Evaluate affidavit
   */
  async evaluateAffidavit(affidavitId, options = {}) {
    console.log('\n=== Evaluating Affidavit ===\n');
    
    // Retrieve affidavit
    const affidavit = this.hypergraph.entities.get(affidavitId);
    if (!affidavit || affidavit.type !== 'Affidavit') {
      throw new Error('Affidavit not found');
    }
    
    // Perform evaluation
    const evaluation = await this.evaluator.evaluateAffidavit(affidavit, options);
    
    // Store evaluation results
    this.hypergraph.evaluations.set(evaluation.id, evaluation);
    
    console.log(`Evaluation complete: ${evaluation.id}`);
    console.log(`Overall Score: ${evaluation.overallScore}/100`);
    console.log(`Rating: ${evaluation.rating.level} (${evaluation.rating.stars} stars)`);
    console.log('\nScore Breakdown:');
    Object.entries(evaluation.scores).forEach(([criterion, result]) => {
      console.log(`  ${criterion}: ${Math.round(result.score)}/100`);
    });
    
    if (evaluation.detailedFindings) {
      console.log(`\nCritical Issues: ${evaluation.detailedFindings.criticalIssues.length}`);
      console.log(`Major Issues: ${evaluation.detailedFindings.majorIssues.length}`);
      console.log(`Strengths: ${evaluation.detailedFindings.strengths.length}`);
    }
    
    return evaluation;
  }

  /**
   * Generate and evaluate complete affidavit workflow
   */
  async completeWorkflow(requirements, content) {
    console.log('\n=== Complete Affidavit Workflow ===\n');
    
    // Step 1: Generate plan
    const plan = await this.generateAffidavitPlan(requirements);
    
    // Step 2: Generate affidavit from plan
    const affidavit = await this.generateAffidavitFromPlan(plan.id, content);
    
    // Step 3: Evaluate affidavit
    const evaluation = await this.evaluateAffidavit(affidavit.id, {
      documentType: requirements.documentType || 'answering-affidavit',
      detailLevel: 'comprehensive',
      generateReport: true
    });
    
    // Step 4: Generate improvement plan if needed
    let improvementPlan = null;
    if (evaluation.overallScore < 85) {
      improvementPlan = this.generateImprovementPlan(evaluation, affidavit);
    }
    
    return {
      plan,
      affidavit,
      evaluation,
      improvementPlan,
      summary: this.generateWorkflowSummary(plan, affidavit, evaluation)
    };
  }

  /**
   * Helper methods
   */
  
  validateRequirements(requirements) {
    const validated = { ...requirements };
    
    // Ensure required fields
    if (!validated.deponent) {
      throw new Error('Deponent information required');
    }
    
    if (!validated.purpose) {
      validated.purpose = 'General affidavit';
    }
    
    if (!validated.claims) {
      validated.claims = [];
    }
    
    if (!validated.evidence) {
      validated.evidence = [];
    }
    
    return validated;
  }

  enhanceAffidavit(affidavit, plan) {
    // Add metadata from plan
    affidavit.metadata = {
      planId: plan.id,
      strategy: plan.caseInfo.strategy,
      pattern: plan.caseInfo.pattern,
      complexityScore: plan.complexityScore
    };
    
    // Enhance paragraphs with plan insights
    if (plan.evidencePlan?.mapping) {
      affidavit.paragraphs.forEach(para => {
        // Add evidence mapping hints
        para.plannedEvidence = [];
        for (const [section, evidence] of plan.evidencePlan.mapping) {
          if (para.tags?.some(tag => section.toLowerCase().includes(tag))) {
            para.plannedEvidence.push(...evidence.map(e => e.id));
          }
        }
      });
    }
  }

  identifyEvidenceGaps(plan) {
    const gaps = [];
    
    if (plan.evidencePlan?.gaps) {
      plan.evidencePlan.gaps.forEach(gap => {
        gaps.push({
          type: gap.type,
          importance: gap.importance,
          suggestion: gap.suggestion,
          impact: 'May weaken case if not addressed'
        });
      });
    }
    
    return gaps;
  }

  analyzeTimeline(plan) {
    const insights = [];
    
    if (plan.timeline?.criticalPeriods) {
      plan.timeline.criticalPeriods.forEach(period => {
        insights.push({
          period: `${period.start} to ${period.end}`,
          description: period.description,
          significance: 'Critical for establishing pattern'
        });
      });
    }
    
    return insights;
  }

  assessClaimStrength(plan) {
    const assessment = {};
    
    plan.caseInfo.claims?.forEach((claim, index) => {
      const supportingEvidence = plan.evidencePlan?.mapping?.get(`Claim ${index + 1}`) || [];
      assessment[claim] = {
        evidenceCount: supportingEvidence.length,
        strength: this.calculateClaimStrength(supportingEvidence),
        gaps: supportingEvidence.length === 0 ? ['No supporting evidence'] : []
      };
    });
    
    return assessment;
  }

  calculateClaimStrength(evidence) {
    if (evidence.length === 0) return 'Unsupported';
    if (evidence.length === 1) return 'Weak';
    if (evidence.length <= 3) return 'Moderate';
    return 'Strong';
  }

  generateImprovementPlan(evaluation, affidavit) {
    console.log('\n=== Generating Improvement Plan ===\n');
    
    const plan = {
      targetScore: 90,
      currentScore: evaluation.overallScore,
      gap: 90 - evaluation.overallScore,
      priorities: [],
      estimatedEffort: null
    };
    
    // Prioritize improvements based on impact
    if (evaluation.improvementRoadmap) {
      plan.priorities = [
        ...evaluation.improvementRoadmap.immediate,
        ...evaluation.improvementRoadmap.shortTerm
      ].slice(0, 5);
      
      plan.estimatedEffort = evaluation.improvementRoadmap.timeline?.estimatedHours;
    }
    
    console.log(`Improvement needed: ${plan.gap} points`);
    console.log(`Top priorities: ${plan.priorities.length}`);
    console.log(`Estimated effort: ${plan.estimatedEffort} hours`);
    
    return plan;
  }

  generateWorkflowSummary(plan, affidavit, evaluation) {
    return {
      success: evaluation.overallScore >= 70,
      planId: plan.id,
      affidavitId: affidavit.id,
      evaluationId: evaluation.id,
      score: evaluation.overallScore,
      rating: evaluation.rating,
      readyForFiling: evaluation.overallScore >= 85,
      keyMetrics: {
        paragraphs: affidavit.paragraphs.length,
        annexures: affidavit.annexures.length,
        evidenceReferences: affidavit.paragraphs.filter(p => p.evidenceRefs?.length > 0).length,
        complexity: plan.complexityScore
      },
      nextSteps: evaluation.overallScore >= 85 
        ? ['Review and approve', 'Commission affidavit', 'File with court']
        : ['Address identified issues', 'Re-evaluate after improvements']
    };
  }

  /**
   * Export functions
   */
  
  async exportPlan(planId, format = 'json') {
    const plan = this.planGenerator.hypergraph.documentPlans.get(planId);
    if (!plan) throw new Error('Plan not found');
    
    const filename = `affidavit-plan-${planId}.${format}`;
    const exportPath = path.join(__dirname, 'exports', filename);
    
    if (format === 'json') {
      await fs.writeFile(exportPath, JSON.stringify(plan, null, 2));
    } else if (format === 'md') {
      const markdown = this.convertPlanToMarkdown(plan);
      await fs.writeFile(exportPath, markdown);
    }
    
    return exportPath;
  }

  async exportEvaluation(evaluationId, format = 'json') {
    const evaluation = this.hypergraph.evaluations.get(evaluationId);
    if (!evaluation) throw new Error('Evaluation not found');
    
    const filename = `affidavit-evaluation-${evaluationId}.${format}`;
    const exportPath = path.join(__dirname, 'exports', filename);
    
    if (format === 'json') {
      await fs.writeFile(exportPath, JSON.stringify(evaluation, null, 2));
    } else if (format === 'md') {
      const markdown = this.convertEvaluationToMarkdown(evaluation);
      await fs.writeFile(exportPath, markdown);
    }
    
    return exportPath;
  }

  convertPlanToMarkdown(plan) {
    let md = `# Affidavit Plan: ${plan.id}\n\n`;
    md += `**Generated:** ${plan.generatedAt}\n`;
    md += `**Strategy:** ${plan.caseInfo.strategy}\n`;
    md += `**Complexity:** ${plan.complexityScore}/10\n\n`;
    
    md += `## Document Structure\n\n`;
    plan.structure.sections.forEach(section => {
      md += `### ${section.name}\n`;
      section.paragraphs.forEach(para => {
        md += `- ${para}\n`;
      });
      md += '\n';
    });
    
    md += `## Evidence Plan\n\n`;
    md += `**Total Evidence:** ${plan.evidencePlan.totalEvidence}\n`;
    md += `**Gaps Identified:** ${plan.evidencePlan.gaps.length}\n\n`;
    
    if (plan.notes) {
      md += `## Strategic Notes\n\n`;
      Object.entries(plan.notes).forEach(([category, notes]) => {
        if (notes.length > 0) {
          md += `### ${category}\n`;
          notes.forEach(note => {
            md += `- ${note}\n`;
          });
          md += '\n';
        }
      });
    }
    
    return md;
  }

  convertEvaluationToMarkdown(evaluation) {
    let md = `# Affidavit Evaluation Report\n\n`;
    md += `**Evaluation ID:** ${evaluation.id}\n`;
    md += `**Date:** ${evaluation.timestamp}\n`;
    md += `**Overall Score:** ${evaluation.overallScore}/100\n`;
    md += `**Rating:** ${evaluation.rating.level} (${evaluation.rating.stars} stars)\n\n`;
    
    md += `## Score Breakdown\n\n`;
    Object.entries(evaluation.scores).forEach(([criterion, result]) => {
      md += `### ${criterion} (${Math.round(result.score)}/100)\n`;
      if (result.strengths.length > 0) {
        md += `**Strengths:**\n`;
        result.strengths.forEach(s => md += `- ${s}\n`);
      }
      if (result.issues.length > 0) {
        md += `**Issues:**\n`;
        result.issues.forEach(i => md += `- ${i}\n`);
      }
      md += '\n';
    });
    
    if (evaluation.report?.recommendations) {
      md += `## Recommendations\n\n`;
      evaluation.report.recommendations.forEach(rec => {
        md += `### ${rec.area} (Priority: ${rec.priority})\n`;
        md += `${rec.recommendation}\n`;
        md += `Expected Improvement: ${rec.expectedImprovement}\n\n`;
      });
    }
    
    return md;
  }
}

// Export the main class
module.exports = LegalDocumentSystem;

// Also export individual components
module.exports.LegalDocumentHypergraph = LegalDocumentHypergraph;
module.exports.AffidavitPlanGenerator = AffidavitPlanGenerator;
module.exports.AffidavitEvaluator = AffidavitEvaluator;