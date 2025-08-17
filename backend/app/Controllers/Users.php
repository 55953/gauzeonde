<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\UserModel;
use App\Enums\UserStatus;
use App\Enums\DocumentStatus;
use App\Enums\KycStatus;
use App\Models\UserDocumentModel;
use App\Services\AuthService;

class Users extends ResourceController
{
    /**
     * Get user profile by ID
     * GET /api/user/{id}
     */
    public function show($userId = null)
    {
        $user = (new UserModel())->find($userId);
        if (!$user) {
            return $this->failNotFound('User not found');
        }
        unset($user['password']);
        return $this->respond($user);
    }

    /**
     * Update user status, document status, KYC status, online, and rating
     * PATCH /api/user/{id}/status
     * Admin only
     */
    public function updateStatus($userId = null)
    {
        if (!$userId) return $this->failValidationErrors(['message' => 'User ID required']);
        $input = $this->request->getJSON(true);

        $rules = [
            'status'         => 'permit_empty|in_list[' . implode(',', UserStatus::values()) . ']',
            'online'         => 'permit_empty|in_list[0,1]',
            'document_status'=> 'permit_empty|in_list[' . implode(',', DocumentStatus::values()) . ']',
            'kyc_status'     => 'permit_empty|in_list[' . implode(',', KycStatus::values()) . ']',
            'rating'         => 'permit_empty|decimal'
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $data = [];
        foreach ($rules as $field => $rule) {
            if (isset($input[$field])) {
                $data[$field] = $input[$field];
            }
        }

        (new UserModel())->update($userId, $data);

        return $this->respond(['message' => 'User updated']);
    }

    /**
     * List users, filter by role, status, KYC, online, etc
     * GET /api/users?role=driver&status=active&kyc_status=verified
     */
    public function index()
    {
        $model = new UserModel();
        $filters = $this->request->getGet();

        if (isset($filters['role'])) {
            $model->where('role', $filters['role']);
        }
        if (isset($filters['status'])) {
            $model->where('status', $filters['status']);
        }
        if (isset($filters['kyc_status'])) {
            $model->where('kyc_status', $filters['kyc_status']);
        }
        if (isset($filters['document_status'])) {
            $model->where('document_status', $filters['document_status']);
        }
        if (isset($filters['online'])) {
            $model->where('online', (bool)$filters['online']);
        }

        $users = $model->findAll();
        foreach ($users as &$u) unset($u['password']);
        return $this->respond($users);
    }

    /**
     * Set online/offline status (driver updates via app)
     * PATCH /api/user/{id}/online
     */
    public function updateOnline($userId = null)
    {
        if (!$userId) return $this->failValidationErrors(['message' => 'User ID required']);
        $input = $this->request->getJSON(true);

        $rules = [
            'online' => 'required|in_list[0,1]',
        ];
        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $data = [
            'online' => (bool)$input['online'],
            'last_online_at' => date('Y-m-d H:i:s')
        ];
        (new UserModel())->update($userId, $data);

        return $this->respond(['message' => 'Online status updated']);
    }

    /**
     * Admin blocks a user
     * PATCH /api/user/{id}/block
     */
    public function block($userId = null)
    {
        if (!$userId) return $this->failValidationErrors(['message' => 'User ID required']);
        (new UserModel())->update($userId, ['status' => 'blocked']);
        return $this->respond(['message' => 'User blocked']);
    }

    /**
     * Admin unblocks a user
     * PATCH /api/user/{id}/unblock
     */
    public function unblock($userId = null)
    {
        if (!$userId) return $this->failValidationErrors(['message' => 'User ID required']);
        (new UserModel())->update($userId, ['status' => 'active']);
        return $this->respond(['message' => 'User unblocked']);
    }

    /**
     * Get all allowed user/document/KYC statuses (for forms/UI)
     * GET /api/user/status-options
     */
    public function statusOptions()
    {
        return $this->respond([
            'user_statuses'      => UserStatus::values(),
            'document_statuses'  => DocumentStatus::values(),
            'kyc_statuses'       => KycStatus::values(),
        ]);
    }

    // public function uploadDocument($userId = null)
    // {
    //     if (!$userId) return $this->failValidationErrors(['message' => 'User ID required']);

    //     $file = $this->request->getFile('document');
    //     if (!$file || !$file->isValid()) {
    //         return $this->failValidationErrors(['document' => 'Document file required']);
    //     }

    //     // Validate file type/size (adjust as needed)
    //     $rules = [
    //         'document' => 'uploaded[document]|max_size[document,4096]|ext_in[document,png,jpg,jpeg,pdf]'
    //     ];
    //     if (!$this->validate($rules)) {
    //         return $this->failValidationErrors($this->validator->getErrors());
    //     }

    //     $newName = $userId . '_' . time() . '.' . $file->getExtension();
    //     $path = WRITEPATH . 'uploads/documents/';
    //     if (!is_dir($path)) {
    //         mkdir($path, 0777, true);
    //     }
    //     $file->move($path, $newName);

    //     // Save to DB (filename, status = pending)
    //     (new UserModel())->update($userId, [
    //         'document_file' => $newName,
    //         'document_status' => 'pending'
    //     ]);

    //     return $this->respond(['message' => 'Document uploaded, pending review']);
    // }

    public function uploadDocument($userId = null)
    {
        if (!$userId) return $this->failValidationErrors(['message' => 'User ID required']);

        $docType = $this->request->getVar('type'); // e.g. profile_picture, driver_license, insurance
        $file = $this->request->getFile('document');
        if (!$file || !$file->isValid() || !$docType) {
            return $this->failValidationErrors(['document' => 'File and type are required']);
        }

        $allowedTypes = ['profile_picture', 'driver_license', 'insurance'];
        if (!in_array($docType, $allowedTypes)) {
            return $this->failValidationErrors(['type' => 'Invalid document type']);
        }

        $rules = [
            'document' => 'uploaded[document]|max_size[document,4096]|ext_in[document,png,jpg,jpeg,pdf]'
        ];
        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $newName = "{$userId}_{$docType}_" . time() . '.' . $file->getExtension();
        $path = WRITEPATH . 'uploads/documents/';
        if (!is_dir($path)) mkdir($path, 0777, true);
        $file->move($path, $newName);

        $docModel = new UserDocumentModel();
        // Optionally: mark existing doc of same type as "replaced" or "superseded"
        $docModel->where(['user_id' => $userId, 'type' => $docType, 'status !=' => 'rejected'])->set(['status' => 'replaced'])->update();

        $docModel->insert([
            'user_id' => $userId,
            'type'    => $docType,
            'file'    => $newName,
            'status'  => 'pending'
        ]);

        return $this->respond(['message' => "$docType uploaded, pending review"]);
    }

    public function getDocuments($userId = null)
    {
        if (!$userId) return $this->failValidationErrors(['message' => 'User ID required']);
        $docs = (new UserDocumentModel())->where('user_id', $userId)->findAll();
        return $this->respond($docs);
    }

    // DRIVER ------------------------

    public function updateLocation()
    {
        helper('push_websocket');
        
        $driverId = $this->request->user['id']; // assuming JWT filter
        $latitude = $this->request->getVar('latitude');
        $longitude = $this->request->getVar('longitude');

        if (!$latitude || !$longitude) {
            return $this->failValidationErrors(['latitude and longitude required']);
        }

        $model = new \App\Models\DriverLocationModel();
        // Upsert (update if exists, else insert)
        $existing = $model->where('driver_id', $driverId)->first();
        if ($existing) {
            $model->update($existing['id'], [
                'latitude' => $latitude,
                'longitude' => $longitude,
                'updated_at' => date('Y-m-d H:i:s'),
            ]);
        } else {
            $model->insert([
                'driver_id' => $driverId,
                'latitude' => $latitude,
                'longitude' => $longitude,
            ]);
        }

         // 1️⃣ Fetch all *active* shipments currently assigned to this driver:
        $shipmentModel = new \App\Models\ShipmentModel();
        $shipments = $shipmentModel
            ->where('driver_id', $driverId)
            ->whereIn('status', ['assigned','in_transit','out_for_delivery']) // active
            ->findAll();

        // 2️⃣ Push real-time location update to WebSocket for each shipment room:
        foreach ($shipments as $shipment) {
            pushToWebSocket('location_update', $shipment['tracking_number'], [
                'driver_id' => $driverId,
                'shipment_id' => $shipment['id'],
                'latitude'  => $latitude,
                'longitude' => $longitude,
                'timestamp' => date('c'),
            ]);
        }
        return $this->respond(['message' => 'Location updated']);
    }

    /**
     * Return the currently authenticated user (or null)
     * Reads JWT token from Authorization header.
     */
    public function me()
    {
        $this->authService = new AuthService();
        // Use the AuthService to get the current user
        $user = $this->authService->currentUser();
        if (!$user) {
            return $this->failUnauthorized('Unauthorized');
        }
        return $this->respond($user);
    }
    
}
