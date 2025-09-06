// hooks/useBrowserLocation.ts
import { useCallback, useEffect, useRef, useState } from "react";

export type GeoPoint = { lat: number; lng: number };

export type UseBrowserLocationOptions = {
  enableHighAccuracy?: boolean;
  timeout?: number;       // ms, default 8000
  maximumAge?: number;    // ms, default 15000 (allow a slightly stale cached fix)
  // optional: continuous watch
  watch?: boolean;        // default false
};

export type UseBrowserLocation = {
  location: GeoPoint | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  stopWatch: () => void;
};

export default function useBrowserLocation(
  opts: UseBrowserLocationOptions = {}
): UseBrowserLocation {
  const {
    enableHighAccuracy = true,
    timeout = 8000,
    maximumAge = 15000,
    watch = false,
  } = opts;

  const [location, setLocation] = useState<GeoPoint | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const cancelledRef = useRef(false);

  const handleSuccess = useCallback((pos: GeolocationPosition) => {
    if (cancelledRef.current) return;
    const { latitude, longitude } = pos.coords;
    setLocation({ lat: latitude, lng: longitude });
    setError(null);
  }, []);

  const handleError = useCallback((err: GeolocationPositionError) => {
    if (cancelledRef.current) return;
    setError(err.message || "Failed to get your location");
  }, []);

  const refresh = useCallback(async () => {
    if (!("geolocation" in navigator)) {
      setError("Geolocation not supported in this browser");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await new Promise<void>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            handleSuccess(pos);
            resolve();
          },
          (err) => {
            handleError(err);
            reject(err);
          },
          { enableHighAccuracy, timeout, maximumAge }
        );
      });
    } finally {
      if (!cancelledRef.current) setLoading(false);
    }
  }, [enableHighAccuracy, timeout, maximumAge, handleError, handleSuccess]);

  const stopWatch = useCallback(() => {
    if (watchIdRef.current !== null && "geolocation" in navigator) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  // initial fetch + optional watch
  useEffect(() => {
    cancelledRef.current = false;

    refresh();

    if (watch && "geolocation" in navigator) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        handleSuccess,
        handleError,
        { enableHighAccuracy, maximumAge }
      );
    }

    return () => {
      cancelledRef.current = true;
      stopWatch();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  return { location, loading, error, refresh, stopWatch };
}
