export type Role = "driver" | "sender" | "admin";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  kyc_status?: string;
  rating?: number;
  [key: string]: any;
}

export interface Shipment {
  id: number;
  tracking_number: string;
  status: string;
  origin: string;
  destination: string;
  driver_id?: number;
  sender_id?: number;
  payout?: number;
  [key: string]: any;
}

export interface TokenPayload {
  user: User | null;
  role: Role;
  exp: number; // Expiration time
  iat: number; // Issued at time
  issuer: string; // Issuer of the token
  otherClaims: Record<string, any>;
}

export interface AuthState {
  token: string | null;
  authenticated: boolean | null;
}
export interface loginResponse {
  token: string;
}