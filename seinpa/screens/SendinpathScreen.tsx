import React from "react";
import { View, Text } from "react-native";
import Layout from "../components/Layout";
import { RootStackParamList } from "@navigation/RootNavigator";
import { NativeStackScreenProps } from "@react-navigation/native-stack/lib/typescript/src/types";

type Props = NativeStackScreenProps<RootStackParamList, "Sendinpath">;
export default function SendinpathScreen() {
  return (
    <Layout>
    <View style={{ padding: 24 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 12 }}>Welcome to SEnd In PAth</Text>
      <Text>
        SEnd In PAth is a modern logistics and shipping platform connecting drivers and shippers for real-time, efficient, long-haul deliveries across the nation.
      </Text>
    </View>
    </Layout>
  );
}
