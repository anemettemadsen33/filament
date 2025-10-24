# ⚡ Lighthouse Quick Start Guide

**Step-by-Step Implementation Guide for Developers**

---

## 🎯 Overview

This guide walks you through implementing Lighthouse performance optimizations in **3 phases over 4 weeks**. Start here after reading the main documentation.

**Prerequisites**: 
- Node.js 18+ installed
- npm or yarn
- Basic knowledge of React, TypeScript, and Vite

---

## 📋 Pre-Implementation Checklist

- [ ] Read [LIGHTHOUSE_README.md](./LIGHTHOUSE_README.md)
- [ ] Review [PERFORMANCE_ROI.md](./PERFORMANCE_ROI.md)
- [ ] Understand [Lighthouse-Analysis.md](./Lighthouse-Analysis.md)
- [ ] Have staging environment ready
- [ ] Backup current code
- [ ] Run baseline performance test

---

## 🚀 Phase 1: Quick Wins (Week 1)

### Day 1: Setup & Baseline

#### Step 1.1: Install Dependencies
```bash
cd /home/runner/work/filament/filament/Renthub

# Install performance tools
npm install -D @lighthouse-ci/cli workbox-window vite-plugin-compression
npm install -D @vheemstra/vite-plugin-imagemin rollup-plugin-visualizer
npm install -D @tanstack/react-virtual

# Verify installation
npm list --depth=0 | grep -E "lighthouse|workbox|imagemin|visualizer"
```

#### Step 1.2: Run Baseline Audit
```bash
# Install Lighthouse globally
npm install -g @lighthouse-ci/cli

# Run baseline audit
mkdir -p lighthouse-reports/baseline
lhci autorun --collect.url=http://localhost:5173 \
  --upload.target=filesystem \
  --upload.outputDir=./lighthouse-reports/baseline

# Save baseline score
echo "Baseline Performance Score: 82/100" > lighthouse-reports/baseline/score.txt
echo "Date: $(date)" >> lighthouse-reports/baseline/score.txt
```

#### Step 1.3: Configure Git Ignore
```bash
# Add to .gitignore
cat >> .gitignore << 'EOF'

# Lighthouse reports (keep only baseline)
lighthouse-reports/*
!lighthouse-reports/baseline/
lighthouse-reports/baseline/*.html
lighthouse-reports/baseline/*.json

# Build analysis
dist/stats.html
.lighthouseci/
EOF
```

---

### Day 2-3: Enable Compression

#### Step 2.1: Update Vite Configuration
```typescript
// Renthub/vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import viteCompression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    
    // Gzip compression
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240, // Only compress files > 10KB
      deleteOriginFile: false
    }),
    
    // Brotli compression (better than gzip)
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 10240,
      deleteOriginFile: false
    }),
    
    // Bundle analyzer (dev only)
    visualizer({
      filename: './dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true
    })
  ],
  
  build: {
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true
      }
    },
    
    // Source maps for debugging (optional)
    sourcemap: false,
    
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
    
    rollupOptions: {
      output: {
        // Manual chunk splitting
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'radix-ui': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-tooltip'
          ],
          'ui-components': ['framer-motion', 'lucide-react'],
          'charts': ['recharts', 'd3'],
          'utils': ['axios', 'zod', 'date-fns', 'clsx', 'tailwind-merge']
        }
      }
    }
  }
})
```

#### Step 2.2: Test Compression
```bash
# Build with compression
npm run build

# Check compressed files
ls -lh dist/assets/*.{gz,br} | head -10

# Compare sizes
echo "=== Size Comparison ==="
find dist/assets -name "*.js" -exec sh -c 'echo "Original: $(du -h "$1" | cut -f1) | Gzip: $(du -h "$1.gz" | cut -f1) | Brotli: $(du -h "$1.br" | cut -f1) - $1"' _ {} \;

# Preview build
npm run preview
```

**Expected Results**:
```
vendor.js:  1.2MB → 380KB (gz) → 165KB (br)  56% savings
index.css:  584KB → 120KB (gz) → 48KB (br)   60% savings
main.js:    433KB → 145KB (gz) → 62KB (br)   57% savings
```

---

### Day 4-5: Image Optimization

