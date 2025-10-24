# ⚡ Performance Optimization Checklist

**Project**: RentHub - Rental Platform  
**Last Updated**: October 24, 2025  
**Target**: Lighthouse Score 95+ | LCP < 2.5s | FID < 100ms | CLS < 0.1

---

## 📊 Current Status

| Metric | Current | Target | Priority |
|--------|---------|--------|----------|
| **Performance Score** | 82/100 | 95+/100 | 🔴 HIGH |
| **LCP (Largest Contentful Paint)** | ~4s | < 2.5s | 🔴 HIGH |
| **FID (First Input Delay)** | ~150ms | < 100ms | 🟡 MED |
| **CLS (Cumulative Layout Shift)** | 0.15 | < 0.1 | 🟡 MED |
| **Bundle Size (JS)** | ~850KB | < 500KB | 🔴 HIGH |

---

## 🚀 Quick Wins (Week 1) - High Impact

### 1. Enable Brotli Compression (⚡ -60% transfer size)

**Backend (Nginx):**
```nginx
# /etc/nginx/nginx.conf or site config
http {
    # Enable Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss;
    
    # Enable Brotli (install nginx-module-brotli first)
    brotli on;
    brotli_comp_level 6;
    brotli_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss;
}
```

**Verification:**
```bash
curl -H "Accept-Encoding: br" -I https://renthub.com/assets/main.js
# Should see: Content-Encoding: br
```

### 2. Lazy Load Images (⚡ -2.2s LCP)

**Frontend:**
```tsx
// Use native lazy loading
<img 
  src={property.image} 
  alt={property.title}
  loading="lazy"  // ← Add this
  decoding="async"
/>

// Or use React Suspense + lazy loading
import { lazy, Suspense } from 'react';

const PropertyImage = lazy(() => import('@/components/PropertyImage'));

<Suspense fallback={<div className="skeleton" />}>
  <PropertyImage src={property.image} />
</Suspense>
```

### 3. Code Splitting by Route (⚡ -40% initial bundle)

**Frontend:**
```tsx
// src/main.tsx or router config
import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';

// Lazy load route components
const HomePage = lazy(() => import('@/pages/HomePage'));
const PropertyPage = lazy(() => import('@/pages/PropertyPage'));
const SearchPage = lazy(() => import('@/pages/SearchPage'));

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <HomePage />
      </Suspense>
    ),
  },
  {
    path: '/property/:id',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <PropertyPage />
      </Suspense>
    ),
  },
  // ... more routes
]);
```

### 4. Optimize Bundle (Vite Configuration)

