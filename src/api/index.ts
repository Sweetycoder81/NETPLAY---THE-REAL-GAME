import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const IPV4_FALLBACK_BASE_URL = API_BASE_URL.replace('://localhost', '://127.0.0.1');

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Retry once with IPv4 localhost to avoid Windows resolving localhost to ::1
    // which can fail if the backend only listens on IPv4.
    const config = error?.config as any;
    const isNetworkError = !error?.response;
    const canRetry = Boolean(config) && !config.__ipv4Retry;
    const usesLocalhost = typeof config?.baseURL === 'string' && config.baseURL.includes('://localhost');
    if (isNetworkError && canRetry && usesLocalhost) {
      config.__ipv4Retry = true;
      config.baseURL = IPV4_FALLBACK_BASE_URL;
      return api.request(config);
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  
  signup: (userData: { name: string; email: string; password: string }) =>
    api.post('/auth/signup', userData),
  
  me: () => api.get('/auth/me'),
};

export const courtsAPI = {
  getAll: () => api.get('/courts'),
  getById: (id: string) => api.get(`/courts/${id}`),
};

export const bookingsAPI = {
  create: (bookingData: any) => api.post('/bookings', bookingData),
  getUserBookings: () => api.get('/bookings/my'),
  cancel: (id: string) => api.patch(`/bookings/${id}/cancel`),
};
