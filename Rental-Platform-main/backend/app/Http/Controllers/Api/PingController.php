<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controller;

class PingController extends Controller
{
    /**
     * Health check endpoint.
     *
     * @OA\Get(
     *     path="/api/ping",
     *     summary="Health check",
     *     tags={"System"},
     *     @OA\Response(
     *         response=200,
     *         description="Service is up",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="status", type="string", example="ok"),
     *             @OA\Property(property="time", type="string", format="date-time")
     *         )
     *     )
     * )
     */
    public function index(): JsonResponse
    {
        return response()->json([
            'status' => 'ok',
            'time' => now()->toIso8601String(),
        ]);
    }
}
