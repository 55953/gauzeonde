<?php

namespace App\Models;

use CodeIgniter\Model;

class PayoutModel extends Model
{
    protected $table            = 'payouts';
    protected $primaryKey       = 'id';
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;

    // Has created_at, updated_at
    protected $useTimestamps    = true;
    protected $createdField     = 'created_at';
    protected $updatedField     = 'updated_at';
    protected $dateFormat       = 'datetime';

    protected $allowedFields    = [
        'driver_id',
        'period_start',
        'period_end',
        'amount',
        'currency',
        'status',        // pending|processing|paid|failed
        'external_id',
        'created_at',
        'updated_at',
    ];

    public function forDriver(int $driverId, int $limit = 100): array
    {
        return $this->where('driver_id', $driverId)
            ->orderBy('period_end', 'DESC')
            ->find($limit);
    }

    public function markPaid(int $id, ?string $externalId = null): bool
    {
        return (bool) $this->update($id, [
            'status'      => 'paid',
            'external_id' => $externalId,
        ]);
    }
}
