<?php
declare(strict_types=1);

namespace App\Filters;

use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use CodeIgniter\Filters\FilterInterface;
use Config\Services;

class Cors implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        // Use your frontend URL here, not * if using credentials!
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Authorization, Access-Control-Allow-Origin');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH');
        header('Access-Control-Allow-Credentials: true');
        header("Access-Control-Max-Age: 3600"); 

        // For preflight (OPTIONS) requests, stop further processing and return 200 OK immediately
        if ($request->getMethod() === 'OPTIONS') {
            // Clean output buffer if any, then return a CI Response
            http_response_code(200);
            exit();
            // ob_end_clean();
            // $response = Services::response();
            // $response->setStatusCode(204);
            // $response->setHeader('Access-Control-Allow-Origin', '*');
            // $response->setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            // $response->setHeader('Access-Control-Allow-Headers', 'X-API-KEY, X-Requested-With, Accept, Content-Type, Authorization, Access-Control-Allow-Origin');
            // $response->setHeader('Access-Control-Allow-Credentials', 'true');
            // $response->send();
            // exit;
            // die();
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // $response->setHeader('Access-Control-Allow-Origin', '*');
        // $response->setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        // $response->setHeader('Access-Control-Allow-Headers', 'X-API-KEY, X-Requested-With, Accept, Content-Type, Authorization');
        // $response->setHeader('Access-Control-Allow-Credentials', 'true');
    }
}
