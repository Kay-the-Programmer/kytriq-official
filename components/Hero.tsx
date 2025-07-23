import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

interface HeroProps {
  onNavigate: (page: string) => void;
}

const heroSlides = [
  {
    image: '/images/gadgets.png',
    title: 'Get started for free',
    subtitle: 'Start using our software products for free.',
    cta1: 'Get Started',
    cta1Link: 'software',
    cta2: 'Learn More',
    cta2Link: 'about',
    stats: { label: 'Active Users', value: '10K+' },
    badge: 'Free Trial',
  },
  {
    image: '/images/projects.png',
    title: 'Boost your productivity',
    subtitle: 'Discover high-tech electronics for business',
    cta1: 'Go Shopping',
    cta1Link: 'products',
    cta2: 'View Catalog',
    cta2Link: 'products',
    stats: { label: 'Products', value: '500+' },
    badge: 'New Arrivals',
  },
  {
    image: '/images/hero-pos.jpg',
    title: 'Empower your sales',
    subtitle: 'Our point-of-sale solutions cater for businesses of all sizes.',
    cta1: 'Learn more',
    cta1Link: 'software-development',
    cta2: 'Contact Sales',
    cta2Link: 'contact',
    stats: { label: 'Businesses', value: '1000+' },
    badge: 'Enterprise',
  },
];

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isDesktop, setIsDesktop] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });

  // Memoize current slide to prevent unnecessary re-renders
  const currentSlide = useMemo(() => heroSlides[currentIndex], [currentIndex]);

  // Check if we're on desktop for performance optimizations
  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);
    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  // Optimized mouse move handler with throttling
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDesktop || !heroRef.current) return;

    const rect = heroRef.current.getBoundingClientRect();
    const newPosition = {
      x: (e.clientX - rect.left - rect.width / 2) / rect.width,
      y: (e.clientY - rect.top - rect.height / 2) / rect.height,
    };

    mousePositionRef.current = newPosition;

    // Throttle state updates
    requestAnimationFrame(() => {
      setMousePosition(mousePositionRef.current);
    });
  }, [isDesktop]);

  // Navigation functions with useCallback for performance
  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + heroSlides.length) % heroSlides.length);
    setProgress(0);
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % heroSlides.length);
    setProgress(0);
  }, []);

  const handleSlideSelect = useCallback((index: number) => {
    setCurrentIndex(index);
    setProgress(0);
  }, []);

  const togglePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
    setProgress(0);
  }, []);

  // Enhanced keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        goToPrevious();
        break;
      case 'ArrowRight':
        e.preventDefault();
        goToNext();
        break;
      case ' ':
        e.preventDefault();
        togglePlayPause();
        break;
      case 'Home':
        e.preventDefault();
        handleSlideSelect(0);
        break;
      case 'End':
        e.preventDefault();
        handleSlideSelect(heroSlides.length - 1);
        break;
    }
  }, [goToPrevious, goToNext, togglePlayPause, handleSlideSelect]);

  // Enhanced auto-play with better cleanup
  useEffect(() => {
    if (!isPlaying) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % heroSlides.length);
          return 0;
        }
        return prev + 1;
      });
    }, 80); // 8 seconds total (100 * 80ms)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, currentIndex]);

  // Entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Mouse parallax effect - optimized for desktop only
  useEffect(() => {
    if (!isDesktop) return;

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove);
      heroElement.addEventListener('keydown', handleKeyDown);

      return () => {
        heroElement.removeEventListener('mousemove', handleMouseMove);
        heroElement.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [handleMouseMove, handleKeyDown, isDesktop]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Memoized parallax styles for performance
  const parallaxStyles = useMemo(() => {
    if (!isDesktop) return {};

    return {
      backgroundElement1: {
        transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
        transition: 'transform 0.3s ease-out',
      },
      backgroundElement2: {
        transform: `translate(${mousePosition.x * -15}px, ${mousePosition.y * -15}px)`,
        transition: 'transform 0.3s ease-out',
      },
      mainImage: {
        transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px) scale(1.02)`,
        transition: 'transform 0.3s ease-out',
      }
    };
  }, [mousePosition, isDesktop]);

  return (
      <div
          ref={heroRef}
          className="relative bg-gradient-to-br from-brand-gray-50 via-brand-gray-100 to-brand-gray-200 overflow-hidden focus:outline-none"
          tabIndex={0}
          role="region"
          aria-label="Hero carousel"
          aria-live="polite"
      >
        {/* Background Gradient Overlay - Using theme colors */}
        <div className="absolute inset-0 bg-gradient-to-r from-techflex-blue-50/50 via-transparent to-techflex-orange-50/30" />

        {/* Animated Background Elements - Using theme colors */}
        {isDesktop && (
            <div className="absolute inset-0 overflow-hidden">
              <div
                  className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-techflex-blue-200/20 to-techflex-orange-200/15 rounded-full blur-3xl animate-pulse"
                  style={parallaxStyles.backgroundElement1}
              />
              <div
                  className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-techflex-orange-200/15 to-techflex-blue-200/20 rounded-full blur-3xl animate-pulse"
                  style={parallaxStyles.backgroundElement2}
              />
            </div>
        )}

        {/* Main Content */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 items-center min-h-[80vh] sm:min-h-[85vh] lg:min-h-[90vh]">

          {/* Content Section */}
          <div className={`px-4 py-12 sm:px-6 sm:py-12 lg:px-16 flex flex-col justify-center order-2 lg:order-1 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>

            {/* Badge - Using theme colors */}
            <div className="inline-flex items-center mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-techflex-blue-600 to-techflex-orange-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg animate-pulse">
              ✨ {currentSlide.badge}
            </span>
            </div>

            {/* Heading with theme colors */}
            <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight mb-4 sm:mb-6 bg-gradient-to-r from-brand-gray-900 via-techflex-blue-700 to-techflex-orange-600 bg-clip-text text-transparent transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              {currentSlide.title}
            </h1>

            {/* Subtitle with theme colors */}
            <p className={`text-sm sm:text-base lg:text-lg xl:text-xl text-brand-gray-600 mb-6 sm:mb-8 leading-relaxed transition-all duration-700 delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              {currentSlide.subtitle}
            </p>

            {/* Stats Badge - Using theme colors */}
            <div className={`inline-flex items-center gap-2 mb-6 sm:mb-8 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 sm:px-6 sm:py-3 border border-techflex-blue-100/50 shadow-lg transition-all duration-700 delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-2 h-2 bg-techflex-orange-500 rounded-full animate-pulse" />
                <span className="text-brand-gray-700 font-medium text-xs sm:text-sm">{currentSlide.stats.label}:</span>
                <span className="text-techflex-blue-700 font-bold text-sm sm:text-lg">{currentSlide.stats.value}</span>
              </div>
            </div>

            {/* Enhanced CTA Buttons - Using theme colors */}
            <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 transition-all duration-700 delay-400 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <button
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(currentSlide.cta1Link);
                  }}
                  className="group relative bg-gradient-to-r from-techflex-blue-600 to-techflex-blue-700 hover:from-techflex-blue-700 hover:to-techflex-blue-800 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-full text-sm sm:text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden text-center"
                  aria-label={`${currentSlide.cta1} - ${currentSlide.title}`}
              >
                <span className="relative z-10">{currentSlide.cta1}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </button>

              <button
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(currentSlide.cta2Link);
                  }}
                  className="group bg-white/90 backdrop-blur-sm hover:bg-white text-brand-gray-800 hover:text-techflex-blue-700 font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-full text-sm sm:text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl border border-techflex-blue-100/60 text-center"
                  aria-label={`${currentSlide.cta2} - ${currentSlide.title}`}
              >
              <span className="group-hover:translate-x-1 transition-transform duration-300 inline-block">
                {currentSlide.cta2} →
              </span>
              </button>
            </div>
          </div>

          {/* Enhanced Image Section */}
          <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[90vh] order-1 lg:order-2">
            <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-l from-transparent via-transparent to-brand-gray-100/40 lg:to-brand-gray-100/60 z-10" />

            {/* Main Image with conditional parallax */}
            <img
                src={currentSlide.image}
                alt={currentSlide.title}
                className="w-full h-full object-cover transition-all duration-1000 hover:scale-105"
                style={isDesktop ? parallaxStyles.mainImage : {}}
                loading="lazy"
            />
          </div>
        </div>

        {/* Consolidated Carousel Controls with Theme Colors */}
        <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 sm:gap-4 bg-brand-gray-900/90 backdrop-blur-md rounded-full p-3 sm:p-4 shadow-2xl border border-techflex-blue-200/20">

          {/* Mobile Navigation Arrows */}
          <button
              onClick={goToPrevious}
              className="text-brand-gray-300 hover:text-white transition-colors duration-300 p-1 hover:bg-techflex-blue-600/20 rounded-full sm:hidden"
              aria-label="Previous slide"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Play/Pause Button with theme colors */}
          <button
              onClick={togglePlayPause}
              className="text-white hover:text-techflex-orange-400 transition-colors duration-300 p-1 hover:bg-techflex-blue-600/20 rounded-full"
              aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          >
            {isPlaying ? (
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
            ) : (
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="m7 4 10 6L7 16V4z"/>
                </svg>
            )}
          </button>

          {/* Progress Indicators with theme colors */}
          <div className="flex items-center gap-2">
            {heroSlides.map((_, index) => (
                <button
                    key={index}
                    onClick={() => handleSlideSelect(index)}
                    className="relative group"
                    aria-label={`Go to slide ${index + 1}`}
                >
                  <div className={`w-8 sm:w-12 h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex ? 'bg-white' : 'bg-brand-gray-400/50 hover:bg-brand-gray-300/70'
                  }`}>
                    {index === currentIndex && isPlaying && (
                        <div
                            className="h-full bg-gradient-to-r from-techflex-blue-500 to-techflex-orange-500 rounded-full transition-all duration-100"
                            style={{ width: `${progress}%` }}
                        />
                    )}
                  </div>
                </button>
            ))}
          </div>

          {/* Mobile Navigation Arrows */}
          <button
              onClick={goToNext}
              className="text-brand-gray-300 hover:text-white transition-colors duration-300 p-1 hover:bg-techflex-blue-600/20 rounded-full sm:hidden"
              aria-label="Next slide"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

      </div>
  );
};

export default Hero;