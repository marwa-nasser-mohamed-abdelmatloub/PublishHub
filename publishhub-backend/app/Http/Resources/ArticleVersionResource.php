<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ArticleVersionResource extends JsonResource
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
            'article_id' => $this->article_id,
            'version_number' => $this->version_number,
            'content' => $this->content,
            'changes_summary' => $this->changes_summary,
            'creator' => [
                'id' => $this->creator->id,
                'name' => $this->creator->name,
                'email' => $this->creator->email,
            ],
            'changes_count' => $this->changeTrackers_count ?? $this->changeTrackers()->count(),
            'created_at' => $this->created_at,
        ];
    }
}
