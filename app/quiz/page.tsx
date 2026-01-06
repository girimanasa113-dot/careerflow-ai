"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Code2, Hash, Zap, Layout, Terminal, Database, Layers, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const TOPICS = [
  { id: "arrays", name: "Arrays & Strings", icon: <Hash size={24}/>, color: "from-blue-500 to-cyan-500" },
  { id: "linkedlist", name: "Linked Lists", icon: <Zap size={24}/>, color: "from-yellow-500 to-orange-500" },
  { id: "trees", name: "Trees & Graphs", icon: <Layers size={24}/>, color: "from-green-500 to-emerald-500" },
  { id: "dp", name: "Dynamic Prog.", icon: <Layout size={24}/>, color: "from-purple-500 to-pink-500" },
  { id: "sorting", name: "Sort & Search", icon: <Terminal size={24}/>, color: "from-red-500 to-rose-500" },
  { id: "system", name: "System Design", icon: <Database size={24}/>, color: "from-indigo-500 to-violet-500" },
];

export default function QuizMenu() {
  const router = useRouter();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState("Medium");

  const startQuiz = () => {
    if (!selectedTopic) return;
    router.push(`/quiz/play?topic=${selectedTopic}&difficulty=${difficulty}`);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-violet-500/30">
      
      <nav className="p-6 flex justify-between items-center border-b border-white/5">
        <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
          &larr; Dashboard
        </Link>
        <div className="font-bold text-xl tracking-tighter">
          Code<span className="text-violet-500">Quiz</span>
        </div>
        <div className="w-20" />
      </nav>

      <div className="max-w-5xl mx-auto p-8 md:p-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-b from-white to-gray-600 bg-clip-text text-transparent">
            Master the Algo.
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Select a topic to generate a fresh set of LeetCode-style concept questions.
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="bg-white/5 p-1 rounded-full border border-white/10 flex">
            {["Easy", "Medium", "Hard"].map((level) => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${
                  difficulty === level ? "bg-white text-black shadow-lg" : "text-gray-400 hover:text-white"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {TOPICS.map((t) => (
            <motion.button
              key={t.id}
              onClick={() => setSelectedTopic(t.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative p-6 rounded-2xl border text-left overflow-hidden group transition-all ${
                selectedTopic === t.id ? "border-violet-500 bg-violet-500/10" : "border-white/10 bg-white/5 hover:bg-white/10"
              }`}
            >
              <div className={`p-3 rounded-xl w-fit mb-4 bg-gradient-to-br ${t.color} text-white shadow-lg`}>
                {t.icon}
              </div>
              <h3 className="text-xl font-bold mb-1">{t.name}</h3>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">{difficulty} Level</p>
              {selectedTopic === t.id && (
                <div className="absolute top-4 right-4 text-violet-500">
                  <div className="w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center">
                    <ArrowRight size={14} className="text-black" />
                  </div>
                </div>
              )}
            </motion.button>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={startQuiz}
            disabled={!selectedTopic}
            className="px-12 py-5 bg-white text-black text-xl font-bold rounded-full hover:scale-105 transition-transform disabled:opacity-50 disabled:scale-100 shadow-[0_0_40px_rgba(255,255,255,0.3)] flex items-center gap-3"
          >
            Start Quiz <ArrowRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}