"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import AuthModal from "@/components/AuthModal";

export default function Home() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const openAuthModal = () => setIsAuthOpen(true);

  return (
    <main className="bg-black min-h-screen text-white">
      <Navbar onAuthRequest={openAuthModal} />
      <Hero onAuthRequest={openAuthModal} />
      <Features onAuthRequest={openAuthModal} />
      <Pricing />

      {/* Footer Placeholder */}
      <footer className="py-8 text-center text-gray-600 text-sm border-t border-white/10">
        © 2024 CareerFlow. Built with Next.js & AI.
      </footer>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </main>
  );
}