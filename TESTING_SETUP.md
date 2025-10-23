# 🧪 Testing Setup - Rental Platform

**Version:** 1.0  
**Last Updated:** October 23, 2025  
**Coverage Target:** 70%+

## 📋 Overview

This document outlines the comprehensive testing strategy for both the backend (Laravel) and frontend (React) components of the rental platform.

---

## 🎯 Testing Philosophy

### Test Pyramid

```
        /\
       /E2E\
      /------\
     /  API   \
    /  Tests   \
   /------------\
  / Unit Tests  \
 /_______________\
```

- **Unit Tests (70%):** Test individual functions and methods
- **Integration Tests (20%):** Test API endpoints and component interactions
- **E2E Tests (10%):** Test complete user workflows

### Coverage Goals

- **Backend:** 70%+ overall coverage
  - Controllers: 80%+
  - Models: 90%+
  - Services: 85%+
  - Policies: 95%+

- **Frontend:** 70%+ overall coverage
  - Components: 75%+
  - Hooks: 80%+
  - Utils: 90%+
  - API Services: 85%+

---

## 🔧 Backend Testing (Laravel + PHPUnit)

### Setup

**1. Install PHPUnit (already included in Laravel):**
```bash
cd Rental-Platform-main/backend
composer require --dev phpunit/phpunit
```

**2. Configure PHPUnit (phpunit.xml):**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<phpunit xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:noNamespaceSchemaLocation="vendor/phpunit/phpunit/phpunit.xsd"
         bootstrap="vendor/autoload.php"
         colors="true"
         testdox="true">
    <testsuites>
        <testsuite name="Unit">
            <directory>tests/Unit</directory>
        </testsuite>
        <testsuite name="Feature">
            <directory>tests/Feature</directory>
        </testsuite>
    </testsuites>
    <coverage>
        <include>
            <directory suffix=".php">app</directory>
        </include>
        <exclude>
            <directory>app/Console</directory>
            <directory>app/Exceptions</directory>
        </exclude>
        <report>
            <html outputDirectory="coverage-report"/>
            <text outputFile="php://stdout" showUncoveredFiles="false"/>
        </report>
    </coverage>
    <php>
        <env name="APP_ENV" value="testing"/>
        <env name="BCRYPT_ROUNDS" value="4"/>
        <env name="CACHE_DRIVER" value="array"/>
        <env name="DB_CONNECTION" value="sqlite"/>
        <env name="DB_DATABASE" value=":memory:"/>
        <env name="MAIL_MAILER" value="array"/>
        <env name="QUEUE_CONNECTION" value="sync"/>
        <env name="SESSION_DRIVER" value="array"/>
    </php>
</phpunit>
```

**3. Create Test Database Configuration:**
```bash
# .env.testing
APP_ENV=testing
APP_KEY=base64:YOUR_TEST_KEY_HERE
DB_CONNECTION=sqlite
DB_DATABASE=:memory:
CACHE_DRIVER=array
SESSION_DRIVER=array
QUEUE_CONNECTION=sync
MAIL_MAILER=array
```

### Unit Tests

**Location:** `tests/Unit/`

**Example: PropertyModelTest.php**
```php
<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Property;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PropertyModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_property_belongs_to_user(): void
    {
        $user = User::factory()->create();
        $property = Property::factory()->create(['user_id' => $user->id]);

        $this->assertInstanceOf(User::class, $property->user);
        $this->assertEquals($user->id, $property->user->id);
    }

    public function test_property_has_bookings_relationship(): void
    {
        $property = Property::factory()->create();

        $this->assertInstanceOf(
            \Illuminate\Database\Eloquent\Collection::class,
            $property->bookings
        );
    }

    public function test_property_calculates_average_rating(): void
    {
        $property = Property::factory()->create();
        
        // Create reviews with ratings 4, 5, 3
        Review::factory()->create(['property_id' => $property->id, 'rating' => 4]);
        Review::factory()->create(['property_id' => $property->id, 'rating' => 5]);
        Review::factory()->create(['property_id' => $property->id, 'rating' => 3]);

        $this->assertEquals(4.0, $property->averageRating());
    }

    public function test_property_scope_published(): void
    {
        Property::factory()->create(['status' => 'published']);
        Property::factory()->create(['status' => 'draft']);

        $published = Property::published()->get();

        $this->assertCount(1, $published);
        $this->assertEquals('published', $published->first()->status);
    }
}
```

**Example: BookingValidationTest.php**
```php
<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Services\BookingService;
use App\Models\Property;
use App\Models\Booking;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;

