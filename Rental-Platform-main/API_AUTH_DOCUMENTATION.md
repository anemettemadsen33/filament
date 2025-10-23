# API Authentication Documentation

This guide explains how to integrate authentication with the Laravel Sanctum backend API for the public frontend application.

## Overview

The backend uses **Laravel Sanctum** for API authentication with token-based authentication. This approach is ideal for SPAs (Single Page Applications), mobile apps, and simple token-based API consumption.

## Base Configuration

### Backend Environment Variables

Ensure these are set in your backend `.env`:

```env
# Backend URL
APP_URL=http://localhost:8000

# Frontend URL (for CORS and Sanctum)
FRONTEND_URL=http://localhost:5173

# Session Configuration
SESSION_DRIVER=cookie
SESSION_LIFETIME=120
SESSION_DOMAIN=localhost

# Sanctum
SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173
```

### Frontend Configuration

Set your API base URL:

```javascript
// For React/Vue/Svelte
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
```

## Authentication Flow

### 1. Token-Based Authentication (Current Implementation)

The backend returns an API token after successful login/registration. This token must be included in all subsequent requests.

#### Registration

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "password_confirmation": "SecurePassword123!"
}
```

**Response (201):**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "guest",
    "email_verified_at": null,
    "created_at": "2025-01-22T10:00:00.000000Z",
    "updated_at": "2025-01-22T10:00:00.000000Z"
  },
  "token": "1|abcdefghijklmnopqrstuvwxyz1234567890"
}
```

#### Login

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "guest",
    "email_verified_at": null,
    "created_at": "2025-01-22T10:00:00.000000Z",
    "updated_at": "2025-01-22T10:00:00.000000Z"
  },
  "token": "2|xyz9876543210abcdefghijklmnopqrstuv"
}
```

**Error Response (422):**
```json
{
  "message": "Invalid credentials"
}
```

#### Get Current User

**Endpoint:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "guest",
  "email_verified_at": null,
  "created_at": "2025-01-22T10:00:00.000000Z",
  "updated_at": "2025-01-22T10:00:00.000000Z"
}
```

#### Logout

**Endpoint:** `POST /api/auth/logout`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "message": "Logged out"
}
```

### 2. Update Profile

**Endpoint:** `PUT /api/auth/profile`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data (if uploading photo)
```

**Request Body (JSON):**
```json
{
  "name": "John Updated",
  "email": "john.new@example.com",
  "bio": "A short bio about me"
}
```

**Request Body (with Photo Upload - FormData):**
```javascript
const formData = new FormData();
formData.append('name', 'John Updated');
formData.append('email', 'john.new@example.com');
formData.append('bio', 'A short bio about me');
formData.append('photo', fileInput.files[0]); // File object
```

**Response (200):**
```json
{
  "id": 1,
  "name": "John Updated",
  "email": "john.new@example.com",
  "bio": "A short bio about me",
  "photo_path": "profile-photos/xyz123.jpg",
  "photo_url": "http://localhost:8000/storage/profile-photos/xyz123.jpg",
  "role": "guest",
  "email_verified_at": null,
  "created_at": "2025-01-22T10:00:00.000000Z",
  "updated_at": "2025-01-22T10:30:00.000000Z"
}
```

**Validation Rules:**
- `name`: optional, max 255 characters
- `email`: optional, must be valid email, unique, max 255 characters
- `bio`: optional, max 1000 characters
- `photo`: optional, must be image, max 2MB

### 3. Update Password

**Endpoint:** `PUT /api/auth/password`

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "current_password": "OldPassword123!",
  "password": "NewSecurePassword456!",
  "password_confirmation": "NewSecurePassword456!"
}
```

**Response (200):**
```json
{
  "message": "Password updated successfully"
}
```

**Error Response (422):**
```json
{
  "message": "The current password is incorrect.",
  "errors": {
    "current_password": ["The current password is incorrect."]
  }
}
```

## Frontend Implementation Examples

### React with Axios

```javascript
import axios from 'axios';

// Configure axios instance
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Authentication functions
export const authService = {
  async register(name, email, password, passwordConfirmation) {
    const response = await api.post('/auth/register', {
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    });
    
    // Store token
    localStorage.setItem('auth_token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    return response.data;
  },

  async login(email, password) {
    const response = await api.post('/auth/login', {
      email,
      password,
    });
    
    // Store token
    localStorage.setItem('auth_token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    return response.data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      // Always clear local storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  },

  async updateProfile(data) {
    // If data includes a file, use FormData
    const isFormData = data instanceof FormData;
    
    const response = await api.put('/auth/profile', data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  },

  async updatePassword(currentPassword, newPassword, passwordConfirmation) {
    const response = await api.put('/auth/password', {
      current_password: currentPassword,
      password: newPassword,
      password_confirmation: passwordConfirmation,
    });
    
    return response.data;
  },

  isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  },

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export default api;
```

### Vue 3 with Fetch

```javascript
// src/services/auth.js
const API_BASE = 'http://localhost:8000/api';

class AuthService {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('auth_token');
    
    const headers = {
      'Accept': 'application/json',
      ...options.headers,
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }
    
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }
    
    return data;
  }
  
  async register(userData) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
  }
  
  async login(credentials) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    return data;
  }
  
  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  }
  
  async getCurrentUser() {
    const data = await this.request('/auth/me');
    localStorage.setItem('user', JSON.stringify(data));
    return data;
  }
  
  async updateProfile(formData) {
    const data = await this.request('/auth/profile', {
      method: 'PUT',
      body: formData,
    });
    
    localStorage.setItem('user', JSON.stringify(data));
    return data;
  }
  
  async updatePassword(passwords) {
    return await this.request('/auth/password', {
      method: 'PUT',
      body: JSON.stringify(passwords),
    });
  }
  
  isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  }
  
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}

