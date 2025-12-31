import axios from "axios";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import type { LoginCredentials, LoginResponse } from "@/types/auth";
import type { APIResponse, UserProfile } from "@/types/user";

// =================================================================
// 1. AXIOS INSTANCE
// =================================================================
export const api = axios.create({
  baseURL: "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
  // IMPORTANT: This allows cookies (HttpOnly Refresh Token) to be sent/received.
  // Without this, the browser will block the backend from setting the 'jwt' cookie.
  withCredentials: true,
});

// =================================================================
// 2. REQUEST INTERCEPTOR (Outgoing)
// =================================================================
// Purpose: Attaches the Access Token to every request automatically.
api.interceptors.request.use(
  (config) => {
    // 🛑 CRITICAL CHECK:
    // If the header is ALREADY set (e.g., by our retry logic below), DO NOT overwrite it.
    // Overwriting it with the old cookie caused the "Infinite Loop" bug.
    if (config.headers?.Authorization) {
      return config;
    }

    const token = getCookie("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// =================================================================
// 3. RESPONSE INTERCEPTOR (Incoming)
// =================================================================
// Purpose: Handles 401 errors by attempting to refresh the token silently.
//
api.interceptors.response.use(
  (response) => response, // If success, just return response.
  async (error) => {
    const originalRequest = error.config;

    // IF: Error is 401 (Unauthorized) AND we haven't tried refreshing yet...
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark as retried to prevent INFINITE LOOPS.

      try {
        // A. Call the Refresh Endpoint
        // Note: We send an empty body {} because 'withCredentials' must be the 3rd argument.
        // The backend reads the Refresh Token automatically from the HttpOnly cookie.
        const { data } = await axios.post<LoginResponse>(
          "http://localhost:3001/api/auth/admin/refresh",
          {},
          { withCredentials: true }
        );

        const newAccessToken = data.accessToken;

        // B. Update the Cookie
        // IMPORTANT: Must include { path: "/" } so the cookie is visible on all pages.
        // Without this, the cookie might get stuck on a sub-page (like /dashboard).
        setCookie("admin_token", newAccessToken, {
          maxAge: 15 * 60, // 15 minutes
          path: "/",
        });

        // C. Update the Failed Request's Header
        // We manually force the new token here so the Request Interceptor (above) sees it.
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // D. Retry the Original Request
        return api(originalRequest);
      } catch (err) {
        // E. If Refresh Fails (Token expired or invalid)...
        console.error("Session expired. Logging out...");

        // Clean up everything. Use path: '/' to ensure we delete the global cookie.
        deleteCookie("admin_token", { path: "/" });

        // We reject the error so the UI (React Query) knows the request failed.
        // The UI should handle the redirect to /login.
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

// =================================================================
// 4. AUTHENTICATION HELPERS
// =================================================================

export const loginUser = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    "/auth/admin/login",
    credentials
  );

  // Set cookie immediately upon login
  const accessToken = response.data.accessToken;
  setCookie("admin_token", accessToken, { maxAge: 15 * 60, path: "/" });

  return response.data;
};

export const logoutUser = async (): Promise<void> => {
  try {
    // Notify backend to clear the HttpOnly Refresh Token
    await api.post("/auth/admin/logout");
  } finally {
    // Always clear the frontend Access Token, even if backend fails
    deleteCookie("admin_token", { path: "/" });
  }
};

export const getProfileData = async () => {
  const response = await api.get<APIResponse<UserProfile>>("/shared/me");
  return response.data.data;
};
