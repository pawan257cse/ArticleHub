import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); 
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", form);
      login(res.data);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid email or password"
      );
    }
  };

  return (
    <section className="min-h-[calc(100vh-76px)] flex items-center justify-center bg-slate-50/50 dark:bg-[#0b0f19] px-4 py-12 transition-all duration-300">
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-white dark:bg-slate-900 p-8 md:p-10 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/40 dark:shadow-none"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-xl mb-4">
            ✍️
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Login to continue to <span className="font-semibold text-indigo-600 dark:text-indigo-400">ArticleHub</span>
          </p>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-6 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 px-4 py-3 text-sm text-red-600 dark:text-red-400 font-medium">
            {error}
          </div>
        )}

        {/* Email */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Email Address
          </label>
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Password
          </label>
          <input
            name="password"
            type="password"
            placeholder="••••••••"
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full btn-indigo py-3 text-base"
        >
          Login to Account
        </button>

        {/* Register link */}
        <p className="mt-8 text-sm text-center text-slate-500 dark:text-slate-400">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="font-semibold text-indigo-600 dark:text-indigo-400 cursor-pointer hover:underline hover:text-indigo-700 dark:hover:text-indigo-300"
          >
            Create one free
          </span>
        </p>
      </form>
    </section>
  );
}
