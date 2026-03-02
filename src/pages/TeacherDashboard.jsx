import { useEffect, useState, useContext, useCallback } from "react";
import { uploadFile, getMyFiles, getAllFiles, deleteFile } from "../api/fileApi";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  UploadCloud,
  LogOut,
  BookOpen,
  Sparkles,
  User,
  Layout,
  FileText,
  Trash2,
  Download,
  Eye,
  Brain,
  MessageSquare,
  CloudUpload,
  Menu,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";

// New geometric animation
const slowPan = {
  animate: {
    backgroundPosition: ["0% 0%", "100% 100%"],
    transition: {
      duration: 100,
      ease: "linear",
      repeat: Infinity,
      repeatType: "reverse"
    }
  }
};

const handleDownload = (fileId) => {
  window.location.href = `${api.defaults.baseURL}/files/download/${fileId}`;
};

export default function TeacherDashboard() {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [globalFilesCount, setGlobalFilesCount] = useState(0);
  const [myFilesCount, setMyFilesCount] = useState(0);

  const [view, setView] = useState("my"); // 'my' or 'all'
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [form, setForm] = useState({
    title: "",
    subject: "",
    description: "",
    file: null,
  });

  const fetchFiles = useCallback(async () => {
    try {
      const [myRes, allRes] = await Promise.all([
        getMyFiles(),
        getAllFiles()
      ]);

      setMyFilesCount(myRes.data.files?.length || 0);
      setGlobalFilesCount(allRes.data.files?.length || 0);

      if (view === "my") {
        setFiles(myRes.data.files || []);
      } else {
        setFiles(allRes.data.files || []);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load files");
    }
  }, [view]);

  useEffect(() => {
    if (user?.role === "teacher") {
      fetchFiles();
    }
  }, [fetchFiles, user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files[0]) {
      setForm((prev) => ({ ...prev, file: e.dataTransfer.files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.file) return alert("Please select a file");

    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      await uploadFile(data);
      setForm({ title: "", subject: "", description: "", file: null });
      fetchFiles();
    } catch {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm("Are you sure you want to delete this file permanently?")) return;
    try {
      await deleteFile(fileId);
      setFiles((prev) => prev.filter((f) => f._id !== fileId));
      setMyFilesCount(prev => prev - 1);
      setGlobalFilesCount(prev => prev - 1);
    } catch (err) {
      console.error(err);
      alert("Failed to delete file");
    }
  };

  const handleOpen = async (fileId, fileName) => {
    try {
      const res = await api.get(`/files/download/${fileId}`, { responseType: "blob" });
      const pdfBlob = new Blob([res.data], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>${fileName || "Study Material"}</title>
            <style>
              html, body { margin: 0; height: 100%; background-color: #020617; }
              iframe { width: 100%; height: 100%; border: none; }
            </style>
          </head>
          <body><iframe src="${pdfUrl}"></iframe></body>
        </html>
      `;
      const htmlBlob = new Blob([html], { type: "text/html" });
      const htmlUrl = URL.createObjectURL(htmlBlob);
      window.open(htmlUrl, "_blank");

      setTimeout(() => {
        URL.revokeObjectURL(pdfUrl);
        URL.revokeObjectURL(htmlUrl);
      }, 15000);
    } catch (err) {
      console.error(err);
      alert("Failed to open file");
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="relative min-h-screen bg-[#020510] text-slate-200 overflow-x-hidden font-sans selection:bg-indigo-500/40 selection:text-white">

      {/* UNIQUE BACKGROUND: Animated Topographic / Contour Lines */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-30">
        <motion.div
          variants={slowPan}
          animate="animate"
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='pattern' width='100' height='100' patternUnits='userSpaceOnUse'%3E%3Cpath d='M0 100c50 0 50-50 100-50s50 50 100 50 50-50 100-50v100H0V100zM0 80c50 0 50-50 100-50s50 50 100 50 50-50 100-50v100H0V80zM0 60c50 0 50-50 100-50s50 50 100 50 50-50 100-50v100H0V60zM0 40c50 0 50-50 100-50s50 50 100 50 50-50 100-50v100H0V40zM0 20c50 0 50-50 100-50s50 50 100 50 50-50 100-50v100H0V20z' fill='none' stroke='%233b82f6' stroke-width='0.5' stroke-opacity='0.2'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23pattern)'/%3E%3C/svg%3E")`,
            backgroundSize: '400px 400px'
          }}
        />

        {/* Soft, structural corner glows */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.15),transparent_50%)]" />
        <div className="absolute bottom-0 left-0 w-[1000px] h-[1000px] bg-[radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.15),transparent_50%)]" />
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.08),transparent_60%)]" />
      </div>

      {/* Floating Navbar Matching User Request */}
      <nav className="sticky top-0 z-50 pt-4 px-4 sm:px-6 transition-all">
        <div className="max-w-7xl mx-auto h-[72px] bg-[#070b14] border border-[#1e2336] rounded-[20px] flex justify-between items-center px-4 sm:px-5 shadow-lg relative z-50">
          <div className="flex items-center gap-2 sm:gap-3 group cursor-pointer z-50">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#0d1224] border border-[#1e2336] flex items-center justify-center">
              <Sparkles className="text-indigo-400 w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="font-extrabold text-xl sm:text-2xl text-white tracking-tight">EduNexa</span>
            <span className="inline-flex px-2 sm:px-3 py-1 rounded-lg bg-[#141a30] text-[10px] uppercase font-bold tracking-widest text-[#a5b4fc] ml-1 sm:ml-2">Teacher</span>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            {/* Global & Own Counts matching screenshot perfectly */}
            <div className="flex items-center h-12 bg-[#0d1224] border border-[#1e2336] rounded-xl px-5 gap-5 backdrop-blur-sm">
              <div className="flex items-center gap-3 border-r border-[#1e2336] pr-5 h-full">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.5)]"></div>
                <div className="flex flex-col justify-center">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5">My Files</span>
                  <span className="text-base font-black text-white leading-none tracking-tight">{myFilesCount}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.5)]"></div>
                <div className="flex flex-col justify-center">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5">Global</span>
                  <span className="text-base font-black text-white leading-none tracking-tight">{globalFilesCount}</span>
                </div>
              </div>
            </div>

            {/* User Component matching screenshot perfectly */}
            <div className="flex items-center h-12 gap-3 px-4 rounded-xl bg-[#0d1224] border border-[#1e2336] text-sm font-bold text-slate-200 backdrop-blur-sm">
              <div className="bg-[#1a2138] p-1.5 rounded-lg flex items-center justify-center">
                <User size={16} className="text-indigo-300" />
              </div>
              <span className="tracking-wide text-[14px]">{user.username || user.name}</span>
            </div>

            {/* Logout Component matching screenshot perfectly */}
            <button onClick={handleLogout} className="h-12 px-5 rounded-xl bg-[#0d1224] hover:bg-[#1a2138] border border-[#1e2336] transition-all flex items-center justify-center gap-2 text-[14px] font-bold text-slate-300">
              <LogOut size={16} className="text-slate-400" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2.5 rounded-xl bg-[#0d1224] border border-[#1e2336] text-slate-300 flex items-center justify-center transition-all hover:bg-[#1a2138]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-[88px] left-4 right-4 bg-[#070b14]/95 backdrop-blur-2xl border border-[#1e2336] rounded-[24px] p-5 shadow-2xl z-40 lg:hidden flex flex-col gap-4 origin-top"
            >
              {/* Mobile Stats */}
              <div className="flex flex-col gap-3 bg-[#0d1224] rounded-2xl p-5 border border-[#1e2336]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.5)]"></div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">My Files</span>
                  </div>
                  <span className="text-xl font-black text-white">{myFilesCount}</span>
                </div>
                <div className="w-full h-[1px] bg-[#1e2336] opacity-50"></div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.5)]"></div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Global Files</span>
                  </div>
                  <span className="text-xl font-black text-white">{globalFilesCount}</span>
                </div>
              </div>

              {/* Mobile User Info */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-[#0d1224] border border-[#1e2336]">
                <div className="bg-[#1a2138] p-3 rounded-xl flex items-center justify-center">
                  <User size={20} className="text-indigo-300" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Logged in as</span>
                  <span className="text-[15px] font-bold text-white">{user.username || user.name}</span>
                </div>
              </div>

              {/* Mobile Logout */}
              <button onClick={handleLogout} className="w-full py-4 mt-2 rounded-[16px] bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 font-bold flex items-center justify-center gap-2 transition-colors active:scale-[0.98]">
                <LogOut size={18} />
                <span>Logout securely</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-24 relative z-10 transition-all duration-300">

        {/* MAIN SPLIT LAYOUT FOR CONTENT */}
        <div className="grid xl:grid-cols-12 gap-8 lg:gap-10">

          {/* UPLOAD FORM (Neat, Dark, Animated) */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, type: 'spring' }} className="xl:col-span-4 space-y-6">
            <div className="sticky top-24 bg-[#080d1a]/80 border border-white/10 rounded-[2rem] p-6 sm:p-8 relative overflow-hidden backdrop-blur-2xl shadow-[0_30px_60px_rgba(0,0,0,0.6)] transition-all">

              {/* Neat header from screenshot */}
              <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="w-14 h-14 bg-[#12182b] rounded-2xl flex items-center justify-center border border-white/5 shadow-inner">
                  <CloudUpload className="text-indigo-300" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Upload Material</h2>
                  <p className="text-xs text-slate-400 font-medium mt-1">Add new content to library</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Title</label>
                  <input name="title" placeholder="e.g. Advanced Mathematics v2" value={form.title} onChange={handleChange} required className="w-full bg-[#0a0f1c] border border-white/5 rounded-xl px-4 py-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-[#0a0f1c] focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium text-sm shadow-[inset_0_2px_10px_rgba(0,0,0,0.3)]" />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                  <input name="subject" placeholder="e.g. Mathematics" value={form.subject} onChange={handleChange} required className="w-full bg-[#0a0f1c] border border-white/5 rounded-xl px-4 py-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-[#0a0f1c] focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium text-sm shadow-[inset_0_2px_10px_rgba(0,0,0,0.3)]" />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Description</label>
                  <textarea name="description" placeholder="Provide a brief overview..." value={form.description} onChange={handleChange} rows={3} className="w-full bg-[#0a0f1c] border border-white/5 rounded-xl px-4 py-4 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-[#0a0f1c] focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium resize-none text-sm shadow-[inset_0_2px_10px_rgba(0,0,0,0.3)]" />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="pt-2">
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={handleDrop}
                    className={`relative overflow-hidden border-2 rounded-3xl p-8 text-center cursor-pointer transition-all duration-300 group/drop
                        ${dragActive ? "border-indigo-500 border-solid bg-indigo-500/10 scale-[1.02] shadow-[0_0_30px_rgba(99,102,241,0.2)]" : "border-slate-700/50 border-dashed bg-[#0a0f1c] hover:border-indigo-500/50 hover:bg-[#12182b]"}`}
                  >
                    {dragActive && <div className="absolute inset-0 bg-indigo-500/5 animate-pulse"></div>}

                    <input type="file" name="file" onChange={handleChange} className="hidden" id="fileUpload" />
                    <label htmlFor="fileUpload" className="block cursor-pointer flex flex-col items-center justify-center w-full h-full relative z-10 py-2">
                      <motion.div animate={{ y: dragActive ? -5 : 0 }} className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 ${dragActive ? 'bg-indigo-500/20 text-indigo-400' : 'bg-[#1e2336] text-slate-400 group-hover/drop:bg-[#252a40] group-hover/drop:text-slate-300'}`}>
                        <CloudUpload size={28} />
                      </motion.div>
                      <p className="text-sm font-bold text-white mb-1 tracking-wide">
                        {form.file ? <span className="text-indigo-400">{form.file.name}</span> : "Click to browse or drag file"}
                      </p>
                      <p className="text-xs font-medium text-slate-500 mt-2">
                        {form.file ? "File ready to upload" : "Max file size: 50MB"}
                      </p>
                    </label>
                  </div>
                </motion.div>

                <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} disabled={loading} className="w-full relative mt-2 group/btn inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-200 text-[#03050C] px-8 py-4.5 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)] disabled:opacity-70 disabled:pointer-events-none text-sm">
                  <span className="relative flex items-center gap-2">
                    {loading ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <UploadCloud size={18} />}
                    {loading ? "UPLOADING..." : "UPLOAD"}
                  </span>
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* FILES LIST AREA */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, type: 'spring' }} className="xl:col-span-8">

            {/* Library Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 bg-[#080d1a]/80 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#12182b] rounded-xl flex items-center justify-center border border-white/5 shadow-inner">
                  <Layout className="text-indigo-300" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Resource Library</h2>
                  <p className="text-xs text-slate-400 font-medium mt-1">Browse and manage learning assets</p>
                </div>
              </div>

              <div className="flex bg-[#03050C] p-1.5 rounded-xl border border-white/5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] w-full sm:w-auto overflow-x-auto scroolbar-hide">
                {[
                  { id: 'my', label: 'My Uploads', count: myFilesCount, color: 'text-indigo-400 bg-indigo-500/10' },
                  { id: 'all', label: 'Global Library', count: globalFilesCount, color: 'text-sky-400 bg-sky-500/10' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setView(tab.id)}
                    className={`relative w-full sm:w-auto px-6 py-3 rounded-lg font-bold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-3 whitespace-nowrap ${view === tab.id ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    {view === tab.id && (
                      <motion.div layoutId="activeTab2" className="absolute inset-0 bg-[#1e2336] border border-white/10 rounded-lg shadow-sm" />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                    <span className={`relative z-10 px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-black drop-shadow-sm border border-white/5 ${tab.color}`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {files.length === 0 ? (
              <div className="text-center py-24 bg-[#080d1a]/50 backdrop-blur-xl rounded-[2.5rem] border border-white/5 relative overflow-hidden group shadow-xl">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/5 blur-[80px] rounded-full pointer-events-none transition-all duration-700"></div>
                <div className="relative z-10">
                  <div className="w-24 h-24 bg-[#12182b] rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/5 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                    <FileText className="text-slate-500" size={40} />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-3 tracking-tight">Nothing here yet</h3>
                  <p className="text-slate-400 font-medium text-base max-w-sm mx-auto">Your uploaded resources will appear here. Utilize the neat upload panel to get started.</p>
                </div>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-5 sm:gap-6">
                <AnimatePresence>
                  {files.map((file, i) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -15 }}
                      transition={{ delay: i * 0.05, duration: 0.4, type: "spring", stiffness: 100 }}
                      key={file._id}
                      className="rounded-[1.5rem] p-6 sm:p-7 bg-[#080d1a]/80 backdrop-blur-xl border border-white/5 hover:border-indigo-500/30 transition-all duration-300 group flex flex-col h-full relative overflow-hidden shadow-lg hover:shadow-[0_15px_40px_rgba(0,0,0,0.4)] hover:-translate-y-2"
                    >
                      <div className="absolute -top-32 -right-32 w-64 h-64 bg-indigo-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                      <div className="flex items-start justify-between mb-5 z-10 relative">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-[#12182b] rounded-2xl flex items-center justify-center border border-white/5 flex-shrink-0 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/30 group-hover:scale-105 transition-all duration-300 shadow-inner">
                            <BookOpen className="text-slate-400 group-hover:text-indigo-400" size={26} />
                          </div>
                          <div className="pt-1">
                            <h3 className="text-lg font-black text-white line-clamp-2 leading-tight group-hover:text-indigo-300 transition-colors tracking-wide mb-2" title={file.title}>{file.title}</h3>
                            <span className="inline-block px-2.5 py-1 rounded-md bg-[#03050C] border border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400 transition-colors shadow-inner">{file.subject || "General"}</span>
                          </div>
                        </div>
                      </div>

                      {view === "all" && file.createdBy?.username && (
                        <div className="mb-5 bg-[#03050C] px-3.5 py-2.5 rounded-xl border border-white/5 flex items-center gap-3 max-w-fit z-10 relative shadow-inner">
                          <div className="bg-[#1e2336] p-1.5 rounded-md">
                            <User size={14} className="text-slate-300" />
                          </div>
                          <span className="text-xs font-bold text-slate-300 truncate max-w-[150px]" title={file.createdBy.username}>By {file.createdBy.username}</span>
                        </div>
                      )}

                      <div className="mt-auto flex flex-col gap-2 pt-5 border-t border-white/5 z-10 relative">
                        <div className="grid grid-cols-2 gap-2">
                          <button onClick={() => handleOpen(file._id, file.title)} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#12182b] hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold transition-all hover:scale-[1.02] active:scale-95 border border-transparent hover:border-white/10">
                            <Eye size={16} /> View
                          </button>
                          <button onClick={() => handleDownload(file._id)} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#12182b] hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold transition-all hover:scale-[1.02] active:scale-95 border border-transparent hover:border-white/10">
                            <Download size={16} /> Download
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <button onClick={() => navigate(`/files/${file._id}/summary`)} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-300 hover:text-white text-xs font-bold transition-all hover:scale-[1.02] active:scale-95 group/ai">
                            <Brain size={16} className="text-indigo-400 group-hover/ai:text-indigo-300" /> AI Summary
                          </button>
                          <button onClick={() => navigate(`/files/${file._id}/quiz`)} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-300 hover:text-white text-xs font-bold transition-all hover:scale-[1.02] active:scale-95 group/ai">
                            <MessageSquare size={16} className="text-purple-400 group-hover/ai:text-purple-300" /> AI Quiz
                          </button>
                        </div>
                      </div>

                      {view === "my" && (
                        <div className="absolute top-5 right-5 z-20">
                          <button onClick={() => handleDelete(file._id)} className="p-3 rounded-xl bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500 hover:text-white border border-red-500/20 shadow-lg hover:scale-110 active:scale-95" title="Permanently Delete">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
