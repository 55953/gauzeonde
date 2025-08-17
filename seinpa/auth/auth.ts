import React, { useState } from "react";
//import JWT from 'expo-jwt';
import { jwtDecode } from "jwt-decode";
import storage from "../utils/storage";
import { TokenPayload, User } from "../types";

// For Expo: use SecureStore for production; here localStorage for simplicity
const secret: string | undefined = process.env.EXPO_PUBLIC_JWT_SECRET;

export async function setToken(token: string) {
  if (token) await storage.setItem("token", token);
}
export async function getToken(): string {
  return (await storage.getItem("token")) || "";
}
export async function clearToken() {
  await storage.removeItem("token");
}
export async function parseUser(token: string): Partial<User> | null {
    if (!token) return null;
    try {
      const userdata = jwtDecode<Partial<TokenPayload>>(token);
      if (!userdata.user || typeof userdata.user !== "object") {
        throw new Error("Invalid token payload");
      }
      if (!userdata.user.phone || !userdata.user.email) {
        throw new Error("Token payload missing required fields");
      }
      console.log("Parsed auth user:", userdata.user);
      return userdata.user as Partial<User>;
    } catch {
      return null;
    }
}
export async function isAuthenticated(): Promise<boolean> {
  const token = await getToken();
  if (!token) return false;
  try {
   const payload: any = jwtDecode(token);
    if (!payload.exp) return false;
    return Date.now() / 1000 < payload.exp;
  } catch {
    return false;
  }
}
