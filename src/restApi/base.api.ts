import { useAuthStore } from "@/store/auth.store";
import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL

if (!baseURL) {
  throw new Error("Invalid ENV")
}

export const ApiClient: AxiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 10000,
});

ApiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  (error) => Promise.reject(error),
);

ApiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        const newToken = await useAuthStore.getState().refresh();

        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return ApiClient(originalRequest);
        }
      } catch (err) {
        console.error("Refresh failed, logging out");
        useAuthStore.getState().logout();
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  },
);
