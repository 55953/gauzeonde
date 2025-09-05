<?php

namespace App\Models;

use CodeIgniter\Model;


class UserModel extends Model
{
    protected $table      = 'users';
    protected $primaryKey = 'id';
    protected $allowedFields = [
        'name', 'email', 'phone', 'password', 'role', 'status', 'is_suspended', 'reason_of_suspension',
        'online', 'last_online_at',
        'vehicle_type', 'max_weight_kg', 'max_volume_cuft', 'max_length_cm', 'max_width_cm', 'max_height_cm',
        'kyc_status', 'rating',
        'activation_code', 'activation_expires', 'reset_token', 'reset_token_expires',
        'document_status', 'document_file',
        'created_at', 'updated_at'
    ];
    protected $useTimestamps = true;
}