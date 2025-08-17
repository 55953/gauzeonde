import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { useSession } from "../../hooks/useSession";
import GuestOnly from "../../layouts/auth/GuestOnly";

export default function DetailsLayout() {
  const { session } = useSession();
  console.log("Current user in Details Layout:", session?.user);
  return (
    <GuestOnly>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
            headerShown: false,
            animation: "none",
            headerStyle: { backgroundColor: "#f8f8f8" },
            headerTintColor: "#333",
            headerTitleStyle: { fontWeight: "bold" },
        }}
      />
    </GuestOnly>
  );
}