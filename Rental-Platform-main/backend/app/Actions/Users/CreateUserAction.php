<?php

namespace App\Actions\Users;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class CreateUserAction
{
    /**
     * Create a new user with the given data.
     */
    public function execute(array $data): User
    {
        // Hash password if provided
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        // Set default locale if not provided
        $data['locale'] = $data['locale'] ?? config('app.locale');

        // Create user
        $user = User::create($data);

        // Assign roles if provided
        if (isset($data['roles']) && is_array($data['roles'])) {
            $user->syncRoles($data['roles']);
        }

        // Log activity
        activity()
            ->causedBy(auth()->user())
            ->performedOn($user)
            ->log('User created');

        return $user;
    }
}
