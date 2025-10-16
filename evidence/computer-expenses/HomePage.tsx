import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Computer Expenses Analysis Framework</h1>
        <p className="text-xl text-gray-600">
          A comprehensive framework for analyzing, categorizing, and justifying computer expenses
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-3">Framework Overview</h2>
          <p className="text-gray-600 mb-4">
            Understand the structure and methodology of the computer expenses analysis framework.
          </p>
          <Link to="/framework" className="text-blue-600 hover:underline">
            View Framework →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-3">Analysis Templates</h2>
          <p className="text-gray-600 mb-4">
            Access templates for analyzing consolidated revenues, profits, and expenses.
          </p>
          <Link to="/templates" className="text-blue-600 hover:underline">
            View Templates →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-3">Expense Analysis</h2>
          <p className="text-gray-600 mb-4">
            Explore the detailed analysis of computer expenses for March and April 2025.
          </p>
          <Link to="/expense-analysis" className="text-blue-600 hover:underline">
            View Expense Analysis →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow bg-blue-50 border-l-4 border-blue-500">
          <h2 className="text-2xl font-semibold mb-3">Transaction Analysis</h2>
          <p className="text-gray-600 mb-4">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">NEW</span> Explore categorized historical transactions from 2022-2025.
          </p>
          <Link to="/transaction-analysis" className="text-blue-600 hover:underline">
            View Transaction Analysis →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-3">SARS Documentation</h2>
          <p className="text-gray-600 mb-4">
            Prepare for SARS audits with comprehensive documentation and justifications.
          </p>
          <Link to="/sars-documentation" className="text-blue-600 hover:underline">
            View SARS Documentation →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-3">Downloads</h2>
          <p className="text-gray-600 mb-4">
            Download all framework files, templates, and analysis documents.
          </p>
          <Link to="/downloads" className="text-blue-600 hover:underline">
            View Downloads →
          </Link>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4">Recent Updates</h2>
        <ul className="space-y-3">
          <li className="flex items-start">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium mr-2 mt-1">NEW</span>
            <div>
              <p className="font-medium">Historical Transaction Analysis (June 2025)</p>
              <p className="text-gray-600">Comprehensive categorization of 2,570 transactions from 2022-2025 with visualizations and summaries.</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-medium mr-2 mt-1">UPDATE</span>
            <div>
              <p className="font-medium">Framework Website Launch (May 2025)</p>
              <p className="text-gray-600">Initial deployment of the Computer Expenses Analysis Framework website.</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HomePage;
