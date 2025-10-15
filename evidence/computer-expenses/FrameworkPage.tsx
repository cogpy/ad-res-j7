import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const FrameworkPage = () => {
  const [loading, setLoading] = useState(false);
  
  const frameworkDocuments = [
    {
      id: 'computer-expenses-analysis-framework',
      title: 'Computer Expenses Analysis Framework',
      description: 'A comprehensive framework for analyzing, categorizing, and justifying computer expenses.',
      icon: '📊'
    },
    {
      id: 'sars-audit-documentation',
      title: 'SARS Audit Documentation Package',
      description: 'Documentation package for preparing for SARS audits of computer expenses.',
      icon: '📋'
    },
    {
      id: 'consolidated-report',
      title: 'Consolidated Report',
      description: 'Consolidated report on computer expenses analysis and findings.',
      icon: '📑'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Framework Documents</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {frameworkDocuments.map(doc => (
          <div key={doc.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-3">{doc.icon}</div>
            <h2 className="text-xl font-semibold mb-2">{doc.title}</h2>
            <p className="text-gray-600 mb-4">{doc.description}</p>
            <Link to={`/framework/${doc.id}`} className="text-blue-600 hover:underline">
              View Document →
            </Link>
          </div>
        ))}
      </div>
      
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">About the Framework</h2>
        <p className="mb-4">
          The Computer Expenses Analysis Framework provides a structured approach to analyzing, 
          categorizing, and justifying computer expenses for business and tax purposes. The framework 
          is designed to help businesses prepare for SARS audits and ensure that all computer expenses 
          are properly documented and justified.
        </p>
        <p>
          Use the documents above to understand the framework structure, prepare for SARS audits, 
          and view consolidated findings from the analysis.
        </p>
      </div>
      
      <div className="mt-8">
        <Link to="/" className="text-blue-600 hover:underline">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};

export default FrameworkPage;
