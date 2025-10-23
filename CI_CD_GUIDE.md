# 🔄 CI/CD Guide - Rental Platform

**Version:** 1.0  
**Last Updated:** October 23, 2025

## 📋 Overview

This guide explains the Continuous Integration and Continuous Deployment (CI/CD) pipeline for the dual-project rental platform.

---

## 🏗️ Architecture

### Pipeline Structure

```
┌─────────────────┐
│   Git Push      │
│  (main/develop) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  GitHub Actions │
│   Triggered     │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌────────┐
│Backend │ │Frontend│
│Pipeline│ │Pipeline│
└───┬────┘ └───┬────┘
    │          │
    ▼          ▼
┌────────┐ ┌────────┐
│  VPS   │ │Netlify │
│Deploy  │ │ Deploy │
└────────┘ └────────┘
```

---

## 🔧 Backend Pipeline (Laravel)

### Pipeline Stages

**1. Lint & Code Style**
- Runs Laravel Pint for code formatting
- Checks PSR-12 compliance
- Runs PHPStan for static analysis

**2. Test Suite**
- Sets up PostgreSQL test database
- Runs PHPUnit tests
- Generates coverage report (minimum 70%)
- Uploads coverage to Codecov

**3. Security Audit**
- Runs `composer audit`
- Checks for known vulnerabilities
- Security checker for dependencies

**4. Build & Optimize**
- Installs production dependencies
- Optimizes autoloader
- Caches config, routes, and views
- Creates deployment artifact

**5. Deploy**
- **Staging:** Auto-deploy on `develop` branch
- **Production:** Auto-deploy on `main` branch with approval

### Configuration

**File:** `.github/workflows/backend-ci-cd.yml`

**Required GitHub Secrets:**

```yaml
# Staging Environment
STAGING_HOST              # SSH hostname
STAGING_USERNAME          # SSH username
STAGING_SSH_KEY          # SSH private key
STAGING_PORT             # SSH port (default: 22)

# Production Environment
PRODUCTION_HOST          # SSH hostname
PRODUCTION_USERNAME      # SSH username
PRODUCTION_SSH_KEY       # SSH private key
PRODUCTION_PORT          # SSH port (default: 22)
```

### Setting Up Secrets

1. Go to GitHub repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add each secret with its value

**Example: Generate SSH Key**
```bash
# Generate key pair
ssh-keygen -t rsa -b 4096 -C "github-actions" -f github-actions-key

# Copy public key to server
ssh-copy-id -i github-actions-key.pub user@your-server.com

# Add private key to GitHub secrets (entire file content)
cat github-actions-key
```

### Manual Deployment

If you need to deploy manually:

```bash
# Backend deployment script
cd /var/www/rental-platform/Rental-Platform-main/backend
git pull origin main
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan queue:restart
sudo systemctl reload php8.3-fpm
```

---

## ⚛️ Frontend Pipeline (React + Vite)

### Pipeline Stages

**1. Lint & Code Style**
- Runs ESLint for code quality
- Type checks with TypeScript compiler

**2. Test Suite**
- Runs Jest tests with coverage
- Minimum 70% coverage required
- Uploads coverage to Codecov

**3. Security Audit**
- Runs `npm audit`
- Checks for vulnerable dependencies

**4. Build**
- Builds for staging and production
- Creates optimized production bundle
- Generates build artifacts

**5. Lighthouse Performance** (PR only)
- Runs Lighthouse CI on PR
- Checks performance metrics
- Posts results as comment

**6. Deploy**
- **Staging:** Auto-deploy to Netlify (develop branch)
- **Production:** Auto-deploy to Netlify (main branch)

### Configuration

**File:** `.github/workflows/frontend-ci-cd.yml`

**Required GitHub Secrets:**

