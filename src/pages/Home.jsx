import React from "react";
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
  return (
    <div className="relative min-h-screen bg-[#020617] text-slate-200 overflow-x-hidden font-sans">

      {/* ===== BACKGROUND GRID & GLOW ===== */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.15),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.15),transparent_40%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* ================= NAVBAR ================= */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#020617]/80 border-b border-white/10">
        <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-3">
  {/* Logo Icon */}
  <div className="w-9 h-9 rounded-lg bg-indigo-500/20 
                  flex items-center justify-center">
    <Sparkles className="w-5 h-5 text-indigo-400" />
  </div>

  {/* Brand Text */}
  <div className="flex flex-col leading-tight">
    <span className="font-bold text-lg text-white">EduNexa</span>
    <span className="text-[11px] text-slate-400 tracking-wide">
      Smart Learning Platform!!
    </span>
  </div>
</div>



          {/* Actions */}
<div className="flex items-center gap-3">

  {/* Student */}
  <Link
    to="/signup"
    state={{ role: "student" }}
    className="px-4 py-2 rounded-lg border border-white/20 text-sm font-semibold text-slate-200 hover:bg-white/10 transition"
  >
    Student
  </Link>

  {/* Teacher (Primary CTA) */}
  <Link
    to="/signup"
    state={{ role: "teacher" }}
    className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-bold hover:shadow-lg hover:shadow-indigo-500/30 transition"
  >
    Teacher
  </Link>

  {/* Login */}
  <Link
    to="/login"
    className="px-4 py-2 rounded-lg border border-white/20 text-sm font-semibold text-slate-200 hover:bg-white/10 transition"
  >
    Login
  </Link>

</div>


        </nav>
      </header>

      {/* ================= HERO ================= */}
      <section className="relative z-10 pt-28 pb-24 px-6 text-center">
        <div className="max-w-6xl mx-auto">

          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs uppercase tracking-widest text-indigo-400 mb-6">
            <SparklesIcon className="w-4 h-4" />
            AI Powered Learning
          </span>

          <h1 className="text-4xl md:text-7xl font-black leading-tight text-white mb-6">
            Turn Study Material into
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Intelligent Learning
            </span>
          </h1>

          <p className="text-slate-400 text-lg max-w-3xl mx-auto mb-10">
            Upload notes, get instant summaries and practice with AI-generated quizzes.
            Built for students and educators who value clarity.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/signup"
              state={{ role: "student" }}
              className="px-10 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold hover:shadow-xl hover:shadow-indigo-500/40 transition"
            >
              Start Free
            </Link>
            <Link
              to="/login"
              className="px-10 py-4 rounded-xl border border-white/20 font-semibold hover:bg-white/5 transition"
            >
              Let's Go!
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="relative z-10 py-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<CloudUploadIcon className="w-6 h-6" />}
            title="Upload Once"
            desc="PDFs, notes, slides — all supported with smart parsing."
          />
          <FeatureCard
            icon={<DocumentTextIcon className="w-6 h-6" />}
            title="AI Summaries"
            desc="Clear, structured summaries highlighting key concepts."
          />
          <FeatureCard
            icon={<PuzzleIcon className="w-6 h-6" />}
            title="Adaptive Quizzes"
            desc="Auto-generated questions that test real understanding."
          />
        </div>
      </section>

      {/* ================= USERS ================= */}
      <section className="relative z-10 py-24 px-6 bg-white/5 border-y border-white/10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">

          <UserCard
            title="For Students"
            icon={<AcademicCapIcon className="w-8 h-8 text-indigo-400" />}
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
            icon={<UserGroupIcon className="w-8 h-8 text-white" />}
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
      </section>

      {/* ================= CTA ================= */}
      <section className="relative z-10 py-24 px-6 text-center">
        <h2 className="text-4xl font-black text-white mb-4">
          Ready to experience smarter learning?
        </h2>
        <p className="text-slate-400 mb-8 max-w-xl mx-auto">
          Start using EduNexa today and see how AI transforms education.
        </p>
        <Link
          to="/signup"
          className="inline-block px-12 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold hover:shadow-xl hover:shadow-indigo-500/40 transition"
        >
          Get Started Free
        </Link>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="relative z-10 border-t border-white/10 py-10 text-center text-xs text-slate-500">
        © 2026 EduNexa. Crafted for modern education.
      </footer>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:-translate-y-1 transition">
      <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-bold text-lg mb-2 text-white">{title}</h3>
      <p className="text-slate-400 text-sm">{desc}</p>
    </div>
  );
}

function UserCard({ title, icon, description, features, buttonText, role, highlight }) {
  return (
    <div
      className={`rounded-2xl p-10 transition hover:-translate-y-1 hover:shadow-xl ${
        highlight
          ? "bg-gradient-to-br from-indigo-500 to-purple-500 text-white"
          : "bg-[#020617] border border-white/10"
      }`}
    >
      <div
        className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${
          highlight ? "bg-white/20" : "bg-indigo-500/10"
        }`}
      >
        {icon}
      </div>

      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className={`mb-6 ${highlight ? "text-indigo-100" : "text-slate-400"}`}>
        {description}
      </p>

      <ul className={`space-y-3 mb-8 ${highlight ? "text-indigo-100" : "text-slate-400"}`}>
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-2">
            <CheckCircleIcon className="w-4 h-4" />
            {f}
          </li>
        ))}
      </ul>

      <Link
        to="/signup"
        state={{ role }}
        className={`inline-block px-8 py-3 rounded-xl font-bold text-sm transition ${
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
