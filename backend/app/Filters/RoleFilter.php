<?php

namespace App\Filters;

use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\Filters\FilterInterface;
use Config\Services;

class RoleFilter implements FilterInterface
{
    /**
     * Before filter: Check user role(s) after JWT authentication
     * Usage: 'filter' => 'role:admin', or 'role:driver,sender'
     */
    public function before(RequestInterface $request, $arguments = null)
    {
        // Get user from service or request (depends on your JWTFilter implementation)
        // This assumes you use a shared Auth service or attach the user in JWTFilter.
        // var_dump(service('auth')); die();
        $user = service('auth')->currentUser();

        if (!$user) {
            return Services::response()
                ->setStatusCode(401)
                ->setJSON(['message' => 'Unauthorized']);
        }

        // $arguments is an array of allowed roles: e.g., ['admin'], ['driver', 'sender']
        $allowedRoles = $arguments ?? [];
        $userRole = is_array($user) ? ($user['role'] ?? null) : ($user->role ?? null);
        
        // The user object/array should have a 'role' property (adjust as needed)
       if (!$userRole || !in_array($userRole, $allowedRoles)) {
            return Services::response()
                ->setStatusCode(403)
                ->setJSON(['message' => 'Forbidden: insufficient role']);
        }
        // Continue request
    }

    /**
     * After filter (unused)
     */
    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // Nothing to do after
    }
}
