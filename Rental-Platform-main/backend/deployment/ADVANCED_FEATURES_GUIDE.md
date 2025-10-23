# Advanced Features Implementation Guide

This guide covers implementation of optional post-launch features for the Rental Platform.

---

## 📚 Table of Contents

1. [API Documentation (OpenAPI/Swagger)](#1-api-documentation-openapi-swagger)
2. [Social Login (OAuth)](#2-social-login-oauth)
3. [Map Integration](#3-map-integration)
4. [Advanced Search Features](#4-advanced-search-features)

---

## 1. API Documentation (OpenAPI/Swagger)

**Estimated Time:** 3-4 hours  
**Complexity:** Low  
**Priority:** High (improves developer experience)

### Benefits

- Interactive API testing interface
- Auto-generated client SDKs
- Standardized API documentation
- Better third-party integration

### Implementation Steps

#### 1.1 Install Laravel Package

```bash
cd /workspaces/Rental-Platform/backend
composer require darkaonline/l5-swagger
php artisan vendor:publish --provider "L5Swagger\L5SwaggerServiceProvider"
```

#### 1.2 Configure L5-Swagger

Edit `config/l5-swagger.php`:

```php
'defaults' => [
    'routes' => [
        'api' => 'api/documentation',  // Swagger UI at /api/documentation
    ],
    'paths' => [
        'docs' => storage_path('api-docs'),
        'docs_json' => 'api-docs.json',
    ],
    'securityDefinitions' => [
        'sanctum' => [
            'type' => 'apiKey',
            'description' => 'Enter token in format: Bearer <token>',
            'name' => 'Authorization',
            'in' => 'header',
        ],
    ],
    'security' => [
        ['sanctum' => []],
    ],
],
```

#### 1.3 Add OpenAPI Annotations to Controllers

**Example: PropertyController**

```php
<?php

namespace App\Http\Controllers\Api;

use OpenApi\Annotations as OA;

/**
 * @OA\Info(
 *     title="Rental Platform API",
 *     version="1.0.0",
 *     description="REST API for Rental Platform - property listings, bookings, and reviews",
 *     @OA\Contact(
 *         email="api@rentalplatform.com"
 *     )
 * )
 * @OA\Server(
 *     url="http://localhost:8000",
 *     description="Development Server"
 * )
 * @OA\Server(
 *     url="https://api.rentalplatform.com",
 *     description="Production Server"
 * )
 */
class PropertyController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/properties",
     *     summary="List all properties",
     *     tags={"Properties"},
     *     @OA\Parameter(
     *         name="city",
     *         in="query",
     *         description="Filter by city",
     *         required=false,
     *         @OA\Schema(type="string")
     *     ),
     *     @OA\Parameter(
     *         name="min_price",
     *         in="query",
     *         description="Minimum price per night",
     *         required=false,
     *         @OA\Schema(type="number", format="float")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Successful operation",
     *         @OA\JsonContent(
     *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Property"))
     *         )
     *     )
     * )
     */
    public function index(Request $request) { /* ... */ }

    /**
     * @OA\Post(
     *     path="/api/properties",
     *     summary="Create a new property",
     *     tags={"Properties"},
     *     security={{"sanctum":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/PropertyRequest")
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Property created",
     *         @OA\JsonContent(ref="#/components/schemas/Property")
     *     )
     * )
     */
    public function store(Request $request) { /* ... */ }
}
```

#### 1.4 Define Schemas

Create `app/Http/Controllers/Api/Schemas.php`:

```php
<?php

/**
 * @OA\Schema(
 *     schema="Property",
 *     type="object",
 *     required={"id", "title", "city", "price_per_night"},
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="title", type="string", example="Beautiful Apartment"),
 *     @OA\Property(property="description", type="string"),
 *     @OA\Property(property="city", type="string", example="Bucharest"),
 *     @OA\Property(property="price_per_night", type="number", format="float", example=50.00),
 *     @OA\Property(property="images", type="array", @OA\Items(ref="#/components/schemas/PropertyImage"))
 * )
 *
 * @OA\Schema(
 *     schema="PropertyImage",
 *     type="object",
 *     @OA\Property(property="id", type="integer"),
 *     @OA\Property(property="url", type="string", example="http://localhost/storage/properties/1/2025/10/img_123.jpg"),
 *     @OA\Property(property="is_primary", type="boolean")
 * )
 */
class Schemas {}
```

#### 1.5 Generate Documentation

```bash
php artisan l5-swagger:generate
```

#### 1.6 Access Swagger UI

Visit: `http://localhost:8000/api/documentation`

### Testing

- [ ] All endpoints documented
- [ ] Authentication works in Swagger UI
- [ ] Request/response examples accurate
- [ ] Try it out feature works

---

## 2. Social Login (OAuth)

**Estimated Time:** 4-6 hours  
**Complexity:** Medium  
**Priority:** High (improves user acquisition)

### Benefits

- Faster user onboarding
- Reduced password fatigue
- Higher conversion rates
- Trust signals from major platforms

### Implementation Steps

#### 2.1 Install Laravel Socialite

```bash
composer require laravel/socialite
```

#### 2.2 Configure OAuth Providers

Add to `config/services.php`:

```php
'google' => [
    'client_id' => env('GOOGLE_CLIENT_ID'),
    'client_secret' => env('GOOGLE_CLIENT_SECRET'),
    'redirect' => env('APP_URL') . '/api/auth/google/callback',
],

'facebook' => [
    'client_id' => env('FACEBOOK_CLIENT_ID'),
    'client_secret' => env('FACEBOOK_CLIENT_SECRET'),
    'redirect' => env('APP_URL') . '/api/auth/facebook/callback',
],

'github' => [
    'client_id' => env('GITHUB_CLIENT_ID'),
    'client_secret' => env('GITHUB_CLIENT_SECRET'),
    'redirect' => env('APP_URL') . '/api/auth/github/callback',
],
```

Update `.env`:

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

FACEBOOK_CLIENT_ID=your-facebook-app-id
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret

GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

#### 2.3 Create OAuth Controller

```bash
php artisan make:controller Api/SocialAuthController
```

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    public function redirect(string $provider)
    {
        $this->validateProvider($provider);
        
        return response()->json([
            'url' => Socialite::driver($provider)->stateless()->redirect()->getTargetUrl(),
        ]);
    }

    public function callback(string $provider, Request $request)
    {
        $this->validateProvider($provider);

        try {
            $socialUser = Socialite::driver($provider)->stateless()->user();
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to authenticate with ' . $provider], 401);
        }

        // Find or create user
        $user = User::where('email', $socialUser->getEmail())->first();

        if (!$user) {
            $user = User::create([
                'name' => $socialUser->getName(),
                'email' => $socialUser->getEmail(),
                'password' => Hash::make(Str::random(32)), // Random password
                'profile_photo' => $socialUser->getAvatar(),
                'email_verified_at' => now(),
                'role' => 'guest',
                'is_verified' => true,
            ]);
        }

        // Create token
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
            'token' => $token,
        ]);
    }

    private function validateProvider(string $provider)
    {
        $allowed = ['google', 'facebook', 'github'];
        if (!in_array($provider, $allowed)) {
            abort(404);
        }
    }
}
```

#### 2.4 Add Routes

In `routes/api.php`:

```php
Route::prefix('auth/{provider}')->group(function () {
    Route::get('redirect', [SocialAuthController::class, 'redirect']);
    Route::get('callback', [SocialAuthController::class, 'callback']);
});
```

#### 2.5 Frontend Integration (React)

Create `frontend/src/services/socialAuth.service.ts`:

```typescript
import api from './api'

export const socialAuthService = {
  async getRedirectUrl(provider: 'google' | 'facebook' | 'github'): Promise<string> {
    const response = await api.get<{ url: string }>(`/auth/${provider}/redirect`)
    return response.data.url
  },

  async handleCallback(provider: string, code: string): Promise<{ user: User; token: string }> {
    const response = await api.get(`/auth/${provider}/callback?code=${code}`)
    return response.data
  },
}
```

Create `frontend/src/components/SocialLogin.tsx`:

```tsx
import { useState } from 'react'
import { socialAuthService } from '../services/socialAuth.service'

const SocialLogin = () => {
  const [loading, setLoading] = useState<string | null>(null)

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'github') => {
    try {
      setLoading(provider)
      const redirectUrl = await socialAuthService.getRedirectUrl(provider)
      window.location.href = redirectUrl
    } catch (error) {
      console.error('Social login failed:', error)
      alert('Failed to initiate social login')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-3">
      <button
        onClick={() => handleSocialLogin('google')}
        disabled={loading !== null}
        className="w-full btn-outline flex items-center justify-center gap-2"
      >
        <GoogleIcon />
        {loading === 'google' ? 'Redirecting...' : 'Continue with Google'}
      </button>

      <button
        onClick={() => handleSocialLogin('facebook')}
        disabled={loading !== null}
        className="w-full btn-outline flex items-center justify-center gap-2"
      >
        <FacebookIcon />
        {loading === 'facebook' ? 'Redirecting...' : 'Continue with Facebook'}
      </button>

      <button
        onClick={() => handleSocialLogin('github')}
        disabled={loading !== null}
        className="w-full btn-outline flex items-center justify-center gap-2"
      >
        <GithubIcon />
        {loading === 'github' ? 'Redirecting...' : 'Continue with GitHub'}
      </button>
    </div>
  )
}

export default SocialLogin
```

Add callback page `frontend/src/pages/AuthCallback.tsx`:

```tsx
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { socialAuthService } from '../services/socialAuth.service'

const AuthCallback = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const handleCallback = async () => {
      const provider = window.location.pathname.split('/')[2] // e.g., /auth/google/callback
      const code = searchParams.get('code')

      if (!code) {
        navigate('/login?error=oauth_failed')
        return
      }

      try {
        const { user, token } = await socialAuthService.handleCallback(provider, code)
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        navigate('/dashboard')
      } catch (error) {
        console.error('OAuth callback error:', error)
        navigate('/login?error=oauth_failed')
      }
    }

    handleCallback()
  }, [searchParams, navigate])

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Completing login...</p>
    </div>
  )
}

