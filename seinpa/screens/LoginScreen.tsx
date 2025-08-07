import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Platform } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack/lib/typescript/src/types";
import { RootStackParamList } from "../navigation/RootNavigator";
import { AuthApi } from "../api/api";
import { useAuth } from "../context/AuthContext";
import Layout from "@components/Layout";
import { loginResponse } from "@types/index";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const handleLogin = async () => {
    setErr("");
    try {
      const response : loginResponse | any = await AuthApi.login(email, password);
      console.log("Login response:", response);
      login(response.data.token);
      // navigation.reset({ index: 0, routes: [{ name: "Home" }] });
      // router.replace('/home');
    } catch (ex: any) {
      console.log(ex);
      setErr(ex.response.data.messages.error || "Unknown error");
    }
  };

  return (
    <Layout>
    <View style={styles.container}>
      <Text style={styles.header}>Login</Text>
      {err ? <Text style={styles.error}>{err}</Text> : null}
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none"/>
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Login" onPress={handleLogin} />
    </View>
    </Layout>
  );
}
const styles = StyleSheet.create({
  container: { 
    justifyContent:"center", 
    padding:24,
    width: "93%",
    maxWidth: Platform.OS === "web" ? 631 : "97%",
    alignSelf:"center" 
  },
  header: {
    fontSize:28, 
    fontWeight:"bold", 
    marginBottom:24, 
    textAlign:"center" 
  },
  input: {
    borderWidth:1, 
    borderColor:"#ccc", 
    borderRadius:6, 
    padding:12, 
    marginBottom:12
  },
  error: { 
    color:"red", 
    marginBottom:12, 
    textAlign:"center" 
  }
});
