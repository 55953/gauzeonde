<?php

namespace App\Models;

use CodeIgniter\Model;

class ShipmentModel extends Model
{
    protected $table      = 'shipments';
    protected $primaryKey = 'id';
    protected $allowedFields = [
        'sender_id', 'tracking_number', 'description', 'origin', 'destination', 'weight', 'status',
        'driver_id', 'current_location', 'pickup_time', 'delivery_time', 'created_at', 'updated_at'
    ];
    protected $useTimestamps = true;
}