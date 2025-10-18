/**
 * Optimal Evidence Collection System
 * 
 * Integrates with the hypergraph to optimize evidence collection workflows
 * for Case 2025-137857 based on Repository_Status_and_Critical_Evidence_Collection.md
 */

const fs = require('fs');
const path = require('path');
const HypergraphQL = require('./docs/models/hypergnn/hypergraphql');

class OptimalEvidenceCollector {
  constructor() {
    this.evidenceMapping = this.loadEvidenceMapping();
    this.hypergraph = new HypergraphQL();
    this.criticalEvidence = this.loadCriticalEvidenceRequirements();
    this.evidenceDirectory = './evidence';
    this.jaxResponseDirectory = './jax-response';
    
    // Initialize evidence tracking
    this.evidenceStatus = {
      completed: new Set(),
      pending: new Set(),
      missing: new Set()
    };
    
    this.loadExistingEvidence();
  }

  /**
   * Load evidence mapping from JSON file
   */
  loadEvidenceMapping() {
    try {
      const mappingPath = './EVIDENCE_MAPPING.json';
      if (fs.existsSync(mappingPath)) {
        return JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
      }
    } catch (error) {
      console.warn('Could not load evidence mapping:', error.message);
    }
    return {};
  }

  /**
   * Load critical evidence requirements from the todo file
   */
  loadCriticalEvidenceRequirements() {
    return {
      phase1_critical: [
        { code: 'JF-RP1', description: 'Responsible Person documentation for 37 jurisdictions', priority: 1 },
        { code: 'JF-RP2', description: 'Regulatory risk analysis documentation', priority: 1 },
        { code: 'JF-DLA1', description: 'Director loan account statements - Director 1', priority: 1 },
        { code: 'JF-DLA2', description: 'Director loan account statements - Director 2', priority: 1 },
        { code: 'JF-DLA3', description: 'Director loan account statements - Director 3', priority: 1 },
        { code: 'JF-PA1', description: "Peter's withdrawal example 1", priority: 1 },
        { code: 'JF-PA2', description: "Peter's withdrawal example 2", priority: 1 },
        { code: 'JF-PA3', description: "Peter's withdrawal example 3", priority: 1 },
        { code: 'JF-PA4', description: "Peter's withdrawal example 4", priority: 1 },
        { code: 'JF-BS1', description: 'R500K payment bank statement dated 16 July 2025', priority: 1 },
        { code: 'JF5-DRAFT', description: 'JF5 draft agreement initial version', priority: 1 },
        { code: 'JF5-FINAL', description: 'JF5 final agreement signed version with changes', priority: 1 },
        { code: 'JF5-COMPARISON', description: 'JF5 draft vs final comparison document', priority: 1 },
        { code: 'JF-DANIEL-STATEMENT', description: 'Daniel witness statement - "Has anything changed?" exchange', priority: 1 },
        { code: 'JF-UK-TAX', description: 'UK tax residency documentation', priority: 1 },
        { code: 'JF-CHESNO1', description: 'Chesno fraud documentation 1', priority: 1, status: 'COMPLETED' },
        { code: 'JF-CHESNO2', description: 'Chesno fraud documentation 2', priority: 1, status: 'COMPLETED' },
        { code: 'JF-CHESNO3', description: 'Chesno fraud documentation 3', priority: 1, status: 'COMPLETED' },
        { code: 'JF-CHESNO4', description: 'Chesno fraud documentation 4', priority: 1, status: 'COMPLETED' },
        { code: 'JF-RESTORE1', description: "Daniel's 8-year restoration evidence 1", priority: 1 },
        { code: 'JF-RESTORE2', description: "Daniel's 8-year restoration evidence 2", priority: 1 },
        { code: 'JF-RESTORE3', description: "Daniel's 8-year restoration evidence 3", priority: 1 },
        { code: 'JF-RESTORE4', description: "Daniel's 8-year restoration evidence 4", priority: 1 }
      ],
      phase2_high: [
        { code: 'JF-SAL1', description: 'System access restriction logs 1', priority: 2 },
        { code: 'JF-EAL1', description: 'Email access logs 1', priority: 2 },
        { code: 'JF-FSL1', description: 'File system logs 1', priority: 2 },
        { code: 'JF-CORR1', description: 'Correspondence showing Daniel provided documentation', priority: 2 },
        { code: 'JF-HIST1', description: 'Historical collaborative model evidence 1', priority: 2 },
        { code: 'JF-HIST2', description: 'Historical collaborative model evidence 2', priority: 2 },
        { code: 'JF-HIST3', description: 'Historical collaborative model evidence 3', priority: 2 },
        { code: 'JF-RF1', description: "Rynette's expanding access documentation 1", priority: 2 },
        { code: 'JF-RF2', description: "Rynette's expanding access documentation 2", priority: 2 },
        { code: 'JF-RF3', description: "Rynette's expanding access documentation 3", priority: 2 },
        { code: 'JF-EX1', description: 'Director exclusion evidence 1', priority: 2 },
        { code: 'JF-EX2', description: 'Director exclusion evidence 2', priority: 2 },
        { code: 'JF-EX3', description: 'Director exclusion evidence 3', priority: 2 },
        { code: 'JF-EX4', description: 'Director exclusion evidence 4', priority: 2 }
      ]
    };
  }

  /**
   * Scan existing evidence files and update status
   */
  loadExistingEvidence() {
    const searchPaths = [
      './evidence',
      './jax-response/evidence-attachments',
      './jax-dan-response/evidence-attachments',
      './case_2025_137857/02_evidence'
    ];

    searchPaths.forEach(searchPath => {
      if (fs.existsSync(searchPath)) {
        this.scanDirectory(searchPath);
      }
    });

    // Update status based on scan results
    this.updateEvidenceStatus();
  }

  /**
   * Recursively scan directory for evidence files
   */
  scanDirectory(dirPath) {
    try {
      const items = fs.readdirSync(dirPath);
      
      items.forEach(item => {
        const itemPath = path.join(dirPath, item);
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory()) {
          this.scanDirectory(itemPath);
        } else if (item.startsWith('JF-') || item.includes('JF') || item.includes('evidence')) {
          // Extract evidence code and mark as found
          const evidenceCode = this.extractEvidenceCode(item);
          if (evidenceCode) {
            this.evidenceStatus.completed.add(evidenceCode);
          }
        }
      });
    } catch (error) {
      console.warn(`Could not scan directory ${dirPath}:`, error.message);
    }
  }

  /**
   * Extract evidence code from filename
   */
  extractEvidenceCode(filename) {
    // Match various JF patterns
    const patterns = [
      /JF-([A-Z0-9-]+)/,
      /JF([A-Z0-9-]+)/,
      /(JF-[A-Z]+\d+)/,
      /(JF\d+[A-Z]?)/
    ];

    for (const pattern of patterns) {
      const match = filename.match(pattern);
      if (match) {
        return match[1] || match[0];
      }
    }

    return null;
  }

  /**
   * Update evidence status based on requirements and found files
   */
  updateEvidenceStatus() {
    const allRequired = [
      ...this.criticalEvidence.phase1_critical,
      ...this.criticalEvidence.phase2_high
    ];

    allRequired.forEach(evidence => {
      const code = evidence.code;
      
      if (evidence.status === 'COMPLETED' || this.evidenceStatus.completed.has(code)) {
        this.evidenceStatus.completed.add(code);
        this.evidenceStatus.pending.delete(code);
        this.evidenceStatus.missing.delete(code);
      } else {
        this.evidenceStatus.missing.add(code);
      }
    });
  }

  /**
   * Generate optimal evidence collection plan
   */
  generateOptimalPlan() {
    const plan = {
      overview: {
        totalRequired: this.criticalEvidence.phase1_critical.length + this.criticalEvidence.phase2_high.length,
        completed: this.evidenceStatus.completed.size,
        missing: this.evidenceStatus.missing.size,
        completionRate: (this.evidenceStatus.completed.size / (this.criticalEvidence.phase1_critical.length + this.criticalEvidence.phase2_high.length)) * 100
      },
      criticalGaps: [],
      optimizedSequence: [],
      estimatedEffort: { hours: 0, days: 0 },
      quickWins: [],
      bottlenecks: []
    };

    // Identify critical gaps (Priority 1 missing evidence)
    this.criticalEvidence.phase1_critical.forEach(evidence => {
      if (this.evidenceStatus.missing.has(evidence.code)) {
        plan.criticalGaps.push({
          code: evidence.code,
          description: evidence.description,
          priority: evidence.priority,
          estimatedHours: this.estimateEffort(evidence),
          dependencies: this.findDependencies(evidence.code)
        });
      }
    });

    // Create optimized sequence based on dependencies and effort
    plan.optimizedSequence = this.createOptimizedSequence();

    // Calculate total effort
    plan.estimatedEffort = this.calculateTotalEffort(plan.optimizedSequence);

    // Identify quick wins (low effort, high impact)
    plan.quickWins = this.identifyQuickWins();

    // Identify bottlenecks (high effort, blocking other evidence)
    plan.bottlenecks = this.identifyBottlenecks();

    return plan;
  }

  /**
   * Estimate effort required for evidence collection
   */
  estimateEffort(evidence) {
    const effortMap = {
      'JF-RP': 8, // Regulatory documentation - complex
      'JF-DLA': 4, // Director loan accounts - moderate
      'JF-PA': 2, // Personal examples - simple
      'JF-BS': 3, // Bank statements - moderate
      'JF5': 6, // Agreement analysis - complex
      'JF-DANIEL': 4, // Witness statements - moderate
      'JF-UK': 5, // Tax documentation - complex
      'JF-RESTORE': 3, // Restoration evidence - moderate
      'default': 4
    };

    for (const [pattern, hours] of Object.entries(effortMap)) {
      if (evidence.code.startsWith(pattern)) {
        return hours;
      }
    }

    return effortMap.default;
  }

  /**
   * Find dependencies between evidence items
   */
  findDependencies(evidenceCode) {
    const dependencies = {
      'JF5-COMPARISON': ['JF5-DRAFT', 'JF5-FINAL'],
      'JF-DANIEL-STATEMENT': ['JF5-COMPARISON'],
      'JF-RP2': ['JF-RP1']
    };

    return dependencies[evidenceCode] || [];
  }

  /**
   * Create optimized collection sequence
   */
  createOptimizedSequence() {
    const missing = Array.from(this.evidenceStatus.missing);
    const allEvidence = [
      ...this.criticalEvidence.phase1_critical,
      ...this.criticalEvidence.phase2_high
    ].filter(e => missing.includes(e.code));

    // Sort by priority, then by effort (ascending)
    return allEvidence.sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      return this.estimateEffort(a) - this.estimateEffort(b);
    });
  }

  /**
   * Calculate total effort for sequence
   */
  calculateTotalEffort(sequence) {
    const totalHours = sequence.reduce((sum, evidence) => {
      return sum + this.estimateEffort(evidence);
    }, 0);

    return {
      hours: totalHours,
      days: Math.ceil(totalHours / 8),
      weeks: Math.ceil(totalHours / 40)
    };
  }

  /**
   * Identify quick wins (low effort, high impact)
   */
  identifyQuickWins() {
    return this.createOptimizedSequence()
      .filter(evidence => this.estimateEffort(evidence) <= 3 && evidence.priority <= 2)
      .slice(0, 5);
  }

  /**
   * Identify bottlenecks (high effort items that block others)
   */
  identifyBottlenecks() {
    return this.createOptimizedSequence()
      .filter(evidence => {
        const effort = this.estimateEffort(evidence);
        const dependencies = this.findDependencies(evidence.code);
        return effort >= 6 || dependencies.length > 0;
      });
  }

  /**
   * Integrate with hypergraph for evidence tracking
   */
  integrateWithHypergraph() {
    // Add evidence entities to hypergraph
    const allEvidence = [
      ...this.criticalEvidence.phase1_critical,
      ...this.criticalEvidence.phase2_high
    ];

    allEvidence.forEach(evidence => {
      const status = this.evidenceStatus.completed.has(evidence.code) ? 'completed' : 'missing';
      
      this.hypergraph.addEntity(`evidence_${evidence.code}`, 'Evidence', {
        code: evidence.code,
        description: evidence.description,
        priority: evidence.priority,
        status: status,
        estimatedEffort: this.estimateEffort(evidence),
        dependencies: this.findDependencies(evidence.code)
      });

      // Link to relevant paragraphs based on evidence mapping
      this.linkEvidenceToParagraphs(evidence.code);
    });

    return this.hypergraph;
  }

  /**
   * Link evidence to paragraphs based on evidence mapping
   */
  linkEvidenceToParagraphs(evidenceCode) {
    Object.entries(this.evidenceMapping).forEach(([paragraphId, mapping]) => {
      if (mapping.evidence_references && mapping.evidence_references.includes(evidenceCode)) {
        this.hypergraph.addLinkTuple(
          `evidence_${evidenceCode}`,
          'supports',
          paragraphId,
          { strength: this.calculateEvidenceStrength(evidenceCode) }
        );
      }
    });
  }

  /**
   * Calculate evidence strength based on priority and completeness
   */
  calculateEvidenceStrength(evidenceCode) {
    const evidence = [...this.criticalEvidence.phase1_critical, ...this.criticalEvidence.phase2_high]
      .find(e => e.code === evidenceCode);
    
    if (!evidence) return 0.5;

    const priorityWeight = evidence.priority === 1 ? 1.0 : evidence.priority === 2 ? 0.8 : 0.6;
    const completionWeight = this.evidenceStatus.completed.has(evidenceCode) ? 1.0 : 0.0;
    
    return priorityWeight * 0.7 + completionWeight * 0.3;
  }

  /**
   * Generate comprehensive status report
   */
  generateStatusReport() {
    const plan = this.generateOptimalPlan();
    
    return {
      timestamp: new Date().toISOString(),
      evidence_summary: {
        total_required: plan.overview.totalRequired,
        completed: plan.overview.completed,
        missing: plan.overview.missing,
        completion_rate: `${plan.overview.completionRate.toFixed(1)}%`
      },
      critical_gaps: plan.criticalGaps.length,
      quick_wins_available: plan.quickWins.length,
      bottlenecks_identified: plan.bottlenecks.length,
      estimated_completion: {
        hours: plan.estimatedEffort.hours,
        days: plan.estimatedEffort.days,
        weeks: plan.estimatedEffort.weeks
      },
      next_actions: plan.optimizedSequence.slice(0, 5).map(evidence => ({
        code: evidence.code,
        description: evidence.description,
        priority: evidence.priority,
        estimated_hours: this.estimateEffort(evidence)
      })),
      recommendations: this.generateRecommendations(plan)
    };
  }

  /**
   * Generate actionable recommendations
   */
  generateRecommendations(plan) {
    const recommendations = [];

    if (plan.criticalGaps.length > 0) {
      recommendations.push(`URGENT: ${plan.criticalGaps.length} critical evidence items missing. Focus on Priority 1 items first.`);
    }

    if (plan.quickWins.length > 0) {
      recommendations.push(`OPPORTUNITY: ${plan.quickWins.length} quick wins available (≤3 hours each). Start with these for momentum.`);
    }

    if (plan.bottlenecks.length > 0) {
      recommendations.push(`PLANNING: ${plan.bottlenecks.length} bottleneck items identified. Allocate dedicated time blocks for complex evidence.`);
    }

    if (plan.overview.completionRate < 50) {
      recommendations.push('STRATEGY: Evidence collection is below 50%. Consider parallel workstreams for different evidence types.');
    }

    return recommendations;
  }

  /**
   * Export evidence collection workflow for automation
   */
  exportWorkflow() {
    const plan = this.generateOptimalPlan();
    
    const workflow = {
      name: 'Evidence Collection Optimization Workflow',
      version: '1.0',
      generated: new Date().toISOString(),
      phases: {
        phase1_critical: {
          name: 'Critical Evidence Collection',
          items: plan.criticalGaps,
          estimated_hours: plan.criticalGaps.reduce((sum, item) => sum + item.estimatedHours, 0),
          parallel_streams: this.createParallelStreams(plan.criticalGaps)
        },
        phase2_quick_wins: {
          name: 'Quick Wins',
          items: plan.quickWins,
          estimated_hours: plan.quickWins.reduce((sum, item) => sum + this.estimateEffort(item), 0)
        },
        phase3_bottlenecks: {
          name: 'Complex Evidence Resolution',
          items: plan.bottlenecks,
          estimated_hours: plan.bottlenecks.reduce((sum, item) => sum + this.estimateEffort(item), 0),
          special_requirements: ['Legal expertise required', 'Detailed document analysis', 'Expert testimony preparation']
        }
      },
      automation_hooks: {
        progress_tracking: './evidence-progress-tracker.js',
        hypergraph_integration: './hypergraph_resolver.py',
        status_reporting: './generate-evidence-report.js'
      }
    };

    return workflow;
  }

  /**
   * Create parallel work streams for efficiency
   */
  createParallelStreams(items) {
    const streams = {
      financial_evidence: [],
      regulatory_evidence: [],
      technical_evidence: [],
      witness_evidence: []
    };

    items.forEach(item => {
      if (item.code.includes('DLA') || item.code.includes('PA') || item.code.includes('BS')) {
        streams.financial_evidence.push(item);
      } else if (item.code.includes('RP') || item.code.includes('UK')) {
        streams.regulatory_evidence.push(item);
      } else if (item.code.includes('SAL') || item.code.includes('EAL') || item.code.includes('FSL')) {
        streams.technical_evidence.push(item);
      } else {
        streams.witness_evidence.push(item);
      }
    });

    return streams;
  }
}

