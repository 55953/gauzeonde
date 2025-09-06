import { useCallback, useEffect, useRef, useState } from "react";
import * as Location from "expo-location";

type GeoPoint = { lat: number; lng: number };
type Options = { enableHighAccuracy?: boolean; timeout?: number; maximumAge?: number; watch?: boolean };

export default function useNativeLocation(opts: Options = {}) {
  const { watch = false } = opts;
  const [location, setLocation] = useState<GeoPoint | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const watchSub = useRef<Location.LocationSubscription | null>(null);
  const cancelled = useRef(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Permission to access location was denied");
        return;
      }
      const pos = await Location.getCurrentPositionAsync({});
      setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    } catch (e: any) {
      if (!cancelled.current) setError(e?.message ?? "Location error");
    } finally {
      if (!cancelled.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    cancelled.current = false;
    refresh();
    if (watch) {
      Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 2000, distanceInterval: 5 },
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
      ).then((sub) => { watchSub.current = sub; });
    }
    return () => {
      cancelled.current = true;
      watchSub.current?.remove();
      watchSub.current = null;
    };
  }, [watch, refresh]);

  return { location, loading, error, refresh, stopWatch: () => watchSub.current?.remove() };
}
