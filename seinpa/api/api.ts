import axios from "axios";
import storage from "@utils/storage"; // AsyncStorage/localStorage wrapper
import { Shipment, User } from "../types";

// CHANGE THIS to your deployed API URL
export const API_BASE = process.env.EXPO_PUBLIC_API_BASE; // e.g. Docker host or production URL

// const api: AxiosInstance = axios.create({
//   baseURL: API_BASE,
//   headers: { 
//     "Access-Control-Allow-Origin": "*", 
//     "Content-Type": "application/json" ,
//     },
//   timeout: 15000,
// });

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 5000,
});

// Attach token automatically from storage
api.interceptors.request.use(
  async (config) => {
    const token = await storage.getItem("token");
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally if you want (optional)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or unauthorized
      // Optionally clear storage and redirect to login
      await storage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export default api;

// Inject JWT token into all requests, if available
// api.interceptors.request.use(
//   (config: AxiosRequestConfig) => {
//     const session = useSession();
//     const token = session?.token;
//     console.log("Setting auth token:", token);
//     if (token && config.headers) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// --- Auth Token Helper ---
// export function setAuthToken(token) {
//   console.log("Setting auth token:", token);
//   if (token) {
//     // Set the Authorization header for all requests
//     api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

//   } else {
//     delete api.defaults.headers.common['Authorization'];
//   }
// }
// Keep token in memory (best for RN; you can hydrate from storage in your AuthContext)
// let authToken: string | null = null;

// export async function setAuthToken(token: string | null) {
//   if (token) await (api.defaults.headers.common["Authorization"] = `Bearer ${token}`);
//   else await (delete api.defaults.headers.common["Authorization"]);
// }
// --- AUTH ENDPOINTS ---
export const AuthApi = {
  login: (email: string, password: string) =>
    api.post<{ token: string | null }>("/auth/login", { email, password }),
  register: (user: Partial<User>) =>
    api.post<{ user: User }>("/auth/register", user),
  activate: (code: string) =>
    api.get(`/auth/activate/${code}`),
  // activate: (email: string, code: string) =>
  //   api.post("/auth/activate", { email, code }),
  forgotPassword: (email: string) =>
    api.post('/auth/password/email', { email }),
  resetPassword: (payload: { email: string; password: string; token: string }) =>
    api.post('/auth/password/reset', payload),
  me: () => api.get("/users/me"),
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
  getAllDrivers: (filters: Partial<{ online: boolean; status: string; vehicle_type: string; page: number; per_page: number }>) =>
    api.get<User[]>("/users", { params: { role: "driver", ...filters } }),
  filter: (param?: Record<string, any>) =>
    api.get("/users", { params: { ...param } }),
  listUsers: (params?: {
    role?: string;
    status?: string;
    online?: boolean;
    search?: string;
    page?: number;
    per_page?: number;
  }) => api.get("/users", { params }),

  getById: (id: number) => api.get(`/users/${id}`),

  updateById: (id: number, data: Partial<{
    name: string;
    email: string;
    phone: string;
    role: "driver" | "sender" | "admin";
    status: "active" | "pending" | "suspended";
    online: boolean;
    vehicle_type: string;
    max_weight_kg: number;
    max_volume_cuft: number;
    max_length_cm: number;
    max_width_cm: number;
    max_height_cm: number;
  }>) => api.put(`/users/${id}`, data)
};

// --- POINT OF ALL USER FILTERS ---
// // list drivers with filters
// const res = await UserApi.getAllDrivers({
//   online: true,
//   status: "active",
//   vehicle_type: "semi",
//   page: 1,
//   per_page: 50,
// });

// // OR the generic /users filter call:
// const res2 = await api.get("/users", { params: { role: "driver", online: true }});

// --- DRIVER ENDPOINTS ---
export const DriverApi = {

  me: () => api.get("/drivers/me"),
  setOnline: (online: boolean) =>
    api.post("/drivers/online", { online }),
  getOnline: () =>
    api.get("/drivers/online"),
  updateCapacity: (payload: Partial<{
    max_weight_kg: number;
    max_volume_cuft: number;
    max_length_cm: number;
    max_width_cm: number;
    max_height_cm: number;
    vehicle_type: string;
  }>) => api.put("/drivers/capacity", payload),
  getShipments: (driverId: number) =>
    api.get<Shipment[]>(`/drivers/${driverId}/shipments`),
  getLocation: (driverId: number) =>
    api.get<{ lat: number; lng: number }>(`/drivers/${driverId}/location`),
  listOpenShipments: () => api.get("/drivers/shipments/open"),

  myShipments: () => api.get("/drivers/shipments/my"),

  acceptShipment: (shipmentId: number) =>
    api.post(`/drivers/shipments/${shipmentId}/accept`, {}),

  updateLocation: (payload: {
    lat: number;
    lng: number;
    speed?: number;
    heading?: number;
  }) => api.post("/drivers/location", payload),
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
  updateStatus: (shipmentId: number, status: string) => api.patch(`/shipments/${shipmentId}/status`, { status }),
  delete: (id: number) => api.delete(`/shipments/${id}`),
  statusHistory: (id: number) => api.get(`/shipments/${id}/history`),
  transfer: (id: number, toDriverId: number, notes: string) => api.post(`/shipments/${id}/transfer`, { to_driver_id: toDriverId, notes }),
  payments: (id: number) => api.get(`/shipments/${id}/payments`),
  getLocations: (shipmentId: number) => api.get(`/shipments/${shipmentId}/locations`),
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