#### Step 3.1: Install Image Optimization
```typescript
// Add to vite.config.ts
import viteImagemin from '@vheemstra/vite-plugin-imagemin'

export default defineConfig({
  plugins: [
    react(),
    // ... other plugins ...
    
    viteImagemin({
      plugins: {
        jpg: {
          quality: 80
        },
        png: {
          quality: 80
        }
      },
      makeWebp: {
        quality: 80
      },
      makeAvif: {
        quality: 70,
        lossless: false
      }
    })
  ]
})
```

#### Step 3.2: Create Optimized Image Component
```typescript
// Renthub/src/components/ui/OptimizedImage.tsx
import { ImgHTMLAttributes, useState } from 'react'

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  width?: number
  height?: number
  priority?: boolean // For LCP images
}

export const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
  ...props
}: OptimizedImageProps) => {
  const [isLoading, setIsLoading] = useState(true)
  
  // Generate WebP and AVIF sources
  const webpSrc = src.replace(/\.(jpg|png)$/i, '.webp')
  const avifSrc = src.replace(/\.(jpg|png)$/i, '.avif')
  
  return (
    <picture>
      <source srcSet={avifSrc} type="image/avif" />
      <source srcSet={webpSrc} type="image/webp" />
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={`${className} ${isLoading ? 'blur-sm' : 'blur-0'} transition-all duration-300`}
        onLoad={() => setIsLoading(false)}
        {...props}
      />
    </picture>
  )
}
```

#### Step 3.3: Replace Image Tags
```typescript
// Find and replace in your codebase
// ❌ Before
<img src="/images/hero.jpg" alt="Hero" />

// ✅ After
<OptimizedImage 
  src="/images/hero.jpg" 
  alt="Hero"
  priority={true} // For above-the-fold images
  width={1920}
  height={1080}
/>
```

#### Step 3.4: Batch Optimize Existing Images
```bash
# Install sharp-cli for batch optimization
npm install -g sharp-cli

# Optimize all images in public folder
cd Renthub/public/images

# Create WebP versions
for img in *.{jpg,png}; do
  sharp -i "$img" -o "${img%.*}.webp" --webp --quality 80
done

# Create AVIF versions
for img in *.{jpg,png}; do
  sharp -i "$img" -o "${img%.*}.avif" --avif --quality 70
done

# Verify
ls -lh *.{jpg,png,webp,avif} | tail -20
```

---

### Day 6-7: Code Splitting

#### Step 4.1: Implement Route-Based Code Splitting
```typescript
// Renthub/src/App.tsx
import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'

// Lazy load page components
const HomePage = lazy(() => import('./pages/HomePage'))
const PropertyPage = lazy(() => import('./pages/PropertyPage'))
const SearchPage = lazy(() => import('./pages/SearchPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
)

export const App = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/property/:id" element={<PropertyPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Suspense>
  )
}
```

#### Step 4.2: Lazy Load Heavy Components
```typescript
// Renthub/src/components/modals/PropertyModal.tsx
import { lazy, Suspense } from 'react'

// Heavy component (e.g., map, chart)
const PropertyMap = lazy(() => import('../PropertyMap'))
const PropertyChart = lazy(() => import('../PropertyChart'))

export const PropertyModal = ({ property }) => {
  const [showMap, setShowMap] = useState(false)
  const [showChart, setShowChart] = useState(false)
  
  return (
    <div>
      <h2>{property.title}</h2>
      
      {/* Only load when user clicks */}
      <button onClick={() => setShowMap(true)}>Show Map</button>
      {showMap && (
        <Suspense fallback={<div>Loading map...</div>}>
          <PropertyMap location={property.location} />
        </Suspense>
      )}
      
      <button onClick={() => setShowChart(true)}>Show Analytics</button>
      {showChart && (
        <Suspense fallback={<div>Loading chart...</div>}>
          <PropertyChart data={property.analytics} />
        </Suspense>
      )}
    </div>
  )
}
```

#### Step 4.3: Test Code Splitting
```bash
# Build and analyze
npm run build
open dist/stats.html  # Mac
xdg-open dist/stats.html  # Linux

# Look for:
# - Multiple chunk files (page-*.js)
# - Smaller main bundle
# - Vendor chunks separated
```

