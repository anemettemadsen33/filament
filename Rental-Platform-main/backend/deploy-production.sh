#!/bin/bash

# RentHub Production Deployment Script
# This script helps set up the Laravel backend for production VPS deployment

echo "🚀 Starting RentHub Backend Production Setup..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    print_warning "Running as root. Consider using a non-root user for better security."
fi

# Update system packages
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install required packages
print_status "Installing required packages..."
sudo apt install -y nginx php8.3 php8.3-fpm php8.3-mysql php8.3-pgsql php8.3-sqlite3 \
php8.3-xml php8.3-curl php8.3-zip php8.3-mbstring php8.3-bcmath php8.3-gd \
postgresql postgresql-contrib certbot python3-certbot-nginx composer git unzip

# Start and enable services
print_status "Starting services..."
sudo systemctl start nginx
sudo systemctl enable nginx
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create PostgreSQL database and user
print_status "Setting up PostgreSQL database..."
read -p "Enter database name [renthub]: " DB_NAME
DB_NAME=${DB_NAME:-renthub}

read -p "Enter database username [renthub_user]: " DB_USER
DB_USER=${DB_USER:-renthub_user}

read -s -p "Enter database password: " DB_PASS
echo

sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;"
sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
sudo -u postgres psql -c "ALTER USER $DB_USER CREATEDB;"

# Create application directory
print_status "Setting up application directory..."
sudo mkdir -p /var/www/renthub
sudo chown -R $USER:www-data /var/www/renthub

# Clone or copy your application
print_status "Application files should be placed in /var/www/renthub"
print_warning "Please upload your Laravel application files to /var/www/renthub"

# Set up environment file
print_status "Creating environment configuration..."
read -p "Enter your domain (e.g., admin.yourdomain.com): " DOMAIN

cat > /var/www/renthub/.env << EOL
APP_NAME="RentHub Admin"
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_TIMEZONE=UTC
APP_URL=https://$DOMAIN

APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US

APP_MAINTENANCE_DRIVER=file
APP_MAINTENANCE_STORE=database

BCRYPT_ROUNDS=12

LOG_CHANNEL=stack
LOG_STACK=single
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=error

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=$DB_NAME
DB_USERNAME=$DB_USER
DB_PASSWORD=$DB_PASS

SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null

BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local
QUEUE_CONNECTION=database

CACHE_STORE=database
CACHE_PREFIX=

MEMCACHED_HOST=127.0.0.1

REDIS_CLIENT=phpredis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=
MAIL_PORT=587
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@$DOMAIN"
MAIL_FROM_NAME="\${APP_NAME}"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

VITE_APP_NAME="\${APP_NAME}"
EOL

# Set proper permissions
print_status "Setting file permissions..."
sudo chown -R $USER:www-data /var/www/renthub
sudo chmod -R 755 /var/www/renthub
sudo chmod -R 775 /var/www/renthub/storage
sudo chmod -R 775 /var/www/renthub/bootstrap/cache

# Install Composer dependencies
print_status "Installing Composer dependencies..."
cd /var/www/renthub
composer install --optimize-autoloader --no-dev

# Generate application key
print_status "Generating application key..."
php artisan key:generate

# Run database migrations
print_status "Running database migrations..."
php artisan migrate --force

# Seed database with default settings
print_status "Seeding database..."
php artisan db:seed --class=SettingsSeeder

# Clear and cache configuration
print_status "Optimizing application..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Create Nginx configuration
print_status "Creating Nginx configuration..."
sudo tee /etc/nginx/sites-available/renthub << EOL
server {
    listen 80;
    server_name $DOMAIN;
    root /var/www/renthub/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files \$uri \$uri/ /index.php?\$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME \$realpath_root\$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
EOL

# Enable the site
sudo ln -sf /etc/nginx/sites-available/renthub /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Setup SSL with Let's Encrypt
print_status "Setting up SSL certificate..."
read -p "Do you want to setup SSL certificate with Let's Encrypt? (y/n): " setup_ssl

if [[ $setup_ssl =~ ^[Yy]$ ]]; then
    sudo certbot --nginx -d $DOMAIN
    print_status "SSL certificate installed successfully!"
fi

# Create admin user
print_status "Creating admin user..."
php artisan tinker --execute="
\$user = new App\Models\User();
\$user->name = 'Admin';
\$user->email = 'admin@rental.com';
\$user->password = Hash::make('admin2024');
\$user->email_verified_at = now();
\$user->is_admin = true;
\$user->save();
echo 'Admin user created successfully!';
"

# Setup log rotation
print_status "Setting up log rotation..."
sudo tee /etc/logrotate.d/renthub << EOL
/var/www/renthub/storage/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    copytruncate
}
EOL

# Create a systemd service for queue worker (if needed)
print_status "Setting up queue worker service..."
sudo tee /etc/systemd/system/renthub-worker.service << EOL
[Unit]
Description=RentHub Queue Worker
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/renthub
ExecStart=/usr/bin/php /var/www/renthub/artisan queue:work --sleep=3 --tries=3 --max-time=3600
Restart=always
RestartSec=30

[Install]
WantedBy=multi-user.target
EOL

sudo systemctl enable renthub-worker
sudo systemctl start renthub-worker

print_status "🎉 RentHub Backend Production Setup Complete!"
echo
echo "📝 Next steps:"
echo "1. Access your admin panel: https://$DOMAIN/admin"
echo "2. Login with: admin@rental.com / admin2024"
echo "3. Go to Settings to configure:"
echo "   - Frontend domain"
echo "   - SMTP settings for email"
echo "   - Twilio settings for SMS"
echo "   - Contact information"
echo "4. Update the frontend API URL to: https://$DOMAIN/api"
echo
echo "🔧 Important files:"
echo "- Application: /var/www/renthub"
echo "- Environment: /var/www/renthub/.env"
echo "- Nginx config: /etc/nginx/sites-available/renthub"
echo "- Logs: /var/www/renthub/storage/logs/"
echo
print_status "Your RentHub backend is ready for production! 🚀"