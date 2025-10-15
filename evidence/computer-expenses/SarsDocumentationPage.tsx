import React from 'react';
import { siteConfig } from '../lib/siteConfig';

const SarsDocumentationPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">SARS Documentation</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">SARS Audit Preparation</h2>
        <p className="mb-4">
          This section provides comprehensive documentation and guidelines for preparing for a potential SARS audit of computer expenses.
          The documentation package ensures that all computer expenses claimed as tax deductions are properly justified as being "in the production of income."
        </p>
        <p>
          The SARS audit documentation package includes templates, checklists, and guidelines for organizing and maintaining supporting documentation.
        </p>
        
        <div className="mt-6">
          <a 
            href="/framework/sars-audit-documentation" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors mr-4"
          >
            View Full Documentation Package
          </a>
          <a 
            href="/downloads/sars_audit_documentation_package.md" 
            download
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Download Documentation Package
          </a>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Tax Deductibility Requirements</h2>
        <p className="mb-4">
          For computer expenses to be tax-deductible under Section 11(a) of the Income Tax Act, they must meet the following requirements:
        </p>
        
        <div className="space-y-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">1. Actually Incurred</h3>
            <p>The expense must have been paid or legally obligated to be paid.</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">2. During the Year of Assessment</h3>
            <p>The expense must relate to the current tax year.</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">3. In the Production of Income</h3>
            <p>The expense must be directly related to income-generating activities.</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">4. Not of a Capital Nature</h3>
            <p>The expense must not create an enduring benefit (with exceptions).</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">5. Trade Requirement</h3>
            <p>The expense must be incurred in carrying on a trade.</p>
          </div>
        </div>
        
        <p>
          For computer expenses specifically, SARS will evaluate the business purpose, necessity, reasonableness, documentation, and consistency of treatment.
        </p>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Documentation Checklist</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Required for Each Expense</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Original invoice or receipt</li>
              <li>Proof of payment</li>
              <li>Business purpose documentation</li>
              <li>Income production justification</li>
              <li>Expense classification (operational/capital)</li>
              <li>VAT treatment documentation (if applicable)</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Required for Each Vendor</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Service agreement or terms of service</li>
              <li>Vendor verification (VAT registration if applicable)</li>
              <li>Service description and business application</li>
              <li>User allocation and access records</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Required for Overall Compliance</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Consistent accounting treatment</li>
              <li>Proper allocation methodology</li>
              <li>Foreign exchange calculations (if applicable)</li>
              <li>Contemporaneous business purpose documentation</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Related Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow-sm rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2">SARS Tax Justification Template</h3>
            <p className="text-gray-600 mb-4">Template for justifying expenses from SARS' perspective</p>
            <a 
              href="/templates/sars-tax-justification" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              View Template
            </a>
          </div>
          <div className="bg-white shadow-sm rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2">Business Application Assessment Template</h3>
            <p className="text-gray-600 mb-4">Template for assessing current and future business applications</p>
            <a 
              href="/templates/business-application-assessment" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              View Template
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SarsDocumentationPage;
