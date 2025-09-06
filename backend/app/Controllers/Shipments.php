<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\ShipmentModel;
use CodeIgniter\Events\Events;
use CodeIgniter\API\ResponseTrait;
use App\Enums\ShipmentStatus;
use Endroid\QrCode\Builder\Builder;
use Exception;


class Shipments extends ResourceController
{
    use ResponseTrait;
    protected $shipmentModel;
    
    public function __construct()
    {
        $this->shipmentModel = new ShipmentModel();
    }

    // app/Controllers/Shipments.php (add)
    public function index()
    {
        $auth = service('auth');
        $me   = $auth?->currentUser();
        if (!$me) {
            return $this->failUnauthorized('Unauthenticated');
        }

        $role = $me['role'] ?? 'sender';

        $page     = max(1, (int)($this->request->getGet('page') ?? 1));
        $perPage  = min(100, max(1, (int)($this->request->getGet('per_page') ?? 20)));
        $status   = $this->request->getGet('status');    // optional filter
        $userIdQ  = $this->request->getGet('user_id');   // admin-only

        $builder = $this->shipmentModel->builder()->select('*');

        if ($role === 'sender') {
            // Scope strictly to this sender
            $builder->where('sender_id', $me['id']);
        } elseif ($role === 'driver') {
            // Optional driver’s shipments (if you want driver dashboard to reuse)
            if ($this->request->getGet('mine') === 'driver') {
                $builder->where('driver_id', $me['id']);
            }
        } elseif ($role === 'admin') {
            if ($userIdQ) {
                $builder->where('sender_id', (int)$userIdQ);
            }
        }

        if (!empty($status)) {
            $builder->where('status', $status);
        }

        $builder->orderBy('created_at', 'DESC');

        // Pagination
        $offset = ($page - 1) * $perPage;
        $total  = $builder->countAllResults(false);
        $rows   = $builder->limit($perPage, $offset)->get()->getResultArray();

        return $this->respond([
            'data' => $rows,
            'meta' => [
                'page' => $page,
                'per_page' => $perPage,
                'total' => (int)$total,
                'total_pages' => (int)ceil($total / $perPage),
            ],
        ]);
    }


    /**
     * POST /shipments
     * Create a new shipment
     */
    public function create()
    {
        try {

            $currentUser = $this->request->user;

            if (!$currentUser || $currentUser['role'] !== 'sender') {
                return $this->failForbidden('Only senders can create shipments');
            }

            $data = $this->request->getJSON(true);
            // Validate required fields
            $rules = [ // Must be the current user
                'sender_id'    => 'required|integer',
                'driver_id'    => 'permit_empty|integer',
                'origin'       => 'required|string',
                'destination'  => 'required|string',
                'pickup_lat'   => 'required|decimal',
                'pickup_lng'   => 'required|decimal'
            ];

            if (! $this->validate($rules)) {
                return $this->failValidationErrors($this->validator->getErrors());
            }

            $insertData = [
                'sender_id'       => $currentUser['id'],
                'tracking_number' => 'TRK'.strtoupper(bin2hex(random_bytes(5))),
                'driver_id'     => $data['driver_id'] ?? null,
                'origin'        => $data['origin'],
                'destination'   => $data['destination'],
                'pickup_lat'    => $data['pickup_lat'],
                'pickup_lng'    => $data['pickup_lng'],
                'dest_lat'      => $data['dest_lat'] ?? null,
                'dest_lng'      => $data['dest_lng'] ?? null,
                'weight_kg'     => $data['weight_kg'] ?? null,
                'length_cm'     => $data['length_cm'] ?? null,
                'width_cm'      => $data['width_cm'] ?? null,
                'height_cm'     => $data['height_cm'] ?? null,
                'status'        => $data['status'] ?? 'pending',
                'notes'         => $data['notes'] ?? null,
                'payout'        => $data['quote_usd'] ?? null,
                'created_at'    => date('Y-m-d H:i:s'),
                'updated_at'    => date('Y-m-d H:i:s'),
            ];
            // print_r(json_encode($insertData)); die();
            $shipmentModel = new ShipmentModel();
            $shipmentModel->insert($insertData);
            $id = $shipmentModel->getInsertID();

            $shipment = $shipmentModel->find($id);

            // Optional: trigger event (shipment_created)
            // event('shipment_created', $shipment);

            return $this->respondCreated([
                'message'  => 'Shipment created successfully',
                'data'     => $shipment,
            ]);
        } catch (Exception $e) {
            return $this->failServerError($e->getMessage());
        }
    }

