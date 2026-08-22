import React from 'react';
import { useApp } from '../context/AppContext';
import { BhutanKnot } from './BhutanKnot';
import { 
  X, 
  Trash2, 
  Check, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  Fuel, 
  Gauge, 
  Settings, 
  ShieldCheck, 
  ArrowRight,
  Flame,
  Scale
} from 'lucide-react';

export const CompareDrawer = () => {
  const { 
    compareList, 
    toggleCompare, 
    clearCompare, 
    compareModalOpen, 
    setCompareModalOpen, 
    openDetail, 
    formatCurrency 
  } = useApp();

  if (compareList.length === 0) return null;

  return (
    <>
      {/* Floating Bottom Comparison Capsule Trigger */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-in fade-in slide-in-from-bottom-6 duration-300">
        <div className="bg-[#0f172a]/95 backdrop-blur-xl text-white px-5 py-3 rounded-full border border-amber-500/40 shadow-2xl flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold">
              Comparing <strong className="text-amber-400">{compareList.length}</strong> {compareList.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCompareModalOpen(true)}
              className="px-4 py-1.5 rounded-full bg-[#9e1b27] hover:bg-[#80131d] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Compare Now ⤢
            </button>

            <button
              onClick={clearCompare}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Clear comparison"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Full Comparison Modal Dialog */}
      {compareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-stone-200 flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Top Modal Bar */}
            <div className="bg-[#0f172a] text-white p-5 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                  <BhutanKnot className="w-7 h-7" color="#ef4444" secondaryColor="#f59e0b" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-white">Side-by-Side Comparison</h3>
                  <p className="text-xs text-stone-400">Review verified specifications, pricing, and Bhutanese architectural features</p>
                </div>
              </div>

              <button
                onClick={() => setCompareModalOpen(false)}
                className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comparison Matrix Table */}
            <div className="p-6 overflow-y-auto overflow-x-auto flex-1 text-xs">
              <div className={`grid grid-cols-${compareList.length + 1} gap-4 min-w-[600px]`}>
                
                {/* Labels Column */}
                <div className="space-y-6 pt-2 font-bold text-slate-400 uppercase text-[10px]">
                  <div className="h-44 flex items-end pb-2">Preview</div>
                  <div className="h-10 flex items-center border-t border-stone-100">Asking Price</div>
                  <div className="h-10 flex items-center border-t border-stone-100">Dzongkhag / Region</div>
                  <div className="h-10 flex items-center border-t border-stone-100">Lagthram Verification</div>
                  <div className="h-10 flex items-center border-t border-stone-100">Bedrooms / Baths</div>
                  <div className="h-10 flex items-center border-t border-stone-100">Total Area / Engine</div>
                  <div className="h-10 flex items-center border-t border-stone-100">Heating / Features</div>
                  <div className="h-12 flex items-center border-t border-stone-100">Action</div>
                </div>

                {/* Items Columns */}
                {compareList.map((item) => {
                  const isVehicle = item.compareType === 'vehicle' || item.fuel;
                  return (
                    <div key={item.id} className="space-y-6 pt-2 p-3 rounded-2xl bg-stone-50 border border-stone-200">
                      
                      {/* Image & Title Card */}
                      <div className="h-44 flex flex-col justify-between">
                        <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-2">
                          <img src={item.image} alt="" className="w-full h-full object-cover" />
                          <button
                            onClick={() => toggleCompare(item)}
                            className="absolute top-1.5 right-1.5 p-1.5 rounded-full bg-black/60 text-white hover:bg-red-600 transition-colors"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <h4 className="font-bold text-slate-900 text-xs truncate">{item.title}</h4>
                      </div>

                      {/* Price */}
                      <div className="h-10 flex items-center border-t border-stone-200 text-sm font-extrabold text-[#9e1b27]">
                        {formatCurrency(item.priceNu)}
                      </div>

                      {/* Location */}
                      <div className="h-10 flex items-center border-t border-stone-200 font-semibold text-slate-700">
                        {item.location}
                      </div>

                      {/* Legal Verification */}
                      <div className="h-10 flex items-center border-t border-stone-200 text-emerald-700 font-bold">
                        ✓ Lagthram Verified
                      </div>

                      {/* Beds / Baths */}
                      <div className="h-10 flex items-center border-t border-stone-200 text-slate-700">
                        {isVehicle ? '5-Seater Cabin' : `${item.beds || 3} Beds • ${item.baths || 2} Baths`}
                      </div>

                      {/* Area / Specs */}
                      <div className="h-10 flex items-center border-t border-stone-200 text-slate-700">
                        {isVehicle ? `${item.transmission} • ${item.mileage}` : item.area}
                      </div>

                      {/* Features */}
                      <div className="h-10 flex items-center border-t border-stone-200 text-slate-700 font-medium">
                        {isVehicle ? `${item.fuel} 4WD Engine` : 'Traditional Bukhari & Rabsel Timber'}
                      </div>

                      {/* View Button */}
                      <div className="h-12 flex items-center border-t border-stone-200">
                        <button
                          onClick={() => {
                            setCompareModalOpen(false);
                            openDetail(item, isVehicle ? 'vehicle' : 'property');
                          }}
                          className="w-full py-2 rounded-xl bg-[#9e1b27] hover:bg-[#80131d] text-white font-bold text-xs shadow transition-all cursor-pointer"
                        >
                          View Full Details
                        </button>
                      </div>

                    </div>
                  );
                })}

              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
              <button
                onClick={clearCompare}
                className="text-xs text-red-600 font-bold hover:underline"
              >
                Clear All ({compareList.length})
              </button>

              <button
                onClick={() => setCompareModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-black"
              >
                Close Comparison
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
