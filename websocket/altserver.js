// server.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const APP_SECRET = process.env.WS_SECRET || 'super-strong-shared-secret';
const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*'} // tighten in prod
});

// Optional namespaces/rooms joining by clients
io.on('connection', (socket) => {
  // Clients can join rooms, e.g., driver:42, shipment:123, region:west
  socket.on('join', (room) => {
    try {
      socket.join(room);
    } catch {}
  });
});

// Simple auth check
function checkSecret(req, res, next) {
  if (!req.body || req.body.secret !== APP_SECRET) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  next();
}

app.post('/emit', checkSecret, (req, res) => {
  const { event, data, room, opts } = req.body;
  const nsp = opts?.namespace ? io.of(opts.namespace) : io;

  try {
    if (room) nsp.to(room).emit(event, data);
    else nsp.emit(event, data);
    return res.json({ ok: true });
  } catch (e) {
    console.error('emit error:', e);
    return res.status(500).json({ ok: false });
  }
});

app.post('/emit-batch', checkSecret, (req, res) => {
  const items = Array.isArray(req.body.items) ? req.body.items : [];
  try {
    items.forEach(({ event, data, room, opts }) => {
      const nsp = opts?.namespace ? io.of(opts.namespace) : io;
      if (room) nsp.to(room).emit(event, data);
      else nsp.emit(event, data);
    });
    return res.json({ ok: true, count: items.length });
  } catch (e) {
    console.error('batch error:', e);
    return res.status(500).json({ ok: false });
  }
});

server.listen(PORT, () => {
  console.log('WS bridge listening on :' + PORT);
});
