# 🏗️ Project Structure & Organization Guide

**Complete guide to the RentHub project architecture and file organization**

---

## 📁 Project Overview

### Repository Structure

```
filament/
├── Rental-Platform-main/      # Laravel 12 + Filament Backend
├── Renthub/                   # React 19 + TypeScript Frontend
├── lighthouse-reports/        # Performance audit reports
├── .github/workflows/         # CI/CD workflows
└── Documentation/             # Project documentation
```

---

## 🎯 Backend Structure (Laravel 12 + Filament)

### Root Directory: `Rental-Platform-main/`

```
Rental-Platform-main/
├── backend/                   # Laravel application
│   ├── app/                  # Application code
│   │   ├── Filament/         # Filament admin panel
│   │   │   ├── Resources/    # Admin CRUD resources
│   │   │   ├── Pages/        # Custom admin pages
│   │   │   └── Widgets/      # Dashboard widgets
│   │   ├── Http/
│   │   │   ├── Controllers/  # API & web controllers
│   │   │   ├── Middleware/   # HTTP middleware
│   │   │   └── Requests/     # Form requests
│   │   ├── Models/           # Eloquent models
│   │   ├── Policies/         # Authorization policies
│   │   └── Services/         # Business logic services
│   │
│   ├── config/               # Configuration files
│   │   ├── filament.php      # Filament config
│   │   ├── database.php      # Database config
│   │   └── app.php           # App config
│   │
│   ├── database/
│   │   ├── migrations/       # Database migrations
│   │   ├── seeders/          # Database seeders
│   │   └── factories/        # Model factories
│   │
│   ├── routes/
│   │   ├── api.php           # API routes
│   │   ├── web.php           # Web routes
│   │   └── console.php       # Console routes
│   │
│   ├── resources/
│   │   ├── views/            # Blade templates
│   │   └── lang/             # Translations
│   │
│   ├── storage/
│   │   ├── app/              # Application storage
│   │   ├── framework/        # Framework files
│   │   └── logs/             # Log files
│   │
│   ├── tests/
│   │   ├── Feature/          # Feature tests
│   │   └── Unit/             # Unit tests
│   │
│   ├── composer.json         # PHP dependencies
│   └── artisan               # Laravel CLI
│
├── deployment/               # Deployment configs
├── docker-compose.yml        # Docker setup
└── README.md                # Backend documentation
```

### Key Backend Files

| File/Directory | Purpose | When to Modify |
|---------------|---------|----------------|
| `app/Filament/Resources/` | Admin CRUD interfaces | Adding/editing admin features |
| `app/Http/Controllers/` | API endpoints | Adding new API routes |
| `app/Models/` | Database models | Changing data structure |
| `database/migrations/` | Database schema | Schema changes |
| `config/filament.php` | Filament settings | Admin panel customization |
| `routes/api.php` | API routing | Adding new endpoints |

---

## ⚛️ Frontend Structure (React 19 + TypeScript)

### Root Directory: `Renthub/`

