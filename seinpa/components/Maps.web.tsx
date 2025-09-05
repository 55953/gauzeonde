import React, { useEffect, useMemo, useState } from "react";
import { GoogleMap, Marker, Polyline, Circle, useJsApiLoader } from "@react-google-maps/api";
import type { MapsProps, LatLng } from "./Maps.types";

// Optional: tweak map container styling here or pass via props
const defaultContainerStyle: React.CSSProperties = { width: "100%", height: "100%" };

function getGeo(opts?: PositionOptions): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("Geolocation not supported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, opts);
  });
}

export default function Maps({
  center,
  zoom = 12,
  markers = [],
  polylines = [],
  geofences = [],
  onMarkerPress,
  googleMapsApiKey,
  style,
}: MapsProps) {
  const [userCenter, setUserCenter] = useState<LatLng | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);

  // Load Google Maps JS API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey:
      googleMapsApiKey ||
      (process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY as string) ||
      "",
  });

  // Resolve effective center: prefer geolocated center, else prop center
  const effectiveCenter = useMemo<LatLng>(() => userCenter ?? center, [userCenter, center]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // Reasonable defaults: allow a slightly stale cached fix, set timeout for slower devices
        const pos = await getGeo({ enableHighAccuracy: true, timeout: 8000, maximumAge: 15000 });
        if (!cancelled) {
          setUserCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        }
      } catch (err: any) {
        if (!cancelled) {
          // Do not block map—just record error and keep fallback center
          setGeoError(err?.message || "Failed to get current location");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loadError) {
    return <div style={{ ...defaultContainerStyle, ...style }}>Failed to load Google Maps.</div>;
  }
  if (!isLoaded) {
    return <div style={{ ...defaultContainerStyle, ...style }}>Loading map…</div>;
  }

  return (
    <div style={{ ...defaultContainerStyle, ...style }}>
      <GoogleMap
        mapContainerStyle={defaultContainerStyle}
        center={{ lat: effectiveCenter.lat, lng: effectiveCenter.lng }}
        zoom={zoom}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {/* If we got the user location, show a subtle marker */}
        {userCenter && (
          <Marker
            position={userCenter}
            title="You are here"
            // A tiny dot-like marker style can be added via custom icons if desired
          />
        )}

        {/* App markers */}
        {markers.map((m) => (
          <Marker
            key={m.id}
            position={m.position}
            title={m.title}
            onClick={() => onMarkerPress?.(m)}
          />
        ))}

        {/* Polylines */}
        {polylines.map((pl) => (
          <Polyline key={pl.id} path={pl.path} options={{ strokeWeight: 4 }} />
        ))}

        {/* Geofences */}
        {geofences.map((gf) => (
          <Circle
            key={gf.id}
            center={gf.center}
            radius={gf.radiusMeters}
            options={{ strokeOpacity: 0.9, fillOpacity: 0.1 }}
          />
        ))}
      </GoogleMap>

      {/* Optional: surface geolocation errors non-destructively for debugging */}
      {geoError && (
        <div style={{ position: "absolute", bottom: 8, left: 8, fontSize: 12, color: "#555" }}>
          ⚠️ {geoError}
        </div>
      )}
    </div>
  );
}
