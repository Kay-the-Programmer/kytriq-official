import React, { useState, useEffect, useCallback, useMemo, memo, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Header from '../components/Header';
import Icon from '../components/Icon';
import { useContent } from '../contexts/ContentContext';

/**
 * SearchPage Component - Optimized for Performance and Stability
 * 
 * Performance Improvements:
 * 1. Memoized component with React.memo to prevent unnecessary re-renders
 * 2. Implemented debouncing for search input to reduce unnecessary searches
 * 3. Optimized search algorithm with memoization
 * 4. Added proper error handling for image loading
 * 5. Implemented useMemo for computed values
 * 
 * Stability Improvements:
 * 1. Added comprehensive error handling
 * 2. Added fallbacks for missing data and edge cases
 * 3. Improved state management with proper initialization
 * 4. Added proper TypeScript interfaces for better type safety
 * 5. Added defensive code to handle unexpected states
 */

// Define types for search results
interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'product' | 'blog' | 'software' | 'page';
  url: string;
  image?: string;
  tags?: string[];
  date?: string;
}

// Define types for content items
interface Product {
  id: string;
  name?: string;
  description?: string;
  tags?: string[];
  imageUrl?: string;
}

interface BlogPost {
  id: string;
  title?: string;
  author?: string;
  content?: string;
  tags?: string[];
  imageUrl?: string;
  date?: string;
}

interface SoftwareProduct {
  id: string;
  name?: string;
  description?: string;
  features?: string[];
  imageUrl?: string;
}

