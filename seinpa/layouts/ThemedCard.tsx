import { View, useColorScheme, StyleSheet } from "react-native";
import { ThemeColors } from "../constants/ThemeColors";

const ThemedCard = ({ style, ...props }) => {
  const colorScheme = useColorScheme();
  const theme = ThemeColors[colorScheme] ?? ThemeColors.light;

  return (
    <View style={[{ backgroundColor: theme.uiBackground}, styles.card, style]} {...props} />
  );
}

export default ThemedCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    padding: 16,
    marginVertical: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});