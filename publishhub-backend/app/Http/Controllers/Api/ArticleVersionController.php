<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleVersionResource;
use App\Http\Traits\ApiResponse;
use App\Models\Article;
use App\Models\ArticleVersion;
use Illuminate\Http\JsonResponse;

class ArticleVersionController extends Controller
{
    use ApiResponse;

    /**
     * Display all versions of an article
     */
    public function index(Article $article): JsonResponse
    {
        $this->authorize('view', $article);

        $versions = $article->versions()
            ->with('creator', 'changeTrackers')
            ->orderBy('version_number', 'desc')
            ->paginate(10);

        return $this->successResponse(
            ArticleVersionResource::collection($versions),
            "Article versions retrieved successfully"
        );
    }

    /**
     * Display a specific article version
     */
    public function show(Article $article, ArticleVersion $version): JsonResponse
    {
        $this->authorize('view', $article);

        if ($version->article_id !== $article->id) {
            return $this->notFoundResponse("This version does not belong to this article");
        }

        return $this->successResponse(
            new ArticleVersionResource($version->load('creator', 'changeTrackers')),
            "Article version retrieved successfully"
        );
    }
}
