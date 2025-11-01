import { useEffect, useState } from "react";
import axios from "axios";
import { MessageCircle, CornerDownRight, AlertCircle, Clock, Send, Reply, Sparkles } from "lucide-react";

interface Comment {
  _id: string;
  user?: {
    _id?: string;
    fullName?: string;
    username?: string;
  } | null;
  content: string;
  replies?: Comment[];
  parentCommentId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

interface CommentSectionProps {
  postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");
  const BASE_URL = "http://localhost:3000/api";

  // ✅ Validate token and postId before making any request
  const validateBeforeRequest = () => {
    if (!token) {
      setError("Unauthorized: Missing token. Please log in again.");
      return false;
    }
    if (!postId) {
      setError("Invalid post: Post ID is missing.");
      return false;
    }
    return true;
  };

  // ✅ Format timestamp helper
  const formatDate = (timestamp?: string) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 7) {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    } else if (days > 0) {
      return `${days}d ago`;
    } else if (hours > 0) {
      return `${hours}h ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return "Just now";
    }
  };

  // Get user initials for avatar
  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Get random gradient for avatar
  const getAvatarGradient = (id?: string) => {
    const gradients = [
      "from-purple-500 to-pink-500",
      "from-blue-500 to-cyan-500",
      "from-green-500 to-emerald-500",
      "from-orange-500 to-red-500",
      "from-indigo-500 to-purple-500",
      "from-pink-500 to-rose-500",
    ];
    const index = id ? parseInt(id.slice(-1), 16) % gradients.length : 0;
    return gradients[index];
  };

  // ✅ Fetch comments
  const fetchComments = async () => {
    if (!validateBeforeRequest()) return;

    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${BASE_URL}/comments/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data?.data?.comments;
      if (!Array.isArray(data)) throw new Error("Invalid API response format");

      setComments(data);
    } catch (err: any) {
      console.error("Error fetching comments:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load comments. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add new comment
  const handleAddComment = async () => {
    if (!validateBeforeRequest()) return;
    if (!newComment.trim()) {
      setError("Comment cannot be empty.");
      return;
    }

    try {
      setPosting(true);
      setError(null);

      const res = await axios.post(
        `${BASE_URL}/comments/post/${postId}`,
        { content: newComment.trim(), parentCommentId: null },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newCommentData = res.data?.data;
      if (newCommentData && newCommentData._id) {
        setComments((prev) => [...prev, newCommentData]);
        setNewComment("");
      } else {
        await fetchComments();
      }
    } catch (err: any) {
      console.error("Error posting comment:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to post comment. Please try again."
      );
    } finally {
      setPosting(false);
    }
  };

  // ✅ Add reply
  const handleAddReply = async (parentCommentId: string) => {
    if (!validateBeforeRequest()) return;
    if (!replyText.trim()) {
      setError("Reply cannot be empty.");
      return;
    }

    try {
      setPosting(true);
      setError(null);

      const res = await axios.post(
        `${BASE_URL}/comments/post/${postId}`,
        {
          content: replyText.trim(),
          parentCommentId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const replyData = res.data?.data;

      if (replyData && replyData._id) {
        setComments((prev) =>
          prev.map((c) =>
            c._id === parentCommentId
              ? { ...c, replies: [...(c.replies || []), replyData] }
              : c
          )
        );
      } else {
        await fetchComments();
      }

      setReplyText("");
      setReplyTo(null);
    } catch (err: any) {
      console.error("Error posting reply:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to post reply. Please try again."
      );
    } finally {
      setPosting(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return (
    <div className="mt-6 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl p-6 border border-gray-200 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl shadow-lg">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-xl text-gray-800">Comments</h3>
            <p className="text-xs text-gray-500">{comments.length} {comments.length === 1 ? 'comment' : 'comments'}</p>
          </div>
        </div>
        <Sparkles className="w-5 h-5 text-indigo-400" />
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 animate-pulse">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* New comment input */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Share your thoughts..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !posting && handleAddComment()}
            className="w-full p-4 pr-12 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 text-gray-800 placeholder-gray-400 shadow-sm"
          />
          <button
            onClick={handleAddComment}
            disabled={posting || !newComment.trim()}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-xl transition-all duration-300 ${
              posting || !newComment.trim()
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg hover:scale-105 active:scale-95"
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12 space-y-3">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <MessageCircle className="w-6 h-6 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-gray-500 text-sm font-medium">Loading comments...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && comments.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-6 rounded-full">
            <MessageCircle className="w-12 h-12 text-indigo-500" />
          </div>
          <div className="text-center">
            <p className="text-gray-600 font-medium mb-1">No comments yet</p>
            <p className="text-gray-400 text-sm">Be the first to share your thoughts!</p>
          </div>
        </div>
      )}

      {/* Comments */}
      <div className="space-y-4">
        {comments.map((comment, index) => (
          <div
            key={comment._id}
            className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="p-5">
              {/* Comment header */}
              <div className="flex items-start space-x-3 mb-3">
                <div
                  className={`w-10 h-10 bg-gradient-to-br ${getAvatarGradient(
                    comment.user?._id
                  )} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0`}
                >
                  {getInitials(comment.user?.fullName)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-gray-800 truncate">
                      {comment.user?.fullName || "Unknown User"}
                    </h4>
                    {(comment.updatedAt || comment.createdAt) && (
                      <div className="flex items-center text-xs text-gray-400 ml-2">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDate(comment.updatedAt || comment.createdAt)}
                      </div>
                    )}
                  </div>
                  {comment.user?.username && (
                    <p className="text-xs text-gray-500">@{comment.user.username}</p>
                  )}
                </div>
              </div>

              {/* Comment content */}
              <p className="text-gray-700 leading-relaxed ml-13 mb-3">
                {comment.content}
              </p>

              {/* Reply button */}
              <button
                onClick={() =>
                  setReplyTo(replyTo === comment._id ? null : comment._id)
                }
                className="flex items-center space-x-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium ml-13 transition-colors duration-200 group/reply"
              >
                <Reply className="w-4 h-4 group-hover/reply:translate-x-0.5 transition-transform" />
                <span>Reply</span>
              </button>

              {/* Reply input */}
              {replyTo === comment._id && (
                <div className="mt-4 ml-13 animate-in slide-in-from-top-2 duration-300">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Write a thoughtful reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !posting && handleAddReply(comment._id)}
                      className="w-full p-3 pr-12 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 focus:bg-white transition-all duration-300 text-sm"
                    />
                    <button
                      onClick={() => handleAddReply(comment._id)}
                      disabled={posting || !replyText.trim()}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all duration-300 ${
                        posting || !replyText.trim()
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-md hover:scale-105 active:scale-95"
                      }`}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-t border-indigo-100">
                <div className="p-5 space-y-3">
                  {comment.replies.map((reply, replyIndex) => (
                    <div
                      key={reply._id}
                      className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                      style={{ animationDelay: `${replyIndex * 30}ms` }}
                    >
                      <div className="flex items-start space-x-3">
                        <CornerDownRight className="w-4 h-4 text-indigo-400 mt-1 flex-shrink-0" />
                        <div
                          className={`w-8 h-8 bg-gradient-to-br ${getAvatarGradient(
                            reply.user?._id
                          )} rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm flex-shrink-0`}
                        >
                          {getInitials(reply.user?.fullName)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h5 className="font-semibold text-gray-800 text-sm truncate">
                              {reply.user?.fullName || "Unknown User"}
                            </h5>
                            {(reply.updatedAt || reply.createdAt) && (
                              <div className="flex items-center text-xs text-gray-400 ml-2">
                                <Clock className="w-3 h-3 mr-1" />
                                {formatDate(reply.updatedAt || reply.createdAt)}
                              </div>
                            )}
                          </div>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {reply.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;