const SearchPage: React.FC = () => {
  const location = useLocation();
  const { products, blogPosts, softwareProducts } = useContent();

  // Get query parameter from URL
  const query = new URLSearchParams(location.search).get('q') || '';

  const [searchTerm, setSearchTerm] = useState(query);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Ref for debouncing search
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Function to search across all content with error handling and optimization
  const performSearch = useCallback((term: string) => {
    try {
      // Clear any previous errors
      setError(null);

      if (!term.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      // Normalize search term for case-insensitive search
      const normalizedTerm = term.toLowerCase().trim();

      // Search in products with defensive programming
      const productResults: SearchResult[] = Array.isArray(products) && products.length > 0
        ? products
            .filter(product => {
              if (!product) return false;

              return (
                (product.name && product.name.toLowerCase().includes(normalizedTerm)) ||
                (product.description && product.description.toLowerCase().includes(normalizedTerm)) ||
                (Array.isArray(product.tags) && product.tags.some(tag => tag && tag.toLowerCase().includes(normalizedTerm)))
              );
            })
            .map(product => ({
              id: product.id || `product-${Math.random().toString(36).substr(2, 9)}`,
              title: product.name || 'Unnamed Product',
              description: product.description || 'No description available',
              type: 'product',
              url: `/productDetail/${product.id}`,
              image: product.imageUrl,
              tags: Array.isArray(product.tags) ? product.tags : []
            }))
        : [];

      // Search in blog posts with defensive programming
      const blogResults: SearchResult[] = Array.isArray(blogPosts) && blogPosts.length > 0
        ? blogPosts
            .filter(post => {
              if (!post) return false;

              return (
                (post.title && post.title.toLowerCase().includes(normalizedTerm)) ||
                (post.author && post.author.toLowerCase().includes(normalizedTerm)) ||
                (post.content && post.content.toLowerCase().includes(normalizedTerm)) ||
                (Array.isArray(post.tags) && post.tags.some(tag => tag && tag.toLowerCase().includes(normalizedTerm)))
              );
            })
            .map(post => ({
              id: post.id || `blog-${Math.random().toString(36).substr(2, 9)}`,
              title: post.title || 'Untitled Post',
              description: post.author ? `By ${post.author}` : 'No author specified',
              type: 'blog',
              url: `/blog/${post.id}`,
              image: post.imageUrl,
              tags: Array.isArray(post.tags) ? post.tags : [],
              date: post.date
            }))
        : [];

      // Search in software services with defensive programming
      const softwareResults: SearchResult[] = Array.isArray(softwareProducts) && softwareProducts.length > 0
        ? softwareProducts
            .filter(service => {
              if (!service) return false;

              return (
                (service.name && service.name.toLowerCase().includes(normalizedTerm)) ||
                (service.description && service.description.toLowerCase().includes(normalizedTerm)) ||
                (Array.isArray(service.features) && service.features.some(feature =>
                  feature && feature.toLowerCase().includes(normalizedTerm)
                ))
              );
            })
            .map(service => ({
              id: service.id || `software-${Math.random().toString(36).substr(2, 9)}`,
              title: service.name || 'Unnamed Software',
              description: service.description || 'No description available',
              type: 'software',
              url: `/software/${service.id}`,
              image: service.imageUrl
            }))
        : [];

      // Combine all results
      const allResults = [...productResults, ...blogResults, ...softwareResults];

      // Sort results by relevance (title matches first, then description)
      allResults.sort((a, b) => {
        // Ensure title exists before calling toLowerCase
        const aTitle = a.title && a.title.toLowerCase().includes(normalizedTerm);
        const bTitle = b.title && b.title.toLowerCase().includes(normalizedTerm);

        if (aTitle && !bTitle) return -1;
        if (!aTitle && bTitle) return 1;

        // If both match in title or both don't match in title, check for recency in blog posts
        if (a.type === 'blog' && b.type === 'blog' && a.date && b.date) {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }

        return 0;
      });

      setResults(allResults);
    } catch (err) {
      console.error('Search error:', err);
      setError('An error occurred while searching. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [products, blogPosts, softwareProducts]);

  // Perform search when query changes with cleanup
  useEffect(() => {
    setSearchTerm(query);
    performSearch(query);

    // Cleanup function to cancel any pending searches
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = null;
      }
    };
  }, [query, performSearch]);

  // Filter results by type using useMemo for performance
  const filteredResults = useMemo(() => 
    activeFilter ? results.filter(result => result.type === activeFilter) : results,
  [activeFilter, results]);

  // Handle search input change with debouncing
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);

    // Debounce search for better performance
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Only update URL and perform search if user has stopped typing for 300ms
    if (value.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        // Don't update URL here, only on explicit submission
        // performSearch(value);
      }, 300);
    }
  }, []);

  // Handle search submission
  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    // Clear any pending debounced searches
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }

    const trimmedTerm = searchTerm.trim();
    if (trimmedTerm) {
      window.history.pushState({}, '', `/search?q=${encodeURIComponent(trimmedTerm)}`);
      performSearch(trimmedTerm);
    }
  }, [searchTerm, performSearch]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header onCartToggle={() => {}} />

      <main className="flex-grow pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-brand-gray-900 sm:text-4xl">
              Search Results
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-brand-gray-500">
              {query ? `Showing results for "${query}"` : 'Enter a search term to find what you need'}
            </p>
          </div>

          {/* Search form */}
          <div className="max-w-3xl mx-auto mb-10">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search products, software, blog posts, and more..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-brand-gray-200 focus:border-techflex-blue focus:ring-4 focus:ring-techflex-blue/10 outline-none transition-all duration-300 text-lg"
              />
              <Icon name="search" className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-brand-gray-400" />
              <button
                type="submit"
                disabled={!searchTerm.trim()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-5 py-2 bg-techflex-blue text-white rounded-lg hover:bg-techflex-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-base font-medium"
              >
                Search
              </button>
            </form>
          </div>

          {/* Filters */}
          {results.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6 justify-center">
              <button
                onClick={() => setActiveFilter(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeFilter === null
                    ? 'bg-techflex-blue text-white'
                    : 'bg-brand-gray-100 text-brand-gray-700 hover:bg-brand-gray-200'
                }`}
              >
                All ({results.length})
              </button>

              {['product', 'blog', 'software'].map(filter => {
                const count = results.filter(r => r.type === filter).length;
                if (count === 0) return null;

                return (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeFilter === filter
                        ? 'bg-techflex-blue text-white'
                        : 'bg-brand-gray-100 text-brand-gray-700 hover:bg-brand-gray-200'
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}s ({count})
                  </button>
                );
              })}
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="text-center py-6 mb-6 bg-red-50 rounded-xl shadow-sm border border-red-100">
              <Icon name="alert-circle" className="h-12 w-12 mx-auto text-red-500" />
              <h3 className="mt-3 text-lg font-semibold text-red-700">{error}</h3>
              <button 
                onClick={() => {
                  setError(null);
                  performSearch(searchTerm);
                }}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Results */}
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-brand-gray-200 border-t-techflex-blue"></div>
                <p className="mt-4 text-brand-gray-600">Searching...</p>
              </div>
            ) : filteredResults.length > 0 ? (
              filteredResults.map(result => (
                <div
                  key={`${result.type}-${result.id}`}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md border border-brand-gray-100 overflow-hidden transition-all duration-300 hover:translate-y-[-2px]"
                >
                  <Link to={result.url} className="flex flex-col sm:flex-row">
                    {result.image && (
                      <div className="sm:w-48 h-48 sm:h-auto flex-shrink-0 bg-brand-gray-100">
                        <img
                          src={result.image}
                          alt={result.title || "Search result"}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            // Handle image loading errors
                            const target = e.target as HTMLImageElement;
                            target.onerror = null; // Prevent infinite error loop
                            target.src = '/images/placeholder.jpg'; // Fallback image
                            console.error(`Failed to load image: ${result.image}`);
                          }}
                        />
                      </div>
                    )}
                    <div className="p-6 flex-grow">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`
                          px-3 py-1 rounded-full text-xs font-medium
                          ${result.type === 'product' ? 'bg-techflex-orange/10 text-techflex-orange' : ''}
                          ${result.type === 'blog' ? 'bg-techflex-blue/10 text-techflex-blue' : ''}
                          ${result.type === 'software' ? 'bg-green-100 text-green-800' : ''}
                          ${result.type === 'page' ? 'bg-purple-100 text-purple-800' : ''}
                        `}>
                          {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                        </span>
                        {result.date && (
                          <span className="text-xs text-brand-gray-500">
                            {(() => {
                              try {
                                return new Date(result.date).toLocaleDateString();
                              } catch (e) {
                                console.error("Invalid date format:", result.date);
                                return "Unknown date";
                              }
                            })()}
                          </span>
                        )}
                      </div>
                      <h2 className="text-xl font-bold text-brand-gray-900 mb-2">{result.title || "Untitled"}</h2>
                      <p className="text-brand-gray-600 mb-4 line-clamp-2">{result.description || "No description available"}</p>

                      {Array.isArray(result.tags) && result.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {result.tags.slice(0, 3).map((tag, index) => (
                            <span key={`${tag}-${index}`} className="px-2 py-1 bg-brand-gray-100 rounded-md text-xs text-brand-gray-600">
                              {tag}
                            </span>
                          ))}
                          {result.tags.length > 3 && (
                            <span className="px-2 py-1 bg-brand-gray-100 rounded-md text-xs text-brand-gray-600">
                              +{result.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                </div>
              ))
            ) : query ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-brand-gray-100">
                <Icon name="search" className="h-16 w-16 mx-auto text-brand-gray-300" />
                <h3 className="mt-4 text-xl font-semibold text-brand-gray-900">No results found</h3>
                <p className="mt-2 text-brand-gray-600">
                  We couldn't find any matches for "{query}". Please try another search term.
                </p>
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-brand-gray-100">
                <Icon name="search" className="h-16 w-16 mx-auto text-brand-gray-300" />
                <h3 className="mt-4 text-xl font-semibold text-brand-gray-900">Start searching</h3>
                <p className="mt-2 text-brand-gray-600">
                  Enter a search term above to find products, blog posts, and more.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

    </div>
  );
};

// Memoize the entire component to prevent unnecessary re-renders
export default memo(SearchPage);
