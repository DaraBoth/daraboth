import { useEffect } from 'react';

/**
 * Performance monitoring component that tracks Web Vitals
 * and provides performance insights
 */
const PerformanceMonitor = () => {
  useEffect(() => {
    // Track Core Web Vitals
    const trackWebVitals = () => {
      // Track Largest Contentful Paint (LCP)
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        console.log('🎯 LCP (Largest Contentful Paint):', lastEntry.startTime.toFixed(2) + 'ms');
        
        // Send to analytics if needed
        if (typeof gtag !== 'undefined') {
          gtag('event', 'web_vitals', {
            event_category: 'Performance',
            event_label: 'LCP',
            value: Math.round(lastEntry.startTime)
          });
        }
      });
      
      try {
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.log('LCP observer not supported');
      }

      // Track First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          console.log('⚡ FID (First Input Delay):', entry.processingStart - entry.startTime + 'ms');
          
          if (typeof gtag !== 'undefined') {
            gtag('event', 'web_vitals', {
              event_category: 'Performance',
              event_label: 'FID',
              value: Math.round(entry.processingStart - entry.startTime)
            });
          }
        });
      });
      
      try {
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        console.log('FID observer not supported');
      }

      // Track Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        
        console.log('📐 CLS (Cumulative Layout Shift):', clsValue.toFixed(4));
        
        if (typeof gtag !== 'undefined') {
          gtag('event', 'web_vitals', {
            event_category: 'Performance',
            event_label: 'CLS',
            value: Math.round(clsValue * 1000)
          });
        }
      });
      
      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        console.log('CLS observer not supported');
      }
    };

    // Track page load performance
    const trackPageLoad = () => {
      if (typeof window !== 'undefined' && window.performance) {
        const navigation = performance.getEntriesByType('navigation')[0];
        
        if (navigation) {
          const metrics = {
            'DNS Lookup': navigation.domainLookupEnd - navigation.domainLookupStart,
            'TCP Connection': navigation.connectEnd - navigation.connectStart,
            'Request': navigation.responseStart - navigation.requestStart,
            'Response': navigation.responseEnd - navigation.responseStart,
            'DOM Processing': navigation.domContentLoadedEventStart - navigation.responseEnd,
            'Load Complete': navigation.loadEventEnd - navigation.loadEventStart,
            'Total Load Time': navigation.loadEventEnd - navigation.navigationStart
          };

          console.group('📊 Page Load Performance Metrics');
          Object.entries(metrics).forEach(([key, value]) => {
            console.log(`${key}: ${value.toFixed(2)}ms`);
          });
          console.groupEnd();

          // Track total load time
          if (typeof gtag !== 'undefined') {
            gtag('event', 'page_load_time', {
              event_category: 'Performance',
              value: Math.round(metrics['Total Load Time'])
            });
          }
        }
      }
    };

    // Track resource loading performance
    const trackResourcePerformance = () => {
      if (typeof window !== 'undefined' && window.performance) {
        const resources = performance.getEntriesByType('resource');
        
        const resourceMetrics = {
          scripts: [],
          stylesheets: [],
          images: [],
          fonts: []
        };

        resources.forEach((resource) => {
          const duration = resource.responseEnd - resource.startTime;
          const size = resource.transferSize || 0;
          
          if (resource.name.includes('.js')) {
            resourceMetrics.scripts.push({ name: resource.name, duration, size });
          } else if (resource.name.includes('.css')) {
            resourceMetrics.stylesheets.push({ name: resource.name, duration, size });
          } else if (resource.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
            resourceMetrics.images.push({ name: resource.name, duration, size });
          } else if (resource.name.match(/\.(woff|woff2|ttf|otf)$/)) {
            resourceMetrics.fonts.push({ name: resource.name, duration, size });
          }
        });

        console.group('📦 Resource Loading Performance');
        Object.entries(resourceMetrics).forEach(([type, resources]) => {
          if (resources.length > 0) {
            const totalSize = resources.reduce((sum, r) => sum + r.size, 0);
            const avgDuration = resources.reduce((sum, r) => sum + r.duration, 0) / resources.length;
            
            console.log(`${type.toUpperCase()}: ${resources.length} files, ${(totalSize / 1024).toFixed(2)}KB total, ${avgDuration.toFixed(2)}ms avg load time`);
          }
        });
        console.groupEnd();
      }
    };

    // Track memory usage (if available)
    const trackMemoryUsage = () => {
      if (typeof window !== 'undefined' && window.performance && window.performance.memory) {
        const memory = window.performance.memory;
        
        console.group('🧠 Memory Usage');
        console.log(`Used: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`Total: ${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`Limit: ${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`);
        console.groupEnd();
      }
    };

    // Initialize tracking
    const initPerformanceTracking = () => {
      // Track immediately available metrics
      trackPageLoad();
      trackResourcePerformance();
      trackMemoryUsage();
      
      // Track Web Vitals
      trackWebVitals();
      
      // Track memory usage periodically
      const memoryInterval = setInterval(trackMemoryUsage, 30000); // Every 30 seconds
      
      return () => {
        clearInterval(memoryInterval);
      };
    };

    // Wait for page to load before tracking
    if (document.readyState === 'complete') {
      const cleanup = initPerformanceTracking();
      return cleanup;
    } else {
      const handleLoad = () => {
        const cleanup = initPerformanceTracking();
        window.removeEventListener('load', handleLoad);
        return cleanup;
      };
      
      window.addEventListener('load', handleLoad);
      return () => {
        window.removeEventListener('load', handleLoad);
      };
    }
  }, []);

  // This component doesn't render anything
  return null;
};

export default PerformanceMonitor;
