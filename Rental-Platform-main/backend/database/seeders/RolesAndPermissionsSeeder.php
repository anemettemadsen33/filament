<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions (skip if cache table doesn't exist)
        try {
            app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
        } catch (\Exception $e) {
            // Ignore cache errors during seeding
        }

        // Create permissions
        $permissions = [
            // User permissions
            'view users',
            'create users',
            'edit users',
            'delete users',
            'manage super admins',
            
            // Property permissions
            'view properties',
            'create properties',
            'edit properties',
            'delete properties',
            
            // Booking permissions
            'view bookings',
            'create bookings',
            'edit bookings',
            'delete bookings',
            
            // Review permissions
            'view reviews',
            'create reviews',
            'edit reviews',
            'delete reviews',
            
            // Settings permissions
            'view settings',
            'edit settings',
            
            // Activity log permissions
            'view activity log',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles and assign permissions
        $superAdmin = Role::firstOrCreate(['name' => 'super_admin']);
        $superAdmin->givePermissionTo(Permission::all());

        $admin = Role::firstOrCreate(['name' => 'admin']);
        $admin->givePermissionTo([
            'view users',
            'create users',
            'edit users',
            'delete users',
            'view properties',
            'create properties',
            'edit properties',
            'delete properties',
            'view bookings',
            'create bookings',
            'edit bookings',
            'delete bookings',
            'view reviews',
            'edit reviews',
            'delete reviews',
            'view settings',
            'view activity log',
        ]);

        $moderator = Role::firstOrCreate(['name' => 'moderator']);
        $moderator->givePermissionTo([
            'view users',
            'view properties',
            'edit properties',
            'view bookings',
            'view reviews',
            'edit reviews',
        ]);

        $this->command->info('Roles and permissions have been seeded!');
    }
}
