import axios from "axios"
import Nprogress from "nprogress"
import "nprogress/nprogress.css"

export const api = axios.create({
  baseURL: "http://localhost:8000/",
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