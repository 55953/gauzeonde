import React, { useEffect, useRef, useState } from 'react';
import { WS_URL, GOOGLE_MAPS_API_KEY } from '../config';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { io } from 'socket.io-client';

export default function Dashboard() {
  const [drivers, setDrivers] = useState([]);
  const socketRef = useRef(null);
  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: GOOGLE_MAPS_API_KEY });

  useEffect(() => {
    socketRef.current = io(WS_URL);
    socketRef.current.emit('join_dashboard');

    socketRef.current.on('batch_location_update', (batch) => {
      setDrivers(batch);
    });

    return () => {
      socketRef.current.emit('leave_room', 'admin_dashboard');
      socketRef.current.disconnect();
    };
  }, []);

  return isLoaded ? (
    <GoogleMap
      center={{ lat: 39, lng: -98 }} // Center of USA
      zoom={4}
      mapContainerStyle={{ height: "500px", width: "100%" }}>
      {drivers.map(driver => (
        <Marker
          key={driver.driver_id}
          position={{ lat: driver.latitude, lng: driver.longitude }}
          label={driver.name}
        />
      ))}
    </GoogleMap>
  ) : (
    <div>Loading Dashboard Map...</div>
  );
}
