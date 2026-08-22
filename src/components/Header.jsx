import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BhutanPattern } from './BhutanPattern';
import { BhutanKnot } from './BhutanKnot';
import { 
  Phone, 
  MapPin, 
  ChevronDown, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Globe, 
  ShieldCheck, 
  Home, 
  Car, 
  LayoutDashboard,
  CheckCircle2
} from 'lucide-react';

export const Header = () => {
  const { 
    openRoleLogin, 
    openRoleDashboard,
    currentUser, 
    setCurrentUser, 
    currency, 
    setCurrency, 
    mobileMenuOpen, 
    setMobileMenuOpen, 
    showToast 
  } = useApp();

  const [currencyOpen, setCurrencyOpen] = useState(false);

  const handleLogout = () => {
    setCurrentUser(null);
    showToast('Signed out successfully', 'info');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      {/* 1. Authentic Colorful Bhutanese Textile Ribbon on Top */}
      <BhutanPattern className="h-2.5 sm:h-3 w-full" />

      {/* 2. Micro-bar: Phone, Location, Currency & Language */}
      <div className="bg-stone-50/80 border-b border-stone-200/60 py-1.5 px-3 sm:px-8 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Left Info */}
          <div className="flex items-center space-x-3 sm:space-x-6">
            <a 
              href="tel:+97517123456" 
              className="flex items-center gap-1.5 hover:text-[#9e1b27] font-semibold transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#9e1b27]" />
              <span>+975 17 123456</span>
            </a>

            <div className="hidden md:flex items-center gap-1.5 text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Norzin Lam, Thimphu, Bhutan</span>
            </div>
          </div>

          {/* Right Controls: Currency & Language */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setCurrencyOpen(!currencyOpen)}
                className="flex items-center gap-1 py-0.5 px-2 rounded-md bg-white border border-stone-200 text-slate-700 hover:border-amber-400 font-semibold transition-all text-[11px]"
              >
                <Globe className="w-3 h-3 text-amber-600" />
                <span>{currency === 'BTN' ? 'Nu. (BTN)' : currency === 'USD' ? '$ (USD)' : '₹ (INR)'}</span>
                <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
              </button>

              {currencyOpen && (
                <div 
                  className="absolute right-0 mt-1 w-32 bg-white rounded-xl shadow-xl border border-stone-200 py-1 z-50 text-xs animate-in fade-in zoom-in-95 duration-150"
                  onMouseLeave={() => setCurrencyOpen(false)}
                >
                  {[
                    { id: 'BTN', label: 'Nu. Bhutan' },
                    { id: 'USD', label: '$ US Dollar' },
                    { id: 'INR', label: '₹ Indian Rupee' }
                  ].map(c => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setCurrency(c.id);
                        setCurrencyOpen(false);
                        showToast(`Currency changed to ${c.label}`, 'info');
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-rose-50 hover:text-[#9e1b27] ${
                        currency === c.id ? 'font-bold text-[#9e1b27] bg-rose-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span>{c.label}</span>
                      {currency === c.id && <CheckCircle2 className="w-3.5 h-3.5 text-[#9e1b27]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-1 py-0.5 px-2 rounded-md bg-white border border-stone-200 text-slate-700 font-medium text-[11px] cursor-pointer hover:border-amber-400">
              <span>🇧🇹</span>
              <span>EN</span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 sm:py-3.5 flex items-center justify-between">
        
        {/* Brand Logo & Subtitle */}
        <div className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group">
          <div className="p-1 rounded-xl bg-amber-50/70 border border-amber-200/60 group-hover:border-amber-400 transition-colors">
            <BhutanKnot className="w-8 h-8 sm:w-10 sm:h-10" color="#9e1b27" secondaryColor="#d97706" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-display font-black text-xl sm:text-2xl text-[#9e1b27] tracking-tight">
                JIGME
              </span>
              <span className="font-display font-bold text-xs sm:text-base tracking-widest text-slate-900 uppercase">
                REAL ESTATE
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium tracking-tight mt-0.5">
              Your Trusted Property & Vehicle Partner in Bhutan
            </p>
          </div>
        </div>

        {/* Desktop Auth Controls */}
        <div className="hidden md:flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openRoleDashboard(currentUser.roleId || 'buyer')}
                className="flex items-center gap-2 bg-stone-100 hover:bg-stone-200 py-1.5 px-3 rounded-full text-xs font-bold text-slate-800 transition-colors cursor-pointer"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#9e1b27]" />
                <span>{currentUser.name} ({currentUser.role})</span>
              </button>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              {/* Login Button */}
              <button
                onClick={() => openRoleLogin(null, false)}
                className="px-5 py-2 rounded-xl border border-stone-300 hover:border-slate-800 text-xs font-bold text-slate-800 hover:bg-stone-50 transition-all cursor-pointer shadow-2xs"
              >
                Login
              </button>

              {/* Register Button with Crimson Glow */}
              <button
                onClick={() => openRoleLogin(null, true)}
                className="px-6 py-2 rounded-xl bg-[#9e1b27] hover:bg-[#80131d] active:scale-95 text-xs font-bold text-white shadow-md hover:shadow-lg shadow-[#9e1b27]/20 transition-all cursor-pointer"
              >
                Register
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl border border-stone-200 bg-stone-50 text-slate-700 hover:text-[#9e1b27] focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* 4. Mobile Slide-Over Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-4/5 max-w-sm h-full shadow-2xl p-5 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200 ml-auto">
            
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-5">
                <div className="flex items-center gap-2">
                  <BhutanKnot className="w-7 h-7" color="#9e1b27" secondaryColor="#d97706" />
                  <span className="font-display font-black text-lg text-[#9e1b27]">JIGME ESTATE</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Section */}
              {currentUser ? (
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 mb-4">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-full bg-rose-100 text-[#9e1b27] flex items-center justify-center font-bold text-xs">
                      {currentUser.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{currentUser.name}</h4>
                      <p className="text-[10px] text-slate-500">{currentUser.role}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openRoleDashboard(currentUser.roleId || 'buyer');
                    }}
                    className="w-full py-1.5 rounded-lg bg-white border border-stone-300 text-xs font-bold text-slate-700 hover:bg-stone-100 mb-2"
                  >
                    Open My Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full py-1.5 rounded-lg bg-red-50 text-xs font-bold text-red-700 hover:bg-red-100"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2.5 mb-5">
                  <button
                    onClick={() => openRoleLogin(null, false)}
                    className="py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-slate-800 text-center"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => openRoleLogin(null, true)}
                    className="py-2.5 rounded-xl bg-[#9e1b27] text-xs font-bold text-white text-center shadow"
                  >
                    Register
                  </button>
                </div>
              )}

              {/* Quick Role Portal Shortcuts */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1 mb-2">
                  Access Portal Roles
                </p>
                {[
                  { id: 'admin', label: '👑 Admin Control', desc: 'Platform & Users' },
                  { id: 'broker', label: '💼 Broker CRM', desc: 'Client Portfolio' },
                  { id: 'agent', label: '👤 Agent Listings', desc: 'Enquiries & Tours' },
                  { id: 'owner', label: '🏠 House Owner', desc: 'Post Property / Car' },
                  { id: 'buyer', label: '👥 Buyer & Tenant', desc: 'Saved & Bookings' }
                ].map(r => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openRoleLogin(r.id, false);
                    }}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-rose-50 text-xs flex items-center justify-between text-slate-700 hover:text-[#9e1b27] transition-colors"
                  >
                    <div>
                      <div className="font-bold">{r.label}</div>
                      <div className="text-[10px] text-slate-400">{r.desc}</div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* Drawer Bottom Info */}
            <div className="pt-4 border-t border-stone-100 text-[11px] text-slate-500 space-y-1">
              <div>📞 Helpline: +975 17 123456</div>
              <div>📍 Norzin Lam, Thimphu</div>
              <div className="text-[10px] text-slate-400 mt-2">© 2026 Jigme Real Estate Bhutan</div>
            </div>

          </div>
        </div>
      )}

    </header>
  );
};
