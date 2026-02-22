import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  UserCircle,
  ArrowRight,
  KeyRound,
  SparklesIcon,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();

  const initialRole = location.state?.role || "student";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: initialRole,
    otp: "",
  });

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setFormData((prev) => ({ ...prev, role: initialRole }));
  }, [initialRole]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ===== SEND OTP ===== */
  const sendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setLoading(true);
      await api.post("/auth/signup/send-otp", {
        email: formData.email,
        name: formData.name,
      });

      setSuccess("OTP sent to your email");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ===== VERIFY OTP ===== */
  const verifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setLoading(true);
      await api.post("/auth/signup/verify-otp", {
        email: formData.email,
        otp: formData.otp,
      });
      setSuccess("Email verified successfully");
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ===== FINAL SIGNUP ===== */
  const signup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      await api.post("/auth/signup", {
        username: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
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

      {/* RIGHT SIDE - SIGNUP FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10 bg-[#03050C] lg:overflow-y-auto">

        {/* Subtle mobile background glow */}
        <div className="lg:hidden absolute top-0 left-0 w-full h-96 bg-indigo-600/10 blur-[100px] pointer-events-none" />

        <div className="w-full max-w-[420px] relative z-10">

          <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group">
            <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to website</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">
              Create Account
            </h1>
            <p className="text-slate-400 text-sm sm:text-base font-medium mb-8">
              {formData.role === "teacher" ? "Join as an educator to create amazing courses." : "Join as a student to skyrocket your learning."}
            </p>

            {/* Alerts */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-xl mb-6 flex items-center justify-center text-center shadow-[0_0_15px_rgba(239,68,68,0.1)] font-medium"
                >
                  {error}
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm p-4 rounded-xl mb-6 flex items-center justify-center text-center shadow-[0_0_15px_rgba(16,185,129,0.1)] font-medium"
                >
                  {success}
                </motion.div>
              )}
            </AnimatePresence>

            {/* STEP 1: Basic Info */}
            {step === 1 && (
              <motion.form
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={sendOtp}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-300 ml-1">Full Name</label>
                  <Input icon={User} name="name" placeholder="Atharv Marathe" value={formData.name} onChange={handleChange} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-300 ml-1">Email Address</label>
                  <Input icon={Mail} name="email" type="email" placeholder="name@gmail.com" value={formData.email} onChange={handleChange} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-300 ml-1">Account Type</label>
                  <DisabledInput value={formData.role === "teacher" ? "Teacher Account" : "Student Account"} />
                </div>
                <PrimaryButton loading={loading} text="Send OTP" icon={<Mail className="w-4 h-4 ml-2" />} />
              </motion.form>
            )}

            {/* STEP 2: Verify OTP */}
            {step === 2 && (
              <motion.form
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={verifyOtp}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-300 ml-1">Verification Code</label>
                  <Input icon={KeyRound} name="otp" placeholder="Enter 6-digit OTP" value={formData.otp} onChange={handleChange} maxLength={6} />
                  <p className="text-xs text-slate-500 ml-1">We sent a verification code to {formData.email}</p>
                </div>
                <PrimaryButton loading={loading} text="Verify Code" icon={<CheckCircle2 className="w-4 h-4 ml-2" />} />
              </motion.form>
            )}

            {/* STEP 3: Password */}
            {step === 3 && (
              <motion.form
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={signup}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-300 ml-1">Secure Password</label>
                  <Input icon={Lock} name="password" type="password" placeholder="Create a strong password" value={formData.password} onChange={handleChange} />
                </div>
                <PrimaryButton loading={loading} text="Complete Setup" icon={<ArrowRight className="w-4 h-4 ml-2" />} />
              </motion.form>
            )}

            {/* Footer */}
            <p className="mt-8 text-sm text-center text-slate-400 font-medium">
              Already have an account?{" "}
              <Link to="/login" className="text-white hover:text-indigo-400 transition-colors font-bold">
                Log in
              </Link>
            </p>

          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ===== COMPONENTS ===== */

function Input({ icon: Icon, ...props }) {
  return (
    <div className="relative group/input">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Icon className="text-slate-500 group-focus-within/input:text-indigo-400 transition-colors w-5 h-5" />
      </div>
      <input
        {...props}
        required
        className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-slate-600 outline-none focus:bg-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium shadow-inner"
        inputMode={props.name === "otp" ? "numeric" : undefined}
      />
    </div>
  );
}

function DisabledInput({ value }) {
  return (
    <div className="relative group/input">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <UserCircle className="text-slate-500 w-5 h-5" />
      </div>
      <input
        disabled
        value={value}
        className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-slate-400 outline-none cursor-not-allowed font-medium shadow-inner opacity-75"
      />
    </div>
  );
}

function PrimaryButton({ loading, text, icon }) {
  return (
    <button
      disabled={loading}
      className="w-full py-4 mt-6 rounded-xl relative group overflow-hidden bg-white text-[#03050C] font-black hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center justify-center disabled:opacity-70 disabled:hover:scale-100"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent -translate-x-[150%] skew-x-[-20deg] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out" />
      <span className="relative flex items-center gap-1 text-base">
        {loading ? "Processing..." : (
          <>
            {text}
            {icon}
          </>
        )}
      </span>
    </button>
  );
}
