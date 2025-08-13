/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/form-data",
    Accept: "application/json",
  },
});

export const api2 = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const attachToken = (config: any) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

api.interceptors.request.use(attachToken, (error) => Promise.reject(error));
api2.interceptors.request.use(attachToken, (error) => Promise.reject(error));
