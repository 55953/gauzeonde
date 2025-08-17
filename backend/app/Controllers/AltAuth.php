<?php

namespace App\Controllers;

use App\Services\AuthService;
use CodeIgniter\RESTful\ResourceController;

class AltAuth extends ResourceController
{
    protected $authService;

    public function __construct()
    {
        $this->authService = new AuthService();
    }

    public function login()
    {
        $data = $this->request->getJSON(true) ?? $this->request->getPost();
        $res = $this->authService->attemptLogin($data['email'], $data['password']);

        if ($res === false) {
            return $this->failUnauthorized('Invalid credentials');
        } elseif ($res === 'pending') {
            return $this->fail('Account not activated');
        }
        return $this->respond($res);
    }

    public function register()
    {
        $data = $this->request->getJSON(true) ?? $this->request->getPost();
        $user = $this->authService->register($data);

        if (!$user) {
            return $this->fail('Registration failed');
        }
        // Optionally send activation email here
        return $this->respondCreated($user);
    }

    public function activate()
    {
        $data = $this->request->getJSON(true) ?? $this->request->getPost();
        $ok = $this->authService->activate($data['email'], $data['code']);
        if ($ok) return $this->respond(['status'=>'activated']);
        return $this->fail('Activation failed');
    }
}
