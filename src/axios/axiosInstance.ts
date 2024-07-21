import axios from "axios";
import { API_URL } from "../utils/constants/constants";

const axiosInstance = axios.create({
  baseURL: API_URL,
});

const publicRoutes = [
  "/api/users",
  "/api/users/register",
  // tambahkan route lainnya di sini
];

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access_token");

    // Extract the pathname from the URL
    const pathname = new URL(config.url ?? "", API_URL).pathname;

    // Check if the request URL is not in the public routes
    const isPublicRoute = publicRoutes.includes(pathname);

    // Add Authorization header only for non-public routes
    if (accessToken && !isPublicRoute) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    console.error("Request Interceptor Error:", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const existingRefreshToken = localStorage.getItem("refresh_token");
      try {
        const response = await axios.post(`${API_URL}/api/users/auth/refresh`, {
          refresh_token: existingRefreshToken,
        });
        const { token, refreshToken } = response.data.data;
        localStorage.setItem("access_token", token);
        localStorage.setItem("refresh_token", refreshToken);
        axiosInstance.defaults.headers["Authorization"] = `Bearer ${token}`;
        originalRequest.headers["Authorization"] = `Bearer ${token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Refresh Token Error:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
