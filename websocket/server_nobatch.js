const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Allow any origin (secure as needed)
app.use(cors());
app.use(express.json());

// Set up Socket.IO on port 3001
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

// WebSocket logic
io.on('connection', (socket) => {
  console.log('Client connected', socket.id);

  // Join shipment room for tracking (sender/client)
  socket.on('join_shipment', (tracking) => {
    socket.join(tracking);
    console.log(`Socket ${socket.id} joined shipment room ${tracking}`);
  });

  // Optional: For drivers to join a driver-specific room
  socket.on('join_driver', (driverId) => {
    socket.join(`driver_${driverId}`);
  });

  // For debugging: disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id);
  });
});

// REST API endpoint for PHP backend to POST events
const SECRET = "your-very-strong-secret";
app.post('/emit', (req, res) => {
  if (req.headers['x-ws-secret'] !== SECRET) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  const { event, room, data } = req.body;
  if (!event || !room || !data) {
    return res.status(400).json({ error: 'event, room, and data required' });
  }
  io.to(room).emit(event, data);
  return res.json({ success: true });
});

// Example: broadcast to all (useful for admin/global)
app.post('/broadcast', (req, res) => {
  const { event, data } = req.body;
  if (!event || !data) {
    return res.status(400).json({ error: 'event and data required' });
  }
  io.emit(event, data);
  return res.json({ success: true });
});

// Start server
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`WebSocket/bridge server running on port ${PORT}`);
});
