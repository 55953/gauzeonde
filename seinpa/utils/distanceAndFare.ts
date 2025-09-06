// utils/distanceAndFare.ts
export type LatLng = { lat: number; lng: number };

/** Haversine (km) */
export function haversineKm(a: LatLng, b: LatLng): number {
  const R = 6371; // km
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const la1 = (a.lat * Math.PI) / 180;
  const la2 = (b.lat * Math.PI) / 180;

  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return R * c;
}

/** Simple pricing formula (customize as needed) */
export function estimateFareUSD(params: {
  distanceKm: number;
  weightKg?: number | null;
  baseFare?: number;       // default 8.00
  perKm?: number;          // default 1.25
  weightSurchargePerKg?: number; // default 0.15
  minimum?: number;        // default 10.00
}) {
  const {
    distanceKm,
    weightKg = 0,
    baseFare = 8,
    perKm = 1.25,
    weightSurchargePerKg = 0.15,
    minimum = 10,
  } = params;

  const fare =
    baseFare + distanceKm * perKm + Math.max(0, weightKg) * weightSurchargePerKg;

  return Math.max(minimum, Number(fare.toFixed(2)));
}
