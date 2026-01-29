<?php

namespace App\Policies;

use App\Models\RevisionRequest;
use App\Models\User;

class RevisionRequestPolicy
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
    public function view(User $user, RevisionRequest $revisionRequest): bool
    {
        if ($revisionRequest->requested_from_id === $user->id) {
            return true;
        }

        if ($user->role === 'admin') {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, RevisionRequest $revisionRequest): bool
    {
        if ($revisionRequest->requested_from_id === $user->id) {
            return $revisionRequest->status === 'pending';
        }

        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, RevisionRequest $revisionRequest): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can approve the revision request.
     */
    public function approve(User $user, RevisionRequest $revisionRequest): bool
    {
        return $revisionRequest->requested_from_id === $user->id && $revisionRequest->status === 'pending';
    }

    /**
     * Determine whether the user can reject the revision request.
     */
    public function reject(User $user, RevisionRequest $revisionRequest): bool
    {
        return $user->role === 'admin' && $revisionRequest->status === 'pending';
    }
}
