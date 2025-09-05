<?php

namespace App\Models;

use CodeIgniter\Model;

class WebhookDeliveryModel extends Model
{
    protected $table            = 'webhook_deliveries';
    protected $primaryKey       = 'id';
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;

    // Only created_at (and delivered_at) in baseline
    protected $useTimestamps    = false;

    protected $allowedFields    = [
        'webhook_id',
        'event',
        'payload',
        'response_status',
        'response_body',
        'attempt',
        'delivered_at',
        'created_at',
    ];

    public function recordAttempt(array $data): int
    {
        $this->insert($data, true);
        return (int) $this->getInsertID();
    }

    public function latestForWebhook(int $webhookId, int $limit = 50): array
    {
        return $this->where('webhook_id', $webhookId)
            ->orderBy('id', 'DESC')
            ->find($limit);
    }
}
