import { Stack } from "expo-router";

export default function DriverLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Driver Dashboard", headerShown: false }} />
      <Stack.Screen name="DriverDashboard" options={{ title: "Driver Dashboard", headerShown: false }} />
      <Stack.Screen name="DriverTracking" options={{ title: "Driver Tracking", headerShown: false }} />
      <Stack.Screen name="ManageParcels" options={{ title: "Manage Parcels", headerShown: false }} />
    </Stack>
  );
}
