import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Heart,
  MessageCircle,
  Share2,
  UserCheck,
  UserPlus,
  UserLock,
  Mail,
} from "lucide-react";
import Header from "../components/Header";
import { getCurrentUser } from "../api/user";
import type { User } from "./Home";

const API = axios.create({
  baseURL: "http://localhost:3000/api",
});

const UserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [contacts, setContacts] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<"posts" | "contacts">("posts");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [errorUser, setErrorUser] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // 🧩 Fetch current logged-in user
  useEffect(() => {
    const fetchCurrent = async () => {
      try {
        setLoadingUser(true);
        const data = await getCurrentUser();
        setCurrentUser(data);
        setErrorUser(null);
      } catch (err: any) {
        setErrorUser(err.message || "Failed to fetch user info");
      } finally {
        setLoadingUser(false);
      }
    };
    fetchCurrent();
  }, []);

  // 📦 Fetch target user and posts
  useEffect(() => {
    if (!id || !currentUser) return;

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        // Profile
        const userRes = await API.get(`/user/profile/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = userRes.data?.user || userRes.data;
        setUser(userData);

        // Privacy logic
        const isPrivate =
          userData.privacy?.toLowerCase() === "private" &&
          !userData.isContact &&
          userData._id !== currentUser._id;

        if (isPrivate) {
          setUserPosts([]);
          setLoading(false);
          return;
        }

        // Posts
        const postRes = await API.get(`/post/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserPosts(postRes.data?.data || []);
        setError(null);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id, currentUser]);

  // 👥 Fetch Contacts (for current logged-in user)
  useEffect(() => {
    if (!currentUser) return;

    const fetchContacts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/contacts/granted", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // ✅ Contacts come as res.data.contacts -> each has .grantedTo
        const formatted = (res.data.contacts || []).map(
          (c: any) => c.grantedTo
        );
        setContacts(formatted);
      } catch (err: any) {
        console.error("Error fetching contacts:", err);
      }
    };

    fetchContacts();
  }, [currentUser]);

  const handleFollowToggle = () => setIsFollowing(!isFollowing);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading user profile...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error || "User not found"}</p>
      </div>
    );
  }

  const isPrivateView =
    user.privacy?.toLowerCase() === "private" &&
    !user.isContact &&
    user._id !== currentUser?._id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Header
        user={currentUser}
        loadingUser={loadingUser}
        errorUser={errorUser}
        onLogout={handleLogout}
      />

      <div className="relative max-w-6xl mx-auto">
        {/* Cover */}
        <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
          <img
            src={
              user.image ||
              "https://uploads.sitepoint.com/wp-content/uploads/2021/12/1638981799header.png"
            }
            alt="Cover"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-20 sm:-mt-24">
            {/* Profile card */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
                <img
                  src={
                    user.image ||
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwYtBEQH4CWGSat1Ds4L_NHW5JPjEi-e4Qgg&s"
                  }
                  alt={user.fullName}
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-xl object-cover"
                />
                <div className="flex-1 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                        <i className="text-blue-800">{user.fullName}</i>
                      </h1>
                      <p className="text-lg text-gray-600 mb-3">
                        @{user.username}
                      </p>
                      <p className="text-gray-700 mb-4 whitespace-pre-line">
                        {user.bio}
                      </p>
                      <p className="text-gray-700 mb-4 whitespace-pre-line">
                        Type:{" "}
                        <i className="text-red-800 capitalize">
                          {user.privacy}
                        </i>
                      </p>
                    </div>

                    <button
                      onClick={handleFollowToggle}
                      className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                        isFollowing
                          ? "bg-gray-200 text-gray-700"
                          : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                      }`}
                    >
                      {isFollowing ? (
                        <UserCheck className="w-5 h-5" />
                      ) : (
                        <UserPlus className="w-5 h-5" />
                      )}
                      <span>{isFollowing ? "Following" : "Follow"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex justify-center mt-8 mb-6">
              <div className="flex bg-white/80 backdrop-blur-xl rounded-full shadow-md border border-white/40 overflow-hidden">
                <button
                  onClick={() => setActiveTab("posts")}
                  className={`px-6 py-3 font-semibold transition-all duration-300 ${
                    activeTab === "posts"
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Posts
                </button>
                <button
                  onClick={() => setActiveTab("contacts")}
                  className={`px-6 py-3 font-semibold transition-all duration-300 ${
                    activeTab === "contacts"
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Contacts
                </button>
              </div>
            </div>

            {/* Tab content */}
            <div className="mt-6 pb-12">
              {activeTab === "posts" ? (
                isPrivateView ? (
                  <div className="text-center py-20 text-gray-600 text-lg font-medium flex flex-col items-center justify-center space-y-3">
                    <UserLock className="w-12 h-12 text-gray-400" />
                    <p>This account is private.</p>
                  </div>
                ) : userPosts.length === 0 ? (
                  <div className="text-center py-20 text-gray-600 text-lg font-medium">
                    No posts found.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userPosts.map((post, idx) => (
                      <div
                        key={post._id}
                        className="group bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/40 animate-fade-in"
                        style={{ animationDelay: `${idx * 100}ms` }}
                      >
                        <div className="relative overflow-hidden">
                          <img
                            src={
                              post.media?.[0]?.url ||
                              "https://via.placeholder.com/400"
                            }
                            alt="Post"
                            className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="p-4">
                          <p className="text-gray-700 mb-4 line-clamp-2">
                            {post.content}
                          </p>
                          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <button className="flex items-center space-x-2 text-gray-600 hover:text-red-500">
                              <Heart className="w-5 h-5" />
                              <span className="text-sm font-medium">0</span>
                            </button>
                            <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500">
                              <MessageCircle className="w-5 h-5" />
                              <span className="text-sm font-medium">0</span>
                            </button>
                            <button className="text-gray-600 hover:text-green-500">
                              <Share2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {contacts.length === 0 ? (
                    <div className="text-center col-span-full py-20 text-gray-600 text-lg font-medium">
                      You have no contacts yet.
                    </div>
                  ) : (
                    contacts.map((c) => (
                      <div
                        key={c._id}
                        className="bg-white/90 rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center hover:shadow-2xl transition-all duration-300"
                      >
                        <img
                          src={
                            c.image ||
                            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                          }
                          alt={c.fullName}
                          className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover mb-3"
                        />
                        <h3 className="text-lg font-semibold text-gray-900">
                          {c.fullName}
                        </h3>
                        <p className="text-gray-600 mb-3">@{c.username}</p>
                        <button className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-xl shadow hover:opacity-90">
                          <Mail className="w-4 h-4" />
                          <span>Message</span>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default UserProfile;
