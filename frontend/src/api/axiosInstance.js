/**
 * src/api/axiosInstance.js
 *
 * Configured Axios instance for all API requests.
 * Sets base URL, default headers, timeout, and request/response interceptors.
 */

import axios from 'axios';
import toast from 'react-hot-toast';

// ─── Base URL from environment variable ────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

// ─── Create Axios Instance ─────────────────────────────────────────────────────
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: false,
});

// ─── Request Interceptor ───────────────────────────────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    // TODO: Attach auth token when authentication is implemented
    // const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ─── Response Interceptor ──────────────────────────────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => {
    // Return the response data directly
    return response;
  },
  (error) => {
    const { response } = error;

    // Network error (no response from server)
    if (!response) {
      toast.error('Network error. Please check your connection.');
      return Promise.reject(error);
    }

    const { status, data } = response;

    // Handle common HTTP error statuses
    switch (status) {
      case 401:
        // TODO: Handle token refresh or redirect to login
        toast.error('Unauthorized. Please log in.');
        break;
      case 403:
        toast.error('You do not have permission to perform this action.');
        break;
      case 404:
        // 404s are typically handled in component-level catch blocks
        break;
      case 422:
        // Validation errors — handled individually in forms
        break;
      case 429:
        toast.error('Too many requests. Please slow down.');
        break;
      case 500:
      case 502:
      case 503:
        toast.error('Server error. Please try again later.');
        break;
      default:
        if (status >= 500) {
          toast.error(data?.message || 'An unexpected error occurred.');
        }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
