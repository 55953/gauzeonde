<?php

namespace App\Enums;

enum KycStatus: string
{
    case PENDING = 'pending';
    case VERIFIED = 'verified';
    case REJECTED = 'rejected';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
