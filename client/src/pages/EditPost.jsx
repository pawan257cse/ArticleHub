import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import api from "../api/axios";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Technology");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    api.get(`/posts/${id}`)
      .then(res => {
        if (!res.data) return;
        setTitle(res.data.title || "");
        setContent(res.data.content || "");
        setCategory(res.data.category || "Technology");
        if (res.data.image) {
          const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
          const serverBase = apiBase.replace("/api", "");
          const fullImageUrl = res.data.image.startsWith("http") ? res.data.image : `${serverBase}${res.data.image}`;
          setPreview(fullImageUrl);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0b0f19] text-slate-500 dark:text-slate-400 transition-all duration-300">
        Loading post...
      </div>
    );
  }

  const updatePost = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    if (image) formData.append("image", image);

    await api.put(`/posts/${id}`, formData);
    navigate(`/post/${id}`);
  };

  return (
    <section className="bg-slate-50/30 dark:bg-[#0b0f19] min-h-[calc(100vh-76px)] py-12 md:py-16 transition-all duration-300">
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/40 dark:shadow-none px-6 sm:px-10 py-10 transition-all duration-300">

        {/* Header */}
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Authoring Studio
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
            Edit Post
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
            Update your article content and details.
          </p>
        </div>

        {/* Title */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a captivating article title..."
          className="w-full text-2xl sm:text-3xl font-extrabold border-b border-slate-100 dark:border-slate-800 pb-3 mb-8 focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 placeholder-slate-300 dark:placeholder-slate-600 bg-transparent tracking-tight"
        />

        {/* Editor */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Article Content
          </label>
          <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <ReactQuill value={content} onChange={setContent} />
          </div>
        </div>

        {/* Category */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Select Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-input w-64"
          >
            <option>Technology</option>
            <option>Lifestyle</option>
            <option>Business</option>
            <option>Health</option>
          </select>
        </div>

        {/* Image Upload */}
        <div className="mb-10 bg-slate-50/50 dark:bg-slate-950/40 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Update Featured Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 dark:file:bg-indigo-950/30 file:text-indigo-600 dark:file:text-indigo-400 hover:file:bg-indigo-100 dark:hover:file:bg-indigo-950/50 transition cursor-pointer mb-4"
          />

          {preview && (
            <div className="rounded-xl overflow-hidden shadow-md border border-slate-100 dark:border-slate-800 max-h-64">
              <img
                src={preview}
                className="w-full h-64 object-cover"
                alt="preview"
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t border-slate-50 dark:border-slate-850">
          <button
            onClick={() => navigate(-1)}
            className="btn-outline-indigo px-6 py-2.5"
          >
            Cancel
          </button>

          <button
            onClick={updatePost}
            className="btn-indigo px-8 py-2.5"
          >
            Update Post
          </button>
        </div>

      </div>
    </section>
  );
}
