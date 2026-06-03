import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Technology");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const navigate = useNavigate();
  const { user } = useAuth();

  const submitPost = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    if (image) formData.append("image", image);

    await api.post("/posts", formData);
    alert("Post saved as draft");
    if (user) {
      navigate(`/profile/${user.id}`);
    } else {
      navigate("/");
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
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
            Create New Post
          </h1>
        </div>

        {/* Title */}
        <input
          className="w-full text-2xl sm:text-3xl font-extrabold border-b border-slate-100 dark:border-slate-800 bg-transparent focus:outline-none focus:border-indigo-500 pb-3 mb-8 placeholder-slate-300 dark:placeholder-slate-600 text-slate-800 dark:text-slate-100 tracking-tight"
          placeholder="Enter a captivating article title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Image Upload */}
        <div className="mb-8 bg-slate-50/50 dark:bg-slate-950/40 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Featured Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 dark:file:bg-indigo-950/30 file:text-indigo-600 dark:file:text-indigo-400 hover:file:bg-indigo-100 dark:hover:file:bg-indigo-950/50 transition cursor-pointer"
          />

          {preview && (
            <div className="mt-4 rounded-xl overflow-hidden shadow-md border border-slate-100 dark:border-slate-800 max-h-64">
              <img
                src={preview}
                className="w-full h-64 object-cover"
                alt="preview"
              />
            </div>
          )}
        </div>

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
        <div className="mb-10">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Select Category
          </label>
          <select
            className="form-input w-64"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>Technology</option>
            <option>Lifestyle</option>
            <option>Business</option>
            <option>Health</option>
            <option>Others</option>
          </select>
        </div>

        {/* Action */}
        <div className="flex justify-end gap-3 pt-6 border-t border-slate-50 dark:border-slate-850">
          <button
            onClick={submitPost}
            className="btn-indigo px-8 py-3 text-base"
          >
            Save as Draft
          </button>
        </div>

      </div>
    </section>
  );
}