    /**
     * Track a shipment by tracking number
     */
    public function track($tracking_number = null)
    {
        if (!$tracking_number) return $this->failNotFound();
        $shipmentModel = new ShipmentModel();
        $shipment = $shipmentModel->where('tracking_number', $tracking_number)->first();
        if (!$shipment) return $this->failNotFound('Shipment not found');
        return $this->respond($shipment);
    }

    /**
     * Get all shipments for a sender
     */
    public function myShipments($sender_id = null)
    {
        if (!$sender_id) return $this->failNotFound();
        $shipmentModel = new ShipmentModel();
        $shipments = $shipmentModel->where('sender_id', $sender_id)->findAll();
        return $this->respond($shipments);
    }


    public function markDelivered($tracking_number)
    {
        $shipmentModel = new ShipmentModel();
        $shipment = $shipmentModel->where('tracking_number', $tracking_number)->first();
        if (!$shipment) return $this->failNotFound();
        //check the current status and allow only if it is in transit (USING ENUM)
        // $current = $shipment['status'];
        // $next = $this->request->getVar('status');

        // if (!in_array($next, ShipmentStatus::allowedTransitions($current))) {
        //     return $this->failValidationErrors("Invalid status transition from $current to $next");
        // }

        $shipmentModel->update($shipment['id'], ['status' => 'delivered', 'delivery_time' => date('Y-m-d H:i:s')]);
        $shipment = $shipmentModel->find($shipment['id']); // Refresh

        // Fire event!
        // Events::trigger('shipment_delivered', $shipment);
        Events::trigger('shipment_status_changed', [$shipment, 'delivered']);

        return $this->respond(['message' => 'Shipment delivered']);
    }

    public function assignDriver($shipmentId = null)
    {
        $driverId = $this->request->getVar('driver_id');
        if (!$shipmentId || !$driverId) {
            return $this->failValidationErrors(['message' => 'shipmentId and driver_id required']);
        }

        $service = new \App\Services\ShipmentService();

        try {
            $shipment = $service->assignToDriver($shipmentId, $driverId);
            return $this->respond($shipment);
        } catch (\Exception $e) {
            return $this->fail($e->getMessage());
        }
    }

    public function statusOptions()
    {
        return $this->respond([
            'statuses' => \App\Enums\ShipmentStatus::values()
        ]);
    }

    public function allowedTransitions($shipmentId)
    {
        $shipment = (new ShipmentModel())->find($shipmentId);
        if (!$shipment) return $this->failNotFound();
        return $this->respond([
            'allowed_transitions' => \App\Enums\ShipmentStatus::allowedTransitions($shipment['status'])
        ]);
    }

    //Get driver/Shipment location

    public function shipmentLocation($trackingNumber = null)
    {
        $shipment = (new \App\Models\ShipmentModel())->where('tracking_number', $trackingNumber)->first();
        if (!$shipment || !$shipment['driver_id']) return $this->failNotFound('Shipment or driver not found');

        $driverLocation = (new \App\Models\DriverLocationModel())->where('driver_id', $shipment['driver_id'])->first();
        if (!$driverLocation) return $this->failNotFound('Driver location not found');

        return $this->respond([
            'driver_id' => $shipment['driver_id'],
            'latitude' => $driverLocation['latitude'],
            'longitude' => $driverLocation['longitude'],
            'updated_at' => $driverLocation['updated_at']
        ]);
    }

