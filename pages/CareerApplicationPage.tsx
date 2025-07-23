import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { JobOpening, JobApplication } from '../contexts/ContentContext';
import { useContent } from '../contexts/ContentContext';
import Icon from '../components/Icon';

interface CareerApplicationPageProps {
    job: JobOpening;
    onNavigate: (page: string, id?: string) => void;
    onCompleteApplication: (jobId: string) => void;
}

// Memoized FormField component to prevent unnecessary re-renders
const FormField = React.memo<{
    label: string;
    name: string;
    type?: string;
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    children?: React.ReactNode;
    iconName?: string;
    description?: string;
}>(({ label, name, type = 'text', placeholder, value, onChange, required = true, children, iconName, description }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isValid, setIsValid] = useState(true);
    const inputRef = useRef<HTMLInputElement>(null);

    const validateField = useCallback(() => {
        if (required && !value.trim()) {
            setIsValid(false);
            return false;
        }
        if (type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            setIsValid(false);
            return false;
        }
        if (type === 'tel' && value && !/^[+]?[\d\s\-\(\)]{10,}$/.test(value)) {
            setIsValid(false);
            return false;
        }
        setIsValid(true);
        return true;
    }, [required, value, type]);

    // Debounced validation to improve performance
    useEffect(() => {
        const timer = setTimeout(validateField, 300);
        return () => clearTimeout(timer);
    }, [value, validateField]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e);
    }, [onChange]);

    const handleInputFocus = useCallback(() => {
        setIsFocused(true);
    }, []);

    const handleInputBlur = useCallback(() => {
        setIsFocused(false);
        validateField();
    }, [validateField]);

    return (
        <div className="group relative">
            <div className="flex items-center justify-between mb-2">
                <label htmlFor={name} className="block text-sm font-semibold text-brand-gray-700">
                    {label}
                    {required && <span className="text-techflex-orange ml-1">*</span>}
                </label>
                {description && (
                    <span className="text-xs text-brand-gray-500">{description}</span>
                )}
            </div>

            <div className="relative">
                {iconName && (
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 z-20">
                        <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${
                            isFocused ? 'from-techflex-blue-100 to-techflex-blue-200' : 'from-brand-gray-100 to-brand-gray-200'
                        } flex items-center justify-center transition-all duration-300`}>
                            <Icon name={iconName} className={`h-3 w-3 transition-colors duration-300 ${
                                isFocused ? 'text-techflex-blue-600' : 'text-brand-gray-400'
                            }`} />
                        </div>
                    </div>
                )}

                <input
                    ref={inputRef}
                    type={type}
                    id={name}
                    name={name}
                    value={value}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    placeholder={placeholder}
                    required={required}
                    autoComplete={type === 'email' ? 'email' : type === 'tel' ? 'tel' : 'off'}
                    className={`block w-full ${iconName ? 'pl-12' : 'pl-4'} ${value && isValid ? 'pr-12' : 'pr-4'} py-3.5 text-sm bg-white/90 backdrop-blur-sm border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-0 relative z-10 ${
                        isFocused
                            ? 'border-techflex-blue bg-white shadow-lg shadow-techflex-blue/10 transform scale-[1.01]'
                            : !isValid && value
                                ? 'border-red-300 bg-red-50/50'
                                : 'border-brand-gray-200 hover:border-brand-gray-300'
                    }`}
                />

                {/* Optimized animated border gradient */}
                {isFocused && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-techflex-blue to-techflex-orange p-[2px] transition-opacity duration-300 pointer-events-none z-0">
                        <div className="w-full h-full bg-white rounded-xl"></div>
                    </div>
                )}

                {/* Validation indicator - positioned to avoid overlap */}
                {value && (
                    <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 pointer-events-none z-20 ${
                        isValid ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                        <Icon name={isValid ? 'check' : 'x-mark'} className={`w-3 h-3 ${
                            isValid ? 'text-green-600' : 'text-red-600'
                        }`} />
                    </div>
                )}
            </div>

            {children}

            {!isValid && value && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-2 animate-fadeIn">
                    <Icon name="exclamation-triangle" className="w-4 h-4" />
                    {type === 'email' ? 'Please enter a valid email address' :
                        type === 'tel' ? 'Please enter a valid phone number' :
                            'This field is required'}
                </p>
            )}
        </div>
    );
});

FormField.displayName = 'FormField';

// Memoized FileUploadField component
const FileUploadField = React.memo<{
    label: string;
    file: File | null;
    onFileChange: (file: File | null) => void;
    accept?: string;
    required?: boolean;
}>(({ label, file, onFileChange, accept = '.pdf,.doc,.docx', required = true }) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateFile = useCallback((file: File) => {
        const maxSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];

        if (file.size > maxSize) {
            setError('File size must be less than 10MB');
            return false;
        }

        if (!allowedTypes.includes(file.type)) {
            setError('Please upload a PDF, DOC, or DOCX file');
            return false;
        }

        setError(null);
        return true;
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0 && validateFile(files[0])) {
            onFileChange(files[0]);
        }
    }, [onFileChange, validateFile]);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0 && validateFile(files[0])) {
            onFileChange(files[0]);
        }
    }, [onFileChange, validateFile]);

    const handleRemoveFile = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        onFileChange(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [onFileChange]);

    const handleClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    return (
        <div className="group">
            <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-semibold text-brand-gray-700">
                    {label}
                    {required && <span className="text-techflex-orange ml-1">*</span>}
                </label>
                <span className="text-xs text-brand-gray-500">PDF, DOC, DOCX (max 10MB)</span>
            </div>

            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClick}
                className={`relative border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer group-hover:border-techflex-blue-300 ${
                    isDragOver
                        ? 'border-techflex-blue bg-techflex-blue-50/50 scale-[1.01]'
                        : file
                            ? 'border-green-300 bg-green-50/50'
                            : error
                                ? 'border-red-300 bg-red-50/50'
                                : 'border-brand-gray-300 hover:border-brand-gray-400'
                }`}
            >
                <div className="p-6 text-center">
                    {file ? (
                        <div className="space-y-4">
                            <div className="w-12 h-12 mx-auto bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                                <Icon name="document-check" className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-base font-semibold text-green-700 truncate max-w-xs mx-auto">
                                    {file.name}
                                </p>
                                <p className="text-sm text-brand-gray-500 mt-1">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={handleRemoveFile}
                                className="inline-flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                            >
                                <Icon name="trash" className="w-4 h-4" />
                                Remove file
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center transition-all duration-300 ${
                                isDragOver
                                    ? 'bg-gradient-to-br from-techflex-blue-100 to-techflex-blue-200 scale-110'
                                    : error
                                        ? 'bg-gradient-to-br from-red-100 to-red-200'
                                        : 'bg-gradient-to-br from-brand-gray-100 to-brand-gray-200'
                            }`}>
                                <Icon name="arrow-up-tray" className={`w-6 h-6 transition-colors duration-300 ${
                                    isDragOver ? 'text-techflex-blue-600' :
                                        error ? 'text-red-600' : 'text-brand-gray-400'
                                }`} />
                            </div>

                            <div>
                                <p className={`text-base font-semibold mb-2 ${
                                    error ? 'text-red-700' : 'text-brand-gray-700'
                                }`}>
                                    {isDragOver ? 'Drop your file here' :
                                        error ? 'Invalid file' : 'Upload your resume'}
                                </p>
                                <p className="text-sm text-brand-gray-500">
                                    Drag and drop or{' '}
                                    <span className="font-medium text-techflex-blue hover:text-techflex-blue-700 transition-colors">
                                        click to browse
                                    </span>
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept={accept}
                    onChange={handleFileSelect}
                />
            </div>

            {error && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-2 animate-fadeIn">
                    <Icon name="exclamation-triangle" className="w-4 h-4" />
                    {error}
                </p>
            )}
        </div>
    );
});

