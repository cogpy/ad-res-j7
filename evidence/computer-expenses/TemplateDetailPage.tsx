import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MarkdownViewer from './MarkdownViewer';

interface TemplateMap {
  [key: string]: string;
}

interface TitleMap {
  [key: string]: string;
}

const TemplateDetailPage = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Map of template IDs to their file paths
  const templateMap: TemplateMap = {
    'computer-expense-descriptions': '/downloads/computer_expense_descriptions_template.md',
    'business-application-assessment': '/downloads/business_application_assessment_template.md',
    'sars-tax-justification': '/downloads/sars_tax_justification_template.md',
    'consolidated-external-revenues': '/downloads/consolidated_external_revenues_template.md',
    'consolidated-net-trading-profits-losses': '/downloads/consolidated_net_trading_profits_losses_template.md',
    'multi-year-computer-expenses': '/downloads/multi_year_computer_expenses_template.md',
    'consolidated-bank-balances': '/downloads/consolidated_bank_balances_template.md'
  };

  // Map of template IDs to their titles
  const titleMap: TitleMap = {
    'computer-expense-descriptions': 'Computer Expense Descriptions Template',
    'business-application-assessment': 'Business Application Assessment Template',
    'sars-tax-justification': 'SARS Tax Justification Template',
    'consolidated-external-revenues': 'Consolidated External Revenues Template',
    'consolidated-net-trading-profits-losses': 'Consolidated Net Trading Profits/Losses Template',
    'multi-year-computer-expenses': 'Multi-Year Computer Expenses Template',
    'consolidated-bank-balances': 'Consolidated Bank Balances Template'
  };

  useEffect(() => {
    if (!templateId || !templateMap[templateId]) {
      setError(true);
      setLoading(false);
      return;
    }

    fetch(templateMap[templateId])
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch template: ${response.status}`);
        }
        return response.text();
      })
      .then(text => {
        setContent(text);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading template:', error);
        setError(true);
        setLoading(false);
      });
  }, [templateId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-10">
          <p>Loading template...</p>
        </div>
      </div>
    );
  }

  if (error || !templateId || !templateMap[templateId]) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div>
              <p className="text-red-700">
                The requested template could not be found. Please check the URL and try again.
              </p>
            </div>
          </div>
        </div>
        <Link to="/templates" className="text-blue-600 hover:underline">
          ← Back to Templates
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{titleMap[templateId] || 'Template Document'}</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <MarkdownViewer content={content} />
      </div>
      
      <div className="mt-8">
        <Link to="/templates" className="text-blue-600 hover:underline">
          ← Back to Templates
        </Link>
      </div>
    </div>
  );
};

export default TemplateDetailPage;
