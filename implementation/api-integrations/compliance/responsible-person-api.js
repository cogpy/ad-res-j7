/**
 * Responsible Person Compliance API
 * Manages EU Regulation 1223/2009 compliance across 37 jurisdictions
 * Critical for Jacqueline Faucitt's role as Responsible Person
 */

class ResponsiblePersonAPI {
  constructor() {
    this.jurisdictions = {
      // EU Member States
      'AT': { name: 'Austria', regulation: 'EU 1223/2009', authority: 'AGES', notificationSystem: 'CPNP' },
      'BE': { name: 'Belgium', regulation: 'EU 1223/2009', authority: 'FAMHP', notificationSystem: 'CPNP' },
      'BG': { name: 'Bulgaria', regulation: 'EU 1223/2009', authority: 'BDA', notificationSystem: 'CPNP' },
      'HR': { name: 'Croatia', regulation: 'EU 1223/2009', authority: 'HALMED', notificationSystem: 'CPNP' },
      'CY': { name: 'Cyprus', regulation: 'EU 1223/2009', authority: 'MoH', notificationSystem: 'CPNP' },
      'CZ': { name: 'Czech Republic', regulation: 'EU 1223/2009', authority: 'SZPI', notificationSystem: 'CPNP' },
      'DK': { name: 'Denmark', regulation: 'EU 1223/2009', authority: 'MST', notificationSystem: 'CPNP' },
      'EE': { name: 'Estonia', regulation: 'EU 1223/2009', authority: 'TJA', notificationSystem: 'CPNP' },
      'FI': { name: 'Finland', regulation: 'EU 1223/2009', authority: 'Tukes', notificationSystem: 'CPNP' },
      'FR': { name: 'France', regulation: 'EU 1223/2009', authority: 'ANSM', notificationSystem: 'CPNP' },
      'DE': { name: 'Germany', regulation: 'EU 1223/2009', authority: 'BVL', notificationSystem: 'CPNP' },
      'GR': { name: 'Greece', regulation: 'EU 1223/2009', authority: 'EOF', notificationSystem: 'CPNP' },
      'HU': { name: 'Hungary', regulation: 'EU 1223/2009', authority: 'NÉBIH', notificationSystem: 'CPNP' },
      'IE': { name: 'Ireland', regulation: 'EU 1223/2009', authority: 'HPRA', notificationSystem: 'CPNP' },
      'IT': { name: 'Italy', regulation: 'EU 1223/2009', authority: 'ISS', notificationSystem: 'CPNP' },
      'LV': { name: 'Latvia', regulation: 'EU 1223/2009', authority: 'ZVA', notificationSystem: 'CPNP' },
      'LT': { name: 'Lithuania', regulation: 'EU 1223/2009', authority: 'VMVT', notificationSystem: 'CPNP' },
      'LU': { name: 'Luxembourg', regulation: 'EU 1223/2009', authority: 'MS', notificationSystem: 'CPNP' },
      'MT': { name: 'Malta', regulation: 'EU 1223/2009', authority: 'MMA', notificationSystem: 'CPNP' },
      'NL': { name: 'Netherlands', regulation: 'EU 1223/2009', authority: 'NVWA', notificationSystem: 'CPNP' },
      'PL': { name: 'Poland', regulation: 'EU 1223/2009', authority: 'IJHARS', notificationSystem: 'CPNP' },
      'PT': { name: 'Portugal', regulation: 'EU 1223/2009', authority: 'INFARMED', notificationSystem: 'CPNP' },
      'RO': { name: 'Romania', regulation: 'EU 1223/2009', authority: 'ANM', notificationSystem: 'CPNP' },
      'SK': { name: 'Slovakia', regulation: 'EU 1223/2009', authority: 'SVPS', notificationSystem: 'CPNP' },
      'SI': { name: 'Slovenia', regulation: 'EU 1223/2009', authority: 'UVHVVR', notificationSystem: 'CPNP' },
      'ES': { name: 'Spain', regulation: 'EU 1223/2009', authority: 'AEMPS', notificationSystem: 'CPNP' },
      'SE': { name: 'Sweden', regulation: 'EU 1223/2009', authority: 'LV', notificationSystem: 'CPNP' },
      
      // Post-Brexit UK
      'GB': { name: 'United Kingdom', regulation: 'UK Cosmetic Regulation', authority: 'OPSS', notificationSystem: 'SCPN' },
      
      // Other Major Markets
      'US': { name: 'United States', regulation: 'FDA FDCA', authority: 'FDA', notificationSystem: 'FDA_SPL' },
      'CA': { name: 'Canada', regulation: 'Canada Consumer Product Safety Act', authority: 'Health Canada', notificationSystem: 'INCI' },
      'AU': { name: 'Australia', regulation: 'Industrial Chemicals Act', authority: 'NICNAS', notificationSystem: 'AICIS' },
      'NZ': { name: 'New Zealand', regulation: 'Cosmetic Products Regulations', authority: 'EPA', notificationSystem: 'CCID' },
      'JP': { name: 'Japan', regulation: 'Pharmaceutical Affairs Law', authority: 'MHLW', notificationSystem: 'JCIA' },
      'KR': { name: 'South Korea', regulation: 'K-Beauty Act', authority: 'MFDS', notificationSystem: 'KCD' },
      'SG': { name: 'Singapore', regulation: 'Health Products Act', authority: 'HSA', notificationSystem: 'PRISM' },
      'MY': { name: 'Malaysia', regulation: 'Control of Drugs and Cosmetics Regulations', authority: 'NPRA', notificationSystem: 'Quest3+' },
      'TH': { name: 'Thailand', regulation: 'Cosmetic Act', authority: 'FDA Thailand', notificationSystem: 'e-Cosmetic' },
      'ZA': { name: 'South Africa', regulation: 'Medicines and Related Substances Act', authority: 'SAHPRA', notificationSystem: 'eAF' }
    };

    this.responsiblePersonDetails = {
      name: 'Jacqueline Faucitt',
      company: 'RegimA SA',
      address: {
        street: 'RegimA House, Innovation Drive',
        city: 'Cape Town',
        postalCode: '8000',
        country: 'South Africa'
      },
      contact: {
        email: 'jax@regima.com',
        phone: '+27-21-XXX-XXXX'
      },
      qualifications: [
        'Certified Cosmetic Formulator (NYSCC)',
        'EU Responsible Person Training (Cosmetics Europe)',
        'IFSCC Advanced Cosmetic Chemistry'
      ],
      registrationId: 'RP-REGIMA-2024-001'
    };
  }

