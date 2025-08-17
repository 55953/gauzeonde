import { Text, useColorScheme } from "react-native";
import { ThemeColors } from "../constants/ThemeColors";

const ThemedText = ({ style, title = false, ...props }) => {
  const colorScheme = useColorScheme();
  const theme = ThemeColors[colorScheme] ?? ThemeColors.light;
  const textColor = title ? theme.title : theme.text;
  return (
    <Text style={[{ color: textColor }, style]} {...props} />
  );
}

export default ThemedText;
