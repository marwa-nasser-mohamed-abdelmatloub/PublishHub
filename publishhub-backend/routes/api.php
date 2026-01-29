<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\ArticleVersionController;
use App\Http\Controllers\Api\ArticleWorkflowController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\ChangeTrackerController;
use App\Http\Controllers\Api\RevisionRequestController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ActivityController;

// =========================================
// Authentication Routes (Public)
// =========================================
Route::prefix('auth')->controller(AuthController::class)->group(function () {
    Route::post('register', 'register')->name('auth.register');
    Route::post('login', 'login')->name('auth.login');
});

// =========================================
// Protected Routes (Authenticated Users)
// =========================================
Route::middleware('auth:sanctum')->group(function () {

    Route::prefix('auth')->controller(AuthController::class)->group(function () {
        Route::post('logout', 'logout')->name('auth.logout');
        Route::get('me', 'me')->name('auth.me');
        Route::put('profile', 'updateProfile')->name('auth.updateProfile');
        Route::post('change-password', 'changePassword')->name('auth.changePassword');
    });

    // =========================================
    // Article Management
    // =========================================
    Route::prefix('articles')->controller(ArticleController::class)->group(function () {
        Route::get('/', 'index')->name('articles.index');
        Route::post('/', 'store')->name('articles.store');
        Route::get('{article}', 'show')->name('articles.show');
        Route::put('{article}', 'update')->name('articles.update');
        Route::delete('{article}', 'destroy')->name('articles.destroy');

        Route::post('{article}/submit', 'submit')->name('articles.submit');

        Route::middleware('role:admin')->group(function () {
            Route::get('pending/approval', 'pendingApproval')->name('articles.pendingApproval');
            Route::post('{article}/approve', 'approve')->name('articles.approve');
            Route::post('{article}/reject', 'reject')->name('articles.reject');
        });
    });

    // =========================================
    // Article Workflow Management
    // =========================================
    Route::prefix('articles/{article}/workflow')
        ->controller(ArticleWorkflowController::class)
        ->group(function () {
            Route::middleware('role:admin')->group(function () {
                Route::post('approve-article', 'approveArticle')->name('workflow.approveArticle');
                Route::post('reject-article', 'rejectArticle')->name('workflow.rejectArticle');
                Route::post('assign-reviewer', 'assignReviewer')->name('workflow.assignReviewer');
                Route::post('reassign-reviewer', 'reassignToReviewer')->name('workflow.reassignReviewer');
                Route::post('approve-revision', 'approveRevision')->name('workflow.approveRevision');
                Route::post('reject-revision', 'rejectRevision')->name('workflow.rejectRevision');
                Route::post('publish', 'publishArticle')->name('workflow.publish');
            });

            Route::get('changes', 'getChanges')->name('workflow.getChanges');
            Route::middleware('role:admin')->group(function () {
                Route::post('changes/{change}/approve', 'approveChange')->name('workflow.approveChange');
                Route::post('changes/{change}/reject', 'rejectChange')->name('workflow.rejectChange');
            });

            Route::middleware('role:reviewer')->group(function () {
                Route::post('submit-review', 'submitReview')->name('workflow.submitReview');
            });

            Route::middleware('role:author')->group(function () {
                Route::post('request-revision', 'requestRevision')->name('workflow.requestRevision');
            });

            Route::post('compare-versions', 'compareVersions')->name('workflow.compareVersions');
        });

    // =========================================
    // Users Management (Admin Only)
    // =========================================
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('users', UserController::class);
    });

    // =========================================
    // Article Versions
    // =========================================
    Route::prefix('articles/{article}/versions')
        ->controller(ArticleVersionController::class)
        ->group(function () {
            Route::get('/', 'index')->name('versions.index');
            Route::get('{version}', 'show')->name('versions.show');
        });

    // =========================================
    // Comments System
    // =========================================
    Route::prefix('articles/{article}/comments')
        ->controller(CommentController::class)
        ->group(function () {
            Route::get('/', 'index')->name('comments.index');
            Route::post('/', 'store')->name('comments.store');
            Route::get('{comment}', 'show')->name('comments.show');
            Route::put('{comment}', 'update')->name('comments.update');
            Route::delete('{comment}', 'destroy')->name('comments.destroy');
        });

    // =========================================
    // Review System
    // =========================================
    Route::prefix('reviews')->controller(ReviewController::class)->group(function () {
        // Admin operations
        Route::middleware('role:admin')->group(function () {
            Route::post('assign', 'assignReviewer')->name('reviews.assign');
            Route::post('{assignment}/complete', 'completeReview')->name('reviews.complete');
        });

        Route::middleware('role:reviewer')->group(function () {
            Route::get('my-assignments', 'myAssignments')->name('reviews.myAssignments');
            Route::post('{assignment}/decision', 'submitReviewDecision')->name('reviews.decision');
        });

        Route::get('assignments', 'listAssignments')->name('reviews.assignments');
        Route::get('decisions', 'listDecisions')->name('reviews.decisions');
    });

    // =========================================
    // Change Tracking System
    // =========================================
    Route::prefix('articles/{article}/changes')
        ->controller(ChangeTrackerController::class)
        ->group(function () {
            // Get changes
            Route::get('/', 'getArticleChanges')->name('changes.index');
            Route::get('{change}', 'showChange')->name('changes.show');

            Route::middleware('role:author')->group(function () {
                Route::post('track', 'trackChanges')->name('changes.track');
            });

            Route::middleware('role:admin')->group(function () {
                Route::post('{change}/approve', 'approveChange')->name('changes.approve');
                Route::post('{change}/reject', 'rejectChange')->name('changes.reject');
                Route::post('approve-all', 'approveAllChanges')->name('changes.approveAll');
                Route::post('reject-all', 'rejectAllChanges')->name('changes.rejectAll');
            });

            Route::post('compare', 'compareVersions')->name('changes.compare');
        });

    // =========================================
    // Revision Requests (Admin)
    // =========================================
    Route::middleware('role:admin')->group(function () {
        Route::prefix('revision-requests')->controller(RevisionRequestController::class)->group(function () {
            Route::get('/', 'index')->name('revisions.index');
            Route::post('/', 'store')->name('revisions.store');
            Route::get('{revision}', 'show')->name('revisions.show');
            Route::post('{revision}/approve', 'approve')->name('revisions.approve');
            Route::post('{revision}/reject', 'reject')->name('revisions.reject');
        });
    });

    Route::prefix('my-revision-requests')
        ->controller(RevisionRequestController::class)
        ->group(function () {
            Route::get('/', 'myRequests')->name('revisions.myRequests');
            Route::post('{revision}/complete', 'completeRevision')->name('revisions.complete');
        });

    Route::get('activity', [ActivityController::class, 'index'])->name('activity.index');
});
