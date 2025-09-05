import React, { Suspense, lazy } from 'react';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import { CanvasPlaceholder } from '../Loader';

// Lazy load canvas components
const EarthCanvas = lazy(() => import('./Earth'));
const BallCanvas = lazy(() => import('./Ball'));
const ComputersCanvas = lazy(() => import('./Computers'));
const StarsCanvas = lazy(() => import('./Stars'));

/**
 * Generic lazy canvas wrapper with intersection observer
 * Only loads the 3D component when it's about to be visible
 */
const LazyCanvasWrapper = ({ 
  component, 
  fallbackHeight = '400px', 
  className = '',
  ...props 
}) => {
  const [ref, isIntersecting, hasIntersected] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px'
  });

  const renderCanvas = () => {
    switch (component) {
      case 'earth':
        return <EarthCanvas {...props} />;
      case 'ball':
        return <BallCanvas {...props} />;
      case 'computers':
        return <ComputersCanvas {...props} />;
      case 'stars':
        return <StarsCanvas {...props} />;
      default:
        return null;
    }
  };

  return (
    <div 
      ref={ref} 
      className={className}
      style={{ minHeight: fallbackHeight }}
    >
      {(isIntersecting || hasIntersected) ? (
        <Suspense fallback={<CanvasPlaceholder />}>
          {renderCanvas()}
        </Suspense>
      ) : (
        // Placeholder while not visible
        <div
          className="flex items-center justify-center w-full h-full"
          style={{ minHeight: fallbackHeight }}
        >
          <div className="text-secondary text-sm">Loading 3D content...</div>
        </div>
      )}
    </div>
  );
};

// Specific wrapper components
export const LazyEarthCanvas = (props) => (
  <LazyCanvasWrapper component="earth" fallbackHeight="400px" {...props} />
);

export const LazyBallCanvas = (props) => (
  <LazyCanvasWrapper component="ball" fallbackHeight="112px" {...props} />
);

export const LazyComputersCanvas = (props) => (
  <LazyCanvasWrapper component="computers" fallbackHeight="500px" {...props} />
);

export const LazyStarsCanvas = (props) => (
  <LazyCanvasWrapper component="stars" fallbackHeight="100vh" {...props} />
);

export default LazyCanvasWrapper;
