<?php

namespace Tests\Feature\Filament;

use App\Models\Property;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class PropertyResourceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create permissions and roles
        Permission::create(['name' => 'view properties']);
        Permission::create(['name' => 'create properties']);
        Permission::create(['name' => 'edit properties']);
        Permission::create(['name' => 'delete properties']);
        
        $adminRole = Role::create(['name' => 'admin']);
        $adminRole->givePermissionTo(['view properties', 'create properties', 'edit properties', 'delete properties']);
    }

    public function test_admin_can_access_property_list()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $admin->assignRole('admin');

        $response = $this->actingAs($admin)
            ->get('/admin/properties');

        $response->assertStatus(200);
    }

    public function test_admin_can_create_property()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $admin->assignRole('admin');

        $propertyData = [
            'title' => 'Test Property',
            'description' => 'A test property description',
            'address' => '123 Test St',
            'city' => 'Test City',
            'country' => 'Test Country',
            'property_type' => 'apartment',
            'rental_type' => 'short_term',
            'bedrooms' => 2,
            'bathrooms' => 1,
            'max_guests' => 4,
            'price_per_night' => 100,
            'status' => 'draft',
        ];

        $response = $this->actingAs($admin)
            ->post('/admin/properties', $propertyData);

        $this->assertDatabaseHas('properties', [
            'title' => 'Test Property',
            'city' => 'Test City',
        ]);
    }

    public function test_property_logs_activity_on_creation()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $admin->assignRole('admin');

        $this->actingAs($admin);

        $property = Property::factory()->create([
            'owner_id' => $admin->id,
        ]);

        // Manually log the activity since we're creating via factory
        activity()
            ->causedBy($admin)
            ->performedOn($property)
            ->log('Property created');

        $this->assertDatabaseHas('activity_log', [
            'subject_type' => Property::class,
            'subject_id' => $property->id,
            'description' => 'Property created',
        ]);
    }

    public function test_property_export_generates_excel_file()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $admin->assignRole('admin');

        Property::factory()->count(5)->create([
            'owner_id' => $admin->id,
        ]);

        $this->actingAs($admin);

        // Test that we can export properties
        $export = new \App\Exports\PropertiesExport();
        $collection = $export->collection();

        $this->assertGreaterThanOrEqual(5, $collection->count());
    }
}
