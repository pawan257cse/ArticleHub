import axios from "axios";

const apiBaseUrl =
  (import.meta.env.VITE_API_URL || "https://articlehub-acmt.onrender.com/api").replace(/\/$/, "");

const api = axios.create({
  baseURL: apiBaseUrl
});

api.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (
      err.response?.status === 401 &&
      !err.config?.url?.includes("/auth/login")
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(err);
  }
);

export default api;