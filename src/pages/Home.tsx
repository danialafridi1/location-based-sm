import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPosts, addFriend, type Post } from "../api/posts";
import { getCurrentUser } from "../api/user";

interface User {
  _id: string;
  fullName: string;
  username: string;
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

  // Fetch posts
  const fetchPosts = async () => {
    try {
      setLoadingPosts(true);
      const data = await getPosts();
      setPosts(data);
      setErrorPosts(null);
    } catch (err: any) {
      setErrorPosts(err.message);
    } finally {
      setLoadingPosts(false);
    }
  };

  // Fetch current user
  const fetchUser = async () => {
    try {
      setLoadingUser(true);
        const data = await getCurrentUser();
        console.log("data",data);
      setUser(data);
      setErrorUser(null);
    } catch (err: any) {
      setErrorUser(err.message);
    } finally {
      setLoadingUser(false);
    }
  };

  // Add friend
  const handleAddFriend = async (userId: string) => {
    if (addingFriendIds.includes(userId)) return;
    try {
      setAddingFriendIds((prev) => [...prev, userId]);
      await addFriend(userId as string);
      alert("Friend added successfully");
    } catch (err: any) {
      alert(err.message || "Failed to add friend");
    } finally {
      setAddingFriendIds((prev) => prev.filter((id) => id !== userId));
    }
  };

  useEffect(() => {
    fetchUser();
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Location Based Social Platform</h1>
          {loadingUser ? (
            <p className="text-sm text-gray-500">Loading user...</p>
          ) : errorUser ? (
            <p className="text-sm text-red-500">{errorUser}</p>
          ) : (
            <p className="text-sm text-gray-700">
              {user?.fullName} (@{user?.username})
            </p>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </header>

      {/* Posts */}
      <main className="p-6">
        {loadingPosts && <p className="text-center">Loading posts...</p>}
        {errorPosts && <p className="text-center text-red-500">{errorPosts}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {posts.map((post) => {
            const mediaUrl = post.media?.[0]?.url || "";
            const userId = post.user._id;

            return (
              <div key={post._id} className="bg-white rounded-lg shadow overflow-hidden">
                {mediaUrl && (
                  <img src={mediaUrl} alt="Post media" className="w-full h-48 object-cover" />
                )}
                <div className="p-4">
                  <p className="text-gray-700 mb-3">{post.content}</p>
                  <button
                    onClick={() => handleAddFriend(userId)}
                    disabled={addingFriendIds.includes(userId)}
                    className={`w-full py-2 rounded ${
                      addingFriendIds.includes(userId)
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                    } text-white transition`}
                  >
                    {addingFriendIds.includes(userId) ? "Adding..." : "Add Friend"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Home;
