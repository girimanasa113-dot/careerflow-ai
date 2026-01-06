"use client";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

interface NavbarProps {
  onAuthRequest: () => void;
}

export default function Navbar({ onAuthRequest }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false); // Mobile Menu State
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Dashboard", href: "#" },
    { name: "Resume Builder", href: "#" },
    { name: "Interview", href: "#" },
    { name: "Quizzes", href: "#" },
  ];

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-black/80 backdrop-blur-md border-b border-white/10" : "bg-transparent"
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="text-white font-bold text-2xl tracking-tighter">
              CareerFlow
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:block">
              <div className="ml-10 flex space-x-8">
                {navLinks.map((item) => (
                  <button
                    key={item.name}
                    onClick={onAuthRequest}
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
                <button
                  onClick={onAuthRequest}
                  className="text-white hover:text-gray-300 font-medium text-sm"
                >
                  Log In
                </button>
                <button
                  onClick={onAuthRequest}
                  className="bg-white text-black hover:bg-violet-500 hover:text-white px-4 py-2 rounded-full text-sm font-bold transition-all hover:scale-105"
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-white p-2">
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-black border-b border-white/10">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((item) => (
                <button
                  key={item.name}
                  onClick={() => { setIsOpen(false); onAuthRequest(); }}
                  className="w-full text-left text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  {item.name}
                </button>
              ))}
              {/* Mobile Auth Buttons */}
              <button
                onClick={() => { setIsOpen(false); onAuthRequest(); }}
                className="w-full text-left text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                Log In
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}