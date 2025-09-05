import { Stack } from "expo-router";
import { useSession } from "../../../hooks/useSession";
import GuestOnly from "../../../layouts/auth/GuestOnly";

export default function SettingsLayout() {
  const { session } = useSession();
  console.log("Current user in Details Layout:", session?.user);
  return (
    <GuestOnly>
      <Stack
        screenOptions={{
            headerShown: true,
            animation: "none",
            headerStyle: { backgroundColor: "#f8f8f8" },
            headerTintColor: "#b253ffff",
            headerTitleStyle: { fontWeight: "bold" },
        }}
      />
    </GuestOnly>
  );
}