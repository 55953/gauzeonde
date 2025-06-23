<?php

namespace App\Models;

use CodeIgniter\Model;

class UserDocumentModel extends Model
{
    protected $table      = 'user_documents';
    protected $primaryKey = 'id';
    protected $allowedFields = [
        'user_id', 'type', 'file', 'status', 'uploaded_at', 'remarks'
    ];
    public $timestamps = false;
}
