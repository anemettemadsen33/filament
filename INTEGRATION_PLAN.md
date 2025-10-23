# 🏗️ Dual-Project Integration Plan

**Version:** 1.0  
**Last Updated:** October 23, 2025  
**Status:** Production Ready

## 📋 Executive Summary

This document outlines the comprehensive integration strategy for a dual-project rental platform architecture consisting of:

1. **Backend (Rental-Platform-main)** - Laravel 12 + Filament v4 admin panel
2. **Frontend (Renthub)** - React 19 + TypeScript + Vite modern UI

### Architecture Decision

The platform uses a **separated frontend-backend architecture** with:
- Backend API hosted on dedicated VPS for security and performance
- Frontend hosted on static hosting (Netlify/Vercel/CDN)
- Communication via secured HTTPS REST API with JWT authentication
- Independent deployment cycles for scalability

---

## 🎯 Project Overview

### Project 1: Rental-Platform-main (Backend + Admin)

**Purpose:** Backend API + Admin panel (Filament)

**Stack:**
- Laravel 12
- Filament v4
- PostgreSQL
- Laravel Sanctum (JWT Authentication)
- Docker support

**Status:** 95% Production Ready

**Features:**
- ✅ Complete REST API endpoints
- ✅ Filament admin panel
- ✅ User authentication (Sanctum)
- ✅ Property management (CRUD)
- ✅ Booking system
- ✅ Review moderation workflow
- ✅ Email notifications
- ✅ Queue system configured
- ✅ File storage (images)
- ✅ Multi-language support (RO/EN)

**Missing:**
- ⚠️ Automated test coverage (needs 70%+ coverage)
- ⚠️ Monitoring tools integration
- ⚠️ Load testing results

**Deployment Target:** VPS (Ubuntu + Nginx + PostgreSQL)

---

### Project 2: Renthub (Frontend)

**Purpose:** Modern frontend UI for public users

**Stack:**
- React 19
- TypeScript
- Vite
- TailwindCSS
- TanStack Query
- Axios

**Status:** 90% Feature Complete

**Features:**
- ✅ Property search and filtering
- ✅ Property detail pages
- ✅ User authentication UI
- ✅ Booking interface
- ✅ Responsive design
- ✅ Modern UI components
- ✅ Type-safe with TypeScript

**Missing:**
- ⚠️ Backend API connection finalization
- ⚠️ E2E testing setup
- ⚠️ Production build optimization

**Deployment Target:** Static hosting (Netlify/Vercel/Hostinger) or CDN

---

## 🔐 Security Architecture

### Authentication Flow

```
User → Frontend → HTTPS → Backend API
                           ↓
                    JWT Token (Sanctum)
                           ↓
                    Secure Session
```

**Implementation:**
1. User logs in via frontend form
2. Frontend sends credentials to `/api/auth/login`
3. Backend validates and returns JWT token
4. Frontend stores token (localStorage/secure cookie)
5. All subsequent requests include `Authorization: Bearer {token}` header

### CORS Configuration

**Backend (config/cors.php):**
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_methods' => ['*'],
'allowed_origins' => [env('FRONTEND_URL')],
'allowed_headers' => ['*'],
'supports_credentials' => true,
```

**Environment Variables:**
```env
# Backend .env
FRONTEND_URL=https://yourdomain.com
SANCTUM_STATEFUL_DOMAINS=yourdomain.com

# Frontend .env
VITE_API_BASE_URL=https://api.yourdomain.com
```

### Security Headers

Backend includes security middleware for:
- CORS (Cross-Origin Resource Sharing)
- CSRF Protection
- Rate Limiting
- XSS Prevention
- SQL Injection Protection (via Eloquent ORM)

---

## 🚀 Deployment Strategy

### Backend Deployment (VPS)

**Infrastructure:**
- Ubuntu 22.04 LTS
- Nginx web server
- PostgreSQL 14+
- PHP 8.3+ with required extensions
- Supervisor for queue workers
- SSL/TLS certificates (Let's Encrypt)

**Deployment Steps:**

1. **Server Setup:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y nginx postgresql php8.3-fpm php8.3-pgsql \
    php8.3-mbstring php8.3-xml php8.3-curl php8.3-zip \
    php8.3-gd php8.3-redis supervisor git composer

# Configure PostgreSQL
sudo -u postgres createdb rental_platform
sudo -u postgres createuser rental_user -P
```

