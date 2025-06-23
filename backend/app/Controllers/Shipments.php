<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\ShipmentModel;
use CodeIgniter\Events\Events;
use CodeIgniter\API\ResponseTrait;
use App\Enums\ShipmentStatus;
use Endroid\QrCode\Builder\Builder;


class Shipments extends ResourceController
{
    /**
     * Create a new shipment
     */
    public function create()
    {
        $rules = [
            'sender_id' => 'required|is_natural_no_zero',
            'description' => 'required',
            'origin' => 'required',
            'destination' => 'required',
            'weight' => 'required|decimal'
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $shipmentModel = new ShipmentModel();
        $data = [
            'sender_id' => $this->request->getVar('sender_id'),
            'tracking_number' => strtoupper(bin2hex(random_bytes(5))),
            'description' => $this->request->getVar('description'),
            'origin' => $this->request->getVar('origin'),
            'destination' => $this->request->getVar('destination'),
            'weight' => $this->request->getVar('weight'),
            'status' => 'pending'
        ];
        $shipmentModel->insert($data);

        // Fetch the created shipment (with ID and tracking_number)
        $shipment = $shipmentModel->where('tracking_number', $data['tracking_number'])->first();

        // Fire event!
        // Events::trigger('shipment_created', $shipment); No Generic for $shipment status
        Events::trigger('shipment_status_changed', [$shipment, 'created']);

        return $this->respondCreated($data);
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

}