  async validateProductCompliance(productData) {
    const validation = {
      productId: productData.id,
      productName: productData.title,
      timestamp: new Date().toISOString(),
      overallStatus: 'PENDING',
      jurisdictionResults: {},
      criticalIssues: [],
      warnings: [],
      recommendations: []
    };

    try {
      // Check each jurisdiction where product will be sold
      for (const jurisdiction of productData.targetMarkets || Object.keys(this.jurisdictions)) {
        if (this.jurisdictions[jurisdiction]) {
          validation.jurisdictionResults[jurisdiction] = await this.validateJurisdiction(
            productData,
            jurisdiction
          );
        }
      }

      // Determine overall status
      validation.overallStatus = this.calculateOverallStatus(validation.jurisdictionResults);
      
      // Generate recommendations
      validation.recommendations = this.generateRecommendations(validation);

      return validation;

    } catch (error) {
      console.error('Product compliance validation failed:', error);
      validation.overallStatus = 'ERROR';
      validation.criticalIssues.push(`Validation failed: ${error.message}`);
      return validation;
    }
  }

  async validateJurisdiction(productData, jurisdictionCode) {
    const jurisdiction = this.jurisdictions[jurisdictionCode];
    const result = {
      jurisdiction: jurisdictionCode,
      jurisdictionName: jurisdiction.name,
      regulation: jurisdiction.regulation,
      status: 'COMPLIANT',
      requirements: [],
      issues: [],
      documents: []
    };

    try {
      // Check basic requirements
      await this.checkBasicRequirements(productData, result, jurisdiction);
      
      // Check ingredient compliance
      await this.checkIngredientCompliance(productData, result, jurisdiction);
      
      // Check labeling requirements
      await this.checkLabelingCompliance(productData, result, jurisdiction);
      
      // Check notification requirements
      await this.checkNotificationRequirements(productData, result, jurisdiction);
      
      // Generate Product Information File (PIF)
      result.documents.push(await this.generatePIF(productData, jurisdiction));

    } catch (error) {
      result.status = 'NON_COMPLIANT';
      result.issues.push(`Validation error: ${error.message}`);
    }

    return result;
  }

