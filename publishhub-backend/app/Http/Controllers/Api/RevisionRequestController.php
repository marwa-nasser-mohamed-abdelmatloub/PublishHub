<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Review\StoreRevisionRequest;
use App\Http\Resources\RevisionRequestResource;
use App\Http\Traits\ApiResponse;
use App\Models\Article;
use App\Models\RevisionRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RevisionRequestController extends Controller
{
    use ApiResponse;

    /**
     * Get all revision requests (Admin)
     */
    public function index(): JsonResponse
    {
        $revisions = RevisionRequest::query()
            ->with('article', 'requestedBy', 'requestedFrom')
            ->paginate(10);

        return $this->successResponse(
            RevisionRequestResource::collection($revisions),
            "Revision requests retrieved successfully"
        );
    }

    /**
     * Create a new revision request (Admin)
     */
    public function store(StoreRevisionRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $article = Article::findOrFail($validated['article_id']);

        $revision = RevisionRequest::create([
            'article_id' => $article->id,
            'requested_by' => $request->user()->id,
            'requested_from' => $article->author_id,
            'reason' => $validated['reason'],
            'status' => 'pending',
            'requested_at' => now(),
        ]);

        $article->update(['status' => 'revision_requested']);

        return $this->createdResponse(
            new RevisionRequestResource($revision->load('article', 'requestedBy', 'requestedFrom')),
            "Revision request created successfully"
        );
    }

    /**
     * Show a specific revision request
     */
    public function show(RevisionRequest $revision): JsonResponse
    {
        return $this->successResponse(
            new RevisionRequestResource($revision->load('article', 'requestedBy', 'requestedFrom')),
            "Revision request retrieved successfully"
        );
    }

    /**
     * Approve a revision request (Author)
     */
    public function approve(RevisionRequest $revision): JsonResponse
    {
        $this->authorize('approve', $revision);

        $revision->update([
            'status' => 'approved',
            'responded_at' => now(),
        ]);

        return $this->successResponse(
            new RevisionRequestResource($revision),
            "Revision request approved successfully"
        );
    }

    /**
     * Reject a revision request (Admin)
     */
    public function reject(RevisionRequest $revision): JsonResponse
    {
        $this->authorize('reject', $revision);

        $revision->update([
            'status' => 'rejected',
            'responded_at' => now(),
        ]);

        return $this->successResponse(
            new RevisionRequestResource($revision),
            "Revision request rejected successfully"
        );
    }

    /**
     * Get my revision requests (Author)
     */
    public function myRequests(Request $request): JsonResponse
    {
        $revisions = RevisionRequest::where('requested_from', $request->user()->id)
            ->with('article', 'requestedBy')
            ->paginate(10);

        return $this->successResponse(
            RevisionRequestResource::collection($revisions),
            "My revision requests retrieved successfully"
        );
    }

    /**
     * Complete a revision request (Author marks as done)
     */
    public function completeRevision(Request $request, RevisionRequest $revision): JsonResponse
    {
        if ($revision->requested_from !== $request->user()->id) {
            return $this->forbiddenResponse("Not authorized to complete this revision request");
        }

        $revision->update(['status' => 'approved']);
        $revision->article->update(['status' => 'draft']);

        return $this->successResponse(
            new RevisionRequestResource($revision),
            "Article updated based on revision request successfully"
        );
    }
}