import axios from "axios";
import { clearAuth, loadAuth } from "../utils/storage";

const createClient = (baseURL) => {
  const client = axios.create({ baseURL, timeout: 8000 });

  client.interceptors.request.use((config) => {
    const auth = loadAuth();
    if (auth?.token) {
      config.headers.Authorization = `Bearer ${auth.token}`;
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        clearAuth();
      }
      return Promise.reject(error);
    }
  );

  return client;
};

export const authApi = createClient(import.meta.env.VITE_AUTH_SERVICE_URL);
export const ticketApi = createClient(import.meta.env.VITE_TICKET_SERVICE_URL);
export const supportApi = createClient(import.meta.env.VITE_SUPPORT_SERVICE_URL);
export const notificationApi = createClient(import.meta.env.VITE_NOTIFICATION_SERVICE_URL);
export const reportingApi = createClient(import.meta.env.VITE_REPORTING_SERVICE_URL);

export const parseApiError = (error) => {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Request failed"
  );
};
