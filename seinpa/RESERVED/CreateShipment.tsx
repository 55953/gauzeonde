// screens/CreateShipmentScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, ActivityIndicator, Alert, ScrollView, Platform } from "react-native";
import useDeviceLocation from "@hooks/useDeviceLocation";
import useReverseGeocode from "@hooks/useReverseGeocode";
import AddressAutocomplete from "@components/AddressAutocomplete";
import { ShipmentApi } from "@api/api"; // implement create() on your API client

type FormState = {
  pickupAddress: string;
  pickupLat: string;
  pickupLng: string;

  destinationAddress: string;
  destLat: string;
  destLng: string;

  weightKg: string;
  lengthCm: string;
  widthCm: string;
  heightCm: string;

  notes: string;
};

export default function CreateShipmentScreen() {
  const [form, setForm] = useState<FormState>({
    pickupAddress: "",
    pickupLat: "",
    pickupLng: "",
    destinationAddress: "",
    destLat: "",
    destLng: "",
    weightKg: "",
    lengthCm: "",
    widthCm: "",
    heightCm: "",
    notes: "",
  });

  const { location, loading: locLoading, error: locError, refresh } = useDeviceLocation({
    enableHighAccuracy: true,
    timeout: 8000,
    maximumAge: 15000,
    watch: false,
  });

  const { loading: geoLoading, error: geoError, reverse } = useReverseGeocode({ language: "en" });

  // Whenever a fresh GPS fix arrives, you may pre-fill the coordinates (optional).
  useEffect(() => {
    if (location && !form.pickupLat && !form.pickupLng) {
      setForm((f) => ({
        ...f,
        pickupLat: location.lat.toFixed(6),
        pickupLng: location.lng.toFixed(6),
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const onUseMyLocation = async () => {
    try {
      await refresh(); // ask permission + get fix
      if (!location) return; // state updates next tick; optional: await a tiny delay
      const coords = { lat: location.lat, lng: location.lng };

      const rev = await reverse(coords);
      setForm((f) => ({
        ...f,
        pickupAddress: rev?.address || f.pickupAddress,
        pickupLat: coords.lat.toFixed(6),
        pickupLng: coords.lng.toFixed(6),
      }));
    } catch (_) {
      // Errors are surfaced by locError / geoError states below
    }
  };

  const submit = async () => {
    // Basic checks
    if (!form.pickupLat || !form.pickupLng || !form.destinationAddress) {
      Alert.alert("Missing info", "Pickup coordinates and destination address are required.");
      return;
    }

    const payload = {
      origin: form.pickupAddress,
      destination: form.destinationAddress,
      weight_kg: form.weightKg ? Number(form.weightKg) : null,
      length_cm: form.lengthCm ? Number(form.lengthCm) : null,
      width_cm: form.widthCm ? Number(form.widthCm) : null,
      height_cm: form.heightCm ? Number(form.heightCm) : null,
      pickup_lat: Number(form.pickupLat),
      pickup_lng: Number(form.pickupLng),
      dest_lat: form.destLat ? Number(form.destLat) : null,
      dest_lng: form.destLng ? Number(form.destLng) : null,
      notes: form.notes || null,
    };

    try {
      const res = await ShipmentApi.create(payload);
      Alert.alert("Created", "Shipment created successfully!");
      // navigate or reset form
      // navigation.navigate("ShipmentDetail", { id: res.data.data.id })
    } catch (e: any) {
      Alert.alert("Error", e?.response?.data?.message || "Failed to create shipment");
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>Create Shipment</Text>

      {Platform.OS === "web" && (
        <View style={{ gap: 8 }}>
          <Button title="Use my location (auto-fill pickup)" onPress={onUseMyLocation} />
          {(locLoading || geoLoading) && <ActivityIndicator />}
          {locError ? <Text style={{ color: "crimson" }}>Location: {locError}</Text> : null}
          {geoError ? <Text style={{ color: "crimson" }}>Reverse-geo: {geoError}</Text> : null}
        </View>
      )}

      <Text style={{ fontWeight: "600" }}>Pickup address</Text>
      {/* <AddressAutocomplete
        placeholder="Search pickup address…"
        initialValue={form.pickupAddress}
        onSelect={(sel) => {
          setForm((f) => ({
            ...f,
            pickupAddress: sel.address,
            pickupLat: sel.lat ? sel.lat.toFixed(6) : f.pickupLat,
            pickupLng: sel.lng ? sel.lng.toFixed(6) : f.pickupLng,
          }));
        }}
        onError={(err) => console.warn("Pickup autocomplete error:", err)}
        // className="my-input"   // web
        // style={{}}             // native
      /> */}
      <TextInput
        value={form.pickupAddress}
        onChangeText={(v) => setForm((f) => ({ ...f, pickupAddress: v }))}
        placeholder="Auto-filled or type your pickup address"
        style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10 }}
      />

      <View style={{ flexDirection: "row", gap: 10 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: "600" }}>Pickup lat</Text>
          <TextInput
            value={form.pickupLat}
            onChangeText={(v) => setForm((f) => ({ ...f, pickupLat: v }))}
            keyboardType="decimal-pad"
            placeholder="e.g. 37.7749"
            style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10 }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: "600" }}>Pickup lng</Text>
          <TextInput
            value={form.pickupLng}
            onChangeText={(v) => setForm((f) => ({ ...f, pickupLng: v }))}
            keyboardType="decimal-pad"
            placeholder="-122.4194"
            style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10 }}
          />
        </View>
      </View>

      <Text style={{ fontWeight: "600" }}>Destination address</Text>
      {/* <AddressAutocomplete
        placeholder="Search destination address…"
        initialValue={form.destinationAddress}
        onSelect={(sel) => {
          setForm((f) => ({
            ...f,
            destinationAddress: sel.address,
            destLat: sel.lat ? sel.lat.toFixed(6) : f.destLat,
            destLng: sel.lng ? sel.lng.toFixed(6) : f.destLng,
          }));
        }}
        onError={(err) => console.warn("Destination autocomplete error:", err)}
      /> */}
      <TextInput
        value={form.destinationAddress}
        onChangeText={(v) => setForm((f) => ({ ...f, destinationAddress: v }))}
        placeholder="Where are we delivering?"
        style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10 }}
      />

      <View style={{ flexDirection: "row", gap: 10 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: "600" }}>Dest lat (optional)</Text>
          <TextInput
            value={form.destLat}
            onChangeText={(v) => setForm((f) => ({ ...f, destLat: v }))}
            keyboardType="decimal-pad"
            placeholder="e.g. 34.0522"
            style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10 }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: "600" }}>Dest lng (optional)</Text>
          <TextInput
            value={form.destLng}
            onChangeText={(v) => setForm((f) => ({ ...f, destLng: v }))}
            keyboardType="decimal-pad"
            placeholder="-118.2437"
            style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10 }}
          />
        </View>
      </View>

      <Text style={{ fontWeight: "600" }}>Package details (optional)</Text>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <TextInput
          style={{ flex: 1, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10 }}
          placeholder="Weight (kg)"
          value={form.weightKg}
          onChangeText={(v) => setForm((f) => ({ ...f, weightKg: v }))}
          keyboardType="decimal-pad"
        />
        <TextInput
          style={{ flex: 1, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10 }}
          placeholder="Length (cm)"
          value={form.lengthCm}
          onChangeText={(v) => setForm((f) => ({ ...f, lengthCm: v }))}
          keyboardType="decimal-pad"
        />
      </View>

      <View style={{ flexDirection: "row", gap: 10 }}>
        <TextInput
          style={{ flex: 1, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10 }}
          placeholder="Width (cm)"
          value={form.widthCm}
          onChangeText={(v) => setForm((f) => ({ ...f, widthCm: v }))}
          keyboardType="decimal-pad"
        />
        <TextInput
          style={{ flex: 1, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10 }}
          placeholder="Height (cm)"
          value={form.heightCm}
          onChangeText={(v) => setForm((f) => ({ ...f, heightCm: v }))}
          keyboardType="decimal-pad"
        />
      </View>

      <Text style={{ fontWeight: "600" }}>Notes (optional)</Text>
      <TextInput
        value={form.notes}
        onChangeText={(v) => setForm((f) => ({ ...f, notes: v }))}
        placeholder="Dropoff instructions, contact details…"
        multiline
        style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10, minHeight: 80 }}
      />

      <Button title="Create Shipment" onPress={submit} />
    </ScrollView>
  );
}
