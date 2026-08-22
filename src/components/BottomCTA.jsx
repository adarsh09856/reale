import React from 'react';
import { useApp } from '../context/AppContext';
import { UserCheck, Globe, Shield, ArrowRight } from 'lucide-react';

export const BottomCTA = () => {
  const { openRoleLogin } = useApp();

  return (
    <section className="relative bg-[#050811] text-white py-14 sm:py-16 px-4 sm:px-8 overflow-hidden">
      
      {/* Background Dragon / Mask Art Watermark Accent */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 opacity-15 pointer-events-none">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-amber-500">
          <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="3" />
          <path d="M60 90 Q100 40 140 90 Q100 140 60 90" stroke="currentColor" strokeWidth="3" />
          <circle cx="85" cy="85" r="8" fill="currentColor" />
          <circle cx="115" cy="85" r="8" fill="currentColor" />
          <path d="M75 125 Q100 150 125 125" stroke="currentColor" strokeWidth="4" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-8 sm:gap-10 relative z-10">
        
        {/* Left Headline & Action */}
        <div className="max-w-xl">
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white tracking-tight leading-tight mb-2 sm:mb-3">
            List Your Property or Vehicle Today
          </h2>
          <p className="text-xs sm:text-base text-stone-300 mb-6">
            Reach thousands of genuine buyers, tenants, and investors across Bhutan.
          </p>

          <button
            onClick={() => openRoleLogin('owner', false)}
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-slate-950 font-bold text-xs sm:text-sm shadow-xl transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <span>Get Started Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right 3 Feature Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          
          {/* Feature 1 */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center flex-shrink-0 text-blue-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-white">Quick Listing</h4>
              <p className="text-[10px] text-stone-400">List in just minutes</p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center flex-shrink-0 text-amber-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-white">Wide Reach</h4>
              <p className="text-[10px] text-stone-400">Visible to serious buyers</p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center flex-shrink-0 text-emerald-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-white">Secure & Trusted</h4>
              <p className="text-[10px] text-stone-400">Admin verified titles</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
