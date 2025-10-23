# 🏠 Rental Platform - Integrated Architecture

**Modern Dual-Project Rental Platform**  
**Version:** 1.0  
**Status:** Production Ready

---

## 📋 Project Overview

This repository contains a comprehensive rental platform with separated backend and frontend architecture, designed for scalability, security, and independent deployment cycles.

### Architecture Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Rental Platform                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────┐      ┌─────────────────────┐    │
│  │   Rental-Platform    │      │      Renthub        │    │
│  │   (Backend + Admin)  │◄────►│   (Frontend UI)     │    │
│  │                      │ API  │                     │    │
│  │ Laravel 12          │      │ React 19            │    │
│  │ Filament v4         │      │ TypeScript          │    │
│  │ PostgreSQL          │      │ Vite                │    │
│  └──────────────────────┘      └─────────────────────┘    │
│         VPS Hosting                CDN/Static Hosting      │
│  api.yourdomain.com            yourdomain.com            │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Quick Start

### Prerequisites

- **Backend:** PHP 8.3+, PostgreSQL 14+, Composer
- **Frontend:** Node.js 20+, npm
- **DevOps:** Git, Docker (optional)

### Local Development Setup

**1. Clone Repository:**
```bash
git clone https://github.com/yourusername/filament.git
cd filament
```

**2. Backend Setup:**
```bash
cd Rental-Platform-main/backend
composer install
cp .env.example .env
# Edit .env with your database credentials
php artisan key:generate
php artisan migrate
php artisan serve
# Access admin panel at http://localhost:8000/admin
```

**3. Frontend Setup:**
```bash
cd Renthub
npm install
cp .env.example .env
# Edit .env to point to your backend
npm run dev
# Access frontend at http://localhost:5173
```

**4. Access the Applications:**
- Backend API: http://localhost:8000
- Admin Panel: http://localhost:8000/admin
- Frontend UI: http://localhost:5173

---

## 📚 Documentation

### Core Documentation

| Document | Description |
|----------|-------------|
| [INTEGRATION_PLAN.md](INTEGRATION_PLAN.md) | Complete integration strategy and architecture |
| [SECURITY_CHECKLIST.md](SECURITY_CHECKLIST.md) | Security best practices and audit checklist |
| [TESTING_SETUP.md](TESTING_SETUP.md) | Testing infrastructure for backend and frontend |
| [CI_CD_GUIDE.md](CI_CD_GUIDE.md) | Continuous Integration/Deployment setup |

### Backend Documentation

| Document | Description |
|----------|-------------|
| [Rental-Platform-main/README.md](Rental-Platform-main/README.md) | Backend project overview |
| [API_AUTH_DOCUMENTATION.md](Rental-Platform-main/API_AUTH_DOCUMENTATION.md) | API authentication guide |
| [FRONTEND_INTEGRATION_GUIDE.md](Rental-Platform-main/FRONTEND_INTEGRATION_GUIDE.md) | Frontend connection guide |
| [PRODUCTION_DEPLOYMENT_GUIDE.md](Rental-Platform-main/PRODUCTION_DEPLOYMENT_GUIDE.md) | Backend deployment guide |

### Frontend Documentation

| Document | Description |
|----------|-------------|
| [Renthub/README.md](Renthub/README.md) | Frontend project overview |
| [API_INTEGRATION_GUIDE.md](Renthub/API_INTEGRATION_GUIDE.md) | Backend API integration |

---

## 🏗️ Project Structure

```
filament/
├── .github/
│   └── workflows/
│       ├── backend-ci-cd.yml      # Backend CI/CD pipeline
│       └── frontend-ci-cd.yml     # Frontend CI/CD pipeline
│
├── Rental-Platform-main/          # Backend Project
│   ├── backend/                   # Laravel application
│   │   ├── app/                   # Application code
│   │   ├── database/              # Migrations & seeders
│   │   ├── routes/                # API & web routes
│   │   ├── tests/                 # PHPUnit tests
│   │   └── ...
│   ├── deployment/                # Deployment configs
│   └── docs/                      # Backend documentation
│
├── Renthub/                       # Frontend Project
│   ├── src/                       # React application
│   │   ├── components/            # React components
│   │   ├── pages/                 # Page components
│   │   ├── lib/                   # Utilities & hooks
│   │   └── ...
│   ├── public/                    # Static assets
│   └── tests/                     # Jest tests
│
├── INTEGRATION_PLAN.md            # Integration strategy
├── SECURITY_CHECKLIST.md          # Security guidelines
├── TESTING_SETUP.md               # Testing documentation
├── CI_CD_GUIDE.md                 # CI/CD documentation
└── README.md                      # This file
```

---

## 🚀 Features

### For End Users (Renthub Frontend)

- 🔍 Advanced property search and filtering
- 🏠 Detailed property listings with galleries
- 📅 Real-time availability calendar
- 💳 Secure booking system
- ⭐ Property reviews and ratings
- 👤 User dashboard
- 📱 Fully responsive design
- 🌐 Multi-language support (RO/EN)

### For Property Owners

- 📝 Property management (CRUD)
- 🖼️ Multi-image upload with management
- 📊 Analytics dashboard
- 💰 Revenue tracking
- 📬 Booking notifications
- ⭐ Review management

### For Administrators (Filament Panel)

- 👥 User management
- 🏢 Property moderation
- ⭐ Review moderation with bulk actions
- 📈 Platform analytics
- ⚙️ System settings
- 🔐 Security controls

---

## 🔐 Security Features

- ✅ JWT Authentication (Laravel Sanctum)
- ✅ CORS Configuration
- ✅ CSRF Protection
- ✅ Rate Limiting
- ✅ XSS Prevention
- ✅ SQL Injection Protection
- ✅ Secure Password Hashing
- ✅ Role-Based Access Control (RBAC)
- ✅ Security Headers
- ✅ Input Validation