export default new AuthService();
```

### Svelte

```javascript
// src/lib/auth.js
import { writable } from 'svelte/store';

const API_BASE = 'http://localhost:8000/api';

// Stores
export const user = writable(null);
export const isAuthenticated = writable(false);

// Initialize from localStorage
if (typeof window !== 'undefined') {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    user.set(JSON.parse(storedUser));
    isAuthenticated.set(true);
  }
}

async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('auth_token');
  
  const headers = {
    'Accept': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }
  
  return data;
}

export async function register(userData) {
  const data = await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  
  localStorage.setItem('auth_token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  user.set(data.user);
  isAuthenticated.set(true);
  
  return data;
}

export async function login(credentials) {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  
  localStorage.setItem('auth_token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  user.set(data.user);
  isAuthenticated.set(true);
  
  return data;
}

export async function logout() {
  try {
    await apiRequest('/auth/logout', { method: 'POST' });
  } finally {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    user.set(null);
    isAuthenticated.set(false);
  }
}

export async function getCurrentUser() {
  const data = await apiRequest('/auth/me');
  localStorage.setItem('user', JSON.stringify(data));
  user.set(data);
  isAuthenticated.set(true);
  return data;
}

export async function updateProfile(formData) {
  const data = await apiRequest('/auth/profile', {
    method: 'PUT',
    body: formData,
  });
  
  localStorage.setItem('user', JSON.stringify(data));
  user.set(data);
  return data;
}

export async function updatePassword(passwords) {
  return await apiRequest('/auth/password', {
    method: 'PUT',
    body: JSON.stringify(passwords),
  });
}
```

## Testing Authentication

### Using cURL

```bash
# Register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Password123!",
    "password_confirmation": "Password123!"
  }'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!"
  }'

# Get current user (replace {token} with actual token)
curl -X GET http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer {token}"

# Update profile
curl -X PUT http://localhost:8000/api/auth/profile \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "bio": "My new bio"
  }'

# Update password
curl -X PUT http://localhost:8000/api/auth/password \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "current_password": "Password123!",
    "password": "NewPassword456!",
    "password_confirmation": "NewPassword456!"
  }'

# Logout
curl -X POST http://localhost:8000/api/auth/logout \
  -H "Authorization: Bearer {token}"
```

## Error Handling

### Common HTTP Status Codes

- **200 OK**: Request successful
- **201 Created**: Resource created successfully (registration)
- **401 Unauthorized**: Missing or invalid token
- **403 Forbidden**: Authenticated but not authorized
- **422 Unprocessable Entity**: Validation errors
- **500 Internal Server Error**: Server error

### Error Response Format

```json
{
  "message": "Error message",
  "errors": {
    "field_name": ["Error description"]
  }
}
```

### Frontend Error Handling Example

```javascript
try {
  await authService.login(email, password);
  // Success
} catch (error) {
  if (error.response?.status === 422) {
    // Validation errors
    console.error('Validation errors:', error.response.data.errors);
  } else if (error.response?.status === 401) {
    // Unauthorized
    console.error('Invalid credentials');
  } else {
    // Other errors
    console.error('An error occurred:', error.message);
  }
}
```

## Security Best Practices

### Token Storage

1. **LocalStorage**: Simple but vulnerable to XSS attacks
2. **SessionStorage**: Cleared when tab closes
3. **Memory Only**: Most secure but lost on page refresh
4. **HTTP-only Cookies**: Recommended for production (requires backend changes)

### Recommendations

1. **Use HTTPS** in production
2. **Implement token refresh** for long-lived sessions
3. **Set short token expiration** times
4. **Validate inputs** on both frontend and backend
5. **Handle token expiration** gracefully
6. **Clear tokens** on logout
7. **Use environment variables** for API URLs

## Production Deployment

### Backend .env

```env
APP_URL=https://api.yourdomain.com
FRONTEND_URL=https://yourdomain.com

SESSION_DOMAIN=.yourdomain.com
SANCTUM_STATEFUL_DOMAINS=yourdomain.com,www.yourdomain.com
```

### Frontend Configuration

```javascript
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://api.yourdomain.com/api'
  : 'http://localhost:8000/api';
```

## Troubleshooting

### CORS Errors

Make sure `FRONTEND_URL` is set in backend `.env` and the frontend is running on that URL.

### 401 Unauthorized

- Check if token is being sent in `Authorization` header
- Verify token format: `Bearer {token}`
- Check if token is still valid (not expired or deleted)

### 419 CSRF Token Mismatch

Not applicable for token-based auth. This is only for session-based authentication.

### Profile Photo Not Showing

- Ensure `storage:link` has been run on the backend
- Check that `APP_URL` is correctly set
- Verify the `photo_url` accessor in the User model

## Additional Resources

- [Laravel Sanctum Documentation](https://laravel.com/docs/11.x/sanctum)
- [Laravel API Resources](https://laravel.com/docs/11.x/eloquent-resources)
- [Laravel Validation](https://laravel.com/docs/11.x/validation)