```
Renthub/
├── src/                      # Source code
│   ├── components/           # React components
│   │   ├── ui/              # Reusable UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   ├── layout/          # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── property/        # Property-specific components
│   │   │   ├── PropertyCard.tsx
│   │   │   ├── PropertyGrid.tsx
│   │   │   └── PropertyDetail.tsx
│   │   └── common/          # Common components
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorBoundary.tsx
│   │       └── OptimizedImage.tsx
│   │
│   ├── pages/               # Page components (route-level)
│   │   ├── HomePage.tsx
│   │   ├── PropertyPage.tsx
│   │   ├── SearchPage.tsx
│   │   ├── DashboardPage.tsx
│   │   └── ProfilePage.tsx
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useProperties.ts
│   │   ├── usePrefetch.ts
│   │   └── useDebounce.ts
│   │
│   ├── lib/                 # Utilities and helpers
│   │   ├── api.ts          # API client
│   │   ├── utils.ts        # Utility functions
│   │   ├── constants.ts    # Constants
│   │   └── seedData.ts     # Mock data (dev only)
│   │
│   ├── store/              # State management
│   │   ├── auth.ts
│   │   ├── properties.ts
│   │   └── filters.ts
│   │
│   ├── types/              # TypeScript definitions
│   │   ├── property.ts
│   │   ├── user.ts
│   │   └── api.ts
│   │
│   ├── styles/             # Global styles
│   │   ├── index.css       # Global CSS
│   │   └── themes.css      # Theme variables
│   │
│   ├── utils/              # Utility functions
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── performanceMonitor.ts
│   │
│   ├── workers/            # Web Workers
│   │   └── propertyFilter.worker.ts
│   │
│   ├── App.tsx             # Root component
│   ├── main.tsx            # Entry point
│   └── vite-env.d.ts       # Vite type definitions
│
├── public/                 # Static assets
│   ├── images/            # Image assets
│   │   ├── hero.jpg
│   │   ├── hero.webp
│   │   └── hero.avif
│   ├── fonts/             # Font files
│   │   └── inter-var.woff2
│   ├── icons/             # Icon files
│   └── favicon.ico
│
├── lighthouse-reports/     # Lighthouse audit reports
│   ├── baseline/          # Initial audit
│   ├── phase1/            # After quick wins
│   ├── phase2/            # After core optimizations
│   └── final/             # Final audit
│
├── dist/                  # Production build output
│   ├── assets/           # Bundled assets
│   ├── index.html        # Entry HTML
│   └── stats.html        # Bundle analyzer report
│
├── .github/              # GitHub configurations
│   └── workflows/        # GitHub Actions
│       └── lighthouse.yml
│
├── node_modules/         # NPM dependencies (gitignored)
│
├── index.html            # HTML template
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript config
├── tailwind.config.js    # Tailwind CSS config
├── package.json          # NPM dependencies
├── .env.example          # Environment variables template
└── README.md            # Frontend documentation
```

### Key Frontend Files

| File/Directory | Purpose | When to Modify |
|---------------|---------|----------------|
| `src/App.tsx` | Main app component, routing | Adding new routes |
| `src/main.tsx` | Entry point | App initialization |
| `vite.config.ts` | Build configuration | Performance optimization |
| `src/components/ui/` | UI component library | UI changes |
| `src/pages/` | Page-level components | New pages/features |
| `src/hooks/` | Custom React hooks | Reusable logic |
| `src/lib/api.ts` | API client | API integration |
| `tailwind.config.js` | Styling configuration | Theme/design changes |
| `package.json` | Dependencies | Adding packages |

---

## 📊 Performance & Documentation Files

### Lighthouse Documentation

```
Root Level Documentation:
├── LIGHTHOUSE_README.md           # Navigation hub (START HERE!)
├── Lighthouse-Analysis.md         # Technical analysis (16 issues)
├── Lighthouse-Final-Report.md     # Complete report
├── LIGHTHOUSE_QUICK_START.md      # Implementation guide
├── PERFORMANCE_ROI.md             # Business case & ROI
└── PROJECT_STRUCTURE.md           # This file

Performance Reports:
lighthouse-reports/
├── baseline/
│   ├── report.html               # HTML report
│   ├── report.json               # JSON data
│   └── score.txt                # Score summary
├── phase1/
├── phase2/
└── final/
```

### Existing Documentation

```
Backend Documentation (Rental-Platform-main/):
├── README.md                     # Main backend docs
├── ADMIN_QUICK_START.md         # Admin panel guide
├── API_AUTH_DOCUMENTATION.md    # API authentication
├── AUTHENTICATION_IMPLEMENTATION.md
├── FILAMENT_ADMIN_TESTING_GUIDE.md
├── FRONTEND_INTEGRATION_GUIDE.md
├── IMPLEMENTATION_GUIDE.md
├── PRODUCTION_DEPLOYMENT_GUIDE.md
├── PROJECT_ROADMAP.md
└── TEST_RESULTS.md

Frontend Documentation (Renthub/):
├── README.md                     # Main frontend docs
├── LIGHTHOUSE_FIXES.md          # Previous optimizations
├── API_INTEGRATION_GUIDE.md
├── CHATBOT_IMPLEMENTATION.md
├── EMAIL_SERVICE_GUIDE.md
├── MULTI_CURRENCY_GUIDE.md
├── SEO_README.md
└── SMS_NOTIFICATIONS_GUIDE.md
```

