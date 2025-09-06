<?php

namespace App\Enums;

enum UserStatus: string
{
    case ACTIVE = 'active';
    case INACTIVE = 'inactive';
    case BLOCKED = 'blocked';
    case SUSPENDED = 'suspended';
    case ONHOLD = 'on_hold';
    case PENDING = 'pending';
    case PENDING_VERIFICATION = 'pending_verification';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}


/*
    * Example usage in a controller or service:
    # To show only active online

    $drivers = (new UserModel())
    ->where('role', 'driver')
    ->where('status', 'active')
    ->where('online', true)
    ->where('document_status', 'approved')
    ->findAll();

    # To block a user(admin) account

    $userModel->update($userId, ['status' => 'blocked']);

    # To check if a driver is eligible to accept jobs

    $user = $userModel->find($driverId);
    if (
        $user['status'] !== 'active' ||
        !$user['online'] ||
        $user['document_status'] !== 'approved'
    ) {
        return $this->fail('Driver is not eligible to accept shipments.');
    }

    # To track driver online/offline status (e.g. driver opens/closes app, heartbeat ping):

    $userModel->update($userId, [
        'online' => true,
        'last_online_at' => date('Y-m-d H:i:s')
    ]);

    # Update/Expose Statuses via API
        Admin panel: Update status, document_status, online

        Driver app: Toggle online/offline, upload docs to change document_status

        API endpoint:

        GET /api/drivers/online – list online/active/approved drivers

        PATCH /api/user/{id}/status – admin updates status

        PATCH /api/user/{id}/online – set online/offline

    # Best Practices
        Always check all relevant status fields (status, online, document_status) before matching/assigning jobs.

        Expose allowed status values via endpoint or constants (e.g., for mobile app to know what options exist).

        Emit events when a user changes status for notification/auditing (e.g. user_status_changed).

    # EXAMPLE VALIDATION RULE FOR ADMIN

        use App\Enums\UserStatus;

        $rules = [
            'status' => 'required|in_list[' . implode(',', UserStatus::values()) . ']',
            'document_status' => 'required|in_list[' . implode(',', DocumentStatus::values()) . ']',
        ];
