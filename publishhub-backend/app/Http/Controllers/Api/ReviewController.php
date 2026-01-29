<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Review\StoreReviewDecisionRequest;
use App\Http\Resources\ReviewDecisionResource;
use App\Http\Traits\ApiResponse;
use App\Models\Article;
use App\Models\ReviewAssignment;
use App\Models\ReviewDecision;
use App\Models\ChangeTracker;
use App\Models\RevisionRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    use ApiResponse;

    /**
     * Get reviewer's assigned articles
     */
    public function myAssignments(Request $request): JsonResponse
    {
        $assignments = ReviewAssignment::where('reviewer_id', $request->user()->id)
            ->with('article.author')
            ->paginate(10);

        return $this->successResponse(
            $assignments,
            "Review assignments retrieved successfully"
        );
    }

    /**
     * Submit review decision (Reviewer) using assignment id
     */
    public function submitReviewDecision(StoreReviewDecisionRequest $request, ReviewAssignment $assignment): JsonResponse
    {
        $user = $request->user();

        if ($assignment->reviewer_id !== $user->id && $user->role !== 'admin') {
            return $this->forbiddenResponse('Not assigned as reviewer for this assignment');
        }

        $validated = $request->validated();

        $decision = ReviewDecision::create([
            'article_id' => $assignment->article_id,
            'reviewer_id' => $user->id,
            'decision' => $validated['decision'],
            'feedback' => $validated['feedback'] ?? null,
        ]);

        $statusMap = [
            'accept' => 'approved',
            'reject' => 'rejected',
            'request_revision' => 'revision_requested',
        ];

        $article = Article::find($assignment->article_id);
        if ($article && isset($statusMap[$validated['decision']])) {
            $article->update(['status' => $statusMap[$validated['decision']]]);
        }

        return $this->createdResponse(
            new ReviewDecisionResource($decision),
            "Review decision submitted successfully"
        );
    }

    /**
     * Submit review decision (Reviewer)
     */
    public function submitReview(StoreReviewDecisionRequest $request, Article $article): JsonResponse
    {
        $user = $request->user();

        $isReviewer = ReviewAssignment::where('article_id', $article->id)
            ->where('reviewer_id', $user->id)
            ->exists();

        if (!$isReviewer && $user->role !== 'admin') {
            return $this->forbiddenResponse("Not assigned as reviewer for this article");
        }

        $validated = $request->validated();

        $decision = ReviewDecision::create([
            'article_id' => $article->id,
            'reviewer_id' => $user->id,
            'decision' => $validated['decision'],
            'feedback' => $validated['feedback'] ?? null,
        ]);

        $statusMap = [
            'accept' => 'approved',
            'reject' => 'rejected',
            'request_revision' => 'revision_requested',
        ];

        $article->update(['status' => $statusMap[$validated['decision']]]);

        return $this->createdResponse(
            new ReviewDecisionResource($decision),
            "Review decision submitted successfully"
        );
    }

    /**
     * Approve a tracked change (Admin only)
     */
    public function approveChange(Request $request, ChangeTracker $change): JsonResponse
    {
        $this->authorize('approve', $change);

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
     * Reject a tracked change (Admin only)
     */
    public function rejectChange(Request $request, ChangeTracker $change): JsonResponse
    {
        $this->authorize('reject', $change);

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
     * Get all pending changes for an article (Admin only)
     */
    public function getPendingChanges(Article $article): JsonResponse
    {
        $this->authorize('viewAny', ChangeTracker::class);

        $changes = ChangeTracker::where('article_id', $article->id)
            ->where('status', 'pending')
            ->with('articleVersion')
            ->paginate(20);

        return $this->successResponse(
            $changes,
            "Pending changes retrieved successfully"
        );
    }
}