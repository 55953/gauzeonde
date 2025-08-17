import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform, Image} from "react-native";
import { router } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { useSession, isLoggedIn, logout } from "../contexts/AuthContext";

export default function TopNav() {
  const navigation = useNavigation<any>();
  const { session, logout, isLoggedIn } = useSession();
  const logoImage = require("../assets/seinpa.png");
  //const logo = Image.resolveAssetSource(logoImage);


  return (
    <View style={styles.nav}>
      <Text style={styles.logo}>
        <TouchableOpacity onPress={() => router.navigate("/")}>
          <Image source={logoImage} style={{ width: 30, height: 30 }} />
        </TouchableOpacity>
      </Text>
      <View style={styles.links}>
        <TouchableOpacity onPress={() => router.navigate("/about")}>
          <Text style={styles.link}>About</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.navigate("/contact")}>
          <Text style={styles.link}>Contact</Text>
        </TouchableOpacity>
        {isLoggedIn === true ? (
          <TouchableOpacity onPress={() => logout()}>
            <Text style={styles.link}>Logout</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity onPress={() => router.navigate("/login")}>
              <Text style={styles.link}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.navigate("/register")}>
              <Text style={styles.link}>Get Account</Text>
            </TouchableOpacity>
          </>
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
    backgroundColor: "#1e40afe0",
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginVertical: Platform.OS === "web" ? 0 : 10,
    marginHorizontal: Platform.OS === "web" ? 3 : 3,
    borderColor: "#1e40af",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderRadius: 5
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
    fontSize: 14,
    marginLeft: 12
  }
});
