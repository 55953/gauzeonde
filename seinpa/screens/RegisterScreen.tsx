import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Platform } from "react-native";
import { AuthApi } from "../api/api";
import { useAuth } from "../context/AuthContext";
import Layout from "@components/Layout";

export default function RegisterScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const handleRegister = async () => {
    setErr("");
    try {
      const res = await AuthApi.register(email, password);
      login(res.data.token);
      // Navigation will auto-redirect to Dashboard
    } catch (e: any) {
      setErr("Registration failed: " + e.message);
    }
  };

  return (
    <Layout>
    <View style={styles.container}>
      <Text style={styles.header}>Login</Text>
      {err ? <Text style={styles.error}>{err}</Text> : null}
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none"/>
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Register" onPress={handleRegister} />
    </View>
    </Layout>
  );
}
const styles = StyleSheet.create({
  container: { 
    flex:1, 
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
