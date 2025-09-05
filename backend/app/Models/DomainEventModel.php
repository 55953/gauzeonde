<?php

namespace App\Models;

use CodeIgniter\Model;

class DomainEventModel extends Model
{
    protected $table            = 'domain_events';
    protected $primaryKey       = 'id';
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;

    // Only created_at in baseline
    protected $useTimestamps    = false;

    protected $allowedFields    = [
        'event_name',
        'entity_type',
        'entity_id',
        'payload',      // JSON text
        'created_at',
    ];

    public function record(string $eventName, ?string $entityType, ?int $entityId, array $payload = []): int
    {
        $this->insert([
            'event_name'  => $eventName,
            'entity_type' => $entityType,
            'entity_id'   => $entityId,
            'payload'     => json_encode($payload, JSON_UNESCAPED_SLASHES),
            'created_at'  => date('Y-m-d H:i:s'),
        ], true);

        return (int) $this->getInsertID();
    }

    public function findByEntity(string $entityType, int $entityId, int $limit = 200): array
    {
        return $this->where('entity_type', $entityType)
            ->where('entity_id', $entityId)
            ->orderBy('id', 'DESC')
            ->find($limit);
    }
}
