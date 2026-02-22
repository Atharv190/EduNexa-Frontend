import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import {
  FileText,
  Download,
  ArrowLeft,
  Layout,
  Search,
  Filter,
  BookOpen,
  Sparkles
} from "lucide-react";

export default function Files() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/files");
        setFiles(res.data.files || []);
      } catch (err) {
        console.error("Files fetch error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredFiles = files.filter(f =>
    f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (f.subject && f.subject.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const cardColors = [
    {
      borderHover: "hover:border-indigo-500/40",
      bgHover: "hover:bg-indigo-500/10",
      glow: "bg-indigo-500/40",
      gradient: "via-indigo-500/50",
      iconBgParams: "group-hover:bg-indigo-500/20 text-slate-400 group-hover:text-indigo-400 border-white/5 group-hover:border-indigo-500/30",
      btnBg: "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white border-indigo-500/20",
      shadow: "hover:shadow-[0_10px_40px_-10px_rgba(99,102,241,0.25)]",
      badge: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20"
    },
    {
      borderHover: "hover:border-emerald-500/40",
      bgHover: "hover:bg-emerald-500/10",
      glow: "bg-emerald-500/40",
      gradient: "via-emerald-500/50",
      iconBgParams: "group-hover:bg-emerald-500/20 text-slate-400 group-hover:text-emerald-400 border-white/5 group-hover:border-emerald-500/30",
      btnBg: "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white border-emerald-500/20",
      shadow: "hover:shadow-[0_10px_40px_-10px_rgba(16,185,129,0.25)]",
      badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
    },
    {
      borderHover: "hover:border-rose-500/40",
      bgHover: "hover:bg-rose-500/10",
      glow: "bg-rose-500/40",
      gradient: "via-rose-500/50",
      iconBgParams: "group-hover:bg-rose-500/20 text-slate-400 group-hover:text-rose-400 border-white/5 group-hover:border-rose-500/30",
      btnBg: "bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white border-rose-500/20",
      shadow: "hover:shadow-[0_10px_40px_-10px_rgba(244,63,94,0.25)]",
      badge: "bg-rose-500/10 text-rose-300 border-rose-500/20"
    },
    {
      borderHover: "hover:border-cyan-500/40",
      bgHover: "hover:bg-cyan-500/10",
      glow: "bg-cyan-500/40",
      gradient: "via-cyan-500/50",
      iconBgParams: "group-hover:bg-cyan-500/20 text-slate-400 group-hover:text-cyan-400 border-white/5 group-hover:border-cyan-500/30",
      btnBg: "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-white border-cyan-500/20",
      shadow: "hover:shadow-[0_10px_40px_-10px_rgba(6,182,212,0.25)]",
      badge: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20"
    },
    {
      borderHover: "hover:border-amber-500/40",
      bgHover: "hover:bg-amber-500/10",
      glow: "bg-amber-500/40",
      gradient: "via-amber-500/50",
      iconBgParams: "group-hover:bg-amber-500/20 text-slate-400 group-hover:text-amber-400 border-white/5 group-hover:border-amber-500/30",
      btnBg: "bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-white border-amber-500/20",
      shadow: "hover:shadow-[0_10px_40px_-10px_rgba(245,158,11,0.25)]",
      badge: "bg-amber-500/10 text-amber-300 border-amber-500/20"
    }
  ];

  return (
    <div className="min-h-screen bg-[#07090f] text-slate-200 font-sans selection:bg-indigo-500/30 overflow-x-hidden pb-12">

      {/* ================= BACKGROUND EFFECTS ================= */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#07090f] to-[#07090f]">
        <div className="absolute top-[5%] left-[-15%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-indigo-600/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[10%] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] bg-fuchsia-600/5 blur-[100px] rounded-full mix-blend-screen" />
      </div>

      {/* ================= TOP HEADER ================= */}
      <header className="sticky top-0 z-30 bg-[#07090f]/80 backdrop-blur-xl border-b border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 sm:p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-slate-400 hover:text-white group"
            >
              <ArrowLeft size={18} className="transform group-hover:-translate-x-1 transition-transform" />
            </button>
            <div className="w-px h-8 bg-white/10 hidden sm:block"></div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="bg-gradient-to-tr from-indigo-500 via-purple-500 to-fuchsia-500 p-1.5 sm:p-2 rounded-xl text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                <Sparkles size={18} className="sm:w-5 sm:h-5" />
              </div>
              <div>
                <h1 className="text-base sm:text-xl font-bold text-white tracking-tight">
                  Study Library
                </h1>
                <p className="text-[10px] sm:text-xs text-slate-400 hidden sm:block">
                  All your learning resources in one place
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all">
              <Search size={16} className="text-slate-400 mr-2" />
              <input
                type="text"
                placeholder="Search materials..."
                className="bg-transparent border-none outline-none text-sm text-white placeholder:text-slate-500 w-48 lg:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button className="p-2 sm:p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-slate-400 hover:text-white">
              <Filter size={18} />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden px-4 pb-4">
          <div className="flex items-center px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus-within:border-indigo-500/50 transition-all w-full">
            <Search size={18} className="text-slate-400 mr-3" />
            <input
              type="text"
              placeholder="Search materials..."
              className="bg-transparent border-none outline-none text-sm text-white placeholder:text-slate-500 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* ================= CONTENT ================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10">

        {/* ===== LOADING ===== */}
        {loading && (
          <div className="flex flex-col items-center justify-center h-64 sm:h-80 opacity-70">
            <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 font-medium animate-pulse">Loading library materials…</p>
          </div>
        )}

        {/* ===== EMPTY STATE ===== */}
        {!loading && files.length === 0 && (
          <div className="bg-[#181d2b] border border-dashed border-white/10 rounded-[2rem] p-12 sm:p-20 text-center relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-500/10 blur-[50px] rounded-full"></div>
            <div className="w-20 h-20 bg-indigo-500/10 border border-indigo-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 relative z-10">
              <BookOpen size={40} className="text-indigo-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 relative z-10">
              Library is Empty
            </h3>
            <p className="text-slate-400 text-sm sm:text-base max-w-sm mx-auto relative z-10">
              Your instructors haven't uploaded any study materials yet. Check back later!
            </p>
          </div>
        )}

        {/* ===== NO SEARCH RESULTS ===== */}
        {!loading && files.length > 0 && filteredFiles.length === 0 && (
          <div className="text-center py-20">
            <Search size={48} className="text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No matches found</h3>
            <p className="text-slate-400">We couldn't find anything matching "{searchTerm}"</p>
            <button
              onClick={() => setSearchTerm("")}
              className="mt-6 text-indigo-400 font-medium hover:text-indigo-300"
            >
              Clear search
            </button>
          </div>
        )}

        {/* ===== FILES GRID ===== */}
        {!loading && files.length > 0 && filteredFiles.length > 0 && (
          <>
            <div className="flex justify-between items-end mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                Available Resources
                <span className="text-xs sm:text-sm bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-full border border-indigo-500/20 font-black ml-2 tabular-nums">
                  {filteredFiles.length}
                </span>
              </h2>

              <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400">
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredFiles.map((f, i) => {
                const c = cardColors[i % cardColors.length];
                return (
                  <div
                    key={f._id}
                    className={`group rounded-[1.5rem] bg-[#0c101a] border border-white/5 transition-all duration-300 sm:hover:-translate-y-1 flex flex-col h-full relative overflow-hidden ${c.borderHover} ${c.bgHover} ${c.shadow}`}
                    style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'both' }}
                  >
                    {/* Decorative Gradient */}
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent ${c.gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                    <div className="p-6 flex-1 flex flex-col">
                      {/* Header Row */}
                      <div className="flex justify-between items-start mb-5">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 border border-white/5 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg ${c.iconBgParams}`}>
                          <FileText size={24} />
                        </div>
                      </div>

                      {/* Content */}
                      <div>
                        <span className={`inline-block mb-3 px-2.5 py-1 rounded-md border text-[10px] sm:text-xs font-bold tracking-wider uppercase ${c.badge}`}>
                          {f.subject || "GENERAL"}
                        </span>

                        <h3 className="font-bold text-base sm:text-lg text-white line-clamp-2 leading-tight transition-colors mb-2">
                          {f.title}
                        </h3>

                        {f.description && (
                          <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed">
                            {f.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions Footer */}
                    <div className="px-6 py-4 border-t border-white/5 bg-black/20 flex items-center justify-between gap-3 relative z-10 transition-colors">
                      <Link
                        to={`/files/${f._id}`}
                        className="flex-1 text-center py-2 text-sm font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5"
                      >
                        View
                      </Link>

                      {/* ✅ BACKEND DOWNLOAD */}
                      <a
                        href={`${process.env.REACT_APP_API_URL || "http://localhost:5000/api"}/files/download/${f._id}`}
                        className={`flex items-center justify-center gap-1.5 py-2 px-4 text-sm font-bold rounded-xl transition-all border group/dl ${c.btnBg}`}
                      >
                        <Download size={16} className="group-hover/dl:animate-bounce" />
                        <span className="hidden sm:inline">Save</span>
                      </a>
                    </div>

                    {/* Internal Glow Effect */}
                    <div className={`absolute -bottom-10 -right-10 w-32 h-32 blur-[40px] rounded-full transition-colors duration-500 pointer-events-none opacity-0 group-hover:opacity-100 ${c.glow}`}></div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
