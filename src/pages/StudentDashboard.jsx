import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import {
  User,
  LogOut,
  ChevronRight,
  FileText,
  Quote,
  Sparkles,
  Plus,
  Layout,
} from "lucide-react";

const quotes = [
  "Discipline today. Freedom tomorrow.",
  "Every study session moves you closer to your dream.",
  "Your future self is watching you right now.",
  "Success is built quietly, one day at a time.",
  "Study while others sleep. Live while others dream.",
];

export default function StudentDashboard() {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showProfile, setShowProfile] = useState(false);
  const [recentFiles, setRecentFiles] = useState([]);
  const [totalFiles, setTotalFiles] = useState(0);
  const [deletePassword, setDeletePassword] = useState("");


  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/files");
        setTotalFiles(res.data.files.length);
        setRecentFiles(res.data.files.slice(0, 3));
      } catch (err) {
        console.log(err);
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
  if (!deletePassword) {
    alert("Please enter your password");
    return;
  }

  const confirmDelete = window.confirm(
    "Are you sure you want to delete your account?"
  );

  if (!confirmDelete) return;

  try {
    await api.delete("/auth/delete-account-password", {
      data: {
        email: user.email,
        password: deletePassword,
      },
    });

    logoutUser();
    navigate("/login", { replace: true });
  } catch (err) {
    alert(err.response?.data?.message || "Failed to delete account");
  }
};


  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans pb-24">

      {/* ================= NAVBAR ================= */}
      <nav className="sticky top-0 z-40 bg-[#020617]/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-500/20 p-1.5 rounded-lg text-indigo-400">
              <Sparkles size={18} />
            </div>
            <span className="font-bold text-lg">StudyGeni</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowProfile(true)}
              className="p-2 rounded-full hover:bg-white/10 transition"
            >
              <User size={20} />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-full hover:bg-red-500/10 text-red-400 transition"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* ================= MAIN ================= */}
      <main className="max-w-7xl mx-auto px-6 pt-12">

        {/* ================= HEADER ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">

          {/* Welcome Card */}
          <div className="md:col-span-2 rounded-3xl p-10 relative overflow-hidden
            bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#020617]
            border border-white/10 shadow-2xl">

            <span className="inline-block text-xs font-bold uppercase tracking-widest
              bg-white/10 px-4 py-1.5 rounded-full mb-6 text-slate-300">
              Student Workspace
            </span>

            <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
              Welcome back,<br /> {user.username || user.name}
            </h1>

            <p className="text-slate-400 max-w-sm mb-8">
              Your future self is counting on the work you do today.
            </p>

            <Link
              to="/files"
              className="inline-flex items-center gap-2
              bg-indigo-600 hover:bg-indigo-700
              text-white px-7 py-3 rounded-xl font-bold transition"
            >
              Start Studying <ChevronRight size={18} />
            </Link>
          </div>

          {/* Stats */}
          <div className="rounded-3xl p-10 border border-white/10 bg-white/5 flex flex-col justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">
                Total Materials
              </p>
              <h3 className="text-6xl font-black text-white">{totalFiles}</h3>
              <p className="text-slate-400 mt-2">Study modules saved</p>
            </div>

            <Link
              to="/files"
              className="mt-8 flex items-center justify-between
              px-4 py-3 rounded-xl bg-white/5 hover:bg-indigo-600 transition group"
            >
              <span className="font-semibold group-hover:text-white">
                View Library
              </span>
              <Plus size={18} />
            </Link>
          </div>
        </div>

        {/* ================= QUOTE ================= */}
        <div className="rounded-3xl p-10 mb-14 text-center
          bg-white/5 border border-white/10">
          <Quote size={36} className="mx-auto text-indigo-400 mb-6" />
          <p className="text-2xl font-bold italic max-w-3xl mx-auto text-slate-100">
            “{randomQuote}”
          </p>
        </div>
      </main>

       {/* ================= RECENT FILES ================= */}
        {/* ================= RECENT FILES ================= */}
