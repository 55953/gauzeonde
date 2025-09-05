// screens/AdminEditUserScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, ScrollView, Button, Alert, StyleSheet, Switch } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { UserApi } from "@api/api";
import { useSession } from "@context/AuthContext";

type Params = { id: number };

export default function AdminEditUserScreen() {
  const route = useRoute<RouteProp<Record<string, Params>, string>>();
  const nav = useNavigation<any>();
  const { session } = useSession();
  const id = (route.params as Params)?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({
    name: "",
    email: "",
    phone: "",
    role: "sender",
    status: "active",
    online: false,
    vehicle_type: "",
    max_weight_kg: undefined,
    max_volume_cuft: undefined,
    max_length_cm: undefined,
    max_width_cm: undefined,
    max_height_cm: undefined,
  });

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await UserApi.getById(id);
        setForm((prev: any) => ({ ...prev, ...(res.data || res.data?.data || {}) }));
      } catch (e) {
        Alert.alert("Error", "Failed to load user");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const update = (key: string, value: any) => setForm((prev: any) => ({ ...prev, [key]: value }));

  const onSave = async () => {
    setSaving(true);
    try {
      await UserApi.updateById(id, {
        name: form.name,
        email: form.email,
        phone: form.phone,
        role: form.role,
        status: form.status,
        online: !!form.online,
        vehicle_type: form.vehicle_type || null,
        max_weight_kg: form.max_weight_kg ? Number(form.max_weight_kg) : null,
        max_volume_cuft: form.max_volume_cuft ? Number(form.max_volume_cuft) : null,
        max_length_cm: form.max_length_cm ? Number(form.max_length_cm) : null,
        max_width_cm: form.max_width_cm ? Number(form.max_width_cm) : null,
        max_height_cm: form.max_height_cm ? Number(form.max_height_cm) : null,
      });
      Alert.alert("Saved", "User updated");
      nav.goBack();
    } catch (e: any) {
      Alert.alert("Error", e?.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (session?.user?.role !== "admin") {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Unauthorized</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Loading…</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>Edit User #{id}</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} value={form.name} onChangeText={(v) => update("name", v)} />

      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={form.email} autoCapitalize="none" onChangeText={(v) => update("email", v)} />

      <Text style={styles.label}>Phone</Text>
      <TextInput style={styles.input} value={form.phone ?? ""} onChangeText={(v) => update("phone", v)} />

      <Text style={styles.label}>Role (driver/sender/admin)</Text>
      <TextInput style={styles.input} value={form.role} onChangeText={(v) => update("role", v as any)} autoCapitalize="none" />

      <Text style={styles.label}>Status (active/pending/suspended)</Text>
      <TextInput style={styles.input} value={form.status ?? ""} onChangeText={(v) => update("status", v)} autoCapitalize="none" />

      <View style={styles.switchRow}>
        <Text style={styles.labelInline}>Online</Text>
        <Switch value={!!form.online} onValueChange={(v) => update("online", v)} />
      </View>

      <Text style={styles.section}>Vehicle & Capacity (drivers)</Text>

      <Text style={styles.label}>Vehicle Type</Text>
      <TextInput style={styles.input} value={form.vehicle_type ?? ""} onChangeText={(v) => update("vehicle_type", v)} />

      <View style={styles.grid}>
        <View style={styles.gridItem}>
          <Text style={styles.label}>Max Weight (kg)</Text>
          <TextInput style={styles.input} keyboardType="numeric" value={(form.max_weight_kg ?? "").toString()} onChangeText={(v) => update("max_weight_kg", v)} />
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.label}>Max Volume (cu ft)</Text>
          <TextInput style={styles.input} keyboardType="numeric" value={(form.max_volume_cuft ?? "").toString()} onChangeText={(v) => update("max_volume_cuft", v)} />
        </View>
      </View>

      <View style={styles.grid}>
        <View style={styles.gridItem}>
          <Text style={styles.label}>Max Length (cm)</Text>
          <TextInput style={styles.input} keyboardType="numeric" value={(form.max_length_cm ?? "").toString()} onChangeText={(v) => update("max_length_cm", v)} />
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.label}>Max Width (cm)</Text>
          <TextInput style={styles.input} keyboardType="numeric" value={(form.max_width_cm ?? "").toString()} onChangeText={(v) => update("max_width_cm", v)} />
        </View>
        <View style={styles.gridItem}>
          <Text style={styles.label}>Max Height (cm)</Text>
          <TextInput style={styles.input} keyboardType="numeric" value={(form.max_height_cm ?? "").toString()} onChangeText={(v) => update("max_height_cm", v)} />
        </View>
      </View>

      <View style={{ marginTop: 16 }}>
        <Button title={saving ? "Saving..." : "Save"} onPress={onSave} disabled={saving} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
  section: { marginTop: 16, fontSize: 18, fontWeight: "700" },
  label: { fontWeight: "600", marginTop: 10 },
  labelInline: { fontWeight: "600" },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginTop: 6 },
  switchRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 12 },
  grid: { flexDirection: "row", gap: 12, marginTop: 8 },
  gridItem: { flex: 1 }
});
