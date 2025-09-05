import { router, Tabs } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";
import { useSession } from '@context/AuthContext';

export type TabParamList = {
  Home: undefined;
  Services: undefined;
  Activity: undefined;
  Account: undefined;
};

export default function TabLayout() {
   const { session } = useSession();
    let dashboardRole = session?.user?.role || 'sender';
    let dashboardName: string= "";
    let drivertabhide: string = "";
    let sendertabhide: string = "";
    let admintabhide: string = "";
    switch (dashboardRole) {
      case 'admin':
        dashboardName = "(admin)";
        admintabhide = "admin";
        drivertabhide = "(driver)";
        sendertabhide = "(sender)";
        break;
      case 'driver':
        dashboardName = "(driver)";
        admintabhide = "(admin)";
        drivertabhide = "driver";
        sendertabhide = "(sender)";
        break;
      case 'sender':
        dashboardName = "(sender)";
        admintabhide = "(admin)";
        sendertabhide = "sender";
        drivertabhide = "(driver)";
        break;
      default:
        dashboardName = "(sender)";
        admintabhide = "(admin)";
        sendertabhide = "sender";
        drivertabhide = "(driver)";
    }

  return (
    <>
    <Tabs
      initialRouteName={dashboardName}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { paddingBottom: 4, height: 56 },
        tabBarActiveTintColor: "#1e40af",
        tabBarInactiveTintColor: "#64748b",
        tabBarHideOnKeyboard: true
      }}
    >
      <Tabs.Screen name={dashboardName} //name={`${dashboardName}/index`
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
      <Tabs.Screen 
        name="(admin)/adminDashboard"
        options={{
          title: "Admin Dashboard",
          headerShown: false,
          href: null
        }}
      />
      <Tabs.Screen 
        name="(admin)/index" 
        options={{
          title: "Admin Dashboard",
          headerShown: false,
          href: null
        }}
      />
      <Tabs.Screen 
        name="(admin)/DriverTracking" 
        options={{
          href: null
        }}
      />
      <Tabs.Screen 
        name="(sender)/ShipmentTrack"
        options={{
          title: "Delivery Tracking",
          headerShown: true,
          href: null
        }}
      />
      <Tabs.Screen 
        name="(sender)/ShipmentCreate" 
        options={{
          href: null
        }}
      />
      <Tabs.Screen 
        name="(profile)/index" 
        options={{
          href: null
        }}
      />
      <Tabs.Screen 
        name="(profile)/editProfile" 
        options={{
          href: null
        }}
      />
      <Tabs.Screen 
        name="(settings)" 
        options={{
          href: null
        }}
      />
      <Tabs.Screen 
        name="(settings)/index" 
        options={{
          href: null
        }}
      />
      <Tabs.Screen 
        name={drivertabhide} 
        options={{
          href: null
        }}
      />
      <Tabs.Screen 
        name={sendertabhide}
        options={{
          href: null
        }}
      />
      <Tabs.Screen 
        name={admintabhide} 
        options={{
          href: null
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