class BookingValidationTest extends TestCase
{
    use RefreshDatabase;

    private BookingService $bookingService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->bookingService = new BookingService();
    }

    public function test_validates_checkout_after_checkin(): void
    {
        $checkin = Carbon::now();
        $checkout = Carbon::now()->subDay(); // Invalid: before checkin

        $result = $this->bookingService->validateDates($checkin, $checkout);

        $this->assertFalse($result);
    }

    public function test_validates_dates_not_in_past(): void
    {
        $checkin = Carbon::now()->subWeek();
        $checkout = Carbon::now()->subDays(5);

        $result = $this->bookingService->validateDates($checkin, $checkout);

        $this->assertFalse($result);
    }

    public function test_detects_overlapping_bookings(): void
    {
        $property = Property::factory()->create();
        
        // Existing booking: Jan 10-15
        Booking::factory()->create([
            'property_id' => $property->id,
            'check_in' => '2025-01-10',
            'check_out' => '2025-01-15',
            'status' => 'confirmed'
        ]);

        // Try to book Jan 12-17 (overlaps)
        $hasOverlap = $this->bookingService->hasOverlap(
            $property->id,
            '2025-01-12',
            '2025-01-17'
        );

        $this->assertTrue($hasOverlap);
    }

    public function test_calculates_total_price_correctly(): void
    {
        $property = Property::factory()->create(['price_per_night' => 100]);
        $checkin = Carbon::parse('2025-01-01');
        $checkout = Carbon::parse('2025-01-05'); // 4 nights

        $total = $this->bookingService->calculateTotal(
            $property,
            $checkin,
            $checkout
        );

        $this->assertEquals(400, $total);
    }
}
```

### Feature Tests (API Tests)

**Location:** `tests/Feature/`

**Example: AuthenticationTest.php**
```php
<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
            'role' => 'guest'
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'user' => ['id', 'name', 'email', 'role'],
                'token'
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com'
        ]);
    }

    public function test_user_can_login(): void
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('Password123!')
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'test@example.com',
            'password' => 'Password123!'
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'user' => ['id', 'name', 'email'],
                'token'
            ]);
    }

    public function test_user_cannot_login_with_invalid_credentials(): void
    {
        $user = User::factory()->create();

        $response = $this->postJson('/api/auth/login', [
            'email' => $user->email,
            'password' => 'wrong-password'
        ]);

        $response->assertStatus(401)
            ->assertJson(['message' => 'Invalid credentials']);
    }

    public function test_authenticated_user_can_logout(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/auth/logout');

        $response->assertStatus(200);
    }

    public function test_authenticated_user_can_get_profile(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/auth/me');

        $response->assertStatus(200)
            ->assertJson([
                'user' => [
                    'id' => $user->id,
                    'email' => $user->email
                ]
            ]);
    }
}
```

**Example: PropertyControllerTest.php**
```php
<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Property;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PropertyControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_list_published_properties(): void
    {
        Property::factory()->count(5)->create(['status' => 'published']);
        Property::factory()->count(2)->create(['status' => 'draft']);

        $response = $this->getJson('/api/properties');

        $response->assertStatus(200)
            ->assertJsonCount(5, 'data');
    }

    public function test_guest_can_view_property_details(): void
    {
        $property = Property::factory()->create(['status' => 'published']);

        $response = $this->getJson("/api/properties/{$property->id}");

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'id' => $property->id,
                    'title' => $property->title
                ]
            ]);
    }

    public function test_owner_can_create_property(): void
    {
        $owner = User::factory()->create(['role' => 'owner']);
        $token = $owner->createToken('test')->plainTextToken;

        $propertyData = [
            'title' => 'Test Property',
            'description' => 'A beautiful test property',
            'location' => 'Test City',
            'price_per_night' => 100,
            'bedrooms' => 2,
            'bathrooms' => 1,
            'guests' => 4,
            'property_type' => 'apartment'
        ];

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/properties', $propertyData);

        $response->assertStatus(201)
            ->assertJson([
                'data' => [
                    'title' => 'Test Property',
                    'user_id' => $owner->id
                ]
            ]);

        $this->assertDatabaseHas('properties', [
            'title' => 'Test Property',
            'user_id' => $owner->id
        ]);
    }

    public function test_owner_can_update_own_property(): void
    {
        $owner = User::factory()->create(['role' => 'owner']);
        $property = Property::factory()->create(['user_id' => $owner->id]);
        $token = $owner->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->putJson("/api/properties/{$property->id}", [
                'title' => 'Updated Title'
            ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('properties', [
            'id' => $property->id,
            'title' => 'Updated Title'
        ]);
    }

    public function test_owner_cannot_update_other_property(): void
    {
        $owner1 = User::factory()->create(['role' => 'owner']);
        $owner2 = User::factory()->create(['role' => 'owner']);
        $property = Property::factory()->create(['user_id' => $owner1->id]);
        $token = $owner2->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->putJson("/api/properties/{$property->id}", [
                'title' => 'Hacked Title'
            ]);

        $response->assertStatus(403);
    }

    public function test_owner_can_delete_own_property(): void
    {
        $owner = User::factory()->create(['role' => 'owner']);
        $property = Property::factory()->create(['user_id' => $owner->id]);
        $token = $owner->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->deleteJson("/api/properties/{$property->id}");

        $response->assertStatus(204);
        $this->assertSoftDeleted('properties', ['id' => $property->id]);
    }
}
```

**Example: BookingControllerTest.php**
```php
<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Property;
use App\Models\Booking;
use Illuminate\Foundation\Testing\RefreshDatabase;

class BookingControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_create_booking(): void
    {
        $guest = User::factory()->create(['role' => 'guest']);
        $property = Property::factory()->create(['status' => 'published']);
        $token = $guest->createToken('test')->plainTextToken;

        $bookingData = [
            'property_id' => $property->id,
            'check_in' => '2025-06-01',
            'check_out' => '2025-06-05',
            'guests' => 2
        ];

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/bookings', $bookingData);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => ['id', 'property_id', 'check_in', 'check_out', 'total_price']
            ]);

        $this->assertDatabaseHas('bookings', [
            'property_id' => $property->id,
            'user_id' => $guest->id
        ]);
    }

    public function test_cannot_book_overlapping_dates(): void
    {
        $guest = User::factory()->create(['role' => 'guest']);
        $property = Property::factory()->create();
        $token = $guest->createToken('test')->plainTextToken;

        // Existing booking
        Booking::factory()->create([
            'property_id' => $property->id,
            'check_in' => '2025-06-01',
            'check_out' => '2025-06-05',
            'status' => 'confirmed'
        ]);

        // Try overlapping booking
        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/bookings', [
                'property_id' => $property->id,
                'check_in' => '2025-06-03',
                'check_out' => '2025-06-07',
                'guests' => 2
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['dates']);
    }

    public function test_guest_can_cancel_own_booking(): void
    {
        $guest = User::factory()->create(['role' => 'guest']);
        $booking = Booking::factory()->create([
            'user_id' => $guest->id,
            'status' => 'pending'
        ]);
        $token = $guest->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->deleteJson("/api/bookings/{$booking->id}");

        $response->assertStatus(200);
        $this->assertDatabaseHas('bookings', [
            'id' => $booking->id,
            'status' => 'cancelled'
        ]);
    }
}
```

### Running Tests

```bash
cd Rental-Platform-main/backend

