<?php

namespace App\Policies;

use App\Models\Article;
use App\Models\User;

class ArticlePolicy
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
    public function view(User $user, Article $article): bool
    {
        if ($user->id === $article->author_id) {
            return true;
        }

        if ($user->role === 'admin') {
            return true;
        }

        if ($user->role === 'reviewer') {
            return $article->reviewAssignments()
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
    public function update(User $user, Article $article): bool
    {
        if ($user->id === $article->author_id) {
            return in_array($article->status, ['draft', 'revision_requested']);
        }

        if ($user->role === 'admin') {
            return $article->status !== 'published';
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Article $article): bool
    {
        if ($user->id === $article->author_id) {
            return $article->status === 'draft';
        }

        if ($user->role === 'admin') {
            return $article->status !== 'published';
        }

        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Article $article): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Article $article): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can submit the article for review.
     */
    public function submit(User $user, Article $article): bool
    {
        return $user->id === $article->author_id && $article->status === 'draft';
    }

    /**
     * Determine whether the user can approve the article.
     */
    public function approve(User $user, Article $article): bool
    {
        return $user->role === 'admin' && in_array($article->status, ['submitted', 'under_review']);
    }

    /**
     * Determine whether the user can reject the article.
     */
    public function reject(User $user, Article $article): bool
    {
        return $user->role === 'admin' && in_array($article->status, ['submitted', 'under_review']);
    }
}