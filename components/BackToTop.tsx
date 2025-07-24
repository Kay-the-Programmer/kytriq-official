import React, { useState, useEffect } from 'react';
import Icon from './Icon';

interface BackToTopProps {
  showAtPosition?: number;
  buttonClassName?: string;
}

const BackToTop: React.FC<BackToTopProps> = ({ 
  showAtPosition = 300,
  buttonClassName = 'bg-techflex-blue hover:bg-techflex-blue-600 text-white'
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > showAtPosition);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Initial check
    handleScroll();

    // Clean up
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showAtPosition]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 p-3 rounded-full shadow-lg z-50 transition-all duration-300 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      } ${buttonClassName}`}
      aria-label="Back to top"
    >
      <div className="flex flex-col items-center">
        <Icon name="chevron-up" className="h-6 w-6 animate-bounce" />
      </div>
    </button>
  );
};

export default BackToTop;
