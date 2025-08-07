import React, { useState } from "react";
import * as ExpoJWT from 'expo-jwt';
import storage from "../utils/storage";
import { User } from "../types";

// For Expo: use SecureStore for production; here localStorage for simplicity
const secret = process.env.EXPO_PUBLIC_JWT_SECRET;

export async function setToken(token: string) {
  if (token) await storage.setItem("token", token);
}
export async function getToken(): Promise<string | null> {
  return await storage.getItem("token");
}
export async function clearToken() {
  await storage.removeItem("token");
}
export async function parseUser(token: string): Promise<User | null> {
    if (!token) return null;
    try {
      return ExpoJWT.decode([token], secret);
    } catch {
      return null;
    }
}
export async function isAuthenticated(): Promise<boolean> {
  const token = await getToken();
  if (!token) return false;
  try {
   const payload: any = ExpoJWT.decode(token);
    if (!payload.exp) return false;
    return Date.now() / 1000 < payload.exp;
  } catch {
    return false;
  }
}
