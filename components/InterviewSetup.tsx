"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Code2, Briefcase, Brain, Clock, 
  ArrowRight, Smartphone, Shield, Gamepad2, Database, 
  Cloud, Server, Layout, LineChart, Globe, Lock
} from "lucide-react";
import { useRouter } from "next/navigation";

// --- 1. EXPANDED ROLES (15 Total) ---
const ROLES = [
  { id: "frontend", label: "Frontend Dev", icon: <Code2 size={18}/> },
  { id: "backend", label: "Backend Dev", icon: <Database size={18}/> },
  { id: "fullstack", label: "Full Stack", icon: <Briefcase size={18}/> },
  { id: "mobile", label: "Mobile Dev", icon: <Smartphone size={18}/> },
  { id: "devops", label: "DevOps Eng", icon: <Cloud size={18}/> },
  { id: "datascience", label: "Data Scientist", icon: <Brain size={18}/> },
  { id: "security", label: "Cyber Security", icon: <Shield size={18}/> },
  { id: "gamedev", label: "Game Dev", icon: <Gamepad2 size={18}/> },
  { id: "qa", label: "QA Automation", icon: <CheckCircle size={18}/> }, // You might need to import CheckCircle
  { id: "cloud", label: "Cloud Architect", icon: <Server size={18}/> },
  { id: "uiux", label: "UI/UX Designer", icon: <Layout size={18}/> },
  { id: "product", label: "Product Manager", icon: <LineChart size={18}/> },
  { id: "blockchain", label: "Blockchain Dev", icon: <Lock size={18}/> },
  { id: "sre", label: "Site Reliability", icon: <Globe size={18}/> },
  { id: "ml", label: "ML Engineer", icon: <Brain size={18}/> },
];

import { CheckCircle } from "lucide-react"; // Import missing icon

// Minimal tech stack mapping for brevity (You can expand this)
const TECH_STACKS: Record<string, string[]> = {
  frontend: ["React", "Next.js", "TypeScript", "Tailwind", "Vue.js"],
  backend: ["Node.js", "Python", "Java", "Go", "PostgreSQL"],
  // ... Add mappings for other roles as needed
};

export default function InterviewSetup() {
  const router = useRouter();
  const [role, setRole] = useState(ROLES[0].id);
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState("Mid-Level");
  const [questionCount, setQuestionCount] = useState(5);

  const toggleTech = (tech: string) => {
    if (selectedTech.includes(tech)) {
      setSelectedTech(selectedTech.filter(t => t !== tech));
    } else {
      setSelectedTech([...selectedTech, tech]);
    }
  };

  const handleStart = () => {
    // Save settings to LocalStorage so the Session page can read them
    localStorage.setItem("interviewConfig", JSON.stringify({
      role: ROLES.find(r => r.id === role)?.label,
      difficulty,
      questionCount
    }));
    router.push("/interview/session");
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
          Configure Your <span className="text-violet-500">Interview</span>
        </h1>
        <p className="text-gray-400">Select your target role to generate AI questions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-neutral-900/50 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Target Role</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  onClick={() => { setRole(r.id); }}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                    role === r.id 
                      ? "bg-violet-600/20 border-violet-500 text-white" 
                      : "bg-black/40 border-white/10 text-gray-400 hover:bg-white/5"
                  }`}
                >
                  <div className={`p-2 rounded-lg ${role === r.id ? "bg-violet-500" : "bg-white/10"}`}>
                    {r.icon}
                  </div>
                  <span className="text-sm font-medium">{r.label}</span>
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-neutral-900/50 border border-white/10 rounded-2xl p-6">
             <h3 className="text-sm font-medium text-gray-300 mb-4">Settings</h3>
             <div className="space-y-6">
               <div>
                  <label className="text-xs text-gray-500 uppercase font-bold">Difficulty</label>
                  <div className="flex bg-black/40 p-1 rounded-lg border border-white/10 mt-2">
                    {["Junior", "Mid-Level", "Senior"].map((level) => (
                      <button 
                        key={level}
                        onClick={() => setDifficulty(level)}
                        className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                          difficulty === level ? "bg-violet-600 text-white" : "text-gray-500 hover:text-white"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
               </div>
               <div>
                  <label className="text-xs text-gray-500 uppercase font-bold">Duration</label>
                  <div className="flex gap-2 mt-2">
                    {[3, 5, 10].map(num => (
                      <button key={num} onClick={() => setQuestionCount(num)} className={`flex-1 py-2 text-xs font-bold rounded-lg border ${questionCount === num ? "bg-white text-black border-white" : "bg-black/40 border-white/10 text-gray-500"}`}>{num} Qs</button>
                    ))}
                  </div>
               </div>
             </div>
          </section>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleStart} className="w-full py-4 bg-white text-black text-lg font-bold rounded-xl hover:bg-violet-400 hover:text-white transition-colors flex items-center justify-center gap-2 shadow-xl">
            Start Interview <ArrowRight size={20} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}