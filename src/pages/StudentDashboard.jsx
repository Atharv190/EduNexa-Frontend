import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import {
  User,
  LogOut,
  ChevronRight,
  FileText,
  Sparkles,
  Layout,
  BookOpen,
  Activity,
  Menu,
  X,
  TrendingUp,
  Calendar,
  Clock,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

export default function StudentDashboard() {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showProfile, setShowProfile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [recentFiles, setRecentFiles] = useState([]);
  const [totalFiles, setTotalFiles] = useState(0);
  const [deletePassword, setDeletePassword] = useState("");
  const [studyStreak, setStudyStreak] = useState(0);
  const [lastActive, setLastActive] = useState(null);

  const API_BASE =
    process.env.REACT_APP_API_URL || 
    "http://localhost:5000/api";

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/files");
        setTotalFiles(res.data.files.length);
        setRecentFiles(res.data.files.slice(0, 3));
        
        const lastVisit = localStorage.getItem("lastVisit");
        const today = new Date().toDateString();
        
        if (lastVisit === today) {
          const streak = parseInt(localStorage.getItem("studyStreak") || "0");
          setStudyStreak(streak);
        } else if (lastVisit === new Date(Date.now() - 86400000).toDateString()) {
          const newStreak = (parseInt(localStorage.getItem("studyStreak") || "0") + 1);
          setStudyStreak(newStreak);
          localStorage.setItem("studyStreak", newStreak);
        } else {
          setStudyStreak(1);
          localStorage.setItem("studyStreak", "1");
        }
        
        localStorage.setItem("lastVisit", today);
        setLastActive(today);
        
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showMobileMenu]);

  if (!user || user.role !== "student") {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    logoutUser();
    navigate("/", { replace: true });
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) return alert("Enter password");
    if (!window.confirm("Delete your account permanently?")) return;

    try {
      await api.delete("/auth/delete-account-password", {
        data: { email: user.email, password: deletePassword },
      });
      logoutUser();
      navigate("/login", { replace: true });
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="relative min-h-screen bg-[#03050C] text-slate-200 overflow-x-hidden font-sans selection:bg-indigo-500/30 selection:text-indigo-200">

      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          variants={floatingOrb}
          animate="animate"
          className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-indigo-600/15 blur-[120px] mix-blend-screen pointer-events-none"
        />
        <motion.div
          variants={floatingOrb}
          animate="animate"
          style={{ animationDelay: '-3s' }}
          className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] rounded-full bg-purple-600/10 blur-[150px] mix-blend-screen pointer-events-none"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_80%,transparent_100%)]" />
      </div>

      <nav className="sticky top-0 z-40 bg-[#03050C]/60 backdrop-blur-xl border-b border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-15 sm:h-18 flex justify-between items-center relative">
          <div className="flex items-center gap-2.5 group cursor-pointer z-50">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 flex items-center justify-center border border-white/10 group-hover:border-indigo-500/40 transition-all">
              <Sparkles className="text-indigo-400 w-4.5 h-4.5" />
            </div>
            <span className="font-bold text-xl sm:text-2xl text-white tracking-tight">EduNexa</span>
          </div>

          <div className="hidden sm:flex items-center gap-3.5 bg-white/5 rounded-full p-1 border border-white/5 px-4">
            <button
              onClick={() => setShowProfile(true)}
              className="flex items-center gap-2 py-2 text-sm font-medium text-slate-300 hover:text-white transition-all"
            >
              <User size={15} className="text-indigo-400" />
              <span>{user.username || user.name}</span>
            </button>
            <div className="h-5 w-px bg-white/10"></div>
            <button
              onClick={handleLogout}
              className="py-2 text-red-400 hover:text-red-300 transition-all flex items-center gap-2 text-sm font-medium"
            >
              <LogOut size={15} />
              <span>Logout</span>
            </button>
          </div>

          <button
            className="sm:hidden p-2 rounded-xl bg-white/5 border border-white/10"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <AnimatePresence>
            {showMobileMenu && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 top-[60px] z-40 bg-[#03050C]/60 backdrop-blur-md sm:hidden"
                  onClick={() => setShowMobileMenu(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="fixed left-4 right-4 top-[68px] z-50 sm:hidden bg-[#0a0d16] border border-white/10 rounded-xl shadow-lg"
                >
                  <div className="p-4 flex flex-col gap-2.5">
                    <button
                      onClick={() => {
                        setShowMobileMenu(false);
                        setShowProfile(true);
                      }}
                      className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5"
                    >
                      <User size={18} className="text-indigo-400" />
                      <div className="text-left">
                        <div className="text-xs text-slate-400">Logged in as</div>
                        <div className="text-sm font-semibold">{user.username || user.name}</div>
                      </div>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/10 text-red-400 text-sm font-medium"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 sm:pt-7 pb-20 relative z-10">

        {/* Hero Section - Now with proper 2-column layout */}
        <div className="grid lg:grid-cols-2 gap-5 mb-7">
          {/* First Box: Greeting & Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-6 bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-[#03050C]/90 border border-white/10 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-5 opacity-20">
              <Sparkles className="w-40 h-40 transform rotate-12" />
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-[11px] font-semibold text-indigo-300 mb-4">
                <Zap size={11} />
                {getGreeting()} • Student Workspace
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold mb-3">
                Ready to learn,{" "}
                <span className="bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">
                  {user.username || user.name}
                </span>
                ?
              </h1>

              <p className="text-slate-400/90 mb-5 max-w-md text-base leading-relaxed">
                Dive back into your study materials and track your progress with EduNexa's intelligent dashboard.
              </p>

              <div className="flex flex-wrap gap-3 mb-5">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                  <Calendar size={13} className="text-indigo-400" />
                  <span className="text-sm text-slate-300">{studyStreak} day streak</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                  <Clock size={13} className="text-purple-400" />
                  <span className="text-sm text-slate-300">Last active: {lastActive || 'Today'}</span>
                </div>
              </div>

              <Link
                to="/files"
                className="inline-flex items-center gap-2 bg-white text-[#03050C] px-6 py-3 rounded-lg font-semibold transition-all text-sm hover:scale-105"
              >
                Go to Library 
                <ChevronRight size={16} />
              </Link>
            </div>
          </motion.div>

          {/* Second Box: Library Stats Card (moved next to first box) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl p-6 bg-gradient-to-br from-purple-900/30 via-indigo-900/20 to-[#03050C]/90 border border-white/10 flex flex-col relative overflow-hidden"
          >
            <div className="absolute -right-3 -top-3 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl" />
            <div className="absolute -left-3 -bottom-3 w-28 h-28 bg-purple-500/20 rounded-full blur-2xl" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 rounded-2xl flex items-center justify-center border border-indigo-500/30">
                  <BookOpen className="text-indigo-400" size={26} />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Total Resources
                  </p>
                  <h3 className="text-5xl font-bold text-white">
                    {totalFiles}
                  </h3>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Available materials</span>
                  <span className="text-white font-semibold">{totalFiles}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Recent updates</span>
                  <span className="text-green-400 font-semibold">{recentFiles.length} new</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((recentFiles.length / Math.max(totalFiles, 1)) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <Link 
                to="/files" 
                className="mt-6 flex items-center justify-between bg-white/10 hover:bg-white/20 px-4 py-3 rounded-xl transition-all text-sm font-medium border border-white/5"
              >
                <span>Browse Library</span>
                <div className="flex items-center gap-1">
                  <span className="text-indigo-400">Explore</span>
                  <ChevronRight size={16} className="text-indigo-400" />
                </div>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Stats Cards Section - Enhanced */}
        <div className="grid sm:grid-cols-3 gap-5 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl p-5 bg-white/[0.03] border border-white/10 hover:border-sky-500/30 transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-11 h-11 bg-sky-500/20 rounded-xl flex items-center justify-center border border-sky-500/30 group-hover:scale-110 transition-transform">
                <Activity className="text-sky-400 w-5.5 h-5.5" />
              </div>
              <TrendingUp size={15} className="text-green-400" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1.5">Activity Stream</h3>
            <p className="text-sm text-slate-400">
              Access to <span className="font-bold text-sky-400">{totalFiles}</span> documents
            </p>
          </motion.div>

          <Link
            to="/files"
            className="rounded-xl p-5 bg-white/[0.03] border border-white/10 hover:border-indigo-500/30 transition-all block group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-11 h-11 bg-indigo-500/20 rounded-xl flex items-center justify-center border border-indigo-500/30 group-hover:scale-110 transition-transform">
                <BookOpen className="text-indigo-400 w-5.5 h-5.5" />
              </div>
              <ChevronRight size={17} className="text-slate-500 group-hover:text-indigo-400 transition-colors" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1.5">Continue Learning</h3>
            <p className="text-sm text-slate-400">Resume your studies</p>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-xl p-5 bg-white/[0.03] border border-amber-500/20 hover:border-amber-500/40 transition-all relative group"
          >
            <div className="absolute top-3 right-3 text-[10px] font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full">AI</div>
            <div className="w-11 h-11 bg-amber-500/20 rounded-xl flex items-center justify-center border border-amber-500/30 mb-3 group-hover:scale-110 transition-transform">
              <Sparkles className="text-amber-400 w-5.5 h-5.5" />
            </div>
            <h3 className="text-base font-semibold text-white mb-1.5">AI Assistant</h3>
            <p className="text-sm text-slate-400">Summaries & quizzes</p>
          </motion.div>
        </div>

        {/* Recent Materials Section */}
        <section>
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center gap-2.5">
              <Layout className="text-indigo-400 w-5.5 h-5.5" />
              <h2 className="text-xl font-bold text-white">Recent Materials</h2>
            </div>
            <Link to="/files" className="text-indigo-400 text-sm font-medium flex items-center gap-1.5 hover:gap-2 transition-all">
              See all <ChevronRight size={15} />
            </Link>
          </div>

          {recentFiles.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {recentFiles.map((file, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={file._id}
                  className="rounded-xl p-5 bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 transition-all group"
                >
                  <div className="flex items-start gap-3.5 mb-4">
                    <div className="w-11 h-11 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-500/10 transition-colors">
                      <FileText className="text-slate-400 group-hover:text-indigo-400 w-5.5 h-5.5 transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-white truncate">{file.title}</h3>
                      <p className="text-[11px] font-medium text-slate-500 mt-1 uppercase tracking-wide">
                        {file.subject || "General"}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-white/5">
                    <Link
                      to={`/files/${file._id}`}
                      className="text-sm font-medium text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-1.5"
                    >
                      View <ChevronRight size={13} />
                    </Link>
                    <button
                      onClick={() => (window.location.href = `${API_BASE}/files/download/${file._id}`)}
                      className="text-xs font-medium bg-white/5 hover:bg-white/10 px-3.5 py-1.5 rounded-lg transition-colors"
                    >
                      Download
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-14 bg-white/[0.02] rounded-xl border border-white/5">
              <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FileText className="text-slate-500 w-6 h-6" />
              </div>
              <h3 className="font-semibold text-white mb-1.5 text-base">No materials yet</h3>
              <p className="text-sm text-slate-400 mb-4">Explore the library to get started</p>
              <Link to="/files" className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-400 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-500/20 transition-all">
                Browse Library <ChevronRight size={14} />
              </Link>
            </div>
          )}
        </section>
      </main>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowProfile(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0a0d16] border border-white/10 rounded-xl p-6 w-full max-w-md relative z-10"
            >
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-bold text-white">Profile</h2>
                <button onClick={() => setShowProfile(false)} className="text-slate-400 hover:text-white p-1">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3.5 mb-6">
                <div className="flex justify-between py-3 px-4 bg-white/[0.03] rounded-xl">
                  <span className="text-sm text-slate-400">Name</span>
                  <span className="text-sm font-medium text-white">{user.username || user.name}</span>
                </div>
                <div className="flex justify-between py-3 px-4 bg-white/[0.03] rounded-xl">
                  <span className="text-sm text-slate-400">Email</span>
                  <span className="text-sm font-medium text-white truncate max-w-[200px]">{user.email}</span>
                </div>
                <div className="flex justify-between py-3 px-4 bg-white/[0.03] rounded-xl">
                  <span className="text-sm text-slate-400">Role</span>
                  <span className="text-xs font-bold uppercase bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-full">{user.role}</span>
                </div>
              </div>

              <div className="pt-5 border-t border-white/10">
                <h3 className="text-xs font-bold text-red-500 uppercase mb-3.5">Danger Zone</h3>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="w-full mb-3.5 p-3 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:border-red-500/50 text-sm text-white placeholder:text-slate-600"
                />
                <button
                  onClick={handleDeleteAccount}
                  className="w-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 hover:border-red-500 py-3 rounded-xl font-semibold transition-all text-sm"
                >
                  Delete Account
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}