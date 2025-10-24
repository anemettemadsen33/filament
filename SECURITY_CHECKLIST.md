# 🛡️ Security Checklist

**Project**: RentHub - Rental Platform  
**Date**: October 24, 2025  
**Acceptance Criteria**: 0 critical/high vulnerabilities or documented mitigations

---

## ✅ Quick Security Audit (Run Immediately)

### 1. Verify No Secrets in Code
```bash
# Check for common secret patterns
cd /home/runner/work/filament/filament
grep -r "password.*=" --include="*.php" --include="*.js" --include="*.ts" --exclude-dir=vendor --exclude-dir=node_modules | grep -v ".example"
grep -r "api_key.*=" --include="*.php" --include="*.js" --include="*.ts" --exclude-dir=vendor --exclude-dir=node_modules | grep -v ".example"
grep -r "secret.*=" --include="*.php" --include="*.js" --include="*.ts" --exclude-dir=vendor --exclude-dir=node_modules | grep -v ".example"

# Install and run git-secrets (optional)
# git secrets --scan
```

**Action**: Remove any found secrets immediately, rotate them, and add to `.gitignore`

### 2. Environment Files Check
- [ ] `.env` files are in `.gitignore`
- [ ] `.env.example` files have no real credentials
- [ ] All sensitive variables documented in `.env.example`

```bash
# Verify .env is ignored
cd /home/runner/work/filament/filament
grep -q "^\.env$" .gitignore && echo "✅ .env is ignored" || echo "❌ Add .env to .gitignore"
grep -q "^\.env$" Rental-Platform-main/backend/.gitignore && echo "✅ Backend .env is ignored" || echo "❌ Add .env to backend .gitignore"
grep -q "^\.env$" Renthub/.gitignore && echo "✅ Frontend .env is ignored" || echo "❌ Add .env to frontend .gitignore"
```

### 3. Dependency Audit
```bash
# Backend (Laravel/Composer)
cd Rental-Platform-main/backend
composer audit --no-dev
composer audit # Including dev dependencies

# Frontend (Node/npm)
cd ../../Renthub
npm audit --production
npm audit # Including dev dependencies
```

**Action**: Fix all critical and high severity vulnerabilities immediately

---

## 🔒 Backend Security (Laravel)

### Authentication & Authorization
- [ ] **Strong Password Requirements**
  - Minimum 8 characters
  - Uppercase, lowercase, number, special character
  - Location: Validation rules in `app/Http/Requests/Auth/`

- [ ] **Rate Limiting on Auth Endpoints**
  ```php
  // routes/api.php
  Route::middleware('throttle:5,1')->group(function () {
      Route::post('/auth/login', [AuthController::class, 'login']);
      Route::post('/auth/register', [AuthController::class, 'register']);
      Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
  });
  ```
  - [ ] Login: 5 attempts per minute
  - [ ] Registration: 3 attempts per hour
  - [ ] Password reset: 3 attempts per hour

- [ ] **Session Security**
  - [ ] `SESSION_SECURE_COOKIE=true` in production
  - [ ] `SESSION_HTTP_ONLY=true` enabled
  - [ ] `SESSION_SAME_SITE=lax` or `strict`
  - [ ] Session timeout configured (120 minutes default)

- [ ] **MFA for Admin Accounts**
  - [ ] Install Filament Shield or similar
  - [ ] Enable 2FA for all admin users
  - [ ] Document setup in ADMIN_GUIDE.md

### SQL Injection Prevention
- [ ] **Use Eloquent ORM or Query Builder** (Never raw queries)
- [ ] **Parameterized Queries** for any raw SQL
  ```php
  // ✅ Good
  DB::table('users')->where('email', $email)->first();
  
  // ❌ Bad
  DB::select("SELECT * FROM users WHERE email = '$email'");
  ```
- [ ] Audit all `DB::raw()` usages:
  ```bash
  cd Rental-Platform-main/backend
  grep -rn "DB::raw" app/
  ```

### CSRF Protection
- [ ] **CSRF enabled** in `app/Http/Kernel.php`
- [ ] All POST/PUT/DELETE routes protected
- [ ] `@csrf` token in all forms
- [ ] API routes use Sanctum tokens (stateless)

### File Upload Security
- [ ] **Validate MIME Types**
  ```php
  // app/Http/Requests/UploadImageRequest.php
  'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120', // 5MB
  ```
- [ ] **Store uploads outside web root** or use S3
  ```php
  // config/filesystems.php
  'disks' => [
      'uploads' => [
          'driver' => 'local',
          'root' => storage_path('app/uploads'),
      ],
  ],
  ```
