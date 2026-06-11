import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

// Inject access token automatically in all requests
API.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auto-refresh token on 401 response
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const res = await axios.post("http://127.0.0.1:8000/api/users/refresh/", {
            refresh: refreshToken,
          });
          const newAccessToken = res.data.access;
          localStorage.setItem("accessToken", newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return API(originalRequest);
        } catch (err) {
          // Refresh token has expired, log user out
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("currentUser");
          localStorage.setItem("isLoggedIn", "false");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default API;
