<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Relationships
    public function articles()
    {
        return $this->hasMany(Article::class, 'author_id');
    }

    public function reviewAssignments()
    {
        return $this->hasMany(ReviewAssignment::class, 'reviewer_id');
    }

    public function assignedReviews()
    {
        return $this->hasMany(ReviewAssignment::class, 'assigned_by');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class, 'reviewer_id');
    }

    public function articleVersions()
    {
        return $this->hasMany(ArticleVersion::class, 'created_by');
    }

    public function reviewedChanges()
    {
        return $this->hasMany(ChangeTracker::class, 'reviewed_by');
    }

    public function requestedRevisions()
    {
        return $this->hasMany(RevisionRequest::class, 'requested_by');
    }

    public function receivedRevisionRequests()
    {
        return $this->hasMany(RevisionRequest::class, 'requested_from');
    }

    public function reviewDecisions()
    {
        return $this->hasMany(ReviewDecision::class, 'reviewer_id');
    }
}
