"use client";
import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Download, Sparkles, Loader2, Bot, Plus, Trash2, Edit2, Check } from "lucide-react";
import Link from "next/link";
import { useReactToPrint } from "react-to-print";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface Experience {
  role: string;
  company: string;
  date: string;
  points: string[];
}

interface Education {
  degree: string;
  school: string;
  date: string;
  desc: string;
}

interface PersonalInfo {
  fullName: string;
  role: string;
  email: string;
  phone: string;
  summary: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
}

export default function ResumeBuilder() {
  const router = useRouter();

  // Steps: "input" -> "preview"
  const [step, setStep] = useState<"input" | "preview">("input");

  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState("");

  // Default State (Will be populated by AI)
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: "[[Your Name]]",
    role: "[[Target Role]]",
    email: "[[Email]]",
    phone: "[[Phone]]",
    summary: "[[Summary will appear here...]]",
    skills: [],
    experience: [],
    education: []
  });

  // --- SECURITY CHECK ---
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/");
      }
    };
    checkUser();
  }, [router]);

  const componentRef = useRef<HTMLDivElement>(null);

  const handleDownload = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `${personalInfo.fullName}_Resume`,
  });

  // --- GENERATE RESUME ---
  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: prompt, type: "full_resume" }),
      });
      const data = await response.json();

      // Parse JSON
      const parsedResume = JSON.parse(data.enhancedText);
      // Ensure arrays exist
      parsedResume.skills = parsedResume.skills || [];
      parsedResume.education = parsedResume.education || [];

      setPersonalInfo(parsedResume);

      // Switch to Preview Mode
      setStep("preview");

    } catch (error) {
      console.error("Gen Error:", error);
      alert("Generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // --- EDIT HANDLERS ---
  // Simple inline edit for basic fields would require more state complexity.
  // For now, we will allow editing via a simple modal or sidebar if needed,
  // but the user requested "leave the gap".
  // We will keep the Sidebar Editor from the previous version but hide it initially.

  const addExperience = () => {
    setPersonalInfo(prev => ({
      ...prev,
      experience: [...prev.experience, { role: "[[Role]]", company: "[[Company]]", date: "[[Date]]", points: ["[[Point]]"] }]
    }));
  };

  const addEducation = () => {
    setPersonalInfo(prev => ({
      ...prev,
      education: [...prev.education, { degree: "[[Degree]]", school: "[[School]]", date: "[[Date]]", desc: "" }]
    }));
  };

  const addSkill = () => {
    setPersonalInfo(prev => ({
      ...prev,
      skills: [...prev.skills, "New Skill"]
    }));
  };

  // RENDER: INPUT PAGE
  if (step === "input") {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="w-full max-w-3xl z-10">
          <Link href="/dashboard" className="flex items-center text-gray-500 hover:text-white transition-colors mb-8">
            <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
          </Link>

          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            AI Resume Architect
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Describe your career, paste your LinkedIn bio, or just list your jobs.
            The AI will build a professional, full-page resume for you instantly.
          </p>

          <div className="bg-[#121212] border border-white/10 rounded-2xl p-4 shadow-2xl relative group focus-within:border-violet-500/50 transition-colors">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-transparent text-lg text-white placeholder-gray-600 resize-none outline-none min-h-[200px]"
              placeholder="e.g. I am a Senior Frontend Developer with 5 years experience at Google. I launched 3 major products..."
            />
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
              <div className="flex items-center gap-2 text-xs text-gray-500 font-medium uppercase tracking-wider">
                <Bot size={14} className="text-violet-500" /> Powered by Groq Llama 3
              </div>
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="bg-white text-black hover:bg-gray-200 px-8 py-3 rounded-full font-bold text-lg flex items-center gap-2 transition-transform hover:scale-105 disabled:opacity-50 disabled:scale-100"
              >
                {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles />}
                {isGenerating ? "Architecting..." : "Generate Resume"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // RENDER: EDITOR / PREVIEW PAGE
  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row relative">

      {/* SIDEBAR EDITOR (Collapsed by default on mobile, visible on desktop) */}
      <div className="w-full md:w-1/3 lg:w-1/4 h-screen overflow-y-auto border-r border-white/10 bg-neutral-950 p-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setStep("input")} className="text-gray-400 hover:text-white flex items-center gap-2 text-sm">
            <ArrowLeft size={16} /> New Generation
          </button>
          <div className="text-violet-500 font-bold text-xs">EDITOR ACTIVE</div>
        </div>

        <div className="space-y-8">
          {/* Personal */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-500 uppercase">Personal Details</label>
            <input className="w-full bg-[#111] border border-white/10 p-2 rounded text-sm text-gray-300 focus:text-white" value={personalInfo.fullName} onChange={e => setPersonalInfo({ ...personalInfo, fullName: e.target.value })} placeholder="Name" />
            <input className="w-full bg-[#111] border border-white/10 p-2 rounded text-sm text-gray-300 focus:text-white" value={personalInfo.role} onChange={e => setPersonalInfo({ ...personalInfo, role: e.target.value })} placeholder="Role" />
            <input className="w-full bg-[#111] border border-white/10 p-2 rounded text-sm text-gray-300 focus:text-white" value={personalInfo.email} onChange={e => setPersonalInfo({ ...personalInfo, email: e.target.value })} placeholder="Email" />
            <input className="w-full bg-[#111] border border-white/10 p-2 rounded text-sm text-gray-300 focus:text-white" value={personalInfo.phone} onChange={e => setPersonalInfo({ ...personalInfo, phone: e.target.value })} placeholder="Phone" />
            <textarea rows={3} className="w-full bg-[#111] border border-white/10 p-2 rounded text-sm text-gray-300 focus:text-white" value={personalInfo.summary} onChange={e => setPersonalInfo({ ...personalInfo, summary: e.target.value })} placeholder="Summary" />
          </div>

          {/* Skills */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-gray-500 uppercase">Skills</label>
              <button onClick={addSkill} className="text-violet-400 hover:text-violet-300"><Plus size={16} /></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {personalInfo.skills.map((skill, i) => (
                <div key={i} className="flex items-center bg-[#111] border border-white/10 rounded px-2 py-1">
                  <input
                    className="bg-transparent text-xs text-gray-300 w-20 outline-none"
                    value={skill}
                    onChange={e => {
                      const newSkills = [...personalInfo.skills];
                      newSkills[i] = e.target.value;
                      setPersonalInfo({ ...personalInfo, skills: newSkills });
                    }}
                  />
                  <button onClick={() => {
                    const newSkills = personalInfo.skills.filter((_, idx) => idx !== i);
                    setPersonalInfo({ ...personalInfo, skills: newSkills });
                  }} className="text-red-500 hover:text-red-400 ml-1"><Trash2 size={10} /></button>
                </div>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-gray-500 uppercase">Experience</label>
              <button onClick={addExperience} className="text-violet-400 hover:text-violet-300"><Plus size={16} /></button>
            </div>
            {personalInfo.experience.map((exp, i) => (
              <div key={i} className="bg-[#111] p-3 rounded border border-white/5 space-y-2">
                <input className="w-full bg-black border border-white/10 p-1.5 rounded text-xs" value={exp.role} onChange={e => {
                  const newExp = [...personalInfo.experience]; newExp[i].role = e.target.value; setPersonalInfo({ ...personalInfo, experience: newExp });
                }} placeholder="Role" />
                <input className="w-full bg-black border border-white/10 p-1.5 rounded text-xs" value={exp.company} onChange={e => {
                  const newExp = [...personalInfo.experience]; newExp[i].company = e.target.value; setPersonalInfo({ ...personalInfo, experience: newExp });
                }} placeholder="Company" />
                <input className="w-full bg-black border border-white/10 p-1.5 rounded text-xs" value={exp.date} onChange={e => {
                  const newExp = [...personalInfo.experience]; newExp[i].date = e.target.value; setPersonalInfo({ ...personalInfo, experience: newExp });
                }} placeholder="Date" />
                <textarea rows={2} className="w-full bg-black border border-white/10 p-1.5 rounded text-xs" value={exp.points.join("\n")} onChange={e => {
                  const newExp = [...personalInfo.experience]; newExp[i].points = e.target.value.split("\n"); setPersonalInfo({ ...personalInfo, experience: newExp });
                }} placeholder="Points..." />
                <button onClick={() => {
                  const newExp = personalInfo.experience.filter((_, idx) => idx !== i);
                  setPersonalInfo({ ...personalInfo, experience: newExp });
                }} className="text-red-500 hover:text-red-400 text-xs flex items-center gap-1"><Trash2 size={12} /> Remove</button>
              </div>
            ))}
          </div>

          {/* Education */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-gray-500 uppercase">Education</label>
              <button onClick={addEducation} className="text-violet-400 hover:text-violet-300"><Plus size={16} /></button>
            </div>
            {personalInfo.education.map((edu, i) => (
              <div key={i} className="bg-[#111] p-3 rounded border border-white/5 space-y-2">
                <input className="w-full bg-black border border-white/10 p-1.5 rounded text-xs" value={edu.degree} onChange={e => {
                  const newEdu = [...personalInfo.education]; newEdu[i].degree = e.target.value; setPersonalInfo({ ...personalInfo, education: newEdu });
                }} placeholder="Degree" />
                <input className="w-full bg-black border border-white/10 p-1.5 rounded text-xs" value={edu.school} onChange={e => {
                  const newEdu = [...personalInfo.education]; newEdu[i].school = e.target.value; setPersonalInfo({ ...personalInfo, education: newEdu });
                }} placeholder="School" />
                <input className="w-full bg-black border border-white/10 p-1.5 rounded text-xs" value={edu.date} onChange={e => {
                  const newEdu = [...personalInfo.education]; newEdu[i].date = e.target.value; setPersonalInfo({ ...personalInfo, education: newEdu });
                }} placeholder="Date" />
                <textarea rows={2} className="w-full bg-black border border-white/10 p-1.5 rounded text-xs" value={edu.desc} onChange={e => {
                  const newEdu = [...personalInfo.education]; newEdu[i].desc = e.target.value; setPersonalInfo({ ...personalInfo, education: newEdu });
                }} placeholder="Description (optional)" />
                <button onClick={() => {
                  const newEdu = personalInfo.education.filter((_, idx) => idx !== i);
                  setPersonalInfo({ ...personalInfo, education: newEdu });
                }} className="text-red-500 hover:text-red-400 text-xs flex items-center gap-1"><Trash2 size={12} /> Remove</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PREVIEW SECTION */}
      <div className="flex-1 bg-[#1a1a1a] p-8 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-6 right-6 z-20">
          <button
            onClick={() => handleDownload && handleDownload()}
            className="px-6 py-3 text-sm font-bold bg-white text-black rounded-full hover:scale-105 transition-transform shadow-xl flex items-center gap-2"
          >
            <Download size={18} /> Download PDF
          </button>
        </div>

        <div className="transform scale-[0.5] md:scale-[0.7] origin-top transition-all duration-300">
          <div ref={componentRef} className="w-[210mm] min-h-[297mm] bg-white text-black shadow-2xl overflow-hidden relative">
            <div className="p-16 h-full flex flex-col">

              {/* Header */}
              <div className="border-b-4 border-black pb-8 mb-8">
                <h1 className="text-5xl font-bold uppercase tracking-tight text-black mb-3">{personalInfo.fullName}</h1>
                <p className="text-xl text-gray-700 font-light tracking-widest uppercase mb-4">{personalInfo.role}</p>
                <div className="flex gap-6 text-sm text-gray-600 font-medium">
                  {personalInfo.email && <span>{personalInfo.email}</span>}
                  <span className="text-gray-300">|</span>
                  {personalInfo.phone && <span>{personalInfo.phone}</span>}
                  {personalInfo.skills.length > 0 && (
                    <>
                      <span className="text-gray-300">|</span>
                      <span>{personalInfo.skills.slice(0, 3).join(", ")}...</span>
                    </>
                  )}
                </div>
              </div>

              {/* Summary */}
              <div className="mb-10">
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Summary</h2>
                <p className="text-gray-900 leading-relaxed text-base font-serif">
                  {personalInfo.summary}
                </p>
              </div>

              {/* Skills (Detailed) */}
              <div className="mb-10">
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Technical Skills</h2>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-800 font-medium">
                  {personalInfo.skills.map((skill, i) => (
                    <span key={i} className="bg-gray-100 px-3 py-1 rounded-full">{skill}</span>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div className="mb-8">
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Experience</h2>
                <div className="space-y-8">
                  {personalInfo.experience.map((exp, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-black text-xl">{exp.role}</h3>
                        <span className="text-sm font-bold text-gray-500">{exp.date}</span>
                      </div>
                      <p className="text-md text-gray-700 font-semibold mb-3 italic">{exp.company}</p>
                      <ul className="list-disc list-outside ml-5 text-gray-800 space-y-2 leading-relaxed font-serif text-sm">
                        {exp.points.map((point, idx) => (
                          <li key={idx}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="mb-8">
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Education</h2>
                <div className="space-y-4">
                  {personalInfo.education.map((edu, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-black text-lg">{edu.school}</h3>
                        <span className="text-sm font-bold text-gray-500">{edu.date}</span>
                      </div>
                      <p className="text-md text-gray-700 font-medium">{edu.degree}</p>
                      {edu.desc && <p className="text-sm text-gray-600 mt-1 italic">{edu.desc}</p>}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}