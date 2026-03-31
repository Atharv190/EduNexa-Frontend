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
  Search,
  GraduationCap,
  Calendar,
  Grid3x3,
  List,
  FolderOpen,
  Globe,
  Rocket,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";

const handleDownload = (fileId) => {
  window.location.href = `${api.defaults.baseURL}/files/download/${fileId}`;
};

export default function TeacherDashboard() {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [openingFile, setOpeningFile] = useState(false);
  const [globalFilesCount, setGlobalFilesCount] = useState(0);
  const [myFilesCount, setMyFilesCount] = useState(0);

  const [view, setView] = useState("my");
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUploadFormExpanded, setIsUploadFormExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [layoutMode, setLayoutMode] = useState("grid");

  const [form, setForm] = useState({
    title: "",
    subject: "",
    description: "",
    file: null,
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  useEffect(() => {
    const subjects = [...new Set(files.map(f => f.subject).filter(Boolean))];
    setAvailableSubjects(subjects);
  }, [files]);

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

  const handleOpen = async (fileId) => {
    try {
      setOpeningFile(true);
      const res = await api.get(`/files/download/${fileId}`, {
        responseType: "blob",
      });
      const pdfBlob = new Blob([res.data], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const newTab = window.open(pdfUrl, "_blank");
      if (!newTab) {
        window.location.href = pdfUrl;
      }
      setOpeningFile(false);
      setTimeout(() => {
        URL.revokeObjectURL(pdfUrl);
      }, 60000);
    } catch (err) {
      console.error(err);
      alert("Failed to open file");
      setOpeningFile(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMobileMenuOpen && !e.target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

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

  const displayName = user.username || user.name || user.email?.split('@')[0] || "Teacher";
  const layoutClasses = layoutMode === "grid" 
    ? "grid grid-cols-1 sm:grid-cols-2 gap-5" 
    : "flex flex-col gap-3";

  const statsCards = [
    { icon: FolderOpen, label: "My Resources", value: myFilesCount, color: "blue" },
    { icon: Globe, label: "Global Library", value: globalFilesCount, color: "purple" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0F] via-[#0F0F14] to-[#0A0A0F] text-gray-200">
      {openingFile && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-[100]">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#1A1A1F] px-8 py-6 rounded-2xl text-center border border-gray-800 shadow-2xl max-w-xs w-full"
          >
            <div className="relative">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="w-full h-full border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                <FileText className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-400" />
              </div>
            </div>
            <p className="text-white text-lg font-bold mb-2">Opening file...</p>
            <p className="text-gray-400 text-sm">Please wait while your material loads</p>
          </motion.div>
        </div>
      )}
      
      <nav className="sticky top-0 z-50 pt-3 sm:pt-4 px-3 sm:px-6 w-full">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-5xl mx-auto h-[60px] sm:h-[72px] bg-[#1A1A1F]/80 backdrop-blur-xl border border-gray-800 rounded-[20px] flex justify-between items-center px-4 sm:px-6 shadow-xl relative z-50"
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-lg">
              <Sparkles className="text-white w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="font-extrabold text-lg sm:text-2xl text-white tracking-tight">EduNexa</span>
            <span className="hidden xs:inline-flex px-2 sm:px-3 py-1 rounded-lg bg-blue-500/20 text-[8px] sm:text-[10px] uppercase font-bold tracking-widest text-blue-300 border border-blue-500/30 ml-1 sm:ml-2">
              Teacher
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center h-12 bg-[#0F0F14] border border-gray-800 rounded-xl px-5 gap-5">
              <div className="flex items-center gap-3 border-r border-gray-800 pr-5 h-full">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse"></div>
                <div className="flex flex-col justify-center">
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-0.5">My Files</span>
                  <span className="text-base font-black text-white leading-none tracking-tight">{myFilesCount}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-purple-400"></div>
                <div className="flex flex-col justify-center">
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-0.5">Global</span>
                  <span className="text-base font-black text-white leading-none tracking-tight">{globalFilesCount}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center h-12 gap-3 px-4 rounded-xl bg-[#0F0F14] border border-gray-800 text-sm font-bold">
              <User size={16} className="text-blue-400" />
              <span className="tracking-wide text-[14px] text-white">{displayName}</span>
            </div>

            <button
              onClick={handleLogout}
              className="h-12 px-5 rounded-xl bg-[#0F0F14] hover:bg-red-500/10 border border-gray-800 transition-all flex items-center justify-center gap-2 text-[14px] font-bold text-gray-300 hover:text-red-400 group"
            >
              <LogOut size={16} className="text-gray-400 group-hover:text-red-400" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

          <button
            className="lg:hidden p-2 sm:p-2.5 rounded-xl bg-[#0F0F14] border border-gray-800 text-gray-300 flex items-center justify-center transition-all hover:bg-[#1A1A1F] relative z-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </motion.div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-[68px] left-3 right-3 bg-[#1A1A1F] border border-gray-800 rounded-[20px] p-4 shadow-2xl z-50 lg:hidden flex flex-col gap-3 mobile-menu-container max-w-md mx-auto"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Mobile Menu</span>
                  <span className="inline-flex px-2.5 py-1 rounded-lg bg-blue-500/20 text-[9px] uppercase font-bold tracking-widest text-blue-300 border border-blue-500/30">Teacher</span>
                </div>
                
                <div className="flex flex-col gap-2 bg-[#0F0F14] rounded-xl p-4 border border-gray-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-400"></div>
                      <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">My Files</span>
                    </div>
                    <span className="text-xl font-black text-white">{myFilesCount}</span>
                  </div>
                  <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-gray-800 to-transparent"></div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-purple-400"></div>
                      <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Global Files</span>
                    </div>
                    <span className="text-xl font-black text-white">{globalFilesCount}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0F0F14] border border-gray-800">
                  <div className="bg-blue-500/20 p-2 rounded-lg">
                    <User size={18} className="text-blue-400" />
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="text-[8px] uppercase font-bold text-gray-500 tracking-wider">Logged in as</span>
                    <span className="text-sm font-bold text-white truncate">{displayName}</span>
                    <span className="text-[10px] text-gray-400 truncate">{user.email || ''}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    onClick={() => { setView("my"); setIsMobileMenuOpen(false); }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      view === "my" 
                        ? "bg-blue-500/20 border border-blue-500/30 text-blue-300" 
                        : "bg-[#0F0F14] border border-gray-800 text-gray-300"
                    }`}
                  >
                    <FileText size={14} />
                    My Files
                  </button>
                  <button
                    onClick={() => { setView("all"); setIsMobileMenuOpen(false); }}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      view === "all" 
                        ? "bg-purple-500/20 border border-purple-500/30 text-purple-300" 
                        : "bg-[#0F0F14] border border-gray-800 text-gray-300"
                    }`}
                  >
                    <Layout size={14} />
                    Library
                  </button>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full py-3 mt-1 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-bold flex items-center justify-center gap-2 transition-all text-xs"
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>

      <main className="w-full max-w-5xl mx-auto px-3 sm:px-5 pt-6 sm:pt-10 pb-16 sm:pb-24 relative z-10">
       
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full mb-8"
        >
          <div className="rounded-3xl bg-gradient-to-br from-[#1A1A1F] to-[#121217] border border-gray-800 p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-lg">
                  <GraduationCap size={32} className="text-white" />
                </div>
                
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                    {getGreeting()}, {displayName}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <Calendar size={14} />
                      <span className="text-xs sm:text-sm">{formatDate(currentTime)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {statsCards.map((stat, idx) => (
                  <div
                    key={idx}
                    className="bg-[#0F0F14] rounded-xl p-3 text-center border border-gray-800 hover:border-gray-700 hover:bg-[#14141A] transition-all duration-300"
                  >
                    <div className={`w-8 h-8 rounded-lg bg-${stat.color}-500/20 flex items-center justify-center mx-auto mb-2`}>
                      <stat.icon size={14} className={`text-${stat.color}-400`} />
                    </div>
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">{stat.label}</p>
                    <p className="text-lg font-bold text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {view === "my" && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-4 w-full"
            >
              <div className="sticky top-24 bg-gradient-to-br from-[#1A1A1F] to-[#121217] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
                <div 
                  className="lg:hidden flex items-center justify-between p-4 cursor-pointer"
                  onClick={() => setIsUploadFormExpanded(!isUploadFormExpanded)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center">
                      <CloudUpload className="text-white" size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Upload Material</h3>
                      <p className="text-[10px] text-gray-500">Add new content to library</p>
                    </div>
                  </div>
                  <ChevronDown size={18} className={`text-gray-400 transition-transform duration-300 ${isUploadFormExpanded ? 'rotate-180' : ''}`} />
                </div>

                <div className="hidden lg:flex items-center gap-4 p-6 pb-0">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <CloudUpload className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Upload Material</h2>
                    <p className="text-xs text-gray-500 font-medium mt-1">Share knowledge with students</p>
                  </div>
                </div>

                <AnimatePresence>
                  {(isUploadFormExpanded || (typeof window !== 'undefined' && window.innerWidth >= 1024)) && (
                    <motion.form 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={handleSubmit} 
                      className="overflow-hidden"
                    >
                      <div className="p-5 space-y-4">
                        <div>
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 mb-1 block">Title</label>
                          <input
                            name="title"
                            placeholder="e.g., Advanced Mathematics"
                            value={form.title}
                            onChange={handleChange}
                            required
                            className="w-full bg-[#0F0F14] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 mb-1 block">Subject</label>
                          <input
                            name="subject"
                            placeholder="e.g., Mathematics"
                            value={form.subject}
                            onChange={handleChange}
                            required
                            className="w-full bg-[#0F0F14] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 mb-1 block">Description</label>
                          <textarea
                            name="description"
                            placeholder="Provide a brief overview..."
                            value={form.description}
                            onChange={handleChange}
                            rows={2}
                            className="w-full bg-[#0F0F14] border border-gray-800 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none"
                          />
                        </div>

                        <div>
                          <div
                            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                            onDragLeave={() => setDragActive(false)}
                            onDrop={handleDrop}
                            className={`relative overflow-hidden border-2 rounded-xl p-5 text-center cursor-pointer transition-all duration-300
                                ${dragActive ? "border-blue-500 border-solid bg-blue-500/10 scale-[1.02]" : "border-gray-800 border-dashed bg-[#0F0F14] hover:border-blue-500/50 hover:bg-[#1A1A1F]"}`}
                          >
                            <input type="file" name="file" onChange={handleChange} className="hidden" id="fileUpload" />
                            <label htmlFor="fileUpload" className="block cursor-pointer">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 transition-all ${dragActive ? 'bg-blue-500/20 text-blue-400' : 'bg-[#1A1A1F] text-gray-400'}`}>
                                <UploadCloud size={20} />
                              </div>
                              <p className="text-xs font-bold text-white mb-1">
                                {form.file ? <span className="text-blue-400 break-all">{form.file.name}</span> : "Click to browse or drag file"}
                              </p>
                              <p className="text-[10px] font-medium text-gray-500">
                                {form.file ? "File ready to upload" : "Max file size: 50MB"}
                              </p>
                            </label>
                          </div>
                        </div>

                        <button
                          disabled={loading}
                          className="w-full relative mt-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 py-3.5 rounded-xl font-bold transition-all disabled:opacity-70 disabled:pointer-events-none text-sm shadow-lg"
                        >
                          <span className="flex items-center justify-center gap-2">
                            {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <UploadCloud size={16} />}
                            {loading ? "UPLOADING..." : "UPLOAD RESOURCE"}
                          </span>
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, x: view === "my" ? 20 : 0 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={`${view === "my" ? "lg:col-span-8" : "lg:col-span-12"} w-full`}
          >
            <div className="flex flex-col gap-4 mb-5 bg-gradient-to-br from-[#1A1A1F] to-[#121217] p-5 rounded-2xl border border-gray-800">
              <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Layout className="text-white" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Resource Library</h2>
                    <p className="text-[10px] text-gray-500 font-medium">
                      {view === "my" ? "Your personal teaching materials" : "Browse all community resources"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex bg-[#0F0F14] p-1 rounded-lg border border-gray-800">
                    <button
                      onClick={() => setLayoutMode("grid")}
                      className={`p-1.5 rounded-md transition-all ${layoutMode === "grid" ? "bg-blue-500/30 text-blue-300" : "text-gray-500 hover:text-gray-300"}`}
                    >
                      <Grid3x3 size={14} />
                    </button>
                    <button
                      onClick={() => setLayoutMode("list")}
                      className={`p-1.5 rounded-md transition-all ${layoutMode === "list" ? "bg-blue-500/30 text-blue-300" : "text-gray-500 hover:text-gray-300"}`}
                    >
                      <List size={14} />
                    </button>
                  </div>

                  <div className="flex bg-[#0F0F14] p-1 rounded-lg border border-gray-800">
                    {[
                      { id: 'my', label: 'Mine', icon: FileText, count: myFilesCount },
                      { id: 'all', label: 'All', icon: Globe, count: globalFilesCount }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setView(tab.id)}
                        className={`relative px-3 py-1.5 rounded-md font-bold text-[10px] transition-all duration-300 flex items-center gap-1 whitespace-nowrap ${
                          view === tab.id ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                        }`}
                      >
                        {view === tab.id && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 bg-white/10 border border-white/20 rounded-md shadow-sm"
                            transition={{ type: "spring", duration: 0.5 }}
                          />
                        )}
                        <span className="relative z-10 flex items-center gap-1">
                          <tab.icon size={12} />
                          {tab.label}
                        </span>
                        <span className={`relative z-10 px-1.5 py-0.5 rounded text-[8px] font-black ${
                          view === tab.id ? 'bg-blue-500/20 text-blue-300' : 'bg-gray-800 text-gray-400'
                        }`}>
                          {tab.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search by title, description, or subject..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#0F0F14] border border-gray-800 rounded-lg pl-8 pr-3 py-2.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50"
                  />
                </div>

                <div className="relative min-w-[140px]">
                  <select
                    value={subjectFilter}
                    onChange={(e) => setSubjectFilter(e.target.value)}
                    className="w-full appearance-none bg-[#0F0F14] border border-gray-800 rounded-lg px-3 py-2.5 pr-8 text-xs text-white focus:outline-none focus:border-blue-500/50 cursor-pointer"
                  >
                    <option value="all">All Subjects</option>
                    {availableSubjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                  <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {files.length === 0 ? (
              <div className="text-center py-16 bg-gradient-to-br from-[#1A1A1F] to-[#121217] rounded-2xl border border-gray-800">
                <div className="w-20 h-20 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Rocket size={32} className="text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Ready to create?</h3>
                <p className="text-sm text-gray-400 max-w-sm mx-auto">
                  {view === "my" 
                    ? "Your uploaded resources will appear here. Upload your first teaching material to get started!"
                    : "No resources available in the global library yet."}
                </p>
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="text-center py-12 bg-gradient-to-br from-[#1A1A1F] to-[#121217] rounded-xl border border-gray-800">
                <p className="text-sm text-gray-400">No files match your search criteria</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSubjectFilter("all");
                  }}
                  className="mt-3 text-xs text-blue-400 hover:text-blue-300 transition"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className={layoutClasses}>
                <AnimatePresence>
                  {filteredFiles.map((file, i) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -20 }}
                      transition={{ delay: i * 0.05, duration: 0.3 }}
                      key={file._id}
                      whileHover={{ scale: 1.02, y: -5 }}
                      className={`rounded-2xl bg-gradient-to-br from-[#1A1A1F] to-[#121217] border border-gray-800 hover:border-blue-500/30 hover:shadow-xl transition-all duration-300 group relative overflow-hidden ${
                        layoutMode === "list" ? "p-4" : "p-5"
                      }`}
                    >

                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:via-blue-500/5 group-hover:to-blue-500/5 transition-all duration-500 pointer-events-none"></div>
                      
                      <div className={`flex ${layoutMode === "list" ? "flex-row items-center gap-4" : "flex-col gap-3"}`}>
                        <div className={`${layoutMode === "list" ? "flex-shrink-0" : "w-full"} flex ${layoutMode === "list" ? "justify-start" : "justify-between items-start"}`}>
                          <div className={`${layoutMode === "list" ? "w-12 h-12" : "w-14 h-14"} bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center border border-gray-700 group-hover:border-blue-500/50 transition-all`}>
                            <BookOpen className="text-blue-400" size={layoutMode === "list" ? 20 : 22} />
                          </div>
                          
                          {view === "my" && layoutMode !== "list" && (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDelete(file._id); }}
                              className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>

                        <div className={`flex-1 min-w-0 ${layoutMode === "list" ? "flex-1" : ""}`}>
                          <h3 className={`font-bold text-white group-hover:text-blue-400 transition-colors ${
                            layoutMode === "list" ? "text-lg mb-1.5" : "text-lg mb-2 line-clamp-2"
                          }`}>
                            {file.title}
                          </h3>
                          
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-[11px] font-bold uppercase tracking-widest text-blue-300">
                              <Star size={10} className="fill-blue-400" />
                              {file.subject || "General"}
                            </span>
                            {view === "all" && file.createdBy?.username && (
                              <span className="inline-flex items-center gap-1 text-[11px] text-gray-400">
                                <User size={10} />
                                {file.createdBy.username}
                              </span>
                            )}
                          </div>

                          {file.description && layoutMode !== "list" && (
                            <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                              {file.description}
                            </p>
                          )}

                          <div className="flex flex-wrap gap-2 w-full">
                            <button
                              onClick={() => handleOpen(file._id)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg bg-[#0F0F14] hover:bg-white/10 text-gray-300 hover:text-white text-xs font-bold transition-all border border-gray-700 hover:border-gray-600 whitespace-nowrap"
                            >
                              <Eye size={12} /> Open
                            </button>
                            <button
                              onClick={() => handleDownload(file._id)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg bg-[#0F0F14] hover:bg-white/10 text-gray-300 hover:text-white text-xs font-bold transition-all border border-gray-700 hover:border-gray-600 whitespace-nowrap"
                            >
                              <Download size={12} /> Save
                            </button>
                            <button
                              onClick={() => navigate(`/files/${file._id}/summary`)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg bg-gradient-to-r from-blue-500/10 to-blue-600/10 hover:from-blue-500/20 hover:to-blue-600/20 border border-blue-500/20 text-blue-300 hover:text-white text-xs font-bold transition-all whitespace-nowrap"
                            >
                              <Brain size={12} /> Summary
                            </button>
                            <button
                              onClick={() => navigate(`/files/${file._id}/quiz`)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg bg-gradient-to-r from-purple-500/10 to-purple-600/10 hover:from-purple-500/20 hover:to-purple-600/20 border border-purple-500/20 text-purple-300 hover:text-white text-xs font-bold transition-all whitespace-nowrap"
                            >
                              <MessageSquare size={12} /> Quiz
                            </button>
                          </div>
                        </div>

                        {view === "my" && layoutMode === "list" && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(file._id); }}
                            className="flex-shrink-0 p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <style jsx>{`
        @media (min-width: 480px) {
          .xs\\:inline-flex { display: inline-flex; }
        }
      `}</style>
    </div>
  );
}