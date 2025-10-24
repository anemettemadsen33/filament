# 🧪 Testing Guide - Quick Start

**Project**: RentHub - Rental Platform  
**Last Updated**: October 24, 2025

---

## 📋 Quick Reference

### Backend Tests (Laravel + PHPUnit)

```bash
cd Rental-Platform-main/backend

# Run all tests
php artisan test

# Run with coverage
php artisan test --coverage

# Run specific test file
php artisan test tests/Feature/Api/AuthControllerTest.php

# Run specific test method
php artisan test --filter test_user_can_login_with_valid_credentials

# Run tests in parallel (faster)
php artisan test --parallel

# Run with minimum coverage threshold (60%)
php artisan test --coverage --min=60
```

### Frontend Tests (React + Vitest)

```bash
cd Renthub

# Run all tests
npm run test:run

# Run tests in watch mode
npm run test

# Run with coverage
npm run test:coverage

# Run with UI
npm run test:ui

# Run specific test file
npm run test LoginForm.test.tsx

# Run tests matching pattern
npm run test -- --grep="PropertyCard"
```

---

## 📊 Coverage Requirements

| Suite | Current Target | Final Target | Status |
|-------|----------------|--------------|--------|
| Backend | 60% | 80% | 🟡 In Progress |
| Frontend | 60% | 80% | 🟡 In Progress |

---

## 🧪 Test Examples

### Backend (PHPUnit)

**Location**: `Rental-Platform-main/backend/tests/`

**Available Tests:**
- ✅ `tests/Feature/Api/PingControllerTest.php` - Health check endpoint
- ✅ `tests/Feature/Api/AuthControllerTest.php` - Authentication flow (NEW)
- ✅ `tests/Feature/Api/PropertyControllerTest.php` - Property CRUD (NEW)
- ✅ `tests/Unit/ExampleTest.php` - Basic unit test

**Test Structure:**
```php
<?php

namespace Tests\Feature\Api;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class MyFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_example_feature(): void
    {
        $response = $this->getJson('/api/endpoint');
        
        $response->assertStatus(200)
                 ->assertJson(['status' => 'ok']);
    }
}
```

### Frontend (Vitest + React Testing Library)

**Location**: `Renthub/src/__tests__/`

**Available Tests:**
- ✅ `__tests__/pages/HomePage.test.tsx` - Home page rendering
- ✅ `__tests__/components/LoginForm.test.tsx` - Login form (NEW)
- ✅ `__tests__/components/PropertyCard.test.tsx` - Property card (NEW)

**Test Structure:**
```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(
      <BrowserRouter>
        <MyComponent />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

---

## 🚀 Running Tests in CI/CD

Tests run automatically on every PR via GitHub Actions.

**Workflow**: `.github/workflows/ci.yml` and `.github/workflows/tests.yml`

**Checks:**
- ✅ Backend: PHPUnit with 60% coverage minimum
- ✅ Frontend: Vitest with coverage reporting
- ✅ Linting: ESLint, PHP Pint, PHPStan
- ✅ Type checking: TypeScript
- ✅ Security: npm audit, composer audit

---

## 📝 Writing New Tests

### Backend Test Example

```php
<?php
// tests/Feature/Api/BookingControllerTest.php

namespace Tests\Feature\Api;

use App\Models\User;
use App\Models\Property;
use App\Models\Booking;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class BookingControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_booking(): void
    {
        $user = User::factory()->create();
        $property = Property::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $bookingData = [
            'property_id' => $property->id,
            'start_date' => '2025-11-01',
            'end_date' => '2025-11-07',
        ];

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
                         ->postJson('/api/v1/bookings', $bookingData);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'id',
                     'property_id',
                     'start_date',
                     'end_date',
                 ]);

        $this->assertDatabaseHas('bookings', [
            'user_id' => $user->id,
            'property_id' => $property->id,
        ]);
    }
}
```

### Frontend Test Example

```typescript
// src/__tests__/components/SearchBar.test.tsx

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from '@/components/SearchBar';

describe('SearchBar', () => {
  it('calls onSearch when search button is clicked', async () => {
    const mockSearch = vi.fn();
    const user = userEvent.setup();
    
    render(<SearchBar onSearch={mockSearch} />);
    
    const input = screen.getByPlaceholderText('Search...');
    const button = screen.getByRole('button', { name: /search/i });
    
    await user.type(input, 'New York');
    await user.click(button);
    
    expect(mockSearch).toHaveBeenCalledWith('New York');
  });
});
```

---

## 🔧 Troubleshooting

### Backend Tests Failing

```bash
# Clear caches
php artisan config:clear
php artisan cache:clear

# Rebuild database
php artisan migrate:fresh --env=testing

# Check database connection
php artisan tinker
>>> DB::connection()->getPdo();
```

### Frontend Tests Failing

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear vitest cache
rm -rf node_modules/.vitest

# Update snapshots (if using snapshots)
npm run test -- -u
```

### Coverage Not Generating

**Backend:**
```bash
# Ensure Xdebug is installed
php -v  # Should show Xdebug

# Run with explicit coverage driver
php artisan test --coverage --coverage-html coverage
```

**Frontend:**
```bash
# Ensure coverage provider is installed
npm install -D @vitest/coverage-v8

# Run coverage command
npm run test:coverage
```

---

## 📚 Test Coverage Reports

### Backend

Reports generated in: `Rental-Platform-main/backend/coverage/`

View HTML report:
```bash
cd Rental-Platform-main/backend
php artisan test --coverage-html coverage
open coverage/index.html  # macOS
# or
xdg-open coverage/index.html  # Linux
```

### Frontend

Reports generated in: `Renthub/coverage/`

View HTML report:
```bash
cd Renthub
npm run test:coverage
open coverage/index.html  # macOS
# or
xdg-open coverage/index.html  # Linux
```

---

## 🎯 Test Checklist for New Features

When adding a new feature, ensure:

### Backend
- [ ] Unit tests for models and services
- [ ] Feature tests for API endpoints
- [ ] Test all HTTP methods (GET, POST, PUT, DELETE)
- [ ] Test authentication/authorization
- [ ] Test validation (happy path + error cases)
- [ ] Test edge cases (null, empty, invalid data)
- [ ] Test database interactions
- [ ] Add factories for new models

### Frontend
- [ ] Component rendering tests
- [ ] User interaction tests (clicks, inputs)
- [ ] Props validation tests
- [ ] State management tests
- [ ] API integration tests (mocked)
- [ ] Error handling tests
- [ ] Accessibility tests (aria-labels, roles)
- [ ] Snapshot tests (if appropriate)

---

## 🔗 Additional Resources

- **Full Testing Guide**: See [TESTING_GUIDE.md](../TESTING_GUIDE.md) for comprehensive documentation
- **PHPUnit Docs**: https://phpunit.de/documentation.html
- **Vitest Docs**: https://vitest.dev/guide/
- **Testing Library**: https://testing-library.com/docs/react-testing-library/intro/
- **Laravel Testing**: https://laravel.com/docs/testing

---

## 📞 Support

- **Test Infrastructure Issues**: Check [TROUBLESHOOTING.md](../TROUBLESHOOTING.md)
- **CI/CD Issues**: Check [RUNBOOK.md](../RUNBOOK.md)
- **Questions**: Ask in #engineering Slack channel

---

**Next Steps:**
1. Run existing tests to ensure setup is correct
2. Add tests for your new features
3. Ensure coverage meets minimum thresholds (60%)
4. Watch tests run in CI/CD on your PR

**Happy Testing! 🧪✅**
