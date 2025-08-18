<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');
$routes->get('about', 'Home::about');

// $routes->options('(:any)', function() {
//     return 'OK';
// });

$routes->group('api', function(RouteCollection $routes): void {

    $routes->options('(:any)', static function () {
        // Implement processing for normal non-preflight OPTIONS requests,
        // if necessary.
        $response = response();
        $response->setStatusCode(204);
        $response->setHeader('Allow:', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');

        return $response;
    });
    $routes->options('auth/(:any)', static function () {});

    // --- AUTH (public) ---
    $routes->post('auth/register',      'Auth::register');
    $routes->get('auth/register',       'Auth::register');
    $routes->post('auth/login',         'Auth::login');
    $routes->get('auth/login',         'Auth::login');
    $routes->get('auth/activate/(:segment)', 'Auth::activate/$1');
    $routes->post('auth/request-password-reset', 'Auth::requestPasswordReset');
    $routes->post('auth/reset-password', 'Auth::resetPassword');
    $routes->post('auth/password/email','Auth::sendResetEmail');
    $routes->post('auth/password/reset','Auth::resetPassword');

    // --- USER (auth required) ---
    $routes->group('', ['filter' => 'auth'], function($routes) {
        $routes->get('users',               'Users::index', ['filter' => 'role:admin']);  // Only admin
        $routes->get('users/all',           'Users::getAllFilterBy', ['filter' => 'role:admin']);  // Only admin
        $routes->get('users/me',            'Users::me'); // Any logged in user
        $routes->get('users/(:num)',        'Users::show/$1', ['filter' => 'role:admin']);
        $routes->put('users/(:num)',        'Users::update/$1'); // User can update self, or admin can update any
        $routes->delete('users/(:num)',     'Users::delete/$1', ['filter' => 'role:admin']);
    });

    // --- USER DOCUMENTS / KYC ---
    $routes->group('', ['filter' => 'auth'], function($routes) {
        $routes->post('users/(:num)/documents',    'UserDocument::upload/$1');
        $routes->get('users/(:num)/documents',     'UserDocument::list/$1');
        $routes->get('users/(:num)/documents/(:num)', 'UserDocument::show/$1/$2');
        $routes->delete('users/(:num)/documents/(:num)', 'UserDocument::delete/$1/$2', ['filter' => 'role:admin']);
    });

    // --- ITINERARIES (driver-only) ---
    $routes->group('', ['filter' => 'auth'], function($routes) {
        $routes->get('itineraries',               'Itinerary::index');
        $routes->post('itineraries',              'Itinerary::create', ['filter' => 'role:driver']);
        $routes->get('itineraries/(:num)',        'Itinerary::show/$1');
        $routes->put('itineraries/(:num)',        'Itinerary::update/$1', ['filter' => 'role:driver']);
        $routes->delete('itineraries/(:num)',     'Itinerary::delete/$1', ['filter' => 'role:driver']);
    });

    // --- SHIPMENTS ---
    $routes->group('', ['filter' => 'auth'], function($routes) {
        $routes->get('shipments',                 'Shipment::index');
        $routes->post('shipments',                'Shipment::create', ['filter' => 'role:sender']);
        $routes->get('shipments/(:num)',          'Shipment::show/$1');
        $routes->put('shipments/(:num)',          'Shipment::update/$1');
        $routes->delete('shipments/(:num)',       'Shipment::delete/$1', ['filter' => 'role:admin']);
        $routes->get('shipments/(:num)/history',  'ShipmentStatusHistory::index/$1');
        $routes->get('shipments/track/(:segment)','Shipment::track/$1');
        $routes->post('shipments/(:num)/transfer','ShipmentTransfer::transfer/$1', ['filter' => 'role:driver']);
        $routes->get('shipments/(:num)/transfers','ShipmentTransfer::history/$1');
    });

    // --- PAYMENTS ---
    $routes->group('', ['filter' => 'auth'], function($routes) {
        $routes->get('payments',                  'Payment::index');
        $routes->post('payments',                 'Payment::create', ['filter' => 'role:sender']);
        $routes->get('payments/(:num)',           'Payment::show/$1');
        $routes->put('payments/(:num)',           'Payment::update/$1', ['filter' => 'role:admin']);
        $routes->get('shipments/(:num)/payments', 'Payment::shipment/$1');
    });

    // --- NOTIFICATIONS ---
    $routes->group('', ['filter' => 'auth'], function($routes) {
        $routes->get('notifications',             'Notification::index');
        $routes->get('notifications/(:num)',      'Notification::show/$1');
        $routes->post('notifications',            'Notification::create', ['filter' => 'role:admin']);
        $routes->put('notifications/(:num)/read', 'Notification::markRead/$1');
    });

    // --- DASHBOARD/ADMIN (admin only) ---
    $routes->group('', ['filter' => 'auth'], function($routes) {
        $routes->get('dashboard/overview',        'Dashboard::overview', ['filter' => 'role:admin']);
        $routes->get('dashboard/shipments',       'Dashboard::shipments', ['filter' => 'role:admin']);
        $routes->get('dashboard/drivers',         'Dashboard::drivers', ['filter' => 'role:admin']);
        $routes->get('dashboard/activity',        'Dashboard::activityLog', ['filter' => 'role:admin']);
    });

    // --- HEALTH CHECK / MISC ---
    $routes->get('health',    'System::health');
    $routes->get('status',    'System::status');

    // DRIVER (protected by JWT + role:driver)
    $routes->group('drivers', ['filter' => 'auth'], static function($routes) {
        $routes->get('me',                        'Drivers::me');
        $routes->post('online',                   'Drivers::Online', ['filter' => 'role:driver']); // {online: bool}
        $routes->get('online',                    'Drivers::online', ['filter' => 'role:driver']);
        $routes->get('onlineDrivers',             'Drivers::onlineDrivers', ['filter' => 'role:sender']);
        $routes->put('capacity',                  'Drivers::updateCapacity',['filter' => 'role:driver']); // limits
        $routes->get('shipments/open',            'Drivers::listOpenShipments', ['filter' => 'role:driver']); // view available
        $routes->get('shipments/my',              'Drivers::myShipments'); // assigned to me
        $routes->post('shipments/(:num)/accept',  'Drivers::acceptShipment/$1', ['filter' => 'role:driver']); // assign
        $routes->post('location',                 'Drivers::updateLocation'); // {lat,lng, ...}
    });

    // --- DRIVER LOCATION UPDATES (driver only) ---
    $routes->group('', ['filter' => 'auth'], function($routes) {
        $routes->post('drivers/(:num)/location',  'DriverLocation::update/$1', ['filter' => 'role:driver']);
        $routes->get('drivers/(:num)/locations',  'DriverLocation::history/$1', ['filter' => 'role:driver']);
        $routes->get('drivers/locations/batch',   'DriverLocation::batch', ['filter' => 'role:admin']);
    });
    // --- DRIVERS ---
    $routes->group('', ['filter' => 'auth'], function($routes) {
        $routes->get('drivers',                   'Driver::index', ['filter' => 'role:admin']);
        $routes->get('drivers/(:num)',            'Driver::show/$1');
        $routes->put('drivers/(:num)',            'Driver::update/$1', ['filter' => 'role:driver']);
        $routes->put('drivers/(:num)/status',     'Driver::setStatus/$1', ['filter' => 'role:driver']);
    });
});




// $routes->get("api/itineraries/available-shipments/(:segment)", "Itineraries::availableShipments/$1");

// $routes->post('api/shipments', 'Shipments::create', ['filter' => 'jwt']);

$routes->group('api', ['filter' => 'jwt'], function($routes) {
    $routes->get('auth/profile', 'Auth::profile');
    $routes->post('shipments', 'Shipments::create');
    $routes->post('itineraries', 'Itineraries::create');
    $routes->get('itineraries/available-shipments/(:segment)', 'Itineraries::availableShipments/$1');
    // ...add all protected routes here
});

// Restrict access per role

// Only admin
$routes->post('api/notifications', 'Notifications::store', ['filter' => 'jwt:admin']);

// Only drivers
$routes->post('api/itineraries', 'Itineraries::create', ['filter' => 'jwt:driver']);

// Drivers or senders
$routes->post('api/shipments', 'Shipments::create', ['filter' => 'jwt:driver,sender']);


// $routes->group('api', ['filter' => 'role:admin'], function($routes) {
//     $routes->get('users', 'Users::index');
//     $routes->get('users/(:segment)', 'Users::show/$1');
//     $routes->put('users/(:segment)', 'Users::update/$1');
//     $routes->delete('users/(:segment)', 'Users::delete/$1');
// });
// $routes->group('api', ['filter' => 'role:driver'], function($routes) {
//     $routes->get('itineraries/user/(:segment)', 'Itineraries::myItineraries/$1');
//     $routes->get('shipments/available-shipments/(:segment)', 'Shipments::availableShipments/$1');
// });
// $routes->group('api', ['filter' => 'role:sender'], function($routes) {
//     $routes->get('shipments/user/(:segment)', 'Shipments::myShipments/$1');
//     $routes->post('shipments/track', 'Shipments::trackShipment');
// });
// $routes->group('api', ['filter' => 'role:admin|driver|sender'], function($routes) {
//     $routes->get('notifications', 'Notifications::index');
//     $routes->post('notifications/mark-read', 'Notifications::markRead');
// });

// Restrict access per groups

$routes->group('api/driver', ['filter' => 'jwt:driver'], function($routes) {
    $routes->post('itineraries', 'Itineraries::create');
    // other driver-only endpoints
});

// ROUTES EXAMPLES

$routes->post('api/payments', 'Payments::makePayment', ['filter' => 'jwt:sender,admin']);
$routes->post('api/itineraries', 'Itineraries::create', ['filter' => 'jwt:driver']);
$routes->get('api/notifications/user/(:segment)', 'Notifications::index/$1', ['filter' => 'jwt:driver,sender,admin']);


// DELIVERED SHIPMENT ROUTE
$routes->get('api/shipments/status-options', 'Shipments::statusOptions', ['filter' => 'jwt:admin,driver,sender']);

$routes->post('api/shipments/delivered/(:segment)', 'Shipments::markDelivered/$1', ['filter' => 'jwt:driver,admin']);

$routes->post('api/shipments/assign/(:segment)', 'Shipments::assignDriver/$1', ['filter' => 'jwt:admin,driver']);

// SHIPEMENT LOCATION

$routes->get('api/shipment/(:segment)/location', 'Shipments::shipmentLocation/$1', ['filter' => 'jwt:admin,driver,sender']);
$routes->post('api/shipment/(:segment)/transfer', 'Shipments::transferShipment/$1', ['filter' => 'jwt:driver,admin']);
$routes->get('api/shipment/(:segment)/transfer-qr', 'Shipments::getTransferQr/$1', ['filter' => 'jwt:driver']);
$routes->post('api/shipment/(:segment)/accept-transfer', 'Shipments::acceptTransfer/$1', ['filter' => 'jwt:driver']);

// ADMIN -ROUTES FOR TRACHING BATCH DRIVER LOCATIONS

$routes->get('api/admin/batch-driver-locations', 'Admin::batchDriverLocations', ['filter' => 'jwt:admin']);
$routes->get('api/admin/driver-locations', 'Admin::driverLocations', ['filter' => 'jwt:admin']);
$routes->get('api/admin/batch-driver-locations/region/(:segment)', 'Admin::batchDriverLocationsByRegion/$1', ['filter' => 'jwt:admin']);
$routes->post('api/admin/batch-driver-locations/shipments', 'Admin::batchDriverLocationsByShipments', ['filter' => 'jwt:admin']);




// USER ROUTES

$routes->get('api/users', 'Users::index', ['filter' => 'jwt:admin']);
$routes->get('api/user/(:segment)', 'Users::show/$1', ['filter' => 'jwt:admin,driver,sender']);
$routes->patch('api/user/(:segment)/status', 'Users::updateStatus/$1', ['filter' => 'jwt:admin']);
$routes->patch('api/user/(:segment)/online', 'Users::updateOnline/$1', ['filter' => 'jwt:driver']);
$routes->patch('api/user/(:segment)/block', 'Users::block/$1', ['filter' => 'jwt:admin']);
$routes->patch('api/user/(:segment)/unblock', 'Users::unblock/$1', ['filter' => 'jwt:admin']);
$routes->get('api/user/status-options', 'Users::statusOptions', ['filter' => 'jwt:admin,driver,sender']);
$routes->post('api/user/(:segment)/upload-document', 'Users::uploadDocument/$1', ['filter' => 'jwt:driver,sender']);
$routes->get('api/user/(:segment)/documents', 'Users::getDocuments/$1', ['filter' => 'jwt:admin,driver,sender']);

// DRIVER LOCATION ROUTES

$routes->post('api/driver/location', 'Users::updateLocation', ['filter' => 'jwt:driver']);




