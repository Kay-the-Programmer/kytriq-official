import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createBaseContext, BaseContextState } from './BaseContext';
import { CareerService } from '../services/api';

// JobOpening interface (moved from ContentContext)
export interface JobOpening {
  id: string;
  title: string;
  department: 'Engineering' | 'Design' | 'Marketing' | 'Product';
  location: 'Remote' | 'San Francisco, CA' | 'New York, NY' | 'Hybrid';
  type: 'Full-time' | 'Part-time' | 'Contract';
  description: string;
  responsibilities: string[];
  qualifications: string[];
}

// JobApplication interface (moved from ContentContext)
export interface JobApplication {
  id: string;
  jobId: string;
  fullName: string;
  name: string; // Added for compatibility with AdminCareersPage
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  coverLetter: string;
  resumeUrl: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  submittedAt: string;
}

// Career context interface
export interface CareerContextState extends BaseContextState {
  jobOpenings: JobOpening[];
  jobApplications: JobApplication[];
  getJobById: (id: string) => JobOpening | undefined;
  getJobApplicationById: (id: string) => JobApplication | undefined;
  getJobApplicationsByJobId: (jobId: string) => JobApplication[];
  saveJobOpening: (job: JobOpening) => Promise<void>;
  deleteJobOpening: (jobId: string) => Promise<void>;
  saveJobApplication: (application: JobApplication) => Promise<void>;
  updateJobApplicationStatus: (applicationId: string, status: 'pending' | 'reviewed' | 'accepted' | 'rejected') => Promise<void>;
  deleteJobApplication: (applicationId: string) => Promise<void>;
}

// Create the career context
const { Context, Provider, useBaseContext } = createBaseContext<CareerContextState>('Career');

