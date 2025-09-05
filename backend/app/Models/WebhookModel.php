<?php

namespace App\Models;

use CodeIgniter\Model;

class WebhookModel extends Model
{
    protected $table            = 'webhooks';
    protected $primaryKey       = 'id';
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;

    // Only created_at in baseline
    protected $useTimestamps    = false;

    protected $allowedFields    = [
        'event',        // e.g. shipment.status_changed
        'target_url',
        'secret',
        'active',
        'created_at',
    ];

    public function activeForEvent(string $event): array
    {
        return $this->where('event', $event)
            ->where('active', true)
            ->findAll();
    }
}
