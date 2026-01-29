<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Article\StoreArticleRequest;
use App\Http\Requests\Article\UpdateArticleRequest;
use App\Http\Requests\Article\AssignReviewerRequest;
use App\Http\Resources\ArticleResource;
use App\Http\Traits\ApiResponse;
use App\Models\Article;
use App\Models\ArticleVersion;
use App\Models\ReviewAssignment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    use ApiResponse;
    /**
     * Display a listing of articles
     */
    public function index(Request $request): JsonResponse
    {
        $query = Article::query();

        $user = $request->user();

        if ($user->role === 'author') {
            $query->where('author_id', $user->id);
        } elseif ($user->role === 'reviewer') {
            $query->whereHas('reviewAssignments', function ($q) use ($user) {
                $q->where('reviewer_id', $user->id);
            });
        }

        $articles = $query->with('author', 'reviewAssignments.reviewer')
            ->paginate(10);

        return $this->successResponse(
            ArticleResource::collection($articles),
            "Articles retrieved successfully"
        );
    }

    /**
     * Store a newly created article
     */
    public function store(StoreArticleRequest $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validated();

        $article = Article::create([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'status' => 'draft',
            'author_id' => $user->id,
            'version' => 1,
        ]);

        // Create initial version
        ArticleVersion::create([
            'article_id' => $article->id,
            'content' => $validated['content'],
            'version_number' => 1,
            'changes_summary' => 'Initial version',
            'created_by' => $user->id,
        ]);

        return $this->createdResponse(
            new ArticleResource($article->load('author')),
            "Article created successfully"
        );
    }

    /**
     * Display the specified article
     */
    public function show(Article $article): JsonResponse
    {
        $this->authorize('view', $article);

        return $this->successResponse(
            new ArticleResource($article->load('author', 'versions', 'comments', 'reviewAssignments.reviewer')),
            "Article retrieved successfully"
        );
    }

    /**
     * Update the specified article
     */
    public function update(UpdateArticleRequest $request, Article $article): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validated();

        // Create new version if content changed
        if (isset($validated['content']) && $article->content !== $validated['content']) {
            $article->version += 1;
            ArticleVersion::create([
                'article_id' => $article->id,
                'content' => $validated['content'],
                'version_number' => $article->version,
                'changes_summary' => 'Article updated',
                'created_by' => $user->id,
            ]);
        }

        $article->update($validated);

        return $this->successResponse(
            new ArticleResource($article),
            "Article updated successfully"
        );
    }

    /**
     * Delete the specified article
     */
    public function destroy(Article $article): JsonResponse
    {
        $this->authorize('delete', $article);

        $article->delete();
        return $this->successResponse(null, "Article deleted successfully");
    }

    /**
     * Submit article for review
     */
    public function submit(Article $article): JsonResponse
    {
        $this->authorize('submit', $article);

        $article->update(['status' => 'submitted']);
        return $this->successResponse(
            new ArticleResource($article),
            "Article submitted for review successfully"
        );
    }

    /**
     * Get articles pending admin approval (Admin only)
     */
    public function pendingApproval(): JsonResponse
    {
        $articles = Article::whereIn('status', ['submitted', 'under_review', 'revision_requested'])
            ->with('author')
            ->paginate(10);

        return $this->successResponse(
            ArticleResource::collection($articles),
            "Pending articles retrieved successfully"
        );
    }

    /**
     * Approve article (Admin only)
     */
    public function approve(Article $article): JsonResponse
    {
        $this->authorize('approve', $article);

        $article->update(['status' => 'approved']);
        return $this->successResponse(
            new ArticleResource($article),
            "Article approved successfully"
        );
    }

    /**
     * Reject article (Admin only)
     */
    public function reject(Article $article): JsonResponse
    {
        $this->authorize('reject', $article);

        $article->update(['status' => 'rejected']);
        return $this->successResponse(
            new ArticleResource($article),
            "Article rejected successfully"
        );
    }

    /**
     * Assign reviewer to article (Admin only)
     */
    public function assignReviewer(AssignReviewerRequest $request, Article $article): JsonResponse
    {
        $user = $request->user();

        $this->authorize('update', $article);

        $validated = $request->validated();

        ReviewAssignment::create([
            'article_id' => $article->id,
            'reviewer_id' => $validated['reviewer_id'],
            'assigned_by' => $user->id,
            'assigned_at' => now(),
            'status' => 'assigned',
        ]);

        $article->update(['status' => 'under_review']);

        return $this->successResponse(
            new ArticleResource($article),
            "Reviewer assigned successfully"
        );
    }
}