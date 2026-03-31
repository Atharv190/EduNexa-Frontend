import { Menu, X, Moon, Sun, Sparkles, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const theme = {
    dark: {
      bg: "bg-[#0A0C12]",
      bgGradient: "from-[#0A0C12] via-[#0F1117] to-[#0A0C12]",
      cardBg: "bg-[#0F1117]/80",
      cardBorder: "border-white/10",
      cardHover: "hover:bg-white/[0.05]",
      text: "text-white",
      textSecondary: "text-gray-400",
      textMuted: "text-gray-500",
      accent: "text-indigo-400",
      accentBg: "bg-indigo-500/10",
      accentBorder: "border-indigo-500/20",
      headerBg: scrolled ? "bg-[#0F1117]/90" : "bg-transparent",
      footerBg: "bg-[#0A0C12]",
      buttonPrimary: "bg-indigo-500 hover:bg-indigo-600",
      buttonSecondary: "bg-white/5 hover:bg-white/10 border-white/20",
      gradient: "from-indigo-400 via-blue-400 to-cyan-400",
    },
    light: {
      bg: "bg-gradient-to-br from-[#EFF3F8] via-[#F5F7FA] to-[#E8EEF5]",
      bgGradient: "from-[#EFF3F8] via-[#F5F7FA] to-[#E8EEF5]",
      cardBg: "bg-white/90",
      cardBorder: "border-blue-100/80",
      cardHover: "hover:shadow-lg hover:shadow-blue-100/50",
      text: "text-gray-800",
      textSecondary: "text-gray-600",
      textMuted: "text-gray-500",
      accent: "text-blue-600",
      accentBg: "bg-blue-100/70",
      accentBorder: "border-blue-200/80",
      headerBg: scrolled ? "bg-white/90" : "bg-transparent",
      footerBg: "bg-[#F8FAFE]",
      buttonPrimary: "bg-blue-600 hover:bg-blue-700",
      buttonSecondary: "bg-gray-100/80 hover:bg-gray-200/80 border-gray-200",
      gradient: "from-blue-600 via-indigo-600 to-cyan-600",
    },
  };

  const currentTheme = isDark ? theme.dark : theme.light;

  return (
    <div className={`relative min-h-screen ${currentTheme.bg} overflow-x-hidden font-sans transition-colors duration-300 selection:bg-blue-500/30 selection:text-blue-200`}>

      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          variants={floatingOrb}
          animate="animate"
          className={`absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full ${isDark ? 'bg-indigo-500/10' : 'bg-blue-300/40'} blur-[120px] pointer-events-none`}
        />
        <motion.div
          variants={floatingOrb}
          animate="animate"
          style={{ animationDelay: '-3s' }}
          className={`absolute bottom-[20%] right-[-10%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] rounded-full ${isDark ? 'bg-amber-500/8' : 'bg-indigo-200/40'} blur-[150px] pointer-events-none`}
        />
        <motion.div
          variants={floatingOrb}
          animate="animate"
          style={{ animationDelay: '-1.5s' }}
          className={`absolute top-[40%] left-[60%] w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] rounded-full ${isDark ? 'bg-emerald-500/5' : 'bg-cyan-200/30'} blur-[100px] pointer-events-none`}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_80%,transparent_100%)]" />
      </div>

      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 sm:top-4 inset-x-0 sm:inset-x-6 lg:max-w-6xl lg:mx-auto z-50 transition-all duration-500 ${
          scrolled
            ? `sm:rounded-full ${currentTheme.headerBg} backdrop-blur-xl border-b sm:border ${currentTheme.cardBorder} shadow-lg px-4 sm:px-2 py-2 sm:py-1.5`
            : "bg-transparent border-b sm:border border-transparent py-4 sm:py-2 px-4 sm:px-2"
        }`}
      >
        <nav className="relative h-12 flex items-center justify-between px-2">
          <Link to="/" className="flex items-center gap-3 group relative z-50">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center border ${currentTheme.cardBorder} group-hover:border-blue-500/40 transition-all duration-300 shadow-lg group-hover:shadow-blue-500/20`}>
              <Sparkles className={`w-5 h-5 ${currentTheme.accent} group-hover:text-blue-300 transition-colors`} />
            </div>
            <span className={`font-extrabold text-xl ${currentTheme.text} tracking-tight flex items-center gap-1.5`}>
              EduNexa
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/10">
            <Link to="/signup" state={{ role: "student" }} className={`px-5 py-2 rounded-full text-sm font-semibold ${currentTheme.textSecondary} hover:text-white hover:bg-white/10 transition-all`}>Student</Link>
            <Link to="/login" className={`px-5 py-2 rounded-full text-sm font-semibold ${currentTheme.textSecondary} hover:text-white hover:bg-white/10 transition-all`}>Log in</Link>
            <Link to="/signup" state={{ role: "teacher" }} className="relative group px-6 py-2 rounded-full bg-blue-600 text-white text-sm font-bold overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-blue-500/30 ml-1">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative flex items-center gap-2">Join as Teacher <ArrowRight className="w-4 h-4 ml-0.5" /></span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl ${currentTheme.cardBg} border ${currentTheme.cardBorder} hover:scale-105 transition-all`}
            >
              {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-600" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden relative z-50 p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors focus:outline-none"
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                    <X className={`w-5 h-5 ${currentTheme.text}`} />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                    <Menu className={`w-5 h-5 ${currentTheme.text}`} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 top-[4rem] sm:top-[5rem] -mx-4 sm:-mx-6 z-40 bg-black/60 backdrop-blur-md md:hidden min-h-screen"
                onClick={() => setMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`absolute left-0 right-0 mt-2 sm:mt-4 mx-2 sm:mx-0 z-50 md:hidden overflow-hidden ${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-2xl shadow-xl`}
              >
                <div className="p-4 flex flex-col gap-3">
                  <Link to="/signup" state={{ role: "student" }} className={`w-full px-5 py-3.5 rounded-xl bg-white/5 border ${currentTheme.cardBorder} text-sm font-semibold ${currentTheme.textSecondary} hover:bg-white/10 transition-all flex items-center gap-3`} onClick={() => setMobileMenuOpen(false)}>
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400"><AcademicCapIcon className="w-5 h-5" /></div>
                    Student Sign Up
                  </Link>
                  <Link to="/signup" state={{ role: "teacher" }} className="relative group overflow-hidden w-full px-5 py-3.5 rounded-xl bg-blue-600 text-white text-sm font-bold shadow-lg transition-all flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10 flex items-center justify-between w-full">
                      <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center"><UserGroupIcon className="w-5 h-5 text-white" /></div>Teacher Sign Up</div>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </Link>
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-2" />
                  <Link to="/login" className={`w-full px-5 py-3 rounded-xl text-sm font-semibold ${currentTheme.textMuted} hover:text-white hover:bg-white/5 transition-all text-center`} onClick={() => setMobileMenuOpen(false)}>I already have an account</Link>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.header>

      <main className="pt-16 md:pt-20">
        
        <section className="relative z-10 pt-8 pb-10 sm:pt-12 sm:pb-16 md:pt-16 md:pb-20 px-4 sm:px-6 text-center">
          <motion.div variants={staggerContainer} initial="hidden" animate="show" className="max-w-4xl mx-auto flex flex-col items-center">
            <motion.div variants={fadeUp} className="mb-4">
              <div className={`inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full ${currentTheme.accentBg} border ${currentTheme.accentBorder} text-[11px] sm:text-xs font-semibold ${currentTheme.accent} shadow-sm tracking-wide uppercase`}>
                <SparklesIcon className="w-3.5 h-3.5" />
                <span>Next-Gen AI Platform</span>
              </div>
            </motion.div>

            <motion.h1 variants={fadeUp} className={`text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] font-black leading-[1.05] ${currentTheme.text} mb-4 tracking-tight`}>
              Study Smarter, Not
              <br />
              <span className={`inline-block mt-1 sm:mt-2 bg-gradient-to-r ${currentTheme.gradient} bg-clip-text text-transparent pb-1 sm:pb-2`}>
                Harder with AI.
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className={`text-sm sm:text-base md:text-lg ${currentTheme.textSecondary} max-w-2xl mx-auto mb-8 leading-relaxed font-medium px-2`}>
              Upload your notes, PDFs or slides. Get instant structured summaries, flashcards and adaptive practice quizzes designed to test real understanding.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
              <Link to="/signup" state={{ role: "student" }} className={`group relative w-full sm:w-auto px-7 py-3 sm:py-3.5 rounded-full ${currentTheme.buttonPrimary} text-white font-black hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/30`}>
                Start Learning Free <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/login" className={`w-full sm:w-auto px-7 py-3 sm:py-3.5 rounded-full border ${currentTheme.cardBorder} ${currentTheme.buttonSecondary} font-semibold ${currentTheme.textSecondary} hover:text-white transition-all duration-300 backdrop-blur-sm`}>
                Login
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className={`mt-12 sm:mt-16 pt-6 border-t ${currentTheme.cardBorder} w-full max-w-3xl flex flex-wrap justify-center gap-6 sm:gap-14`}>
              {[
                { label: "Active Students", value: "50k+" },
                { label: "Documents Parsed", value: "1M+" },
                { label: "Hours Saved", value: "2M+" },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className={`text-xl sm:text-2xl font-black ${currentTheme.accent}`}>{stat.value}</span>
                  <span className={`text-[10px] sm:text-xs font-bold ${currentTheme.textMuted} uppercase tracking-wider mt-1`}>{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        <section id="features" className="relative z-10 py-12 sm:py-16 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} className="text-center mb-10">
              <h2 className={`text-2xl sm:text-3xl md:text-4xl font-black ${currentTheme.text} mb-3 tracking-tight`}>
                Everything you need to <span className={currentTheme.accent}>excel.</span>
              </h2>
              <p className={`text-sm sm:text-base ${currentTheme.textSecondary} max-w-2xl mx-auto`}>
                Our suite of AI tools is designed specifically to enhance comprehension, retention, and analytical thinking.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <FeatureCard delay={0.1} icon={<CloudUploadIcon className="w-5 h-5 sm:w-6 sm:h-6" />} title="Universal Upload" desc="Instantly process PDFs, Word docs, PowerPoint slides, or handwritten notes with state-of-the-art OCR." color="blue" isDark={isDark} />
              <FeatureCard delay={0.2} icon={<DocumentTextIcon className="w-5 h-5 sm:w-6 sm:h-6" />} title="Smart Summarization" desc="Get concise, structured summaries that highlight key concepts, definitions, and formulas automatically." color="indigo" isDark={isDark} />
              <FeatureCard delay={0.3} icon={<PuzzleIcon className="w-5 h-5 sm:w-6 sm:h-6" />} title="Adaptive Quizzes" desc="AI generates context-aware multiple choice, true/false, and short answer questions based on your material." color="cyan" isDark={isDark} />
            </div>
          </div>
        </section>

        <section className={`relative z-10 py-14 sm:py-20 px-4 sm:px-6 ${isDark ? 'bg-white/[0.02]' : 'bg-blue-50/40'} border-y ${currentTheme.cardBorder} overflow-hidden`}>
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-5xl mx-auto relative z-10">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-50px" }} className="text-center mb-10">
              <h2 className={`text-2xl sm:text-3xl md:text-4xl font-black ${currentTheme.text} mb-3`}>Designed for ambitious minds</h2>
              <p className={`text-sm sm:text-base ${currentTheme.textSecondary}`}>Choose the experience tailored exactly for your goals.</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
              <UserCard delay={0.1} title="For Students" icon={<AcademicCapIcon className="w-7 h-7 sm:w-8 sm:h-8 text-blue-500" />} description="Turbocharge your study sessions, prepare for exams faster, and ensure long term retention of complex subjects." features={["Instant document summarization", "AI-generated flashcards", "Personalized weak-spot targeting", "Dark mode mobile & desktop apps"]} buttonText="Join as Student" role="student" isDark={isDark} />
              <UserCard delay={0.2} title="For Educators" icon={<UserGroupIcon className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-500" />} description="Easily distribute interactive learning materials, track class comprehension, and automate preliminary grading." features={["Centralized class materials", "Automated formative assessments", "Real-time student insights dashboard", "Exportable analytical reports"]} buttonText="Join as Educator" role="teacher" highlight isDark={isDark} />
            </div>
          </div>
        </section>

        <section className="relative z-10 py-12 sm:py-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-indigo-500/30 rounded-[2rem] sm:rounded-[2.5rem] blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-700" />
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className={`relative ${currentTheme.cardBg} backdrop-blur-md border ${currentTheme.cardBorder} rounded-[2rem] sm:rounded-[2.5rem] p-8 sm:p-12 text-center overflow-hidden`}>
              <div className="relative z-10">
                <h2 className={`text-2xl sm:text-3xl md:text-4xl font-black ${currentTheme.text} mb-4 sm:mb-5`}>Ready to transform your workflow?</h2>
                <p className={`text-sm sm:text-base ${currentTheme.textSecondary} mb-8 max-w-xl mx-auto font-medium`}>Join thousands of early adopters using EduNexa to digest information 10x faster and retain it longer.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link to="/signup" className={`w-full sm:w-auto px-8 py-3.5 rounded-full ${currentTheme.buttonPrimary} text-white font-black hover:scale-105 transition-all shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2`}>
                    Start Learning Free <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className={`relative z-10 border-t ${currentTheme.cardBorder} ${currentTheme.footerBg} py-8 sm:py-10 px-4 sm:px-6`}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className={`w-4 h-4 sm:w-5 sm:h-5 ${currentTheme.accent}`} />
            <span className={`font-bold ${currentTheme.text} tracking-tight`}>EduNexa</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium">
            <Link to="/about" className={`${currentTheme.textSecondary} hover:${currentTheme.accent} transition-colors`}>About</Link>
            <Link to="/features" className={`${currentTheme.textSecondary} hover:${currentTheme.accent} transition-colors`}>Features</Link>
            <Link to="/pricing" className={`${currentTheme.textSecondary} hover:${currentTheme.accent} transition-colors`}>Pricing</Link>
            <Link to="/privacy" className={`${currentTheme.textSecondary} hover:${currentTheme.accent} transition-colors`}>Privacy</Link>
            <Link to="/terms" className={`${currentTheme.textSecondary} hover:${currentTheme.accent} transition-colors`}>Terms</Link>
          </div>

          <span className={`text-xs sm:text-sm font-medium ${currentTheme.textMuted}`}>
            © {new Date().getFullYear()} EduNexa Inc.
          </span>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc, color, delay, isDark }) {
  const colorMap = {
    blue: isDark ? "from-blue-500/20 to-blue-500/5 text-blue-400 border-blue-500/20 group-hover:border-blue-500/40" : "from-blue-100/80 to-blue-200/50 text-blue-600 border-blue-200/80 group-hover:border-blue-400",
    indigo: isDark ? "from-indigo-500/20 to-indigo-500/5 text-indigo-400 border-indigo-500/20 group-hover:border-indigo-500/40" : "from-indigo-100/80 to-indigo-200/50 text-indigo-600 border-indigo-200/80 group-hover:border-indigo-400",
    cyan: isDark ? "from-cyan-500/20 to-cyan-500/5 text-cyan-400 border-cyan-500/20 group-hover:border-cyan-500/40" : "from-cyan-100/80 to-cyan-200/50 text-cyan-600 border-cyan-200/80 group-hover:border-cyan-400",
  };

  const selectedStyle = colorMap[color] || colorMap.blue;
  const cardBg = isDark ? "bg-[#0F1117]/60" : "bg-white/85";
  const textColor = isDark ? "text-white" : "text-gray-800";
  const descColor = isDark ? "text-gray-400" : "text-gray-600";
  const cardBorder = isDark ? "border-white/10" : "border-blue-100/80";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className={`group relative ${cardBg} backdrop-blur-sm border ${cardBorder} rounded-2xl sm:rounded-3xl p-6 sm:p-8 ${isDark ? 'hover:bg-white/[0.05]' : 'hover:shadow-lg hover:shadow-blue-100/50'} transition-all duration-300 overflow-hidden`}
    >
      <div className={`absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${colorMap[color].split(" ")[0]} ${colorMap[color].split(" ")[1]} rounded-2xl sm:rounded-3xl pointer-events-none`} />
      <div className="relative z-10">
        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mb-5 sm:mb-6 bg-gradient-to-br ${selectedStyle} border`}>
          {icon}
        </div>
        <h3 className={`font-bold text-lg sm:text-xl mb-2 sm:mb-3 ${textColor} tracking-tight`}>{title}</h3>
        <p className={`text-sm sm:text-base ${descColor} leading-relaxed font-medium`}>{desc}</p>
      </div>
    </motion.div>
  );
}

function UserCard({ title, icon, description, features, buttonText, role, highlight, delay, isDark }) {
  const cardBg = highlight 
    ? isDark 
      ? "bg-gradient-to-br from-blue-600/30 via-indigo-600/20 to-cyan-600/20 backdrop-blur-sm border border-white/20" 
      : "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xl"
    : isDark 
      ? "bg-[#0F1117]/60 backdrop-blur-sm border border-white/10" 
      : "bg-white/85 backdrop-blur-sm border border-blue-100/80";

  const textColor = highlight ? "text-white" : (isDark ? "text-white" : "text-gray-800");
  const descColor = highlight ? "text-blue-100" : (isDark ? "text-gray-400" : "text-gray-600");
  const featureColor = highlight ? "text-white" : (isDark ? "text-gray-300" : "text-gray-700");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -4 }}
      className={`group relative rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 transition-all duration-300 ${cardBg}`}
    >
      <div className="relative z-10">
        <div className={`inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl mb-5 sm:mb-6 ${highlight ? "bg-white/20 backdrop-blur-md border border-white/20" : (isDark ? "bg-white/5 border border-white/10" : "bg-blue-100/80 border border-blue-200")}`}>
          {icon}
        </div>

        <h3 className={`text-xl sm:text-2xl md:text-3xl font-black mb-3 sm:mb-4 tracking-tight ${textColor}`}>{title}</h3>
        <p className={`text-sm sm:text-base font-medium mb-6 sm:mb-8 leading-relaxed ${descColor}`}>{description}</p>

        <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-10">
          {features.map((f, i) => (
            <div key={i} className="flex items-start gap-3">
              <CheckCircleIcon className={`w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5 ${highlight ? "text-white" : (isDark ? "text-blue-400" : "text-blue-500")}`} />
              <span className={`text-sm sm:text-base font-medium ${featureColor}`}>{f}</span>
            </div>
          ))}
        </div>

        <Link to="/signup" state={{ role }} className={`inline-flex w-full px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base transition-all text-center items-center justify-center gap-2 group-hover:scale-[1.02] active:scale-[0.98] ${highlight ? "bg-white text-blue-600 shadow-xl hover:shadow-2xl" : (isDark ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md" : "bg-blue-600 text-white hover:bg-blue-700 shadow-md")}`}>
          {buttonText} <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}