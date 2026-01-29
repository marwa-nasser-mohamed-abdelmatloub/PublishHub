<?php

namespace App\Policies;

use App\Models\ChangeTracker;
use App\Models\User;

class ChangeTrackerPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, ChangeTracker $changeTracker): bool
    {
        if ($changeTracker->article->author_id === $user->id) {
            return true;
        }

        if ($user->role === 'admin') {
            return true;
        }

        if ($user->role === 'reviewer') {
            return $changeTracker->article->reviewAssignments()
                ->where('reviewer_id', $user->id)
                ->exists();
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return in_array($user->role, ['author', 'admin']);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ChangeTracker $changeTracker): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ChangeTracker $changeTracker): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can approve the change.
     */
    public function approve(User $user, ChangeTracker $changeTracker): bool
    {
        return $user->role === 'admin' && $changeTracker->status === 'pending';
    }

    /**
     * Determine whether the user can reject the change.
     */
    public function reject(User $user, ChangeTracker $changeTracker): bool
    {
        return $user->role === 'admin' && $changeTracker->status === 'pending';
    }
}