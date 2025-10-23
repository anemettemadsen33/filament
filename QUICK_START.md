# 🚀 Quick Start Guide - Rental Platform

**Get up and running in 10 minutes!**

---

## Prerequisites Checklist

Before starting, ensure you have:

- [ ] PHP 8.3 or higher installed
- [ ] Composer installed
- [ ] Node.js 20 or higher installed
- [ ] PostgreSQL 14 or higher installed (or MySQL)
- [ ] Git installed

**Quick Check:**
```bash
php -v        # Should show 8.3+
composer -V   # Should show 2.0+
node -v       # Should show 20+
psql --version # Should show 14+
git --version
```

---

## 🏃 Fast Setup (Development)

### Step 1: Clone Repository (30 seconds)

```bash
git clone https://github.com/yourusername/filament.git
cd filament
```

### Step 2: Setup Backend (3-4 minutes)

```bash
# Navigate to backend
cd Rental-Platform-main/backend

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Edit .env file with your database credentials
# You can use nano, vim, or your favorite editor
nano .env

# Generate application key
php artisan key:generate

# Create database (if not exists)
# PostgreSQL:
createdb rental_platform
# Or use pgAdmin/SQL client

# Run migrations
php artisan migrate

# Seed demo data (optional)
php artisan db:seed

# Create storage link
php artisan storage:link

# Start development server
php artisan serve
```

**Backend is now running at:** http://localhost:8000

### Step 3: Setup Frontend (2-3 minutes)

Open a **new terminal window** and:

```bash
# Navigate to frontend
cd filament/Renthub

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env to point to backend
echo "VITE_API_BASE_URL=http://localhost:8000" > .env

# Start development server
npm run dev
```

**Frontend is now running at:** http://localhost:5173

### Step 4: Access Applications (30 seconds)

Open your browser and visit:

1. **Frontend (Public Site):** http://localhost:5173
2. **Backend API:** http://localhost:8000/api
3. **Admin Panel:** http://localhost:8000/admin

---

## 🎯 First Time Setup

### Create Admin User

```bash
cd Rental-Platform-main/backend
php artisan make:filament-user

# Enter details when prompted:
# Name: Admin User
# Email: admin@example.com
# Password: password (choose a strong password!)
```

### Test API Connection

```bash
# Test API is working
curl http://localhost:8000/api/health

# Should return: {"status":"ok"}
```

### Test Frontend-Backend Connection

1. Visit http://localhost:5173
2. Click "Sign Up" or "Login"
3. Create a test account
4. You should be able to register and login successfully

---

## 🐳 Docker Setup (Alternative - Easier!)

If you have Docker installed:

```bash
cd filament

# Start all services
docker-compose up -d

# Run migrations
docker-compose exec backend php artisan migrate

# Access applications
# Backend: http://localhost:8000
# Frontend: http://localhost:5173
# Database: localhost:5432
```

---

## 🔧 Configuration

### Minimal .env Settings for Backend

```env
APP_NAME="Rental Platform"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=rental_platform
DB_USERNAME=postgres
DB_PASSWORD=your_password

FRONTEND_URL=http://localhost:5173
SANCTUM_STATEFUL_DOMAINS=localhost:5173

MAIL_MAILER=log
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
```

### Minimal .env Settings for Frontend

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_ENV=local
VITE_APP_DEBUG=true
```

---

## ✅ Verify Installation

### Backend Health Check

```bash
cd Rental-Platform-main/backend

# Check Laravel installation
php artisan --version

# Check database connection
php artisan migrate:status

# Run tests (optional)
php artisan test
```

### Frontend Health Check

```bash
cd Renthub

# Check build
npm run build

# Run linter
npm run lint

# Run tests (optional)
npm test
```

---

## 📝 Sample Data

### Seed Demo Properties

```bash
cd Rental-Platform-main/backend
php artisan db:seed --class=PropertySeeder
```

### Create Test Users

```bash
# Owner account
php artisan tinker
>>> User::create([
...   'name' => 'Property Owner',
...   'email' => 'owner@example.com',
...   'password' => bcrypt('password'),
...   'role' => 'owner'
... ]);

# Guest account
>>> User::create([
...   'name' => 'Guest User',
...   'email' => 'guest@example.com',
...   'password' => bcrypt('password'),
...   'role' => 'guest'
... ]);
```

---

## 🎨 Customize

### Change Application Name

**Backend:**
```env
# .env
APP_NAME="Your Platform Name"
```

**Frontend:**
```env
# .env
VITE_APP_NAME="Your Platform Name"
```

### Change Color Scheme

**Frontend:**
Edit `Renthub/tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your brand colors
        500: '#your-color',
      }
    }
  }
}
```

---

## 🚨 Troubleshooting

### Issue: "Connection refused" error

**Solution:**
```bash
# Check if backend is running
curl http://localhost:8000

# If not, start it:
cd Rental-Platform-main/backend
php artisan serve
```

### Issue: CORS errors in browser

**Solution:**
```bash
# Update backend .env
FRONTEND_URL=http://localhost:5173

# Clear config cache
php artisan config:clear

# Restart server
php artisan serve
```

### Issue: "npm ERR! peer dependencies"

**Solution:**
```bash
# Use legacy peer deps
npm install --legacy-peer-deps

# Or update npm
npm install -g npm@latest
```

### Issue: Database connection failed

**Solution:**
```bash
# Test PostgreSQL connection
psql -h localhost -U postgres -d rental_platform

# Check credentials in .env
# Make sure database exists
createdb rental_platform
```

### Issue: Port already in use

**Solution:**
```bash
# Backend (change port)
php artisan serve --port=8001

# Frontend (change port)
npm run dev -- --port 5174

# Or kill process using port
# Linux/Mac:
lsof -ti:8000 | xargs kill -9

# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

---

## 📚 Next Steps

Once everything is running:

1. **Read the docs:**
   - [INTEGRATION_PLAN.md](INTEGRATION_PLAN.md) - Full architecture
   - [API_AUTH_DOCUMENTATION.md](Rental-Platform-main/API_AUTH_DOCUMENTATION.md) - API guide

2. **Explore the code:**
   - Backend: `Rental-Platform-main/backend/app/`
   - Frontend: `Renthub/src/`

3. **Try the features:**
   - Create a property listing
   - Make a booking
   - Leave a review
   - Test admin panel

4. **Run tests:**
   ```bash
   # Backend
   cd Rental-Platform-main/backend
   php artisan test

   # Frontend
   cd Renthub
   npm test
   ```

5. **Deploy to staging:**
   - Follow [CI_CD_GUIDE.md](CI_CD_GUIDE.md)
   - Set up GitHub Actions

---

## 🤝 Need Help?

- **Documentation:** Check README.md and other docs
- **Issues:** GitHub Issues
- **Community:** GitHub Discussions

---

## 🎉 You're All Set!

Your rental platform is now running locally. Happy coding!

**URLs to Remember:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api
- Admin Panel: http://localhost:8000/admin

---

**Next:** Start customizing the platform to match your needs!
