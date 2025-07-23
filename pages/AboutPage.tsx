import React, { useState, useEffect, useRef, useCallback } from 'react';
import Icon from '../components/Icon';

interface AboutPageProps {
    onNavigate: (page: string) => void;
}

// Optimized intersection observer hook with performance improvements
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
                threshold: [0, 0.1, 0.3, 0.5, 0.7, 0.9, 1.0],
                rootMargin: '50px',
                ...options
            }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return [ref, isVisible, progress] as const;
};

// Enhanced touch detection with gesture support
const useTouch = () => {
    const [isTouch, setIsTouch] = useState(false);
    const [gestureSupport, setGestureSupport] = useState(false);

    useEffect(() => {
        const checkTouch = () => {
            setIsTouch(window.matchMedia('(hover: none) and (pointer: coarse)').matches);
            setGestureSupport('ontouchstart' in window);
        };
        checkTouch();
        window.addEventListener('resize', checkTouch, { passive: true });
        return () => window.removeEventListener('resize', checkTouch);
    }, []);

    return { isTouch, gestureSupport };
};

// Enhanced 3D tilt effect hook
const useTiltEffect = () => {
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const ref = useRef<HTMLDivElement>(null);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const rotateX = (e.clientY - centerY) / rect.height * -10;
        const rotateY = (e.clientX - centerX) / rect.width * 10;

        setTilt({ x: rotateX, y: rotateY });
    }, []);

    const handleMouseLeave = useCallback(() => {
        setTilt({ x: 0, y: 0 });
    }, []);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        element.addEventListener('mousemove', handleMouseMove);
        element.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            element.removeEventListener('mousemove', handleMouseMove);
            element.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [handleMouseMove, handleMouseLeave]);

    return [ref, tilt] as const;
};

