"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import Link from "next/link";
import { FileText, Mic, BrainCircuit, Linkedin, ArrowRight, LogOut } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const tools = [
    {
      title: "Resume Builder",
      description: "Create ATS-friendly resumes with AI assistance.",
      icon: <FileText size={32} className="text-violet-400" />,
      href: "/resume-builder",
      color: "hover:border-violet-500/50",
      bg: "bg-violet-500/10"
    },
    {
      title: "Interview Workspace",
      description: "Practice with AI-driven mock interviews.",
      icon: <Mic size={32} className="text-emerald-400" />,
      href: "/interview",
      color: "hover:border-emerald-500/50",
      bg: "bg-emerald-500/10"
    },
    {
      title: "Skill Quizzes",
      description: "Test your knowledge and get certified.",
      icon: <BrainCircuit size={32} className="text-blue-400" />,
      href: "/quiz",
      color: "hover:border-blue-500/50",
      bg: "bg-blue-500/10"
    },
    {
      title: "LinkedIn Optimizer",
      description: "Enhance your profile for better visibility.",
      icon: <Linkedin size={32} className="text-blue-600" />,
      href: "/linkedin",
      color: "hover:border-blue-600/50",
      bg: "bg-blue-600/10"
    },

    {
      title: "AI Career Coach",
      description: "Get personalized guidance and tech stack advice.",
      icon: <BrainCircuit size={32} className="text-pink-500" />,
      href: "/career-coach",
      color: "hover:border-pink-500/50",
      bg: "bg-pink-500/10"
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 pt-24">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-emerald-400">Career Dashboard</span>
            </h1>
            <p className="text-gray-400 text-lg">Select a tool to start accelerating your career growth.</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors font-medium"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <Link key={tool.title} href={tool.href} className="block group">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`h-full p-6 rounded-2xl border border-white/5 bg-[#0F0F0F] transition-all duration-300 ${tool.color} group-hover:transform group-hover:-translate-y-1 group-hover:shadow-2xl`}
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${tool.bg}`}>
                  {tool.icon}
                </div>

                <h3 className="text-2xl font-bold mb-2 group-hover:text-white transition-colors">
                  {tool.title}
                </h3>

                <p className="text-gray-400 mb-6 line-clamp-2">
                  {tool.description}
                </p>

                <div className="flex items-center text-sm font-medium text-gray-500 group-hover:text-white transition-colors">
                  Open Tool <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}