# Frontend Integration Guide

Ghid pentru integrarea frontend-ului public cu backend-ul Laravel.

## Prezentare Generală

Backend-ul tău este pregătit să lucreze cu un frontend separat (Single Page Application - SPA). Autentificarea se face prin **Laravel Sanctum** cu token-uri API.

## Configurare Backend (.env)

Adaugă următoarele variabile în fișierul `.env` al backend-ului:

```env
# URL-ul backend-ului
APP_URL=http://localhost:8000

# URL-ul frontend-ului public (de exemplu, aplicația ta Spark)
FRONTEND_URL=http://localhost:5173

# Configurări sesiune
SESSION_DRIVER=cookie
SESSION_LIFETIME=120
SESSION_DOMAIN=localhost

# Domenii Sanctum pentru autentificare SPA
SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173
```

### Pentru Producție

Când deplasezi pe server, schimbă URL-urile:

```env
# Producție
APP_URL=https://api.domeniul-tau.com
FRONTEND_URL=https://domeniul-tau.com

SESSION_DOMAIN=.domeniul-tau.com
SANCTUM_STATEFUL_DOMAINS=domeniul-tau.com,www.domeniul-tau.com
```

## Storage Link pentru Fotografii

Pentru ca fotografiile de profil să fie accesibile public, rulează:

```bash
cd backend
php artisan storage:link
```

Acest lucru creează un link simbolic de la `public/storage` la `storage/app/public`.

## Endpoint-uri API Disponibile

### Autentificare

| Endpoint | Metodă | Descriere | Autentificat |
|----------|--------|-----------|--------------|
| `/api/auth/register` | POST | Înregistrare utilizator nou | Nu |
| `/api/auth/login` | POST | Autentificare utilizator | Nu |
| `/api/auth/me` | GET | Obține utilizatorul curent | Da |
| `/api/auth/logout` | POST | Deconectare | Da |
| `/api/auth/profile` | PUT | Actualizare profil | Da |
| `/api/auth/password` | PUT | Schimbare parolă | Da |

### Proprietăți

| Endpoint | Metodă | Descriere | Autentificat |
|----------|--------|-----------|--------------|
| `/api/properties` | GET | Listă proprietăți | Nu |
| `/api/properties/{id}` | GET | Detalii proprietate | Nu |
| `/api/properties` | POST | Creare proprietate | Da (Owner/Admin) |
| `/api/properties/{id}` | PUT | Actualizare proprietate | Da (Owner/Admin) |
| `/api/properties/{id}` | DELETE | Ștergere proprietate | Da (Owner/Admin) |

### Rezervări

| Endpoint | Metodă | Descriere | Autentificat |
|----------|--------|-----------|--------------|
| `/api/bookings` | GET | Listă rezervări | Da |
| `/api/bookings/{id}` | GET | Detalii rezervare | Da |
| `/api/bookings` | POST | Creare rezervare | Da |
| `/api/bookings/{id}` | PUT | Actualizare rezervare | Da |
| `/api/bookings/{id}` | DELETE | Anulare rezervare | Da |

### Review-uri

| Endpoint | Metodă | Descriere | Autentificat |
|----------|--------|-----------|--------------|
| `/api/reviews` | GET | Listă review-uri | Nu |
| `/api/reviews/{id}` | GET | Detalii review | Nu |
| `/api/reviews` | POST | Creare review | Da |
| `/api/reviews/{id}` | PUT | Actualizare review | Da |
| `/api/reviews/{id}` | DELETE | Ștergere review | Da |
| `/api/reviews/{id}/respond` | POST | Răspuns la review | Da (Owner/Admin) |

## Cum Funcționează Autentificarea

### 1. Înregistrare/Autentificare

Când un utilizator se înregistrează sau se autentifică, backend-ul returnează:

```json
{
  "user": {
    "id": 1,
    "name": "Ion Popescu",
    "email": "ion@example.com",
    "role": "guest"
  },
  "token": "1|abcdefghijklmnopqrstuvwxyz"
}
```

### 2. Salvare Token

Frontend-ul salvează token-ul (de obicei în `localStorage`):

```javascript
localStorage.setItem('auth_token', response.data.token);
```

### 3. Trimitere Token în Request-uri

Pentru endpoint-uri protejate, frontend-ul trebuie să includă token-ul în header:

```
Authorization: Bearer {token}
```

Exemplu cu JavaScript fetch:

```javascript
const token = localStorage.getItem('auth_token');

fetch('http://localhost:8000/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
  }
})
.then(response => response.json())
.then(data => console.log(data));
```