// Enhanced value card with 3D effects and micro-interactions
const ValueCard: React.FC<{
    iconName: string;
    title: string;
    children: React.ReactNode;
    index: number;
}> = ({ iconName, title, children, index }) => {
    const [cardRef, isInView, progress] = useIntersectionObserver();
    const [tiltRef, tilt] = useTiltEffect();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const { isTouch } = useTouch();

    const themeColors = [
        {
            gradient: 'from-techflex-blue-500 to-techflex-blue-700',
            bg: 'bg-techflex-blue-50',
            text: 'text-techflex-blue-600',
            shadow: 'shadow-techflex-blue-500/20',
            glow: 'drop-shadow-[0_0_20px_rgba(20,105,183,0.3)]'
        },
        {
            gradient: 'from-techflex-orange-500 to-techflex-orange-600',
            bg: 'bg-techflex-orange-50',
            text: 'text-techflex-orange-600',
            shadow: 'shadow-techflex-orange-500/20',
            glow: 'drop-shadow-[0_0_20px_rgba(255,102,0,0.3)]'
        },
        {
            gradient: 'from-brand-gray-600 to-brand-gray-800',
            bg: 'bg-brand-gray-50',
            text: 'text-brand-gray-700',
            shadow: 'shadow-brand-gray-500/20',
            glow: 'drop-shadow-[0_0_20px_rgba(71,85,105,0.3)]'
        },
        {
            gradient: 'from-techflex-blue-600 via-purple-500 to-techflex-orange-500',
            bg: 'bg-gradient-to-br from-techflex-blue-50 to-techflex-orange-50',
            text: 'text-techflex-blue-700',
            shadow: 'shadow-purple-500/20',
            glow: 'drop-shadow-[0_0_20px_rgba(147,51,234,0.3)]'
        }
    ];

    const currentTheme = themeColors[index % themeColors.length];

    useEffect(() => {
        if (isExpanded && isTouch) {
            const timer = setTimeout(() => setIsExpanded(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [isExpanded, isTouch]);

    const cardStyle = {
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-${progress * 6}px) translateZ(${isHovered ? 20 : 0}px)`,
        transition: 'transform 0.3s ease-out',
    };

    return (
        <div
            ref={(node) => {
                if (node) {
                    (cardRef as React.MutableRefObject<HTMLDivElement>).current = node;
                    (tiltRef as React.MutableRefObject<HTMLDivElement>).current = node;
                }
            }}
            className={`group relative bg-white/95 backdrop-blur-lg rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 border border-white/40 overflow-hidden cursor-pointer transform-gpu ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            } ${isHovered ? currentTheme.shadow : ''}`}
            style={{
                transitionDelay: `${index * 150}ms`,
                ...cardStyle,
            }}
            onClick={() => setIsExpanded(!isExpanded)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsExpanded(!isExpanded);
                }
            }}
        >
            {/* Animated background mesh */}
            <div className="absolute inset-0 opacity-40">
                <div className={`absolute inset-0 bg-gradient-to-br ${currentTheme.gradient} opacity-5`} />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
            </div>

            {/* Floating particles effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className={`absolute w-1 h-1 bg-gradient-to-r ${currentTheme.gradient} rounded-full opacity-20 animate-pulse`}
                        style={{
                            left: `${20 + i * 15}%`,
                            top: `${30 + (i % 3) * 20}%`,
                            animationDelay: `${i * 0.5}s`,
                            animationDuration: `${2 + i * 0.3}s`,
                        }}
                    />
                ))}
            </div>

            <div className="relative p-8 z-10">
                {/* Enhanced icon section with glow effect */}
                <div className="mb-6 flex items-center justify-between">
                    <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${currentTheme.gradient} flex items-center justify-center shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${isHovered ? currentTheme.glow : ''}`}>
                        <Icon name={iconName} className="w-8 h-8 text-white drop-shadow-sm" />
                        {/* Pulse ring effect */}
                        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${currentTheme.gradient} opacity-40 scale-110 animate-ping`} />
                    </div>

                    {/* Enhanced expand indicator */}
                    <div className="flex flex-col items-center gap-1">
                        <Icon
                            name="chevron-right"
                            className={`w-5 h-5 text-brand-gray-400 transition-all duration-500 ${
                                isExpanded ? 'rotate-90 text-techflex-blue-500' : 'rotate-0'
                            }`}
                        />
                        <div className={`h-px w-4 bg-gradient-to-r ${currentTheme.gradient} transition-all duration-500 ${
                            isExpanded ? 'opacity-100 scale-100' : 'opacity-50 scale-50'
                        }`} />
                    </div>
                </div>

                {/* Enhanced title with gradient text */}
                <h3 className={`text-2xl font-bold mb-4 transition-all duration-500 ${
                    isHovered
                        ? `bg-gradient-to-r ${currentTheme.gradient} bg-clip-text text-transparent`
                        : 'text-brand-gray-900'
                }`}>
                    {title}
                </h3>

                {/* Content with smooth expansion and reading progress */}
                <div className={`overflow-hidden transition-all duration-700 ${
                    isExpanded ? 'max-h-96' : 'max-h-24'
                }`}>
                    <p className="text-brand-gray-600 leading-relaxed text-sm relative">
                        {children}
                    </p>
                    {/* Reading progress indicator */}
                    <div className={`mt-3 h-0.5 bg-brand-gray-100 rounded-full overflow-hidden transition-all duration-700 ${
                        isExpanded ? 'opacity-100' : 'opacity-0'
                    }`}>
                        <div
                            className={`h-full bg-gradient-to-r ${currentTheme.gradient} transition-all duration-2000 ease-out`}
                            style={{ width: isExpanded ? '100%' : '0%' }}
                        />
                    </div>
                </div>

                {/* Interactive progress bar with pulse effect */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-gray-100 via-brand-gray-200 to-brand-gray-100">
                    <div
                        className={`h-full bg-gradient-to-r ${currentTheme.gradient} transition-all duration-1000 relative overflow-hidden`}
                        style={{ width: `${progress * 100}%` }}
                    >
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Enhanced timeline with interactive elements
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
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            ref={itemRef as React.RefObject<HTMLDivElement>}
            className={`relative flex gap-8 pb-12 transition-all duration-1000 ${
                isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
            style={{ transitionDelay: `${index * 200}ms` }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Enhanced Timeline connector with gradient */}
            {!isLast && (
                <div className="absolute left-8 top-20 w-0.5 h-full">
                    {/* Background line */}
                    <div className="w-full h-full bg-gradient-to-b from-techflex-blue-100 via-techflex-blue-200 to-transparent rounded-full" />
                    {/* Progress line with glow */}
                    <div
                        className="absolute top-0 left-0 w-full bg-gradient-to-b from-techflex-blue-500 to-techflex-orange-500 transition-all duration-1500 ease-out rounded-full shadow-lg"
                        style={{
                            height: `${progress * 100}%`,
                            boxShadow: isHovered ? '0 0 20px rgba(20,105,183,0.5)' : 'none'
                        }}
                    >
                        {/* Flowing animation */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent rounded-full animate-pulse" />
                    </div>
                </div>
            )}

            {/* Enhanced Icon and year section */}
            <div className="flex flex-col items-center gap-3 flex-shrink-0 z-10">
                {/* 3D Icon with hover effects */}
                <div className={`relative w-16 h-16 rounded-full bg-gradient-to-br from-techflex-blue-500 to-techflex-blue-700 shadow-xl flex items-center justify-center transition-all duration-500 ${
                    isHovered ? 'scale-110 rotate-3 shadow-2xl' : ''
                }`}>
                    <Icon name={iconName} className="w-8 h-8 text-white drop-shadow-sm" />
                    {/* Pulse rings */}
                    <div className="absolute inset-0 rounded-full bg-techflex-blue-500/30 scale-150 animate-ping" />
                    <div className="absolute inset-0 rounded-full bg-techflex-blue-500/20 scale-125 animate-pulse" />
                </div>

                {/* Enhanced year badge */}
                <div className={`bg-white shadow-lg rounded-2xl px-4 py-2 border-2 transition-all duration-300 ${
                    isHovered ? 'border-techflex-blue-500 scale-105' : 'border-brand-gray-200'
                }`}>
                    <span className="text-sm font-bold text-techflex-blue-600">{year}</span>
                </div>
            </div>

            {/* Enhanced Content card */}
            <div className="flex-1 min-w-0">
                <div
                    className={`bg-white/95 backdrop-blur-lg rounded-2xl p-8 shadow-lg hover:shadow-2xl border border-white/40 cursor-pointer transition-all duration-500 relative overflow-hidden ${
                        isHovered ? 'transform scale-[1.02] border-techflex-blue-200' : ''
                    }`}
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {/* Background mesh */}
                    <div className="absolute inset-0 opacity-30">
                        <div className="absolute inset-0 bg-gradient-to-br from-techflex-blue-50/50 via-transparent to-techflex-orange-50/50" />
                    </div>

                    <div className="relative z-10">
                        {/* Title with gradient hover */}
                        <h3 className={`text-2xl font-bold mb-4 transition-all duration-500 ${
                            isHovered
                                ? 'bg-gradient-to-r from-techflex-blue-600 to-techflex-orange-500 bg-clip-text text-transparent'
                                : 'text-brand-gray-900'
                        }`}>
                            {title}
                        </h3>

                        {/* Content with expansion */}
                        <div className={`overflow-hidden transition-all duration-700 ${
                            isExpanded ? 'max-h-96' : 'max-h-20'
                        }`}>
                            <p className="text-brand-gray-600 leading-relaxed">
                                {children}
                            </p>
                        </div>

                        {/* Enhanced status and action section */}
                        <div className="mt-6 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                                    <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping" />
                                </div>
                                <span className="text-sm font-medium text-green-600">Milestone Achieved</span>
                            </div>

                            <button className={`text-sm font-semibold px-4 py-2 rounded-full transition-all duration-300 ${
                                isExpanded
                                    ? 'text-techflex-orange-600 bg-techflex-orange-50 hover:bg-techflex-orange-100'
                                    : 'text-techflex-blue-600 bg-techflex-blue-50 hover:bg-techflex-blue-100'
                            }`}>
                                {isExpanded ? 'Show Less ↑' : 'Learn More →'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Enhanced team member card with social proof
const TeamMemberCard: React.FC<{
    imageUrl: string;
    name: string;
    title: string;
    index: number;
}> = ({ imageUrl, name, title, index }) => {
    const [cardRef, isInView] = useIntersectionObserver();
    const [tiltRef, tilt] = useTiltEffect();
    const [isHovered, setIsHovered] = useState(false);

    const cardStyle = {
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(${isHovered ? 20 : 0}px)`,
        transition: 'transform 0.3s ease-out',
    };

    return (
        <div
            ref={(node) => {
                if (node) {
                    (cardRef as React.MutableRefObject<HTMLDivElement>).current = node;
                    (tiltRef as React.MutableRefObject<HTMLDivElement>).current = node;
                }
            }}
            className={`text-center transition-all duration-1000 transform-gpu ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
            style={{
                transitionDelay: `${index * 250}ms`,
                ...cardStyle,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Enhanced profile image with effects */}
            <div className="relative w-40 h-40 mx-auto mb-6 group">
                <div className={`w-full h-full rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 ${
                    isHovered ? 'shadow-techflex-blue-500/30 scale-105' : ''
                }`}>
                    <img
                        src={imageUrl}
                        alt={name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                    />
                    {/* Overlay with gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Status indicators */}
                <div className="absolute top-3 right-3 flex gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg animate-pulse" />
                </div>

                {/* Floating action button */}
                <div className={`absolute bottom-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center transition-all duration-500 ${
                    isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                }`}>
                    <Icon name="mail" className="w-5 h-5 text-techflex-blue-600" />
                </div>
            </div>

            {/* Enhanced name and title */}
            <div className="space-y-2">
                <h3 className={`text-xl font-bold transition-all duration-500 ${
                    isHovered
                        ? 'bg-gradient-to-r from-techflex-blue-600 to-techflex-orange-500 bg-clip-text text-transparent'
                        : 'text-brand-gray-900'
                }`}>
                    {name}
                </h3>
                <p className="text-sm font-semibold text-techflex-blue-600 mb-3">{title}</p>

                {/* Animated underline */}
                <div className="flex justify-center">
                    <div className={`h-1 bg-gradient-to-r from-techflex-blue-500 to-techflex-orange-500 rounded-full transition-all duration-500 ${
                        isHovered ? 'w-16' : 'w-8'
                    }`} />
                </div>
            </div>
        </div>
    );
};

// Enhanced stats counter with animated charts
const StatsCounter: React.FC<{
    value: string;
    label: string;
    icon: string;
    index: number;
}> = ({ value, label, icon, index }) => {
    const [counterRef, isInView] = useIntersectionObserver();
    const [count, setCount] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const finalValue = parseInt(value.replace(/\D/g, '')) || 0;
    const hasPlus = value.includes('+');
    const hasPercent = value.includes('%');

    useEffect(() => {
        if (isInView && finalValue > 0) {
            const duration = 2500;
            const steps = 60;
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

    const themeColors = [
        { gradient: 'from-techflex-blue-500 to-techflex-blue-600', bg: 'bg-techflex-blue-50', ring: 'ring-techflex-blue-500/20' },
        { gradient: 'from-techflex-orange-500 to-techflex-orange-600', bg: 'bg-techflex-orange-50', ring: 'ring-techflex-orange-500/20' },
        { gradient: 'from-brand-gray-600 to-brand-gray-700', bg: 'bg-brand-gray-50', ring: 'ring-brand-gray-500/20' },
        { gradient: 'from-purple-500 to-pink-500', bg: 'bg-purple-50', ring: 'ring-purple-500/20' }
    ];

    const currentTheme = themeColors[index % themeColors.length];

    return (
        <div
            ref={counterRef as React.RefObject<HTMLDivElement>}
            className={`text-center p-8 rounded-2xl bg-white/95 backdrop-blur-lg border border-white/40 shadow-lg hover:shadow-2xl transition-all duration-1000 cursor-pointer transform-gpu ${
                isInView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
            } ${isHovered ? `ring-4 ${currentTheme.ring} scale-105` : ''}`}
            style={{ transitionDelay: `${index * 150}ms` }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Enhanced icon with glow */}
            <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${currentTheme.gradient} flex items-center justify-center shadow-lg transition-all duration-500 ${
                isHovered ? 'scale-110 rotate-3 drop-shadow-[0_0_20px_rgba(20,105,183,0.4)]' : ''
            }`}>
                <Icon name={icon} className="w-8 h-8 text-white drop-shadow-sm" />
            </div>

            {/* Animated counter with enhanced typography */}
            <div className={`text-4xl font-black mb-3 transition-all duration-500 ${
                isHovered
                    ? `bg-gradient-to-r ${currentTheme.gradient} bg-clip-text text-transparent`
                    : 'text-brand-gray-900'
            }`}>
                {finalValue > 0 ? (
                    <>
                        <span className="tabular-nums">
                            {count.toLocaleString()}
                        </span>
                        {hasPlus && <span className="text-techflex-orange-500">+</span>}
                        {hasPercent && <span className="text-techflex-blue-500">%</span>}
                    </>
                ) : value}
            </div>

            {/* Enhanced label */}
            <div className="text-sm text-brand-gray-600 font-semibold tracking-wide uppercase">
                {label}
            </div>

            {/* Progress indicator */}
            <div className={`mt-4 h-1 bg-brand-gray-100 rounded-full overflow-hidden transition-all duration-1000 ${
                isInView ? 'opacity-100' : 'opacity-0'
            }`}>
                <div
                    className={`h-full bg-gradient-to-r ${currentTheme.gradient} transition-all duration-2000 ease-out`}
                    style={{ width: isInView ? '100%' : '0%' }}
                />
            </div>
        </div>
    );
};

const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState('hero');
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isLoaded, setIsLoaded] = useState(false);

    // Enhanced scroll tracking with performance optimization
    const handleScroll = useCallback(() => {
        const scrolled = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = Math.min((scrolled / maxScroll) * 100, 100);
        setScrollProgress(progress);

        // Update active section with improved detection
        const sections = ['hero', 'mission', 'values', 'timeline', 'team', 'cta'];
        let currentSection = 'hero';

        for (const section of sections) {
            const element = document.getElementById(section);
            if (element) {
                const rect = element.getBoundingClientRect();
                if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= window.innerHeight * 0.1) {
                    currentSection = section;
                }
            }
        }

        if (currentSection !== activeSection) {
            setActiveSection(currentSection);
        }
    }, [activeSection]);

    // Enhanced mouse tracking for parallax effects
    const handleMouseMove = useCallback((e: MouseEvent) => {
        setMousePosition({
            x: (e.clientX / window.innerWidth - 0.5) * 2,
            y: (e.clientY / window.innerHeight - 0.5) * 2,
        });
    }, []);

    useEffect(() => {
        const throttledScroll = () => requestAnimationFrame(handleScroll);
        window.addEventListener('scroll', throttledScroll, { passive: true });
        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        // Initial load animation
        setTimeout(() => setIsLoaded(true), 100);

        return () => {
            window.removeEventListener('scroll', throttledScroll);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [handleScroll, handleMouseMove]);

    // Content data with enhanced descriptions
    const values = [
        {
            icon: 'light-bulb',
            title: 'Innovation',
            description: "We constantly push the boundaries of what's possible, embracing cutting-edge technologies and creative thinking to solve complex problems. Our team thrives on challenges that others see as impossible, turning ambitious visions into reality through breakthrough solutions that shape the future."
        },
        {
            icon: 'shield-check',
            title: 'Quality',
            description: "Excellence is not an act, but a habit deeply embedded in our DNA. We are committed to delivering polished, reliable, and robust products that stand the test of time, ensuring every detail meets our exceptionally high standards and exceeds customer expectations."
        },
        {
            icon: 'users',
            title: 'Partnership',
            description: "Your success is our success, and we believe in building lasting relationships based on trust, transparency, and collaborative teamwork. We treat every client as a valued partner in their journey, working together to achieve remarkable outcomes that benefit everyone involved."
        },
        {
            icon: 'scale',
            title: 'Integrity',
            description: "We operate with unwavering honesty and a strong moral compass that guides every decision we make. Doing the right thing is the only way we do business, maintaining the highest ethical standards in every interaction and building trust that lasts a lifetime."
        },
    ];

    const timeline = [
        {
            icon: 'flag',
            year: '2020',
            title: 'Kytriq is Born',
            description: 'Founded with a bold vision to seamlessly merge the worlds of custom software and cutting-edge hardware. Our journey began with three passionate engineers and a shared dream to transform how technology serves humanity, starting from a small garage with big ambitions.'
        },
        {
            icon: 'rocket-launch',
            year: '2021',
            title: 'First Product Launch',
            description: 'We launched Synergy, our flagship all-in-one business management software, to critical acclaim from early adopters worldwide. This pivotal milestone validated our approach and established our reputation as innovators who deliver on promises, setting the foundation for future growth.'
        },
        {
            icon: 'cpu-chip',
            year: '2023',
            title: 'Hardware Expansion',
            description: 'Expanded our capabilities into electronics design and manufacturing, launching the revolutionary NebulaBook Pro and our comprehensive line of smart accessories. This strategic diversification marked our evolution into a complete technology solutions provider.'
        },
        {
            icon: 'star',
            year: '2024',
            title: 'Global Milestone',
            description: 'Celebrated serving over 10,000 satisfied customers worldwide while doubling our innovative team size. We opened our second international office and established key strategic partnerships across three continents, positioning us for unprecedented global growth.'
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

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className={`relative bg-gradient-to-br py-8 from-brand-gray-50 via-white to-techflex-blue-50/30 min-h-screen transition-all duration-1000 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
        }`}>
            {/* Enhanced scroll progress indicator */}
            <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-gray-200 via-brand-gray-100 to-brand-gray-200 z-50">
                <div
                    className="h-full bg-gradient-to-r from-techflex-blue-500 via-purple-500 to-techflex-orange-500 transition-all duration-300 ease-out shadow-lg"
                    style={{ width: `${scrollProgress}%` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent animate-pulse" />
                </div>
            </div>

            {/* Floating background elements with mouse parallax */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-gradient-to-r from-techflex-blue-300/20 to-techflex-orange-300/20 rounded-full animate-pulse"
                        style={{
                            left: `${20 + i * 12}%`,
                            top: `${30 + (i % 4) * 20}%`,
                            transform: `translate(${mousePosition.x * (i + 1) * 10}px, ${mousePosition.y * (i + 1) * 10}px)`,
                            animationDelay: `${i * 0.7}s`,
                            animationDuration: `${3 + i * 0.5}s`,
                        }}
                    />
                ))}
            </div>


            {/* Enhanced Hero Section */}
            <section id="hero" className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                {/* Animated background mesh */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-techflex-blue-200/30 to-transparent rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-techflex-orange-200/30 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                <div className="container mx-auto text-center max-w-6xl relative z-10">
                    {/* Enhanced badge */}
                    <div className="inline-flex items-center mb-8 group cursor-pointer">
                        <span className="bg-gradient-to-r from-techflex-blue-600 to-techflex-orange-600 text-white px-8 py-4 rounded-full text-sm font-bold shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 flex items-center gap-3">
                            <span className="text-lg animate-bounce">✨</span>
                            <span>About Kytriq</span>
                            <Icon name="arrow-right" className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                    </div>

                    {/* Enhanced title with staggered animation */}
                    <div className="overflow-hidden mb-8">
                        <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
                            {['We', 'Are', 'Kytriq.'].map((word, index) => (
                                <span
                                    key={word}
                                    className={`inline-block transition-all duration-1000 ${
                                        isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                                    }`}
                                    style={{
                                        transitionDelay: `${index * 200}ms`,
                                        background: index === 2
                                            ? 'linear-gradient(135deg, #1469B7, #FF6600)'
                                            : 'linear-gradient(135deg, #0F172A, #1469B7)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                    }}
                                >
                                    {word}
                                    {index < 2 && ' '}
                                </span>
                            ))}
                        </h3>
                    </div>

                    {/* Enhanced subtitle */}
                    <p className={`max-w-4xl mx-auto text-xl sm:text-2xl text-brand-gray-600 leading-relaxed mb-12 transition-all duration-1000 ${
                        isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                    }`} style={{ transitionDelay: '600ms' }}>
                        Pioneering the intersection of <span className="font-semibold text-techflex-blue-600">software</span> and{' '}
                        <span className="font-semibold text-techflex-orange-600">hardware</span> to build a smarter, more connected future
                        through innovative solutions that transform lives.
                    </p>

                    {/* Enhanced stats grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
                        {stats.map((stat, index) => (
                            <StatsCounter key={stat.label} {...stat} index={index} />
                        ))}
                    </div>

                    {/* Enhanced CTA buttons */}
                    <div className={`flex flex-col mb-8 sm:flex-row gap-6 justify-center items-center transition-all duration-1000 ${
                        isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                    }`} style={{ transitionDelay: '1000ms' }}>
                        <button
                            onClick={() => scrollToSection('mission')}
                            className="group relative bg-gradient-to-r from-techflex-blue-600 to-techflex-orange-600 hover:from-techflex-blue-700 hover:to-techflex-orange-700 text-white font-bold py-5 px-10 rounded-full transition-all duration-500 hover:scale-105 hover:shadow-2xl overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                Explore Our Story
                                <Icon name="arrow-down" className="w-5 h-5 transition-transform duration-300 group-hover:translate-y-1" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </button>

                        <button
                            onClick={() => onNavigate('contact')}
                            className="group bg-white/95 backdrop-blur-lg text-brand-gray-800 font-bold py-5 px-10 rounded-full transition-all duration-500 hover:scale-105 hover:shadow-2xl border border-white/40 hover:border-techflex-blue-200"
                        >
                            <span className="flex items-center gap-3">
                                Get in Touch
                                <Icon name="arrow-right" className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                            </span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Enhanced Mission Section */}
            <section id="mission" className="py-24 px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-lg border-y border-white/40">
                <div className="container mx-auto max-w-5xl text-center">
                    <div className="mb-8">
                        <span className="inline-block px-4 py-2 bg-techflex-blue-100 text-techflex-blue-700 rounded-full text-sm font-semibold mb-4">
                            Our Purpose
                        </span>
                        <h2 className="text-4xl sm:text-5xl font-bold text-brand-gray-900 mb-8">
                            Our <span className="bg-gradient-to-r from-techflex-blue-600 to-techflex-orange-500 bg-clip-text text-transparent">Mission</span>
                        </h2>
                    </div>
                    <p className="text-2xl text-brand-gray-600 leading-relaxed font-light">
                        We exist to bridge the gap between innovative technology and meaningful human experiences.
                        Through our integrated approach to software and hardware solutions, we empower businesses
                        and individuals to achieve more than they thought possible, creating lasting impact in an
                        increasingly connected world.
                    </p>
                </div>
            </section>

            {/* Enhanced Values Section */}
            <section id="values" className="py-24 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto max-w-7xl">
                    <div className="text-center mb-20">
                        <span className="inline-block px-4 py-2 bg-techflex-orange-100 text-techflex-orange-700 rounded-full text-sm font-semibold mb-4">
                            What Drives Us
                        </span>
                        <h2 className="text-4xl sm:text-5xl font-bold text-brand-gray-900 mb-6">
                            Our <span className="bg-gradient-to-r from-techflex-orange-500 to-techflex-blue-600 bg-clip-text text-transparent">Values</span>
                        </h2>
                        <p className="text-xl text-brand-gray-600 max-w-3xl mx-auto">
                            The fundamental principles that guide everything we do and shape our company culture
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                        {values.map((value, index) => (
                            <ValueCard key={value.title} iconName={value.icon} title={value.title} index={index}>
                                {value.description}
                            </ValueCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* Enhanced Timeline Section */}
            <section id="timeline" className="py-24 px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-lg">
                <div className="container mx-auto max-w-5xl">
                    <div className="text-center mb-20">
                        <span className="inline-block px-4 py-2 bg-brand-gray-100 text-brand-gray-700 rounded-full text-sm font-semibold mb-4">
                            Our Evolution
                        </span>
                        <h2 className="text-4xl sm:text-5xl font-bold text-brand-gray-900 mb-6">
                            Our <span className="bg-gradient-to-r from-brand-gray-700 to-techflex-blue-600 bg-clip-text text-transparent">Journey</span>
                        </h2>
                        <p className="text-xl text-brand-gray-600 max-w-3xl mx-auto">
                            Key milestones that shaped our story and defined our path to innovation
                        </p>
                    </div>

                    <div className="space-y-12">
                        {timeline.map((item, index) => (
                            <TimelineItem
                                key={item.year}
                                iconName={item.icon}
                                year={item.year}
                                title={item.title}
                                index={index}
                                isLast={index === timeline.length - 1}
                            >
                                {item.description}
                            </TimelineItem>
                        ))}
                    </div>
                </div>
            </section>

            {/* Enhanced Team Section */}
            <section id="team" className="py-24 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-20">
                        <span className="inline-block px-4 py-2 bg-techflex-blue-100 text-techflex-blue-700 rounded-full text-sm font-semibold mb-4">
                            Our People
                        </span>
                        <h2 className="text-4xl sm:text-5xl font-bold text-brand-gray-900 mb-6">
                            Meet Our <span className="bg-gradient-to-r from-techflex-blue-600 to-techflex-orange-500 bg-clip-text text-transparent">Team</span>
                        </h2>
                        <p className="text-xl text-brand-gray-600 max-w-3xl mx-auto">
                            The passionate innovators and visionaries behind Kytriq's success
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
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

            {/* Enhanced CTA Section */}
            <section id="cta" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-techflex-blue-600 via-purple-600 to-techflex-orange-600 relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                <div className="container mx-auto max-w-5xl text-center relative z-10">
                    <div className="mb-8">
                        <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-semibold mb-6 border border-white/30">
                            Ready to Begin?
                        </span>
                        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                            Ready to Get Started?
                        </h2>
                        <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
                            Join thousands of satisfied customers who trust Kytriq with their technology needs.
                            Let's build something amazing together.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <button
                            onClick={() => onNavigate('contact')}
                            className="group bg-white text-techflex-blue-600 font-bold py-5 px-10 rounded-full transition-all duration-500 hover:scale-105 hover:shadow-2xl"
                        >
                            <span className="flex items-center gap-3">
                                Contact Us Today
                                <Icon name="arrow-right" className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                            </span>
                        </button>

                        <button
                            onClick={() => onNavigate('products')}
                            className="group bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 font-bold py-5 px-10 rounded-full transition-all duration-500 hover:bg-white/30 hover:border-white/50 hover:scale-105"
                        >
                            <span className="flex items-center gap-3">
                                Explore Products
                                <Icon name="shopping-bag" className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                            </span>
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
