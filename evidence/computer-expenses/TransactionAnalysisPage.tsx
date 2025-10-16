import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MarkdownViewer from './MarkdownViewer';

const TransactionAnalysisPage = () => {
  const [reportContent, setReportContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use the correct path to the markdown file in the public directory
    fetch('/content/transaction_analysis/corrected_detailed_report.md')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch markdown: ${response.status}`);
        }
        return response.text();
      })
      .then(text => {
        setReportContent(text);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading report:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Transaction Analysis</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          {loading ? (
            <div className="text-center py-10">
              <p>Loading transaction analysis...</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              <MarkdownViewer content={reportContent} />
            </div>
          )}
        </div>
        
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Visualizations</h2>
            <ul className="space-y-3">
              <li>
                <div className="mb-2">
                  <h3 className="font-medium">Category Distribution</h3>
                  <img 
                    src="/images/category_distribution_pie.png" 
                    alt="Category Distribution" 
                    className="w-full rounded-md mt-2"
                  />
                </div>
              </li>
              <li>
                <div className="mb-2">
                  <h3 className="font-medium">Monthly Spending Trend</h3>
                  <img 
                    src="/images/monthly_spending_trend.png" 
                    alt="Monthly Spending Trend" 
                    className="w-full rounded-md mt-2"
                  />
                </div>
              </li>
              <li>
                <div className="mb-2">
                  <h3 className="font-medium">Top Categories</h3>
                  <img 
                    src="/images/top_categories_bar.png" 
                    alt="Top Categories" 
                    className="w-full rounded-md mt-2"
                  />
                </div>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Downloads</h2>
            <ul className="space-y-2">
              <li>
                <a 
                  href="/downloads/corrected_detailed_report.md" 
                  className="text-blue-600 hover:underline flex items-center"
                  download
                >
                  <span className="mr-2">📄</span> Detailed Report
                </a>
              </li>
              <li>
                <a 
                  href="/downloads/categorization_methodology.md" 
                  className="text-blue-600 hover:underline flex items-center"
                  download
                >
                  <span className="mr-2">📄</span> Categorization Methodology
                </a>
              </li>
              <li>
                <a 
                  href="/downloads/validated_transactions.csv" 
                  className="text-blue-600 hover:underline flex items-center"
                  download
                >
                  <span className="mr-2">📊</span> Validated Transactions
                </a>
              </li>
              <li>
                <a 
                  href="/downloads/category_summary.csv" 
                  className="text-blue-600 hover:underline flex items-center"
                  download
                >
                  <span className="mr-2">📊</span> Category Summary
                </a>
              </li>
              <li>
                <a 
                  href="/downloads/corrected_yearly_summary.csv" 
                  className="text-blue-600 hover:underline flex items-center"
                  download
                >
                  <span className="mr-2">📊</span> Yearly Summary
                </a>
              </li>
              <li>
                <a 
                  href="/downloads/period_summary.csv" 
                  className="text-blue-600 hover:underline flex items-center"
                  download
                >
                  <span className="mr-2">📊</span> Period Summary
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <Link to="/" className="text-blue-600 hover:underline">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};

export default TransactionAnalysisPage;
