
import React, { useState, useEffect } from 'react';
import { BlogPost } from '../contexts/ContentContext';
import { useContent } from '../contexts/ContentContext';
import { GeminiService } from '../services/api';
import Icon from '../components/Icon';

interface AdminBlogFormProps {
  post: BlogPost | null;
  onNavigate: (page: string) => void;
}

const emptyPost: BlogPost = {
    id: '', title: '', author: '', authorAvatarUrl: '',
    date: new Date().toISOString().split('T')[0],
    tags: [], imageUrl: '', excerpt: '', content: '',
};

const AdminBlogForm: React.FC<AdminBlogFormProps> = ({ post, onNavigate }) => {
    const { saveBlogPost } = useContent();
    const [formData, setFormData] = useState<BlogPost>(post || emptyPost);
    const [isGenerating, setIsGenerating] = useState(false);
    const isNew = !post;

    useEffect(() => {
        setFormData(post || emptyPost);
    }, [post]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'tags') {
            setFormData(prev => ({ ...prev, tags: value.split(',').map(tag => tag.trim()) }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleGenerateContent = async () => {
        if (!formData.title) {
            alert('Please enter a post title first.');
            return;
        }
        setIsGenerating(true);
        try {
            const data = await GeminiService.generateBlogContent(formData.title, formData.tags);
            setFormData(prev => ({ ...prev, content: data.content, excerpt: data.excerpt }));
        } catch (error) {
            console.error('AI content generation failed:', error);
            alert('Failed to generate content. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const postToSave: BlogPost = {
            ...formData,
            id: isNew ? `blog_${Date.now()}` : formData.id,
            date: new Date(formData.date).toISOString().split('T')[0],
        };
        await saveBlogPost(postToSave);
        onNavigate('admin');
    };

    const FormField: React.FC<{ label: string; name: keyof BlogPost; type?: string; children?: React.ReactNode }> = ({ label, name, type = 'text', children }) => (
      <div>
        <label htmlFor={name.toString()} className="block text-sm font-medium text-brand-gray-700">{label}</label>
        {children ? (
          children
        ) : (
          <input
            type={type}
            id={name.toString()}
            name={name.toString()}
            value={name === 'tags' ? (formData[name] as string[]).join(', ') : formData[name] as string}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-techflex-blue focus:ring-techflex-blue sm:text-sm"
          />
        )}
      </div>
    );

    return (
        <div className="bg-brand-gray-50 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-3xl mx-auto">
                    <button onClick={() => onNavigate('admin')} className="flex items-center text-sm font-semibold text-brand-gray-600 hover:text-techflex-blue transition-colors mb-6">
                        <Icon name="chevron-left" className="w-4 h-4 mr-1" />
                        Back to Content Management
                    </button>

                    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg space-y-8">
                        <h1 className="text-2xl font-bold text-brand-gray-900 border-b pb-4">
                            {isNew ? 'Add New Blog Post' : 'Edit Blog Post'}
                        </h1>

                        <FormField label="Post Title" name="title" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField label="Author Name" name="author" />
                            <FormField label="Author Avatar URL" name="authorAvatarUrl" />
                            <FormField label="Publish Date" name="date" type="date" />
                            <FormField label="Image URL" name="imageUrl" />
                        </div>

                        <FormField label="Tags (comma-separated)" name="tags" />

                        <FormField label="Excerpt" name="excerpt">
                            <textarea id="excerpt" name="excerpt" value={formData.excerpt} onChange={handleChange} rows={3} className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-techflex-blue focus:ring-techflex-blue sm:text-sm"></textarea>
                        </FormField>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label htmlFor="content" className="block text-sm font-medium text-brand-gray-700">Full Content (Markdown supported)</label>
                                <button
                                    type="button"
                                    onClick={handleGenerateContent}
                                    disabled={isGenerating}
                                    className="flex items-center gap-1.5 text-xs font-semibold text-techflex-blue hover:text-techflex-blue-700 disabled:opacity-50 disabled:cursor-wait"
                                >
                                    <Icon name="sparkles" className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                                    {isGenerating ? 'Generating...' : 'Generate with AI'}
                                </button>
                            </div>
                            <textarea id="content" name="content" value={formData.content} onChange={handleChange} rows={10} className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-techflex-blue focus:ring-techflex-blue sm:text-sm"></textarea>
                        </div>

                        <div className="flex justify-end pt-4 border-t">
                            <button type="button" onClick={() => onNavigate('admin')} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-techflex-blue-500 mr-3">
                                Cancel
                            </button>
                            <button type="submit" className="bg-techflex-orange hover:bg-techflex-orange-600 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300">
                                Save Post
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminBlogForm;
