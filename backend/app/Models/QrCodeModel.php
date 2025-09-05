<?php

namespace App\Models;

use CodeIgniter\Model;

class QrCodeModel extends Model
{
    protected $table            = 'qr_codes';
    protected $primaryKey       = 'id';
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;

    // created_at exists, but not updated_at in baseline => no auto timestamps
    protected $useTimestamps    = false;

    protected $allowedFields    = [
        'code',
        'shipment_id',
        'driver_id',
        'status',        // active|used|expired|revoked
        'expires_at',
        'used_at',
        'created_at',
    ];

    public function findActiveByCode(string $code): ?array
    {
        return $this->where('code', $code)
            ->where('status', 'active')
            ->first();
    }

    public function markUsed(int $id): bool
    {
        return (bool) $this->update($id, [
            'status'  => 'used',
            'used_at' => date('Y-m-d H:i:s'),
        ]);
    }
}
