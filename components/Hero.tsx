import React, { useState, useEffect } from 'react';

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
    cta2Link: 'products',
  },
  {
    image: '/images/projects.png',
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
  },
];

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroSlides.length);
    }, 10000);
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
      <div className="relative bg-brand-gray-50 text-white overflow-hidden">
        {/* Grid layout that stacks on small screens and splits on md+ */}
        <div className="grid grid-cols-1 md:grid-cols-2 items-center min-h-[90vh]">
          {/* IMAGE section */}
          <div className="w-full h-[300px] md:h-[90vh] relative">
            <img
                src={currentSlide.image}
                alt={currentSlide.title}
                className="w-full h-full object-cover transition-opacity duration-1000"
            />
            <div className="absolute inset-0" />
          </div>

          {/* CONTENT card */}
          <div className="z-10 relative px-6 py-10 sm:px-12 lg:px-16 flex flex-col justify-center">
            <h1 className="text-3xl text-brand-gray-900 sm:text-4xl md:text-5xl font-extrabold leading-tight mb-4">
              {currentSlide.title}
            </h1>
            <p className="text-base text-brand-gray-400 sm:text-lg  mb-6">{currentSlide.subtitle}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(currentSlide.cta1Link);
                    }}
                    className="bg-techflex-blue hover:bg-techflex-blue-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform hover:scale-105 text-center"
                >
                  {currentSlide.cta1}
                </a>
              </div>
          </div>
        </div>

        {/* Carousel Controls */}
        <button
            onClick={goToPrevious}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
            onClick={goToNext}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
          {heroSlides.map((_, index) => (
              <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full ${
                      index === currentIndex ? 'bg-techflex-blue' : 'bg-white/40'
                  } hover:bg-white transition`}
              />
          ))}
        </div>
      </div>
  );
};

export default Hero;
