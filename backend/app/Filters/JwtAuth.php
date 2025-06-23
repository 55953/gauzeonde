<?php

namespace App\Filters;

use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\Filters\FilterInterface;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use App\Models\UserModel;

class JwtAuth implements FilterInterface
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
            $decoded = \Firebase\JWT\JWT::decode($token, new \Firebase\JWT\Key($key, 'HS256'));
            $userModel = new \App\Models\UserModel();
            $user = $userModel->find($decoded->sub);

            if (!$user) {
                return service('response')->setJSON([
                    'status' => 401,
                    'error' => 'User not found'
                ])->setStatusCode(401);
            }

            // Role check logic
            if ($arguments && count($arguments) > 0) {
                // Roles can be specified as: ['admin'], ['driver','admin'], etc
                $allowedRoles = array_map('strtolower', $arguments);
                $userRole = strtolower($user['role']);
                if (!in_array($userRole, $allowedRoles)) {
                    return service('response')->setJSON([
                        'status' => 403,
                        'error' => 'Forbidden: Insufficient role'
                    ])->setStatusCode(403);
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
        // No action needed after response
    }
}
