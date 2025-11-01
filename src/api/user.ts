// src/api/user.ts
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api"
});

// ✅ Automatically attach token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("⚠️ No token found in localStorage");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor (optional: handle 401 globally)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized! Redirect to login if needed.");
      // Optionally: redirect to login page
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
// Get current user info
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Unauthorized");

    const res = await API.get("/user/me", {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("res.data.data", res.data); // <--- should show user
    return res.data; // assuming API returns { message: "...", data: { ...user } }
  } catch (err: any) {
    throw new Error(
      err.response?.data?.message || err.message || "Failed to fetch user"
    );
  }
};
