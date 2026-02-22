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
  X
} from "lucide-react";

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

  /* ================= FETCH FILES ================= */
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

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    logoutUser();
    navigate("/", { replace: true });
  };

  /* ================= DELETE ACCOUNT ================= */
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
    <div className="min-h-screen bg-[#10141d] text-slate-200 pb-20 sm:pb-24 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      {/* ================= BACKGROUND EFFECTS ================= */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] sm:w-[40vw] sm:h-[40vw] max-w-[400px] max-h-[400px] bg-indigo-600/10 blur-[80px] sm:blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] sm:w-[40vw] sm:h-[40vw] max-w-[400px] max-h-[400px] bg-purple-600/10 blur-[80px] sm:blur-[120px] rounded-full mix-blend-screen" />
      </div>

      {/* ================= NAVBAR ================= */}
      <nav className="sticky top-0 z-40 bg-[#10141d]/80 backdrop-blur-xl border-b border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex justify-between items-center relative">
          <div className="flex items-center gap-2 sm:gap-3 group cursor-pointer z-50">
            <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-1.5 sm:p-2 rounded-xl group-hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all duration-300">
              <Sparkles className="text-white w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="font-bold text-xl sm:text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">EduNexa</span>
          </div>

          <div className="hidden sm:flex items-center gap-4 sm:gap-5">
            <button
              onClick={() => setShowProfile(true)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all text-sm font-medium"
            >
              <User size={18} className="text-indigo-400" />
              <span>{user.username || user.name}</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-400 border border-red-500/10 transition-all flex items-center gap-2 text-sm font-medium"
              title="Logout"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Hamburguer Menu Button */}
          <button
            className="sm:hidden p-2 rounded-lg bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-colors z-50"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Mobile Navigation Overlay */}
          <div className={`sm:hidden fixed inset-0 top-0 pt-20 bg-[#10141d]/95 backdrop-blur-2xl z-40 flex flex-col items-center gap-4 transform transition-transform duration-300 border-l border-white/5 ${showMobileMenu ? 'translate-x-0' : 'translate-x-full'
            }`}>
            <div className="w-full px-6 py-4 flex flex-col gap-4">
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
          </div>
        </div>
      </nav>

      {/* ================= MAIN ================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 relative z-10 filter transition-all duration-300">

        {/* ================= HERO ================= */}
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="lg:col-span-2 rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-10 bg-gradient-to-br from-[#1e1b4b]/80 via-[#312e81]/40 to-[#121622] border border-indigo-500/20 shadow-[0_0_40px_rgba(79,70,229,0.1)] relative overflow-hidden group">

            <div className="absolute top-0 right-[-10%] sm:right-0 p-4 sm:p-8 opacity-20 sm:opacity-30 group-hover:opacity-40 sm:group-hover:opacity-60 transition-opacity duration-700 blur-[2px] pointer-events-none text-indigo-300">
              <Sparkles className="w-40 h-40 sm:w-56 sm:h-56 transform rotate-12" />
            </div>

            <div className="relative z-10">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-indigo-500/20 text-indigo-300 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full border border-indigo-500/20">
                Student Workspace
              </span>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mt-6 sm:mt-8 mb-3 sm:mb-4 leading-tight">
                Ready to learn, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                  {user.username || user.name}?
                </span>
              </h1>

              <p className="text-slate-400/90 mb-6 sm:mb-10 max-w-sm sm:max-w-md text-sm sm:text-lg leading-relaxed">
                Dive back into your study materials and track your progress with EduNexa's intelligent dashboard.
              </p>

              <Link
                to="/files"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-indigo-500 hover:bg-indigo-600 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold transition-all hover:shadow-[0_0_25px_rgba(99,102,241,0.5)] sm:hover:-translate-y-1 text-sm sm:text-base"
              >
                Go to Library <ChevronRight size={20} />
              </Link>
            </div>
          </div>

          <div className="rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 bg-[#181d2b] border border-white/5 shadow-xl flex flex-row sm:flex-col justify-between items-center sm:items-stretch relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all hidden sm:block"></div>

            <div className="flex sm:flex-col items-center sm:items-start gap-4 sm:gap-0">
              <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center sm:mb-6 border border-purple-500/20 flex-shrink-0">
                <Trophy className="text-purple-400" size={24} />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1 sm:mb-2">
                  Total Materials
                </p>
                <h3 className="text-3xl sm:text-6xl font-black text-white">{totalFiles}</h3>
              </div>
            </div>

            <Link to="/files" className="mt-0 sm:mt-8 flex justify-center sm:justify-between items-center bg-white/5 hover:bg-white/10 border border-white/5 p-3 sm:px-6 sm:py-4 rounded-xl transition-colors group/btn relative z-10 w-12 sm:w-auto flex-shrink-0 sm:flex-shrink-1">
              <span className="hidden sm:inline font-semibold text-slate-300 group-hover/btn:text-white">View Library</span>
              <div className="sm:bg-white/10 sm:p-1.5 rounded-lg sm:group-hover/btn:bg-white/20 transition-colors">
                <Plus size={18} className="text-white" />
              </div>
            </Link>
          </div>
        </div>

        {/* ================= QUICK ACTIONS ================= */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-16">

          <div className="rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 bg-[#181d2b] border border-white/5 hover:border-sky-500/30 transition-all group hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-500/5 cursor-default relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block"></div>
            <div className="flex items-start justify-between mb-4 sm:mb-6 relative z-10">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-sky-500/20 rounded-xl sm:rounded-2xl flex items-center justify-center border border-sky-500/20">
                <Activity className="text-sky-400 w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-1 sm:mb-2 relative z-10">Activity Stream</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed relative z-10">
              You have access to <span className="font-semibold text-sky-400">{totalFiles}</span> documents across your subjects.
            </p>
          </div>

          <Link
            to="/files"
            className="rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 bg-[#181d2b] border border-white/5 hover:border-indigo-500/30 transition-all group hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5 relative overflow-hidden block"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block"></div>
            <div className="flex items-start justify-between mb-4 sm:mb-6 relative z-10">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-500/20 rounded-xl sm:rounded-2xl flex items-center justify-center border border-indigo-500/20">
                <BookOpen className="text-indigo-400 w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="bg-white/5 p-1.5 sm:p-2 rounded-full transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                <ChevronRight size={16} className="text-slate-400 group-hover:text-indigo-400" />
              </div>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-1 sm:mb-2 relative z-10">Continue Learning</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed relative z-10">
              Resume where you left off and master your materials.
            </p>
          </Link>

          <div className="sm:col-span-2 md:col-span-1 rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 bg-gradient-to-br from-[#181d2b] to-[#10141d] border border-amber-500/20 hover:border-amber-500/40 transition-all group sm:hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/5 cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block"></div>
            <div className="absolute top-4 sm:top-6 right-4 sm:right-6 bg-amber-500/20 text-amber-300 text-[9px] sm:text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider border border-amber-500/20 z-10">Pro</div>

            <div className="flex items-start justify-between mb-4 sm:mb-6 relative z-10">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-500/20 rounded-xl sm:rounded-2xl flex items-center justify-center border border-amber-500/20">
                <Sparkles className="text-amber-400 w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-1 sm:mb-2 relative z-10">AI Study Assistant</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed relative z-10">
              Generate summaries & quizzes from your existing documents.
            </p>
          </div>
        </div>

        {/* ================= RECENT MATERIALS ================= */}
        <section className="mb-8">
          <div className="flex flex-row justify-between items-center sm:items-end mb-4 sm:mb-8">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="bg-indigo-500/20 p-2 sm:p-2.5 rounded-xl">
                <Layout className="text-indigo-400 w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-2xl font-black text-white">Recent Materials</h2>
                <p className="hidden text-slate-400 text-sm mt-1 sm:block">Fresh content uploaded by your instructors</p>
              </div>
            </div>
            <Link to="/files" className="flex items-center gap-1 sm:gap-2 text-indigo-400 font-semibold hover:text-indigo-300 transition-colors group/link text-sm sm:text-base sm:pb-2">
              <span className="hidden sm:inline">Explore Library</span>
              <span className="sm:hidden">See All</span>
              <ChevronRight size={16} className="transform group-hover/link:translate-x-1 transition-transform sm:w-[18px] sm:h-[18px]" />
            </Link>
          </div>

          {recentFiles.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {recentFiles.map((file) => (
                <div
                  key={file._id}
                  className="rounded-[1.25rem] sm:rounded-[1.5rem] p-5 sm:p-6 bg-[#181d2b] border border-white/5 hover:border-indigo-500/30 hover:bg-[#1a2030] transition-all group flex flex-col h-full relative overflow-hidden"
                >
                  <div className="flex items-start gap-4 mb-4 sm:mb-5 z-10 relative">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/5 flex-shrink-0 group-hover:scale-105 transition-transform bg-indigo-500/5 group-hover:bg-indigo-500/20 border-indigo-500/10 group-hover:border-indigo-500/20">
                      <FileText className="text-slate-400 group-hover:text-indigo-400 transition-colors w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-200 line-clamp-2 group-hover:text-indigo-300 transition-colors">{file.title}</h3>
                      <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 mt-1 sm:mt-2">
                        {file.subject || "General"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto flex justify-between items-center pt-4 sm:pt-5 border-t border-white/5 z-10 relative">
                    <Link
                      to={`/files/${file._id}`}
                      className="text-xs sm:text-sm font-semibold text-slate-300 hover:text-indigo-400 transition-colors px-2.5 sm:px-3 py-1.5 rounded-lg hover:bg-white/5"
                    >
                      View Details
                    </Link>

                    <button
                      onClick={() =>
                      (window.location.href =
                        `${API_BASE}/files/download/${file._id}`)
                      }
                      className="text-[11px] sm:text-xs font-bold bg-white/5 hover:bg-white/10 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors border border-white/5"
                    >
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-20 bg-[#181d2b] rounded-[1.5rem] sm:rounded-[2rem] border border-white/5 px-4">
              <FileText className="mx-auto text-slate-600 mb-3 sm:mb-4 w-10 h-10 sm:w-12 sm:h-12" />
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">No active materials yet</h3>
              <p className="text-sm sm:text-base text-slate-400 max-w-xs sm:max-w-sm mx-auto mb-6">Explore the library to discover new content.</p>
              <Link to="/files" className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold transition-all text-sm sm:text-base">
                Go to Library
              </Link>
            </div>
          )}
        </section>
      </main>

      {/* ================= PROFILE MODAL ================= */}
      {showProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#181d2b] border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>

            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Account Profile</h2>
              <button onClick={() => setShowProfile(false)} className="text-slate-400 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              <ProfileRow label="Name" value={user.username || user.name} />
              <ProfileRow label="Email" value={user.email} />
              <ProfileRow label="Role" value={user.role} badge />
            </div>

            <div className="pt-5 sm:pt-6 border-t border-white/5">
              <h3 className="text-xs sm:text-sm font-bold text-red-400 uppercase tracking-wider mb-3 sm:mb-4">Danger Zone</h3>
              <input
                type="password"
                placeholder="Enter password to confirm"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="w-full mb-4 p-3 sm:p-3.5 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all text-sm sm:text-base text-white placeholder:text-slate-600"
              />

              <button
                onClick={handleDeleteAccount}
                className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 py-3 sm:py-3.5 rounded-xl font-bold transition-all text-sm sm:text-base"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileRow({ label, value, badge }) {
  return (
    <div className="flex items-center justify-between py-3 sm:py-3.5 px-4 sm:px-5 bg-white/5 rounded-xl sm:rounded-2xl border border-white/5">
      <span className="text-xs sm:text-sm text-slate-400 font-medium">{label}</span>
      {badge ? (
        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-indigo-500/20">{value}</span>
      ) : (
        <span className="text-sm sm:text-base font-semibold text-white truncate max-w-[150px] sm:max-w-[200px]">{value}</span>
      )}
    </div>
  );
}
