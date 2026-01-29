<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewAssignmentResource extends JsonResource
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
            'article' => [
                'id' => $this->article->id,
                'title' => $this->article->title,
                'status' => $this->article->status,
            ],
            'reviewer' => [
                'id' => $this->reviewer->id,
                'name' => $this->reviewer->name,
                'email' => $this->reviewer->email,
            ],
            'assigned_by' => [
                'id' => $this->assignedBy->id,
                'name' => $this->assignedBy->name,
            ],
            'status' => $this->status,
            'assigned_at' => $this->assigned_at,
            'completed_at' => $this->completed_at,
        ];
    }
}
