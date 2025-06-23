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
        'reset_token', 'reset_token_expires', 'kyc_status', 'rating', 'created_at', 'updated_at'
    ];
    protected $useTimestamps = true;
}