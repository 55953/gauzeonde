import { TextInput, useColorScheme} from "react-native";
import { ThemeColors } from "../constants/ThemeColors";

const ThemedTextInput = ({ style, ...props }) => {
  const colorScheme = useColorScheme();
  const theme = ThemeColors[colorScheme] ?? ThemeColors.light;

  return (
    <TextInput
      style={[
            { 
                backgroundColor: theme.uiBackground,
                color: theme.text,
                padding: 10, 
                borderWidth: 1, 
                borderColor: "#ccc", 
                borderRadius: 5 
            }, 
            style
        ]}
      {...props}
    />
  );
}

export default ThemedTextInput;