import { router, Tabs } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";


export type TabParamList = {
  Home: undefined;
  Services: undefined;
  Activity: undefined;
  Account: undefined;
};

export default function TabLayout() {

  return (
    <>
    <Tabs 
      screenOptions={{
        headerShown: false,
        tabBarStyle: { paddingBottom: 4, height: 56 },
        tabBarActiveTintColor: "#1e40af",
        tabBarInactiveTintColor: "#64748b",
        tabBarHideOnKeyboard: true
      }}
    >
      <Tabs.Screen name="index"
        options={{
            headerShown: false,
            title: "Home",
            tabBarIcon: ({ focused }) => (
              <Ionicons name={ focused ? "home" : "home-outline"} size={24} color={focused ? theme.iconColorFocused : theme.iconColor} />
            ),
          }}
      />
      <Tabs.Screen name="Services" 
        options={{
          title: "Services",
          tabBarIcon: ({ focused }) => (
            <Ionicons name={ focused ? "briefcase" : "briefcase-outline"} size={24} color={focused ? theme.iconColorFocused : theme.iconColor} />
          ),
        }}
      />
      <Tabs.Screen name="Activity" 
        options={{
          title: "Activity",
          tabBarIcon: ({ focused }) => (
            <Ionicons name={ focused ? "list" : "list-outline"} size={24} color={focused ? theme.iconColorFocused : theme.iconColor} />
          ),
        }}
      />
      <Tabs.Screen name="Account" 
        options={{
          title: "Account",
          tabBarIcon: ({ focused }) => (
            <Ionicons name={ focused ? "person" : "person-outline"} size={24} color={focused ? theme.iconColorFocused : theme.iconColor} />
          ),
        }}
      />
    </Tabs>
    </>
  );
}
const theme = {
  iconColor: "#64748b",
  iconColorFocused: "#1e40af",
};