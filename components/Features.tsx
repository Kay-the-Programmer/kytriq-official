import React, { useState, useEffect, useRef } from 'react';
import Icon from './Icon';

interface FeatureCardProps {
    iconName: string;
    title: string;
    description: string;
    onClick: () => void;
    index: number;
    isVisible: boolean;
    isHovered: boolean;
    onHover: (hovered: boolean) => void;
    gradient: string;
    stats?: string;
    badge?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
                                                     iconName,
                                                     title,
                                                     description,
                                                     onClick,
                                                     index,
                                                     isVisible,
                                                     isHovered,
                                                     onHover,
                                                     gradient,
                                                     stats,
                                                     badge
                                                 }) => {
    const [isPressed, setIsPressed] = useState(false);

    return (
        <div
            onClick={onClick}
            onMouseEnter={() => onHover(true)}
            onMouseLeave={() => onHover(false)}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            className={`group relative bg-white/70 backdrop-blur-md rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 transform-gpu ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
            } ${
                isHovered
                    ? 'shadow-2xl shadow-techflex-blue-500/15 scale-105 -translate-y-3 bg-white/90'
                    : 'shadow-lg hover:shadow-xl'
            } ${
                isPressed ? 'scale-95' : ''
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
        >
            {/* Animated border gradient */}
            <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${gradient} p-[2px]`}>
                    <div className="w-full h-full bg-white rounded-3xl opacity-90"></div>
                </div>
            </div>

            {/* Badge with enhanced animation */}
            {badge && (
                <div className="absolute -top-3 -right-3 z-20">
                    <div className={`bg-gradient-to-r ${gradient} text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg transform group-hover:scale-110 transition-all duration-300`}>
                        <span className="relative z-10">{badge}</span>
                        <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse"></div>
                    </div>
                </div>
            )}

            {/* Interactive background pattern */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-all duration-700">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(20,105,183,0.3)_0%,transparent_70%)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,102,0,0.2)_0%,transparent_50%)]"></div>
            </div>

            {/* Content container with better spacing */}
            <div className="relative p-8 text-center">
                {/* Enhanced icon section */}
                <div className="relative mb-8">
                    {/* Animated background rings */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-techflex-blue-100/50 to-techflex-orange-100/50 opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-500"></div>
                        <div className="absolute w-24 h-24 rounded-full border border-techflex-blue-200/30 opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse"></div>
                    </div>

                    {/* Main icon container with micro-interactions */}
                    <div className={`relative w-20 h-20 mx-auto bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:rotate-3 group-hover:scale-110 shadow-lg group-hover:shadow-xl`}>
                        {/* Glass morphism overlay */}
                        <div className="absolute inset-0 rounded-2xl bg-white/25 backdrop-blur-sm border border-white/20"></div>

                        {/* Dynamic shine effect */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/40 to-transparent transform -skew-x-12 translate-x-full group-hover:-translate-x-full transition-transform duration-1000 opacity-0 group-hover:opacity-100"></div>

                        {/* Icon with drop shadow */}
                        <Icon name={iconName} className="relative z-10 h-10 w-10 text-white drop-shadow-lg" />

                        {/* Floating micro-elements */}
                        <div className="absolute -top-2 -right-2 w-3 h-3 bg-gradient-to-br from-techflex-orange to-techflex-orange-600 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-500" style={{ animationDelay: '0.1s' }}></div>
                        <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-gradient-to-br from-techflex-blue to-techflex-blue-600 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-500" style={{ animationDelay: '0.3s' }}></div>
                        <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-white/60 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-500"></div>
                    </div>

                    {/* Stats tooltip */}
                    {stats && (
                        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm text-brand-gray-700 px-4 py-2 rounded-full text-xs font-semibold border border-brand-gray-200/50 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:shadow-xl">
                            <span className="relative z-10">{stats}</span>
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-techflex-blue-50 to-techflex-orange-50 opacity-50"></div>
                        </div>
                    )}
                </div>

                {/* Enhanced text content */}
                <div className="space-y-4 mb-6">
                    <h3 className="text-xl font-bold text-brand-gray-800 group-hover:text-techflex-blue transition-colors duration-300 leading-tight">
                        {title}
                    </h3>
                    <p className="text-base text-brand-gray-600 leading-relaxed opacity-80 group-hover:opacity-100 transition-all duration-300 max-w-xs mx-auto">
                        {description}
                    </p>
                </div>

                {/* Interactive call-to-action button */}
                <div className="flex items-center justify-center">
                    <div className={`group/btn relative bg-gradient-to-r ${gradient} text-white px-6 py-3 rounded-xl opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-400 shadow-lg hover:shadow-xl overflow-hidden`}>
                        <span className="relative z-10 flex items-center gap-2 text-sm font-semibold">
                            <span>Explore</span>
                            <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </span>
                        <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left"></div>
                    </div>
                </div>
            </div>

            {/* Animated bottom accent */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-gray-200 to-transparent">
                <div className={`h-full bg-gradient-to-r ${gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center`}></div>
            </div>
        </div>
    );
};

interface FeaturesProps {
    onNavigate: (page: string) => void;
}

const Features: React.FC<FeaturesProps> = ({ onNavigate }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
    const [, setActiveFeature] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const sectionRef = useRef<HTMLDivElement>(null);

    // Enhanced mobile detection
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Intersection Observer with improved settings
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.15, rootMargin: '50px' }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Mouse tracking for desktop parallax effects
    useEffect(() => {
        if (isMobile) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (sectionRef.current) {
                const rect = sectionRef.current.getBoundingClientRect();
                setMousePosition({
                    x: (e.clientX - rect.left - rect.width / 2) / rect.width,
                    y: (e.clientY - rect.top - rect.height / 2) / rect.height,
                });
            }
        };

        const section = sectionRef.current;
        if (section) {
            section.addEventListener('mousemove', handleMouseMove);
            return () => section.removeEventListener('mousemove', handleMouseMove);
        }
    }, [isMobile]);

    // Auto-rotate for engagement
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveFeature((prev) => (prev + 1) % featuresData.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const featuresData = [
        {
            iconName: 'cart',
            title: 'Shop Accessories',
            description: 'Discover premium tech accessories and hardware solutions crafted for excellence.',
            page: 'products',
            gradient: 'from-techflex-blue-500 to-techflex-blue-600',
            stats: '500+ Products',

        },
        {
            iconName: 'code',
            title: 'Custom Development',
            description: 'Build powerful, scalable software solutions with our expert development team.',
            page: 'software-development',
            gradient: 'from-techflex-orange-500 to-techflex-orange-600',
            stats: '50+ Projects',

        },
        {
            iconName: 'briefcase',
            title: 'Business Solutions',
            description: 'Ready-to-use software applications designed to streamline your operations.',
            page: 'software',
            gradient: 'from-brand-gray-600 to-brand-gray-700',
            stats: '25+ Solutions',
            badge: ''
        },
        {
            iconName: 'compass',
            title: 'Explore Ecosystem',
            description: 'Navigate through our comprehensive catalog of innovative products and services.',
            page: 'products',
            gradient: 'from-techflex-blue-400 via-techflex-blue-500 to-techflex-orange-500',
            stats: '1000+ Items'
        },
    ];

    return (
        <section
            ref={sectionRef}
            className="relative py-16 sm:py-20 md:py-24 lg:py-32 overflow-hidden"
        >
            {/* Enhanced unified background */}
            <div className="absolute inset-0">
                {/* Clean gradient base */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-gray-50/80 via-white to-techflex-blue-50/60"></div>

                {/* Dynamic floating elements with mouse interaction */}
                <div
                    className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-techflex-blue-200/20 to-techflex-orange-200/15 rounded-full blur-3xl transition-all duration-1000"
                    style={!isMobile ? {
                        transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 15}px) scale(1.1)`,
                    } : {}}
                />
                <div
                    className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-tr from-techflex-orange-200/15 to-techflex-blue-200/20 rounded-full blur-3xl transition-all duration-1000"
                    style={!isMobile ? {
                        transform: `translate(${-mousePosition.x * 25}px, ${-mousePosition.y * 20}px) scale(1.05)`,
                    } : {}}
                />

                {/* Subtle mesh pattern */}
                <div className="absolute inset-0 opacity-[0.015] bg-[radial-gradient(circle_at_50%_50%,rgba(20,105,183,0.3)_1px,transparent_1px)] bg-[size:32px_32px]"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Enhanced section header */}
                <div className={`text-center mb-16 sm:mb-20 transition-all duration-1000 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}>
                    {/* Animated status badge */}
                    <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-md rounded-full px-6 py-3 mb-8 border border-brand-gray-200/30 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
                        <div className="relative">
                            <div className="w-3 h-3 bg-techflex-blue-500 rounded-full animate-pulse"></div>
                            <div className="absolute inset-0 w-3 h-3 bg-techflex-blue-400 rounded-full animate-ping"></div>
                        </div>
                        <span className="text-sm font-semibold text-brand-gray-700 group-hover:text-techflex-blue transition-colors duration-200">Our Services</span>
                        <div className="w-px h-5 bg-brand-gray-300 group-hover:bg-techflex-blue transition-colors duration-200"></div>
                        <span className="text-sm text-brand-gray-500 group-hover:text-brand-gray-600 transition-colors duration-200">Choose Your Path</span>
                    </div>

                    {/* Dynamic main heading */}
                    <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-gray-900 via-techflex-blue-700 to-techflex-orange-600 mb-6 leading-tight">
                        What Can We
                        <span className="block sm:inline bg-gradient-to-r from-techflex-blue to-techflex-orange bg-clip-text"> Build Together?</span>
                    </h2>

                    <p className="text-lg sm:text-xl text-brand-gray-600 max-w-4xl mx-auto leading-relaxed px-4">
                        Choose your journey with Kytriq. Whether you need products, software, or custom solutions,
                        <span className="font-semibold text-brand-gray-700"> we're here to power your success</span>.
                    </p>


                </div>

                {/* Enhanced features grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 lg:gap-10">
                    {featuresData.map((feature, index) => (
                        <FeatureCard
                            key={feature.title}
                            iconName={feature.iconName}
                            title={feature.title}
                            description={feature.description}
                            onClick={() => onNavigate(feature.page)}
                            index={index}
                            isVisible={isVisible}
                            isHovered={hoveredCard === index}
                            onHover={(hovered) => setHoveredCard(hovered ? index : null)}
                            gradient={feature.gradient}
                            stats={feature.stats}
                            badge={feature.badge}
                        />
                    ))}
                </div>

                {/* Enhanced CTA section */}
                <div className={`text-center mt-20 sm:mt-24 transition-all duration-1000 delay-500 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}>
                    <div className="relative bg-white/60 backdrop-blur-md rounded-3xl p-8 sm:p-12 border border-brand-gray-200/20 shadow-xl max-w-3xl mx-auto overflow-hidden">
                        {/* Background decoration */}
                        <div className="absolute inset-0 bg-gradient-to-br from-techflex-blue-50/30 to-techflex-orange-50/30 rounded-3xl"></div>

                        <div className="relative z-10">
                            <div className="mb-6">
                                <h3 className="text-2xl sm:text-3xl font-bold text-brand-gray-800 mb-4">
                                    Need Something Custom?
                                </h3>
                                <p className="text-brand-gray-600 leading-relaxed text-lg max-w-2xl mx-auto">
                                    Can't find exactly what you're looking for? Let's discuss your unique requirements
                                    and create a tailored solution just for you.
                                </p>
                            </div>

                            <button
                                onClick={() => onNavigate('contact')}
                                className="group inline-flex items-center gap-3 bg-gradient-to-r from-techflex-blue-500 to-techflex-orange-500 text-white font-bold py-4 px-10 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:scale-105 transform-gpu shadow-lg"
                            >
                                <span className="text-lg">Get in Touch</span>
                                <svg className="w-6 h-6 transform group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;