// Export for use in other modules
module.exports = OptimalEvidenceCollector;

// Command line interface
if (require.main === module) {
  console.log('🎯 Optimal Evidence Collection System');
  console.log('====================================\n');

  const collector = new OptimalEvidenceCollector();
  
  // Generate and display status report
  const report = collector.generateStatusReport();
  console.log('📊 Current Status:');
  console.log(`   Evidence Completion: ${report.evidence_summary.completion_rate}`);
  console.log(`   Critical Gaps: ${report.critical_gaps}`);
  console.log(`   Quick Wins Available: ${report.quick_wins_available}`);
  console.log(`   Estimated Completion: ${report.estimated_completion.days} days (${report.estimated_completion.hours} hours)\n`);

  console.log('📋 Next Actions:');
  report.next_actions.forEach((action, index) => {
    console.log(`   ${index + 1}. [${action.code}] ${action.description} (${action.estimated_hours}h)`);
  });

  console.log('\n💡 Recommendations:');
  report.recommendations.forEach(rec => {
    console.log(`   • ${rec}`);
  });

  // Integrate with hypergraph
  console.log('\n🔗 Integrating with hypergraph...');
  const hypergraph = collector.integrateWithHypergraph();
  console.log(`   Added ${hypergraph.entities.size} evidence entities to hypergraph`);
  console.log(`   Created ${hypergraph.linkTuples.length} evidence-paragraph links`);

  // Export workflow
  const workflow = collector.exportWorkflow();
  console.log('\n📁 Exporting optimization workflow...');
  fs.writeFileSync('./evidence-collection-workflow.json', JSON.stringify(workflow, null, 2));
  console.log('   Workflow exported to: evidence-collection-workflow.json');

  console.log('\n✅ Optimal Evidence Collection System initialized successfully!');
}