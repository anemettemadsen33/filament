# Integration Guide: Admin Backend ↔ Public Site

## Your Setup

- **Admin Backend (this repo)**: Filament admin panel + Laravel API
- **Public Site**: https://github.com/anemettemadsen33/rental-platform-desi

## 1) Configure Backend Settings (Filament Admin)

Access Filament at `/admin` → **Setări** and configure:

### Public Site Settings
```
URL site public: https://rental-platform-desi.vercel.app
API Base URL: https://YOUR-ADMIN-DOMAIN.com (sau lasă gol dacă e același server)
Cheie API: (opțional, doar dacă vrei să protejezi endpoint-urile server-to-server)
```

### Email Settings (SMTP)
```
Host SMTP: smtp.mailgun.com (sau alt provider)
Port: 587
Utilizator: your-username
Parolă: your-password
Criptare: TLS
From Address: noreply@yourdomain.com
From Name: Rental Platform
```

### SMS Settings (optional)
```
Furnizor SMS: Twilio
Număr/ID expeditor: +1234567890
Account SID: ACxxxxx...
Auth Token: your-token
```

## 2) Backend Environment (.env)

```env
# Admin domain (if separate subdomain)
APP_URL=https://admin.yourdomain.com
FILAMENT_ADMIN_DOMAIN=admin.yourdomain.com

# Public site (optional, can also set in Filament Settings)
PUBLIC_SITE_URL=https://rental-platform-desi.vercel.app

# Database
DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=rental_platform
DB_USERNAME=postgres
DB_PASSWORD=your-password

# CORS - allow public site to call API from browser
FRONTEND_URL=https://rental-platform-desi.vercel.app

# Session (if using Sanctum stateful)
SESSION_DOMAIN=.yourdomain.com
SANCTUM_STATEFUL_DOMAINS=rental-platform-desi.vercel.app

# Mail (or set in Filament)
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailgun.com
MAIL_PORT=587
MAIL_USERNAME=your-username
MAIL_PASSWORD=your-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@yourdomain.com
MAIL_FROM_NAME="Rental Platform"
```

## 3) Public Site Configuration

In your `rental-platform-desi` repo, configure API endpoint:

### Environment Variables (.env or Vercel settings)
```env
VITE_API_URL=https://admin.yourdomain.com
# or if backend is on same domain:
VITE_API_URL=https://api.yourdomain.com
```

### API Service (example)
```typescript
// src/services/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true, // for Sanctum CSRF cookies
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Get CSRF cookie before authenticated requests
export const getCsrfCookie = () => {
  return apiClient.get('/sanctum/csrf-cookie');
};
```

## 4) API Endpoints Available

Your public site can consume these Laravel API endpoints:

### Authentication
```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me (authenticated)
POST /api/auth/logout (authenticated)
PUT  /api/auth/profile (authenticated)
PUT  /api/auth/password (authenticated)
```

### Properties
```
GET  /api/properties (public - list with filters)
GET  /api/properties/{id} (public - detail)
POST /api/properties (authenticated - owner only)
PUT  /api/properties/{id} (authenticated - owner only)
DELETE /api/properties/{id} (authenticated - owner only)
```

### Bookings
```
GET  /api/bookings (authenticated - user's bookings)
GET  /api/bookings/{id} (authenticated)
POST /api/bookings (authenticated - create booking)
PUT  /api/bookings/{id} (authenticated - update)
DELETE /api/bookings/{id} (authenticated - cancel)
```

### Reviews
```
GET  /api/reviews?property_id={id} (public - approved reviews)
POST /api/reviews (authenticated - create)
PUT  /api/reviews/{id} (authenticated)
DELETE /api/reviews/{id} (authenticated)
```

### Search
```
GET  /api/search?q={query}&location={location}&... (public)
```

### Localization
```
GET  /api/localization/info
POST /api/localization/set-locale
POST /api/localization/set-currency
```

### Health Check
```
GET  /api/ping (public - returns status)
```

## 5) CORS Configuration

Backend automatically allows your public site origin based on Settings:
- Origins from "URL site public" and "API Base URL" are auto-added to CORS
- `withCredentials: true` required for Sanctum authentication

## 6) Authentication Flow (Sanctum)

### Login Flow
```typescript
// 1. Get CSRF cookie first
await getCsrfCookie();

// 2. Login
await apiClient.post('/auth/login', {
  email: 'user@example.com',
  password: 'password'
});

// 3. Get authenticated user
const { data } = await apiClient.get('/auth/me');
```

### Register Flow
```typescript
await getCsrfCookie();

await apiClient.post('/auth/register', {
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password',
  password_confirmation: 'password',
  role: 'guest' // or 'owner'
});
```

## 7) Deployment Checklist

### Backend (Admin)
- [ ] Deploy to VPS/cloud (DigitalOcean, AWS, Laravel Forge)
- [ ] Configure domain: `admin.yourdomain.com`
- [ ] SSL certificate (Let's Encrypt)
- [ ] Run migrations: `php artisan migrate --force`
- [ ] Configure queue workers: `php artisan queue:work`
- [ ] Set all `.env` variables (especially DB, mail, CORS)
- [ ] Test API endpoints: `/api/ping`, `/api/properties`

### Public Site (Frontend)
- [ ] Deploy to Vercel/Netlify (already done?)
- [ ] Set environment variable: `VITE_API_URL=https://admin.yourdomain.com`
- [ ] Test login/register flow
- [ ] Test property listing/search
- [ ] Test booking creation

### Integration Testing
- [ ] Open Filament Admin → Setări
- [ ] Fill in "URL site public": `https://rental-platform-desi.vercel.app`
- [ ] Click "Testează conexiunea site public" (should succeed)
- [ ] Send test email
- [ ] From public site, try to login → should work
- [ ] Create a property from public site → verify in Filament admin

## 8) Troubleshooting

### CORS Errors
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Fix**: 
- Check `FRONTEND_URL` in backend `.env`
- Verify origin is added in Filament Settings → "URL site public"
- Ensure backend returns proper CORS headers

### 419 CSRF Token Mismatch
**Fix**:
- Call `/sanctum/csrf-cookie` before login/register
- Use `withCredentials: true` in axios
- Check `SESSION_DOMAIN` and `SANCTUM_STATEFUL_DOMAINS`

### 401 Unauthenticated
**Fix**:
- Verify token is stored after login
- Check auth middleware on backend routes
- Ensure cookies are sent with `withCredentials: true`

## 9) Optional: Server-to-Server Communication

If admin needs to call public site API (reverse direction):

### In Filament Settings
```
API Base URL: https://rental-platform-desi.vercel.app/api
Cheie API: your-bearer-token
```

### Use in Laravel
```php
use Illuminate\Support\Facades\Http;

$response = Http::withHeaders([
    'Authorization' => 'Bearer ' . config('services.public_site.api_key'),
])
->get(config('services.public_site.api_base_url') . '/endpoint');
```

## 10) Next Steps

1. Configure Filament Settings with your public site URL
2. Update `rental-platform-desi` environment variables with backend API URL
3. Test the integration locally first (use ngrok for backend if needed)
4. Deploy both and test in production
5. Monitor logs and adjust CORS/Sanctum settings as needed

## Support

For issues:
- Backend API errors: check `storage/logs/laravel.log`
- Frontend errors: check browser console
- Use Filament admin test buttons to verify connectivity
