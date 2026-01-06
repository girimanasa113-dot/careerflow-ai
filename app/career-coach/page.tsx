"use client";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    Bot,
    Send,
    User,
    Loader2,
    Sparkles,
    Terminal
} from "lucide-react";

interface Message {
    role: "user" | "ai";
    content: string;
}

export default function CareerCoach() {
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([
        { role: "ai", content: "Hello! I'm your AI Career Coach. I can help you plan your roadmap, review your resume gaps, or suggest the best tech stacks to learn. How can I help you today?" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Security Check
    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) router.push("/");
        };
        checkUser();
    }, [router]);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg = input;
        setInput("");
        setMessages(prev => [...prev, { role: "user", content: userMsg }]);
        setLoading(true);

        try {
            // We send the LAST user message. 
            // Ideally, for a full chat, we would send history, but for this simplified flow, 
            // we'll treat each query as semi-independent or concatenated if needed.
            // For a better experience, we can concatenate the last 2 messages for context if we wanted.

            const response = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: userMsg, type: "career_coach" }),
            });
            const data = await response.json();

            setMessages(prev => [...prev, { role: "ai", content: data.enhancedText }]);

        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { role: "ai", content: "Sorry, I encountered an error. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans">

            {/* Header */}
            <header className="p-4 border-b border-white/10 bg-[#0A0A0A] flex items-center gap-4 fixed top-0 w-full z-10">
                <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div className="flex items-center gap-2">
                    <div className="bg-violet-600 p-2 rounded-lg">
                        <Bot size={20} className="text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-sm md:text-base">AI Career Coach</h1>
                        <p className="text-xs text-green-400 flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Online
                        </p>
                    </div>
                </div>
            </header>

            {/* Chat Area */}
            <main className="flex-1 mt-16 pt-4 pb-24 px-4 md:px-0 max-w-3xl mx-auto w-full flex flex-col gap-6">
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "ai" ? "bg-violet-600" : "bg-gray-700"
                            }`}>
                            {msg.role === "ai" ? <Bot size={16} /> : <User size={16} />}
                        </div>

                        <div className={`p-4 rounded-2xl max-w-[85%] leading-relaxed whitespace-pre-wrap ${msg.role === "ai"
                                ? "bg-[#1A1A1A] border border-white/5 text-gray-200"
                                : "bg-violet-600 text-white"
                            }`}>
                            {msg.role === "ai" && i === 0 && (
                                <p className="text-xs text-violet-300 font-bold mb-2 flex items-center gap-1">
                                    <Sparkles size={12} /> AI MENTOR
                                </p>
                            )}
                            {msg.content}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center shrink-0">
                            <Bot size={16} />
                        </div>
                        <div className="bg-[#1A1A1A] border border-white/5 p-4 rounded-2xl flex items-center gap-2 text-gray-400 text-sm">
                            <Loader2 size={16} className="animate-spin" /> Thinking...
                        </div>
                    </div>
                )}
                <div ref={scrollRef} />
            </main>

            {/* Input Area */}
            <div className="fixed bottom-0 w-full bg-[#0A0A0A] border-t border-white/10 p-4">
                <div className="max-w-3xl mx-auto relative">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask for career advice (e.g. 'How do I learn Next.js?')..."
                        className="w-full bg-[#151515] border border-white/10 rounded-xl py-4 pl-4 pr-12 text-white focus:outline-none focus:border-violet-500/50 resize-none h-[60px] custom-scrollbar"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || loading}
                        className="absolute right-3 top-3 bg-violet-600 hover:bg-violet-500 text-white p-2 rounded-lg transition-colors disabled:opacity-50 disabled:bg-gray-700"
                    >
                        <Send size={18} />
                    </button>
                </div>
                <div className="text-center mt-2">
                    <p className="text-[10px] text-gray-600">
                        AI can make mistakes. Verify important career information.
                    </p>
                </div>
            </div>
        </div>
    );
}
