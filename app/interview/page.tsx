"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import InterviewSetup from "@/components/InterviewSetup";

export default function InterviewPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // --- SECURITY CHECK ---
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/"); // Kick out if not logged in
      } else {
        setLoading(false);
      }
    };
    checkUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-violet-500">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white relative overflow-x-hidden">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-violet-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-900/20 blur-[120px] rounded-full" />
      </div>

      {/* Navbar Placeholder */}
      <nav className="relative z-10 px-6 py-6 flex items-center justify-between max-w-7xl mx-auto">
        {/* UPDATED LINK: Points to Dashboard */}
        <Link href="/dashboard" className="flex items-center text-gray-400 hover:text-white transition-colors text-sm">
          <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
        </Link>
        <div className="text-white font-bold tracking-tight">CAREER<span className="text-violet-500">FLOW</span></div>
      </nav>

      {/* Content */}
      <div className="relative z-10 py-10">
        <InterviewSetup />
      </div>
    </main>
  );
}