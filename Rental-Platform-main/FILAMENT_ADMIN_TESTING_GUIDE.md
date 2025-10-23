# 🎛️ Filament Admin Panel - Manual Testing Guide

## 🚀 Quick Start

### 1. Access Admin Panel

**URL:** `http://localhost:8000/admin`

### 2. Login Credentials

You need to create an admin user first. Run this command:

```bash
cd /workspaces/Rental-Platform/backend
php artisan tinker
```

Then in Tinker console:

```php
$user = \App\Models\User::create([
    'name' => 'Admin User',
    'email' => 'admin@rentalplatform.com',
    'password' => bcrypt('admin123'),
    'role' => 'admin',
    'email_verified_at' => now()
]);
```

Or use existing user and update role:

```php
$user = \App\Models\User::first();
$user->role = 'admin';
$user->save();
```

**Login with:**
- Email: `admin@rentalplatform.com`
- Password: `admin123`

---

## 📋 Admin Panel Features to Test

### 1. **Dashboard** 📊

**URL:** `/admin`

**What to Check:**
- [ ] Dashboard loads without errors
- [ ] Widgets display statistics
- [ ] Charts/graphs are visible
- [ ] Navigation menu is on the left
- [ ] User info displayed in top-right

**Expected Data:**
- Total properties count
- Total bookings count
- Total users count
- Revenue statistics
- Recent activities

---

### 2. **Properties Management** 🏠

**URL:** `/admin/properties`

#### List View
- [ ] Table shows all properties
- [ ] Columns: ID, Title, City, Price, Status
- [ ] Search bar works (try searching "apartment")
- [ ] Filters work (status, rental_type, property_type)
- [ ] Sorting works (click column headers)
- [ ] Pagination works (if >10 properties)
- [ ] Bulk actions available (delete, export)

#### Create Property
**Click "New Property" button**

**Test Form Fields:**
- [ ] Title (required, text)
- [ ] Description (required, rich text editor)
- [ ] Property Type (dropdown: apartment, house, villa, studio, room)
- [ ] Rental Type (dropdown: short_term, long_term, both)
- [ ] City (required, text)
- [ ] Country (required, text)
- [ ] Address (required, text)
- [ ] Latitude (decimal)
- [ ] Longitude (decimal)
- [ ] Price per Night (required, number, min: 0)
- [ ] Cleaning Fee (number)
- [ ] Bedrooms (required, integer, min: 0)
- [ ] Bathrooms (required, number, min: 0)
- [ ] Max Guests (required, integer, min: 1)
- [ ] Area (sqm) (integer)
- [ ] Status (toggle: active/inactive)
- [ ] Amenities (multi-select relationship)
- [ ] Owner (select user with role=owner)

**Validation Testing:**
- [ ] Try submitting empty form (should show errors)
- [ ] Enter invalid price (negative number)
- [ ] Enter invalid email format
- [ ] Test required fields

**Create Test Property:**
```
Title: Luxury Downtown Apartment
Description: Beautiful 2-bedroom apartment in city center
Property Type: apartment
Rental Type: both
City: București
Country: România
Address: Strada Victoriei 123
Latitude: 44.4268
Longitude: 26.1025
Price per Night: 150
Cleaning Fee: 50
Bedrooms: 2
Bathrooms: 2
Max Guests: 4
Area: 85
Status: Active
```

#### Edit Property
- [ ] Click on any property row
- [ ] Form pre-fills with existing data
- [ ] Can modify all fields
- [ ] Save changes works
- [ ] Validation still applies

#### View Property
- [ ] Click "View" action
- [ ] All details displayed in read-only mode
- [ ] Related data shown (bookings, reviews, images)

#### Delete Property
- [ ] Click delete icon
- [ ] Confirmation modal appears
- [ ] Property deleted from database
- [ ] Cascade deletes related data?

---

### 3. **Bookings Management** 📅

**URL:** `/admin/bookings`

#### List View
- [ ] Table shows all bookings
- [ ] Columns: ID, Property, User, Check-in, Check-out, Status, Total Price
- [ ] Status badges colored correctly:
  - Pending: Yellow
  - Confirmed: Blue
  - Cancelled: Red
  - Completed: Green
- [ ] Filters work (status, date range)
- [ ] Search works (property name, user name)

#### View Booking Details
- [ ] Click on booking row
- [ ] Property details shown
- [ ] User/guest details shown
- [ ] Check-in/check-out dates
- [ ] Guests count
- [ ] Price breakdown
- [ ] Payment status
- [ ] Booking status

