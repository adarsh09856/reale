import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BhutanKnot } from './BhutanKnot';
import { 
  PROPERTY_TYPES, 
  CATEGORIES, 
  BUDGET_RANGES, 
  POPULAR_SEARCHES, 
  DZONGKHAGS 
} from '../data/bhutanData';
import { MapPin, Search, Home, Car, ChevronDown, Check, Sparkles } from 'lucide-react';

export const HeroSearchSection = () => {
  const {
    searchTab,
    setSearchTab,
    searchLocation,
    setSearchLocation,
    propertyType,
    setPropertyType,
    category,
    setCategory,
    budget,
    setBudget,
    handleSearch,
    handlePopularSearch
  } = useApp();

  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);

  return (
    <section className="relative min-h-[600px] sm:min-h-[660px] lg:min-h-[720px] flex flex-col justify-center overflow-hidden bg-[#0a0f1d] text-white">
      
      {/* 1. Background Image: Punakha Dzong & Himalayas */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2400&q=90"
          alt="Bhutan Dzong Fortress and Himalayan Mountains"
          className="w-full h-full object-cover object-[72%_center] lg:object-right opacity-85 sm:opacity-90"
        />
        {/* Soft Left & Bottom Gradient Overlays for High Contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f1d]/95 via-[#0a0f1d]/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1d] via-transparent to-black/30"></div>
      </div>

      {/* 2. Auspicious Endless Knot Decorative Watermark in the sky */}
      <div className="absolute left-1/4 sm:left-1/3 top-8 opacity-15 pointer-events-none transform -rotate-12">
        <BhutanKnot className="w-80 h-80 sm:w-96 sm:h-96" color="#ffffff" secondaryColor="#f59e0b" />
      </div>

      {/* 3. Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-16 sm:pb-24 w-full">
        
        {/* Headline & Subtitle */}
        <div className="max-w-2xl text-left mb-8 sm:mb-10">
          
          {/* Subtle Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-amber-500/30 backdrop-blur-md mb-4 sm:mb-5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] font-semibold tracking-wider uppercase text-amber-300">
              Bhutan's Premier Real Estate & Vehicle Network
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.12] mb-4 sm:mb-5 drop-shadow-xl">
            Find. Connect. <br />
            Own in <span className="text-[#b91c1c] sm:text-[#ef4444] font-black underline decoration-amber-500/40 underline-offset-8">Bhutan</span>
          </h1>

          <p className="text-sm sm:text-lg text-stone-200 font-normal leading-relaxed max-w-xl drop-shadow">
            Buy, sell or rent verified properties and quality vehicles across the Kingdom of Bhutan.
          </p>
        </div>

        {/* Floating Search Container */}
        <div className="max-w-5xl">
          
          {/* Top Category Switcher Tabs */}
          <div className="flex items-center gap-1.5 mb-0">
            {/* 1 All Tab */}
            <button
              onClick={() => setSearchTab('all')}
              className={`px-4 sm:px-6 py-2.5 rounded-t-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                searchTab === 'all'
                  ? 'bg-white text-slate-900 shadow-lg'
                  : 'bg-black/40 hover:bg-black/60 text-stone-200 backdrop-blur-md border-t border-x border-white/10'
              }`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${searchTab === 'all' ? 'bg-[#9e1b27] text-white' : 'bg-white/20'}`}>1</span>
              <span>All</span>
            </button>

            {/* Properties Tab */}
            <button
              onClick={() => setSearchTab('properties')}
              className={`px-4 sm:px-6 py-2.5 rounded-t-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                searchTab === 'properties'
                  ? 'bg-white text-slate-900 shadow-lg'
                  : 'bg-black/40 hover:bg-black/60 text-stone-200 backdrop-blur-md border-t border-x border-white/10'
              }`}
            >
              <Home className="w-4 h-4 text-[#9e1b27]" />
              <span>Properties</span>
            </button>

            {/* Vehicles Tab */}
            <button
              onClick={() => setSearchTab('vehicles')}
              className={`px-4 sm:px-6 py-2.5 rounded-t-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                searchTab === 'vehicles'
                  ? 'bg-white text-slate-900 shadow-lg'
                  : 'bg-black/40 hover:bg-black/60 text-stone-200 backdrop-blur-md border-t border-x border-white/10'
              }`}
            >
              <Car className="w-4 h-4 text-[#9e1b27]" />
              <span>Vehicles</span>
            </button>
          </div>

          {/* Main White Glassmorphic Search Bar Box */}
          <div className="bg-white rounded-b-2xl rounded-tr-2xl shadow-2xl p-3 sm:p-4 border border-stone-200/90 text-slate-900 flex flex-col lg:flex-row items-stretch lg:items-center gap-2.5 sm:gap-3">
            
            {/* Field 1: Location */}
            <div className="relative flex-1 px-3 py-2 border-b lg:border-b-0 lg:border-r border-stone-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-rose-50 text-[#9e1b27] flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] uppercase font-bold text-slate-400">Location</label>
                  <input
                    type="text"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    onFocus={() => setLocationDropdownOpen(true)}
                    placeholder="City, Dzongkhag, Gewog..."
                    className="w-full text-xs sm:text-sm font-bold text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Location Dzongkhag Picker Dropdown */}
              {locationDropdownOpen && (
                <div 
                  className="absolute left-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-stone-200 p-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150"
                  onMouseLeave={() => setLocationDropdownOpen(false)}
                >
                  <div className="p-2 border-b border-stone-100 font-bold text-slate-400 uppercase text-[10px]">
                    Select Bhutan Dzongkhag
                  </div>
                  <div className="max-h-56 overflow-y-auto py-1 space-y-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        setSearchLocation('');
                        setLocationDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors ${
                        searchLocation === '' ? 'bg-rose-50 text-[#9e1b27] font-bold' : 'text-slate-700 hover:bg-stone-50'
                      }`}
                    >
                      <span>All Bhutan (20 Dzongkhags)</span>
                      {searchLocation === '' && <Check className="w-3.5 h-3.5 text-[#9e1b27]" />}
                    </button>
                    {DZONGKHAGS.map((dz, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSearchLocation(dz);
                          setLocationDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                          searchLocation === dz ? 'bg-rose-50 text-[#9e1b27] font-bold' : 'text-slate-700 hover:bg-stone-50'
                        }`}
                      >
                        <span>{dz}</span>
                        {searchLocation === dz && <Check className="w-3.5 h-3.5 text-[#9e1b27]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Field 2: Property Type */}
            <div className="flex-1 px-3 py-2 border-b lg:border-b-0 lg:border-r border-stone-200">
              <label className="block text-[10px] uppercase font-bold text-slate-400">Property Type</label>
              <div className="relative">
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full text-xs sm:text-sm font-bold text-slate-800 bg-transparent focus:outline-none appearance-none pr-5 cursor-pointer"
                >
                  {PROPERTY_TYPES.map((t, idx) => (
                    <option key={idx} value={t}>{t}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-0 top-1 pointer-events-none" />
              </div>
            </div>

            {/* Field 3: Category */}
            <div className="flex-1 px-3 py-2 border-b lg:border-b-0 lg:border-r border-stone-200">
              <label className="block text-[10px] uppercase font-bold text-slate-400">Category</label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs sm:text-sm font-bold text-slate-800 bg-transparent focus:outline-none appearance-none pr-5 cursor-pointer"
                >
                  {CATEGORIES.map((c, idx) => (
                    <option key={idx} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-0 top-1 pointer-events-none" />
              </div>
            </div>

            {/* Field 4: Budget */}
            <div className="flex-1 px-3 py-2">
              <label className="block text-[10px] uppercase font-bold text-slate-400">Budget</label>
              <div className="relative">
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full text-xs sm:text-sm font-bold text-slate-800 bg-transparent focus:outline-none appearance-none pr-5 cursor-pointer"
                >
                  {BUDGET_RANGES.map((b, idx) => (
                    <option key={idx} value={b}>{b}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-0 top-1 pointer-events-none" />
              </div>
            </div>

            {/* Crimson Search Action Button */}
            <button
              onClick={handleSearch}
              className="px-8 py-3.5 rounded-xl bg-[#9e1b27] hover:bg-[#80131d] active:scale-95 text-white font-bold text-sm shadow-md hover:shadow-lg shadow-[#9e1b27]/30 flex items-center justify-center gap-2 transition-all flex-shrink-0 cursor-pointer"
            >
              <Search className="w-4 h-4 stroke-[2.5]" />
              <span>Search</span>
            </button>
          </div>

          {/* Popular Searches Quick Chips */}
          <div className="flex flex-wrap items-center gap-2 mt-4 text-xs">
            <span className="text-white font-bold drop-shadow flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Popular Searches:</span>
            </span>
            {POPULAR_SEARCHES.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handlePopularSearch(chip)}
                className="px-3 py-1 rounded-full bg-white/15 hover:bg-white hover:text-slate-900 text-white backdrop-blur-md border border-white/20 font-semibold transition-all cursor-pointer shadow-xs active:scale-95 text-[11px] sm:text-xs"
              >
                {chip}
              </button>
            ))}
          </div>

        </div>

      </div>

    </section>
  );
};
