import React from "react";
import { View, Text } from "react-native";
import Layout from "../components/Layout";
import { RootStackParamList } from "@navigation/RootNavigator";


export default function HomeScreen() {
  return (
    <Layout>
    <View style={{ padding: 24 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 12 }}>Welcome to Send In Path</Text>
      <Text>
        Send In Path is a modern logistics and shipping platform connecting drivers and shippers for real-time, efficient, long-haul deliveries across the nation.
      </Text>
    </View>
    </Layout>
  );
}
