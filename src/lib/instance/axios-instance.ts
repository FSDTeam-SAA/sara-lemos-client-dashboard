// axios-instance.ts

import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { getSession } from "next-auth/react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  // Let axios handle Content-Type automatically based on the request body
});

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      if (!config.headers) return config;

      // 1) Handle token
      const session = await getSession();
      if (session && "accessToken" in session) {
        config.headers["Authorization"] = `Bearer ${session.accessToken}`;
      }

      // 2) Handle custom token
      if (config.headers["_customToken"]) {
        config.headers["Authorization"] =
          `Bearer ${config.headers["_customToken"]}`;
        delete config.headers["_customToken"];
      }
    } catch (error) {
      console.error("Axios Interceptor Error:", error);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default axiosInstance;
