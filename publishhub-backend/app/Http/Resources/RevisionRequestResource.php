<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RevisionRequestResource extends JsonResource
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
            'requested_by' => [
                'id' => $this->requestedBy->id,
                'name' => $this->requestedBy->name,
                'role' => $this->requestedBy->role,
            ],
            'requested_from' => [
                'id' => $this->requestedFrom->id,
                'name' => $this->requestedFrom->name,
                'email' => $this->requestedFrom->email,
            ],
            'reason' => $this->reason,
            'status' => $this->status,
            'requested_at' => $this->requested_at,
            'responded_at' => $this->responded_at,
            'created_at' => $this->created_at,
        ];
    }
}
