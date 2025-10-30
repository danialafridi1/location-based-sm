import axios from "axios";

const API = axios.create({
  baseURL: "http://16.24.214.92/api" // Replace with your backend URL
});

// Token helper
const getToken = localStorage.getItem("token");

console.log("getToken", getToken);
// Fetch posts
export interface Media {
  url: string;
  type: "image" | "video";
  _id: string;
}

export interface Post {
  _id: string;
  user: {
    _id: string;
    fullName: string;
    username: string;
  };
  content: string;
  media: Media[];
  visibility: string;
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
export const addFriend = async (userId: number) => {
  console.log("user", userId);
  try {
    const token = getToken;
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
