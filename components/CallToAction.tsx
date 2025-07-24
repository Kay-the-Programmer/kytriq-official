import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

interface CallToActionProps {
    onNavigate: (page: string, id?: string) => void;
}

const CallToAction: React.FC<CallToActionProps> = ({ onNavigate }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [activeFeature, setActiveFeature] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const sectionRef = useRef<HTMLDivElement>(null);

    // Optimized mobile detection with debouncing
    const checkMobile = useCallback(() => {
        setIsMobile(window.innerWidth < 768);
    }, []);

    useEffect(() => {
        checkMobile();
        let timeoutId: NodeJS.Timeout;

        const handleResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(checkMobile, 150); // Debounce resize events
        };

        window.addEventListener('resize', handleResize, { passive: true });
        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('resize', handleResize);
        };
    }, [checkMobile]);

    // Optimized intersection observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect(); // Disconnect after first intersection
                }
            },
            {
                threshold: 0.1,
                rootMargin: '50px 0px' // Start animation slightly before element is visible
            }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Auto-rotate features with cleanup
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveFeature((prev) => (prev + 1) % 4);
        }, isMobile ? 4000 : 3000);

        return () => clearInterval(interval);
    }, [isMobile]);

    // Optimized mouse tracking with throttling
    useEffect(() => {
        if (isMobile) return;

        let rafId: number;

        const handleMouseMove = (e: MouseEvent) => {
            if (rafId) cancelAnimationFrame(rafId);

            rafId = requestAnimationFrame(() => {
                if (sectionRef.current) {
                    const rect = sectionRef.current.getBoundingClientRect();
                    setMousePosition({
                        x: (e.clientX - rect.left - rect.width / 2) / rect.width,
                        y: (e.clientY - rect.top - rect.height / 2) / rect.height,
                    });
                }
            });
        };

        const section = sectionRef.current;
        if (section) {
            section.addEventListener('mousemove', handleMouseMove, { passive: true });
            return () => {
                section.removeEventListener('mousemove', handleMouseMove);
                if (rafId) cancelAnimationFrame(rafId);
            };
        }
    }, [isMobile]);

    // Memoized card data to prevent recreation on every render
    const cardData = useMemo(() => [
        {
            id: 1,
            title: "SnapCart",
            subtitle: "Your Business Companion",
            description: "Smart sales and inventory tracking — scan, sell, and simplify retail from your phone.",
            image: "/images/snapcart-img.jpg",
            action: "Get Started",
            onClick: () => onNavigate('softwareDetail', 'sw_006'),
            gradient: "from-techflex-blue-500 to-techflex-blue-700",
            iconBg: "bg-techflex-blue-100",
            iconColor: "text-techflex-blue-600",
            badge: "Popular",
            stats: "1.2K+ Users",
            icon: "📱"
        },
        {
            id: 2,
            title: "Trade-in Program",
            subtitle: "Up to K2000 cash back",
            description: "Buy a laptop and get cashback plus our free software when you trade in an eligible device.",
            image: "/images/tradein-img.jpg",
            action: "Shop now",
            onClick: () => onNavigate('products'),
            gradient: "from-techflex-orange-500 to-techflex-orange-700",
            iconBg: "bg-techflex-orange-100",
            iconColor: "text-techflex-orange-600",
            badge: "Limited Time",
            stats: "K2000 Cashback",
            icon: "💰"
        },
        {
            id: 3,
            title: "Smartphones",
            subtitle: "& Accessories",
            description: "Find the smartphone and gear that match your lifestyle and look.",
            image: "/images/smartphone.jpg",
            action: "Explore",
            onClick: () => onNavigate('products'),
            gradient: "from-brand-gray-700 to-brand-gray-900",
            iconBg: "bg-brand-gray-100",
            iconColor: "text-brand-gray-600",
            badge: "New Arrivals",
            stats: "500+ Products",
            icon: "📲"
        }
    ], [onNavigate]);

    // Memoized features data
    const features = useMemo(() => [
        { icon: "⚡", text: "Real-time Analytics", description: "Live insights into your business performance" },
        { icon: "🔒", text: "Secure & Reliable", description: "Bank-grade security for your data" },
        { icon: "📱", text: "Mobile Friendly", description: "Access from anywhere, anytime" },
        { icon: "🚀", text: "Easy Integration", description: "Seamless setup in minutes" }
    ], []);

    // Memoized mouse position styles to prevent recreation
    const getMousePositionStyle = useCallback((multiplier: number, rotation = false) => {
        if (isMobile) return undefined;

        return {
            transform: rotation
                ? `translate(${mousePosition.x * multiplier}px, ${mousePosition.y * multiplier}px) rotate(${mousePosition.x * 10}deg)`
                : `translate(${mousePosition.x * multiplier}px, ${mousePosition.y * multiplier}px) scale(${1 + mousePosition.x * 0.1})`,
            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        };
    }, [isMobile, mousePosition]);

    // Callback handlers to prevent recreation
    const handleCardHover = useCallback((cardId: number) => {
        if (!isMobile) setHoveredCard(cardId);
    }, [isMobile]);

    const handleCardLeave = useCallback(() => {
        if (!isMobile) setHoveredCard(null);
    }, [isMobile]);

    const handleFeatureClick = useCallback((index: number) => {
        setActiveFeature(index);
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 bg-gradient-to-br from-brand-gray-50 via-white to-techflex-blue-50 overflow-hidden"
        >
            {/* Simplified Background Elements - Reduced complexity for better performance */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute -top-10 sm:-top-20 -right-10 sm:-right-20 w-20 sm:w-32 md:w-40 lg:w-48 h-20 sm:h-32 md:h-40 lg:h-48 bg-gradient-to-br from-techflex-blue-200/20 to-techflex-orange-200/20 rounded-full blur-xl opacity-60"
                    style={getMousePositionStyle(30)}
                />
                <div
                    className="absolute -bottom-10 sm:-bottom-20 -left-10 sm:-left-20 w-24 sm:w-40 md:w-60 lg:w-72 h-24 sm:h-40 md:h-60 lg:h-72 bg-gradient-to-tr from-techflex-orange-200/15 to-techflex-blue-200/15 rounded-full blur-2xl opacity-40"
                    style={getMousePositionStyle(-20, true)}
                />

                {/* Simplified grid for desktop only */}
                {!isMobile && (
                    <div className="absolute inset-0 opacity-[0.02] hidden lg:block">
                        <div
                            className="absolute inset-0 bg-[linear-gradient(90deg,transparent_24px,rgba(20,105,183,0.3)_25px,rgba(20,105,183,0.3)_26px,transparent_27px)] bg-[size:50px_50px]"
                            style={getMousePositionStyle(10)}
                        />
                    </div>
                )}
            </div>

            <div className="relative z-10 container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12">
                {/* Section Header - Simplified animations */}
                <div className={`text-center mb-8 sm:mb-12 md:mb-16 lg:mb-20 transition-all duration-700 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}>
                    <div className="inline-flex items-center gap-2 sm:gap-3 bg-white/90 backdrop-blur-sm rounded-full px-3 sm:px-4 md:px-6 py-2 sm:py-3 mb-4 sm:mb-6 border border-brand-gray-200/50 shadow-lg">
                        <div className="relative">
                            <div className="w-2 sm:w-3 h-2 sm:h-3 bg-techflex-blue-500 rounded-full animate-pulse"></div>
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-brand-gray-700">Featured Solutions</span>
                        <div className="w-px h-3 sm:h-4 bg-brand-gray-300 hidden sm:block"></div>
                        <span className="text-xs text-brand-gray-500 hidden sm:inline">Trusted by 1000+ businesses</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-gray-900 via-techflex-blue-700 to-techflex-orange-600 mb-3 sm:mb-4 leading-tight">
                        Transform Your Business
                        <br className="hidden xs:block" />
                        <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light text-brand-gray-600 block sm:inline">
                            {' '}Today
                        </span>
                    </h2>

                    <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-brand-gray-600 max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto leading-relaxed px-2 sm:px-0">
                        Discover our innovative solutions designed to streamline operations and boost productivity with cutting-edge technology
                    </p>
                </div>

                {/* Optimized Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10 mb-12 sm:mb-16 md:mb-20 lg:mb-24">
                    {cardData.map((card, index) => (
                        <div
                            key={card.id}
                            className={`group relative bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 cursor-pointer ${
                                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                            } ${hoveredCard === card.id ? 'shadow-2xl shadow-techflex-blue-500/20' : 'shadow-lg hover:shadow-xl'} ${
                                !isMobile ? 'hover:scale-[1.02]' : ''
                            }`}
                            style={{ transitionDelay: `${index * 200}ms` }}
                            onMouseEnter={() => handleCardHover(card.id)}
                            onMouseLeave={handleCardLeave}
                            onClick={card.onClick}
                        >
                            {/* Badges */}
                            <div className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4 z-20">
                                <div className={`relative bg-gradient-to-r ${card.gradient} text-white px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg`}>
                                    <span className="relative z-10 flex items-center gap-1 sm:gap-2">
                                        <span className="text-xs sm:text-sm">{card.icon}</span>
                                        <span className="hidden xs:inline">{card.badge}</span>
                                    </span>
                                </div>
                            </div>

                            <div className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 z-20">
                                <div className="bg-white/90 backdrop-blur-sm text-brand-gray-700 px-2 sm:px-3 py-1 rounded-full text-xs font-semibold border border-white/50 shadow-md">
                                    <span className="hidden xs:inline">{card.stats}</span>
                                    <span className="xs:hidden">{card.icon}</span>
                                </div>
                            </div>

                            {/* Image Section */}
                            <div className="relative h-40 xs:h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-10"></div>
                                <img
                                    src={card.image}
                                    alt={card.title}
                                    className={`w-full h-full object-cover transition-transform duration-700 ${
                                        !isMobile ? 'group-hover:scale-110' : ''
                                    }`}
                                    loading="lazy" // Add lazy loading for performance
                                />

                                <div className={`absolute bottom-2 sm:bottom-3 md:bottom-4 right-2 sm:right-3 md:right-4 z-20 transform transition-all duration-300 ${
                                    hoveredCard === card.id || isMobile ? 'scale-110 opacity-100' : 'scale-100 opacity-80'
                                }`}>
                                    <button className={`relative ${card.iconBg} ${card.iconColor} w-10 sm:w-12 h-10 sm:h-12 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-all duration-300`}>
                                        <svg className="w-4 sm:w-5 h-4 sm:h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
                                    <div
                                        className={`h-full bg-gradient-to-r ${card.gradient} transition-all duration-500`}
                                        style={{
                                            width: hoveredCard === card.id || (isMobile && isVisible) ? '100%' : '0%'
                                        }}
                                    ></div>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-gradient-to-b from-white to-brand-gray-50/50">
                                <div className="flex items-start justify-between mb-3 sm:mb-4">
                                    <div className="flex-1 pr-2">
                                        <h3 className="text-lg sm:text-xl md:text-2xl font-black text-brand-gray-900 mb-1 sm:mb-2 leading-tight transition-colors duration-300">
                                            {card.title}
                                        </h3>
                                        <h4 className="text-sm sm:text-base font-semibold text-brand-gray-600 mb-2 sm:mb-3">
                                            {card.subtitle}
                                        </h4>
                                    </div>
                                </div>

                                <p className="text-brand-gray-600 mb-4 sm:mb-6 leading-relaxed text-xs sm:text-sm line-clamp-2 sm:line-clamp-3">
                                    {card.description}
                                </p>

                                <button className={`group/cta relative w-full bg-gradient-to-r ${card.gradient} text-white font-bold py-2.5 sm:py-3 md:py-4 px-4 sm:px-6 rounded-xl transition-all duration-300 hover:shadow-lg text-sm sm:text-base`}>
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        <span>{card.action}</span>
                                        <svg className="w-3 sm:w-4 h-3 sm:h-4 transition-transform duration-300 group-hover/cta:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
                                        </svg>
                                    </span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main CTA Section - Simplified */}
                <div className={`relative bg-gradient-to-r from-white via-techflex-blue-50/30 to-white rounded-2xl sm:rounded-3xl md:rounded-[2rem] overflow-hidden shadow-xl sm:shadow-2xl transition-all duration-700 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`} style={{ transitionDelay: '600ms' }}>

                    {/* Simplified background */}
                    <div className="absolute inset-0">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(20,105,183,0.1)_0%,transparent_50%),radial-gradient(circle_at_80%_80%,rgba(255,102,0,0.1)_0%,transparent_50%)]"></div>

                        {/* Reduced floating shapes */}
                        <div className="absolute top-4 sm:top-6 md:top-10 right-4 sm:right-6 md:right-10 w-2 sm:w-3 md:w-4 h-2 sm:h-3 md:h-4 bg-techflex-blue-300/30 rounded-full animate-bounce" style={{ animationDuration: '3s' }}></div>
                        <div className="absolute bottom-8 sm:bottom-12 md:bottom-20 left-8 sm:left-12 md:left-20 w-3 sm:w-4 md:w-6 h-3 sm:h-4 md:h-6 bg-techflex-orange-300/30 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
                    </div>

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 min-h-[400px] sm:min-h-[500px] md:min-h-[550px] lg:min-h-[600px]">
                        {/* Image Section */}
                        <div className="relative overflow-hidden lg:order-1 group/image min-h-[250px] sm:min-h-[300px]">
                            <div className="absolute inset-0 bg-gradient-to-br from-techflex-blue-600/20 via-transparent to-techflex-orange-500/10 z-10"></div>
                            <img
                                src="/images/cta-bg.jpg"
                                alt="Business Solutions"
                                className={`w-full h-full object-cover transition-transform duration-700 ${
                                    !isMobile ? 'group-hover/image:scale-105' : ''
                                }`}
                                loading="lazy"
                            />

                            {/* Stats */}
                            <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-3 sm:left-4 md:left-6 z-20">
                                <div className="bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 shadow-xl border border-white/50">
                                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                                        <div className="relative w-8 sm:w-10 md:w-12 lg:w-14 h-8 sm:h-10 md:h-12 lg:h-14 bg-gradient-to-br from-techflex-blue-500 to-techflex-orange-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                                            <svg className="w-4 sm:w-5 md:w-6 lg:w-7 h-4 sm:h-5 md:h-6 lg:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-lg sm:text-xl md:text-2xl font-black text-brand-gray-900 mb-0.5 sm:mb-1">1000+</p>
                                            <p className="text-xs sm:text-sm font-medium text-brand-gray-600">Happy Clients</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute top-3 sm:top-4 md:top-6 left-3 sm:left-4 md:left-6 z-20">
                                <div className="bg-green-100/90 backdrop-blur-sm text-green-800 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full text-xs font-bold flex items-center gap-1 sm:gap-2 border border-green-200/50">
                                    <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="hidden xs:inline">Trusted & Secure</span>
                                    <span className="xs:hidden">✓</span>
                                </div>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="flex flex-col justify-center p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 lg:order-2">
                            <div className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-techflex-blue-50 to-techflex-orange-50 text-techflex-blue-700 rounded-full px-3 sm:px-4 md:px-5 py-2 sm:py-3 mb-4 sm:mb-6 md:mb-8 self-start border border-techflex-blue-100 shadow-sm">
                                <div className="relative">
                                    <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-techflex-blue-500 rounded-full animate-pulse"></div>
                                </div>
                                <svg className="w-3 sm:w-4 md:w-5 h-3 sm:h-4 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2M7 21H5m2 0h2m8-10V9a1 1 0 00-1-1H8a1 1 0 00-1 1v2m8 0V9" />
                                </svg>
                                <span className="text-xs sm:text-sm font-bold">Business Solutions</span>
                            </div>

                            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-brand-gray-900 mb-4 sm:mb-6 leading-tight">
                                <span className="block sm:inline">Let us take care of the</span>
                                <br className="hidden sm:block" />
                                <span className="relative inline-block">
                                    <span className="bg-gradient-to-r from-techflex-blue-600 via-techflex-blue-700 to-techflex-orange-600 bg-clip-text text-transparent">
                                        numbers
                                    </span>
                                </span>
                            </h3>

                            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-brand-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-xl">
                                Our software simplifies your back-office operations, giving you more time to focus on what matters most —
                                <span className="font-semibold text-techflex-blue-700"> your customers</span>.
                            </p>

                            {/* Interactive Feature Grid */}
                            <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8">
                                {features.map((feature, index) => (
                                    <div
                                        key={index}
                                        className={`group p-2 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl transition-all duration-300 cursor-pointer border-2 ${
                                            activeFeature === index
                                                ? 'bg-gradient-to-r from-techflex-blue-50 to-techflex-orange-50 border-techflex-blue-200 shadow-lg'
                                                : 'bg-white/50 border-transparent hover:bg-white/80 hover:border-brand-gray-200'
                                        }`}
                                        onClick={() => handleFeatureClick(index)}
                                    >
                                        <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                                            <span className="text-lg sm:text-xl md:text-2xl">{feature.icon}</span>
                                            <span className="font-bold text-xs sm:text-sm md:text-base text-brand-gray-800 leading-tight">{feature.text}</span>
                                        </div>
                                        <p className={`text-xs text-brand-gray-600 leading-relaxed transition-all duration-300 ${
                                            activeFeature === index ? 'opacity-100 max-h-20' : 'opacity-60 max-h-0 overflow-hidden'
                                        }`}>
                                            {feature.description}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                <button
                                    onClick={() => onNavigate('softwareDevelopment')}
                                    className="group relative bg-gradient-to-r from-techflex-blue-600 to-techflex-orange-600 text-white font-black py-3 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl text-base sm:text-lg flex-1 sm:flex-initial"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3">
                                        <span>Get Started Today</span>
                                        <svg className="w-4 sm:w-5 h-4 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
                                        </svg>
                                    </span>
                                </button>

                                <button
                                    onClick={() => onNavigate('contact')}
                                    className="group relative bg-white/90 backdrop-blur-sm border-2 border-brand-gray-200 hover:border-techflex-blue-400 text-brand-gray-800 font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl transition-all duration-300 hover:shadow-xl hover:bg-white text-base sm:text-lg flex-1 sm:flex-initial"
                                >
                                    <span className="relative z-10 inline-flex items-center justify-center gap-2 sm:gap-3">
                                        <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span>Schedule Demo</span>
                                    </span>
                                </button>
                            </div>

                            {/* Trust Indicators */}
                            <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 mt-4 sm:mt-6 text-xs sm:text-sm text-brand-gray-500">
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                    <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-green-500 rounded-full"></div>
                                    <span>Free 30-day trial</span>
                                </div>
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                    <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-blue-500 rounded-full"></div>
                                    <span>No setup fees</span>
                                </div>
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                    <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-purple-500 rounded-full"></div>
                                    <span>24/7 support</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CallToAction;