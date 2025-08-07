import { View, Text, Linking } from "react-native";
import Layout from "@components/Layout";
import { RootStackParamList } from "@navigation/RootNavigator";
import { NativeStackScreenProps } from "@react-navigation/native-stack/lib/typescript/src/types";

type Props = NativeStackScreenProps<RootStackParamList, "Contact">;
export default function ContactScreen() {
  return (
    <Layout>
    <View style={{ padding: 24 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 12 }}>Contact Us</Text>
      <Text onPress={() => Linking.openURL("mailto:support@gauzeonde.com")} style={{ color: "#2563eb" }}>
        support@gauzeonde.com
      </Text>
      <Text onPress={() => Linking.openURL("tel:+1234567890")} style={{ color: "#2563eb" }}>
        +1 234 567 890
      </Text>
    </View>
    </Layout>
  );
}
