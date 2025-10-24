# 🧪 Testing Guide - RentHub Platform

**Complete testing infrastructure for Laravel 12 + React 19 application**

---

## Table of Contents

1. [Overview](#overview)
2. [Backend Testing (Laravel + PHPUnit)](#backend-testing)
3. [Frontend Testing (React + Vitest)](#frontend-testing)
4. [E2E Testing (Playwright)](#e2e-testing)
5. [Running Tests](#running-tests)
6. [Coverage Requirements](#coverage-requirements)
7. [CI/CD Integration](#cicd-integration)
8. [Writing New Tests](#writing-new-tests)

---

## Overview

### Testing Stack

**Backend**:
- **PHPUnit**: Unit and feature tests
- **Laravel Testing**: Database, HTTP, and integration tests
- **Coverage**: Xdebug

**Frontend**:
- **Vitest**: Unit and integration tests
- **React Testing Library**: Component testing
- **jsdom**: DOM environment
- **Coverage**: V8

**E2E**:
- **Playwright**: End-to-end browser testing

### Coverage Goals

- **Minimum**: 80% code coverage for both backend and frontend
- **Target**: 85%+ code coverage
- **Critical Paths**: 100% coverage for authentication, payments, booking workflows

---

## Backend Testing

### Setup

```bash
cd Rental-Platform-main/backend

# Install dependencies
composer install

# Copy environment file
cp .env.example .env.testing

# Generate application key
php artisan key:generate --env=testing

# Set up test database
# Update .env.testing with test database credentials
```

### Running Backend Tests

```bash
# Run all tests
php artisan test

# Run with coverage
php artisan test --coverage

# Run with minimum coverage threshold
php artisan test --coverage --min=80

# Run specific test file
php artisan test tests/Feature/Api/AuthControllerTest.php

# Run specific test method
php artisan test --filter=test_user_can_login

# Run tests in parallel (faster)
php artisan test --parallel

# Run with verbose output
php artisan test --verbose
```

### Test Structure

```
tests/
├── Feature/                 # Feature/Integration tests
│   ├── Api/                # API endpoint tests
│   │   ├── AuthControllerTest.php
│   │   ├── PropertyControllerTest.php
│   │   ├── BookingControllerTest.php
│   │   └── ...
│   ├── Filament/           # Filament admin tests
│   └── ...
├── Unit/                    # Unit tests
│   ├── Services/           # Service tests
│   ├── Models/             # Model tests
│   └── ...
└── TestCase.php            # Base test class
```

### Example Backend Test

```php
<?php

namespace Tests\Feature\Api;

use Tests\TestCase;
use App\Models\User;
use App\Models\Property;
use Laravel\Sanctum\Sanctum;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PropertyControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_create_property(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $propertyData = [
            'title' => 'Beautiful Apartment',
            'description' => 'A lovely 2-bedroom apartment',
            'price' => 1500,
            'bedrooms' => 2,
            'bathrooms' => 1,
        ];

        $response = $this->postJson('/api/properties', $propertyData);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'data' => [
                         'id',
                         'title',
                         'price',
                     ]
                 ]);

        $this->assertDatabaseHas('properties', [
            'title' => 'Beautiful Apartment',
        ]);
    }
}
```

### Testing Best Practices (Backend)

1. **Use RefreshDatabase** trait to reset database between tests
2. **Use factories** for model creation
3. **Test both success and failure** scenarios
4. **Mock external services** (email, payment gateways)
5. **Use Sanctum::actingAs()** for authenticated requests
6. **Test JSON structure** with assertJsonStructure
7. **Test database changes** with assertDatabaseHas/Missing

---

## Frontend Testing

### Setup

```bash
cd Renthub

# Install dependencies (includes testing packages)
npm install

# Testing packages are already in package.json:
# - vitest
# - @vitest/ui
# - @vitest/coverage-v8
# - @testing-library/react
# - @testing-library/jest-dom
# - jsdom
```

### Running Frontend Tests

```bash
# Run all tests in watch mode
npm run test

# Run tests once (CI mode)
npm run test:run

# Run with UI
npm run test:ui

# Run with coverage
npm run test:coverage

# Run specific test file
npx vitest run src/__tests__/pages/HomePage.test.tsx

# Run tests matching pattern
npx vitest run -t "authentication"
```

### Test Structure

```
src/
├── __tests__/              # Test files
│   ├── components/         # Component tests
│   │   ├── Header.test.tsx
│   │   ├── PropertyCard.test.tsx
│   │   └── ...
│   ├── pages/              # Page tests
│   │   ├── HomePage.test.tsx
│   │   ├── PropertyDetailsPage.test.tsx
│   │   └── ...
│   ├── hooks/              # Custom hooks tests
│   └── utils/              # Utility function tests
└── test/                   # Test utilities
    └── setup.ts            # Global test setup
```

### Example Frontend Test

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import PropertyCard from '../../components/PropertyCard';

describe('PropertyCard', () => {
  const mockProperty = {
    id: 1,
    title: 'Beautiful Apartment',
    price: 1500,
    bedrooms: 2,
    bathrooms: 1,
    image: '/image.jpg',
  };

  it('renders property information correctly', () => {
    render(
      <BrowserRouter>
        <PropertyCard property={mockProperty} />
      </BrowserRouter>
    );

    expect(screen.getByText('Beautiful Apartment')).toBeInTheDocument();
    expect(screen.getByText('$1500')).toBeInTheDocument();
    expect(screen.getByText('2 bedrooms')).toBeInTheDocument();
  });

  it('calls onFavorite when favorite button is clicked', async () => {
    const onFavorite = vi.fn();
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <PropertyCard property={mockProperty} onFavorite={onFavorite} />
      </BrowserRouter>
    );

    const favoriteButton = screen.getByLabelText('Add to favorites');
    await user.click(favoriteButton);

    expect(onFavorite).toHaveBeenCalledWith(mockProperty.id);
  });

  it('navigates to property details on click', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <PropertyCard property={mockProperty} />
      </BrowserRouter>
    );

    const card = screen.getByRole('article');
    await user.click(card);

    // Check if navigation occurred (you may need to mock useNavigate)
  });
});
```

### Testing Best Practices (Frontend)

1. **Wrap components in BrowserRouter** if they use routing
2. **Use userEvent** instead of fireEvent for user interactions
3. **Test user behavior**, not implementation details
4. **Use screen queries** (getByRole, getByText) over container queries
5. **Mock API calls** with vi.fn() or MSW
6. **Test accessibility** with getByRole
7. **Wait for async updates** with waitFor
8. **Clean up after each test** (automatic with setup.ts)

---

## E2E Testing

### Setup

```bash
cd Renthub

# Install Playwright
npm install --save-dev @playwright/test

# Install browsers
npx playwright install --with-deps

# Create playwright.config.ts
```

### Running E2E Tests

```bash
# Run all E2E tests
npx playwright test

# Run in headed mode (see browser)
npx playwright test --headed

# Run specific test file
npx playwright test tests/e2e/auth.spec.ts

# Run with UI
npx playwright test --ui

# Generate test report
npx playwright show-report

# Debug mode
npx playwright test --debug
```

### Example E2E Test

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('user can register and login', async ({ page }) => {
    // Navigate to registration page
    await page.goto('http://localhost:5173/register');

    // Fill registration form
    await page.fill('[name="name"]', 'Test User');
    await page.fill('[name="email"]', `test${Date.now()}@example.com`);
    await page.fill('[name="password"]', 'password123');
    await page.fill('[name="password_confirmation"]', 'password123');

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for redirect to dashboard
    await page.waitForURL('**/dashboard');

    // Verify user is logged in
    await expect(page.locator('text=Welcome, Test User')).toBeVisible();
  });

  test('user can search for properties', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // Use search
    await page.fill('[placeholder="Search properties..."]', 'apartment');
    await page.click('button:has-text("Search")');

    // Wait for results
    await page.waitForSelector('[data-testid="property-card"]');

    // Verify results
    const results = await page.locator('[data-testid="property-card"]');
    await expect(results).toHaveCount(await results.count());
  });
});
```

---

## Running Tests

### Local Development

```bash
# Backend
cd Rental-Platform-main/backend
php artisan test

# Frontend
cd Renthub
npm run test

# E2E
cd Renthub
npx playwright test
```

### CI/CD (Automated)

Tests run automatically on:
- Every pull request to `main` or `develop`
- Every push to `main` or `develop`
- Daily scheduled runs

See `.github/workflows/tests.yml` for configuration.

---

## Coverage Requirements

### Backend Coverage Thresholds

```xml
<!-- phpunit.xml -->
<coverage>
    <report>
        <html outputDirectory="coverage/html"/>
        <clover outputFile="coverage/clover.xml"/>
    </report>
</coverage>
```

### Frontend Coverage Thresholds

```typescript
// vitest.config.ts
coverage: {
  thresholds: {
    lines: 80,
    functions: 80,
    branches: 80,
    statements: 80,
  },
}
```

### Viewing Coverage Reports

```bash
# Backend: Open coverage/html/index.html in browser

# Frontend: Open coverage/index.html in browser
# Or run: npm run test:coverage
```

---

## CI/CD Integration

### GitHub Actions Workflow

Tests are run automatically via `.github/workflows/tests.yml`:

1. **Backend Tests**
   - Set up PHP 8.2
   - Install Composer dependencies
   - Run PHPUnit tests
   - Upload coverage to Codecov

2. **Frontend Tests**
   - Set up Node.js 18
   - Install npm dependencies
   - Run Vitest tests
   - Upload coverage to Codecov

3. **E2E Tests**
   - Build application
   - Run Playwright tests
   - Upload test reports as artifacts

4. **Code Quality**
   - Run ESLint
   - Run TypeScript checks
   - Run security audits

### Pull Request Checks

All PRs must pass:
- ✅ All backend tests
- ✅ All frontend tests
- ✅ All E2E tests
- ✅ 80%+ coverage
- ✅ No linting errors
- ✅ No security vulnerabilities

---

## Writing New Tests

### Backend Test Template

```php
<?php

namespace Tests\Feature\Api;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

class YourControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_description_of_what_you_are_testing(): void
    {
        // Arrange: Set up test data
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        // Act: Perform the action
        $response = $this->getJson('/api/endpoint');

        // Assert: Verify the result
        $response->assertStatus(200);
    }
}
```

### Frontend Test Template

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import YourComponent from '../YourComponent';

describe('YourComponent', () => {
  it('description of what you are testing', () => {
    // Arrange
    const props = { /* ... */ };

    // Act
    render(
      <BrowserRouter>
        <YourComponent {...props} />
      </BrowserRouter>
    );

    // Assert
    expect(screen.getByText('Expected text')).toBeInTheDocument();
  });
});
```

---

## Test Coverage by Module

### High Priority (100% Coverage Required)

- ✅ Authentication (login, register, logout)
- ✅ Payment processing
- ✅ Booking creation and management
- ✅ User profile management
- ✅ Property creation and editing

### Medium Priority (80%+ Coverage)

- 🔄 Search and filtering
- 🔄 Reviews and ratings
- 🔄 Messaging system
- 🔄 Admin panel operations
- 🔄 Localization

### Lower Priority (60%+ Coverage)

- 📋 UI components
- 📋 Helper utilities
- 📋 Static pages
- 📋 SEO components

---

## Troubleshooting

### Common Issues

**Backend:**
- Database connection issues → Check .env.testing configuration
- Class not found → Run `composer dump-autoload`
- Test fails in CI but passes locally → Check database differences

**Frontend:**
- `Cannot find module '@/...'` → Check vitest.config.ts alias configuration
- `window is not defined` → Import components correctly in setup.ts
- Test timeouts → Increase timeout in vitest.config.ts

**E2E:**
- Browser not found → Run `npx playwright install`
- Page timeout → Increase timeout in playwright.config.ts
- Flaky tests → Add proper wait conditions

---

## Resources

- [PHPUnit Documentation](https://phpunit.de/documentation.html)
- [Laravel Testing](https://laravel.com/docs/testing)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)

---

## Next Steps

1. ✅ Review this guide
2. ✅ Install testing dependencies
3. ✅ Run existing example tests
4. 📝 Write tests for your features
5. 📊 Monitor coverage reports
6. 🚀 Deploy with confidence!

---

**Last Updated**: October 24, 2025  
**Maintained By**: Development Team
