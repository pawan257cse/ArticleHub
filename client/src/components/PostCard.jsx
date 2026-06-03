import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800/80 shadow-sm hover:shadow-xl dark:hover:shadow-indigo-950/10 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      
      {post.image && (
        <div className="overflow-hidden h-48 w-full relative">
          <img
            src={post.image.startsWith("http") ? post.image : `${(import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace("/api", "")}${post.image}`}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent"></div>
        </div>
      )}

      <div className="p-6 flex flex-col flex-1">
        <span className="inline-block w-fit px-2.5 py-0.5 rounded-lg text-xs font-semibold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 mb-3">
          {post.category}
        </span>

        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {post.title}
        </h2>

        <div className="mt-auto pt-6 flex items-center justify-between border-t border-slate-50 dark:border-slate-800/60">
          <Link
            to={`/post/${post._id}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            <span>Read Article</span>
            <svg className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
