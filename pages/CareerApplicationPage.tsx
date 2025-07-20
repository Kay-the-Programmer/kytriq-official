
import React, { useState } from 'react';
import { JobOpening } from '../data/careers';
import Icon from '../components/Icon';

interface CareerApplicationPageProps {
  job: JobOpening;
  onNavigate: (page: string, id?: string) => void;
  onCompleteApplication: (jobId: string) => void;
}

const FormField: React.FC<{ label: string; name: string; type?: string; placeholder?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean, children?: React.ReactNode, iconName?: string }> = 
({ label, name, type = 'text', placeholder, value, onChange, required = true, children, iconName }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-brand-gray-700 mb-1">{label}</label>
        <div className="relative">
            {iconName && <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><Icon name={iconName} className="h-5 w-5 text-brand-gray-400" /></div>}
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className={`block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-techflex-blue focus:ring-techflex-blue sm:text-sm ${iconName ? 'pl-10' : ''}`}
            />
        </div>
        {children}
    </div>
);


const CareerApplicationPage: React.FC<CareerApplicationPageProps> = ({ job, onNavigate, onCompleteApplication }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        linkedin: '',
        github: '',
        coverLetter: '',
    });
    const [resumeFile, setResumeFile] = useState<File | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setResumeFile(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple validation
        if (!resumeFile) {
            alert('Please upload your resume.');
            return;
        }
        onCompleteApplication(job.id);
    };

    return (
        <div className="bg-brand-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-8">
                        <button onClick={() => onNavigate('careers')} className="flex items-center text-sm font-semibold text-brand-gray-600 hover:text-techflex-blue transition-colors">
                            <Icon name="chevron-left" className="w-4 h-4 mr-1" />
                            Back to All Careers
                        </button>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-brand-gray-200">
                        <header className="text-center border-b border-brand-gray-200 pb-6 mb-8">
                            <h1 className="text-3xl font-extrabold text-brand-gray-900 tracking-tight">Apply for {job.title}</h1>
                            <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-brand-gray-500">
                                <span className="flex items-center gap-1.5"><Icon name="briefcase" className="w-4 h-4 text-brand-gray-400" />{job.department}</span>
                                <span className="flex items-center gap-1.5"><Icon name="map-pin" className="w-4 h-4 text-brand-gray-400" />{job.location}</span>
                            </div>
                        </header>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <h2 className="text-xl font-bold text-brand-gray-800">Your Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField label="Full Name" name="fullName" placeholder="Jane Doe" value={formData.fullName} onChange={handleInputChange} iconName="user" />
                                <FormField label="Email Address" name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleInputChange} />
                            </div>
                            <FormField label="Phone Number" name="phone" type="tel" placeholder="(123) 456-7890" value={formData.phone} onChange={handleInputChange} iconName="device-phone-mobile"/>
                            <FormField label="LinkedIn Profile" name="linkedin" placeholder="https://linkedin.com/in/..." value={formData.linkedin} onChange={handleInputChange} iconName="link" />
                            <FormField label="GitHub Profile (Optional)" name="github" placeholder="https://github.com/..." value={formData.github} onChange={handleInputChange} required={false} iconName="link"/>

                            <div>
                                <label htmlFor="resume" className="block text-sm font-medium text-brand-gray-700 mb-1">Resume/CV</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-brand-gray-300 border-dashed rounded-md">
                                    <div className="space-y-1 text-center">
                                        <Icon name="arrow-up-tray" className="mx-auto h-12 w-12 text-brand-gray-400" />
                                        <div className="flex text-sm text-brand-gray-600">
                                            <label htmlFor="resume-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-techflex-blue hover:text-techflex-blue-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-techflex-blue">
                                                <span>Upload a file</span>
                                                <input id="resume-upload" name="resume" type="file" className="sr-only" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        {resumeFile ? (
                                             <p className="text-sm font-semibold text-green-600 pt-2">✓ {resumeFile.name}</p>
                                        ) : (
                                            <p className="text-xs text-brand-gray-500">PDF, DOC, DOCX up to 10MB</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <label htmlFor="coverLetter" className="block text-sm font-medium text-brand-gray-700 mb-1">Cover Letter (Optional)</label>
                                <textarea
                                    id="coverLetter"
                                    name="coverLetter"
                                    rows={6}
                                    value={formData.coverLetter}
                                    onChange={handleInputChange}
                                    placeholder="Tell us why you're a great fit for this role..."
                                    className="block w-full rounded-md border-brand-gray-300 shadow-sm focus:border-techflex-blue focus:ring-techflex-blue sm:text-sm"
                                />
                            </div>

                            <div className="pt-6 border-t border-brand-gray-200">
                                <button type="submit" className="w-full bg-techflex-orange hover:bg-techflex-orange-600 text-white font-bold py-3 px-4 rounded-lg text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                    Submit Application
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CareerApplicationPage;
