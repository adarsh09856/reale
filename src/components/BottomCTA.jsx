import React from 'react';
import { useApp } from '../context/AppContext';
import { UserCheck, Globe, Shield, ArrowRight } from 'lucide-react';

export const BottomCTA = () => {
  const { openRoleLogin } = useApp();

  return (
    <section className="relative bg-[#060b14] text-white py-14 px-4 sm:px-8 overflow-hidden">
      
      {/* Background Mask / Dragon Watermark Accent */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-80 h-80 opacity-15 pointer-events-none">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-amber-500">
          <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="4" />
          <path d="M60 90 Q100 40 140 90 Q100 140 60 90" stroke="currentColor" strokeWidth="4" />
          <circle cx="85" cy="85" r="10" fill="currentColor" />
          <circle cx="115" cy="85" r="10" fill="currentColor" />
          <path d="M75 125 Q100 150 125 125" stroke="currentColor" strokeWidth="6" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
        
        {/* Left Headline & Action */}
        <div className="max-w-xl">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight leading-tight mb-2">
            List Your Property or Vehicle Today
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 mb-6">
            Reach thousands of genuine buyers and tenants across Bhutan.
          </p>

          <button
            onClick={() => openRoleLogin('owner', false)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-slate-950 font-bold text-xs sm:text-sm shadow-lg transition-all cursor-pointer"
          >
            <span>Get Started Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right 3 Feature Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:gap-6">
          
          {/* Feature 1 */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 text-blue-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-white">Quick Listing</h4>
              <p className="text-[11px] text-stone-400">List in just a few minutes</p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 text-amber-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-white">Wide Reach</h4>
              <p className="text-[11px] text-stone-400">Visible to serious buyers</p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0 text-emerald-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-white">Secure & Trusted</h4>
              <p className="text-[11px] text-stone-400">Admin verified & secure</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
