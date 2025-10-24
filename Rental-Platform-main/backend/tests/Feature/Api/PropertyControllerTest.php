<?php

namespace Tests\Feature\Api;

use App\Models\User;
use App\Models\Property;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PropertyControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private string $token;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create();
        $this->token = $this->user->createToken('test-token')->plainTextToken;
    }

    /**
     * Test user can list properties.
     */
    public function test_user_can_list_properties(): void
    {
        Property::factory()->count(5)->create();

        $response = $this->getJson('/api/v1/properties');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data' => [
                         '*' => [
                             'id',
                             'title',
                             'description',
                             'price',
                             'location',
                             'bedrooms',
                             'bathrooms',
                         ]
                     ],
                     'meta' => [
                         'current_page',
                         'total',
                     ],
                 ]);
    }

    /**
     * Test user can view a single property.
     */
    public function test_user_can_view_single_property(): void
    {
        $property = Property::factory()->create([
            'title' => 'Test Property',
            'price' => 1500,
        ]);

        $response = $this->getJson("/api/v1/properties/{$property->id}");

        $response->assertStatus(200)
                 ->assertJson([
                     'id' => $property->id,
                     'title' => 'Test Property',
                     'price' => 1500,
                 ]);
    }

    /**
     * Test user gets 404 for non-existent property.
     */
    public function test_user_gets_404_for_nonexistent_property(): void
    {
        $response = $this->getJson('/api/v1/properties/99999');

        $response->assertStatus(404);
    }

    /**
     * Test authenticated user can create property.
     */
    public function test_authenticated_user_can_create_property(): void
    {
        $propertyData = [
            'title' => 'New Property',
            'description' => 'A beautiful property',
            'price' => 2000,
            'location' => 'New York, NY',
            'bedrooms' => 3,
            'bathrooms' => 2,
            'size' => 1500,
            'property_type' => 'apartment',
        ];

        $response = $this->withHeader('Authorization', 'Bearer ' . $this->token)
                         ->postJson('/api/v1/properties', $propertyData);

        $response->assertStatus(201)
                 ->assertJson([
                     'title' => 'New Property',
                     'price' => 2000,
                 ]);

        $this->assertDatabaseHas('properties', [
            'title' => 'New Property',
            'user_id' => $this->user->id,
        ]);
    }

    /**
     * Test unauthenticated user cannot create property.
     */
    public function test_unauthenticated_user_cannot_create_property(): void
    {
        $propertyData = [
            'title' => 'New Property',
            'price' => 2000,
        ];

        $response = $this->postJson('/api/v1/properties', $propertyData);

        $response->assertStatus(401);
    }

    /**
     * Test property creation fails with invalid data.
     */
    public function test_property_creation_fails_with_invalid_data(): void
    {
        $propertyData = [
            'title' => '', // Invalid: empty title
            'price' => -100, // Invalid: negative price
        ];

        $response = $this->withHeader('Authorization', 'Bearer ' . $this->token)
                         ->postJson('/api/v1/properties', $propertyData);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['title', 'price']);
    }

    /**
     * Test user can update their own property.
     */
    public function test_user_can_update_own_property(): void
    {
        $property = Property::factory()->create([
            'user_id' => $this->user->id,
            'title' => 'Original Title',
            'price' => 1000,
        ]);

        $updateData = [
            'title' => 'Updated Title',
            'price' => 1500,
        ];

        $response = $this->withHeader('Authorization', 'Bearer ' . $this->token)
                         ->putJson("/api/v1/properties/{$property->id}", $updateData);

        $response->assertStatus(200)
                 ->assertJson([
                     'title' => 'Updated Title',
                     'price' => 1500,
                 ]);

        $this->assertDatabaseHas('properties', [
            'id' => $property->id,
            'title' => 'Updated Title',
        ]);
    }

    /**
     * Test user cannot update another user's property.
     */
    public function test_user_cannot_update_another_users_property(): void
    {
        $otherUser = User::factory()->create();
        $property = Property::factory()->create([
            'user_id' => $otherUser->id,
        ]);

        $updateData = [
            'title' => 'Hacked Title',
        ];

        $response = $this->withHeader('Authorization', 'Bearer ' . $this->token)
                         ->putJson("/api/v1/properties/{$property->id}", $updateData);

        $response->assertStatus(403);
    }

    /**
     * Test user can delete their own property.
     */
    public function test_user_can_delete_own_property(): void
    {
        $property = Property::factory()->create([
            'user_id' => $this->user->id,
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $this->token)
                         ->deleteJson("/api/v1/properties/{$property->id}");

        $response->assertStatus(204);

        $this->assertDatabaseMissing('properties', [
            'id' => $property->id,
        ]);
    }

    /**
     * Test user cannot delete another user's property.
     */
    public function test_user_cannot_delete_another_users_property(): void
    {
        $otherUser = User::factory()->create();
        $property = Property::factory()->create([
            'user_id' => $otherUser->id,
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $this->token)
                         ->deleteJson("/api/v1/properties/{$property->id}");

        $response->assertStatus(403);
    }

    /**
     * Test properties can be filtered by price range.
     */
    public function test_properties_can_be_filtered_by_price_range(): void
    {
        Property::factory()->create(['price' => 500]);
        Property::factory()->create(['price' => 1500]);
        Property::factory()->create(['price' => 2500]);

        $response = $this->getJson('/api/v1/properties?min_price=1000&max_price=2000');

        $response->assertStatus(200);
        
        $properties = $response->json('data');
        foreach ($properties as $property) {
            $this->assertGreaterThanOrEqual(1000, $property['price']);
            $this->assertLessThanOrEqual(2000, $property['price']);
        }
    }

    /**
     * Test properties can be filtered by bedrooms.
     */
    public function test_properties_can_be_filtered_by_bedrooms(): void
    {
        Property::factory()->create(['bedrooms' => 1]);
        Property::factory()->create(['bedrooms' => 2]);
        Property::factory()->create(['bedrooms' => 3]);

        $response = $this->getJson('/api/v1/properties?bedrooms=2');

        $response->assertStatus(200);
        
        $properties = $response->json('data');
        foreach ($properties as $property) {
            $this->assertEquals(2, $property['bedrooms']);
        }
    }

    /**
     * Test properties can be searched by location.
     */
    public function test_properties_can_be_searched_by_location(): void
    {
        Property::factory()->create(['location' => 'New York, NY']);
        Property::factory()->create(['location' => 'Los Angeles, CA']);

        $response = $this->getJson('/api/v1/properties?location=New York');

        $response->assertStatus(200);
        
        $properties = $response->json('data');
        foreach ($properties as $property) {
            $this->assertStringContainsString('New York', $property['location']);
        }
    }

    /**
     * Test properties pagination works correctly.
     */
    public function test_properties_pagination_works(): void
    {
        Property::factory()->count(25)->create();

        $response = $this->getJson('/api/v1/properties?per_page=10&page=1');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data',
                     'meta' => [
                         'current_page',
                         'per_page',
                         'total',
                         'last_page',
                     ],
                 ]);

        $this->assertEquals(10, count($response->json('data')));
        $this->assertEquals(1, $response->json('meta.current_page'));
    }
}