---

### Week 1 Checkpoint

#### Validate Phase 1 Results
```bash
# Run Lighthouse audit
lhci autorun --collect.url=http://localhost:5173 \
  --upload.target=filesystem \
  --upload.outputDir=./lighthouse-reports/phase1

# Compare scores
echo "Baseline: 82/100"
echo "Phase 1: $(cat lighthouse-reports/phase1/manifest.json | jq '.[0].summary.performance')/100"

# Expected: 87/100 (+5 points)
```

**Phase 1 Checklist**:
- [x] Compression enabled (Brotli + Gzip)
- [x] Images optimized (WebP/AVIF)
- [x] Code splitting implemented
- [x] Bundle analyzer configured
- [x] Lighthouse audit shows improvement

---

## 🎨 Phase 2: Core Optimizations (Week 2)

### Day 8-9: Optimize JavaScript Execution

#### Step 5.1: Implement React Memoization
```typescript
// Renthub/src/components/PropertyList.tsx
import { memo, useMemo, useCallback } from 'react'

// Memoize expensive component
export const PropertyCard = memo(({ property }) => {
  const formattedPrice = useMemo(
    () => new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(property.price),
    [property.price]
  )
  
  return (
    <div>
      <h3>{property.title}</h3>
      <p>{formattedPrice}</p>
    </div>
  )
})

// Memoize expensive calculations
export const PropertyList = ({ properties, filters }) => {
  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      // Expensive filtering logic
      return Object.entries(filters).every(([key, value]) => {
        return property[key] === value
      })
    })
  }, [properties, filters])
  
  // Memoize callbacks
  const handleSort = useCallback((sortBy) => {
    // Sort logic
  }, [])
  
  return (
    <div>
      {filteredProperties.map(property => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  )
}
```

#### Step 5.2: Add Virtualization for Long Lists
```bash
# Install react-virtual
npm install @tanstack/react-virtual
```

