import { Stack } from "expo-router";

export default function SenderLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Sender Dashboard", headerShown: false}} />
      <Stack.Screen name="RequestDelivery" options={{ title: "Request Delivery", headerShown: false }} />
      <Stack.Screen name="ShipmentTrack" options={{ title: "Sender Tracking", headerShown: false }} />
      <Stack.Screen name="CreateShipmentScreen" options={{ title: "Create Shipment", headerShown: false }} />
      <Stack.Screen name="ManageShipments" options={{ title: "Manage Shipments", headerShown: false }} />
    </Stack>
  );
}
