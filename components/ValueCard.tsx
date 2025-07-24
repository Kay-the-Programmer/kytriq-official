import React, { useState, useEffect, useCallback, memo } from 'react';
import Icon from './Icon';
import { useIntersectionObserver, useTiltEffect, useTouch } from '../hooks/animationHooks';

interface ValueCardProps {
    iconName: string;
    title: string;
    children: React.ReactNode;
    index: number;
}

const ValueCard: React.FC<ValueCardProps> = ({ iconName, title, children, index }) => {
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

    // Auto-collapse expanded cards on touch devices after a delay
    useEffect(() => {
        if (isExpanded && isTouch) {
            const timer = setTimeout(() => setIsExpanded(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [isExpanded, isTouch]);

    // Memoized event handlers
    const handleClick = useCallback(() => {
        setIsExpanded(!isExpanded);
    }, [isExpanded]);

    const handleMouseEnter = useCallback(() => {
        setIsHovered(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
    }, []);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsExpanded(!isExpanded);
        }
    }, [isExpanded]);

    // Compute card style with hardware acceleration
    const cardStyle = {
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-${progress * 6}px) translateZ(${isHovered ? 20 : 0}px)`,
    };

    return (
        <div
            ref={(node) => {
                if (node) {
                    (cardRef as React.MutableRefObject<HTMLDivElement>).current = node;
                    (tiltRef as React.MutableRefObject<HTMLDivElement>).current = node;
                }
            }}
            className={`value-card group relative bg-white/95 backdrop-blur-lg rounded-3xl shadow-xl hover:shadow-2xl border border-white/40 overflow-hidden cursor-pointer transform-gpu ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            } ${isHovered ? currentTheme.shadow : ''}`}
            style={{
                transitionDelay: `${index * 150}ms`,
                ...cardStyle,
            }}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            role="button"
            tabIndex={0}
            onKeyDown={handleKeyDown}
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
                    <div className={`value-card-icon relative w-16 h-16 rounded-2xl bg-gradient-to-br ${currentTheme.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 ${isHovered ? currentTheme.glow : ''}`}>
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
                <div className={`value-card-content overflow-hidden ${
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
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(ValueCard);