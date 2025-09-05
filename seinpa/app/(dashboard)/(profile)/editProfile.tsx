import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { getToken, parseUser } from "../../../auth/auth";
import ProfileForm from "../../../components/ProfileForm";


export default function EditProfileScreen() {
  const { id } = useLocalSearchParams();
  const token = getToken();
  const user = parseUser(token);

  if (!user) return <View />;

  return (
    <>
      <ProfileForm user={user} />
      <View>
        <Text>Details for item: {id}</Text>
      </View>
    </>
  );
}
