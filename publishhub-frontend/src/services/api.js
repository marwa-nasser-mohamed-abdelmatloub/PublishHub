import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {

    return response.data;
  },
  (error) => {

    if (error.response?.status === 401) {
      const token = localStorage.getItem("auth_token");
      const errorMessage = error.response?.data?.message || "";


      const noRedirectEndpoints = [
        "/auth/login",
        "/auth/register",
        "/auth/change-password",
      ];

      const isNoRedirectEndpoint = noRedirectEndpoints.some((endpoint) =>
        error.config?.url?.includes(endpoint),
      );

      const isTokenError =
        errorMessage.includes("token") || errorMessage.includes("session");

      if (token && !isNoRedirectEndpoint && isTokenError) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error.response?.data || error);
  },
);

export default api;