export default AuthCallback
```

#### 2.6 Setup OAuth Apps

**Google:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create project → Enable Google+ API
3. Create OAuth 2.0 credentials
4. Add redirect URI: `http://localhost:8000/api/auth/google/callback`

**Facebook:**
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create app → Add Facebook Login product
3. Add redirect URI: `http://localhost:8000/api/auth/facebook/callback`

**GitHub:**
1. Go to GitHub Settings → Developer Settings → OAuth Apps
2. Register new application
3. Add redirect URI: `http://localhost:8000/api/auth/github/callback`

### Testing

- [ ] Redirect URL generation works
- [ ] OAuth callback handles successful login
- [ ] User account created/matched by email
- [ ] Token generated and returned
- [ ] Profile photo imported
- [ ] Error handling for failed OAuth

---

## 3. Map Integration

**Estimated Time:** 5-7 hours  
**Complexity:** Medium  
**Priority:** Medium (improves property discovery)

### Benefits

- Visual property search
- Neighborhood exploration
- Distance/location filtering
- Enhanced user experience

### Implementation Options

1. **Google Maps** (most popular, paid after free tier)
2. **Mapbox** (modern, customizable, generous free tier)
3. **Leaflet + OpenStreetMap** (free, open-source)

**Recommendation:** Mapbox (best balance of features and cost)

