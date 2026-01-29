// src/pages/Summary.jsx
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import {
  ArrowLeft,
  Sparkles,
  BookOpen,
  Tag,
  CheckCircle,
  HelpCircle,
} from "lucide-react";

export default function Summary() {
  const { fileId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/ai/${fileId}/summary`);
        setSummary(res.data.summary);
      } catch (err) {
        console.error("Summary error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [fileId]);

  const handleBack = () => {
    if (user?.role === "teacher") {
      navigate("/teacher/dashboard");
    } else {
      navigate("/student/dashboard");
    }
  };

  /* ================= STATES ================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] text-slate-400 text-lg">
        ⏳ Generating summary…
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] text-red-400">
        No summary available.
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-[#020617] py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white/5 border border-white/10 rounded-3xl shadow-2xl shadow-indigo-500/10 p-8 space-y-10">

        {/* 🔙 BACK */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-indigo-400 transition"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>

        {/* 🧠 TITLE */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600/20 text-indigo-400 mb-4">
            <Sparkles size={26} />
          </div>
          <h1 className="text-4xl font-black text-white mb-2">
            {summary.title || "Document Summary"}
          </h1>
          <p className="text-slate-400 text-sm">
            AI-generated overview for quick revision
          </p>
        </div>

        {/* 📄 OVERVIEW */}
        <Section
          icon={<BookOpen size={20} />}
          title="Overview"
        >
          <p className="text-slate-300 leading-relaxed">
            {summary.overview}
          </p>
        </Section>

        {/* 🔑 KEY POINTS */}
        {summary.keyPoints?.length > 0 && (
          <Section
            icon={<CheckCircle size={20} />}
            title="Key Points"
          >
            <ul className="space-y-2 text-slate-300">
              {summary.keyPoints.map((point, index) => (
                <li key={index} className="flex gap-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  {point}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* 🏷 IMPORTANT TERMS */}
        {summary.importantTerms?.length > 0 && (
          <Section
            icon={<Tag size={20} />}
            title="Important Terms"
          >
            <div className="flex flex-wrap gap-3">
              {summary.importantTerms.map((term, index) => (
                <span
                  key={index}
                  className="px-4 py-1.5 rounded-full bg-indigo-600/15 text-indigo-300 text-sm font-semibold border border-indigo-500/20"
                >
                  {term}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* ✅ CONCLUSION */}
        {summary.conclusion && (
          <Section
            icon={<Sparkles size={20} />}
            title="Conclusion"
          >
            <p className="text-slate-300 leading-relaxed">
              {summary.conclusion}
            </p>
          </Section>
        )}

        {/* 🚀 FOOTER CTA */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-sm">
            Generated using AI • Review before exams 📚
          </p>

          <button
            onClick={() => navigate(`/files/${fileId}/quiz`)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/30"
          >
            <HelpCircle size={18} />
            Try Quiz
          </button>
        </div>

      </div>
    </div>
  );
}

/* ================= REUSABLE SECTION ================= */

function Section({ icon, title, children }) {
  return (
    <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h2 className="flex items-center gap-3 text-xl font-bold text-white mb-4">
        <span className="text-indigo-400">{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}
