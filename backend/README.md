# Gauzeonde Transport Real-time WebSocket Bridge

## 🚚 Project Overview

This repository contains the **Node.js Socket.IO WebSocket Bridge** for the Gauzeonde Transport Platform—an Uber-style long-haul trucking and shipping system.

The platform supports:
- Real-time shipment and driver tracking
- Dynamic driver-shipment assignment and transfer (even mid-route)
- Live dashboards for dispatchers and customers
- Event-driven notifications (status changes, transfers, etc.)
- Region and batch analytics for fleet management

**Key Technologies:**  
- Backend API: PHP (CodeIgniter 4)  
- Real-time Bridge: Node.js + Socket.IO  
- Database: PostgreSQL  
- Messaging: REST → WebSocket bridge  
- Frontend/Mobile: Connects via Socket.IO for live data

---

## 🗂️ Main Components

- **Node.js WebSocket Bridge (`server.js`):**
  - Handles WebSocket clients (web/mobile dashboards, drivers, senders)
  - Exposes secure REST endpoints (`/emit`, `/batch-emit`, `/broadcast`) for backend to push events
  - Supports room-based communication (per-shipment, per-driver, region, admin dashboard, etc.)
  - Provides full event logging for debugging and analytics

- **PHP Backend API:**
  - Handles user/driver authentication (JWT)
  - Manages shipments, driver location updates, transfers, notifications
  - Sends real-time updates to this bridge using REST calls

- **Socket.IO Client Apps:**
  - Web, dispatcher, or mobile apps connect to receive and send real-time updates

---

## 🚀 Installation & Quick Start

### 1. **Clone this repository**

```bash
git clone https://github.com/your-org/gauzeonde-websocket-bridge.git
cd gauzeonde-websocket-bridge
```

### 2. **Install dependancies**
```bash
npm install
```
### 3. **Configure Environment Variables**
WS_PORT=3001
WEBSOCKET_BRIDGE_SECRET=your-very-strong-secret
### 4. **Run the Server**
```bash
node server.js
```
- The server will run on http://localhost:3001 (or your chosen port).

## 🧩 Usage Overview

### 1. Socket.IO Client (Web, Mobile, Dashboard, etc.)
- Connect and join rooms for real-time updates:

```
const socket = io("http://localhost:3001");

// Join shipment tracking room
socket.emit('join_shipment', 'TRACKING123');

// Receive live location updates
socket.on('location_update', data => {
  console.log('Live location:', data);
});

// Join admin dashboard room for batch updates
socket.emit('join_dashboard');
socket.on('batch_location_update', locations => {
  console.log('All driver locations:', locations);
});
```

### 2. PHP Backend (CodeIgniter): Emit Events
- Push events to WebSocket bridge using the REST API:
```
function pushToWebSocket($event, $room, $data) {
    $client = \Config\Services::curlrequest();
    $url = 'http://localhost:3001/emit';
    $client->setHeader('Content-Type', 'application/json');
    $client->setHeader('x-ws-secret', 'your-very-strong-secret');
    $client->post($url, [
        'body' => json_encode([
            'event' => $event,
            'room'  => $room,
            'data'  => $data
        ])
    ]);
}
```

## Folder structure

```
gauzeonde/
|
|
└────backend
│    ├── app/
│    │   ├── Controllers/
│    │   │   ├── Auth.php
│    │   │   ├── Users.php
│    │   │   ├── Shipments.php
│    │   │   ├── Itineraries.php
│    │   │   ├── Payments.php
│    │   │   └── Notifications.php
│    │   ├── Models/
│    │   │   ├── UserModel.php
│    │   │   ├── ShipmentModel.php
│    │   │   ├── ItineraryModel.php
│    │   │   ├── PaymentModel.php
│    │   │   └── NotificationModel.php
│    │   ├── Entities/     # If you want rich objects (optional)
│    │   ├── Config/
│    │   ├── Database/
│    │   │   └── Migrations/
│    ├── public/
│    ├── writable/
│    ├── env
│    ├── composer.json
│    ├── docker-compose.yml
│    │
│    └── README.md
│
│
├────frontend
│
│
│
│
│
│
└────websocket