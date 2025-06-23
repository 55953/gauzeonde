<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\PaymentModel;

class Payments extends ResourceController
{
    public function makePayment()
    {
        $rules = [
            'shipment_id' => 'required|is_natural_no_zero',
            'payer_id' => 'required|is_natural_no_zero',
            'payee_id' => 'required|is_natural_no_zero',
            'amount' => 'required|decimal'
        ];
        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $paymentModel = new PaymentModel();
        $data = [
            'shipment_id' => $this->request->getVar('shipment_id'),
            'payer_id' => $this->request->getVar('payer_id'),
            'payee_id' => $this->request->getVar('payee_id'),
            'amount' => $this->request->getVar('amount'),
            'status' => 'paid',
            'payment_method' => $this->request->getVar('payment_method'),
            'transaction_id' => uniqid('txn_'),
        ];
        $paymentModel->insert($data);
        return $this->respondCreated($data);
    }

    public function index($user_id = null)
    {
        if (!$user_id) return $this->failNotFound();
        $model = new PaymentModel();
        $payments = $model->where('payer_id', $user_id)->orWhere('payee_id', $user_id)->findAll();
        return $this->respond($payments);
    }
}
