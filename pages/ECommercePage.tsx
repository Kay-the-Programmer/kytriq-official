import React, { useState, useEffect, useRef } from 'react';
import Icon from '../components/Icon';

interface ECommercePageProps {
    onNavigate?: (page: string) => void;
}

const FeatureCard: React.FC<{
    iconName: string;
    title: string;
    children: React.ReactNode;
    index: number;
    isVisible: boolean;
}> = ({ iconName, title, children, index, isVisible }) => {
    const [, setIsHovered] = useState(false);
    return (
        <div
            className={`group relative bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 border border-brand-gray-100/50 h-full transform-gpu ${
                isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
            }`}
            style={{ transitionDelay: `${index * 150}ms` }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Gradient overlay with subtle animation */}
            <div className="absolute inset-0 bg-gradient-to-br from-techflex-blue-50/30 via-transparent to-techflex-orange-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Interactive background pattern */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-all duration-700">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(20,105,183,0.3)_0%,transparent_50%)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,102,0,0.2)_0%,transparent_50%)]"></div>
            </div>

            <div className="relative p-8 text-center">
                {/* Enhanced icon section */}
                <div className="relative mb-6">
                    {/* Animated background rings */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-techflex-blue-100/50 to-techflex-orange-100/50 opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-500"></div>
                        <div className="absolute w-24 h-24 rounded-full border border-techflex-blue-200/30 opacity-0 group-hover:opacity-100 transition-all duration-700 animate-pulse"></div>
                    </div>

                    {/* Main icon container */}
                    <div className="relative w-16 h-16 mx-auto bg-gradient-to-br from-techflex-orange-100 to-techflex-orange-200 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:rotate-3 group-hover:scale-110 shadow-lg group-hover:shadow-xl">
                        <div className="absolute inset-0 rounded-2xl bg-white/25 backdrop-blur-sm border border-white/20"></div>
                        <Icon name={iconName} className="h-8 w-8 text-techflex-orange relative z-10 transition-transform duration-300 group-hover:scale-110" />

                        {/* Shine effect */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -skew-x-12 translate-x-full group-hover:translate-x-full group-hover:animate-pulse"></div>
                    </div>
                </div>

                <h3 className="text-xl font-bold text-brand-gray-900 group-hover:text-techflex-blue transition-colors duration-300 mb-3">{title}</h3>
                <p className="text-brand-gray-600 leading-relaxed text-sm group-hover:text-brand-gray-700 transition-colors duration-300">{children}</p>

                {/* Subtle bottom accent line */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-techflex-blue to-techflex-orange group-hover:w-16 transition-all duration-500 rounded-full"></div>
            </div>
        </div>
    );
};

const PlatformCard: React.FC<{
    title: string;
    children: React.ReactNode;
    index: number;
    isVisible: boolean;
}> = ({ title, children, index, isVisible }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={`group relative bg-gradient-to-br from-techflex-orange-50/80 to-white/80 backdrop-blur-sm rounded-3xl border-2 border-techflex-orange-100/50 h-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-700 transform-gpu ${
                isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Hover gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-techflex-orange-100/40 via-transparent to-techflex-orange-200/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Floating particles effect */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(4)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1.5 h-1.5 bg-techflex-orange/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-1000"
                        style={{
                            top: `${20 + i * 20}%`,
                            right: `${10 + i * 15}%`,
                            animationDelay: `${i * 300}ms`,
                            transform: isHovered ? `translateY(-${i * 3}px) scale(1.5)` : 'translateY(0) scale(1)',
                        }}
                    />
                ))}
            </div>

            <div className="relative p-8">
                <h3 className="text-xl font-bold text-techflex-orange group-hover:text-techflex-orange-600 transition-colors duration-300 mb-3">{title}</h3>
                <p className="text-brand-gray-600 leading-relaxed text-sm group-hover:text-brand-gray-700 transition-colors duration-300">{children}</p>

                {/* Interactive arrow */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <div className="w-8 h-8 bg-techflex-orange-200 rounded-full flex items-center justify-center">
                        <Icon name="arrow-right" className="w-4 h-4 text-techflex-orange" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard: React.FC<{
    number: string;
    label: string;
    index: number;
    isVisible: boolean;
}> = ({ number, label, index, isVisible }) => (
    <div
        className={`text-center transform-gpu transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ transitionDelay: `${index * 200}ms` }}
    >
        <div className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-techflex-blue to-techflex-orange bg-clip-text text-transparent mb-2">
            {number}
        </div>
        <div className="text-brand-gray-600 text-sm font-medium">{label}</div>
    </div>
);