- [ ] **Generate random filenames**
  ```php
  $filename = Str::random(40) . '.' . $file->extension();
  ```
- [ ] **Serve via signed URLs** (for private files)
  ```php
  URL::temporarySignedRoute('file.download', now()->addMinutes(30), ['file' => $file->id]);
  ```

### Security Headers Middleware
Create `app/Http/Middleware/SecurityHeaders.php`:
```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        
        // HSTS (only in production with HTTPS)
        if (config('app.env') === 'production') {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        }
        
        // CSP - adjust based on your needs
        $csp = "default-src 'self'; " .
               "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " .
               "style-src 'self' 'unsafe-inline'; " .
               "img-src 'self' data: https:; " .
               "font-src 'self' data:; " .
               "connect-src 'self'; " .
               "frame-ancestors 'none';";
        $response->headers->set('Content-Security-Policy', $csp);

        return $response;
    }
}
```

Register in `app/Http/Kernel.php`:
```php
protected $middleware = [
    // ...
    \App\Http\Middleware\SecurityHeaders::class,
];
```

### API Security
- [ ] **Sanctum tokens** for authentication
- [ ] **Token expiration** configured
  ```php
  // config/sanctum.php
  'expiration' => 60, // 60 minutes
  ```
- [ ] **API rate limiting**
  ```php
  Route::middleware('throttle:60,1')->group(function () {
      // API routes - 60 requests per minute
  });
  ```

### Database Security
- [ ] **Strong database password** (16+ chars, random)
- [ ] **Database user** has minimal privileges
- [ ] **Backup encryption** enabled
- [ ] **Connection over SSL** in production
  ```php
  // config/database.php
  'pgsql' => [
      'sslmode' => 'require', // For PostgreSQL
  ],
  ```

---

## 🔒 Frontend Security (React)

### XSS Prevention
- [ ] **DOMPurify** installed and configured
  ```bash
  cd Renthub
  npm install dompurify @types/dompurify
  ```
- [ ] **Sanitize user-generated content**
  ```tsx
  import DOMPurify from 'dompurify';
  
  const cleanHtml = DOMPurify.sanitize(userInput);
  <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
  ```
- [ ] **React auto-escapes** by default (use `{}` not `dangerouslySetInnerHTML`)

### Content Security Policy (CSP)
Add to `Renthub/index.html`:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' 'unsafe-eval'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data: https:; 
               font-src 'self' data:; 
               connect-src 'self' http://localhost:8000; 
               frame-ancestors 'none'; 
               base-uri 'self'; 
               form-action 'self';">
