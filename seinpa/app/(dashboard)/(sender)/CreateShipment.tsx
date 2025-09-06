import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  Alert,
  ScrollView,
  Platform,
} from "react-native";
import useDeviceLocation from "@hooks/useDeviceLocation";
import useReverseGeocode from "@hooks/useReverseGeocode";
import AddressAutocomplete from "@components/AddressAutocomplete";
import { geocodeAddress } from "@utils/geocodeAddress";
import { haversineKm, estimateFareUSD } from "@utils/distanceAndFare";
import { ShipmentApi } from "@api/api";
import { useSession } from "@hooks/useSession"; // <— make sure you have this

type FormState = {
  sender_id?: number;
  origin: string;
  destination: string;

  pickupLat: string;
  pickupLng: string;

  destLat: string;
  destLng: string;

  weightKg: string;
  lengthCm: string;
  widthCm: string;
  heightCm: string;

  notes: string;

  quoteUSD: string;
  paymentAuthorized: boolean;
};

function debounce<F extends (...args: any[]) => void>(fn: F, ms = 500) {
  let t: NodeJS.Timeout | null = null;
  return (...args: Parameters<F>) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

export default function CreateShipmentScreen() {
  const { session } = useSession(); // must provide this context (user.id)
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<FormState>({
    sender_id: session?.user?.sub,
    origin: "",
    destination: "",
    pickupLat: "",
    pickupLng: "",
    destLat: "",
    destLng: "",
    weightKg: "",
    lengthCm: "",
    widthCm: "",
    heightCm: "",
    notes: "",
    quoteUSD: "",
    paymentAuthorized: false,
  });

  useEffect(() => {
    if (session?.user?.sub && form.sender_id !== session?.user?.sub) {
      setForm((f) => ({ ...f, sender_id: session?.user?.sub }));
    }
  }, [session?.user?.sub]);

  // Grab current device location (for pickup)
  const { location, loading: locLoading, error: locError, refresh } = useDeviceLocation({
    enableHighAccuracy: true,
    timeout: 8000,
    maximumAge: 15000,
    watch: false,
  });

  const { reverse, loading: revLoading, error: revError } = useReverseGeocode({ language: "en" });

  // Fill pickup coords on first fix
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

  // Derived coords
  const pickup = useMemo(() => {
    const lat = parseFloat(form.pickupLat);
    const lng = parseFloat(form.pickupLng);
    return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;
  }, [form.pickupLat, form.pickupLng]);

  const dest = useMemo(() => {
    const lat = parseFloat(form.destLat);
    const lng = parseFloat(form.destLng);
    return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;
  }, [form.destLat, form.destLng]);

  const distanceKm = useMemo(() => {
    if (!pickup || !dest) return 0;
    return haversineKm(pickup, dest);
  }, [pickup, dest]);

  const calculatedQuote = useMemo(() => {
    const weight = form.weightKg ? parseFloat(form.weightKg) : 0;
    return estimateFareUSD({
      distanceKm,
      weightKg: Number.isFinite(weight) ? weight : 0,
    });
  }, [distanceKm, form.weightKg]);

  // Keep quote in form
  useEffect(() => {
    if (calculatedQuote > 0) {
      setForm((f) => ({ ...f, quoteUSD: String(calculatedQuote.toFixed(2)) }));
    } else {
      setForm((f) => ({ ...f, quoteUSD: "" }));
    }
  }, [calculatedQuote]);

  // Use my location for pickup (and reverse-geocode the origin text)
  const onUseMyLocation = async () => {
    await refresh();
    if (!location) return;
    try {
      const rev = await reverse({ lat: location.lat, lng: location.lng });
      if (rev?.address) {
        setForm((f) => ({ ...f, origin: rev.address }));
      }
    } catch {
      // ignore
    }
  };

  // If someone types destination manually (not using autocomplete),
  // we can auto geocode on debounce blur/typing.
  const debouncedGeocodeRef = useRef(
    debounce(async (address: string) => {
      if (!address || address.length < 3) return;
      const res = await geocodeAddress(address, "en");
      if (res) {
        setForm((f) => ({
          ...f,
          destLat: res.coords.lat.toFixed(6),
          destLng: res.coords.lng.toFixed(6),
        }));
      }
    }, 700)
  );

  // Auto-quote button label (no separate geocode button)
  const payButtonLabel = form.paymentAuthorized
    ? "✓ Payment Authorized"
    : "Authorize Payment (Simulated)";

  const validateBeforeCreate = () => {
    if (!form.sender_id) return "Missing user id (are you logged in?).";
    if (!form.origin) return "Pickup address is required.";
    if (!form.destination) return "Destination address is required.";
    if (!pickup) return "Pickup coordinates are invalid.";
    if (!dest) return "Destination coordinates are invalid.";
    if (!form.quoteUSD || parseFloat(form.quoteUSD) <= 0) return "Quote not ready.";
    if (!form.paymentAuthorized) return "Please authorize payment before creating shipment.";
    return null;
  };

  const simulatePayment = async () => {
    const err = validateBeforeCreate()?.replace("Please authorize payment before creating shipment.", "");
    // We only validate the basics here (except the payment)
    if (err && !err.includes("authorize payment")) {
      Alert.alert("Validation", err);
      return;
    }
    await new Promise((r) => setTimeout(r, 600));
    setForm((f) => ({ ...f, paymentAuthorized: true }));
    Alert.alert("Payment authorized", `Hold placed for $${form.quoteUSD} (simulated)`);
  };

  const submit = async () => {
    const err = validateBeforeCreate();
    if (err) {
      Alert.alert("Validation", err);
      return;
    }

    const payload = {
      sender_id: form.sender_id,
      origin: form.origin,
      destination: form.destination,
      pickup_lat: parseFloat(form.pickupLat),
      pickup_lng: parseFloat(form.pickupLng),
      dest_lat: parseFloat(form.destLat),
      dest_lng: parseFloat(form.destLng),
      weight_kg: form.weightKg ? Number(form.weightKg) : null,
      length_cm: form.lengthCm ? Number(form.lengthCm) : null,
      width_cm: form.widthCm ? Number(form.widthCm) : null,
      height_cm: form.heightCm ? Number(form.heightCm) : null,
      notes: form.notes || null,
      quote_usd: parseFloat(form.quoteUSD || "0"),
      status: "pending",
    };
    console.log("Creating shipment with", payload);
    try {
      setSubmitting(true);
      const res = await ShipmentApi.create(payload);
      Alert.alert("Created", "Shipment created successfully!");
      // navigate to detail, reset form, etc.
      // navigation.navigate("ShipmentDetail", { id: res.data.data.id })
    } catch (e: any) {
      Alert.alert("Error", e?.response?.data?.messages || "Failed to create shipment");
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit =
    !!form.sender_id &&
    !!form.origin &&
    !!form.destination &&
    !!pickup &&
    !!dest &&
    !!form.quoteUSD &&
    form.paymentAuthorized &&
    !submitting;

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>Create Shipment</Text>

      {Platform.OS === "web" && (
        <View style={{ gap: 8 }}>
          <Button title="Use my location for pickup" onPress={onUseMyLocation} />
          {(locLoading || revLoading) && <ActivityIndicator />}
          {locError ? <Text style={{ color: "crimson" }}>Location: {locError}</Text> : null}
          {revError ? <Text style={{ color: "crimson" }}>Reverse-geo: {revError}</Text> : null}
        </View>
      )}

      {/* PICKUP */}
      <Text style={{ fontWeight: "600" }}>Pickup address</Text>
      <AddressAutocomplete
        placeholder="Search pickup address…"
        initialValue={form.origin}
        onSelect={(sel) => {
          setForm((f) => ({
            ...f,
            origin: sel.address,
            pickupLat: sel.lat ? sel.lat.toFixed(6) : f.pickupLat,
            pickupLng: sel.lng ? sel.lng.toFixed(6) : f.pickupLng,
          }));
        }}
        onError={(err) => console.warn("Pickup autocomplete error:", err)}
      />
      <View style={{ flexDirection: "row", gap: 10 }}>
        <TextInput
          style={{ flex: 1, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10 }}
          placeholder="Pickup lat"
          value={form.pickupLat}
          onChangeText={(v) => setForm((f) => ({ ...f, pickupLat: v }))}
          keyboardType="decimal-pad"
        />
        <TextInput
          style={{ flex: 1, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10 }}
          placeholder="Pickup lng"
          value={form.pickupLng}
          onChangeText={(v) => setForm((f) => ({ ...f, pickupLng: v }))}
          keyboardType="decimal-pad"
        />
      </View>

      {/* DESTINATION */}
      <Text style={{ fontWeight: "600" }}>Destination address</Text>
      <AddressAutocomplete
        placeholder="Search destination address…"
        initialValue={form.destination}
        onSelect={(sel) => {
          setForm((f) => ({
            ...f,
            destination: sel.address,
            destLat: sel.lat ? sel.lat.toFixed(6) : f.destLat,
            destLng: sel.lng ? sel.lng.toFixed(6) : f.destLng,
          }));
        }}
        onError={(err) => console.warn("Destination autocomplete error:", err)}
      />
      {/* If user types directly (not choosing a suggestion), debounce geocode */}
      <TextInput
        style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10 }}
        placeholder="Or type destination address…"
        value={form.destination}
        onChangeText={(v) => {
          setForm((f) => ({ ...f, destination: v }));
          debouncedGeocodeRef.current(v);
        }}
        onBlur={() => debouncedGeocodeRef.current(form.destination)}
      />

      <View style={{ flexDirection: "row", gap: 10 }}>
        <TextInput
          style={{ flex: 1, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10 }}
          placeholder="Dest lat"
          value={form.destLat}
          onChangeText={(v) => setForm((f) => ({ ...f, destLat: v }))}
          keyboardType="decimal-pad"
        />
        <TextInput
          style={{ flex: 1, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10 }}
          placeholder="Dest lng"
          value={form.destLng}
          onChangeText={(v) => setForm((f) => ({ ...f, destLng: v }))}
          keyboardType="decimal-pad"
        />
      </View>

      {/* PACKAGE */}
      <Text style={{ fontWeight: "600" }}>Package details</Text>
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

      {/* QUOTE (auto) */}
      <Text style={{ fontWeight: "600" }}>Quote</Text>
      <TextInput
        style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10 }}
        placeholder="Quote (USD)"
        value={form.quoteUSD}
        onChangeText={(v) => setForm((f) => ({ ...f, quoteUSD: v }))}
        keyboardType="decimal-pad"
      />
      <Text style={{ color: "#555" }}>
        Distance: {distanceKm.toFixed(2)} km · Est: ${calculatedQuote.toFixed(2)}
      </Text>

      {/* NOTES */}
      <Text style={{ fontWeight: "600" }}>Notes (optional)</Text>
      <TextInput
        value={form.notes}
        onChangeText={(v) => setForm((f) => ({ ...f, notes: v }))}
        placeholder="Delivery instructions…"
        multiline
        style={{ borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10, minHeight: 80 }}
      />

      {/* PAYMENT */}
      <View style={{ gap: 8 }}>
        <Button title={payButtonLabel} onPress={simulatePayment} />
        {form.paymentAuthorized && (
          <Text style={{ color: "green" }}>✓ Payment authorized (mock)</Text>
        )}
      </View>

      {/* SUBMIT */}
      <Button title={submitting ? "Creating…" : "Create Shipment"} onPress={submit} disabled={!canSubmit} />
    </ScrollView>
  );
}
