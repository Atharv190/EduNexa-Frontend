import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { SparklesIcon } from "@heroicons/react/outline";
import { Mail, Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

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
    <div className="min-h-[100dvh] w-full flex bg-[#03050C] font-sans selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden">

      {/* LEFT SIDE - VISUAL Showcase (Hidden on Mobile) */}
      <div className="hidden lg:flex relative w-1/2 items-center justify-center p-12 overflow-hidden border-r border-white/5">

        {/* Abstract Background Elements */}
        <div className="absolute inset-0 z-0">
          {/* Deep dark base */}
          <div className="absolute inset-0 bg-[#03050C]" />
          {/* Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]" />

          {/* Animated glowing orbs */}
          <motion.div
            animate={{ y: [0, -40, 0], scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[20%] left-[10%] w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-[120px] mix-blend-screen pointer-events-none"
          />
          <motion.div
            animate={{ y: [0, 40, 0], scale: [1, 1.1, 1], rotate: [0, -90, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: -5 }}
            className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] rounded-full bg-purple-600/20 blur-[130px] mix-blend-screen pointer-events-none"
          />
          <motion.div
            animate={{ x: [0, 30, 0], scale: [1, 1.3, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: -10 }}
            className="absolute top-[40%] left-[40%] w-[400px] h-[400px] rounded-full bg-rose-600/10 blur-[100px] mix-blend-screen pointer-events-none"
          />
        </div>

        {/* Floating Showcase Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 w-full max-w-lg bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 shadow-[0_0_80px_rgba(0,0,0,0.5)]"
        >
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 mb-8 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
            <SparklesIcon className="w-8 h-8 text-indigo-400" />
          </div>

          <h2 className="text-4xl font-black text-white mb-6 leading-tight tracking-tight">
            Unlock your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-rose-400">
              maximum potential.
            </span>
          </h2>

          <div className="space-y-4 mb-2">
            {[
              "AI-powered flashcards & quizzes",
              "Instant document summarization",
              "Personalized learning paths",
              "Real-time progress analytics"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-300">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <span className="text-sm font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* RIGHT SIDE - LOGIN FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10 bg-[#03050C] lg:overflow-y-auto">

        {/* Subtle mobile background glow */}
        <div className="lg:hidden absolute top-0 left-0 w-full h-96 bg-indigo-600/10 blur-[100px] pointer-events-none" />

        <div className="w-full max-w-[420px] relative z-10">

          <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-10 group">
            <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to website</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight">
              Welcome back
            </h1>
            <p className="text-slate-400 text-sm sm:text-base font-medium mb-10">
              Enter your credentials to access your account.
            </p>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-xl mb-6 flex items-center justify-center text-center shadow-[0_0_15px_rgba(239,68,68,0.1)] font-medium"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-300 ml-1">Email Address</label>
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="text-slate-500 group-focus-within/input:text-indigo-400 transition-colors w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-slate-600 outline-none focus:bg-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium shadow-inner"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-sm font-semibold text-slate-300">Password</label>
                  <Link to="#" className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="text-slate-500 group-focus-within/input:text-indigo-400 transition-colors w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-slate-600 outline-none focus:bg-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium shadow-inner"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-4 rounded-xl relative group overflow-hidden bg-white text-[#03050C] font-black hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center justify-center disabled:opacity-70 disabled:hover:scale-100"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent -translate-x-[150%] skew-x-[-20deg] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out" />
                <span className="relative flex items-center gap-2 text-base">
                  {loading ? "Signing in..." : "Sign in to your account"} <ArrowRight className="w-4 h-4 ml-1" />
                </span>
              </button>
            </form>

            {/* Footer */}
            <p className="mt-8 text-sm text-center text-slate-400 font-medium">
              New to EduNexa?{" "}
              <Link to="/signup" className="text-white hover:text-indigo-400 transition-colors font-bold">
                Create an account
              </Link>
            </p>

          </motion.div>
        </div>
      </div>
    </div>
  );
}
