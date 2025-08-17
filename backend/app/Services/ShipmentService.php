<?php

namespace App\Services;

use App\Models\ShipmentModel;
use CodeIgniter\Events\Events;
use CodeIgniter\Config\BaseService;


class ShipmentService extends BaseService
{
    /**
     * Assign a shipment to a driver.
     * @param int $shipmentId
     * @param int $driverId
     * @return array The updated shipment
     * @throws \Exception on error
     */
    public function assignToDriver($shipmentId, $driverId)
    {
        $shipmentModel = new ShipmentModel();
        $shipment = $shipmentModel->find($shipmentId);

        if (!$shipment) {
            throw new \Exception('Shipment not found');
        }

        // Only allow assignment if not already assigned or delivered/cancelled
        if (in_array($shipment['status'], ['delivered', 'cancelled'])) {
            throw new \Exception('Cannot assign delivered or cancelled shipment');
        }

        // Update assignment
        $shipmentModel->update($shipmentId, [
            'driver_id' => $driverId,
            'status' => 'assigned'
        ]);
        $shipment = $shipmentModel->find($shipmentId);

        // Fire events for notifications, etc.
        Events::trigger('driver_assigned_shipment', [
            'driver_id' => $driverId,
            'shipment'  => $shipment
        ]);
        Events::trigger('shipment_status_changed', [$shipment, 'assigned']);

        return $shipment;
    }
}
