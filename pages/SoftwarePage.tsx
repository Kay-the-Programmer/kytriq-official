import React, { useState, useMemo, useEffect, useCallback, lazy, Suspense, memo } from 'react';
import { useContent } from '../contexts/ContentContext';
import Icon from '../components/Icon';
import SoftwareCard from '../components/SoftwareCard';
import FAQItem from '../components/FAQItem';
import { usePerformanceMonitor, throttle } from '../utils/performanceMonitor';

// Import CSS file instead of using dynamic style injection
import './SoftwarePage.css';

// Lazy load heavy components
const FAQSection = lazy(() => import('../components/FAQSection'));

interface SoftwarePageProps {
    onNavigate: (page: string, id: string) => void;
}

// Import FAQItem from components folder instead of defining it inline

const SoftwarePage: React.FC<SoftwarePageProps> = ({ onNavigate }) => {
    const { softwareProducts } = useContent();
    const [activeCategory, setActiveCategory] = useState('All');
    const [scrollProgress, setScrollProgress] = useState(0);

    // Monitor component performance
    usePerformanceMonitor('SoftwarePage');

    // Memoized scroll progress update function
    const updateScrollProgress = useCallback(() => {
        const scrolled = window.scrollY;
        const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrolled / maxHeight) * 100;
        setScrollProgress(progress);
    }, []);

    // Optimized scroll handler with throttling and requestAnimationFrame
    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateScrollProgress();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [updateScrollProgress]);

    const categories = useMemo(() => ['All', ...Array.from(new Set(softwareProducts.map(p => p.category)))], [softwareProducts]);

    // Memoized category change handler
    const handleCategoryChange = useCallback((category: string) => {
        setActiveCategory(category);
    }, []);

    // Memoized filtered software
    const filteredSoftware = useMemo(() => {
        if (activeCategory === 'All') return softwareProducts;
        return softwareProducts.filter(software => software.category === activeCategory);
    }, [activeCategory, softwareProducts]);

    // FAQ Data
    const faqItems = [
        {
            question: "What types of software do you offer?",
            answer: "We offer a wide range of business software solutions including point-of-sale systems, inventory management, customer relationship management, and delivery tracking software. All our solutions are designed to help businesses operate more efficiently."
        },
        {
            question: "Do you provide technical support for your software?",
            answer: "Yes, we provide comprehensive technical support for all our software products. Our support team is available 24/7 to help you with any issues or questions you may have."
        },
        {
            question: "Can your software be customized for my specific business needs?",
            answer: "Absolutely! All our software solutions can be tailored to meet your specific business requirements. Our team will work with you to understand your needs and customize the software accordingly."
        },
        {
            question: "Is there a free trial available for your software?",
            answer: "Yes, we offer a 14-day free trial for most of our software products. This allows you to test the software and see if it meets your business needs before making a purchase."
        },
        {
            question: "How often do you update your software?",
            answer: "We regularly update our software to add new features, improve performance, and fix any bugs. Updates are typically released on a monthly basis, and all our customers receive these updates at no additional cost."
        }
    ];

    // Why Shop With Us Data
    const shopFeatures = [
        {
            icon: "shield-check",
            title: "Secure Transactions",
            description: "All transactions are encrypted and secure. We use industry-standard security protocols to protect your data."
        },
        {
            icon: "truck",
            title: "Fast Digital Delivery",
            description: "Get instant access to your software purchases with our fast digital delivery system."
        },
        {
            icon: "refresh",
            title: "30-Day Money Back",
            description: "Not satisfied? We offer a 30-day money-back guarantee on all our software products."
        },
        {
            icon: "check-circle",
            title: "Quality Assurance",
            description: "All our software undergoes rigorous testing to ensure high quality and reliability."
        }
    ];

    return (
        <div className="bg-techflex-blue-50 animate-fadeIn">
            {/* Scroll Progress Indicator */}
            <div className="fixed top-0 left-0 w-full h-1 bg-brand-gray-200 z-50">
                <div
                    className="h-full bg-gradient-to-r from-techflex-blue to-techflex-orange transition-all duration-300"
                    style={{ width: `${scrollProgress}%` }}
                />
            </div>

            {/* Enhanced Page Header */}
            <div className="relative bg-gradient-to-b from-techflex-blue-50 to-white py-20 sm:py-28 overflow-hidden">
                {/* Dynamic background pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-grid-pattern" />
                </div>

                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/90 to-techflex-blue-50/90"></div>

                {/* Floating elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/6 w-72 h-72 bg-techflex-blue-500/5 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/6 w-96 h-96 bg-techflex-orange-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8 relative z-10">
                    <div className="text-center max-w-4xl mx-auto animate-fadeInUp">
                        <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-techflex-blue-100 text-techflex-blue shadow-sm">Business Solutions</span>
                        <h1 className="text-4xl py-4 md:text-5xl lg:text-7xl font-extrabold text-brand-gray-900 tracking-tight leading-tight">
                            Software to help your business <span className="text-transparent bg-clip-text bg-gradient-to-r from-techflex-blue to-techflex-blue-600">grow</span>
                        </h1>
                        <p className="mt-6 text-xl md:text-2xl text-brand-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Discover powerful, intuitive software solutions designed to streamline your operations and boost productivity.
                        </p>
                    </div>

                    {/* Featured Software Showcase */}
                    <div className="mt-12">
                        {/* Main Featured Software */}
                        <div className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 border border-brand-gray-100/50">
                            {/* Decorative elements */}
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-techflex-blue-100 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
                            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-techflex-orange-100 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>

                            {/* Featured badge */}
                            <div className="absolute top-4 right-4 z-10">
                                <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-techflex-blue to-techflex-blue-600 text-white shadow-lg transform group-hover:scale-110 transition-all duration-300">
                                    <Icon name="star" className="w-3.5 h-3.5 mr-1.5" />
                                    Featured
                                </span>
                            </div>

                            <div className="flex flex-col lg:flex-row">
                                {/* Enhanced image with overlay */}
                                <div className="w-full lg:w-2/5 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-techflex-blue/30 to-transparent z-0 opacity-70 group-hover:opacity-90 transition-opacity duration-500"></div>
                                    <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                                    <div className="aspect-[4/3] sm:aspect-video bg-[url('/images/snap-cart.png')] bg-cover bg-center w-full h-full transform group-hover:scale-110 transition-transform duration-700 ease-in-out" />

                                    {/* Floating particles effect */}
                                    <div className="absolute inset-0 overflow-hidden">
                                        {[...Array(5)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="absolute w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-70 transition-all duration-1000"
                                                style={{
                                                    top: `${20 + i * 15}%`,
                                                    left: `${10 + i * 15}%`,
                                                    animationDelay: `${i * 200}ms`,
                                                    transform: 'translateY(0)',
                                                    transition: 'transform 1s ease-out',
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Enhanced text content */}
                                <div className="w-full lg:w-3/5 p-8 lg:p-10 flex flex-col justify-center relative">
                                    <div className="flex items-center mb-5">
                                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-techflex-blue-100 to-techflex-blue-200 flex items-center justify-center mr-4 shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                                            <Icon name="shopping-cart" className="h-6 w-6 text-techflex-blue" />
                                        </div>
                                        <span className="text-sm font-semibold px-3 py-1 rounded-full bg-techflex-blue-50 text-techflex-blue group-hover:bg-techflex-blue-100 transition-colors duration-300">Point of Sale System</span>
                                    </div>

                                    <h3 className="text-2xl sm:text-3xl font-bold text-brand-gray-800 mb-4 group-hover:text-techflex-blue transition-colors duration-300">
                                        Seamlessly manage your business with SnapCart
                                    </h3>

                                    <p className="text-brand-gray-600 mb-6 group-hover:text-brand-gray-700 transition-colors duration-300 leading-relaxed">
                                        Track inventory in real time, generate instant sales reports, and provide a smooth checkout experience for your customers. SnapCart is the all-in-one solution for modern retail businesses.
                                    </p>

                                    <div className="flex flex-wrap gap-4 mb-8">
                                        {['Inventory Management', 'Sales Analytics', 'Payment Processing'].map((feature, idx) => (
                                            <span 
                                                key={idx}
                                                className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-medium bg-brand-gray-100 text-brand-gray-800 group-hover:bg-techflex-blue-50 group-hover:text-techflex-blue-700 transition-all duration-300 shadow-sm"
                                                style={{ transitionDelay: `${idx * 100}ms` }}
                                            >
                                                <Icon 
                                                    name={idx === 0 ? "cube-transparent" : idx === 1 ? "chart-bar" : "credit-card"} 
                                                    className="w-3.5 h-3.5 mr-1.5" 
                                                />
                                                {feature}
                                            </span>
                                        ))}
                                    </div>

                                    <a 
                                        href="#" 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onNavigate('softwareDetail', 'snapcart');
                                        }}
                                        className="group inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-techflex-blue to-techflex-blue-600 text-white font-medium hover:from-techflex-blue-600 hover:to-techflex-blue-700 transition-all duration-300 self-start shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95">
                                        Learn about SnapCart
                                        <Icon name="arrow-right" className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Secondary Featured Software Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                            {/* SwiftFlex Card */}
                            <div className="group relative bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 border border-brand-gray-100/50">
                                {/* Decorative elements */}
                                <div className="absolute -top-16 -right-16 w-48 h-48 bg-techflex-orange-100 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>

                                <div className="relative">
                                    {/* Enhanced image section */}
                                    <div className="relative h-56 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-0 opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                                        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                                        <img
                                            src="/images/swift-flex.png"
                                            alt="SwiftFlex"
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                        />

                                        {/* Category badge */}
                                        <div className="absolute top-4 left-4 z-10">
                                            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-techflex-orange to-techflex-orange-600 text-white shadow-lg transform group-hover:scale-110 transition-all duration-300">
                                                <Icon name="truck" className="w-3.5 h-3.5 mr-1.5" />
                                                Delivery Management
                                            </span>
                                        </div>

                                        {/* Animated overlay on hover */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-500">
                                                <Icon name="eye" className="h-8 w-8 text-white" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Enhanced content section */}
                                    <div className="p-7 relative">
                                        <h3 className="text-xl font-bold text-brand-gray-800 mb-3 group-hover:text-techflex-orange transition-colors duration-300">
                                            Track deliveries in real time with SwiftFlex
                                        </h3>
                                        <p className="text-brand-gray-600 mb-5 group-hover:text-brand-gray-700 transition-colors duration-300">
                                            Provide live delivery updates for customers and dispatchers. Optimize routes and manage your delivery fleet efficiently.
                                        </p>

                                        {/* Feature tags */}
                                        <div className="flex flex-wrap gap-2 mb-5">
                                            {['Route Optimization', 'Live Tracking', 'Delivery Analytics'].map((feature, idx) => (
                                                <span 
                                                    key={idx}
                                                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-brand-gray-100 text-brand-gray-700 group-hover:bg-techflex-orange-50 group-hover:text-techflex-orange-700 transition-all duration-300"
                                                    style={{ transitionDelay: `${idx * 100}ms` }}
                                                >
                                                    <div className="w-1.5 h-1.5 bg-techflex-orange rounded-full mr-1.5"></div>
                                                    {feature}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Enhanced CTA */}
                                        <a
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                onNavigate('softwareDetail', 'swiftflex');
                                            }}
                                            className="group inline-flex items-center text-techflex-orange font-medium hover:text-techflex-orange-600 transition-colors duration-300"
                                        >
                                            Learn more about SwiftFlex
                                            <Icon name="arrow-right" className="ml-1.5 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* DataSync Card */}
                            <div className="group relative bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 border border-brand-gray-100/50">
                                {/* Decorative elements */}
                                <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-techflex-blue-100 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>

                                <div className="relative">
                                    {/* Enhanced image section */}
                                    <div className="relative h-56 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-0 opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                                        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                                        <img
                                            src="/images/software.png"
                                            alt="DataSync"
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                        />

                                        {/* Category badge */}
                                        <div className="absolute top-4 left-4 z-10">
                                            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-techflex-blue to-techflex-blue-600 text-white shadow-lg transform group-hover:scale-110 transition-all duration-300">
                                                <Icon name="database" className="w-3.5 h-3.5 mr-1.5" />
                                                Data Management
                                            </span>
                                        </div>

                                        {/* Animated overlay on hover */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-500">
                                                <Icon name="eye" className="h-8 w-8 text-white" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Enhanced content section */}
                                    <div className="p-7 relative">
                                        <h3 className="text-xl font-bold text-brand-gray-800 mb-3 group-hover:text-techflex-blue transition-colors duration-300">
                                            Synchronize your business data with DataSync
                                        </h3>
                                        <p className="text-brand-gray-600 mb-5 group-hover:text-brand-gray-700 transition-colors duration-300">
                                            Keep your data synchronized across all platforms and devices. Access critical business information anytime, anywhere.
                                        </p>

                                        {/* Feature tags */}
                                        <div className="flex flex-wrap gap-2 mb-5">
                                            {['Cloud Storage', 'Real-time Sync', 'Secure Access'].map((feature, idx) => (
                                                <span 
                                                    key={idx}
                                                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-brand-gray-100 text-brand-gray-700 group-hover:bg-techflex-blue-50 group-hover:text-techflex-blue-700 transition-all duration-300"
                                                    style={{ transitionDelay: `${idx * 100}ms` }}
                                                >
                                                    <div className="w-1.5 h-1.5 bg-techflex-blue rounded-full mr-1.5"></div>
                                                    {feature}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Enhanced CTA */}
                                        <a
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                onNavigate('softwareDetail', 'datasync');
                                            }}
                                            className="group inline-flex items-center text-techflex-blue font-medium hover:text-techflex-blue-600 transition-colors duration-300"
                                        >
                                            Explore DataSync features
                                            <Icon name="arrow-right" className="ml-1.5 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Explore All Software Solutions */}
            <div className="bg-gradient-to-b from-white to-techflex-blue-50 py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-brand-gray-900 mb-4">
                            Explore Our Complete Software Collection
                        </h2>
                        <p className="text-lg text-brand-gray-600">
                            Discover innovative software solutions designed to address specific business challenges and drive growth
                        </p>
                    </div>

                    {/* Enhanced Filter Bar */}
                    <div className="mb-12" role="group" aria-label="Software categories">
                        <div className="bg-white p-4 rounded-2xl shadow-md">
                            <div className="flex flex-wrap gap-3 justify-center">
                                {categories.map(category => {
                                    const isActive = activeCategory === category;
                                    return (
                                        <button
                                            key={category}
                                            onClick={() => handleCategoryChange(category)}
                                            className={`
                                                relative px-5 py-2.5 rounded-xl font-medium text-sm 
                                                transition-all duration-300 ease-in-out
                                                ${isActive 
                                                    ? 'bg-techflex-blue text-white shadow-md' 
                                                    : 'bg-brand-gray-100 text-brand-gray-700 hover:bg-brand-gray-200'
                                                }
                                            `}
                                            aria-pressed={isActive}
                                        >
                                            {category === 'All' && (
                                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center">
                                                    <span className={`absolute inline-flex h-full w-full rounded-full ${isActive ? 'bg-white' : 'bg-techflex-blue'} opacity-50 animate-ping`}></span>
                                                    <span className={`relative inline-flex rounded-full h-3 w-3 ${isActive ? 'bg-white' : 'bg-techflex-blue'}`}></span>
                                                </span>
                                            )}
                                            {category}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Software Grid */}
                    {filteredSoftware.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                            {filteredSoftware.map(software => (
                                <SoftwareCard 
                                    key={software.id} 
                                    software={software} 
                                    onNavigate={onNavigate}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white text-center py-16 px-4 border-2 border-dashed border-brand-gray-200 rounded-2xl shadow-sm">
                            <Icon name="search" className="h-12 w-12 mx-auto text-brand-gray-300 mb-4" />
                            <h3 className="text-2xl font-semibold text-brand-gray-700 mb-2">No software found</h3>
                            <p className="text-brand-gray-500 max-w-md mx-auto">
                                We couldn't find any software matching your current filter criteria. Try selecting a different category or check back later for new additions.
                            </p>
                            <button 
                                onClick={() => handleCategoryChange('All')}
                                className="mt-6 px-5 py-2 bg-techflex-blue text-white rounded-lg font-medium hover:bg-techflex-blue-600 transition-colors duration-300"
                            >
                                View All Software
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Why Choose Our Software Section */}
            <section className="py-24 bg-gradient-to-br from-techflex-blue-50 via-white to-techflex-blue-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-techflex-blue-100 text-techflex-blue">Trusted by Businesses</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-brand-gray-900 mb-4">Why Choose Our Software Solutions</h2>
                        <p className="text-lg text-brand-gray-600">
                            We're committed to providing the best software solutions with exceptional service and support that helps your business thrive.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {shopFeatures.map((feature, index) => (
                            <div 
                                key={index}
                                className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden p-8 border border-brand-gray-100 hover:border-techflex-blue/20 transform hover:-translate-y-1"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-techflex-blue/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>

                                <div className="relative">
                                    <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-techflex-blue to-techflex-blue-600 text-white mb-6 transform transition-transform group-hover:rotate-3 group-hover:scale-110 duration-300">
                                        <Icon name={feature.icon} className="h-8 w-8" />
                                    </div>

                                    <h3 className="text-xl font-bold text-brand-gray-800 mb-3 group-hover:text-techflex-blue transition-colors duration-300">
                                        {feature.title}
                                    </h3>

                                    <p className="text-brand-gray-600 relative z-10">
                                        {feature.description}
                                    </p>

                                    <div className="absolute bottom-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <Icon name="sparkles" className="h-12 w-12 text-techflex-blue/10" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <div className="inline-flex items-center justify-center p-1 rounded-full bg-brand-gray-100 mb-8">
                            <span className="flex h-2 w-2 mx-1">
                                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-techflex-blue opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-techflex-blue"></span>
                            </span>
                            <span className="px-3 py-1 text-sm font-medium text-brand-gray-700">
                                Join over 10,000+ satisfied customers
                            </span>
                            <span className="flex h-2 w-2 mx-1">
                                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-techflex-blue opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-techflex-blue"></span>
                            </span>
                        </div>

                        <a 
                            href="#" 
                            onClick={(e) => {
                                e.preventDefault();
                                onNavigate('contact', '');
                            }}
                            className="inline-flex items-center px-6 py-3 rounded-xl bg-techflex-blue text-white font-medium hover:bg-techflex-blue-600 transition-colors duration-300 shadow-md hover:shadow-lg"
                        >
                            Schedule a Free Consultation
                            <Icon name="arrow-right" className="ml-2 h-5 w-5" />
                        </a>
                    </div>
                </div>
            </section>

            {/* Lazy-loaded FAQ Section */}
            <Suspense fallback={
                <div className="py-24 text-center">
                    <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-techflex-blue transition ease-in-out duration-150 cursor-default">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-techflex-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading FAQ section...
                    </div>
                </div>
            }>
                <FAQSection 
                    faqItems={faqItems} 
                    onNavigate={onNavigate} 
                />
            </Suspense>
        </div>
    );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(SoftwarePage);
