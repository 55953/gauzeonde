<?php

namespace App\Controllers;

use App\Services\AuthService;
use App\Services\DriverService;
use App\Models\UserModel;
use App\Models\ShipmentModel;
use App\Models\DriverLocationModel;
use CodeIgniter\RESTful\ResourceController;

class Drivers extends ResourceController
{
    protected AuthService $auth;
    protected DriverService $driverService;
    protected UserModel $users;
    protected ShipmentModel $shipments;
    protected DriverLocationModel $locations;

    public function __construct()
    {
        $this->auth          = service('auth');
        $this->driverService = new DriverService();
        $this->users         = new UserModel();
        $this->shipments     = new ShipmentModel();
        $this->locations     = new DriverLocationModel();
    }

    public function me()
    {
        $user = $this->auth->currentUser();
        if (!$user || ($user['role'] ?? null) !== 'driver') {
            return $this->failUnauthorized('Unauthorized');
        }
        return $this->respond($user);
    }

    public function online()
    {
        $user = $this->auth->currentUser();
        if (!$user || ($user['role'] ?? null) !== 'driver') {
            return $this->failUnauthorized('Unauthorized');
        }
        // If GET request, return current online status
        if ($this->request->getMethod() === 'GET') {
            return $this->respond(['online' => $user['online'] == 't' ? true : false]);
        }

        $payload = $this->request->getJSON(true) ?? $this->request->getPost();
        $online = filter_var($payload['online'] ?? null, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
        if ($online === null) {
            return $this->failValidationErrors(['online' => 'online must be true/false']);
        }

        $this->users->update($user['id'], [
            'online' => $online,
            'last_online_at' => $online ? date('Y-m-d H:i:s') : null,
        ]);

        return $this->respond(['status' => 'ok', 'online' => $online]);
    }

    public function updateCapacity()
    {
        $user = $this->auth->currentUser();
        if (!$user || ($user['role'] ?? null) !== 'driver') {
            return $this->failUnauthorized('Unauthorized');
        }

        $data = $this->request->getJSON(true) ?? $this->request->getRawInput();

        // Optional but recommended capacity fields
        $rules = [
            'max_weight_kg'   => 'permit_empty|numeric|greater_than_equal_to[0]',
            'max_volume_cuft' => 'permit_empty|numeric|greater_than_equal_to[0]',
            'max_length_cm'   => 'permit_empty|numeric|greater_than_equal_to[0]',
            'max_width_cm'    => 'permit_empty|numeric|greater_than_equal_to[0]',
            'max_height_cm'   => 'permit_empty|numeric|greater_than_equal_to[0]',
            'vehicle_type'    => 'permit_empty|string|max_length[60]',
        ];

        if (! $this->validateData($data, $rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $this->users->update($user['id'], [
            'max_weight_kg'   => $data['max_weight_kg']   ?? $user['max_weight_kg']   ?? null,
            'max_volume_cuft' => $data['max_volume_cuft'] ?? $user['max_volume_cuft'] ?? null,
            'max_length_cm'   => $data['max_length_cm']   ?? $user['max_length_cm']   ?? null,
            'max_width_cm'    => $data['max_width_cm']    ?? $user['max_width_cm']    ?? null,
            'max_height_cm'   => $data['max_height_cm']   ?? $user['max_height_cm']   ?? null,
            'vehicle_type'    => $data['vehicle_type']    ?? $user['vehicle_type']    ?? null,
        ]);

        return $this->respond(['status' => 'ok']);
    }

    public function listOpenShipments()
    {
        $user = $this->auth->currentUser();
        if (!$user || ($user['role'] ?? null) !== 'driver') {
            return $this->failUnauthorized('Unauthorized');
        }

        // Open shipments: not assigned & in acceptable statuses
        $open = $this->shipments
            ->where('status', 'ready_for_pickup')
            ->where('driver_id', null)
            ->orderBy('created_at', 'DESC')
            ->findAll(100);

        return $this->respond($open);
    }

    public function myShipments()
    {
        $user = $this->auth->currentUser();
        if (!$user || ($user['role'] ?? null) !== 'driver') {
            return $this->failUnauthorized('Unauthorized');
        }

        $mine = $this->shipments
            ->where('driver_id', $user['id'])
            ->orderBy('updated_at', 'DESC')
            ->findAll(100);

        return $this->respond($mine);
    }

    public function acceptShipment(int $shipmentId)
    {
        $user = $this->auth->currentUser();
        if (!$user || ($user['role'] ?? null) !== 'driver') {
            return $this->failUnauthorized('Unauthorized');
        }

        try {
            $result = $this->driverService->assignShipment($user['id'], $shipmentId);
            if ($result['ok'] === false) {
                return $this->fail($result['message'] ?? 'Cannot accept shipment');
            }
            // Implement WebSocket emission
            $ws = service('websocket');
            $shipmentId = (int)$result['shipment']['id'];

            $ws->emit('shipment.assigned', [
                'shipmentId' => $shipmentId,
                'driverId'   => (int)$user['id'],
                'status'     => 'assigned',
            ], 'shipment:' . $shipmentId);

            // Optionally notify the driver room & global stream
            $ws->emit('driver.assignment', [
                'driverId'   => (int)$user['id'],
                'shipmentId' => $shipmentId,
            ], 'driver:' . $user['id']);
            
            return $this->respond(['status' => 'assigned', 'shipment' => $result['shipment']]);
        } catch (\Throwable $e) {
            log_message('error', 'assignShipment error: {msg}', ['msg' => $e->getMessage()]);
            return $this->failServerError('Internal error');
        }
    }

    public function updateLocation()
    {
        $user = $this->auth->currentUser();
        if (!$user || ($user['role'] ?? null) !== 'driver') {
            return $this->failUnauthorized('Unauthorized');
        }

        $payload = $this->request->getJSON(true) ?? $this->request->getPost();
        $rules = [
            'lat'     => 'required|numeric',
            'lng'     => 'required|numeric',
            'speed'   => 'permit_empty|numeric',
            'heading' => 'permit_empty|numeric',
        ];
        if (! $this->validateData($payload, $rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $this->locations->insert([
            'driver_id' => $user['id'],
            'latitude'  => $payload['lat'],
            'longitude' => $payload['lng'],
            'speed'     => $payload['speed'] ?? null,
            'heading'   => $payload['heading'] ?? null,
            'recorded_at' => date('Y-m-d H:i:s'),
        ]);

        // Optional: push to websocket bridge here if you wired that helper
        // pushToWebsocket('driver:location', ['driverId'=>$user['id'], 'lat'=>$payload['lat'], 'lng'=>$payload['lng']]);

        // Implement WebSocket emission
        $ws = service('websocket');
        $ws->emit(
            'driver.location',
            [
                'driverId' => $user['id'],
                'lat'      => (float)$payload['lat'],
                'lng'      => (float)$payload['lng'],
                'speed'    => isset($payload['speed']) ? (float)$payload['speed'] : null,
                'heading'  => isset($payload['heading']) ? (float)$payload['heading'] : null,
                'ts'       => time()
            ],
            'driver:' . $user['id'] // room
        );

        return $this->respond(['status' => 'ok']);
    }
}
