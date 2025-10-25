<?php

namespace Tests\Unit\Actions;

use App\Actions\Properties\CreatePropertyAction;
use App\Models\Property;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PropertyActionsTest extends TestCase
{
    use RefreshDatabase;

    public function test_create_property_action_creates_property()
    {
        $owner = User::factory()->create(['role' => 'owner']);
        $this->actingAs($owner);

        $action = new CreatePropertyAction();
        
        $propertyData = [
            'title' => 'Beautiful Apartment',
            'description' => 'A lovely apartment in the city center',
            'address' => '456 Main St',
            'city' => 'New York',
            'country' => 'USA',
            'postal_code' => '10001',
            'property_type' => 'apartment',
            'rental_type' => 'short_term',
            'bedrooms' => 2,
            'bathrooms' => 1,
            'max_guests' => 4,
            'price_per_night' => 150,
        ];

        $property = $action->execute($propertyData);

        $this->assertInstanceOf(Property::class, $property);
        $this->assertEquals('Beautiful Apartment', $property->title);
        $this->assertEquals('New York', $property->city);
    }

    public function test_create_property_action_sets_owner_to_current_user()
    {
        $owner = User::factory()->create(['role' => 'owner']);
        $this->actingAs($owner);

        $action = new CreatePropertyAction();
        
        $propertyData = [
            'title' => 'Test Property',
            'description' => 'Test description',
            'address' => '789 Test Ave',
            'city' => 'Test City',
            'country' => 'Test Country',
            'postal_code' => '12345',
            'property_type' => 'house',
            'rental_type' => 'long_term',
            'bedrooms' => 3,
            'bathrooms' => 2,
            'max_guests' => 6,
            'price_per_month' => 2000,
        ];

        $property = $action->execute($propertyData);

        $this->assertEquals($owner->id, $property->owner_id);
    }

    public function test_create_property_action_sets_default_status()
    {
        $owner = User::factory()->create(['role' => 'owner']);
        $this->actingAs($owner);

        $action = new CreatePropertyAction();
        
        $propertyData = [
            'title' => 'Draft Property',
            'description' => 'This should be a draft',
            'address' => '123 Draft St',
            'city' => 'Draft City',
            'country' => 'Draft Country',
            'postal_code' => '54321',
            'property_type' => 'apartment',
            'rental_type' => 'short_term',
            'bedrooms' => 1,
            'bathrooms' => 1,
            'max_guests' => 2,
            'price_per_night' => 80,
        ];

        $property = $action->execute($propertyData);

        $this->assertEquals('draft', $property->status);
        $this->assertFalse($property->is_featured);
    }

    public function test_create_property_action_logs_activity()
    {
        $owner = User::factory()->create(['role' => 'owner']);
        $this->actingAs($owner);

        $action = new CreatePropertyAction();
        
        $propertyData = [
            'title' => 'Activity Logged Property',
            'description' => 'Test activity logging',
            'address' => '999 Log St',
            'city' => 'Log City',
            'country' => 'Log Country',
            'postal_code' => '99999',
            'property_type' => 'villa',
            'rental_type' => 'short_term',
            'bedrooms' => 4,
            'bathrooms' => 3,
            'max_guests' => 8,
            'price_per_night' => 300,
        ];

        $property = $action->execute($propertyData);

        $this->assertDatabaseHas('activity_log', [
            'subject_type' => Property::class,
            'subject_id' => $property->id,
            'description' => 'Property created',
        ]);
    }
}
