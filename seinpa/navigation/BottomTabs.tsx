import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import ServicesScreen from "../screens/ServicesScreen";
import ActivityScreen from "../screens/ActivityScreen";
import AccountScreen from "../screens/AccountScreen";
import { Ionicons } from "@expo/vector-icons";

export type RootTabParamList = {
  Home: undefined;
  Services: undefined;
  Activity: undefined;
  Account: undefined;
  Shipments: undefined;
  Drivers: undefined;
  Itineraries: undefined;
  Payments: undefined;
  Notifications: undefined;
  Dashboard: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#1e40af",
        tabBarInactiveTintColor: "#64748b",
        tabBarStyle: { paddingBottom: 4, height: 56 },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;
          if (route.name === "Home") iconName = focused ? "home" : "home-outline";
          if (route.name === "Services") iconName = focused ? "briefcase" : "briefcase-outline";
          if (route.name === "Activity") iconName = focused ? "list" : "list-outline";
          if (route.name === "Account") iconName = focused ? "person" : "person-outline";
          //  <>
          //   <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
          //   <Stack.Screen name="Profile" component={ProfileScreen} />
          //   <Stack.Screen name="DriverTracking" component={DriverTrackingScreen} />
          //   {/* add more as needed */}
          // </>
          return <Ionicons name={iconName} size={size} color={color} />;
        }
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Services" component={ServicesScreen} />
      <Tab.Screen name="Activity" component={ActivityScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}
