import axios from 'axios';
import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: false,
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;

    if (!response) {
      toast.error('Network error. Please check your connection.');
      return Promise.reject(error);
    }

    const { status, data } = response;

    switch (status) {
      case 401:
        toast.error('Unauthorized. Please log in.');
        break;
      case 403:
        toast.error('You do not have permission to perform this action.');
        break;
      case 404:
        break;
      case 422:
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
