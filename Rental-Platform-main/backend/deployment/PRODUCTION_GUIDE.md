# Production Deployment Guide

Complete guide for deploying the Rental Platform to production.

## Prerequisites

- Ubuntu 22.04+ or similar Linux server
- Domain name configured with DNS
- SSL certificate (Let's Encrypt recommended)
- Minimum 2GB RAM, 2 CPU cores, 20GB storage
- Root or sudo access

## Architecture Overview

```
┌─────────────────┐
│   Nginx/Caddy   │ ← SSL, Static files, Reverse proxy
└────────┬────────┘
         │
    ┌────┴─────┐
    │          │
┌───▼────┐  ┌──▼──────────┐
│ React  │  │ Laravel API │
│ (SPA)  │  │ + Filament  │
└────────┘  └──┬──────────┘
               │
        ┌──────┴──────┐
        │             │
    ┌───▼────┐  ┌────▼────────┐
    │ MySQL/ │  │ Queue Worker│
    │ Postgres│  │ (Supervisor)│
    └────────┘  └─────────────┘
```

## Part 1: Server Setup

### 1.1 Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install PHP 8.3 and extensions
sudo apt install -y software-properties-common
sudo add-apt-repository ppa:ondrej/php
sudo apt update
sudo apt install -y php8.3-cli php8.3-fpm php8.3-mysql php8.3-pgsql php8.3-sqlite3 \
    php8.3-gd php8.3-curl php8.3-mbstring php8.3-xml php8.3-zip php8.3-intl \
    php8.3-bcmath php8.3-redis

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Install Node.js 20.x and npm
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install database (choose one)
# MySQL:
sudo apt install -y mysql-server
# OR PostgreSQL:
sudo apt install -y postgresql postgresql-contrib

# Install Nginx
sudo apt install -y nginx

# Install Supervisor (for queue workers)
sudo apt install -y supervisor

# Install Redis (optional, for caching/sessions)
sudo apt install -y redis-server

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx
```

### 1.2 Configure Database

#### MySQL Setup

```bash
sudo mysql
```

```sql
CREATE DATABASE rental_platform CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'rental_user'@'localhost' IDENTIFIED BY 'secure_password_here';
GRANT ALL PRIVILEGES ON rental_platform.* TO 'rental_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### PostgreSQL Setup

```bash
sudo -u postgres psql
```

```sql
CREATE DATABASE rental_platform;
CREATE USER rental_user WITH PASSWORD 'secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE rental_platform TO rental_user;
\q
```

## Part 2: Backend Deployment

### 2.1 Deploy Laravel Application

```bash
# Create application directory
sudo mkdir -p /var/www/rental-platform
sudo chown $USER:$USER /var/www/rental-platform

# Clone repository (or upload files)
cd /var/www/rental-platform
git clone https://github.com/your-org/rental-platform.git .
# OR upload via scp/rsync

# Install backend dependencies
cd backend
composer install --no-dev --optimize-autoloader

# Set permissions
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

### 2.2 Configure Backend Environment

```bash
cd /var/www/rental-platform/backend

# Copy example environment
cp .env.example .env

# Edit environment file
nano .env
```

**Critical `.env` settings:**

```env
APP_NAME="Rental Platform"
APP_ENV=production
APP_KEY=  # Generate with: php artisan key:generate
APP_DEBUG=false
APP_URL=https://yourdomain.com

# Database (MySQL example)
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=rental_platform
DB_USERNAME=rental_user
DB_PASSWORD=secure_password_here

# Filesystem (use public for images)
FILESYSTEM_DISK=public

# For S3 storage (recommended for production):
# FILESYSTEM_DISK=s3
# AWS_ACCESS_KEY_ID=your-key
# AWS_SECRET_ACCESS_KEY=your-secret
# AWS_DEFAULT_REGION=us-east-1
# AWS_BUCKET=your-bucket

# Queue
QUEUE_CONNECTION=database  # or redis for better performance

# Cache (use redis in production)
CACHE_STORE=redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# Mail (SMTP for production)
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=587
MAIL_USERNAME=your-username
MAIL_PASSWORD=your-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@yourdomain.com
MAIL_FROM_NAME="${APP_NAME}"

# Session
SESSION_DRIVER=redis  # or database
```

### 2.3 Initialize Application

```bash
# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate --force

# Create storage symlink
php artisan storage:link

# Seed database (optional, for initial data)
php artisan db:seed --class=AmenitySeeder

# Cache configuration for performance
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Create admin user
php artisan make:filament-user
```

### 2.4 Configure Queue Workers

```bash
# Copy supervisor configuration
sudo cp deployment/supervisor/rental-platform-worker.conf /etc/supervisor/conf.d/

# Edit configuration
sudo nano /etc/supervisor/conf.d/rental-platform-worker.conf
```

**Update paths in supervisor config:**

```ini
[program:rental-platform-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/rental-platform/backend/artisan queue:work database --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=4
redirect_stderr=true
stdout_logfile=/var/www/rental-platform/backend/storage/logs/worker.log
stopwaitsecs=3600
```

**Start workers:**

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start rental-platform-worker:*
```

## Part 3: Frontend Deployment

### 3.1 Build React Application

```bash
cd /var/www/rental-platform/frontend

# Copy environment
cp .env.example .env

# Update API URL
nano .env
```

```env
VITE_API_URL=https://yourdomain.com
```

**Build for production:**

```bash
npm ci  # Clean install
npm run build  # Creates dist/ folder
```

### 3.2 Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/rental-platform
```

**Nginx configuration:**

```nginx
# Frontend (React SPA)
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    root /var/www/rental-platform/frontend/dist;
    index index.html;
    
    # Frontend SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Proxy API requests to Laravel backend
    location /api {
        proxy_pass http://127.0.0.1:9000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Admin panel
    location /admin {
        proxy_pass http://127.0.0.1:9000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Storage (images)
    location /storage {
        alias /var/www/rental-platform/backend/storage/app/public;
        access_log off;
        expires max;
        add_header Cache-Control "public, immutable";
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}

# Backend (Laravel API)
server {
    listen 9000;
    server_name 127.0.0.1;
    
    root /var/www/rental-platform/backend/public;
    index index.php;
    
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
    
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
    }
    
    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

**Enable site:**

```bash
sudo ln -s /etc/nginx/sites-available/rental-platform /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl reload nginx
```

### 3.3 Install SSL Certificate

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

**Auto-renewal (certbot sets this up automatically):**

```bash
sudo certbot renew --dry-run  # Test renewal
```

## Part 4: Security Hardening

### 4.1 File Permissions

```bash
cd /var/www/rental-platform/backend

# Set ownership
sudo chown -R www-data:www-data .

# Set directory permissions
sudo find . -type d -exec chmod 755 {} \;

# Set file permissions
sudo find . -type f -exec chmod 644 {} \;

# Writable storage and cache
sudo chmod -R 775 storage bootstrap/cache
```

### 4.2 Firewall Configuration

```bash
# Enable UFW
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 4.3 Fail2Ban (Optional)

```bash
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

## Part 5: Monitoring & Maintenance

### 5.1 Log Rotation

```bash
sudo nano /etc/logrotate.d/rental-platform
```

```
/var/www/rental-platform/backend/storage/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    missingok
    create 0644 www-data www-data
}
```

### 5.2 Backup Script

```bash
sudo nano /usr/local/bin/backup-rental-platform.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/backups/rental-platform"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Database backup
mysqldump -u rental_user -p'secure_password_here' rental_platform | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Files backup (optional)
tar -czf $BACKUP_DIR/files_$DATE.tar.gz /var/www/rental-platform/backend/storage/app/public

# Keep only last 7 days
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
```

```bash
sudo chmod +x /usr/local/bin/backup-rental-platform.sh
```

**Add to cron (daily at 2 AM):**

```bash
sudo crontab -e
```

```
0 2 * * * /usr/local/bin/backup-rental-platform.sh >> /var/log/rental-platform-backup.log 2>&1
```

### 5.3 Health Check Script

```bash
sudo nano /usr/local/bin/health-check.sh
```

```bash
#!/bin/bash

# Check web server
if ! curl -f -s https://yourdomain.com > /dev/null; then
    echo "ERROR: Website is down!"
fi

# Check API
if ! curl -f -s https://yourdomain.com/api/properties > /dev/null; then
    echo "ERROR: API is down!"
fi

# Check queue workers
WORKER_COUNT=$(sudo supervisorctl status rental-platform-worker:* | grep RUNNING | wc -l)
if [ $WORKER_COUNT -lt 2 ]; then
    echo "WARNING: Only $WORKER_COUNT queue workers running!"
fi

# Check disk space
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "WARNING: Disk usage at ${DISK_USAGE}%"
fi

echo "Health check completed: $(date)"
```

```bash
sudo chmod +x /usr/local/bin/health-check.sh
```

**Add to cron (every 5 minutes):**

```bash
*/5 * * * * /usr/local/bin/health-check.sh >> /var/log/health-check.log 2>&1
```

## Part 6: Deployment Workflow

### 6.1 Deployment Checklist

Before deploying updates:

- [ ] Test changes in staging environment
- [ ] Run migrations in staging
- [ ] Verify queue workers handle new job types
- [ ] Update documentation for any API changes
- [ ] Backup production database

### 6.2 Deployment Script

```bash
#!/bin/bash
# deploy.sh

set -e  # Exit on error

echo "Starting deployment..."

# Pull latest code
cd /var/www/rental-platform
git pull origin main

# Backend updates
cd backend
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan queue:restart

# Frontend updates
cd ../frontend
npm ci
npm run build

# Restart services
sudo supervisorctl restart rental-platform-worker:*
sudo systemctl reload nginx

echo "Deployment completed successfully!"
```

## Part 7: Troubleshooting

### Common Issues

**500 Error:**
```bash
# Check Laravel logs
tail -f /var/www/rental-platform/backend/storage/logs/laravel.log

# Check Nginx error log
sudo tail -f /var/log/nginx/error.log
```

**Queue not processing:**
```bash
# Check worker status
sudo supervisorctl status rental-platform-worker:*

# Restart workers
sudo supervisorctl restart rental-platform-worker:*
```

**Storage images not loading:**
```bash
# Verify symlink
ls -la /var/www/rental-platform/backend/public/storage

# Recreate if needed
php artisan storage:link
```

**Permission issues:**
```bash
# Fix permissions
cd /var/www/rental-platform/backend
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

---

## Production Checklist

- [ ] SSL certificate installed and auto-renewal configured
- [ ] Database backups automated
- [ ] Queue workers running and monitored
- [ ] Log rotation configured
- [ ] Firewall enabled
- [ ] Health checks scheduled
- [ ] Monitoring alerts set up
- [ ] `.env` file secured (not in git, proper permissions)
- [ ] Admin user created
- [ ] Test email sending
- [ ] Test image uploads
- [ ] Test booking flow
- [ ] Test review submission/approval
- [ ] Performance testing (load test API)
- [ ] Documentation updated

---

## Resources

- [Laravel Deployment Docs](https://laravel.com/docs/deployment)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/)
- [Supervisor Documentation](http://supervisord.org/)
