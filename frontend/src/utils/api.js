import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  demoLogin: () => apiClient.post('/auth/demo-login'),
};

export const simulationAPI = {
  getAll: () => apiClient.get('/simulations'),
  getById: (id) => apiClient.get(`/simulations/${id}`),
};

export const engagementAPI = {
  getByUser: (userId) => apiClient.get(`/engagement/user/${userId}`),
  create: (data) => apiClient.post('/engagement', data),
  getAnalytics: (userId) => apiClient.get(`/engagement/analytics/${userId}`),
};

export const recommendationAPI = {
  getForUser: (userId) => apiClient.get(`/recommendations/user/${userId}`),
};

export const userAPI = {
  getProfile: () => apiClient.get('/users/profile'),
  updateProfile: (data) => apiClient.put('/users/profile', data),
};

export const fingerprintAPI = {
  create: (data) => apiClient.post('/fingerprint', data),
  get: (studentId) => apiClient.get(`/fingerprint/${studentId}`),
};

export default apiClient;
