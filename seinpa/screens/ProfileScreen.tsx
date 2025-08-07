import React from "react";
import { View } from "react-native";
import { getToken, parseUser } from "../auth/auth";
import ProfileForm from "../components/ProfileForm";

export default function ProfileScreen() {
  const token = getToken();
  const user = parseUser(token);

  if (!user) return <View />;

  return <ProfileForm user={user} />;
}
