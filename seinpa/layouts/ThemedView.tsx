import { SafeAreaView, View, useColorScheme } from "react-native";
import { ThemeColors } from "../constants/ThemeColors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ThemedView = ({ style, safe = true, ...props }) => {
  const colorScheme = useColorScheme();
  const theme = ThemeColors[colorScheme] ?? ThemeColors.light;

  if (safe) {
    return (
      <View style={[{ backgroundColor: theme.background }, style]} {...props} />
    );
  }
  const insets = useSafeAreaInsets();
  return (
    <View style={[{ 
      backgroundColor: theme.background, paddingTop: insets.top, paddingBottom: insets.bottom
      },
      style]} {...props} />
  );
}

export default ThemedView;