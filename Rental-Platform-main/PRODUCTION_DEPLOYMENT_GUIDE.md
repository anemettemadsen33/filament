# 🚀 PRODUCTION DEPLOYMENT GUIDE - Rental Platform

**Platform Status:** ✅ PRODUCTION READY  
**Version:** v1.0.0  
**Date:** 22 Octombrie 2025

---

## 📊 PROJECT OVERVIEW

### Tech Stack
- **Backend:** Laravel 12 + Filament v4 Admin Panel
- **Frontend:** React 18 + TypeScript + Tailwind CSS
- **Database:** PostgreSQL (or MySQL)
- **Queue:** Laravel Queues (Database driver)
- **Storage:** Local/S3 for images
- **Email:** SMTP (configurable)
- **Search:** Meilisearch (optional)

### Key Features Implemented
✅ Property listing and management  
✅ User authentication and authorization  
✅ Booking system with status management  
✅ Review system with moderation  
✅ Image upload and gallery management  
✅ Owner portal for property management  
✅ Admin panel for platform management  
✅ Email notifications for bookings  
✅ Role-based permissions (Guest, Owner, Admin)  

---

## 🖥️ SERVER REQUIREMENTS

### Minimum Requirements
- **PHP:** 8.2+
- **Memory:** 2GB RAM
- **Storage:** 20GB SSD
- **CPU:** 2 cores
- **OS:** Ubuntu 20.04+ / CentOS 8+

### Recommended Production
- **PHP:** 8.3
- **Memory:** 4GB+ RAM
- **Storage:** 50GB+ SSD
- **CPU:** 4+ cores
- **OS:** Ubuntu 22.04 LTS

### Required PHP Extensions
```bash
php-fpm, php-cli, php-mysql, php-pgsql, php-sqlite3
php-redis, php-memcached, php-gd, php-imagick
php-zip, php-xml, php-curl, php-mbstring
php-json, php-bcmath, php-intl
```

---

## 📦 DEPLOYMENT STEPS

### 1. Server Setup

#### 1.1 Install Dependencies
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y nginx mysql-server php8.3-fpm php8.3-cli \
  php8.3-mysql php8.3-pgsql php8.3-gd php8.3-imagick \
  php8.3-zip php8.3-xml php8.3-curl php8.3-mbstring \
  php8.3-json php8.3-bcmath php8.3-intl php8.3-redis \
  composer nodejs npm supervisor
```

#### 1.2 Clone Repository
```bash
cd /var/www
git clone https://github.com/anemettemadsen33/Rental-Platform.git
cd Rental-Platform
chown -R www-data:www-data /var/www/Rental-Platform
chmod -R 755 /var/www/Rental-Platform
```

### 2. Backend Setup (Laravel)

#### 2.1 Install Dependencies
```bash
cd /var/www/Rental-Platform/backend
composer install --no-dev --optimize-autoloader
```

#### 2.2 Environment Configuration
```bash
cp .env.example .env
nano .env
```

**Production .env template:**
```env
APP_NAME="Rental Platform"
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=https://yourdomain.com

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=rental_platform
DB_USERNAME=rental_user
DB_PASSWORD=your_secure_password

# Storage (S3 recommended for production)
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=your-bucket-name

# Email (SMTP)
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=587
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@yourdomain.com
MAIL_FROM_NAME="${APP_NAME}"

# Queue
QUEUE_CONNECTION=database

# Session & Cache
SESSION_DRIVER=database
CACHE_STORE=redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# Security
SANCTUM_STATEFUL_DOMAINS=yourdomain.com
```

#### 2.3 Application Setup
```bash
php artisan key:generate
php artisan migrate --force
php artisan db:seed --force
php artisan storage:link
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize

# Set permissions
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

### 3. Frontend Setup (React)

#### 3.1 Install Dependencies & Build
```bash
cd /var/www/Rental-Platform/frontend
npm install
```

#### 3.2 Environment Configuration
```bash
cp .env.example .env
nano .env
```

**Production .env:**
```env
VITE_API_URL=https://yourdomain.com
```

#### 3.3 Build Production Assets
```bash
npm run build
```

### 4. Web Server Configuration

#### 4.1 Nginx Configuration
```nginx
# /etc/nginx/sites-available/rental-platform
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/Rental-Platform/frontend/dist;
    index index.html;

    # Frontend (React) - Serve static files
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "public, max-age=31536000";
    }

    # API routes - Proxy to Laravel
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Admin panel - Proxy to Laravel
    location /admin/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Storage/uploads - Proxy to Laravel
    location /storage/ {
        proxy_pass http://127.0.0.1:8000;
        add_header Cache-Control "public, max-age=31536000";
    }
}

# Laravel Backend (internal)
server {
    listen 127.0.0.1:8000;
    root /var/www/Rental-Platform/backend/public;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.ht {
        deny all;
    }
}
```

#### 4.2 Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/rental-platform /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. SSL Certificate (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 6. Queue Worker Setup

#### 6.1 Supervisor Configuration
```ini
# /etc/supervisor/conf.d/rental-platform-worker.conf
[program:rental-platform-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/Rental-Platform/backend/artisan queue:work --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/Rental-Platform/backend/storage/logs/worker.log
stopwaitsecs=3600
```

#### 6.2 Start Queue Workers
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start rental-platform-worker:*
```

---

## 🔐 SECURITY CONFIGURATION

### 1. Firewall Setup
```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### 2. Database Security
```bash
mysql_secure_installation
```

### 3. File Permissions
```bash
find /var/www/Rental-Platform -type f -exec chmod 644 {} \;
find /var/www/Rental-Platform -type d -exec chmod 755 {} \;
chmod -R 775 /var/www/Rental-Platform/backend/storage
chmod -R 775 /var/www/Rental-Platform/backend/bootstrap/cache
```

