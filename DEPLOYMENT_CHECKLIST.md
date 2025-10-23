# ✅ Deployment Checklist - Rental Platform

**Use this checklist before deploying to production**

---

## 🎯 Pre-Deployment

### Code Quality & Testing

- [ ] All code merged to `main` branch
- [ ] All tests passing (backend and frontend)
- [ ] Code coverage meets threshold (70%+)
- [ ] No linting errors
- [ ] TypeScript compilation successful
- [ ] No console.log or debug statements in production code
- [ ] All TODO comments resolved or documented

### Documentation

- [ ] README.md up to date
- [ ] API documentation complete
- [ ] Environment variables documented
- [ ] Deployment procedures documented
- [ ] Changelog updated

### Security Audit

- [ ] Security checklist reviewed ([SECURITY_CHECKLIST.md](SECURITY_CHECKLIST.md))
- [ ] `composer audit` clean (no vulnerabilities)
- [ ] `npm audit` clean (no high/critical vulnerabilities)
- [ ] All dependencies up to date
- [ ] `.env` files not in version control
- [ ] No secrets in code
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Security headers configured

---

## 🖥️ Backend Deployment (VPS)

### Server Setup

- [ ] VPS provisioned and accessible
- [ ] Ubuntu 22.04 LTS (or similar) installed
- [ ] Firewall configured (UFW - ports 80, 443, 22 only)
- [ ] SSH key authentication enabled
- [ ] Root login disabled
- [ ] Automatic security updates enabled
- [ ] Fail2ban installed and configured

### Software Installation

- [ ] Nginx installed and configured
- [ ] PHP 8.3+ installed with required extensions
- [ ] PHP-FPM configured
- [ ] PostgreSQL 14+ installed
- [ ] Composer installed
- [ ] Supervisor installed (for queue workers)
- [ ] Git installed

### Database Setup

- [ ] PostgreSQL database created
- [ ] Database user created with proper permissions
- [ ] Database password secure
- [ ] PostgreSQL listening on localhost only
- [ ] Database backup strategy in place

### Application Setup

- [ ] Repository cloned to `/var/www/rental-platform`
- [ ] File permissions set correctly (www-data:www-data)
- [ ] Storage and cache directories writable (775)
- [ ] `.env` file created with production values
- [ ] `APP_ENV=production` set
- [ ] `APP_DEBUG=false` set
- [ ] `APP_KEY` generated
- [ ] Dependencies installed (`composer install --no-dev --optimize-autoloader`)
- [ ] Database migrations run (`php artisan migrate --force`)
- [ ] Storage link created (`php artisan storage:link`)

### Performance Optimization

- [ ] Config cached (`php artisan config:cache`)
- [ ] Routes cached (`php artisan route:cache`)
- [ ] Views cached (`php artisan view:cache`)
- [ ] Autoloader optimized (`composer dump-autoload --optimize`)
- [ ] OPcache enabled in PHP

### Queue Workers

- [ ] Supervisor configuration file created
- [ ] Queue workers configured (at least 2 workers)
- [ ] Supervisor reloaded (`supervisorctl reread && supervisorctl update`)
- [ ] Workers running (`supervisorctl status`)

### Web Server

- [ ] Nginx virtual host configured
- [ ] Document root points to `public/` directory
- [ ] PHP-FPM configured correctly
- [ ] Nginx reloaded (`systemctl reload nginx`)

### SSL/TLS

