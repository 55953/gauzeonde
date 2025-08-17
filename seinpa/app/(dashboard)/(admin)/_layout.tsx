import { Stack } from "expo-router";
import TabLayout from "../../../components/TabLayout";

export default function AdminLayout() {
  return (
      <>
        <Stack screenOptions={{ headerShown: false }}/>
      </>
  );
}
