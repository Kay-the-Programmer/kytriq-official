
import React, { useState, useEffect } from 'react';
import Icon from '../components/Icon';
import { BlogService, BlogPost } from '../services/api';

interface BlogDetailPageProps {
    postId: string;
    onNavigate: (page: string) => void;
}

const BlogDetailPage: React.FC<BlogDetailPageProps> = ({ postId, onNavigate }) => {
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBlogPost = async () => {
            try {
                setLoading(true);
                const blogPost = await BlogService.getById(postId);
                setPost(blogPost);
                setError(null);
            } catch (err) {
                console.error(`Failed to fetch blog post with ID ${postId}:`, err);
                setError('Failed to load blog post. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchBlogPost();
    }, [postId]);

    if (loading) {
        return (
            <div className="bg-white py-12 flex justify-center items-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-techflex-blue mx-auto"></div>
                    <p className="mt-4 text-brand-gray-600">Loading post...</p>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="bg-white py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="text-red-500 mb-4">
                        <Icon name="exclamation-circle" className="w-12 h-12 mx-auto" />
                    </div>
                    <h1 className="text-2xl font-bold text-brand-gray-800 mb-4">
                        {error || "Blog post not found"}
                    </h1>
                    <button
                        onClick={() => onNavigate('blog')}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-techflex-blue hover:bg-techflex-blue-dark"
                    >
                        <Icon name="chevron-left" className="w-4 h-4 mr-2" />
                        Back to all articles
                    </button>
                </div>
            </div>
        );
    }

    const renderContent = (text: string) => {
        return text.split('\n\n').map((paragraph, index) => {
            const lines = paragraph.split('\n');
            const listItems = lines.filter(line => line.startsWith('- '));

            if (listItems.length > 0) {
                 return (
                    <ul key={index} className="list-disc list-inside space-y-2 my-4">
                        {listItems.map((item, i) => <li key={i}>{item.slice(2)}</li>)}
                    </ul>
                );
            }

            const content = lines.map((line, lineIndex) => {
                if (line.startsWith('**') && line.endsWith('**')) {
                    return <h3 key={lineIndex} className="text-2xl font-bold text-brand-gray-800 my-6">{line.slice(2, -2)}</h3>;
                }
                return <span key={lineIndex}>{line}<br/></span>;
            });
            return <p key={index} className="my-6">{content}</p>;
        });
    };

    return (
        <div className="bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Back Button & Breadcrumbs */}
                    <div className="mb-8">
                        <button
                            onClick={() => onNavigate('blog')}
                            className="flex items-center text-sm font-semibold text-brand-gray-600 hover:text-techflex-blue transition-colors"
                        >
                            <Icon name="chevron-left" className="w-4 h-4 mr-2" />
                            Back to all articles
                        </button>
                    </div>

                    {/* Post Header */}
                    <header className="mb-8">
                        <div className="flex items-center gap-2 text-sm text-brand-gray-500 mb-4">
                             {post.tags.map(tag => (
                                <span key={tag} className="bg-techflex-blue-50 text-techflex-blue-600 font-semibold px-3 py-1 rounded-full">{tag}</span>
                            ))}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-brand-gray-900 tracking-tight leading-tight">{post.title}</h1>
                        <div className="mt-6 flex items-center gap-4 border-t border-b border-brand-gray-200 py-4">
                            <img src={post.authorAvatarUrl} alt={post.author} className="w-14 h-14 rounded-full" />
                            <div>
                                <p className="font-bold text-brand-gray-800 text-lg">{post.author}</p>
                                <p className="text-sm text-brand-gray-500">Published on {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                        </div>
                    </header>

                    {/* Post Image */}
                    <div className="my-8 rounded-2xl overflow-hidden shadow-xl">
                        <img src={post.imageUrl} alt={post.title} className="w-full h-auto object-cover" />
                    </div>

                    {/* Post Content */}
                    <article className="prose prose-lg max-w-none text-brand-gray-700 leading-relaxed">
                        {renderContent(post.content)}
                    </article>

                     {/* Post Footer / Share */}
                    <footer className="mt-12 pt-8 border-t border-brand-gray-200 flex justify-between items-center">
                        <p className="font-semibold text-brand-gray-800">Share this article:</p>
                        <div className="flex gap-4">
                            <a href="#" className="text-brand-gray-500 hover:text-techflex-blue"><Icon name="twitter" className="w-6 h-6" /></a>
                            <a href="#" className="text-brand-gray-500 hover:text-techflex-blue"><Icon name="linkedin" className="w-6 h-6" /></a>
                            <a href="#" className="text-brand-gray-500 hover:text-techflex-blue"><Icon name="share" className="w-6 h-6" /></a>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default BlogDetailPage;
