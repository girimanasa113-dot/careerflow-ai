"use client";
import { Check } from "lucide-react";

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-gray-400">Invest in your career for less than the price of a coffee.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <div className="p-8 rounded-2xl border border-white/10 hover:border-white/30 transition-all bg-neutral-900/50">
            <h3 className="text-xl font-bold text-white">Starter</h3>
            <div className="my-4"><span className="text-4xl font-bold text-white">Free</span></div>
            <p className="text-gray-400 mb-6 text-sm">Perfect for testing the waters.</p>
            <ul className="space-y-3 mb-8 text-gray-300 text-sm">
              <li className="flex gap-2"><Check size={18} className="text-blue-500"/> 1 AI Resume Build</li>
              <li className="flex gap-2"><Check size={18} className="text-blue-500"/> Basic Interview Tips</li>
              <li className="flex gap-2"><Check size={18} className="text-blue-500"/> 1 LinkedIn Audit</li>
            </ul>
            <button className="w-full py-3 rounded-full border border-white/20 text-white font-medium hover:bg-white hover:text-black transition-all">Get Started</button>
          </div>

          {/* Pro Plan - Highlighted */}
          <div className="p-8 rounded-2xl border border-blue-500/50 bg-blue-900/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-blue-500 text-xs font-bold px-3 py-1 rounded-bl-lg text-white">POPULAR</div>
            <h3 className="text-xl font-bold text-white">Pro Career</h3>
            <div className="my-4 flex items-end gap-1">
              <span className="text-4xl font-bold text-white">₹499</span>
              <span className="text-gray-400 text-sm mb-1">/mo</span>
            </div>
            <p className="text-gray-400 mb-6 text-sm">For serious job seekers.</p>
            <ul className="space-y-3 mb-8 text-gray-300 text-sm">
              <li className="flex gap-2"><Check size={18} className="text-blue-400"/> Unlimited AI Resumes</li>
              <li className="flex gap-2"><Check size={18} className="text-blue-400"/> Mock Interview Simulator</li>
              <li className="flex gap-2"><Check size={18} className="text-blue-400"/> LinkedIn Content Generator</li>
              <li className="flex gap-2"><Check size={18} className="text-blue-400"/> ATS Score Checker</li>
            </ul>
            <button className="w-full py-3 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/25">Upgrade Now</button>
          </div>

          {/* Enterprise Plan */}
          <div className="p-8 rounded-2xl border border-white/10 hover:border-white/30 transition-all bg-neutral-900/50">
            <h3 className="text-xl font-bold text-white">Ultimate</h3>
            <div className="my-4 flex items-end gap-1">
              <span className="text-4xl font-bold text-white">₹999</span>
              <span className="text-gray-400 text-sm mb-1">/mo</span>
            </div>
            <p className="text-gray-400 mb-6 text-sm">For absolute career domination.</p>
            <ul className="space-y-3 mb-8 text-gray-300 text-sm">
              <li className="flex gap-2"><Check size={18} className="text-blue-500"/> Everything in Pro</li>
              <li className="flex gap-2"><Check size={18} className="text-blue-500"/> 1-on-1 Human Coaching</li>
              <li className="flex gap-2"><Check size={18} className="text-blue-500"/> Salary Negotiation Help</li>
            </ul>
            <button className="w-full py-3 rounded-full border border-white/20 text-white font-medium hover:bg-white hover:text-black transition-all">Contact Sales</button>
          </div>
        </div>
      </div>
    </section>
  );
}