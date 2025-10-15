import React from 'react';
import { siteConfig } from '../lib/siteConfig';

const ExpenseAnalysisPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Computer Expense Analysis</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">March-April 2025 Analysis</h2>
        <p className="mb-4">
          This section presents the analysis of computer expenses for March and April 2025, based on the extracted data from the provided Excel file.
          The analysis includes expense distribution by month, top vendors, expense categories, and detailed descriptions.
        </p>
        
        <div className="mt-6 space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Key Findings</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Total Expenditure:</strong> R1,221,512.25</li>
              <li><strong>Number of Transactions:</strong> 361 (210 in March, 151 in April)</li>
              <li><strong>Number of Unique Vendors:</strong> 81</li>
              <li><strong>Average Transaction Amount:</strong> R3,383.69</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Expense Distribution by Month</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 border-b border-gray-300 text-left">Month</th>
                    <th className="py-2 px-4 border-b border-gray-300 text-left">Amount (R)</th>
                    <th className="py-2 px-4 border-b border-gray-300 text-left">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-4 border-b border-gray-300">March 2025</td>
                    <td className="py-2 px-4 border-b border-gray-300">R625,764.79</td>
                    <td className="py-2 px-4 border-b border-gray-300">51.2%</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-gray-300">April 2025</td>
                    <td className="py-2 px-4 border-b border-gray-300">R595,747.46</td>
                    <td className="py-2 px-4 border-b border-gray-300">48.8%</td>
                  </tr>
                  <tr className="bg-gray-50 font-medium">
                    <td className="py-2 px-4 border-b border-gray-300">Total</td>
                    <td className="py-2 px-4 border-b border-gray-300">R1,221,512.25</td>
                    <td className="py-2 px-4 border-b border-gray-300">100%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Top 10 Vendors by Expense</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-2 px-4 border-b border-gray-300 text-left">Vendor</th>
                    <th className="py-2 px-4 border-b border-gray-300 text-left">Amount (R)</th>
                    <th className="py-2 px-4 border-b border-gray-300 text-left">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-4 border-b border-gray-300">Shopify</td>
                    <td className="py-2 px-4 border-b border-gray-300">R453,394.12</td>
                    <td className="py-2 px-4 border-b border-gray-300">37.1%</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-gray-300">OpenAI</td>
                    <td className="py-2 px-4 border-b border-gray-300">R116,801.51</td>
                    <td className="py-2 px-4 border-b border-gray-300">9.6%</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-gray-300">Auth0.com</td>
                    <td className="py-2 px-4 border-b border-gray-300">R113,608.40</td>
                    <td className="py-2 px-4 border-b border-gray-300">9.3%</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-gray-300">Windsurf</td>
                    <td className="py-2 px-4 border-b border-gray-300">R61,464.72</td>
                    <td className="py-2 px-4 border-b border-gray-300">5.0%</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-gray-300">Microsoft</td>
                    <td className="py-2 px-4 border-b border-gray-300">R38,155.61</td>
                    <td className="py-2 px-4 border-b border-gray-300">3.1%</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-gray-300">Holaspirit</td>
                    <td className="py-2 px-4 border-b border-gray-300">R25,868.53</td>
                    <td className="py-2 px-4 border-b border-gray-300">2.1%</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-gray-300">Triple Whale</td>
                    <td className="py-2 px-4 border-b border-gray-300">R23,544.55</td>
                    <td className="py-2 px-4 border-b border-gray-300">1.9%</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-gray-300">CassidyAI</td>
                    <td className="py-2 px-4 border-b border-gray-300">R19,413.67</td>
                    <td className="py-2 px-4 border-b border-gray-300">1.6%</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-gray-300">Github</td>
                    <td className="py-2 px-4 border-b border-gray-300">R19,057.38</td>
                    <td className="py-2 px-4 border-b border-gray-300">1.6%</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b border-gray-300">Other vendors</td>
                    <td className="py-2 px-4 border-b border-gray-300">R349,203.76</td>
                    <td className="py-2 px-4 border-b border-gray-300">28.6%</td>
                  </tr>
                  <tr className="bg-gray-50 font-medium">
                    <td className="py-2 px-4 border-b border-gray-300">Total</td>
                    <td className="py-2 px-4 border-b border-gray-300">R1,221,512.25</td>
                    <td className="py-2 px-4 border-b border-gray-300">100%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <a 
            href="/downloads/computer_expenses_mar_apr_2025.csv" 
            download
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Download Complete Transaction Data (CSV)
          </a>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Expense Categories</h2>
        <p className="mb-6">
          Computer expenses have been categorized into the following groups to facilitate analysis and SARS justification:
        </p>
        
        <div className="space-y-6">
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="text-lg font-medium mb-2">Software Subscriptions and Licenses</h3>
            <p className="mb-2">E-commerce platforms, productivity suites, financial software, and development tools.</p>
            <p className="text-sm text-gray-600">Examples: Shopify, Microsoft, Google Suite, Intuit, Github</p>
          </div>
          
          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="text-lg font-medium mb-2">Cloud Services and Hosting</h3>
            <p className="mb-2">Web hosting, cloud computing, and content delivery networks.</p>
            <p className="text-sm text-gray-600">Examples: Digital Ocean, Vercel, Linode.akam</p>
          </div>
          
          <div className="border-l-4 border-purple-500 pl-4">
            <h3 className="text-lg font-medium mb-2">Development and Productivity Tools</h3>
            <p className="mb-2">Development environments, technical research tools, and business software suites.</p>
            <p className="text-sm text-gray-600">Examples: GitPOD, Wappalyzer, Freshworks</p>
          </div>
          
          <div className="border-l-4 border-red-500 pl-4">
            <h3 className="text-lg font-medium mb-2">Security and Authentication</h3>
            <p className="mb-2">Identity management, verification services, and security monitoring.</p>
            <p className="text-sm text-gray-600">Examples: Auth0.com, Beenverified</p>
          </div>
          
          <div className="border-l-4 border-yellow-500 pl-4">
            <h3 className="text-lg font-medium mb-2">Marketing and Analytics</h3>
            <p className="mb-2">Social media advertising, website building, and analytics tools.</p>
            <p className="text-sm text-gray-600">Examples: Facebook, Wix</p>
          </div>
          
          <div className="border-l-4 border-indigo-500 pl-4">
            <h3 className="text-lg font-medium mb-2">Communication and Collaboration</h3>
            <p className="mb-2">Email services, application frameworks, and team collaboration platforms.</p>
            <p className="text-sm text-gray-600">Examples: Sinch Mailgun, Frappe</p>
          </div>
          
          <div className="border-l-4 border-pink-500 pl-4">
            <h3 className="text-lg font-medium mb-2">AI and Machine Learning</h3>
            <p className="mb-2">AI services, content generation tools, and data processing tools.</p>
            <p className="text-sm text-gray-600">Examples: OpenAI, Huggingface, Lemsqzy</p>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Related Documents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow-sm rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2">Consolidated Report</h3>
            <p className="text-gray-600 mb-4">Comprehensive analysis and findings from March-April 2025</p>
            <a 
              href="/framework/consolidated-report" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              View Document
            </a>
          </div>
          <div className="bg-white shadow-sm rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2">Computer Expense Descriptions Template</h3>
            <p className="text-gray-600 mb-4">Template for describing each expense in layman's terms</p>
            <a 
              href="/templates/computer-expense-descriptions" 
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

export default ExpenseAnalysisPage;
