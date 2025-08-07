import axios from 'axios';
import { API_BASE } from '../config';

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Auth Token Helper ---
export function setAuthToken(token) {
  if (token) {
    api.defaults.headers['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete api.defaults.headers['Authorization'];
    localStorage.removeItem('token');
  }
}

// --- AUTH ENDPOINTS ---
export const Auth = {
  login: (email, password) =>
    api.post('/auth/login', { email, password }),

  register: (user) =>
    api.post('/auth/register', user),

  activate: (code) =>
    api.post(`/auth/activate`, { code }),

  forgotPassword: (email) =>
    api.post('/auth/password/email', { email }),

  resetPassword: (payload) =>
    api.post('/auth/password/reset', payload),
};

// --- USER ENDPOINTS ---
export const Users = {
  me: () => api.get('/users/me'),
  get: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  uploadDocument: (userId, formData) =>
    api.post(`/users/${userId}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  getDocuments: (userId) => api.get(`/users/${userId}/documents`),
  deleteDocument: (userId, docId) =>
    api.delete(`/users/${userId}/documents/${docId}`),
};

// --- SHIPMENTS ---
export const Shipments = {
  getAll: () => api.get('/shipments'),
  get: (id) => api.get(`/shipments/${id}`),
  create: (payload) => api.post('/shipments', payload),
  update: (id, data) => api.put(`/shipments/${id}`, data),
  delete: (id) => api.delete(`/shipments/${id}`),
  track: (trackingNumber) => api.get(`/shipments/track/${trackingNumber}`),
  statusHistory: (id) => api.get(`/shipments/${id}/history`),
  transfer: (id, toDriverId, notes) =>
    api.post(`/shipments/${id}/transfer`, { to_driver_id: toDriverId, notes }),
  payments: (id) => api.get(`/shipments/${id}/payments`),
  // ...other endpoints
};

// --- DRIVERS ---
export const Drivers = {
  getAll: () => api.get('/drivers'),
  getOnline: () => api.get('/drivers/online'),
  get: (id) => api.get(`/drivers/${id}`),
  update: (id, data) => api.put(`/drivers/${id}`, data),
  setStatus: (id, status) =>
    api.put(`/drivers/${id}/status`, { status }),
  updateLocation: (id, lat, lng) =>
    api.post(`/drivers/${id}/location`, { lat, lng }),
  locationsHistory: (id) => api.get(`/drivers/${id}/locations`),
  batchLocations: () => api.get('/drivers/locations/batch'),
};

// --- ITINERARIES ---
export const Itineraries = {
  getAll: () => api.get('/itineraries'),
  get: (id) => api.get(`/itineraries/${id}`),
  create: (payload) => api.post('/itineraries', payload),
  update: (id, data) => api.put(`/itineraries/${id}`, data),
  delete: (id) => api.delete(`/itineraries/${id}`),
};

// --- PAYMENTS ---
export const Payments = {
  getAll: () => api.get('/payments'),
  get: (id) => api.get(`/payments/${id}`),
  create: (payload) => api.post('/payments', payload),
  update: (id, data) => api.put(`/payments/${id}`, data),
};

// --- NOTIFICATIONS ---
export const Notifications = {
  getAll: () => api.get('/notifications'),
  get: (id) => api.get(`/notifications/${id}`),
  create: (payload) => api.post('/notifications', payload),
  markRead: (id) => api.put(`/notifications/${id}/read`),
};

// --- DASHBOARD / ADMIN ---
export const Dashboard = {
  overview: () => api.get('/dashboard/overview'),
  shipments: () => api.get('/dashboard/shipments'),
  drivers: () => api.get('/dashboard/drivers'),
  activity: () => api.get('/dashboard/activity'),
};

// --- SYSTEM / UTILS ---
export const System = {
  health: () => api.get('/health'),
  status: () => api.get('/status'),
};

// --- Helper for attaching auth token from localStorage on load ---
export function initAuthFromStorage() {
  const token = localStorage.getItem('token');
  if (token) {
    api.defaults.headers['Authorization'] = `Bearer ${token}`;
  }
}

// Call this on app init
initAuthFromStorage();

export default api;
