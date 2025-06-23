<?php

# A. Restrict by Role or User ID
// Only driver or user ID 42 can create itineraries
$routes->post('api/itineraries', 'Itineraries::create', ['filter' => 'jwt:driver,42']);

# B. Require Role and Permission
// Only admin who has 'delete-user' permission
$routes->delete('api/users/(:num)', 'Users::delete/$1', ['filter' => 'jwt:admin@delete-user']);

# C. Multi-role Group + Permission
// Allow both admin and manager with 'view-all' permission
$routes->get('api/shipments/all', 'Shipments::all', ['filter' => 'jwt:admin,manager@view-all']);

# D. Only specific user
// Only user with id=7 (e.g. their own profile)
$routes->get('api/profile/(:num)', 'Users::profile/$1', ['filter' => 'jwt:7']);
