import { useSession } from '@context/AuthContext';
import { Stack } from "expo-router";


export default function DashboardLayout() {
  let dashboardRole = useSession()?.session?.user?.role || 'sender';
  switch (dashboardRole) {
    case 'admin':
      return (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(admin)" options={{ title: "Admin Dashboard", headerShown: false }} />
        </Stack>
      );
    case 'driver':
      return (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(driver)" options={{ title: "Driver Dashboard", headerShown: false }} />
        </Stack>
      );
    case 'sender':
      return (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(sender)" options={{ title: "Sender Dashboard", headerShown: false }} />
        </Stack>
      );
    default:
      return (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(sender)" options={{ title: "Sender Dashboard", headerShown: false }} />
        </Stack>
      );
  }
}
