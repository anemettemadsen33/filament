<?php

namespace Tests\Unit\Actions;

use App\Actions\Users\CreateUserAction;
use App\Actions\Users\UpdateUserAction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class UserActionsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create roles
        Role::create(['name' => 'admin']);
        Role::create(['name' => 'guest']);
    }

    public function test_create_user_action_creates_user_with_hashed_password()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $this->actingAs($admin);

        $action = new CreateUserAction();
        
        $userData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'role' => 'guest',
        ];

        $user = $action->execute($userData);

        $this->assertInstanceOf(User::class, $user);
        $this->assertEquals('John Doe', $user->name);
        $this->assertEquals('john@example.com', $user->email);
        $this->assertTrue(Hash::check('password123', $user->password));
    }

    public function test_create_user_action_sets_default_locale()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $this->actingAs($admin);

        $action = new CreateUserAction();
        
        $userData = [
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'password' => 'password123',
            'role' => 'guest',
        ];

        $user = $action->execute($userData);

        $this->assertEquals(config('app.locale'), $user->locale);
    }

    public function test_create_user_action_assigns_roles()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $this->actingAs($admin);

        $action = new CreateUserAction();
        
        $userData = [
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => 'password123',
            'role' => 'admin',
            'roles' => ['admin'],
        ];

        $user = $action->execute($userData);

        $this->assertTrue($user->hasRole('admin'));
    }

    public function test_update_user_action_updates_user_data()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $this->actingAs($admin);

        $user = User::factory()->create([
            'name' => 'Old Name',
            'email' => 'old@example.com',
        ]);

        $action = new UpdateUserAction();
        
        $updateData = [
            'name' => 'New Name',
            'email' => 'new@example.com',
        ];

        $updatedUser = $action->execute($user, $updateData);

        $this->assertEquals('New Name', $updatedUser->name);
        $this->assertEquals('new@example.com', $updatedUser->email);
    }

    public function test_update_user_action_hashes_new_password()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $this->actingAs($admin);

        $user = User::factory()->create();

        $action = new UpdateUserAction();
        
        $updateData = [
            'password' => 'newpassword123',
        ];

        $updatedUser = $action->execute($user, $updateData);

        $this->assertTrue(Hash::check('newpassword123', $updatedUser->password));
    }

    public function test_update_user_action_does_not_update_password_if_empty()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $this->actingAs($admin);

        $originalPassword = Hash::make('original');
        $user = User::factory()->create([
            'password' => $originalPassword,
        ]);

        $action = new UpdateUserAction();
        
        $updateData = [
            'name' => 'Updated Name',
            'password' => '',
        ];

        $updatedUser = $action->execute($user, $updateData);

        $this->assertEquals($originalPassword, $updatedUser->password);
    }
}