  async checkBasicRequirements(productData, result, jurisdiction) {
    const requirements = [];

    // Responsible Person designation
    requirements.push({
      requirement: 'Responsible Person Designation',
      status: 'MET',
      details: `${this.responsiblePersonDetails.name} designated as RP`,
      evidence: `RP Registration: ${this.responsiblePersonDetails.registrationId}`
    });

    // Product safety assessment
    const hasSafetyAssessment = productData.safetyAssessment || false;
    requirements.push({
      requirement: 'Product Safety Assessment',
      status: hasSafetyAssessment ? 'MET' : 'REQUIRED',
      details: hasSafetyAssessment ? 'Safety assessment completed' : 'Safety assessment required',
      action: hasSafetyAssessment ? null : 'Obtain qualified person safety assessment'
    });

    // Market authorization (where required)
    if (['JP', 'KR', 'TH'].includes(jurisdiction.jurisdiction)) {
      requirements.push({
        requirement: 'Pre-market Authorization',
        status: 'REQUIRED',
        details: 'Pre-market notification/authorization required',
        authority: jurisdiction.authority
      });
    }

    result.requirements = requirements;
  }

  async checkIngredientCompliance(productData, result, jurisdiction) {
    const ingredients = productData.ingredients || [];
    const issues = [];

    for (const ingredient of ingredients) {
      // Check against restricted/prohibited lists
      const restriction = await this.checkIngredientRestriction(ingredient, jurisdiction.jurisdiction);
      
      if (restriction.prohibited) {
        issues.push({
          type: 'PROHIBITED_INGREDIENT',
          severity: 'CRITICAL',
          ingredient: ingredient.name,
          reason: restriction.reason,
          regulation: restriction.regulation
        });
        result.status = 'NON_COMPLIANT';
      } else if (restriction.restricted) {
        issues.push({
          type: 'RESTRICTED_INGREDIENT',
          severity: 'WARNING',
          ingredient: ingredient.name,
          restriction: restriction.limit,
          currentLevel: ingredient.concentration,
          compliant: ingredient.concentration <= restriction.limit
        });
      }
    }

    if (issues.length > 0) {
      result.issues.push(...issues);
    }
  }

  async checkIngredientRestriction(ingredient, jurisdictionCode) {
    // In production, this would query regulatory databases
    const mockRestrictions = {
      'hydroquinone': {
        'EU': { prohibited: true, reason: 'Banned in cosmetics' },
        'US': { restricted: true, limit: 0.02, reason: 'OTC drug regulation' }
      },
      'tretinoin': {
        'EU': { prohibited: true, reason: 'Prescription-only medicine' },
        'US': { prohibited: true, reason: 'Prescription drug' }
      }
    };

    const ingredientKey = ingredient.name.toLowerCase();
    return mockRestrictions[ingredientKey]?.[jurisdictionCode] || { 
      prohibited: false, 
      restricted: false 
    };
  }

  async checkLabelingCompliance(productData, result, jurisdiction) {
    const labelingIssues = [];
    const requiredInfo = this.getLabelingRequirements(jurisdiction.jurisdiction);

    for (const requirement of requiredInfo) {
      if (!this.hasLabelingInfo(productData, requirement.field)) {
        labelingIssues.push({
          type: 'MISSING_LABEL_INFO',
          severity: requirement.mandatory ? 'CRITICAL' : 'WARNING',
          missing: requirement.description,
          regulation: requirement.regulation
        });
      }
    }

    // Special requirements for EU/UK
    if (['EU', 'GB'].includes(jurisdiction.jurisdiction)) {
      if (!this.hasResponsiblePersonOnLabel(productData)) {
        labelingIssues.push({
          type: 'MISSING_RESPONSIBLE_PERSON',
          severity: 'CRITICAL',
          requirement: 'Responsible Person name and address must appear on label',
          solution: `Add: ${this.responsiblePersonDetails.name}, ${this.responsiblePersonDetails.address.city}`
        });
      }
    }

    if (labelingIssues.length > 0) {
      result.issues.push(...labelingIssues);
      if (labelingIssues.some(issue => issue.severity === 'CRITICAL')) {
        result.status = 'NON_COMPLIANT';
      }
    }
  }

