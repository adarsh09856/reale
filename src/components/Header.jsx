import React from 'react';
import { useApp } from '../context/AppContext';
import { BhutanPattern } from './BhutanPattern';
import { BhutanKnot } from './BhutanKnot';
import { Phone, MapPin, Globe, ChevronDown, User, LogOut } from 'lucide-react';

export const Header = () => {
  const { openRoleLogin, currentUser, setCurrentUser, showToast } = useApp();

  const handleLogout = () => {
    setCurrentUser(null);
    showToast('Signed out successfully', 'info');
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-stone-200/90">
      {/* Authentic Colorful Bhutanese Textile Ribbon */}
      <BhutanPattern className="h-3 w-full" />

      {/* Micro-bar: Phone, Location, Language */}
      <div className="bg-white border-b border-stone-100 py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center space-x-6">
            <a 
              href="tel:+97517123456" 
              className="flex items-center gap-1.5 hover:text-[#9e1b27] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-medium">+975 17 123456</span>
            </a>

            <div className="hidden sm:flex items-center gap-1.5 text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>Norzin Lam, Thimphu</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="flex items-center gap-1.5 py-0.5 px-2 rounded hover:bg-stone-100 cursor-pointer text-slate-700 font-medium">
              <span className="text-sm">🇧🇹</span>
              <span>EN</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Brand Logo & Subtitle */}
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="p-1">
            <BhutanKnot className="w-9 h-9" color="#9e1b27" secondaryColor="#d97706" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-display font-black text-2xl text-[#9e1b27] tracking-tight">
                JIGME
              </span>
              <span className="font-display font-bold text-base tracking-widest text-slate-900 uppercase">
                REAL ESTATE
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium tracking-tight mt-0.5">
              Your Trusted Property & Vehicle Partner in Bhutan
            </p>
          </div>
        </div>

        {/* Right Auth Buttons */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-stone-100 py-1.5 px-3 rounded-full text-xs font-semibold text-slate-800">
                <User className="w-3.5 h-3.5 text-[#9e1b27]" />
                <span>{currentUser.name} ({currentUser.role})</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs text-red-600 hover:text-red-800 font-bold px-2 py-1"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              {/* Login Outlined Button */}
              <button
                onClick={() => openRoleLogin(null, false)}
                className="px-5 py-2 rounded-lg border border-stone-300 hover:border-slate-800 text-xs font-bold text-slate-800 hover:bg-stone-50 transition-all cursor-pointer shadow-2xs"
              >
                Login
              </button>

              {/* Register Solid Crimson Button */}
              <button
                onClick={() => openRoleLogin(null, true)}
                className="px-5 py-2 rounded-lg bg-[#9e1b27] hover:bg-[#80131d] active:scale-95 text-xs font-bold text-white shadow-sm transition-all cursor-pointer"
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
