import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import api from "../../../api/api";
import { User, Shipment } from "../../../types";
import { useSession } from "../../../contexts/AuthContext";

export default function DriverDashboard() {
  const { session } = useSession();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  console.log("DriverDashboard session:", session);
  useEffect(() => {
    api.get(`/drivers/${session?.user?.sub}/shipments`)
      .then(res => setShipments(res.data))
      .catch(() => setShipments([]));
  }, [session?.user]);
  const earnings = shipments.reduce((sum, s) => sum + (s.payout || 0), 0);
  return (
      <View>
        <Text style={{ fontSize:14, fontWeight:"bold" }}>Welcome, {session?.user?.name}</Text>
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
  );
}

export const functions = {
  getShipments: async (driverId: number) => await api.get<Shipment[]>(`/drivers/${driverId}/shipments`),
  updateLocation: async (driverId: number, location: { lat: number; lng: number }) =>
    await api.put(`/drivers/${driverId}/location`, location),
  acceptShipment: async (driverId: number, shipmentId: number) =>
    await api.post(`/drivers/${driverId}/shipments/${shipmentId}/accept`),
  completeShipment: async (driverId: number, shipmentId: number) =>
    await api.post(`/drivers/${driverId}/shipments/${shipmentId}/complete`),
  driverOnline: async (driverId: number, online: boolean) =>
    await api.post(`/drivers/${driverId}/online`, { online }),
};
