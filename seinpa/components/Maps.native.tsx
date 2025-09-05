// components/Maps.native.tsx
import React, { useMemo } from "react";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const MapView = require("react-native-maps").default;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Marker, Polyline, Circle, PROVIDER_GOOGLE } = require("react-native-maps");
import { MapsProps } from "./Maps.types";

export default function Maps({
  center,
  markers = [],
  polylines = [],
  geofences = [],
  onMarkerPress,
  style,
}: MapsProps) {
  const region = useMemo(() => ({
    latitude: center.lat,
    longitude: center.lng,
    latitudeDelta: 0.09,
    longitudeDelta: 0.09,
  }), [center]);

  return (
    <MapView
      style={[{ width: "100%", height: "100%" }, style]}
      provider={PROVIDER_GOOGLE}
      initialRegion={region}
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
        />
      ))}
    </MapView>
  );
}
