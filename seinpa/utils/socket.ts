// client pseudo-code (React Native / web with socket.io-client)
import { io } from 'socket.io-client';
const socket = io('http://localhost:3001'); // or your host

socket.on('connect', () => {
  // join rooms you care about
  socket.emit('join', `driver:${driverId}`);
  socket.emit('join', `shipment:${shipmentId}`);
});

// live driver location
socket.on('driver.location', (payload) => {
  // update map marker
});

// shipment assignment updates
socket.on('shipment.assigned', (payload) => {
  // refresh driver/sender/admin UI
});
