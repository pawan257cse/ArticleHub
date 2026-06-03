import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { userId } = useParams();
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);

  const isOwnProfile = user && user.id === userId;

  useEffect(() => {
    const endpoint = isOwnProfile ? "/posts/my" : `/posts/user/${userId}`;
    api.get(endpoint)
      .then((res) => {
        setPosts(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Fetch profile posts failed:", err);
        setPosts([]);
      });
  }, [userId, isOwnProfile]);

  const publishPost = async (id) => {
    await api.patch(`/posts/${id}/status`);
    setPosts(posts.map((p) =>
      p._id === id ? { ...p, status: "published" } : p
    ));
  };

  return (
    <section className="bg-slate-50/30 dark:bg-[#0b0f19] min-h-[calc(100vh-76px)] py-12 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Profile Card Header */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-100/40 dark:shadow-none mb-12 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden transition-all duration-300">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/40 dark:bg-indigo-950/20 rounded-full blur-3xl -z-10"></div>
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 via-indigo-600 to-indigo-950 flex items-center justify-center text-3xl text-white shadow-lg shadow-indigo-500/20 dark:shadow-indigo-950/40 shrink-0">
            👤
          </div>
          <div className="text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Writer Profile
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
              {isOwnProfile ? "My Publications" : "User Publications"}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base font-medium">
              {isOwnProfile ? "Manage your articles, draft publications, and editorial posts" : "Explore and read beautiful articles from this author"}
            </p>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 max-w-md mx-auto shadow-sm">
            <span className="text-3xl">📝</span>
            <p className="text-slate-500 dark:text-slate-400 font-semibold mt-4 text-base">No articles found.</p>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
              {isOwnProfile ? "You haven't written any articles yet." : "This author hasn't published any articles yet."}
            </p>
          </div>
        ) : (
          /* GRID VIEW */
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <div
                key={post._id}
                className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100/80 dark:border-slate-800 shadow-sm hover:shadow-xl dark:hover:shadow-indigo-950/10 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden flex flex-col h-full"
              >
                {/* IMAGE */}
                {post.image && (
                  <div className="overflow-hidden h-44 w-full relative">
                    <img
                      src={post.image.startsWith("http") ? post.image : `${(import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace("/api", "")}${post.image}`}
                      alt={post.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent"></div>
                  </div>
                )}

                {/* CONTENT */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-block px-2 py-0.5 rounded-lg text-xs font-semibold uppercase tracking-wider bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                      {post.category}
                    </span>

                    {/* STATUS */}
                    {isOwnProfile && (
                      <span
                        className={`inline-block px-2.5 py-0.5 text-xs font-bold rounded-lg uppercase tracking-wider
                          ${
                            post.status === "draft"
                              ? "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50"
                              : "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50"
                          }`}
                      >
                        {post.status}
                      </span>
                    )}
                  </div>

                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {post.title}
                  </h2>

                  {/* ACTIONS */}
                  {isOwnProfile && (
                    <div className="mt-auto pt-6 flex items-center gap-3 border-t border-slate-50 dark:border-slate-800/80">
                      <Link
                        to={`/edit/${post._id}`}
                        className="btn-outline-indigo px-4 py-2 text-xs flex-1 text-center justify-center flex items-center"
                      >
                        Edit
                      </Link>

                      {post.status === "draft" && (
                        <button
                          onClick={() => publishPost(post._id)}
                          className="btn-indigo px-4 py-2 text-xs flex-1 text-center justify-center flex items-center"
                        >
                          Publish
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
