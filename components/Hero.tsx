import React, { useState, useEffect } from 'react';

interface HeroProps {
  onNavigate: (page: string) => void;
}

const heroSlides = [
  {
    image: '/images/hero-start.jpg',
    title: 'Get started for free',
    subtitle: 'Start using our software products for free.',
    cta1: 'Get Started',
    cta1Link: 'software',
    cta2Link: 'products',
  },
  {
    image: '/images/hero-gadgets.jpg',
    title: 'Boost your productivity',
    subtitle: 'Discover high-tech electronics for business',
    cta1: 'Go Shopping',
    cta1Link: 'products',
    cta2Link: 'about',
  },
  {
    image: '/images/hero-pos.jpg',
    title: 'Empower your sales',
    subtitle: 'Our point-of-sale solutions cater for businesses of all sizes.',
    cta1: 'Learn more',
    cta1Link: 'software-development',
  }
];

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const handleScroll = () => setOffsetY(window.scrollY);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroSlides.length);
    }, 10000); // Change slides every 10 seconds
    return () => clearInterval(timer);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % heroSlides.length);
  };

  const currentSlide = heroSlides[currentIndex];

  return (
      <div className="relative bg-techflex-blue h-[90vh] min-h-[600px] flex items-center justify-center text-white overflow-hidden">
        {heroSlides.map((slide, index) => (
            <div
                key={index}
                className={`absolute inset-0 bg-cover bg-center z-0 transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                style={{
                  backgroundImage: `url('${slide.image}')`,
                  transform: `translateY(${offsetY * 0.5}px)`
                }}
            >
              <div className="absolute inset-0 bg-black opacity-20"></div>
            </div>
        ))}

        {/* CONTENT */}
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 z-10 h-full flex flex-col justify-end sm:justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full">
            <div className="bg-black/20 backdrop-blur-md border border-white/20 p-6 sm:p-8 md:p-12 rounded-3xl w-full max-w-full sm:max-w-none sm:relative sm:top-0 sm:translate-y-0 sm:mb-0 mb-6 sm:rounded-3xl sm:w-auto sm:order-none order-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                {currentSlide.title}
              </h1>
              <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-brand-gray-200 max-w-xl">
                {currentSlide.subtitle}
              </p>
              <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row items-start gap-4">
                <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(currentSlide.cta1Link);
                    }}
                    className="w-full sm:w-auto text-center bg-techflex-orange hover:bg-techflex-orange-600 text-white font-bold py-3 px-8 rounded-[25px] text-lg transition-all duration-300 transform hover:scale-105"
                >
                  {currentSlide.cta1}
                </a>
              </div>
            </div>
            <div className="hidden md:block">{/* Empty right side for layout */}</div>
          </div>
        </div>

        {/* Carousel Controls */}
        <button
            onClick={goToPrevious}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
            onClick={goToNext}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
          {heroSlides.map((_, index) => (
              <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-techflex-orange' : 'bg-white/50'} hover:bg-white transition-colors`}
              ></button>
          ))}
        </div>
      </div>
  );
};

export default Hero;
