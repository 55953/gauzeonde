import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Platform } from "react-native";
import { AuthApi } from "../../api/api";
import { useSession } from "../../contexts/AuthContext";


export default function LoginScreen() {
  const { login } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const handleLogin = async () => {
    setErr("");
    if (!email || !password) {
      setErr("Email and password are required");
      return;
    }
    try {
      // Call the login API
      // let response;
      // await AuthApi.login(email, password).then((res) => {
      //   response = res.data;
      // });
      // console.log("Login response:", response);
      const response : { token: string | null } = await AuthApi.login(email, password);
      const token = response?.data?.token;
      login(token);
    } catch (ex: any) {
      console.log("This is the error on login : " , ex.response?.data?.messages);
      setErr(ex.response?.data?.messages?.error || "Unknown error");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gauzeonde</Text>
      <Text style={styles.subtitle}>Delivery Platform</Text>
      {err ? <Text style={styles.error}>{err}</Text> : null}
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none"/>
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Login" onPress={handleLogin} />
      <Text style={styles.footer}>
        Professional delivery services at your fingertips
      </Text>
    </View>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#3B82F6',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#64748B',
    marginBottom: 48,
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
  },
  footer: {
    textAlign: 'center',
    color: '#64748B',
    fontSize: 14,
    marginTop: 24
  },
});
