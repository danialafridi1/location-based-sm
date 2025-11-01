import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getPosts, addFriend, type Post } from "../api/posts";
import { getCurrentUser } from "../api/user";
import {
  Heart,
  MessageCircle,
  Share2,
  UserPlus,
  Sparkles,
  TrendingUp,
  UserLock,
  Globe2,
  Users,
} from "lucide-react";
import Header from "../components/Header";
import CommentSection from "../components/CommentSection";

export interface User {
  _id: string;
  fullName: string;
  username: string;
  privacy: string;
  image?: string;
  isContact?: boolean;
  bio?: string;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingUser, setLoadingUser] = useState(true);
  const [errorPosts, setErrorPosts] = useState<string | null>(null);
  const [errorUser, setErrorUser] = useState<string | null>(null);
  const [addingFriendIds, setAddingFriendIds] = useState<string[]>([]);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const fetchPosts = async () => {
    try {
      setLoadingPosts(true);
      const data = await getPosts();
      setPosts(Array.isArray(data) ? data : []);
      setErrorPosts(null);
    } catch (err: any) {
      console.log("err", err);
      setErrorPosts(err.message || "Failed to load posts");
    } finally {
      setLoadingPosts(false);
    }
  };

  const fetchUser = async () => {
    try {
      setLoadingUser(true);
      const data = await getCurrentUser();
      setUser(data);
      setErrorUser(null);
    } catch (err: any) {
      setErrorUser(err.message || "Failed to fetch user info");
    } finally {
      setLoadingUser(false);
    }
  };

  const handleAddFriend = async (userId: string) => {
    if (addingFriendIds.includes(userId)) return;
    try {
      setAddingFriendIds((prev) => [...prev, userId]);
      const res = await addFriend(userId);
      alert(res.message || "Friend added successfully");
    } catch (err: any) {
      alert(err || "Failed to add friend");
    } finally {
      setAddingFriendIds((prev) => prev.filter((id) => id !== userId));
    }
  };

  const toggleComments = (postId: string) => {
    setActiveCommentPostId((prev) => (prev === postId ? null : postId));
  };

  useEffect(() => {
    fetchUser();
    fetchPosts();
  }, []);

  const renderVisibilityBadge = (visibility: string) => {
    let icon, color, label;

    switch (visibility) {
      case "private":
        icon = <UserLock className="w-4 h-4 mr-1" />;
        color = "bg-red-600/80";
        label = "Private";
        break;
      case "friends":
        icon = <Users className="w-4 h-4 mr-1" />;
        color = "bg-yellow-600/80";
        label = "Friends";
        break;
      default:
        icon = <Globe2 className="w-4 h-4 mr-1" />;
        color = "bg-green-600/80";
        label = "Public";
    }

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white backdrop-blur-sm shadow-md ${color}`}
      >
        {icon}
        {label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Header
        user={user}
        loadingUser={loadingUser}
        errorUser={errorUser}
        onLogout={handleLogout}
      />

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trending Banner */}
        <div className="mb-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-2xl transform hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center space-x-3 mb-2">
            <TrendingUp className="w-6 h-6" />
            <h2 className="text-xl font-bold">Trending Now</h2>
          </div>
          <p className="text-indigo-100">Discover what's popular in your network</p>
        </div>

        {/* Posts Section */}
        {loadingPosts ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-indigo-600"></div>
            <p className="mt-6 text-gray-600 font-medium">Loading amazing posts...</p>
          </div>
        ) : errorPosts ? (
          <div className="text-center py-20 text-red-500 font-semibold">{errorPosts}</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-gray-500">No posts yet</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, idx) => {
              const media = post.media?.[0];
              const userId = post.user._id;

              return (
                <div
                  key={post._id}
                  className="relative bg-white/90 backdrop-blur rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  {/* Media Section */}
                  <div className="relative overflow-hidden">
                    {media && media.type === "video" ? (
                      <video
                        src={media.url}
                        controls
                        className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : media ? (
                      <img
                        src={media.url}
                        alt="Post"
                        className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-72 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center">
                        <Sparkles className="w-16 h-16 text-indigo-300" />
                      </div>
                    )}

                    {/* Visibility and Add Friend Button */}
                    <div className="absolute top-4 right-4 flex flex-col items-end space-y-3">
                      {renderVisibilityBadge(post.visibility)}
                      <button
                        onClick={() => handleAddFriend(userId)}
                        disabled={addingFriendIds.includes(userId)}
                        className={`p-2 rounded-full shadow-md flex items-center justify-center transition-all duration-300 ${
                          addingFriendIds.includes(userId)
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:scale-105 text-white"
                        }`}
                        title={
                          addingFriendIds.includes(userId)
                            ? "Adding..."
                            : "Add Friend"
                        }
                      >
                        <UserPlus className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {post.user.fullName[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{post.user.fullName}</p>
                          <Link
                            to={`/profile/${post.user._id}`}
                            className="text-sm text-indigo-600 hover:underline"
                          >
                            @{post.user.username}
                          </Link>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-3 line-clamp-3">{post.content}</p>

                    <div className="flex items-center space-x-2 mb-4 pt-4 border-t border-gray-100">
                      <button className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-red-50 transition-colors group/btn">
                        <Heart className="w-5 h-5 text-gray-400 group-hover/btn:text-red-500 transition-colors" />
                        <span className="text-sm text-gray-600">Like</span>
                      </button>
                      <button
                        onClick={() => toggleComments(post._id)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors group/btn ${
                          activeCommentPostId === post._id
                            ? "bg-blue-100 text-blue-600"
                            : "hover:bg-blue-50"
                        }`}
                      >
                        <MessageCircle className="w-5 h-5 text-gray-400 group-hover/btn:text-blue-500 transition-colors" />
                        <span className="text-sm text-gray-600">Comment</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-green-50 transition-colors group/btn ml-auto">
                        <Share2 className="w-5 h-5 text-gray-400 group-hover/btn:text-green-500 transition-colors" />
                      </button>
                    </div>

                    {/* ✅ Comment Section only for active post */}
                    {activeCommentPostId === post._id && (
                      <div className="mt-4 animate-fade-in">
                        <CommentSection postId={post._id} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Home;
