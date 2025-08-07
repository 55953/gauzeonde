import React from "react";
import {Platform, View, Text, StyleSheet } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemeColors } from "../constants/ThemeColors";

export default function Footer() {
  return (
    <View style={styles.footer}>
      {Platform.OS === "web" && <View style={{ height: 10 }} />}
      <Text style={styles.txt}>© {new Date().getFullYear()} Seinpa</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: "#1e40af",
    padding: 10,
    alignItems: "center",
    marginBottom: Platform.OS === "web" ? 0 : 40,
    position: "relative"
  },
  txt: {
    color: "#fff",
    fontSize: 14
  }
});
