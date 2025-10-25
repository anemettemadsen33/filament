<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('view users');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, User $model): bool
    {
        return $user->can('view users');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can('create users');
    }

    /**
     * Determine whether the user can update the model.
     * Admins cannot edit Super Admins.
     */
    public function update(User $user, User $model): bool
    {
        // Super admins can edit anyone
        if ($user->hasRole('super_admin')) {
            return true;
        }

        // Regular admins cannot edit super admins
        if ($model->hasRole('super_admin') && !$user->hasRole('super_admin')) {
            return false;
        }

        // Check if user has permission to edit users
        return $user->can('edit users');
    }

    /**
     * Determine whether the user can delete the model.
     * Admins cannot delete Super Admins.
     */
    public function delete(User $user, User $model): bool
    {
        // Super admins can delete anyone (except themselves)
        if ($user->hasRole('super_admin') && $user->id !== $model->id) {
            return true;
        }

        // Regular admins cannot delete super admins
        if ($model->hasRole('super_admin')) {
            return false;
        }

        // Users cannot delete themselves
        if ($user->id === $model->id) {
            return false;
        }

        // Check if user has permission to delete users
        return $user->can('delete users');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, User $model): bool
    {
        return $user->can('edit users');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, User $model): bool
    {
        return $user->hasRole('super_admin') && $user->id !== $model->id;
    }
}
