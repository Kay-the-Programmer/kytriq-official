
import React, { useState, useEffect } from 'react';
import { usePerformanceMonitor } from '../utils/performanceMonitor';
import BlogPostCard from '../components/BlogPostCard';
import { BlogService, BlogPost } from '../services/api';

interface BlogPageProps {
    onNavigate: (page: string, id: string) => void;
}

const BlogPage: React.FC<BlogPageProps> = ({ onNavigate }) => {
    usePerformanceMonitor('BlogPage');
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [, setLoading] = useState<boolean>(true);
    const [, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBlogPosts = async () => {
            try {
                setLoading(true);
                const posts = await BlogService.getAll();
                setBlogPosts(posts);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch blog posts:', err);
                setError('Failed to load blog posts. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchBlogPosts().then(() => {
        }).catch((err) => console.error(err));
    }, []);

    const featuredPost = blogPosts.length > 0 ? blogPosts[0] : null;
    const otherPosts = blogPosts.length > 1 ? blogPosts.slice(1) : [];

    return (
        <div className="bg-brand-gray-50">
            {/* Page Header */}
            <div className="bg-white py-16 sm:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-brand-gray-900 tracking-tight">Kytriq Insights</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-brand-gray-600">
                        Articles, tutorials, and deep dives into the world of technology, from software engineering to hardware innovations.
                    </p>
                    <div className="mt-8 max-w-lg mx-auto">
                        <div className="relative">
                            <input
                                type="search"
                                placeholder="Search articles..."
                                className="w-full pl-12 pr-4 py-3 border border-brand-gray-300 rounded-full focus:ring-techflex-orange focus:border-techflex-orange"
                                aria-label="Search articles"
                            />
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-brand-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                    {featuredPost && <BlogPostCard post={featuredPost} onNavigate={onNavigate} isFeatured={true} />}
                </div>

                <h2 className="text-3xl font-bold text-brand-gray-900 mb-8 border-b border-brand-gray-200 pb-4">Latest Articles</h2>

                {otherPosts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {otherPosts.map(post => (
                            <BlogPostCard key={post.id} post={post} onNavigate={onNavigate} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 border-2 border-dashed border-brand-gray-200 rounded-2xl">
                        <h3 className="text-2xl font-semibold text-brand-gray-700">No more articles found</h3>
                        <p className="mt-2 text-brand-gray-500">Check back later for more insights!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogPage;
