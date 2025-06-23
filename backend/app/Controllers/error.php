<?php

namespace App\Controllers;

use Codeigniter\ResponseTrait;

class Errors extends BaseController

{

    /**
     * Show a 404 error page.
     *
     * @return \CodeIgniter\HTTP\Response
     */
    public function show404()
    {   
        if($this->request->getMethod() === 'GET') {
            // If the request is a GET request, return a 404 view
            return view('errors/html/error_404', [
                'title' => '404 Not Found',
                'message' => 'The page you are looking for could not be found.'
            ]);
        }else{
            return view('errors/html/error_404', [
            'title' => '401 Unauthorized',
            'message' => 'You are not authorized to access this resource.'
        ]);
        }
    }
    public function show401()
    {
        responseTrait;// Return a 401 view
        return respond([
            'status' => 405,
            'error' => 'Method Not Allowed',
            'message' => 'You cannot access this resource with the requested method.'
        ], 405);
    }
}