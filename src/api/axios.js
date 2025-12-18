import axios from "axios";
import { baseUrl } from "../config";

export const tokenStorage = {
  getAccess() {
    return localStorage.getItem("accessToken");
  },
  getRefresh() {
    return localStorage.getItem("refreshToken");
  },
  setTokens(accessToken, refreshToken) {
    if (accessToken) localStorage.setItem("accessToken", accessToken);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
  },
  clear() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
};

export const apiInstance = axios.create({
  baseURL: baseUrl,
  headers: { "Content-Type": "application/json" },
});

const refreshInstance = axios.create({
  baseURL: baseUrl,
  headers: { "Content-Type": "application/json" },
});

apiInstance.interceptors.request.use(
  (config) => {
    const accessToken = tokenStorage.getAccess();

    if (accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

const refreshTokenRequest = async () => {
  const refreshToken = tokenStorage.getRefresh();

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const { data } = await refreshInstance.post("/api/auth/token/refresh/", {
    refresh: refreshToken,
  });

  tokenStorage.setTokens(data.access, data.refresh);

  return data.access;
};

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  failedQueue = [];
};

apiInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (err?.response?.status === 401 && !originalRequest?._retry) {
      if (originalRequest?.url?.includes("/api/auth/token/refresh/")) {
        tokenStorage.clear();
        return Promise.reject(err);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(apiInstance(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await refreshTokenRequest();
        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiInstance(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        tokenStorage.clear();
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);
