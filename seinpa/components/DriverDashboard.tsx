import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import api from "../api/api";
import { User, Shipment } from "../types";
import Layout from "../components/Layout";

export default function DriverDashboard({ user }: { user: User }) {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  useEffect(() => {
    api.get(`/drivers/${user.id}/shipments`)
      .then(res => setShipments(res.data))
      .catch(() => setShipments([]));
  }, [user]);
  const earnings = shipments.reduce((sum, s) => sum + (s.payout || 0), 0);
  return (
    <Layout>
      <View>
        <Text style={{ fontSize:18, fontWeight:"bold" }}>Welcome, {user.name}</Text>
        <Text>Total Shipments: {shipments.length}</Text>
        <Text>Total Earnings: ${earnings.toFixed(2)}</Text>
        <FlatList
          data={shipments}
          keyExtractor={item => item.id+""}
          renderItem={({item}) => (
            <View style={{ padding:8, borderBottomWidth:1, borderColor:"#eee" }}>
              <Text>#{item.tracking_number} - {item.status}</Text>
            </View>
          )}
        />
      </View>
    </Layout>
  );
}
