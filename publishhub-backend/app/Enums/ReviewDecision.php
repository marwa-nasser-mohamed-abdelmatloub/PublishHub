<?php

namespace App\Enums;

enum ReviewDecision: string
{
    case ACCEPT = 'accept';
    case REJECT = 'reject';
    case REQUEST_REVISION = 'request_revision';

    public function label(): string
    {
        return match ($this) {
            self::ACCEPT => 'Accepted',
            self::REJECT => 'Rejected',
            self::REQUEST_REVISION => 'Revision Requested',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::ACCEPT => 'green',
            self::REJECT => 'red',
            self::REQUEST_REVISION => 'orange',
        };
    }
}