<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Article extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'content',
        'status',
        'author_id',
        'version',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    // Relationships
    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function versions()
    {
        return $this->hasMany(ArticleVersion::class);
    }

    public function reviewAssignments()
    {
        return $this->hasMany(ReviewAssignment::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function reviewDecisions()
    {
        return $this->hasMany(ReviewDecision::class);
    }

    public function changeTrackers()
    {
        return $this->hasMany(ChangeTracker::class);
    }

    public function revisionRequests()
    {
        return $this->hasMany(RevisionRequest::class);
    }
}
