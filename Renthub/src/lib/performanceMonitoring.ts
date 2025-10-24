// Performance monitoring utility for RentHub
// Tracks Core Web Vitals and reports to console (can be extended to send to analytics)

// Core Web Vitals tracking
// - FCP (First Contentful Paint): Time to first content render
// - LCP (Largest Contentful Paint): Time to largest content render  
// - FID (First Input Delay): Time from first interaction to browser response
// - CLS (Cumulative Layout Shift): Visual stability metric
// - TTFB (Time to First Byte): Server response time

export interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

// Thresholds based on Core Web Vitals recommendations
const THRESHOLDS = {
  FCP: { good: 1800, poor: 3000 },      // First Contentful Paint (ms)
  LCP: { good: 2500, poor: 4000 },      // Largest Contentful Paint (ms)
  FID: { good: 100, poor: 300 },        // First Input Delay (ms)
  CLS: { good: 0.1, poor: 0.25 },       // Cumulative Layout Shift
  TTFB: { good: 800, poor: 1800 },      // Time to First Byte (ms)
};

// Rate a metric value based on thresholds
function getRating(metricName: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[metricName as keyof typeof THRESHOLDS];
  if (!threshold) return 'good';
  
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

// Log performance metric to console (can be extended to send to analytics)
function logMetric(metric: PerformanceMetric) {
  const emoji = metric.rating === 'good' ? '✅' : metric.rating === 'needs-improvement' ? '⚠️' : '❌';
  console.log(`${emoji} ${metric.name}: ${metric.value.toFixed(2)}ms (${metric.rating})`);
  
  // TODO: Send to analytics service (e.g., Google Analytics, Mixpanel, custom endpoint)
  // Example: sendToAnalytics(metric);
}

// Initialize performance monitoring
export function initPerformanceMonitoring() {
  // Only run in browser environment
  if (typeof window === 'undefined') return;

  // Use the Performance Observer API to track metrics
  if ('PerformanceObserver' in window) {
    try {
      // Track Paint metrics (FCP)
      const paintObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            const metric: PerformanceMetric = {
              name: 'FCP',
              value: entry.startTime,
              rating: getRating('FCP', entry.startTime),
              timestamp: Date.now(),
            };
            logMetric(metric);
          }
        }
      });
      paintObserver.observe({ entryTypes: ['paint'] });

      // Track Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        if (lastEntry) {
          const metric: PerformanceMetric = {
            name: 'LCP',
            value: lastEntry.renderTime || lastEntry.loadTime,
            rating: getRating('LCP', lastEntry.renderTime || lastEntry.loadTime),
            timestamp: Date.now(),
          };
          logMetric(metric);
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Track First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fidEntry = entry as any;
          const metric: PerformanceMetric = {
            name: 'FID',
            value: fidEntry.processingStart - fidEntry.startTime,
            rating: getRating('FID', fidEntry.processingStart - fidEntry.startTime),
            timestamp: Date.now(),
          };
          logMetric(metric);
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Track Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShift = entry as any;
          if (!layoutShift.hadRecentInput) {
            clsValue += layoutShift.value;
          }
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // Log CLS when user leaves the page
      window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          const metric: PerformanceMetric = {
            name: 'CLS',
            value: clsValue,
            rating: getRating('CLS', clsValue),
            timestamp: Date.now(),
          };
          logMetric(metric);
        }
      });

      // Track Time to First Byte (TTFB)
      const navigationObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const navEntry = entry as any;
          const ttfb = navEntry.responseStart - navEntry.requestStart;
          const metric: PerformanceMetric = {
            name: 'TTFB',
            value: ttfb,
            rating: getRating('TTFB', ttfb),
            timestamp: Date.now(),
          };
          logMetric(metric);
        }
      });
      navigationObserver.observe({ entryTypes: ['navigation'] });

    } catch (error) {
      console.warn('Performance monitoring failed to initialize:', error);
    }
  }

  // Fallback: Track basic page load metrics using older API
  if ('performance' in window && 'timing' in window.performance) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const timing = window.performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        const domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart;
        const domInteractive = timing.domInteractive - timing.navigationStart;
        
        console.log('📊 Page Load Metrics:');
        console.log(`  - Total Load Time: ${loadTime}ms`);
        console.log(`  - DOM Content Loaded: ${domContentLoaded}ms`);
        console.log(`  - DOM Interactive: ${domInteractive}ms`);
      }, 0);
    });
  }
}

// Export for use in main.tsx
export default initPerformanceMonitoring;
