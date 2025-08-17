<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\UserModel;
use \Firebase\JWT\JWT;
use CodeIgniter\Events\Events;

class Auth extends ResourceController
{
    public function register()
    {
        if ($this->request->getMethod() !== 'POST') {
            return $this->respond('Wrong request method', 405);
        }
        $rules = [
            'name' => 'required',
            'email' => 'required|valid_email|is_unique[users.email]',
            'phone' => 'required|is_unique[users.phone]',
            'password' => 'required|min_length[8]',
            'role' => 'required|in_list[driver,sender,admin]'
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }
        // Generate activation code (optional, can be used for email verification)
        $code = str_pad(random_int(100000, 999999), 6, '0', STR_PAD_LEFT);
        // Create user
        $user = [
            'name' => $this->request->getVar('name'),
            'email' => $this->request->getVar('email'),
            'phone' => $this->request->getVar('phone'),
            'password' => password_hash($this->request->getVar('password'), PASSWORD_DEFAULT),
            'role' => $this->request->getVar('role'),
            'status' => 'pending_verification',       // or 'active' if preferred
            'is_active' => false,
            'activation_code' => $code,
            'activation_expires' => date('Y-m-d H:i:s', time() + 1800), // 30 min
            'document_status' => 'pending',
            'kyc_status' => 'pending',
            'rating' => 0.0,
        ];
        $userModel = new UserModel();
        $userModel->insert($user);
        $user['id'] = $userModel->getInsertID(); // Add user ID
        unset($user['password']); // Remove password from response
        // Trigger user registered event
        Events::trigger('user_registered', $user);
        // Optionally send welcome email or SMS
        // Send activation code via email (or SMS)
        $message = "Your activation code is: $code . \n\n Please click the link <a href='" . base_url("api/auth/activate/$code") . "'>here</a> or copy and paste this URL to activate your account.";
        $emailService = \Config\Services::email();
        $emailService->setTo($user['email']);
        $emailService->setSubject('Activate your account');
        $emailService->setMessage($message);
        $emailService->send();
        // return $this->respondCreated(['message' => 'User registered successfully']);
        return $message;
    }

    public function login()
    {
        if ($this->request->getMethod() !== 'POST') {
            return $this->respond('Wrong request method', 405);
        }
        $rules = [
            'email' => 'required',
            'password' => 'required'
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }
        $userModel = new UserModel();
        $email = $this->request->getVar('email');
        $password = $this->request->getVar('password');
        $user = $userModel->where('email', $email)->first();

        if (!$user || !password_verify($password, $user['password'])) {
            return $this->failUnauthorized('Invalid credentials');
        }
        if ($user['status'] !== 'active') {
            return $this->failUnauthorized('Account not active. Please activate using the code sent to your email. ei:' . base_url("api/auth/activate/") . '<activation_code>');
        }
        // if ($user['status'] !== 'active' || $user['kyc_status'] !== 'verified') {
        //     return $this->failUnauthorized('Account not active or KYC not verified');
        // }
        
        $key = getenv('JWT_SECRET') ?: 'supersecretkey';
        $payload = [
            'iss' => base_url(),
            'aud' => base_url(),
            'user' => [
                'sub' => $user['id'],
                'email' => $user['email'],
                'name' => $user['name'],
                'role' => $user['role'],
                'phone' => $user['phone'],
                'status' => $user['status']
            ],
            'iat' => time(),
            'exp' => time() + 3600
        ];
        $jwt = JWT::encode($payload, $key, 'HS256');

        return $this->respond(['token' => $jwt]);
    }

    /**
     * Optionally: Get user profile by JWT
     * GET /api/auth/profile
     */
    public function profile()
    {
        $authHeader = $this->request->getHeaderLine('Authorization');
        if (!$authHeader || strpos($authHeader, 'Bearer ') !== 0) {
            return $this->failUnauthorized('Missing or invalid JWT token');
        }
        $jwt = substr($authHeader, 7);
        $key = getenv('JWT_SECRET') ?: 'supersecretkey';
        try {
            $decoded = JWT::decode($jwt, new \Firebase\JWT\Key($key, 'HS256'));
        } catch (\Exception $e) {
            return $this->failUnauthorized('Invalid JWT');
        }
        $userModel = new UserModel();
        $user = $userModel->find($decoded->sub);
        if (!$user) return $this->failNotFound('User not found');
        unset($user['password']);
        return $this->respond($user);
    }
    