# Run all tests
php artisan test

# Run specific test suite
php artisan test --testsuite=Unit
php artisan test --testsuite=Feature

# Run with coverage
php artisan test --coverage

# Run specific test file
php artisan test tests/Feature/PropertyControllerTest.php

# Run specific test method
php artisan test --filter test_owner_can_create_property

# Parallel testing (faster)
php artisan test --parallel
```

---

## ⚛️ Frontend Testing (React + Jest + React Testing Library)

### Setup

**1. Install Testing Dependencies:**
```bash
cd Renthub
npm install --save-dev @testing-library/react @testing-library/jest-dom \
  @testing-library/user-event @testing-library/react-hooks \
  jest jest-environment-jsdom @types/jest
```

**2. Configure Jest (jest.config.js):**
```javascript
export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts'
  ],
  coverageThresholds: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};
```

**3. Setup Test Environment (src/setupTests.ts):**
```typescript
import '@testing-library/jest-dom';
import { server } from './__mocks__/server';

// Establish API mocking before all tests
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished
afterAll(() => server.close());
```

**4. Mock Service Worker for API Mocking (src/__mocks__/server.ts):**
```typescript
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/properties', () => {
    return HttpResponse.json({
      data: [
        { id: 1, title: 'Test Property 1', price_per_night: 100 },
        { id: 2, title: 'Test Property 2', price_per_night: 150 }
      ]
    });
  }),

  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({
      user: { id: 1, email: body.email, name: 'Test User' },
      token: 'mock-token-123'
    });
  })
];

