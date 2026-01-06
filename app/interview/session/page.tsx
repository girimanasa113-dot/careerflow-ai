"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Send, Loader2, Award, CheckCircle, AlertCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Feedback {
  score: number;
  feedback: string;
  improvement: string;
  example: string;
}

export default function InterviewSession() {
  const router = useRouter();

  // Config
  const [config, setConfig] = useState<{ role: string; difficulty: string; questionCount: number } | null>(null);

  // State
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [totalScore, setTotalScore] = useState(0);

  // Init
  useEffect(() => {
    const saved = localStorage.getItem("interviewConfig");
    if (!saved) {
      router.push("/interview");
      return;
    }
    const parsed = JSON.parse(saved);
    setConfig(parsed);

    // Generate First Question
    generateQuestion(parsed.role, parsed.difficulty, null);
  }, []);

  const generateQuestion = async (role: string, difficulty: string, prevQ: string | null) => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: "",
          type: "interview_question",
          context: { role, difficulty, previousQuestion: prevQ }
        }),
      });
      const data = await res.json();
      setQuestions(prev => [...prev, data.enhancedText]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!userAnswer.trim() || !config) return;
    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: userAnswer,
          type: "interview_feedback",
          context: { role: config.role, question: questions[currentQIndex] }
        })
      });
      const data = await res.json();

      // Fix: Clean markdown code fences if present
      let cleanJson = data.enhancedText.trim();
      if (cleanJson.startsWith("```")) {
        cleanJson = cleanJson.replace(/^```(json)?/, "").replace(/```$/, "");
      }

      const result: Feedback = JSON.parse(cleanJson);

      setFeedback(result);
      setTotalScore(prev => prev + result.score);

    } catch (e) {
      console.error("Grading Error:", e);
      alert("Error grading answer. Please try again or skip.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (!config) return;
    setUserAnswer("");
    setFeedback(null);

    if (currentQIndex + 1 >= config.questionCount) {
      setIsFinished(true);
    } else {
      setCurrentQIndex(prev => prev + 1);
      generateQuestion(config.role, config.difficulty, questions[currentQIndex]);
    }
  };

  if (isFinished && config) {
    const avgScore = Math.round(totalScore / config.questionCount);
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="max-w-2xl w-full text-center space-y-8">
          <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center border-4 ${avgScore > 70 ? "border-green-500 bg-green-500/10 text-green-500" : "border-yellow-500 bg-yellow-500/10 text-yellow-500"}`}>
            <span className="text-4xl font-black">{avgScore}%</span>
          </div>

          <h1 className="text-4xl font-bold">Interview Complete!</h1>
          <p className="text-gray-400 text-xl">
            You answered {config.questionCount} {config.difficulty} questions for the {config.role} role.
          </p>

          <div className="flex justify-center gap-4">
            <button onClick={() => router.push("/dashboard")} className="px-8 py-3 bg-gray-800 rounded-xl font-bold hover:bg-gray-700">Dashboard</button>
            <button onClick={() => router.push("/interview")} className="px-8 py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-200">New Interview</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans">
      <div className="w-full h-2 bg-gray-900 fixed top-0 left-0 z-20">
        <div className="h-full bg-violet-600 transition-all duration-500" style={{ width: `${((currentQIndex + 1) / (config?.questionCount || 1)) * 100}%` }} />
      </div>

      <main className="flex-1 w-full max-w-4xl mx-auto p-6 md:p-12 flex flex-col gap-8 pt-12">

        {/* Question Area */}
        <div className="space-y-4">
          <span className="text-violet-500 font-bold tracking-widest text-xs uppercase">
            Question {currentQIndex + 1} of {config?.questionCount || 5} • {config?.difficulty}
          </span>
          {loading && questions.length === currentQIndex ? (
            <div className="flex items-center gap-3 text-gray-400">
              <Loader2 className="animate-spin" /> Generating technical question...
            </div>
          ) : (
            <h1 className="text-2xl md:text-4xl font-bold leading-tight">
              {questions[currentQIndex]}
            </h1>
          )}
        </div>

        {/* Answer Area */}
        <div className="flex-1 flex flex-col gap-6">
          <textarea
            value={userAnswer}
            onChange={e => setUserAnswer(e.target.value)}
            disabled={!!feedback || loading}
            placeholder={loading ? "Please wait..." : "Type your technical answer clearly (e.g. code snippets effectively)..."}
            className={`w-full flex-1 bg-[#111] border rounded-2xl p-6 text-lg resize-none outline-none transition-colors ${feedback ? "border-gray-700 text-gray-400 cursor-not-allowed" : "border-white/10 focus:border-violet-500/50 text-white"
              }`}
          />

          {!feedback ? (
            <div className="flex justify-end gap-3">
              <button
                onClick={handleNext}
                disabled={loading}
                className="px-6 py-4 rounded-full font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                Skip
              </button>
              <button
                onClick={handleSubmit}
                disabled={!userAnswer.trim() || loading}
                className="flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                Submit Answer
              </button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#111] border border-white/10 rounded-2xl p-6 md:p-8 space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Sparkles className="text-violet-500" /> AI Feedback
                </h3>
                <div className={`px-4 py-1 rounded-full text-sm font-bold border ${feedback.score > 70 ? "border-green-500/30 bg-green-500/10 text-green-400" : "border-red-500/30 bg-red-500/10 text-red-400"}`}>
                  Score: {feedback.score}/100
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1"><CheckCircle size={12} /> What was good</span>
                  <p className="text-gray-300 text-sm leading-relaxed">{feedback.feedback}</p>
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1"><AlertCircle size={12} /> Improvement</span>
                  <p className="text-gray-300 text-sm leading-relaxed">{feedback.improvement}</p>
                </div>
              </div>

              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <span className="text-xs font-bold text-gray-500 uppercase block mb-2">Better Answer Example</span>
                <p className="text-gray-400 text-sm italic">"{feedback.example}"</p>
              </div>

              <div className="flex justify-end">
                <button onClick={handleNext} className="flex items-center gap-2 bg-violet-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-violet-500 transition-colors">
                  {currentQIndex + 1 >= (config?.questionCount || 5) ? "Finish Interview" : "Next Question"} <ArrowRight size={20} />
                </button>
              </div>
            </motion.div>
          )}
        </div>

      </main>
    </div>
  );
}