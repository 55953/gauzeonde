import { Stack } from "expo-router";

export default function DriverLayout() {
  return (
    <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Driver Dashboard" }} />
      <Stack.Screen name="createItinerary" options={{ title: "Create Itinerary" }} />
      <Stack.Screen name="ManageParcels" options={{ title: "Manage Parcels" }} />
    </Stack>
  );
}