const ECommercePage: React.FC<ECommercePageProps> = ({ }) => {
    const [featuresVisible, setFeaturesVisible] = useState(false);
    const [platformsVisible, setPlatformsVisible] = useState(false);
    const [statsVisible, setStatsVisible] = useState(false);
    const [activeFeature, setActiveFeature] = useState(0);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [scrollProgress, setScrollProgress] = useState(0);

    const featuresRef = useRef<HTMLDivElement>(null);
    const platformsRef = useRef<HTMLDivElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);

    // Intersection Observer for scroll animations
    useEffect(() => {
        const observers = [
            { ref: featuresRef, setState: setFeaturesVisible },
            { ref: platformsRef, setState: setPlatformsVisible },
            { ref: statsRef, setState: setStatsVisible },
        ];

        const observerInstances = observers.map(({ ref, setState }) => {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setState(true);
                    }
                },
                { threshold: 0.1, rootMargin: '50px' }
            );

            if (ref.current) {
                observer.observe(ref.current);
            }

            return observer;
        });

        return () => {
            observerInstances.forEach(observer => observer.disconnect());
        };
    }, []);

    // Mouse tracking for hero section
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (heroRef.current) {
                const rect = heroRef.current.getBoundingClientRect();
                setMousePosition({
                    x: (e.clientX - rect.left - rect.width / 2) / rect.width,
                    y: (e.clientY - rect.top - rect.height / 2) / rect.height,
                });
            }
        };

        const hero = heroRef.current;
        if (hero) {
            hero.addEventListener('mousemove', handleMouseMove);
            return () => hero.removeEventListener('mousemove', handleMouseMove);
        }
    }, []);

    // Auto-rotate features
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveFeature((prev) => (prev + 1) % features.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // Track scroll progress
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

    const features = [
        { icon: 'swatch', title: 'Custom Storefront Design', description: 'Beautiful, responsive, and brand-aligned designs that create unforgettable shopping experiences and drive conversions.' },
        { icon: 'shopping-cart', title: 'Seamless Shopping Cart', description: 'An intuitive and secure checkout process designed to minimize friction and reduce cart abandonment rates.' },
        { icon: 'credit-card', title: 'Integrated Payment Gateways', description: 'Accept payments from all major providers, including Stripe, PayPal, and more, with robust security.' },
        { icon: 'cube', title: 'Product & Inventory Sync', description: 'Easily manage products, track stock levels across multiple channels, and handle complex product variants.' },
        { icon: 'chart-bar', title: 'Sales & Customer Analytics', description: 'Gain valuable insights into your store\'s performance, customer behavior, and marketing effectiveness.' },
        { icon: 'device-phone-mobile', title: 'Mobile-First Commerce', description: 'A flawless shopping experience on any device, ensuring your store looks and works perfectly on smartphones and tablets.' },
    ];

    const platforms = [
        { title: 'Shopify', description: 'Rapidly launch a powerful, scalable online store with the world\'s most popular e-commerce platform.' },
        { title: 'WooCommerce', description: 'Leverage the flexibility of WordPress to create a highly customizable and content-rich shopping experience.' },
        { title: 'Magento (Adobe Commerce)', description: 'For large-scale operations requiring enterprise-level features, security, and scalability.' },
        { title: 'Custom Solutions', description: 'A completely bespoke e-commerce platform built from the ground up to meet your unique business requirements.' },
    ];

    const stats = [
        { number: '500+', label: 'Online Stores Built' },
        { number: '99.9%', label: 'Uptime Guarantee' },
        { number: '24/7', label: 'Support Available' },
        { number: '48hrs', label: 'Average Setup Time' },
    ];

    return (
        <div className="bg-gradient-to-br from-brand-gray-50 via-white to-techflex-blue-50/30 min-h-screen">
            {/* Scroll Progress Indicator */}
            <div className="fixed top-0 left-0 w-full h-1 bg-brand-gray-200 z-50">
                <div
                    className="h-full bg-gradient-to-r from-techflex-orange to-techflex-blue transition-all duration-300"
                    style={{ width: `${scrollProgress}%` }}
                />
            </div>
            {/* Enhanced Hero Section */}
            <div
                ref={heroRef}
                className="relative bg-gradient-to-br from-white via-white to-brand-gray-50/50 shadow-sm text-brand-gray-900 py-16 sm:py-24 lg:py-32 overflow-hidden"
            >
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div
                        className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-techflex-blue-200/20 to-techflex-orange-200/20 rounded-full blur-3xl animate-pulse"
                        style={{
                            transform: `translate(${mousePosition.x * 30}px, ${mousePosition.y * 30}px) scale(${1 + mousePosition.x * 0.1})`,
                            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                    />
                    <div
                        className="absolute -bottom-20 -left-20 w-60 h-60 bg-gradient-to-tr from-techflex-orange-200/15 to-techflex-blue-200/15 rounded-full blur-3xl"
                        style={{
                            transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * -20}px) rotate(${mousePosition.x * 10}deg)`,
                            transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                    />
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
                    <div className="max-w-4xl mx-auto">
                        {/* Animated badge */}
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-techflex-blue-100 to-techflex-orange-100 text-techflex-blue-800 text-sm font-semibold px-4 py-2 rounded-full mb-6 shadow-sm animate-fade-in-up">
                            <div className="w-2 h-2 bg-techflex-orange rounded-full animate-pulse"></div>
                            E-Commerce Excellence
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-brand-gray-900 mb-6 animate-fade-in-up">
                            Powerful{' '}
                            <span className="bg-gradient-to-r from-techflex-blue to-techflex-orange bg-clip-text text-transparent">
                                E-Commerce
                            </span>
                            {' '}Solutions
                        </h1>

                        <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-brand-gray-600 leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                            We build high-converting online stores that turn visitors into loyal customers with cutting-edge technology and beautiful design.
                        </p>

                        {/* Enhanced CTA with stats */}
                        <div
                            className="mt-10 animate-fade-in-up"
                            style={{ animationDelay: '400ms' }}
                        >
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                                <button
                                    onClick={() => window.location.href = '#contact'}
                                    className="group relative bg-gradient-to-r from-techflex-orange to-techflex-orange-600 hover:from-techflex-orange-600 hover:to-techflex-orange-700 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        Build Your Store
                                        <Icon name="arrow-right" className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                    </span>
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </button>

                                <button
                                    onClick={() => window.location.href = '#features'}
                                    className="group text-brand-gray-700 hover:text-techflex-blue font-semibold py-4 px-8 rounded-2xl transition-all duration-300 border-2 border-brand-gray-200 hover:border-techflex-blue-300 bg-white/80 backdrop-blur-sm hover:bg-white"
                                >
                                    <span className="flex items-center gap-2">
                                        View Features
                                        <Icon name="eye" className="w-5 h-5" />
                                    </span>
                                </button>
                            </div>

                            {/* Stats row */}
                            <div
                                ref={statsRef}
                                className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto pt-8 border-t border-brand-gray-200/50"
                            >
                                {stats.map((stat, index) => (
                                    <StatCard
                                        key={stat.label}
                                        number={stat.number}
                                        label={stat.label}
                                        index={index}
                                        isVisible={statsVisible}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Features Section */}
            <section id="features" className="py-20 sm:py-28" ref={featuresRef}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-gray-900 mb-4">
                            Everything You Need to{' '}
                            <span className="bg-gradient-to-r from-techflex-blue to-techflex-orange bg-clip-text text-transparent">
                                Sell Online
                            </span>
                        </h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-brand-gray-600 leading-relaxed">
                            Our comprehensive e-commerce solutions are packed with powerful features designed to help your business thrive in the digital marketplace.
                        </p>

                        {/* Feature highlights slider */}
                        <div className="mt-8 flex justify-center">
                            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg border border-brand-gray-200">
                                {features.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveFeature(index)}
                                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                            activeFeature === index
                                                ? 'bg-techflex-orange w-8'
                                                : 'bg-brand-gray-300 hover:bg-brand-gray-400'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((item, index) => (
                            <FeatureCard
                                key={item.title}
                                iconName={item.icon}
                                title={item.title}
                                index={index}
                                isVisible={featuresVisible}
                            >
                                {item.description}
                            </FeatureCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* Enhanced Platforms Section */}
            <section className="bg-gradient-to-br from-brand-gray-100/50 to-techflex-blue-50/30 py-20 sm:py-28" ref={platformsRef}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-gray-900 mb-4">
                            Platforms We{' '}
                            <span className="bg-gradient-to-r from-techflex-blue to-techflex-orange bg-clip-text text-transparent">
                                Master
                            </span>
                        </h2>
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-brand-gray-600 leading-relaxed">
                            We work with the industry's best platforms to find the perfect technological foundation for your unique business needs.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {platforms.map((item, index) => (
                            <PlatformCard
                                key={item.title}
                                title={item.title}
                                index={index}
                                isVisible={platformsVisible}
                            >
                                {item.description}
                            </PlatformCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* Enhanced CTA Section */}
            <section id="contact" className="bg-gradient-to-br from-white to-brand-gray-50 shadow-inner">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-techflex-orange-100 to-techflex-blue-100 text-techflex-blue-800 text-sm font-semibold px-4 py-2 rounded-full mb-6 shadow-sm">
                            <Icon name="rocket-launch" className="w-4 h-4" />
                            Ready to Launch?
                        </div>

                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-brand-gray-900 mb-6">
                            Ready to Start{' '}
                            <span className="bg-gradient-to-r from-techflex-blue to-techflex-orange bg-clip-text text-transparent">
                                Selling?
                            </span>
                        </h2>

                        <p className="mt-4 max-w-2xl mx-auto text-lg text-brand-gray-600 leading-relaxed mb-10">
                            Let's discuss your vision and create something amazing together. We offer a free, comprehensive consultation to plan your e-commerce journey.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button className="group relative bg-gradient-to-r from-techflex-orange to-techflex-orange-600 hover:from-techflex-orange-600 hover:to-techflex-orange-700 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                                <span className="relative z-10 flex items-center gap-2">
                                    Get a Free Proposal
                                    <Icon name="arrow-right" className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                                </span>
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </button>

                            <button className="group text-brand-gray-700 hover:text-techflex-blue font-semibold py-4 px-8 rounded-2xl transition-all duration-300 border-2 border-brand-gray-200 hover:border-techflex-blue-300 bg-white/80 backdrop-blur-sm hover:bg-white">
                                <span className="flex items-center gap-2">
                                    <Icon name="phone" className="w-5 h-5" />
                                    Schedule a Call
                                </span>
                            </button>
                        </div>

                        {/* Trust indicators */}
                        <div className="mt-12 pt-8 border-t border-brand-gray-200">
                            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-brand-gray-500">
                                <div className="flex items-center gap-2">
                                    <Icon name="shield-check" className="w-4 h-4 text-techflex-blue" />
                                    <span>SSL Secured</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Icon name="clock" className="w-4 h-4 text-techflex-orange" />
                                    <span>24/7 Support</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Icon name="star" className="w-4 h-4 text-yellow-500" />
                                    <span>5-Star Rated</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ECommercePage;
