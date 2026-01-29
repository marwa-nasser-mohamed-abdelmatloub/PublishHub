<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ChangeTracker extends Model
{
    use HasFactory;

    protected $fillable = [
        'article_id',
        'old_content',
        'new_content',
        'status',
        'approved_by',
        'rejected_by',
        'approved_at',
        'rejected_at',
        'rejection_reason',
    ];

    protected $casts = [
        'approved_at' => 'datetime',
        'rejected_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships
    public function article()
    {
        return $this->belongsTo(Article::class);
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function rejectedBy()
    {
        return $this->belongsTo(User::class, 'rejected_by');
    }
}
