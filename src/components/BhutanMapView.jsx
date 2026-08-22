import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BhutanKnot } from './BhutanKnot';
import { MapPin, Home, Car, Sparkles, X, ArrowRight, CheckCircle2 } from 'lucide-react';

export const BhutanMapView = () => {
  const { properties, vehicles, openDetail, formatCurrency } = useApp();
  const [selectedDzongkhag, setSelectedDzongkhag] = useState('Thimphu');

  // Dzongkhag Locations on Bhutan Map Grid
  const dzongkhagMap = [
    { name: 'Haa', x: '18%', y: '52%', propertiesCount: 4, vehiclesCount: 2, desc: 'Highland valley & pristine farmhouses' },
    { name: 'Paro', x: '26%', y: '48%', propertiesCount: 18, vehiclesCount: 8, desc: 'International Airport hub & luxury resorts' },
    { name: 'Thimphu', x: '34%', y: '44%', propertiesCount: 65, vehiclesCount: 32, desc: 'Capital city • prime commercial & luxury villas' },
    { name: 'Punakha', x: '44%', y: '42%', propertiesCount: 22, vehiclesCount: 6, desc: 'Warm fertile valley & riverfront land' },
    { name: 'Wangdue Phodrang', x: '50%', y: '48%', propertiesCount: 12, vehiclesCount: 5, desc: 'Agricultural land & expanding townships' },
    { name: 'Chukha (Phuentsholing)', x: '28%', y: '78%', propertiesCount: 35, vehiclesCount: 24, desc: 'Bhutan’s primary southern trade gateway' },
    { name: 'Trongsa', x: '58%', y: '52%', propertiesCount: 6, vehiclesCount: 3, desc: 'Historic central fortress & ancestral estates' },
    { name: 'Bumthang', x: '68%', y: '40%', propertiesCount: 14, vehiclesCount: 7, desc: 'Spiritual heartland & Swiss valley chalets' },
    { name: 'Trashigang', x: '88%', y: '48%', propertiesCount: 8, vehiclesCount: 4, desc: 'Eastern commercial hub & hillside plots' },
    { name: 'Gelephu (Sarpang)', x: '54%', y: '82%', propertiesCount: 42, vehiclesCount: 16, desc: 'Special Administrative Region (SAR) Mindful City' },
    { name: 'Samdrup Jongkhar', x: '86%', y: '80%', propertiesCount: 15, vehiclesCount: 9, desc: 'Eastern border trading center' },
    { name: 'Mongar', x: '78%', y: '54%', propertiesCount: 7, vehiclesCount: 3, desc: 'Eastern mountain regional center' }
  ];

  const currentDzongkhagData = dzongkhagMap.find(d => d.name === selectedDzongkhag) || dzongkhagMap[2];
  const matchingProperties = properties.filter(p => p.location.toLowerCase().includes(selectedDzongkhag.toLowerCase().split(' ')[0]));

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-4 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden my-8">
      
      {/* Background Gradient & Watermark */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none"></div>
      <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
        <BhutanKnot className="w-80 h-80" color="#ef4444" secondaryColor="#f59e0b" />
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[11px] font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Geographic Explorer</span>
          </div>
          <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
            Explore Bhutan Dzongkhags & Regions
          </h3>
          <p className="text-xs sm:text-sm text-stone-300">
            Click any Dzongkhag to view verified valley listings and real-time asking prices.
          </p>
        </div>

        {/* Selected Dzongkhag Pill Badge */}
        <div className="flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-2xl backdrop-blur-md">
          <MapPin className="w-4 h-4 text-[#ef4444]" />
          <div>
            <div className="font-bold text-xs text-white">{selectedDzongkhag} Dzongkhag</div>
            <div className="text-[10px] text-amber-300">{currentDzongkhagData.propertiesCount} Properties • {currentDzongkhagData.vehiclesCount} Vehicles</div>
          </div>
        </div>
      </div>

      {/* Visual Interactive Map Canvas Area */}
      <div className="relative w-full h-[320px] sm:h-[400px] bg-slate-950/80 rounded-2xl border border-white/10 overflow-hidden mb-6 flex items-center justify-center p-4">
        
        {/* Himalayan Mountain Ridge Silhouette Graphic */}
        <svg className="absolute inset-0 w-full h-full opacity-25 pointer-events-none" viewBox="0 0 1000 500" fill="none">
          <path d="M0,450 Q200,200 400,350 T800,220 T1000,450 L1000,500 L0,500 Z" fill="#9e1b27" />
          <path d="M0,400 Q300,100 600,280 T1000,180 L1000,500 L0,500 Z" fill="#d97706" opacity="0.4" />
        </svg>

        {/* Interactive Dzongkhag Map Pins */}
        {dzongkhagMap.map((dz, idx) => {
          const isSelected = selectedDzongkhag === dz.name;
          return (
            <button
              key={idx}
              onClick={() => setSelectedDzongkhag(dz.name)}
              style={{ left: dz.x, top: dz.y }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-all duration-300 ${
                isSelected ? 'scale-125 z-30' : 'hover:scale-115 z-20 opacity-85 hover:opacity-100'
              }`}
            >
              <div className="relative flex flex-col items-center">
                {/* Pin Icon with Glow */}
                <div className={`p-1.5 sm:p-2 rounded-full border shadow-lg transition-all ${
                  isSelected 
                    ? 'bg-[#ef4444] border-amber-300 shadow-[#ef4444]/60 animate-bounce' 
                    : 'bg-slate-800 border-white/40 group-hover:bg-amber-600'
                }`}>
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white stroke-[2.5]" />
                </div>

                {/* Pin Label */}
                <span className={`text-[10px] sm:text-xs font-extrabold px-2 py-0.5 rounded-full mt-1 whitespace-nowrap shadow transition-all ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 font-black scale-105'
                    : 'bg-black/80 text-stone-200 border border-white/20 group-hover:bg-white group-hover:text-slate-900'
                }`}>
                  {dz.name}
                </span>
              </div>
            </button>
          );
        })}

        {/* Legend */}
        <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[10px] text-stone-300 flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#ef4444]"></span>
            <span>Selected Region</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>High Density Area</span>
          </div>
        </div>

      </div>

      {/* Selected Dzongkhag Listings Strip */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm text-white flex items-center gap-2">
            <span>Available Listings in {selectedDzongkhag}</span>
            <span className="text-xs text-amber-300">({matchingProperties.length > 0 ? matchingProperties.length : 2} verified)</span>
          </h4>
          <span className="text-xs text-stone-400">{currentDzongkhagData.desc}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {(matchingProperties.length > 0 ? matchingProperties : properties.slice(0, 2)).map((p) => (
            <div
              key={p.id}
              onClick={() => openDetail(p, 'property')}
              className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/80 hover:bg-white/10 transition-all cursor-pointer flex items-center gap-3 group"
            >
              <img src={p.image} alt={p.title} className="w-16 h-14 rounded-xl object-cover group-hover:scale-105 transition-transform" />
              <div className="overflow-hidden">
                <h5 className="font-bold text-xs text-white truncate">{p.title}</h5>
                <p className="text-[10px] text-stone-400 truncate">{p.location}</p>
                <div className="text-xs font-extrabold text-amber-400 mt-0.5">
                  {formatCurrency(p.priceNu, p.priceDisplay.includes('/month') ? '/mo' : '')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
