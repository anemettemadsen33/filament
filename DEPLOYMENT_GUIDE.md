# 🚢 Deployment Guide - RentHub Platform

**Production deployment guide for Laravel 12 + Filament v4 + React 19 + Vite**

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Server Requirements](#server-requirements)
4. [Backend Deployment (Laravel + Filament)](#backend-deployment)
5. [Frontend Deployment (React + Vite)](#frontend-deployment)
6. [Database Setup](#database-setup)
7. [Environment Configuration](#environment-configuration)
8. [CI/CD Pipeline](#cicd-pipeline)
9. [Monitoring & Maintenance](#monitoring--maintenance)
10. [Rollback Procedures](#rollback-procedures)
11. [Troubleshooting](#troubleshooting)

---

## Overview

### Deployment Architecture

```
┌─────────────────┐
│   Cloudflare    │  → CDN + DDoS Protection + SSL
└────────┬────────┘
         │
┌────────▼────────┐
│  Load Balancer  │  → Nginx/HAProxy
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼────┐
│ App 1 │ │ App 2 │  → Laravel Applications
└───┬───┘ └──┬────┘
    │        │
┌───▼────────▼───┐
│   PostgreSQL   │  → Primary Database
└────────┬───────┘
         │
┌────────▼───────┐
│  Redis Cache   │  → Session + Queue + Cache
└────────────────┘
```

### Deployment Strategy

- **Blue-Green Deployment**: Zero-downtime deployments
- **Rolling Updates**: Gradual rollout to production
- **Database Migrations**: Automated with rollback support
- **Asset Versioning**: Cache busting for static files

---

## Prerequisites

### Required Accounts & Services

- [x] GitHub account (for CI/CD)
- [x] Server/VPS provider (DigitalOcean, AWS, Linode, etc.)
- [x] Domain name with DNS management
- [x] SSL certificate (Let's Encrypt or commercial)
- [x] CDN service (Cloudflare recommended)
- [ ] Error tracking (Sentry, Bugsnag)
- [ ] Monitoring (New Relic, DataDog)
- [ ] Email service (Mailgun, SendGrid)

### Local Tools

```bash
# Required
- PHP 8.2+
- Composer 2.x
- Node.js 18+
- npm or yarn
- Git

# Deployment
- SSH access to servers
- Database client (psql, MySQL Workbench)
```

---

## Server Requirements

### Minimum Specifications

**Production Server**:
- **CPU**: 2 cores (4+ recommended)
- **RAM**: 4GB (8GB+ recommended)
- **Storage**: 40GB SSD (100GB+ recommended)
- **Bandwidth**: 100GB/month minimum

**Database Server** (can be same as app server):
- **CPU**: 2 cores
- **RAM**: 4GB (8GB+ recommended)
- **Storage**: 40GB SSD with backups

### Software Stack

**Operating System**:
- Ubuntu 22.04 LTS (recommended)
- Debian 11+
- CentOS 8+

**Web Server**:
- Nginx 1.20+ (recommended)
- Apache 2.4+ (alternative)

**PHP**:
```bash
# PHP 8.2 with required extensions
- php8.2-fpm
- php8.2-cli
- php8.2-pgsql (or php8.2-mysql)
- php8.2-mbstring
- php8.2-xml
- php8.2-curl
- php8.2-zip
- php8.2-gd
- php8.2-intl
- php8.2-bcmath
- php8.2-redis
```

**Database**:
- PostgreSQL 15+ (recommended)
- MySQL 8.0+ (alternative)

**Cache & Queue**:
- Redis 6.0+
- Supervisor (for queue workers)

**Node.js**:
- Node.js 18 LTS
- npm 9+

---

## Backend Deployment

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install PHP 8.2
sudo apt install -y software-properties-common
sudo add-apt-repository ppa:ondrej/php
sudo apt update
sudo apt install -y php8.2-fpm php8.2-cli php8.2-pgsql php8.2-mbstring \
    php8.2-xml php8.2-curl php8.2-zip php8.2-gd php8.2-intl php8.2-bcmath \
    php8.2-redis

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Install Nginx
sudo apt install -y nginx

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Redis
sudo apt install -y redis-server

# Install Supervisor
sudo apt install -y supervisor
```

### 2. Application Deployment

```bash
# Create application directory
sudo mkdir -p /var/www/renthub
sudo chown $USER:$USER /var/www/renthub

# Clone repository
cd /var/www/renthub
git clone https://github.com/yourusername/renthub.git .

# Navigate to backend
cd Rental-Platform-main/backend

# Install dependencies
composer install --no-dev --optimize-autoloader

# Set permissions
sudo chown -R www-data:www-data /var/www/renthub
sudo chmod -R 755 /var/www/renthub
sudo chmod -R 775 storage bootstrap/cache

# Create .env file
cp .env.example .env
nano .env  # Configure production settings

# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate --force

# Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize
```

### 3. Nginx Configuration

```nginx
# /etc/nginx/sites-available/renthub-backend
server {
    listen 80;
    listen [::]:80;
    server_name api.renthub.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.renthub.com;
    
    root /var/www/renthub/Rental-Platform-main/backend/public;
    index index.php;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/api.renthub.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.renthub.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # CORS Headers (adjust as needed)
    add_header Access-Control-Allow-Origin "https://renthub.com" always;
    add_header Access-Control-Allow-Methods "GET, POST, PUT, PATCH, DELETE, OPTIONS" always;
    add_header Access-Control-Allow-Headers "Authorization, Content-Type" always;
    add_header Access-Control-Allow-Credentials "true" always;
    
    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;
    
    # Client max body size
    client_max_body_size 20M;
    
    # Index
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
    
    # PHP-FPM
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
    }
    
    # Deny access to hidden files
    location ~ /\. {
        deny all;
    }
    
    # Deny access to sensitive files
    location ~ /\.(env|git|gitignore) {
        deny all;
    }
    
    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Enable site**:
```bash
sudo ln -s /etc/nginx/sites-available/renthub-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 4. SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d api.renthub.com

# Auto-renewal
sudo certbot renew --dry-run
```

### 5. Queue Workers (Supervisor)

```bash
# /etc/supervisor/conf.d/renthub-worker.conf
[program:renthub-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/renthub/Rental-Platform-main/backend/artisan queue:work --tries=3 --timeout=90
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/renthub/Rental-Platform-main/backend/storage/logs/worker.log
stopwaitsecs=3600
```

**Start workers**:
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start renthub-worker:*
```

### 6. Scheduled Tasks (Cron)

```bash
# Edit crontab
sudo crontab -e

# Add Laravel scheduler
* * * * * cd /var/www/renthub/Rental-Platform-main/backend && php artisan schedule:run >> /dev/null 2>&1
```

---

## Frontend Deployment

### 1. Build Frontend

```bash
# On local machine or CI/CD
cd Renthub

# Install dependencies
npm ci

# Build for production
npm run build

# Output will be in dist/ directory
```

### 2. Deploy Static Files

**Option A: Deploy to same server**:
```bash
# Copy build to server
scp -r dist/* user@server:/var/www/renthub/frontend/

# Or using rsync
rsync -avz dist/ user@server:/var/www/renthub/frontend/
```

**Option B: Deploy to CDN** (Recommended):
```bash
# Upload to Cloudflare Pages, Netlify, or Vercel
# They handle SSL, CDN, and deployment automatically

# Cloudflare Pages
npx wrangler pages publish dist

# Netlify
netlify deploy --prod --dir=dist

# Vercel
vercel --prod
```

### 3. Nginx Configuration (if hosting on server)

```nginx
# /etc/nginx/sites-available/renthub-frontend
server {
    listen 80;
    listen [::]:80;
    server_name renthub.com www.renthub.com;
    
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name renthub.com www.renthub.com;
    
    root /var/www/renthub/frontend;
    index index.html;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/renthub.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/renthub.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    
    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Brotli Compression (if installed)
    brotli on;
    brotli_comp_level 6;
    brotli_types text/plain text/css application/json application/javascript text/xml application/xml+rss text/javascript;
    
    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;
    
    # SPA routing - serve index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets aggressively
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    # Disable caching for service worker
    location = /sw.js {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
}
```

---

## Database Setup

### PostgreSQL Configuration

```bash
# Create database and user
sudo -u postgres psql

postgres=# CREATE DATABASE renthub_production;
postgres=# CREATE USER renthub_user WITH ENCRYPTED PASSWORD 'your_secure_password';
postgres=# GRANT ALL PRIVILEGES ON DATABASE renthub_production TO renthub_user;
postgres=# \q

# Run migrations
cd /var/www/renthub/Rental-Platform-main/backend
php artisan migrate --force

# Optional: Seed data
php artisan db:seed --force
```

### Database Backups

```bash
# Create backup script
sudo nano /usr/local/bin/backup-renthub-db.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/renthub"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="renthub_production"
DB_USER="renthub_user"

mkdir -p $BACKUP_DIR

# Create backup
pg_dump -U $DB_USER $DB_NAME | gzip > "$BACKUP_DIR/renthub_$DATE.sql.gz"

# Keep only last 30 days
find $BACKUP_DIR -type f -mtime +30 -delete

echo "Backup completed: renthub_$DATE.sql.gz"
```

```bash
# Make executable
sudo chmod +x /usr/local/bin/backup-renthub-db.sh

# Add to crontab (daily at 2 AM)
sudo crontab -e
0 2 * * * /usr/local/bin/backup-renthub-db.sh
```

---

## Environment Configuration

### Backend .env (Production)

```env
APP_NAME="RentHub"
APP_ENV=production
APP_KEY=base64:YOUR_GENERATED_KEY_HERE
APP_DEBUG=false
APP_URL=https://api.renthub.com

LOG_CHANNEL=stack
LOG_LEVEL=error

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=renthub_production
DB_USERNAME=renthub_user
DB_PASSWORD=your_secure_password

BROADCAST_DRIVER=redis
CACHE_DRIVER=redis
FILESYSTEM_DISK=local
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis
SESSION_LIFETIME=120

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=smtp.mailgun.org
MAIL_PORT=587
MAIL_USERNAME=your_mailgun_username
MAIL_PASSWORD=your_mailgun_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@renthub.com
MAIL_FROM_NAME="${APP_NAME}"

# Sanctum
SANCTUM_STATEFUL_DOMAINS=renthub.com,www.renthub.com
SESSION_DOMAIN=.renthub.com

# Filament
FILAMENT_DOMAIN=admin.renthub.com

# Third-party services
MEILISEARCH_HOST=http://127.0.0.1:7700
MEILISEARCH_KEY=your_meilisearch_key
```

### Frontend .env (Production)

```env
VITE_API_URL=https://api.renthub.com
VITE_APP_NAME=RentHub
VITE_APP_ENV=production
```

---

## CI/CD Pipeline

### GitHub Actions Deployment

```yaml
# .github/workflows/deploy-production.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  deploy-backend:
    name: Deploy Backend
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'
      
      - name: Install dependencies
        run: |
          cd Rental-Platform-main/backend
          composer install --no-dev --optimize-autoloader
      
      - name: Run tests
        run: |
          cd Rental-Platform-main/backend
          php artisan test
      
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.PROD_HOST }}
          username: ${{ secrets.PROD_USER }}
          key: ${{ secrets.PROD_SSH_KEY }}
          script: |
            cd /var/www/renthub
            git pull origin main
            cd Rental-Platform-main/backend
            composer install --no-dev --optimize-autoloader
            php artisan migrate --force
            php artisan config:cache
            php artisan route:cache
            php artisan view:cache
            sudo supervisorctl restart renthub-worker:*

  deploy-frontend:
    name: Deploy Frontend
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: 'Renthub/package-lock.json'
      
      - name: Install and build
        run: |
          cd Renthub
          npm ci
          npm run build
      
      - name: Deploy to CDN
        run: |
          # Deploy to Cloudflare Pages, Netlify, etc.
          cd Renthub
          npx wrangler pages publish dist
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

---

## Monitoring & Maintenance

### Health Checks

```bash
# Create health check endpoint
# routes/api.php
Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'timestamp' => now(),
        'database' => DB::connection()->getPdo() ? 'connected' : 'disconnected',
        'cache' => Cache::has('health_check') ? 'working' : 'not_working',
    ]);
});
```

### Monitoring Tools

**Uptime Monitoring**:
- UptimeRobot (free tier available)
- Pingdom
- StatusCake

**Application Performance**:
- New Relic
- DataDog
- Laravel Telescope (development)

**Error Tracking**:
- Sentry
- Bugsnag
- Rollbar

### Log Management

```bash
# Rotate logs
sudo nano /etc/logrotate.d/renthub

/var/www/renthub/Rental-Platform-main/backend/storage/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        systemctl reload php8.2-fpm
    endscript
}
```

---

## Rollback Procedures

### Database Rollback

```bash
# List migrations
php artisan migrate:status

# Rollback last migration
php artisan migrate:rollback

# Rollback specific number of migrations
php artisan migrate:rollback --step=2

# Restore from backup
gunzip < /var/backups/renthub/renthub_20250101_020000.sql.gz | psql -U renthub_user renthub_production
```

### Application Rollback

```bash
# Using Git
cd /var/www/renthub
git log --oneline  # Find commit to rollback to
git checkout <commit-hash>

# Clear cache
cd Rental-Platform-main/backend
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

# Restart services
sudo supervisorctl restart renthub-worker:*
sudo systemctl reload php8.2-fpm
```

---

## Troubleshooting

### Common Issues

**500 Internal Server Error**:
```bash
# Check logs
tail -f /var/www/renthub/Rental-Platform-main/backend/storage/logs/laravel.log
tail -f /var/log/nginx/error.log

# Check permissions
sudo chown -R www-data:www-data /var/www/renthub
sudo chmod -R 775 storage bootstrap/cache
```

**Database Connection Issues**:
```bash
# Test database connection
psql -U renthub_user -d renthub_production -h 127.0.0.1

# Check PostgreSQL status
sudo systemctl status postgresql

# Verify .env configuration
cd /var/www/renthub/Rental-Platform-main/backend
grep DB_ .env
```

**Queue Not Processing**:
```bash
# Check supervisor status
sudo supervisorctl status renthub-worker:*

# Restart workers
sudo supervisorctl restart renthub-worker:*

# Check worker logs
tail -f /var/www/renthub/Rental-Platform-main/backend/storage/logs/worker.log
```

**Frontend Not Loading**:
```bash
# Check build files exist
ls -la /var/www/renthub/frontend/

# Check Nginx configuration
sudo nginx -t

# Check Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

---

## Production Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Security audit completed
- [ ] Performance optimization applied
- [ ] Database migrations tested
- [ ] Backup procedures in place
- [ ] SSL certificates configured
- [ ] Environment variables set
- [ ] Monitoring configured

### Post-Deployment
- [ ] Health check endpoint responding
- [ ] Database migrations applied
- [ ] Queue workers running
- [ ] Scheduled tasks configured
- [ ] Logs rotating correctly
- [ ] Backups running
- [ ] Monitoring active
- [ ] Performance metrics baseline

### Weekly Maintenance
- [ ] Review error logs
- [ ] Check disk space
- [ ] Verify backups
- [ ] Update dependencies (if needed)
- [ ] Review performance metrics

---

## Resources

- [Laravel Deployment](https://laravel.com/docs/deployment)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Let's Encrypt](https://letsencrypt.org/)

---

**Last Updated**: October 24, 2025  
**Maintained By**: DevOps Team
