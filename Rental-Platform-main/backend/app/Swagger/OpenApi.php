<?php

namespace App\Swagger;

/**
 * @OA\Info(
 *     version="1.0.0",
 *     title="Rental Platform API",
 *     description="OpenAPI documentation for the Rental Platform backend. Auth uses Laravel Sanctum personal access tokens (Bearer).",
 * )
 *
 * @OA\Server(
 *     url="/",
 *     description="Current server (relative)"
 * )
 *
 * @OA\SecurityScheme(
 *     securityScheme="sanctum",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT",
 *     description="Use Authorization: Bearer <token> (Laravel Sanctum token)"
 * )
 */
class OpenApi
{
    // This file holds global OpenAPI metadata and security schemes.
}