```

### Token Storage
- [ ] **Store tokens** in httpOnly cookies (preferred) or localStorage
- [ ] **Never store** in sessionStorage for sensitive data
- [ ] **Clear tokens** on logout
  ```tsx
  // src/lib/auth.ts
  export const logout = () => {
    localStorage.removeItem('auth_token');
    // Clear all auth state
  };
  ```

### Input Validation (Zod)
- [ ] **Validate all forms** with Zod schemas
  ```tsx
  import { z } from 'zod';
  
  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });
  ```
- [ ] **Sanitize before API calls**

### HTTPS Enforcement
- [ ] **Redirect HTTP → HTTPS** in production
- [ ] **Secure cookies** flag enabled
  ```tsx
  // vite.config.ts
  server: {
    https: true, // For local HTTPS development
  }
  ```

### Dependencies
- [ ] **Regular updates** via Dependabot
- [ ] **Audit vulnerabilities** weekly
  ```bash
  npm audit
  npm audit fix
  ```

---

## 🔐 Infrastructure & Deployment

### Environment Variables
- [ ] **All secrets** in GitHub Secrets (not committed)
  - `APP_KEY`
  - `DB_PASSWORD`
  - `SENTRY_DSN`
  - `AWS_ACCESS_KEY_ID`
  - `AWS_SECRET_ACCESS_KEY`
  - OAuth keys (Google, GitHub, Facebook)

- [ ] **Rotate secrets** on deployment
  ```bash
  # Generate new APP_KEY
  php artisan key:generate --show
  
  # Store in GitHub Secrets
  gh secret set APP_KEY --body "base64:..."
  ```

### CI/CD Security
- [ ] **CodeQL** enabled (`.github/workflows/codeql.yml`)
- [ ] **Dependabot** enabled (`.github/dependabot.yml`)
- [ ] **npm audit** in CI pipeline
- [ ] **composer audit** in CI pipeline
- [ ] **No secrets** in CI logs

### Server Hardening
- [ ] **Firewall** configured (UFW/iptables)
  - Allow: 80 (HTTP), 443 (HTTPS), 22 (SSH - restricted IPs)
  - Deny: All other ports
  
- [ ] **SSH key-based** authentication only
- [ ] **Disable root login**
  ```bash
  # /etc/ssh/sshd_config
  PermitRootLogin no
  PasswordAuthentication no
  ```

- [ ] **Fail2ban** installed for brute-force protection

### SSL/TLS
- [ ] **Valid SSL certificate** (Let's Encrypt or commercial)
- [ ] **TLS 1.2+** only (disable TLS 1.0, 1.1)
- [ ] **Strong ciphers** configured
  ```nginx
  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
  ```

### Backup & Disaster Recovery
- [ ] **Automated daily backups** of database
- [ ] **Encrypted backups** (at rest and in transit)
- [ ] **Offsite backup storage** (different region)
- [ ] **Test restore** monthly
- [ ] **Backup retention**: 30 days minimum

---

## 📊 Security Monitoring & Alerts

### Error Tracking
- [ ] **Sentry** configured for backend and frontend
  ```bash
  # Backend
  composer require sentry/sentry-laravel
  
  # Frontend
  npm install @sentry/react @sentry/vite-plugin
  ```

- [ ] **Alert on security events**:
  - Failed login attempts (>10/minute)
  - SQL errors (potential injection)
  - File upload errors
  - Authorization failures

### Logging
- [ ] **Centralized logging** (ELK, Grafana Loki, or Papertrail)
- [ ] **Log security events**:
  ```php
  Log::warning('Failed login attempt', [
      'email' => $request->email,
      'ip' => $request->ip(),
  ]);
  ```
- [ ] **Log retention**: 90 days minimum
- [ ] **PII handling**: Mask sensitive data in logs

### Metrics & Alerts
- [ ] **Failed auth rate** > 10/minute → Alert
- [ ] **Error rate** > 5% → Alert
- [ ] **Response time** > 3s (p95) → Alert
- [ ] **Disk usage** > 80% → Alert
- [ ] **SSL expiry** < 30 days → Alert

---

## 🧪 Security Testing

### Manual Tests
- [ ] **Attempt SQL injection** on all input fields
- [ ] **Test CSRF protection** (disable token, submit form)
- [ ] **Test file upload** with malicious files (.php, .exe)
- [ ] **Test authentication** bypass
- [ ] **Test authorization** (access other users' data)

### Automated Security Scans
```bash
# Run CodeQL
# Already configured in .github/workflows/codeql.yml

# Run npm audit
cd Renthub
npm audit --audit-level=moderate

# Run composer audit
cd Rental-Platform-main/backend
composer audit

# Optional: OWASP ZAP or Burp Suite for penetration testing
```

### Vulnerability Disclosure
- [ ] Create `SECURITY.md` in root with reporting process
- [ ] Set up security contact email: `security@renthub.com`
- [ ] Response SLA: 48 hours for critical, 1 week for others

---

## ✅ Pre-Production Security Sign-Off

Before deploying to production, ensure:

- [ ] All critical and high vulnerabilities resolved
- [ ] Security headers implemented and tested
- [ ] Rate limiting configured and tested
- [ ] File uploads validated and tested
- [ ] HTTPS/SSL configured with A+ rating (SSLLabs)
- [ ] Backups tested and validated
- [ ] Logging and monitoring operational
- [ ] Security incident response plan documented
- [ ] Team trained on security best practices
- [ ] Penetration test completed (if budget allows)

---

## 📅 Ongoing Security Maintenance

### Weekly
- [ ] Review Dependabot PRs
- [ ] Run `npm audit` and `composer audit`
- [ ] Review security alerts in GitHub/Sentry

### Monthly
- [ ] Review access logs for anomalies
- [ ] Test backup restore
- [ ] Update security patches
- [ ] Review and rotate API keys/tokens

### Quarterly
- [ ] Full security audit
- [ ] Penetration test (external if budget allows)
- [ ] Review and update security policies
- [ ] Team security training refresh

---

## 🔗 Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Laravel Security Best Practices](https://laravel.com/docs/security)
- [React Security Best Practices](https://react.dev/learn/security)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

---

**Last Updated**: October 24, 2025  
**Next Review**: Weekly during implementation, monthly after production  
**Owner**: Security Team / DevOps Lead
