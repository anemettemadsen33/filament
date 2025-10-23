# Smoke Tests - Rental Platform

End-to-end smoke tests for critical user flows.

## Prerequisites

- Backend running on `http://localhost:8000`
- Frontend running on `http://localhost:3000`
- Database seeded with test data
- At least one admin user and one property owner user

## Test Suite 1: Property Images Workflow

### 1.1 Owner Uploads Images

**Objective:** Verify property image upload, processing, and storage.

**Steps:**

1. Log in as property owner
2. Navigate to Dashboard → My Properties
3. Click "Edit" on any property
4. Scroll to "Images" section
5. Click "Upload Images"
6. Select 2-3 images (PNG/JPG/WEBP/GIF, <10MB each)
7. Wait for upload to complete

**Expected Results:**

- Upload progress indicator appears
- Success message displayed
- Thumbnails appear in image grid
- First uploaded image is automatically set as primary (if no primary exists)
- Images are sorted by `sort_order`

**Backend Validation:**

```bash
# Check images exist on disk
ls -lh storage/app/public/properties/{property_id}/

# Check database records
sqlite3 database/database.sqlite "SELECT id, property_id, is_primary, sort_order FROM property_images WHERE property_id = {property_id};"
```

### 1.2 Owner Manages Images

**Objective:** Verify set primary, reorder, and delete operations.

**Steps:**

1. Continue from previous test (logged in as owner, on edit property page)
2. Click "Set Primary" on second image
3. Verify "Primary" badge moves to that image
4. Click left/right arrows to reorder images
5. Click "Delete" on last image
6. Confirm deletion

**Expected Results:**

- Primary badge updates immediately
- Image order changes in UI
- Deleted image disappears from grid
- If primary image is deleted, next image becomes primary

**Backend Validation:**

```bash
# Verify is_primary flag updated
sqlite3 database/database.sqlite "SELECT id, is_primary FROM property_images WHERE property_id = {property_id};"

# Verify sort_order updated
sqlite3 database/database.sqlite "SELECT id, sort_order FROM property_images WHERE property_id = {property_id} ORDER BY sort_order;"

# Verify file deleted from disk
ls storage/app/public/properties/{property_id}/
```

### 1.3 Guest Views Property Gallery

**Objective:** Verify public property detail page displays images correctly.

**Steps:**

1. Log out (or open incognito window)
2. Navigate to property list page
3. Click on any property with images
4. Verify image grid displays primary image in large panel
5. Click on primary image
6. Verify lightbox opens showing full-size image
7. Press right arrow key or click next button
8. Verify lightbox navigates to next image
9. Press Escape key
10. Verify lightbox closes

**Expected Results:**

- Primary image appears in left 2-column grid section
- Up to 4 additional images appear in right grid
- Lightbox displays full-resolution images
- Keyboard navigation works (Escape, Left/Right arrows)
- Image counter shows current position (e.g., "2 / 5")

---

## Test Suite 2: Review Submission & Approval Workflow

### 2.1 Guest Submits Review

**Objective:** Verify review submission creates pending review.

**Steps:**

1. Log in as guest user (not property owner)
2. Navigate to any property detail page
3. Scroll to "Reviews" section
4. Scroll to "Write a review" form
5. Select rating (1-5 stars)
6. Enter comment text
7. Click "Submit Review"

**Expected Results:**

- Success message: "Review submitted and awaiting moderation."
- Form resets (comment cleared, rating back to 5)
- Review does NOT appear in public reviews list (still pending)

**Backend Validation:**

```bash
# Check review created with pending status
sqlite3 database/database.sqlite "SELECT id, property_id, user_id, rating, status FROM reviews ORDER BY created_at DESC LIMIT 1;"
```

### 2.2 Admin Approves Review

**Objective:** Verify admin can approve reviews in Filament.

**Steps:**

1. Log in to admin panel at `/admin`
2. Navigate to "Reviews" resource
3. Filter by status: "Pending" (should be default filter)
4. Locate the review created in previous test
5. Click "Approve" button or edit and set status to "Approved"
6. Save

**Expected Results:**

- Review status changes to "Approved"
- Review disappears from "Pending" filter view

**Backend Validation:**

```bash
# Verify status updated
sqlite3 database/database.sqlite "SELECT id, status FROM reviews WHERE id = {review_id};"
```

### 2.3 Guest Sees Approved Review

