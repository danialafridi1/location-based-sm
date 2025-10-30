import axios from "axios";

const API = axios.create({
  baseURL: "https://reqres.in/api" // demo API
});

export const login = async (email: string, password: string) => {
  try {
    const res = await API.post("http://16.24.214.92/api/auth/login", {
      email,
      password
    });
    return res.data;
  } catch (err: any) {
    throw err.response?.data?.error || "Login failed";
  }
};
