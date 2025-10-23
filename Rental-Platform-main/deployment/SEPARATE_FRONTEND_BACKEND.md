# Separate Admin (Filament) and Public Site

This guide covers running the Filament admin (Laravel backend) on its own VPS/domain and the public site (frontend) on a separate host.

## 1) Admin (Backend) VPS

- Domain (example): `admin.example.com`
- In backend `.env`:
  - `APP_URL=https://admin.example.com`
  - `FILAMENT_ADMIN_DOMAIN=admin.example.com`
  - `SESSION_DOMAIN=.example.com` (optional, only if needed across subdomains)
  - `FRONTEND_URL=https://www.example.com` (optional, used for CORS defaults)
- SSL/TLS: enable HTTPS and redirect HTTP->HTTPS.
- Ensure outbound network access to:
  - SMTP (587/465)
  - SMS provider API (e.g., Twilio)
  - Public site API (443)
- Queues: run queue workers for emails/SMS if using `QUEUE_CONNECTION`.

### Admin Settings (Filament)
In Filament → Settings, configure:
- Email (SMTP): host/port/user/password/encryption/from
- Public site:
  - URL site public (e.g., `https://www.example.com`)
  - API Base URL (optional, e.g., `https://api.example.com`)
  - API Key (optional, if your public API requires Bearer)
- SMS: provider and credentials (Twilio supported for test action)

Admin root `/` redirects to `URL site public` if set.

## 2) Public Site VPS

- Host the actual user-facing site or SPA here (separate repository recommended).
- If the public site calls the backend from the browser:
  - Configure backend CORS to allow the public origin. This project auto-merges the origin derived from Filament Settings (URL site public / API Base URL) into `cors.allowed_origins` at runtime.
  - Keep `supports_credentials` as needed (Sanctum flows).
- Provide a health endpoint (this project exposes `/api/ping` on the backend). The Settings page includes a "Test public site" action that calls API Base URL + `/api/ping` when available.

## 3) Optional: API Security

- Prefer server-to-server calls with IP allowlists and tokens. For browser calls, use HTTPS + CORS + CSRF/Sanctum as appropriate.
- If using Bearer tokens for public->admin API calls, set a token in Filament Settings ("Cheie API").

## 4) Local Development

- `docker-compose.yml` includes backend, PostgreSQL, and Meilisearch for local development.

## 5) Migration Plan

1. Deploy backend (admin) to its VPS and configure `.env`.
2. Deploy public site to its own VPS/hosting.
3. In admin (Filament Settings), set "URL site public" and optionally API base + key.
4. Verify:
   - Filament action "Testează conexiunea site public" shows success.
   - Email test and SMS test work.
5. Update DNS/SSL.
