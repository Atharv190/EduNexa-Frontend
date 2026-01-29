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
} from "lucide-react";

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
  name: formData.name,   // ✅ ADD THIS
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
    <div className="min-h-screen flex items-center justify-center bg-[#020617] px-6">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-9 shadow-[0_20px_60px_rgba(0,0,0,0.6)] text-white">

        {/* Header */}
        <div className="text-center mb-7">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Create {formData.role === "teacher" ? "Teacher" : "Student"} Account
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Secure signup with email verification
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm">
            {success}
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <form onSubmit={sendOtp} className="space-y-4">
            <Input icon={User} name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} />
            <Input icon={Mail} name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} />
            <DisabledInput value={formData.role === "teacher" ? "Teacher Account" : "Student Account"} />
            <PrimaryButton loading={loading} text="Send OTP" />
          </form>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <form onSubmit={verifyOtp} className="space-y-4">
            <Input icon={KeyRound} name="otp" placeholder="Enter 6-digit OTP" value={formData.otp} onChange={handleChange} maxLength={6} />
            <PrimaryButton loading={loading} text="Verify OTP" />
          </form>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <form onSubmit={signup} className="space-y-4">
            <Input icon={Lock} name="password" type="password" placeholder="Create Password" value={formData.password} onChange={handleChange} />
            <PrimaryButton loading={loading} text="Create Account" />
          </form>
        )}

        <p className="mt-7 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

/* ===== COMPONENTS ===== */

function Input({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
      <input
        {...props}
        required
        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#020617] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition"
        inputMode={props.name === "otp" ? "numeric" : undefined}
      />
    </div>
  );
}

function DisabledInput({ value }) {
  return (
    <div className="relative">
      <UserCircle className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
      <input
        disabled
        value={value}
        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 cursor-not-allowed"
      />
    </div>
  );
}

function PrimaryButton({ loading, text }) {
  return (
    <button
      disabled={loading}
      className="group w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 font-bold text-white hover:shadow-xl hover:shadow-indigo-500/30 transition flex items-center justify-center gap-2 disabled:opacity-70"
    >
      {loading ? "Please wait..." : (
        <>
          {text}
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </>
      )}
    </button>
  );
}
