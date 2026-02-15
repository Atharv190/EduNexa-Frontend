import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import { FileText, Download, ArrowLeft, Layout } from "lucide-react";

export default function Files() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">

      {/* ================= TOP HEADER ================= */}
      <header className="sticky top-0 z-30 bg-[#020617]/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Title */}
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500/20 p-2 rounded-xl text-indigo-400">
              <Layout size={18} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">
                Study Materials
              </h1>
              <p className="text-xs text-slate-400">
                All your learning resources in one place
              </p>
            </div>
          </div>

          {/* Back */}
          <Link
            to="/student/dashboard"
            className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-indigo-400 transition"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </div>
      </header>

      {/* ================= CONTENT ================= */}
      <main className="max-w-7xl mx-auto px-6 py-12">

        {/* ===== LOADING ===== */}
        {loading && (
          <div className="flex items-center justify-center h-64 text-slate-400 font-medium">
            Loading study materials…
          </div>
        )}

        {/* ===== EMPTY STATE ===== */}
        {!loading && files.length === 0 && (
          <div className="bg-white/5 border border-dashed border-white/10 rounded-3xl p-20 text-center">
            <FileText size={42} className="mx-auto text-indigo-400 mb-4" />
            <p className="text-slate-300 font-semibold">
              No study materials available
            </p>
            <p className="text-slate-500 text-sm mt-1">
              Ask your teacher to upload learning resources.
            </p>
          </div>
        )}

        {/* ===== FILES GRID ===== */}
        {!loading && files.length > 0 && (
          <>
            <p className="text-sm text-slate-400 mb-8">
              {files.length} materials available
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {files.map((f) => (
                <div
                  key={f._id}
                  className="
                    group rounded-3xl p-8
                    bg-white/5 border border-white/10
                    hover:border-indigo-400/40
                    hover:shadow-2xl hover:shadow-indigo-500/10
                    transition-all hover:-translate-y-1
                  "
                >
                  {/* Icon */}
                  <div className="
                    w-14 h-14 rounded-2xl flex items-center justify-center mb-6
                    bg-indigo-500/20 text-indigo-400
                    group-hover:bg-indigo-600 group-hover:text-white
                    transition
                  ">
                    <FileText size={26} />
                  </div>

                  {/* Title */}
                  <h3 className="font-black text-lg text-white truncate">
                    {f.title}
                  </h3>

                  {/* Subject */}
                  <span className="
                    inline-block mt-2 px-3 py-1 rounded-full
                    bg-white/10 text-xs font-bold tracking-widest
                    text-slate-400
                  ">
                    {f.subject || "GENERAL"}
                  </span>

                  {/* Description */}
                  {f.description && (
                    <p className="text-sm text-slate-400 mt-4 line-clamp-3">
                      {f.description}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="mt-6 flex items-center justify-between">
                    <Link
                      to={`/files/${f._id}`}
                      className="text-sm font-bold text-indigo-400 hover:text-indigo-300 transition"
                    >
                      View Material
                    </Link>

                    {/* ✅ BACKEND DOWNLOAD (NO AUTH, ORIGINAL FILE) */}
                    {/* ✅ BACKEND DOWNLOAD (NO AUTH, ORIGINAL FILE) */}
<a
  href={`${process.env.REACT_APP_API_URL}/files/download/${f._id}`}
  className="
    inline-flex items-center gap-1
    text-xs font-semibold
    bg-white/10 px-3 py-1.5 rounded-xl
    text-slate-300
    hover:bg-indigo-500/20 hover:text-indigo-300
    transition
  "
>
  <Download size={14} />
  Download
</a>

                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