- [ ] Domain DNS configured
- [ ] SSL certificate installed (Let's Encrypt)
- [ ] Auto-renewal configured (Certbot)
- [ ] HTTPS working
- [ ] HTTP redirects to HTTPS
- [ ] HSTS header enabled

### Testing Backend

- [ ] API accessible at https://api.yourdomain.com
- [ ] Admin panel accessible at https://api.yourdomain.com/admin
- [ ] Can login to admin panel
- [ ] Database connection working
- [ ] Queue workers processing jobs
- [ ] Emails sending correctly
- [ ] File uploads working
- [ ] All API endpoints responding

---

## 🌐 Frontend Deployment (Static Hosting)

### Build Preparation

- [ ] Production `.env` file configured
- [ ] API URL set to production backend
- [ ] Debug mode disabled (`VITE_APP_DEBUG=false`)
- [ ] Feature flags configured
- [ ] Third-party API keys configured

### Build Process

- [ ] Dependencies installed (`npm ci`)
- [ ] Production build created (`npm run build`)
- [ ] Build successful (no errors)
- [ ] Build artifacts in `dist/` directory
- [ ] Source maps removed (if desired)
- [ ] Bundle size acceptable

### Netlify Deployment

- [ ] Netlify account created
- [ ] New site created
- [ ] Build settings configured
- [ ] Environment variables set in Netlify
- [ ] Custom domain configured
- [ ] SSL certificate provisioned
- [ ] Redirects configured (SPA routing)
- [ ] Deploy successful

### Alternative: Vercel Deployment

- [ ] Vercel account created
- [ ] Project imported
- [ ] Build settings configured
- [ ] Environment variables set
- [ ] Custom domain configured
- [ ] Deploy successful

### Alternative: Static VPS Deployment

- [ ] Web server configured
- [ ] `dist/` folder uploaded to server
- [ ] Web server serves `index.html` for all routes
- [ ] Custom domain configured
- [ ] SSL certificate installed
- [ ] Deploy successful

### Testing Frontend

- [ ] Site accessible at https://yourdomain.com
- [ ] All pages load correctly
- [ ] Can connect to backend API
- [ ] Can login/register
- [ ] Images loading
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Performance acceptable (Lighthouse score)

---

## 🔄 CI/CD Setup

### GitHub Actions

- [ ] Workflows created (`.github/workflows/`)
- [ ] Backend workflow configured
- [ ] Frontend workflow configured
- [ ] GitHub secrets configured
- [ ] SSH keys added to secrets
- [ ] API URLs in secrets
- [ ] Netlify tokens in secrets (if using)
- [ ] Workflows tested on feature branch
- [ ] Staging deployment working
- [ ] Production deployment working

### Environment Secrets

**Backend Secrets:**
- [ ] `STAGING_HOST`
- [ ] `STAGING_USERNAME`
- [ ] `STAGING_SSH_KEY`
- [ ] `PRODUCTION_HOST`
- [ ] `PRODUCTION_USERNAME`
- [ ] `PRODUCTION_SSH_KEY`

**Frontend Secrets:**
- [ ] `STAGING_API_BASE_URL`
- [ ] `PROD_API_BASE_URL`
- [ ] `NETLIFY_AUTH_TOKEN`
- [ ] `NETLIFY_STAGING_SITE_ID`
- [ ] `NETLIFY_PRODUCTION_SITE_ID`

---

## 📊 Monitoring & Observability

### Error Tracking

- [ ] Sentry account created
- [ ] Sentry DSN configured (backend)
- [ ] Sentry DSN configured (frontend)
- [ ] Test error sent successfully
- [ ] Alerts configured

### Uptime Monitoring

- [ ] Uptime monitoring service configured (UptimeRobot, etc.)
- [ ] Backend API monitored
- [ ] Frontend site monitored
- [ ] Alerts configured
- [ ] Status page created (optional)

### Analytics

- [ ] Google Analytics configured (or alternative)
- [ ] Tracking ID in frontend environment
- [ ] Page views tracking
- [ ] Event tracking

### Logging

- [ ] Laravel logs configured
- [ ] Log rotation configured
- [ ] Error logs monitored
- [ ] Alert on critical errors

### Performance

- [ ] Application performance monitored
- [ ] Database performance monitored
- [ ] Queue processing monitored
- [ ] Server resources monitored (CPU, RAM, disk)

---

## 🔐 Security Post-Deployment

### SSL/TLS

- [ ] SSL certificate valid and trusted
- [ ] Certificate auto-renewal working
- [ ] HTTPS enforced (no HTTP access)
- [ ] Security headers present
- [ ] SSL Labs test passed (A+ rating)

### Security Headers

Verify these headers are present:
- [ ] `X-Frame-Options: DENY`
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `X-XSS-Protection: 1; mode=block`
- [ ] `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] `Content-Security-Policy` configured

### Penetration Testing

- [ ] Basic security scan performed
- [ ] OWASP Top 10 checked
- [ ] SQL injection tests passed
- [ ] XSS tests passed
- [ ] CSRF protection verified
- [ ] Authentication security verified

---

## 🗄️ Backup & Recovery

### Database Backup

- [ ] Automated daily backups configured
- [ ] Backups stored off-site
- [ ] Backup encryption enabled
- [ ] Backup restoration tested
- [ ] Backup retention policy set (30 days)

### File Backup

- [ ] User uploads backed up
- [ ] Application code in version control
- [ ] `.env` file backed up securely (separate from code)

### Disaster Recovery

- [ ] Recovery procedures documented
- [ ] RTO (Recovery Time Objective) defined
- [ ] RPO (Recovery Point Objective) defined
- [ ] Recovery tested successfully
- [ ] Team trained on recovery procedures

---

## 📝 Documentation

### Internal Documentation

- [ ] Deployment procedures documented
- [ ] Server access documented
- [ ] Database credentials stored securely (password manager)
- [ ] Third-party service credentials documented
- [ ] On-call procedures documented
- [ ] Incident response plan documented

### User Documentation

- [ ] User guide available
- [ ] FAQ page created
- [ ] Support contact information clear
- [ ] Terms of service published
- [ ] Privacy policy published

---

## 🚀 Go-Live Checklist

### Final Verification

- [ ] All above sections completed
- [ ] Staging tested thoroughly
- [ ] Load testing performed (100+ concurrent users)
- [ ] Mobile devices tested
- [ ] Multiple browsers tested (Chrome, Firefox, Safari, Edge)
- [ ] Performance acceptable (page load < 2s)
- [ ] No critical bugs
- [ ] Team ready for support

### DNS & Domain

- [ ] Domain registered
- [ ] DNS configured correctly
- [ ] DNS propagation verified (24-48 hours)
- [ ] Email configured (if needed)

### Communication

- [ ] Stakeholders notified
- [ ] Launch plan communicated
- [ ] Support team briefed
- [ ] Marketing team notified (if applicable)

### Go-Live

- [ ] Maintenance mode enabled (if needed)
- [ ] Final deployment to production
- [ ] Database migrations run
- [ ] Caches cleared
- [ ] Services restarted
- [ ] Smoke tests passed
- [ ] Maintenance mode disabled
- [ ] Monitoring active

---

## 📞 Post-Launch

### Monitoring (First 24 Hours)

- [ ] Error rates monitored
- [ ] Response times monitored
- [ ] User registrations tracked
- [ ] Support requests tracked
- [ ] Server resources monitored

### Week 1 Tasks

- [ ] Daily monitoring of all metrics
- [ ] User feedback collected
- [ ] Bug reports triaged
- [ ] Performance optimizations identified
- [ ] Backup verification

### Week 2+ Tasks

- [ ] Weekly monitoring review
- [ ] Security updates applied
- [ ] User feedback analyzed
- [ ] Feature requests prioritized
- [ ] Documentation updated

---

## ✅ Sign-Off

### Deployment Approved By:

- [ ] **Technical Lead:** _________________ Date: _______
- [ ] **DevOps Lead:** _________________ Date: _______
- [ ] **Security Lead:** _________________ Date: _______
- [ ] **Project Manager:** _________________ Date: _______

### Production Launch:

- [ ] **Date:** _______
- [ ] **Time:** _______
- [ ] **Duration:** _______
- [ ] **Launched By:** _________________

---

**Congratulations! 🎉 Your rental platform is now live!**

**Emergency Contacts:**
- On-Call Engineer: [Phone]
- DevOps Lead: [Phone]
- Hosting Provider Support: [Phone/Portal]

---

**Last Updated:** October 23, 2025  
**Version:** 1.0
