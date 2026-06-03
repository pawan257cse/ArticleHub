import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import CommentSection from "../components/CommentSection";
import { useAuth } from "../context/AuthContext";

export default function PostDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);

  useEffect(() => {
    api.get(`/posts/${id}`).then(res => setPost(res.data));
  }, [id]);

  const toggleLike = async () => {
    const res = await api.post(`/posts/${id}/like`);
    setPost({ ...post, likes: Array(res.data.likesCount).fill(1) });
  };

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-[#0b0f19]">
        <div className="inline-block w-8 h-8 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const isLiked = user && post.likes?.includes(user.id);

  return (
    <article className="max-w-4xl mx-auto px-6 sm:px-8 py-12 md:py-16 transition-all duration-300">
      
      {/* Category & Actions Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <span className="inline-flex items-center px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 shadow-sm shadow-indigo-600/5">
          {post.category}
        </span>

        {user && user.id === post.author?._id && (
          <Link
            to={`/edit/${post._id}`}
            className="btn-outline-indigo px-4 py-2 text-xs flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <span>Edit Article</span>
          </Link>
        )}
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight tracking-tight mb-6">
        {post.title}
      </h1>

      {/* Author Metadata */}
      <div className="flex items-center gap-3 pb-8 border-b border-slate-100 dark:border-slate-800/80 mb-8">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20">
          {post.author?.name ? post.author.name[0].toUpperCase() : "A"}
        </div>
        <div>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {post.author?.name || "Anonymous Writer"}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            Published {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Featured Image */}
      {post.image && (
        <div className="w-full h-[300px] md:h-[450px] overflow-hidden rounded-3xl mb-12 shadow-lg relative border border-slate-100 dark:border-slate-850">
          <img
            src={post.image.startsWith("http") ? post.image : `${(import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace("/api", "")}${post.image}`}
            className="w-full h-full object-cover"
            alt={post.title}
          />
        </div>
      )}

      {/* Content Body */}
      <div
        className="blog-content max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Engagement */}
      {user && (
        <div className="flex items-center gap-4 py-6 border-y border-slate-100 dark:border-slate-800 mb-12">
          <button
            onClick={toggleLike}
            className={`px-5 py-2.5 rounded-full border font-semibold text-sm transition-all duration-300 flex items-center gap-2 cursor-pointer ${
              isLiked 
                ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50 text-red-500 dark:text-red-400 shadow-sm shadow-red-500/5 hover:bg-red-100/70"
                : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <span>❤️</span>
            <span>{post.likes?.length || 0} {post.likes?.length === 1 ? 'Like' : 'Likes'}</span>
          </button>
        </div>
      )}

      {/* Comments Section */}
      <div className="bg-slate-50/40 dark:bg-slate-900/10 rounded-3xl border border-slate-100/50 dark:border-slate-800/80 p-6 md:p-8">
        <CommentSection postId={id} />
      </div>
    </article>
  );
}
