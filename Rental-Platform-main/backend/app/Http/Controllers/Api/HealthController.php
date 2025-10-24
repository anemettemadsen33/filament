<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class HealthController extends Controller
{
    /**
     * Basic health check endpoint.
     * Returns 200 OK if application is running.
     */
    public function ping(): JsonResponse
    {
        return response()->json([
            'status' => 'ok',
            'timestamp' => now()->toIso8601String(),
        ]);
    }

    /**
     * Comprehensive health check endpoint.
     * Checks database, cache, and other critical services.
     */
    public function health(): JsonResponse
    {
        $checks = [];
        $overallStatus = 'healthy';

        // Check database connection
        try {
            DB::connection()->getPdo();
            $checks['database'] = [
                'status' => 'healthy',
                'message' => 'Database connection successful',
            ];
        } catch (\Exception $e) {
            $checks['database'] = [
                'status' => 'unhealthy',
                'message' => 'Database connection failed: ' . $e->getMessage(),
            ];
            $overallStatus = 'unhealthy';
        }

        // Check cache connection
        try {
            Cache::put('health_check', 'test', 10);
            $value = Cache::get('health_check');
            
            if ($value === 'test') {
                $checks['cache'] = [
                    'status' => 'healthy',
                    'message' => 'Cache working correctly',
                ];
            } else {
                throw new \Exception('Cache read/write mismatch');
            }
        } catch (\Exception $e) {
            $checks['cache'] = [
                'status' => 'unhealthy',
                'message' => 'Cache connection failed: ' . $e->getMessage(),
            ];
            $overallStatus = 'unhealthy';
        }

        // Check queue (if using queues)
        try {
            // Simple check - verify queue connection exists
            $queueConnection = config('queue.default');
            $checks['queue'] = [
                'status' => 'healthy',
                'message' => "Queue connection '$queueConnection' configured",
            ];
        } catch (\Exception $e) {
            $checks['queue'] = [
                'status' => 'degraded',
                'message' => 'Queue check failed: ' . $e->getMessage(),
            ];
        }

        // Check storage (writable)
        try {
            $testFile = storage_path('framework/health_check.tmp');
            file_put_contents($testFile, 'test');
            unlink($testFile);
            
            $checks['storage'] = [
                'status' => 'healthy',
                'message' => 'Storage is writable',
            ];
        } catch (\Exception $e) {
            $checks['storage'] = [
                'status' => 'unhealthy',
                'message' => 'Storage not writable: ' . $e->getMessage(),
            ];
            $overallStatus = 'unhealthy';
        }

        // Application info
        $appInfo = [
            'name' => config('app.name'),
            'env' => config('app.env'),
            'version' => $this->getAppVersion(),
            'php_version' => PHP_VERSION,
            'laravel_version' => app()->version(),
        ];

        $statusCode = $overallStatus === 'healthy' ? 200 : 503;

        return response()->json([
            'status' => $overallStatus,
            'timestamp' => now()->toIso8601String(),
            'application' => $appInfo,
            'checks' => $checks,
        ], $statusCode);
    }

    /**
     * Get application version from file or git.
     */
    private function getAppVersion(): string
    {
        // Try to read from version file
        $versionFile = base_path('version.txt');
        if (file_exists($versionFile)) {
            return trim(file_get_contents($versionFile));
        }

        // Try to get from git
        try {
            $version = trim(shell_exec('git describe --tags --always 2>/dev/null') ?? 'unknown');
            return $version !== '' ? $version : 'unknown';
        } catch (\Exception $e) {
            return 'unknown';
        }
    }

    /**
     * Ready endpoint - for Kubernetes readiness probes.
     * Returns 200 if app is ready to serve traffic.
     */
    public function ready(): JsonResponse
    {
        // Check if critical services are available
        try {
            DB::connection()->getPdo();
            
            return response()->json([
                'status' => 'ready',
                'timestamp' => now()->toIso8601String(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'not_ready',
                'message' => 'Database not available',
                'timestamp' => now()->toIso8601String(),
            ], 503);
        }
    }

    /**
     * Live endpoint - for Kubernetes liveness probes.
     * Returns 200 if app is alive (doesn't check dependencies).
     */
    public function live(): JsonResponse
    {
        return response()->json([
            'status' => 'alive',
            'timestamp' => now()->toIso8601String(),
        ]);
    }
}
