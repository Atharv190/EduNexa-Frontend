import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { 
  ArrowLeft, 
  Trophy, 
  Brain, 
  CheckCircle, 
  XCircle, 
  Zap, 
  Target, 
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  Eye,
  Clock,
  BookOpen,
  Send,
  AlertCircle,
  TrendingUp,
  FileText,
  LayoutDashboard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Quiz() {
  const { fileId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showScorecard, setShowScorecard] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [showSubmitWarning, setShowSubmitWarning] = useState(false);
  

  useEffect(() => {
    let timer;
    if (quizStarted && !submitted && !quizCompleted) {
      timer = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizStarted, submitted, quizCompleted]);

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

  const handleAnswerSelect = (questionId, optionLetter) => {
    if (submitted) return;
    
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: optionLetter,
    });
  };

  const goToNextQuestion = () => {
    if (currentQuestion < quiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    const answeredCount = Object.keys(selectedAnswers).length;
    if (answeredCount < quiz.length) {
      setShowSubmitWarning(true);
      setTimeout(() => setShowSubmitWarning(false), 3000);
      return;
    }
    
    setSubmitted(true);
    setQuizCompleted(true);
    setShowScorecard(true);
    
    let correct = 0;
    quiz.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) {
        correct++;
      }
    });
    
    if (correct === quiz.length) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setCurrentQuestion(0);
    setQuizCompleted(false);
    setQuizStarted(false);
    setShowConfetti(false);
    setShowScorecard(false);
    setTimeSpent(0);
    setSubmitted(false);
    setShowSubmitWarning(false);
  };

  const startQuiz = () => {
    setQuizStarted(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateScore = () => {
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;
    
    quiz.forEach((q, idx) => {
      if (selectedAnswers[idx] === undefined) {
        unanswered++;
      } else if (selectedAnswers[idx] === q.answer) {
        correct++;
      } else {
        incorrect++;
      }
    });
    
    return { 
      correct, 
      incorrect,
      unanswered,
      total: quiz.length, 
      percentage: (correct / quiz.length) * 100 
    };
  };

  const getScoreMessage = () => {
    const { percentage } = calculateScore();
    if (percentage === 100) return "Perfect Score! 🏆";
    if (percentage >= 80) return "Excellent! 🌟";
    if (percentage >= 60) return "Good job! 💪";
    if (percentage >= 40) return "Not bad! 📚";
    return "Keep learning! 🎯";
  };

  const goToDashboard = () => {
    try {
      const userRole = localStorage.getItem('userRole');
      console.log('User role from localStorage:', userRole);
      
      if (userRole === 'admin') {
        navigate('/admin-dashboard');
      } else if (userRole === 'instructor') {
        navigate('/instructor-dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Navigation error:', error);
      navigate('/dashboard');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center p-4">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-center"
        >
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
              <Brain className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 bg-indigo-500/20 rounded-2xl blur-xl"
            />
          </div>
          <p className="text-indigo-200 text-xs sm:text-sm font-semibold mt-4">Generating your quiz...</p>
        </motion.div>
      </div>
    );
  }

  if (!quiz.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border-2 border-indigo-500/30">
            <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-3">No Quiz Available</h2>
          <p className="text-gray-400 text-sm sm:text-base mb-6">This material doesn't have a quiz generated yet.</p>
          <button
            onClick={goToDashboard}
            className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white font-semibold hover:shadow-lg transition-all hover:scale-105 text-sm sm:text-base"
          >
            Return to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  const currentQ = quiz[currentQuestion];
  const answeredCount = Object.keys(selectedAnswers).length;
  const allQuestionsAnswered = answeredCount === quiz.length;
  const score = calculateScore();

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
            
            <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-800 p-5 sm:p-6 shadow-2xl">
              <div className="text-center mb-6">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full mb-4"
                >
                  <Brain className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-semibold text-indigo-300">AI-Powered Assessment</span>
                </motion.div>
                
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  Knowledge Check
                </h1>
                <p className="text-gray-400 text-xs sm:text-sm">Test your understanding of the material</p>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
                <div className="bg-gray-800/50 rounded-lg p-2 sm:p-3 text-center border border-gray-700">
                  <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{quiz.length}</div>
                  <div className="text-[8px] sm:text-[10px] text-gray-500 uppercase mt-1">Questions</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-2 sm:p-3 text-center border border-gray-700">
                  <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">MCQ</div>
                  <div className="text-[8px] sm:text-[10px] text-gray-500 uppercase mt-1">Format</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-2 sm:p-3 text-center border border-gray-700">
                  <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-400 to-indigo-400 bg-clip-text text-transparent">{Math.ceil(quiz.length * 0.5)}</div>
                  <div className="text-[8px] sm:text-[10px] text-gray-500 uppercase mt-1">Minutes</div>
                </div>
              </div>

              <div className="mb-6 p-2.5 sm:p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-yellow-400 mb-1">Important Note:</p>
                    <p className="text-[11px] sm:text-xs text-yellow-300/80">All {quiz.length} questions need to be attempted before submission.</p>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={startQuiz}
                className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl text-white font-semibold shadow-lg hover:shadow-2xl transition-all flex items-center justify-center gap-2 group text-sm sm:text-base"
              >
                <Zap className="w-4 h-4 group-hover:animate-pulse" />
                Start Quiz
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (showScorecard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex items-center justify-center p-4">
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(150)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ x: Math.random() * window.innerWidth, y: -50 }}
                animate={{ y: window.innerHeight + 50, rotate: 360 }}
                transition={{ duration: 2 + Math.random() * 2, delay: Math.random() * 0.5 }}
                className="absolute w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full"
                style={{
                  background: `hsl(${Math.random() * 360}, 100%, 50%)`,
                  left: `${Math.random() * 100}%`
                }}
              />
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm sm:max-w-md md:max-w-lg px-4"
        >
          <div className="relative">
            <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-800 p-4 sm:p-5 shadow-2xl">
              <div className="text-center mb-4">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.6 }}
                  className="inline-block"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto shadow-lg">
                    <Trophy className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                </motion.div>
                <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mt-2 mb-1">
                  Quiz Completed!
                </h2>
                <p className="text-gray-400 text-[11px] sm:text-xs">{getScoreMessage()}</p>
              </div>

              <div className="flex items-center justify-center mb-4">
                <div className="text-center">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border-4 border-indigo-500/50">
                    <div>
                      <div className="text-xl sm:text-2xl font-bold text-white">{Math.round(score.percentage)}%</div>
                      <div className="text-[9px] sm:text-[10px] text-gray-400">Score</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-4">
                <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-lg p-1.5 sm:p-2 text-center border border-emerald-500/30">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400 mx-auto mb-1" />
                  <div className="text-lg sm:text-xl font-bold text-white">{score.correct}</div>
                  <div className="text-[8px] sm:text-[9px] text-emerald-300 font-semibold">Correct</div>
                </div>
                
                <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-lg p-1.5 sm:p-2 text-center border border-red-500/30">
                  <XCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-400 mx-auto mb-1" />
                  <div className="text-lg sm:text-xl font-bold text-white">{score.incorrect}</div>
                  <div className="text-[8px] sm:text-[9px] text-red-300 font-semibold">Incorrect</div>
                </div>

                <div className="bg-gradient-to-br from-gray-500/20 to-gray-600/20 rounded-lg p-1.5 sm:p-2 text-center border border-gray-500/30">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 mx-auto mb-1" />
                  <div className="text-lg sm:text-xl font-bold text-white">{score.unanswered}</div>
                  <div className="text-[8px] sm:text-[9px] text-gray-300 font-semibold">Unanswered</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mb-4">
                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg p-1.5 sm:p-2 text-center border border-blue-500/30">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 mx-auto mb-1" />
                  <div className="text-sm sm:text-base font-bold text-white">{formatTime(timeSpent)}</div>
                  <div className="text-[8px] sm:text-[9px] text-blue-300 font-semibold">Time</div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg p-1.5 sm:p-2 text-center border border-purple-500/30">
                  <Target className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 mx-auto mb-1" />
                  <div className="text-sm sm:text-base font-bold text-white">{score.correct}/{score.total}</div>
                  <div className="text-[8px] sm:text-[9px] text-purple-300 font-semibold">Accuracy</div>
                </div>
              </div>

              <div className="mb-4 p-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-lg border border-indigo-500/30">
                <div className="flex items-center gap-1 mb-1">
                  <TrendingUp className="w-3 h-3 text-indigo-400" />
                  <span className="text-[9px] sm:text-[10px] font-semibold text-indigo-300">Performance</span>
                </div>
                <p className="text-[9px] sm:text-[10px] text-gray-300">
                  {score.percentage === 100 
                    ? "Perfect! You've mastered this topic!" 
                    : score.percentage >= 80 
                    ? "Excellent! Strong understanding." 
                    : score.percentage >= 60 
                    ? "Good effort! Review to improve."
                    : "Keep practicing! Review again."}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowScorecard(false);
                      setQuizCompleted(true);
                    }}
                    className="flex-1 py-1.5 sm:py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white font-semibold transition-all flex items-center justify-center gap-1 text-[11px] sm:text-xs"
                  >
                    <Eye className="w-3 h-3" />
                    Review
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={resetQuiz}
                    className="flex-1 py-1.5 sm:py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-lg rounded-lg text-white font-semibold transition-all flex items-center justify-center gap-1 text-[11px] sm:text-xs"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Try Again
                  </motion.button>
                </div>

              <motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  onClick={() => {
    console.log("Dashboard button clicked");

    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role?.toLowerCase();

    console.log("User role:", role);

    if (role === 'admin') {
      navigate('/admin');
    } else if (role === 'teacher') {
      navigate('/teacher/dashboard');
    } else {
      navigate('/student/dashboard');
    }
  }}
  className="w-full py-1.5 sm:py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-lg rounded-lg text-white font-semibold transition-all flex items-center justify-center gap-1 text-[11px] sm:text-xs"
