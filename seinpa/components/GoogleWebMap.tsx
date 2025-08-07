// components/GoogleWebMap.tsx
import React from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

type Props = {
  location: { lat: number; lng: number };
  mapKey: string;
  zoom?: number;
};

export default function GoogleWebMap({ location, mapKey, zoom = 12 }: Props) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: mapKey
  });

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div style={{ width: "100%", height: 400, borderRadius: 12, overflow: "hidden" }}>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={location}
        zoom={zoom}
      >
        <Marker position={location} />
      </GoogleMap>
    </div>
  );
}
