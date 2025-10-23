# 🏠 Rental Platform - Long & Short Term Rentals

A modern, full-stack rental platform similar to Booking.com, supporting both short-term and long-term property rentals.

## 📊 Project Status

### Overall Progress: 🎉 100% PRODUCTION READY ✅

**Last Updated:** October 22, 2025

All core features are complete and tested. The platform is ready for deployment and production use.

### ✅ Core Features Complete

1. ✅ **Backend Foundation** - Laravel 12 + Filament v4 admin panel
2. ✅ **Domain Models** - User, Property, Booking, Review (Eloquent models with relationships)
3. ✅ **Database Migrations** - Complete schema with proper relationships
4. ✅ **API Authentication** - Laravel Sanctum with secure token-based auth
5. ✅ **Business Logic** - Booking validation, pricing calculation, status management
6. ✅ **Authorization** - Role-based policies (guest, owner, admin)
7. ✅ **Email Notifications** - Blade templates with RO/EN localization, branding config
8. ✅ **Payment Processing** - Bank transfer invoicing with PDF generation
9. ✅ **Queue System** - Production-ready setup with Supervisor config and runbook
10. ✅ **Public Site Support** - Admin panel manages public site settings (URL, API, SMTP, SMS)
11. ✅ **Booking Flow** - Property search, detail view, booking widget, payment
12. ✅ **Owner Portal** - Full property management (CRUD operations, dashboard)
13. ✅ **Images & Storage** - Multi-image upload, processing, gallery with lightbox
14. ✅ **Reviews System** - Guest submission, admin moderation, public display
15. ✅ **Testing & QA** - Comprehensive smoke test documentation
16. ✅ **Production Deployment** - Complete deployment guide with security hardening

### 📋 Optional Enhancements

- 📚 **API Documentation** - OpenAPI/Swagger spec (optional)
- 🎨 **Advanced Features** - Payment gateways, social login, map integration

## 🚀 Features

### For Guests

- 🔍 Advanced search and filtering (location, price, dates, amenities)
- �️ Property galleries with lightbox viewer (keyboard navigation)
- �📅 Real-time availability calendar
- 💳 Secure booking and payment system
- ⭐ Property reviews and ratings (with moderation workflow)
- ✍️ Write reviews for completed bookings
- 💬 Direct messaging with property owners
- 📱 Responsive design for all devices

### For Property Owners

- 📝 Easy property listing management (CRUD with image upload)
- 🖼️ Multi-image upload with drag-and-drop (max 20 images, auto-resize)
- 🎨 Image management (set primary, reorder, delete)
- 📊 Dashboard with analytics
- 🗓️ Calendar management
- 💰 Revenue tracking
- 📬 Booking notifications

### For Admins

- 👥 User management (Filament panel)
- 🏢 Property moderation
- ⭐ Review moderation (approve/reject with bulk actions)
- 📈 Platform analytics
- 🛡️ Security controls

## 🛠️ Tech Stack

### Backend

- **Laravel 12** - Modern PHP Framework
- **Filament v4** - Admin Panel (FilamentPHP)
- **Laravel Sanctum** - API Authentication
- **Laravel API Resources** - API transformations
- **Spatie Media Library** - File uploads

### Database

- **PostgreSQL / MySQL** - Relational database
- **Laravel Eloquent ORM** - Database abstraction

### DevOps

- **Docker** & Docker Compose
- **Laravel Pint** for code formatting
- **PHPUnit** for testing

## 📁 Project Structure

```text
rental-platform/
├── backend/              # Laravel 12 Backend + Filament Admin
│   ├── app/
│   │   ├── Http/
│   │   │   └── Controllers/  # API Controllers
│   │   ├── Models/           # Eloquent Models
│   │   ├── Policies/         # Authorization
│   │   ├── Services/         # Business Logic
│   │   └── Filament/         # Admin Panel Resources
│   ├── database/
│   │   ├── migrations/       # Database schema
│   │   └── seeders/          # Test data
│   ├── routes/
│   │   ├── api.php           # API routes
│   │   └── web.php           # Web routes
│   └── config/               # Configuration files
│
├── deployment/           # Deployment guides & configs
├── docker-compose.yml    # Docker configuration (DB, search, backend)
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Rental-Platform
   ```

