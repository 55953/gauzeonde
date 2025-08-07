import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import api from "../api/api";
import { User } from "../types";

export default function ProfileForm({ user, onUpdated }: { user: User; onUpdated?: (u: User) => void }) {
  const [profile, setProfile] = useState<User>(user);
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setMsg("");
    try {
      const res = await api.put(`/users/${profile.id}`, profile);
      setMsg("Profile updated!");
      if (onUpdated) onUpdated(res.data);
    } catch {
      setMsg("Update failed.");
    }
    setSaving(false);
  };

  return (
    <View style={styles.box}>
      <Text style={styles.title}>Edit Profile</Text>
      <TextInput
        style={styles.input}
        value={profile.name}
        onChangeText={name => setProfile({ ...profile, name })}
        placeholder="Name"
      />
      <TextInput
        style={styles.input}
        value={profile.email}
        onChangeText={email => setProfile({ ...profile, email })}
        placeholder="Email"
      />
      {/* Add more fields if needed */}
      {msg ? <Text style={styles.msg}>{msg}</Text> : null}
      <Button title={saving ? "Saving..." : "Save"} onPress={handleSave} disabled={saving} />
    </View>
  );
}
const styles = StyleSheet.create({
  box: { padding: 16, backgroundColor: "#fff", borderRadius: 8, margin: 16 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 6, padding: 12, marginBottom: 12 },
  msg: { color: "green", marginBottom: 8 }
});
