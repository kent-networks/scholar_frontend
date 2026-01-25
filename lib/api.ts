import axios from "axios";
import NProgress from "nprogress";

// Store router instance for redirects
let routerInstance: any = null;

export function setRouter(router: any) {
  routerInstance = router;
}

// Configure NProgress
NProgress.configure({
  showSpinner: false,
  minimum: 0.1,
  easing: "ease",
  speed: 500,
  trickleSpeed: 200,
});
// console.log(process.env.NEXT_PUBLIC_API_URL, "🍆🍆🍆");
// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
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

    // Handle 401 - redirect to login (except for /auth/me which is used for auth check)
    if (error.response?.status === 401) {
      const url = error.config?.url || "";
      // Don't redirect if it's the auth check endpoint
      if (!url.includes("/auth/me") && typeof window !== "undefined") {
        // Only redirect if not already on login/signup pages
        const currentPath = window.location.pathname;
        if (!currentPath.includes("/login") && !currentPath.includes("/signup")) {
          // Use router if available, otherwise fallback to window.location
          if (routerInstance) {
            routerInstance.push("/login");
          } else {
            window.location.href = "/login";
          }
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;

