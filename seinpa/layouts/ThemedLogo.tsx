import { Image, useColorScheme } from "react-native";
import { ThemeColors } from "../constants/ThemeColors";

const ThemedLogo = ({ style, ...props }) => {
  const colorScheme = useColorScheme();
  const logo = colorScheme === 'dark' ? require('../assets/logo-dark.jpg') : require('../assets/logo-light.jpg');

  return (
    <Image source={logo} style={[{ width: 100, height: 100 }, style]} {...props} />
  );
}

export default ThemedLogo;