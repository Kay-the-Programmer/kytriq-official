
import React, { useState, useEffect } from 'react';
import { usePerformanceMonitor } from '../utils/performanceMonitor';
import { JobOpening } from '../contexts/ContentContext';
import { useContent } from '../contexts/ContentContext';
import { GeminiService } from '../services/api';
import Icon from '../components/Icon';

interface AdminCareerFormProps {
  job: JobOpening | null;
  onNavigate: (page: string) => void;
}

const emptyJob: JobOpening = {
  id: '', title: '', department: 'Engineering', location: 'Remote', type: 'Full-time',
  description: '', responsibilities: [], qualifications: [],
};

const departments: JobOpening['department'][] = ['Engineering', 'Design', 'Marketing', 'Product'];
const locations: JobOpening['location'][] = ['Remote', 'San Francisco, CA', 'New York, NY', 'Hybrid'];
const types: JobOpening['type'][] = ['Full-time', 'Part-time', 'Contract'];

const AdminCareerForm: React.FC<AdminCareerFormProps> = ({ job, onNavigate }) => {
    usePerformanceMonitor('AdminCareerForm');
    const { saveJobOpening } = useContent();
    const [formData, setFormData] = useState<JobOpening>(job || emptyJob);
    const [isGenerating, setIsGenerating] = useState(false);
    const isNew = !job;

    useEffect(() => {
        setFormData(job || emptyJob);
    }, [job]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'responsibilities' || name === 'qualifications') {
             setFormData(prev => ({ ...prev, [name]: value.split('\n') }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleGenerateContent = async () => {
        if (!formData.title || !formData.department) {
            alert('Please enter a job title and select a department first.');
            return;
        }
        setIsGenerating(true);
        try {
            const generatedData = await GeminiService.generateJobContent(formData.title, formData.department);

            // Check if generatedData is null or undefined before accessing its properties
            if (!generatedData) {
                console.error('AI content generation failed: API returned null or undefined');
                alert('Failed to generate content. Please try again.');
                return;
            }

            setFormData(prev => ({ 
                ...prev, 
                description: generatedData.description || '',
                responsibilities: generatedData.responsibilities || [],
                qualifications: generatedData.qualifications || [],
            }));
        } catch (error) {
            console.error('AI content generation failed:', error);
            alert('Failed to generate content. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const jobToSave = {
            ...formData,
            id: isNew ? `job_${Date.now()}` : formData.id,
            responsibilities: formData.responsibilities.filter(r => r.trim() !== ''),
            qualifications: formData.qualifications.filter(q => q.trim() !== ''),
        };
        await saveJobOpening(jobToSave);
        onNavigate('admin');
    };

    const FormField: React.FC<{ label: string; name: keyof JobOpening; children: React.ReactNode }> = ({ label, name, children }) => (
      <div>
        <label htmlFor={name.toString()} className="block text-sm font-medium text-brand-gray-700">{label}</label>
        {children}
      </div>
    );

    return (
        <div className="bg-brand-gray-50 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-3xl mx-auto">
                    <button onClick={() => onNavigate('admin')} className="flex items-center text-sm font-semibold text-brand-gray-600 hover:text-techflex-blue transition-colors mb-6">
                        <Icon name="chevron-left" className="w-4 h-4 mr-1" />
                        Back to Job Listings
                    </button>

                    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg space-y-8">
                        <h1 className="text-2xl font-bold text-brand-gray-900 border-b pb-4">
                            {isNew ? 'Add New Job Opening' : 'Edit Job Opening'}
                        </h1>

                        <FormField label="Job Title" name="title">
                             <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-techflex-blue focus:ring-techflex-blue sm:text-sm" />
                        </FormField>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FormField label="Department" name="department">
                                <select id="department" name="department" value={formData.department} onChange={handleChange} className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-techflex-blue focus:ring-techflex-blue sm:text-sm">
                                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </FormField>
                             <FormField label="Location" name="location">
                                <select id="location" name="location" value={formData.location} onChange={handleChange} className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-techflex-blue focus:ring-techflex-blue sm:text-sm">
                                    {locations.map(l => <option key={l} value={l}>{l}</option>)}
                                </select>
                            </FormField>
                            <FormField label="Type" name="type">
                                <select id="type" name="type" value={formData.type} onChange={handleChange} className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-techflex-blue focus:ring-techflex-blue sm:text-sm">
                                    {types.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </FormField>
                        </div>

                        <div>
                             <div className="flex justify-between items-center mb-1">
                                <label htmlFor="description" className="block text-sm font-medium text-brand-gray-700">Description, Responsibilities & Qualifications</label>
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
                            <FormField label="Description" name="description">
                                <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-techflex-blue focus:ring-techflex-blue sm:text-sm"></textarea>
                            </FormField>
                        </div>
                         <div>
                            <FormField label="Responsibilities (one per line)" name="responsibilities">
                                <textarea id="responsibilities" name="responsibilities" value={formData.responsibilities.join('\n')} onChange={handleChange} rows={6} className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-techflex-blue focus:ring-techflex-blue sm:text-sm"></textarea>
                            </FormField>
                        </div>
                        <div>
                           <FormField label="Qualifications (one per line)" name="qualifications">
                                <textarea id="qualifications" name="qualifications" value={formData.qualifications.join('\n')} onChange={handleChange} rows={6} className="mt-1 block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-techflex-blue focus:ring-techflex-blue sm:text-sm"></textarea>
                            </FormField>
                        </div>

                        <div className="flex justify-end pt-4 border-t">
                            <button type="button" onClick={() => onNavigate('admin')} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-techflex-blue-500 mr-3">
                                Cancel
                            </button>
                            <button type="submit" className="bg-techflex-orange hover:bg-techflex-orange-600 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300">
                                Save Job Opening
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminCareerForm;
