<?php

namespace App\Models;

use CodeIgniter\Model;

class TransactionModel extends Model
{
    protected $table            = 'transactions';
    protected $primaryKey       = 'id';
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;

    // Only created_at in baseline => no auto timestamps
    protected $useTimestamps    = false;

    protected $allowedFields    = [
        'user_id',
        'shipment_id',
        'type',           // debit|credit
        'amount',
        'currency',
        'reference',
        'description',
        'balance_after',
        'created_at',
    ];

    public function forUser(int $userId, int $limit = 200): array
    {
        return $this->where('user_id', $userId)
            ->orderBy('id', 'DESC')
            ->find($limit);
    }

    public function creditsForUserSum(int $userId): string
    {
        return (string) ($this->selectSum('amount')
                ->where('user_id', $userId)
                ->where('type', 'credit')
                ->get()->getRow('amount') ?? '0.00');
    }

    public function debitsForUserSum(int $userId): string
    {
        return (string) ($this->selectSum('amount')
                ->where('user_id', $userId)
                ->where('type', 'debit')
                ->get()->getRow('amount') ?? '0.00');
    }
}
