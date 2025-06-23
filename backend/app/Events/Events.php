<?php

namespace App\Events;

use CodeIgniter\Events\Events;

// ...existing system events...

// Listen for shipment events
Events::on('shipment_created', [\App\Listeners\ShipmentEventListener::class, 'onCreated']);
Events::on('shipment_delivered', [\App\Listeners\ShipmentEventListener::class, 'onDelivered']);


// --- USER EVENTS ---
Events::on('user_registered', [\App\Listeners\UserEventListener::class, 'onRegistered']);
Events::on('user_profile_updated', [\App\Listeners\UserEventListener::class, 'onProfileUpdated']);

// --- DRIVER EVENTS ---
Events::on('driver_itinerary_created', [\App\Listeners\DriverEventListener::class, 'onItineraryCreated']);
Events::on('driver_assigned_shipment', [\App\Listeners\DriverEventListener::class, 'onAssignedShipment']);

// --- SHIPMENT EVENTS (using generic status event as above) ---
Events::on('shipment_status_changed', [\App\Listeners\ShipmentEventListener::class, 'onStatusChanged']); 