import { ActivityIndicator, useColorScheme } from "react-native";
import { ThemeColors } from "../constants/ThemeColors";
import ThemedView from "./ThemedView";


const ThemedLoader = () => {
  const colorScheme = useColorScheme();
  const theme = ThemeColors[colorScheme] ?? ThemeColors.light;

  return (
    <ThemedView style={{ flex: 1, justifyContent: "center", alignItems: "center" }} safeArea={true}>
      <ActivityIndicator
        size="large"
        color={theme.text}
        style={{ marginTop: 20 }}
      />
    </ThemedView>
  );
}

export default ThemedLoader;