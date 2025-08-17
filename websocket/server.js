const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

// Update this for production!
const WEBSOCKET_SECRET = process.env.WEBSOCKET_BRIDGE_SECRET || "your-very-strong-secret";

const app = express();
const server = http.createServer(app);


app.use(cors());
app.use(express.json());

// app.use(express.json({ limit: '1mb' }));

// Socket.IO setup
const io = new Server(server, {
  cors: { origin: '*' }
});

// ========== SOCKET.IO CLIENT HANDLING ==========

io.on('connection', (socket) => {
  console.log(`[SOCKET] Client connected: ${socket.id}`);

  // Join shipment room (for tracking by tracking_number)
  socket.on('join_shipment', (tracking) => {
    if (tracking) {
      socket.join(`shipment_${tracking}`);
      console.log(`[SOCKET] ${socket.id} joined shipment room shipment_${tracking}`);
    }
  });

  // Leave shipment room
  socket.on('leave_shipment', (tracking) => {
    if (tracking) {
      socket.leave(`shipment_${tracking}`);
      console.log(`[SOCKET] ${socket.id} left shipment room shipment_${tracking}`);
    }
  });

  // Join driver room (driver-specific events)
  socket.on('join_driver', (driverId) => {
    if (driverId) {
      socket.join(`driver_${driverId}`);
      console.log(`[SOCKET] ${socket.id} joined driver room driver_${driverId}`);
    }
  });

  // Join admin dashboard room for all batch events
  socket.on('join_dashboard', () => {
    socket.join('admin_dashboard');
    console.log(`[SOCKET] ${socket.id} joined admin_dashboard`);
  });

  // Join region or custom batch room
  socket.on('join_room', (room) => {
    if (room) {
      socket.join(room);
      console.log(`[SOCKET] ${socket.id} joined room ${room}`);
    }
  });

  // Leave custom room
  socket.on('leave_room', (room) => {
    if (room) {
      socket.leave(room);
      console.log(`[SOCKET] ${socket.id} left room ${room}`);
    }
  });

  // Optional: handle manual client-emitted location update (rare, use REST for this)
  socket.on('location_update', (data) => {
    if (data && data.tracking_number) {
      io.to(`shipment_${data.tracking_number}`).emit('location_update', data);
      console.log(`[SOCKET] location_update broadcast to shipment_${data.tracking_number}:`, data);
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log(`[SOCKET] Client disconnected: ${socket.id}`);
  });
});

// ========== REST ENDPOINTS FOR PHP BACKEND ==========

// Helper: authorize backend request
function isAuthorized(req) {
  const provided = req.headers['x-ws-secret'] || '';
  return provided === WEBSOCKET_SECRET;
}

// POST /emit
// Body: { event, room, data }
app.post('/emit', (req, res) => {
  if (!isAuthorized(req)) return res.status(401).json({ error: "Unauthorized" });

  const { event, room, data } = req.body;
  if (!event || !room || !data) {
    return res.status(400).json({ error: "Missing event, room, or data" });
  }

  io.to(room).emit(event, data);
  console.log(`[EMIT] Event "${event}" to room "${room}"`, data);
  res.json({ success: true });
});

// POST /broadcast
// Body: { event, data }
app.post('/broadcast', (req, res) => {
  if (!isAuthorized(req)) return res.status(401).json({ error: "Unauthorized" });

  const { event, data } = req.body;
  if (!event || !data) {
    return res.status(400).json({ error: "Missing event or data" });
  }
  io.emit(event, data);
  console.log(`[BROADCAST] Event "${event}" to ALL`, data);
  res.json({ success: true });
});

// POST /batch-emit
// Body: { event, room, batch }
app.post('/batch-emit', (req, res) => {
  if (!isAuthorized(req)) return res.status(401).json({ error: "Unauthorized" });

  const { event, room, batch } = req.body;
  if (!event || !room || !batch) {
    return res.status(400).json({ error: "Missing event, room, or batch" });
  }
  io.to(room).emit(event, batch);
  console.log(`[BATCH-EMIT] Event "${event}" to room "${room}"`, batch);
  res.json({ success: true });
});

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', time: Date.now() }));

// ========== START SERVER ==========
const PORT = process.env.WS_PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚚 WebSocket bridge running on port ${PORT}`);
});
