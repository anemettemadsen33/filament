<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PropertyController;
use App\Http\Controllers\Api\PropertyImageController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\PingController;
use App\Http\Controllers\Api\OAuthController;
use App\Http\Controllers\Api\SearchController;
use App\Http\Controllers\Api\LocalizationController;
use App\Http\Controllers\Api\SettingsController;
use App\Models\Invoice;
use App\Models\Setting;

Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('me', [AuthController::class, 'me']);
        Route::post('logout', [AuthController::class, 'logout']);
        Route::put('profile', [AuthController::class, 'updateProfile']);
        Route::put('password', [AuthController::class, 'updatePassword']);
    });
});

// Public endpoints
Route::get('ping', [PingController::class, 'index']);

// Settings endpoints
Route::prefix('settings')->group(function () {
    Route::get('/', [SettingsController::class, 'index']);
    Route::get('company', [SettingsController::class, 'company']);
    Route::get('social-media', [SettingsController::class, 'socialMedia']);
    Route::get('google-maps', [SettingsController::class, 'googleMaps']);
});

// Localization
Route::get('localization/info', [LocalizationController::class, 'info']);
Route::post('localization/set-locale', [LocalizationController::class, 'setLocale']);
Route::post('localization/set-currency', [LocalizationController::class, 'setCurrency']);

// Social login (OAuth)
Route::get('oauth/{provider}/redirect', [OAuthController::class, 'redirect']);
Route::get('oauth/{provider}/callback', [OAuthController::class, 'callback']);
// Advanced search
Route::get('search', [SearchController::class, 'search']);
Route::get('properties', [PropertyController::class, 'index']);
Route::get('properties/{property}', [PropertyController::class, 'show']);

// Protected endpoints
Route::middleware('auth:sanctum')->group(function () {
    Route::post('properties', [PropertyController::class, 'store']);
    Route::put('properties/{property}', [PropertyController::class, 'update']);
    Route::delete('properties/{property}', [PropertyController::class, 'destroy']);

    // Property images
    Route::get('properties/{property}/images', [PropertyImageController::class, 'index']);
    Route::post('properties/{property}/images', [PropertyImageController::class, 'store']);
    Route::delete('properties/{property}/images/{image}', [PropertyImageController::class, 'destroy']);
    Route::patch('properties/{property}/images/{image}/primary', [PropertyImageController::class, 'setPrimary']);
    Route::patch('properties/{property}/images/reorder', [PropertyImageController::class, 'reorder']);

    Route::get('bookings', [BookingController::class, 'index']);
    Route::get('bookings/{booking}', [BookingController::class, 'show']);
    Route::post('bookings', [BookingController::class, 'store']);
    Route::put('bookings/{booking}', [BookingController::class, 'update']);
    Route::delete('bookings/{booking}', [BookingController::class, 'destroy']);

    Route::get('reviews', [ReviewController::class, 'index']);
    Route::get('reviews/{review}', [ReviewController::class, 'show']);
    Route::post('reviews', [ReviewController::class, 'store']);
    Route::put('reviews/{review}', [ReviewController::class, 'update']);
    Route::delete('reviews/{review}', [ReviewController::class, 'destroy']);
    Route::post('reviews/{review}/respond', [ReviewController::class, 'respond']);

    // Invoices: view invoice (HTML) for the authenticated user (guest/owner/admin)
    Route::get('invoices/{invoice}', function (Invoice $invoice) {
        $invoice->load(['booking.property']);
        $user = request()->user();
        if (!($user->isAdmin() || $user->id === $invoice->booking->guest_id || $user->id === $invoice->booking->property->owner_id)) {
            abort(403);
        }
        return response()->view('invoices.invoice', ['invoice' => $invoice]);
    });
});

// Frontend integration API endpoints - Public settings
Route::prefix('settings')->group(function () {
    Route::get('/public', function () {
        // Only return non-sensitive settings for frontend
        $publicSettings = [
            'website_name' => Setting::get('website_name'),
            'website_description' => Setting::get('website_description'),
            'frontend_domain' => Setting::get('frontend_domain'),
            'contact_email' => Setting::get('contact_email'),
            'contact_phone' => Setting::get('contact_phone'),
            'contact_address' => Setting::get('contact_address'),
            'facebook_url' => Setting::get('facebook_url'),
            'twitter_url' => Setting::get('twitter_url'),
            'instagram_url' => Setting::get('instagram_url'),
            'linkedin_url' => Setting::get('linkedin_url'),
            'maintenance_mode' => Setting::get('maintenance_mode', false),
            'maintenance_message' => Setting::get('maintenance_message'),
        ];
        
        return response()->json([
            'success' => true,
            'data' => $publicSettings
        ]);
    });
});

// Test endpoint for CORS
Route::get('/test-cors', function () {
    return response()->json([
        'success' => true,
        'message' => 'CORS is working correctly!',
        'timestamp' => now(),
        'cors_origins' => Setting::get('cors_origins', '*'),
        'frontend_domain' => Setting::get('frontend_domain')
    ]);
});
