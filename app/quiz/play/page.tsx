"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle, XCircle, ArrowRight, RefreshCw, Trophy, Home, AlertTriangle } from "lucide-react";

interface Question {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export default function QuizPlay() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const topic = searchParams.get("topic") || "General";
  const difficulty = searchParams.get("difficulty") || "Medium";

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); // New Error State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    const generateQuiz = async () => {
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: "", 
            type: "quiz_gen",
            context: { topic, difficulty }
          }),
        });
        
        const data = await res.json();
        
        // --- SAFETY CHECK ---
        if (data.error) {
          throw new Error(data.error);
        }
        
        if (!data.enhancedText) {
          throw new Error("Received empty response from AI");
        }

        const parsed = JSON.parse(data.enhancedText);
        setQuestions(parsed);
      } catch (err: any) {
        console.error("Quiz Error:", err);
        setError(err.message || "Failed to load quiz.");
      } finally {
        setLoading(false);
      }
    };
    generateQuiz();
  }, [topic, difficulty]);

  // --- RENDER ERROR STATE ---
  if (error) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6 text-center">
        <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Quiz Generation Failed</h2>
        <p className="text-gray-500 mb-6 max-w-md bg-white/5 p-4 rounded-lg font-mono text-xs text-left">
          Error: {error}
        </p>
        <div className="flex gap-4">
          <button onClick={() => window.location.reload()} className="px-6 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform">
            Try Again
          </button>
          <button onClick={() => router.push("/dashboard")} className="px-6 py-3 bg-white/10 text-white font-bold rounded-full">
            Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ... Rest of the component logic (Rendering Questions) ...
  const handleAnswer = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    setShowExplanation(true);
    if (index === questions[currentIndex].correct) setScore(s => s + 1);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setQuizFinished(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <Loader2 className="w-12 h-12 text-violet-500 animate-spin" />
      </div>
    );
  }

  if (quizFinished) {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-neutral-900 border border-white/10 p-10 rounded-3xl text-center max-w-lg w-full shadow-2xl">
          <div className="w-24 h-24 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-12 h-12 text-yellow-500" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Quiz Complete!</h1>
          <p className="text-gray-400 mb-8">You scored</p>
          <div className="text-8xl font-black mb-8 bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
            {score}/{questions.length}
          </div>
          <div className="flex gap-4 justify-center">
            <button onClick={() => window.location.reload()} className="px-6 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform flex items-center gap-2">
              <RefreshCw size={18}/> Replay
            </button>
            <button onClick={() => router.push("/dashboard")} className="px-6 py-3 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 transition-colors flex items-center gap-2">
              <Home size={18}/> Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 font-sans selection:bg-violet-500/30">
      <div className="max-w-3xl mx-auto mb-8">
        <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
          <span>Question {currentIndex + 1} / {questions.length}</span>
          <span>Score: {score}</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div className="h-full bg-violet-500" initial={{ width: 0 }} animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div key={currentIndex} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} transition={{ duration: 0.3 }}>
            <h2 className="text-2xl md:text-4xl font-bold leading-tight mb-8">{currentQ.question}</h2>
            <div className="grid gap-4 mb-8">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.correct;
                const showResult = selectedOption !== null;
                let cardStyle = "border-white/10 bg-white/5 hover:bg-white/10";
                if (showResult) {
                  if (isCorrect) cardStyle = "border-green-500 bg-green-500/20 text-green-400";
                  else if (isSelected && !isCorrect) cardStyle = "border-red-500 bg-red-500/20 text-red-400";
                  else cardStyle = "border-white/5 bg-white/5 opacity-50";
                }
                return (
                  <button key={idx} onClick={() => handleAnswer(idx)} disabled={showResult} className={`w-full p-6 text-left rounded-xl border-2 transition-all flex items-center justify-between group ${cardStyle}`}>
                    <span className="text-lg font-medium">{option}</span>
                    {showResult && isCorrect && <CheckCircle className="text-green-400" />}
                    {showResult && isSelected && !isCorrect && <XCircle className="text-red-400" />}
                  </button>
                );
              })}
            </div>
            {showExplanation && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-2xl mb-8">
                <h4 className="text-blue-400 font-bold uppercase text-xs tracking-widest mb-2">Explanation</h4>
                <p className="text-gray-300">{currentQ.explanation}</p>
              </motion.div>
            )}
            {showExplanation && (
              <div className="flex justify-end">
                <button onClick={nextQuestion} className="px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform flex items-center gap-2">
                  {currentIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"} <ArrowRight size={20} />
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}