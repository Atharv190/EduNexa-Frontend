// src/pages/Quiz.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { ArrowLeft } from "lucide-react";

export default function Quiz() {
  const { fileId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState({});
  const [showAnswer, setShowAnswer] = useState({});
  const [score, setScore] = useState({ correct: 0, total: 0 });

  /* ================= FETCH QUIZ ================= */
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/ai/${fileId}/quiz`);
        setQuiz(Array.isArray(res.data.quiz) ? res.data.quiz : []);
      } catch (err) {
        console.error("Quiz error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [fileId]);

  /* ================= CALCULATE SCORE ================= */
  useEffect(() => {
    if (quiz.length > 0) {
      let correct = 0;
      Object.keys(showAnswer).forEach((questionIndex) => {
        if (showAnswer[questionIndex]) {
          const question = quiz[questionIndex];
          if (question && selected[questionIndex] === question.answer) {
            correct++;
          }
        }
      });
      setScore({ correct, total: quiz.length });
    }
  }, [showAnswer, selected, quiz]);

  /* ================= LOADING STATE ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 text-lg">
        ⏳ Generating quiz...
      </div>
    );
  }

  /* ================= NO QUIZ STATE ================= */
  if (!quiz.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        No quiz available for this file.
      </div>
    );
  }

  /* ================= CHECK IF ALL QUESTIONS ANSWERED ================= */
  const allAnswered = Object.keys(showAnswer).length === quiz.length;

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-[#020617] py-10 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-indigo-400 transition-colors mb-4"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to File
        </button>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl shadow-indigo-500/10">

          <h1 className="text-3xl font-black mb-8 text-center text-white">
            📝 Quiz Based on Material
          </h1>

          {/* Questions */}
          {quiz.map((q, index) => {
            const questionId = index;

            return (
              <div
                key={index}
                className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/10"
              >
                {/* Question */}
                <h2 className="text-lg font-semibold mb-4 text-white">
                  {index + 1}. {q.question}
                </h2>

                {/* Options */}
                <div className="space-y-3">
                  {q.options.map((opt, optIndex) => {
                    const optionLetter = ["A", "B", "C", "D"][optIndex];

                    // ✅ Remove existing labels like "A) "
                    const cleanOption = opt.replace(/^[A-D]\)\s*/i, "");

                    const isSelected = selected[questionId] === optionLetter;
                    const isCorrect = q.answer === optionLetter;
                    const shouldShow = showAnswer[questionId];

                    let bg =
                      "bg-white/5 border-white/10 hover:border-indigo-400";
                    if (shouldShow) {
                      if (isCorrect)
                        bg = "bg-emerald-500/20 border-emerald-500";
                      else if (isSelected)
                        bg = "bg-red-500/20 border-red-500";
                    }

                    return (
                      <button
                        key={optIndex}
                        onClick={() => {
                          setSelected({
                            ...selected,
                            [questionId]: optionLetter,
                          });
                          setShowAnswer({
                            ...showAnswer,
                            [questionId]: true,
                          });
                        }}
                        className={`
                          w-full text-left p-4 border rounded-xl transition
                          flex items-center gap-4
                          ${bg}
                        `}
                      >
                        <span className="font-black text-indigo-400">
                          {optionLetter})
                        </span>
                        <span className="text-slate-200">
                          {cleanOption}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Correct Answer */}
                {showAnswer[questionId] && (
                  <p className="mt-4 font-semibold text-emerald-400">
                    ✅ Correct Answer: {q.answer}
                  </p>
                )}
              </div>
            );
          })}

          {/* SCORE SECTION - Only shown at the end */}
          {allAnswered && (
            <div className="mt-8 p-6 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-2xl">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-3">🎯 Your Score</h2>
                
                {/* Score Circle */}
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="58"
                      fill="none"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="8"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="58"
                      fill="none"
                      stroke="url(#scoreGradient)"
                      strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 58}`}
                      strokeDashoffset={`${2 * Math.PI * 58 * (1 - score.correct / score.total)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#818cf8" />
                      <stop offset="100%" stopColor="#c084fc" />
                    </linearGradient>
                  </defs>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-3xl font-black text-white">
                      {score.correct}
                    </span>
                    <span className="text-xs text-slate-400">out of {score.total}</span>
                  </div>
                </div>

                {/* Score Details */}
                <div className="flex items-center justify-center gap-8 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-400">{score.correct}</div>
                    <div className="text-xs text-slate-400">Correct</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">{score.total - score.correct}</div>
                    <div className="text-xs text-slate-400">Incorrect</div>
                  </div>
                </div>

                {/* Percentage */}
                <div className="text-lg">
                  <span className="text-4xl font-black text-white">
                    {Math.round((score.correct / score.total) * 100)}%
                  </span>
                  <span className="text-slate-400 ml-2">Score</span>
                </div>

                {/* Message based on score */}
                <div className="mt-4 text-sm text-slate-400">
                  {score.correct === score.total ? (
                    <span className="text-emerald-400">🏆 Perfect score! Excellent work!</span>
                  ) : score.correct >= score.total / 2 ? (
                    <span className="text-indigo-400">📚 Good job! Keep learning!</span>
                  ) : (
                    <span className="text-slate-400">💪 Practice makes perfect! Try again!</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-center mt-6 text-slate-400">
            {allAnswered ? "Quiz completed! 🎉" : "Keep going... 📝"}
          </div>
        </div>
      </div>
    </div>
  );
}