    public function transferShipment($shipmentId = null)
    {
        $fromDriverId = $this->request->user['id'];
        $toDriverId = $this->request->getVar('to_driver_id');

        $shipmentModel = new \App\Models\ShipmentModel();
        $shipment = $shipmentModel->find($shipmentId);

        if (!$shipment) return $this->failNotFound();
        if ($shipment['driver_id'] != $fromDriverId) {
            return $this->failForbidden('Not your shipment to transfer');
        }

        // Update shipment driver_id
        $shipmentModel->update($shipmentId, ['driver_id' => $toDriverId, 'status' => 'in_transit']);

        // Optionally: Save transfer log
        (new \App\Models\ShipmentTransferModel())->insert([
            'shipment_id' => $shipmentId,
            'from_driver' => $fromDriverId,
            'to_driver' => $toDriverId,
        ]);

        // Fire events for notification (to both drivers, admin, sender)
        \CodeIgniter\Events\Events::trigger('shipment_status_changed', [$shipmentModel->find($shipmentId), 'transferred']);
        \CodeIgniter\Events\Events::trigger('shipment_transferred', [
            'shipment_id' => $shipmentId,
            'from_driver' => $fromDriverId,
            'to_driver' => $toDriverId,
        ]);
        return $this->respond(['message' => 'Shipment transferred']);
    }

    public function getTransferQr($shipmentId)
    {
        // Generate a secure one-time token (or just use shipmentId)
        $token = bin2hex(random_bytes(6));
        $qrData = json_encode([
            'shipment_id' => $shipmentId,
            'transfer_token' => $token
        ]);
        // Store transfer_token in DB for this shipment (with expiry)
        (new \App\Models\ShipmentModel())->update($shipmentId, [
            'transfer_token' => $token,
            'transfer_token_expires' => date('Y-m-d H:i:s', time() + 600)
        ]);
        $result = Builder::create()->data($qrData)->size(300)->build();
        header('Content-Type: '.$result->getMimeType());
        echo $result->getString();
        exit;
    }
    
    public function acceptTransfer($shipmentId)
    {
        helper('push_websocket');

        $token = $this->request->getVar('transfer_token');
        $toDriverId = $this->request->user['id'];
        $shipmentModel = new \App\Models\ShipmentModel();
        $shipment = $shipmentModel->find($shipmentId);

        if (!$shipment) return $this->failNotFound();
        if ($shipment['transfer_token'] !== $token || strtotime($shipment['transfer_token_expires']) < time()) {
            return $this->fail('Invalid or expired transfer token');
        }
        $fromDriverId = $shipment['driver_id'];
        $shipmentModel->update($shipmentId, [
            'driver_id' => $toDriverId,
            'transfer_token' => null,
            'transfer_token_expires' => null
        ]);
        (new \App\Models\ShipmentTransferModel())->insert([
            'shipment_id' => $shipmentId,
            'from_driver' => $fromDriverId,
            'to_driver' => $toDriverId,
        ]);
        \CodeIgniter\Events\Events::trigger('shipment_transferred', [
            'shipment_id' => $shipmentId,
            'from_driver' => $fromDriverId,
            'to_driver' => $toDriverId,
        ]);
        // Use a queue, HTTP call, or Redis to send this to your Node.js service:
            $postData = [
                'shipment_tracking' => $shipment['id'],
                'from_driver' => $fromDriverId,
                'to_driver' => $toDriverId,
                'timestamp' => date('c')
            ];
        pushToWebSocket('transfer_update', $shipment['tracking_number'], [
            'shipment_id' => $shipment['id'],
            'from_driver' => $fromDriverId,
            'to_driver'   => $toDriverId,
            'timestamp'   => date('c')
        ]);
        // Send to your WebSocket service
        // (with Guzzle HTTP or a Redis pub/sub push, or use an internal queue/bridge)

        return $this->respond(['message' => 'Transfer complete']);
    }

