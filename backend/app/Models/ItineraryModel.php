<?php

namespace App\Models;

use CodeIgniter\Model;

class ItineraryModel extends Model
{
    protected $table      = 'itineraries';
    protected $primaryKey = 'id';
    protected $allowedFields = [
        'user_id', 'origin', 'destination', 'departure_time', 'arrival_time', 'vehicle_details', 'status', 'created_at'
    ];
    public $timestamps = false;
}