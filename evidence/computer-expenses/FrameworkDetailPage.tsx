import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MarkdownViewer from './MarkdownViewer';

interface DocumentMap {
  [key: string]: string;
}

interface TitleMap {
  [key: string]: string;
}

const FrameworkDetailPage = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Map of document IDs to their file paths
  const documentMap: DocumentMap = {
    'computer-expenses-analysis-framework': '/downloads/computer_expenses_analysis_framework.md',
    'sars-audit-documentation': '/downloads/sars_audit_documentation_package.md',
    'consolidated-report': '/downloads/consolidated_report.md'
  };

  // Map of document IDs to their titles
  const titleMap: TitleMap = {
    'computer-expenses-analysis-framework': 'Computer Expenses Analysis Framework',
    'sars-audit-documentation': 'SARS Audit Documentation Package',
    'consolidated-report': 'Consolidated Report'
  };

  useEffect(() => {
    if (!documentId || !documentMap[documentId]) {
      setError(true);
      setLoading(false);
      return;
    }

    fetch(documentMap[documentId])
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch document: ${response.status}`);
        }
        return response.text();
      })
      .then(text => {
        setContent(text);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading document:', error);
        setError(true);
        setLoading(false);
      });
  }, [documentId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-10">
          <p>Loading document...</p>
        </div>
      </div>
    );
  }

  if (error || !documentId || !documentMap[documentId]) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div>
              <p className="text-red-700">
                The requested document could not be found. Please check the URL and try again.
              </p>
            </div>
          </div>
        </div>
        <Link to="/framework" className="text-blue-600 hover:underline">
          ← Back to Framework
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{titleMap[documentId] || 'Framework Document'}</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <MarkdownViewer content={content} />
      </div>
      
      <div className="mt-8">
        <Link to="/framework" className="text-blue-600 hover:underline">
          ← Back to Framework
        </Link>
      </div>
    </div>
  );
};

export default FrameworkDetailPage;
