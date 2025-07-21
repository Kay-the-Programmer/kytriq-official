
import React from 'react';
import { useContent } from '../contexts/ContentContext';
import Icon from '../components/Icon';
import { useNavigate } from 'react-router-dom';

const AdminCareersPage: React.FC = () => {
  const { jobOpenings, deleteJobOpening } = useContent();
  const navigate = useNavigate();

  const handleEdit = (id: string) => {
    navigate(`/admin-career-form/${id}`);
  };

  const handleAddNew = () => {
    navigate('/admin-career-form');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this job opening? This action cannot be undone.')) {
        deleteJobOpening(id);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-brand-gray-900">Job Openings</h1>
        <button onClick={handleAddNew} className="bg-techflex-blue hover:bg-techflex-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
          <Icon name="plus" className="w-5 h-5" />
          Add New Job
        </button>
      </div>
      <div className="bg-white shadow-md rounded-2xl overflow-hidden border border-brand-gray-100">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-brand-gray-200">
            <thead className="bg-brand-gray-50">
                <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">Title</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">Department</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">Location</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-brand-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-brand-gray-200">
                {jobOpenings.map(job => (
                <tr key={job.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-brand-gray-900">{job.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-gray-500">{job.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-gray-500">{job.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {job.type}
                       </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleEdit(job.id)} className="text-techflex-blue hover:text-techflex-blue-700 mr-4 font-semibold">Edit</button>
                    <button onClick={() => handleDelete(job.id)} className="text-red-600 hover:text-red-800 font-semibold">Delete</button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCareersPage;
