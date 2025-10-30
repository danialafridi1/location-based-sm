import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api" // demo API
});

export const login = async (email: string, password: string) => {
  try {
    const res = await API.post(`/auth/login`, {
      email,
      password
    });
    return res.data;
  } catch (err: any) {
    throw err.response?.data?.error || "Login failed";
  }
};
