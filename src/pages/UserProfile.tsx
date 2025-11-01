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

  // 🧩 Fetch current logged-in user first
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

  // 📦 Fetch target user + posts (depends on currentUser)
  useEffect(() => {
    if (!id || !currentUser) return;

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        // 1️⃣ Fetch profile
        const userRes = await API.get(`/user/profile/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = userRes.data?.user || userRes.data;
        setUser(userData);

        // 2️⃣ Determine privacy access
        const isPrivate =
          userData.privacy?.toLowerCase() === "private" &&
          !userData.isContact &&
          userData._id !== currentUser._id;

        // 3️⃣ Stop here if user cannot view posts
        if (isPrivate) {
          setUserPosts([]);
          setLoading(false);
          return;
        }

        // 4️⃣ Fetch posts
        const postRes = await API.get(`/post/user/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const posts = postRes.data?.data || [];
        setUserPosts(posts);
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

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
  };

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

  // 🔒 Refined privacy condition
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

            {/* Posts Section */}
            <div className="mt-6 pb-12">
              {isPrivateView ? (
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
