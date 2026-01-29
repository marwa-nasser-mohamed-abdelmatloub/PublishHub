<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Traits\ApiResponse;
use Illuminate\Http\Request;
use App\Models\Article;
use App\Models\User;

class ActivityController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        try {
            $activities = [];

            $articles = Article::latest()->take(5)->get();
            foreach ($articles as $article) {
                $type = 'article_submitted';
                $description = "Article '{$article->title}' submitted by " . ($article->author->name ?? 'Unknown');

                if ($article->status === 'approved') {
                    $type = 'article_approved';
                    $description = "Article '{$article->title}' was approved";
                } elseif ($article->status === 'rejected') {
                    $type = 'article_rejected';
                    $description = "Article '{$article->title}' was rejected";
                } elseif ($article->status === 'under_review') {
                    $type = 'article_reviewed';
                    $description = "Article '{$article->title}' is under review";
                }

                $activities[] = [
                    'id' => 'article_' . $article->id,
                    'type' => $type,
                    'description' => $description,
                    'timestamp' => optional($article->updated_at ?? $article->created_at)->toDateTimeString(),
                    'model' => 'article',
                    'model_id' => $article->id,
                    'user' => $article->author ? [
                        'id' => $article->author->id,
                        'name' => $article->author->name,
                        'email' => $article->author->email
                    ] : null
                ];
            }

            $users = User::latest()->take(3)->get();
            foreach ($users as $user) {
                $activities[] = [
                    'id' => 'user_' . $user->id,
                    'type' => 'user_registered',
                    'description' => "User '{$user->name}' registered",
                    'timestamp' => optional($user->created_at)->toDateTimeString(),
                    'model' => 'user',
                    'model_id' => $user->id,
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email
                    ]
                ];
            }

            usort($activities, function ($a, $b) {
                $timeA = strtotime($a['timestamp'] ?? '');
                $timeB = strtotime($b['timestamp'] ?? '');
                return $timeB <=> $timeA;
            });

            $activities = array_slice($activities, 0, 7);

            $responseData = [
                'activities' => $activities,
                'meta' => [
                    'total' => count($activities),
                    'types' => [
                        'article_submitted' => 'Article Submitted',
                        'article_approved' => 'Article Approved',
                        'article_rejected' => 'Article Rejected',
                        'article_reviewed' => 'Article Under Review',
                        'user_registered' => 'User Registered'
                    ]
                ]
            ];

            return $this->successResponse($responseData, 'Recent activity retrieved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse(
                'Failed to retrieve activity logs',
                ['error' => $e->getMessage()],
                500
            );
        }
    }

    /**
     * Get activity details for a specific model
     */
    public function show(Request $request, $type, $id)
    {
        try {
            $activity = null;

            if ($type === 'article') {
                $article = Article::find($id);
                if (!$article) {
                    return $this->notFoundResponse('Article not found');
                }

                $activity = [
                    'id' => 'article_' . $article->id,
                    'type' => 'article_details',
                    'title' => $article->title,
                    'description' => $article->content,
                    'status' => $article->status,
                    'created_at' => $article->created_at->toDateTimeString(),
                    'updated_at' => $article->updated_at->toDateTimeString(),
                    'author' => $article->author ? [
                        'id' => $article->author->id,
                        'name' => $article->author->name,
                        'email' => $article->author->email
                    ] : null
                ];
            } elseif ($type === 'user') {
                $user = User::find($id);
                if (!$user) {
                    return $this->notFoundResponse('User not found');
                }

                $activity = [
                    'id' => 'user_' . $user->id,
                    'type' => 'user_details',
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'created_at' => $user->created_at->toDateTimeString(),
                    'articles_count' => $user->articles()->count()
                ];
            } else {
                return $this->errorResponse('Invalid activity type');
            }

            return $this->successResponse($activity, 'Activity details retrieved successfully');
        } catch (\Exception $e) {
            return $this->errorResponse(
                'Failed to retrieve activity details',
                ['error' => $e->getMessage()],
                500
            );
        }
    }

    /**
     * Get activities by type
     */
    public function byType(Request $request, $type)
    {
        try {
            $activities = [];
            $validTypes = ['article', 'user'];

            if (!in_array($type, $validTypes)) {
                return $this->errorResponse('Invalid activity type');
            }

            if ($type === 'article') {
                $articles = Article::latest()->take(10)->get();
                foreach ($articles as $article) {
                    $activities[] = [
                        'id' => 'article_' . $article->id,
                        'title' => $article->title,
                        'status' => $article->status,
                        'timestamp' => optional($article->updated_at ?? $article->created_at)->toDateTimeString(),
                        'author' => $article->author ? $article->author->name : 'Unknown'
                    ];
                }
            } elseif ($type === 'user') {
                $users = User::latest()->take(10)->get();
                foreach ($users as $user) {
                    $activities[] = [
                        'id' => 'user_' . $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'timestamp' => $user->created_at->toDateTimeString(),
                        'articles_count' => $user->articles()->count()
                    ];
                }
            }

            return $this->successResponse(
                ['activities' => $activities, 'type' => $type],
                ucfirst($type) . ' activities retrieved successfully'
            );
        } catch (\Exception $e) {
            return $this->errorResponse(
                'Failed to retrieve activities',
                ['error' => $e->getMessage()],
                500
            );
        }
    }

    /**
     * Clear old activities (simulated)
     */
    public function clearOld(Request $request)
    {
        try {

            $days = $request->input('days', 30);

            return $this->successResponse(
                null,
                "Activities older than {$days} days would be cleared (simulated)"
            );
        } catch (\Exception $e) {
            return $this->errorResponse(
                'Failed to clear activities',
                ['error' => $e->getMessage()],
                500
            );
        }
    }
}