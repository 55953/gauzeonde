<?php

namespace App\Models;

use CodeIgniter\Model;

class PaymentModel extends Model
{
    protected $table      = 'payments';
    protected $primaryKey = 'id';
    protected $allowedFields = [
        'shipment_id', 'payer_id', 'payee_id', 'amount', 'currency', 'status', 'payment_method', 'transaction_id', 'external_id', 'meta', 'created_at', 'updated_at'
    ];
    public $timestamps = false;
}