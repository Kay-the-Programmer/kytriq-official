import React, { useState, useMemo, useEffect, useRef } from 'react';
import Icon from '../components/Icon';
import { useContent } from '../contexts/ContentContext';
import { JobOpening } from '../contexts/ContentContext';

interface CareersPageProps {
    onNavigate: (page: string, id?: string) => void;
}

const BenefitCard: React.FC<{ iconName: string; title: string; children: React.ReactNode; index: number }> = ({ iconName, title, children, index }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.2 }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const gradients = [
        'from-techflex-blue-500 to-techflex-blue-600',
        'from-techflex-orange-500 to-techflex-orange-600',
        'from-brand-gray-600 to-brand-gray-700'
    ];

    const currentGradient = gradients[index % gradients.length];

    return (
        <div
            ref={cardRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`group relative bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden transition-all duration-700 transform-gpu h-full ${
                isVisible
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-12 scale-95'
            } ${
                isHovered
                    ? 'shadow-2xl shadow-techflex-blue-500/15 -translate-y-2'
                    : 'shadow-lg hover:shadow-xl'
            }`}
            style={{ transitionDelay: `${index * 150}ms` }}
        >
            {/* Animated background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${currentGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

            {/* Interactive border */}
            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${currentGradient} p-[2px]`}>
                    <div className="w-full h-full bg-white rounded-3xl opacity-95"></div>
                </div>
            </div>

            <div className="relative p-8">
                {/* Enhanced icon container */}
                <div className="relative mb-6">
                    {/* Floating background elements */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-techflex-blue-100/50 to-techflex-orange-100/50 opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-500"></div>
                    </div>

                    <div className={`relative w-16 h-16 mx-auto bg-gradient-to-br ${currentGradient} rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:rotate-3 group-hover:scale-110 shadow-lg group-hover:shadow-xl`}>
                        <div className="absolute inset-0 rounded-2xl bg-white/25 backdrop-blur-sm border border-white/20"></div>
                        <Icon name={iconName} className="relative z-10 h-8 w-8 text-white drop-shadow-lg" />

                        {/* Shine effect */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/40 to-transparent transform -skew-x-12 translate-x-full group-hover:-translate-x-full transition-transform duration-1000 opacity-0 group-hover:opacity-100"></div>
                    </div>
                </div>

                <h3 className="text-xl font-bold text-brand-gray-900 group-hover:text-techflex-blue transition-colors duration-300 mb-3">
                    {title}
                </h3>
                <p className="text-brand-gray-600 leading-relaxed">{children}</p>

                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-br from-techflex-orange to-techflex-orange-600 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-500" style={{ animationDelay: '0.1s' }}></div>
                <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-gradient-to-br from-techflex-blue to-techflex-blue-600 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-500"></div>
            </div>
        </div>
    );
};

const JobListing: React.FC<{ job: JobOpening; isOpen: boolean; onToggle: () => void; onNavigate: (page: string, id: string) => void; index: number }> = ({ job, isOpen, onToggle, onNavigate, index }) => {
    const [isVisible, setIsVisible] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={cardRef}
            className={`group bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-700 border border-white/20 overflow-hidden transform-gpu ${
                isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
            } ${
                isOpen ? 'ring-2 ring-techflex-blue/20 shadow-techflex-blue/10' : ''
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
        >
            {/* Interactive gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-techflex-blue-500/5 to-techflex-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <button
                onClick={onToggle}
                className="relative w-full text-left p-8 flex justify-between items-center group-hover:bg-gradient-to-r group-hover:from-white/50 group-hover:to-transparent transition-all duration-300"
            >
                <div className="flex-1">
                    {/* Department badge with enhanced styling */}
                    <div className="flex items-center gap-3 mb-4">
                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-techflex-orange bg-gradient-to-r from-techflex-orange-50 to-techflex-orange-100 px-4 py-2 rounded-full border border-techflex-orange-200/50 shadow-sm">
                            <div className="w-2 h-2 bg-techflex-orange rounded-full animate-pulse"></div>
                            {job.department}
                        </span>
                        <span className="text-xs font-medium text-brand-gray-400 bg-brand-gray-50 px-3 py-1 rounded-full">
                            {job.type}
                        </span>
                    </div>

                    <h3 className="text-2xl font-bold text-brand-gray-900 group-hover:text-techflex-blue transition-colors duration-300 mb-3">
                        {job.title}
                    </h3>

                    <div className="flex flex-wrap gap-6 text-sm text-brand-gray-500">
                        <span className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-techflex-blue-100 to-techflex-blue-200 flex items-center justify-center">
                                <Icon name="map-pin" className="w-3 h-3 text-techflex-blue-600" />
                            </div>
                            {job.location}
                        </span>
                        <span className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-techflex-orange-100 to-techflex-orange-200 flex items-center justify-center">
                                <Icon name="briefcase" className="w-3 h-3 text-techflex-orange-600" />
                            </div>
                            Full-time
                        </span>
                    </div>
                </div>

                <div className="flex items-center justify-center w-12 h-12 ml-6 rounded-2xl bg-gradient-to-br from-brand-gray-50 to-brand-gray-100 group-hover:from-techflex-blue-50 group-hover:to-techflex-blue-100 transition-all duration-300 group-hover:scale-110">
                    <Icon
                        name={isOpen ? "chevron-up" : "chevron-down"}
                        className={`w-6 h-6 text-brand-gray-400 group-hover:text-techflex-blue transition-all duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    />
                </div>
            </button>

            {/* Expanded content with smooth animation */}
            <div className={`overflow-hidden transition-all duration-700 ease-in-out ${
                isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
            }`}>
                <div className="px-8 pb-8 border-t border-gradient-to-r from-transparent via-brand-gray-200/50 to-transparent">
                    <div className="mt-6 space-y-6">
                        {/* Job description with better typography */}
                        <div className="prose prose-sm max-w-none">
                            <p className="text-brand-gray-600 leading-relaxed text-base">{job.description}</p>
                        </div>

                        {/* Enhanced sections */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h4 className="flex items-center gap-3 font-bold text-brand-gray-800 text-lg">
                                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-techflex-blue-500 to-techflex-blue-600 flex items-center justify-center">
                                        <Icon name="check" className="w-4 h-4 text-white" />
                                    </div>
                                    Responsibilities
                                </h4>
                                <ul className="space-y-3">
                                    {job.responsibilities.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-brand-gray-600">
                                            <div className="w-2 h-2 bg-gradient-to-br from-techflex-blue to-techflex-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                                            <span className="leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="space-y-4">
                                <h4 className="flex items-center gap-3 font-bold text-brand-gray-800 text-lg">
                                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-techflex-orange-500 to-techflex-orange-600 flex items-center justify-center">
                                        <Icon name="star" className="w-4 h-4 text-white" />
                                    </div>
                                    Qualifications
                                </h4>
                                <ul className="space-y-3">
                                    {job.qualifications.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-brand-gray-600">
                                            <div className="w-2 h-2 bg-gradient-to-br from-techflex-orange to-techflex-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                                            <span className="leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Enhanced apply button */}
                        <div className="pt-6 border-t border-brand-gray-100">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onNavigate('career-application', job.id);
                                }}
                                className="group/btn relative inline-flex items-center gap-3 bg-gradient-to-r from-techflex-orange to-techflex-orange-600 hover:from-techflex-orange-600 hover:to-techflex-orange-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-techflex-orange/25"
                            >
                                <span className="relative z-10">Apply Now</span>
                                <Icon name="arrow-right" className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1" />

                                {/* Button shine effect */}
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover/btn:-translate-x-full transition-transform duration-700 opacity-0 group-hover/btn:opacity-100"></div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CareersPage: React.FC<CareersPageProps> = ({ onNavigate }) => {
    const { jobOpenings } = useContent();
    const [activeDepartment, setActiveDepartment] = useState('All');
    const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const heroRef = useRef<HTMLDivElement>(null);

    const departments = useMemo(() => ['All', ...Array.from(new Set(jobOpenings.map(j => j.department)))], [jobOpenings]);

    const filteredJobs = useMemo(() => {
        let filtered = jobOpenings.filter(job => {
            const matchesCategory = activeDepartment === 'All' || job.department === activeDepartment;
            const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.description.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
        return filtered;
    }, [activeDepartment, searchTerm, jobOpenings]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (heroRef.current) {
            observer.observe(heroRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const benefits = [
        { icon: 'light-bulb', title: 'Innovation Culture', description: "Work on challenging projects that push the boundaries of technology and make a real impact." },
        { icon: 'users', title: 'Collaborative Team', description: "Join a diverse team of passionate experts who support each other's growth and celebrate success together." },
        { icon: 'chart-bar', title: 'Career Growth', description: "We invest in your development with clear career paths, mentorship programs, and learning opportunities." },
        { icon: 'heart', title: 'Work-Life Balance', description: "Flexible hours, remote options, and generous paid time off to help you recharge and maintain well-being." },
        { icon: 'shield-check', title: 'Health Benefits', description: "Comprehensive medical, dental, and vision insurance for you and your family, plus wellness programs." },
        { icon: 'rocket-launch', title: 'Cutting-Edge Tech', description: "Get your hands on the latest tools and technologies in the industry to stay ahead of the curve." },
    ];

    const handleToggleJob = (jobId: string) => {
        setExpandedJobId(prevId => (prevId === jobId ? null : jobId));
    };

    return (
        <div className="bg-gradient-to-br from-brand-gray-50 via-white to-techflex-blue-50">
            {/* Enhanced Hero Section */}
            <div ref={heroRef} className="relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0">
                    <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-techflex-blue-200/20 to-techflex-orange-200/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-tr from-techflex-orange-200/15 to-techflex-blue-200/15 rounded-full blur-3xl"></div>

                    {/* Floating particles */}
                    <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-techflex-blue-400 rounded-full animate-bounce opacity-30" style={{ animationDelay: '0s' }}></div>
                    <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-techflex-orange-400 rounded-full animate-bounce opacity-40" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute bottom-1/4 left-1/3 w-4 h-4 bg-brand-gray-400 rounded-full animate-bounce opacity-20" style={{ animationDelay: '2s' }}></div>
                </div>

                <div className="relative bg-white/80 backdrop-blur-sm shadow-sm text-brand-gray-900 py-32 sm:py-40">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className={`transition-all duration-1000 transform ${
                            isVisible
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-12'
                        }`}>
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-techflex-blue-50 to-techflex-orange-50 text-techflex-blue-700 px-6 py-3 rounded-full text-sm font-semibold mb-8 border border-techflex-blue-200/50">
                                <div className="w-2 h-2 bg-techflex-blue-500 rounded-full animate-pulse"></div>
                                Join Our Growing Team
                            </div>

                            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-brand-gray-900 mb-8">
                                Build the
                                <span className="bg-gradient-to-r from-techflex-blue-600 to-techflex-orange-600 bg-clip-text text-transparent"> Future</span>
                                <br />With Us
                            </h1>

                            <p className="mt-6 max-w-4xl mx-auto text-xl md:text-2xl text-brand-gray-600 leading-relaxed">
                                We're a team of innovators, creators, and problem-solvers dedicated to building the future of technology.
                                <br className="hidden md:block" />
                                If you're passionate and driven, there's a place for you at Kytriq.
                            </p>

                            {/* Stats */}
                            <div className="mt-12 flex justify-center items-center gap-12 text-center">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-techflex-blue-600">50+</div>
                                    <div className="text-sm text-brand-gray-500">Team Members</div>
                                </div>
                                <div className="w-px h-12 bg-brand-gray-200"></div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-techflex-orange-600">{jobOpenings.length}</div>
                                    <div className="text-sm text-brand-gray-500">Open Positions</div>
                                </div>
                                <div className="w-px h-12 bg-brand-gray-200"></div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-brand-gray-700">{departments.length - 1}</div>
                                    <div className="text-sm text-brand-gray-500">Departments</div>
                                </div>
                            </div>

                            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                                <a
                                    href="#openings"
                                    className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-techflex-orange to-techflex-orange-600 hover:from-techflex-orange-600 hover:to-techflex-orange-700 text-white font-bold py-5 px-10 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-techflex-orange/25"
                                >
                                    <span>Explore Opportunities</span>
                                    <Icon name="arrow-down" className="w-5 h-5 transition-transform duration-300 group-hover:translate-y-1" />
                                </a>
                                <button
                                    onClick={() => onNavigate('about')}
                                    className="group relative inline-flex items-center gap-3 bg-white/90 backdrop-blur-sm hover:bg-white text-brand-gray-700 hover:text-techflex-blue font-bold py-5 px-10 rounded-2xl text-lg transition-all duration-300 border border-brand-gray-200 hover:border-techflex-blue-200 hover:shadow-xl"
                                >
                                    <span>Learn About Us</span>
                                    <Icon name="arrow-right" className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Benefits Section */}
            <section className="py-28">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-techflex-blue-50 to-techflex-orange-50 text-techflex-blue-700 px-6 py-3 rounded-full text-sm font-semibold mb-6">
                            <Icon name="heart" className="w-4 h-4" />
                            Why Choose Us
                        </div>
                        <h2 className="text-5xl font-extrabold text-brand-gray-900 mb-6">
                            More Than Just a
                            <span className="bg-gradient-to-r from-techflex-blue-600 to-techflex-orange-600 bg-clip-text text-transparent"> Job</span>
                        </h2>
                        <p className="max-w-3xl mx-auto text-xl text-brand-gray-600 leading-relaxed">
                            We invest in our people with a comprehensive benefits package designed for well-being, growth, and long-term success.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {benefits.map((item, index) => (
                            <BenefitCard key={item.title} iconName={item.icon} title={item.title} index={index}>
                                {item.description}
                            </BenefitCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* Enhanced Openings Section */}
            <section id="openings" className="bg-gradient-to-br from-white via-brand-gray-50/50 to-techflex-blue-50/30 py-28">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-techflex-orange-50 to-techflex-blue-50 text-techflex-orange-700 px-6 py-3 rounded-full text-sm font-semibold mb-6">
                            <Icon name="briefcase" className="w-4 h-4" />
                            Current Opportunities
                        </div>
                        <h2 className="text-5xl font-extrabold text-brand-gray-900 mb-6">
                            Find Your
                            <span className="bg-gradient-to-r from-techflex-orange-600 to-techflex-blue-600 bg-clip-text text-transparent"> Dream Role</span>
                        </h2>
                        <p className="max-w-3xl mx-auto text-xl text-brand-gray-600 leading-relaxed">
                            Discover exciting opportunities to grow your career and make an impact with our innovative team.
                        </p>
                    </div>

                    {/* Enhanced Filter Section */}
                    <div className="max-w-5xl mx-auto mb-16">
                        {/* Search Bar */}
                        <div className="relative mb-8">
                            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                <Icon name="search" className="h-6 w-6 text-brand-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search positions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-16 pr-6 py-5 text-lg border border-brand-gray-200 rounded-2xl focus:ring-2 focus:ring-techflex-blue/20 focus:border-techflex-blue bg-white/80 backdrop-blur-sm transition-all duration-300 placeholder-brand-gray-400"
                            />
                        </div>

                        {/* Department Filters */}
                        <div className="flex flex-wrap gap-3 justify-center" role="group" aria-label="Job departments">
                            {departments.map(dept => (
                                <button
                                    key={dept}
                                    onClick={() => setActiveDepartment(dept)}
                                    className={`group relative px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                                        activeDepartment === dept
                                            ? 'bg-gradient-to-r from-techflex-blue to-techflex-blue-600 text-white shadow-lg shadow-techflex-blue/25'
                                            : 'bg-white/80 backdrop-blur-sm text-brand-gray-700 hover:bg-white hover:text-techflex-blue border border-brand-gray-200 hover:border-techflex-blue-200'
                                    }`}
                                    aria-pressed={activeDepartment === dept}
                                >
                                    <span className="relative z-10">{dept}</span>
                                    {activeDepartment === dept && (
                                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover:-translate-x-full transition-transform duration-700 opacity-0 group-hover:opacity-100"></div>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Results summary */}
                        <div className="text-center mt-8">
                            <p className="text-brand-gray-500">
                                {filteredJobs.length === 0 ? 'No positions found' :
                                    filteredJobs.length === 1 ? '1 position found' :
                                        `${filteredJobs.length} positions found`}
                                {searchTerm && <span> for "{searchTerm}"</span>}
                                {activeDepartment !== 'All' && <span> in {activeDepartment}</span>}
                            </p>
                        </div>
                    </div>

                    {/* Job Listings */}
                    <div className="max-w-5xl mx-auto space-y-6">
                        {filteredJobs.length > 0 ? (
                            filteredJobs.map((job, index) => (
                                <JobListing
                                    key={job.id}
                                    job={job}
                                    isOpen={expandedJobId === job.id}
                                    onToggle={() => handleToggleJob(job.id)}
                                    onNavigate={onNavigate}
                                    index={index}
                                />
                            ))
                        ) : (
                            <div className="text-center py-20 bg-white/90 backdrop-blur-sm rounded-3xl border border-white/20">
                                <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-brand-gray-100 to-brand-gray-200 flex items-center justify-center">
                                    <Icon name="search" className="w-12 h-12 text-brand-gray-400" />
                                </div>
                                <h3 className="text-2xl font-semibold text-brand-gray-700 mb-3">No openings found</h3>
                                <p className="text-brand-gray-500 mb-6">
                                    {searchTerm ? `No positions match "${searchTerm}"` : `No openings in ${activeDepartment} department`}
                                </p>
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setActiveDepartment('All');
                                    }}
                                    className="inline-flex items-center gap-2 bg-techflex-blue hover:bg-techflex-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                                >
                                    <Icon name="refresh" className="w-4 h-4" />
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Enhanced CTA Section */}
            <section className="relative py-28 overflow-hidden">
                {/* Background elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-techflex-blue-200/10 to-techflex-orange-200/10 rounded-full blur-3xl"></div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="bg-white/90 backdrop-blur-sm p-16 rounded-3xl border border-white/20 shadow-2xl">
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-techflex-orange-50 to-techflex-blue-50 text-techflex-orange-700 px-6 py-3 rounded-full text-sm font-semibold mb-8">
                                <Icon name="mail" className="w-4 h-4" />
                                Get In Touch
                            </div>

                            <h2 className="text-4xl font-extrabold text-brand-gray-900 mb-6">
                                Don't See the
                                <span className="bg-gradient-to-r from-techflex-orange-600 to-techflex-blue-600 bg-clip-text text-transparent"> Perfect Fit?</span>
                            </h2>

                            <p className="text-xl text-brand-gray-600 leading-relaxed mb-10">
                                We're always on the lookout for exceptional talent. If you believe you have what it takes to contribute to our mission and drive innovation, we'd love to hear from you.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a
                                    href="mailto:careers@kytriq.com"
                                    className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-techflex-orange to-techflex-orange-600 hover:from-techflex-orange-600 hover:to-techflex-orange-700 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-techflex-orange/25"
                                >
                                    <Icon name="mail" className="w-5 h-5" />
                                    <span>Send Your Resume</span>
                                    <Icon name="arrow-right" className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                                </a>

                                <button
                                    onClick={() => onNavigate('contact')}
                                    className="group relative inline-flex items-center gap-3 bg-white hover:bg-brand-gray-50 text-brand-gray-700 hover:text-techflex-blue font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 border border-brand-gray-200 hover:border-techflex-blue-200 hover:shadow-xl"
                                >
                                    <Icon name="phone" className="w-5 h-5" />
                                    <span>Contact Us</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CareersPage;
