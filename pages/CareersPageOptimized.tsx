import React, { useState, useMemo, useEffect, useRef, useCallback, memo } from 'react';
import { useContent } from '../contexts/ContentContext';
import Icon from '../components/Icon';
import JobCard from '../components/JobCard';
import DepartmentFilter from '../components/DepartmentFilter';
import SearchInput from '../components/SearchInput';
import { usePerformanceMonitor } from '../utils/performanceMonitor';

// Import CSS file instead of using dynamic style injection
import './CareersPage.css';

interface CareersPageProps {
    onNavigate: (page: string, id: string) => void;
}

const CareersPageOptimized: React.FC<CareersPageProps> = ({ onNavigate }) => {
    const { jobOpenings } = useContent();
    const [activeDepartment, setActiveDepartment] = useState('All');
    const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    
    // Monitor component performance
    usePerformanceMonitor('CareersPage');
    
    // Refs for intersection observer
    const heroRef = useRef<HTMLDivElement>(null);
    const jobsRef = useRef<HTMLDivElement>(null);
    
    // Memoized departments list
    const departments = useMemo(() => 
        ['All', ...Array.from(new Set(jobOpenings.map(j => j.department)))], 
        [jobOpenings]
    );
    
    // Memoized filtered jobs
    const filteredJobs = useMemo(() => {
        return jobOpenings.filter(job => {
            const matchesDepartment = activeDepartment === 'All' || job.department === activeDepartment;
            const matchesSearch = searchTerm === '' || 
                job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.location.toLowerCase().includes(searchTerm.toLowerCase());
            
            return matchesDepartment && matchesSearch;
        });
    }, [jobOpenings, activeDepartment, searchTerm]);
    
    // Intersection observer for animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                    }
                });
            },
            { threshold: 0.1 }
        );
        
        if (heroRef.current) {
            observer.observe(heroRef.current);
        }
        
        if (jobsRef.current) {
            observer.observe(jobsRef.current);
        }
        
        return () => {
            observer.disconnect();
        };
    }, []);
    
    // Memoized event handlers
    const handleDepartmentChange = useCallback((department: string) => {
        setActiveDepartment(department);
        setExpandedJobId(null);
    }, []);
    
    const handleSearchChange = useCallback((value: string) => {
        setSearchTerm(value);
        setExpandedJobId(null);
    }, []);
    
    const handleToggleExpand = useCallback((id: string) => {
        setExpandedJobId(prevId => prevId === id ? null : id);
    }, []);
    
    const handleApply = useCallback((id: string) => {
        onNavigate('careerApplication', id);
    }, [onNavigate]);
    
    return (
        <div className="bg-techflex-blue-50 animate-fadeIn">
            {/* Hero Section */}
            <div 
                ref={heroRef}
                className="relative bg-gradient-to-b from-techflex-blue-50 to-white py-20 sm:py-28 overflow-hidden"
            >
                {/* Background elements */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-grid-pattern" />
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/90 to-techflex-blue-50/90" />
                
                {/* Simplified floating elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/6 w-72 h-72 bg-techflex-blue-500/5 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/6 w-96 h-96 bg-techflex-orange-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                </div>
                
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className={`text-center max-w-4xl mx-auto ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
                        <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-techflex-blue-100 text-techflex-blue shadow-sm">Join Our Team</span>
                        <h1 className="text-4xl py-4 md:text-5xl lg:text-7xl font-extrabold text-brand-gray-900 tracking-tight leading-tight">
                            Build your career with <span className="text-transparent bg-clip-text bg-gradient-to-r from-techflex-blue to-techflex-blue-600">TechFlex</span>
                        </h1>
                        <p className="mt-6 text-xl md:text-2xl text-brand-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Join our team of talented professionals and help us build innovative solutions that transform businesses.
                        </p>
                    </div>
                </div>
            </div>
            
            {/* Job Listings Section */}
            <div 
                ref={jobsRef}
                className="bg-gradient-to-b from-white to-techflex-blue-50 py-20"
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-brand-gray-900 mb-4">
                            Current Job Openings
                        </h2>
                        <p className="text-lg text-brand-gray-600">
                            Explore our open positions and find the perfect role for your skills and experience
                        </p>
                    </div>
                    
                    {/* Search and Filter */}
                    <div className="max-w-4xl mx-auto mb-12">
                        <SearchInput 
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Search for job titles, locations, or keywords..."
                            className="mb-8"
                        />
                        
                        <DepartmentFilter 
                            departments={departments}
                            activeDepartment={activeDepartment}
                            onDepartmentChange={handleDepartmentChange}
                        />
                    </div>
                    
                    {/* Job Listings */}
                    {filteredJobs.length > 0 ? (
                        <div className="max-w-4xl mx-auto space-y-6">
                            {filteredJobs.map((job, index) => (
                                <div 
                                    key={job.id} 
                                    className={`animate-slideIn job-card-delay-${Math.min(index + 1, 5)}`}
                                >
                                    <JobCard 
                                        job={job}
                                        isExpanded={expandedJobId === job.id}
                                        onToggleExpand={handleToggleExpand}
                                        onApply={handleApply}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white text-center py-16 px-4 border-2 border-dashed border-brand-gray-200 rounded-2xl shadow-sm max-w-4xl mx-auto">
                            <Icon name="search" className="h-12 w-12 mx-auto text-brand-gray-300 mb-4" />
                            <h3 className="text-2xl font-semibold text-brand-gray-700 mb-2">No jobs found</h3>
                            <p className="text-brand-gray-500 max-w-md mx-auto">
                                We couldn't find any jobs matching your current filter criteria. Try adjusting your search or check back later for new openings.
                            </p>
                            <button 
                                onClick={() => handleDepartmentChange('All')}
                                className="mt-6 px-5 py-2 bg-techflex-blue text-white rounded-lg font-medium hover:bg-techflex-blue-600 transition-colors duration-300"
                            >
                                View All Jobs
                            </button>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Why Join Us Section */}
            <section className="py-24 bg-gradient-to-br from-techflex-blue-50 via-white to-techflex-blue-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-techflex-blue-100 text-techflex-blue">Why Choose Us</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-brand-gray-900 mb-4">Why Join TechFlex</h2>
                        <p className="text-lg text-brand-gray-600">
                            We offer a supportive environment where you can grow professionally and make a real impact.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: "academic-cap",
                                title: "Professional Growth",
                                description: "We invest in your development with training, mentorship, and opportunities to work on challenging projects."
                            },
                            {
                                icon: "users",
                                title: "Collaborative Culture",
                                description: "Join a team that values collaboration, diversity, and innovation in everything we do."
                            },
                            {
                                icon: "chart-bar",
                                title: "Competitive Benefits",
                                description: "Enjoy competitive compensation, health benefits, flexible work arrangements, and more."
                            }
                        ].map((benefit, index) => (
                            <div 
                                key={index}
                                className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden p-8 border border-brand-gray-100 hover:border-techflex-blue/20 transform hover:-translate-y-1 transform-gpu"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-techflex-blue/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />
                                
                                <div className="relative">
                                    <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-techflex-blue to-techflex-blue-600 text-white mb-6 transform transition-transform group-hover:rotate-3 group-hover:scale-110 duration-300">
                                        <Icon name={benefit.icon} className="h-8 w-8" />
                                    </div>
                                    
                                    <h3 className="text-xl font-bold text-brand-gray-800 mb-3 group-hover:text-techflex-blue transition-colors duration-300">
                                        {benefit.title}
                                    </h3>
                                    
                                    <p className="text-brand-gray-600 relative z-10">
                                        {benefit.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-16 text-center">
                        <a 
                            href="#" 
                            onClick={(e) => {
                                e.preventDefault();
                                onNavigate('contact', '');
                            }}
                            className="inline-flex items-center px-6 py-3 rounded-xl bg-techflex-blue text-white font-medium hover:bg-techflex-blue-600 transition-colors duration-300 shadow-md hover:shadow-lg"
                        >
                            Get in Touch
                            <Icon name="arrow-right" className="ml-2 h-5 w-5" />
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(CareersPageOptimized);