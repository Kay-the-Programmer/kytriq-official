import React, { useCallback, memo } from 'react';
import { BlogPost } from '../services/api';
import Icon from './Icon';

interface BlogPostCardProps {
  post: BlogPost;
  onNavigate: (page: string, id: string) => void;
  isFeatured?: boolean;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post, onNavigate, isFeatured = false }) => {
    // Memoize the click handler to prevent recreation on each render
    const handleCardClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        onNavigate('blog', post.id);
    }, [post.id, onNavigate]);

    // Memoize the formatted date to prevent recalculation on each render
    const formattedDate = React.useMemo(() => {
        return new Date(post.date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }, [post.date]);

    if (isFeatured) {
        return (
            <div 
                onClick={handleCardClick} 
                className="col-span-1 lg:col-span-2 group cursor-pointer grid lg:grid-cols-2 gap-8 items-center bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform-gpu"
            >
                <div className="overflow-hidden rounded-2xl">
                    <img 
                        src={post.imageUrl} 
                        alt={post.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy" // Add lazy loading for images
                    />
                </div>
                <div>
                    <div className="flex items-center gap-2 text-sm text-brand-gray-500 mb-3">
                        {post.tags.map(tag => (
                            <span key={tag} className="bg-techflex-blue-50 text-techflex-blue-600 font-semibold px-2 py-0.5 rounded">{tag}</span>
                        ))}
                    </div>
                    <h2 className="text-3xl font-bold text-brand-gray-900 group-hover:text-techflex-orange transition-colors">{post.title}</h2>
                    <p className="mt-4 text-brand-gray-600 line-clamp-3">{post.excerpt}</p>
                    <div className="mt-6 flex items-center gap-4">
                        <img 
                            src={post.authorAvatarUrl} 
                            alt={post.author} 
                            className="w-12 h-12 rounded-full"
                            loading="lazy"
                        />
                        <div>
                            <p className="font-semibold text-brand-gray-800">{post.author}</p>
                            <p className="text-sm text-brand-gray-500">{formattedDate}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div 
            onClick={handleCardClick} 
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 group overflow-hidden flex flex-col cursor-pointer transform-gpu"
        >
            <div className="relative overflow-hidden h-56">
                <img 
                    src={post.imageUrl} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                />
            </div>
            <div className="p-6 flex-grow flex flex-col">
                <div className="flex items-center gap-2 text-xs text-brand-gray-500 mb-2">
                    {post.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="bg-brand-gray-100 text-brand-gray-600 font-semibold px-2 py-0.5 rounded">{tag}</span>
                    ))}
                </div>
                <h3 className="text-xl font-bold text-brand-gray-800 group-hover:text-techflex-orange transition-colors duration-300 flex-grow">{post.title}</h3>
                <p className="mt-2 text-brand-gray-600 flex-grow text-sm line-clamp-3">{post.excerpt}</p>
                <div className="mt-4 pt-4 border-t border-brand-gray-100 flex items-center gap-3">
                    <img 
                        src={post.authorAvatarUrl} 
                        alt={post.author} 
                        className="w-10 h-10 rounded-full"
                        loading="lazy"
                    />
                    <div>
                        <p className="text-sm font-semibold text-brand-gray-800">{post.author}</p>
                        <p className="text-xs text-brand-gray-500">{formattedDate}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(BlogPostCard);