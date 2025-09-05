// components/Maps.web.tsx
import React, { useMemo } from "react";
import { GoogleMap, Marker, Polyline, Circle, useJsApiLoader } from "@react-google-maps/api";
import { MapsProps } from "./Maps.types";

const containerStyle: React.CSSProperties = { width: "100%", height: "100%" };

export default function Maps({
  center,
  zoom = 10,
  markers = [],
  polylines = [],
  geofences = [],
  onMarkerPress,
  googleMapsApiKey,
  style,
}: MapsProps) {
  // Load Google JS SDK
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: googleMapsApiKey || (process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY as string) || "",
  });

  const mapCenter = useMemo(() => ({ lat: center.lat, lng: center.lng }), [center]);

  if (!isLoaded) {
    return <div style={{ ...containerStyle, ...style }}>Loading map…</div>;
  }

  return (
    <div style={{ ...containerStyle, ...style }}>
      <GoogleMap mapContainerStyle={containerStyle} center={mapCenter} zoom={zoom}>
        {markers.map(m => (
          <Marker
            key={m.id}
            position={m.position}
            title={m.title}
            onClick={() => onMarkerPress?.(m)}
          />
        ))}

        {polylines.map(pl => (
          <Polyline key={pl.id} path={pl.path} options={{ strokeWeight: 4 }} />
        ))}

        {geofences.map(gf => (
          <Circle
            key={gf.id}
            center={gf.center}
            radius={gf.radiusMeters}
            options={{ strokeOpacity: 0.8, fillOpacity: 0.1 }}
          />
        ))}
      </GoogleMap>
    </div>
  );
}
