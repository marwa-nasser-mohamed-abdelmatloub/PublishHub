<?php

namespace App\Enums;

enum UserRole: string
{
    case ADMIN = 'admin';
    case AUTHOR = 'author';
    case REVIEWER = 'reviewer';

    public function label(): string
    {
        return match ($this) {
            self::ADMIN => 'Admin',
            self::AUTHOR => 'Author',
            self::REVIEWER => 'Reviewer',
        };
    }
}