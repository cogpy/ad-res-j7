/**
 * Evidence Validation Workflow
 * 
 * Automated system for validating evidence completeness and quality
 * Integrates with Repository_Status_and_Critical_Evidence_Collection.md requirements
 */

const fs = require('fs');
const path = require('path');
const OptimalEvidenceCollector = require('./optimal-evidence-collector');

class EvidenceValidationWorkflow {
  constructor() {
    this.evidenceCollector = new OptimalEvidenceCollector();
    this.validationRules = this.loadValidationRules();
    this.todoFilePath = './todo/Repository_Status_and_Critical_Evidence_Collection.md';
    this.evidencePaths = [
      './evidence',
      './jax-response/evidence-attachments',
      './jax-dan-response/evidence-attachments',
      './case_2025_137857/02_evidence'
    ];
    
    this.validationResults = {
      passed: [],
      failed: [],
      warnings: [],
      completeness: {}
    };
  }

  /**
   * Load validation rules based on todo requirements
   */
  loadValidationRules() {
    return {
      critical_evidence: [
        {
          code: 'JF-RP1',
          required_files: ['responsible-person-documentation', '37-jurisdictions'],
          validation_type: 'regulatory',
          min_file_size: 1000, // bytes
          required_content: ['Responsible Person', 'jurisdiction', 'regulatory']
        },
        {
          code: 'JF-DLA1',
          required_files: ['director-loan-account-1', 'bank-statement'],
          validation_type: 'financial',
          min_file_size: 5000,
          required_content: ['director loan', 'account', 'balance']
        },
        {
          code: 'JF-DLA2',
          required_files: ['director-loan-account-2', 'bank-statement'],
          validation_type: 'financial',
          min_file_size: 5000,
          required_content: ['director loan', 'account', 'balance']
        },
        {
          code: 'JF-DLA3',
          required_files: ['director-loan-account-3', 'bank-statement'],
          validation_type: 'financial',
          min_file_size: 5000,
          required_content: ['director loan', 'account', 'balance']
        },
        {
          code: 'JF-PA1',
          required_files: ['peter-withdrawal-1'],
          validation_type: 'transaction',
          min_file_size: 2000,
          required_content: ['Peter', 'withdrawal', 'amount', 'date']
        },
        {
          code: 'JF-BS1',
          required_files: ['bank-statement', '500k-payment', '2025-07-16'],
          validation_type: 'financial',
          min_file_size: 10000,
          required_content: ['R500', 'July 2025', 'payment']
        },
        {
          code: 'JF5-DRAFT',
          required_files: ['jf5-draft-agreement'],
          validation_type: 'legal',
          min_file_size: 8000,
          required_content: ['agreement', 'draft', 'initial version']
        }
      ],
      completeness_criteria: {
        'phase1_critical': 0.80, // 80% completion required
        'phase2_high': 0.60,     // 60% completion required
        'overall': 0.70          // 70% overall completion required
      },
      quality_criteria: {
        'file_size_min': 1000,
        'content_depth_min': 5, // minimum number of key content elements
        'metadata_required': ['date_created', 'evidence_type', 'source']
      }
    };
  }

  /**
   * Run complete evidence validation workflow
   */
  async runValidationWorkflow() {
    console.log('🔍 Starting Evidence Validation Workflow...\n');
    
    // Step 1: Validate critical evidence items
    await this.validateCriticalEvidence();
    
    // Step 2: Check evidence completeness
    this.validateEvidenceCompleteness();
    
    // Step 3: Validate evidence quality
    this.validateEvidenceQuality();
    
    // Step 4: Cross-reference with todo requirements
    this.crossReferenceTodoRequirements();
    
    // Step 5: Generate validation report
    const report = this.generateValidationReport();
    
    // Step 6: Create automated fix recommendations
    const recommendations = this.generateAutomatedRecommendations();
    
    console.log('✅ Evidence Validation Workflow completed\n');
    
    return {
      validation_results: this.validationResults,
      report: report,
      recommendations: recommendations
    };
  }

  /**
   * Validate critical evidence items
   */
  async validateCriticalEvidence() {
    console.log('📋 Validating Critical Evidence Items...');
    
    for (const rule of this.validationRules.critical_evidence) {
      const result = await this.validateEvidenceItem(rule);
      
      if (result.passed) {
        this.validationResults.passed.push(result);
        console.log(`✅ ${rule.code}: PASSED`);
      } else {
        this.validationResults.failed.push(result);
        console.log(`❌ ${rule.code}: FAILED - ${result.reason}`);
      }
    }
    
    console.log();
  }

