import React, { useState } from 'react';
import { usePerformanceMonitor } from '../utils/performanceMonitor';
import { useNavigate } from 'react-router-dom';
import { useContent } from '../contexts/ContentContext';
import Icon from '../components/Icon';

const AdminCareersPage: React.FC = () => {
    usePerformanceMonitor('AdminCareersPage');
    const navigate = useNavigate();
    const { jobOpenings, jobApplications, deleteJobOpening, updateJobApplicationStatus, deleteJobApplication } = useContent();
    const [activeTab, setActiveTab] = useState<'openings' | 'applications'>('openings');
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

    const handleAddJob = () => {
        navigate('/admin-career-form');
    };

    const handleEditJob = (jobId: string) => {
        navigate(`/admin-career-form/${jobId}`);
    };

    const handleDeleteJob = async (jobId: string) => {
        if (window.confirm('Are you sure you want to delete this job opening?')) {
            await deleteJobOpening(jobId);
        }
    };

    const handleUpdateApplicationStatus = async (applicationId: string, status: 'pending' | 'reviewed' | 'accepted' | 'rejected') => {
        await updateJobApplicationStatus(applicationId, status);
    };

    const handleDeleteApplication = async (applicationId: string) => {
        if (window.confirm('Are you sure you want to delete this application?')) {
            await deleteJobApplication(applicationId);
        }
    };

    const filteredApplications = selectedJobId
        ? jobApplications.filter(app => app.jobId === selectedJobId)
        : jobApplications;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6 flex justify-between items-center">
                <div className="flex space-x-4">
                    <button
                        onClick={() => setActiveTab('openings')}
                        className={`px-4 py-2 rounded-lg font-medium ${
                            activeTab === 'openings'
                                ? 'bg-techflex-blue text-white'
                                : 'bg-white text-brand-gray-600 hover:bg-brand-gray-100'
                        }`}
                    >
                        Job Openings
                    </button>
                    <button
                        onClick={() => setActiveTab('applications')}
                        className={`px-4 py-2 rounded-lg font-medium ${
                            activeTab === 'applications'
                                ? 'bg-techflex-blue text-white'
                                : 'bg-white text-brand-gray-600 hover:bg-brand-gray-100'
                        }`}
                    >
                        Applications
                    </button>
                </div>
                {activeTab === 'openings' && (
                    <button
                        onClick={handleAddJob}
                        className="px-4 py-2 bg-techflex-blue text-white rounded-lg flex items-center"
                    >
                        <Icon name="plus" className="w-4 h-4 mr-2" />
                        Add Job
                    </button>
                )}
            </div>

            {activeTab === 'openings' && (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Title
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Department
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Location
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Applications
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {jobOpenings.map((job) => (
                                    <tr key={job.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{job.title}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{job.department}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{job.location}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">
                                                {jobApplications.filter(app => app.jobId === job.id).length}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleEditJob(job.id)}
                                                className="text-techflex-blue hover:text-techflex-blue-dark mr-4"
                                            >
                                                <Icon name="edit" className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteJob(job.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <Icon name="trash" className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'applications' && (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-4 border-b">
                        <select
                            value={selectedJobId || ''}
                            onChange={(e) => setSelectedJobId(e.target.value || null)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-techflex-blue focus:border-techflex-blue sm:text-sm"
                        >
                            <option value="">All Job Openings</option>
                            {jobOpenings.map((job) => (
                                <option key={job.id} value={job.id}>
                                    {job.title}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Job
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredApplications.map((application) => {
                                    const job = jobOpenings.find(j => j.id === application.jobId);
                                    return (
                                        <tr key={application.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{application.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">{application.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">{job?.title || 'Unknown'}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <select
                                                    value={application.status}
                                                    onChange={(e) => handleUpdateApplicationStatus(
                                                        application.id,
                                                        e.target.value as 'pending' | 'reviewed' | 'accepted' | 'rejected'
                                                    )}
                                                    className={`px-2 py-1 rounded text-sm font-medium ${
                                                        application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        application.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                                                        application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="reviewed">Reviewed</option>
                                                    <option value="accepted">Accepted</option>
                                                    <option value="rejected">Rejected</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => handleDeleteApplication(application.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <Icon name="trash" className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCareersPage;
