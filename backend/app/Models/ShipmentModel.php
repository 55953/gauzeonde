<?php

namespace App\Models;

use CodeIgniter\Model;

class ShipmentModel extends Model
{
    protected $table      = 'shipments';
    protected $primaryKey = 'id';
    protected $allowedFields = [
        'sender_id', 'tracking_number', 'status', 'description', 'origin', 'destination', 
        'driver_id', 'current_location', 'pickup_time', 'delivery_time',
        'weight_kg','volume_cuft','length_cm','width_cm','height_cm',
        'created_at', 'updated_at'
    ];
    protected $useTimestamps = true;
}