import React, { useState, useEffect, useRef, useCallback } from 'react';
import Icon from '../components/Icon';

interface AboutPageProps {
    onNavigate: (page: string) => void;
}

// Enhanced intersection observer with multiple thresholds for smoother animations
const useIntersectionObserver = (options = {}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [progress, setProgress] = useState(0);
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
                setProgress(entry.intersectionRatio);
            },
            {
                threshold: [0, 0.1, 0.3, 0.5, 0.7, 1.0],
                rootMargin: '50px',
                ...options
            }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return [ref, isVisible, progress] as const;
};

// Smart touch detection for mobile optimization
const useTouch = () => {
    const [isTouch, setIsTouch] = useState(false);

    useEffect(() => {
        const checkTouch = () => {
            setIsTouch(window.matchMedia('(hover: none) and (pointer: coarse)').matches);
        };

        checkTouch();
        window.addEventListener('resize', checkTouch);
        return () => window.removeEventListener('resize', checkTouch);
    }, []);

    return isTouch;
};

// Enhanced value card with smart interactions
const ValueCard: React.FC<{
    iconName: string;
    title: string;
    children: React.ReactNode;
    index: number;
}> = ({ iconName, title, children, index }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [cardRef, isInView, progress] = useIntersectionObserver();
    const isTouch = useTouch();

    const colors = [
        'from-blue-500 to-cyan-400',
        'from-purple-500 to-pink-400',
        'from-emerald-500 to-teal-400',
        'from-orange-500 to-red-400'
    ];

    // Auto-collapse on mobile after delay
    useEffect(() => {
        if (isExpanded && isTouch) {
            const timer = setTimeout(() => setIsExpanded(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [isExpanded, isTouch]);

    return (
        <div
            ref={cardRef as React.RefObject<HTMLDivElement>}
            className={`group relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 border border-white/30 overflow-hidden cursor-pointer ${
                isInView
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-8 scale-95'
            } ${isExpanded ? 'ring-2 ring-blue-500/20' : ''}`}
            style={{
                transitionDelay: `${index * 100}ms`,
                transform: isInView ? `translateY(-${progress * 4}px)` : 'translateY(32px)',
            }}
            onClick={() => setIsExpanded(!isExpanded)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsExpanded(!isExpanded);
                }
            }}
        >
            {/* Interactive background gradient */}
            <div
                className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-all duration-700 ${colors[index % colors.length]} rounded-3xl`}
                style={{ opacity: progress * 0.05 }}
            />

            {/* Content wrapper with padding that adapts to expansion */}
            <div className={`p-6 lg:p-8 transition-all duration-500 ${isExpanded ? 'pb-8' : ''}`}>
                {/* Icon section with enhanced animation */}
                <div className="mb-6 flex items-center justify-between">
                    <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${colors[index % colors.length]} flex items-center justify-center shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                        <Icon name={iconName} className="w-7 h-7 text-white drop-shadow-sm" />

                        {/* Pulse ring */}
                        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${colors[index % colors.length]} opacity-0 group-hover:opacity-30 scale-100 group-hover:scale-125 transition-all duration-700`} />
                    </div>

                    {/* Expansion indicator */}
                    <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                        <span className="hidden sm:inline">{isExpanded ? 'Less' : 'More'}</span>
                        <Icon
                            name="chevron-right"
                            className={`w-4 h-4 transition-transform duration-300 ${
                                isExpanded ? 'rotate-90' : 'rotate-0'
                            }`}
                        />
                    </div>
                </div>

                {/* Title with gradient on hover */}
                <h3 className={`text-xl lg:text-2xl font-bold mb-4 transition-all duration-500 group-hover:bg-gradient-to-r group-hover:${colors[index % colors.length]} group-hover:bg-clip-text group-hover:text-transparent`}>
                    {title}
                </h3>

                {/* Content with smart expansion */}
                <div className={`overflow-hidden transition-all duration-500 ${
                    isExpanded ? 'max-h-96' : 'max-h-20'
                }`}>
                    <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
                        {children}
                    </p>
                </div>

                {/* Progress indicator bar */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-100">
                    <div
                        className={`h-full bg-gradient-to-r ${colors[index % colors.length]} transition-all duration-700`}
                        style={{ width: `${progress * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

// Adaptive timeline with smart mobile layout
const TimelineItem: React.FC<{
    iconName: string;
    year: string;
    title: string;
    children: React.ReactNode;
    isLast?: boolean;
    index: number;
}> = ({ iconName, year, title, children, isLast = false, index }) => {
    const [itemRef, isInView, progress] = useIntersectionObserver();
    const [isExpanded, setIsExpanded] = useState(false);
    useTouch();
    return (
        <div
            ref={itemRef as React.RefObject<HTMLDivElement>}
            className={`relative transition-all duration-700 ${
                isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            } ${
                // Responsive layout: side-by-side on mobile, traditional timeline on desktop
                'flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 pb-8 sm:pb-12'
            }`}
            style={{ transitionDelay: `${index * 150}ms` }}
        >
            {/* Timeline connector - hidden on mobile, visible on desktop */}
            {!isLast && (
                <div className="hidden sm:block absolute left-7 top-16 w-px h-full bg-gradient-to-b from-blue-200 to-transparent">
                    <div
                        className="w-full bg-gradient-to-b from-blue-500 to-purple-600 transition-all duration-1000 ease-out"
                        style={{ height: `${progress * 100}%` }}
                    />
                </div>
            )}

            {/* Icon and year section */}
            <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-2 flex-shrink-0">
                {/* Icon */}
                <div className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg flex items-center justify-center transition-all duration-500 hover:scale-110 ${
                    isInView ? 'animate-pulse' : ''
                }`}>
                    <Icon name={iconName} className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>

                {/* Year badge */}
                <div className="bg-white/90 backdrop-blur-sm shadow-md rounded-full px-3 py-1 border border-gray-100 flex-shrink-0">
                    <span className="text-xs font-bold text-blue-600">{year}</span>
                </div>
            </div>

            {/* Content section */}
            <div className="flex-1 min-w-0">
                <div
                    className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-md hover:shadow-lg border border-white/40 transition-all duration-500 cursor-pointer"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                        {title}
                    </h3>

                    {/* Content with adaptive expansion */}
                    <div className={`overflow-hidden transition-all duration-500 ${
                        isExpanded ? 'max-h-96' : 'max-h-16 sm:max-h-20'
                    }`}>
                        <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                            {children}
                        </p>
                    </div>

                    {/* Interactive footer */}
                    <div className="mt-3 sm:mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-xs text-gray-500">Completed</span>
                        </div>

                        <button
                            className="text-xs font-medium text-blue-600 hover:text-purple-600 transition-colors duration-300 flex items-center gap-1"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsExpanded(!isExpanded);
                            }}
                        >
                            {isExpanded ? 'Show Less' : 'Learn More'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Responsive team member card with enhanced interactions
const TeamMemberCard: React.FC<{
    imageUrl: string;
    name: string;
    title: string;
    index: number;
}> = ({ imageUrl, name, title, index }) => {
    const [cardRef, isInView] = useIntersectionObserver();
    const [showDetails, setShowDetails] = useState(false);
    const isTouch = useTouch();

    const socialLinks = [
        { icon: 'envelope', label: 'Email' },
        { icon: 'phone', label: 'Phone' },
        { icon: 'link', label: 'LinkedIn' }
    ];

    return (
        <div
            ref={cardRef as React.RefObject<HTMLDivElement>}
            className={`group text-center transition-all duration-700 ${
                isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
            }`}
            style={{ transitionDelay: `${index * 200}ms` }}
        >
            {/* Enhanced image container with responsive sizing */}
            <div
                className="relative w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 mx-auto mb-4 sm:mb-6 cursor-pointer"
                onClick={() => setShowDetails(!showDetails)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setShowDetails(!showDetails);
                    }
                }}
                tabIndex={0}
                role="button"
            >
                <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-xl transition-all duration-500 hover:shadow-2xl">
                    <img
                        src={imageUrl}
                        alt={name}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                        loading="lazy"
                    />

                    {/* Interactive overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity duration-300 ${
                        showDetails || (!isTouch && 'group-hover:opacity-100') ? 'opacity-100' : 'opacity-0'
                    }`}>
                        {/* Social links with staggered animation */}
                        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {socialLinks.map((social, i) => (
                                <button
                                    key={social.icon}
                                    className={`w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 ${
                                        showDetails || (!isTouch && 'group-hover:opacity-100 group-hover:scale-100') ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                                    }`}
                                    style={{ transitionDelay: `${i * 100}ms` }}
                                    title={social.label}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Icon name={social.icon} className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                                </button>
                            ))}
                        </div>

                        {/* Status indicator */}
                        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Name and title with enhanced typography */}
            <div className="space-y-1 sm:space-y-2">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    {name}
                </h3>

                <p className="text-sm sm:text-base font-medium text-blue-600 group-hover:text-purple-600 transition-colors duration-300">
                    {title}
                </p>

                {/* Animated underline */}
                <div className="flex justify-center pt-1">
                    <div className={`h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 ${
                        isInView ? 'w-12 opacity-100' : 'w-0 opacity-0'
                    }`} />
                </div>
            </div>
        </div>
    );
};

// Smart stats counter with adaptive animations
const StatsCounter: React.FC<{
    value: string;
    label: string;
    icon: string;
    index: number;
}> = ({ value, label, icon, index }) => {
    const [counterRef, isInView, progress] = useIntersectionObserver();
    const [count, setCount] = useState(0);

    const finalValue = parseInt(value.replace(/\D/g, '')) || 0;
    const hasPlus = value.includes('+');
    const hasK = value.includes('K');
    const hasPercent = value.includes('%');

    // Optimized counter animation
    useEffect(() => {
        if (isInView && finalValue > 0) {
            const duration = 1500;
            const steps = 30;
            const increment = finalValue / steps;
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= finalValue) {
                    setCount(finalValue);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(current));
                }
            }, duration / steps);

            return () => clearInterval(timer);
        }
    }, [isInView, finalValue]);

    const colors = [
        'from-blue-500 to-cyan-400',
        'from-purple-500 to-pink-400',
        'from-green-500 to-emerald-400',
        'from-orange-500 to-red-400'
    ];

    return (
        <div
            ref={counterRef as React.RefObject<HTMLDivElement>}
            className={`group text-center p-4 sm:p-6 rounded-2xl bg-white/90 backdrop-blur-sm border border-white/30 shadow-lg hover:shadow-xl transition-all duration-700 ${
                isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
            }`}
            style={{
                transitionDelay: `${index * 100}ms`,
                transform: isInView ? `translateY(-${progress * 2}px) scale(${0.95 + progress * 0.05})` : 'translateY(32px) scale(0.95)'
            }}
        >
            {/* Icon with smart scaling */}
            <div className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-2xl bg-gradient-to-br ${colors[index % colors.length]} flex items-center justify-center shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                <Icon name={icon} className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>

            {/* Animated counter */}
            <div className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 transition-all duration-500 group-hover:bg-gradient-to-r group-hover:${colors[index % colors.length]} group-hover:bg-clip-text group-hover:text-transparent text-gray-900`}>
                {finalValue > 0 ? (
                    <>
                        {count.toLocaleString()}
                        {hasK && 'K'}
                        {hasPlus && '+'}
                        {hasPercent && '%'}
                    </>
                ) : value}
            </div>

            <div className="text-sm sm:text-base text-gray-600 font-medium">{label}</div>

            {/* Progress indicator */}
            <div className="mt-2 sm:mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div
                    className={`h-full bg-gradient-to-r ${colors[index % colors.length]} transition-all duration-1000`}
                    style={{
                        width: `${progress * 100}%`,
                        transitionDelay: `${index * 150 + 300}ms`
                    }}
                />
            </div>
        </div>
    );
};

const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState('hero');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const isTouch = useTouch();

    // Optimized scroll tracking
    const handleScroll = useCallback(() => {
        const scrolled = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        setScrollProgress((scrolled / maxScroll) * 100);

        // Update active section with better logic
        const sections = ['hero', 'mission', 'values', 'timeline', 'team', 'cta'];
        let currentSection = 'hero';

        for (const section of sections) {
            const element = document.getElementById(section);
            if (element) {
                const rect = element.getBoundingClientRect();
                if (rect.top <= window.innerHeight * 0.3) {
                    currentSection = section;
                }
            }
        }

        setActiveSection(currentSection);
    }, []);

    useEffect(() => {
        const throttledScroll = () => {
            requestAnimationFrame(handleScroll);
        };

        window.addEventListener('scroll', throttledScroll, { passive: true });
        return () => window.removeEventListener('scroll', throttledScroll);
    }, [handleScroll]);

    // Content data
    const values = [
        {
            icon: 'light-bulb',
            title: 'Innovation',
            description: "We constantly push the boundaries of what's possible, embracing new technologies and creative thinking to solve complex problems. Our team thrives on challenges that others see as impossible, turning ambitious visions into reality through cutting-edge solutions."
        },
        {
            icon: 'shield-check',
            title: 'Quality',
            description: "Excellence is not an act, but a habit. We are committed to delivering polished, reliable, and robust products that stand the test of time, ensuring every detail meets our high standards. Our rigorous testing and quality assurance processes guarantee exceptional results."
        },
        {
            icon: 'users',
            title: 'Partnership',
            description: "Your success is our success. We build lasting relationships based on trust, transparency, and collaborative teamwork, treating every client as a valued partner in their journey. Together, we achieve more than either could alone."
        },
        {
            icon: 'scale',
            title: 'Integrity',
            description: "We operate with unwavering honesty and a strong moral compass. Doing the right thing is the only way we do business, maintaining ethical standards in every interaction and decision we make."
        },
    ];

    const timeline = [
        {
            icon: 'flag',
            year: '2020',
            title: 'Kytriq is Born',
            description: 'Founded in a small garage with a big dream: to seamlessly merge the worlds of custom software and cutting-edge hardware. Our journey began with three passionate engineers and a vision to transform how technology serves humanity.'
        },
        {
            icon: 'rocket-launch',
            year: '2021',
            title: 'First Product Launch',
            description: 'We launched Synergy, our first all-in-one business management software, to critical acclaim from early adopters. This milestone validated our approach and established our reputation in the market.'
        },
        {
            icon: 'cpu-chip',
            year: '2023',
            title: 'Hardware Expansion',
            description: 'Expanded our capabilities into electronics design, launching the NebulaBook Pro and our line of smart accessories. This diversification marked our evolution from a software company to a complete tech solutions provider.'
        },
        {
            icon: 'star',
            year: '2024',
            title: 'Milestone Achievement',
            description: 'Celebrated serving over 10,000 customers worldwide and doubled the size of our passionate, innovative team. We also opened our second office and established key partnerships across three continents.'
        },
    ];

    const team = [
        { name: 'Jane Doe', title: 'Founder & CEO', imageUrl: 'https://i.pravatar.cc/300?u=jane_doe_ceo' },
        { name: 'John Smith', title: 'Chief Technology Officer', imageUrl: 'https://i.pravatar.cc/300?u=john_smith_cto' },
        { name: 'Emily White', title: 'Head of Design', imageUrl: 'https://i.pravatar.cc/300?u=emily_white_design' },
    ];

    const stats = [
        { icon: 'users', value: '10K+', label: 'Happy Customers' },
        { icon: 'briefcase', value: '500+', label: 'Projects Completed' },
        { icon: 'star', value: '98%', label: 'Satisfaction Rate' },
        { icon: 'globe', value: '25+', label: 'Countries Served' },
    ];

    // Smooth scroll to section
    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setIsMenuOpen(false);
        }
    };

    return (
        <>
            {/* Global styles */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-8px); }
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                /* Smooth scrolling for all browsers */
                html {
                    scroll-behavior: smooth;
                }

                /* Custom scrollbar */
                ::-webkit-scrollbar {
                    width: 6px;
                }

                ::-webkit-scrollbar-track {
                    background: transparent;
                }

                ::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
                    border-radius: 3px;
                }
            `}</style>

            <div className="relative bg-gradient-to-br from-slate-50 via-blue-50/20 to-purple-50/20 min-h-screen">
                {/* Enhanced background with better performance */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_50%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.08),transparent_50%)]" />
                    <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,rgba(59,130,246,0.03)_120deg,transparent_240deg)]" />
                </div>

                {/* Smart scroll progress indicator */}
                <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200/50 z-50">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-150 ease-out"
                        style={{ width: `${scrollProgress}%` }}
                    />
                </div>

                {/* Adaptive navigation - desktop only */}
                {!isTouch && (
                    <nav className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:block">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg border border-white/20">
                            <div className="space-y-2">
                                {[
                                    { id: 'hero', label: 'Home', icon: 'home' },
                                    { id: 'mission', label: 'Mission', icon: 'target' },
                                    { id: 'values', label: 'Values', icon: 'heart' },
                                    { id: 'timeline', label: 'Journey', icon: 'clock' },
                                    { id: 'team', label: 'Team', icon: 'users' },
                                    { id: 'cta', label: 'Contact', icon: 'mail' },
                                ].map((section) => (
                                    <button
                                        key={section.id}
                                        className={`group relative w-10 h-10 rounded-full transition-all duration-300 hover:scale-110 flex items-center justify-center ${
                                            activeSection === section.id
                                                ? 'bg-blue-500 text-white shadow-lg'
                                                : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50'
                                        }`}
                                        onClick={() => scrollToSection(section.id)}
                                        title={section.label}
                                    >
                                        <Icon name={section.icon} className="w-4 h-4" />

                                        {/* Tooltip */}
                                        <div className="absolute right-12 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                                            {section.label}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </nav>
                )}

                {/* Mobile navigation FAB */}
                {isTouch && (
                    <button
                        className={`fixed bottom-6 right-6 w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg z-40 flex items-center justify-center transition-all duration-300 ${
                            isMenuOpen ? 'rotate-45' : ''
                        }`}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <Icon name={isMenuOpen ? 'x' : 'menu'} className="w-6 h-6" />
                    </button>
                )}

                {/* Mobile navigation menu */}
                {isTouch && isMenuOpen && (
                    <div className="fixed inset-0 bg-black/50 z-30" onClick={() => setIsMenuOpen(false)}>
                        <div className="absolute bottom-20 right-6 bg-white rounded-2xl p-4 shadow-xl">
                            <div className="space-y-2">
                                {[
                                    { id: 'hero', label: 'Home' },
                                    { id: 'mission', label: 'Mission' },
                                    { id: 'values', label: 'Values' },
                                    { id: 'timeline', label: 'Journey' },
                                    { id: 'team', label: 'Team' },
                                    { id: 'cta', label: 'Contact' },
                                ].map((section) => (
                                    <button
                                        key={section.id}
                                        className="w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                                        onClick={() => scrollToSection(section.id)}
                                    >
                                        {section.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Hero Section - Enhanced responsiveness */}
                <section id="hero" className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
                    <div className="container mx-auto text-center max-w-6xl">
                        <div className="inline-flex items-center mb-6 sm:mb-8">
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-full text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                <span className="mr-2">✨</span>
                                About Kytriq
                            </span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-extrabold tracking-tight mb-6 sm:mb-8">
                            {['We', 'Are', 'Kytriq.'].map((word, i) => (
                                <span
                                    key={word}
                                    className="inline-block bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text text-transparent mr-2 sm:mr-4 hover:scale-105 transition-transform duration-300 cursor-default"
                                    style={{ animation: `fadeInUp 0.8s ease-out ${i * 0.2}s both` }}
                                >
                                    {word}
                                </span>
                            ))}
                        </h1>

                        <p className="max-w-4xl mx-auto text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 leading-relaxed mb-8 sm:mb-12">
                            Pioneering the intersection of software and hardware to build a smarter, more connected future through innovative solutions.
                        </p>

                        {/* Smart stats grid with better mobile layout */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto mb-8 sm:mb-12">
                            {stats.map((stat, index) => (
                                <StatsCounter key={stat.label} {...stat} index={index} />
                            ))}
                        </div>

                        {/* Enhanced CTA buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-md sm:max-w-none mx-auto">
                            <button
                                onClick={() => scrollToSection('mission')}
                                className="w-full sm:w-auto group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-full text-base sm:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl overflow-hidden"
                            >
                                <span className="relative z-10">Explore Our Story</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                            </button>

                            <button
                                onClick={() => onNavigate('contact')}
                                className="w-full sm:w-auto group bg-white/90 backdrop-blur-sm hover:bg-white text-gray-800 font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-full text-base sm:text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl border border-white/30"
                            >
                                <span className="group-hover:translate-x-1 transition-transform duration-300 inline-block">
                                    Get in Touch →
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Smart scroll indicator - hidden on touch devices */}
                    {!isTouch && (
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                            <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
                                <div className="w-1 h-3 bg-gray-600 rounded-full mt-2 animate-pulse" />
                            </div>
                        </div>
                    )}
                </section>

                {/* Mission Section - Enhanced typography */}
                <section id="mission" className="py-16 sm:py-24 lg:py-32 text-center relative px-4 sm:px-6 lg:px-8">
                    <div className="container mx-auto max-w-6xl">
                        <h2 className="text-sm sm:text-base font-semibold tracking-wider uppercase text-blue-600 mb-4 sm:mb-6">
                            Our Mission
                        </h2>
                        <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                            To empower visionaries with robust, elegant technology solutions, transforming complex challenges into seamless user experiences.
                        </p>
                    </div>
                </section>

                {/* Values Section - Improved grid responsiveness */}
                <section id="values" className="py-16 sm:py-24 lg:py-32 relative px-4 sm:px-6 lg:px-8">
                    <div className="container mx-auto max-w-7xl">
                        <div className="text-center mb-12 sm:mb-16">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 sm:mb-6">Our Core Values</h2>
                            <p className="max-w-3xl mx-auto text-lg sm:text-xl text-gray-600">
                                The fundamental principles that guide our work, partnerships, and culture.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 sm:gap-8">
                            {values.map((item, index) => (
                                <ValueCard
                                    key={item.title}
                                    iconName={item.icon}
                                    title={item.title}
                                    index={index}
                                >
                                    {item.description}
                                </ValueCard>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Timeline Section - Enhanced mobile layout */}
                <section id="timeline" className="py-16 sm:py-24 lg:py-32 relative px-4 sm:px-6 lg:px-8">
                    <div className="container mx-auto max-w-6xl">
                        <div className="text-center mb-12 sm:mb-16">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 sm:mb-6">Our Journey</h2>
                            <p className="max-w-3xl mx-auto text-lg sm:text-xl text-gray-600">
                                From humble beginnings to industry leadership - the milestones that shaped our story.
                            </p>
                        </div>

                        <div className="space-y-6 sm:space-y-8">
                            {timeline.map((item, index) => (
                                <TimelineItem
                                    key={item.title}
                                    iconName={item.icon}
                                    year={item.year}
                                    title={item.title}
                                    isLast={index === timeline.length - 1}
                                    index={index}
                                >
                                    {item.description}
                                </TimelineItem>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Team Section - Smart responsive grid */}
                <section id="team" className="py-16 sm:py-24 lg:py-32 relative px-4 sm:px-6 lg:px-8">
                    <div className="container mx-auto max-w-6xl">
                        <div className="text-center mb-12 sm:mb-16">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 sm:mb-6">Meet Our Team</h2>
                            <p className="max-w-3xl mx-auto text-lg sm:text-xl text-gray-600">
                                The passionate individuals driving innovation at Kytriq.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 justify-items-center">
                            {team.map((member, index) => (
                                <TeamMemberCard
                                    key={member.name}
                                    imageUrl={member.imageUrl}
                                    name={member.name}
                                    title={member.title}
                                    index={index}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section - Enhanced interactivity */}
                <section id="cta" className="py-16 sm:py-24 lg:py-32 text-center relative px-4 sm:px-6 lg:px-8">
                    <div className="container mx-auto max-w-4xl">
                        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-500">
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4 sm:mb-6">
                                Ready to Transform Your Vision?
                            </h2>
                            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
                                Let's collaborate to bring your ideas to life with cutting-edge technology solutions.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
                                <button
                                    onClick={() => onNavigate('contact')}
                                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-full text-base sm:text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                                >
                                    Start Your Project
                                </button>

                                <button
                                    onClick={() => onNavigate('products')}
                                    className="w-full sm:w-auto bg-white/80 backdrop-blur-sm hover:bg-white text-gray-800 font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-full text-base sm:text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl border border-gray-200"
                                >
                                    Explore Products
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default AboutPage;