## Testare cu cURL

### Înregistrare

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Parola123!",
    "password_confirmation": "Parola123!"
  }'
```

### Autentificare

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Parola123!"
  }'
```

### Obținere Date Utilizator

```bash
curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer {token-primit-la-login}"
```

### Actualizare Profil

```bash
# Fără fotografie
curl -X PUT http://localhost:8000/api/auth/profile \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nume Actualizat",
    "bio": "Biografia mea"
  }'

# Cu fotografie
curl -X PUT http://localhost:8000/api/auth/profile \
  -H "Authorization: Bearer {token}" \
  -F "name=Nume Actualizat" \
  -F "bio=Biografia mea" \
  -F "photo=@/path/to/photo.jpg"
```

### Schimbare Parolă

```bash
curl -X PUT http://localhost:8000/api/auth/password \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "current_password": "ParolaVeche123!",
    "password": "ParolaNoua456!",
    "password_confirmation": "ParolaNoua456!"
  }'
```

## Configurare în Admin Filament

Backend-ul include un panou de setări în Filament Admin unde poți configura:

1. **Setări Email (SMTP)**:
   - Host SMTP
   - Port SMTP
   - Username SMTP
   - Parolă SMTP (criptată automat)
   - Criptare (TLS/SSL)
   - Adresă "De la"
   - Nume "De la"

2. **URL Pagină Publică**:
   - URL-ul site-ului public (frontend-ul tău)

Aceste setări se găsesc la: **Admin Panel → Settings**

Poți testa configurația email direct din admin folosind butonul "Send Test Email".

## Documentație Detaliată pentru Dezvoltator Frontend

Pentru documentație completă cu exemple de cod pentru React, Vue, și Svelte, vezi:

📄 **[API_AUTH_DOCUMENTATION.md](./API_AUTH_DOCUMENTATION.md)**

Această documentație include:
- Exemple complete de cod pentru toate framework-urile populare
- Gestionarea erorilor
- Securitate și best practices
- Configurare pentru producție
- Troubleshooting

## Securitate

### În Dezvoltare (Local)

- Backend: `http://localhost:8000`
- Frontend: `http://localhost:5173` (sau alt port)
- CORS este configurat automat pentru `FRONTEND_URL`

### În Producție

**IMPORTANT**: Folosește **HTTPS** în producție!

```env
APP_URL=https://api.domeniul-tau.com
FRONTEND_URL=https://domeniul-tau.com
```

### Recomandări Securitate

1. ✅ Folosește HTTPS în producție
2. ✅ Token-urile expiră automat (configurabil în Laravel)
3. ✅ Parola SMTP este criptată în baza de date
4. ✅ Validare pe ambele părți (frontend și backend)
5. ✅ CORS restrictionat la domenii specifice
6. ✅ Rate limiting pe endpoint-uri sensibile

## Depanare (Troubleshooting)

### Eroare CORS

**Simptom**: Browser-ul blochează request-urile cu eroare CORS.

**Soluție**: 
1. Verifică că `FRONTEND_URL` este setat corect în `.env`
2. Verifică că frontend-ul rulează pe URL-ul specificat
3. Restartează server-ul Laravel după modificări `.env`

```bash
cd backend
php artisan config:clear
php artisan serve
```

### Token Invalid (401 Unauthorized)

**Simptom**: Request-uri returnează 401 chiar dacă token-ul este trimis.

**Soluție**:
1. Verifică că token-ul este trimis cu format corect: `Bearer {token}`
2. Verifică că token-ul nu a expirat
3. Verifică că utilizatorul există în baza de date

### Fotografiile Nu Se Afișează

**Simptom**: URL-ul fotografiei returnează 404.

**Soluție**:
```bash
cd backend
php artisan storage:link
```

Verifică că `APP_URL` este setat corect în `.env`.

## Contact și Suport

Pentru întrebări despre API sau integrare:

1. Consultă documentația completă: [API_AUTH_DOCUMENTATION.md](./API_AUTH_DOCUMENTATION.md)
2. Testează endpoint-urile cu cURL sau Postman
3. Verifică log-urile Laravel: `storage/logs/laravel.log`

## Resurse Utile

- [Laravel Sanctum Documentation](https://laravel.com/docs/11.x/sanctum)
- [Laravel API Resources](https://laravel.com/docs/11.x/eloquent-resources)
- [Filament Admin Panel](https://filamentphp.com)
