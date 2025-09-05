import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Platform, ScrollView, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard } from "react-native";
import { Dropdown } from 'react-native-element-dropdown';
import { AuthApi } from "../../api/api";
import { useSession } from "../../contexts/AuthContext";
import { loginResponse } from "@types/index";
import { router } from "expo-router";

export default function RegisterScreen() {
  const { login } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("null");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState<string[]>([]);
  const [msg, setMsg] = useState("");

  const roleOptions = [
  { label: 'Sender', value: 'sender' },
  { label: 'Driver', value: 'driver' },
  { label: 'Admin', value: 'admin' }
];

  const handleRegister = async () => {
    setErr([]);
    try {
      if (password !== confirmPassword) {
        setErr(["Passwords do not match"]);
        return;
      }
      const res =  await AuthApi.register({name, email, phone, password, role});
      if (res.status !== 200) {
        setErr(res?.data?.messages || ["Unknown error"]);
        return;
      }
      setMsg("Registration successful : " + (res?.data?.message || "Unknown success message"));
      router.push("/activate");

      // const act =  await AuthApi.activate(email, res?.data);

      // if (act.status !== 200) {
      //   setErr(["Activation failed"]);
      //   return;
      // }

      // login(res.data.token);
      // Navigation will auto-redirect to Dashboard
    } catch (e: any) {
      console.log( "errors", e.response?.data?.messages);
      setErr(e.response?.data?.messages);
    }
  };

  // const handleActivation = async () => {
  //   setErr("");
  //   const activationCode: number | null = null;
  //   try {
  //     const res = await AuthApi.activate(email, activationCode);
  //     // Handle successful activation
  //   } catch (e: any) {
  //     setErr("Activation failed: " + e.message);
  //   }
  // };

  return (
    <View style={styles.scrollViewContent}>
      <Text style={styles.header}>Register</Text>
      {msg ? <Text style={styles.error}>{msg}</Text> : null}
      {/* {err ? <Text style={styles.error}>{err}</Text> : null} */}
      {err.length > 0 && (
        <View style={styles.errorContainer}>
          {err.map((error, index) => (
            <Text key={error} style={styles.errorMessage}>{error}</Text>
          ))}
        </View>
      )}
      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} autoCapitalize="none"/>
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none"/>
      <TextInput style={styles.input} placeholder="Phone" value={phone} onChangeText={setPhone} autoCapitalize="none"/>
      <Text style={styles.label}>Register as:</Text>
      <Dropdown 
        data={roleOptions}
        labelField="label"
        valueField="value"
        placeholder="Select Role"
        value={role}
        onChange={(item) => setRole(item.value)}
        style={styles.input}
      />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <TextInput style={styles.input} placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
}
const styles = StyleSheet.create({
  scrollViewContent: { 
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
  label:{
    fontSize: 12,
    marginRight:2,
    fontWeight: "bold",
    paddingVertical: 12
  },
  error: { 
    color:"red", 
    marginBottom:12, 
    textAlign:"center" 
  },
  errorContainer: {
    marginBottom: 12,
    padding: 10,
    backgroundColor: '#f8d7da',
    borderRadius: 6,
  },
  errorMessage: {
    color: "red",
    marginBottom: 12,
    textAlign: "center"
  }
});
