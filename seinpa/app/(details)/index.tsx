import React from "react";
import { View, StyleSheet } from "react-native";
import { Stack } from "expo-router";

export default function DetailsLayout() {
  return (
    <Stack>
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack>
  );
}
