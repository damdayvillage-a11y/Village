'use client';

import { useState } from 'react';
import { Search, Filter, X, Calendar, DollarSign } from 'lucide-react';

interface SearchFilters {
  query: string;
  entity: 'all' | 'users' | 'products' | 'orders' | 'bookings' | 'homestays';
  dateFrom?: string;
  dateTo?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  category?: string;
}

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: string;
  url: string;
  metadata?: Record<string, any>;
}

export default function AdvancedSearch() {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    entity: 'all',
  });
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const performSearch = async () => {
    if (!filters.query.trim()) return;

    setLoading(true);
    try {
      // Add to history
      if (!searchHistory.includes(filters.query)) {
        setSearchHistory([filters.query, ...searchHistory.slice(0, 9)]);
      }

      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== 'all') {
          queryParams.append(key, String(value));
        }
      });

      const response = await fetch(`/api/admin/search?${queryParams}`);
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Search failed:', error);
      alert('Search failed. Please try again.');
    }
    setLoading(false);
  };

  const clearFilters = () => {
    setFilters({
      query: filters.query,
      entity: 'all',
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  };

  return (
    <div className="w-full">
      {/* Search Bar */}
      <div className="mb-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={filters.query}
              onChange={(e) => setFilters({ ...filters, query: e.target.value })}
              onKeyPress={handleKeyPress}
              placeholder="Search across all entities..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 border rounded-lg flex items-center gap-2 ${
              showFilters ? 'bg-blue-500 text-white' : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-5 h-5" />
            Filters
          </button>
          <button
            onClick={performSearch}
            disabled={loading || !filters.query.trim()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Search History */}
        {searchHistory.length > 0 && !filters.query && (
          <div className="mt-2">
            <p className="text-sm text-gray-500 mb-1">Recent Searches:</p>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((term, index) => (
                <button
                  key={index}
                  onClick={() => setFilters({ ...filters, query: term })}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Advanced Filters</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Clear Filters
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Entity Type */}
            <div>
              <label className="block text-sm font-medium mb-1">Entity Type</label>
              <select
                value={filters.entity}
                onChange={(e) => setFilters({ ...filters, entity: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">All Types</option>
                <option value="users">Users</option>
                <option value="products">Products</option>
                <option value="orders">Orders</option>
                <option value="bookings">Bookings</option>
                <option value="homestays">Homestays</option>
              </select>
            </div>

            {/* Date From */}
            <div>
              <label className="block text-sm font-medium mb-1">Date From</label>
              <input
                type="date"
                value={filters.dateFrom || ''}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-sm font-medium mb-1">Date To</label>
              <input
                type="date"
                value={filters.dateTo || ''}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Min Price */}
            <div>
              <label className="block text-sm font-medium mb-1">Min Price</label>
              <input
                type="number"
                value={filters.minPrice || ''}
                onChange={(e) =>
                  setFilters({ ...filters, minPrice: parseFloat(e.target.value) || undefined })
                }
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-sm font-medium mb-1">Max Price</label>
              <input
                type="number"
                value={filters.maxPrice || ''}
                onChange={(e) =>
                  setFilters({ ...filters, maxPrice: parseFloat(e.target.value) || undefined })
                }
                placeholder="999999"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={filters.status || ''}
                onChange={(e) => setFilters({ ...filters, status: e.target.value || undefined })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Any Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div>
        {results.length > 0 && (
          <div className="mb-2 text-sm text-gray-600">
            Found {results.length} result{results.length !== 1 ? 's' : ''}
          </div>
        )}

        <div className="space-y-3">
          {results.map((result) => (
            <div
              key={result.id}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={() => (window.location.href = result.url)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded font-medium">
                      {result.type}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{result.title}</h3>
                  <p className="text-gray-600 text-sm">{result.description}</p>
                  {result.metadata && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {Object.entries(result.metadata).map(([key, value]) => (
                        <span key={key} className="text-xs text-gray-500">
                          <span className="font-medium">{key}:</span> {String(value)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {results.length === 0 && filters.query && !loading && (
          <div className="text-center py-12 text-gray-500">
            <Search className="w-12 h-12 mx-auto mb-2 opacity-20" />
            <p>No results found for "{filters.query}"</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
