import React, { useState, useEffect, useRef } from 'react';
import Icon from '../components/Icon';

interface ElectronicsPageProps {
    onNavigate: (page: string) => void;
}

const CapabilityCard: React.FC<{
    iconName: string;
    title: string;
    children: React.ReactNode;
    index: number;
    isVisible: boolean;
}> = ({ iconName, title, children, index, isVisible }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePosition({
            x: (e.clientX - rect.left - rect.width / 2) / rect.width,
            y: (e.clientY - rect.top - rect.height / 2) / rect.height,
        });
    };

    const gradients = [
        'from-techflex-blue-500 to-techflex-blue-700',
        'from-techflex-orange-500 to-techflex-orange-700',
        'from-brand-gray-600 to-brand-gray-800',
        'from-techflex-blue-600 to-techflex-orange-600'
    ];

    const glowColors = [
        'techflex-blue-500/20',
        'techflex-orange-500/20',
        'brand-gray-500/20',
        'techflex-blue-500/20'
    ];

    const currentGradient = gradients[index % gradients.length];
    const currentGlow = glowColors[index % glowColors.length];

    return (
        <div
            className={`group relative bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-brand-gray-100/50 text-center h-full overflow-hidden cursor-pointer transform-gpu ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            } ${isHovered ? 'scale-[1.02] -translate-y-2' : ''}`}
            style={{
                transitionDelay: `${index * 150}ms`,
                transform: isHovered ? `perspective(1000px) rotateX(${mousePosition.y * 5}deg) rotateY(${mousePosition.x * 5}deg) translateZ(20px)` : undefined,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseMove={handleMouseMove}
        >
            {/* Animated background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${currentGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`} />

            {/* Glow effect */}
            <div className={`absolute -inset-1 bg-${currentGlow} rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} />

            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl">
                <div className="absolute top-4 right-4 w-2 h-2 bg-techflex-orange rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:animate-bounce" />
                <div className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-techflex-blue rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:animate-pulse" style={{ animationDelay: '0.3s' }} />
                <div className="absolute top-1/2 left-4 w-1 h-1 bg-brand-gray-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:animate-ping" style={{ animationDelay: '0.6s' }} />
            </div>

            {/* Enhanced icon container */}
            <div className="relative mb-8">
                <div className="relative w-20 h-20 mx-auto">
                    {/* Animated rings */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-techflex-orange-100 to-techflex-blue-100 opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                    <div className="absolute inset-2 rounded-full bg-white/50 backdrop-blur-sm border border-white/30 group-hover:scale-110 transition-transform duration-500" />

                    {/* Main icon background */}
                    <div className={`absolute inset-3 rounded-full bg-gradient-to-br ${currentGradient} flex items-center justify-center group-hover:rotate-12 transition-all duration-500 shadow-lg`}>
                        <Icon name={iconName} className="h-8 w-8 text-white drop-shadow-sm" />
                    </div>

                    {/* Pulse effect */}
                    <div className="absolute inset-0 rounded-full border-2 border-techflex-blue-300/30 opacity-0 group-hover:opacity-100 animate-ping" />
                </div>
            </div>

            <div className="relative z-10">
                <h3 className="text-xl font-bold text-brand-gray-900 mb-4 group-hover:text-techflex-blue-700 transition-colors duration-300">
                    {title}
                </h3>
                <p className="text-brand-gray-600 leading-relaxed group-hover:text-brand-gray-700 transition-colors duration-300">
                    {children}
                </p>
            </div>

            {/* Interactive shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover:-translate-x-full transition-transform duration-1000 opacity-0 group-hover:opacity-100" />
        </div>
    );
};

const ProcessStep: React.FC<{
    iconName: string;
    number: string;
    title: string;
    children: React.ReactNode;
    index: number;
    isVisible: boolean;
}> = ({ iconName, number, title, children, index, isVisible }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={`relative pl-16 pb-12 transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
            style={{ transitionDelay: `${index * 200}ms` }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Enhanced step indicator */}
            <div className="absolute left-0 top-1">
                <div className={`relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-techflex-blue-100 to-techflex-blue-200 ring-4 ring-white shadow-lg transition-all duration-300 ${
                    isHovered ? 'scale-110 shadow-xl bg-gradient-to-br from-techflex-blue-200 to-techflex-blue-300' : ''
                }`}>
                    {/* Animated background */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-techflex-blue-500/20 to-techflex-orange-500/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    <Icon name={iconName} className="relative z-10 h-6 w-6 text-techflex-blue-700 transition-colors duration-300" />

                    {/* Pulse animation */}
                    <div className={`absolute inset-0 rounded-2xl border-2 border-techflex-blue-400/50 opacity-0 transition-opacity duration-300 ${
                        isHovered ? 'opacity-100 animate-ping' : ''
                    }`} />
                </div>
            </div>

            {/* Content */}
            <div className="relative">
                <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm font-bold text-techflex-orange bg-techflex-orange-100 px-3 py-1 rounded-full">
                        {number}
                    </span>
                    <h3 className={`text-xl font-bold text-brand-gray-900 transition-colors duration-300 ${
                        isHovered ? 'text-techflex-blue-700' : ''
                    }`}>
                        {title}
                    </h3>
                </div>
                <p className={`text-base text-brand-gray-600 leading-relaxed transition-colors duration-300 ${
                    isHovered ? 'text-brand-gray-700' : ''
                }`}>
                    {children}
                </p>
            </div>
        </div>
    );
};

const ElectronicsPage: React.FC<ElectronicsPageProps> = ({ onNavigate }) => {
    const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeTestimonial, setActiveTestimonial] = useState(0);

    const heroRef = useRef<HTMLDivElement>(null);
    const capabilitiesRef = useRef<HTMLDivElement>(null);
    const processRef = useRef<HTMLDivElement>(null);
    const industriesRef = useRef<HTMLDivElement>(null);

    // Scroll progress tracking
    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY;
            const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = Math.min((scrolled / maxHeight) * 100, 100);
            setScrollProgress(progress);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Intersection observer for animations
    useEffect(() => {
        const observers = new Map();
        const refs = [
            { ref: capabilitiesRef, id: 'capabilities' },
            { ref: processRef, id: 'process' },
            { ref: industriesRef, id: 'industries' }
        ];

        refs.forEach(({ ref, id }) => {
            if (ref.current) {
                const observer = new IntersectionObserver(
                    ([entry]) => {
                        if (entry.isIntersecting) {
                            setVisibleSections(prev => new Set([...prev, id]));
                        }
                    },
                    { threshold: 0.2, rootMargin: '50px' }
                );
                observer.observe(ref.current);
                observers.set(id, observer);
            }
        });

        return () => {
            observers.forEach(observer => observer.disconnect());
        };
    }, []);

    // Auto-rotate testimonials
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTestimonial(prev => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const capabilities = [
        {
            icon: 'cpu-chip',
            title: 'PCB Design & Layout',
            description: 'Expert design of single, double, and multi-layer printed circuit boards optimized for performance and manufacturability with cutting-edge CAD tools.'
        },
        {
            icon: 'code',
            title: 'Firmware Development',
            description: 'Custom firmware for microcontrollers (ARM, AVR, ESP32) to bring your hardware to life with robust, efficient, and scalable functionality.'
        },
        {
            icon: 'cube-transparent',
            title: 'Prototyping & Assembly',
            description: 'Rapid prototyping services including 3D printing, PCB assembly, and component sourcing to quickly iterate and validate your designs.'
        },
        {
            icon: 'wrench-screwdriver',
            title: 'Manufacturing & Scale',
            description: 'End-to-end manufacturing support from component sourcing to full-scale production with rigorous quality control and testing protocols.'
        },
    ];

    const processSteps = [
        {
            icon: 'light-bulb',
            title: 'Ideation & Feasibility',
            description: 'We collaborate with you to refine your concept, define technical specifications, and assess both technical feasibility and market potential.'
        },
        {
            icon: 'clipboard-document-list',
            title: 'Schematic & PCB Design',
            description: 'Our engineers create detailed circuit schematics and optimize PCB layouts for signal integrity, thermal management, and EMC compliance.'
        },
        {
            icon: 'beaker',
            title: 'Prototyping & Validation',
            description: 'We build functional prototypes for comprehensive testing, validation, and iterative design refinement to ensure optimal performance.'
        },
        {
            icon: 'cpu-chip',
            title: 'Firmware Integration',
            description: 'Custom firmware development and integration with rigorous testing to ensure seamless hardware-software interaction and reliability.'
        },
        {
            icon: 'shield-check',
            title: 'Quality Assurance',
            description: 'Comprehensive QA processes including automated testing, compliance verification, and reliability assessments to meet industry standards.'
        },
        {
            icon: 'rocket-launch',
            title: 'Production & Scale',
            description: 'Seamless transition to mass production with supply chain management, quality control, and ongoing support for market success.'
        },
    ];

    const industries = [
        { name: 'Consumer Electronics', icon: '📱', count: '250+' },
        { name: 'IoT & Smart Home', icon: '🏠', count: '180+' },
        { name: 'Medical Devices', icon: '🏥', count: '120+' },
        { name: 'Industrial Automation', icon: '🏭', count: '200+' },
        { name: 'Automotive Systems', icon: '🚗', count: '150+' }
    ];

    const testimonials = [
        {
            quote: "TechFlex transformed our IoT concept into a market-ready product in just 8 months. Their expertise in both hardware and firmware development is unmatched.",
            author: "Sarah Johnson",
            position: "CTO, SmartHome Solutions",
            avatar: "/images/testimonial-1.jpg"
        },
        {
            quote: "The PCB design quality and attention to signal integrity helped us achieve 99.8% reliability in our medical monitoring devices.",
            author: "Dr. Michael Chen",
            position: "Lead Engineer, MedTech Innovations",
            avatar: "/images/testimonial-2.jpg"
        },
        {
            quote: "From prototype to 10K units production, TechFlex handled everything seamlessly. Our automotive sensor is now industry certified.",
            author: "Emma Rodriguez",
            position: "Product Manager, AutoSense Corp",
            avatar: "/images/testimonial-3.jpg"
        }
    ];

    const stats = [
        { value: '500+', label: 'Projects Completed', icon: 'check-circle' },
        { value: '98%', label: 'Success Rate', icon: 'trophy' },
        { value: '24/7', label: 'Support Available', icon: 'clock' },
        { value: '15+', label: 'Years Experience', icon: 'star' }
    ];

    return (
        <div className="bg-brand-gray-50 overflow-x-hidden">
            {/* Progress Bar */}
            <div className="fixed top-0 left-0 w-full h-1 bg-brand-gray-200/50 z-50">
                <div
                    className="h-full bg-gradient-to-r from-techflex-blue-500 to-techflex-orange-500 transition-all duration-300"
                    style={{ width: `${scrollProgress}%` }}
                />
            </div>

            {/* Enhanced Hero Section */}
            <div ref={heroRef} className="relative bg-gradient-to-br from-techflex-blue via-techflex-blue-700 to-techflex-blue-900 text-white py-24 sm:py-32 lg:py-40 overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/6 w-72 h-72 bg-techflex-orange-500/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/3 right-1/5 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
                    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-techflex-blue-300/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }} />
                </div>

                {/* Grid pattern overlay */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
                        backgroundSize: '50px 50px'
                    }} />
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-5xl mx-auto">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                            <div className="w-2 h-2 bg-techflex-orange rounded-full animate-pulse" />
                            <span className="text-sm font-medium">Electronics Innovation Hub</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 bg-gradient-to-r from-white via-techflex-blue-100 to-techflex-orange-200 bg-clip-text text-transparent">
                            Next-Gen Electronics
                            <span className="block text-white">Solutions</span>
                        </h1>

                        <p className="text-lg md:text-xl lg:text-2xl text-brand-gray-200 max-w-4xl mx-auto leading-relaxed mb-12">
                            From revolutionary concepts to market-ready products, we engineer custom hardware and embedded systems that define tomorrow's technology landscape.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                            <button
                                onClick={() => onNavigate('contact')}
                                className="group relative px-8 py-4 bg-gradient-to-r from-techflex-orange-500 to-techflex-orange-600 text-white font-bold rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                            >
                                <span className="relative z-10">Start Your Project</span>
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-techflex-orange-600 to-techflex-orange-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </button>

                            <button className="group px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-2xl text-lg transition-all duration-300 hover:bg-white/10 backdrop-blur-sm">
                                View Portfolio
                                <Icon name="arrow-right" className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                            {stats.map((stat, index) => (
                                <div key={stat.label} className="text-center group" style={{ animationDelay: `${index * 200}ms` }}>
                                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-white/10 backdrop-blur-sm rounded-xl group-hover:bg-white/20 transition-colors duration-300">
                                        <Icon name={stat.icon} className="w-6 h-6 text-techflex-orange" />
                                    </div>
                                    <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                                    <div className="text-sm text-brand-gray-300">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Capabilities Section */}
            <section ref={capabilitiesRef} className="py-20 sm:py-28 relative">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <span className="inline-block px-4 py-2 mb-4 text-sm font-medium rounded-full bg-techflex-blue-100 text-techflex-blue-700">
                            Core Capabilities
                        </span>
                        <h2 className="text-4xl lg:text-5xl font-extrabold text-brand-gray-900 mb-6">
                            End-to-End Electronics
                            <span className="block text-techflex-blue">Development Services</span>
                        </h2>
                        <p className="text-lg text-brand-gray-600 max-w-3xl mx-auto leading-relaxed">
                            We handle every aspect of your electronics project with precision, innovation, and industry-leading expertise to bring your vision to life.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {capabilities.map((item, index) => (
                            <CapabilityCard
                                key={item.title}
                                iconName={item.icon}
                                title={item.title}
                                index={index}
                                isVisible={visibleSections.has('capabilities')}
                            >
                                {item.description}
                            </CapabilityCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* Enhanced Process Section */}
            <section ref={processRef} className="bg-gradient-to-br from-brand-gray-100 via-white to-techflex-blue-50 py-20 sm:py-28 relative overflow-hidden">
                {/* Background elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 right-0 w-72 h-72 bg-techflex-orange-500/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-techflex-blue-500/5 rounded-full blur-3xl" />
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-20">
                        <span className="inline-block px-4 py-2 mb-4 text-sm font-medium rounded-full bg-techflex-orange-100 text-techflex-orange-700">
                            Development Process
                        </span>
                        <h2 className="text-4xl lg:text-5xl font-extrabold text-brand-gray-900 mb-6">
                            From Concept to
                            <span className="block text-techflex-orange">Market Success</span>
                        </h2>
                        <p className="text-lg text-brand-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Our proven 6-step methodology ensures seamless project delivery from initial ideation to full-scale production and market launch.
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div className="relative">
                            {/* Enhanced timeline line */}
                            <div className="absolute left-6 top-6 bottom-6 w-px bg-gradient-to-b from-techflex-blue-300 via-techflex-orange-300 to-techflex-blue-300 opacity-30" />

                            <div className="space-y-0">
                                {processSteps.map((step, index) => (
                                    <ProcessStep
                                        key={step.title}
                                        iconName={step.icon}
                                        number={`${index + 1}`}
                                        title={step.title}
                                        index={index}
                                        isVisible={visibleSections.has('process')}
                                    >
                                        {step.description}
                                    </ProcessStep>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Enhanced Testimonials Section */}
            <section className="py-20 sm:py-28 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-2 mb-4 text-sm font-medium rounded-full bg-brand-gray-100 text-brand-gray-700">
                            Client Success Stories
                        </span>
                        <h2 className="text-4xl lg:text-5xl font-extrabold text-brand-gray-900 mb-6">
                            Trusted by Industry
                            <span className="block text-techflex-blue">Leaders Worldwide</span>
                        </h2>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div className="relative bg-gradient-to-br from-techflex-blue-50 to-white rounded-3xl p-8 lg:p-12 shadow-lg">
                            <div className="text-center">
                                <div className="w-20 h-20 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                    <div className="w-full h-full bg-gradient-to-br from-techflex-blue-200 to-techflex-orange-200" />
                                </div>

                                <blockquote className="text-xl lg:text-2xl text-brand-gray-800 font-medium leading-relaxed mb-6">
                                    "{testimonials[activeTestimonial].quote}"
                                </blockquote>

                                <div className="mb-8">
                                    <div className="font-bold text-brand-gray-900 text-lg">
                                        {testimonials[activeTestimonial].author}
                                    </div>
                                    <div className="text-brand-gray-600">
                                        {testimonials[activeTestimonial].position}
                                    </div>
                                </div>

                                {/* Pagination dots */}
                                <div className="flex justify-center gap-2">
                                    {testimonials.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setActiveTestimonial(index)}
                                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                                index === activeTestimonial
                                                    ? 'bg-techflex-blue-500 scale-125'
                                                    : 'bg-brand-gray-300 hover:bg-brand-gray-400'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Enhanced Industries Section */}
            <section ref={industriesRef} className="py-20 sm:py-28 bg-gradient-to-br from-brand-gray-50 to-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-2 mb-4 text-sm font-medium rounded-full bg-techflex-orange-100 text-techflex-orange-700">
                            Industry Expertise
                        </span>
                        <h2 className="text-4xl lg:text-5xl font-extrabold text-brand-gray-900 mb-6">
                            Delivering Innovation
                            <span className="block text-techflex-orange">Across Industries</span>
                        </h2>
                        <p className="text-lg text-brand-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Our diverse portfolio spans multiple sectors, bringing specialized expertise and proven solutions to each unique market.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        {industries.map((industry, index) => (
                            <div
                                key={industry.name}
                                className={`group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-500 border border-brand-gray-100/50 cursor-pointer transform-gpu ${
                                    visibleSections.has('industries') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                } hover:scale-105 hover:-translate-y-2`}
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                    {industry.icon}
                                </div>
                                <h3 className="text-lg font-bold text-brand-gray-900 mb-2 group-hover:text-techflex-blue-700 transition-colors duration-300">
                                    {industry.name}
                                </h3>
                                <p className="text-sm font-medium text-techflex-orange bg-techflex-orange-100 px-3 py-1 rounded-full inline-block">
                                    {industry.count} Projects
                                </p>

                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-techflex-blue-500/5 to-techflex-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Enhanced CTA Section */}
            <section className="relative bg-gradient-to-br from-techflex-blue-900 via-techflex-blue to-techflex-blue-800 overflow-hidden">
                {/* Background elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-techflex-orange-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
                    <div className="text-center text-white max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                            <Icon name="rocket-launch" className="w-4 h-4 text-techflex-orange" />
                            <span className="text-sm font-medium">Ready to Transform Your Idea?</span>
                        </div>

                        <h2 className="text-4xl lg:text-6xl font-extrabold tracking-tight mb-8">
                            Let's Build the Future
                            <span className="block text-techflex-orange">Together</span>
                        </h2>

                        <p className="text-lg lg:text-xl text-brand-gray-200 max-w-3xl mx-auto leading-relaxed mb-12">
                            Ready to transform your innovative concept into a market-ready product? Our team of experts is here to guide you through every step of the journey.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button
                                onClick={() => onNavigate('contact')}
                                className="group relative px-10 py-5 bg-gradient-to-r from-techflex-orange-500 to-techflex-orange-600 text-white font-bold rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Get Free Consultation
                                    <Icon name="arrow-right" className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                </span>
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-techflex-orange-600 to-techflex-orange-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </button>

                            <button className="group px-10 py-5 border-2 border-white/30 text-white font-semibold rounded-2xl text-lg transition-all duration-300 hover:bg-white/10 backdrop-blur-sm">
                                <span className="flex items-center gap-2">
                                    <Icon name="phone" className="w-5 h-5" />
                                    Call +260 XXX-XXXX
                                </span>
                            </button>
                        </div>

                        {/* Trust indicators */}
                        <div className="mt-16 pt-12 border-t border-white/20">
                            <p className="text-sm text-brand-gray-300 mb-6">Trusted by 500+ businesses worldwide</p>
                            <div className="flex justify-center items-center gap-8 opacity-60">
                                <div className="text-xs font-medium">ISO 9001 Certified</div>
                                <div className="w-px h-4 bg-white/30" />
                                <div className="text-xs font-medium">24/7 Support</div>
                                <div className="w-px h-4 bg-white/30" />
                                <div className="text-xs font-medium">Money-back Guarantee</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ElectronicsPage;