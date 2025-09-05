// components/Maps.native.tsx
import React, { useEffect, useState } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { MapsProps, LatLng } from "./Maps.types";
import { View, ActivityIndicator, Platform } from "react-native";

export default function Maps({
  center,
  markers = [],
  polylines = [],
  geofences = [],
  onMarkerPress,
  style,
}: MapsProps) {
  const [region, setRegion] = useState({
    latitude: center.lat,
    longitude: center.lng,
    latitudeDelta: 0.09,
    longitudeDelta: 0.09,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.warn("Permission to access location was denied");
          setLoading(false);
          return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        const coords: LatLng = { lat: loc.coords.latitude, lng: loc.coords.longitude };

        setRegion({
          latitude: coords.lat,
          longitude: coords.lng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      } catch (err) {
        console.error("Location error", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading && Platform.OS !== "web") {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <MapView
      style={[{ flex: 1 }, style]}
      provider={PROVIDER_GOOGLE}
      region={region} // keeps it centered
      onRegionChangeComplete={(r) => setRegion(r)}
    >
      {markers.map((m) => (
        <Marker
          key={m.id}
          coordinate={{ latitude: m.position.lat, longitude: m.position.lng }}
          title={m.title}
          description={m.description}
          onPress={() => onMarkerPress?.(m)}
        />
      ))}
    </MapView>
  );
}
