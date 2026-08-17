import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getSession, signOut } from "next-auth/react";

// Extend the Axios request config type to accept our custom circuit-breaker flag
type RetryConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const isTokenExpired = (expiresAt?: number | null) =>
  typeof expiresAt === "number" && expiresAt <= Date.now();

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// 1. The MAIN instance used by your app components
const api = axios.create({
  baseURL: API_BASE_URL,
});

// 2. The REFRESH instance (Clean instance with NO interceptors to prevent loops)
const refreshClient = axios.create({
  baseURL: API_BASE_URL,
});

// Lock mechanism to prevent multiple simultaneous requests from triggering multiple refreshes
let refreshInFlight: Promise<any> | null = null;

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const session = await getSession();
      const accessTokenExpires = (
        session as { accessTokenExpires?: number } | null
      )?.accessTokenExpires;

      // Fail-fast if the token is dead before sending the request
      if (isTokenExpired(accessTokenExpires)) {
        await signOut({ callbackUrl: "/auth/login" });
        return Promise.reject(new Error("Session expired"));
      }

      const token = (session as any)?.accessToken;
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.error("Error in request interceptor:", err);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor to intercept 401 errors, refresh sessions, and retry seamlessly
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const originalRequest = error.config as RetryConfig | undefined;

    // If it's not a 401, extract the API's error message and re-throw with it
    if (status !== 401 || !originalRequest) {
      const apiMessage =
        (error.response?.data as any)?.message ||
        (error.response?.data as any)?.error ||
        error.message;
      const enrichedError = new Error(apiMessage) as any;
      enrichedError.status = status;
      enrichedError.response = error.response;
      enrichedError.originalError = error;
      return Promise.reject(enrichedError);
    }

    // CIRCUIT BREAKER: If this request has already been retried once and still returns a 401, drop out
    if (originalRequest._retry) {
      try {
        await signOut({ callbackUrl: "/auth/login" });
      } catch (e) {}
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // If there isn't a session refresh already running, kick one off
    if (!refreshInFlight) {
      // Using your exact absolute NextAuth session endpoint to bypass baseURL mismatches
      refreshInFlight = refreshClient.get("http://localhost:3000/api/auth/session") 
        .finally(() => {
          refreshInFlight = null; // Clear the lock when done
        });
    }

    try {
      // Await the single shared session refresh request
      await refreshInFlight;

      // Get the freshly updated session data from NextAuth
      const nextSession = await getSession();
      const newToken = (nextSession as any)?.accessToken;

      if (newToken && originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
      }

      // Re-run the user's original request using the updated authorization headers
      return api(originalRequest);
    } catch (refreshError) {
      // If NextAuth session refresh fails, the user session is dead. Log out.
      try {
        await signOut({ callbackUrl: "/auth/login" });
      } catch (e) {}
      return Promise.reject(refreshError);
    }
  },
);

export default api;