---

## 🔧 Configuration Files

### Vite Configuration (`Renthub/vite.config.ts`)

**Purpose**: Build tool configuration  
**Key Settings**:
- Plugins (React, compression, image optimization)
- Build options (minification, chunking)
- Server configuration (port, proxy)
- Performance optimizations

```typescript
export default defineConfig({
  plugins: [...],
  build: {
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {...}
      }
    }
  }
})
```

### TypeScript Configuration (`Renthub/tsconfig.json`)

**Purpose**: TypeScript compiler options  
**Key Settings**:
- Compiler options
- Path aliases
- Module resolution
- Type checking strictness

### Tailwind Configuration (`Renthub/tailwind.config.js`)

**Purpose**: Tailwind CSS customization  
**Key Settings**:
- Content paths (for purging)
- Theme customization
- Plugin configuration
- Color scheme

### Package.json (`Renthub/package.json`)

**Purpose**: Project dependencies and scripts  
**Key Scripts**:
```json
{
  "dev": "vite --port 5173",
  "build": "tsc && vite build",
  "preview": "vite preview",
  "lint": "eslint .",
  "lighthouse": "lhci autorun"
}
```

---

## 🚀 CI/CD & Automation

### GitHub Actions Workflow

```
.github/workflows/
├── lighthouse.yml         # Performance audits
├── ci.yml                # Main CI pipeline (if exists)
└── deploy.yml            # Deployment pipeline (if exists)
```

### Lighthouse CI Configuration

**File**: `.lighthouserc.js` (to be created)

```javascript
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:5173'],
      numberOfRuns: 3
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        'categories:performance': ['warn', { minScore: 0.9 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }]
      }
    },
    upload: {
      target: 'filesystem',
      outputDir: './lighthouse-reports'
    }
  }
}
```

---

## 🗄️ Data Flow Architecture

### Frontend → Backend Communication

```
User Action (Frontend)
  ↓
React Component
  ↓
Custom Hook (useProperties)
  ↓
API Client (src/lib/api.ts)
  ↓
HTTP Request (Axios)
  ↓
Laravel API Route (routes/api.php)
  ↓
Controller (app/Http/Controllers/)
  ↓
Service Layer (app/Services/)
  ↓
Model (app/Models/)
  ↓
Database (MySQL/PostgreSQL)
  ↓
Response (JSON)
  ↓
Frontend State Update
  ↓
UI Re-render
```

### File Upload Flow

```
User Selects File
  ↓
OptimizedImage Component
  ↓
Image Optimization (client-side)
  ↓
Upload to /api/upload
  ↓
Laravel Controller
  ↓
Intervention Image Processing
  ↓
Storage (S3/Local)
  ↓
URL returned to frontend
```

---

## 📦 Build & Deployment

### Development Build

```bash
# Frontend (Renthub)
cd Renthub
npm run dev          # Dev server on :5173

# Backend (Rental-Platform-main/backend)
cd Rental-Platform-main/backend
php artisan serve    # Dev server on :8000
```

### Production Build

