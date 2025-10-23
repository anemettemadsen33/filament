# Quick Start: Connect Your Public Site

## Your Repos
- **Backend/Admin**: `anemettemadsen33/Rental-Platform` (this repo)
- **Public Site**: `anemettemadsen33/rental-platform-desi`

## Step 1: Configure Backend (5 min)

### A) Update `.env` in this repo (backend)
```env
# Add your public site URL
FRONTEND_URL=https://rental-platform-desi.vercel.app

# If hosting admin on separate domain:
APP_URL=https://admin.yourdomain.com
FILAMENT_ADMIN_DOMAIN=admin.yourdomain.com

# Allow Sanctum stateful auth from public site
SANCTUM_STATEFUL_DOMAINS=localhost,localhost:5173,rental-platform-desi.vercel.app

# Session domain (if needed)
SESSION_DOMAIN=.yourdomain.com
```

### B) Login to Filament Admin
1. Access `/admin` in your backend
2. Go to **Setări** (Settings)
3. Fill in:
   - **URL site public**: `https://rental-platform-desi.vercel.app`
   - **SMTP settings** (if you want emails)
   - **SMS settings** (optional)
4. Click **"Testează conexiunea site public"** to verify

## Step 2: Configure Public Site (5 min)

In your `rental-platform-desi` repo:

### Update environment variables (Vercel/Netlify settings or `.env`)
```env
VITE_API_URL=https://your-backend-domain.com
# or for local testing:
VITE_API_URL=http://localhost:8000
```

### Update API client to use the backend
```typescript
// src/config/api.ts or similar
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
```

## Step 3: Test Integration (2 min)

### From your public site:
1. Try **Register** → should create user in backend
2. Try **Login** → should authenticate via backend
3. Try **Browse Properties** → should load from backend API
4. Try **Create Property** (as owner) → should save to backend

### Verify in Filament Admin:
- Check **Users** → new registered users appear
- Check **Properties** → created properties appear
- Check **Bookings** → bookings are recorded

## Step 4: Deploy

### Backend (Admin)
```bash
# On your VPS or hosting:
php artisan migrate --force
php artisan storage:link
php artisan optimize
php artisan queue:work --daemon  # if using queues
```

### Public Site
```bash
# Already deployed on Vercel/Netlify?
# Just update environment variable:
VITE_API_URL=https://admin.yourdomain.com
```

## Common Issues

### ❌ CORS Error
**Fix**: Add your public site URL in backend `.env`:
```env
FRONTEND_URL=https://rental-platform-desi.vercel.app
```

### ❌ 419 CSRF Token Mismatch
**Fix**: Call `/sanctum/csrf-cookie` before login:
```typescript
await axios.get(`${API_BASE_URL}/sanctum/csrf-cookie`);
await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
```

### ❌ 401 Unauthenticated
**Fix**: Use `withCredentials: true` in axios:
```typescript
axios.defaults.withCredentials = true;
```

## What You Get

✅ **Filament Admin** manages:
- Users, properties, bookings, reviews
- Email/SMS settings
- Public site connectivity
- All backend configuration

✅ **Public Site** handles:
- User-facing UI/UX
- Property search and booking
- User registration and login
- Owner property management

## Full Integration Guide

For detailed setup, see: [`INTEGRATION_WITH_PUBLIC_SITE.md`](./INTEGRATION_WITH_PUBLIC_SITE.md)

---

**Need help?** Check the logs:
- Backend: `storage/logs/laravel.log`
- Browser console for frontend errors
