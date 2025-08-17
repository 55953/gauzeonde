import React from "react";
import { Stack } from 'expo-router';
import { useSession } from "../../contexts/AuthContext";

export default function HomeLayout() {
  const { isLoggedIn, session } = useSession();

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: "#1e40af",
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
          <>
            <Stack.Screen name="index"  options={{ title: "Send In Path", headerShown: false }} />
            <Stack.Screen name="about" options={{ title: "About", headerShown: false }} />
            <Stack.Screen name="contact" options={{ title: "Contact", headerShown: false }} />
          </>
          <Stack.Protected guard={!isLoggedIn}>
            <Stack.Screen name="login" options={{ title: "Login", headerShown: false }} />
            <Stack.Screen name="register" options={{ title: "Register", headerShown: false }} />
            <Stack.Screen name="activate" options={{ title: "Activate", presentation: 'modal', }} />
          </Stack.Protected>
      </Stack>
    </>
  );
}