import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { getToken } from "../auth/auth";
import { Shipment, User } from "../types";

// CHANGE THIS to your deployed API URL
export const API_BASE = process.env.EXPO_PUBLIC_API_BASE; // e.g. Docker host or production URL

const api: AxiosInstance = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 5000,
});

// const api = axios.create({
//   baseURL: API_BASE,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// Inject JWT token into all requests, if available
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Auth Token Helper ---
// export function setAuthToken(token) {
//   if (token) {
//     api.defaults.headers['Authorization'] = `Bearer ${token}`;
//     localStorage.setItem('token', token);
//   } else {
//     delete api.defaults.headers['Authorization'];
//     localStorage.removeItem('token');
//   }
// }


// --- AUTH ENDPOINTS ---
export const AuthApi = {
  login: (email: string, password: string) =>
    api.post<{ token: string }>("/auth/login", { email, password }),
  register: (user: Partial<User>) =>
    api.post<{ user: User }>("/auth/register", user),
  activate: (code: string) =>
    api.post("/auth/activate", { code }),
  forgotPassword: (email: string) =>
    api.post('/auth/password/email', { email }),
  resetPassword: (payload: { email: string; password: string; token: string }) =>
    api.post('/auth/password/reset', payload),
};

// --- USER ENDPOINTS ---
export const UserApi = {
  getProfile: () => api.get<User>("/users/me"),
  updateProfile: (user: Partial<User>) =>
    api.put<User>("/users/me", user),
  getAll: () => api.get<User[]>("/users"),
  me: () => api.get<User>('/users/me'),
  get: (id: number) => api.get<User>(`/users/${id}`),
  update: (id: number, data: Partial<User>) => api.put(`/users/${id}`, data),
  delete: (id: number) => api.delete(`/users/${id}`),
  uploadDocument: (userId: number, formData: FormData) =>
    api.post(`/users/${userId}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  getDocuments: (userId: number) => api.get(`/users/${userId}/documents`),
  deleteDocument: (userId: number, docId: number) =>
    api.delete(`/users/${userId}/documents/${docId}`),
};

// --- DRIVER ENDPOINTS ---
export const DriverApi = {

  getShipments: (driverId: number) =>
    api.get<Shipment[]>(`/drivers/${driverId}/shipments`),
  getLocation: (driverId: number) =>
    api.get<{ lat: number; lng: number }>(`/drivers/${driverId}/location`),
  // Add more as needed
};

// --- SHIPMENT ENDPOINTS ---
export const ShipmentApi = {
  create: (data: Partial<Shipment>) => api.post<Shipment>("/shipments", data),
  getAll: () => api.get<Shipment[]>("/shipments"),
  getById: (shipmentId: number) => api.get<Shipment>(`/shipments/${shipmentId}`),
  track: (trackingNumber: string) => api.get<Shipment>(`/shipments/track/${trackingNumber}`),
  get: (id: number) => api.get(`/shipments/${id}`),
  update: (id: number, data: Partial<Shipment>) => api.put(`/shipments/${id}`, data),
  delete: (id: number) => api.delete(`/shipments/${id}`),
  statusHistory: (id: number) => api.get(`/shipments/${id}/history`),
  transfer: (id: number, toDriverId: number, notes: string) => api.post(`/shipments/${id}/transfer`, { to_driver_id: toDriverId, notes }),
  payments: (id: number) => api.get(`/shipments/${id}/payments`),
};

// --- SENDER ENDPOINTS ---
export const SenderApi = {
  getShipments: (senderId: number) =>
    api.get<Shipment[]>(`/senders/${senderId}/shipments`),
};

// --- ADMIN ENDPOINTS ---
export const AdminApi = {
  getAllUsers: () => api.get<User[]>("/users"),
  getAllShipments: () => api.get<Shipment[]>("/shipments"),
  // Add more admin methods as needed
};

export default api;
