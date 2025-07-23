import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Icon from './Icon';

interface ExploreCardProps {
    imageUrl: string;
    title: string;
    description: string;
    linkText: string;
    linkPage: string;
    onNavigate: (page: string) => void;
    index: number;
    category?: string;
    readTime?: string;
    featured?: boolean;
}

const ExploreCard: React.FC<ExploreCardProps> = ({
                                                     imageUrl,
                                                     title,
                                                     description,
                                                     linkText,
                                                     linkPage,
                                                     onNavigate,
                                                     index,
                                                     category,
                                                     readTime,
                                                     featured = false,
                                                 }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
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

    // Memoize static arrays to prevent recreation on each render
    const gradients = useMemo(() => [
        'from-techflex-blue-500/10 via-techflex-blue-600/5 to-transparent',
        'from-techflex-orange-500/10 via-techflex-orange-600/5 to-transparent',
    ], []);

    const accentColors = useMemo(() => [
        'techflex-blue-500',
        'techflex-orange-500',
    ], []);

    // Memoize calculated values based on index
    const currentGradient = useMemo(() => 
        gradients[index % gradients.length], 
    [gradients, index]);

    const currentAccent = useMemo(() => 
        accentColors[index % accentColors.length], 
    [accentColors, index]);

    // Memoize event handlers to prevent unnecessary re-creation
    const handleMouseEnter = useCallback(() => {
        setIsHovered(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
    }, []);

    const handleClick = useCallback(() => {
        onNavigate(linkPage);
    }, [onNavigate, linkPage]);

    // Memoize button event handlers
    const handleBookmarkClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        // Add to reading list functionality
    }, []);

    const handleShareClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        // Share functionality
    }, []);

    const handleCTAClick = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        onNavigate(linkPage);
    }, [onNavigate, linkPage]);

    return (
        <article
            ref={cardRef}
            className={`group relative bg-white/95 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl border border-white/40 transition-all duration-700 cursor-pointer transform-gpu ${
                isVisible
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-8 scale-95'
            } ${featured ? 'ring-2 ring-techflex-orange-200' : ''}`}
            style={{
                transitionDelay: `${index * 200}ms`,
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
        >
            {/* Animated background gradient */}
            <div
                className={`absolute inset-0 bg-gradient-to-br ${currentGradient} opacity-0 group-hover:opacity-100 transition-all duration-500`}
            />

            {/* Featured badge */}
            {featured && (
                <div className="absolute top-6 left-6 z-20">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-techflex-orange-500 text-white text-xs font-semibold rounded-full shadow-lg">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            Featured
          </span>
                </div>
            )}

            {/* Category and read time badges */}
            <div className="absolute top-6 right-6 z-20 flex flex-col gap-2">
                {category && (
                    <span className={`inline-flex items-center px-2.5 py-1 bg-${currentAccent}/10 text-${currentAccent} text-xs font-medium rounded-full backdrop-blur-sm border border-${currentAccent}/20`}>
            {category}
          </span>
                )}
                {readTime && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/90 text-brand-gray-600 text-xs font-medium rounded-full backdrop-blur-sm">
            <Icon name="clock" className="w-3 h-3" />
                        {readTime}
          </span>
                )}
            </div>

            <div className="flex flex-col md:flex-row h-full">
                {/* Enhanced image section */}
                <div className="md:w-1/2 w-full relative overflow-hidden">
                    <div className="aspect-[4/3] md:aspect-auto md:h-full bg-gradient-to-br from-brand-gray-100 to-brand-gray-200">
                        {!imageLoaded && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-8 h-8 border-2 border-techflex-blue-500 border-t-transparent rounded-full animate-spin" />
                            </div>
                        )}
                        <img
                            src={imageUrl}
                            alt={title}
                            onLoad={() => setImageLoaded(true)}
                            className={`w-full h-full object-cover group-hover:scale-110 transition-all duration-700 ${
                                imageLoaded ? 'opacity-100' : 'opacity-0'
                            }`}
                        />

                        {/* Overlay with interactive elements */}
                        <div className={`absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-between p-6`}>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleBookmarkClick}
                                    className="p-2.5 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors duration-300"
                                    aria-label="Save for later"
                                >
                                    <Icon name="bookmark" className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={handleShareClick}
                                    className="p-2.5 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors duration-300"
                                    aria-label="Share"
                                >
                                    <Icon name="share" className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-full">
                                <Icon name="arrow-right" className={`w-4 h-4 text-white transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced content section */}
                <div className="md:w-1/2 p-8 flex flex-col justify-center relative z-10">
                    <div className="space-y-4">
                        <h3 className={`text-2xl lg:text-3xl font-bold text-brand-gray-800 group-hover:text-${currentAccent} transition-colors duration-300 leading-tight`}>
                            {title}
                        </h3>

                        <p className="text-brand-gray-600 leading-relaxed text-base line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
                            {description}
                        </p>

                        {/* Interactive CTA with enhanced styling */}
                        <div className="pt-4">
                            <button
                                onClick={handleCTAClick}
                                className={`group/btn inline-flex items-center gap-2 px-6 py-3 bg-${currentAccent} hover:bg-${currentAccent}/90 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95`}
                            >
                                <span>{linkText}</span>
                                <Icon
                                    name="arrow-right"
                                    className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1"
                                />
                            </button>
                        </div>
                    </div>

                    {/* Progress indicator */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand-gray-100 rounded-full overflow-hidden">
                        <div
                            className={`h-full bg-gradient-to-r from-${currentAccent} to-${currentAccent}/70 transition-all duration-700 rounded-full ${
                                isHovered ? 'w-full' : 'w-0'
                            }`}
                        />
                    </div>
                </div>
            </div>
        </article>
    );
};

interface ExploreSectionProps {
    onNavigate: (page: string) => void;
}

const ExploreSection: React.FC<ExploreSectionProps> = ({ onNavigate }) => {
    const [sectionRef, setSectionRef] = useState<HTMLElement | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');

    // Enhanced intersection observer for section
    useEffect(() => {
        if (!sectionRef) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(sectionRef);
        return () => observer.disconnect();
    }, [sectionRef]);

    // Memoize exploreItems to prevent recreation on each render
    const exploreItems = useMemo(() => [
        {
            imageUrl: 'images/blog-post.png',
            title: 'Our Latest Tech Insights',
            description:
                'Dive deep into our comprehensive blog featuring cutting-edge articles on the future of software development, emerging hardware trends, and in-depth industry analysis from our expert team.',
            linkText: 'Read the Blog',
            linkPage: 'blog',
            category: 'Insights',
            readTime: '5 min read',
            featured: true,
        },
        {
            imageUrl: 'images/projects.png',
            title: 'Featured Client Projects',
            description:
                "Explore our portfolio of successful client partnerships and discover how we've helped businesses like yours achieve digital transformation with our innovative custom solutions and premium products.",
            linkText: 'View Projects',
            linkPage: 'home',
            category: 'Portfolio',
            readTime: '8 min read',
            featured: false,
        },
    ], []);

    // Memoize filters to prevent recreation on each render
    const filters = useMemo(() => [
        { id: 'all', label: 'All Content', count: exploreItems.length },
        { id: 'insights', label: 'Insights', count: 1 },
        { id: 'portfolio', label: 'Portfolio', count: 1 },
    ], [exploreItems.length]);

    // Memoize filteredItems calculation to prevent recalculation on each render
    const filteredItems = useMemo(() => 
        activeFilter === 'all'
            ? exploreItems
            : exploreItems.filter(item => item.category?.toLowerCase() === activeFilter),
    [exploreItems, activeFilter]);

    // Memoize event handlers to prevent unnecessary re-creation
    const handleFilterClick = useCallback((filterId: string) => {
        setActiveFilter(filterId);
    }, []);

    const handleSubscribeClick = useCallback(() => {
        onNavigate('blog');
    }, [onNavigate]);

    return (
        <section
            ref={setSectionRef}
            className="relative bg-gradient-to-br from-brand-gray-50 via-white to-techflex-blue-50/30 py-20 px-4 sm:px-6 lg:px-8 mb-24 overflow-hidden"
        >
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-techflex-blue-200/20 to-techflex-orange-200/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-techflex-orange-200/15 to-techflex-blue-200/15 rounded-full blur-3xl" />
            </div>

            <div className="relative max-w-7xl mx-auto">
                {/* Enhanced section header */}
                <div className={`text-center mb-16 transition-all duration-700 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-techflex-blue-100 text-techflex-blue-700 rounded-full text-sm font-semibold mb-4">
                        <Icon name="sparkles" className="w-4 h-4" />
                        Discover More
                    </div>

                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-gray-900 mb-6 bg-gradient-to-r from-brand-gray-900 via-techflex-blue-800 to-brand-gray-900 bg-clip-text text-transparent">
                        Explore More
                    </h2>

                    <p className="text-xl text-brand-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Dive deeper into our world of innovation, insights, and success stories
                    </p>
                </div>

                {/* Smart filter tabs */}
                <div className={`flex flex-wrap justify-center gap-3 mb-12 transition-all duration-700 delay-200 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}>
                    {filters.map((filter) => (
                        <button
                            key={filter.id}
                            onClick={() => handleFilterClick(filter.id)}
                            className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 ${
                                activeFilter === filter.id
                                    ? 'bg-techflex-blue-500 text-white shadow-lg scale-105'
                                    : 'bg-white/70 text-brand-gray-700 hover:bg-white hover:shadow-md hover:scale-102'
                            }`}
                        >
                            <span>{filter.label}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                                activeFilter === filter.id
                                    ? 'bg-white/20 text-white'
                                    : 'bg-brand-gray-100 text-brand-gray-600'
                            }`}>
                {filter.count}
              </span>
                        </button>
                    ))}
                </div>

                {/* Enhanced cards grid */}
                <div className="grid gap-12 grid-cols-1 lg:grid-cols-2 max-w-6xl mx-auto">
                    {filteredItems.map((item, index) => (
                        <ExploreCard
                            key={item.title}
                            {...item}
                            onNavigate={onNavigate}
                            index={index}
                        />
                    ))}
                </div>

                {/* Call-to-action footer */}
                <div className={`text-center mt-16 transition-all duration-700 delay-500 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}>
                    <p className="text-brand-gray-600 mb-6">
                        Want to stay updated with our latest content?
                    </p>
                    <button
                        onClick={handleSubscribeClick}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-techflex-orange-500 to-techflex-orange-600 hover:from-techflex-orange-600 hover:to-techflex-orange-700 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        <Icon name="rss" className="w-5 h-5" />
                        <span>Subscribe to Updates</span>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default ExploreSection;
