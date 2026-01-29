<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChangeTrackerResource extends JsonResource
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
            'article_version_id' => $this->article_version_id,
            'change_type' => $this->change_type,
            'status' => $this->status,
            'old_text' => $this->old_text,
            'new_text' => $this->new_text,
            'position' => $this->position,
            'reviewed_by' => $this->reviewed_by ? [
                'id' => $this->reviewer?->id,
                'name' => $this->reviewer?->name,
            ] : null,
            'reviewed_at' => $this->reviewed_at,
            'created_at' => $this->created_at,
        ];
    }
}
