import React, { useState, useEffect } from 'react';
import { ArrowUp, Sparkles } from 'lucide-react';

export const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 280) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 z-40 group flex items-center gap-2 py-3 px-4 sm:px-5 rounded-full bg-gradient-to-r from-[#9e1b27] via-[#b91c1c] to-[#d97706] text-white font-bold text-xs sm:text-sm shadow-xl shadow-[#9e1b27]/35 border border-white/20 backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-2xl hover:shadow-[#d97706]/40 cursor-pointer animate-in fade-in slide-in-from-bottom-6"
    >
      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center group-hover:-translate-y-0.5 transition-transform">
        <ArrowUp className="w-3.5 h-3.5 text-white stroke-[2.5]" />
      </div>
      <span className="tracking-wide">Back to Top</span>
      <Sparkles className="w-3 h-3 text-amber-300 opacity-80 group-hover:rotate-12 transition-transform hidden sm:inline" />
    </button>
  );
};
