# 🔍 Meilisearch Integration - Setup & Usage

## Overview

Meilisearch este un motor de căutare self-hosted, open-source, rapid și ușor de configurat. Oferă căutare full-text, filtre avansate și sortare fără costuri de cloud.

## Installation & Configuration

### 1. Start Meilisearch (Docker Compose)

Meilisearch este deja configurat în `docker-compose.yml`:

```bash
docker-compose up -d meilisearch
```

Acces local: http://localhost:7700

### 2. Environment Variables

În `backend/.env`:

```env
SCOUT_DRIVER=meilisearch
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_KEY=
```

**Notă:** În development, cheia poate fi goală. Pentru production, setează o cheie master (vezi documentația Meilisearch).

### 3. Index Properties

Odată ce serverul rulează și proprietățile sunt create, indexează-le:

```bash
php artisan scout:import "App\Models\Property"
```

Această comandă va indexa toate proprietățile publicate în Meilisearch.

## API Endpoint

### `GET /api/search`

Căutare avansată cu filtrare și sortare.

**Parametri de query:**

- `q` (string): Căutare în titlu, descriere, oraș
- `city` (string): Filtrare după oraș
- `country` (string): Filtrare după țară
- `property_type` (string): Filtrare după tip (apartment, house, etc.)
- `rental_type` (string): Filtrare după rental_type (short_term, long_term, both)
- `bedrooms` (int): Minimum dormitoare
- `bathrooms` (int): Minimum băi
- `max_guests` (int): Minimum capacitate oaspeți
- `min_price` (float): Preț minim per noapte
- `max_price` (float): Preț maxim per noapte
- `sort` (string): Sortare (ex: `price_per_night:asc`, `bedrooms:desc`)
- `page` (int): Pagina curentă (default: 1)
- `per_page` (int): Iteme per pagină (default: 20, max: 100)

**Exemplu request:**

```bash
curl "http://localhost:8000/api/search?q=modern&city=București&bedrooms=2&min_price=50&max_price=150&sort=price_per_night:asc"
```

**Response:**

```json
{
  "data": [...],
  "total": 42,
  "page": 1,
  "per_page": 20,
  "last_page": 3
}
```

## Frontend Integration

Creați un serviciu pentru search în `frontend/src/services/search.service.ts`:

```typescript
import api from './api'
import { Property } from '../types'

interface SearchParams {
  q?: string
  city?: string
  country?: string
  property_type?: string
  rental_type?: string
  bedrooms?: number
  bathrooms?: number
  max_guests?: number
  min_price?: number
  max_price?: number
  sort?: string
  page?: number
  per_page?: number
}

interface SearchResponse {
  data: Property[]
  total: number
  page: number
  per_page: number
  last_page: number
}

export const searchService = {
  async search(params: SearchParams): Promise<SearchResponse> {
    const response = await api.get('/search', { params })
    return response.data
  }
}
```

## Maintenance Commands

### Re-index toate proprietățile

```bash
php artisan scout:import "App\Models\Property"
```

### Flush index (șterge toate înregistrările)

```bash
php artisan scout:flush "App\Models\Property"
```

### Verifică status Meilisearch

```bash
curl http://localhost:7700/health
```

## Production Considerations

### 1. Security

În production, **setează o cheie master**:

```env
MEILISEARCH_KEY=your-secure-master-key-here
```

Pornește containerul cu cheia:

```yaml
meilisearch:
  environment:
    MEILI_MASTER_KEY: your-secure-master-key-here
    MEILI_ENV: production
```

### 2. Index Settings

Configurația index-urilor se face în `config/scout.php`:

```php
'meilisearch' => [
    'index-settings' => [
        'properties' => [
            'filterableAttributes' => ['city', 'country', 'property_type', ...],
            'sortableAttributes' => ['price_per_night', 'bedrooms', ...],
            'searchableAttributes' => ['title', 'description', 'city'],
        ],
    ],
],
```

După modificări, rulează:

```bash
php artisan scout:sync-index-settings
```

### 3. Queue Syncing

Pentru performanță, pune indexarea în queue:

În `config/scout.php`:

```php
'queue' => true,
```

Apoi rulează queue worker:

```bash
php artisan queue:work
```

## Troubleshooting

### Error: Connection refused

- Verifică că containerul Meilisearch rulează: `docker-compose ps`
- Verifică `MEILISEARCH_HOST` în `.env`

### Properties nu apar în rezultate

- Rulează: `php artisan scout:import "App\Models\Property"`
- Verifică că status este `published` (doar acestea sunt indexate)

### Index settings nu se aplică

- Rulează: `php artisan scout:sync-index-settings`
- Sau: `php artisan scout:flush && php artisan scout:import`

## Resources

- [Meilisearch Documentation](https://www.meilisearch.com/docs)
- [Laravel Scout Documentation](https://laravel.com/docs/scout)
- [Meilisearch PHP Client](https://github.com/meilisearch/meilisearch-php)

## Cost: FREE (Self-hosted)

Meilisearch este complet gratuit și open-source. Singurele costuri sunt resursele serverului (CPU, RAM, disk), dar pentru un deployment mic-mediu, un server modest este suficient.