### Implementation Steps

#### 3.1 Install Mapbox

```bash
cd /workspaces/Rental-Platform/frontend
npm install mapbox-gl react-map-gl
```

#### 3.2 Add Mapbox Token to Frontend

Update `frontend/.env`:

```env
VITE_MAPBOX_TOKEN=your-mapbox-access-token
```

Get token from: [Mapbox Account](https://account.mapbox.com/)

#### 3.3 Create Map Component

Create `frontend/src/components/map/PropertyMap.tsx`:

```tsx
import { useEffect, useRef, useState } from 'react'
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Property } from '../../types'

interface Props {
  properties: Property[]
  center?: { latitude: number; longitude: number }
  zoom?: number
  onPropertyClick?: (property: Property) => void
}

const PropertyMap = ({ properties, center, zoom = 12, onPropertyClick }: Props) => {
  const [viewState, setViewState] = useState({
    longitude: center?.longitude || 26.1025, // Bucharest default
    latitude: center?.latitude || 44.4268,
    zoom,
  })
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)

  return (
    <div className="w-full h-full">
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        style={{ width: '100%', height: '100%' }}
      >
        <NavigationControl position="top-right" />

        {properties.map((property) => (
          property.latitude && property.longitude && (
            <Marker
              key={property.id}
              longitude={property.longitude}
              latitude={property.latitude}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation()
                setSelectedProperty(property)
              }}
            >
              <div className="bg-primary-600 text-white px-3 py-1 rounded-full font-semibold cursor-pointer hover:bg-primary-700 transition shadow-lg">
                ${property.price_per_night}
              </div>
            </Marker>
          )
        ))}

        {selectedProperty && (
          <Popup
            longitude={selectedProperty.longitude!}
            latitude={selectedProperty.latitude!}
            anchor="top"
            onClose={() => setSelectedProperty(null)}
          >
            <div className="p-2 max-w-xs">
              {selectedProperty.images?.[0] && (
                <img
                  src={selectedProperty.images[0].url}
                  alt={selectedProperty.title}
                  className="w-full h-32 object-cover rounded mb-2"
                />
              )}
              <h3 className="font-semibold text-sm">{selectedProperty.title}</h3>
              <p className="text-xs text-gray-600 mb-1">{selectedProperty.city}</p>
              <p className="font-bold text-primary-600">${selectedProperty.price_per_night}/night</p>
              <button
                onClick={() => onPropertyClick?.(selectedProperty)}
                className="mt-2 w-full btn-primary text-xs py-1"
              >
                View Details
              </button>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  )
}

export default PropertyMap
```

#### 3.4 Add Geocoding (Coordinates from Address)

Backend: Add migration to ensure latitude/longitude columns exist:

```bash
php artisan make:migration add_coordinates_to_properties_table
```

```php
public function up()
{
    Schema::table('properties', function (Blueprint $table) {
        $table->decimal('latitude', 10, 7)->nullable()->after('postal_code');
        $table->decimal('longitude', 10, 7)->nullable()->after('latitude');
    });
}
```

Install geocoding package:

```bash
composer require spatie/geocoder
```

Create geocoding service:

```php
<?php

namespace App\Services;

use Spatie\Geocoder\Geocoder;

class GeocodeService
{
    public function geocode(string $address): ?array
    {
        try {
            $client = new \GuzzleHttp\Client();
            $geocoder = new Geocoder($client);
            $geocoder->setApiKey(config('services.google.maps_api_key'));
            
            $result = $geocoder->getCoordinatesForAddress($address);
            
            return [
                'latitude' => $result['lat'],
                'longitude' => $result['lng'],
            ];
        } catch (\Exception $e) {
            \Log::error('Geocoding failed: ' . $e->getMessage());
            return null;
        }
    }
}
```

Update `PropertyController::store()` and `update()`:

```php
use App\Services\GeocodeService;

public function store(Request $request, GeocodeService $geocoder)
{
    // ... existing validation ...

    $property = new Property($data);
    
    // Geocode address
    $fullAddress = implode(', ', [
        $data['address'],
        $data['city'],
        $data['country'],
    ]);
    
    $coordinates = $geocoder->geocode($fullAddress);
    if ($coordinates) {
        $property->latitude = $coordinates['latitude'];
        $property->longitude = $coordinates['longitude'];
    }
    
    $property->owner_id = $request->user()->id;
    $property->status = 'draft';
    $property->save();

    return new PropertyResource($property->fresh(['images','amenities','owner']));
}
```

#### 3.5 Add Map View to Property List Page

Update `frontend/src/pages/PropertyListPage.tsx`:

```tsx
import { useState } from 'react'
import PropertyMap from '../components/map/PropertyMap'

const PropertyListPage = () => {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  // ... existing state and logic ...

  return (
    <div className="container mx-auto px-4 py-8">
      {/* View toggle */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Find Your Perfect Rental</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded ${viewMode === 'list' ? 'btn-primary' : 'btn-outline'}`}
          >
            List View
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 rounded ${viewMode === 'map' ? 'btn-primary' : 'btn-outline'}`}
          >
            Map View
          </button>
        </div>
      </div>

      {/* Filters */}
      {/* ... existing filters ... */}

      {/* Content */}
      {viewMode === 'list' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* ... existing property cards ... */}
        </div>
      ) : (
        <div className="h-[600px]">
          <PropertyMap
            properties={properties}
            onPropertyClick={(property) => navigate(`/properties/${property.id}`)}
          />
        </div>
      )}
    </div>
  )
}
```