    public function update_profile()
    {
        $authHeader = $this->request->getHeaderLine('Authorization');
        if (!$authHeader || strpos($authHeader, 'Bearer ') !== 0) {
            return $this->failUnauthorized('Missing or invalid JWT token');
        }
        $jwt = substr($authHeader, 7);
        $key = getenv('JWT_SECRET') ?: 'supersecretkey';
        try {
            $decoded = JWT::decode($jwt, new \Firebase\JWT\Key($key, 'HS256'));
        } catch (\Exception $e) {
            return $this->failUnauthorized('Invalid JWT');
        }

        $userModel = new UserModel();
        $user = $userModel->find($decoded->sub);
        if (!$user) return $this->failNotFound('User not found');

        // Validate input
        $rules = [
            'name' => 'permit_empty',
            'email' => 'permit_empty|valid_email|is_unique[users.email,id,' . $user['id'] . ']',
            'phone' => 'permit_empty|is_unique[users.phone,id,' . $user['id'] . ']',
            'password' => 'permit_empty|min_length[8]',
        ];
        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        // Update user data
        if ($this->request->getVar('name')) {
            $user['name'] = $this->request->getVar('name');
        }
        if ($this->request->getVar('email')) {
            $user['email'] = $this->request->getVar('email');
        }
        if ($this->request->getVar('phone')) {
            $user['phone'] = $this->request->getVar('phone');
        }
        if ($this->request->getVar('password')) {
            $user['password'] = password_hash($this->request->getVar('password'), PASSWORD_DEFAULT);
        }

        // Save updated user
        $userModel->save($user);
        
        // Trigger profile updated event
        Events::trigger('user_profile_updated', $user);

        return $this->respond(['message' => 'Profile updated successfully']);
    }

    public function requestPasswordReset()
    {
        $email = $this->request->getVar('email');
        $userModel = new \App\Models\UserModel();
        $user = $userModel->where('email', $email)->first();
        if (!$user) return $this->failNotFound('Email not found');

        // Generate token (store in DB or cache, here in DB for demo)
        $token = bin2hex(random_bytes(16));
        $expires = date('Y-m-d H:i:s', time() + 3600); // 1hr
        $userModel->update($user['id'], [
            'reset_token' => $token,
            'reset_token_expires' => $expires
        ]);

        // Send email (or SMS) with reset link/token
        $resetLink = base_url("reset-password/{$token}");
        $emailService = \Config\Services::email();
        $emailService->setTo($email);
        $emailService->setSubject('Reset your password');
        $emailService->setMessage("Hi, reset your password here: $resetLink\nThe link expires in 1 hour.");
        $emailService->send();

        return $this->respond(['message' => 'Reset link sent to your email']);
    }

    public function resetPassword()
    {
        $token = $this->request->getVar('token');
        $newPassword = $this->request->getVar('password');

        $userModel = new \App\Models\UserModel();
        $user = $userModel->where('reset_token', $token)
                        ->where('reset_token_expires >=', date('Y-m-d H:i:s'))
                        ->first();

        if (!$user) {
            return $this->fail('Invalid or expired token');
        }

        if (strlen($newPassword) < 8) {
            return $this->failValidationErrors(['password' => 'Minimum 8 characters']);
        }

        $userModel->update($user['id'], [
            'password' => password_hash($newPassword, PASSWORD_DEFAULT),
            'reset_token' => null,
            'reset_token_expires' => null
        ]);

        return $this->respond(['message' => 'Password reset successful']);
    }

    public function activate($code = null)
    {
        //$email = $this->request->getVar('email');
        $code = $code ?: $this->request->getVar('code');
        if (!$code) {
            return $this->response->setStatusCode(400)->setJSON(['message' => 'No code provided']);
        }
        $userModel = new UserModel();
        //$user = $userModel->where('email', $email)
        $user = $userModel->where('activation_code', $code)
            ->where('activation_expires >=', date('Y-m-d H:i:s'))
            ->first();

        if (!$user) {
            return $this->fail('Invalid or expired activation code', 404);
        }

        $userModel->update($user['id'], [
            'status' => 'active',
            'activation_code' => null,
            'activation_expires' => null
        ]);

        return $this->respond(['message' => 'Account is activated, you can now login']);
    }

    // For /auth/password/forgot endpoint
    public function forgotPassword()
    {
        $data = $this->request->getJSON(true) ?? $this->request->getPost();
        if ($this->authService->sendPasswordReset($data['email'])) {
            return $this->respond(['status'=>'ok']);
        }
        return $this->fail('Unable to send reset');
    }

    // For /auth/password/reset endpoint
    public function rresetPassword()
    {
        $data = $this->request->getJSON(true) ?? $this->request->getPost();
        if ($this->authService->resetPassword($data['email'], $data['token'], $data['new_password'])) {
            return $this->respond(['status'=>'password_reset']);
        }
        return $this->fail('Unable to reset password');
    }

}
