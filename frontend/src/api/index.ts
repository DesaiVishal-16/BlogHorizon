import axios, { AxiosError, AxiosRequestConfig } from "axios";

interface AxiosRequestConfigWithRetry extends AxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: `${process.env.API_URL}/api` || "http://localhost:5000/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfigWithRetry;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await api.post("/auth/refresh");
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token expired, please log in again");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
