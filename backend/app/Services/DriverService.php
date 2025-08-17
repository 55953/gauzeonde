<?php

namespace App\Services;

use App\Models\ShipmentModel;
use App\Models\UserModel;
use CodeIgniter\Database\Exceptions\DatabaseException;
use Config\Database;

class DriverService
{
    protected ShipmentModel $shipments;
    protected UserModel $users;

    public function __construct()
    {
        $this->shipments = new ShipmentModel();
        $this->users = new UserModel();
    }

    public function assignShipment(int $driverId, int $shipmentId): array
    {
        $db = Database::connect();
        $db->transStart();

        try {
            $driver = $this->users->find($driverId);
            if (!$driver || ($driver['role'] ?? null) !== 'driver') {
                return ['ok' => false, 'message' => 'Not a driver'];
            }
            if (!($driver['online'] ?? false)) {
                return ['ok' => false, 'message' => 'Driver is offline'];
            }
            $shipment = $this->shipments->lockForUpdate()->find($shipmentId);
            if (!$shipment) {
                return ['ok' => false, 'message' => 'Shipment not found'];
            }
            if ($shipment['driver_id'] !== null) {
                return ['ok' => false, 'message' => 'Shipment already assigned'];
            }
            if (!in_array($shipment['status'], ['ready_for_pickup', 'awaiting_driver'])) {
                return ['ok' => false, 'message' => 'Shipment not in assignable status'];
            }

            // Capacity/limits validation
            if (!$this->canCarry($driver, $shipment)) {
                return ['ok' => false, 'message' => 'Shipment exceeds driver capacity limits'];
            }

            // Assign
            $this->shipments->update($shipmentId, [
                'driver_id' => $driverId,
                'status'    => 'assigned',
                'updated_at'=> date('Y-m-d H:i:s'),
            ]);

            $db->transComplete();
            if ($db->transStatus() === false) {
                return ['ok' => false, 'message' => 'DB error'];
            }

            $shipment = $this->shipments->find($shipmentId);

            // Fire domain event if you use your event bus
            // event('shipment_status_changed', ['shipment' => $shipment, 'new_status' => 'assigned']);

            return ['ok' => true, 'shipment' => $shipment];
        } catch (\Throwable $e) {
            $db->transRollback();
            log_message('error', 'assignShipment exception: {msg}', ['msg' => $e->getMessage()]);
            return ['ok' => false, 'message' => 'Internal error'];
        }
    }

    public function canCarry(array $driver, array $shipment): bool
    {
        // If driver had not defined limits, consider as not constrained
        $dw = (float)($driver['max_weight_kg']   ?? 0);
        $dv = (float)($driver['max_volume_cuft'] ?? 0);
        $dl = (float)($driver['max_length_cm']   ?? 0);
        $dwid = (float)($driver['max_width_cm']  ?? 0);
        $dh = (float)($driver['max_height_cm']   ?? 0);

        $sw = (float)($shipment['weight_kg']     ?? 0);
        $sv = (float)($shipment['volume_cuft']   ?? 0);
        $sl = (float)($shipment['length_cm']     ?? 0);
        $swid = (float)($shipment['width_cm']    ?? 0);
        $sh = (float)($shipment['height_cm']     ?? 0);

        // If a driver limit is 0 or null => treat as unconstrained for that dimension
        $okWeight = ($dw <= 0)   ? true : ($sw <= $dw);
        $okVolume = ($dv <= 0)   ? true : ($sv <= $dv);
        $okLen    = ($dl <= 0)   ? true : ($sl <= $dl);
        $okWid    = ($dwid <= 0) ? true : ($swid <= $dwid);
        $okHei    = ($dh <= 0)   ? true : ($sh <= $dh);

        return $okWeight && $okVolume && $okLen && $okWid && $okHei;
    }
}
