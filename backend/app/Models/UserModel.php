<?php

namespace App\Models;

use CodeIgniter\Model;


class UserModel extends Model
{
    protected $table      = 'users';
    protected $primaryKey = 'id';
    protected $allowedFields = [
        'name', 'email', 'phone', 'password', 'role', 'status', 'online', 'last_online_at',
        'document_status', 'document_file', 'activation_code', 'activation_expires',
        'reset_token', 'reset_token_expires', 'kyc_status', 'rating',
        'max_weight_kg','max_volume_cuft','max_length_cm','max_width_cm','max_height_cm','vehicle_type',
        'created_at', 'updated_at'
    ];
    protected $useTimestamps = true;
}