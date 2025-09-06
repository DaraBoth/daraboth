import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for intersection observer
 * Loads components only when they're about to be visible
 * @param {Object} options - Intersection observer options
 * @returns {Array} [ref, isIntersecting, hasIntersected]
 */
const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        setIsIntersecting(isVisible);
        
        // Once intersected, keep it loaded for better UX
        if (isVisible && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1, // Load when 10% visible
        rootMargin: '100px', // Load 100px before entering viewport
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [hasIntersected, options]);

  return [ref, isIntersecting, hasIntersected];
};

export default useIntersectionObserver;
