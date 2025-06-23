<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\UserModel;
use App\Models\DriverLocationModel;

class Admin extends ResourceController
{
    /**
     * Pushes a batch of all live driver locations to the admin dashboard via WebSocket
     * GET /api/admin/batch-driver-locations
     */
    public function batchDriverLocations()
    {
        $userModel = new UserModel();
        $locationModel = new DriverLocationModel();

        // Get all active drivers
        $activeDrivers = $userModel->where('role', 'driver')->where('status', 'active')->findAll();
        $batch = [];
        foreach ($activeDrivers as $driver) {
            $loc = $locationModel->where('driver_id', $driver['id'])->first();
            if ($loc) {
                $batch[] = [
                    'driver_id' => $driver['id'],
                    'name'      => $driver['name'],
                    'latitude'  => $loc['latitude'],
                    'longitude' => $loc['longitude'],
                    'timestamp' => $loc['updated_at'],
                ];
            }
        }

        helper('push_websocket');
        pushBatchToWebSocket('batch_location_update', 'admin_dashboard', $batch);

        return $this->respond([
            'count' => count($batch),
            'batch' => $batch
        ]);
    }

    /**
     * Endpoint to fetch current live driver locations (for frontend polling if needed)
     * GET /api/admin/driver-locations
     */
    public function driverLocations()
    {
        $userModel = new UserModel();
        $locationModel = new DriverLocationModel();

        $activeDrivers = $userModel->where('role', 'driver')->where('status', 'active')->findAll();
        $batch = [];
        foreach ($activeDrivers as $driver) {
            $loc = $locationModel->where('driver_id', $driver['id'])->first();
            if ($loc) {
                $batch[] = [
                    'driver_id' => $driver['id'],
                    'name'      => $driver['name'],
                    'latitude'  => $loc['latitude'],
                    'longitude' => $loc['longitude'],
                    'timestamp' => $loc['updated_at'],
                ];
            }
        }
        return $this->respond([
            'count' => count($batch),
            'batch' => $batch
        ]);
    }

    public function batchDriverLocationsByRegion($region)
    {
        $userModel = new \App\Models\UserModel();
        $locationModel = new \App\Models\DriverLocationModel();

        $drivers = $userModel->where('role', 'driver')->where('status', 'active')->where('region', $region)->findAll();
        $batch = [];
        foreach ($drivers as $driver) {
            $loc = $locationModel->where('driver_id', $driver['id'])->first();
            if ($loc) {
                $batch[] = [
                    'driver_id' => $driver['id'],
                    'name'      => $driver['name'],
                    'latitude'  => $loc['latitude'],
                    'longitude' => $loc['longitude'],
                    'timestamp' => $loc['updated_at'],
                ];
            }
        }

        helper('push_websocket');
        $room = "region_{$region}";
        pushBatchToWebSocket('batch_location_update', $room, $batch);

        return $this->respond(['count' => count($batch), 'batch' => $batch]);
    }

    public function batchDriverLocationsByShipments()
    {
        $shipmentIds = $this->request->getVar('shipment_ids'); // Expect array

        $shipmentModel = new \App\Models\ShipmentModel();
        $locationModel = new \App\Models\DriverLocationModel();

        $batch = [];
        foreach ($shipmentIds as $id) {
            $shipment = $shipmentModel->find($id);
            if ($shipment && $shipment['driver_id']) {
                $loc = $locationModel->where('driver_id', $shipment['driver_id'])->first();
                if ($loc) {
                    $batch[] = [
                        'shipment_id' => $shipment['id'],
                        'tracking_number' => $shipment['tracking_number'],
                        'driver_id'   => $shipment['driver_id'],
                        'latitude'    => $loc['latitude'],
                        'longitude'   => $loc['longitude'],
                        'timestamp'   => $loc['updated_at'],
                    ];
                }
            }
        }

        helper('push_websocket');
        // For a custom watcher or dispatcher, e.g. "shipments_batch_{userid}"
        $room = $this->request->getVar('room') ?: 'dispatcher';
        pushBatchToWebSocket('batch_location_update', $room, $batch);

        return $this->respond(['count' => count($batch), 'batch' => $batch]);
    }

    /**
     * If you want to filter by a map area:
     * Accept lat/lng bounds from the frontend.
     * Use SQL with latitude BETWEEN min AND max and longitude BETWEEN min AND max.
     * Push to a custom room (e.g., “area_{id}”).
     */

    public function batchDriverLocationsByBoundingBox()
    {
        $minLat = $this->request->getVar('min_lat');
        $maxLat = $this->request->getVar('max_lat');
        $minLng = $this->request->getVar('min_lng');
        $maxLng = $this->request->getVar('max_lng');
        $room   = $this->request->getVar('room') ?: 'geo_area';

        $locationModel = new \App\Models\DriverLocationModel();

        $locations = $locationModel
            ->where('latitude >=', $minLat)
            ->where('latitude <=', $maxLat)
            ->where('longitude >=', $minLng)
            ->where('longitude <=', $maxLng)
            ->findAll();

        helper('push_websocket');
        pushBatchToWebSocket('batch_location_update', $room, $locations);

        return $this->respond(['count' => count($locations), 'batch' => $locations]);
    }


}