FileUploadField.displayName = 'FileUploadField';

const CareerApplicationPage: React.FC<CareerApplicationPageProps> = ({ job, onNavigate, onCompleteApplication }) => {
    const { saveJobApplication } = useContent();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        linkedin: '',
        github: '',
        coverLetter: '',
    });
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const pageRef = useRef<HTMLDivElement>(null);

    // Memoized validation function
    const validateForm = useCallback(() => {
        const newErrors: Record<string, string> = {};

        if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.linkedin.trim()) newErrors.linkedin = 'LinkedIn profile is required';
        if (!resumeFile) newErrors.resume = 'Resume is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData, resumeFile]);

    // Optimized intersection observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect(); // Disconnect after first intersection
                }
            },
            { threshold: 0.1, rootMargin: '50px' }
        );

        if (pageRef.current) {
            observer.observe(pageRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Memoized input change handler
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    }, [errors]);

    // Memoized file change handler
    const handleFileChange = useCallback((file: File | null) => {
        setResumeFile(file);
        if (file && errors.resume) {
            setErrors(prev => ({ ...prev, resume: '' }));
        }
    }, [errors.resume]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            // Scroll to first error
            const firstErrorField = Object.keys(errors)[0];
            const element = document.getElementById(firstErrorField);
            element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        setIsSubmitting(true);

        try {
            // Simulate file upload - in production, upload to cloud storage
            const resumeUrl = `https://storage.example.com/resumes/${resumeFile!.name}`;

            const jobApplication: JobApplication = {
                id: crypto.randomUUID(), // Generate unique ID
                jobId: job.id,
                fullName: formData.fullName,
                name: formData.fullName, // For compatibility with AdminCareersPage
                email: formData.email,
                phone: formData.phone,
                linkedin: formData.linkedin,
                github: formData.github,
                coverLetter: formData.coverLetter,
                resumeUrl: resumeUrl,
                status: 'pending',
                submittedAt: new Date().toISOString()
            };

            await saveJobApplication(jobApplication);
            onCompleteApplication(job.id);
        } catch (error) {
            console.error('Error submitting application:', error);
            alert('There was an error submitting your application. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, resumeFile, job.id, validateForm, errors, saveJobApplication, onCompleteApplication]);

    // Memoized sections to prevent unnecessary re-renders
    const personalInfoSection = useMemo(() => (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-techflex-blue to-techflex-blue-600 flex items-center justify-center">
                    <Icon name="user" className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-brand-gray-800">Personal Information</h2>
                    <p className="text-brand-gray-600">Tell us about yourself</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FormField
                    label="Full Name"
                    name="fullName"
                    placeholder="Jane Doe"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    iconName="user"
                />
                <FormField
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="jane@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    iconName="envelope"
                />
            </div>

            <FormField
                label="Phone Number"
                name="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={handleInputChange}
                iconName="device-phone-mobile"
                description="Include country code"
            />
        </div>
    ), [formData.fullName, formData.email, formData.phone, handleInputChange]);

    const professionalSection = useMemo(() => (
        <div className="space-y-6 pt-8 border-t border-brand-gray-100">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-techflex-orange to-techflex-orange-600 flex items-center justify-center">
                    <Icon name="briefcase" className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-brand-gray-800">Professional Profiles</h2>
                    <p className="text-brand-gray-600">Help us learn more about your experience</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FormField
                    label="LinkedIn Profile"
                    name="linkedin"
                    placeholder="https://linkedin.com/in/jane-doe"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    iconName="link"
                />
                <FormField
                    label="GitHub Profile"
                    name="github"
                    placeholder="https://github.com/jane-doe"
                    value={formData.github}
                    onChange={handleInputChange}
                    required={false}
                    iconName="link"
                    description="Optional"
                />
            </div>
        </div>
    ), [formData.linkedin, formData.github, handleInputChange]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-gray-50 via-white to-techflex-blue-50">
            {/* Optimized background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-techflex-blue-200/10 to-techflex-orange-200/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-tr from-techflex-orange-200/10 to-techflex-blue-200/10 rounded-full blur-3xl"></div>
            </div>

            <div ref={pageRef} className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 max-w-4xl">
                {/* Back button */}
                <div className={`mb-8 transition-all duration-700 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                    <button
                        onClick={() => onNavigate('careers')}
                        className="group inline-flex items-center gap-3 text-sm font-semibold text-brand-gray-600 hover:text-techflex-blue transition-all duration-300 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-2xl border border-brand-gray-200 hover:border-techflex-blue-200 hover:shadow-lg"
                    >
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-gray-100 to-brand-gray-200 group-hover:from-techflex-blue-100 group-hover:to-techflex-blue-200 flex items-center justify-center transition-all duration-300">
                            <Icon name="chevron-left" className="w-4 h-4 group-hover:text-techflex-blue transition-colors duration-300" />
                        </div>
                        <span>Back to Careers</span>
                    </button>
                </div>

                {/* Main form card */}
                <div className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden transition-all duration-700 delay-300 ${
                    isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
                }`}>
                    {/* Header */}
                    <div className="relative bg-gradient-to-r from-techflex-blue/5 to-techflex-orange/5 px-8 py-12 text-center border-b border-brand-gray-100">
                        <div className="absolute inset-0 bg-gradient-to-r from-techflex-blue-500/5 to-techflex-orange-500/5"></div>

                        <div className="relative">
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-techflex-blue-50 to-techflex-orange-50 text-techflex-blue-700 px-6 py-3 rounded-full text-sm font-semibold mb-6 border border-techflex-blue-200/50">
                                <div className="w-2 h-2 bg-techflex-blue-500 rounded-full animate-pulse"></div>
                                Apply Now
                            </div>

                            <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-gray-900 tracking-tight mb-4">
                                Apply for
                                <span className="bg-gradient-to-r from-techflex-blue-600 to-techflex-orange-600 bg-clip-text text-transparent"> {job.title}</span>
                            </h1>

                            <div className="flex flex-wrap justify-center gap-6 text-sm">
                                <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-brand-gray-200">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-techflex-blue-100 to-techflex-blue-200 flex items-center justify-center">
                                        <Icon name="briefcase" className="w-3 h-3 text-techflex-blue-600" />
                                    </div>
                                    <span className="font-semibold text-brand-gray-700">{job.department}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-brand-gray-200">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-techflex-orange-100 to-techflex-orange-200 flex items-center justify-center">
                                        <Icon name="map-pin" className="w-3 h-3 text-techflex-orange-600" />
                                    </div>
                                    <span className="font-semibold text-brand-gray-700">{job.location}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form content */}
                    <form onSubmit={handleSubmit} className="p-8 sm:p-12">
                        <div className="space-y-8">
                            {/* Personal Information */}
                            {personalInfoSection}

                            {/* Professional Details */}
                            {professionalSection}

                            {/* Documents */}
                            <div className="space-y-6 pt-8 border-t border-brand-gray-100">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-gray-600 to-brand-gray-700 flex items-center justify-center">
                                        <Icon name="document-text" className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-brand-gray-800">Documents & Cover Letter</h2>
                                        <p className="text-brand-gray-600">Upload your resume and tell us why you're perfect for this role</p>
                                    </div>
                                </div>

                                <FileUploadField
                                    label="Resume/CV"
                                    file={resumeFile}
                                    onFileChange={handleFileChange}
                                    accept=".pdf,.doc,.docx"
                                    required={true}
                                />

                                <div className="space-y-3">
                                    <label htmlFor="coverLetter" className="block text-sm font-semibold text-brand-gray-700">
                                        Cover Letter
                                        <span className="text-brand-gray-500 font-normal ml-2">(Optional)</span>
                                    </label>
                                    <div className="relative">
                                        <textarea
                                            id="coverLetter"
                                            name="coverLetter"
                                            rows={6}
                                            value={formData.coverLetter}
                                            onChange={handleInputChange}
                                            placeholder="Tell us why you're excited about this role and what unique value you'd bring to our team..."
                                            maxLength={1000}
                                            className="block w-full px-4 py-4 text-sm bg-white/90 backdrop-blur-sm border-2 border-brand-gray-200 rounded-xl focus:border-techflex-blue focus:outline-none focus:ring-0 transition-all duration-300 resize-none hover:border-brand-gray-300 focus:shadow-lg"
                                        />
                                        <div className="absolute bottom-3 right-3 text-xs text-brand-gray-400 pointer-events-none">
                                            {formData.coverLetter.length}/1000
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit button */}
                        <div className="mt-12 pt-8 border-t border-brand-gray-100">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="group relative w-full bg-gradient-to-r from-techflex-orange to-techflex-orange-600 hover:from-techflex-orange-600 hover:to-techflex-orange-700 text-white font-bold py-5 px-8 rounded-2xl text-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-techflex-orange/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                <div className="relative flex items-center justify-center gap-3">
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>Submitting Application...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Submit Application</span>
                                            <Icon name="paper-airplane" className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                                        </>
                                    )}
                                </div>

                                {/* Button shine effect */}
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover:-translate-x-full transition-transform duration-700 opacity-0 group-hover:opacity-100 pointer-events-none"></div>
                            </button>

                            <p className="mt-4 text-center text-sm text-brand-gray-500">
                                By submitting this application, you agree to our
                                <button type="button" className="text-techflex-blue hover:text-techflex-blue-700 font-medium ml-1 transition-colors">
                                    Privacy Policy
                                </button> and
                                <button type="button" className="text-techflex-blue hover:text-techflex-blue-700 font-medium ml-1 transition-colors">
                                    Terms of Service
                                </button>.
                            </p>
                        </div>
                    </form>
                </div>
            </div>

            {/* Add custom styles for animations */}
            <style>{`
    .animate-fadeIn {
        animation: fadeIn 0.3s ease-in-out;
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`}</style>
        </div>
    );
};

export default CareerApplicationPage;