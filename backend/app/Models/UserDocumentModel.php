<?php

namespace App\Models;

use CodeIgniter\Model;

class UserDocumentModel extends Model
{
    protected $table      = 'user_documents';
    protected $primaryKey = 'id';
    protected $allowedFields = [
        'user_id', 'type', 'file_path', 'mime_type', 'size_bytes', 'status', 'verified_by', 'verified_at', 'remarks', 'created_at', 'uploaded_at'
    ];
    public $timestamps = false;
}
