import React from 'react';
import { useApp } from '../context/AppContext';
import { BhutanKnot } from './BhutanKnot';
import { 
  PROPERTY_TYPES, 
  CATEGORIES, 
  BUDGET_RANGES, 
  POPULAR_SEARCHES, 
  DZONGKHAGS 
} from '../data/bhutanData';
import { MapPin, Search, Home, Car, ChevronDown } from 'lucide-react';

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

  return (
    <section className="relative min-h-[580px] sm:min-h-[640px] flex flex-col justify-center overflow-hidden bg-slate-900 text-white">
      
      {/* Background Image: Punakha Dzong & Mountains matching reference image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2400&q=90"
          alt="Bhutan Dzong Fortress and Himalayan Mountains"
          className="w-full h-full object-cover object-[70%_center] lg:object-right opacity-90"
        />
        {/* Soft Left Gradient Overlay to keep text legible */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>
      </div>

      {/* Auspicious Endless Knot Watermark in the sky */}
      <div className="absolute left-1/3 top-10 opacity-20 pointer-events-none transform -rotate-12">
        <BhutanKnot className="w-96 h-96" color="#ffffff" secondaryColor="#f59e0b" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pt-16 pb-20 w-full">
        
        {/* Headline & Subtitle */}
        <div className="max-w-2xl text-left mb-8">
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-4 drop-shadow-md">
            Find. Connect. <br />
            Own in <span className="text-[#b91c1c] font-black">Bhutan</span>
          </h1>
          <p className="text-base sm:text-lg text-stone-200 font-normal leading-relaxed max-w-xl drop-shadow">
            Buy, sell or rent properties and vehicles across the Kingdom of Bhutan.
          </p>
        </div>

        {/* Floating Search Container */}
        <div className="max-w-5xl">
          
          {/* Top Category Switcher Tabs */}
          <div className="flex items-center gap-1 mb-0">
            {/* 1 All Tab */}
            <button
              onClick={() => setSearchTab('all')}
              className={`px-5 py-2 rounded-t-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                searchTab === 'all'
                  ? 'bg-[#9e1b27] text-white shadow-md'
                  : 'bg-white/80 hover:bg-white text-slate-700 backdrop-blur-md'
              }`}
            >
              <span className="text-[10px] opacity-75">1</span>
              <span>All</span>
            </button>

            {/* Properties Tab */}
            <button
              onClick={() => setSearchTab('properties')}
              className={`px-5 py-2 rounded-t-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                searchTab === 'properties'
                  ? 'bg-[#9e1b27] text-white shadow-md'
                  : 'bg-white/80 hover:bg-white text-slate-700 backdrop-blur-md'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Properties</span>
            </button>

            {/* Vehicles Tab */}
            <button
              onClick={() => setSearchTab('vehicles')}
              className={`px-5 py-2 rounded-t-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                searchTab === 'vehicles'
                  ? 'bg-[#9e1b27] text-white shadow-md'
                  : 'bg-white/80 hover:bg-white text-slate-700 backdrop-blur-md'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>Vehicles</span>
            </button>
          </div>

          {/* Main White Search Bar Box */}
          <div className="bg-white rounded-b-2xl rounded-tr-2xl shadow-2xl p-3 sm:p-4 border border-stone-200/90 text-slate-900 flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
            
            {/* Field 1: Location */}
            <div className="flex-1 px-3 py-2 border-b lg:border-b-0 lg:border-r border-stone-200 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-rose-50 text-[#9e1b27] flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <label className="block text-[10px] uppercase font-bold text-slate-400">Location</label>
                <input
                  type="text"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder="City, Dzongkhag, Gewog..."
                  className="w-full text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
                />
              </div>
              <Search className="w-4 h-4 text-slate-400" />
            </div>

            {/* Field 2: Property Type */}
            <div className="flex-1 px-3 py-2 border-b lg:border-b-0 lg:border-r border-stone-200">
              <label className="block text-[10px] uppercase font-bold text-slate-400">Property Type</label>
              <div className="relative">
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full text-xs sm:text-sm font-semibold text-slate-800 bg-transparent focus:outline-none appearance-none pr-5 cursor-pointer"
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
                  className="w-full text-xs sm:text-sm font-semibold text-slate-800 bg-transparent focus:outline-none appearance-none pr-5 cursor-pointer"
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
                  className="w-full text-xs sm:text-sm font-semibold text-slate-800 bg-transparent focus:outline-none appearance-none pr-5 cursor-pointer"
                >
                  {BUDGET_RANGES.map((b, idx) => (
                    <option key={idx} value={b}>{b}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-0 top-1 pointer-events-none" />
              </div>
            </div>

            {/* Crimson Search Button */}
            <button
              onClick={handleSearch}
              className="px-7 py-3.5 rounded-xl bg-[#9e1b27] hover:bg-[#80131d] active:scale-95 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all flex-shrink-0 cursor-pointer"
            >
              <Search className="w-4 h-4 stroke-[2.5]" />
              <span>Search</span>
            </button>
          </div>

          {/* Popular Searches Quick Chips */}
          <div className="flex flex-wrap items-center gap-2 mt-4 text-xs">
            <span className="text-white font-bold drop-shadow">Popular Searches:</span>
            {POPULAR_SEARCHES.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handlePopularSearch(chip)}
                className="px-3 py-1 rounded-full bg-white/20 hover:bg-white hover:text-slate-900 text-white backdrop-blur-md border border-white/30 font-medium transition-all cursor-pointer shadow-xs"
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
