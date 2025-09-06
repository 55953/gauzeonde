// utils/geocodeAddress.ts
export type LatLng = { lat: number; lng: number };

export async function geocodeAddress(
  address: string,
  language = "en"
): Promise<{ coords: LatLng; raw: any } | null> {
  const googleKey =
    (process.env.EXPO_PUBLIC_GOOGLE_GEOCODING_API_KEY as string) ||
    (process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY as string) ||
    "";

  // Prefer Google if key is available
  if (googleKey) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&language=${language}&key=${googleKey}`;
    const res = await fetch(url);
    const json = await res.json();
    if (json.status === "OK" && json.results?.length) {
      const r0 = json.results[0];
      return {
        coords: {
          lat: r0.geometry.location.lat,
          lng: r0.geometry.location.lng,
        },
        raw: r0,
      };
    }
  }

  // Fallback: OpenStreetMap Nominatim (free, rate-limited)
  const osmUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    address
  )}&format=jsonv2&addressdetails=1&limit=1&accept-language=${language}`;
  const osmRes = await fetch(osmUrl, {
    headers: { "User-Agent": "gauzeonde/1.0 (shipment-create)" },
  });
  const data = await osmRes.json();
  if (Array.isArray(data) && data.length > 0) {
    const r0 = data[0];
    return {
      coords: { lat: parseFloat(r0.lat), lng: parseFloat(r0.lon) },
      raw: r0,
    };
  }

  return null;
}
