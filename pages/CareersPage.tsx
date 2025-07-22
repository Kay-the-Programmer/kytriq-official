
import React, { useState, useMemo } from 'react';
import Icon from '../components/Icon';
import { useContent } from '../contexts/ContentContext';
import { JobOpening } from '../contexts/ContentContext';

interface CareersPageProps {
    onNavigate: (page: string, id?: string) => void;
}

const BenefitCard: React.FC<{ iconName: string; title: string; children: React.ReactNode }> = ({ iconName, title, children }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-brand-gray-100 h-full">
        <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-techflex-orange-100 mb-5">
            <Icon name={iconName} className="h-7 w-7 text-techflex-orange" />
        </div>
        <h3 className="text-xl font-bold text-brand-gray-900">{title}</h3>
        <p className="mt-2 text-brand-gray-600">{children}</p>
    </div>
);

const JobListing: React.FC<{ job: JobOpening; isOpen: boolean; onToggle: () => void; onNavigate: (page: string, id: string) => void; }> = ({ job, isOpen, onToggle, onNavigate }) => {
    return (
        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-brand-gray-200">
            <button onClick={onToggle} className="w-full text-left p-6 flex justify-between items-center">
                <div>
                    <span className="text-sm font-semibold text-techflex-orange bg-techflex-orange-50 px-2 py-1 rounded-md">{job.department}</span>
                    <h3 className="text-xl font-bold text-brand-gray-900 mt-2">{job.title}</h3>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-brand-gray-500">
                        <span className="flex items-center gap-1.5"><Icon name="map-pin" className="w-4 h-4" />{job.location}</span>
                        <span className="flex items-center gap-1.5"><Icon name="briefcase" className="w-4 h-4" />{job.type}</span>
                    </div>
                </div>
                <Icon name={isOpen ? "chevron-up" : "chevron-down"} className="w-6 h-6 text-brand-gray-400 flex-shrink-0" />
            </button>
            {isOpen && (
                <div className="px-6 pb-6 border-t border-brand-gray-200">
                    <div className="prose prose-sm max-w-none text-brand-gray-600 mt-4">
                        <p>{job.description}</p>
                        <h4 className="font-bold text-brand-gray-800 mt-4">Responsibilities:</h4>
                        <ul className="list-disc pl-5">
                            {job.responsibilities.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                        <h4 className="font-bold text-brand-gray-800 mt-4">Qualifications:</h4>
                        <ul className="list-disc pl-5">
                            {job.qualifications.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </div>
                    <div className="mt-6">
                        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('careerApplication', job.id); }} className="inline-block bg-techflex-orange hover:bg-techflex-orange-600 text-white font-bold py-2 px-6 rounded-md transition-all duration-300">
                            Apply Now
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

const CareersPage: React.FC<CareersPageProps> = ({ onNavigate }) => {
    const { jobOpenings } = useContent();
    const [activeDepartment, setActiveDepartment] = useState('All');
    const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

    const departments = useMemo(() => ['All', ...Array.from(new Set(jobOpenings.map(j => j.department)))], [jobOpenings]);

    const filteredJobs = useMemo(() => {
        if (activeDepartment === 'All') return jobOpenings;
        return jobOpenings.filter(job => job.department === activeDepartment);
    }, [activeDepartment, jobOpenings]);

    const benefits = [
        { icon: 'light-bulb', title: 'Innovation Culture', description: "Work on challenging projects that push the boundaries of technology." },
        { icon: 'users', title: 'Collaborative Team', description: "Join a diverse team of passionate experts who support each other's growth." },
        { icon: 'chart-bar', title: 'Career Growth', description: "We invest in your development with clear career paths and learning opportunities." },
        { icon: 'heart', title: 'Work-Life Balance', description: "Flexible hours, remote options, and generous paid time off to help you recharge." },
        { icon: 'shield-check', title: 'Health Benefits', description: "Premium medical, dental, and vision insurance for you and your family." },
        { icon: 'rocket-launch', title: 'Cutting-Edge Tech', description: "Get your hands on the latest tools and technologies in the industry." },
    ];

    const handleToggleJob = (jobId: string) => {
        setExpandedJobId(prevId => (prevId === jobId ? null : jobId));
    };

    return (
        <div className="bg-brand-gray-50">
            {/* Hero Section */}
            <div className="relative bg-white shadow-sm text-brand-gray-900 py-24 sm:py-32">
                <div className="absolute inset-0 bg-cover bg-center opacity-5" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80')" }}></div>
                <div className="absolute inset-0 bg-gradient-to-b from-white/90 to-white"></div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-brand-gray-900">Join Our Mission</h1>
                    <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-brand-gray-600">
                        We're a team of innovators, creators, and problem-solvers dedicated to building the future of technology. If you're passionate and driven, there's a place for you at Kytriq.
                    </p>
                    <div className="mt-10">
                        <a href="#openings" className="bg-techflex-orange hover:bg-techflex-orange-600 text-white font-bold py-4 px-10 rounded-md text-lg transition-all duration-300 transform hover:scale-105">
                            See Open Roles
                        </a>
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <section className="py-20 sm:py-28">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold text-brand-gray-900">More Than Just a Job</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-brand-gray-600">
                           We invest in our people with a comprehensive benefits package designed for well-being and growth.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {benefits.map((item) => (
                            <BenefitCard key={item.title} iconName={item.icon} title={item.title}>
                                {item.description}
                            </BenefitCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* Openings Section */}
            <section id="openings" className="bg-brand-gray-100 py-20 sm:py-28">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-extrabold text-brand-gray-900">Current Openings</h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-brand-gray-600">
                           Find your next opportunity and make an impact with us.
                        </p>
                    </div>
                    <div className="mb-12 flex flex-wrap gap-2 justify-center" role="group" aria-label="Job departments">
                        {departments.map(dept => (
                            <button
                                key={dept}
                                onClick={() => setActiveDepartment(dept)}
                                className={`px-4 py-2 rounded-md font-semibold text-sm transition-colors duration-200 ${
                                    activeDepartment === dept
                                        ? 'bg-techflex-orange text-white shadow'
                                        : 'bg-white text-brand-gray-700 hover:bg-brand-gray-200 border border-brand-gray-200'
                                }`}
                                aria-pressed={activeDepartment === dept}
                            >
                                {dept}
                            </button>
                        ))}
                    </div>

                    <div className="max-w-4xl mx-auto space-y-4">
                        {filteredJobs.length > 0 ? (
                            filteredJobs.map(job => (
                                <JobListing 
                                    key={job.id} 
                                    job={job} 
                                    isOpen={expandedJobId === job.id} 
                                    onToggle={() => handleToggleJob(job.id)}
                                    onNavigate={onNavigate}
                                />
                            ))
                        ) : (
                             <div className="text-center py-16 bg-white rounded-2xl">
                                <h3 className="text-2xl font-semibold text-brand-gray-700">No openings in this department</h3>
                                <p className="mt-2 text-brand-gray-500">Check back soon or view all open positions.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-white py-20 sm:py-28">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center bg-brand-gray-50 p-12 rounded-2xl border border-brand-gray-200">
                        <h2 className="text-3xl font-extrabold text-brand-gray-900">Don't see the right fit?</h2>
                        <p className="mt-4 text-lg text-brand-gray-600">
                           We're always on the lookout for exceptional talent. If you believe you have what it takes to contribute to our mission, we'd love to hear from you.
                        </p>
                        <div className="mt-8">
                             <a href="mailto:careers@kytriq.com" className="bg-techflex-orange hover:bg-techflex-orange-600 text-white font-bold py-3 px-8 rounded-md text-lg transition-all duration-300">
                                Get in Touch
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CareersPage;
