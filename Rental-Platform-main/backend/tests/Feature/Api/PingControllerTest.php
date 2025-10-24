<?php

namespace Tests\Feature\Api;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PingControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that the ping endpoint returns a successful response.
     */
    public function test_ping_endpoint_returns_success(): void
    {
        $response = $this->getJson('/api/ping');

        $response->assertStatus(200)
                 ->assertJson([
                     'status' => 'ok',
                 ]);
    }

    /**
     * Test that the ping endpoint includes timestamp.
     */
    public function test_ping_endpoint_includes_timestamp(): void
    {
        $response = $this->getJson('/api/ping');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'status',
                     'timestamp',
                 ]);
    }
}
