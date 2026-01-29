<?php

namespace App\Enums;

enum ArticleStatus: string
{
    case DRAFT = 'draft';
    case SUBMITTED = 'submitted';
    case UNDER_REVIEW = 'under_review';
    case REJECTED = 'rejected';
    case REVISION_REQUESTED = 'revision_requested';
    case APPROVED = 'approved';
    case PUBLISHED = 'published';

    public function label(): string
    {
        return match ($this) {
            self::DRAFT => 'Draft',
            self::SUBMITTED => 'Submitted for Review',
            self::UNDER_REVIEW => 'Under Review',
            self::REJECTED => 'Rejected',
            self::REVISION_REQUESTED => 'Revision Requested',
            self::APPROVED => 'Approved',
            self::PUBLISHED => 'Published',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::DRAFT => 'gray',
            self::SUBMITTED => 'blue',
            self::UNDER_REVIEW => 'yellow',
            self::REJECTED => 'red',
            self::REVISION_REQUESTED => 'orange',
            self::APPROVED => 'green',
            self::PUBLISHED => 'purple',
        };
    }
}