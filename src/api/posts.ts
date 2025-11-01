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
// Fetch posts
export interface Media {
  url: string;
  type: "image" | "video";
  _id: string;
}

export interface Post {
  _id: string;
  content: string;
  media?: { url: string; type: string; _id: string }[];
  visibility: string;
  visibilityLog?: string;
  user: {
    _id: string;
    fullName: string;
    username: string;
    privacy: string;
  };
}

export const getPosts = async (): Promise<Post[]> => {
  try {
    const token = getToken;
    console.log("token", token);
    if (!token) throw new Error("Unauthorized");

    const res = await API.get("/post", {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data.posts; // expected: { posts: Post[] }
  } catch (err: any) {
    throw err.response?.data?.message || err.message || "Failed to fetch posts";
  }
};

// Add friend
export const addFriend = async (userId: string) => {
  console.log("user", userId);
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Unauthorized");

    const res = await API.post(
      "/contacts/add",
      { grantedTo: userId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data; // expected: { success: true }
  } catch (err: any) {
    console.log("err", err);
    throw err.response?.data?.message || err.message || "Failed to add friend";
  }
};
