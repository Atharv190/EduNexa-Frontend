// src/pages/Quiz.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function Quiz() {
  const { fileId } = useParams();

  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState({});
  const [showAnswer, setShowAnswer] = useState({});

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

  /* ================= STATES ================= */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 text-lg">
        ⏳ Generating quiz...
      </div>
    );
  }

  if (!quiz.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        No quiz available for this file.
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-[#020617] py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl shadow-indigo-500/10">

        <h1 className="text-3xl font-black mb-8 text-center text-white">
          📝 Quiz Based on Material
        </h1>

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

        {/* Footer */}
        <div className="text-center mt-6 text-slate-400">
          End of quiz 🎉
        </div>
      </div>
    </div>
  );
}