export const server = setupServer(...handlers);
```

### Component Tests

**Example: PropertyCard.test.tsx**
```typescript
import { render, screen } from '@testing-library/react';
import { PropertyCard } from '@/components/PropertyCard';

describe('PropertyCard', () => {
  const mockProperty = {
    id: 1,
    title: 'Beautiful Apartment',
    location: 'New York',
    price_per_night: 100,
    rating: 4.5,
    image_url: 'https://example.com/image.jpg'
  };

  it('renders property information correctly', () => {
    render(<PropertyCard property={mockProperty} />);

    expect(screen.getByText('Beautiful Apartment')).toBeInTheDocument();
    expect(screen.getByText('New York')).toBeInTheDocument();
    expect(screen.getByText('$100')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  it('displays property image', () => {
    render(<PropertyCard property={mockProperty} />);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', mockProperty.image_url);
    expect(image).toHaveAttribute('alt', mockProperty.title);
  });

  it('calls onClick when card is clicked', () => {
    const handleClick = jest.fn();
    render(<PropertyCard property={mockProperty} onClick={handleClick} />);

    const card = screen.getByRole('article');
    card.click();

    expect(handleClick).toHaveBeenCalledWith(mockProperty.id);
  });
});
```

**Example: SearchForm.test.tsx**
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchForm } from '@/components/SearchForm';

describe('SearchForm', () => {
  it('renders all form fields', () => {
    render(<SearchForm onSearch={jest.fn()} />);

    expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/check-in/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/check-out/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/guests/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const handleSearch = jest.fn();
    render(<SearchForm onSearch={handleSearch} />);

    const submitButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/location is required/i)).toBeInTheDocument();
    });

    expect(handleSearch).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    const handleSearch = jest.fn();
    const user = userEvent.setup();
    render(<SearchForm onSearch={handleSearch} />);

    await user.type(screen.getByLabelText(/location/i), 'New York');
    await user.type(screen.getByLabelText(/check-in/i), '2025-06-01');
    await user.type(screen.getByLabelText(/check-out/i), '2025-06-05');
    await user.selectOptions(screen.getByLabelText(/guests/i), '2');

    await user.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(handleSearch).toHaveBeenCalledWith({
        location: 'New York',
        checkIn: '2025-06-01',
        checkOut: '2025-06-05',
        guests: 2
      });
    });
  });
});
```

### Hook Tests

**Example: useAuth.test.tsx**
```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useAuth } from '@/lib/authContext';
import { AuthProvider } from '@/lib/authContext';

describe('useAuth', () => {
  const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

  it('provides initial auth state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(true);
  });

  it('logs in user successfully', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await result.current.login({
      email: 'test@example.com',
      password: 'password123'
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual({
        id: 1,
        email: 'test@example.com',
        name: 'Test User'
      });
    });
  });

  it('logs out user successfully', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    // First login
    await result.current.login({
      email: 'test@example.com',
      password: 'password123'
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });

    // Then logout
    await result.current.logout();

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });
  });
});
```

### Integration Tests

**Example: PropertyList.integration.test.tsx**
```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropertyList } from '@/pages/PropertyList';

describe('PropertyList Integration', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false }
    }
  });

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  it('fetches and displays properties', async () => {
    render(<PropertyList />, { wrapper });

    // Initially shows loading
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for properties to load
    await waitFor(() => {
      expect(screen.getByText('Test Property 1')).toBeInTheDocument();
      expect(screen.getByText('Test Property 2')).toBeInTheDocument();
    });
  });

  it('displays error message on API failure', async () => {
    // Override API handler to return error
    server.use(
      http.get('/api/properties', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    render(<PropertyList />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText(/error loading properties/i)).toBeInTheDocument();
    });
  });
});
```

### Running Frontend Tests

```bash
cd Renthub

# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch

# Run specific test file
npm test PropertyCard.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="renders property"
```

---

## 🌐 E2E Testing (Optional - Playwright)

### Setup

```bash
cd Renthub
npm install --save-dev @playwright/test
npx playwright install
```

### E2E Test Example

**e2e/booking-flow.spec.ts:**
```typescript
import { test, expect } from '@playwright/test';

test.describe('Booking Flow', () => {
  test('user can complete booking', async ({ page }) => {
    // Login
    await page.goto('http://localhost:5173/login');
    await page.fill('[name=email]', 'test@example.com');
    await page.fill('[name=password]', 'Password123!');
    await page.click('button[type=submit]');

    // Search for property
    await page.goto('http://localhost:5173');
    await page.fill('[name=location]', 'New York');
    await page.click('button:has-text("Search")');

    // Select property
    await page.click('article:first-child');

    // Create booking
    await page.fill('[name=checkIn]', '2025-06-01');
    await page.fill('[name=checkOut]', '2025-06-05');
    await page.click('button:has-text("Book Now")');

    // Verify success
    await expect(page.locator('text=Booking Confirmed')).toBeVisible();
  });
});
```

---

## 📊 CI/CD Integration

### GitHub Actions

See `.github/workflows/backend-ci-cd.yml` and `.github/workflows/frontend-ci-cd.yml` for automated testing in CI/CD.

---

## 📈 Coverage Reports

### Backend Coverage

```bash
cd Rental-Platform-main/backend
php artisan test --coverage --coverage-html=coverage-report
# Open coverage-report/index.html in browser
```

### Frontend Coverage

```bash
cd Renthub
npm test -- --coverage
# Coverage report in coverage/lcov-report/index.html
```

---

## ✅ Testing Checklist

### Before Each PR

- [ ] All tests passing locally
- [ ] New features have tests
- [ ] Bug fixes have regression tests
- [ ] Coverage meets minimum threshold
- [ ] No skipped/pending tests
- [ ] Test names are descriptive
- [ ] Mock data is realistic

### Before Production Deployment

- [ ] Full test suite passes
- [ ] E2E tests pass (if implemented)
- [ ] Coverage reports reviewed
- [ ] Performance tests complete
- [ ] Security tests complete
- [ ] Load tests complete

---

**Last Updated:** October 23, 2025  
**Next Review:** After adding new features or fixing bugs
