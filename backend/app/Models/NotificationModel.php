<?php

namespace App\Models;

use CodeIgniter\Model;

class NotificationModel extends Model
{
    protected $table      = 'notifications';
    protected $primaryKey = 'id';
    protected $allowedFields = [
        'user_id', 'type', 'title', 'body', 'channel', 'status', 'is_read', 'meta', 'sent_at','created_at'
    ];
    public $timestamps = false;
}