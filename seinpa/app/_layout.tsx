import React, { useEffect, StrictMode } from "react";
import { useFonts } from 'expo-font';
import { Stack, withLayoutContext } from "expo-router";
import { StyleSheet, Text, View, Appearance, useColorScheme, Platform} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TopNav from "@components/TopNav";
import Footer  from "@components/Footer";
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useSession} from "../contexts/AuthContext";
import * as SplashScreen from 'expo-splash-screen';

export default function RootLayout() {
  // const colorScheme = useColorScheme();

  // const themeTextStyle = colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  // const themeContainerStyle =
  // colorScheme === 'light' ? styles.lightContainer : styles.darkContainer;
  SplashScreen.setOptions({
    duration: 1000,
    fade: true,
  });
  const [loaded] = useFonts({
      SpaceMono: require('../assets/fonts/Inter_24pt-Regular.ttf'),
    });

    useEffect(() => {
      if (loaded) {
        SplashScreen.hide();
      }
    }, [loaded]);

    if (!loaded) {
      return null;
    }

  return (
    <StrictMode>
    <AuthProvider>
      <SafeAreaView style={styles.safe}>
        <StatusBar style="auto" />
        <RootNavigator />
      </SafeAreaView>
    </AuthProvider>
    </StrictMode>
  );
}

function RootNavigator() {

  const { isLoggedIn, session } = useSession();

  console.log("Is Logged In:", isLoggedIn);
  console.log("Session Data:", session);

  return (
    <>
      <TopNav />
      <>
        <Stack screenOptions={{ headerShown: false, contentStyle: styles.content }}>
          <Stack.Protected guard={!isLoggedIn}>
          <Stack.Screen name="(home)" options={{ title: "Send In Path", headerShown: false }} />
          </Stack.Protected>
          <Stack.Protected guard={isLoggedIn}>
            <Stack.Screen name="(dashboard)" options={{ title: "Dashboard", headerShown: false }} />
          </Stack.Protected>
        </Stack>
      </>
    {Platform.OS === "web" && <Footer />}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  safe: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 1 : 0,
    backgroundColor: "#f8fafc"
  },
  content: {
    flex: 1
  },
  text: {
    fontSize: 20,
  },
  lightContainer: {
    backgroundColor: '#d0d0c0',
  },
  darkContainer: {
    backgroundColor: '#242c40',
  },
  lightThemeText: {
    color: '#242c40',
  },
  darkThemeText: {
    color: '#d0d0c0',
  },
});