### Testing

- [ ] Map displays with correct center/zoom
- [ ] Property markers appear at correct coordinates
- [ ] Marker click shows popup with property info
- [ ] Popup "View Details" navigates correctly
- [ ] Geocoding works for new properties
- [ ] Map navigation (pan, zoom) works smoothly

---

## 4. Advanced Search Features

**Estimated Time:** 6-8 hours  
**Complexity:** High  
**Priority:** High (core feature improvement)

### Features to Implement

1. Full-text search (property title, description)
2. Autocomplete for location
3. Date-based availability search
4. Radius/distance search
5. Amenity filtering
6. Save searches / search history
7. Search result sorting

### Implementation Steps

#### 4.1 Install Laravel Scout + Meilisearch

```bash
composer require laravel/scout
composer require meilisearch/meilisearch-php http-interop/http-factory-guzzle
php artisan vendor:publish --provider="Laravel\Scout\ScoutServiceProvider"
```

Update `.env`:

```env
SCOUT_DRIVER=meilisearch
MEILISEARCH_HOST=http://127.0.0.1:7700
MEILISEARCH_KEY=
```

Install Meilisearch (via Docker):

```bash
docker run -d -p 7700:7700 \
  -e MEILI_NO_ANALYTICS=true \
  --name meilisearch \
  getmeili/meilisearch:latest
```