```yaml
# API URLs
STAGING_API_BASE_URL      # e.g., https://staging-api.yourdomain.com
PROD_API_BASE_URL         # e.g., https://api.yourdomain.com

# Netlify
NETLIFY_AUTH_TOKEN        # Netlify API token
NETLIFY_STAGING_SITE_ID   # Staging site ID
NETLIFY_PRODUCTION_SITE_ID # Production site ID

# Alternative: Vercel (if using)
VERCEL_TOKEN              # Vercel API token
VERCEL_ORG_ID             # Organization ID
VERCEL_PROJECT_ID         # Project ID

# Alternative: Static Hosting (if using)
FTP_SERVER                # FTP server hostname
FTP_USERNAME              # FTP username
FTP_PASSWORD              # FTP password
STATIC_HOST               # SSH hostname
STATIC_USERNAME           # SSH username
STATIC_SSH_KEY            # SSH private key
```

### Netlify Setup

1. **Create Netlify Account:** https://app.netlify.com/signup
2. **Create Sites:**
   - Create staging site
   - Create production site
3. **Get API Token:**
   - Go to User Settings → Applications → Personal access tokens
   - Generate new token
4. **Get Site IDs:**
   - Site Settings → General → Site details → API ID

### Manual Deployment

**Netlify (via CLI):**
```bash
cd Renthub
npm install -g netlify-cli
netlify login
netlify deploy --prod --site=your-site-id
```

**Static Hosting:**
```bash
cd Renthub
npm run build
# Upload dist/ folder to web server
scp -r dist/* user@server:/var/www/html/
```

---

## 🌍 Environments

### Development

**Backend:**
- URL: `http://localhost:8000`
- Database: Local PostgreSQL
- Queue: Sync driver
- Mail: Log driver

**Frontend:**
- URL: `http://localhost:5173`
- API: `http://localhost:8000`

### Staging

**Backend:**
- URL: `https://staging-api.yourdomain.com`
- Database: Staging PostgreSQL
- Queue: Database driver with workers
- Mail: Test SMTP (Mailtrap/Mailhog)
- Auto-deploy: On push to `develop` branch

**Frontend:**
- URL: `https://staging.yourdomain.com`
- API: `https://staging-api.yourdomain.com`
- Auto-deploy: On push to `develop` branch

### Production

**Backend:**
- URL: `https://api.yourdomain.com`
- Database: Production PostgreSQL
- Queue: Database/Redis with workers
- Mail: Production SMTP
- Auto-deploy: On push to `main` branch
- Requires: Manual approval (optional)

**Frontend:**
- URL: `https://yourdomain.com`
- API: `https://api.yourdomain.com`
- Auto-deploy: On push to `main` branch
- CDN: Enabled

---

## 🔀 Branching Strategy

### Git Flow

```
main (production)
  ↑
  │ merge via PR
  │
develop (staging)
  ↑
  │ merge via PR
  │
feature/feature-name
bugfix/bug-name
hotfix/critical-fix
```

### Branch Rules

**main (Production):**
- Protected branch
- Requires PR approval
- Requires passing CI checks
- Auto-deploys to production

**develop (Staging):**
- Protected branch
- Requires PR approval
- Requires passing CI checks
- Auto-deploys to staging

