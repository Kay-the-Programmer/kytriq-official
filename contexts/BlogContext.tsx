import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createBaseContext, BaseContextState } from './BaseContext';
import { BlogService } from '../services/api';

// BlogPost interface (moved from ContentContext)
export interface BlogPost {
  id: string;
  title: string;
  author: string;
  authorAvatarUrl: string;
  date: string;
  tags: string[];
  imageUrl: string;
  excerpt: string;
  content: string;
}

// Blog context interface
export interface BlogContextState extends BaseContextState {
  blogPosts: BlogPost[];
  getBlogPostById: (id: string) => BlogPost | undefined;
  saveBlogPost: (post: BlogPost) => Promise<void>;
  deleteBlogPost: (postId: string) => Promise<void>;
}

// Create the blog context
const { Context, Provider, useBaseContext } = createBaseContext<BlogContextState>('Blog');

// Export the blog provider component
export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  // Fetch blog posts on mount
  useEffect(() => {
    const fetchBlogPosts = async () => {
      const abortController = new AbortController();
      const signal = abortController.signal;

      try {
        const blogData = await BlogService.getAll({}, signal);

        // Check if the request was aborted before updating state
        if (!signal.aborted) {
          setBlogPosts(blogData || []);
        }
      } catch (error) {
        // Don't update state if the request was aborted
        if (signal.aborted) return;

        console.error('Error fetching blog posts:', error);
      }

      return () => {
        abortController.abort();
      };
    };

    fetchBlogPosts();
  }, []);

  // Get blog post by ID - memoized to prevent unnecessary recalculations
  const getBlogPostById = useCallback((id: string) => {
    return blogPosts.find(post => post.id === id);
  }, [blogPosts]);

  // Save blog post
  const saveBlogPost = useCallback(async (post: BlogPost) => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    try {
      // If post.id is undefined or empty, it's a new blog post
      const isNew = !post.id || !blogPosts.find(p => p.id === post.id);
      const savedPost = isNew 
        ? await BlogService.create(post, signal)
        : await BlogService.update(post.id, post, signal);

      // Check if the request was aborted before updating state
      if (signal.aborted) return;

      // Check if savedPost is null or undefined before accessing its properties
      if (!savedPost) {
        console.error('Failed to save blog post: API returned null or undefined');
        return;
      }

      setBlogPosts(prev => 
        isNew 
          ? [savedPost, ...prev] 
          : prev.map(p => p.id === savedPost.id ? savedPost : p)
      );
    } catch (error) {
      // Don't update state if the request was aborted
      if (signal.aborted) return;

      console.error('Failed to save blog post:', error);
    } finally {
      abortController.abort();
    }
  }, [blogPosts]);

  // Delete blog post
  const deleteBlogPost = useCallback(async (postId: string) => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    try {
      await BlogService.delete(postId, signal);

      // Check if the request was aborted before updating state
      if (signal.aborted) return;

      setBlogPosts(prev => prev.filter(post => post.id !== postId));
    } catch (error) {
      // Don't update state if the request was aborted
      if (signal.aborted) return;

      console.error('Failed to delete blog post:', error);
    } finally {
      abortController.abort();
    }
  }, []);

  // Create the context value with memoization to prevent unnecessary re-renders
  const value = useMemo(() => ({
    blogPosts,
    getBlogPostById,
    saveBlogPost,
    deleteBlogPost
  }), [blogPosts, getBlogPostById, saveBlogPost, deleteBlogPost]);

  return (
    <Provider initialState={value}>
      {children}
    </Provider>
  );
};

// Export the hook to use the blog context
export const useBlogContext = () => useBaseContext();

// Re-export the BlogPost interface explicitly
export type { BlogPost };
