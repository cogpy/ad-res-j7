import React from 'react';
import { siteConfig } from '../lib/siteConfig';

const DownloadsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Downloads</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Available Downloads</h2>
        <p className="mb-6">
          All framework documents, templates, and data files are available for download. 
          These files can be used offline and integrated into your existing systems and processes.
        </p>
        
        <div className="space-y-4">
          <h3 className="text-xl font-medium">Main Framework Documents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {siteConfig.downloadFiles.map((file) => (
              <div key={file.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="text-lg font-medium mb-2">{file.title}</h4>
                <p className="text-gray-600 mb-4">{file.description}</p>
                <a 
                  href={`/downloads/${file.file}`} 
                  download
                  className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors"
                >
                  Download File
                </a>
              </div>
            ))}
          </div>
          
          <h3 className="text-xl font-medium">Analysis Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {siteConfig.templates.map((template) => (
              <div key={template.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="text-lg font-medium mb-2">{template.title}</h4>
                <p className="text-gray-600 mb-4">{template.description}</p>
                <a 
                  href={`/downloads/${template.file}`} 
                  download
                  className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors"
                >
                  Download Template
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Usage Guidelines</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Markdown Files</h3>
            <p>
              All templates and documentation are provided in Markdown format (.md), which can be opened with any text editor 
              or specialized Markdown editor. These files can be converted to other formats like PDF or Word using various tools.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">CSV Data Files</h3>
            <p>
              Transaction data is provided in CSV format, which can be opened with spreadsheet applications like Microsoft Excel 
              or Google Sheets for further analysis and manipulation.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Customization</h3>
            <p>
              All templates can be customized to fit your specific requirements. You can add, remove, or modify sections as needed 
              while maintaining the overall structure and methodology.
            </p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            <h3 className="text-lg font-medium mb-2">Recommended Workflow</h3>
            <ol className="list-decimal pl-6 space-y-1">
              <li>Download the relevant templates and documents</li>
              <li>Customize them to fit your specific requirements</li>
              <li>Populate with your data as it becomes available</li>
              <li>Save versions with clear naming conventions</li>
              <li>Update regularly as new data becomes available</li>
              <li>Share with stakeholders in appropriate formats</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadsPage;
