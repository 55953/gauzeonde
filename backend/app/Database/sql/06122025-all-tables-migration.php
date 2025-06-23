-- USERS (both drivers and senders)
CREATE TABLE users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  phone VARCHAR(32),
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'driver', 'sender') DEFAULT 'sender',
  status ENUM('pending', 'active', 'blocked', 'inactive') DEFAULT 'pending',
  last_online_at TIMESTAMP NULL DEFAULT NULL,
  kyc_status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
  rating DECIMAL(2,1) DEFAULT 0.0,
  activation_code VARCHAR(10),
  activation_expires DATETIME,
  reset_token VARCHAR(64) NULL,
  document_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- USER DOCUMENTS (profile, KYC)
CREATE TABLE user_documents (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  type ENUM('profile-picture', 'driver-license', 'insurance', 'other') NOT NULL,
  url VARCHAR(255) NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- DRIVER PROFILES (extra info)
CREATE TABLE drivers (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL UNIQUE,
  license_number VARCHAR(64),
  vehicle_type VARCHAR(64),
  vehicle_plate VARCHAR(64),
  is_online TINYINT(1) DEFAULT 0,
  current_lat DECIMAL(10,7),
  current_lng DECIMAL(10,7),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- SHIPMENTS
CREATE TABLE shipments (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tracking_number VARCHAR(40) NOT NULL UNIQUE,
  sender_id INT UNSIGNED NOT NULL,
  driver_id INT UNSIGNED,
  status ENUM('created', 'picked_up', 'in_transit', 'delivered', 'transferred', 'cancelled') DEFAULT 'created',
  description VARCHAR(255),
  origin_address VARCHAR(255),
  origin_lat DECIMAL(10,7),
  origin_lng DECIMAL(10,7),
  dest_address VARCHAR(255),
  dest_lat DECIMAL(10,7),
  dest_lng DECIMAL(10,7),
  scheduled_pickup DATETIME,
  scheduled_dropoff DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id),
  FOREIGN KEY (driver_id) REFERENCES users(id)
);

-- SHIPMENT STATUS HISTORY
CREATE TABLE shipment_status_history (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  shipment_id INT UNSIGNED NOT NULL,
  status ENUM('created', 'picked_up', 'in_transit', 'delivered', 'transferred', 'cancelled') NOT NULL,
  changed_by INT UNSIGNED,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notes VARCHAR(255),
  FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE,
  FOREIGN KEY (changed_by) REFERENCES users(id)
);

-- SHIPMENT TRANSFER AUDIT (handoff log)
CREATE TABLE shipment_transfers (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  shipment_id INT UNSIGNED NOT NULL,
  from_driver_id INT UNSIGNED,
  to_driver_id INT UNSIGNED,
  transfer_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  location_lat DECIMAL(10,7),
  location_lng DECIMAL(10,7),
  notes VARCHAR(255),
  FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE,
  FOREIGN KEY (from_driver_id) REFERENCES users(id),
  FOREIGN KEY (to_driver_id) REFERENCES users(id)
);

-- ITINERARIES (driver's planned routes)
CREATE TABLE itineraries (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  driver_id INT UNSIGNED NOT NULL,
  start_address VARCHAR(255),
  start_lat DECIMAL(10,7),
  start_lng DECIMAL(10,7),
  end_address VARCHAR(255),
  end_lat DECIMAL(10,7),
  end_lng DECIMAL(10,7),
  scheduled_start DATETIME,
  scheduled_end DATETIME,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (driver_id) REFERENCES users(id)
);

-- DRIVER LOCATION UPDATES (live tracking)
CREATE TABLE driver_locations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  driver_id INT UNSIGNED NOT NULL,
  lat DECIMAL(10,7) NOT NULL,
  lng DECIMAL(10,7) NOT NULL,
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE CASCADE
);

-- PAYMENTS
CREATE TABLE payments (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  shipment_id INT UNSIGNED NOT NULL,
  payer_id INT UNSIGNED NOT NULL,
  payee_id INT UNSIGNED NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(8) DEFAULT 'USD',
  status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  paid_at TIMESTAMP NULL DEFAULT NULL,
  FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE,
  FOREIGN KEY (payer_id) REFERENCES users(id),
  FOREIGN KEY (payee_id) REFERENCES users(id)
);

-- NOTIFICATIONS (to users)
CREATE TABLE notifications (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  type ENUM('email', 'sms', 'push') DEFAULT 'email',
  title VARCHAR(128),
  message TEXT,
  data JSON,
  is_read TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Optionally, add indices for performance (recommended)
CREATE INDEX idx_user_role ON users(role);
CREATE INDEX idx_driver_is_online ON drivers(is_online);
CREATE INDEX idx_shipment_status ON shipments(status);
CREATE INDEX idx_itinerary_active ON itineraries(is_active);
CREATE INDEX idx_notification_user ON notifications(user_id);
