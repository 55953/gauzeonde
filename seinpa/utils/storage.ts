import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

let storage: {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

if (Platform.OS === "web") {
  storage = {
    getItem: async (key) => Promise.resolve(localStorage.getItem(key)),
    setItem: async (key, value) => Promise.resolve(localStorage.setItem(key, value)),
    removeItem: async (key) => Promise.resolve(localStorage.removeItem(key)),
  };
} else {
  // Native: use AsyncStorage
  storage = {
    getItem: AsyncStorage.getItem,
    setItem: AsyncStorage.setItem,
    removeItem: AsyncStorage.removeItem,
  };
}

export default storage;
