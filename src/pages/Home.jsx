import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SparklesIcon,
  DocumentTextIcon,
  PuzzleIcon,
  CloudUploadIcon,
  CheckCircleIcon,
  AcademicCapIcon,
  UserGroupIcon,
} from "@heroicons/react/outline";

// --- Animation Variants ---
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 60, damping: 15 } },
};

const floatingOrb = {
  animate: {
    y: [0, -15, 0],
    scale: [1, 1.05, 1],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add scroll listener for navbar blur effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#03050C] text-slate-200 overflow-x-hidden font-sans selection:bg-indigo-500/30 selection:text-indigo-200">

      {/* ===== BACKGROUND GRID & GLOW ===== */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Animated glowing orbs */}
        <motion.div
          variants={floatingOrb}
          animate="animate"
          className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-indigo-600/15 blur-[120px] mix-blend-screen pointer-events-none"
        />
        <motion.div
          variants={floatingOrb}
          animate="animate"
          style={{ animationDelay: '-3s' }}
          className="absolute bottom-[20%] right-[-10%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] rounded-full bg-fuchsia-600/10 blur-[150px] mix-blend-screen pointer-events-none"
        />

        {/* Premium subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_80%,transparent_100%)]" />
      </div>

      {/* ================= NAVBAR ================= */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 sm:top-4 inset-x-0 sm:inset-x-6 lg:max-w-5xl lg:mx-auto z-50 transition-all duration-500 ${scrolled
          ? "sm:rounded-full bg-[#03050C]/60 backdrop-blur-xl border-b sm:border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.4)] px-4 sm:px-2 py-2 sm:py-1.5"
          : "bg-transparent border-b sm:border border-transparent py-4 sm:py-2 px-4 sm:px-2"
          }`}
      >
        <nav className="relative h-12 flex items-center justify-between px-2">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group relative z-50">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 flex items-center justify-center border border-white/10 group-hover:border-indigo-500/40 transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.15)] group-hover:shadow-[0_0_25px_rgba(99,102,241,0.3)]">
              <Sparkles className="w-5 h-5 text-indigo-400 group-hover:text-fuchsia-400 transition-colors" />
            </div>
            <span className="font-extrabold text-xl text-white tracking-tight flex items-center gap-1.5">
              EduNexa
            </span>
          </Link>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/5">
            <Link
              to="/signup"
              state={{ role: "student" }}
              className="px-5 py-2 rounded-full text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all"
            >
              Student
            </Link>
            <Link
              to="/login"
              className="px-5 py-2 rounded-full text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              state={{ role: "teacher" }}
              className="relative group px-6 py-2 rounded-full bg-white text-[#03050C] text-sm font-bold overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] ml-1"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-fuchsia-100 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative flex items-center gap-2">
                Join as Teacher <ArrowRight className="w-4 h-4 ml-0.5" />
              </span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden relative z-50 p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors focus:outline-none"
          >
            <AnimatePresence mode="wait">
              {mobileMenuOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                  <X className="w-5 h-5 text-white" />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                  <Menu className="w-5 h-5 text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </nav>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 top-[4rem] sm:top-[5rem] -mx-4 sm:-mx-6 z-40 bg-[#03050C]/60 backdrop-blur-md md:hidden min-h-screen"
                onClick={() => setMobileMenuOpen(false)}
              />
              {/* Menu Card */}
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 right-0 mt-2 sm:mt-4 mx-2 sm:mx-0 z-50 md:hidden overflow-hidden bg-[#0a0d16] border border-white/10 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
              >
                <div className="p-4 flex flex-col gap-3">
                  <Link
                    to="/signup"
                    state={{ role: "student" }}
                    className="w-full px-5 py-3.5 rounded-xl bg-white/5 border border-white/5 text-sm font-semibold text-white hover:bg-white/10 transition-all flex items-center gap-3"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <AcademicCapIcon className="w-5 h-5" />
                    </div>
                    Student Sign Up
                  </Link>
                  <Link
                    to="/signup"
                    state={{ role: "teacher" }}
                    className="relative group overflow-hidden w-full px-5 py-3.5 rounded-xl bg-white text-[#03050C] text-sm font-bold shadow-lg transition-all flex items-center gap-3"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-fuchsia-100 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10 flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#03050C]/10 flex items-center justify-center">
                          <UserGroupIcon className="w-5 h-5 text-[#03050C]" />
                        </div>
                        Teacher Sign Up
                      </div>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </Link>
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-2" />
                  <Link
                    to="/login"
                    className="w-full px-5 py-3 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    I already have an account
                  </Link>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.header>

      <main className="pt-16 md:pt-20">
        {/* ================= HERO ================= */}
        <section className="relative z-10 pt-8 pb-10 sm:pt-12 sm:pb-16 md:pt-16 md:pb-20 px-4 sm:px-6 text-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="max-w-4xl mx-auto flex flex-col items-center"
          >
            <motion.div variants={fadeUp} className="mb-4">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[11px] sm:text-xs font-semibold text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)] tracking-wide uppercase">
                <SparklesIcon className="w-3.5 h-3.5" />
                <span>Next-Gen AI Platform</span>
              </div>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] font-black leading-[1.05] text-white mb-4 tracking-tight"
            >
              Study Smarter, Not
              <br />
              <span className="inline-block mt-1 sm:mt-2 bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-rose-400 bg-clip-text text-transparent pb-1 sm:pb-2">
                Harder with AI.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-sm sm:text-base md:text-lg text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed font-medium px-2"
            >
              Upload your notes, PDFs, or slides. Get instant structured summaries,
              flashcards, and adaptive practice quizzes designed to test real understanding.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
              <Link
                to="/signup"
                state={{ role: "student" }}
                className="group relative w-full sm:w-auto px-7 py-3 sm:py-3.5 rounded-full bg-white text-[#03050C] font-black hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)]"
              >
                Get Started Free
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-7 py-3 sm:py-3.5 rounded-full border border-white/20 bg-white/5 font-semibold text-white hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
              >
                Login
              </Link>
            </motion.div>

            {/* Social Proof metrics */}
            <motion.div variants={fadeUp} className="mt-12 sm:mt-16 pt-6 border-t border-white/10 w-full max-w-3xl flex flex-wrap justify-center gap-6 sm:gap-14">
              {[
                { label: "Active Students", value: "50k+" },
                { label: "Documents Parsed", value: "1M+" },
                { label: "Hours Saved", value: "2M+" },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className="text-xl sm:text-2xl font-black text-white">{stat.value}</span>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* ================= FEATURES ================= */}
        <section id="features" className="relative z-10 py-12 sm:py-16 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="text-center mb-10"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">
                Everything you need to <span className="text-indigo-400">excel.</span>
              </h2>
              <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
                Our suite of AI tools is designed specifically to enhance comprehension,
                retention, and analytical thinking.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <FeatureCard
                delay={0.1}
                icon={<CloudUploadIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
                title="Universal Upload"
                desc="Instantly process PDFs, Word docs, PowerPoint slides, or handwritten notes with state-of-the-art OCR."
                color="indigo"
              />
              <FeatureCard
                delay={0.2}
                icon={<DocumentTextIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
                title="Smart Summarization"
                desc="Get concise, structured summaries that highlight key concepts, definitions, and formulas automatically."
                color="fuchsia"
              />
              <FeatureCard
                delay={0.3}
                icon={<PuzzleIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
                title="Adaptive Quizzes"
                desc="AI generates context-aware multiple choice, true/false, and short answer questions based on your material."
                color="rose"
              />
            </div>
          </div>
        </section>

        {/* ================= USERS SECTION ================= */}
        <section className="relative z-10 py-14 sm:py-20 px-4 sm:px-6 bg-white/[0.02] border-y border-white/5 relative overflow-hidden">
          {/* Subtle decoration inside users section */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-5xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              className="text-center mb-10"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-3">
                Designed for ambitious minds
              </h2>
              <p className="text-sm sm:text-base text-slate-400">
                Choose the experience tailored exactly for your goals.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
              <UserCard
                delay={0.1}
                title="For Students"
                icon={<AcademicCapIcon className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-400" />}
                description="Turbocharge your study sessions, prepare for exams faster, and ensure long term retention of complex subjects."
                features={[
                  "Instant document summarization",
                  "AI-generated flashcards",
                  "Personalized weak-spot targeting",
                  "Dark mode mobile & desktop apps",
                ]}
                buttonText="Join as Student"
                role="student"
              />

              <UserCard
                delay={0.2}
                title="For Educators"
                icon={<UserGroupIcon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />}
                description="Easily distribute interactive learning materials, track class comprehension, and automate preliminary grading."
                features={[
                  "Centralized class materials",
                  "Automated formative assessments",
                  "Real-time student insights dashboard",
                  "Exportable analytical reports",
                ]}
                buttonText="Join as Educator"
                role="teacher"
                highlight
              />
            </div>
          </div>
        </section>

        {/* ================= CTA ================= */}
        <section className="relative z-10 py-12 sm:py-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-[2rem] sm:rounded-[2.5rem] blur-lg sm:blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-700" />
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative bg-white/[0.03] border border-white/10 rounded-[2rem] sm:rounded-[2.5rem] p-8 sm:p-12 text-center overflow-hidden backdrop-blur-md"
            >
              <div className="relative z-10">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4 sm:mb-5">
                  Ready to transform your workflow?
                </h2>
                <p className="text-sm sm:text-base text-slate-400 mb-8 max-w-xl mx-auto font-medium">
                  Join thousands of early adopters using EduNexa to digest information 10x faster and retain it longer.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    to="/signup"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-[#03050C] font-black hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2"
                  >
                    Start for Free <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="relative z-10 border-t border-white/10 bg-[#03050C] py-6 sm:py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
            <span className="font-bold text-white tracking-tight">EduNexa</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium text-slate-400">
            <Link to="/about" className="hover:text-white transition-colors">About</Link>
            <Link to="/features" className="hover:text-white transition-colors">Features</Link>
            <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>

          <span className="text-xs sm:text-sm font-medium text-slate-500">
            © {new Date().getFullYear()} EduNexa Inc.
          </span>
        </div>
      </footer>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function FeatureCard({ icon, title, desc, color, delay }) {
  // Determine gradient colors based on prop
  const colorMap = {
    indigo: "from-indigo-500/20 to-indigo-500/5 text-indigo-400 border-indigo-500/20 group-hover:border-indigo-500/50",
    fuchsia: "from-fuchsia-500/20 to-fuchsia-500/5 text-fuchsia-400 border-fuchsia-500/20 group-hover:border-fuchsia-500/50",
    rose: "from-rose-500/20 to-rose-500/5 text-rose-400 border-rose-500/20 group-hover:border-rose-500/50",
  };

  const selectedStyle = colorMap[color] || colorMap.indigo;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="group relative bg-[#09090b]/40 backdrop-blur-sm border border-white/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:bg-white/[0.03] transition-colors overflow-hidden"
    >
      <div className={`absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${colorMap[color].split(" ")[0]} ${colorMap[color].split(" ")[1]} rounded-2xl sm:rounded-3xl pointer-events-none`} />

      <div className="relative z-10">
        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mb-5 sm:mb-6 bg-gradient-to-br ${selectedStyle} border`}>
          {icon}
        </div>
        <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3 text-white tracking-tight">{title}</h3>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-medium">{desc}</p>
      </div>
    </motion.div>
  );
}

