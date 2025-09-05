// components/Maps.types.ts
export type LatLng = { lat: number; lng: number };

export type MarkerItem = {
  id: string | number;
  position: LatLng;
  title?: string;
  description?: string;
};

export type PolylineItem = {
  id: string | number;
  path: LatLng[];
};

export type GeofenceItem = {
  id: string | number;
  center: LatLng;
  radiusMeters: number;
};

export type MapsProps = {
  center: LatLng;
  zoom?: number;                 // web only; ignored on native
  markers?: MarkerItem[];
  polylines?: PolylineItem[];
  geofences?: GeofenceItem[];
  onMarkerPress?: (marker: MarkerItem) => void;
  googleMapsApiKey?: string;     // web only
  style?: any;                   // container style
};
