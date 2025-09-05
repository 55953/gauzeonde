import { Stack } from "expo-router";
import TabLayout from "../../../components/TabLayout";

export default function AdminLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Admin Dashboard", headerShown: false }} />
      <Stack.Screen name="manageAllUsers" options={{ title: "Manage Users", headerShown: false }} />
      <Stack.Screen name="manageAllShipments" options={{ title: "Manage Shipments", headerShown: false }} />
      <Stack.Screen name="reportingAnalytics" options={{ title: "Admin Tracking", headerShown: false }} />
      <Stack.Screen name="driverTracking" options={{ title: "Driver Tracking", headerShown: false }} />
    </Stack>
  );
}
