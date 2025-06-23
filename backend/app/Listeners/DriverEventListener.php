<?php

namespace App\Listeners;

use App\Models\NotificationModel;

class DriverEventListener
{
    public static function onItineraryCreated($itinerary)
    {
        $notif = [
            'user_id' => $itinerary['user_id'],
            'type' => 'itinerary_created',
            'content' => "Your itinerary from {$itinerary['origin']} to {$itinerary['destination']} is set.",
        ];
        (new NotificationModel())->insert($notif);
    }

    public static function onAssignedShipment($params)
    {
        $driver_id = $params['driver_id'];
        $shipment = $params['shipment'];
        $notif = [
            'user_id' => $driver_id,
            'type' => 'assigned_shipment',
            'content' => "You have been assigned shipment {$shipment['tracking_number']}.",
        ];
        (new NotificationModel())->insert($notif);
    }
}
