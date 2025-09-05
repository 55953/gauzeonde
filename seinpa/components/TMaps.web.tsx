// components/Maps.web.tsx
import React from "react";
import MapView, { Marker, Polyline, Circle, PROVIDER_GOOGLE } from "react-native-web-maps";
import { MapsProps } from "./Maps.types";

export default function Maps({
  center,
  markers = [],
  polylines = [],
  geofences = [],
  onMarkerPress,
  style,
}: MapsProps) {
  const region = {
    latitude: center.lat,
    longitude: center.lng,
    latitudeDelta: 0.09,
    longitudeDelta: 0.09,
  };

  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      initialRegion={region}
      style={{ width: "100%", height: "100%", ...(style || {}) }}
    >
      {markers.map(m => (
        <Marker
          key={m.id}
          coordinate={{ latitude: m.position.lat, longitude: m.position.lng }}
          title={m.title}
          description={m.description}
          onPress={() => onMarkerPress?.(m)}
        />
      ))}

      {polylines.map(pl => (
        <Polyline
          key={pl.id}
          coordinates={pl.path.map(p => ({ latitude: p.lat, longitude: p.lng }))}
          strokeWidth={4}
        />
      ))}

      {geofences.map(gf => (
        <Circle
          key={gf.id}
          center={{ latitude: gf.center.lat, longitude: gf.center.lng }}
          radius={gf.radiusMeters}
          strokeWidth={1}
          strokeColor="rgba(0,0,255,0.5)"
          fillColor="rgba(0,0,255,0.2)"
        />
      ))}
    </MapView>
  );
}
