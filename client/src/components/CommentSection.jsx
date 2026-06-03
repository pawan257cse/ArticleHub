import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function CommentSection({ postId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch comments
  useEffect(() => {
    api.get(`/comments/${postId}`)
      .then(res => {
        setComments(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => {
        console.error("Fetch comments failed:", err);
        setComments([]);
      });
  }, [postId]);

  // Add comment
  const addComment = async () => {
    if (!text.trim()) return;

    setLoading(true);
    const res = await api.post(`/comments/${postId}`, {
      content: text
    });

    setComments([...comments, res.data]);
    setText("");
    setLoading(false);
  };

  // Delete comment
  const deleteComment = async (id) => {
    await api.delete(`/comments/${id}`);
    setComments(comments.filter(c => c._id !== id));
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
        <span>💬</span>
        <span>Discussion ({comments.length})</span>
      </h3>

      {/* ADD COMMENT */}
      {user ? (
        <div className="mb-8">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What are your thoughts on this article? Join the discussion..."
            className="form-input resize-none"
            rows={3}
          />

          <div className="flex justify-end mt-3">
            <button
              onClick={addComment}
              disabled={loading}
              className="btn-indigo flex items-center gap-1.5"
            >
              {loading ? (
                <span>Posting...</span>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <span>Post Comment</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-8 bg-slate-100/30 dark:bg-slate-900/10 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Want to share your thoughts?{" "}
            <span
              onClick={() => window.location.href = "/login"}
              className="font-bold text-indigo-600 dark:text-indigo-400 cursor-pointer hover:underline"
            >
              Log in to join the conversation
            </span>.
          </p>
        </div>
      )}

      {/* COMMENTS LIST */}
      {comments.length === 0 ? (
        <div className="text-center py-8 bg-slate-50/20 dark:bg-slate-900/5 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 dark:text-slate-500 text-sm">
          No comments yet. Start the conversation!
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map(comment => (
            <div
              key={comment._id}
              className="bg-white dark:bg-slate-900/60 border border-slate-100/80 dark:border-slate-800/60 rounded-2xl p-4 shadow-sm flex gap-3 relative hover:shadow-md transition duration-200"
            >
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-400 shadow-sm shrink-0">
                👤
              </div>

              {/* Body */}
              <div className="flex-1 flex flex-col justify-between">
                <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                  {comment.content}
                </p>

                {user && user.id === comment.author && (
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={() => deleteComment(comment._id)}
                      className="text-xs text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
