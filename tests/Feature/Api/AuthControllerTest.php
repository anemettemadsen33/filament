<?php

namespace Tests\Feature\Api;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Authentication Controller Feature Tests
 * 
 * Tests for user registration and login flows.
 * Uses RefreshDatabase to ensure clean database state for each test.
 */
class AuthControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test user registration with valid data
     * 
     * @return void
     */
    public function test_user_can_register_with_valid_data(): void
    {
        // Arrange: Prepare registration data
        $userData = [
            'name' => 'John Doe',
            'email' => 'john.doe@example.com',
            'password' => 'SecurePassword123!',
            'password_confirmation' => 'SecurePassword123!',
        ];

        // Act: Send POST request to registration endpoint
        $response = $this->postJson('/api/register', $userData);

        // Assert: Check response status and structure
        $response->assertStatus(201)
            ->assertJsonStructure([
                'user' => [
                    'id',
                    'name',
                    'email',
                ],
                'token',
            ]);

        // Assert: Verify user exists in database
        $this->assertDatabaseHas('users', [
            'email' => 'john.doe@example.com',
        ]);
    }

    /**
     * Test user registration fails with invalid email
     * 
     * @return void
     */
    public function test_user_registration_fails_with_invalid_email(): void
    {
        // Arrange: Prepare invalid data
        $userData = [
            'name' => 'Jane Doe',
            'email' => 'invalid-email',
            'password' => 'SecurePassword123!',
            'password_confirmation' => 'SecurePassword123!',
        ];

        // Act: Send POST request
        $response = $this->postJson('/api/register', $userData);

        // Assert: Check validation error
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    /**
     * Test user registration fails with mismatched passwords
     * 
     * @return void
     */
    public function test_user_registration_fails_with_mismatched_passwords(): void
    {
        // Arrange
        $userData = [
            'name' => 'Jane Doe',
            'email' => 'jane.doe@example.com',
            'password' => 'SecurePassword123!',
            'password_confirmation' => 'DifferentPassword456!',
        ];

        // Act
        $response = $this->postJson('/api/register', $userData);

        // Assert
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    /**
     * Test user can login with valid credentials
     * 
     * @return void
     */
    public function test_user_can_login_with_valid_credentials(): void
    {
        // Arrange: Create a user using factory
        $user = \App\Models\User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt($password = 'SecurePassword123!'),
        ]);

        // Act: Send POST request to login endpoint
        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => $password,
        ]);

        // Assert: Check successful login response
        $response->assertStatus(200)
            ->assertJsonStructure([
                'user' => [
                    'id',
                    'name',
                    'email',
                ],
                'token',
            ]);
    }

    /**
     * Test user login fails with invalid credentials
     * 
     * @return void
     */
    public function test_user_login_fails_with_invalid_credentials(): void
    {
        // Arrange: Create a user
        $user = \App\Models\User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('CorrectPassword123!'),
        ]);

        // Act: Attempt login with wrong password
        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'WrongPassword456!',
        ]);

        // Assert: Check unauthorized response
        $response->assertStatus(401)
            ->assertJson([
                'message' => 'Invalid credentials',
            ]);
    }

    /**
     * Test authenticated user can access protected routes
     * 
     * @return void
     */
    public function test_authenticated_user_can_access_protected_routes(): void
    {
        // Arrange: Create and authenticate a user
        $user = \App\Models\User::factory()->create();

        // Act: Send authenticated request
        $response = $this->actingAs($user, 'sanctum')
            ->getJson('/api/user');

        // Assert: Check successful response
        $response->assertStatus(200)
            ->assertJson([
                'id' => $user->id,
                'email' => $user->email,
            ]);
    }

    /**
     * Test unauthenticated user cannot access protected routes
     * 
     * @return void
     */
    public function test_unauthenticated_user_cannot_access_protected_routes(): void
    {
        // Act: Send request without authentication
        $response = $this->getJson('/api/user');

        // Assert: Check unauthorized response
        $response->assertStatus(401);
    }

    /**
     * Test user can logout successfully
     * 
     * @return void
     */
    public function test_user_can_logout(): void
    {
        // Arrange: Create and authenticate a user
        $user = \App\Models\User::factory()->create();

        // Act: Send logout request
        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/logout');

        // Assert: Check successful logout
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Logged out successfully',
            ]);
    }
}