function UserCard({ title, icon, description, features, buttonText, role, highlight, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -4 }}
      className={`group relative rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 transition-all duration-300 ${highlight
        ? "bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 text-white shadow-[0_15px_30px_rgba(99,102,241,0.15)]"
        : "bg-white/[0.03] border border-white/10 hover:border-white/20"
        }`}
    >
      <div className="relative z-10">
        <div
          className={`inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl mb-5 sm:mb-6 shadow-inherit ${highlight ? "bg-white/20 backdrop-blur-md border border-white/20" : "bg-white/5 border border-white/10"
            }`}
        >
          {icon}
        </div>

        <h3 className="text-xl sm:text-2xl md:text-3xl font-black mb-3 sm:mb-4 tracking-tight">{title}</h3>
        <p className={`text-sm sm:text-base font-medium mb-6 sm:mb-8 leading-relaxed ${highlight ? "text-indigo-100" : "text-slate-400"}`}>
          {description}
        </p>

        <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-10">
          {features.map((f, i) => (
            <div key={i} className="flex items-start gap-3">
              <CheckCircleIcon className={`w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5 ${highlight ? "text-white" : "text-indigo-400"}`} />
              <span className={`text-sm sm:text-base font-medium ${highlight ? "text-white" : "text-slate-300"}`}>{f}</span>
            </div>
          ))}
        </div>

        <Link
          to="/signup"
          state={{ role }}
          className={`inline-flex w-full px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base transition-all text-center items-center justify-center gap-2 group-hover:scale-[1.02] active:scale-[0.98] ${highlight
            ? "bg-white text-indigo-600 shadow-xl hover:shadow-2xl"
            : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-md"
            }`}
        >
          {buttonText} <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}