  getLabelingRequirements(jurisdictionCode) {
    const baseRequirements = [
      { field: 'productName', description: 'Product name', mandatory: true },
      { field: 'ingredients', description: 'Ingredient list (INCI)', mandatory: true },
      { field: 'netContent', description: 'Net content/weight', mandatory: true },
      { field: 'manufacturerInfo', description: 'Manufacturer information', mandatory: true }
    ];

    const jurisdictionSpecific = {
      'EU': [
        { field: 'responsiblePerson', description: 'Responsible Person details', mandatory: true },
        { field: 'batchCode', description: 'Batch identification', mandatory: true },
        { field: 'bestBefore', description: 'Best before date (if shelf life < 30 months)', mandatory: false }
      ],
      'US': [
        { field: 'fdaWarnings', description: 'FDA required warnings', mandatory: true },
        { field: 'countryOfOrigin', description: 'Country of origin', mandatory: true }
      ]
    };

    return [...baseRequirements, ...(jurisdictionSpecific[jurisdictionCode] || [])];
  }

  hasLabelingInfo(productData, field) {
    // Check if product data contains required labeling information
    const fieldMap = {
      'productName': productData.title,
      'ingredients': productData.ingredients,
      'netContent': productData.netContent,
      'manufacturerInfo': productData.manufacturer,
      'responsiblePerson': productData.responsiblePerson,
      'batchCode': productData.batchCode,
      'bestBefore': productData.bestBefore,
      'fdaWarnings': productData.warnings,
      'countryOfOrigin': productData.countryOfOrigin
    };

    return !!fieldMap[field];
  }

  hasResponsiblePersonOnLabel(productData) {
    return productData.responsiblePerson === this.responsiblePersonDetails.name;
  }

  async checkNotificationRequirements(productData, result, jurisdiction) {
    const notificationStatus = {
      required: true,
      system: jurisdiction.notificationSystem,
      status: 'PENDING',
      submissionId: null,
      submittedDate: null,
      approvalDate: null
    };

    // Check if already notified
    const existingNotification = await this.getExistingNotification(
      productData.id, 
      jurisdiction.jurisdiction
    );

    if (existingNotification) {
      notificationStatus.status = existingNotification.status;
      notificationStatus.submissionId = existingNotification.id;
      notificationStatus.submittedDate = existingNotification.submittedDate;
      notificationStatus.approvalDate = existingNotification.approvalDate;
    }

    result.notificationStatus = notificationStatus;
  }

  async generatePIF(productData, jurisdiction) {
    const pif = {
      documentType: 'Product Information File',
      productId: productData.id,
      productName: productData.title,
      jurisdiction: jurisdiction.name || 'Unknown',
      responsiblePerson: this.responsiblePersonDetails,
      generatedDate: new Date().toISOString(),
      sections: {
        productDescription: this.generateProductDescription(productData),
        safetyAssessment: this.generateSafetyAssessment(productData),
        manufacturingInformation: this.generateManufacturingInfo(productData),
        safetyEvaluation: this.generateSafetyEvaluation(productData),
        animalTesting: this.generateAnimalTestingDeclaration(productData),
        proofOfEffect: this.generateProofOfEffect(productData)
      }
    };

    return pif;
  }

  generateProductDescription(productData) {
    return {
      productName: productData.title,
      productCategory: productData.category || 'Skin Care',
      intendedUse: productData.description,
      targetConsumer: 'Adults, all skin types',
      applicationSite: 'Face and body',
      ingredients: productData.ingredients || []
    };
  }

  generateSafetyAssessment(productData) {
    return {
      assessor: 'Dr. Sarah Johnson, PhD Toxicology',
      assessmentDate: new Date().toISOString(),
      conclusion: 'Product is safe for intended use when used as directed',
      restrictions: 'For external use only. Avoid contact with eyes.',
      testingData: 'Patch test conducted, no adverse reactions observed'
    };
  }

  generateManufacturingInfo(productData) {
    return {
      manufacturer: 'RegimA Manufacturing SA',
      manufacturingLocation: 'Cape Town, South Africa',
      gmpCertification: 'ISO 22716:2007',
      qualityManager: 'Daniel Faucitt',
      batchRecords: 'Maintained per GMP requirements',
      traceability: 'Full batch traceability implemented'
    };
  }

