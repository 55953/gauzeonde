import React from "react";
import { View, Text } from "react-native";


export default function AccountScreen() {
  return (
    <View style={{ padding: 24 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 12 }}>Account</Text>
      <Text>
        Manage your account settings and preferences here.
      </Text>
    </View>
  );
}
