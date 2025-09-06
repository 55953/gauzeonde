// hooks/useReverseGeocode.ts
import { useCallback, useState } from "react";

export type LatLng = { lat: number; lng: number };

export type ReverseGeoResult = {
  address: string;
  provider: "google" | "nominatim";
  raw: any;
};

type Options = {
  language?: string; // e.g. "en"
};

export default function useReverseGeocode(opts: Options = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [result, setResult]   = useState<ReverseGeoResult | null>(null);

  const apiKey =
    process.env.EXPO_PUBLIC_GOOGLE_GEOCODING_API_KEY ||
    process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || // if you share same key
    "";

  const reverse = useCallback(async (coords: LatLng) => {
    setLoading(true);
    setError(null);
    setResult(null);

    const lang = opts.language || "en";
    const { lat, lng } = coords;

    try {
      if (apiKey) {
        // Google Geocoding
        const url =
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&language=${lang}&key=${apiKey}`;
        const res = await fetch(url);
        const json = await res.json();
        if (json.status === "OK" && json.results?.length) {
          const formatted = json.results[0].formatted_address;
          const out: ReverseGeoResult = {
            address: formatted,
            provider: "google",
            raw: json,
          };
          setResult(out);
          return out;
        } else {
          // fall through to OSM
        }
      }

      // Fallback: OpenStreetMap Nominatim (usage policies apply)
      const osmUrl =
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&addressdetails=1&zoom=18&accept-language=${lang}`;
      const osmRes = await fetch(osmUrl, {
        headers: { "User-Agent": "gauzeonde/1.0 (reverse-geocoder)" },
      });
      const osmJson = await osmRes.json();
      const formatted = osmJson.display_name || "";
      const out: ReverseGeoResult = {
        address: formatted,
        provider: "nominatim",
        raw: osmJson,
      };
      setResult(out);
      return out;
    } catch (e: any) {
      setError(e?.message ?? "Reverse geocoding failed");
      throw e;
    } finally {
      setLoading(false);
    }
  }, [apiKey, opts.language]);

  return { loading, error, result, reverse };
}
