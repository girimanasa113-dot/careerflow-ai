"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Linkedin,
    UserCircle,
    PenTool,
    Users,
    Sparkles,
    Copy,
    Check,
    Loader2
} from "lucide-react";
import { motion } from "framer-motion";

export default function LinkedInOptimizer() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"profile" | "post" | "network">("profile");
    const [inputText, setInputText] = useState("");
    const [generatedContent, setGeneratedContent] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [copied, setCopied] = useState(false);

    // Security Check
    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) router.push("/");
        };
        checkUser();
    }, [router]);

    const handleGenerate = async () => {
        if (!inputText.trim()) return;
        setIsGenerating(true);
        setGeneratedContent("");

        let type = "linkedin_bio";
        if (activeTab === "post") type = "linkedin_post";
        if (activeTab === "network") type = "linkedin_message";

        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: inputText, type }),
            });
            const data = await response.json();
            setGeneratedContent(data.enhancedText);
        } catch (error) {
            console.error("AI Error:", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const tabContent = {
        profile: {
            title: "Profile Optimizer",
            desc: "Paste your current Headline & About section. We'll rewrite it to attract recruiters.",
            placeholder: "e.g. Current Headline: Marketing Manager. About: I have 5 years experience...",
            icon: <UserCircle size={20} />
        },
        post: {
            title: "Viral Post Creator",
            desc: "Have an idea? Describe it, and we'll format it into a high-engagement LinkedIn post.",
            placeholder: "e.g. I just learned React and it was harder than I thought, but worth it...",
            icon: <PenTool size={20} />
        },
        network: {
            title: "Connection Request Writer",
            desc: "Paste a person's bio or name. We'll write a personalized 300-char connection note.",
            placeholder: "e.g. John Doe, CTO at TechCorp. He posted about AI agents recently...",
            icon: <Users size={20} />
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-5xl mx-auto relative z-10">
                <Link href="/dashboard" className="flex items-center text-gray-400 hover:text-white transition-colors mb-8">
                    <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
                </Link>

                {/* Header */}
                <div className="flex items-center gap-4 mb-2">
                    <div className="bg-blue-600/20 p-3 rounded-xl border border-blue-500/30">
                        <Linkedin size={32} className="text-blue-500" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold">LinkedIn Strategist</h1>
                        <p className="text-gray-400">Optimize your personal brand with AI.</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-4 mt-10 mb-8 border-b border-white/10 pb-1">
                    {(["profile", "post", "network"] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => { setActiveTab(tab); setInputText(""); setGeneratedContent(""); }}
                            className={`flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-t-xl transition-all border-b-2 ${activeTab === tab
                                    ? "border-blue-500 text-blue-400 bg-blue-500/5"
                                    : "border-transparent text-gray-500 hover:text-gray-300"
                                }`}
                        >
                            {tabContent[tab].icon}
                            {tabContent[tab].title}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[600px]">

                    {/* INPUT SECTION */}
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-6 flex flex-col h-full shadow-2xl">
                        <h2 className="text-xl font-semibold mb-2">{tabContent[activeTab].title}</h2>
                        <p className="text-sm text-gray-500 mb-4">{tabContent[activeTab].desc}</p>

                        <textarea
                            className="flex-1 bg-black border border-white/10 rounded-xl p-4 text-gray-300 focus:outline-none focus:border-blue-500/50 resize-none transition-colors"
                            placeholder={tabContent[activeTab].placeholder}
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                        />

                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating || !inputText.trim()}
                                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 transition-transform active:scale-95 disabled:opacity-50 disabled:scale-100"
                            >
                                {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                                {isGenerating ? "Optimizing..." : "Generate Magic"}
                            </button>
                        </div>
                    </div>

                    {/* OUTPUT SECTION */}
                    <div className="bg-[#111] border border-white/10 rounded-2xl p-6 flex flex-col h-full relative overflow-hidden">
                        {generatedContent ? (
                            <>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-xs font-bold text-green-400 uppercase tracking-widest flex items-center gap-2">
                                        <Sparkles size={12} /> AI Generated
                                    </span>
                                    <button
                                        onClick={copyToClipboard}
                                        className="text-gray-400 hover:text-white bg-white/5 p-2 rounded-lg transition-colors"
                                    >
                                        {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                                    </button>
                                </div>
                                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                    <p className="whitespace-pre-wrap text-gray-300 leading-relaxed text-sm md:text-base">
                                        {generatedContent}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-600 opacity-50">
                                <Linkedin size={48} className="mb-4" />
                                <p className="text-lg font-medium">Ready to optimize</p>
                                <p className="text-sm">Your AI-enhanced content will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
