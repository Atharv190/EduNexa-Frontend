// src/pages/Summary.jsx
import { useEffect, useState, useContext, useRef } from "react";
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
  Layers,
  ListChecks,
  Lightbulb,
  GraduationCap,
  FileText,
  Star,
  Bookmark,
  FileQuestion,
  Compass,
  Target,
  Trophy
} from "lucide-react";

export default function Summary() {
  const { fileId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");
  const [setReadingTime] = useState(0);
  const contentRef = useRef(null);

  useEffect(() => {
  (async () => {
    try {
      const res = await api.get(`/ai/${fileId}/summary`);
      const summaryData = res.data.summary;
      setSummary(summaryData);
      
      const textContent = JSON.stringify(summaryData);
      const wordCount = textContent.split(/\s+/).length;
      setReadingTime(Math.max(1, Math.ceil(wordCount / 200)));
    } catch (err) {
      console.error("Summary error:", err);
    } finally {
      setLoading(false);
    }
  })();

// eslint-disable-next-line react-hooks/exhaustive-deps
}, [fileId]);

  const handleBack = () => {
    if (user?.role === "teacher") {
      navigate("/teacher/dashboard");
    } else {
      navigate("/student/dashboard");
    }
  };

  const sections = [
    { id: "overview", label: "Overview", icon: BookOpen, color: "sky" },
    { id: "keyPoints", label: "Key Points", icon: CheckCircle, color: "emerald" },
    { id: "importantTerms", label: "Important Terms", icon: Tag, color: "violet" },
    { id: "subtopics", label: "Subtopics", icon: Layers, color: "amber" },
    { id: "questions", label: "Practice Questions", icon: ListChecks, color: "rose" },
    { id: "conclusion", label: "Conclusion", icon: Sparkles, color: "indigo" }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0F]">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-sky-400 animate-pulse" />
            </div>
          </div>
          <p className="mt-6 text-gray-300 text-lg font-medium">Generating your summary...</p>
          <p className="text-gray-500 text-sm mt-2">AI is analyzing your document</p>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0F]">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto bg-red-500/10 rounded-full flex items-center justify-center mb-6">
            <FileText className="w-12 h-12 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">No Summary Available</h2>
          <p className="text-gray-400 mb-6">This document hasn't been summarized yet.</p>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-all shadow-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="group flex items-center gap-2 text-gray-400 hover:text-white transition-all mb-6 relative overflow-hidden px-4 py-2 rounded-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-sky-500/0 to-sky-500/0 group-hover:from-sky-500/20 group-hover:to-sky-500/0 transition-all duration-500"></div>
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform relative z-10" />
            <span className="text-sm font-medium relative z-10">Back to Dashboard</span>
          </button>

          <div className="border-b border-gray-800 pb-6">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-110 transition-transform duration-300">
                  <GraduationCap size={28} className="text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-sky-200 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                  {summary.title || "Document Summary"}
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs with Hover Effects */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-800 pb-4">
          {sections.map(section => {
            const IconComponent = section.icon;
            const hasContent = section.id === "overview" ? summary.overview :
                              section.id === "keyPoints" ? summary.keyPoints?.length > 0 :
                              section.id === "importantTerms" ? summary.importantTerms?.length > 0 :
                              section.id === "subtopics" ? summary.subtopics?.length > 0 :
                              section.id === "questions" ? summary.possibleQuestions?.length > 0 :
                              section.id === "conclusion" ? summary.conclusion : false;
            
            if (!hasContent) return null;
            
            const colorClasses = {
              sky: activeSection === section.id ? "bg-sky-500 text-white shadow-lg shadow-sky-500/30" : "text-sky-400 hover:bg-sky-500/10 hover:shadow-lg hover:shadow-sky-500/20",
              emerald: activeSection === section.id ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30" : "text-emerald-400 hover:bg-emerald-500/10 hover:shadow-lg hover:shadow-emerald-500/20",
              violet: activeSection === section.id ? "bg-violet-500 text-white shadow-lg shadow-violet-500/30" : "text-violet-400 hover:bg-violet-500/10 hover:shadow-lg hover:shadow-violet-500/20",
              amber: activeSection === section.id ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30" : "text-amber-400 hover:bg-amber-500/10 hover:shadow-lg hover:shadow-amber-500/20",
              rose: activeSection === section.id ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30" : "text-rose-400 hover:bg-rose-500/10 hover:shadow-lg hover:shadow-rose-500/20",
              indigo: activeSection === section.id ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30" : "text-indigo-400 hover:bg-indigo-500/10 hover:shadow-lg hover:shadow-indigo-500/20"
            };
            
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 ${colorClasses[section.color]}`}
              >
                <IconComponent size={16} className="transition-transform group-hover:rotate-12" />
                {section.label}
              </button>
            );
          })}
        </div>

        {/* Main Content with Enhanced Hover Effects */}
        <div ref={contentRef} className="space-y-6">
          {activeSection === "overview" && summary.overview && (
            <SectionCard
              icon={<Compass size={22} />}
              title="Overview"
              iconColor="text-sky-400"
              bgGradient="from-sky-500/10 to-sky-400/5"
              borderColor="border-sky-500/30"
              hoverBorder="hover:border-sky-400/50"
              lightColor="sky"
              hoverEffect="hover:shadow-xl hover:shadow-sky-500/20 hover:-translate-y-1"
            >
              <p className="text-gray-300 leading-relaxed text-lg group-hover:text-gray-200 transition-colors duration-300">
                {summary.overview}
              </p>
            </SectionCard>
          )}

          {activeSection === "keyPoints" && summary.keyPoints?.length > 0 && (
            <SectionCard
              icon={<Target size={22} />}
              title="Key Points"
              iconColor="text-emerald-400"
              bgGradient="from-emerald-500/10 to-emerald-400/5"
              borderColor="border-emerald-500/30"
              hoverBorder="hover:border-emerald-400/50"
              lightColor="emerald"
              hoverEffect="hover:shadow-xl hover:shadow-emerald-500/20 hover:-translate-y-1"
            >
              <div className="space-y-3">
                {summary.keyPoints.map((point, index) => (
                  <div
                    key={index}
                    className="flex gap-3 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-all duration-300 border border-gray-700 hover:border-emerald-500/50 hover:translate-x-2 cursor-pointer group/item"
                  >
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold mt-0.5 group-hover/item:scale-110 transition-transform duration-300">
                      {index + 1}
                    </div>
                    <p className="text-gray-300 leading-relaxed flex-1 group-hover/item:text-gray-200 transition-colors duration-300">{point}</p>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {activeSection === "importantTerms" && summary.importantTerms?.length > 0 && (
            <SectionCard
              icon={<Star size={22} />}
              title="Important Terms"
              iconColor="text-violet-400"
              bgGradient="from-violet-500/10 to-violet-400/5"
              borderColor="border-violet-500/30"
              hoverBorder="hover:border-violet-400/50"
              lightColor="violet"
              hoverEffect="hover:shadow-xl hover:shadow-violet-500/20 hover:-translate-y-1"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {summary.importantTerms.map((term, index) => (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-violet-500/5 to-violet-400/5 border border-violet-500/30 hover:border-violet-400/50 transition-all duration-500 hover:scale-[1.02] cursor-pointer hover:shadow-lg hover:shadow-violet-500/20"
                  >
                    <div className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center group-hover:bg-violet-500/30 transition-all duration-300 group-hover:rotate-12">
                            <Tag size={18} className="text-violet-400" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-violet-400 font-semibold text-base group-hover:text-violet-300 transition-colors duration-300">
                            {term}
                          </h3>
                          <p className="text-gray-500 text-xs mt-1 group-hover:text-gray-400 transition-colors duration-300">Key terminology</p>
                        </div>
                        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0 translate-x-2">
                          <Bookmark size={14} className="text-violet-400" />
                        </div>
                      </div>
                    </div>
                    {/* Animated shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-400/0 via-violet-400/10 to-violet-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {activeSection === "subtopics" && summary.subtopics?.length > 0 && (
            <SectionCard
              icon={<Layers size={22} />}
              title="Subtopics"
              iconColor="text-amber-400"
              bgGradient="from-amber-500/10 to-amber-400/5"
              borderColor="border-amber-500/30"
              hoverBorder="hover:border-amber-400/50"
              lightColor="amber"
              hoverEffect="hover:shadow-xl hover:shadow-amber-500/20 hover:-translate-y-1"
            >
              <div className="space-y-4">
                {summary.subtopics.map((sub, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-amber-500/50 transition-all duration-300 hover:translate-x-2 cursor-pointer group/item"
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <Lightbulb size={18} className="text-amber-400 flex-shrink-0 mt-0.5 group-hover/item:rotate-12 transition-transform duration-300" />
                      <h3 className="text-amber-400 font-semibold group-hover/item:text-amber-300 transition-colors duration-300">{sub.name}</h3>
                    </div>
                    <p className="text-gray-400 text-sm pl-7 group-hover/item:text-gray-300 transition-colors duration-300">
                      {sub.description}
                    </p>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {activeSection === "questions" && summary.possibleQuestions?.length > 0 && (
            <SectionCard
              icon={<FileQuestion size={22} />}
              title="Practice Questions"
              iconColor="text-rose-400"
              bgGradient="from-rose-500/10 to-rose-400/5"
              borderColor="border-rose-500/30"
              hoverBorder="hover:border-rose-400/50"
              lightColor="rose"
              hoverEffect="hover:shadow-xl hover:shadow-rose-500/20 hover:-translate-y-1"
            >
              <div className="space-y-4">
                {summary.possibleQuestions.map((q, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-rose-500/50 transition-all duration-300 hover:translate-x-2 cursor-pointer group/item"
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center text-sm font-bold group-hover/item:bg-rose-500/30 transition-all duration-300 group-hover/item:scale-110">
                          Q{index + 1}
                        </div>
                      </div>
                      <p className="text-gray-300 leading-relaxed flex-1 group-hover/item:text-white transition-colors duration-300">{q}</p>
                      <HelpCircle size={16} className="text-rose-400 opacity-0 group-hover/item:opacity-100 transition-all duration-300 transform group-hover/item:translate-x-0 translate-x-2" />
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {activeSection === "conclusion" && summary.conclusion && (
            <SectionCard
              icon={<Trophy size={22} />}
              title="Conclusion"
              iconColor="text-indigo-400"
              bgGradient="from-indigo-500/10 to-indigo-400/5"
              borderColor="border-indigo-500/30"
              hoverBorder="hover:border-indigo-400/50"
              lightColor="indigo"
              hoverEffect="hover:shadow-xl hover:shadow-indigo-500/20 hover:-translate-y-1"
            >
              <p className="text-gray-300 leading-relaxed text-lg italic border-l-4 border-indigo-500 pl-4 group-hover:border-indigo-400 transition-colors duration-300 group-hover:text-gray-200">
                {summary.conclusion}
              </p>
            </SectionCard>
          )}
        </div>

        {/* Footer with Quiz CTA */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-sky-500/20 to-indigo-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-gradient-to-r from-sky-500/10 to-indigo-500/10 rounded-xl p-6 border border-gray-700 group-hover:border-sky-500/50 transition-all duration-300 group-hover:shadow-2xl">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                    <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <HelpCircle size={24} className="text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-sky-200 group-hover:bg-clip-text transition-all duration-300">Ready to test your knowledge?</h3>
                    <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">Take a quiz to reinforce what you've learned</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/files/${fileId}/quiz`)}
                  className="group/btn inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-semibold hover:from-sky-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-sky-500/20 hover:shadow-xl"
                >
                  <HelpCircle size={18} className="group-hover/btn:rotate-12 transition-transform duration-300" />
                  Start Quiz
                  <Sparkles size={16} className="group-hover/btn:animate-pulse" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Section Card Component with Enhanced Hover Effects
function SectionCard({ icon, title, iconColor, bgGradient, borderColor, hoverBorder, lightColor, hoverEffect, children }) {
  const lightColors = {
    sky: "from-sky-400/20 to-sky-500/10",
    emerald: "from-emerald-400/20 to-emerald-500/10",
    violet: "from-violet-400/20 to-violet-500/10",
    amber: "from-amber-400/20 to-amber-500/10",
    rose: "from-rose-400/20 to-rose-500/10",
    indigo: "from-indigo-400/20 to-indigo-500/10"
  };

  return (
    <section className={`group relative bg-gradient-to-br ${bgGradient} rounded-xl border ${borderColor} ${hoverBorder} transition-all duration-500 p-6 overflow-hidden ${hoverEffect} cursor-pointer`}>
      {/* Animated gradient background on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
      
      {/* Decorative background elements */}
      <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${lightColors[lightColor]} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
      <div className={`absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr ${lightColors[lightColor]} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150`}></div>
      
      <h2 className="flex items-center gap-3 text-xl font-bold mb-5 relative z-10">
        <span className={`w-10 h-10 rounded-lg bg-gray-800/50 flex items-center justify-center ${iconColor} backdrop-blur-sm group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </span>
        <span className="text-white group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
          {title}
        </span>
      </h2>
      <div className="relative z-10">
        {children}
      </div>
    </section>
  );
}