**Update `vite.config.ts`:**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import compression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    // Brotli compression
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
    // Gzip compression
    compression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    // Bundle analyzer
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      },
    },
    // Code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          // Add more chunks as needed
        },
      },
    },
    // Chunk size warnings
    chunkSizeWarningLimit: 500, // KB
  },
});
```

---

## 🎨 Image Optimization (Week 1-2)

### Convert to WebP/AVIF

**Install sharp (Node.js):**
```bash
npm install -D sharp
```

**Create conversion script:**
```javascript
// scripts/optimize-images.js
import sharp from 'sharp';
import { readdirSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const inputDir = './public/images';
const outputDir = './public/images/optimized';

if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

const files = readdirSync(inputDir);

files.forEach(async (file) => {
  if (!file.match(/\.(jpg|jpeg|png)$/i)) return;
  
  const inputPath = join(inputDir, file);
  const baseName = file.replace(/\.[^.]+$/, '');
  
  // Convert to WebP
  await sharp(inputPath)
    .webp({ quality: 80 })
    .toFile(join(outputDir, `${baseName}.webp`));
  
  // Convert to AVIF (better compression)
  await sharp(inputPath)
    .avif({ quality: 70 })
    .toFile(join(outputDir, `${baseName}.avif`));
  
  console.log(`Optimized: ${file}`);
});
```

**Use in components:**
```tsx
<picture>
  <source srcSet={`${property.image}.avif`} type="image/avif" />
  <source srcSet={`${property.image}.webp`} type="image/webp" />
  <img src={`${property.image}.jpg`} alt={property.title} loading="lazy" />
</picture>
```

### Responsive Images

```tsx
<img
  srcSet={`
    ${property.image}-400w.webp 400w,
    ${property.image}-800w.webp 800w,
    ${property.image}-1200w.webp 1200w
  `}
  sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px"
  src={property.image}
  alt={property.title}
  loading="lazy"
/>
```

---

## 🔤 Font Loading Optimization (Week 2)

### Preload Critical Fonts

**Add to `index.html`:**
```html
<head>
  <!-- Preload primary font -->
  <link
    rel="preload"
    href="/fonts/Inter-Regular.woff2"
    as="font"
    type="font/woff2"
    crossorigin="anonymous"
  />
  
  <!-- Font display swap -->
  <style>
    @font-face {
      font-family: 'Inter';
      src: url('/fonts/Inter-Regular.woff2') format('woff2');
      font-display: swap; /* Show fallback immediately */
      font-weight: 400;
    }
  </style>
</head>
```

### Use System Fonts as Fallback

```css
/* tailwind.config.js or CSS */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
```

---

## 📦 CSS Optimization (Week 2)

### Critical CSS Extraction

**Install plugin:**
```bash
npm install -D vite-plugin-critical
```

**Add to `vite.config.ts`:**
```typescript
import { critical } from 'vite-plugin-critical';

export default defineConfig({
  plugins: [
    critical({
      criticalUrl: 'http://localhost:5173',
      criticalPages: [
        { uri: '/', template: 'index' },
        { uri: '/properties', template: 'properties' },
      ],
    }),
  ],
});
```

### Remove Unused CSS

Tailwind CSS automatically purges unused styles in production. Verify:
```javascript
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // ...
}
```

---

## 🔄 Caching Strategy (Week 2-3)

### Service Worker for PWA

**Install Workbox:**
```bash
npm install -D workbox-window workbox-webpack-plugin
```

**Create service worker:**
```typescript
// src/sw.ts
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';

// Precache static assets
precacheAndRoute(self.__WB_MANIFEST);

// Cache images
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);

// Cache API responses
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api',
    networkTimeoutSeconds: 3,
  })
);
```

### HTTP Cache Headers (Backend)

**Laravel Middleware:**
```php
<?php

namespace App\Http\Middleware;

class CacheControl
{
    public function handle($request, Closure $next)
    {
        $response = $next($request);
        
        // Static assets: 1 year
        if (preg_match('/\.(js|css|woff2|jpg|png|webp)$/', $request->path())) {
            $response->header('Cache-Control', 'public, max-age=31536000, immutable');
        }
        
        // API: 5 minutes
        if (str_starts_with($request->path(), 'api/')) {
            $response->header('Cache-Control', 'public, max-age=300');
        }
        
        return $response;
    }
}
```

---

## 🗄️ Database Optimization (Week 3)

### Add Indexes

```php
// database/migrations/xxxx_add_indexes_for_performance.php
public function up()
{
    Schema::table('properties', function (Blueprint $table) {
        $table->index('price');
        $table->index('location');
        $table->index('bedrooms');
        $table->index(['price', 'location']); // Composite index
        $table->index('created_at');
    });
}
```

### Query Optimization

```php
// ❌ Bad: N+1 query problem
$properties = Property::all();
foreach ($properties as $property) {
    echo $property->user->name; // N queries
}

// ✅ Good: Eager loading
$properties = Property::with('user')->get();
foreach ($properties as $property) {
    echo $property->user->name; // 1 query
}
```

### Database Query Caching

```php
// Cache expensive queries
$properties = Cache::remember('featured_properties', 3600, function () {
    return Property::where('featured', true)
                   ->with('user', 'images')
                   ->get();
});
```

---

## 🎭 Third-Party Scripts (Week 3)

### Defer Non-Critical Scripts

```html
<!-- Analytics (non-blocking) -->
<script defer src="https://analytics.renthub.com/script.js"></script>

