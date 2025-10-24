import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from "react-error-boundary";
// Spark removed - using localStorage directly
// import './lib/sparkMock'
// import "@github/spark/spark"

import App from './App.tsx'
import { ErrorFallback } from './ErrorFallback.tsx'
import { registerServiceWorker } from './lib/serviceWorker'

import "./main.css"
import "./styles/theme.css"
import "./index.css"

// Register service worker for PWA capabilities and offline support
if (import.meta.env.PROD) {
  registerServiceWorker({
    onSuccess: () => {
      console.log('[App] Service worker registered - app is ready for offline use');
    },
    onUpdate: (registration) => {
      console.log('[App] New version available');
      // Optionally show a toast notification to user about update
    },
  });
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <App />
   </ErrorBoundary>
)
