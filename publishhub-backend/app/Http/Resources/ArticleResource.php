<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ArticleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'content' => $this->content,
            'status' => $this->status,
            'version' => $this->version,
            'author' => [
                'id' => $this->author->id,
                'name' => $this->author->name,
                'email' => $this->author->email,
                'role' => $this->author->role,
            ],
            'versions_count' => $this->versions_count ?? $this->versions()->count(),
            'comments_count' => $this->comments_count ?? $this->comments()->count(),
            'review_assignments_count' => $this->reviewAssignments_count ?? $this->reviewAssignments()->count(),
            'latest_version' => new ArticleVersionResource($this->whenLoaded('versions', $this->versions()->latest()->first())),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
