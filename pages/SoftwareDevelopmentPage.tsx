import React, { useState, useEffect, useRef } from 'react';
import Icon from '../components/Icon';

interface SoftwareDevelopmentPageProps {
    onNavigate: (page: string) => void;
}

// Enhanced Process Step with better mobile experience
const ProcessStep: React.FC<{
    iconName: string;
    number: string;
    title: string;
    children: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
    progress: number;
}> = ({ iconName, number, title, children, isActive, onClick, progress }) => (
    <div
        className={`relative pl-20 py-8 transition-all duration-500 cursor-pointer group ${
            isActive
                ? 'bg-gradient-to-r from-white to-techflex-blue-50 shadow-xl shadow-techflex-blue-100/50 transform scale-102'
                : 'hover:bg-white/70 hover:translate-x-2 hover:shadow-lg backdrop-blur-sm'
        }`}
        onClick={onClick}
    >
        {/* Progress indicator */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-gray-200 rounded-full">
            <div
                className="w-full bg-gradient-to-b from-techflex-blue to-techflex-orange rounded-full transition-all duration-1000 ease-out"
                style={{ height: `${progress}%` }}
            />
        </div>

        {/* Enhanced icon with progress ring */}
        <div className="absolute left-5 top-8">
            <div className={`relative flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-500 ${
                isActive ? 'bg-techflex-blue text-white shadow-lg shadow-techflex-blue/30 scale-110' : 'bg-techflex-blue-100 text-techflex-blue group-hover:bg-techflex-blue-200'
            }`}>
                {/* Animated ring for active state */}
                {isActive && (
                    <div className="absolute -inset-1 rounded-2xl border-2 border-techflex-orange opacity-75 animate-pulse"></div>
                )}
                <Icon name={iconName} className="h-6 w-6 relative z-10" />
            </div>
        </div>

        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
                <span className={`text-sm font-bold px-3 py-1 rounded-full transition-all duration-300 ${
                    isActive
                        ? 'bg-techflex-blue text-white shadow-sm'
                        : 'bg-brand-gray-100 text-brand-gray-600 group-hover:bg-brand-gray-200'
                }`}>
                    {number}
                </span>
                <h3 className={`text-2xl font-extrabold transition-all duration-300 ${
                    isActive ? 'text-techflex-blue' : 'text-brand-gray-900 group-hover:text-techflex-blue'
                }`}>
                    {title}
                </h3>
            </div>
            <div
                className={`text-base leading-relaxed transition-all duration-500 ${
                    isActive
                        ? 'text-brand-gray-700 max-h-48 opacity-100'
                        : 'text-brand-gray-600 max-h-0 opacity-0 md:max-h-48 md:opacity-100'
                }`}
            >
                {children}
            </div>
        </div>
    </div>
);

// Enhanced solution card with better animations
const WhatWeBuildCard: React.FC<{
    iconName: string;
    title: string;
    children: React.ReactNode;
    index: number;
    features: string[];
}> = ({ iconName, title, children, index, features }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="relative group bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 flex flex-col h-full border border-brand-gray-100/50"
            style={{ animationDelay: `${index * 150}ms` }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-techflex-blue-50/30 via-transparent to-techflex-orange-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Floating particles effect */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-techflex-blue/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-1000"
                        style={{
                            top: `${20 + i * 15}%`,
                            left: `${10 + i * 15}%`,
                            animationDelay: `${i * 200}ms`,
                            transform: isHovered ? `translateY(-${i * 5}px) scale(1.2)` : 'translateY(0) scale(1)',
                        }}
                    />
                ))}
            </div>

            {/* Content */}
            <div className="relative p-8 flex flex-col flex-grow">
                {/* Enhanced icon section */}
                <div className="relative mb-8">
                    <div className="absolute -inset-2 bg-gradient-to-r from-techflex-blue-100/50 to-techflex-orange-100/50 rounded-3xl opacity-0 group-hover:opacity-100 animate-pulse transition-all duration-500"></div>
                    <div className="flex items-center justify-center h-20 w-20 rounded-3xl bg-gradient-to-br from-techflex-blue-100 to-techflex-blue-200 relative z-10 group-hover:from-techflex-blue-200 group-hover:to-techflex-blue-300 transition-all duration-500 shadow-lg group-hover:shadow-xl group-hover:scale-110">
                        <Icon name={iconName} className="h-10 w-10 text-techflex-blue group-hover:text-techflex-blue-700 transition-colors duration-300" />
                    </div>
                </div>

                {/* Title with animated underline */}
                <h3 className="text-2xl font-bold text-brand-gray-900 group-hover:text-techflex-blue transition-colors duration-300 relative mb-4">
                    {title}
                    <span className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-techflex-blue to-techflex-orange group-hover:w-16 transition-all duration-500 rounded-full"></span>
                </h3>

                {/* Description */}
                <p className="text-brand-gray-600 group-hover:text-brand-gray-700 transition-colors duration-300 mb-6 flex-grow leading-relaxed">
                    {children}
                </p>

                {/* Features list */}
                <div className="space-y-2">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="flex items-center gap-3 text-sm text-brand-gray-600 group-hover:text-brand-gray-700 transition-all duration-300"
                            style={{ transitionDelay: `${idx * 100}ms` }}
                        >
                            <div className="w-2 h-2 bg-techflex-orange rounded-full group-hover:scale-125 transition-transform duration-300" />
                            <span>{feature}</span>
                        </div>
                    ))}
                </div>

                {/* CTA Button */}
                <div className="mt-6 pt-4 border-t border-brand-gray-100 group-hover:border-techflex-blue-200 transition-colors duration-300">
                    <button className="w-full py-3 px-6 bg-gradient-to-r from-techflex-blue to-techflex-blue-600 text-white font-semibold rounded-xl hover:from-techflex-blue-600 hover:to-techflex-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95">
                        Learn More
                    </button>
                </div>
            </div>
        </div>
    );
};

