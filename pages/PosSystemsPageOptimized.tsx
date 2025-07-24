import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import Icon from '../components/Icon';
import { usePerformanceMonitor } from '../utils/performanceMonitor';

// Import CSS file instead of using dynamic style injection
import './PosSystemsPage.css';

interface PosSystemsPageProps {
    onNavigate: (page: string) => void;
}

// Memoized FeatureCard component
const FeatureCard = memo(({ iconName, title, children }: { iconName: string; title: string; children: React.ReactNode }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Memoized event handlers
    const handleMouseEnter = useCallback(() => {
        setIsHovered(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
    }, []);

    return (
        <div 
            className={`bg-white p-8 rounded-2xl shadow-lg transition-all duration-300 border border-brand-gray-100 h-full transform-gpu ${isHovered ? 'shadow-xl scale-105 border-techflex-blue-200' : ''}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className={`flex items-center justify-center h-16 w-16 rounded-2xl mb-6 transition-all duration-300 ${isHovered ? 'bg-techflex-blue text-white' : 'bg-techflex-blue-100 text-techflex-blue'}`}>
                <Icon name={iconName} className={`h-8 w-8 transition-all duration-300 ${isHovered ? 'text-white' : 'text-techflex-blue'}`} />
            </div>
            <h3 className="text-2xl font-bold text-brand-gray-900">{title}</h3>
            <p className="mt-3 text-brand-gray-600">{children}</p>
        </div>
    );
});

// Set display name for debugging
FeatureCard.displayName = 'FeatureCard';

// Memoized BusinessTypeCard component
const BusinessTypeCard = memo(({ iconName, title }: { iconName: string; title: string }) => {
    const [isHovered, setIsHovered] = useState(false);

    // Memoized event handlers
    const handleMouseEnter = useCallback(() => {
        setIsHovered(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
    }, []);

    return (
        <div 
            className="text-center transition-transform duration-300 transform hover:scale-105 cursor-pointer transform-gpu"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full transition-all duration-300 ${isHovered ? 'bg-techflex-blue ring-techflex-blue-200' : 'bg-techflex-blue-100 ring-white'} ring-4 shadow-md`}>
                <Icon name={iconName} className={`h-12 w-12 transition-all duration-300 ${isHovered ? 'text-white' : 'text-techflex-blue'}`} />
            </div>
            <h3 className="mt-4 text-lg font-bold text-brand-gray-800">{title}</h3>
        </div>
    );
});

// Set display name for debugging
BusinessTypeCard.displayName = 'BusinessTypeCard';

const PosSystemsPageOptimized: React.FC<PosSystemsPageProps> = ({ onNavigate }) => {
    // Monitor component performance
    usePerformanceMonitor('PosSystemsPage');

    // Memoized data
    const features = useMemo(() => [
        { icon: 'sparkles', title: 'Intuitive Interface', description: 'Easy-to-use and customizable interface that requires minimal training, allowing your staff to start selling in minutes.' },
        { icon: 'cube-transparent', title: 'Inventory Management', description: 'Track stock levels in real-time, get low-stock alerts, and manage suppliers all from one dashboard.' },
        { icon: 'users', title: 'Customer Insights', description: 'Build customer profiles, track purchase history, and create loyalty programs to keep your customers coming back.' },
        { icon: 'chart-bar', title: 'Powerful Analytics', description: 'Make data-driven decisions with detailed reports on sales, top-performing products, and peak business hours.' },
        { icon: 'printer', title: 'Hardware Integration', description: 'Seamlessly connect to receipt printers, barcode scanners, cash drawers, and other essential peripherals.' },
        { icon: 'credit-card', title: 'Secure Payments', description: 'Accept all types of payments, including credit, debit, and mobile, with end-to-end encryption and PCI compliance.' },
    ], []);

    const businessTypes = useMemo(() => [
        { icon: 'building-storefront', title: 'Retail Stores' },
        { icon: 'cake', title: 'Cafes & Restaurants' },
        { icon: 'fire', title: 'Quick-Service' },
        { icon: 'briefcase', title: 'Boutiques & Salons' },
    ], []);

    // Memoized event handlers
    const handleGetDemo = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if (onNavigate) {
            onNavigate('contact');
        }
    }, [onNavigate]);

    const handleExploreFeatures = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const featuresSection = document.getElementById('features');
        if (featuresSection) {
            featuresSection.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    const handleDownloadCatalog = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        // Logic for downloading catalog
        console.log('Downloading hardware catalog...');
    }, []);

    const handleScheduleDemo = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if (onNavigate) {
            onNavigate('contact');
        }
    }, [onNavigate]);

    return (
        <div className="bg-brand-gray-50">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-white via-brand-gray-50 to-techflex-blue-50 text-brand-gray-900 py-32 sm:py-40 overflow-hidden">
                {/* Background elements */}
                <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556742502-ec7c0e2f34b1?auto=format&fit=crop&q=80')" }}></div>
                <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-transparent"></div>

                {/* Animated circles */}
                <div className="absolute top-20 right-20 h-64 w-64 rounded-full bg-techflex-blue-100 opacity-20 animate-pulse"></div>
                <div className="absolute bottom-20 left-20 h-48 w-48 rounded-full bg-techflex-orange-100 opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative text-center z-10">
                    <div className="inline-block mb-4 px-4 py-1 rounded-full bg-techflex-blue-100 text-techflex-blue font-medium text-sm">
                        Next-Generation Retail Technology
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-brand-gray-900 mb-6">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-techflex-blue to-techflex-blue-600">Modern</span> Point-of-Sale Systems
                    </h1>

                    <p className="mt-6 max-w-3xl mx-auto text-xl md:text-2xl text-brand-gray-600 leading-relaxed">
                        Streamline sales, manage inventory, and understand your customers with our intuitive and powerful POS solutions.
                    </p>

                    <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a 
                            href="#contact" 
                            onClick={handleGetDemo}
                            className="group relative bg-techflex-blue hover:bg-techflex-blue-600 text-white font-bold py-5 px-10 rounded-xl text-lg transition-all duration-300 transform-gpu hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-techflex-blue-300 focus:ring-offset-2"
                            aria-label="Get a demo of our POS system"
                        >
                            Get a Demo
                            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
                                <Icon name="arrow-right" className="h-5 w-5" />
                            </span>
                        </a>
                        <a 
                            href="#features" 
                            onClick={handleExploreFeatures}
                            className="group flex items-center gap-2 text-techflex-blue hover:text-techflex-blue-600 font-bold py-5 px-6 rounded-xl text-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-techflex-blue-300 focus:ring-offset-2"
                            aria-label="Scroll down to explore features"
                        >
                            <span>Explore Features</span>
                            <Icon name="chevron-down" className="h-5 w-5 transition-transform duration-300 group-hover:translate-y-1" aria-hidden="true" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <section id="features" className="py-24 sm:py-32">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <div className="inline-block mb-3 px-3 py-1 rounded-full bg-techflex-blue-50 text-techflex-blue font-medium text-sm">
                            Powerful Features
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-brand-gray-900 mb-4">Why Choose Kytriq POS?</h2>
                        <div className="w-24 h-1 bg-techflex-orange mx-auto mb-6 rounded-full"></div>
                        <p className="mt-4 max-w-2xl mx-auto text-xl text-brand-gray-600">
                           Everything you need to run your business smoothly and efficiently.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((item, index) => (
                            <div 
                                key={item.title}
                                className="opacity-0 animate-fade-in-up" 
                                style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
                            >
                                <FeatureCard iconName={item.icon} title={item.title}>
                                    {item.description}
                                </FeatureCard>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Business Types Section */}
            <section className="relative py-24 sm:py-32 overflow-hidden">
                {/* Background with pattern */}
                <div className="absolute inset-0 bg-brand-gray-100 opacity-70"></div>
                <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-techflex-blue-100 rounded-bl-full opacity-30"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-techflex-orange-100 rounded-tr-full opacity-30"></div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-20">
                        <div className="inline-block mb-3 px-3 py-1 rounded-full bg-techflex-orange-50 text-techflex-orange font-medium text-sm">
                            Industry Solutions
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-brand-gray-900 mb-4">Perfect For Any Business</h2>
                        <div className="w-24 h-1 bg-techflex-blue mx-auto mb-6 rounded-full"></div>
                        <p className="mt-4 max-w-2xl mx-auto text-xl text-brand-gray-600">
                           Our POS system is flexible and scalable to fit the unique needs of your industry.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-16 gap-x-8 max-w-5xl mx-auto">
                        {businessTypes.map((item) => (
                            <div key={item.title} className="transform-gpu transition-all duration-500 hover:translate-y-[-10px]">
                                <BusinessTypeCard iconName={item.icon} title={item.title} />
                                <div className="mt-4 text-center">
                                    <a href="#" className="inline-flex items-center text-techflex-blue hover:text-techflex-blue-600 text-sm font-medium transition-colors duration-300">
                                        Learn more
                                        <Icon name="arrow-right" className="ml-1 h-4 w-4" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Hardware Section */}
            <section className="py-24 sm:py-32 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-block mb-3 px-3 py-1 rounded-full bg-techflex-blue-50 text-techflex-blue font-medium text-sm">
                            Complete Solution
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-brand-gray-900 mb-4">Hardware Ecosystem</h2>
                        <div className="w-24 h-1 bg-techflex-orange mx-auto mb-6 rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="relative">
                            <div className="absolute -top-6 -left-6 w-24 h-24 bg-techflex-blue-100 rounded-lg opacity-50 transform rotate-6"></div>
                            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-techflex-orange-100 rounded-lg opacity-50 transform -rotate-6"></div>
                            <div className="relative z-10">
                                <img 
                                    src="/images/software.png"
                                    alt="Kytriq POS hardware system with touchscreen terminal, receipt printer, and barcode scanner" 
                                    className="rounded-2xl shadow-2xl transform-gpu transition-transform duration-500 hover:scale-105"
                                    loading="lazy" // Add lazy loading for images
                                />
                                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-6 py-3 rounded-full shadow-lg">
                                    <span className="text-techflex-blue font-bold flex items-center">
                                        <Icon name="sparkles" className="h-5 w-5 mr-2" aria-hidden="true" />
                                        Premium Quality Hardware
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="lg:pl-8">
                            <h3 className="text-3xl font-bold text-brand-gray-900 mb-6">A Complete Hardware Ecosystem</h3>
                            <p className="text-xl text-brand-gray-600 mb-8">
                                We offer a range of reliable and sleek hardware that works perfectly with our software. Get everything you need from a single provider.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-brand-gray-50 p-6 rounded-xl hover:shadow-md transition-shadow duration-300">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-techflex-blue-100">
                                            <Icon name="device-tablet" className="h-5 w-5 text-techflex-blue" />
                                        </div>
                                        <h4 className="font-bold text-lg">POS Terminal & Stand</h4>
                                    </div>
                                    <p className="text-brand-gray-600 pl-13">Sleek, responsive touchscreen terminals with adjustable stands.</p>
                                </div>

                                <div className="bg-brand-gray-50 p-6 rounded-xl hover:shadow-md transition-shadow duration-300">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-techflex-blue-100">
                                            <Icon name="printer" className="h-5 w-5 text-techflex-blue" />
                                        </div>
                                        <h4 className="font-bold text-lg">Receipt Printer</h4>
                                    </div>
                                    <p className="text-brand-gray-600 pl-13">High-speed thermal printers for quick, clear receipts.</p>
                                </div>

                                <div className="bg-brand-gray-50 p-6 rounded-xl hover:shadow-md transition-shadow duration-300">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-techflex-blue-100">
                                            <Icon name="qr-code" className="h-5 w-5 text-techflex-blue" />
                                        </div>
                                        <h4 className="font-bold text-lg">Barcode Scanner</h4>
                                    </div>
                                    <p className="text-brand-gray-600 pl-13">Fast, accurate scanners for efficient checkout.</p>
                                </div>

                                <div className="bg-brand-gray-50 p-6 rounded-xl hover:shadow-md transition-shadow duration-300">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-techflex-blue-100">
                                            <Icon name="lock-closed" className="h-5 w-5 text-techflex-blue" />
                                        </div>
                                        <h4 className="font-bold text-lg">Cash Drawer</h4>
                                    </div>
                                    <p className="text-brand-gray-600 pl-13">Secure, durable cash drawers with multiple compartments.</p>
                                </div>
                            </div>

                            <div className="mt-8">
                                <a 
                                    href="#" 
                                    onClick={handleDownloadCatalog}
                                    className="inline-flex items-center bg-brand-gray-100 hover:bg-brand-gray-200 text-brand-gray-800 font-medium py-3 px-6 rounded-lg transition-colors duration-300"
                                >
                                    <Icon name="document-text" className="h-5 w-5 mr-2" />
                                    Download Hardware Catalog
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section id="contact" className="relative py-28 sm:py-36 overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-techflex-blue-900 to-techflex-blue-700"></div>

                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-20 bg-wave-pattern opacity-10"></div>
                <div className="absolute bottom-0 left-0 w-full h-20 bg-wave-pattern opacity-10 transform rotate-180"></div>
                <div className="absolute top-1/4 right-10 h-64 w-64 rounded-full bg-techflex-blue-600 opacity-20 blur-3xl"></div>
                <div className="absolute bottom-1/4 left-10 h-64 w-64 rounded-full bg-techflex-orange opacity-10 blur-3xl"></div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                            <div className="grid grid-cols-1 md:grid-cols-5">
                                {/* Image column */}
                                <div className="md:col-span-2 bg-techflex-blue-50 p-8 flex items-center justify-center">
                                    <div className="relative">
                                        <div className="absolute -top-4 -left-4 w-16 h-16 bg-techflex-orange-100 rounded-lg opacity-50 transform rotate-12"></div>
                                        <img 
                                            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=600&auto=format&fit=crop" 
                                            alt="POS Demo" 
                                            className="relative z-10 rounded-xl shadow-lg max-w-full h-auto"
                                            loading="lazy" 
                                        />
                                        <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-techflex-blue-100 rounded-lg opacity-50 transform -rotate-12"></div>
                                    </div>
                                </div>

                                {/* Content column */}
                                <div className="md:col-span-3 p-8 md:p-12">
                                    <div className="inline-block mb-4 px-3 py-1 rounded-full bg-techflex-blue-100 text-techflex-blue font-medium text-sm">
                                        Get Started Today
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-brand-gray-900 mb-4">
                                        Ready to Revolutionize Your Business?
                                    </h2>
                                    <p className="text-xl text-brand-gray-600 mb-8">
                                        Schedule a personalized demo with one of our specialists to see how Kytriq POS can work for you.
                                    </p>

                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-techflex-blue-100">
                                                <Icon name="presentation-chart-bar" className="h-5 w-5 text-techflex-blue" />
                                            </div>
                                            <p className="text-brand-gray-700">See a live demonstration of our POS system</p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-techflex-blue-100">
                                                <Icon name="user-group" className="h-5 w-5 text-techflex-blue" />
                                            </div>
                                            <p className="text-brand-gray-700">Get personalized advice from our experts</p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-techflex-blue-100">
                                                <Icon name="currency-dollar" className="h-5 w-5 text-techflex-blue" />
                                            </div>
                                            <p className="text-brand-gray-700">Receive a custom quote for your business</p>
                                        </div>
                                    </div>

                                    <div className="mt-10">
                                        <a 
                                            href="#" 
                                            onClick={handleScheduleDemo}
                                            className="block w-full sm:w-auto sm:inline-flex items-center justify-center bg-techflex-blue hover:bg-techflex-blue-600 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 transform-gpu hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-techflex-blue-300 focus:ring-offset-2"
                                            aria-label="Schedule a personalized demo of our POS system"
                                        >
                                            <Icon name="calendar" className="h-5 w-5 mr-2" aria-hidden="true" />
                                            Schedule a Demo
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(PosSystemsPageOptimized);