import { useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Eye, EyeOff, GraduationCap, Loader2, Lock, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { user, login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setServerError("");
    const er = {};
    if (!username.trim()) er.username = "Username is required";
    if (!password) er.password = "Password is required";
    setErrors(er);
    if (Object.keys(er).length) return;

    try {
      setLoading(true);
      await login(username.trim(), password);
      toast.success("Welcome back!");
    } catch (err) {
      setServerError(
        err.response?.status === 401
          ? "Invalid username or password"
          : "Cannot reach the server. Is the backend running?"
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (hasError) =>
    `w-full rounded-xl border bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:ring-4 ${
      hasError
        ? "border-red-400 focus:ring-red-100"
        : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100"
    }`;

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-linear-to-br from-indigo-600 via-violet-600 to-purple-700 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-fuchsia-400/20 blur-3xl" />
        <div className="relative flex items-center gap-3">
          <div className="rounded-xl bg-white/20 p-2.5 backdrop-blur">
            <GraduationCap size={28} />
          </div>
          <span className="text-xl font-bold tracking-tight">EduManage</span>
        </div>
        <div className="relative">
          <h2 className="text-4xl font-bold leading-tight">
            Manage your students
            <br />
            in one place.
          </h2>
          <p className="mt-4 max-w-md text-indigo-100">
            Add, update and organise student records with a fast, clean dashboard.
          </p>
        </div>
        <p className="relative text-sm text-indigo-200">© {new Date().getFullYear()} EduManage</p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-slate-50 p-6">
        <form onSubmit={submit} noValidate className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="rounded-lg bg-indigo-600 p-2 text-white">
              <GraduationCap size={22} />
            </div>
            <span className="text-lg font-bold">EduManage</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Sign in</h1>
          <p className="mt-2 text-sm text-slate-500">Enter your credentials to access the dashboard.</p>

          {serverError && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {serverError}
            </div>
          )}

          <div className="mt-6 space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Username</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setErrors((x) => ({ ...x, username: undefined }));
                  }}
                  autoComplete="username"
                  placeholder="admin"
                  className={inputClass(errors.username)}
                />
              </div>
              {errors.username && <p className="mt-1 text-xs text-red-600">{errors.username}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((x) => ({ ...x, password: undefined }));
                  }}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={inputClass(errors.password) + " pr-10"}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label="Toggle password visibility"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}