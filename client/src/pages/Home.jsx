import { useEffect, useState } from "react";
import api from "../api/axios";
import PostCard from "../components/PostCard";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const searchPosts = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await api.get(`/posts/search?q=${query}`);
      setPosts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Search failed:", err);
      setPosts([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    api.get("/posts")
      .then((res) => {
        setPosts(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Fetch posts failed:", err);
        setPosts([]);
      });
  }, []);

  return (
    <section className="bg-slate-50/30 dark:bg-[#0b0f19] min-h-[calc(100vh-76px)] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-16 pb-24">

        {/* HERO / HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 tracking-wider uppercase mb-4 shadow-sm shadow-indigo-600/5">
            ✨ Welcome to ArticleHub
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-none">
            Discover Great{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-950 dark:from-indigo-400 dark:via-indigo-500 dark:to-indigo-200 bg-clip-text text-transparent">
              Insights & Stories
            </span>
          </h1>
          <p className="mt-6 text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-medium">
            Explore premium thoughts, expert articles, and creative stories written by our vibrant community.
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="flex flex-col sm:flex-row gap-3 bg-white dark:bg-slate-900/60 p-2.5 rounded-2xl shadow-xl shadow-slate-100/50 dark:shadow-none border border-slate-100/80 dark:border-slate-800">
            <input
              type="text"
              placeholder="Search articles by title, keywords or content..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border border-transparent focus:outline-none focus:ring-0 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 font-medium bg-transparent"
            />

            <button
              onClick={searchPosts}
              className="btn-indigo px-8 py-3 text-base flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Searching...</span>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>Search</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* POSTS */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-8 h-8 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-slate-500 dark:text-slate-400 font-semibold mt-4 text-sm">Loading articles...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 max-w-md mx-auto shadow-sm">
            <span className="text-3xl">📭</span>
            <p className="text-slate-500 dark:text-slate-400 font-semibold mt-4 text-base">No articles found.</p>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Be the first to write a beautiful story!</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
