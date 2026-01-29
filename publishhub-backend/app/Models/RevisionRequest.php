<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class RevisionRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'article_id',
        'requested_by',
        'requested_from',
        'reason',
        'status',
        'requested_at',
        'responded_at',
    ];

    protected $casts = [
        'requested_at' => 'datetime',
        'responded_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships
    public function article()
    {
        return $this->belongsTo(Article::class);
    }

    public function requestedBy()
    {
        return $this->belongsTo(User::class, 'requested_by');
    }

    public function requestedFrom()
    {
        return $this->belongsTo(User::class, 'requested_from');
    }
}