<section className="max-w-7xl mx-auto px-6 mt-20">
  <div className="flex items-center justify-between mb-10">
    <h2 className="text-2xl font-black flex items-center gap-3">
      <Layout className="text-indigo-400" />
      Recent Materials
    </h2>
    <Link
      to="/files"
      className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition"
    >
      Explore Library →
    </Link>
  </div>

  {recentFiles.length === 0 ? (
    <div className="py-20 text-center rounded-3xl
      bg-white/5 border border-dashed border-white/10">
      <p className="text-slate-400 text-sm">
        No study materials uploaded yet.
      </p>
    </div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {recentFiles.map((file) => (
        <div
          key={file._id}
          className="group relative rounded-3xl p-8
          bg-gradient-to-br from-[#0b1220] to-[#020617]
          border border-white/10
          hover:border-indigo-400/40
          hover:-translate-y-1
          hover:shadow-2xl hover:shadow-indigo-500/10
          transition-all duration-300"
        >
          {/* Icon */}
          <div className="w-14 h-14 bg-indigo-500/20
            rounded-2xl flex items-center justify-center mb-6">
            <FileText size={26} className="text-indigo-400" />
          </div>

          {/* Title */}
          <h3 className="font-black text-lg mb-1 truncate">
            {file.title}
          </h3>

          {/* Subject */}
          <p className="text-xs uppercase tracking-widest text-slate-400 mb-6">
            {file.subject || "General"}
          </p>

          {/* CTA */}
          <Link
            to={`/files/${file._id}`}
            className="inline-flex items-center gap-2
            text-indigo-400 font-semibold text-sm
            group-hover:text-indigo-300 transition"
          >
            Open Material
            <ChevronRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>

          {/* Glow effect */}
          <div className="absolute inset-0 rounded-3xl
            bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition" />
        </div>
      ))}
    </div>
  )}
</section>


      {/* ================= PROFILE MODAL ================= */}
      {showProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowProfile(false)}
          />

          <div className="relative w-full max-w-sm rounded-2xl
            bg-[#020617] border border-white/10 shadow-2xl">

            <div className="flex flex-col items-center pt-6 pb-4 border-b border-white/10">
              <div className="w-14 h-14 bg-indigo-500/20 rounded-xl
                flex items-center justify-center mb-3">
                <User size={26} className="text-indigo-400" />
              </div>
              <h2 className="text-lg font-bold">Account Profile</h2>
              <p className="text-xs text-slate-400">StudyGeni account</p>
            </div>

            <div className="px-6 py-5 space-y-3">
              <ProfileRow label="Full Name" value={user.username || user.name} />
              <ProfileRow label="Email" value={user.email} />
              <ProfileRow label="Role" value={user.role} />
            </div>

            <div className="px-6 pb-6 space-y-4">

  {/* Back Button */}
  <button
    onClick={() => setShowProfile(false)}
    className="w-full bg-indigo-600 hover:bg-indigo-700
    text-white text-sm font-semibold py-2.5 rounded-xl transition"
  >
    Back to Dashboard
  </button>

  {/* Danger Zone */}
  <div className="mt-4 p-4 rounded-xl border border-red-500/30 bg-red-500/10">
    <p className="text-xs font-semibold text-red-400 mb-2 uppercase tracking-wider">
      ⚠ Danger Zone
    </p>

    <input
      type="password"
      placeholder="Enter password to delete account"
      value={deletePassword}
      onChange={(e) => setDeletePassword(e.target.value)}
      className="w-full mb-3 bg-black/30 border border-red-500/30
      rounded-lg px-4 py-2.5 text-sm text-white
      placeholder:text-red-300 focus:outline-none
      focus:ring-2 focus:ring-red-500/40"
    />

    <button
      onClick={handleDeleteAccount}
      className="w-full bg-red-600 hover:bg-red-700
      text-white text-sm font-bold py-2.5 rounded-lg transition"
    >
      Delete Account Permanently
    </button>
  </div>
</div>

          </div>
        </div>
      )}
    </div>
  );
}

function ProfileRow({ label, value }) {
  return (
    <div className="flex items-center justify-between
      bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
      <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
        {label}
      </span>
      <span className="text-sm font-bold truncate max-w-[55%] text-right">
        {value}
      </span>
    </div>
  );
}
