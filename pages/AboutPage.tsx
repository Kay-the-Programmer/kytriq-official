import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Icon from '../components/Icon';
import { usePerformanceMonitor } from '../utils/performanceMonitor';
import './AboutPage.css';

interface AboutPageProps {
    onNavigate: (page: string) => void;
}

const useIntersectionObserver = (options = {}) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            {
                threshold: 0.1,
                ...options,
            }
        );

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [options]);

    return [ref, isVisible] as const;
};

const ValueCard: React.FC<{
    iconName: string;
    title: string;
    children: React.ReactNode;
    index: number;
}> = React.memo(({ iconName, title, children, index }) => {
    const [cardRef, isInView] = useIntersectionObserver();

    const themeColors = useMemo(() => [
        {
            gradient: 'from-techflex-blue-500 to-techflex-blue-700',
            bg: 'bg-techflex-blue-50',
            text: 'text-techflex-blue-600',
            shadow: 'shadow-techflex-blue-500/20',
        },
        {
            gradient: 'from-techflex-orange-500 to-techflex-orange-600',
            bg: 'bg-techflex-orange-50',
            text: 'text-techflex-orange-600',
            shadow: 'shadow-techflex-orange-500/20',
        },
        {
            gradient: 'from-brand-gray-600 to-brand-gray-800',
            bg: 'bg-brand-gray-50',
            text: 'text-brand-gray-700',
            shadow: 'shadow-brand-gray-500/20',
        }
    ], []);

    const currentTheme = themeColors[index % themeColors.length];

    return (
        <div
            ref={cardRef as React.RefObject<HTMLDivElement>}
            className={`group relative bg-white/95 backdrop-blur-lg rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-700 border border-white/40 overflow-hidden ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            } ${currentTheme.shadow}`}
            style={{
                transitionDelay: `${index * 150}ms`,
            }}
        >
            <div className="relative p-8 z-10">
                <div className={`relative w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br ${currentTheme.gradient} flex items-center justify-center shadow-lg`}>
                    <Icon name={iconName} className="w-8 h-8 text-white" />
                </div>
                <h3 className={`text-2xl font-bold mb-4 ${currentTheme.text}`}>
                    {title}
                </h3>
                <p className="text-brand-gray-600 leading-relaxed text-sm">
                    {children}
                </p>
            </div>
        </div>
    );
});