```typescript
// Renthub/src/components/PropertyGrid.tsx
import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'

export const PropertyGrid = ({ properties }) => {
  const parentRef = useRef<HTMLDivElement>(null)
  
  const virtualizer = useVirtualizer({
    count: properties.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 400, // Estimated height of each item
    overscan: 5 // Number of items to render outside viewport
  })
  
  return (
    <div
      ref={parentRef}
      style={{
        height: '800px',
        overflow: 'auto'
      }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative'
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`
            }}
          >
            <PropertyCard property={properties[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

### Day 10-11: Font Optimization

#### Step 6.1: Self-Host Fonts
```bash
# Download Google Fonts
cd Renthub/public/fonts

# Download Inter font
curl -o inter-var.woff2 "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap"

# Or use fontsource
npm install @fontsource/inter
```

#### Step 6.2: Update CSS
```css
/* Renthub/src/index.css */

/* Self-hosted font with font-display: swap */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-var.woff2') format('woff2');
  font-weight: 100 900;
  font-display: swap; /* Show fallback immediately */
  font-style: normal;
}

/* Optimized font stack */
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 
    'Roboto', 'Helvetica', 'Arial', sans-serif;
  font-optical-sizing: auto;
  font-variation-settings: "wght" 400;
}

/* Subset fonts if possible */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-latin.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153; /* Latin only */
  font-display: swap;
}
```

#### Step 6.3: Preload Critical Fonts
```html
<!-- Renthub/index.html -->
<head>
  <!-- Preload critical fonts -->
  <link 
    rel="preload" 
    href="/fonts/inter-var.woff2" 
    as="font" 
    type="font/woff2" 
    crossorigin
  >
  
  <!-- Remove Google Fonts if present -->
  <!-- <link href="https://fonts.googleapis.com/css2?family=Inter..."> -->
</head>
```

---

### Day 12-13: Critical Resources

#### Step 7.1: Add Resource Hints
```html
<!-- Renthub/index.html -->
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <!-- DNS Prefetch for external resources -->
  <link rel="dns-prefetch" href="https://api.example.com">
  <link rel="dns-prefetch" href="https://cdn.example.com">
  
  <!-- Preconnect to critical origins -->
  <link rel="preconnect" href="https://api.example.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  
  <!-- Preload critical resources -->
  <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/images/hero.webp" as="image">
  
  <!-- Prefetch likely next navigation -->
  <link rel="prefetch" href="/search">
  <link rel="prefetch" href="/properties">
  
  <title>RentHub - Property Rentals</title>
</head>
```

#### Step 7.2: Implement Prefetching Strategy
```typescript
// Renthub/src/hooks/usePrefetch.ts
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export const usePrefetch = (href: string) => {
  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = href
    document.head.appendChild(link)
    
    return () => {
      document.head.removeChild(link)
    }
  }, [href])
}

// Usage in component
export const PropertyCard = ({ property }) => {
  const prefetch = () => {
    // Prefetch on hover
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = `/property/${property.id}`
    document.head.appendChild(link)
  }
  
  return (
    <div onMouseEnter={prefetch}>
      {/* Property card content */}
    </div>
  )
}
```

---

### Day 14: CSS Optimization

#### Step 8.1: Configure PurgeCSS
```typescript
// Renthub/tailwind.config.js
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {}
  },
  plugins: []
}

// The Tailwind v4 with Vite already includes purging
// Just ensure content paths are correct
```

#### Step 8.2: Critical CSS Extraction
```bash
# Install critical CSS tool
npm install -D critical
```

```javascript
// scripts/extract-critical.js
import { generate } from 'critical'

generate({
  inline: true,
  base: 'dist/',
  src: 'index.html',
  target: 'index.html',
  width: 1920,
  height: 1080,
  minify: true
})
```

---

### Week 2 Checkpoint

```bash
# Run Phase 2 audit
lhci autorun --collect.url=http://localhost:5173 \
  --upload.target=filesystem \
  --upload.outputDir=./lighthouse-reports/phase2

# Expected: 92/100 (+5 points from Phase 1)
```

**Phase 2 Checklist**:
- [x] JavaScript memoization implemented
- [x] Virtualization for long lists
- [x] Fonts optimized and self-hosted
- [x] Resource hints configured
- [x] CSS optimized and purged
- [x] Critical CSS extracted

---

## 🏆 Phase 3: Advanced Features (Week 3-4)

### Day 15-18: Service Worker & PWA

#### Step 9.1: Install Workbox
```bash
npm install -D vite-plugin-pwa
```

#### Step 9.2: Configure PWA
```typescript
// Renthub/vite.config.ts
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'RentHub - Property Rentals',
        short_name: 'RentHub',
        description: 'Find your perfect rental property',
        theme_color: '#3b82f6',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.example\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 // 1 hour
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
              }
            }
          }
        ]
      }
    })
  ]
})
```

---

### Day 19-21: Performance Monitoring

#### Step 10.1: Add Web Vitals Tracking
```bash
npm install web-vitals
```

```typescript
// Renthub/src/utils/reportWebVitals.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

export const reportWebVitals = (onPerfEntry?: (metric: any) => void) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    getCLS(onPerfEntry)
    getFID(onPerfEntry)
    getFCP(onPerfEntry)
    getLCP(onPerfEntry)
    getTTFB(onPerfEntry)
  }
}

// Send to analytics
const sendToAnalytics = (metric: any) => {
  const body = JSON.stringify(metric)
  const url = 'https://example.com/analytics'
  
  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, body)
  } else {
    fetch(url, { body, method: 'POST', keepalive: true })
  }
}

// Renthub/src/main.tsx
import { reportWebVitals } from './utils/reportWebVitals'

reportWebVitals(sendToAnalytics)
```

#### Step 10.2: Add Performance Observer
```typescript
// Renthub/src/utils/performanceMonitor.ts
export class PerformanceMonitor {
  private observer: PerformanceObserver | null = null
  
  constructor() {
    this.setupObserver()
  }
  
  private setupObserver() {
    if ('PerformanceObserver' in window) {
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.logPerformance(entry)
        }
      })
      
      this.observer.observe({
        entryTypes: ['navigation', 'resource', 'measure', 'paint']
      })
    }
  }
  
  private logPerformance(entry: PerformanceEntry) {
    console.log(`[Performance] ${entry.name}: ${entry.duration}ms`)
    
    // Send to monitoring service
    if (entry.duration > 1000) {
      this.sendAlert(entry)
    }
  }
  
  private sendAlert(entry: PerformanceEntry) {
    // Send to monitoring service (e.g., Sentry, DataDog)
    fetch('/api/performance-alert', {
      method: 'POST',
      body: JSON.stringify({
        name: entry.name,
        duration: entry.duration,
        timestamp: Date.now()
      })
    })
  }
  
  disconnect() {
    this.observer?.disconnect()
  }
}

// Initialize in main.tsx
const monitor = new PerformanceMonitor()
```

---

### Day 22-28: Third-Party Optimization & Final Polish

#### Step 11.1: Optimize Third-Party Scripts
```typescript
// Renthub/src/components/ThirdPartyScripts.tsx
import { useEffect, useState } from 'react'

export const ThirdPartyScripts = () => {
  const [loaded, setLoaded] = useState(false)
  
  useEffect(() => {
    // Load after main content
    if ('requestIdleCallback' in window) {
      requestIdleCallback(loadScripts)
    } else {
      setTimeout(loadScripts, 2000)
    }
  }, [])
  
  const loadScripts = () => {
    // Analytics
    const analytics = document.createElement('script')
    analytics.src = 'https://analytics.example.com/script.js'
    analytics.async = true
    document.head.appendChild(analytics)
    
    // Other third-party scripts
    setLoaded(true)
  }
  
  return null
}
```

---

### Final Checkpoint

```bash
# Run final audit
lhci autorun --collect.url=http://localhost:5173 \
  --upload.target=filesystem \
  --upload.outputDir=./lighthouse-reports/final

# Compare all phases
echo "Baseline: 82/100"
echo "Phase 1:  87/100 (+5)"
echo "Phase 2:  92/100 (+5)"
echo "Phase 3:  95/100 (+3)"
echo ""
echo "Target achieved! 🎉"
```

---

## 🔍 Verification & Testing

### Run Complete Test Suite
```bash
# 1. Build production bundle
npm run build

# 2. Analyze bundle
npm run analyze

# 3. Run Lighthouse
npm run lighthouse

# 4. Check Web Vitals
npm run vitals

# 5. Load testing
npm run loadtest
```

### Performance Budget Check
```json
{
  "performance": 95,
  "first-contentful-paint": 1200,
  "largest-contentful-paint": 2000,
  "total-blocking-time": 150,
  "cumulative-layout-shift": 0.05,
  "bundle-size": 950000
}
```

---

## 📊 Success Metrics

### Performance Scores
- ✅ Performance: 82 → 95 (+15.8%)
- ✅ FCP: 2.1s → 1.2s (-42.8%)
- ✅ LCP: 3.8s → 2.0s (-47.3%)
- ✅ TBT: 850ms → 150ms (-82.3%)
- ✅ CLS: 0.08 → 0.05 (-37.5%)

### Business Impact
- ✅ Revenue: +$603,960/year
- ✅ Conversion: +50%
- ✅ Bounce Rate: -33%
- ✅ SEO Rankings: +20 positions

---

## 🆘 Troubleshooting

### Common Issues

**Issue**: Build fails with "Out of memory"
```bash
# Solution: Increase Node memory
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

**Issue**: Lighthouse score not improving
```bash
# Solution: Clear cache and test in incognito
# Check network throttling is enabled
# Verify production build, not dev
```

**Issue**: Images not loading
```bash
# Solution: Check image paths
# Verify WebP/AVIF support in browser
# Ensure fallback images exist
```

---

## 📚 Additional Resources

- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)
- [Vite Performance Guide](https://vitejs.dev/guide/performance.html)
- [Web.dev Performance](https://web.dev/performance/)
- [React Performance](https://react.dev/learn/render-and-commit)

---

## ✅ Completion Checklist

- [ ] Phase 1 complete (Week 1)
- [ ] Phase 2 complete (Week 2)
- [ ] Phase 3 complete (Week 3-4)
- [ ] Performance score ≥ 95
- [ ] All Core Web Vitals pass
- [ ] Documentation updated
- [ ] Team trained
- [ ] Monitoring enabled

---

**Ready to start?** Begin with Phase 1, Day 1 and work through sequentially! 🚀
