import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import BlogPostCardOptimized from '../components/BlogPostCardOptimized';
import { BlogService, BlogPost } from '../services/api';
import { usePerformanceMonitor } from '../utils/performanceMonitor';
import Icon from '../components/Icon';
import SearchInput from '../components/SearchInput';

// Import CSS file instead of using dynamic style injection
import './BlogPage.css';

interface BlogPageProps {
    onNavigate: (page: string, id: string) => void;
}

const BlogPageOptimized: React.FC<BlogPageProps> = ({ onNavigate }) => {
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');

    // Monitor component performance
    usePerformanceMonitor('BlogPage');

    // Fetch blog posts with optimized error handling
    useEffect(() => {
        let isMounted = true;

        const fetchBlogPosts = async () => {
            try {
                setLoading(true);
                const posts = await BlogService.getAll();
                
                if (isMounted) {
                    setBlogPosts(posts);
                    setError(null);
                }
            } catch (err) {
                console.error('Failed to fetch blog posts:', err);
                
                if (isMounted) {
                    setError('Failed to load blog posts. Please try again later.');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchBlogPosts();

        // Cleanup function to prevent state updates on unmounted component
        return () => {
            isMounted = false;
        };
    }, []);

    // Memoized search handler
    const handleSearchChange = useCallback((value: string) => {
        setSearchTerm(value);
    }, []);

    // Memoized filtered posts based on search term
    const filteredPosts = useMemo(() => {
        if (!searchTerm.trim()) return blogPosts;
        
        return blogPosts.filter(post => 
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [blogPosts, searchTerm]);

    // Memoized featured post and other posts
    const featuredPost = useMemo(() => 
        filteredPosts.length > 0 ? filteredPosts[0] : null
    , [filteredPosts]);
    
    const otherPosts = useMemo(() => 
        filteredPosts.length > 1 ? filteredPosts.slice(1) : []
    , [filteredPosts]);

    return (
        <div className="bg-brand-gray-50 animate-fadeIn">
            {/* Page Header with optimized classes */}
            <div className="blog-header py-16 sm:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fadeInUp">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-brand-gray-900 tracking-tight">Kytriq Insights</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-brand-gray-600">
                        Articles, tutorials, and deep dives into the world of technology, from software engineering to hardware innovations.
                    </p>
                    <div className="mt-8 max-w-lg mx-auto">
                        {/* Use the reusable SearchInput component with debouncing */}
                        <SearchInput
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Search articles..."
                            className="blog-search-input"
                            debounceTime={300}
                        />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {loading ? (
                    <div className="text-center py-16">
                        <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-techflex-blue transition ease-in-out duration-150 cursor-default">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-techflex-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Loading blog posts...
                        </div>
                    </div>
                ) : error ? (
                    <div className="text-center py-16 bg-red-50 rounded-xl border border-red-100">
                        <Icon name="exclamation-circle" className="h-12 w-12 mx-auto text-red-400 mb-4" />
                        <h3 className="text-xl font-semibold text-red-800 mb-2">Error Loading Posts</h3>
                        <p className="text-red-600">{error}</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                            {featuredPost && (
                                <div className="animate-fadeInUp">
                                    <BlogPostCardOptimized 
                                        post={featuredPost} 
                                        onNavigate={onNavigate} 
                                        isFeatured={true} 
                                    />
                                </div>
                            )}
                        </div>

                        <h2 className="text-3xl font-bold text-brand-gray-900 mb-8 border-b border-brand-gray-200 pb-4">
                            {searchTerm ? 'Search Results' : 'Latest Articles'}
                        </h2>

                        {otherPosts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {otherPosts.map((post, index) => (
                                    <div 
                                        key={post.id} 
                                        className={`animate-fadeInUp blog-card-delay-${Math.min(index + 1, 5)}`}
                                    >
                                        <BlogPostCardOptimized 
                                            post={post} 
                                            onNavigate={onNavigate} 
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 border-2 border-dashed border-brand-gray-200 rounded-2xl">
                                <Icon name="search" className="h-12 w-12 mx-auto text-brand-gray-300 mb-4" />
                                <h3 className="text-2xl font-semibold text-brand-gray-700">
                                    {searchTerm ? 'No matching articles found' : 'No articles found'}
                                </h3>
                                <p className="mt-2 text-brand-gray-500">
                                    {searchTerm 
                                        ? 'Try adjusting your search terms or browse all articles.' 
                                        : 'Check back later for more insights!'}
                                </p>
                                {searchTerm && (
                                    <button 
                                        onClick={() => setSearchTerm('')}
                                        className="mt-4 px-4 py-2 bg-techflex-blue text-white rounded-lg hover:bg-techflex-blue-600 transition-colors"
                                    >
                                        View All Articles
                                    </button>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(BlogPageOptimized);