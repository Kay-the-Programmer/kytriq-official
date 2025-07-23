import React, { useState, useEffect, useRef } from 'react';
import Icon from './Icon'; // Assuming you have an Icon component

// Enhanced BusinessCard Component with interactive features
interface BusinessCardProps {
    imageUrl: string;
    title: string;
    description: string;
    buttonLabel?: string;
    onButtonClick?: () => void;
    category?: string;
    features?: string[];
    index: number;
}

const BusinessCard: React.FC<BusinessCardProps> = ({
                                                       imageUrl,
                                                       title,
                                                       description,
                                                       buttonLabel,
                                                       onButtonClick,
                                                       category,
                                                       features = [],
                                                       index
                                                   }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    // Intersection Observer for scroll animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.2, rootMargin: '50px' }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const gradients = [
        'from-techflex-blue-500/10 to-techflex-blue-600/20',
        'from-techflex-orange-500/10 to-techflex-orange-600/20',
        'from-brand-gray-600/10 to-brand-gray-700/20'
    ];

    const accentColors = [
        'techflex-blue-500',
        'techflex-orange-500',
        'brand-gray-600'
    ];

    const currentGradient = gradients[index % gradients.length];
    const currentAccent = accentColors[index % accentColors.length];

    return (
        <div
            ref={cardRef}
            className={`group relative bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 flex flex-col border border-white/20 transform-gpu ${
                isVisible
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-12 scale-95'
            }`}
            style={{
                transitionDelay: `${index * 150}ms`,
            }}
        >
            {/* Animated background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${currentGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

            {/* Category badge */}
            {category && (
                <div className="absolute top-4 left-4 z-20">
          <span className={`inline-flex items-center gap-1 px-3 py-1 bg-${currentAccent}/90 text-white text-xs font-semibold rounded-full backdrop-blur-sm shadow-sm`}>
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              {category}
          </span>
                </div>
            )}

            {/* Image container with loading state */}
            <div className="relative overflow-hidden h-[280px] p-3">
                <div className="w-full h-full rounded-2xl overflow-hidden bg-brand-gray-100">
                    {!imageLoaded && (
                        <div className="w-full h-full bg-gradient-to-br from-brand-gray-100 to-brand-gray-200 animate-pulse flex items-center justify-center">
                            <Icon name="image" className="w-12 h-12 text-brand-gray-400" />
                        </div>
                    )}
                    <img
                        src={imageUrl}
                        alt={title}
                        onLoad={() => setImageLoaded(true)}
                        className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 rounded-2xl ${
                            imageLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                    />

                    {/* Overlay with expand button */}
                    <div className="absolute inset-3 rounded-2xl bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-end p-4">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsExpanded(!isExpanded);
                            }}
                            className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors duration-300"
                            aria-label="View details"
                        >
                            <Icon name={isExpanded ? "chevron-up" : "chevron-down"} className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content area with dynamic expansion */}
            <div className="p-6 flex flex-col flex-grow relative z-10">
                <h3 className={`text-xl font-bold text-brand-gray-800 group-hover:text-${currentAccent} transition-colors duration-300 mb-3`}>
                    {title}
                </h3>

                <p className={`text-brand-gray-600 leading-relaxed transition-all duration-500 ${
                    isExpanded ? 'line-clamp-none' : 'line-clamp-3'
                } flex-grow text-sm`}>
                    {description}
                </p>

                {/* Feature list (shown when expanded) */}
                {features.length > 0 && (
                    <div className={`mt-4 transition-all duration-500 overflow-hidden ${
                        isExpanded ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                        <h4 className="text-sm font-semibold text-brand-gray-700 mb-2">Key Features:</h4>
                        <ul className="space-y-1">
                            {features.map((feature, idx) => (
                                <li key={idx} className="flex items-center gap-2 text-xs text-brand-gray-600">
                                    <div className={`w-1.5 h-1.5 bg-${currentAccent} rounded-full flex-shrink-0`} />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Action button with enhanced styling */}
                {buttonLabel && onButtonClick && (
                    <div className="mt-6 pt-4 border-t border-brand-gray-100">
                        <button
                            onClick={onButtonClick}
                            className={`group/btn relative w-full bg-${currentAccent} hover:bg-${currentAccent}/90 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0`}
                        >
                            {/* Button shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover/btn:-translate-x-full transition-transform duration-700" />

                            <span className="relative flex items-center justify-center gap-2">
                {buttonLabel}
                                <Icon name="arrow-right" className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
              </span>
                        </button>
                    </div>
                )}
            </div>

            {/* Interactive border glow */}
            <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}>
                <div className={`absolute inset-0 rounded-3xl border-2 border-${currentAccent}/30`} />
            </div>
        </div>
    );
};

// Enhanced BusinessSection Component
const BusinessSection: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState('All');
    const [isHeaderVisible, setIsHeaderVisible] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const sectionRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);

    // Enhanced business solutions data
    const businessSolutions = [
        {
            imageUrl: '/images/microfinance.jpg',
            title: 'Microfinance Platform',
            description: 'A comprehensive digital wallet and micro-loan management platform that empowers individuals and small businesses to manage payments, set savings goals, and access short-term credit with ease and security.',
            buttonLabel: 'Explore Platform',
            onButtonClick: () => alert('Learn more about Microfinance Platform!'),
            category: 'FinTech',
            features: [
                'Digital wallet integration',
                'Micro-loan management',
                'Savings goal tracking',
                'Payment processing',
                'Credit scoring system'
            ]
        },
        {
            imageUrl: '/images/file-tracking.png',
            title: 'Document Tracking System',
            description: 'A powerful web-based file and workflow management solution designed for government and private offices to digitize physical records, track file movement in real-time, and significantly reduce paper clutter.',
            buttonLabel: 'View Demo',
            onButtonClick: () => alert('Explore our Document Tracking System!'),
            category: 'Enterprise',
            features: [
                'Digital record management',
                'Real-time file tracking',
                'Workflow automation',
                'Access control',
                'Audit trail system'
            ]
        },
        {
            imageUrl: '/images/delivery.png',
            title: 'Delivery Management Hub',
            description: 'SwiftFlex is a comprehensive platform for managing deliveries, pickups, and real-time courier tracking. It helps businesses streamline dispatching, optimize delivery routes, and provide customers with live updates.',
            buttonLabel: 'Get Started',
            onButtonClick: () => alert('Discover SwiftFlex Delivery Management!'),
            category: 'Logistics',
            features: [
                'Real-time tracking',
                'Route optimization',
                'Automated dispatching',
                'Customer notifications',
                'Analytics dashboard'
            ]
        },
    ];

    // Intersection observer for header animation
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsHeaderVisible(entry.isIntersecting);
            },
            { threshold: 0.3 }
        );

        if (headerRef.current) {
            observer.observe(headerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Filter solutions based on category and search
    const filteredSolutions = businessSolutions.filter(solution => {
        const matchesFilter = activeFilter === 'All' || solution.category === activeFilter;
        const matchesSearch = searchTerm === '' ||
            solution.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            solution.description.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    const categories = ['All', ...Array.from(new Set(businessSolutions.map(s => s.category)))];

    return (
        <section
            ref={sectionRef}
            className="relative py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-brand-gray-50 via-white to-techflex-blue-50 overflow-hidden"
        >
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-techflex-blue-500/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-techflex-orange-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-brand-gray-400/3 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '6s' }} />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Enhanced header section */}
                <div
                    ref={headerRef}
                    className={`text-center mb-12 lg:mb-16 transition-all duration-1000 ${
                        isHeaderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-techflex-blue-100/80 backdrop-blur-sm rounded-full text-sm font-semibold text-techflex-blue-800 mb-6">
                        <div className="w-2 h-2 bg-techflex-blue-500 rounded-full animate-pulse" />
                        Our Solutions
                    </div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-gray-900 mb-6 leading-tight">
                        Innovative Solutions for
                        <span className="block bg-gradient-to-r from-techflex-blue-600 to-techflex-orange-600 bg-clip-text text-transparent">
                          Modern Business
                        </span>
                    </h2>

                    <p className="text-lg text-brand-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Discover our comprehensive suite of digital solutions designed to transform your business operations and drive growth.
                    </p>

                    {/* Interactive search and filter */}
                    <div className="mt-8 max-w-2xl mx-auto">
                        <div className="flex flex-col sm:flex-row gap-4 items-center">

                            {/* Category filters */}
                            <div className="flex gap-2 flex-wrap justify-center">
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => setActiveFilter(category)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                                            activeFilter === category
                                                ? 'bg-techflex-blue-500 text-white shadow-lg'
                                                : 'bg-white/80 text-brand-gray-600 hover:bg-techflex-blue-50 hover:text-techflex-blue-600'
                                        }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Solutions grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10">
                    {filteredSolutions.map((solution, index) => (
                        <BusinessCard
                            key={solution.title}
                            {...solution}
                            index={index}
                        />
                    ))}
                </div>

                {/* No results state */}
                {filteredSolutions.length === 0 && (
                    <div className="text-center py-16">
                        <Icon name="document-magnifying-glass" className="w-16 h-16 text-brand-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-brand-gray-700 mb-2">No solutions found</h3>
                        <p className="text-brand-gray-500 mb-6">Try adjusting your search or filter criteria</p>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setActiveFilter('All');
                            }}
                            className="px-6 py-3 bg-techflex-blue-500 text-white font-semibold rounded-lg hover:bg-techflex-blue-600 transition-colors duration-300"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}

                {/* Call-to-action footer */}
                <div className="mt-16 text-center">
                    <div className="inline-flex items-center gap-4 px-8 py-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30">
                        <Icon name="light-bulb" className="w-6 h-6 text-techflex-orange-500" />
                        <span className="text-brand-gray-700 font-medium">
              Have a custom requirement?
            </span>
                        <button
                            onClick={() => alert('Contact us for custom solutions!')}
                            className="px-6 py-2 bg-gradient-to-r from-techflex-blue-500 to-techflex-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                        >
                            Let's Talk
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BusinessSection;