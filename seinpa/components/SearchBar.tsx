import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Button } from "react-native";
import api from "../api/api";
import { User, Shipment } from "../types";

export default function SenderDashboard({ user, navigation }: { user: User; navigation: any }) {
  const [shipments, setShipments] = useState<Shipment[]>([]);

  useEffect(() => {
    api.get(`/senders/${user.id}/shipments`)
      .then(res => setShipments(res.data))
      .catch(() => setShipments([]));
  }, [user]);

  return (
    <View>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>Welcome, {user.name} (Sender)</Text>
      <Button title="Create Shipment" onPress={() => navigation.navigate("CreateShipment")} />
      <FlatList
        data={shipments}
        keyExtractor={item => item.id + ""}
        renderItem={({ item }) => (
          <View style={{ padding: 8, borderBottomWidth: 1, borderColor: "#eee" }}>
            <Text>#{item.tracking_number} - {item.status}</Text>
            <Text>{item.origin} → {item.destination}</Text>
          </View>
        )}
      />
    </View>
  );
}
