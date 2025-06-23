<?php

/**
 * pending – Shipment created, waiting for driver
 * assigned – Assigned to a driver
 * picked_up – Driver picked up the package
 * in_transit – Package is moving to destination
 * at_hub – Temporarily at a transfer point/hub
 * out_for_delivery – On the final leg to receiver
 * delivered – Delivered to recipient
 * delivery_failed – Delivery attempted, but failed
 * returned – Returned to sender
 * cancelled – Cancelled by sender or admin
 */

namespace App\Enums;

enum ShipmentStatus: string
{
    case PENDING = 'pending';
    case ASSIGNED = 'assigned';
    case PICKED_UP = 'picked_up';
    case IN_TRANSIT = 'in_transit';
    case AT_HUB = 'at_hub';
    case OUT_FOR_DELIVERY = 'out_for_delivery';
    case DELIVERED = 'delivered';
    case DELIVERY_FAILED = 'delivery_failed';
    case RETURNED = 'returned';
    case CANCELLED = 'cancelled';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public static function allowedTransitions(string $from): array
    {
        // Define allowed next steps from each status
        return match ($from) {
            'pending'        => ['assigned', 'cancelled'],
            'assigned'       => ['picked_up', 'cancelled'],
            'picked_up'      => ['in_transit', 'at_hub', 'returned'],
            'in_transit'     => ['at_hub', 'out_for_delivery', 'returned'],
            'at_hub'         => ['in_transit', 'out_for_delivery', 'returned'],
            'out_for_delivery'=> ['delivered', 'delivery_failed'],
            'delivered'      => [],
            'delivery_failed'=> ['out_for_delivery', 'returned'],
            'returned'       => [],
            'cancelled'      => [],
            default          => [],
        };
    }
}


// To get all status options: ShipmentStatus::values() (returns array)

// To set/check: $shipment['status'] = ShipmentStatus::ASSIGNED->value;