import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };

  const submit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/register", form);
      alert("Registration successful");
      navigate("/login");
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || "Registration failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-76px)] flex items-center justify-center bg-slate-50/50 dark:bg-[#0b0f19] px-4 py-12 transition-all duration-300">
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-white dark:bg-slate-900 p-8 md:p-10 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/40 dark:shadow-none transition-all duration-300"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-xl mb-4">
            ✍️
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Create Account
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Sign up to start writing on <span className="font-semibold text-indigo-600 dark:text-indigo-400">ArticleHub</span>
          </p>
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="mb-6 p-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium">
            {errors.submit}
          </div>
        )}

        {/* Name */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            Full Name
          </label>
          <input
            name="name"
            value={form.name}
            placeholder="Your full name"
            onChange={handleChange}
            className={`form-input ${errors.name ? "border-red-500 focus:ring-red-500/10" : ""}`}
            required
          />
          {errors.name && <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.name}</p>}
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            Email Address
          </label>
          <input
            name="email"
            type="email"
            value={form.email}
            placeholder="you@example.com"
            onChange={handleChange}
            className={`form-input ${errors.email ? "border-red-500 focus:ring-red-500/10" : ""}`}
            required
          />
          {errors.email && <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.email}</p>}
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            Password
          </label>
          <input
            name="password"
            type="password"
            value={form.password}
            placeholder="••••••••"
            onChange={handleChange}
            className={`form-input ${errors.password ? "border-red-500 focus:ring-red-500/10" : ""}`}
            required
          />
          {errors.password && <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.password}</p>}
          {!errors.password && <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">Minimum 6 characters</p>}
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full btn-indigo py-3 text-base disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

        {/* Footer */}
        <p className="mt-8 text-sm text-center text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="font-semibold text-indigo-600 dark:text-indigo-400 cursor-pointer hover:underline hover:text-indigo-700 dark:hover:text-indigo-300"
          >
            Login
          </span>
        </p>
      </form>
    </section>
  );
}