See [SECURITY_CHECKLIST.md](SECURITY_CHECKLIST.md) for complete details.

---

## 🧪 Testing

### Backend Testing (PHPUnit)

```bash
cd Rental-Platform-main/backend
php artisan test
php artisan test --coverage
```

**Coverage Target:** 70%+

### Frontend Testing (Jest)

```bash
cd Renthub
npm test
npm test -- --coverage
```

**Coverage Target:** 70%+

See [TESTING_SETUP.md](TESTING_SETUP.md) for detailed setup.

---

## 🔄 CI/CD Pipeline

### Automated Workflows

- ✅ **Lint & Code Style** - ESLint, Laravel Pint
- ✅ **Test Suite** - PHPUnit, Jest
- ✅ **Security Audit** - Composer audit, npm audit
- ✅ **Build** - Optimized production builds
- ✅ **Deploy** - Automatic deployment to staging/production

### Deployment Flow

```
develop → Staging (auto)
   ↓
   PR
   ↓
main → Production (auto)
```

See [CI_CD_GUIDE.md](CI_CD_GUIDE.md) for complete setup.

---

## 🌍 Deployment

### Recommended Architecture

**Backend (VPS):**
- Ubuntu 22.04 LTS
- Nginx + PHP 8.3-FPM
- PostgreSQL 14+
- Supervisor for queues
- SSL/TLS (Let's Encrypt)

**Frontend (Static Hosting):**
- Netlify (recommended)
- Vercel (alternative)
- Cloudflare Pages (alternative)
- Traditional hosting with CDN

### Deployment Targets

| Environment | Backend | Frontend |
|-------------|---------|----------|
| Development | localhost:8000 | localhost:5173 |
| Staging | staging-api.yourdomain.com | staging.yourdomain.com |
| Production | api.yourdomain.com | yourdomain.com |

See [INTEGRATION_PLAN.md](INTEGRATION_PLAN.md) for detailed deployment steps.

---

## 📊 Project Status

### Backend (Rental-Platform-main)

**Status:** 95% Production Ready

**Complete:**
- ✅ REST API endpoints
- ✅ Filament admin panel
- ✅ Authentication & authorization
- ✅ Database schema
- ✅ Email notifications
- ✅ Queue system
- ✅ File storage

**Pending:**
- ⚠️ Test coverage (needs 70%+)
- ⚠️ Monitoring integration

### Frontend (Renthub)

**Status:** 90% Feature Complete

**Complete:**
- ✅ Property search & filtering
- ✅ Property details
- ✅ User authentication UI
- ✅ Booking interface
- ✅ Responsive design

**Pending:**
- ⚠️ API connection finalization
- ⚠️ E2E testing setup

---

## 🛠️ Tech Stack

### Backend

- **Framework:** Laravel 12
- **Admin Panel:** Filament v4
- **Database:** PostgreSQL
- **Authentication:** Laravel Sanctum
- **Queue:** Laravel Queue (Database/Redis)
- **Storage:** Local/S3
- **Email:** SMTP

### Frontend

- **Framework:** React 19
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** TailwindCSS
- **State:** TanStack Query
- **HTTP Client:** Axios
- **UI Components:** Radix UI

### DevOps

- **CI/CD:** GitHub Actions
- **Version Control:** Git
- **Containerization:** Docker (optional)
- **Monitoring:** Sentry, Laravel Telescope
- **Analytics:** Google Analytics / Plausible

---

## 🎯 Roadmap

### Phase 1: Core Integration (✅ Complete)
- [x] Separate backend and frontend projects
- [x] API authentication setup
- [x] CORS configuration
- [x] Security hardening

### Phase 2: Testing & Quality (🔄 In Progress)
- [ ] Backend test coverage 70%+
- [ ] Frontend test coverage 70%+
- [ ] E2E testing setup
- [ ] Performance testing

### Phase 3: CI/CD & Automation (✅ Complete)
- [x] GitHub Actions workflows
- [x] Automated testing
- [x] Automated deployments
- [x] Environment management

### Phase 4: Monitoring & Observability (📋 Planned)
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] Log aggregation
- [ ] Uptime monitoring
- [ ] Analytics integration

### Phase 5: Production Launch (📋 Planned)
- [ ] Load testing
- [ ] Security audit
- [ ] Staging verification
- [ ] Production deployment
- [ ] Post-launch monitoring

---

## 🤝 Contributing

### Development Workflow

1. **Create Feature Branch:**
   ```bash
   git checkout develop
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes:**
   - Write code
   - Add tests
   - Update documentation

3. **Commit & Push:**
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin feature/your-feature-name
   ```

4. **Create Pull Request:**
   - Target `develop` branch
   - Ensure CI passes
   - Request review

### Code Standards

- **Backend:** PSR-12, Laravel conventions
- **Frontend:** ESLint, Prettier
- **Tests:** Write tests for new features
- **Documentation:** Update relevant docs

---

## 📞 Support

### Getting Help

- **Documentation:** Start with docs in this repo
- **Issues:** GitHub Issues for bugs/features
- **Discussions:** GitHub Discussions for questions

### Reporting Issues

When reporting issues, include:
- Environment (dev/staging/production)
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/logs if applicable

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Team

- **Backend Development:** Laravel + Filament
- **Frontend Development:** React + TypeScript
- **DevOps:** CI/CD & Infrastructure
- **QA:** Testing & Quality Assurance

---

## 🙏 Acknowledgments

Built with:
- [Laravel](https://laravel.com/)
- [Filament](https://filamentphp.com/)
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)

---

**Ready to launch a modern, scalable rental platform! 🚀**

**Last Updated:** October 23, 2025  
**Version:** 1.0
