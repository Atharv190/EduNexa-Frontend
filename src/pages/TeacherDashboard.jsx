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
  X,
  ChevronDown,
  Filter,
  Search,
  GraduationCap,
  Calendar
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";

// New geometric animation


const handleDownload = (fileId) => {
  window.location.href = `${api.defaults.baseURL}/files/download/${fileId}`;
};

export default function TeacherDashboard() {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [globalFilesCount, setGlobalFilesCount] = useState(0);
  const [myFilesCount, setMyFilesCount] = useState(0);

  const [view, setView] = useState("my"); // 'my' or 'all'
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUploadFormExpanded, setIsUploadFormExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  const [form, setForm] = useState({
    title: "",
    subject: "",
    description: "",
    file: null,
  });

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Extract unique subjects from files
  useEffect(() => {
    const subjects = [...new Set(files.map(f => f.subject).filter(Boolean))];
    setAvailableSubjects(subjects);
  }, [files]);

  // Filter files based on search query and subject
  useEffect(() => {
    let filtered = [...files];
    
    if (searchQuery) {
      filtered = filtered.filter(file => 
        file.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.subject?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (subjectFilter !== "all") {
      filtered = filtered.filter(file => file.subject === subjectFilter);
    }
    
    setFilteredFiles(filtered);
  }, [files, searchQuery, subjectFilter]);

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
      setIsUploadFormExpanded(false);
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
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              html, body { margin: 0; height: 100%; background-color: #0a0c10; }
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

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMobileMenuOpen && !e.target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Close mobile menu when window resizes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!user) return null;

  // Get user's display name
  const displayName = user.username || user.name || user.email?.split('@')[0] || "Teacher";

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0a0c10] via-[#0f1219] to-[#1a1f2c] text-slate-200 overflow-x-hidden font-sans selection:bg-indigo-500/40 selection:text-white">

      {/* NEW BACKGROUND: Subtle gradient with floating particles */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Animated gradient orbs */}
        <div className="absolute top-0 -left-40 w-[500px] h-[500px] bg-purple-600/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 -right-40 w-[500px] h-[500px] bg-indigo-600/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-40 left-20 w-[500px] h-[500px] bg-blue-600/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        
        {/* Grid overlay - Fixed the syntax error */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M0%200h60v60H0z%22%20fill%3D%22none%22%20stroke%3D%22rgba(99%2C102%2C241%2C0.03)%22%20stroke-width%3D%220.5%22%2F%3E%3C%2Fsvg%3E')] opacity-20"></div>
        
        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-indigo-400/20 rounded-full"
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
              }}
              animate={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
                transition: {
                  duration: Math.random() * 10 + 10,
                  repeat: Infinity,
                  ease: "linear"
                }
              }}
            />
          ))}
        </div>
      </div>

      {/* Floating Navbar - Responsive */}
      <nav className="sticky top-0 z-50 pt-2 sm:pt-4 px-3 sm:px-6 transition-all w-full">
        <div className="w-full max-w-5xl mx-auto h-[60px] sm:h-[72px] bg-[#1a1f2c]/90 backdrop-blur-xl border border-white/10 rounded-[16px] sm:rounded-[20px] flex justify-between items-center px-3 sm:px-5 shadow-lg relative z-50">
          {/* Logo Section */}
          <div className="flex items-center gap-1.5 sm:gap-3 group cursor-pointer z-50">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Sparkles className="text-white w-3.5 h-3.5 sm:w-5 sm:h-5" />
            </div>
            <span className="font-extrabold text-lg sm:text-2xl text-white tracking-tight">EduNexa</span>
            <span className="hidden xs:inline-flex px-2 sm:px-3 py-1 rounded-lg bg-indigo-500/20 text-[8px] sm:text-[10px] uppercase font-bold tracking-widest text-indigo-300 border border-indigo-500/30 ml-1 sm:ml-2">Teacher</span>
          </div>

          {/* Desktop Menu - Hidden on mobile */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Global & Own Counts */}
            <div className="flex items-center h-12 bg-[#0f1219] border border-white/10 rounded-xl px-5 gap-5 backdrop-blur-sm">
              <div className="flex items-center gap-3 border-r border-white/10 pr-5 h-full">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.5)]"></div>
                <div className="flex flex-col justify-center">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5">My Files</span>
                  <span className="text-base font-black text-white leading-none tracking-tight">{myFilesCount}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.5)]"></div>
                <div className="flex flex-col justify-center">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5">Global</span>
                  <span className="text-base font-black text-white leading-none tracking-tight">{globalFilesCount}</span>
                </div>
              </div>
            </div>

            {/* User Component */}
            <div className="flex items-center h-12 gap-3 px-4 rounded-xl bg-[#0f1219] border border-white/10 text-sm font-bold text-slate-200 backdrop-blur-sm">
              <div className="bg-gradient-to-br from-indigo-500/20 to-purple-600/20 p-1.5 rounded-lg flex items-center justify-center">
                <User size={16} className="text-indigo-300" />
              </div>
              <span className="tracking-wide text-[14px]">{displayName}</span>
            </div>

            {/* Logout Button */}
            <button onClick={handleLogout} className="h-12 px-5 rounded-xl bg-[#0f1219] hover:bg-red-500/20 border border-white/10 transition-all flex items-center justify-center gap-2 text-[14px] font-bold text-slate-300 hover:text-red-400 group">
              <LogOut size={16} className="text-slate-400 group-hover:text-red-400" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 sm:p-2.5 rounded-xl bg-[#0f1219] border border-white/10 text-slate-300 flex items-center justify-center transition-all hover:bg-[#1a1f2c] relative z-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile Menu Overlay - Improved responsive design */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />

              {/* Menu Panel */}
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 25 }}
                className="absolute top-[68px] left-3 right-3 bg-[#1a1f2c]/95 backdrop-blur-2xl border border-white/10 rounded-[20px] p-4 shadow-2xl z-50 lg:hidden flex flex-col gap-3 origin-top mobile-menu-container max-w-md mx-auto"
              >
                {/* Teacher Badge - Mobile */}
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Mobile Menu</span>
                  <span className="inline-flex px-2.5 py-1 rounded-lg bg-indigo-500/20 text-[9px] uppercase font-bold tracking-widest text-indigo-300 border border-indigo-500/30">Teacher</span>
                </div>

                {/* Mobile Stats - Enhanced for better visibility */}
                <div className="flex flex-col gap-2 bg-[#0f1219] rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-[0_0_12px_rgba(129,140,248,0.6)]"></div>
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">My Files</span>
                    </div>
                    <span className="text-xl font-black text-white">{myFilesCount}</span>
                  </div>
                  <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.6)]"></div>
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Global Files</span>
                    </div>
                    <span className="text-xl font-black text-white">{globalFilesCount}</span>
                  </div>
                </div>

                {/* Mobile User Info - Enhanced */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-[#0f1219] to-[#1a1f2c] border border-white/10">
                  <div className="bg-gradient-to-br from-indigo-500/20 to-purple-600/20 p-2 rounded-lg flex items-center justify-center shadow-inner">
                    <User size={18} className="text-indigo-300" />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-[8px] uppercase font-bold text-slate-500 tracking-wider">Logged in as</span>
                    <span className="text-sm font-bold text-white truncate">{displayName}</span>
                    <span className="text-[10px] text-slate-400 truncate">{user.email || ''}</span>
                  </div>
                </div>

                {/* Quick Actions - Mobile */}
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    onClick={() => {
                      setView("my");
                      setIsMobileMenuOpen(false);
                    }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                      view === "my" 
                        ? "bg-indigo-500/20 border border-indigo-500/30 text-indigo-300" 
                        : "bg-[#0f1219] border border-white/10 text-slate-300"
                    }`}
                  >
                    <FileText size={14} className={view === "my" ? "text-indigo-400" : "text-slate-400"} />
                    My Files
                  </button>
                  <button
                    onClick={() => {
                      setView("all");
                      setIsMobileMenuOpen(false);
                    }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                      view === "all" 
                        ? "bg-purple-500/20 border border-purple-500/30 text-purple-300" 
                        : "bg-[#0f1219] border border-white/10 text-slate-300"
                    }`}
                  >
                    <Layout size={14} className={view === "all" ? "text-purple-400" : "text-slate-400"} />
                    Library
                  </button>
                </div>

                {/* Mobile Logout - Enhanced */}
                <button
                  onClick={handleLogout}
                  className="w-full py-3 mt-1 rounded-xl bg-gradient-to-r from-red-500/10 to-red-500/5 hover:from-red-500/20 hover:to-red-500/10 text-red-400 border border-red-500/20 font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] hover:text-red-300 text-xs"
                >
                  <LogOut size={14} />
                  <span>Logout securely</span>
                </button>

                {/* Version Info */}
                <div className="text-center mt-1">
                  <span className="text-[7px] text-slate-600">EduNexa Teacher v1.0</span>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>

      <main className="w-full max-w-5xl mx-auto px-3 sm:px-5 pt-4 sm:pt-8 pb-16 sm:pb-24 relative z-10 transition-all duration-300 flex flex-col items-center">

        {/* WELCOME BANNER - NEW SECTION */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="w-full mb-6 sm:mb-8"
        >
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 border border-white/10 backdrop-blur-xl p-5 sm:p-7">
            {/* Decorative elements */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Avatar with gradient */}
                <div className="relative">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl">
                    <GraduationCap size={32} className="text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-[#1a1f2c]"></div>
                </div>
                
                {/* Welcome text */}
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                    {getGreeting()}, <span className="bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">{displayName}</span>
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Calendar size={14} />
                      <span className="text-xs sm:text-sm font-medium">{formatDate(currentTime)}</span>
                    </div>
                    <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <BookOpen size={14} />
                      <span className="text-xs sm:text-sm font-medium">{myFilesCount} {myFilesCount === 1 ? 'resource' : 'resources'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick stats for desktop */}
              <div className="hidden sm:flex items-center gap-3 bg-[#0f1219]/80 border border-white/10 rounded-xl px-5 py-3">
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Teacher since</p>
                  <p className="text-sm font-bold text-white">2026</p>
                </div>
                <div className="w-px h-8 bg-white/10"></div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Global files</p>
                  <p className="text-sm font-bold text-white">{globalFilesCount}</p>
                </div>
              </div>
            </div>

            {/* Mobile quick stats */}
            <div className="sm:hidden flex items-center justify-around mt-4 pt-4 border-t border-white/10">
              <div className="text-center">
                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">Teacher since</p>
                <p className="text-xs font-bold text-white">2024</p>
              </div>
              <div className="w-px h-6 bg-white/10"></div>
              <div className="text-center">
                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">Global files</p>
                <p className="text-xs font-bold text-white">{globalFilesCount}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* MAIN SPLIT LAYOUT FOR CONTENT - Responsive grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 place-items-center md:place-items-stretch">

          {/* UPLOAD FORM - Collapsible on mobile */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, type: 'spring', delay: 0.2 }}
            className="md:col-span-5 lg:col-span-4 w-full"
          >
            <div className="lg:sticky lg:top-24 bg-[#1a1f2c]/80 border border-white/10 rounded-2xl sm:rounded-[2rem] overflow-hidden backdrop-blur-2xl shadow-[0_30px_60px_rgba(0,0,0,0.6)] transition-all">
              
              {/* Mobile Upload Header - Collapsible */}
              <div 
                className="md:hidden flex items-center justify-between p-4 cursor-pointer"
                onClick={() => setIsUploadFormExpanded(!isUploadFormExpanded)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center border border-white/10 shadow-lg">
                    <CloudUpload className="text-white" size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Upload Material</h3>
                    <p className="text-[10px] text-slate-400">Add new content</p>
                  </div>
                </div>
                <ChevronDown 
                  size={18} 
                  className={`text-slate-400 transition-transform duration-300 ${isUploadFormExpanded ? 'rotate-180' : ''}`}
                />
              </div>

              {/* Desktop Header - Hidden on mobile */}
              <div className="hidden md:flex items-center gap-4 p-6 sm:p-8 pb-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center border border-white/10 shadow-lg">
                  <CloudUpload className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Upload Material</h2>
                  <p className="text-[10px] sm:text-xs text-slate-400 font-medium mt-1">Add new content to library</p>
                </div>
              </div>

              {/* Upload Form - Collapsible on mobile */}
              <AnimatePresence>
                {(isUploadFormExpanded || (typeof window !== 'undefined' && window.innerWidth >= 768)) && (
                  <motion.form 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleSubmit} 
                    className="overflow-hidden"
                  >
                    <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-1.5 sm:space-y-2">
                        <label className="text-[9px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Title</label>
                        <input
                          name="title"
                          placeholder="e.g. Advanced Mathematics v2"
                          value={form.title}
                          onChange={handleChange}
                          required
                          className="w-full bg-[#0f1219] border border-white/10 rounded-xl px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium shadow-[inset_0_2px_10px_rgba(0,0,0,0.3)]"
                        />
                      </motion.div>

                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-1.5 sm:space-y-2">
                        <label className="text-[9px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                        <input
                          name="subject"
                          placeholder="e.g. Mathematics"
                          value={form.subject}
                          onChange={handleChange}
                          required
                          className="w-full bg-[#0f1219] border border-white/10 rounded-xl px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium shadow-[inset_0_2px_10px_rgba(0,0,0,0.3)]"
                        />
                      </motion.div>

                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-1.5 sm:space-y-2">
                        <label className="text-[9px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Description</label>
                        <textarea
                          name="description"
                          placeholder="Provide a brief overview..."
                          value={form.description}
                          onChange={handleChange}
                          rows={2}
                          className="w-full bg-[#0f1219] border border-white/10 rounded-xl px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium resize-none shadow-[inset_0_2px_10px_rgba(0,0,0,0.3)]"
                        />
                      </motion.div>

                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="pt-1 sm:pt-2">
                        <div
                          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                          onDragLeave={() => setDragActive(false)}
                          onDrop={handleDrop}
                          className={`relative overflow-hidden border-2 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center cursor-pointer transition-all duration-300 group/drop
                              ${dragActive ? "border-indigo-500 border-solid bg-indigo-500/10 scale-[1.02] shadow-[0_0_30px_rgba(99,102,241,0.2)]" : "border-white/10 border-dashed bg-[#0f1219] hover:border-indigo-500/50 hover:bg-[#1a1f2c]"}`}
                        >
                          {dragActive && <div className="absolute inset-0 bg-indigo-500/5 animate-pulse"></div>}

                          <input type="file" name="file" onChange={handleChange} className="hidden" id="fileUpload" />
                          <label htmlFor="fileUpload" className="block cursor-pointer flex flex-col items-center justify-center w-full h-full relative z-10">
                            <motion.div animate={{ y: dragActive ? -5 : 0 }} className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mb-2 sm:mb-3 transition-all duration-300 ${dragActive ? 'bg-indigo-500/20 text-indigo-400' : 'bg-[#1e2336] text-slate-400 group-hover/drop:bg-[#252a40] group-hover/drop:text-slate-300'}`}>
                              <CloudUpload size={20} />
                            </motion.div>
                            <p className="text-xs sm:text-sm font-bold text-white mb-1 tracking-wide px-2">
                              {form.file ? <span className="text-indigo-400 break-all">{form.file.name}</span> : "Click to browse or drag file"}
                            </p>
                            <p className="text-[9px] sm:text-xs font-medium text-slate-500">
                              {form.file ? "File ready to upload" : "Max file size: 50MB"}
                            </p>
                          </label>
                        </div>
                      </motion.div>

                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        disabled={loading}
                        className="w-full relative mt-2 sm:mt-3 group/btn inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(99,102,241,0.3)] disabled:opacity-70 disabled:pointer-events-none text-xs sm:text-sm"
                      >
                        <span className="relative flex items-center gap-2">
                          {loading ? <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <UploadCloud size={16} />}
                          {loading ? "UPLOADING..." : "UPLOAD"}
                        </span>
                      </motion.button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* FILES LIST AREA - Full width on mobile, 7 cols on tablet, 8 on desktop */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, type: 'spring', delay: 0.3 }}
            className="md:col-span-7 lg:col-span-8 w-full"
          >

            {/* Library Header - Responsive */}
            <div className="flex flex-col gap-4 mb-4 sm:mb-6 bg-[#1a1f2c]/80 backdrop-blur-xl p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
              
              {/* Title and View Toggle Row */}
              <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center border border-white/10 shadow-lg">
                    <Layout className="text-white" size={18} />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-white tracking-tight">Resource Library</h2>
                    <p className="text-[9px] sm:text-xs text-slate-400 font-medium">Browse and manage learning assets</p>
                  </div>
                </div>

                {/* Tab Switcher - Compact on mobile */}
                <div className="flex bg-[#0f1219] p-1 rounded-lg border border-white/10 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] w-full xs:w-auto">
                  {[
                    { id: 'my', label: 'Mine', count: myFilesCount, color: 'bg-indigo-500/20 text-indigo-300' },
                    { id: 'all', label: 'All', count: globalFilesCount, color: 'bg-purple-500/20 text-purple-300' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setView(tab.id)}
                      className={`relative flex-1 xs:flex-none px-3 sm:px-4 py-2 rounded-md font-bold text-[10px] sm:text-xs transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 whitespace-nowrap ${view === tab.id ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      {view === tab.id && (
                        <motion.div layoutId="activeTab" className="absolute inset-0 bg-white/10 border border-white/20 rounded-md shadow-sm" />
                      )}
                      <span className="relative z-10">{tab.label}</span>
                      <span className={`relative z-10 px-1.5 sm:px-2 py-0.5 rounded text-[8px] sm:text-[10px] font-black ${tab.color}`}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Search and Filter Row */}
              <div className="flex flex-col sm:flex-row gap-2">
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search files..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#0f1219] border border-white/10 rounded-lg pl-8 pr-3 py-2 text-xs sm:text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50"
                  />
                </div>

                {/* Filter Button - Mobile */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="sm:hidden flex items-center justify-center gap-1.5 bg-[#0f1219] border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300"
                >
                  <Filter size={14} />
                  Filter
                  {subjectFilter !== "all" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                  )}
                </button>

                {/* Subject Filter - Desktop */}
                <select
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  className="hidden sm:block bg-[#0f1219] border border-white/10 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50"
                >
                  <option value="all">All Subjects</option>
                  {availableSubjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              {/* Mobile Filter Options */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="sm:hidden overflow-hidden"
                  >
                    <div className="pt-2">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Filter by Subject</label>
                      <select
                        value={subjectFilter}
                        onChange={(e) => setSubjectFilter(e.target.value)}
                        className="w-full bg-[#0f1219] border border-white/10 rounded-lg px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50"
                      >
                        <option value="all">All Subjects</option>
                        {availableSubjects.map(subject => (
                          <option key={subject} value={subject}>{subject}</option>
                        ))}
                      </select>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Files Grid */}
            {files.length === 0 ? (
              <div className="text-center py-12 sm:py-16 bg-[#1a1f2c]/50 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/10 relative overflow-hidden group shadow-xl">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 sm:w-60 h-40 sm:h-60 bg-indigo-500/10 blur-[60px] rounded-full pointer-events-none"></div>
                <div className="relative z-10 px-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                    <FileText className="text-indigo-400" size={24} />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white mb-2 tracking-tight">Nothing here yet</h3>
                  <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-sm mx-auto">Your uploaded resources will appear here. Use the upload panel to get started.</p>
                </div>
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="text-center py-12 bg-[#1a1f2c]/50 backdrop-blur-xl rounded-xl border border-white/10">
                <p className="text-sm text-slate-400">No files match your search criteria</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSubjectFilter("all");
                  }}
                  className="mt-3 text-xs text-indigo-400 hover:text-indigo-300"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:gap-5">
                <AnimatePresence>
                  {filteredFiles.map((file, i) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -15 }}
                      transition={{ delay: i * 0.03, duration: 0.3 }}
                      key={file._id}
                      className="rounded-xl sm:rounded-2xl p-4 sm:p-5 bg-[#1a1f2c]/80 backdrop-blur-xl border border-white/10 hover:border-indigo-500/30 transition-all duration-300 group relative overflow-hidden shadow-lg"
                    >
                      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                      <div className="flex flex-col gap-3">
                        {/* Header Row */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-xl sm:rounded-2xl flex items-center justify-center border border-white/10 flex-shrink-0 group-hover:from-indigo-500/30 group-hover:to-purple-600/30 transition-all duration-300">
                              <BookOpen className="text-indigo-400 group-hover:text-indigo-300" size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm sm:text-base font-black text-white line-clamp-2 leading-tight group-hover:text-indigo-300 transition-colors tracking-wide mb-1.5" title={file.title}>
                                {file.title}
                              </h3>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-block px-2 py-0.5 rounded-md bg-[#0f1219] border border-white/10 text-[8px] font-black uppercase tracking-widest text-slate-400">
                                  {file.subject || "General"}
                                </span>
                                {view === "all" && file.createdBy?.username && (
                                  <span className="inline-flex items-center gap-1 text-[8px] text-slate-500">
                                    <User size={8} />
                                    {file.createdBy.username}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {view === "my" && (
                            <button
                              onClick={() => handleDelete(file._id)}
                              className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all border border-red-500/20 active:scale-95 ml-2"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                          <button
                            onClick={() => handleOpen(file._id, file.title)}
                            className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#0f1219] hover:bg-white/10 text-slate-300 hover:text-white text-[10px] sm:text-xs font-bold transition-all active:scale-95 border border-white/10"
                          >
                            <Eye size={12} /> View
                          </button>
                          <button
                            onClick={() => handleDownload(file._id)}
                            className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#0f1219] hover:bg-white/10 text-slate-300 hover:text-white text-[10px] sm:text-xs font-bold transition-all active:scale-95 border border-white/10"
                          >
                            <Download size={12} /> Download
                          </button>
                          <button
                            onClick={() => navigate(`/files/${file._id}/summary`)}
                            className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-300 hover:text-white text-[10px] sm:text-xs font-bold transition-all active:scale-95"
                          >
                            <Brain size={12} /> Summary
                          </button>
                          <button
                            onClick={() => navigate(`/files/${file._id}/quiz`)}
                            className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-300 hover:text-white text-[10px] sm:text-xs font-bold transition-all active:scale-95"
                          >
                            <MessageSquare size={12} /> Quiz
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      {/* Add custom scrollbar hide class and responsive breakpoints */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        /* Custom breakpoint for extra small devices */
        @media (min-width: 480px) {
          .xs\\:flex-none {
            flex: none;
          }
          .xs\\:flex-row {
            flex-direction: row;
          }
          .xs\\:items-center {
            align-items: center;
          }
          .xs\\:w-auto {
            width: auto;
          }
          .xs\\:inline-flex {
            display: inline-flex;
          }
        }

        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}