import React, { useState, useEffect, useRef } from 'react';

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
  const heroRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Enhanced auto-play with progress indicator
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % heroSlides.length);
            return 0;
          }
          return prev + 1;
        });
      }, 80); // 8 seconds total (100 * 80ms)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentIndex]);

  // Entrance animation
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Mouse parallax effect - only on desktop
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current && window.innerWidth >= 1024) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left - rect.width / 2) / rect.width,
          y: (e.clientY - rect.top - rect.height / 2) / rect.height,
        });
      }
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove);
      return () => heroElement.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + heroSlides.length) % heroSlides.length);
    setProgress(0);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % heroSlides.length);
    setProgress(0);
  };

  const handleSlideSelect = (index: number) => {
    setCurrentIndex(index);
    setProgress(0);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      setProgress(0);
    }
  };

  const currentSlide = heroSlides[currentIndex];

  return (
      <div
          ref={heroRef}
          className="relative bg-gradient-to-br from-brand-gray-50 via-brand-gray-100 to-brand-gray-200 overflow-hidden"
      >
        {/* Background Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-techflex-blue/5 via-transparent to-purple-500/5" />

        {/* Animated Background Elements - Hidden on mobile for performance */}
        <div className="absolute inset-0 overflow-hidden hidden lg:block">
          <div
              className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-techflex-blue/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"
              style={{
                transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
                transition: 'transform 0.3s ease-out',
              }}
          />
          <div
              className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"
              style={{
                transform: `translate(${mousePosition.x * -15}px, ${mousePosition.y * -15}px)`,
                transition: 'transform 0.3s ease-out',
              }}
          />
        </div>

        {/* Main Content */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 items-center min-h-[80vh] sm:min-h-[85vh] lg:min-h-[90vh]">

          {/* Content Section */}
          <div className={`px-4 py-8 sm:px-6 sm:py-12 lg:px-16 flex flex-col justify-center order-2 lg:order-1 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>

            {/* Badge */}
            <div className="inline-flex items-center mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-techflex-blue to-purple-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg animate-pulse">
              ✨ {currentSlide.badge}
            </span>
            </div>

            {/* Heading with responsive sizing */}
            <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight mb-4 sm:mb-6 bg-gradient-to-r from-brand-gray-900 via-techflex-blue to-purple-600 bg-clip-text text-transparent transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              {currentSlide.title}
            </h1>

            {/* Subtitle with responsive sizing */}
            <p className={`text-sm sm:text-base lg:text-lg xl:text-xl text-brand-gray-600 mb-6 sm:mb-8 leading-relaxed transition-all duration-700 delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              {currentSlide.subtitle}
            </p>

            {/* Stats Badge - responsive */}
            <div className={`inline-flex items-center gap-2 mb-6 sm:mb-8 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 sm:px-6 sm:py-3 border border-white/20 shadow-lg transition-all duration-700 delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-brand-gray-700 font-medium text-xs sm:text-sm">{currentSlide.stats.label}:</span>
                <span className="text-techflex-blue font-bold text-sm sm:text-lg">{currentSlide.stats.value}</span>
              </div>
            </div>

            {/* Enhanced CTA Buttons - responsive */}
            <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 transition-all duration-700 delay-400 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <button
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(currentSlide.cta1Link);
                  }}
                  className="group relative bg-gradient-to-r from-techflex-blue to-purple-600 hover:from-techflex-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-full text-sm sm:text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden text-center"
              >
                <span className="relative z-10">{currentSlide.cta1}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </button>

              <button
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(currentSlide.cta2Link);
                  }}
                  className="group bg-white/80 backdrop-blur-sm hover:bg-white text-brand-gray-800 font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-full text-sm sm:text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl border border-white/30 text-center"
              >
              <span className="group-hover:translate-x-1 transition-transform duration-300 inline-block">
                {currentSlide.cta2} →
              </span>
              </button>
            </div>
          </div>

          {/* Enhanced Image Section */}
          <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[90vh] order-1 lg:order-2">
            <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-l from-transparent via-transparent to-brand-gray-100/30 lg:to-brand-gray-100/50 z-10" />

            {/* Main Image with conditional parallax */}
            <img
                src={currentSlide.image}
                alt={currentSlide.title}
                className="w-full h-full object-cover transition-all duration-1000 hover:scale-105"
                style={window.innerWidth >= 1024 ? {
                  transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px) scale(1.02)`,
                  transition: 'transform 0.3s ease-out',
                } : {}}
            />

            {/* Floating Elements - Hidden on small screens */}
            {/*<div className="absolute top-4 right-4 sm:top-8 sm:right-8 bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2 sm:p-4 shadow-xl animate-bounce hidden sm:block">*/}
            {/*  <div className="text-lg sm:text-2xl">🚀</div>*/}
            {/*</div>*/}

            {/*<div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl p-2 sm:p-4 shadow-xl animate-pulse hidden sm:block">*/}
            {/*  <div className="text-lg sm:text-2xl">⭐</div>*/}
            {/*</div>*/}
          </div>
        </div>

        {/* Side Navigation Controls - Hidden on mobile, positioned better on tablet/desktop */}
        <button
            onClick={goToPrevious}
            className="absolute top-1/2 left-2 sm:left-4 lg:left-6 transform -translate-y-1/2 z-20 bg-black/40 backdrop-blur-md text-white p-2 sm:p-3 lg:p-4 rounded-full hover:bg-black/60 transition-all duration-300 hover:scale-110 shadow-xl hidden sm:block"
            aria-label="Previous slide"
        >
          <svg className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
            onClick={goToNext}
            className="absolute top-1/2 right-2 sm:right-4 lg:right-6 transform -translate-y-1/2 z-20 bg-black/40 backdrop-blur-md text-white p-2 sm:p-3 lg:p-4 rounded-full hover:bg-black/60 transition-all duration-300 hover:scale-110 shadow-xl hidden sm:block"
            aria-label="Next slide"
        >
          <svg className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Consolidated Carousel Controls with Enhanced Contrast */}
        <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 sm:gap-4 bg-black/80 backdrop-blur-md rounded-full p-3 sm:p-4 shadow-2xl border border-white/10">

          {/* Mobile Navigation Arrows */}
          <button
              onClick={goToPrevious}
              className="text-white/80 hover:text-white transition-colors duration-300 p-1 hover:bg-white/10 rounded-full sm:hidden"
              aria-label="Previous slide"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Play/Pause Button with better contrast */}
          <button
              onClick={togglePlayPause}
              className="text-white hover:text-techflex-blue transition-colors duration-300 p-1 hover:bg-white/10 rounded-full"
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

          {/* Progress Indicators with enhanced visibility */}
          <div className="flex items-center gap-2">
            {heroSlides.map((_, index) => (
                <button
                    key={index}
                    onClick={() => handleSlideSelect(index)}
                    className="relative group"
                    aria-label={`Go to slide ${index + 1}`}
                >
                  <div className={`w-8 sm:w-12 h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex ? 'bg-white' : 'bg-white/40 hover:bg-white/60'
                  }`}>
                    {index === currentIndex && isPlaying && (
                        <div
                            className="h-full bg-gradient-to-r from-techflex-blue to-purple-600 rounded-full transition-all duration-100"
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
              className="text-white/80 hover:text-white transition-colors duration-300 p-1 hover:bg-white/10 rounded-full sm:hidden"
              aria-label="Next slide"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Scroll Indicator - responsive sizing */}
        <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 animate-bounce hidden lg:block">
          <div className="w-5 sm:w-6 h-8 sm:h-10 border-2 border-white/60 rounded-full flex justify-center">
            <div className="w-1 h-2 sm:h-3 bg-white/80 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </div>
  );
};

export default Hero;