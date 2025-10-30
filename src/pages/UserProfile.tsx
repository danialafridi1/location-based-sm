import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  MapPin,
  Calendar,
  ExternalLink,
  Mail,
  ImageIcon,
  Heart,
  MessageCircle,
  Share2,
  ArrowLeft,
  Settings,
  UserPlus,
  UserCheck,
  Sparkles,
  TrendingUp,
  Award,
} from "lucide-react";

const UserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<any>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<"posts" | "media" | "likes">(
    "posts"
  );

  useEffect(() => {
    if (!id) return;

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const [userRes, postsRes] = await Promise.all([
          axios.get(`/api/users/${id}`),
          axios.get(`/api/users/${id}/posts`),
        ]);

        setUser(userRes.data);
        setUserPosts(postsRes.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load user data");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    // Optional: call API to follow/unfollow
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div
          className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
          style={{ animationDelay: "700ms" }}
        ></div>
        <div
          className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
          style={{ animationDelay: "1000ms" }}
        ></div>
      </div>

      {/* Header Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <button className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 transition-colors group">
              <div className="p-2 rounded-full bg-white/80 group-hover:bg-indigo-50 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </div>
              <span className="font-semibold hidden sm:inline">Back</span>
            </button>

            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur opacity-75"></div>
                <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-xl">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                SocialSphere
              </h1>
            </div>

            <button className="p-2 rounded-full bg-white/80 hover:bg-gray-100 transition-colors">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      <div className="relative max-w-6xl mx-auto">
        {/* Cover Image */}
        <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
          <img
            src={user.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20"></div>
        </div>

        {/* Profile Info Section */}
        <div className="relative px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-20 sm:-mt-24">
            {/* Profile Card */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
                {/* Avatar */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition"></div>
                  <img
                    src={user.avatar}
                    alt={user.fullName}
                    className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-xl object-cover"
                  />
                  {user.isVerified && (
                    <div className="absolute bottom-2 right-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full p-2 border-4 border-white shadow-lg">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                          {user.fullName}
                        </h1>
                        {user.isVerified && (
                          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full p-1">
                            <Award className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-lg text-gray-600 mb-3">
                        @{user.username}
                      </p>
                      <p className="text-gray-700 whitespace-pre-line max-w-2xl mb-4">
                        {user.bio}
                      </p>

                      {/* Meta Info */}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{user.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ExternalLink className="w-4 h-4" />
                          <a
                            href={user.website}
                            className="text-indigo-600 hover:text-indigo-700 font-medium"
                            target="_blank"
                          >
                            {user.website}
                          </a>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Joined {user.joinedDate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button
                        onClick={handleFollowToggle}
                        className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                          isFollowing
                            ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl hover:scale-105"
                        }`}
                      >
                        {isFollowing ? (
                          <UserCheck className="w-5 h-5" />
                        ) : (
                          <UserPlus className="w-5 h-5" />
                        )}
                        <span>{isFollowing ? "Following" : "Follow"}</span>
                      </button>
                      <button className="p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
                        <Mail className="w-5 h-5 text-gray-700" />
                      </button>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-6 mt-6 pt-6 border-t border-gray-200">
                    <button className="group text-center">
                      <p className="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition">
                        {user.posts}
                      </p>
                      <p className="text-sm text-gray-600">Posts</p>
                    </button>
                    <button className="group text-center">
                      <p className="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition">
                        {user.followers.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">Followers</p>
                    </button>
                    <button className="group text-center">
                      <p className="text-2xl font-bold text-gray-900 group-hover:text-indigo-600 transition">
                        {user.following}
                      </p>
                      <p className="text-sm text-gray-600">Following</p>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-6 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/40 p-2">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab("posts")}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === "posts"
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <ImageIcon className="w-5 h-5" />
                  <span>Posts</span>
                </button>
                <button
                  onClick={() => setActiveTab("media")}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === "media"
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <TrendingUp className="w-5 h-5" />
                  <span>Media</span>
                </button>
                <button
                  onClick={() => setActiveTab("likes")}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === "likes"
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Heart className="w-5 h-5" />
                  <span>Likes</span>
                </button>
              </div>
            </div>

            {/* Posts Grid */}
            <div className="mt-6 pb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userPosts.map((post, idx) => (
                  <div
                    key={post.id}
                    className="group bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/40 animate-fade-in"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden">
                      <img
                        src={post.image}
                        alt="Post"
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                        {post.timestamp}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <p className="text-gray-700 mb-4 line-clamp-2">
                        {post.content}
                      </p>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <button className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors group/btn">
                          <Heart className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                          <span className="text-sm font-medium">{post.likes}</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors group/btn">
                          <MessageCircle className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                          <span className="text-sm font-medium">{post.comments}</span>
                        </button>
                        <button className="text-gray-600 hover:text-green-500 transition-colors group/btn">
                          <Share2 className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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
