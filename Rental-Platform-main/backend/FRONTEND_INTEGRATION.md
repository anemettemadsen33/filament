# RentHub Frontend Integration Documentation

## Overview
This document provides comprehensive setup instructions for integrating the RentHub React frontend with the Laravel Filament admin backend, specifically configured for separate VPS deployment.

## 🚀 Quick Start

### Backend Setup (Laravel + Filament)
1. **Server is running**: `http://127.0.0.1:8000`
2. **Admin Panel**: `http://127.0.0.1:8000/admin/login`
3. **Admin Credentials**: 
   - Email: `admin@rental.com`
   - Password: `admin2024`

### Database Configuration ✅
- **Type**: SQLite (development) / PostgreSQL (production ready)
- **Settings Table**: Fully configured with all required fields
- **Migration**: Completed and seeded with default values

## 🔧 API Endpoints

### Public Settings API
```
GET /api/settings/public
```
Returns non-sensitive settings for frontend use:
- Website name and description
- Contact information (email, phone, address)
- Social media links
- Maintenance mode status
- Frontend domain configuration

### CORS Test Endpoint
```
GET /api/test-cors
```
Verifies CORS configuration is working correctly.

### Existing Property Management APIs
```
GET /api/properties          # List all properties
GET /api/properties/{id}     # Get specific property
POST /api/properties         # Create property (authenticated)
PUT /api/properties/{id}     # Update property (authenticated)
DELETE /api/properties/{id}  # Delete property (authenticated)
```

### Booking Management APIs
```
GET /api/bookings           # List bookings (authenticated)
POST /api/bookings          # Create booking (authenticated)
GET /api/bookings/{id}      # Get specific booking (authenticated)
PUT /api/bookings/{id}      # Update booking (authenticated)
DELETE /api/bookings/{id}   # Delete booking (authenticated)
```

### Authentication APIs
```
POST /api/auth/register     # User registration
POST /api/auth/login        # User login
GET /api/auth/me           # Get current user (authenticated)
POST /api/auth/logout      # User logout (authenticated)
PUT /api/auth/profile      # Update profile (authenticated)
PUT /api/auth/password     # Update password (authenticated)
```

## ⚙️ Admin Panel Configuration

### Frontend Integration Settings
Access: **Admin Panel → Settings → Frontend Integration**

#### 🌐 Domain Configuration
- **Frontend Domain**: Set your frontend VPS domain (e.g., `https://renthub.example.com`)
- **CORS Origins**: Automatically configured based on frontend domain
- **CORS Enabled**: Toggle to enable/disable CORS

#### 🏢 Website Branding
- **Website Name**: RentHub (customizable)
- **Website Description**: Modern rental platform description
- **Logo URL**: Upload and set your logo

#### 📞 Contact Information
- **Email**: Primary contact email
- **Phone**: Contact phone number  
- **Address**: Physical address

#### 📧 Email Configuration
- **SMTP Host**: Your email server
- **SMTP Port**: Email server port (587/465)
- **SMTP Username**: Email account username
- **SMTP Password**: Email account password (encrypted)
- **From Email**: Default sender email
- **From Name**: Default sender name

#### 📱 SMS Configuration  
- **SMS Provider**: Twilio integration ready
- **Account SID**: Twilio Account SID
- **Auth Token**: Twilio Auth Token (encrypted)
- **From Number**: Twilio phone number

#### 🌟 Social Media
- **Facebook URL**: Facebook page link
- **Twitter URL**: Twitter profile link  
- **Instagram URL**: Instagram profile link
- **LinkedIn URL**: LinkedIn profile link

#### 🔔 Notifications
- **Email Notifications**: Enable/disable email notifications
- **SMS Notifications**: Enable/disable SMS notifications
- **Admin Notifications**: Enable/disable admin notifications

#### 🚧 Maintenance Mode
- **Maintenance Mode**: Toggle site maintenance
- **Maintenance Message**: Custom message for users

## 🔗 CORS Configuration

### Dynamic CORS Setup ✅
The system includes a custom `CorsServiceProvider` that:
- Reads CORS origins from database settings
- Supports multiple origins for development and production
- Automatically updates when frontend domain is changed in admin panel
- Handles wildcard (*) for development environments

### Frontend Domain Integration
When you set the **Frontend Domain** in admin panel:
1. CORS origins are automatically updated
2. API requests from your frontend domain are allowed
3. Settings are cached for optimal performance

## 📝 Frontend Integration Steps

### 1. Configure Backend Domain
In your React frontend, set the API base URL:
```javascript
// For separate VPS deployment
const API_BASE_URL = 'https://admin.yourdomain.com/api'

// For development
const API_BASE_URL = 'http://127.0.0.1:8000/api'
```

### 2. Fetch Website Settings
```javascript
// Get public settings for your frontend
const getWebsiteSettings = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/settings/public`)
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Failed to fetch settings:', error)
  }
}
```

### 3. Test CORS Connection
```javascript
// Test CORS configuration
const testCors = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/test-cors`)
    const data = await response.json()
    console.log('CORS working:', data)
  } catch (error) {
    console.error('CORS error:', error)
  }
}
```

## 🚀 Production Deployment

### Backend VPS Setup
1. **Domain**: Set up your admin subdomain (e.g., `admin.yourdomain.com`)
2. **SSL**: Configure SSL certificate for HTTPS
3. **Database**: Switch to PostgreSQL for production
4. **Environment**: Update `.env` for production settings

### Frontend VPS Setup  
1. **Domain**: Set up your main domain (e.g., `yourdomain.com`)
2. **Build**: Build React app for production
3. **SSL**: Configure SSL certificate for HTTPS
4. **API URL**: Update API base URL to backend domain

### Configuration in Admin Panel
1. Login to admin panel: `https://admin.yourdomain.com/admin`
2. Go to **Settings**
3. Set **Frontend Domain**: `https://yourdomain.com`
4. Configure **Email Settings** for production SMTP
5. Set up **SMS Settings** with Twilio credentials
6. Update **Contact Information** and **Social Media** links

## 🔒 Security Features

### Authentication
- Laravel Sanctum for API authentication
- Secure token-based authentication for frontend
- Admin panel protected with separate authentication

### Data Protection
- Sensitive data (SMTP passwords, API keys) are encrypted
- CORS protection prevents unauthorized access
- Rate limiting on API endpoints

### Email & SMS Security
- SMTP credentials encrypted in database
- Twilio credentials encrypted in database
- Secure email delivery configuration

## 📊 Monitoring & Maintenance

### Admin Dashboard Features
- Property management interface
- Booking management system
- User management tools
- Settings configuration
- System monitoring

### Cache Management
- Settings are cached for performance
- Cache automatically clears when settings change
- Optimal performance for high-traffic sites

## 🆘 Troubleshooting

### CORS Issues
1. Check **Frontend Domain** setting in admin panel
2. Verify **CORS Enabled** is turned on
3. Test with `/api/test-cors` endpoint
4. Check browser console for specific CORS errors

### API Connection Issues
1. Verify backend server is running
2. Check API base URL in frontend
3. Test endpoints directly in browser
4. Verify SSL certificates for production

### Email/SMS Issues
1. Check SMTP settings in admin panel
2. Verify credentials are correct
3. Test email delivery
4. Check Twilio credentials and phone number format

## 📞 Support

For additional support:
- Check Laravel logs: `storage/logs/laravel.log`
- Admin panel provides real-time error feedback
- All settings have helpful descriptions and validation

---

**Your RentHub integration is now ready for production deployment! 🎉**