const TimelineItem: React.FC<{
    iconName: string;
    year: string;
    title: string;
    children: React.ReactNode;
    isLast?: boolean;
    index: number;
}> = React.memo(({ iconName, year, title, children, isLast = false, index }) => {
    const [itemRef, isInView] = useIntersectionObserver();

    return (
        <div
            ref={itemRef as React.RefObject<HTMLDivElement>}
            className={`relative flex gap-8 pb-12 transition-all duration-1000 ${
                isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
            style={{ transitionDelay: `${index * 200}ms` }}
        >
            {!isLast && (
                <div className="absolute left-8 top-20 w-0.5 h-full bg-gradient-to-b from-techflex-blue-100 to-transparent" />
            )}
            <div className="flex flex-col items-center gap-3 flex-shrink-0 z-10">
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-techflex-blue-500 to-techflex-blue-700 shadow-xl flex items-center justify-center">
                    <Icon name={iconName} className="w-8 h-8 text-white" />
                </div>
                <div className="bg-white shadow-lg rounded-2xl px-4 py-2 border-2 border-brand-gray-200">
                    <span className="text-sm font-bold text-techflex-blue-600">{year}</span>
                </div>
            </div>
            <div className="flex-1 min-w-0">
                <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/40">
                    <h3 className="text-2xl font-bold mb-4 text-brand-gray-900">
                        {title}
                    </h3>
                    <p className="text-brand-gray-600 leading-relaxed">
                        {children}
                    </p>
                </div>
            </div>
        </div>
    );
});

const TeamMemberCard: React.FC<{
    imageUrl: string;
    name: string;
    title: string;
    index: number;
}> = React.memo(({ imageUrl, name, title, index }) => {
    const [cardRef, isInView] = useIntersectionObserver();

    return (
        <div
            ref={cardRef as React.RefObject<HTMLDivElement>}
            className={`text-center transition-all duration-1000 transform-gpu ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
            style={{
                transitionDelay: `${index * 250}ms`,
            }}
        >
            <div className="relative w-40 h-40 mx-auto mb-6">
                <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl">
                    <img
                        src={imageUrl}
                        alt={name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                </div>
            </div>
            <div className="space-y-2">
                <h3 className="text-xl font-bold text-brand-gray-900">
                    {name}
                </h3>
                <p className="text-sm font-semibold text-techflex-blue-600">{title}</p>
            </div>
        </div>
    );
});

const StatsCounter: React.FC<{
    value: string;
    label: string;
    icon: string;
    index: number;
}> = React.memo(({ value, label, icon, index }) => {
    const [counterRef, isInView] = useIntersectionObserver();
    const [count, setCount] = useState(0);
    const finalValue = parseInt(value.replace(/\D/g, '')) || 0;
    const hasPlus = value.includes('+');
    const hasPercent = value.includes('%');

    useEffect(() => {
        if (isInView && finalValue > 0) {
            const duration = 2000;
            const step = Math.max(1, Math.floor(finalValue / 100));
            let current = 0;
            const timer = setInterval(() => {
                current += step;
                if (current >= finalValue) {
                    setCount(finalValue);
                    clearInterval(timer);
                } else {
                    setCount(current);
                }
            }, duration / (finalValue / step));
            return () => clearInterval(timer);
        }
    }, [isInView, finalValue]);

    return (
        <div
            ref={counterRef as React.RefObject<HTMLDivElement>}
            className={`text-center p-8 rounded-2xl bg-white/95 backdrop-blur-lg border border-white/40 shadow-lg transition-all duration-1000 ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
            style={{ transitionDelay: `${index * 150}ms` }}
        >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-techflex-blue-500 to-techflex-orange-500 flex items-center justify-center shadow-lg">
                <Icon name={icon} className="w-8 h-8 text-white" />
            </div>
            <div className="text-4xl font-black mb-3 text-brand-gray-900">
                {count.toLocaleString()}
                {hasPlus && <span className="text-techflex-orange-500">+</span>}
                {hasPercent && <span className="text-techflex-blue-500">%</span>}
            </div>
            <div className="text-sm text-brand-gray-600 font-semibold tracking-wide uppercase">
                {label}
            </div>
        </div>
    );
});


const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
    usePerformanceMonitor('AboutPage');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const values = useMemo(() => [
        {
            icon: 'light-bulb',
            title: 'Innovation',
            description: "We constantly push the boundaries of what's possible, embracing cutting-edge technologies to solve complex problems."
        },
        {
            icon: 'shield-check',
            title: 'Quality',
            description: "Excellence is not an act, but a habit. We are committed to delivering polished, reliable, and robust products."
        },
        {
            icon: 'users',
            title: 'Partnership',
            description: "Your success is our success. We believe in building lasting relationships based on trust and collaborative teamwork."
        },
        {
            icon: 'scale',
            title: 'Integrity',
            description: "We operate with unwavering honesty and a strong moral compass. Doing the right thing is the only way we do business."
        },
    ], []);

    const timeline = useMemo(() => [
        {
            icon: 'flag',
            year: '2020',
            title: 'Kytriq is Born',
            description: 'Founded with a vision to merge custom software and cutting-edge hardware, starting from a small garage with big ambitions.'
        },
        {
            icon: 'rocket-launch',
            year: '2021',
            title: 'First Product Launch',
            description: 'Launched our flagship all-in-one business management software, Synergy, to critical acclaim from early adopters.'
        },
        {
            icon: 'cpu-chip',
            year: '2023',
            title: 'Hardware Expansion',
            description: 'Expanded into electronics design, launching the NebulaBook Pro and our line of smart accessories.'
        },
        {
            icon: 'star',
            year: '2024',
            title: 'Global Milestone',
            description: 'Celebrated serving over 10,000 customers worldwide and doubling our innovative team size.'
        },
    ], []);

    const team = useMemo(() => [
        { name: 'Jane Doe', title: 'Founder & CEO', imageUrl: 'https://i.pravatar.cc/300?u=jane_doe_ceo' },
        { name: 'John Smith', title: 'Chief Technology Officer', imageUrl: 'https://i.pravatar.cc/300?u=john_smith_cto' },
        { name: 'Emily White', title: 'Head of Design', imageUrl: 'https://i.pravatar.cc/300?u=emily_white_design' },
    ], []);

    const stats = useMemo(() => [
        { icon: 'users', value: '10K+', label: 'Happy Customers' },
        { icon: 'briefcase', value: '500+', label: 'Projects Completed' },
        { icon: 'star', value: '98%', label: 'Satisfaction Rate' },
        { icon: 'globe', value: '25+', label: 'Countries Served' },
    ], []);

    const scrollToSection = useCallback((sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, []);

    return (
        <div className={`about-page relative bg-gradient-to-br from-brand-gray-50 via-white to-techflex-blue-50/30 min-h-screen transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <section id="hero" className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto text-center max-w-6xl">
                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-8">
                        We Are <span className="bg-gradient-to-r from-techflex-blue-600 to-techflex-orange-600 bg-clip-text text-transparent">Kytriq</span>
                    </h1>
                    <p className="max-w-4xl mx-auto text-xl sm:text-2xl text-brand-gray-600 leading-relaxed mb-12">
                        Pioneering the intersection of software and hardware to build a smarter, more connected future.
                    </p>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
                        {stats.map((stat, index) => (
                            <StatsCounter key={stat.label} {...stat} index={index} />
                        ))}
                    </div>
                    <button
                        onClick={() => scrollToSection('mission')}
                        className="group bg-gradient-to-r from-techflex-blue-600 to-techflex-orange-600 text-white font-bold py-5 px-10 rounded-full transition-all duration-500 hover:scale-105 hover:shadow-2xl"
                    >
                        <span className="flex items-center gap-3">
                            Explore Our Story
                            <Icon name="arrow-down" className="w-5 h-5 transition-transform duration-300 group-hover:translate-y-1" />
                        </span>
                    </button>
                </div>
            </section>

            <section id="mission" className="py-24 px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-lg border-y border-white/40">
                <div className="container mx-auto max-w-5xl text-center">
                    <h2 className="text-4xl sm:text-5xl font-bold text-brand-gray-900 mb-8">
                        Our <span className="bg-gradient-to-r from-techflex-blue-600 to-techflex-orange-500 bg-clip-text text-transparent">Mission</span>
                    </h2>
                    <p className="text-2xl text-brand-gray-600 leading-relaxed font-light">
                        To bridge the gap between innovative technology and meaningful human experiences, empowering businesses and individuals to achieve more.
                    </p>
                </div>
            </section>

            <section id="values" className="py-24 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto max-w-7xl">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl sm:text-5xl font-bold text-brand-gray-900 mb-6">
                            Our <span className="bg-gradient-to-r from-techflex-orange-500 to-techflex-blue-600 bg-clip-text text-transparent">Values</span>
                        </h2>
                        <p className="text-xl text-brand-gray-600 max-w-3xl mx-auto">
                            The fundamental principles that guide everything we do.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <ValueCard key={value.title} iconName={value.icon} title={value.title} index={index}>
                                {value.description}
                            </ValueCard>
                        ))}
                    </div>
                </div>
            </section>

            <section id="timeline" className="py-24 px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-lg">
                <div className="container mx-auto max-w-5xl">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl sm:text-5xl font-bold text-brand-gray-900 mb-6">
                            Our <span className="bg-gradient-to-r from-brand-gray-700 to-techflex-blue-600 bg-clip-text text-transparent">Journey</span>
                        </h2>
                        <p className="text-xl text-brand-gray-600 max-w-3xl mx-auto">
                            Key milestones that shaped our story.
                        </p>
                    </div>
                    <div className="space-y-12">
                        {timeline.map((item, index) => (
                            <TimelineItem
                                key={item.year}
                                {...item}
                                index={index}
                                isLast={index === timeline.length - 1}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <section id="team" className="py-24 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl sm:text-5xl font-bold text-brand-gray-900 mb-6">
                            Meet Our <span className="bg-gradient-to-r from-techflex-blue-600 to-techflex-orange-500 bg-clip-text text-transparent">Team</span>
                        </h2>
                        <p className="text-xl text-brand-gray-600 max-w-3xl mx-auto">
                            The passionate innovators behind Kytriq's success.
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
                        {team.map((member, index) => (
                            <TeamMemberCard
                                key={member.name}
                                {...member}
                                index={index}
                            />
                        ))}
                    </div>
                </div>
            </section>

            <section id="cta" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-techflex-blue-600 to-techflex-orange-600">
                <div className="container mx-auto max-w-5xl text-center text-white">
                    <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                        Ready to Get Started?
                    </h2>
                    <p className="text-xl mb-12 max-w-3xl mx-auto">
                        Join thousands of satisfied customers. Let's build something amazing together.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <button
                            onClick={() => onNavigate('contact')}
                            className="bg-white text-techflex-blue-600 font-bold py-5 px-10 rounded-full transition-all duration-500 hover:scale-105 hover:shadow-2xl"
                        >
                            Contact Us Today
                        </button>
                        <button
                            onClick={() => onNavigate('products')}
                            className="bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 font-bold py-5 px-10 rounded-full transition-all duration-500 hover:bg-white/30"
                        >
                            Explore Products
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default React.memo(AboutPage);
