import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import api from "../api/api";
import { User } from "../types";

export default function ShipmentCreateForm({ user }: { user: User }) {
  const [form, setForm] = useState({
    recipient_name: "",
    recipient_phone: "",
    origin: "",
    destination: "",
    package_details: "",
    weight: ""
  });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (key: string, value: string) =>
    setForm({ ...form, [key]: value });

  const handleSubmit = async () => {
    setLoading(true);
    setMsg("");
    try {
      const res = await api.post("/shipments", { ...form, sender_id: user.id });
      setMsg("Shipment created! Tracking #: " + res.data.tracking_number);
    } catch {
      setMsg("Failed to create shipment.");
    }
    setLoading(false);
  };

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 12 }}>Create Shipment</Text>
      <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 6, padding: 12, marginBottom: 12 }} placeholder="Recipient Name" value={form.recipient_name} onChangeText={v => handleChange("recipient_name", v)} />
      <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 6, padding: 12, marginBottom: 12 }} placeholder="Recipient Phone" value={form.recipient_phone} onChangeText={v => handleChange("recipient_phone", v)} />
      <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 6, padding: 12, marginBottom: 12 }} placeholder="Origin" value={form.origin} onChangeText={v => handleChange("origin", v)} />
      <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 6, padding: 12, marginBottom: 12 }} placeholder="Destination" value={form.destination} onChangeText={v => handleChange("destination", v)} />
      <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 6, padding: 12, marginBottom: 12 }} placeholder="Package Details" value={form.package_details} onChangeText={v => handleChange("package_details", v)} />
      <TextInput style={{ borderWidth: 1, borderColor: "#ccc", borderRadius: 6, padding: 12, marginBottom: 12 }} placeholder="Weight (kg)" value={form.weight} keyboardType="numeric" onChangeText={v => handleChange("weight", v)} />
      <Button title={loading ? "Creating..." : "Create"} onPress={handleSubmit} disabled={loading} />
      {msg ? <Text style={{ color: "green", marginTop: 12 }}>{msg}</Text> : null}
    </View>
  );
}