// Enhanced tech tag with better interactivity
const TechTag: React.FC<{ name: string; category: string }> = ({ name, }) => {
    const [isHovered, setIsHovered] = useState(false);

    const categoryColors = {
        Frontend: 'from-techflex-blue-100 to-techflex-blue-200 text-techflex-blue-800',
        Backend: 'from-techflex-orange-100 to-techflex-orange-200 text-techflex-orange-800',
        Mobile: 'from-brand-gray-100 to-brand-gray-200 text-brand-gray-800',
        Database: 'from-techflex-blue-100 to-techflex-blue-200 text-techflex-blue-800',
        'Cloud & DevOps': 'from-techflex-orange-100 to-techflex-orange-200 text-techflex-orange-800'
    };

    // @ts-ignore
    return (
        <span
            className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${ categoryColors.Frontend} text-sm font-semibold rounded-full m-1 transition-all duration-300 cursor-pointer border border-white/50 hover:scale-110 hover:shadow-lg ${
                isHovered ? 'shadow-lg transform scale-110' : ''
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
            {name}
        </span>
    );
};

const SoftwareDevelopmentPage: React.FC<SoftwareDevelopmentPageProps> = ({ onNavigate }) => {
    const [activeProcessStep, setActiveProcessStep] = useState(0);
    const [isInView, setIsInView] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const processRef = useRef<HTMLDivElement>(null);

    // Enhanced scroll progress tracking
    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY;
            const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrolled / maxHeight) * 100;
            setScrollProgress(progress);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Auto-rotate process steps
    useEffect(() => {
        const interval = setInterval(() => {
            if (!isInView) return;
            setActiveProcessStep(prev => (prev + 1) % processSteps.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [isInView]);

    // Intersection observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsInView(entry.isIntersecting);
            },
            { threshold: 0.2 }
        );

        if (processRef.current) {
            observer.observe(processRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const processSteps = [
        {
            icon: 'compass',
            title: 'Discovery & Strategy',
            description: 'We start by understanding your vision, goals, and target audience. Through comprehensive market research and stakeholder interviews, we define a clear product roadmap that aligns with your business objectives.'
        },
        {
            icon: 'pencil',
            title: 'UI/UX Design',
            description: 'Our design team creates intuitive wireframes and stunning, high-fidelity mockups that prioritize user experience. We focus on creating interfaces that are both beautiful and functional.'
        },
        {
            icon: 'code',
            title: 'Development',
            description: 'Our expert engineers write clean, efficient, and scalable code using modern technologies and agile methodologies. We ensure best practices in security, performance, and maintainability.'
        },
        {
            icon: 'shield-check',
            title: 'Testing & QA',
            description: 'Rigorous testing is performed at every stage to ensure a bug-free, high-performance, and secure application. We conduct automated and manual testing across all devices and platforms.'
        },
        {
            icon: 'rocket-launch',
            title: 'Deployment',
            description: 'We handle seamless deployment to the cloud with zero-downtime strategies, ensuring your application is live, secure, and available to users worldwide with optimal performance.'
        },
        {
            icon: 'refresh',
            title: 'Support & Growth',
            description: 'Our partnership extends beyond launch. We provide 24/7 monitoring, regular updates, performance optimization, and help you scale as your business grows.'
        },
    ];

    const whatWeBuildItems = [
        {
            icon: 'computer-desktop',
            title: 'Custom Web Applications',
            description: 'Scalable and responsive web applications built with modern frameworks, from complex enterprise dashboards to customer-facing platforms that drive engagement.',
            features: ['React/Vue/Angular', 'Cloud-Native Architecture', 'Real-time Features', 'API Integration']
        },
        {
            icon: 'device-phone-mobile',
            title: 'Mobile Applications',
            description: 'Native and cross-platform mobile apps that deliver exceptional user experiences across iOS and Android devices with seamless performance.',
            features: ['Native iOS/Android', 'React Native', 'Push Notifications', 'Offline Capabilities']
        },
        {
            icon: 'briefcase',
            title: 'Enterprise Solutions',
            description: 'Comprehensive ERP and CRM systems designed to streamline your operations, automate workflows, and provide actionable business insights.',
            features: ['Custom ERP/CRM', 'Workflow Automation', 'Analytics Dashboard', 'Integration Ready']
        },
        {
            icon: 'link',
            title: 'API & Integrations',
            description: 'Robust and secure APIs that connect your systems seamlessly, enabling data flow between applications and third-party services.',
            features: ['RESTful APIs', 'GraphQL', 'Microservices', 'Third-party Integration']
        },
    ];

    const techCategories = [
        { name: 'Frontend', techs: ['React', 'Vue.js', 'Angular', 'Next.js', 'Tailwind CSS', 'TypeScript'] },
        { name: 'Backend', techs: ['Node.js', 'Python', 'Java', 'Go', 'PHP', '.NET Core'] },
        { name: 'Mobile', techs: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Xamarin'] },
        { name: 'Database', techs: ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Firebase'] },
        { name: 'Cloud & DevOps', techs: ['AWS', 'Azure', 'Docker', 'Kubernetes', 'CI/CD'] },
    ];

    return (
        <div className="bg-brand-gray-50 animate-fadeIn">
            {/* Scroll Progress Indicator */}
            <div className="fixed top-0 left-0 w-full h-1 bg-brand-gray-200 z-50">
                <div
                    className="h-full bg-gradient-to-r from-techflex-blue to-techflex-orange transition-all duration-300"
                    style={{ width: `${scrollProgress}%` }}
                />
            </div>

            {/* Enhanced Hero Section */}
            <div className="relative bg-white text-brand-gray-900 py-28 sm:py-36 overflow-hidden">
                {/* Dynamic background pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${encodeURIComponent('1469B7')}' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>

                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/90 to-techflex-blue-50/90"></div>

                {/* Floating elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/6 w-72 h-72 bg-techflex-blue-500/5 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/6 w-96 h-96 bg-techflex-orange-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-brand-gray-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
                    <div className="animate-fadeInUp max-w-5xl mx-auto">
                        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-brand-gray-900 mb-6 leading-tight">
                            Craft Digital
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-techflex-blue to-techflex-orange">
                                Experiences
                            </span>
                        </h1>
                        <p className="mt-8 max-w-3xl mx-auto text-xl md:text-2xl text-brand-gray-600 leading-relaxed">
                            From concept to launch, we build scalable, secure, and user-centric software solutions that transform your business and delight your customers.
                        </p>

                        {/* Enhanced CTA buttons */}
                        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button
                                onClick={() => onNavigate('contact')}
                                className="group inline-flex items-center gap-3 bg-gradient-to-r from-techflex-blue to-techflex-blue-600 hover:from-techflex-blue-600 hover:to-techflex-blue-700 text-white font-bold py-5 px-10 rounded-2xl text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                            >
                                Start Your Project
                                <Icon name="arrow-right" className="h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
                            </button>
                            <button
                                onClick={() => onNavigate('portfolio')}
                                className="inline-flex items-center gap-3 bg-white text-techflex-blue font-bold py-5 px-10 rounded-2xl text-lg transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-techflex-blue-100 hover:border-techflex-blue-200 transform hover:scale-105 active:scale-95"
                            >
                                View Our Work
                                <Icon name="eye" className="h-6 w-6" />
                            </button>
                        </div>
                    </div>

                    {/* Enhanced stats section */}
                    <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                        {[
                            { number: "500+", label: "Projects Delivered", icon: "chart-bar" },
                            { number: "99%", label: "Client Satisfaction", icon: "heart" },
                            { number: "15+", label: "Years Experience", icon: "clock" },
                            { number: "24/7", label: "Support Available", icon: "shield-check" }
                        ].map((stat, index) => (
                            <div
                                key={index}
                                className="bg-white/90 backdrop-blur-sm px-6 py-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-brand-gray-100"
                                style={{ animationDelay: `${index * 150}ms` }}
                            >
                                <div className="flex items-center justify-center mb-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-techflex-blue-100 to-techflex-blue-200 rounded-xl flex items-center justify-center">
                                        <Icon name={stat.icon} className="w-6 h-6 text-techflex-blue" />
                                    </div>
                                </div>
                                <p className="text-techflex-blue text-3xl font-black mb-2">{stat.number}</p>
                                <p className="text-brand-gray-600 text-sm font-medium">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Enhanced Process Section */}
            <section ref={processRef} className="py-24 sm:py-32 relative overflow-hidden bg-gradient-to-b from-white to-brand-gray-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="text-center mb-20">
                        <div className="animate-fadeInUp">
                            <span className="inline-block px-4 py-2 bg-techflex-blue-100 text-techflex-blue-800 rounded-full text-sm font-semibold mb-4">
                                Our Process
                            </span>
                            <h2 className="text-4xl md:text-5xl font-black text-brand-gray-900 mb-6">
                                From Idea to Impact
                            </h2>
                            <p className="max-w-3xl mx-auto text-xl text-brand-gray-600 leading-relaxed">
                                Our proven methodology ensures your project succeeds at every stage, from initial concept through ongoing support.
                            </p>
                        </div>
                    </div>

                    <div className="max-w-5xl mx-auto">
                        {/* Interactive process selector */}
                        <div className="flex flex-wrap justify-center gap-2 mb-12 p-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
                            {processSteps.map((step, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveProcessStep(index)}
                                    className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                                        activeProcessStep === index
                                            ? 'bg-gradient-to-r from-techflex-blue to-techflex-blue-600 text-white shadow-lg shadow-techflex-blue/20 scale-105'
                                            : 'text-brand-gray-600 hover:bg-white hover:text-brand-gray-900 hover:shadow-md'
                                    }`}
                                >
                                    <Icon name={step.icon} className="w-4 h-4" />
                                    <span className="hidden sm:inline">{step.title}</span>
                                    <span className="sm:hidden">{index + 1}</span>
                                </button>
                            ))}
                        </div>

                        {/* Process steps */}
                        <div className="space-y-6">
                            {processSteps.map((step, index) => (
                                <ProcessStep
                                    key={index}
                                    iconName={step.icon}
                                    number={`${index + 1}`}
                                    title={step.title}
                                    isActive={activeProcessStep === index}
                                    onClick={() => setActiveProcessStep(index)}
                                    progress={activeProcessStep >= index ? 100 : 0}
                                >
                                    {step.description}
                                </ProcessStep>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Enhanced Solutions Section */}
            <section className="bg-gradient-to-br from-brand-gray-100 via-brand-gray-50 to-white py-24 sm:py-32 relative overflow-hidden">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="text-center mb-20">
                        <div className="animate-fadeInUp">
                            <span className="inline-block px-4 py-2 bg-techflex-orange-100 text-techflex-orange-800 rounded-full text-sm font-semibold mb-4">
                                What We Build
                            </span>
                            <h2 className="text-4xl md:text-5xl font-black text-brand-gray-900 mb-6">
                                Solutions That Scale
                            </h2>
                            <p className="max-w-3xl mx-auto text-xl text-brand-gray-600 leading-relaxed">
                                We engineer robust software solutions that grow with your business and adapt to your evolving needs.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {whatWeBuildItems.map((item, index) => (
                            <WhatWeBuildCard
                                key={item.title}
                                iconName={item.icon}
                                title={item.title}
                                index={index}
                                features={item.features}
                            >
                                {item.description}
                            </WhatWeBuildCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* Enhanced Tech Stack Section */}
            <section className="py-24 sm:py-32 relative overflow-hidden bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="text-center mb-20">
                        <div className="animate-fadeInUp">
                            <span className="inline-block px-4 py-2 bg-brand-gray-100 text-brand-gray-800 rounded-full text-sm font-semibold mb-4">
                                Technology Stack
                            </span>
                            <h2 className="text-4xl md:text-5xl font-black text-brand-gray-900 mb-6">
                                Cutting-Edge Technologies
                            </h2>
                            <p className="max-w-3xl mx-auto text-xl text-brand-gray-600 leading-relaxed">
                                We leverage the latest, most reliable technologies to build future-proof applications that perform at scale.
                            </p>
                        </div>
                    </div>

                    <div className="max-w-6xl mx-auto bg-gradient-to-br from-white to-brand-gray-50 p-12 rounded-3xl shadow-2xl border border-brand-gray-200/50">
                        {techCategories.map((cat, index) => (
                            <div
                                key={cat.name}
                                className={`py-8 ${index < techCategories.length - 1 ? 'border-b border-brand-gray-200' : ''}`}
                                style={{ animationDelay: `${index * 150}ms` }}
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-3 h-3 bg-gradient-to-r from-techflex-blue to-techflex-orange rounded-full" />
                                    <h3 className="text-2xl font-bold text-brand-gray-900">{cat.name}</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {cat.techs.map(tech => (
                                        <TechTag key={tech} name={tech} category={cat.name} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Enhanced CTA Section */}
            <section className="bg-gradient-to-br from-techflex-blue-900 via-techflex-blue-800 to-techflex-blue-700 text-white relative overflow-hidden py-24 sm:py-32">
                {/* Animated background elements */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9Im5vbmUiLz48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4=')] opacity-30" />
                    {[...Array(30)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-2 h-2 bg-white/10 rounded-full animate-pulse"
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                animationDuration: `${3 + Math.random() * 4}s`,
                                animationDelay: `${Math.random() * 3}s`,
                            }}
                        />
                    ))}
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="animate-fadeInUp">
                            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
                                Ready to Transform Your Vision?
                            </h2>
                            <p className="text-xl text-white/90 mb-12 leading-relaxed">
                                Let's discuss your project and explore how we can bring your ideas to life with cutting-edge technology and exceptional design.
                            </p>

                            {/* Enhanced contact cards */}
                            <div className="grid md:grid-cols-2 gap-8 mb-12">
                                <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                                    <h3 className="text-2xl font-bold mb-4">Free Consultation</h3>
                                    <p className="text-white/80 mb-6">
                                        Book a 30-minute call to discuss your project requirements and get expert advice.
                                    </p>
                                    <button
                                        onClick={() => onNavigate('contact')}
                                        className="w-full bg-techflex-orange text-white font-bold py-4 px-8 rounded-xl hover:bg-techflex-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                                    >
                                        Schedule Call
                                        <Icon name="calendar" className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                                    <h3 className="text-2xl font-bold mb-4">Get a Quote</h3>
                                    <p className="text-white/80 mb-6">
                                        Tell us about your project and receive a detailed proposal within 24 hours.
                                    </p>
                                    <button
                                        onClick={() => onNavigate('contact')}
                                        className="w-full bg-white text-techflex-blue font-bold py-4 px-8 rounded-xl hover:bg-brand-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                                    >
                                        Request Quote
                                        <Icon name="document-text" className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Contact information */}
                            <div className="flex flex-wrap justify-center gap-8 text-white/80">
                                <div className="flex items-center gap-3">
                                    <Icon name="mail" className="h-5 w-5 text-techflex-orange" />
                                    <span>hello@techflex.com</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Icon name="phone" className="h-5 w-5 text-techflex-orange" />
                                    <span>+1 (555) 123-4567</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Icon name="map-pin" className="h-5 w-5 text-techflex-orange" />
                                    <span>San Francisco, CA</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SoftwareDevelopmentPage;