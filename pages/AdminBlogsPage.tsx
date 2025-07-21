
import React from 'react';
import { useContent } from '../contexts/ContentContext';
import Icon from '../components/Icon';
import { useNavigate } from 'react-router-dom';

const AdminBlogsPage: React.FC = () => {
  const { blogPosts, deleteBlogPost } = useContent();
  const navigate = useNavigate();

  const handleEdit = (id: string) => {
    navigate(`/admin-blog-form/${id}`);
  };

  const handleAddNew = () => {
    navigate('/admin-blog-form');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
        deleteBlogPost(id);
    }
  }

  return (
    <div>
       <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-brand-gray-900">Blog Posts</h1>
        <button onClick={handleAddNew} className="bg-techflex-blue hover:bg-techflex-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
          <Icon name="plus" className="w-5 h-5" />
          Add New Post
        </button>
      </div>
      <div className="bg-white shadow-md rounded-2xl overflow-hidden border border-brand-gray-100">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-brand-gray-200">
            <thead className="bg-brand-gray-50">
                <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">Title</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">Author</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-brand-gray-200">
                {blogPosts.map(post => (
                <tr key={post.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-brand-gray-900">{post.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-gray-500">{post.author}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-gray-500">{new Date(post.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleEdit(post.id)} className="text-techflex-blue hover:text-techflex-blue-700 mr-4 font-semibold">Edit</button>
                    <button onClick={() => handleDelete(post.id)} className="text-red-600 hover:text-red-800 font-semibold">Delete</button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}

export default AdminBlogsPage;
