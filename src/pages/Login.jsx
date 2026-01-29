import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { SparklesIcon } from "@heroicons/react/outline";
import { Mail, Lock } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const res = await api.post("/auth/login", { email, password });
      loginUser(res.data.user, res.data.token);

      if (res.data.user.role === "teacher") {
        navigate("/teacher/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] px-6">

      {/* Card */}
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-10 text-white">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-indigo-500/20 mb-4">
            <SparklesIcon className="w-7 h-7 text-indigo-400" />
          </div>
          <h2 className="text-3xl font-extrabold mb-2">
            Welcome back
          </h2>
          <p className="text-slate-400 text-sm">
            Log in to continue with{" "}
            <span className="font-semibold text-indigo-400">EduNexa</span>
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-xl mb-6 text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-dark"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-dark"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="group w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 font-bold text-white hover:shadow-xl hover:shadow-indigo-500/30 transition flex items-center justify-center disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-8 text-sm text-center text-slate-400">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-indigo-400 font-semibold hover:underline">
            Create one
          </Link>
        </p>
      </div>

      {/* Input styles */}
      <style>{`
        .input-dark {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border-radius: 0.75rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          outline: none;
          transition: border 0.2s, box-shadow 0.2s;
        }
        .input-dark::placeholder {
          color: #94a3b8;
        }
        .input-dark:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 2px rgba(99,102,241,0.4);
        }
      `}</style>
    </div>
  );
}
