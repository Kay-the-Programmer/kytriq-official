import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component
 * 
 * This component scrolls the window to the top whenever the route changes.
 * It should be placed inside the Router component in App.tsx.
 */
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when the route changes
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Use 'auto' for instant scrolling without animation
    });
  }, [pathname]);

  return null; // This component doesn't render anything
};

export default ScrollToTop;