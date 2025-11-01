import { useEffect, useState } from "react";
import axios from "axios";
import { MessageCircle, CornerDownRight, AlertCircle } from "lucide-react";

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
        await fetchComments(); // fallback if backend doesn’t return direct comment
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
          parentCommentId: parentCommentId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const replyData =
        res.data?.data ||
        res.data?.comment ||
        (res.data?.message && res.data?.data?.comments?.length
          ? res.data.data.comments[0]
          : null);

      if (replyData && replyData._id) {
        // ✅ Direct reply received
        setComments((prev) =>
          prev.map((c) =>
            c._id === parentCommentId
              ? { ...c, replies: [...(c.replies || []), replyData] }
              : c
          )
        );
      } else {
        // ✅ If backend doesn't send reply directly, refetch full comment list
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
    <div className="mt-6 bg-white rounded-2xl shadow p-4 border border-gray-100">
      <div className="flex items-center space-x-2 mb-4">
        <MessageCircle className="w-5 h-5 text-gray-500" />
        <h3 className="font-semibold text-gray-700">Comments</h3>
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center text-red-600 text-sm mb-3">
          <AlertCircle className="w-4 h-4 mr-1" /> {error}
        </div>
      )}

      {/* New comment input */}
      <div className="flex items-center space-x-2 mb-4">
        <input
          type="text"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleAddComment}
          disabled={posting}
          className={`px-4 py-2 rounded-lg text-white transition ${
            posting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {posting ? "Posting..." : "Post"}
        </button>
      </div>

      {/* Loading state */}
      {loading && <p className="text-gray-500 text-sm">Loading comments...</p>}

      {/* Empty state */}
      {!loading && comments.length === 0 && (
        <p className="text-gray-400 text-sm">No comments yet. Be the first!</p>
      )}

      {/* Comments */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment._id}
            className="bg-gray-50 p-3 rounded-xl border border-gray-100"
          >
            <p className="font-semibold text-gray-800">
              {comment.user?.fullName || "Unknown User"}
            </p>
            <p className="text-gray-600">{comment.content}</p>

            {/* Reply button */}
            <button
              onClick={() =>
                setReplyTo(replyTo === comment._id ? null : comment._id)
              }
              className="text-sm text-indigo-600 mt-1 hover:underline"
            >
              Reply
            </button>

            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-3 space-y-2 pl-4 border-l-2 border-indigo-200">
                {comment.replies.map((reply) => (
                  <div
                    key={reply._id}
                    className="bg-white p-2 rounded-lg shadow-sm"
                  >
                    <div className="flex items-center space-x-2">
                      <CornerDownRight className="w-4 h-4 text-gray-400" />
                      <p className="font-semibold text-gray-700">
                        {reply.user?.fullName || "Unknown User"}
                      </p>
                    </div>
                    <p className="text-gray-600 ml-6">{reply.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Reply input */}
            {replyTo === comment._id && (
              <div className="flex items-center mt-3 space-x-2">
                <input
                  type="text"
                  placeholder="Write a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={() => handleAddReply(comment._id)}
                  disabled={posting}
                  className={`px-4 py-2 rounded-lg text-white transition ${
                    posting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {posting ? "Replying..." : "Reply"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