    /**
     * PUT /shipment/{id}
     * Update fields on a shipment (admin/driver back office)
     */

    public function update($id = null)
    {
        if (!$id || !is_numeric($id)) {
            return $this->failValidationError('Invalid shipment id');
        }

        $existing = $this->shipmentModel->find($id);
        if (!$existing) {
            return $this->failNotFound('Shipment not found');
        }

        // JSON body as assoc array
        $data = $this->request->getJSON(true) ?? [];

        // Whitelist updatable fields
        $allowed = [
            'user_id',
            'driver_id',
            'origin', 'destination',
            'pickup_lat', 'pickup_lng',
            'dest_lat', 'dest_lng',
            'weight_kg', 'length_cm', 'width_cm', 'height_cm',
            'status',
            'notes',
        ];

        $update = [];
        foreach ($allowed as $f) {
            if (array_key_exists($f, $data)) {
                $update[$f] = $data[$f];
            }
        }

        if (empty($update)) {
            return $this->failValidationError('No valid fields to update');
        }

        // Basic validation (add/adjust as needed)
        $rules = [
            'pickup_lat' => 'permit_empty|decimal',
            'pickup_lng' => 'permit_empty|decimal',
            'dest_lat'   => 'permit_empty|decimal',
            'dest_lng'   => 'permit_empty|decimal',
            'weight_kg'  => 'permit_empty|decimal',
            'length_cm'  => 'permit_empty|decimal',
            'width_cm'   => 'permit_empty|decimal',
            'height_cm'  => 'permit_empty|decimal',
            'driver_id'  => 'permit_empty|integer',
            'user_id'    => 'permit_empty|integer',
            'status'     => 'permit_empty|in_list[pending,ready_for_pickup,awaiting_driver,assigned,in_transit,delivered,cancelled]',
        ];
        if (! $this->validateData($update, $rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        // Status transition guard (optional – relax or extend as needed)
        if (isset($update['status'])) {
            $from = $existing['status'] ?? 'pending';
            $to   = $update['status'];

            $allowedTransitions = [
                'pending'           => ['ready_for_pickup','awaiting_driver','cancelled'],
                'ready_for_pickup'  => ['awaiting_driver','assigned','cancelled'],
                'awaiting_driver'   => ['assigned','cancelled'],
                'assigned'          => ['in_transit','cancelled'],
                'in_transit'        => ['delivered','cancelled'],
                'delivered'         => [],        // terminal
                'cancelled'         => [],        // terminal
            ];
            if (isset($allowedTransitions[$from]) && !in_array($to, $allowedTransitions[$from], true)) {
                return $this->failValidationError("Illegal status transition: {$from} → {$to}");
            }
        }

        // Detect assignment change
        $assignmentChanged = isset($update['driver_id']) && $update['driver_id'] != ($existing['driver_id'] ?? null);

        // Persist
        $update['updated_at'] = date('Y-m-d H:i:s');
        $this->shipmentModel->update($id, $update);

        $updated = $this->shipmentModel->find($id);

        // Fire domain events (listeners can push notifications/webhooks)
        if ($assignmentChanged) {
            event('shipment_assigned', [
                'shipment'  => $updated,
                'oldDriver' => $existing['driver_id'] ?? null,
                'newDriver' => $updated['driver_id'] ?? null,
            ]);
        }
        if (isset($update['status']) && $update['status'] !== ($existing['status'] ?? null)) {
            event('shipment_status_changed', [
                'shipment'  => $updated,
                'from'      => $existing['status'] ?? null,
                'to'        => $update['status'],
            ]);
        }

        return $this->respond([
            'message' => 'Shipment updated',
            'data'    => $updated,
        ]);
    }
}
