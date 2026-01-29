<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ArticleVersion extends Model
{
    use HasFactory;

    protected $fillable = [
        'article_id',
        'content',
        'version_number',
        'changes_summary',
        'created_by',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships
    public function article()
    {
        return $this->belongsTo(Article::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function changeTrackers()
    {
        return $this->hasMany(ChangeTracker::class);
    }
}
