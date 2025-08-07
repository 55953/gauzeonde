import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import api from "../api/api";
import { Shipment } from "../types";

export default function ShipmentTrackForm() {
  const [tracking, setTracking] = useState("");
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [err, setErr] = useState("");

  const handleTrack = async () => {
    setErr(""); setShipment(null);
    try {
      const res = await api.get(`/shipments/track/${tracking}`);
      setShipment(res.data);
    } catch {
      setErr("Shipment not found.");
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 12 }}>Track Shipment</Text>
      <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 6, padding: 12, marginBottom: 12 }} placeholder="Tracking Number" value={tracking} onChangeText={setTracking} />
      <Button title="Track" onPress={handleTrack} />
      {err ? <Text style={{ color: "red", marginTop: 12 }}>{err}</Text> : null}
      {shipment && (
        <View style={{ marginTop: 12, backgroundColor: "#f0f8ff", padding: 12, borderRadius: 8 }}>
          <Text>Status: {shipment.status}</Text>
          <Text>Origin: {shipment.origin}</Text>
          <Text>Destination: {shipment.destination}</Text>
        </View>
      )}
    </View>
  );
}
