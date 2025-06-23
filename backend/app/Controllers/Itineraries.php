<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\ItineraryModel;
use App\Models\ShipmentModel;
use CodeIgniter\API\ResponseTrait;

class Itineraries extends ResourceController
{
    use ResponseTrait;
    // $user = $this->request->user;
    /**
     * Create a new itinerary for a driver
     * POST /api/itineraries
     */
    public function create()
    {
        $rules = [
            'user_id' => 'required|is_natural_no_zero',
            'origin' => 'required',
            'destination' => 'required',
            'departure_time' => 'required',
            'arrival_time' => 'permit_empty',
            'vehicle_details' => 'permit_empty'
        ];
        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $data = [
            'user_id' => $this->request->getVar('user_id'),
            'origin' => $this->request->getVar('origin'),
            'destination' => $this->request->getVar('destination'),
            'departure_time' => $this->request->getVar('departure_time'),
            'arrival_time' => $this->request->getVar('arrival_time'),
            'vehicle_details' => $this->request->getVar('vehicle_details'),
        ];

        $model = new ItineraryModel();
        $id = $model->insert($data);
        $data['id'] = $id;
        return $this->respondCreated($data);
    }

    /**
     * Get all itineraries for a user
     * GET /api/itineraries/user/{user_id}
     */
    public function myItineraries($user_id = null)
    {
        if (!$user_id) {
            return $this->failValidationErrors(['user_id' => 'user_id is required']);
        }
        $model = new ItineraryModel();
        $itineraries = $model->where('user_id', $user_id)->orderBy('departure_time', 'DESC')->findAll();
        return $this->respond($itineraries);
    }

    /**
     * Find shipments that match a driver's route (very basic example)
     * GET /api/itineraries/available-shipments/{user_id}
     */
    public function availableShipments($user_id = null)
    {
        if (!$user_id) return $this->failNotFound('User ID required');

        $itineraryModel = new ItineraryModel();
        $shipmentModel = new ShipmentModel();

        // Get user's current itinerary (most recent/active)
        $itinerary = $itineraryModel->where('user_id', $user_id)->orderBy('departure_time', 'DESC')->first();
        if (!$itinerary) {
            return $this->respond([]);
        }

        // Example matching logic: Find shipments with destination "similar" to the itinerary destination and status 'pending'
        $shipments = $shipmentModel
            ->like('destination', $itinerary['destination'], 'both')
            ->where('status', 'pending')
            ->findAll();

        return $this->respond($shipments);
    }
}
