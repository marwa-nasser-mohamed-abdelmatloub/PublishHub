<?php

namespace App\Providers;

use App\Models\Article;
use App\Models\Comment;
use App\Models\ChangeTracker;
use App\Models\RevisionRequest;
use App\Policies\ArticlePolicy;
use App\Policies\CommentPolicy;
use App\Policies\ChangeTrackerPolicy;
use App\Policies\RevisionRequestPolicy;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(Article::class, ArticlePolicy::class);
        Gate::policy(Comment::class, CommentPolicy::class);
        Gate::policy(ChangeTracker::class, ChangeTrackerPolicy::class);
        Gate::policy(RevisionRequest::class, RevisionRequestPolicy::class);
    }
}