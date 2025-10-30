// src/api/user.ts
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api"
});

const getToken = localStorage.getItem("token");
console.log("getToken", getToken);
// Get current user info
export const getCurrentUser = async () => {
  try {
    const token = getToken;
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