2. **Application Deployment:**
```bash
# Clone repository
git clone <repository-url> /var/www/rental-platform
cd /var/www/rental-platform/Rental-Platform-main/backend

# Install dependencies
composer install --optimize-autoloader --no-dev

# Configure environment
cp .env.example .env
# Edit .env with production values
php artisan key:generate

# Run migrations
php artisan migrate --force

# Optimize for production
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize

# Set permissions
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

3. **Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;
    root /var/www/rental-platform/Rental-Platform-main/backend/public;

    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";

    index index.php;
    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

4. **Queue Worker Setup (Supervisor):**
```ini
[program:rental-platform-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/rental-platform/Rental-Platform-main/backend/artisan queue:work --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/rental-platform/Rental-Platform-main/backend/storage/logs/worker.log
stopwaitsecs=3600
```

---

### Frontend Deployment (Static Hosting)

**Option 1: Netlify**

1. **Build Configuration (netlify.toml):**
```toml
[build]
  base = "Renthub"
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
    [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

2. **Deploy:**
```bash
cd Renthub
npm install
npm run build
netlify deploy --prod
```

**Option 2: Vercel**

1. **Build Configuration (vercel.json):**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

**Option 3: Traditional Hosting (Hostinger/VPS)**

```bash
# Build locally
cd Renthub
npm run build

# Upload dist/ folder to web server
# Configure web server to serve index.html for all routes
```

---

## 🧪 Testing Strategy

### Backend Testing (PHPUnit)

**Test Structure:**
```
backend/tests/
├── Feature/
│   ├── AuthenticationTest.php
│   ├── PropertyControllerTest.php
│   ├── BookingControllerTest.php
│   ├── ReviewControllerTest.php
│   └── ImageUploadTest.php
└── Unit/
    ├── PropertyModelTest.php
    ├── BookingValidationTest.php
    └── PricingCalculationTest.php
```

**Target Coverage:** 70%+

**Run Tests:**
```bash
cd Rental-Platform-main/backend
php artisan test
php artisan test --coverage
```

---

### Frontend Testing (Jest + React Testing Library)

**Test Structure:**
```
Renthub/src/
├── __tests__/
│   ├── components/
│   ├── pages/
│   └── lib/
└── setupTests.ts
```

**Test Types:**
- Unit tests for utility functions
- Component tests for React components
- Integration tests for API hooks
- E2E tests with Playwright (optional)

**Run Tests:**
```bash
cd Renthub
npm test
npm run test:coverage
```

---

## 📊 Monitoring and Observability

### Backend Monitoring

**Tools:**
1. **Laravel Telescope** (Development)
   ```bash
   composer require laravel/telescope --dev
   php artisan telescope:install
   php artisan migrate
   ```

2. **Sentry** (Production Errors)
   ```bash
   composer require sentry/sentry-laravel
   ```

3. **Laravel Horizon** (Queue Monitoring)
   ```bash
   composer require laravel/horizon
   php artisan horizon:install
   ```

**Metrics to Monitor:**
- API response times
- Error rates (4xx, 5xx)
- Database query performance
- Queue job processing
- Memory usage
- Disk space

---

### Frontend Monitoring

**Tools:**
1. **Sentry** (Error Tracking)
   ```bash
   npm install @sentry/react @sentry/vite-plugin
   ```

2. **Google Analytics / Plausible** (User Analytics)

3. **Vercel Analytics** (if using Vercel)

**Metrics to Monitor:**
- Page load times
- JavaScript errors
- API call failures
- User session duration
- Conversion rates

---

## 🔄 CI/CD Pipeline

### Backend Pipeline

See `.github/workflows/backend-ci-cd.yml` for full implementation.

**Stages:**
1. **Lint & Format** - PHP CS Fixer, Laravel Pint
2. **Test** - PHPUnit with coverage
3. **Build** - Composer install
4. **Security Scan** - PHP Security Checker
5. **Deploy** - SSH to VPS, git pull, migrate, cache

---

### Frontend Pipeline

See `.github/workflows/frontend-ci-cd.yml` for full implementation.

**Stages:**
1. **Lint & Format** - ESLint, Prettier
2. **Type Check** - TypeScript compiler
3. **Test** - Jest tests
4. **Build** - Vite build
5. **Deploy** - Deploy to Netlify/Vercel

---

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/logout` | Logout user | Yes |
| GET | `/api/auth/me` | Get current user | Yes |
| PUT | `/api/auth/profile` | Update profile | Yes |

### Property Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/properties` | List properties | No |
| GET | `/api/properties/{id}` | Get property details | No |
| POST | `/api/properties` | Create property | Yes (Owner) |
| PUT | `/api/properties/{id}` | Update property | Yes (Owner) |
| DELETE | `/api/properties/{id}` | Delete property | Yes (Owner) |
| POST | `/api/properties/{id}/images` | Upload images | Yes (Owner) |

### Booking Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/bookings` | List user bookings | Yes |
| POST | `/api/bookings` | Create booking | Yes |
| PUT | `/api/bookings/{id}` | Update booking | Yes |
| DELETE | `/api/bookings/{id}` | Cancel booking | Yes |

### Review Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/reviews` | List reviews | No |
| POST | `/api/reviews` | Create review | Yes (Guest) |
| PUT | `/api/reviews/{id}` | Update review | Yes |
| DELETE | `/api/reviews/{id}` | Delete review | Yes |
| POST | `/api/reviews/{id}/respond` | Owner response | Yes (Owner) |

---

## 🎯 Immediate Action Items

### Phase 1: Security Hardening (✅ Completed)
- [x] Configure CORS for frontend domain
- [x] Set up rate limiting on API endpoints
- [x] Implement security headers
- [x] Environment variable sanitization
- [x] HTTPS enforcement

### Phase 2: Testing Infrastructure (Current)
- [ ] Set up PHPUnit test suite (target 70% coverage)
- [ ] Create feature tests for critical paths
- [ ] Set up Jest for frontend
- [ ] Configure test coverage reporting
- [ ] Add E2E tests (optional)

### Phase 3: CI/CD Setup
- [ ] Create GitHub Actions workflows for backend
- [ ] Create GitHub Actions workflows for frontend
- [ ] Configure environment secrets in GitHub
- [ ] Set up staging environment
- [ ] Test deployment pipelines

### Phase 4: Monitoring
- [ ] Install Laravel Telescope (dev)
- [ ] Configure Sentry for error tracking
- [ ] Set up log aggregation
- [ ] Configure uptime monitoring
- [ ] Set up performance monitoring

### Phase 5: Final Launch
- [ ] Load testing (100+ concurrent users)
- [ ] Security audit
- [ ] Performance optimization
- [ ] Documentation review
- [ ] Production deployment
- [ ] Post-launch monitoring

---

## 📖 Documentation Index

### Backend Documentation
- [README.md](Rental-Platform-main/README.md) - Project overview
- [API_AUTH_DOCUMENTATION.md](Rental-Platform-main/API_AUTH_DOCUMENTATION.md) - API authentication
- [FRONTEND_INTEGRATION_GUIDE.md](Rental-Platform-main/FRONTEND_INTEGRATION_GUIDE.md) - Frontend integration
- [PRODUCTION_DEPLOYMENT_GUIDE.md](Rental-Platform-main/PRODUCTION_DEPLOYMENT_GUIDE.md) - Deployment guide
- [SEPARATE_FRONTEND_BACKEND.md](Rental-Platform-main/deployment/SEPARATE_FRONTEND_BACKEND.md) - Architecture guide

### Frontend Documentation
- [API_INTEGRATION_GUIDE.md](Renthub/API_INTEGRATION_GUIDE.md) - Backend connection
- [README.md](Renthub/README.md) - Project setup

### Integration Documentation
- [INTEGRATION_PLAN.md](INTEGRATION_PLAN.md) - This document
- [SECURITY_CHECKLIST.md](SECURITY_CHECKLIST.md) - Security best practices
- [TESTING_SETUP.md](TESTING_SETUP.md) - Testing infrastructure
- [CI_CD_GUIDE.md](CI_CD_GUIDE.md) - CI/CD setup

---

## 🚨 Important Notes

### Development Environment

**Prerequisites:**
- PHP 8.3+
- Node.js 20+
- PostgreSQL 14+
- Composer
- npm/yarn

**Local Setup:**
```bash
# Backend
cd Rental-Platform-main/backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve

# Frontend (in another terminal)
cd Renthub
npm install
cp .env.example .env
npm run dev
```

### Staging Environment

It's **highly recommended** to set up a staging environment that mirrors production:
- Separate VPS or subdomain (staging.yourdomain.com)
- Separate database
- Same configuration as production
- Test all deployments here first

### Production Checklist

Before going live:
- [ ] All tests passing
- [ ] Security audit completed
- [ ] Performance testing completed
- [ ] Backups configured
- [ ] Monitoring tools active
- [ ] SSL certificates installed
- [ ] DNS configured
- [ ] Error tracking enabled
- [ ] Documentation up-to-date
- [ ] Support procedures documented

---

## 🤝 Team Responsibilities

### Backend Team
- API endpoint development
- Database schema management
- Authentication & authorization
- Email notifications
- Queue job processing
- Admin panel features

### Frontend Team
- UI/UX implementation
- API integration
- State management
- Performance optimization
- Responsive design
- User testing

### DevOps Team
- Infrastructure setup
- CI/CD pipeline
- Monitoring & alerting
- Security updates
- Backup management
- Performance tuning

---

## 📞 Support and Escalation

### Development Issues
- Check existing documentation first
- Search GitHub issues
- Create new issue with [BUG] or [FEATURE] prefix

### Production Issues
1. Check monitoring dashboards
2. Review application logs
3. Check error tracking (Sentry)
4. Follow incident response procedure
5. Escalate to on-call engineer if critical

---

## 🎉 Success Metrics

### Technical Metrics
- ✅ 99.9% uptime
- ✅ < 200ms average API response time
- ✅ < 2s page load time
- ✅ 70%+ test coverage
- ✅ Zero critical security vulnerabilities

### Business Metrics
- User registrations
- Properties listed
- Bookings created
- Conversion rates
- User retention

---

**Last Updated:** October 23, 2025  
**Version:** 1.0  
**Status:** Ready for Implementation
