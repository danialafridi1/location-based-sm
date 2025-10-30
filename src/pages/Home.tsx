import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPosts, addFriend, type Post } from "../api/posts";
import { getCurrentUser } from "../api/user";
import { Heart, MessageCircle, Share2, UserPlus, LogOut, Sparkles, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

interface User {
  _id: string;
  fullName: string;
  username: string;
  privacy: string;
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingUser, setLoadingUser] = useState(true);
  const [errorPosts, setErrorPosts] = useState<string | null>(null);
  const [errorUser, setErrorUser] = useState<string | null>(null);
  const [addingFriendIds, setAddingFriendIds] = useState<string[]>([]);
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
    const res=  await addFriend(userId);
      alert(res.message || "Friend added successfully");
    } catch (err: any) {
      alert(err || "Failed to add friend");
    } finally {
      setAddingFriendIds((prev) => prev.filter((id) => id !== userId));
    }
  };

  useEffect(() => {
    fetchUser();
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      {/* Glassmorphic Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur opacity-75"></div>
                <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-xl">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  SocialSphere
                </h1>
                <p className="text-xs text-gray-500 font-medium">Discover & Connect</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {loadingUser ? (
                <div className="flex items-center space-x-2 bg-white/50 backdrop-blur px-4 py-2 rounded-full">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                  <span className="text-sm text-gray-600">Loading...</span>
                </div>
              ) : errorUser ? (
                <span className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-full">{errorUser}</span>
              ) : (
                <div className="flex items-center space-x-3 bg-white/80 backdrop-blur border border-white/40 rounded-full px-5 py-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                    {user?.fullName?.[0]?.toUpperCase()}
                  </div>
                  <div className="hidden sm:flex flex-col">
                    <span className="font-semibold text-gray-900 text-sm">{user?.fullName}</span>
                    <span className="text-xs text-gray-500">@{user?.username}</span>
                  </div>
                  <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${
                    user?.privacy === 'public' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-indigo-100 text-indigo-700'
                  }`}>
                    {user?.privacy}
                  </span>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="group relative bg-gradient-to-r from-red-500 to-pink-600 text-white p-3 rounded-full hover:from-red-600 hover:to-pink-700 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trending Banner */}
        <div className="mb-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-2xl transform hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center space-x-3 mb-2">
            <TrendingUp className="w-6 h-6" />
            <h2 className="text-xl font-bold">Trending Now</h2>
          </div>
          <p className="text-indigo-100">Discover what's popular in your network</p>
        </div>

        {loadingPosts && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-indigo-600"></div>
              <div className="absolute inset-0 animate-ping rounded-full h-20 w-20 border-4 border-purple-400 opacity-20"></div>
            </div>
            <p className="mt-6 text-gray-600 font-medium">Loading amazing posts...</p>
          </div>
        )}

        {!loadingPosts && errorPosts && (
          <div className="text-center py-20">
            <div className="inline-block bg-red-50 border-2 border-red-200 rounded-2xl px-8 py-6">
              <p className="text-red-600 font-semibold">{errorPosts}</p>
            </div>
          </div>
        )}

        {!loadingPosts && !errorPosts && posts.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-block bg-white/80 backdrop-blur rounded-2xl px-12 py-10 shadow-xl">
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 font-medium text-lg">No posts to show yet</p>
              <p className="text-gray-400 text-sm mt-2">Be the first to share something!</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, idx) => {
            const media = post.media?.[0];
            const userId = post.user._id;

            return (
              <div
                key={post._id}
                className="group relative bg-white/90 backdrop-blur rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in"
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
                      alt="Post media"
                      className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-72 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center">
                      <Sparkles className="w-16 h-16 text-indigo-300" />
                    </div>
                  )}
                  
                  {/* Visibility Badge Overlay */}
                  <div className="absolute top-4 right-4">
                    <span className="px-4 py-2 rounded-full text-xs font-bold uppercase text-white bg-black/50 backdrop-blur-sm border border-white/20">
                      {post.visibility}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  {/* User Info */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {post.user.fullName[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{post.user.fullName}</p>
                        <Link
  to={`/profile/${post.user._id}`}
  className="text-sm text-indigo-600 hover:underline hover:text-indigo-800 transition-colors"
>
  @{post.user.username}
</Link>
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <p className="text-gray-700 mb-3 line-clamp-3">{post.content}</p>
                  {post.visibilityLog && (
                    <p className="text-xs text-gray-400 italic mb-4 line-clamp-2">{post.visibilityLog}</p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 mb-4 pt-4 border-t border-gray-100">
                    <button className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-red-50 transition-colors group/btn">
                      <Heart className="w-5 h-5 text-gray-400 group-hover/btn:text-red-500 transition-colors" />
                      <span className="text-sm text-gray-600">Like</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-blue-50 transition-colors group/btn">
                      <MessageCircle className="w-5 h-5 text-gray-400 group-hover/btn:text-blue-500 transition-colors" />
                      <span className="text-sm text-gray-600">Comment</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-green-50 transition-colors group/btn ml-auto">
                      <Share2 className="w-5 h-5 text-gray-400 group-hover/btn:text-green-500 transition-colors" />
                    </button>
                  </div>

                  {/* Add Friend Button */}
                  <button
                    onClick={() => handleAddFriend(userId)}
                    disabled={addingFriendIds.includes(userId)}
                    className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center space-x-2 ${
                      addingFriendIds.includes(userId)
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl hover:scale-105"
                    }`}
                  >
                    <UserPlus className="w-5 h-5" />
                    <span>{addingFriendIds.includes(userId) ? "Adding..." : "Add Friend"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

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
        .delay-700 {
          animation-delay: 700ms;
        }
        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </div>
  );
};

export default Home;