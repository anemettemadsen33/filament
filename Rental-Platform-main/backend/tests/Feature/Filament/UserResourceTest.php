<?php

namespace Tests\Feature\Filament;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class UserResourceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create permissions and roles
        Permission::create(['name' => 'view users']);
        Permission::create(['name' => 'create users']);
        Permission::create(['name' => 'edit users']);
        Permission::create(['name' => 'delete users']);
        
        $adminRole = Role::create(['name' => 'admin']);
        $adminRole->givePermissionTo(['view users', 'create users', 'edit users', 'delete users']);
        
        Role::create(['name' => 'super_admin']);
    }

    public function test_admin_can_access_user_list()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $admin->assignRole('admin');

        $response = $this->actingAs($admin)
            ->get('/admin/users');

        $response->assertStatus(200);
    }

    public function test_admin_can_create_user()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $admin->assignRole('admin');

        $userData = [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'role' => 'guest',
        ];

        $response = $this->actingAs($admin)
            ->post('/admin/users', $userData);

        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
            'name' => 'Test User',
        ]);
    }

    public function test_admin_cannot_edit_super_admin()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $admin->assignRole('admin');

        $superAdmin = User::factory()->create(['role' => 'admin']);
        $superAdmin->assignRole('super_admin');

        $this->actingAs($admin);

        $this->assertFalse($admin->can('update', $superAdmin));
    }

    public function test_super_admin_can_edit_any_user()
    {
        $superAdmin = User::factory()->create(['role' => 'admin']);
        $superAdmin->assignRole('super_admin');

        $regularUser = User::factory()->create(['role' => 'guest']);

        $this->actingAs($superAdmin);

        $this->assertTrue($superAdmin->can('update', $regularUser));
    }

    public function test_user_cannot_delete_themselves()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $admin->assignRole('admin');

        $this->actingAs($admin);

        $this->assertFalse($admin->can('delete', $admin));
    }
}
