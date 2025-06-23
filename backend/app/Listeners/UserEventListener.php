<?php

namespace App\Listeners;

use App\Models\NotificationModel;

class UserEventListener
{
    public static function onRegistered($user)
    {
        // Welcome notification
        $notif = [
            'user_id' => $user['id'],
            'type' => 'user_registered',
            'content' => "Welcome, {$user['name']}! Your account is now active.",
        ];
        (new NotificationModel())->insert($notif);

        // You can trigger a welcome email here as well
        // Send welcome notification as before...

        // --- Send Welcome Email ---
        if (empty($user['email']) || empty($user['activation_code'])) return;

        $email = service('email');
        $email->setTo($user['email']);
        $email->setSubject('Activate your Gauzeonde account');
        $email->setMessage("Hi {$user['name']},\nWelcome to Gauzeonde!\n\nYour activation code is: {$user['activation_code']}\n\nThis code expires in 30 minutes.");

        if (!$email->send()) {
            log_message('error', 'Failed to send registration email to ' . $user['email']);
        }
        log_message('info', 'Registration email sent to ' . $user['email']);
    }

    public static function onProfileUpdated($user)
    {
        // Profile updated notification
        $notif = [
            'user_id' => $user['id'],
            'type' => 'profile_updated',
            'content' => "Hi {$user['name']}, your profile has been updated.",
        ];
        (new NotificationModel())->insert($notif);

        // --- Send Welcome Email ---
        if (empty($user['email'])) return;

        $email = service('email');
        $email->setTo($user['email']);
        $email->setSubject('Gauzeonde Profile Updated');
        $email->setMessage("Hi {$user['name']},\nYour profile has been updated.\n\nIf you did not make this change, please contact support immediately.");

        if (!$email->send()) {
            log_message('error', 'Failed to send profile update email to ' . $user['email']);
        }
        log_message('info', 'Profile update email sent to ' . $user['email']);
    }
}
