import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform, Image} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";

export default function TopNav() {
  const navigation = useNavigation<any>();
  const { authState, logout } = useAuth();
  
  return (
    <View style={styles.nav}>
      <Text style={styles.logo}>
        <Image source={require("../assets/seinpa.png")} style={{ width: 30, height: 30 }} />
      </Text>
      <View style={styles.links}>
        <TouchableOpacity onPress={() => navigation.navigate("About")}>
          <Text style={styles.link}>About</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Contact")}>
          <Text style={styles.link}>Contact</Text>
        </TouchableOpacity>
        {authState?.authenticated ? (
          <TouchableOpacity onPress={() => logout()}>
            <Text style={styles.link}>Logout</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.link}>Login</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1e40af",
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginVertical: Platform.OS === "web" ? 0 : 40,
  },
  logo: {
    backgroundColor: "white",
    height: 40,
    width: 40,
    borderColor: "#f9f9f9",
    borderWidth: 2,
    borderRadius: 5,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold"
  },
  links: {
    flexDirection: "row"
  },
  link: {
    color: "white",
    fontSize: 16,
    marginLeft: 18
  }
});