#### Update Booking Status
- [ ] Change status from Pending → Confirmed
- [ ] Change status to Cancelled
- [ ] Change status to Completed
- [ ] Verify email notifications sent (check logs)

#### Create Booking (Manual)
**Click "New Booking" button**

**Test:**
- [ ] Select property from dropdown
- [ ] Select user/guest from dropdown
- [ ] Set check-in date (must be future)
- [ ] Set check-out date (must be after check-in)
- [ ] Enter guests count (must be <= property max_guests)
- [ ] Total price calculates automatically
- [ ] Status set to Pending by default

**Validation:**
- [ ] Can't book past dates
- [ ] Can't set check-out before check-in
- [ ] Can't exceed max guests
- [ ] Can't double-book same property/dates

---

### 4. **Users Management** 👥

**URL:** `/admin/users`

#### List View
- [ ] Table shows all users
- [ ] Columns: ID, Name, Email, Role, Verified, Created At
- [ ] Role badges (Admin, Owner, User)
- [ ] Email verified status (checkmark or X)
- [ ] Filters (role, verified status)
- [ ] Search (name, email)

#### Create User
**Test Form:**
- [ ] Name (required)
- [ ] Email (required, unique, valid format)
- [ ] Password (required, min 8 chars)
- [ ] Role (dropdown: admin, owner, user)
- [ ] Email Verified At (datetime)

**Create Test Users:**

**Owner:**
```
Name: Property Owner
Email: owner@test.com
Password: password123
Role: owner
```

**Regular User:**
```
Name: Regular User
Email: user@test.com
Password: password123
Role: user
```

#### Edit User
- [ ] Update user details
- [ ] Change role
- [ ] Reset password
- [ ] Verify/unverify email

#### Delete User
- [ ] Delete confirmation
- [ ] Check cascade (bookings, properties owned)

---

### 5. **Reviews Management** ⭐

**URL:** `/admin/reviews`

#### List View
- [ ] Table shows all reviews
- [ ] Columns: ID, Property, User, Rating, Status, Created At
- [ ] Rating displayed as stars (1-5)
- [ ] Status badges (Pending, Approved, Rejected)
- [ ] Filters (status, rating)

#### View Review
- [ ] Property name
- [ ] User name
- [ ] Rating (1-5 stars)
- [ ] Comment text
- [ ] Owner response (if exists)
- [ ] Created date
- [ ] Status

#### Moderate Reviews
**Test Workflow:**
- [ ] New review starts as "Pending"
- [ ] Admin can Approve review
- [ ] Admin can Reject review
- [ ] Approved reviews appear on property page
- [ ] Rejected reviews hidden from public

#### Respond to Review (as Owner)
- [ ] Owner can add response
- [ ] Response appears below review
- [ ] Response date recorded

---

### 6. **Amenities Management** 🛋️

**URL:** `/admin/amenities`

#### List View
- [ ] Simple table with Name column
- [ ] Search works
- [ ] Inline editing possible

#### Create Amenity
**Test adding:**
- [ ] WiFi
- [ ] Air Conditioning
- [ ] Parking
- [ ] Pool
- [ ] Gym
- [ ] Kitchen
- [ ] Washing Machine
- [ ] TV
- [ ] Balcony

#### Edit/Delete
- [ ] Update amenity name
- [ ] Delete amenity
- [ ] Check if deleted from properties

---

### 7. **Property Images Management** 🖼️

**URL:** `/admin/property-images` or within Property edit page

#### Upload Images
- [ ] Click upload button
- [ ] Select multiple images
- [ ] Images upload successfully
- [ ] Thumbnails generated
- [ ] Max 20 images per property enforced
- [ ] File size limit (10MB) enforced
- [ ] Valid formats only (PNG, JPG, WEBP, GIF)

#### Image Actions
- [ ] Set as primary image
- [ ] Reorder images (drag & drop)
- [ ] Delete image
- [ ] View full size

---

### 8. **Settings/Configuration** ⚙️

**URL:** `/admin/settings` (if exists)

**Test:**
- [ ] Site name
- [ ] Contact email
- [ ] Currency settings
- [ ] Booking rules
- [ ] Email templates
- [ ] Payment gateway config

---

## 🎨 Filament UI Features to Test

### Navigation
- [ ] Sidebar menu expands/collapses
- [ ] Active menu item highlighted
- [ ] Breadcrumbs work
- [ ] User dropdown (profile, logout)

