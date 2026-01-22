import axios from "axios";
import NProgress from "nprogress";

// Configure NProgress
NProgress.configure({
  showSpinner: false,
  minimum: 0.1,
  easing: "ease",
  speed: 500,
  trickleSpeed: 200,
});

// Create axios instance with default config
const api = axios.create({
  baseURL: "http://localhost:5000/scholar-api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Start NProgress
api.interceptors.request.use(
  (config) => {
    NProgress.start();
    return config;
  },
  (error) => {
    NProgress.done();
    return Promise.reject(error);
  }
);

// Response interceptor - Stop NProgress
api.interceptors.response.use(
  (response) => {
    NProgress.done();
    return response;
  },
  async (error) => {
    NProgress.done();

    // Handle token refresh on 401
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;

      try {
        const response = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        if (response.data.success) {
          // Retry original request with new token
          return api.request(error.config);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;

