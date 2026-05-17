import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
if (!configuredApiUrl && !import.meta.env.DEV) {
  throw new Error('VITE_API_URL is required in production.');
}

const apiBaseUrl = (configuredApiUrl || 'http://localhost:4000/api').replace(/\/+$/, '');

const client = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearUser();
    }
    return Promise.reject(error);
  },
);

export default client;