### Tables
- [ ] Column sorting (click headers)
- [ ] Search bar filters results
- [ ] Filters sidebar works
- [ ] Bulk actions (select multiple rows)
- [ ] Export to CSV/Excel
- [ ] Pagination (10, 25, 50 per page)

### Forms
- [ ] Field validation messages
- [ ] Required field indicators (*)
- [ ] Placeholder text
- [ ] Help text/tooltips
- [ ] Rich text editor (for descriptions)
- [ ] Date picker
- [ ] Time picker
- [ ] File uploader
- [ ] Relationship selects (searchable dropdowns)
- [ ] Repeaters (add/remove dynamic fields)
- [ ] Tabs (organize form sections)

### Notifications
- [ ] Success notification (green)
- [ ] Error notification (red)
- [ ] Info notification (blue)
- [ ] Auto-dismiss after 3 seconds

### Modals
- [ ] Delete confirmation modal
- [ ] Edit in modal (slide-over)
- [ ] Close button works
- [ ] Click outside to close

---

## 🔍 Advanced Features

### Widgets
- [ ] Stats widget (total counts)
- [ ] Chart widget (line/bar/pie)
- [ ] Table widget (recent items)
- [ ] Custom widgets

### Global Search
- [ ] Search bar in header
- [ ] Search across all resources
- [ ] Quick navigation to results

### Notifications Center
- [ ] Bell icon in header
- [ ] Unread count badge
- [ ] Mark as read
- [ ] Clear all

### User Profile
- [ ] Click profile avatar
- [ ] Edit profile
- [ ] Change password
- [ ] Logout

---

## 🐛 Common Issues to Check

### Performance
- [ ] Page loads in < 2 seconds
- [ ] Table pagination doesn't freeze
- [ ] Image uploads don't timeout
- [ ] No memory errors with large datasets

### Permissions
- [ ] Only admins can access `/admin`
- [ ] Owners can only see their properties
- [ ] Users cannot access admin panel
- [ ] Role-based access control works

### Data Integrity
- [ ] Deleting property deletes bookings?
- [ ] Deleting user deletes their data?
- [ ] Cascade deletes work correctly
- [ ] Unique constraints enforced (email)

### Validation
- [ ] All required fields validated
- [ ] Email format validated
- [ ] Number ranges enforced (min/max)
- [ ] Date logic validated (check-out > check-in)
- [ ] File upload limits enforced

---

## 📊 Test Data Scenarios

### Create Complete Property
1. Create property with all fields
2. Upload 5-10 images
3. Set one as primary
4. Assign amenities
5. Set owner
6. Activate property

### Booking Flow
1. Create user (guest)
2. Create booking for property
3. Set status to Confirmed
4. Complete booking after dates pass
5. Add review

### Review Moderation
1. User submits review
2. Admin sees in Pending
3. Admin approves
4. Review appears on property page
5. Owner responds to review

---

## ✅ Success Checklist

Your Filament admin panel is working correctly if:

✅ Can login with admin credentials  
✅ Dashboard displays without errors  
✅ Can create/edit/delete properties  
✅ Can manage bookings and change status  
✅ Can moderate reviews (approve/reject)  
✅ Can upload and manage property images  
✅ Can create/edit users and assign roles  
✅ Filters and search work on all tables  
✅ Validation prevents invalid data  
✅ Notifications display correctly  
✅ No console errors (F12)  
✅ Responsive design works on smaller screens  

---

## 🚀 Quick Test Commands

### Create Admin User
```bash
php artisan tinker
```
```php
\App\Models\User::create(['name' => 'Admin', 'email' => 'admin@test.com', 'password' => bcrypt('admin123'), 'role' => 'admin', 'email_verified_at' => now()]);
```

### Clear Cache
```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

### Check Admin Routes
```bash
php artisan route:list --path=admin
```

### Check Filament Version
```bash
php artisan about
```

---

## 📞 Troubleshooting

### Can't Login?
- Check user role is 'admin'
- Verify email_verified_at is set
- Clear browser cookies
- Check `.env` APP_URL matches localhost:8000

### Images Not Uploading?
- Check `storage/app/public` exists
- Run `php artisan storage:link`
- Check file permissions (775)
- Verify max file size in php.ini

### Tables Not Loading?
- Check database connection
- Run migrations: `php artisan migrate`
- Seed data: `php artisan db:seed`
- Check browser console for errors

### 403 Forbidden?
- Verify user has admin role
- Check Filament auth configuration
- Clear Laravel cache

---

**Happy Testing!** 🎉
