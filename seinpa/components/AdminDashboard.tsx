import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import api from "../api/api";
import { User, Shipment } from "../types";
import Layout from "../components/Layout";

export default function AdminDashboard({ user }: { user: User }) {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    api.get("/shipments").then(res => setShipments(res.data)).catch(() => {});
    api.get("/users").then(res => setUsers(res.data)).catch(() => {});
  }, []);

  return (
    <Layout>
      <View>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Admin Panel</Text>
        <Text style={{ marginTop: 8, marginBottom: 4, fontWeight: "bold" }}>All Shipments</Text>
        <FlatList
          data={shipments}
          keyExtractor={item => item.id + ""}
          renderItem={({ item }) => (
            <View style={{ padding: 8, borderBottomWidth: 1, borderColor: "#eee" }}>
              <Text>#{item.tracking_number} - {item.status}</Text>
            </View>
          )}
        />
        <Text style={{ marginTop: 16, marginBottom: 4, fontWeight: "bold" }}>All Users</Text>
        <FlatList
          data={users}
          keyExtractor={item => item.id + ""}
          renderItem={({ item }) => (
            <View style={{ padding: 8, borderBottomWidth: 1, borderColor: "#eee" }}>
              <Text>{item.name} ({item.role}) - {item.email}</Text>
            </View>
          )}
        />
      </View>
    </Layout>
  );
}