**feature/* (Feature branches):**
- Created from `develop`
- Merged back to `develop` via PR
- CI runs on push

**hotfix/* (Hotfix branches):**
- Created from `main` for urgent fixes
- Merged to both `main` and `develop`
- CI runs on push

### Workflow Example

**1. New Feature:**
```bash
# Create feature branch
git checkout develop
git pull origin develop
git checkout -b feature/user-notifications

# Make changes, commit
git add .
git commit -m "Add user notification system"
git push origin feature/user-notifications

# Create PR to develop
# CI runs automatically
# After approval, merge to develop
# Auto-deploys to staging
```

**2. Release to Production:**
```bash
# Create PR from develop to main
# CI runs automatically
# After approval and testing, merge
# Auto-deploys to production
```

**3. Hotfix:**
```bash
# Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-security-fix

# Fix and commit
git add .
git commit -m "Fix critical security issue"
git push origin hotfix/critical-security-fix

# Create PRs to both main and develop
# Merge after approval
```

---

## 📊 Monitoring Pipeline

### CI/CD Metrics

**Track:**
- Build success rate
- Test pass rate
- Average build time
- Deployment frequency
- Mean time to recovery (MTTR)

**GitHub Actions Dashboard:**
- Repository → Actions tab
- View workflow runs
- Check logs for failures

### Code Coverage

**Backend:**
- View reports: `Rental-Platform-main/backend/coverage-report/index.html`
- Codecov dashboard: https://codecov.io/gh/your-org/your-repo

**Frontend:**
- View reports: `Renthub/coverage/lcov-report/index.html`
- Codecov dashboard: https://codecov.io/gh/your-org/your-repo

### Notifications

**GitHub Actions:**
- Email notifications on failure
- Slack integration (optional)
- Discord webhooks (optional)

**Setup Slack Notifications:**
```yaml
# Add to workflow after deploy step
- name: Notify Slack
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
  if: always()
```

---

## 🚨 Troubleshooting

### Common Issues

**1. Build Fails on Dependencies**

```bash
# Clear caches
rm -rf node_modules package-lock.json
npm install

# Or for backend
rm -rf vendor composer.lock
composer install
```

**2. Tests Fail in CI but Pass Locally**

- Check environment variables
- Verify database connection in CI
- Check PHP/Node versions match
- Review CI logs for errors

**3. Deployment Fails**

- Check SSH credentials
- Verify server disk space
- Check file permissions
- Review deployment logs

**4. Coverage Below Threshold**

- Add missing tests
- Review uncovered code
- Update coverage configuration

### Debugging Tips

**View Workflow Logs:**
1. Go to Actions tab
2. Click on failed workflow
3. Click on failed job
4. Expand steps to see logs

**Run Locally:**
```bash
# Install act (GitHub Actions locally)
brew install act  # macOS
# or
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

# Run workflow
act -j test
```

**SSH into Server:**
```bash
# Check deployment status
ssh user@server
cd /var/www/rental-platform
git log -1
tail -f storage/logs/laravel.log
```

---

## ✅ Pre-Production Checklist

Before deploying to production:

- [ ] All tests passing in CI
- [ ] Code coverage meets threshold (70%+)
- [ ] Security audit passed
- [ ] Staging environment tested
- [ ] Database migrations tested
- [ ] Environment variables configured
- [ ] Secrets added to GitHub
- [ ] Monitoring configured
- [ ] Backup strategy in place
- [ ] Rollback plan documented
- [ ] Team notified of deployment
- [ ] Maintenance window scheduled (if needed)

---

## 📚 Additional Resources

### Documentation
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Netlify Docs](https://docs.netlify.com/)
- [Laravel Deployment](https://laravel.com/docs/11.x/deployment)
- [Vite Build](https://vitejs.dev/guide/build.html)

### Tools
- [Act](https://github.com/nektos/act) - Run GitHub Actions locally
- [Codecov](https://codecov.io/) - Code coverage reporting
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) - Performance testing

---

## 🤝 Team Workflow

### For Developers

1. **Start work:**
   - Create feature branch from `develop`
   - Make changes
   - Write tests
   - Commit and push

2. **Create PR:**
   - CI runs automatically
   - Fix any failures
   - Request review

3. **After merge:**
   - Monitor staging deployment
   - Test on staging environment
   - Report any issues

### For Reviewers

1. **Review code:**
   - Check CI status (must be green)
   - Review code changes
   - Test locally if needed

2. **Approve and merge:**
   - Ensure all checks pass
   - Approve PR
   - Merge to develop

### For DevOps

1. **Monitor pipelines:**
   - Check CI/CD dashboard daily
   - Respond to failures quickly
   - Update workflows as needed

2. **Manage environments:**
   - Keep secrets up to date
   - Monitor resource usage
   - Plan maintenance windows

3. **Incident response:**
   - Follow rollback procedures
   - Document incidents
   - Update runbooks

---

**Last Updated:** October 23, 2025  
**Next Review:** Monthly or after major changes
