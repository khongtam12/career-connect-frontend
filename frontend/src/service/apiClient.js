import axios from 'axios';

const baseURL = import.meta.env.DEV
  ? 'http://localhost:8082'
  : (import.meta.env.VITE_BACKEND_URL || 'http://localhost:8082');

const apiClient = axios.create({
  baseURL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});


export default apiClient;