>
  <LayoutDashboard className="w-3 h-3" />
  Dashboard
</motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (quizCompleted && !showScorecard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex flex-col">
        <div className="flex-shrink-0 p-3 sm:p-4 border-b border-gray-800 bg-gray-950/50 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-2 sm:px-0">
            <button
              onClick={() => {
                setShowScorecard(true);
                setQuizCompleted(true);
              }}
              className="group flex items-center gap-2 px-2.5 sm:px-3 py-1.5 bg-gray-800/50 backdrop-blur-sm rounded-lg text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all"
            >
              <ArrowLeft size={14} className="sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-[11px] sm:text-xs font-medium">Back to Scorecard</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden p-3 sm:p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-800 shadow-2xl h-full flex flex-col max-w-4xl mx-auto w-full"
          >
            <div className="flex-shrink-0 p-4 sm:p-5 border-b border-gray-800">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white">Answer Review</h2>
                  <p className="text-[10px] sm:text-xs text-gray-400">Review your answers</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-5">
              <div className="space-y-3 sm:space-y-4">
                {quiz.map((q, idx) => {
                  const userAnswer = selectedAnswers[idx];
                  const correctAnswer = q.answer;
                  const isCorrect = userAnswer === correctAnswer;
                  const isAnswered = userAnswer !== undefined;
                  
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`p-3 sm:p-4 rounded-xl border-2 ${
                        !isAnswered 
                          ? 'bg-gray-800/50 border-gray-700'
                          : isCorrect 
                            ? 'bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border-emerald-500/30' 
                            : 'bg-gradient-to-r from-red-500/10 to-red-600/10 border-red-500/30'
                      }`}
                    >
                      <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          !isAnswered 
                            ? 'bg-gray-700 text-gray-500'
                            : isCorrect 
                              ? 'bg-emerald-500/20 text-emerald-400' 
                              : 'bg-red-500/20 text-red-400'
                        }`}>
                          {!isAnswered ? (
                            <span className="text-[10px] sm:text-xs font-bold">?</span>
                          ) : isCorrect ? (
                            <CheckCircle size={12} className="sm:w-[14px] sm:h-[14px]" />
                          ) : (
                            <XCircle size={12} className="sm:w-[14px] sm:h-[14px]" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 mb-2">
                            <h3 className="text-white font-bold text-sm sm:text-base">Question {idx + 1}</h3>
                            {!isAnswered && (
                              <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 bg-yellow-500/20 text-yellow-300 rounded-full w-fit">Not Answered</span>
                            )}
                          </div>
                          <p className="text-white text-sm sm:text-base leading-relaxed break-words">{q.question}</p>
                        </div>
                      </div>

                      <div className="space-y-1.5 sm:space-y-2">
                        {q.options.map((opt, optIdx) => {
                          const optLetter = ["A", "B", "C", "D"][optIdx];
                          const optText = opt.replace(/^[A-D]\)\s*/i, "");
                          const isUserAnswer = userAnswer === optLetter;
                          const isCorrectAnswer = correctAnswer === optLetter;
                          
                          let optionClass = "p-2 sm:p-3 rounded-lg transition-all ";
                          if (isCorrectAnswer) {
                            optionClass += "bg-gradient-to-r from-emerald-500/30 to-emerald-600/30 border border-emerald-500/70";
                          } else if (isUserAnswer && !isCorrectAnswer) {
                            optionClass += "bg-gradient-to-r from-red-500/30 to-red-600/30 border border-red-500/70";
                          } else {
                            optionClass += "bg-gray-800/50 border border-gray-700";
                          }
                          
                          return (
                            <div key={optIdx} className={optionClass}>
                              <div className="flex items-start gap-2 sm:gap-3">
                                <span className={`font-bold text-sm sm:text-base flex-shrink-0 ${
                                  isCorrectAnswer ? "text-emerald-300" : isUserAnswer ? "text-red-300" : "text-gray-400"
                                }`}>{optLetter}.</span>
                                <span className={`text-xs sm:text-base break-words flex-1 ${
                                  isCorrectAnswer ? "text-emerald-200" : isUserAnswer ? "text-red-200" : "text-gray-300"
                                }`}>{optText}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="flex-shrink-0 p-4 sm:p-5 border-t border-gray-800">
              <div className="flex gap-2 sm:gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowScorecard(true);
                    setQuizCompleted(true);
                  }}
                  className="flex-1 py-2 sm:py-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
                >
                  <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                  Back
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={resetQuiz}
                  className="flex-1 py-2 sm:py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-xl rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
                >
                  <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
                  New Quiz
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex flex-col h-screen overflow-hidden">
      <AnimatePresence>
        {showSubmitWarning && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-shrink-0 mx-3 sm:mx-4 mt-3 sm:mt-4 p-2.5 sm:p-3 bg-red-500/20 rounded-lg border border-red-500/50 z-10"
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" />
              <p className="text-[10px] sm:text-xs text-red-300">
                Please answer all {quiz.length} questions! ({answeredCount}/{quiz.length} completed)
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-gray-900/80 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-gray-800 p-4 sm:p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4 sm:mb-5 pb-3 border-b border-gray-800">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-base sm:text-lg">{currentQuestion + 1}</span>
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-xs text-gray-400">Question</p>
                    <p className="text-xs sm:text-sm font-semibold text-white">of {quiz.length}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 bg-gray-800/50 rounded-lg">
                    <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-400" />
                    <span className="text-[11px] sm:text-xs font-bold text-white">{formatTime(timeSpent)}</span>
                  </div>
                  <div className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-xs font-semibold bg-gray-800/50 text-gray-400">
                    {answeredCount}/{quiz.length}
                  </div>
                  {selectedAnswers[currentQuestion] !== undefined && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    >
                      ✓ Done
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="mb-4 sm:mb-5">
                <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white leading-relaxed break-words">
                  {currentQ.question}
                </h2>
              </div>

              <div className="space-y-2 sm:space-y-2.5 mb-4 sm:mb-5">
                {currentQ.options.map((opt, optIndex) => {
                  const optionLetter = ["A", "B", "C", "D"][optIndex];
                  const cleanOption = opt.replace(/^[A-D]\)\s*/i, "");
                  const isSelected = selectedAnswers[currentQuestion] === optionLetter;
                  
                  let buttonClass = "w-full text-left p-2.5 sm:p-3 rounded-lg transition-all duration-300 border flex items-center gap-2 sm:gap-3 group cursor-pointer";
                  
                  if (isSelected) {
                    buttonClass += " bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-indigo-500 shadow-lg";
                  } else {
                    buttonClass += " bg-gray-800/50 border-gray-700 hover:border-indigo-500 hover:bg-indigo-500/10";
                  }

                  return (
                    <motion.button
                      key={optIndex}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleAnswerSelect(currentQuestion, optionLetter)}
                      className={buttonClass}
                    >
                      <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-bold text-xs sm:text-sm transition-all flex-shrink-0 ${
                        isSelected 
                          ? "bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg"
                          : "bg-gray-700 text-gray-300 group-hover:bg-indigo-500/20"
                      }`}>
                        {optionLetter}
                      </div>
                      <span className="flex-1 text-white text-xs sm:text-sm break-words leading-relaxed">
                        {cleanOption}
                      </span>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0"
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              <div className="flex gap-2 sm:gap-3 pt-3 border-t border-gray-800">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={goToPreviousQuestion}
                  disabled={currentQuestion === 0}
                  className={`flex-1 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 text-xs sm:text-sm ${
                    currentQuestion === 0
                      ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
                      : 'bg-gray-800 hover:bg-gray-700 text-white'
                  }`}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </motion.button>
                
                {currentQuestion === quiz.length - 1 ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    className={`flex-1 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 text-xs sm:text-sm ${
                      !allQuestionsAnswered
                        ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-emerald-500 to-green-600 hover:shadow-lg text-white'
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit</span>
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={goToNextQuestion}
                    className="flex-1 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 text-xs sm:text-sm bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-lg text-white"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </motion.button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex-shrink-0 mt-4 pt-4 border-t border-gray-800 w-full max-w-4xl">
          <div className="flex justify-center gap-1.5 sm:gap-2 flex-wrap">
            {quiz.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestion(idx)}
                className={`min-w-[2rem] h-7 sm:min-w-[2.25rem] sm:h-8 rounded-lg text-[10px] sm:text-xs font-semibold transition-all ${
                  currentQuestion === idx
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg scale-110'
                    : selectedAnswers[idx] !== undefined
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-gray-800 text-gray-500 hover:bg-gray-700'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}