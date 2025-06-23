import React, { useEffect, useRef, useState } from 'react';
import { WS_URL, GOOGLE_MAPS_API_KEY } from '../config';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { io } from 'socket.io-client';

export default function ShipmentTracker({ trackingNumber }) {
  const [location, setLocation] = useState(null);
  const socketRef = useRef(null);

  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: GOOGLE_MAPS_API_KEY });

  useEffect(() => {
    if (!trackingNumber) return;
    socketRef.current = io(WS_URL);
    socketRef.current.emit('join_shipment', trackingNumber);

    socketRef.current.on('location_update', (data) => {
      setLocation({ lat: data.latitude, lng: data.longitude });
    });

    return () => {
      socketRef.current.emit('leave_shipment', trackingNumber);
      socketRef.current.disconnect();
    };
  }, [trackingNumber]);

  return isLoaded && location ? (
    <GoogleMap
      center={location}
      zoom={10}
      mapContainerStyle={{ height: "400px", width: "100%" }}>
      <Marker position={location} />
    </GoogleMap>
  ) : (
    <div>Loading Map...</div>
  );
}
