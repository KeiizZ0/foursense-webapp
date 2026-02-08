import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { getCookie } from "./cookies";
import { logout, refresh } from "./auth";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

if (!baseURL) {
  throw new Error(
    "NEXT_PUBLIC_API_URL is not defined. Please set it in your .env.local file.",
  );
}

export const ApiClient: AxiosInstance = axios.create({
  timeout: 10000,
  baseURL: baseURL,
  withCredentials: true,
});

ApiClient.interceptors.request.use(
  async (config) => {
    const accessToken = await getCookie("acctkn");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);
