'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

// Mock search data - in real implementation, this would come from an API
const searchData = [
  {
    title: 'About Damday Village',
    href: '/about',
    category: 'Page',
    description: 'Learn about our village history and culture',
    keywords: ['history', 'culture', 'heritage', 'village', 'about'],
  },
  {
    title: 'Book Homestay',
    href: '/book-homestay',
    category: 'Service',
    description: 'Book authentic village accommodation',
    keywords: ['homestay', 'booking', 'accommodation', 'stay', 'rooms'],
  },
  {
    title: 'Village Marketplace',
    href: '/marketplace',
    category: 'Service',
    description: 'Shop local products and crafts',
    keywords: ['shop', 'products', 'crafts', 'local', 'marketplace', 'buy'],
  },
  {
    title: '360° Village Tour',
    href: '/village-tour',
    category: 'Experience',
    description: 'Immersive virtual village exploration',
    keywords: ['tour', '360', 'virtual', 'explore', 'experience'],
  },
  {
    title: 'Digital Twin',
    href: '/digital-twin',
    category: 'Experience',
    description: '3D interactive village model',
    keywords: ['3d', 'digital', 'twin', 'model', 'interactive'],
  },
  {
    title: 'Community Events',
    href: '/events',
    category: 'Community',
    description: 'Village festivals and cultural events',
    keywords: ['events', 'festivals', 'cultural', 'community', 'celebrations'],
  },
  {
    title: 'Development Projects',
    href: '/projects',
    category: 'Community',
    description: 'Community development initiatives',
    keywords: ['projects', 'development', 'initiatives', 'community', 'sustainable'],
  },
  {
    title: 'Village Dashboard',
    href: '/dashboard',
    category: 'Tool',
    description: 'Analytics and village insights',
    keywords: ['dashboard', 'analytics', 'data', 'insights', 'statistics'],
  },
  {
    title: 'Contact Us',
    href: '/contact',
    category: 'Page',
    description: 'Get in touch with our team',
    keywords: ['contact', 'reach', 'support', 'help', 'team'],
  },
] as const;

interface SearchResult {
  title: string;
  href: string;
  category: string;
  description: string;
  keywords: readonly string[];
}

interface SearchBoxProps {
  className?: string;
  onResultClick?: () => void;
}

export function SearchBox({ className = '', onResultClick }: SearchBoxProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fuzzy search function
  const searchItems = (searchQuery: string): SearchResult[] => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase().trim();
    const words = query.split(' ').filter(word => word.length > 0);
    
    const scored = searchData.map(item => {
      let score = 0;
      
      // Title match (highest priority)
      if (item.title.toLowerCase().includes(query)) {
        score += 10;
      }
      
      // Keywords match
      const keywordMatches = item.keywords.filter(keyword => 
        keyword.toLowerCase().includes(query) ||
        words.some(word => keyword.toLowerCase().includes(word))
      ).length;
      score += keywordMatches * 5;
      
      // Description match
      if (item.description.toLowerCase().includes(query)) {
        score += 3;
      }
      
      // Partial word matches
      words.forEach(word => {
        if (item.title.toLowerCase().includes(word)) score += 2;
        if (item.description.toLowerCase().includes(word)) score += 1;
      });
      
      return { ...item, score };
    });
    
    return scored
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6); // Limit to 6 results
  };

  // Handle search input change
  useEffect(() => {
    if (query.length > 1) {
      const searchResults = searchItems(query);
      setResults(searchResults);
      setIsOpen(searchResults.length > 0);
      setSelectedIndex(-1);
    } else {
      setResults([]);
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  }, [query]);

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : results.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleResultClick(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleResultClick = (result: SearchResult) => {
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
    onResultClick?.();
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Page':
        return 'bg-blue-100 text-blue-800';
      case 'Service':
        return 'bg-green-100 text-green-800';
      case 'Experience':
        return 'bg-purple-100 text-purple-800';
      case 'Community':
        return 'bg-orange-100 text-orange-800';
      case 'Tool':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-yellow-900">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-neutral-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
          placeholder="Search village..."
          aria-label="Search the village website"
        />
        
        {/* Clear button */}
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            aria-label="Clear search"
          >
            <svg
              className="h-4 w-4 text-neutral-400 hover:text-neutral-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-neutral-200 overflow-hidden z-50 animate-fade-in">
          <div className="py-2">
            {results.map((result, index) => (
              <Link
                key={`${result.href}-${index}`}
                href={result.href}
                onClick={() => handleResultClick(result)}
                className={`block px-4 py-3 hover:bg-neutral-50 transition-colors duration-200 ${
                  selectedIndex === index ? 'bg-primary-50' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium text-neutral-900">
                        {highlightText(result.title, query)}
                      </h4>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(result.category)}`}>
                        {result.category}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 line-clamp-1">
                      {highlightText(result.description, query)}
                    </p>
                  </div>
                  <div className="ml-3 flex-shrink-0">
                    <svg
                      className="h-4 w-4 text-neutral-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Search Footer */}
          <div className="px-4 py-2 bg-neutral-50 border-t border-neutral-200">
            <div className="flex items-center justify-between text-xs text-neutral-500">
              <span>
                {results.length} result{results.length !== 1 ? 's' : ''} found
              </span>
              <div className="flex items-center gap-4">
                <span>↑↓ navigate</span>
                <span>↵ select</span>
                <span>esc close</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No Results */}
      {isOpen && query.trim() && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-neutral-200 p-4 z-50 animate-fade-in">
          <div className="text-center">
            <svg
              className="mx-auto h-8 w-8 text-neutral-400 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5-.816-6.201-2.181"
              />
            </svg>
            <p className="text-sm text-neutral-600">
              No results found for "{query}"
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              Try different keywords or browse our menu
            </p>
          </div>
        </div>
      )}
    </div>
  );
}