# 🔒 Security & Code Quality Guide

**Comprehensive security practices for RentHub platform**

---

## Table of Contents

1. [Overview](#overview)
2. [Backend Security (Laravel)](#backend-security)
3. [Frontend Security (React)](#frontend-security)
4. [Authentication & Authorization](#authentication--authorization)
5. [Data Protection](#data-protection)
6. [Security Tools & Automation](#security-tools--automation)
7. [Code Quality Standards](#code-quality-standards)
8. [Security Checklist](#security-checklist)

---

## Overview

### Security Principles

1. **Defense in Depth**: Multiple layers of security
2. **Least Privilege**: Minimal access rights by default
3. **Secure by Default**: Security built into every feature
4. **Zero Trust**: Verify everything, trust nothing
5. **Regular Audits**: Continuous security monitoring

### Compliance

- GDPR compliance for EU users
- Data encryption at rest and in transit
- Regular security audits
- Incident response plan

---

## Backend Security

### 1. Authentication Security

```php
// Use Laravel Sanctum for API authentication
// app/Http/Kernel.php

protected $middlewareGroups = [
    'api' => [
        \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        'throttle:api',
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
    ],
];
```

**Best Practices**:
- ✅ Use Sanctum tokens for API authentication
- ✅ Implement rate limiting on login/registration
- ✅ Use password hashing (bcrypt/argon2)
- ✅ Implement 2FA for sensitive operations
- ✅ Set token expiration
- ✅ Implement password reset security

### 2. SQL Injection Prevention

```php
// ✅ GOOD: Use Eloquent ORM or Query Builder
$properties = Property::where('city', $request->city)->get();

// ✅ GOOD: Use parameter binding
$properties = DB::select('SELECT * FROM properties WHERE city = ?', [$city]);

// ❌ BAD: Never concatenate user input
$properties = DB::select("SELECT * FROM properties WHERE city = '$city'");
```

**Best Practices**:
- ✅ Always use Eloquent ORM or parameter binding
- ✅ Validate and sanitize all inputs
- ✅ Use prepared statements
- ✅ Limit database user permissions

### 3. Cross-Site Request Forgery (CSRF) Protection

```php
// Laravel automatically includes CSRF protection
// Ensure all forms include @csrf directive

// In Blade templates
<form method="POST" action="/booking">
    @csrf
    <!-- form fields -->
</form>

// For API routes, use Sanctum's stateful middleware
```

**Best Practices**:
- ✅ CSRF tokens on all state-changing requests
- ✅ SameSite cookie attribute
- ✅ Verify referer headers
- ✅ Use Sanctum for SPA authentication

### 4. Authorization

```php
// Use Laravel Policies for authorization
// app/Policies/PropertyPolicy.php

class PropertyPolicy
{
    public function update(User $user, Property $property): bool
    {
        return $user->id === $property->user_id;
    }

    public function delete(User $user, Property $property): bool
    {
        return $user->id === $property->user_id || $user->isAdmin();
    }
}

// In controller
public function update(Request $request, Property $property)
{
    $this->authorize('update', $property);
    
    // Update logic
}
```

**Best Practices**:
- ✅ Use Policies for authorization logic
- ✅ Implement role-based access control (RBAC)
- ✅ Check permissions in controllers and middleware
- ✅ Principle of least privilege

### 5. File Upload Security

```php
// Validate file uploads
$request->validate([
    'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120', // 5MB max
]);

// Sanitize filename
$filename = Str::random(40) . '.' . $request->file('image')->extension();

// Store in non-public directory
$path = $request->file('image')->storeAs('property-images', $filename, 'private');

// Use Intervention Image to process images (prevents malicious code)
$image = Image::make($request->file('image'))->encode('jpg', 80);
```

**Best Practices**:
- ✅ Validate file type, size, and extension
- ✅ Generate random filenames
- ✅ Store files outside webroot
- ✅ Process images to remove metadata and potential exploits
- ✅ Scan files for malware

### 6. API Security

```php
// Rate limiting
// routes/api.php
Route::middleware('throttle:60,1')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
});

// Stricter rate limiting for sensitive endpoints
Route::middleware('throttle:5,1')->group(function () {
    Route::post('/password/reset', [PasswordController::class, 'reset']);
});

// Input validation
class CreatePropertyRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:5000',
            'price' => 'required|numeric|min:0',
            'bedrooms' => 'required|integer|min:0|max:20',
        ];
    }
}
```

**Best Practices**:
- ✅ Implement rate limiting on all endpoints
- ✅ Validate all inputs with Form Requests
- ✅ Use API versioning
- ✅ Implement proper error handling (don't leak stack traces)
- ✅ Use HTTPS only
- ✅ Implement API authentication

### 7. Dependency Security

```bash
# Check for vulnerable dependencies
composer audit

# Update dependencies regularly
composer update

# Use specific version constraints
"require": {
    "laravel/framework": "^12.0",  // Good: allows patch updates
    "package/name": "*"             // Bad: allows any version
}
```

---

## Frontend Security

### 1. Cross-Site Scripting (XSS) Prevention

```typescript
// ✅ GOOD: React automatically escapes values
const UserProfile = ({ username }) => {
  return <div>Welcome, {username}</div>;
};

// ⚠️ CAUTION: dangerouslySetInnerHTML - only use with sanitized content
import DOMPurify from 'dompurify';

const RichContent = ({ htmlContent }) => {
  const sanitized = DOMPurify.sanitize(htmlContent);
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
};

// ❌ BAD: Never insert unsanitized user content
const BadComponent = ({ userInput }) => {
  return <div dangerouslySetInnerHTML={{ __html: userInput }} />;
};
```

**Best Practices**:
- ✅ Rely on React's automatic escaping
- ✅ Use DOMPurify if you must render HTML
- ✅ Validate and sanitize user inputs
- ✅ Use Content Security Policy (CSP)
- ✅ Avoid eval() and Function()

### 2. Authentication Token Storage

```typescript
// ❌ BAD: Storing in localStorage (vulnerable to XSS)
localStorage.setItem('token', token);

// ✅ GOOD: Let Laravel Sanctum handle cookies (HttpOnly, Secure)
// No need to manually store tokens with Sanctum

// If you must store tokens:
// Use secure, HttpOnly cookies set by the backend
// Or use sessionStorage with additional protections
```

**Best Practices**:
- ✅ Use HttpOnly, Secure cookies for tokens
- ✅ Implement token expiration
- ✅ Use Sanctum's CSRF protection
- ✅ Clear tokens on logout
- ✅ Implement token refresh strategy

### 3. API Request Security

```typescript
// Configure axios with security headers
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Send cookies with requests
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add CSRF token to requests
api.interceptors.request.use((config) => {
  const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  if (token) {
    config.headers['X-CSRF-TOKEN'] = token;
  }
  return config;
});

// Handle unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

**Best Practices**:
- ✅ Always use HTTPS
- ✅ Include CSRF tokens in requests
- ✅ Validate responses
- ✅ Handle errors gracefully
- ✅ Implement request timeouts

### 4. Input Validation

```typescript
import { z } from 'zod';

// Define validation schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const propertySchema = z.object({
  title: z.string().min(5).max(255),
  description: z.string().min(20).max(5000),
  price: z.number().positive(),
  bedrooms: z.number().int().min(0).max(20),
});

// Use in forms
const handleSubmit = (data: unknown) => {
  try {
    const validated = loginSchema.parse(data);
    // Submit validated data
  } catch (error) {
    // Handle validation errors
  }
};
```

**Best Practices**:
- ✅ Validate on both client and server
- ✅ Use type-safe validation libraries (Zod)
- ✅ Provide clear error messages
- ✅ Sanitize inputs before submission

### 5. Environment Variables

```typescript
// vite-env.d.ts
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_NAME: string
  // Never expose secrets in frontend env vars!
}

// .env.example
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=RentHub

// ❌ NEVER: Store secrets in frontend env vars
// VITE_API_SECRET=xxx  // This will be exposed in the bundle!
```

**Best Practices**:
- ✅ Only use VITE_ prefix for safe variables
- ✅ Never store secrets in frontend
- ✅ Document required environment variables
- ✅ Use different configs for dev/staging/prod

### 6. Dependency Security

```bash
# Check for vulnerabilities
npm audit

# Fix automatically fixable issues
npm audit fix

# View detailed vulnerability info
npm audit --json

# Update dependencies
npm update

# Use exact versions for critical packages
{
  "dependencies": {
    "react": "19.0.0"  // Exact version
  }
}
```

---

## Authentication & Authorization

### Implementation Checklist

**Backend (Laravel Sanctum)**:
- [x] Sanctum installed and configured
- [x] CSRF protection enabled
- [x] Rate limiting on auth endpoints
- [x] Password hashing (bcrypt/argon2)
- [x] Token expiration configured
- [ ] 2FA implementation (optional)
- [ ] Password reset with secure tokens
- [ ] Account lockout after failed attempts

**Frontend (React)**:
- [x] Login/logout flows
- [x] Protected routes
- [x] Token handling
- [x] Redirect on unauthorized
- [ ] Remember me functionality
- [ ] Auto-logout on token expiration
- [ ] Session timeout warnings

### Example: Protected Route

```typescript
// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Usage
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

---

## Data Protection

### 1. GDPR Compliance

```php
// Implement right to be forgotten
public function deleteAccount(Request $request)
{
    $user = $request->user();
    
    // Anonymize or delete user data
    $user->bookings()->delete();
    $user->reviews()->delete();
    $user->messages()->delete();
    
    // Delete user
    $user->delete();
    
    return response()->json(['message' => 'Account deleted']);
}

// Data export
public function exportData(Request $request)
{
    $user = $request->user();
    
    $data = [
        'profile' => $user->toArray(),
        'bookings' => $user->bookings()->get()->toArray(),
        'reviews' => $user->reviews()->get()->toArray(),
    ];
    
    return response()->json($data);
}
```

### 2. Encryption

```php
// config/app.php - ensure encryption key is set
'cipher' => 'AES-256-CBC',

// Encrypt sensitive data
use Illuminate\Support\Facades\Crypt;

// Encrypt
$encrypted = Crypt::encryptString('Sensitive data');

// Decrypt
$decrypted = Crypt::decryptString($encrypted);

// Use encrypted database columns
protected $casts = [
    'social_security_number' => 'encrypted',
    'credit_card_number' => 'encrypted',
];
```

### 3. Database Security

```php
// Use database seeding for development only
if (app()->environment('local')) {
    DB::table('users')->insert([/* ... */]);
}

// Never log sensitive data
Log::info('User registered', [
    'email' => $user->email,
    // Don't log passwords, tokens, etc.
]);

// Use soft deletes for data retention
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Model
{
    use SoftDeletes;
}
```

---

## Security Tools & Automation

### 1. Backend Tools

```bash
# PHPStan - Static analysis
composer require --dev phpstan/phpstan
./vendor/bin/phpstan analyse

# Laravel Pint - Code style
composer require --dev laravel/pint
./vendor/bin/pint

# Security audits
composer audit

# Dependency updates
composer outdated
```

**phpstan.neon**:
```neon
parameters:
    level: 6
    paths:
        - app
        - database
    excludePaths:
        - vendor
```

### 2. Frontend Tools

```bash
# ESLint - Linting
npm run lint

# TypeScript - Type checking
npx tsc --noEmit

# Security audits
npm audit
npm audit fix

# Dependency updates
npm outdated
npm update
```

**eslint.config.js**:
```javascript
export default [
  {
    rules: {
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-script-url': 'error',
    },
  },
];
```

### 3. CI/CD Security Checks

See `.github/workflows/tests.yml` for automated security scanning:
- Dependency vulnerability scanning
- Static code analysis
- Security linting
- CodeQL analysis (coming soon)

---

## Code Quality Standards

### Backend (PHP/Laravel)

**PSR-12 Coding Standard**:
```php
<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Property;
use Illuminate\Support\Facades\DB;

class PropertyService
{
    public function __construct(
        private readonly PropertyRepository $repository
    ) {}

    public function createProperty(array $data): Property
    {
        return DB::transaction(function () use ($data) {
            $property = $this->repository->create($data);
            
            // Additional logic
            
            return $property;
        });
    }
}
```

**Best Practices**:
- ✅ Use type hints
- ✅ Follow PSR-12
- ✅ Use dependency injection
- ✅ Keep controllers thin
- ✅ Use service classes for business logic
- ✅ Write documentation for complex logic

### Frontend (TypeScript/React)

**TypeScript Strict Mode**:
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
  }
}
```

**Best Practices**:
- ✅ Use TypeScript strictly
- ✅ Avoid `any` type
- ✅ Use functional components
- ✅ Keep components small and focused
- ✅ Use custom hooks for reusable logic
- ✅ Write prop types and interfaces

---

## Security Checklist

### Pre-Deployment

**Backend**:
- [ ] All inputs validated and sanitized
- [ ] SQL injection prevention verified
- [ ] CSRF protection enabled
- [ ] Authentication properly implemented
- [ ] Authorization checks in place
- [ ] Rate limiting configured
- [ ] File upload security implemented
- [ ] Sensitive data encrypted
- [ ] Error messages don't leak info
- [ ] Logging configured (no sensitive data)
- [ ] Dependencies up to date
- [ ] Security headers configured

**Frontend**:
- [ ] XSS prevention verified
- [ ] Tokens stored securely
- [ ] HTTPS enforced
- [ ] Input validation on client side
- [ ] CSP headers configured
- [ ] No secrets in code/env vars
- [ ] Dependencies up to date
- [ ] Error boundaries implemented
- [ ] API requests authenticated

**Infrastructure**:
- [ ] HTTPS/TLS configured
- [ ] Database access restricted
- [ ] Environment variables secured
- [ ] Backups automated
- [ ] Monitoring configured
- [ ] Incident response plan
- [ ] Security audit completed

### Monthly Security Tasks

- [ ] Review and update dependencies
- [ ] Check security advisories
- [ ] Review access logs
- [ ] Test backup restoration
- [ ] Review user permissions
- [ ] Update security documentation

---

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Laravel Security Best Practices](https://laravel.com/docs/security)
- [React Security Best Practices](https://react.dev/learn/security)
- [GDPR Compliance Guide](https://gdpr.eu/)

---

**Last Updated**: October 24, 2025  
**Security Officer**: Development Team Lead
