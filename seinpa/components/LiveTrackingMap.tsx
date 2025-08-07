import React, { useEffect, useRef, useState } from "react";
import MapView, { Marker, Polyline, Region } from "react-native-maps";
import { Platform, View, Text, StyleSheet } from "react-native";
import { io, Socket } from "socket.io-client";
import GoogleWebMap from "./GoogleWebMap";

type Location = { lat: number; lng: number };
type Props = {
  location?: Location | null;
  driverId: number;
  route?: Location[];
};

export default function LiveTrackingMap({ driverId, route }: Props) {
  const [location, setLocation] = useState<Location | null>(null);
  const mapRef = useRef<MapView>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Connect to your backend websocket server
    const socket = io(process.env.EXPO_PUBLIC_WS_URL); // e.g., http://localhost:5000
    socketRef.current = socket;

    // Listen for location updates for this driver
    socket.emit("subscribe_driver", driverId); // Optional: tell server what driver to send

    socket.on("location_update", (data: { driverId: number; lat: number; lng: number }) => {
      if (data.driverId === driverId) {
        setLocation({ lat: data.lat, lng: data.lng });
      }
    });

    // Optionally: Listen for initial location or polyline/history

    return () => {
      socket.emit("unsubscribe_driver", driverId);
      socket.disconnect();
    };
  }, [driverId]);

  useEffect(() => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: location.lat,
          longitude: location.lng,
          latitudeDelta: 0.08,
          longitudeDelta: 0.08,
        },
        800
      );
    }
  }, [location]);

  const initialRegion: Region = {
    latitude: location?.lat || 37.77,
    longitude: location?.lng || -122.41,
    latitudeDelta: 0.18,
    longitudeDelta: 0.18,
  };

  if (Platform.OS === "web") {
    // Use a Google Maps iframe, or a web maps component
    const lat = location?.lat || 37.7749;
    const lng = location?.lng || -122.4194;
    const googleMapsApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
    return <GoogleWebMap location={location} mapKey={googleMapsApiKey} />;

  } else {
    // Fallback for native platforms
    return (
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={initialRegion}
          showsUserLocation={false}
          showsMyLocationButton={false}
        >
          {location && (
            <Marker
              coordinate={{ latitude: location.lat, longitude: location.lng }}
              title="Driver"
              pinColor="blue"
            />
          )}
          {route && (
            <Polyline
              coordinates={route.map(point => ({
                latitude: point.lat,
                longitude: point.lng,
              }))}
              strokeColor="#1e40af"
              strokeWidth={4}
            />
          )}
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mapContainer: {
    width: "100%",
    height: 400,
    marginVertical: 16,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#ddd",
  },
  map: {
    width: "100%",
    height: "100%",
  }
});