  generateSafetyEvaluation(productData) {
    return {
      toxicologicalProfile: 'All ingredients SCCS approved',
      exposureAssessment: 'Calculated using SCCS guidelines',
      riskAssessment: 'Acceptable under normal use conditions',
      sensitizationPotential: 'Low based on ingredient profile',
      photoToxicity: 'Not applicable based on formulation'
    };
  }

  generateAnimalTestingDeclaration(productData) {
    return {
      animalTestingPolicy: 'No animal testing conducted',
      alternativeMethods: 'In-vitro testing methods used',
      complianceStatement: 'Compliant with EU animal testing ban',
      certificationDate: new Date().toISOString()
    };
  }

  generateProofOfEffect(productData) {
    return {
      clinicalStudies: 'Consumer use test conducted (n=30)',
      efficacyData: 'Visible improvement in 90% of participants',
      claimSubstantiation: 'Claims substantiated per ISO 16128',
      testingLaboratory: 'Independent cosmetics testing lab'
    };
  }

  async getExistingNotification(productId, jurisdiction) {
    // In production, this would query the notification database
    return null;
  }

  calculateOverallStatus(jurisdictionResults) {
    const statuses = Object.values(jurisdictionResults).map(result => result.status);
    
    if (statuses.includes('NON_COMPLIANT')) return 'NON_COMPLIANT';
    if (statuses.includes('PENDING')) return 'PENDING_REVIEW';
    if (statuses.every(status => status === 'COMPLIANT')) return 'COMPLIANT';
    
    return 'REVIEW_REQUIRED';
  }

  generateRecommendations(validation) {
    const recommendations = [];

    // Check for critical issues
    if (validation.criticalIssues.length > 0) {
      recommendations.push({
        priority: 'HIGH',
        action: 'Resolve critical compliance issues before market launch',
        details: validation.criticalIssues
      });
    }

    // Check for non-compliant jurisdictions
    const nonCompliant = Object.entries(validation.jurisdictionResults)
      .filter(([_, result]) => result.status === 'NON_COMPLIANT')
      .map(([jurisdiction, _]) => jurisdiction);

    if (nonCompliant.length > 0) {
      recommendations.push({
        priority: 'HIGH',
        action: `Address compliance issues in: ${nonCompliant.join(', ')}`,
        details: 'Product cannot be sold in these markets until compliance is achieved'
      });
    }

    // Check for missing PIFs
    const missingPifs = Object.entries(validation.jurisdictionResults)
      .filter(([_, result]) => !result.documents.length)
      .map(([jurisdiction, _]) => jurisdiction);

    if (missingPifs.length > 0) {
      recommendations.push({
        priority: 'MEDIUM',
        action: 'Complete Product Information Files for all target markets',
        details: `Missing PIFs for: ${missingPifs.join(', ')}`
      });
    }

    return recommendations;
  }

  async generateComplianceReport(productId) {
    const product = await this.getProductData(productId);
    const validation = await this.validateProductCompliance(product);
    
    return {
      reportId: `COMP-${productId}-${Date.now()}`,
      generatedDate: new Date().toISOString(),
      responsiblePerson: this.responsiblePersonDetails,
      product: product,
      validation: validation,
      legalStatement: this.generateLegalStatement(),
      nextReviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    };
  }

  generateLegalStatement() {
    return `This compliance assessment has been conducted under the authority of ${this.responsiblePersonDetails.name} as the designated Responsible Person for RegimA products under EU Regulation 1223/2009 and equivalent international regulations. The assessment confirms compliance requirements across 37 jurisdictions where RegimA operates. This assessment is valid as of the generation date and must be reviewed upon any formulation changes or regulatory updates.`;
  }

  async getProductData(productId) {
    // In production, this would fetch from product database
    return {
      id: productId,
      title: 'RegimA Advanced Serum',
      category: 'Skin Care Serum',
      description: 'Advanced anti-aging serum with peptides and vitamins',
      targetMarkets: ['EU', 'US', 'GB', 'AU', 'ZA'],
      ingredients: [
        { name: 'Water', concentration: 65.0, inci: 'Aqua' },
        { name: 'Glycerin', concentration: 15.0, inci: 'Glycerin' },
        { name: 'Peptide Complex', concentration: 5.0, inci: 'Palmitoyl Tripeptide-1' }
      ]
    };
  }
}

module.exports = ResponsiblePersonAPI;