import React, { useEffect,  useRef, useState } from "react"; 
import api from "../api/api";
import DriverMap from "../components/DriverMap";
import { useParams } from "react-router-dom";
import { WS_URL, GOOGLE_MAPS_API_KEY } from '../config';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { io } from 'socket.io-client';

export default function DriverTrackingPage() {

  const { driverId } = useParams();
  const [location, setLocation] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const socketRef = useRef(null);
  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: GOOGLE_MAPS_API_KEY });

  useEffect(() => {
    let timer = setInterval(() => {
      api.get(`/drivers/${driverId}/location`)
        .then(res => setLocation(res.data))
        .catch(() => setLocation(null));
    }, 5000); // Poll every 5s
    return () => clearInterval(timer);
  }, [driverId]);

  return (
    <div className="max-w-lg mx-auto mt-12 bg-white shadow p-8 rounded">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">Driver Live Tracking</h2>
      {location ? (
        <div>
          <div><strong>Lat:</strong> {location.lat}</div>
          <div><strong>Lng:</strong> {location.lng}</div>
          <DriverMap lat={location.lat} lng={location.lng} />
        </div>
      ) : (
        <div>Loading location...</div>
      )}
    </div>
  );
}