### 4. Hide Server Information
```nginx
# In nginx.conf
server_tokens off;
```

---

## 📊 MONITORING & LOGGING

### 1. Log Rotation
```bash
# /etc/logrotate.d/rental-platform
/var/www/Rental-Platform/backend/storage/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
}
```

### 2. System Monitoring
- **Uptime monitoring:** UptimeRobot, Pingdom
- **Error tracking:** Sentry, Bugsnag
- **Performance:** New Relic, DataDog
- **Server monitoring:** Netdata, Zabbix

### 3. Backup Strategy

#### Database Backup
```bash
#!/bin/bash
# /etc/cron.daily/backup-rental-platform
BACKUP_DIR="/backups/rental-platform"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
mysqldump -u rental_user -p rental_platform > $BACKUP_DIR/db_$DATE.sql
find $BACKUP_DIR -name "db_*.sql" -mtime +7 -delete
```

#### File Backup
```bash
# Backup uploaded images and storage
rsync -av /var/www/Rental-Platform/backend/storage/app/public/ /backups/storage/
```

---

## 🚀 DEPLOYMENT AUTOMATION

### Zero-Downtime Deployment Script
```bash
#!/bin/bash
# deploy.sh

set -e

echo "🚀 Starting deployment..."

# Pull latest code
git pull origin main

# Backend updates
cd backend
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize

# Frontend updates
cd ../frontend
npm ci
npm run build

# Restart services
sudo supervisorctl restart rental-platform-worker:*
sudo systemctl reload php8.3-fpm
sudo systemctl reload nginx

echo "✅ Deployment completed successfully!"
```

---

## 🧪 HEALTH CHECKS

### Application Health Endpoint
```bash
# Check backend health
curl https://yourdomain.com/api/ping
# Expected: {"status":"ok","time":"..."}

# Check frontend
curl -I https://yourdomain.com/
# Expected: HTTP/1.1 200 OK
```

### Database Health
```bash
php artisan tinker --execute="DB::connection()->getPdo();"
```

### Queue Health
```bash
php artisan queue:monitor
supervisorctl status rental-platform-worker:*
```

---

## 📈 PERFORMANCE OPTIMIZATION

### 1. PHP OPcache
```ini
# /etc/php/8.3/fpm/conf.d/10-opcache.ini
opcache.enable=1
opcache.memory_consumption=128
opcache.interned_strings_buffer=8
opcache.max_accelerated_files=4000
opcache.revalidate_freq=2
opcache.fast_shutdown=1
```

### 2. Database Optimization
```sql
-- Add indexes for performance
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_bookings_property_status ON bookings(property_id, status);
CREATE INDEX idx_reviews_property_status ON reviews(property_id, status);
```

### 3. Redis Cache
```bash
# Install Redis
sudo apt install redis-server
sudo systemctl enable redis-server
```

### 4. CDN Setup
- Configure CloudFlare or AWS CloudFront
- Cache static assets and images
- Enable Gzip compression

---

## 🆘 TROUBLESHOOTING

### Common Issues

#### 1. 500 Internal Server Error
```bash
# Check Laravel logs
tail -f /var/www/Rental-Platform/backend/storage/logs/laravel.log

# Check PHP-FPM logs
tail -f /var/log/php8.3-fpm.log

# Check Nginx logs
tail -f /var/log/nginx/error.log
```

#### 2. Queue Jobs Not Processing
```bash
# Check supervisor status
sudo supervisorctl status

# Restart workers
sudo supervisorctl restart rental-platform-worker:*

# Check worker logs
tail -f /var/www/Rental-Platform/backend/storage/logs/worker.log
```

#### 3. Database Connection Issues
```bash
# Test database connection
php artisan tinker --execute="DB::connection()->getPdo();"

# Check database credentials in .env
```

#### 4. File Permission Issues
```bash
# Fix storage permissions
sudo chown -R www-data:www-data /var/www/Rental-Platform/backend/storage
sudo chmod -R 775 /var/www/Rental-Platform/backend/storage
```

---

## 📞 SUPPORT & MAINTENANCE

### Regular Maintenance Tasks

#### Daily
- Monitor error logs
- Check queue status
- Review system resources

#### Weekly  
- Update security patches
- Review backup integrity
- Check database performance

#### Monthly
- Update dependencies
- Review security scans
- Optimize database

### Emergency Contacts
- **Developer:** anemettemadsen33@outlook.com
- **Server Admin:** [Your server admin]
- **Database Admin:** [Your DBA]

---

## ✅ PRODUCTION CHECKLIST

Before going live, ensure:

- [ ] SSL certificate installed and working
- [ ] Domain DNS configured correctly
- [ ] Database secured with strong passwords
- [ ] Email SMTP configured and tested
- [ ] Queue workers running and monitored
- [ ] Backups configured and tested
- [ ] Monitoring tools setup
- [ ] Error tracking configured
- [ ] Performance optimization applied
- [ ] Security hardening completed
- [ ] Load testing performed
- [ ] Admin accounts created
- [ ] Demo data removed/updated
- [ ] Google Analytics/tracking setup
- [ ] GDPR compliance implemented
- [ ] Terms of Service and Privacy Policy added

---

**🎉 Congratulations! Your Rental Platform is now PRODUCTION READY!**

**Platform URL:** https://yourdomain.com  
**Admin Panel:** https://yourdomain.com/admin  
**API Base:** https://yourdomain.com/api

---

*For technical support or questions, please contact the development team or create an issue in the GitHub repository.*