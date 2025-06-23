<?php

namespace App\Listeners;

use App\Models\NotificationModel;

class ShipmentEventListener
{
    /**
     * Handles any shipment status change.
     * @param array $params [0] => shipment array, [1] => new status string
     */
    public static function onStatusChanged($params)
    {
        // $params[0] = $shipment, $params[1] = $newStatus
        $shipment = $params[0];
        $status = strtolower($params[1]);
        $model = new NotificationModel();

        // You can branch on the status:
        switch ($status) {
            case 'created':
                $model->insert([
                    'user_id' => $shipment['sender_id'],
                    'type' => 'shipment_created',
                    'content' => "Your shipment {$shipment['tracking_number']} has been created.",
                ]);
                break;

            case 'in_transit':
                // Example: Notify sender and driver
                $model->insert([
                    'user_id' => $shipment['sender_id'],
                    'type' => 'shipment_in_transit',
                    'content' => "Shipment {$shipment['tracking_number']} is now in transit.",
                ]);
                if (!empty($shipment['driver_id'])) {
                    $model->insert([
                        'user_id' => $shipment['driver_id'],
                        'type' => 'shipment_in_transit',
                        'content' => "You have picked up shipment {$shipment['tracking_number']}.",
                    ]);
                }
                break;

            case 'delivered':
                // Notify sender and driver
                $model->insert([
                    'user_id' => $shipment['sender_id'],
                    'type' => 'shipment_delivered',
                    'content' => "Your shipment {$shipment['tracking_number']} has been delivered!",
                ]);
                if (!empty($shipment['driver_id'])) {
                    $model->insert([
                        'user_id' => $shipment['driver_id'],
                        'type' => 'shipment_delivered',
                        'content' => "Shipment {$shipment['tracking_number']} has been marked as delivered.",
                    ]);
                    //find the sender to notify
                    $userModel = new \App\Models\UserModel();
                    $sender = $userModel->find($shipment['sender_id']);

                    // Email
                    if ($sender) {
                        $email = \Config\Services::email();
                        $email->setTo($sender['email']);
                        $email->setSubject('Your Shipment Delivered!');
                        $email->setMessage("Hi {$sender['name']}, your shipment {$shipment['tracking_number']} has been delivered.");
                        $email->send();
                    }

                    // SMS
                    if ($sender && !empty($sender['phone'])) {
                        sendSMS($sender['phone'], "Your shipment {$shipment['tracking_number']} has been delivered!");
                    }

                }
                break;

            case 'cancelled':
                $model->insert([
                    'user_id' => $shipment['sender_id'],
                    'type' => 'shipment_cancelled',
                    'content' => "Shipment {$shipment['tracking_number']} was cancelled.",
                ]);
                break;

            // Add more statuses as needed...

            default:
                // Optionally log or handle unknown status
                break;
        }
    }
}
