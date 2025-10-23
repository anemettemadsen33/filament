# 🚀 Ghid Instalare Locală - Rental Platform

## Prerequisite

- Docker & Docker Compose (recomandat) SAU
- PHP 8.2+, Composer, Node.js 18+, PostgreSQL/MySQL

---

## ✅ Metoda 1: Cu Docker (RECOMANDAT - cel mai simplu)

### 1. Pornește toate serviciile:

```bash
docker-compose up -d
```

Acest comandă va porni:
- **PostgreSQL** (baza de date) pe portul 5432
- **Meilisearch** (căutare) pe portul 7700
- **Backend Laravel** pe portul 8000
- **Frontend React** pe portul 3000

### 2. Instalează dependențele Laravel:

```bash
docker exec -it rental_platform_backend bash
cd /var/www/html
composer install
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
exit
```

### 3. Accesează aplicația:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin
- **Meilisearch**: http://localhost:7700

---

## 🔧 Metoda 2: Instalare Manuală (fără Docker)

### Pasul 1: Setup Backend (Laravel)

```bash
cd backend

# Instalează dependențele PHP
composer install

# Copiază fișierul de configurare
cp .env.example .env

# Editează .env cu credențialele tale de bază de date
nano .env  # sau orice editor
```

**Configurare `.env` minimă:**

```env
APP_NAME="Rental Platform"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=rental_platform
DB_USERNAME=postgres
DB_PASSWORD=postgres

MAIL_MAILER=log
QUEUE_CONNECTION=sync

FRONTEND_URL=http://localhost:3000
```

**Apoi rulează:**

```bash
# Generează cheia aplicației
php artisan key:generate

# Rulează migrările și seeders
php artisan migrate --seed

# Creează link-ul pentru storage
php artisan storage:link

# Pornește serverul
php artisan serve
```

Backend va rula pe: **http://localhost:8000**

### Pasul 2: Setup Frontend (React)

Deschide un nou terminal:

```bash
cd frontend

# Instalează dependențele
npm install

# Copiază fișierul de configurare
cp .env.example .env

# Editează .env
nano .env
```

**Configurare `.env`:**

```env
VITE_API_URL=http://localhost:8000
```

**Apoi rulează:**

```bash
# Pornește frontend-ul
npm run dev
```

Frontend va rula pe: **http://localhost:3000**

---

## 👤 Conturi de Test

După `php artisan migrate --seed`, vei avea:

### Admin:
- Email: `admin@rental-platform.test`
- Parolă: `password`
- Acces: http://localhost:8000/admin

### Owner (Proprietar):
- Email: `owner@rental-platform.test`
- Parolă: `password`

### Guest (Oaspete):
- Email: `guest@rental-platform.test`
- Parolă: `password`

---

## 🧪 Testează că Totul Funcționează

### Test Backend:

```bash
curl http://localhost:8000/api/health
# Răspuns așteptat: {"status":"ok"}
```

### Test Frontend:

Deschide browserul la: http://localhost:3000

Ar trebui să vezi homepage-ul cu proprietăți.

---

## 🛠️ Comenzi Utile

### Backend:

```bash
# Rulează testele
php artisan test

# Șterge și recreează baza de date
php artisan migrate:fresh --seed

# Vezi logs
tail -f storage/logs/laravel.log

# Șterge cache-ul
php artisan cache:clear
php artisan config:clear
```

### Frontend:

```bash
# Build pentru producție
npm run build

# Lint code
npm run lint
```

### Docker:

```bash
# Vezi logs
docker-compose logs -f

# Oprește serviciile
docker-compose down

# Oprește și șterge volumele (baza de date)
docker-compose down -v

# Rebuild containers
docker-compose up -d --build
```

---

## 🐛 Troubleshooting

### Eroare: "Connection refused" la baza de date

- Verifică că PostgreSQL rulează: `docker ps` sau `sudo systemctl status postgresql`
- Verifică credențialele în `.env`

### Eroare: "Storage not linked"

```bash
php artisan storage:link
```

### Portul 8000/3000 deja ocupat

Schimbă porturile în `docker-compose.yml` sau folosește alte porturi:

```bash
php artisan serve --port=8080
npm run dev -- --port=3001
```

### Probleme cu permisiunile (Linux/Mac)

```bash
sudo chmod -R 775 storage bootstrap/cache
sudo chown -R $USER:www-data storage bootstrap/cache
```

---

## 📚 Documentație Suplimentară

- [Laravel Documentation](https://laravel.com/docs)
- [Filament Admin Panel](https://filamentphp.com/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 🎉 Gata!

Acum ar trebui să ai aplicația rulând local. Poți:

✅ Naviga pe frontend (http://localhost:3000)
✅ Accesa admin panel (http://localhost:8000/admin)
✅ Testa API-ul (http://localhost:8000/api)

Mult succes! 🚀
