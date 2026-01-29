<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\ReviewDecisionResource;
use App\Http\Traits\ApiResponse;
use App\Models\Article;
use App\Models\ArticleVersion;
use App\Models\ChangeTracker;
use App\Models\ReviewAssignment;
use App\Models\ReviewDecision;
use App\Models\RevisionRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ArticleWorkflowController extends Controller
{
    use ApiResponse;

    /**
     * Approve article for review (Admin only)
     */
    public function approveArticle(Article $article): JsonResponse
    {
        $this->authorize('update', $article);

        if ($article->status !== 'submitted') {
            return $this->errorResponse("Article is not in submitted status", 400);
        }

        $article->update(['status' => 'approved']);

        return $this->successResponse(
            new ArticleResource($article),
            "Article approved for review"
        );
    }

    /**
     * Reject article (Admin only)
     */
    public function rejectArticle(Request $request, Article $article): JsonResponse
    {
        $this->authorize('update', $article);

        $request->validate(['reason' => 'required|string']);

        $article->update([
            'status' => 'rejected'
        ]);

        return $this->successResponse(
            new ArticleResource($article),
            "Article rejected"
        );
    }

    /**
     * Assign article to reviewer (Admin only)
     */
    public function assignReviewer(Request $request, Article $article): JsonResponse
    {
        $this->authorize('update', $article);

        $request->validate(['reviewer_id' => 'required|exists:users,id']);

        $reviewer_id = $request->input('reviewer_id');

        // Check if already assigned to this reviewer
        $existing = ReviewAssignment::where('article_id', $article->id)
            ->where('reviewer_id', $reviewer_id)
            ->first();

        if ($existing) {
            return $this->errorResponse("Reviewer already assigned to this article", 400);
        }

        ReviewAssignment::create([
            'article_id' => $article->id,
            'reviewer_id' => $reviewer_id,
            'assigned_by' => $request->user()->id,
            'assigned_at' => now(),
            'status' => 'assigned'
        ]);

        $article->update(['status' => 'under_review']);

        return $this->successResponse(
            new ArticleResource($article->load('reviewAssignments.reviewer')),
            "Reviewer assigned successfully"
        );
    }

    /**
     * Get tracked changes between versions (Admin & Author)
     */
    public function getChanges(Article $article): JsonResponse
    {
        $changes = ChangeTracker::where('article_id', $article->id)
            ->with('approvedBy', 'rejectedBy')
            ->get();

        return $this->successResponse(
            $changes,
            "Changes retrieved successfully"
        );
    }

    /**
     * Approve specific change (Admin only)
     */
    public function approveChange(Request $request, Article $article, ChangeTracker $change): JsonResponse
    {
        $this->authorize('update', $article);

        if ($change->article_id !== $article->id) {
            return $this->errorResponse("Change does not belong to this article", 403);
        }

        if ($change->status !== 'pending') {
            return $this->errorResponse("Change is not pending", 400);
        }

        $change->update([
            'status' => 'approved',
            'approved_at' => now(),
            'approved_by' => $request->user()->id
        ]);

        $pendingChanges = ChangeTracker::where('article_id', $article->id)
            ->where('status', 'pending')
            ->count();

        if ($pendingChanges === 0) {
            $article->update(['status' => 'ready_for_review']);
        }

        return $this->successResponse(
            $change,
            "Change approved successfully"
        );
    }

    /**
     * Reject specific change (Admin only)
     */
    public function rejectChange(Request $request, Article $article, ChangeTracker $change): JsonResponse
    {
        $this->authorize('update', $article);

        $request->validate(['reason' => 'required|string']);

        if ($change->article_id !== $article->id) {
            return $this->errorResponse("Change does not belong to this article", 403);
        }

        if ($change->status !== 'pending') {
            return $this->errorResponse("Change is not pending", 400);
        }

        $change->update([
            'status' => 'rejected',
            'rejected_at' => now(),
            'rejected_by' => $request->user()->id,
            'rejection_reason' => $request->input('reason')
        ]);

        return $this->successResponse(
            $change,
            "Change rejected successfully"
        );
    }

    /**
     * Compare two article versions (Admin & Author)
     */
    public function compareVersions(Article $article, Request $request): JsonResponse
    {
        $request->validate([
            'version_from' => 'required|integer',
            'version_to' => 'required|integer'
        ]);

        $versionFrom = ArticleVersion::where('article_id', $article->id)
            ->where('version_number', $request->input('version_from'))
            ->first();

        $versionTo = ArticleVersion::where('article_id', $article->id)
            ->where('version_number', $request->input('version_to'))
            ->first();

        if (!$versionFrom || !$versionTo) {
            return $this->errorResponse("One or both versions not found", 404);
        }

        $changes = $this->generateDiff($versionFrom->content, $versionTo->content);

        return $this->successResponse(
            [
                'version_from' => $versionFrom->version_number,
                'version_to' => $versionTo->version_number,
                'changes' => $changes
            ],
            "Versions compared successfully"
        );
    }

    /**
     * Submit review decision (Reviewer only)
     */
    public function submitReview(Request $request, Article $article): JsonResponse
    {
        $user = $request->user();

        if ($user->role !== 'reviewer') {
            return $this->errorResponse("Only reviewers can submit reviews", 403);
        }

        $validated = $request->validate([
            'decision' => 'required|in:accept,reject,request_revision',
            'feedback' => 'nullable|string|max:1000'
        ]);

        if (
            in_array($validated['decision'], ['reject', 'request_revision']) &&
            (!$validated['feedback'] || strlen($validated['feedback']) < 10)
        ) {
            return $this->errorResponse(
                'Feedback is required and must be at least 10 characters',
                422
            );
        }

        $assignment = ReviewAssignment::where('article_id', $article->id)
            ->where('reviewer_id', $user->id)
            ->firstOrFail();

        $decision = ReviewDecision::create([
            'article_id' => $article->id,
            'reviewer_id' => $user->id,
            'decision' => $validated['decision'],
            'feedback' => $validated['feedback'],
        ]);

        $statusMap = [
            'accept' => 'approved',
            'reject' => 'rejected',
            'request_revision' => 'revision_requested',
        ];

        $article->update(['status' => $statusMap[$request->input('decision')]]);

        return $this->successResponse(
            new ReviewDecisionResource($decision),
            "Review submitted successfully"
        );
    }

    /**
     * Request revision (Author only)
     */
    public function requestRevision(Request $request, Article $article): JsonResponse
    {
        $user = $request->user();

        if ($article->author_id !== $user->id) {
            return $this->errorResponse("Only article author can request revision", 403);
        }

        if ($article->status !== 'review_rejected') {
            return $this->errorResponse("Can only request revision for rejected articles", 400);
        }

        $request->validate(['reason' => 'required|string']);

        RevisionRequest::create([
            'article_id' => $article->id,
            'author_id' => $user->id,
            'reason' => $request->input('reason'),
            'status' => 'pending',
            'requested_at' => now()
        ]);

        $article->update(['status' => 'revision_pending']);

        return $this->successResponse(
            new ArticleResource($article),
            "Revision request submitted"
        );
    }

    /**
     * Approve revision request (Admin only)
     */
    public function approveRevision(Article $article): JsonResponse
    {
        $this->authorize('update', $article);

        $revisionRequest = RevisionRequest::where('article_id', $article->id)
            ->where('status', 'pending')
            ->first();

        if (!$revisionRequest) {
            return $this->errorResponse("No pending revision request found", 404);
        }

        $revisionRequest->update([
            'status' => 'approved',
            'approved_at' => now()
        ]);

        $article->update(['status' => 'revision_approved']);

        return $this->successResponse(
            new ArticleResource($article),
            "Revision approved"
        );
    }

    /**
     * Reject revision request (Admin only)
     */
    public function rejectRevision(Request $request, Article $article): JsonResponse
    {
        $this->authorize('update', $article);

        $request->validate(['reason' => 'required|string']);

        $revisionRequest = RevisionRequest::where('article_id', $article->id)
            ->where('status', 'pending')
            ->first();

        if (!$revisionRequest) {
            return $this->errorResponse("No pending revision request found", 404);
        }

        $revisionRequest->update([
            'status' => 'rejected',
            'rejected_at' => now(),
            'rejection_reason' => $request->input('reason')
        ]);

        $article->update(['status' => 'rejected']);

        return $this->successResponse(
            new ArticleResource($article),
            "Revision rejected"
        );
    }

    /**
     * Re-assign article to reviewer after changes approved (Admin only)
     */
    public function reassignToReviewer(Request $request, Article $article): JsonResponse
    {
        $this->authorize('update', $article);

        $request->validate(['reviewer_id' => 'required|exists:users,id']);

        $lastAssignment = ReviewAssignment::where('article_id', $article->id)
            ->where('status', 'completed')
            ->latest()
            ->first();

        if (!$lastAssignment) {
            return $this->errorResponse("No previous review assignment found", 404);
        }

        ReviewAssignment::create([
            'article_id' => $article->id,
            'reviewer_id' => $request->input('reviewer_id'),
            'assigned_by' => $request->user()->id,
            'assigned_at' => now(),
            'status' => 'assigned'
        ]);

        $article->update(['status' => 'under_review']);

        return $this->successResponse(
            new ArticleResource($article->load('reviewAssignments.reviewer')),
            "Article reassigned for review"
        );
    }

    /**
     * Publish article (Admin only)
     */
    public function publishArticle(Article $article): JsonResponse
    {
        $this->authorize('update', $article);

        if ($article->status !== 'approved') {
            return $this->errorResponse(
                "Article must be approved by reviewer before publishing",
                400
            );
        }

        $article->update(['status' => 'published']);

        return $this->successResponse(
            new ArticleResource($article),
            "Article published successfully"
        );
    }

    /**
     * Generate diff between two texts
     */
    private function generateDiff($oldText, $newText): array
    {
        $oldLines = explode("\n", $oldText);
        $newLines = explode("\n", $newText);

        $changes = [];
        $maxLines = max(count($oldLines), count($newLines));

        for ($i = 0; $i < $maxLines; $i++) {
            $old = $oldLines[$i] ?? '';
            $new = $newLines[$i] ?? '';

            if ($old !== $new) {
                $changes[] = [
                    'type' => 'modified',
                    'line' => $i + 1,
                    'old' => $old,
                    'new' => $new
                ];
            }
        }

        return $changes;
    }
}
