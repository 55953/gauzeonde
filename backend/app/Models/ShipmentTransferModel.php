<?php

namespace App\Models;

use CodeIgniter\Model;

class ShipmentTransferModel extends Model
{
    protected $table      = 'shipment_transfers';
    protected $primaryKey = 'id';
    protected $allowedFields = [
        'shipment_id', 'from_driver', 'to_driver', 'transfer_token', 'transferred_at'
    ];
    public $timestamps = false;
}


// namespace App\Models;

// use CodeIgniter\Model;


// class ShipmentTransferModel extends Model
// {
//     protected $table      = 'transfers';
//     protected $primaryKey = 'id';
//     protected $allowedFields = [
//         'shipment_id', 'from_driver', 'to_driver', 'transferred_at'
//     ];
//     protected $useTimestamps = true;
// }