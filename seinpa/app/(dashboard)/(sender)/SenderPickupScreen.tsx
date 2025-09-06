import React, { useEffect, useState } from "react";
import { Platform, View, Text, TextInput, Button, ActivityIndicator } from "react-native";
import useBrowserLocation from "@hooks/useBrowserLocation";

type Pickup = {
  pickupLat?: string;   // keep as string for inputs
  pickupLng?: string;
  notes?: string;
};

export default function SenderPickupScreen() {
  const [form, setForm] = useState<Pickup>({ pickupLat: "", pickupLng: "", notes: "" });

  // Web: use browser geolocation hook
  const { location, loading, error, refresh } = useBrowserLocation({
    timeout: 8000,
    maximumAge: 15000,
    enableHighAccuracy: true,
    watch: false,
  });

  // When a new fix arrives, prefill inputs (once or always — your choice)
  useEffect(() => {
    if (location) {
      setForm((f) => ({
        ...f,
        pickupLat: location.lat.toFixed(6),
        pickupLng: location.lng.toFixed(6),
      }));
    }
  }, [location]);

  const onUseMyLocation = async () => {
    // On web, this calls the browser prompt and updates state.
    // On native, you could gate this button off, or wire a native hook (see below).
    await refresh();
  };

  const onSubmit = () => {
    // send to backend
    // e.g., ShipmentApi.create({ ...form, pickupLat: Number(form.pickupLat), pickupLng: Number(form.pickupLng) })
    console.log("Submitting pickup:", form);
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>Pickup Details</Text>

      {Platform.OS === "web" && (
        <View style={{ gap: 8 }}>
          <Button title="Use my location" onPress={onUseMyLocation} />
          {loading && <ActivityIndicator />}
          {error && <Text style={{ color: "crimson" }}>Location: {error}</Text>}
        </View>
      )}

      <Text>Pickup Latitude</Text>
      <TextInput
        value={form.pickupLat}
        onChangeText={(v) => setForm({ ...form, pickupLat: v })}
        placeholder="e.g. 37.7749"
        keyboardType="decimal-pad"
        style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10 }}
      />

      <Text>Pickup Longitude</Text>
      <TextInput
        value={form.pickupLng}
        onChangeText={(v) => setForm({ ...form, pickupLng: v })}
        placeholder="-122.4194"
        keyboardType="decimal-pad"
        style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10 }}
      />

      <Text>Notes (optional)</Text>
      <TextInput
        value={form.notes}
        onChangeText={(v) => setForm({ ...form, notes: v })}
        placeholder="e.g., front desk, call on arrival…"
        multiline
        style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10, minHeight: 80 }}
      />

      <Button title="Save Pickup" onPress={onSubmit} />
    </View>
  );
}
