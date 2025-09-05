<?php

namespace App\Models;

use CodeIgniter\Model;

class ShipmentLocationModel extends Model
{
    protected $table            = 'shipment_locations';
    protected $primaryKey       = 'id';
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;

    // This table has recorded_at, not created_at/updated_at
    protected $useTimestamps    = false;

    protected $allowedFields    = [
        'shipment_id',
        'driver_id',
        'latitude',
        'longitude',
        'source',
        'recorded_at',
    ];

    // Convenience scopes/helpers
    public function latestForShipment(int $shipmentId): ?array
    {
        return $this->where('shipment_id', $shipmentId)
            ->orderBy('recorded_at', 'DESC')
            ->first();
    }

    public function listForShipment(int $shipmentId, int $limit = 500): array
    {
        return $this->where('shipment_id', $shipmentId)
            ->orderBy('recorded_at', 'DESC')
            ->find($limit);
    }

    public function createPoint(array $data): int
    {
        $this->insert($data, true);
        return (int) $this->getInsertID();
    }
}