  /**
   * Validate individual evidence item
   */
  async validateEvidenceItem(rule) {
    const evidenceFiles = this.findEvidenceFiles(rule.code);
    const validation = {
      code: rule.code,
      type: rule.validation_type,
      passed: false,
      reason: '',
      files_found: evidenceFiles,
      content_validation: {},
      quality_score: 0
    };

    // Check if files exist
    if (evidenceFiles.length === 0) {
      validation.reason = 'No evidence files found';
      return validation;
    }

    // Check file quality and content
    let totalQualityScore = 0;
    let validFiles = 0;

    for (const file of evidenceFiles) {
      const fileValidation = await this.validateEvidenceFile(file, rule);
      validation.content_validation[file] = fileValidation;
      
      if (fileValidation.passed) {
        validFiles++;
        totalQualityScore += fileValidation.quality_score;
      }
    }

    // Determine if validation passed
    if (validFiles > 0) {
      validation.passed = true;
      validation.quality_score = totalQualityScore / validFiles;
      validation.reason = `${validFiles}/${evidenceFiles.length} files valid`;
    } else {
      validation.reason = 'No valid files found matching criteria';
    }

    return validation;
  }

  /**
   * Find evidence files for a specific code
   */
  findEvidenceFiles(evidenceCode) {
    const foundFiles = [];
    
    for (const searchPath of this.evidencePaths) {
      if (fs.existsSync(searchPath)) {
        const files = this.searchFilesRecursively(searchPath, evidenceCode);
        foundFiles.push(...files);
      }
    }
    
    return foundFiles;
  }

  /**
   * Recursively search for files containing evidence code
   */
  searchFilesRecursively(dirPath, evidenceCode) {
    const files = [];
    
    try {
      const items = fs.readdirSync(dirPath);
      
      for (const item of items) {
        const itemPath = path.join(dirPath, item);
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory()) {
          files.push(...this.searchFilesRecursively(itemPath, evidenceCode));
        } else if (
          item.includes(evidenceCode) || 
          item.includes(evidenceCode.replace('-', '')) ||
          item.includes(evidenceCode.toLowerCase())
        ) {
          files.push(itemPath);
        }
      }
    } catch (error) {
      console.warn(`Could not search directory ${dirPath}:`, error.message);
    }
    
