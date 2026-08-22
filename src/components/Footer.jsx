import React from 'react';
import { BhutanPattern } from './BhutanPattern';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 text-stone-300">
      
      {/* Footer Top Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        
        {/* Copyright & Developer Credit */}
        <div className="text-center sm:text-left">
          <span>© 2026 Jigme Real Estate. All Rights Reserved.</span>
          <span className="hidden sm:inline mx-2 text-stone-600">|</span>
          <span className="text-amber-400 font-semibold">Author & Developer: Adarsh</span>
          <span className="hidden sm:inline mx-2 text-stone-600">|</span>
          <span className="text-stone-400">Powered by <strong className="text-stone-200">Infinity Innovation</strong></span>
        </div>

        {/* Social Icons */}
        <div className="flex items-center space-x-3">
          <a
            href="#facebook"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#9e1b27] text-white flex items-center justify-center transition-colors"
            aria-label="Facebook"
          >
            <span className="font-bold text-xs">f</span>
          </a>
          <a
            href="#instagram"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#9e1b27] text-white flex items-center justify-center transition-colors"
            aria-label="Instagram"
          >
            <span className="font-bold text-xs">📷</span>
          </a>
          <a
            href="#linkedin"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#9e1b27] text-white flex items-center justify-center transition-colors"
            aria-label="LinkedIn"
          >
            <span className="font-bold text-xs">in</span>
          </a>
        </div>

      </div>

      {/* Authentic Colorful Bhutanese Textile Ribbon at the very bottom */}
      <BhutanPattern className="h-3.5 w-full" />

    </footer>
  );
};
