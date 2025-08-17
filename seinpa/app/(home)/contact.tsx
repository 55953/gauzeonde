import { View, Text, Linking } from "react-native";
import React from "react";

export default function ContactScreen() {
  return (
    <View style={{ padding: 24 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 12 }}>Contact Us</Text>
      <Text onPress={() => Linking.openURL("mailto:support@gauzeonde.com")} style={{ color: "#2563eb" }}>
        support@gauzeonde.com
      </Text>
      <Text onPress={() => Linking.openURL("tel:+1234567890")} style={{ color: "#2563eb" }}>
        +1 234 567 890
      </Text>
    </View>
  );
}
