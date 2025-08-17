<?php

namespace App\Models;

use CodeIgniter\Model;

class DriverLocationModel extends Model
{
    protected $table      = 'driver_locations';
    protected $primaryKey = 'id';

    protected $allowedFields = [
        'driver_id', 'latitude', 'longitude', 'speed','heading','updated_at','recorded_at'
    ];

    // Timestamps are managed manually
    public $timestamps = false;
}