#### 4.2 Make Property Model Searchable

Update `app/Models/Property.php`:

```php
use Laravel\Scout\Searchable;

class Property extends Model
{
    use Searchable;

    public function toSearchableArray()
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'city' => $this->city,
            'country' => $this->country,
            'property_type' => $this->property_type,
            'rental_type' => $this->rental_type,
            'price_per_night' => $this->price_per_night,
            'price_per_month' => $this->price_per_month,
            'bedrooms' => $this->bedrooms,
            'bathrooms' => $this->bathrooms,
            'max_guests' => $this->max_guests,
            'amenities' => $this->amenities->pluck('name')->toArray(),
            '_geo' => [
                'lat' => $this->latitude,
                'lng' => $this->longitude,
            ],
        ];
    }

    public function shouldBeSearchable()
    {
        return $this->status === 'published';
    }
}
```

#### 4.3 Index Existing Properties

```bash
php artisan scout:import "App\Models\Property"
```

#### 4.4 Update PropertyController with Advanced Search

```php
public function index(Request $request)
{
    $query = $request->string('q')->toString();
    
    if ($query) {
        // Full-text search
        $properties = Property::search($query)
            ->query(function ($builder) {
                $builder->with(['images', 'amenities', 'owner'])
                        ->where('status', 'published');
            });
    } else {
        $properties = Property::query()
            ->with(['images', 'amenities', 'owner'])
            ->where('status', 'published');
    }

    // Apply filters
    if ($city = $request->string('city')->toString()) {
        $properties->where('city', 'like', "%$city%");
    }
    
    // Date availability filter
    if ($checkIn = $request->string('check_in')->toString()) {
        $checkOut = $request->string('check_out')->toString();
        
        $properties->whereDoesntHave('bookings', function ($q) use ($checkIn, $checkOut) {
            $q->where('status', '!=', 'cancelled')
              ->where(function ($q2) use ($checkIn, $checkOut) {
                  $q2->whereBetween('check_in', [$checkIn, $checkOut])
                     ->orWhereBetween('check_out', [$checkIn, $checkOut])
                     ->orWhere(function ($q3) use ($checkIn, $checkOut) {
                         $q3->where('check_in', '<=', $checkIn)
                            ->where('check_out', '>=', $checkOut);
                     });
              });
        });
    }
    
    // Amenities filter
    if ($amenityIds = $request->input('amenities', [])) {
        $properties->whereHas('amenities', function ($q) use ($amenityIds) {
            $q->whereIn('amenities.id', $amenityIds);
        }, '=', count($amenityIds));
    }
    
    // Sorting
    $sortBy = $request->string('sort_by')->toString() ?: 'created_at';
    $sortOrder = $request->string('sort_order')->toString() ?: 'desc';
    
    if (in_array($sortBy, ['price_per_night', 'created_at', 'bedrooms'])) {
        $properties->orderBy($sortBy, $sortOrder);
    }
    
    // Radius search (if coordinates provided)
    if ($lat = $request->float('latitude')) {
        $lng = $request->float('longitude');
        $radius = $request->float('radius', 10); // km
        
        $properties->selectRaw("
            *, (
                6371 * acos(
                    cos(radians(?)) * cos(radians(latitude)) *
                    cos(radians(longitude) - radians(?)) +
                    sin(radians(?)) * sin(radians(latitude))
                )
            ) AS distance
        ", [$lat, $lng, $lat])
        ->having('distance', '<', $radius)
        ->orderBy('distance');
    }

    return PropertyResource::collection($properties->paginate(15));
}
```

