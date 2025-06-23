<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\NotificationModel;

class Notifications extends ResourceController
{
    public function index($user_id = null)
    {
        if (!$user_id) return $this->failNotFound();
        $model = new NotificationModel();
        $notifications = $model->where('user_id', $user_id)->orderBy('created_at', 'desc')->findAll();
        return $this->respond($notifications);
    }

    public function markAsRead($id = null)
    {
        $model = new NotificationModel();
        $notification = $model->find($id);
        if (!$notification) return $this->failNotFound();
        $model->update($id, ['is_read' => true]);
        return $this->respond(['success' => true]);
    }

    public function store()
    {
        $rules = [
            'user_id' => 'required|is_natural_no_zero',
            'content' => 'required',
            'type' => 'permit_empty'
        ];
        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }
        $model = new NotificationModel();
        $data = [
            'user_id' => $this->request->getVar('user_id'),
            'type' => $this->request->getVar('type'),
            'content' => $this->request->getVar('content'),
        ];
        $model->insert($data);
        return $this->respondCreated($data);
    }
}
