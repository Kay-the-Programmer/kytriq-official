import { useEffect } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  componentName: string;
}

/**
 * Hook to monitor component performance
 * @param componentName Name of the component to monitor
 */
export const usePerformanceMonitor = (componentName: string) => {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Log in development environment
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance] ${componentName} render time: ${renderTime.toFixed(2)}ms`);
      }
      
      // Report to analytics in production
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'performance_metric', {
          component: componentName,
          render_time: Math.round(renderTime),
          performance_category: renderTime > 100 ? 'slow' : 'fast'
        });
      }
    };
  }, [componentName]);
};

/**
 * Utility to throttle function calls
 * @param func Function to throttle
 * @param limit Time limit in milliseconds
 */
export const throttle = <T extends (...args: any[]) => any>(func: T, limit: number): ((...args: Parameters<T>) => void) => {
  let inThrottle = false;
  
  return function(this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};