<?php

namespace App\Actions\Users;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UpdateUserAction
{
    /**
     * Update a user with the given data.
     */
    public function execute(User $user, array $data): User
    {
        // Hash password if provided and changed
        if (isset($data['password']) && !empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        // Update user
        $user->update($data);

        // Sync roles if provided
        if (isset($data['roles']) && is_array($data['roles'])) {
            $user->syncRoles($data['roles']);
        }

        // Log activity
        activity()
            ->causedBy(auth()->user())
            ->performedOn($user)
            ->log('User updated');

        return $user->fresh();
    }
}
