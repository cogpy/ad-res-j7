import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import FrameworkPage from './components/FrameworkPage';
import TemplatesPage from './components/TemplatesPage';
import ExpenseAnalysisPage from './components/ExpenseAnalysisPage';
import SarsDocumentationPage from './components/SarsDocumentationPage';
import DownloadsPage from './components/DownloadsPage';
import TransactionAnalysisPage from './components/TransactionAnalysisPage';
import Layout from './components/Layout';
import FrameworkDetailPage from './components/FrameworkDetailPage';
import TemplateDetailPage from './components/TemplateDetailPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="framework" element={<FrameworkPage />} />
          <Route path="framework/:documentId" element={<FrameworkDetailPage />} />
          <Route path="templates" element={<TemplatesPage />} />
          <Route path="templates/:templateId" element={<TemplateDetailPage />} />
          <Route path="expense-analysis" element={<ExpenseAnalysisPage />} />
          <Route path="transaction-analysis" element={<TransactionAnalysisPage />} />
          <Route path="sars-documentation" element={<SarsDocumentationPage />} />
          <Route path="downloads" element={<DownloadsPage />} />
          {/* Redirect old URLs to new structure */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
