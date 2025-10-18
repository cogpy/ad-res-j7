import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const TemplatesPage = () => {
  const [loading, setLoading] = useState(false);
  
  const templates = [
    {
      id: 'computer-expense-descriptions',
      title: 'Computer Expense Descriptions',
      description: 'Template for describing computer expenses in layman\'s terms.',
      icon: '📝'
    },
    {
      id: 'business-application-assessment',
      title: 'Business Application Assessment',
      description: 'Template for assessing the business application of computer expenses.',
      icon: '💼'
    },
    {
      id: 'sars-tax-justification',
      title: 'SARS Tax Justification',
      description: 'Template for justifying computer expenses from SARS\' perspective.',
      icon: '📊'
    },
    {
      id: 'consolidated-external-revenues',
      title: 'Consolidated External Revenues',
      description: 'Template for analyzing consolidated external revenues.',
      icon: '💰'
    },
    {
      id: 'consolidated-net-trading-profits-losses',
      title: 'Consolidated Net Trading Profits/Losses',
      description: 'Template for analyzing consolidated net trading profits and losses.',
      icon: '📈'
    },
    {
      id: 'multi-year-computer-expenses',
      title: 'Multi-Year Computer Expenses',
      description: 'Template for analyzing computer expenses over multiple years.',
      icon: '🖥️'
    },
    {
      id: 'consolidated-bank-balances',
      title: 'Consolidated Bank Balances',
      description: 'Template for analyzing consolidated bank balances across the Group.',
      icon: '🏦'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Analysis Templates</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {templates.map(template => (
          <div key={template.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-3xl mb-3">{template.icon}</div>
            <h2 className="text-xl font-semibold mb-2">{template.title}</h2>
            <p className="text-gray-600 mb-4">{template.description}</p>
            <Link to={`/templates/${template.id}`} className="text-blue-600 hover:underline">
              View Template →
            </Link>
          </div>
        ))}
      </div>
      
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Using These Templates</h2>
        <p className="mb-4">
          These templates provide structured formats for analyzing various aspects of computer expenses
          and financial data. They are designed to help you prepare comprehensive reports for management
          and SARS audit purposes.
        </p>
        <p>
          Each template can be viewed online or downloaded for offline use. Use them as starting points
          for your own analysis and customize as needed for your specific requirements.
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

export default TemplatesPage;
