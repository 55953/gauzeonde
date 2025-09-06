import { Platform } from "react-native";
import useBrowserLocation, { UseBrowserLocationOptions, UseBrowserLocation } from "./useBrowserLocation";

export default function useDeviceLocation(
  opts: UseBrowserLocationOptions = {}
): UseBrowserLocation {
  if (Platform.OS === "web") {
    // Use the browser geolocation
    return useBrowserLocation(opts);
  }
  // Native: lazy import to avoid web bundling issues
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const useNative = require("./useNativeLocation").default;
  return useNative(opts);
}
