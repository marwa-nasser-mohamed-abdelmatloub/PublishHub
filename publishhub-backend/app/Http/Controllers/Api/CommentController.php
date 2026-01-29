<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Comment\StoreCommentRequest;
use App\Http\Resources\CommentResource;
use App\Http\Traits\ApiResponse;
use App\Models\Comment;
use App\Models\Article;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    use ApiResponse;

    /**
     * Get all comments for an article
     */
    public function index(Article $article): JsonResponse
    {
        $comments = $article->comments()
            ->with('reviewer')
            ->paginate(20);

        return $this->successResponse(
            CommentResource::collection($comments),
            "Comments retrieved successfully"
        );
    }

    /**
     * Store a newly created comment
     */
    public function store(StoreCommentRequest $request, Article $article): JsonResponse
    {
        $validated = $request->validated();
        $user = $request->user();

        $isAuthorized = $user->role === 'admin' ||
            $article->reviewAssignments()
            ->where('reviewer_id', $user->id)
            ->exists();

        if (!$isAuthorized) {
            return $this->forbiddenResponse("Not authorized to comment on this article");
        }

        $comment = Comment::create([
            'article_id' => $article->id,
            'reviewer_id' => $user->id,
            'selected_text' => $validated['selected_text'],
            'comment_text' => $validated['comment_text'],
            'highlight_color' => $validated['highlight_color'] ?? '#FFFF00',
            'start_position' => $validated['start_position'],
            'end_position' => $validated['end_position'],
            'status' => 'pending',
        ]);

        return $this->createdResponse(
            new CommentResource($comment),
            "Comment created successfully"
        );
    }

    /**
     * Display the specified comment
     */
    public function show(Article $article, Comment $comment): JsonResponse
    {
        if ($comment->article_id !== $article->id) {
            return $this->notFoundResponse("Comment not found");
        }

        return $this->successResponse(
            new CommentResource($comment->load('reviewer')),
            "Comment retrieved successfully"
        );
    }

    /**
     * Update a comment
     */
    public function update(Request $request, Article $article, Comment $comment): JsonResponse
    {
        if ($comment->article_id !== $article->id) {
            return $this->notFoundResponse("Comment not found");
        }

        $user = $request->user();

        if ($comment->reviewer_id !== $user->id && $user->role !== 'admin') {
            return $this->forbiddenResponse("Not authorized to update this comment");
        }

        $validated = $request->validate([
            'comment_text' => 'sometimes|string',
            'highlight_color' => 'sometimes|string',
            'status' => 'sometimes|in:pending,addressed',
        ]);

        $comment->update($validated);

        return $this->successResponse(
            new CommentResource($comment),
            "Comment updated successfully"
        );
    }

    /**
     * Delete a comment
     */
    public function destroy(Request $request, Article $article, Comment $comment): JsonResponse
    {
        if ($comment->article_id !== $article->id) {
            return $this->notFoundResponse("Comment not found");
        }

        $user = $request->user();

        if ($comment->reviewer_id !== $user->id && $user->role !== 'admin') {
            return $this->forbiddenResponse("Not authorized to delete this comment");
        }

        $comment->delete();
        return $this->successResponse(null, "Comment deleted successfully");
    }
}