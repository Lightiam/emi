import React from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

interface SearchResult {
  id: string;
  name: string;
  title: string;
  description: string;
  rating: number;
  location: string;
  imageUrl: string;
}

const SearchResults: React.FC = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const results = location.state?.results || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Search Results for "{query}"
        </h1>
        <p className="text-gray-600">
          Found {results.length} results
        </p>
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((result: SearchResult) => (
            <div
              key={result.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={result.imageUrl}
                alt={result.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {result.name}
                </h2>
                <p className="text-gray-600 mb-2">{result.title}</p>
                <p className="text-gray-500 text-sm mb-4">{result.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1 text-gray-600">{result.rating}</span>
                  </div>
                  <span className="text-gray-500 text-sm">{result.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            No results found
          </h2>
          <p className="text-gray-600 mb-4">
            Try adjusting your search terms or browse all service providers
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            Try Another Search
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchResults; 