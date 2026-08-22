import React, { useState, useEffect } from 'react';
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
  CheckCircle2,
  Sparkles,
  ArrowRight,
  BarChart3,
  Search,
  Compass
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

  const [isScrolled, setIsScrolled] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
    showToast('Signed out successfully', 'info');
  };

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 600, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. INITIAL TOP NAVBAR (Ultra-Premium, Modern & Full-Width Luxury Layout) */}
      {/* ========================================================================= */}
      <header className={`w-full bg-white transition-all duration-300 ${isScrolled ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
        
        {/* Authentic Bhutanese Woven Textile Ribbon Top Border */}
        <BhutanPattern className="h-3 sm:h-3.5 w-full shadow-xs" />

        {/* Modern Frosted Micro-Bar: Contact, Location, Currency & Language */}
        <div className="bg-[#FAF8F5] border-b border-stone-200/80 py-2 px-4 sm:px-8 text-xs text-slate-600">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            
            {/* Left Contact & Location Info */}
            <div className="flex items-center space-x-3 sm:space-x-8">
              <a 
                href="tel:+97517123456" 
                className="flex items-center gap-2 hover:text-[#9e1b27] font-semibold transition-colors text-xs text-slate-700"
              >
                <div className="w-5 h-5 rounded-full bg-rose-100/80 flex items-center justify-center text-[#9e1b27]">
                  <Phone className="w-3 h-3" />
                </div>
                <span>+975 17 123456</span>
              </a>

              <div className="hidden md:flex items-center gap-2 text-slate-500 text-xs">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>Norzin Lam, Thimphu, Kingdom of Bhutan</span>
              </div>
            </div>

            {/* Right Controls: Currency & Language Switchers */}
            <div className="flex items-center space-x-3">
              {/* Currency Selector Pill */}
              <div className="relative">
                <button
                  onClick={() => setCurrencyOpen(!currencyOpen)}
                  className="flex items-center gap-1.5 py-1 px-3 rounded-full bg-white border border-stone-200/90 hover:border-amber-400 text-slate-700 font-bold transition-all text-xs cursor-pointer shadow-2xs"
                >
                  <Globe className="w-3.5 h-3.5 text-amber-600" />
                  <span>{currency === 'BTN' ? 'Nu. (BTN)' : currency === 'USD' ? '$ (USD)' : '₹ (INR)'}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {currencyOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-2xl border border-stone-200/90 py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150"
                    onMouseLeave={() => setCurrencyOpen(false)}
                  >
                    {[
                      { id: 'BTN', label: 'Nu. Bhutan Ngultrum' },
                      { id: 'USD', label: '$ US Dollar' },
                      { id: 'INR', label: '₹ Indian Rupee' }
                    ].map(c => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setCurrency(c.id);
                          setCurrencyOpen(false);
                          showToast(`Switched currency to ${c.label}`, 'info');
                        }}
                        className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-rose-50 hover:text-[#9e1b27] cursor-pointer transition-colors ${
                          currency === c.id ? 'font-bold text-[#9e1b27] bg-rose-50/60' : 'text-slate-700'
                        }`}
                      >
                        <span>{c.label}</span>
                        {currency === c.id && <CheckCircle2 className="w-3.5 h-3.5 text-[#9e1b27]" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Language Selector Pill */}
              <div className="flex items-center gap-1.5 py-1 px-3 rounded-full bg-white border border-stone-200/90 text-slate-800 font-bold text-xs shadow-2xs">
                <span>🇧🇹</span>
                <span>EN</span>
              </div>
            </div>

          </div>
        </div>

        {/* Main Navbar: Logo + Desktop Links + Auth Actions */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
          
          {/* Brand Logo & Royal Title */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <div className="p-1.5 rounded-2xl bg-amber-50 border border-amber-200 group-hover:border-amber-400 group-hover:scale-105 transition-all shadow-2xs">
              <BhutanKnot className="w-9 h-9 sm:w-10 sm:h-10" color="#9e1b27" secondaryColor="#d97706" />
            </div>
            <div>
              <div className="flex items-center gap-2 leading-none">
                <span className="font-display font-black text-2xl sm:text-3xl text-[#9e1b27] tracking-tight">
                  JIGME
                </span>
                <span className="font-display font-extrabold text-sm sm:text-lg tracking-widest text-slate-900 uppercase">
                  REAL ESTATE
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium tracking-tight mt-1 hidden sm:block">
                Kingdom of Bhutan's Premier Certified Marketplace
              </p>
            </div>
          </div>

          {/* Center Navigation Links for Modern Desktop UI */}
          <nav className="hidden lg:flex items-center space-x-1 font-semibold text-sm text-slate-700">
            <button
              onClick={() => scrollToSection('properties-section')}
              className="px-4 py-2 rounded-full hover:text-[#9e1b27] hover:bg-stone-50 transition-all cursor-pointer"
            >
              Properties
            </button>
            <button
              onClick={() => scrollToSection('vehicles-section')}
              className="px-4 py-2 rounded-full hover:text-[#9e1b27] hover:bg-stone-50 transition-all cursor-pointer"
            >
              Vehicles
            </button>
            <button
              onClick={() => scrollToSection('trust-section')}
              className="px-4 py-2 rounded-full hover:text-[#9e1b27] hover:bg-stone-50 transition-all cursor-pointer"
            >
              Why Jigme Estate
            </button>
            <button
              onClick={() => scrollToSection('stats-section')}
              className="px-4 py-2 rounded-full hover:text-[#9e1b27] hover:bg-stone-50 transition-all cursor-pointer"
            >
              Market Insights
            </button>
          </nav>

          {/* Desktop Auth Controls */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2 bg-stone-100 hover:bg-stone-200 py-2 px-4 rounded-full text-xs font-bold text-slate-800 transition-colors">
                <button
                  onClick={() => openRoleDashboard(currentUser.roleId || 'buyer')}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <LayoutDashboard className="w-4 h-4 text-[#9e1b27]" />
                  <span>{currentUser.name} ({currentUser.role})</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="p-1 rounded-full text-slate-400 hover:text-red-600 transition-colors cursor-pointer ml-1"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => openRoleLogin(null, false)}
                  className="px-6 py-2.5 rounded-xl border border-stone-300 hover:border-slate-800 text-xs font-bold text-slate-800 hover:bg-stone-50 transition-all cursor-pointer shadow-2xs"
                >
                  Login
                </button>
                <button
                  onClick={() => openRoleLogin(null, true)}
                  className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-[#9e1b27] to-[#80131d] hover:from-[#b91c1c] hover:to-[#9e1b27] active:scale-95 text-xs font-bold text-white shadow-md hover:shadow-xl shadow-[#9e1b27]/30 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Register</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2.5 rounded-2xl border border-stone-200 bg-stone-50 text-slate-800 hover:text-[#9e1b27] focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

        </div>

      </header>

      {/* ========================================================================= */}
      {/* 2. ENLARGED FLOATING GLASS CAPSULE NAVBAR (High-Visibility & Sharp Contrast) */}
      {/* ========================================================================= */}
      <div 
        className={`fixed top-3 sm:top-4 left-0 right-0 z-50 px-3 sm:px-6 transition-all duration-500 ease-out pointer-events-none ${
          isScrolled ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-8'
        }`}
      >
        <div className="max-w-6xl mx-auto rounded-full bg-white/95 backdrop-blur-2xl border border-white/90 shadow-[0_16px_50px_rgba(0,0,0,0.15)] py-2.5 sm:py-3 px-5 sm:px-8 flex items-center justify-between transition-all">
          
          {/* Logo inside Floating Capsule */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 cursor-pointer group flex-shrink-0"
          >
            <div className="p-1 rounded-full bg-amber-50 border border-amber-200 group-hover:scale-105 transition-transform">
              <BhutanKnot className="w-7 h-7 sm:w-8 sm:h-8" color="#9e1b27" secondaryColor="#d97706" />
            </div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-display font-black text-base sm:text-lg text-[#9e1b27] tracking-tight">JIGME</span>
              <span className="font-display font-bold text-xs sm:text-sm tracking-wider text-slate-900 uppercase">ESTATE</span>
            </div>
          </div>

          {/* Capsule Center Navigation - Sharp, Clear & High Visibility */}
          <nav className="hidden md:flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm font-bold text-slate-800">
            <button 
              onClick={() => scrollToSection('properties-section')}
              className="px-3.5 sm:px-4 py-2 rounded-full hover:bg-rose-50 hover:text-[#9e1b27] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5 text-[#9e1b27]" />
              <span>Properties</span>
            </button>
            <button 
              onClick={() => scrollToSection('vehicles-section')}
              className="px-3.5 sm:px-4 py-2 rounded-full hover:bg-amber-50 hover:text-amber-800 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Car className="w-3.5 h-3.5 text-amber-600" />
              <span>Vehicles</span>
            </button>
            <button 
              onClick={() => scrollToSection('trust-section')}
              className="px-3.5 sm:px-4 py-2 rounded-full hover:bg-emerald-50 hover:text-emerald-800 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Why Us</span>
            </button>
            <button 
              onClick={() => scrollToSection('stats-section')}
              className="px-3.5 sm:px-4 py-2 rounded-full hover:bg-blue-50 hover:text-blue-800 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
              <span>Insights</span>
            </button>
          </nav>

          {/* Capsule Right Auth Actions */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-2 bg-stone-100 py-1.5 px-3.5 rounded-full text-xs font-bold text-slate-800">
                <button
                  onClick={() => openRoleDashboard(currentUser.roleId || 'buyer')}
                  className="flex items-center gap-1.5 cursor-pointer text-xs"
                >
                  <LayoutDashboard className="w-4 h-4 text-[#9e1b27]" />
                  <span className="max-w-[110px] truncate">{currentUser.name}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openRoleLogin(null, false)}
                  className="px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold text-slate-800 hover:text-slate-950 hover:bg-stone-100 transition-all cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={() => openRoleLogin(null, true)}
                  className="px-5 sm:px-6 py-2 rounded-full bg-gradient-to-r from-[#9e1b27] to-[#80131d] hover:from-[#b91c1c] hover:to-[#9e1b27] text-xs sm:text-sm font-bold text-white shadow-md shadow-[#9e1b27]/35 hover:shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Register</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                </button>
              </div>
            )}

            {/* Mobile Hamburger on Floating Capsule */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-full bg-stone-100 text-slate-800 hover:text-[#9e1b27] cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. FULLSCREEN PRODUCTION-GRADE MOBILE DRAWER */}
      {/* ========================================================================= */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[99999] bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="fixed right-0 top-0 bottom-0 w-[85%] max-w-sm h-full bg-white shadow-2xl p-5 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-250 z-[100000]"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Drawer Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="p-1 rounded-full bg-amber-50 border border-amber-200">
                    <BhutanKnot className="w-6 h-6" color="#9e1b27" secondaryColor="#d97706" />
                  </div>
                  <div>
                    <span className="font-display font-black text-lg text-[#9e1b27]">JIGME ESTATE</span>
                    <p className="text-[10px] text-slate-400">Kingdom of Bhutan</p>
                  </div>
                </div>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Authenticated User Session View */}
              {currentUser ? (
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 mb-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#9e1b27] to-amber-600 text-white flex items-center justify-center font-bold text-sm shadow">
                      {currentUser.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{currentUser.name}</h4>
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                        {currentUser.role}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openRoleDashboard(currentUser.roleId || 'buyer');
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#9e1b27] text-white text-xs font-bold shadow cursor-pointer"
                  >
                    Open My Dashboard Portal
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full py-2 rounded-xl bg-white border border-stone-300 text-xs font-bold text-red-600 hover:bg-red-50 cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2.5 mb-6">
                  <button
                    onClick={() => openRoleLogin(null, false)}
                    className="py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-slate-800 text-center hover:bg-stone-50 cursor-pointer"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => openRoleLogin(null, true)}
                    className="py-2.5 rounded-xl bg-[#9e1b27] text-xs font-bold text-white text-center shadow cursor-pointer"
                  >
                    Register
                  </button>
                </div>
              )}

              {/* Clean Public Navigation Links (Production-Grade Real Estate Experience) */}
              <div className="space-y-1.5 mb-6">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-1 mb-2">
                  Browse Marketplace
                </p>

                <button
                  onClick={() => scrollToSection('properties-section')}
                  className="w-full text-left p-3 rounded-xl hover:bg-stone-50 text-xs flex items-center justify-between text-slate-700 hover:text-[#9e1b27] font-semibold transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Home className="w-4 h-4 text-[#9e1b27]" />
                    <span>Verified Properties for Sale & Rent</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  onClick={() => scrollToSection('vehicles-section')}
                  className="w-full text-left p-3 rounded-xl hover:bg-stone-50 text-xs flex items-center justify-between text-slate-700 hover:text-[#9e1b27] font-semibold transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Car className="w-4 h-4 text-amber-600" />
                    <span>Quality Vehicles & 4x4 Inventory</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  onClick={() => scrollToSection('trust-section')}
                  className="w-full text-left p-3 rounded-xl hover:bg-stone-50 text-xs flex items-center justify-between text-slate-700 hover:text-[#9e1b27] font-semibold transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Why Choose Jigme Real Estate</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  onClick={() => scrollToSection('stats-section')}
                  className="w-full text-left p-3 rounded-xl hover:bg-stone-50 text-xs flex items-center justify-between text-slate-700 hover:text-[#9e1b27] font-semibold transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                    <span>Market Overview & Statistics</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>

              {/* Portal Access CTA for registered users/owners */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                <h5 className="font-bold text-xs text-amber-900 mb-1">
                  Are you an Owner, Agent, or Broker?
                </h5>
                <p className="text-[11px] text-amber-800/80 mb-2.5 leading-relaxed">
                  Sign in with your authorized role to manage listings, leads, and client portfolios.
                </p>
                <button
                  onClick={() => openRoleLogin('owner', false)}
                  className="w-full py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  Access Role Workspace
                </button>
              </div>

            </div>

            {/* Drawer Bottom Info */}
            <div className="pt-5 border-t border-stone-100 text-xs text-slate-500 space-y-1.5">
              <a href="tel:+97517123456" className="flex items-center gap-2 font-semibold text-slate-800 hover:text-[#9e1b27]">
                <Phone className="w-3.5 h-3.5 text-[#9e1b27]" />
                <span>+975 17 123456 (24/7 Support)</span>
              </a>
              <div className="text-[11px] text-slate-400">📍 Norzin Lam, Thimphu, Kingdom of Bhutan</div>
              <div className="text-[10px] text-stone-400 mt-2">© 2026 Jigme Real Estate Bhutan</div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
