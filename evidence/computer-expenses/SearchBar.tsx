import React, { useState, useEffect } from 'react';
import { siteConfig } from '../lib/siteConfig';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  href: string;
  type: 'section' | 'template' | 'download';
}

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Create a combined array of all searchable items
  const allItems: SearchResult[] = [
    ...siteConfig.sections.map(section => ({
      id: section.id,
      title: section.title,
      description: section.description,
      href: section.href,
      type: 'section' as const
    })),
    ...siteConfig.templates.map(template => ({
      id: template.id,
      title: template.title,
      description: template.description,
      href: template.href,
      type: 'template' as const
    })),
    ...siteConfig.downloadFiles.map(file => ({
      id: file.id,
      title: file.title,
      description: file.description,
      href: `/downloads/${file.file}`,
      type: 'download' as const
    }))
  ];

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    
    // Simple search implementation
    const results = allItems.filter(item => {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        item.title.toLowerCase().includes(searchTermLower) ||
        item.description.toLowerCase().includes(searchTermLower)
      );
    });
    
    setSearchResults(results);
  }, [searchTerm]);

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          placeholder="Search framework content..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        )}
      </div>
      
      {isSearching && searchResults.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {searchResults.map((result) => (
            <a
              key={`${result.type}-${result.id}`}
              href={result.href}
              className="block px-4 py-3 hover:bg-gray-100 border-b border-gray-200 last:border-b-0"
            >
              <div className="flex items-start">
                <div className="flex-1">
                  <h4 className="text-sm font-medium">{result.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">{result.description}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ml-2 ${
                  result.type === 'section' ? 'bg-blue-100 text-blue-800' :
                  result.type === 'template' ? 'bg-purple-100 text-purple-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {result.type}
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
      
      {isSearching && searchTerm && searchResults.length === 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center">
          <p className="text-gray-600">No results found for "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
