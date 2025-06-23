<?php

namespace App\Models;

use CodeIgniter\Model;

class NotificationModel extends Model
{
    protected $table      = 'notifications';
    protected $primaryKey = 'id';
    protected $allowedFields = [
        'user_id', 'type', 'content', 'is_read', 'created_at'
    ];
    public $timestamps = false;
}