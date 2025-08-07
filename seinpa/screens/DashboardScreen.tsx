import React from "react";
import { View, Text, Button } from "react-native";
import { getToken, parseUser, clearToken } from "../auth/auth";
import DriverDashboard from "../components/DriverDashboard";
import SenderDashboard from "../components/SenderDashboard";
import AdminDashboard from "../components/AdminDashboard";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/RootNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "Dashboard">;

export default function DashboardScreen({ navigation }: Props) {
  const token = getToken();
  const user = parseUser(token);

  const handleLogout = () => {
    clearToken();
    navigation.reset({ index: 0, routes: [{ name: "Login" }] });
  };

  let DashboardView = <Text>Unknown role</Text>;
  if (user?.role === "driver") DashboardView = <DriverDashboard user={user} />;
  if (user?.role === "sender") DashboardView = <SenderDashboard user={user} />;
  if (user?.role === "admin") DashboardView = <AdminDashboard user={user} />;

  return (
    <View style={{ flex:1, justifyContent:"center", alignItems:"center" }}>
      {DashboardView}
      <Button title="Edit Profile" onPress={() => navigation.navigate("Profile")} />
      <Button title="Logout" color="red" onPress={handleLogout} />
    </View>
  );
}
