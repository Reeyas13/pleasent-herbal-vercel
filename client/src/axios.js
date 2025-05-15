import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: true,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});
let store; 
export const injectStore = (_store) => {
  store = _store;
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You could add auth tokens here if needed
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    if (!error.response) {
      // Network or server error
      console.error('API Service is unavailable');
    }
    return Promise.reject(error);
  }
);

export default api;