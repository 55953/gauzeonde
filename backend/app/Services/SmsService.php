<?php 

namespace App\Services;

use CodeIgniter\Events\Events;
use App\Models\NotificationModel;


class SmsService
{
    /**
     * Send an SMS notification.
     *
     * @param string $phoneNumber The recipient's phone number.
     * @param string $message The message to send.
     * @return bool True on success, false on failure.
     */
    public function sendSms($phoneNumber, $message)
    {
        // Here you would integrate with an SMS gateway API
        // For demonstration, we'll just log the message
        log_message('info', "Sending SMS to {$phoneNumber}: {$message}");

        // Simulate sending SMS
        $success = true; // Assume it succeeds for this example

        if ($success) {
            // Fire an event after sending the SMS
            Events::trigger('sms_sent', [
                'phone' => $phoneNumber,
                'message' => $message
            ]);
            return true;
        }

        return false;
    }
}