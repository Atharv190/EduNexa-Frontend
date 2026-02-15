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

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3000/api";

export default function FileDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);

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
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-6">
      <div className="w-full max-w-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl">

        {/* Back */}
        <div className="px-6 pt-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-indigo-400"
          >
            <ArrowLeft size={16} />
            Back to Files
          </button>
        </div>

        {/* Header */}
        <div className="px-8 pt-6 pb-4 flex items-start gap-5">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-indigo-500/20 text-indigo-400">
            <FileText size={26} />
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-black text-white">{file.title}</h1>
            <p className="text-xs uppercase tracking-widest text-slate-400">
              {file.subject || "GENERAL STUDY"}
            </p>
          </div>
        </div>

        {/* Description */}
        {file.description && (
          <div className="px-8 pb-6 text-slate-400 text-sm">
            {file.description}
          </div>
        )}

        {/* Actions */}
        <div className="px-8 pb-8 flex flex-col gap-4">
          {/* ✅ AUTO DOWNLOAD – ORIGINAL FILE */}
          <button
            onClick={() =>
              (window.location.href =
                `${API_BASE_URL}/files/download/${file._id}`)
            }
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500"
          >
            <Download size={18} />
            Download Material
          </button>

          {/* Secondary actions */}
          <div className="flex gap-3">
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
