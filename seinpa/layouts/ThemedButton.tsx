import { Pressable, StyleSheet } from "react-native";
import { ThemeColors } from "../constants/ThemeColors";

function ThemedButton({ style, ...props}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.btn,
        pressed && styles.pressed,
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: ThemeColors.primary,
    padding: 12,
    borderRadius: 3,
    marginVertical: 10,
  },
  pressed: {
    opacity: 0.7,
  },
});

export default ThemedButton;