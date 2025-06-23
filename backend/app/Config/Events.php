<?php

namespace Config;
/*
 * --------------------------------------------------------------------
 * Application Events
 * --------------------------------------------------------------------
 * Events allow you to tap into the execution of the program without
 * modifying or extending core files. This file provides a central
 * location to define your events, though they can always be added
 * at run-time, also, if needed.
 *
 * You create code that can execute by subscribing to events with
 * the 'on()' method. This accepts any form of callable, including
 * Closures, that will be executed when the event is triggered.
 *
 * Example:
 *      Events::on('create', [$myInstance, 'myMethod']);
 */


use CodeIgniter\Events\Events;
use CodeIgniter\Exceptions\FrameworkException;
use CodeIgniter\HotReloader\HotReloader;
use App\Listeners\ShipmentEventListener;
use App\Listeners\UserEventListener;
use App\Listeners\DriverEventListener;


Events::on('pre_system', static function (): void 
    {
    if (ENVIRONMENT !== 'testing') {
        if (ini_get('zlib.output_compression')) {
            throw FrameworkException::forEnabledZlibOutputCompression();
        }

        while (ob_get_level() > 0) {
            ob_end_flush();
        }

        ob_start(static fn ($buffer) => $buffer);
    }

    /*
     * --------------------------------------------------------------------
     * Debug Toolbar Listeners.
     * --------------------------------------------------------------------
     * If you delete, they will no longer be collected.
     */
    if (CI_DEBUG && ! is_cli()) {
        Events::on('DBQuery', 'CodeIgniter\Debug\Toolbar\Collectors\Database::collect');
        service('toolbar')->respond();
        // Hot Reload route - for framework use on the hot reloader.
        if (ENVIRONMENT === 'development') {
            service('routes')->get('__hot-reload', static function (): void {
                (new HotReloader())->run();
            });
        }
    }
});

// ...other events...

// --- USER EVENTS ---
Events::on('user_registered', [UserEventListener::class, 'onRegistered']);
Events::on('user_profile_updated', [UserEventListener::class, 'onProfileUpdated']);

// --- DRIVER EVENTS ---
Events::on('driver_itinerary_created', [DriverEventListener::class, 'onItineraryCreated']);
Events::on('driver_assigned_shipment', [DriverEventListener::class, 'onAssignedShipment']);

// --- SHIPMENT EVENTS (using generic status event as above) ---
Events::on('shipment_status_changed', [ShipmentEventListener::class, 'onStatusChanged']);


// <?php

// namespace App\Events;

// use CodeIgniter\Events\Events;

// // ...existing system events...

// // Listen for shipment events
// Events::on('shipment_created', [\App\Listeners\ShipmentEventListener::class, 'onCreated']);
// Events::on('shipment_delivered', [\App\Listeners\ShipmentEventListener::class, 'onDelivered']);


// // --- USER EVENTS ---
// Events::on('user_registered', [\App\Listeners\UserEventListener::class, 'onRegistered']);
// Events::on('user_profile_updated', [\App\Listeners\UserEventListener::class, 'onProfileUpdated']);

// // --- DRIVER EVENTS ---
// Events::on('driver_itinerary_created', [\App\Listeners\DriverEventListener::class, 'onItineraryCreated']);
// Events::on('driver_assigned_shipment', [\App\Listeners\DriverEventListener::class, 'onAssignedShipment']);

// // --- SHIPMENT EVENTS (using generic status event as above) ---
// Events::on('shipment_status_changed', [\App\Listeners\ShipmentEventListener::class, 'onStatusChanged']);

