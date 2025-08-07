import React from "react";
import { View, SafeAreaView, StyleSheet, Platform } from "react-native";
import TopNav from "./TopNav";
import Footer from "./Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView style={styles.safe}>
      <TopNav />
      <View style={styles.content}>{children}</View>
      {Platform.OS === "web" && <Footer />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 25 : 0,
    backgroundColor: "#f8fafc"
  },
  content: {
    flex: 1,
    marginVertical: 20,
  }
});