2. **Setup Backend**

   ```bash
   cd backend
   composer install
   cp .env.example .env
   # Edit .env with your database credentials
   php artisan key:generate
   php artisan migrate
   php artisan storage:link
   php artisan serve
   ```

   Access Filament Admin at `/admin` and create your first admin user.

### Using Docker (Recommended)

```bash
docker-compose up -d
```

This will start:

- Backend API on [http://localhost:8000](http://localhost:8000)
- Filament Admin on [http://localhost:8000/admin](http://localhost:8000/admin)
- PostgreSQL on localhost:5432
- Meilisearch on localhost:7700

## 📚 API Documentation

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Properties

- `GET /api/properties` - List all properties (with filters)
- `GET /api/properties/:id` - Get property details
- `POST /api/properties` - Create new property (owner only)
- `PUT /api/properties/:id` - Update property (owner only)
- `DELETE /api/properties/:id` - Delete property (owner only)

### Bookings

- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

### Reviews

- `GET /api/reviews?property_id={id}` - Get property reviews (optionally filter by status)
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

## 🖼️ Images & Storage

Property images are stored on the public disk with automatic thumbnail generation.

### One-time setup

```bash
# In backend/
php artisan storage:link

# .env
FILESYSTEM_DISK=public
```

### Limits & formats

- Up to 20 images per property
- Max 5 MB per image
- Accepted formats: JPG, PNG, WEBP
- Thumbnails 800×600 are generated automatically with Intervention Image

### Image API Endpoints

- `POST /api/properties/{property}/images` — upload images (multipart, field: `images[]`)
- `DELETE /api/properties/{property}/images/{image}` — delete image
- `PATCH /api/properties/{property}/images/{image}/primary` — set primary image
- `PATCH /api/properties/{property}/images/reorder` — reorder by array of image ids

### Image Frontend Usage

- Edit page includes an Image Manager for upload, set primary, delete, and reorder.
- Listings and detail pages use the `thumbnail_url` or `url` provided by the API.

## ⭐ Reviews & Moderation

Guest reviews are submitted and set to `pending` by default. Only `approved` reviews are returned on the property detail endpoint and shown in the UI.

### Flow

1. Authenticated guest submits a review (rating 1–5, comment)
2. Review status defaults to `pending`
3. Admin/owner moderates review in the back office (approve/reject)
4. Approved reviews appear on property detail page; ratings are computed from approved reviews only

### Review API Endpoints

- `GET /api/reviews?property_id={id}` — list reviews (server supports `status` filter)
- `POST /api/reviews` — create a review (optionally with `booking_id` for ownership validation)
- `PUT /api/reviews/{id}` — update rating/comment (authorized)
- `DELETE /api/reviews/{id}` — delete review (authorized)

### Review Frontend Usage

- Property detail page shows approved reviews and includes a simple review form for logged-in users. New reviews are submitted as pending and will appear after approval.

## 🗄️ Database Schema

### Main Tables

- **users** - User accounts (guests, owners, admins)
- **properties** - Property listings
- **bookings** - Reservation records
- **reviews** - Property reviews and ratings
- **amenities** - Property features
- **images** - Property photos
- **messages** - User communications

## 🔐 Environment Variables

### Backend (.env)

```env
APP_NAME="Rental Platform"
APP_URL=http://localhost:8000
DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=rental_platform
DB_USERNAME=postgres
DB_PASSWORD=your-password
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your-username
MAIL_PASSWORD=your-password
```

## 🧪 Testing

```bash
# Backend tests
cd backend
php artisan test
```

## 📦 Deployment

### Admin Panel (Backend) Deployment

- Deploy backend to VPS, AWS, or Laravel Forge
- Configure `.env` for production (APP_ENV=production, DB, mail, etc.)
- Run migrations: `php artisan migrate --force`
- Set up queue workers: `php artisan queue:work`
- Configure Filament admin domain in `.env`: `FILAMENT_ADMIN_DOMAIN=admin.example.com`
- See `deployment/SEPARATE_FRONTEND_BACKEND.md` for separate hosting setup

### Public Site Deployment

- Host your public-facing application separately (recommended)
- Configure settings in Filament Admin → Settings:
  - Public site URL
  - API Base URL & API Key (if needed)
  - SMTP settings
  - SMS provider credentials

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ for modern rental platforms
