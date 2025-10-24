# CI/CD Setup Guide for RentHub

This guide explains how to set up the complete CI/CD pipeline for the RentHub platform.

## 📋 Table of Contents
- [Overview](#overview)
- [GitHub Actions Workflows](#github-actions-workflows)
- [Secrets Configuration](#secrets-configuration)
- [Deployment Environments](#deployment-environments)
- [Docker Deployment](#docker-deployment)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

RentHub uses GitHub Actions for CI/CD automation with three main workflows:

1. **build.yml** - Build and test frontend + backend
2. **deploy.yml** - Deploy to staging/production
3. **lighthouse.yml** - Performance monitoring
4. **tests.yml** - Comprehensive test suite

## 🔧 GitHub Actions Workflows

### 1. Build Workflow (`build.yml`)

**Triggers:**
- Push to `main`, `develop`, `staging` branches
- Pull requests to `main`, `develop`
- Manual workflow dispatch

**Jobs:**
- **frontend-build**: Build React app, run linter, TypeScript check, unit tests
- **backend-build**: Build Laravel app, run PHPUnit tests, migrations
- **security-scan**: npm audit + composer audit
- **build-summary**: Generate summary and comment on PRs

**Artifacts:**
- Frontend dist files
- Bundle analysis report
- Test coverage reports
- Security scan results

### 2. Deploy Workflow (`deploy.yml`)

**Triggers:**
- Push to `main` branch
- Version tags (v*)
- Manual workflow dispatch (choose environment)

**Jobs:**
- **build-frontend**: Build production React app
- **build-backend**: Build production Laravel app with optimizations
- **deploy**: Deploy to server via SSH
- **health-check**: Verify deployment success

**Features:**
- Automatic backups before deployment
- Zero-downtime deployment with symlinks
- Automatic rollback on failure
- Post-deployment health checks
- Keeps last 5 releases and 10 backups

### 3. Lighthouse Workflow (`lighthouse.yml`)

**Triggers:**
- Push to `main`
- Pull requests to `main`
- Daily at 2 AM UTC
- Manual dispatch

**Features:**
- Audits 3 URLs with 3 runs each
- Performance budget enforcement
- Artifact storage for reports
- PR comments with results

### 4. Tests Workflow (`tests.yml`)

**Jobs:**
- Backend tests (PHPUnit)
- Frontend tests (Vitest)
- E2E tests (Playwright)
- Code quality checks

## 🔐 Secrets Configuration

### Required Secrets

Navigate to: `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

#### Deployment Secrets
```
DEPLOY_HOST              # Server hostname or IP
DEPLOY_USER              # SSH username
DEPLOY_SSH_KEY           # Private SSH key for deployment
DEPLOY_PORT              # SSH port (default: 22)
```

#### Application Secrets
```
APP_KEY                  # Laravel application key (base64:...)
DB_PASSWORD              # Database password
REDIS_PASSWORD           # Redis password
VITE_API_URL            # API URL for frontend
VITE_VAPID_PUBLIC_KEY   # Push notifications public key
```

#### Email Configuration
```
MAIL_HOST                # SMTP host
MAIL_PORT                # SMTP port
MAIL_USERNAME            # SMTP username
MAIL_PASSWORD            # SMTP password
MAIL_FROM_ADDRESS        # From email address
```

### Repository Variables

Navigate to: `Settings` → `Secrets and variables` → `Actions` → `Variables`

```
APP_DIR=/var/www/renthub    # Application directory on server
APP_URL=https://renthub.com  # Application URL
```

## 🌍 Deployment Environments

### Setting Up Environments

1. Go to `Settings` → `Environments`
2. Create environments: `staging` and `production`
3. Configure environment-specific variables and secrets

### Staging Environment

**Purpose:** Testing before production
**URL:** https://staging.renthub.com
**Auto-deploy:** On push to `develop` branch

**Variables:**
```
APP_URL=https://staging.renthub.com
APP_DIR=/var/www/renthub-staging
```

### Production Environment

**Purpose:** Live application
**URL:** https://renthub.com
**Auto-deploy:** On push to `main` branch
**Protection:** Require approval before deployment

**Variables:**
```
APP_URL=https://renthub.com
APP_DIR=/var/www/renthub
```

**Protection Rules:**
1. Go to environment settings
2. Enable "Required reviewers"
3. Add team members who can approve deployments
4. Enable "Wait timer" (optional, e.g., 5 minutes)

## 🐳 Docker Deployment

### Prerequisites

1. Install Docker and Docker Compose on server
2. Clone repository
3. Create `.env` file from `.env.example`

### Build and Run

```bash
# Build images
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down
```

### Environment Variables

Create `.env` file in project root:

```env
# Application
APP_NAME=RentHub
APP_ENV=production
APP_KEY=base64:your-app-key-here
APP_DEBUG=false
APP_URL=https://renthub.com

# Database
DB_DATABASE=renthub
DB_USERNAME=renthub
DB_PASSWORD=your-secure-password

# Redis
REDIS_PASSWORD=your-redis-password

# Email
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=587
MAIL_USERNAME=your-username
MAIL_PASSWORD=your-password
MAIL_FROM_ADDRESS=noreply@renthub.com
MAIL_FROM_NAME=RentHub

# Frontend
VITE_API_URL=https://renthub.com/api
VITE_VAPID_PUBLIC_KEY=your-vapid-public-key
```

### SSL Certificates

Place SSL certificates in `./ssl/` directory:

```
./ssl/
  ├── fullchain.pem
  └── privkey.pem
```

Update nginx configuration to use SSL:

```nginx
server {
    listen 443 ssl http2;
    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    # ... rest of config
}
```

### Database Backups

Automated backup script:

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
CONTAINER="renthub-database"
DB_NAME="renthub"
DB_USER="renthub"

# Create backup
docker exec $CONTAINER pg_dump -U $DB_USER $DB_NAME | gzip > "$BACKUP_DIR/backup_$TIMESTAMP.sql.gz"

# Keep only last 30 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

echo "Backup completed: backup_$TIMESTAMP.sql.gz"
```

Add to crontab:
```
0 2 * * * /path/to/backup.sh
```

## 📊 Monitoring

### Health Checks

**Frontend:** `curl https://renthub.com/health`
**Backend:** `curl https://renthub.com/api/health`

### Docker Container Status

```bash
docker-compose -f docker-compose.prod.yml ps
```

### Logs

```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f frontend
docker-compose -f docker-compose.prod.yml logs -f backend
```

### Resource Usage

```bash
docker stats
```

## 🔍 Troubleshooting

### Build Failures

**Frontend build fails:**
```bash
cd Renthub
npm ci
npm run build
# Check error messages
```

**Backend build fails:**
```bash
cd Rental-Platform-main/backend
composer install
php artisan config:clear
```

### Deployment Failures

**SSH connection fails:**
- Verify `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY`
- Test SSH connection: `ssh user@host -i private_key`
- Check firewall rules on server

**Permission errors:**
- Ensure deploy user has write access to app directory
- Check file ownership: `chown -R www-data:www-data /var/www/renthub`
- Set correct permissions: `chmod -R 755 /var/www/renthub`

**Migration fails:**
- Check database connection
- Verify database credentials in `.env`
- Run migrations manually: `php artisan migrate --force`

### Docker Issues

**Container won't start:**
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs service-name

# Rebuild container
docker-compose -f docker-compose.prod.yml build --no-cache service-name
docker-compose -f docker-compose.prod.yml up -d
```

**Database connection issues:**
```bash
# Check if database container is running
docker ps | grep database

# Connect to database
docker exec -it renthub-database psql -U renthub -d renthub
```

**Port conflicts:**
```bash
# Find process using port
lsof -i :80
lsof -i :8000

# Kill process or change ports in docker-compose
```

### Rollback Deployment

**Manual rollback:**
```bash
ssh user@host
cd /var/www/renthub
# List releases
ls -l releases/
# Switch to previous release
rm current
ln -s releases/PREVIOUS_TIMESTAMP current
# Reload services
sudo systemctl reload php8.2-fpm nginx
```

**Restore from backup:**
```bash
cd /var/www/renthub/backups
# Find latest backup
ls -lt | head -5
# Extract backup
tar -xzf backup_TIMESTAMP.tar.gz -C ../rollback/
# Switch to rollback
cd ..
rm current
ln -s rollback/current current
```

## 🚀 Quick Commands

### Deploy to Staging
```bash
# Via GitHub UI
Actions → Deploy to Production → Run workflow → Select "staging"

# Via API
curl -X POST \
  -H "Authorization: token YOUR_GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/OWNER/REPO/actions/workflows/deploy.yml/dispatches \
  -d '{"ref":"main","inputs":{"environment":"staging"}}'
```

### Deploy to Production
```bash
# Push to main (auto-deploy)
git push origin main

# Or tag release
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0

# Or manual dispatch
Actions → Deploy to Production → Run workflow → Select "production"
```

### Run Tests
```bash
# Automatically runs on PR
# Or manual
Actions → Test Suite → Run workflow
```

### Run Lighthouse
```bash
# Automatically runs daily
# Or manual
Actions → Lighthouse Performance Audit → Run workflow
```

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Laravel Deployment](https://laravel.com/docs/deployment)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [PostgreSQL Backups](https://www.postgresql.org/docs/current/backup.html)

---

**Need help?** Check the [Troubleshooting](#troubleshooting) section or contact the DevOps team.
