import React, { useEffect, useRef, useState } from 'react';
import { Route, Router } from 'react-router-dom';
import { GoogleMap, Marker, Polyline, useJsApiLoader, MarkerClusterer } from "@react-google-maps/api";
import { WS_URL, GOOGLE_MAPS_API_KEY } from '../../config';
const containerStyle = { width: "100%", height: "400px" };

export default function AdminDashboard({ user }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });
  const [markers, setMarkers] = useState([]);
  const [route, setRoute] = useState([]);
  return (
    <>
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Panel: {user.name}</h1>
      <p>Manage users, shipments, system analytics, and more.</p>
      {/* Add links or tables for admin actions */}
    </div>

    </>
  );
  if (!isLoaded) return <div>Loading...</div>;
  return (
    <GoogleMap mapContainerStyle={containerStyle} center={markers[0] || { lat: 0, lng: 0 }} zoom={5}>
      <MarkerClusterer>
        {(clusterer) =>
          markers.map((marker, idx) => (
            <Marker key={idx} position={marker} clusterer={clusterer} />
          ))
        }
      </MarkerClusterer>
       <Polyline path={route} options={{ strokeColor: "#5900ffff", strokeWeight: 2 }} />
    </GoogleMap>
  );
  
// Usage example:
// <ClusteredMap markers={[{ lat: 37, lng: -122 }, { lat: 37.2, lng: -122.2 }, ... ]} />
}
