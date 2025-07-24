import React, { useState, useEffect } from 'react';

interface ScrollProgressIndicatorProps {
  color?: string;
}

const ScrollProgressIndicator: React.FC<ScrollProgressIndicatorProps> = ({ 
  color = 'bg-gradient-to-r from-techflex-blue to-techflex-orange'
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPosition = window.scrollY;
      const progress = (scrollPosition / totalHeight) * 100;
      setScrollProgress(progress);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Initial calculation
    handleScroll();

    // Clean up
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-50">
      <div 
        className={`h-full ${color} transition-all duration-300 ease-out`}
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
};

export default ScrollProgressIndicator;