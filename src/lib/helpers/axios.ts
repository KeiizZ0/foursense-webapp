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

// ApiClient.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (
//       error.response?.status === 401 &&
//       !originalRequest._retry &&
//       !originalRequest.url?.includes("/auth/refresh")
//     ) {
//       originalRequest._retry = true;

//       try {
//         const refreshToken = await getCookie("rftkn");
//         if (!refreshToken) throw Error("refreshridakada");
//         const newToken = await refresh(refreshToken);

//         if (newToken) {
//           originalRequest.headers.Authorization = `Bearer ${newToken}`;
//           return ApiClient(originalRequest);
//         }
//       } catch (err) {
//         console.error("Refresh failed, logging out");
//         console.log("kena logout");
//         logout();
//         window.location.href = "/";
//       }
//     }

//     return Promise.reject(error);
//   },
// );
