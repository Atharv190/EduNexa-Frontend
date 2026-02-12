import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import {
  SparklesIcon,
  DocumentTextIcon,
  PuzzleIcon,
  CloudUploadIcon,
  CheckCircleIcon,
  AcademicCapIcon,
  UserGroupIcon,
} from "@heroicons/react/outline";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <div className="relative min-h-screen bg-[#020617] text-slate-200 overflow-x-hidden font-sans">

      {/* ===== BACKGROUND GRID & GLOW ===== */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.15),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.15),transparent_40%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* ================= NAVBAR ================= */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#020617]/80 border-b border-white/10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-14 md:h-16 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-base sm:text-lg text-white">EduNexa</span>
              <span className="text-[10px] sm:text-[11px] text-slate-400 tracking-wide hidden xs:block">
                Smart Learning Platform
              </span>
            </div>
          </Link>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/signup"
              state={{ role: "student" }}
              className="px-3.5 py-1.5 rounded-lg border border-white/20 text-sm font-semibold text-slate-200 hover:bg-white/10 transition"
            >
              Student
            </Link>
            <Link
              to="/signup"
              state={{ role: "teacher" }}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-bold hover:shadow-lg hover:shadow-indigo-500/30 transition"
            >
              Teacher
            </Link>
            <Link
              to="/login"
              className="px-3.5 py-1.5 rounded-lg border border-white/20 text-sm font-semibold text-slate-200 hover:bg-white/10 transition"
            >
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg hover:bg-white/10 transition"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-white" />
            ) : (
              <Menu className="w-5 h-5 text-white" />
            )}
          </button>
        </nav>

        {/* Mobile Menu Dropdown */}
        <div
          className={`md:hidden absolute top-14 left-0 right-0 bg-[#020617]/95 backdrop-blur-xl border-b border-white/10 transition-all duration-200 ${
            mobileMenuOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
        >
          <div className="px-4 py-4 space-y-2">
            <Link
              to="/signup"
              state={{ role: "student" }}
              className="block w-full px-4 py-2.5 rounded-lg border border-white/20 text-sm font-semibold text-slate-200 hover:bg-white/10 transition text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Student Sign Up
            </Link>
            <Link
              to="/signup"
              state={{ role: "teacher" }}
              className="block w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-bold hover:shadow-lg transition text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Teacher Sign Up
            </Link>
            <Link
              to="/login"
              className="block w-full px-4 py-2.5 rounded-lg border border-white/20 text-sm font-semibold text-slate-200 hover:bg-white/10 transition text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
          </div>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="relative z-10 pt-12 sm:pt-14 md:pt-16 pb-12 sm:pb-14 md:pb-16 px-4 sm:px-6 text-center">
        <div className="max-w-6xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] sm:text-xs uppercase tracking-widest text-indigo-400 mb-3 sm:mb-4">
            <SparklesIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            AI Powered Learning
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black leading-tight text-white mb-2 sm:mb-3 px-2">
            Turn Study Material into
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Intelligent Learning
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-3xl mx-auto mb-5 sm:mb-6 px-4">
            Upload notes, get instant summaries and practice with AI-generated quizzes.
            Built for students and educators who value clarity.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-2.5 sm:gap-3 px-4">
            <Link
              to="/signup"
              state={{ role: "student" }}
              className="w-full sm:w-auto px-6 sm:px-7 md:px-8 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold hover:shadow-xl hover:shadow-indigo-500/40 transition text-sm sm:text-base"
            >
              Start Free
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-6 sm:px-7 md:px-8 py-2.5 sm:py-3 rounded-xl border border-white/20 font-semibold hover:bg-white/5 transition text-sm sm:text-base"
            >
              Let's Go!
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="relative z-10 py-12 sm:py-14 md:py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
              Powerful features for smart learning
            </h2>
            <p className="text-sm text-slate-400">
              Everything you need in one platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            <FeatureCard
              icon={<CloudUploadIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
              title="Upload Once"
              desc="PDFs, notes, slides — all supported with smart parsing."
            />
            <FeatureCard
              icon={<DocumentTextIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
              title="AI Summaries"
              desc="Clear, structured summaries highlighting key concepts."
            />
            <FeatureCard
              icon={<PuzzleIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
              title="Adaptive Quizzes"
              desc="Auto-generated questions that test real understanding."
            />
          </div>
        </div>
      </section>

      {/* ================= USERS ================= */}
      <section className="relative z-10 py-12 sm:py-14 md:py-16 px-4 sm:px-6 bg-white/5 border-y border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
              Designed for everyone
            </h2>
            <p className="text-sm text-slate-400">
              Choose your path to smarter learning
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-5 sm:gap-6">
            <UserCard
              title="For Students"
              icon={<AcademicCapIcon className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-400" />}
              description="Study faster, revise smarter, and retain more."
              features={[
                "Instant summaries",
                "Practice quizzes",
                "Better focus",
                "Mobile friendly",
              ]}
              buttonText="Join as Student"
              role="student"
            />

            <UserCard
              title="For Teachers"
              icon={<UserGroupIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />}
              description="Upload once and help your entire class learn better."
              features={[
                "Centralized material",
                "Student insights",
                "Auto assessments",
                "Save time",
              ]}
              buttonText="Join as Teacher"
              role="teacher"
              highlight
            />
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="relative z-10 py-12 sm:py-14 md:py-16 px-4 sm:px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-2 px-4">
              Ready to experience smarter learning?
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mb-4 sm:mb-5 max-w-xl mx-auto px-4">
              Start using EduNexa today and see how AI transforms education.
            </p>
            <Link
              to="/signup"
              className="inline-block w-full sm:w-auto px-8 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold hover:shadow-xl hover:shadow-indigo-500/40 transition text-sm sm:text-base"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="relative z-10 border-t border-white/10 py-5 sm:py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] sm:text-xs text-slate-500">
          <span>© 2026 EduNexa. Crafted for modern education.</span>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-slate-300 transition">Privacy</Link>
            <Link to="/terms" className="hover:text-slate-300 transition">Terms</Link>
            <Link to="/contact" className="hover:text-slate-300 transition">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5 sm:p-6 hover:bg-white/10 hover:-translate-y-1 transition">
      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-2.5 sm:mb-3">
        {icon}
      </div>
      <h3 className="font-bold text-base sm:text-lg mb-1.5 text-white">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{desc}</p>
    </div>
  );
}

function UserCard({ title, icon, description, features, buttonText, role, highlight }) {
  return (
    <div
      className={`rounded-xl p-5 sm:p-6 transition hover:-translate-y-1 hover:shadow-xl ${
        highlight
          ? "bg-gradient-to-br from-indigo-500 to-purple-500 text-white"
          : "bg-white/5 border border-white/10 hover:bg-white/10"
      }`}
    >
      <div
        className={`inline-flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-lg mb-3 sm:mb-4 ${
          highlight ? "bg-white/20" : "bg-indigo-500/10"
        }`}
      >
        {icon}
      </div>

      <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-2.5">{title}</h3>
      <p className={`text-sm mb-3 sm:mb-4 ${highlight ? "text-indigo-100" : "text-slate-400"}`}>
        {description}
      </p>

      <ul className={`space-y-1.5 sm:space-y-2 mb-4 sm:mb-5 text-sm ${highlight ? "text-indigo-100" : "text-slate-400"}`}>
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-1.5">
            <CheckCircleIcon className={`w-4 h-4 flex-shrink-0 ${highlight ? "text-white" : "text-indigo-400"}`} />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <Link
        to="/signup"
        state={{ role }}
        className={`inline-block w-full sm:w-auto px-5 sm:px-6 py-2 rounded-lg font-bold text-xs sm:text-sm transition text-center ${
          highlight
            ? "bg-white text-indigo-600 hover:bg-indigo-50"
            : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-lg"
        }`}
      >
        {buttonText}
      </Link>
    </div>
  );
}