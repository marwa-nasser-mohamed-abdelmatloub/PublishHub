<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use App\Models\Article;
use App\Models\ChangeTracker;
use App\Services\ChangeTrackingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChangeTrackerController extends Controller
{
    use ApiResponse;

    protected $changeTrackingService;

    public function __construct(ChangeTrackingService $changeTrackingService)
    {
        $this->changeTrackingService = $changeTrackingService;
    }

    /**
     * Get all changes for an article
     */
    public function getArticleChanges(Request $request, Article $article): JsonResponse
    {
        $this->authorize('viewAny', ChangeTracker::class);

        $status = $request->query('status', 'all');
        $query = ChangeTracker::where('article_id', $article->id);

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        $changes = $query->with('articleVersion')->paginate(20);
        return $this->successResponse(
            $changes,
            "Changes retrieved successfully"
        );
    }

    /**
     * Track changes when article is updated
     */
    public function trackChanges(Request $request, Article $article): JsonResponse
    {
        $validated = $request->validate([
            'old_content' => 'required|string',
            'new_content' => 'required|string',
        ]);

        $user = $request->user();

        if ($user->role !== 'admin' && $article->author_id !== $user->id) {
            return $this->forbiddenResponse("Not authorized to track changes on this article");
        }

        $version = $this->changeTrackingService->trackChanges(
            $article,
            $validated['old_content'],
            $validated['new_content'],
            $user->id
        );

        return $this->createdResponse(
            [
                'version' => $version,
                'changes' => $version->changeTrackers,
            ],
            "Changes tracked successfully"
        );
    }

    /**
     * Approve specific change
     */
    public function approveChange(Request $request, Article $article, ChangeTracker $change): JsonResponse
    {
        $this->authorize('approve', $change);

        if ($change->article_id !== $article->id) {
            return $this->notFoundResponse("Change not found");
        }

        $change->update([
            'status' => 'approved',
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        return $this->successResponse(
            $change,
            "Change approved successfully"
        );
    }

    /**
     * Reject specific change
     */
    public function rejectChange(Request $request, Article $article, ChangeTracker $change): JsonResponse
    {
        $this->authorize('reject', $change);

        if ($change->article_id !== $article->id) {
            return $this->notFoundResponse("Change not found");
        }

        $change->update([
            'status' => 'rejected',
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        return $this->successResponse(
            $change,
            "Change rejected successfully"
        );
    }

    /**
     * Approve all pending changes
     */
    public function approveAllChanges(Request $request, Article $article): JsonResponse
    {
        $this->authorize('viewAny', ChangeTracker::class);

        $this->changeTrackingService->approveAllChanges($article, $request->user()->id);

        return $this->successResponse(
            null,
            "All changes approved successfully"
        );
    }

    /**
     * Reject all pending changes
     */
    public function rejectAllChanges(Request $request, Article $article): JsonResponse
    {
        $this->authorize('viewAny', ChangeTracker::class);

        $this->changeTrackingService->rejectAllChanges($article, $request->user()->id);

        return $this->successResponse(
            null,
            "All changes rejected successfully"
        );
    }

    /**
     * Get comparison between versions
     */
    public function compareVersions(Request $request, Article $article): JsonResponse
    {
        $validated = $request->validate([
            'version1' => 'required|integer',
            'version2' => 'required|integer',
        ]);

        $version1 = $article->versions()->where('version_number', $validated['version1'])->first();
        $version2 = $article->versions()->where('version_number', $validated['version2'])->first();

        if (!$version1 || !$version2) {
            return $this->notFoundResponse("Version not found");
        }

        return $this->successResponse(
            [
                'version1' => $version1,
                'version2' => $version2,
                'changes' => ChangeTracker::where('article_id', $article->id)
                    ->whereIn('article_version_id', [$version1->id, $version2->id])
                    ->get(),
            ],
            "Version comparison retrieved successfully"
        );
    }
}
