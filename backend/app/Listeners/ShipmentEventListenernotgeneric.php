<?php

namespace App\Listeners;

use App\Models\NotificationModel;

class ShipmentEventListener
{
    public static function onCreated($shipment)
    {
        // Send notification to sender
        $notification = [
            'user_id' => $shipment['sender_id'],
            'type' => 'shipment_created',
            'content' => "Your shipment {$shipment['tracking_number']} has been created.",
        ];
        (new NotificationModel())->insert($notification);
        // Optionally: Log, email, or trigger SMS here
    }

    public static function onDelivered($shipment)
    {
        // Notify sender and driver
        $notifs = [
            [
                'user_id' => $shipment['sender_id'],
                'type' => 'shipment_delivered',
                'content' => "Your shipment {$shipment['tracking_number']} has been delivered!",
            ]
        ];
        if (!empty($shipment['driver_id'])) {
            $notifs[] = [
                'user_id' => $shipment['driver_id'],
                'type' => 'shipment_delivered',
                'content' => "Shipment {$shipment['tracking_number']} has been marked as delivered.",
            ];
        }
        $model = new NotificationModel();
        foreach ($notifs as $notif) {
            $model->insert($notif);
        }
        // Optionally: More side-effects (reward points, logs, etc)
    }
}
