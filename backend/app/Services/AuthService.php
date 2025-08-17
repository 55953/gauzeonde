<?php

namespace App\Services;

use App\Models\UserModel;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use CodeIgniter\I18n\Time;
use CodeIgniter\Config\BaseService;

class AuthService extends BaseService
{
    protected $users;
    protected $jwtSecret;
    protected $jwtIssuer;

    public function __construct()
    {
        $this->users = new UserModel();
        $this->jwtSecret = getenv('JWT_SECRET') ?: 'supersecretkey';
        $this->jwtIssuer = getenv('JWT_ISSUER') ?: base_url();
    }

    /**
     * Attempt login. Return JWT on success.
     */
    public function attemptLogin(string $email, string $password)
    {
        $user = $this->users->where('email', $email)->first();
        if (!$user || !password_verify($password, $user['password'])) {
            return false;
        }

        if ($user['status'] !== 'active') {
            return 'pending'; // Or handle as needed
        }

        // Generate JWT
        $payload = [
            'sub' => $user['id'],
            'email' => $user['email'],
            'role' => $user['role'],
            'iat' => time(),
            'exp' => time() + 60*60*24*7, // 7 days
            'iss' => $this->jwtIssuer,
        ];

        $token = JWT::encode($payload, $this->jwtSecret, 'HS256');
        unset($user['password']);
        return [
            'token' => $token,
            'user'  => $user,
        ];
    }

    /**
     * Register new user. Return user or false.
     */
    public function register(array $data)
    {
        if ($this->users->where('email', $data['email'])->first()) {
            return false;
        }
        $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        $data['status'] = 'pending';
        $data['activation_code'] = rand(100000, 999999);
        $data['activation_expires'] = Time::now()->addHours(12);

        $id = $this->users->insert($data, true);
        if (!$id) return false;

        $user = $this->users->find($id);
        unset($user['password']);
        return $user;
    }

    /**
     * Activate account
     */
    public function activate(string $email, string $code)
    {
        $user = $this->users->where('email', $email)->first();
        if (!$user) return false;
        if ($user['status'] === 'active') return true;
        if ($user['activation_code'] !== $code) return false;
        if (Time::now()->isAfter($user['activation_expires'])) return false;

        $this->users->update($user['id'], [
            'status' => 'active',
            'activation_code' => null,
            'activation_expires' => null,
        ]);
        return true;
    }

    /**
     * Decode JWT and return user or false.
     */
    public function authenticate(string $token)
    {
        try {
            $decoded = JWT::decode($token, new Key($this->jwtSecret, 'HS256'));
            $user = $this->users->find($decoded->sub);
            if ($user && $user['status'] === 'active') {
                unset($user['password']);
                return $user;
            }
        } catch (\Exception $e) {
            return false;
        }
        return false;
    }

    
    /**
     * Send account activation email (or SMS)
     */
    public function sendActivation($user)
    {
        if (empty($user['email']) || empty($user['activation_code'])) return false;
        $email = Services::email();

        $email->setTo($user['email']);
        $email->setSubject('Activate your Gauzeonde Account');
        $email->setMessage("Hi {$user['name']},\n\nYour activation code is: {$user['activation_code']}\nOr activate via: " .
            base_url("auth/activate/{$user['activation_code']}?email={$user['email']}"));

        return $email->send();
    }

    /**
     * Initiate password reset: sets reset_token, sends email/SMS
     */
    public function sendPasswordReset(string $email)
    {
        $user = $this->users->where('email', $email)->first();
        if (!$user) return false;

        $reset_token = bin2hex(random_bytes(32));
        $expires = Time::now()->addHours(1);

        $this->users->update($user['id'], [
            'reset_token' => $reset_token,
            'reset_token_expires' => $expires,
        ]);
        $user['reset_token'] = $reset_token;

        // Send email (or SMS)
        $mail = Services::email();
        $mail->setTo($user['email']);
        $mail->setSubject('Reset your Gauzeonde password');
        $reset_link = base_url("auth/reset-password/{$reset_token}?email={$user['email']}");
        $mail->setMessage("Hi {$user['name']},\n\nReset your password using this link:\n$reset_link\n\nThis link expires in 1 hour.");

        return $mail->send();
    }

    /**
     * Verify password reset token
     */
    public function verifyPasswordResetToken(string $email, string $token)
    {
        $user = $this->users->where('email', $email)->first();
        if (
            !$user ||
            empty($user['reset_token']) ||
            $user['reset_token'] !== $token ||
            Time::now()->isAfter($user['reset_token_expires'])
        ) {
            return false;
        }
        return $user;
    }

    /**
     * Reset password using reset_token
     */
    public function resetPassword(string $email, string $token, string $newPassword)
    {
        $user = $this->verifyPasswordResetToken($email, $token);
        if (!$user) return false;

        $this->users->update($user['id'], [
            'password' => password_hash($newPassword, PASSWORD_DEFAULT),
            'reset_token' => null,
            'reset_token_expires' => null,
        ]);
        return true;
    }

        /**
     * Return the currently authenticated user (or null)
     * Reads JWT token from Authorization header.
     */
    public function currentUser(): ?array
    {
        $request = service('request');
        $authHeader = $request->getHeaderLine('Authorization');
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return null;
        }
        $token = substr($authHeader, 7);

        try {
            $decoded = \Firebase\JWT\JWT::decode($token, new \Firebase\JWT\Key($this->jwtSecret, 'HS256'));
            $user = $this->users->find($decoded->user->sub);
            if ($user && $user['status'] === 'active') {
                unset($user['password']);
                return $user;
            }
        } catch (\Exception $e) {
            return null;
        }
        return null;
    }

}