// Export the career provider component
export const CareerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>([]);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  
  // Fetch job openings on mount
  useEffect(() => {
    const fetchJobOpenings = async () => {
      const abortController = new AbortController();
      const signal = abortController.signal;
      
      try {
        const careersData = await CareerService.getAll({}, signal);
        
        // Check if the request was aborted before updating state
        if (!signal.aborted) {
          setJobOpenings(careersData || []);
        }
      } catch (error) {
        // Don't update state if the request was aborted
        if (signal.aborted) return;
        
        console.error('Error fetching job openings:', error);
      }
      
      return () => {
        abortController.abort();
      };
    };
    
    fetchJobOpenings();
  }, []);
  
  // Initialize job applications with sample data for testing
  // In a real implementation, you would fetch this from an API
  useEffect(() => {
    if (jobOpenings.length > 0 && jobApplications.length === 0) {
      const sampleApplications: JobApplication[] = [
        {
          id: 'app-1',
          jobId: jobOpenings[0]?.id || 'job-1',
          fullName: 'John Doe',
          name: 'John Doe', // Added for compatibility with AdminCareersPage
          email: 'john.doe@example.com',
          phone: '+1 (555) 123-4567',
          linkedin: 'https://linkedin.com/in/johndoe',
          github: 'https://github.com/johndoe',
          coverLetter: 'I am excited about this opportunity...',
          resumeUrl: 'https://storage.example.com/resumes/johndoe-resume.pdf',
          status: 'pending',
          submittedAt: '2023-06-15T10:30:00Z'
        }
      ];
      setJobApplications(sampleApplications);
    }
  }, [jobOpenings, jobApplications.length]);
  
  // Get job by ID - memoized to prevent unnecessary recalculations
  const getJobById = useCallback((id: string) => {
    return jobOpenings.find(job => job.id === id);
  }, [jobOpenings]);
  
  // Get job application by ID - memoized to prevent unnecessary recalculations
  const getJobApplicationById = useCallback((id: string) => {
    return jobApplications.find(app => app.id === id);
  }, [jobApplications]);
  
  // Get job applications by job ID - memoized to prevent unnecessary recalculations
  const getJobApplicationsByJobId = useCallback((jobId: string) => {
    return jobApplications.filter(app => app.jobId === jobId);
  }, [jobApplications]);
  
  // Save job opening
  const saveJobOpening = useCallback(async (job: JobOpening) => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    
    try {
      // If job.id is undefined or empty, it's a new job opening
      const isNew = !job.id || !jobOpenings.find(j => j.id === job.id);
      const savedJob = isNew 
        ? await CareerService.create(job, signal)
        : await CareerService.update(job.id, job, signal);
      
      // Check if the request was aborted before updating state
      if (signal.aborted) return;
      
      // Check if savedJob is null or undefined before accessing its properties
      if (!savedJob) {
        console.error('Failed to save job opening: API returned null or undefined');
        return;
      }
      
      setJobOpenings(prev => 
        isNew 
          ? [savedJob, ...prev] 
          : prev.map(j => j.id === savedJob.id ? savedJob : j)
      );
    } catch (error) {
      // Don't update state if the request was aborted
      if (signal.aborted) return;
      
      console.error('Failed to save job opening:', error);
    } finally {
      abortController.abort();
    }
  }, [jobOpenings]);
  
  // Delete job opening
  const deleteJobOpening = useCallback(async (jobId: string) => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    
    try {
      await CareerService.delete(jobId, signal);
      
      // Check if the request was aborted before updating state
      if (signal.aborted) return;
      
      setJobOpenings(prev => prev.filter(job => job.id !== jobId));
      
      // Also delete all job applications for this job
      setJobApplications(prev => prev.filter(app => app.jobId !== jobId));
    } catch (error) {
      // Don't update state if the request was aborted
      if (signal.aborted) return;
      
      console.error('Failed to delete job opening:', error);
    } finally {
      abortController.abort();
    }
  }, []);
  
  // Save job application
  const saveJobApplication = useCallback(async (application: JobApplication) => {
    try {
      // In a real implementation, you would call an API service
      // const savedApplication = await JobApplicationService.save(application);
      
      // For now, simulate API response
      const savedApplication: JobApplication = {
        ...application,
        id: application.id || `app-${Date.now()}`,
        submittedAt: application.submittedAt || new Date().toISOString(),
        status: application.status || 'pending',
        name: application.fullName // Ensure name is set to fullName for compatibility
      };
      
      const isNew = !application.id || !jobApplications.find(a => a.id === application.id);
      
      setJobApplications(prev => 
        isNew 
          ? [savedApplication, ...prev] 
          : prev.map(a => a.id === savedApplication.id ? savedApplication : a)
      );
    } catch (error) {
      console.error('Failed to save job application:', error);
    }
  }, [jobApplications]);
  
  // Update job application status
  const updateJobApplicationStatus = useCallback(async (applicationId: string, status: 'pending' | 'reviewed' | 'accepted' | 'rejected') => {
    try {
      const application = jobApplications.find(a => a.id === applicationId);
      if (!application) {
        throw new Error(`Application with ID ${applicationId} not found`);
      }
      
      // In a real implementation, you would call an API service
      // await JobApplicationService.updateStatus(applicationId, status);
      
      const updatedApplication: JobApplication = { ...application, status };
      
      setJobApplications(prev => 
        prev.map(a => a.id === applicationId ? updatedApplication : a)
      );
    } catch (error) {
      console.error('Failed to update job application status:', error);
    }
  }, [jobApplications]);
  
  // Delete job application
  const deleteJobApplication = useCallback(async (applicationId: string) => {
    try {
      // In a real implementation, you would call an API service
      // await JobApplicationService.delete(applicationId);
      
      setJobApplications(prev => prev.filter(app => app.id !== applicationId));
    } catch (error) {
      console.error('Failed to delete job application:', error);
    }
  }, []);
  
  // Create the context value with memoization to prevent unnecessary re-renders
  const value = useMemo(() => ({
    jobOpenings,
    jobApplications,
    getJobById,
    getJobApplicationById,
    getJobApplicationsByJobId,
    saveJobOpening,
    deleteJobOpening,
    saveJobApplication,
    updateJobApplicationStatus,
    deleteJobApplication
  }), [
    jobOpenings,
    jobApplications,
    getJobById,
    getJobApplicationById,
    getJobApplicationsByJobId,
    saveJobOpening,
    deleteJobOpening,
    saveJobApplication,
    updateJobApplicationStatus,
    deleteJobApplication
  ]);
  
  return (
    <Provider initialState={value}>
      {children}
    </Provider>
  );
};

// Export the hook to use the career context
export const useCareerContext = () => useBaseContext();