**Objective:** Verify approved reviews display on property page.

**Steps:**

1. Log out from admin panel
2. Navigate to the same property detail page
3. Scroll to "Reviews" section

**Expected Results:**

- Approved review appears in reviews list
- Review displays:
  - User name
  - Rating (stars)
  - Comment text
  - Date (formatted as "Month Year")
- Average rating updates at top of reviews section

---

## Test Suite 3: Owner Portal Integration

### 3.1 Owner Views Own Properties

**Objective:** Verify owner can filter their properties.

**Steps:**

1. Log in as property owner
2. Navigate to Dashboard → My Properties

**Expected Results:**

- Only properties owned by logged-in user appear
- Published and draft properties both visible
- Each property card shows primary image (or placeholder)

### 3.2 Owner Edits Property with Images

**Objective:** Verify seamless round-trip edit flow.

**Steps:**

1. Continue from previous test
2. Click "Edit" on any property
3. Update title or description
4. Upload 1 new image
5. Reorder images
6. Click "Save Changes"
7. Navigate back to "My Properties"

**Expected Results:**

- Property updates saved
- New image uploaded
- Property card reflects updated title/image

---

## Test Suite 4: Error Handling

### 4.1 Image Upload Limits

**Objective:** Verify validation for image limits.

**Steps:**

1. Log in as owner
2. Edit property with 18 existing images
3. Attempt to upload 3 more images (total 21, exceeds limit of 20)

**Expected Results:**

- Error message: "A property can have at most 20 images. You can upload up to 2 more."
- Upload rejected
- No images added

### 4.2 Invalid File Types

**Objective:** Verify file type validation.

**Steps:**

1. Log in as owner
2. Edit any property
3. Attempt to upload a PDF or text file

**Expected Results:**

- Browser file picker restricts to image types (PNG/JPG/WEBP/GIF)
- If bypassed, backend returns validation error

### 4.3 Oversized Files

**Objective:** Verify file size validation.

**Steps:**

1. Attempt to upload image >10MB

**Expected Results:**

- Backend validation error: "The images.0 field must not be greater than 10240 kilobytes."
- No image uploaded

### 4.4 Unauthorized Review Approval

**Objective:** Verify only admins can approve reviews.

**Steps:**

1. Log in as guest or owner (non-admin)
2. Attempt to access `/admin` or approve reviews via API

**Expected Results:**

- Admin panel redirects to login or shows 403
- API returns 403 Forbidden

---

## Test Suite 5: Performance & Data Integrity

### 5.1 Image Processing

**Objective:** Verify images are auto-oriented and resized.

**Steps:**

1. Upload a large image (e.g., 4000x3000, 5MB)

**Expected Results:**

- Image processed within 5 seconds
- Stored image dimensions max 1600x1200
- File size reduced (85% JPEG quality)
- Orientation metadata applied (EXIF auto-rotate)

**Backend Validation:**

```bash
# Check stored image dimensions
identify storage/app/public/properties/{property_id}/{year}/{month}/{filename}
```

### 5.2 Concurrent Uploads

**Objective:** Verify system handles multiple uploads.

**Steps:**

1. Open 2 browser tabs as same owner
2. Edit same property in both tabs
3. Upload different images in each tab simultaneously

**Expected Results:**

- Both uploads succeed
- All images appear in final list
- No database conflicts
- Sort order remains consistent

---

## Regression Checks

After each deployment or major change, run:

1. **Basic Flow:** Upload 1 image → set primary → delete
2. **Review Flow:** Submit review → admin approve → verify public display
3. **Error Flow:** Attempt invalid upload (wrong type/size)

---

## Automated Test Commands (Future)

```bash
# Backend feature tests
php artisan test --filter PropertyImageTest
php artisan test --filter ReviewApprovalTest

# Frontend E2E tests (if implemented)
npm --prefix frontend run test:e2e
```

---

## Known Issues / Edge Cases

- **Thumbnail generation:** Currently not implemented; UI uses `thumbnail_url || url` fallback
- **Lightbox on mobile:** May need touch gesture support
- **Review edit:** Guests cannot edit reviews after submission (by design)

---

## Success Criteria

✅ All images upload, display, and manage correctly  
✅ Reviews submit as pending, admin approves, public sees approved only  
✅ Validations enforce limits (20 images, 10MB, file types)  
✅ No orphaned files or database records  
✅ UI updates reflect backend state immediately