#### 4.5 Frontend: Autocomplete Component

Create `frontend/src/components/search/LocationAutocomplete.tsx`:

```tsx
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'

interface Suggestion {
  place_name: string
  center: [number, number] // [lng, lat]
}

interface Props {
  value: string
  onChange: (value: string, coordinates?: { lat: number; lng: number }) => void
  placeholder?: string
}

const LocationAutocomplete = ({ value, onChange, placeholder }: Props) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchSuggestions = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([])
      return
    }

    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`,
        {
          params: {
            access_token: import.meta.env.VITE_MAPBOX_TOKEN,
            types: 'place,locality,neighborhood',
            limit: 5,
          },
        }
      )
      setSuggestions(response.data.features)
      setShowSuggestions(true)
    } catch (error) {
      console.error('Autocomplete error:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    fetchSuggestions(newValue)
  }

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    onChange(suggestion.place_name, {
      lng: suggestion.center[0],
      lat: suggestion.center[1],
    })
    setShowSuggestions(false)
  }

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        placeholder={placeholder || 'Enter location...'}
        className="input-field"
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSelectSuggestion(suggestion)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {suggestion.place_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default LocationAutocomplete
```

#### 4.6 Enhanced Search Page

Update `frontend/src/pages/PropertyListPage.tsx`:

```tsx
import LocationAutocomplete from '../components/search/LocationAutocomplete'

const [filters, setFilters] = useState({
  q: '',
  city: '',
  latitude: null as number | null,
  longitude: null as number | null,
  radius: 10,
  check_in: '',
  check_out: '',
  min_price: '',
  max_price: '',
  bedrooms: '',
  amenities: [] as number[],
  sort_by: 'created_at',
  sort_order: 'desc',
})

// ... in JSX:

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
  {/* Full-text search */}
  <div className="lg:col-span-2">
    <input
      type="text"
      placeholder="Search properties..."
      value={filters.q}
      onChange={(e) => setFilters({ ...filters, q: e.target.value })}
      className="input-field"
    />
  </div>

  {/* Location with autocomplete */}
  <div>
    <LocationAutocomplete
      value={filters.city}
      onChange={(value, coords) =>
        setFilters({
          ...filters,
          city: value,
          latitude: coords?.lat || null,
          longitude: coords?.lng || null,
        })
      }
      placeholder="City or neighborhood"
    />
  </div>

  {/* Sort */}
  <div>
    <select
      value={filters.sort_by}
      onChange={(e) => setFilters({ ...filters, sort_by: e.target.value })}
      className="input-field"
    >
      <option value="created_at">Newest First</option>
      <option value="price_per_night">Price: Low to High</option>
      <option value="price_per_night_desc">Price: High to Low</option>
      <option value="bedrooms">Bedrooms</option>
    </select>
  </div>

  {/* Date range */}
  <div>
    <input
      type="date"
      value={filters.check_in}
      onChange={(e) => setFilters({ ...filters, check_in: e.target.value })}
      className="input-field"
      placeholder="Check-in"
    />
  </div>
  <div>
    <input
      type="date"
      value={filters.check_out}
      onChange={(e) => setFilters({ ...filters, check_out: e.target.value })}
      className="input-field"
      placeholder="Check-out"
    />
  </div>

  {/* ... other filters ... */}
</div>
```

### Testing

- [ ] Full-text search returns relevant results
- [ ] Autocomplete suggests locations
- [ ] Date filter excludes booked properties
- [ ] Amenity filter requires all selected amenities
- [ ] Radius search works with coordinates
- [ ] Sorting options work correctly
- [ ] Search is performant (<500ms response)

---

## Implementation Priority

### Phase 1 (MVP+) - 10-12 hours

1. **API Documentation** (3-4h) - Improves developer experience
2. **Social Login** (4-6h) - Boosts user acquisition
3. **Basic Map Integration** (3-4h) - Map view for properties

### Phase 2 (Growth) - 8-10 hours

4. **Advanced Search** (6-8h) - Full-text + filters
5. **Map Enhancements** (2-3h) - Radius search, clustering

### Phase 3 (Polish) - 4-6 hours

6. **Search Optimizations** (2-3h) - Caching, performance
7. **Additional OAuth Providers** (1-2h) - LinkedIn, Apple
8. **Save Searches** (1-2h) - User preferences

---

## Resources

### Documentation

- [Laravel Socialite](https://laravel.com/docs/socialite)
- [Laravel Scout](https://laravel.com/docs/scout)
- [L5-Swagger](https://github.com/DarkaOnLine/L5-Swagger)
- [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/)
- [React Map GL](https://visgl.github.io/react-map-gl/)
- [Meilisearch](https://www.meilisearch.com/docs)

### APIs & Services

- [Google OAuth Setup](https://console.cloud.google.com/)
- [Facebook Login Setup](https://developers.facebook.com/)
- [Mapbox Account](https://account.mapbox.com/)
- [Meilisearch Cloud](https://www.meilisearch.com/cloud)

---

## Cost Estimates (Production)

| Service | Free Tier | Paid Tier | Est. Monthly Cost |
|---------|-----------|-----------|-------------------|
| Mapbox | 50K loads/month | $5/1000 loads | $0-50 |
| Meilisearch | Self-hosted free | Cloud $29/month | $0-29 |
| Google OAuth | Free | Free | $0 |
| Facebook OAuth | Free | Free | $0 |

**Total estimated monthly cost:** $0-79 (depends on traffic)

---

## Success Metrics

### API Documentation
- Onboarding time for new developers reduced by 50%
- API support tickets reduced

### Social Login
- Registration conversion rate increase by 30%
- Time-to-first-booking reduced

### Map Integration
- User engagement time increased by 40%
- Bounce rate on property list page reduced

### Advanced Search
- Search-to-booking conversion increased by 25%
- User satisfaction scores improved
- Time to find property reduced

---

**Status:** Ready for implementation post-launch  
**Next Steps:** Prioritize based on user feedback and analytics
