<?php

namespace App\Models;

use CodeIgniter\Model;

class ItineraryModel extends Model
{
    protected $table      = 'itineraries';
    protected $primaryKey = 'id';
    protected $allowedFields = [
        'driver_id', 'title', 'origin', 'destination', 'start_lat', 'start_lng', 'end_lat', 'end_lng', 'departure_time', 'arrival_time', 'status', 'vehicle_details', 'polyline', 'created_at', 'updated_at'
    ];
    public $timestamps = false;
}