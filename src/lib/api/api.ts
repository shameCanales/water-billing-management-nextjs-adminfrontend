import axios from "axios";
import { getCookie, setCookie, deleteCookie } from "cookies-next";
import type { LoginCredentials, LoginResponse } from "@/types/auth";
import type { APIResponse, UserProfile } from "@/types/user";

// 1. Create the Axios Instance para sa interceptor
export const api = axios.create({
  baseURL: "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 2. Request Interceptor
// iattach niya and access token sa kada request sa backend
api.interceptors.request.use(
  (config) => {
    const token = getCookie("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Response Interceptor
// kunin niya 401 errors para itry irefresh ang token kung expired na ang token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 (Unauthorized) and if we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark as retried to prevent INFINITE LOOP na kasakit sa uyo kag delikado

      try {
        // A. Call the refresh endpoint
        // We assume your backend reads the Refresh Token from the HttpOnly cookie automatically
        const { data } = await axios.get<LoginResponse>(
          "http://localhost:3001/api/auth/admin/refresh",
          { withCredentials: true }
        );

        // B. If successful, we get a NEW Access Token
        const newAccessToken = data.accessToken;

        // C. Update the cookie(15 minutes life)
        setCookie("admin_token", newAccessToken, { maxAge: 15 * 60 });

        // D. Update the header of the failed to request with the new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // E. Retry the original request
        return api(originalRequest);
      } catch (err) {
        // F. If refresh fails (Refresh token expired/invalid), Force Logout
        console.error("Session expired. Please log in again. ");
        // We don't redirect here. Instead, we let the caller handle the error.
        // The caller (e.g., a component or a hook) can then dispatch a logout action and redirect.
        deleteCookie("admin_token"); // It's still good to clear the invalid token.
        // window.location.href = "/login"; // This is browser-specific and will crash on the server.
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export const loginUser = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    "/auth/admin/login",
    credentials
  );

  const accessToken = response.data.accessToken;
  setCookie("admin_token", accessToken, { maxAge: 15 * 60 });

  return response.data;
};

export const logoutUser = async (): Promise<void> => {
  try {
    await api.post("/auth/admin/logout");
  } finally {
    deleteCookie("admin_token");
  }
};

export const getProfileData = async () => {
  const response = await api.get<APIResponse<UserProfile>>("/shared/me");
  return response.data.data;
};
