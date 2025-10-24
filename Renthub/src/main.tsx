import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from "react-error-boundary";
// Spark removed - using localStorage directly
// import './lib/sparkMock'
// import "@github/spark/spark"

import App from './App.tsx'
import { ErrorFallback } from './ErrorFallback.tsx'

// Performance monitoring - tracks Core Web Vitals
// Initialize in development and production to measure real user performance
import { initPerformanceMonitoring } from './lib/performanceMonitoring'

import "./main.css"
import "./styles/theme.css"
import "./index.css"

// Initialize performance monitoring
// Logs metrics to console in dev, can be extended to send to analytics in production
initPerformanceMonitoring()

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <App />
   </ErrorBoundary>
)