<!-- Chat widget (load after page) -->
<script>
  window.addEventListener('load', () => {
    const script = document.createElement('script');
    script.src = 'https://chat.renthub.com/widget.js';
    document.body.appendChild(script);
  });
</script>
```

### Preconnect to Required Origins

```html
<head>
  <!-- Preconnect to API -->
  <link rel="preconnect" href="https://api.renthub.com" crossorigin />
  
  <!-- DNS prefetch for analytics -->
  <link rel="dns-prefetch" href="https://analytics.renthub.com" />
</head>
```

---

## 📊 Monitoring & Measurement (Week 4)

### Lighthouse CI (Already Configured)

Run in CI/CD on every PR:
```yaml
# .github/workflows/lighthouse.yml (already exists)
```

### Real User Monitoring (RUM)

**Install web-vitals:**
```bash
npm install web-vitals
```

**Measure Core Web Vitals:**
```typescript
// src/lib/analytics.ts
import { onCLS, onFID, onLCP, onFCP, onTTFB } from 'web-vitals';

function sendToAnalytics(metric: any) {
  // Send to your analytics service
  fetch('/api/analytics/web-vitals', {
    method: 'POST',
    body: JSON.stringify(metric),
  });
}

onCLS(sendToAnalytics);
onFID(sendToAnalytics);
onLCP(sendToAnalytics);
onFCP(sendToAnalytics);
onTTFB(sendToAnalytics);
```

### Performance Budget

**Already configured in `lighthouse-budget.json`:**
```json
{
  "resourceSizes": [
    { "resourceType": "script", "budget": 500 },
    { "resourceType": "stylesheet", "budget": 100 },
    { "resourceType": "image", "budget": 1000 },
    { "resourceType": "total", "budget": 1800 }
  ],
  "timings": [
    { "metric": "first-contentful-paint", "budget": 1800 },
    { "metric": "largest-contentful-paint", "budget": 2500 },
    { "metric": "total-blocking-time", "budget": 200 }
  ]
}
```

---

## ✅ Implementation Checklist

### Week 1: Quick Wins
- [ ] Enable Brotli compression (Nginx)
- [ ] Add lazy loading to images
- [ ] Implement route-based code splitting
- [ ] Optimize Vite build configuration
- [ ] Run bundle analyzer, identify large dependencies

### Week 2: Core Optimizations
- [ ] Convert images to WebP/AVIF
- [ ] Implement responsive images
- [ ] Optimize font loading (preload + swap)
- [ ] Extract critical CSS
- [ ] Add HTTP cache headers

### Week 3: Advanced Features
- [ ] Implement service worker
- [ ] Add database indexes
- [ ] Optimize database queries (N+1 prevention)
- [ ] Defer third-party scripts
- [ ] Add preconnect/DNS prefetch

### Week 4: Monitoring & Polish
- [ ] Configure Real User Monitoring
- [ ] Set up performance dashboards
- [ ] Review Lighthouse CI results
- [ ] Fine-tune based on metrics
- [ ] Document performance wins

---

## 🎯 Success Metrics

| Metric | Before | After Week 1 | After Week 2 | After Week 4 |
|--------|--------|--------------|--------------|--------------|
| Performance Score | 82 | 87 (+5) | 92 (+5) | 95+ (+3) |
| LCP | 4s | 3.2s | 2.6s | < 2.5s |
| FID | 150ms | 120ms | 90ms | < 100ms |
| CLS | 0.15 | 0.12 | 0.08 | < 0.1 |
| Bundle Size | 850KB | 510KB (-40%) | 420KB (-50%) | < 400KB |

---

## 📚 Resources

- [Web.dev Performance Guide](https://web.dev/performance/)
- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
- [Vite Performance Guide](https://vitejs.dev/guide/performance.html)
- [Core Web Vitals](https://web.dev/vitals/)
- [Full Performance Analysis](./Lighthouse-Analysis.md)

---

**Last Updated**: October 24, 2025  
**Next Review**: After each phase completion  
**Owner**: Frontend Team Lead
