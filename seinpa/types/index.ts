export type Role = "driver" | "sender" | "admin";

export interface User {
  id: number;
  name: string;
  profileImageUrl: string;
  email: string;
  role: Role;
  phone?: string;
  kyc_status?: string;
  rating?: number;
  [key: string]: any;
  vehicle_type: string;
  max_weight_kg: number;
  max_volume_cuft: number;
  max_length_cm: number;
  max_width_cm: number;
  max_height_cm: number;
}

export interface Drivers{
  [key: number]: User;
  licenseNumber: string;
  vehicleType: string;
  vehiclePlate: string;
  isOnline: boolean;
  profile_image_url: string;
  currentLat: number;
  currentLng: number;
  totalDeliveries: number;
  rating: number;
}

export interface Senders {
  [key: number]: User;
  companyName: string | null;
  address: string;
  phone: string;
  email: string;
}

export interface Admins {
  [key: number]: User;
  permissions: string[];
  companyName: string | null;
}


export interface Shipment {
  id: number;
  tracking_number: string;
  status: string;
  pickupAddress: string;
  pickupLat: number;
  pickupLng: number;
  dropoffAddress: string;
  dropoffLat: number;
  dropoffLng: number;
  requestedTime: string;
  pickupTime: string;
  deliveryTime: string;
  driver_id?: number;
  sender_id?: number;
  recipient_name: string;
  recipient_phone: string;
  weight_kg?: number;
  volume_cuft?: number;
  length_cm?: number;
  width_cm?: number;
  height_cm?: number;
  payout?: number;
  discount?: number;
  payment_status: string;
  [key: string]: any;
}

export interface DeliveryTracking {
  shipmentId: number;
  status: string;
  location: {
    lat: number;
    lng: number;
  };
  timestamp: string;
  pickedUp: boolean;
  droppedOff: boolean;
  exchanged: boolean;
}

export interface TokenPayload {
  aud: string;
  exp: number; // Expiration time
  iat: number; // Issued at time
  user: User;
  issuer: string; // Issuer of the token
  otherClaims: Record<string, any>;
  iss: string;
}

export interface Session {
  user: User | null;
  token: string | null;
}

export interface shipmentStatus{
  pending: boolean,
  assigned: boolean,
  picked_up: boolean,
  in_transit: boolean,
  delivered: boolean,
  cancelled: boolean
}

export interface MarkerData {
    latitude: number;
    longitude: number;
    id: number;
    title: string;
    profile_image_url: string;
    car_image_url: string;
    car_seats: number;
    rating: number;
    first_name: string;
    last_name: string;
    time?: number;
    price?: string;
}

export interface GoogleInputProps {
  icon?: string;
  initialLocation?: string;
  containerStyle?: string;
  textInputBackgroundColor?: string;
  handlePress: ({
                    latitude,
                    longitude,
                    address,
                }: {
      latitude: number;
      longitude: number;
      address: string;
  }) => void;
}