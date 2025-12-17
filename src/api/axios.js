import axios from "axios";
import { baseUrl } from "../config";

export const tokenStorage = {
  get() {
    return localStorage.getItem("token");
  },
  set(token) {
    localStorage.setItem("token", token);
  },
  clear() {
    localStorage.removeItem("token");
  },
};

export const apiInstance = axios.create({
  baseURL: baseUrl,
  headers: { "Content-Type": "application/json" },
});

apiInstance.interceptors.request.use(
  (config) => {
    const tokenWithoutParse = tokenStorage.get("token");
    const token = JSON.parse(tokenWithoutParse);

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      tokenStorage.clear();
      // window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);
