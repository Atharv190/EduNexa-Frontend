import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  ArrowLeft,
  FileText,
  Download,
  Sparkles,
  HelpCircle,
} from "lucide-react";

export default function FileDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openingFile, setOpeningFile] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/files/${id}`);
        setFile(res.data.file);
      } catch (err) {
        console.error("Get file error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] text-slate-400">
        Loading material…
      </div>
    );
  }

  if (!file) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] text-slate-400">
        File not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4 sm:px-6">
      
      {/* Opening File Popup */}
      {openingFile && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-[#0f172a] px-6 py-5 rounded-xl text-center border border-white/10 max-w-xs w-full">
            <p className="text-white text-lg font-semibold">
              📂 Opening file...
            </p>
            <p className="text-slate-400 text-sm mt-2">
              Please wait while your material loads
            </p>
          </div>
        </div>
      )}

      <div className="w-full max-w-xl mx-auto bg-white/5 border border-white/10 rounded-3xl shadow-2xl">
        
        {/* Back Button */}
        <div className="px-6 pt-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-indigo-400"
          >
            <ArrowLeft size={16} />
            Back to Files
          </button>
        </div>

        {/* File Header */}
        <div className="px-6 sm:px-8 pt-6 pb-4 flex items-start gap-4 sm:gap-5">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center bg-indigo-500/20 text-indigo-400">
            <FileText size={24} />
          </div>

          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-black text-white break-words">
              {file.title}
            </h1>

            <p className="text-xs uppercase tracking-widest text-slate-400">
              {file.subject || "GENERAL STUDY"}
            </p>
          </div>
        </div>

        {/* Description */}
        {file.description && (
          <div className="px-6 sm:px-8 pb-6 text-slate-400 text-sm">
            {file.description}
          </div>
        )}

        {/* Actions */}
        <div className="px-6 sm:px-8 pb-8 flex flex-col gap-4">
          
          {/* Open Material */}
          <button
            onClick={() => handleOpen(file._id)}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 w-full"
          >
            <FileText size={18} />
            Open Material
          </button>

          {/* Download */}
          <button
            onClick={() =>
              (window.location.href =
                `${api.defaults.baseURL}/files/download/${file._id}`)
            }
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 w-full"
          >
            <Download size={18} />
            Download Material
          </button>

          {/* AI Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to={`/files/${id}/summary`}
              className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-indigo-300 font-semibold text-center"
            >
              <Sparkles size={16} className="inline mr-2" />
              View Summary
            </Link>

            <Link
              to={`/files/${id}/quiz`}
              className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-emerald-300 font-semibold text-center"
            >
              <HelpCircle size={16} className="inline mr-2" />
              Generate Quiz
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}