    return files;
  }

  /**
   * Validate individual evidence file
   */
  async validateEvidenceFile(filePath, rule) {
    const validation = {
      file: filePath,
      passed: false,
      quality_score: 0,
      checks: {
        file_exists: false,
        file_size_adequate: false,
        content_present: false,
        metadata_complete: false
      },
      details: {}
    };

    try {
      // Check file exists
      if (fs.existsSync(filePath)) {
        validation.checks.file_exists = true;
        
        // Check file size
        const stats = fs.statSync(filePath);
        validation.details.file_size = stats.size;
        validation.checks.file_size_adequate = stats.size >= rule.min_file_size;
        
        // Check content (for text files)
        if (filePath.endsWith('.md') || filePath.endsWith('.txt') || filePath.endsWith('.json')) {
          const content = fs.readFileSync(filePath, 'utf8');
          validation.details.content_length = content.length;
          
          // Check required content
          let contentMatches = 0;
          for (const requiredContent of rule.required_content) {
            if (content.toLowerCase().includes(requiredContent.toLowerCase())) {
              contentMatches++;
            }
          }
          
          validation.checks.content_present = contentMatches >= (rule.required_content.length * 0.6);
          validation.details.content_matches = contentMatches;
        } else {
          validation.checks.content_present = true; // Assume binary files are valid
        }
        
        // Calculate quality score
        let score = 0;
        if (validation.checks.file_exists) score += 25;
        if (validation.checks.file_size_adequate) score += 25;
        if (validation.checks.content_present) score += 50;
        
        validation.quality_score = score;
        validation.passed = score >= 75; // 75% threshold for passing
      }
    } catch (error) {
      validation.details.error = error.message;
    }

    return validation;
  }

  /**
   * Validate evidence completeness against todo requirements
   */
  validateEvidenceCompleteness() {
    console.log('📊 Validating Evidence Completeness...');
    
    const report = this.evidenceCollector.generateStatusReport();
    const completeness = this.validationRules.completeness_criteria;
    
    // Parse completion rate (remove % sign)
    const currentRate = parseFloat(report.evidence_summary.completion_rate.replace('%', '')) / 100;
    
    this.validationResults.completeness = {
      overall_completion: currentRate,
      required_overall: completeness.overall,
      meets_overall_requirement: currentRate >= completeness.overall,
      phase1_critical: {
        completed: report.evidence_summary.completed,
        total: report.evidence_summary.total_required,
        rate: currentRate,
        required: completeness.phase1_critical,
        meets_requirement: currentRate >= completeness.phase1_critical
      },
      gaps_analysis: {
        critical_gaps: report.critical_gaps,
        quick_wins: report.quick_wins_available,
        estimated_days_to_compliance: this.calculateDaysToCompliance(currentRate, completeness.overall)
      }
    };
    
    if (this.validationResults.completeness.meets_overall_requirement) {
      console.log(`✅ Completeness: ${(currentRate * 100).toFixed(1)}% (meets ${(completeness.overall * 100).toFixed(1)}% requirement)`);
    } else {
      console.log(`⚠️ Completeness: ${(currentRate * 100).toFixed(1)}% (below ${(completeness.overall * 100).toFixed(1)}% requirement)`);
    }
    
    console.log();
  }

  /**
   * Calculate days needed to reach compliance
   */
  calculateDaysToCompliance(currentRate, requiredRate) {
    if (currentRate >= requiredRate) return 0;
    
    const gap = requiredRate - currentRate;
    const report = this.evidenceCollector.generateStatusReport();
    const hoursRemaining = report.estimated_completion.hours;
    
    // Estimate based on current progress rate
    const estimatedDays = Math.ceil(hoursRemaining * gap / 8);
    return estimatedDays;
  }

  /**
   * Validate evidence quality
   */
  validateEvidenceQuality() {
    console.log('⭐ Validating Evidence Quality...');
    
    let totalQuality = 0;
    let itemCount = 0;
    
    for (const result of this.validationResults.passed) {
      totalQuality += result.quality_score;
      itemCount++;
    }
    
    const averageQuality = itemCount > 0 ? totalQuality / itemCount : 0;
    const qualityThreshold = 75; // 75% quality threshold
    
    this.validationResults.quality = {
      average_quality_score: averageQuality,
      quality_threshold: qualityThreshold,
      meets_quality_requirement: averageQuality >= qualityThreshold,
      high_quality_items: this.validationResults.passed.filter(r => r.quality_score >= 85).length,
      low_quality_items: this.validationResults.passed.filter(r => r.quality_score < 60).length
    };
    
    if (this.validationResults.quality.meets_quality_requirement) {
      console.log(`✅ Quality: ${averageQuality.toFixed(1)}% average (meets ${qualityThreshold}% threshold)`);
    } else {
      console.log(`⚠️ Quality: ${averageQuality.toFixed(1)}% average (below ${qualityThreshold}% threshold)`);
    }
    
    console.log();
  }

  /**
   * Cross-reference with todo requirements
   */
  crossReferenceTodoRequirements() {
    console.log('🔗 Cross-referencing Todo Requirements...');
    
    // Read todo file if it exists
    if (fs.existsSync(this.todoFilePath)) {
      const todoContent = fs.readFileSync(this.todoFilePath, 'utf8');
      
      // Extract completed items (marked with ✅)
      const completedMatches = todoContent.match(/✅.*?(?:\n|$)/g) || [];
      const totalMatches = todoContent.match(/\d+\.\s+.*?(?:\n|$)/g) || [];
      
      this.validationResults.todo_cross_reference = {
        completed_todo_items: completedMatches.length,
        total_todo_items: totalMatches.length,
        todo_completion_rate: (completedMatches.length / totalMatches.length * 100).toFixed(1) + '%',
        alignment_with_evidence: this.calculateTodoEvidenceAlignment(todoContent)
      };
      
      console.log(`📋 Todo Items: ${completedMatches.length}/${totalMatches.length} completed`);
    } else {
      console.log('⚠️ Todo file not found');
    }
    
    console.log();
  }

  /**
   * Calculate alignment between todo items and evidence
   */
  calculateTodoEvidenceAlignment(todoContent) {
    const evidenceCodes = ['JF-RP1', 'JF-RP2', 'JF-DLA1', 'JF-DLA2', 'JF-DLA3', 'JF-PA1', 'JF-PA2', 'JF-PA3', 'JF-PA4', 'JF-BS1'];
    let alignedItems = 0;
    
    for (const code of evidenceCodes) {
      if (todoContent.includes(code)) {
        alignedItems++;
      }
    }
    
    return {
      evidence_codes_in_todo: alignedItems,
      total_evidence_codes: evidenceCodes.length,
      alignment_rate: (alignedItems / evidenceCodes.length * 100).toFixed(1) + '%'
    };
  }

  /**
   * Generate comprehensive validation report
   */
  generateValidationReport() {
    const report = {
      validation_summary: {
        timestamp: new Date().toISOString(),
        total_validations: this.validationResults.passed.length + this.validationResults.failed.length,
        passed_validations: this.validationResults.passed.length,
        failed_validations: this.validationResults.failed.length,
        success_rate: ((this.validationResults.passed.length / (this.validationResults.passed.length + this.validationResults.failed.length)) * 100).toFixed(1) + '%'
      },
      completeness_analysis: this.validationResults.completeness,
      quality_analysis: this.validationResults.quality,
      todo_alignment: this.validationResults.todo_cross_reference,
      failed_items: this.validationResults.failed.map(f => ({
        code: f.code,
        type: f.type,
        reason: f.reason,
        priority: 'HIGH'
      })),
      recommendations: this.generateValidationRecommendations()
    };
    
    return report;
  }

  /**
   * Generate validation recommendations
   */
  generateValidationRecommendations() {
    const recommendations = [];
    
    // Completeness recommendations
    if (!this.validationResults.completeness.meets_overall_requirement) {
      recommendations.push({
        type: 'COMPLETENESS',
        priority: 'HIGH',
        action: `Increase evidence completion from ${(this.validationResults.completeness.overall_completion * 100).toFixed(1)}% to ${(this.validationRules.completeness_criteria.overall * 100).toFixed(1)}%`,
        estimated_effort: `${this.validationResults.completeness.gaps_analysis.estimated_days_to_compliance} days`
      });
    }
    
    // Quality recommendations
    if (this.validationResults.quality && !this.validationResults.quality.meets_quality_requirement) {
      recommendations.push({
        type: 'QUALITY',
        priority: 'MEDIUM',
        action: `Improve evidence quality from ${this.validationResults.quality.average_quality_score.toFixed(1)}% to 75%`,
        focus: 'Content depth and metadata completeness'
      });
    }
    
    // Failed item recommendations
    for (const failed of this.validationResults.failed) {
      recommendations.push({
        type: 'MISSING_EVIDENCE',
        priority: 'HIGH',
        code: failed.code,
        action: `Collect missing evidence: ${failed.code}`,
        reason: failed.reason
      });
    }
    
    return recommendations;
  }

  /**
   * Generate automated fix recommendations
   */
  generateAutomatedRecommendations() {
    const automatedFixes = [];
    
    // Quick wins from evidence collector
    const report = this.evidenceCollector.generateStatusReport();
    
    for (const action of report.next_actions.slice(0, 3)) {
      automatedFixes.push({
        type: 'QUICK_WIN',
        priority: 'HIGH',
        code: action.code,
        description: action.description,
        estimated_hours: action.estimated_hours,
        automation_potential: action.estimated_hours <= 3 ? 'HIGH' : 'MEDIUM',
        suggested_approach: this.getSuggestedApproach(action.code)
      });
    }
    
    return automatedFixes;
  }

  /**
   * Get suggested approach for evidence collection
   */
  getSuggestedApproach(evidenceCode) {
    const approaches = {
      'JF-PA1': 'Extract from existing financial records or bank statements',
      'JF-PA2': 'Extract from existing financial records or bank statements',
      'JF-PA3': 'Extract from existing financial records or bank statements',
      'JF-PA4': 'Extract from existing financial records or bank statements',
      'JF-BS1': 'Request from bank or extract from existing records for July 16, 2025',
      'JF-DLA1': 'Compile director loan account statement for first director',
      'JF-RP1': 'Gather regulatory documentation for all 37 jurisdictions'
    };
    
    return approaches[evidenceCode] || 'Manual collection and verification required';
  }

  /**
   * Export validation workflow results
   */
  exportValidationResults(outputPath = './evidence-validation-results.json') {
    const results = {
      workflow_name: 'Evidence Validation Workflow',
      version: '1.0',
      executed: new Date().toISOString(),
      validation_results: this.validationResults,
      report: this.generateValidationReport(),
      recommendations: this.generateAutomatedRecommendations()
    };
    
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    return outputPath;
  }
}

