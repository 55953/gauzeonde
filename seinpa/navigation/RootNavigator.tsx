import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import DashboardScreen from "../screens/DashboardScreen";
import ProfileScreen from "../screens/ProfileScreen";
import DriverTrackingScreen from "../screens/DriverTrackingScreen";
import { AuthProvider, useAuth } from "../context/AuthContext";
import BottomTabs from "./BottomTabs";
import AboutScreen from "@screens/AboutScreen";
import ContactScreen from "@screens/ContactScreen";
import SendinpathScreen from "@screens/SendinpathScreen";


export type RootStackParamList = {
  Sendinpath: undefined;
  About: undefined;
  Contact: undefined;
  Login: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function MainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <>
        <Stack.Screen name="Sendinpath" component={SendinpathScreen} options={{ headerShown: false }} />
        <Stack.Screen name="About" component={AboutScreen} options={{ headerShown: true }} />
        <Stack.Screen name="Contact" component={ContactScreen} options={{ headerShown: true }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        {/* <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="DriverTracking" component={DriverTrackingScreen} /> */}
      </> 
    </Stack.Navigator>
  );
}


export default function RootNavigator() {
  const { authState } = useAuth();
  useEffect(() => {
    // Check authentication state on mount
    const checkAuth = async () => {
      await authState?.checkAuth?.();
    };
    checkAuth();
  }, [authState]);
  return (
    <AuthProvider>
      <NavigationContainer>
        {!authState?.authenticated ? <MainNavigator /> : <BottomTabs />}
      </NavigationContainer>
    </AuthProvider>
  );
}
