import axios from "axios"
import Nprogress from "nprogress"
import "nprogress/nprogress.css"

export const api = axios.create({
  baseURL: "https://59d5rkf3-8000.inc1.devtunnels.ms",
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  Nprogress.start();
  return config;
});

api.interceptors.response.use(
  (response) => {
    Nprogress.done();
    return response;
  },
  (error) => {
    Nprogress.done();
    return Promise.reject(error);
  }
);

export default api;