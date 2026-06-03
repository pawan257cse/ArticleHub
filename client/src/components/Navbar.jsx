import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bg-white/80 dark:bg-[#0b0f19]/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-900/50 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2 hover:opacity-95 transition-all duration-300"
          onClick={() => setOpen(false)}
        >
          <span className="bg-indigo-600/10 dark:bg-indigo-500/15 p-1.5 rounded-lg text-lg leading-none">✍️</span>
          <span className="bg-gradient-to-r from-slate-900 to-indigo-950 dark:from-white dark:to-indigo-300 bg-clip-text text-transparent">ArticleHub</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-sm font-semibold tracking-wide">
          <div className="flex items-center gap-5">
            <NavLink to="/" className="nav-link">Home</NavLink>
            {user && <NavLink to="/create" className="nav-link">Create</NavLink>}
            {user && <NavLink to={`/profile/${user.id}`} className="nav-link">Profile</NavLink>}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-100 transition cursor-pointer ml-1"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            )}
          </button>

          {/* Auth Actions Group */}
          <div className="flex items-center gap-2.5 ml-1">
            {!user && (
              <NavLink to="/login" className="btn-outline-indigo">Login</NavLink>
            )}
            {!user && (
              <NavLink to="/register" className="btn-indigo">Register</NavLink>
            )}
            {user && (
              <button onClick={logout} className="btn-outline-red">
                Logout
              </button>
            )}
          </div>
        </div>

        {/* Mobile Hamburger & Toggle Container */}
        <div className="md:hidden flex items-center gap-3">
          {/* Mobile Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            )}
          </button>

          <button
            className="p-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 focus:outline-none transition"
            onClick={() => setOpen(!open)}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white/95 dark:bg-[#0b0f19]/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-900 px-6 py-6 transition-all duration-300 shadow-lg">
          <div className="flex flex-col space-y-4 text-sm font-semibold">
            
            <NavLink
              to="/"
              className="mobile-link"
              onClick={() => setOpen(false)}
            >
              Home
            </NavLink>

            {user && (
              <NavLink
                to="/create"
                className="mobile-link"
                onClick={() => setOpen(false)}
              >
                Create
              </NavLink>
            )}

            {user && (
              <NavLink
                to={`/profile/${user.id}`}
                className="mobile-link"
                onClick={() => setOpen(false)}
              >
                Profile
              </NavLink>
            )}

            {!user && (
              <NavLink
                to="/login"
                className="mobile-link text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20"
                onClick={() => setOpen(false)}
              >
                Login
              </NavLink>
            )}

            {!user && (
              <NavLink
                to="/register"
                className="mobile-link text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20"
                onClick={() => setOpen(false)}
              >
                Register
              </NavLink>
            )}

            {user && (
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="text-left mobile-link text-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/10"
              >
                Logout
              </button>
            )}

          </div>
        </div>
      )}
    </nav>
  );
}
