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
} from "lucide-react";

export default function StudentDashboard() {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showProfile, setShowProfile] = useState(false);
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
    <div className="min-h-screen bg-[#020617] text-slate-200 pb-24">

      {/* ================= NAVBAR ================= */}
      <nav className="sticky top-0 z-40 bg-[#020617]/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-500/20 p-1.5 rounded-lg">
              <Sparkles size={18} className="text-indigo-400" />
            </div>
            <span className="font-bold text-lg">EduNexa</span>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setShowProfile(true)}>
              <User size={20} />
            </button>
            <button onClick={handleLogout} className="text-red-400">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* ================= MAIN ================= */}
      <main className="max-w-7xl mx-auto px-6 pt-12">

        {/* ================= HERO ================= */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="md:col-span-2 rounded-3xl p-10 bg-gradient-to-br
            from-[#0f172a] via-[#1e1b4b] to-[#020617] border border-white/10">

            <span className="text-xs uppercase tracking-widest bg-white/10 px-4 py-1.5 rounded-full">
              Student Workspace
            </span>

            <h1 className="text-4xl font-black mt-6 mb-4">
              Welcome back,<br /> {user.username || user.name}
            </h1>

            <p className="text-slate-400 mb-8 max-w-sm">
              Continue your learning journey with EduNexa.
            </p>

            <Link
              to="/files"
              className="inline-flex items-center gap-2 bg-indigo-600
              hover:bg-indigo-700 px-7 py-3 rounded-xl font-bold"
            >
              Start Studying <ChevronRight size={18} />
            </Link>
          </div>

          <div className="rounded-3xl p-10 bg-white/5 border border-white/10">
            <p className="text-xs uppercase tracking-widest text-slate-400">
              Total Materials
            </p>
            <h3 className="text-6xl font-black mt-2">{totalFiles}</h3>
            <Link to="/files" className="mt-8 flex justify-between items-center bg-white/5 px-4 py-3 rounded-xl">
              View Library <Plus size={18} />
            </Link>
          </div>
        </div>

        {/* ================= QUICK ACTIONS ================= */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">

          <div className="rounded-3xl p-8 bg-indigo-500/10 border border-white/10">
            <h3 className="text-xs uppercase text-slate-400">Progress</h3>
            <p className="text-4xl font-black mt-2">{totalFiles}</p>
            <p className="text-sm text-slate-400">Available materials</p>
          </div>

          <Link
            to="/files"
            className="rounded-3xl p-8 bg-white/5 border border-white/10
            hover:border-indigo-400/40 transition"
          >
            <FileText className="text-indigo-400 mb-4" />
            <h3 className="font-bold">Continue Learning</h3>
            <p className="text-sm text-slate-400">
              Resume your study materials
            </p>
          </Link>

          <div className="rounded-3xl p-8 bg-white/5 border border-white/10">
            <Sparkles className="text-indigo-400 mb-4" />
            <h3 className="font-bold">AI Learning</h3>
            <p className="text-sm text-slate-400">
              Summaries & quizzes powered by AI
            </p>
          </div>
        </div>
      </main>

      {/* ================= RECENT MATERIALS ================= */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between mb-8">
          <h2 className="text-2xl font-black flex items-center gap-3">
            <Layout className="text-indigo-400" />
            Recent Materials
          </h2>
          <Link to="/files" className="text-indigo-400">Explore →</Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentFiles.map((file) => (
            <div
              key={file._id}
              className="rounded-3xl p-8 bg-white/5 border border-white/10
              hover:border-indigo-400/40 transition"
            >
              <FileText className="text-indigo-400 mb-4" />
              <h3 className="font-black truncate">{file.title}</h3>
              <p className="text-xs uppercase text-slate-400 mb-6">
                {file.subject || "General"}
              </p>

              <div className="flex justify-between">
                <Link to={`/files/${file._id}`} className="text-indigo-400">
                  Open
                </Link>

                <button
                  onClick={() =>
                    (window.location.href =
                      `${API_BASE}/files/download/${file._id}`)
                  }
                  className="text-xs bg-white/10 px-3 py-1.5 rounded-lg"
                >
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= PROFILE MODAL ================= */}
      {showProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-[#020617] rounded-2xl p-6 w-full max-w-sm">
            <h2 className="font-bold mb-4">Account Profile</h2>

            <ProfileRow label="Name" value={user.username || user.name} />
            <ProfileRow label="Email" value={user.email} />
            <ProfileRow label="Role" value={user.role} />

            <input
              type="password"
              placeholder="Password to delete"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              className="w-full mt-4 p-2 bg-black/30 rounded"
            />

            <button
              onClick={handleDeleteAccount}
              className="w-full mt-3 bg-red-600 py-2 rounded"
            >
              Delete Account
            </button>

            <button
              onClick={() => setShowProfile(false)}
              className="w-full mt-3 bg-indigo-600 py-2 rounded"
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileRow({ label, value }) {
  return (
    <div className="flex justify-between text-sm py-1">
      <span className="text-slate-400">{label}</span>
      <span className="font-semibold truncate">{value}</span>
    </div>
  );
}
