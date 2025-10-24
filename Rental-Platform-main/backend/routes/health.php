<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\HealthController;

/*
|--------------------------------------------------------------------------
| Health Check Routes
|--------------------------------------------------------------------------
|
| These routes are used for monitoring and health checks.
| They should be accessible without authentication.
|
*/

Route::prefix('health')->group(function () {
    // Basic ping endpoint
    Route::get('/ping', [HealthController::class, 'ping'])->name('health.ping');
    
    // Comprehensive health check
    Route::get('/', [HealthController::class, 'health'])->name('health');
    
    // Kubernetes probes
    Route::get('/ready', [HealthController::class, 'ready'])->name('health.ready');
    Route::get('/live', [HealthController::class, 'live'])->name('health.live');
});

/*
|--------------------------------------------------------------------------
| Example API Routes
|--------------------------------------------------------------------------
| 
| Add your API routes here following the pattern:
| Route::prefix('v1')->middleware('auth:sanctum')->group(function () {
|     Route::apiResource('properties', PropertyController::class);
| });
|
*/
