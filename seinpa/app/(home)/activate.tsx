import React, { useState } from "react";
import { Link,  router } from 'expo-router';
import { View, Text, TextInput, Button, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AuthApi } from "../../api/api";

export default function Modal() {
  const isPresented = router.canGoBack();
  const [activationCode, setActivationCode] = useState(null);
  const [message, setMessage] = useState("");
  const [err, setErr] = useState("");

  const handleActivation = async () => {
    setErr("");
    setMessage("");
    try {
      const res = await AuthApi.activate(activationCode);
      setMessage((res?.data?.message || "Unknown success message"));
    } catch (e: any) {
      setErr("Activation failed: " + (e.response?.data?.messages?.error || "Unknown error"));
    }
  };
  
  return (
    <>
        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
        
        <View style={styles.container}>
        <Text style={styles.label}>Enter Activation Code</Text>
        {message ? <Text style={styles.message}>{message}</Text> : null}
        {err ? <Text style={styles.error}>{err}</Text> : null}
        <TextInput style={styles.input} placeholder="32X7Z8" value={activationCode} onChangeText={setActivationCode} autoCapitalize="none"/>
        <Button title="Send Code" onPress={handleActivation} />
        {isPresented && <Link style={styles.link} href="/login">X</Link>}
        </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
    input: {
    borderWidth:1, 
    borderColor:"#ccc", 
    borderRadius:6, 
    padding:12, 
    marginBottom:12,
    textAlign: 'center'
  },
  label:{
    fontSize: 12,
    marginRight:2,
    fontWeight: "bold",
    paddingVertical: 12
  },
  link:{
    color: "#1e40afe0",
    position: "absolute",
    fontSize: 24,
    fontWeight: "bold",
    borderColor: "#1e40afe0",
    borderWidth: 2,
    borderRadius: 5,
    padding: 4,
    right: 12,
    top: 12
  },
  message: {
    color: 'green',
    padding: 10,
  },
  error: {
    color: 'red',
  }
});
