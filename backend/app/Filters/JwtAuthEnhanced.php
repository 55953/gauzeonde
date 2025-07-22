<?php

namespace App\Filters;

use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\Filters\FilterInterface;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use App\Models\UserModel;

class JwtAuthEnhanced implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        $header = $request->getHeaderLine('Authorization');
        if (!$header || strpos($header, 'Bearer ') !== 0) {
            return service('response')->setJSON([
                'status' => 401,
                'error' => 'Missing Authorization Header'
            ])->setStatusCode(401);
        }

        $token = substr($header, 7);
        $key = getenv('JWT_SECRET') ?: 'supersecretkey';

        try {
            $decoded = JWT::decode($token, new Key($key, 'HS256'));
            $userModel = new UserModel();
            $user = $userModel->find($decoded->sub);

            if (!$user) {
                return service('response')->setJSON([
                    'status' => 401,
                    'error' => 'User not found'
                ])->setStatusCode(401);
            }

            // Role/Permission/ID logic
            if ($arguments && count($arguments) > 0) {
                // If permission string is present after "@"
                $perm = null;
                if (strpos($arguments[0], '@') !== false) {
                    [$roleStr, $perm] = explode('@', $arguments[0], 2);
                } else {
                    $roleStr = $arguments[0];
                }
                $allowedRolesOrIds = array_map('trim', explode(',', $roleStr));
                $userRole = strtolower($user['role']);
                $userId = (string)$user['id'];

                // Check role or user id
                $allowed = false;
                foreach ($allowedRolesOrIds as $allowedRoleOrId) {
                    if ($userRole === strtolower($allowedRoleOrId) || $userId === $allowedRoleOrId) {
                        $allowed = true;
                        break;
                    }
                }
                if (!$allowed) {
                    return service('response')->setJSON([
                        'status' => 403,
                        'error' => 'Forbidden: Insufficient role or not authorized for user ID'
                    ])->setStatusCode(403);
                }

                // If a permission string is set, check user permissions
                if ($perm) {
                    // Basic hardcoded permissions, or you can use a DB field/role map
                    $permissions = [
                        'admin' => ['delete-user', 'shipment-create', 'view-all'],
                        'driver' => ['shipment-create', 'itinerary-create'],
                        'sender' => ['shipment-create'],
                    ];
                    $rolePerms = $permissions[$userRole] ?? [];
                    if (!in_array($perm, $rolePerms)) {
                        return service('response')->setJSON([
                            'status' => 403,
                            'error' => "Forbidden: Missing permission [$perm]"
                        ])->setStatusCode(403);
                    }
                }
            }

            $request->user = $user;

        } catch (\Exception $e) {
            return service('response')->setJSON([
                'status' => 401,
                'error' => 'Invalid or expired token'
            ])->setStatusCode(401);
        }
        // Let the request through
        return;
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // Nothing after
    }
}