```bash
# Frontend
cd Renthub
npm run build        # Output: dist/

# Backend
cd Rental-Platform-main/backend
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Build Output Structure

```
Renthub/dist/
├── index.html
├── assets/
│   ├── index-[hash].js       # Main bundle
│   ├── index-[hash].css      # Main styles
│   ├── react-vendor-[hash].js
│   ├── radix-ui-[hash].js
│   ├── charts-[hash].js
│   ├── *.gz                  # Gzip compressed
│   └── *.br                  # Brotli compressed
├── images/                   # Optimized images
└── fonts/                    # Font files
```

---

## 🔍 Important Directories Explained

### `/src/components/ui/`
**Purpose**: Reusable UI components (shadcn/ui style)  
**Usage**: Import and use across the app  
**Examples**: Button, Card, Dialog, Input

### `/src/pages/`
**Purpose**: Route-level page components  
**Usage**: Lazy-loaded by React Router  
**Examples**: HomePage, PropertyPage, DashboardPage

### `/src/hooks/`
**Purpose**: Custom React hooks for reusable logic  
**Usage**: Import in components for shared functionality  
**Examples**: useAuth, useDebounce, usePrefetch

### `/src/lib/`
**Purpose**: Utility functions and helpers  
**Usage**: Non-React utilities and helpers  
**Examples**: API client, formatters, constants

### `/src/types/`
**Purpose**: TypeScript type definitions  
**Usage**: Import types for type safety  
**Examples**: Property, User, ApiResponse

### `/public/`
**Purpose**: Static assets served as-is  
**Usage**: Place images, fonts, icons here  
**Note**: Files copied to dist/ without processing

### `/lighthouse-reports/`
**Purpose**: Performance audit reports  
**Usage**: Track performance over time  
**Note**: Git ignore except baseline/

---

## 🎯 Quick Reference

### Where to Put New Files

| File Type | Location | Example |
|-----------|----------|---------|
| New page | `src/pages/` | `NewPage.tsx` |
| Reusable component | `src/components/ui/` | `NewComponent.tsx` |
| Feature component | `src/components/[feature]/` | `PropertyMap.tsx` |
| Custom hook | `src/hooks/` | `useCustomHook.ts` |
| API endpoint (BE) | `app/Http/Controllers/` | `NewController.php` |
| Database table (BE) | `database/migrations/` | `create_table.php` |
| Type definition | `src/types/` | `newType.ts` |
| Utility function | `src/lib/` or `src/utils/` | `newUtil.ts` |
| Style file | `src/styles/` | `newStyle.css` |
| Image | `public/images/` | `image.jpg` |

### Where to Make Changes

| Task | Files to Modify |
|------|-----------------|
| Add route | `src/App.tsx`, `src/pages/[NewPage].tsx` |
| Optimize performance | `vite.config.ts` |
| Change theme | `tailwind.config.js`, `src/styles/` |
| Add API endpoint (BE) | `routes/api.php`, `app/Http/Controllers/` |
| Database change (BE) | Create migration in `database/migrations/` |
| Add admin feature (BE) | `app/Filament/Resources/` |
| Add dependency | `package.json` (npm install) |
| Environment config | `.env` (copy from `.env.example`) |

---

## 📚 Additional Resources

### Internal Documentation
- [LIGHTHOUSE_README.md](./LIGHTHOUSE_README.md) - Performance hub
- [Lighthouse-Analysis.md](./Lighthouse-Analysis.md) - Technical analysis
- [LIGHTHOUSE_QUICK_START.md](./LIGHTHOUSE_QUICK_START.md) - Implementation guide

### External Resources
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Laravel Documentation](https://laravel.com/docs)
- [Filament Documentation](https://filamentphp.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)

---

## 🔄 File Naming Conventions

### Frontend (React/TypeScript)

```
Components:        PascalCase.tsx    (PropertyCard.tsx)
Hooks:            camelCase.ts      (useAuth.ts)
Utilities:        camelCase.ts      (formatPrice.ts)
Types:            camelCase.ts      (property.ts)
Constants:        UPPER_SNAKE.ts    (API_ENDPOINTS.ts)
```

### Backend (Laravel/PHP)

```
Controllers:      PascalCase        (PropertyController.php)
Models:           PascalCase        (Property.php)
Migrations:       snake_case        (create_properties_table.php)
Services:         PascalCase        (PropertyService.php)
Config:           snake_case        (database.php)
```

---

## 🗂️ Git Ignore Rules

**Files/Directories NOT committed**:

```
# Dependencies
node_modules/
vendor/

# Build output
dist/
build/

# Environment
.env
.env.local

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
*.log

# Reports (except baseline)
lighthouse-reports/*
!lighthouse-reports/baseline/

# Temp files
*.tmp
*.temp
```

---

**Last Updated**: October 24, 2025  
**Maintainer**: Development Team  
**Version**: 1.0