// Export for use in other modules
module.exports = EvidenceValidationWorkflow;

// Command line interface
if (require.main === module) {
  console.log('🔍 Evidence Validation Workflow System');
  console.log('=====================================\n');

  const workflow = new EvidenceValidationWorkflow();
  
  workflow.runValidationWorkflow().then(results => {
    console.log('📊 Validation Summary:');
    console.log(`   Success Rate: ${results.report.validation_summary.success_rate}`);
    console.log(`   Passed: ${results.report.validation_summary.passed_validations}`);
    console.log(`   Failed: ${results.report.validation_summary.failed_validations}`);
    
    if (results.report.completeness_analysis) {
      console.log(`   Completeness: ${(results.report.completeness_analysis.overall_completion * 100).toFixed(1)}%`);
    }
    
    console.log('\n💡 Top Recommendations:');
    results.recommendations.slice(0, 3).forEach((rec, index) => {
      console.log(`   ${index + 1}. [${rec.priority}] ${rec.action}`);
    });
    
    // Export results
    const outputFile = workflow.exportValidationResults();
    console.log(`\n📁 Results exported to: ${outputFile}`);
    
    console.log('\n✅ Evidence Validation Workflow completed successfully!');
  }).catch(error => {
    console.error('❌ Validation workflow failed:', error);
  });
}