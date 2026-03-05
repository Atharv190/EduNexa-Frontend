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
  Plus,
  Layout,
  BookOpen,
  Trophy,
  Activity,
  Menu,
  X,
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

  const API_BASE =
    process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/files");
        setTotalFiles(res.data.files.length);
        setRecentFiles(res.data.files.slice(0, 3));
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex justify-between items-center relative">
          <div className="flex items-center gap-3 group cursor-pointer z-50">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 flex items-center justify-center border border-white/10 group-hover:border-indigo-500/40 transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.15)] group-hover:shadow-[0_0_25px_rgba(99,102,241,0.3)]">
              <Sparkles className="text-indigo-400 w-5 h-5 group-hover:text-fuchsia-400 transition-colors" />
            </div>
            <span className="font-extrabold text-xl sm:text-2xl text-white tracking-tight">EduNexa</span>
          </div>

          <div className="hidden sm:flex items-center gap-4 sm:gap-5 bg-white/5 rounded-full p-1 border border-white/5 px-4">
            <button
              onClick={() => setShowProfile(true)}
              className="flex items-center gap-2 py-2 sm:py-2.5 rounded-full text-sm font-semibold text-slate-300 hover:text-white transition-all"
            >
              <User size={18} className="text-indigo-400" />
              <span>{user.username || user.name}</span>
            </button>
            <div className="h-5 w-px bg-white/10"></div>
            <button
              onClick={handleLogout}
              className="py-2 sm:py-2.5 rounded-full text-red-400 hover:text-red-300 transition-all flex items-center gap-2 text-sm font-semibold"
              title="Logout"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>

          <button
            className="sm:hidden p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors z-50 focus:outline-none"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <AnimatePresence mode="wait">
              {showMobileMenu ? (
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

          <AnimatePresence>
            {showMobileMenu && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 top-[4rem] sm:top-[5rem] -mx-4 sm:-mx-6 z-40 bg-[#03050C]/60 backdrop-blur-md md:hidden min-h-screen"
                  onClick={() => setShowMobileMenu(false)}
                />

                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 right-0 mt-2 sm:mt-4 mx-2 sm:mx-0 z-50 md:hidden overflow-hidden bg-[#0a0d16] border border-white/10 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                >
                  <div className="p-4 flex flex-col gap-3">
                    <button
                      onClick={() => {
                        setShowMobileMenu(false);
                        setShowProfile(true);
                      }}
                      className="w-full flex items-center justify-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 text-white font-medium hover:bg-white/10 transition-colors"
                    >
                      <div className="bg-indigo-500/20 p-2 rounded-lg">
                        <User size={20} className="text-indigo-400" />
                      </div>
                      <div className="text-left flex flex-col">
                        <span className="text-sm text-slate-400">Logged in as</span>
                        <span className="font-bold">{user.username || user.name}</span>
                      </div>
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-start gap-4 p-4 rounded-xl bg-red-500/10 border border-red-500/10 text-red-400 font-medium hover:bg-red-500/20 transition-colors"
                    >
                      <div className="bg-red-500/20 p-2 rounded-lg">
                        <LogOut size={20} />
                      </div>
                      Logout
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-20 relative z-10 transition-all duration-300">

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 rounded-[1.5rem] sm:rounded-[2.5rem] p-6 sm:p-10 bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-[#03050C]/90 border border-white/10 shadow-[0_0_40px_rgba(79,70,229,0.1)] relative overflow-hidden group backdrop-blur-sm"
          >
            <div className="absolute top-0 right-[-10%] sm:right-0 p-4 sm:p-8 opacity-20 sm:opacity-30 group-hover:opacity-40 sm:group-hover:opacity-60 transition-opacity duration-700 blur-[2px] pointer-events-none text-indigo-300">
              <Sparkles className="w-40 h-40 sm:w-56 sm:h-56 transform rotate-12" />
            </div>

            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[11px] sm:text-xs font-semibold text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)] tracking-wide uppercase">
                Student Workspace
              </span>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mt-6 sm:mt-8 mb-3 sm:mb-4 leading-tight">
                Ready to learn, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-rose-400">
                  {user.username || user.name}?
                </span>
              </h1>

              <p className="text-slate-400/90 mb-6 sm:mb-10 max-w-sm sm:max-w-xl text-sm sm:text-base leading-relaxed font-medium">
                Dive back into your study materials and track your progress with EduNexa's intelligent dashboard. Enhance your retention with AI-generated notes.
              </p>

              <Link
                to="/files"
                className="group/btn relative w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white text-[#03050C] px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-black transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] text-sm sm:text-base overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-fuchsia-100 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                <span className="relative flex items-center gap-2">
                  Go to Library <ChevronRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-[1.5rem] sm:rounded-[2.5rem] p-6 sm:p-8 bg-white/[0.03] border border-white/10 shadow-xl flex flex-row sm:flex-col justify-between items-center sm:items-stretch relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] backdrop-blur-md"
          >
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl group-hover:bg-purple-500/30 transition-all hidden sm:block pointer-events-none"></div>

            <div className="flex sm:flex-col items-center sm:items-start gap-4 sm:gap-0 relative z-10">
              <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center sm:mb-6 border border-purple-500/30 flex-shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                <Trophy className="text-purple-400" size={24} />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider mb-1 sm:mb-2 flex items-center gap-2">
                  Total Materials
                </p>
                <h3 className="text-3xl sm:text-6xl font-black text-white">{totalFiles}</h3>
              </div>
            </div>

            <Link to="/files" className="mt-0 sm:mt-8 flex justify-center sm:justify-between items-center bg-white/5 hover:bg-white/10 border border-white/10 p-3 sm:px-6 sm:py-4 rounded-2xl transition-all group/btn relative z-10 w-12 sm:w-auto flex-shrink-0 sm:flex-shrink-1 hover:-translate-y-1">
              <span className="hidden sm:inline font-bold text-slate-300 group-hover/btn:text-white transition-colors">View Library</span>
              <div className="sm:bg-white/10 sm:p-1.5 rounded-xl sm:group-hover/btn:bg-white/20 transition-colors">
                <Plus size={18} className="text-white" />
              </div>
            </Link>
          </motion.div>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 bg-white/[0.03] border border-white/10 hover:border-sky-500/30 transition-all group hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(14,165,233,0.1)] relative overflow-hidden backdrop-blur-sm"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block"></div>
            <div className="flex items-start justify-between mb-4 sm:mb-6 relative z-10">
              <div className="w-12 h-12 bg-sky-500/20 rounded-2xl flex items-center justify-center border border-sky-500/30 shadow-[0_0_15px_rgba(14,165,233,0.2)]">
                <Activity className="text-sky-400 w-6 h-6" />
              </div>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2 relative z-10">Activity Stream</h3>
            <p className="text-sm text-slate-400 font-medium leading-relaxed relative z-10">
              You have access to <span className="font-bold text-sky-400">{totalFiles}</span> documents across your subjects.
            </p>
          </motion.div>

          <Link
            to="/files"
            className="rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 bg-white/[0.03] border border-white/10 hover:border-indigo-500/30 transition-all group hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(99,102,241,0.1)] relative overflow-hidden block backdrop-blur-sm"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block"></div>
            <div className="flex items-start justify-between mb-4 sm:mb-6 relative z-10">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                <BookOpen className="text-indigo-400 w-6 h-6" />
              </div>
              <div className="bg-white/5 p-2 rounded-full transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform border border-white/5 group-hover:border-indigo-500/30 group-hover:bg-indigo-500/10">
                <ChevronRight size={18} className="text-slate-400 group-hover:text-indigo-400" />
              </div>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2 relative z-10">Continue Learning</h3>
            <p className="text-sm text-slate-400 font-medium leading-relaxed relative z-10">
              Resume where you left off and master your materials.
            </p>
          </Link>

          <div className="sm:col-span-2 md:col-span-1 rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 bg-gradient-to-br from-white/[0.05] to-white/[0.01] border border-amber-500/20 hover:border-amber-500/40 transition-all group sm:hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(245,158,11,0.1)] relative overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block"></div>
            <div className="absolute top-4 sm:top-6 right-4 sm:right-6 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)] z-10">Pro</div>

            <div className="flex items-start justify-between mb-4 sm:mb-6 relative z-10">
              <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <Sparkles className="text-amber-400 w-6 h-6" />
              </div>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2 relative z-10">AI Study Assistant</h3>
            <p className="text-sm text-slate-400 font-medium leading-relaxed relative z-10">
              Generate summaries & quizzes from your existing documents.
            </p>
          </div>
        </div>

        <section className="mb-8">
          <div className="flex flex-row justify-between items-center sm:items-end mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-500/20 p-2.5 rounded-xl border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.15)] flex-shrink-0">
                <Layout className="text-indigo-400 w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Recent Materials</h2>
                <p className="hidden text-slate-400 font-medium text-sm mt-1 sm:block">Fresh content to accelerate your learning</p>
              </div>
            </div>
            <Link to="/files" className="flex items-center gap-2 text-indigo-400 font-bold hover:text-indigo-300 transition-colors group/link text-sm sm:text-base bg-indigo-500/10 hover:bg-indigo-500/20 px-4 py-2 rounded-full border border-indigo-500/20">
              <span className="hidden sm:inline">Explore Library</span>
              <span className="sm:hidden">See All</span>
              <ChevronRight size={16} className="transform group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>

          {recentFiles.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {recentFiles.map((file, i) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  key={file._id}
                  className="rounded-[1.5rem] p-6 bg-white/[0.03] border border-white/5 hover:border-indigo-500/30 hover:bg-white/[0.05] transition-all duration-300 group flex flex-col h-full relative overflow-hidden backdrop-blur-sm"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                  <div className="flex items-start gap-4 mb-5 z-10 relative">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 flex-shrink-0 group-hover:scale-110 transition-transform duration-300 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/30 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                      <FileText className="text-slate-400 group-hover:text-indigo-400 transition-colors w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white line-clamp-2 leading-snug group-hover:text-indigo-300 transition-colors">{file.title}</h3>
                      <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-500 mt-2">
                        {file.subject || "General"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto flex justify-between items-center pt-5 border-t border-white/5 z-10 relative">
                    <Link
                      to={`/files/${file._id}`}
                      className="text-sm font-bold text-slate-300 hover:text-indigo-400 transition-colors flex items-center gap-1.5"
                    >
                      View Details <ChevronRight size={16} />
                    </Link>

                    <button
                      onClick={() =>
                      (window.location.href =
                        `${API_BASE}/files/download/${file._id}`)
                      }
                      className="text-xs font-bold bg-white text-slate-900 hover:bg-slate-200 px-4 py-2 rounded-xl transition-colors shadow-lg hover:shadow-xl"
                    >
                      Download
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-20 bg-white/[0.02] rounded-[2rem] border border-white/5 px-4 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-white/10 shadow-lg">
                  <FileText className="text-slate-400 w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-white mb-2">No active materials yet</h3>
                <p className="text-base text-slate-400 max-w-sm mx-auto mb-8 font-medium">Explore the library to discover new content uploaded by your instructors.</p>
                <Link to="/files" className="inline-flex items-center gap-2 bg-white hover:bg-slate-200 text-[#03050C] px-8 py-3.5 rounded-full font-black transition-all shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 text-sm sm:text-base">
                  Go to Library <ChevronRight size={20} />
                </Link>
              </div>
            </div>
          )}
        </section>
      </main>

      <AnimatePresence>
        {showProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setShowProfile(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0a0d16] border border-white/10 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl relative overflow-hidden z-10"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-fuchsia-500"></div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="flex justify-between items-start mb-6 relative z-10">
                <h2 className="text-2xl font-black text-white">Account Profile</h2>
                <button onClick={() => setShowProfile(false)} className="text-slate-400 hover:text-white p-2 hover:bg-white/10 rounded-xl transition-colors bg-white/5 border border-white/10">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 mb-8 relative z-10">
                <ProfileRow label="Name" value={user.username || user.name} />
                <ProfileRow label="Email" value={user.email} />
                <ProfileRow label="Role" value={user.role} badge />
              </div>

              <div className="pt-6 border-t border-white/10 relative z-10">
                <h3 className="text-xs font-bold text-red-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  Danger Zone
                </h3>
                <input
                  type="password"
                  placeholder="Enter password to confirm"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="w-full mb-4 p-3.5 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all text-sm sm:text-base text-white placeholder:text-slate-600 font-medium"
                />

                <button
                  onClick={handleDeleteAccount}
                  className="w-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 hover:border-red-500 py-3.5 rounded-xl font-bold transition-all text-sm sm:text-base shadow-[0_0_15px_rgba(239,68,68,0.1)] hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
                >
                  Delete Account Permanently
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProfileRow({ label, value, badge }) {
  return (
    <div className="flex items-center justify-between py-3.5 px-5 bg-white/[0.03] rounded-2xl border border-white/5 hover:border-white/10 hover:bg-white/[0.05] transition-colors">
      <span className="text-sm text-slate-400 font-semibold">{label}</span>
      {badge ? (
        <span className="text-xs font-black uppercase tracking-wider bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.1)]">{value}</span>
      ) : (
        <span className="text-base font-bold text-white truncate max-w-[200px]">{value}</span>
      )}
    </div>
  );
}
