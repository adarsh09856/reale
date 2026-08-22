import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BhutanKnot } from './BhutanKnot';
import { 
  X, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  Fuel, 
  Gauge, 
  Settings, 
  Phone, 
  Calendar, 
  CheckCircle2, 
  Calculator,
  MessageCircle,
  ShieldCheck,
  Building,
  UserCheck,
  Sun,
  Eye,
  Sparkles,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PropertyDetailModal = () => {
  const { detailModal, closeDetail, formatCurrency, showToast, setLoanCalculatorOpen } = useApp();
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [tourDate, setTourDate] = useState('2026-08-28');
  const [tourTime, setTourTime] = useState('11:00 AM');
  const [virtualTourOpen, setVirtualTourOpen] = useState(false);

  if (!detailModal.isOpen || !detailModal.item) return null;

  const item = detailModal.item;
  const isVehicle = detailModal.type === 'vehicle';

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    if (!inquiryName || !inquiryPhone) {
      showToast('Please enter your name and contact phone', 'error');
      return;
    }
    confetti({ particleCount: 75, spread: 65, origin: { y: 0.5 } });
    showToast(`Viewing Tour successfully scheduled for ${tourDate} at ${tourTime}! Our broker will contact you.`, 'success');
    closeDetail();
  };

  const handleWhatsAppChat = () => {
    confetti({ particleCount: 40, spread: 50 });
    const msg = `Kuzuzangpo La! I am interested in viewing '${item.title}' (${item.location}) listed for ${formatCurrency(item.priceNu)} on Jigme Real Estate Bhutan.`;
    window.open(`https://api.whatsapp.com/send?phone=97517123456&text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Image Banner */}
        <div className="relative aspect-[16/9] w-full bg-slate-950 flex-shrink-0 overflow-hidden group">
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
          
          {/* Close Button */}
          <button
            onClick={closeDetail}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black text-white transition-colors cursor-pointer z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* 360 Virtual Tour Button Overlay */}
          {!isVehicle && (
            <button
              onClick={() => {
                setVirtualTourOpen(!virtualTourOpen);
                showToast('Launching 360° Virtual Panoramic View...', 'info');
              }}
              className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 hover:bg-black text-white font-bold text-xs backdrop-blur-md border border-white/20 shadow-lg cursor-pointer transition-all hover:scale-105"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>360° Virtual Tour</span>
            </button>
          )}
          
          {/* Badges */}
          <div className="absolute bottom-3 left-4 flex flex-wrap gap-1.5 z-10">
            {item.badges?.map((b, idx) => (
              <span key={idx} className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow ${b.color}`}>
                {b.text}
              </span>
            ))}
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-900/80 text-amber-300 border border-amber-400/40 backdrop-blur-md">
              ✓ Lagthram Verified
            </span>
            {!isVehicle && (
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-500/80 text-slate-950 flex items-center gap-1 backdrop-blur-md">
                <Sun className="w-3 h-3" />
                <span>Full Day South-Sun</span>
              </span>
            )}
          </div>
        </div>

        {/* 360 Panoramic Simulation View */}
        {virtualTourOpen && (
          <div className="bg-slate-950 text-white p-4 border-b border-amber-500/30 flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold">360° Himalayan Mountain Valley Panoramic Simulation</span>
            </div>
            <button
              onClick={() => setVirtualTourOpen(false)}
              className="text-xs text-amber-400 font-bold hover:underline"
            >
              Close 360°
            </button>
          </div>
        )}

        {/* Modal Scroll Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          
          {/* Title & Price Row */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                  {item.title}
                </h2>
                <div className="flex items-center gap-1.5 text-slate-500 mt-1">
                  <MapPin className="w-4 h-4 text-[#9e1b27]" />
                  <span>{item.location} • Kingdom of Bhutan</span>
                </div>
              </div>
              <div className="sm:text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">List Price</span>
                <span className="text-xl sm:text-2xl font-extrabold text-[#9e1b27]">
                  {formatCurrency(item.priceNu, item.priceDisplay.includes('/month') ? '/mo' : item.priceDisplay.includes('/decimal') ? '/dec' : '')}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Specs Strip */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-around text-center">
            {isVehicle ? (
              <>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Fuel Type</span>
                  <strong className="text-sm font-bold text-slate-900">{item.fuel}</strong>
                </div>
                <div className="w-[1px] h-8 bg-stone-200"></div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Mileage</span>
                  <strong className="text-sm font-bold text-slate-900">{item.mileage}</strong>
                </div>
                <div className="w-[1px] h-8 bg-stone-200"></div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Transmission</span>
                  <strong className="text-sm font-bold text-slate-900">{item.transmission}</strong>
                </div>
              </>
            ) : (
              <>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Bedrooms</span>
                  <strong className="text-sm font-bold text-slate-900">{item.beds || 'N/A'}</strong>
                </div>
                <div className="w-[1px] h-8 bg-stone-200"></div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Bathrooms</span>
                  <strong className="text-sm font-bold text-slate-900">{item.baths || 'N/A'}</strong>
                </div>
                <div className="w-[1px] h-8 bg-stone-200"></div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Area</span>
                  <strong className="text-sm font-bold text-slate-900">{item.area}</strong>
                </div>
              </>
            )}
          </div>

          {/* Multi-Bank Mortgage Trigger Banner */}
          {!isVehicle && item.priceNu > 1000000 && (
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-amber-700" />
                <div>
                  <h5 className="font-bold text-xs text-amber-950">Bank of Bhutan (BoB) Housing Loan</h5>
                  <p className="text-[11px] text-amber-800">Starting at 8.5% p.a. • Up to 20-30 Years Tenure</p>
                </div>
              </div>
              <button
                onClick={() => setLoanCalculatorOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs shadow cursor-pointer transition-all"
              >
                Calculate EMI ⤢
              </button>
            </div>
          )}

          {/* Description */}
          <div>
            <h4 className="font-bold text-sm text-slate-900 mb-1.5 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Property Overview & Bhutan Legal Title Status</span>
            </h4>
            <p className="text-slate-600 leading-relaxed">{item.description}</p>
          </div>

          {/* Broker Info & Schedule Viewing Form */}
          <form onSubmit={handleInquirySubmit} className="p-4 sm:p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3.5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#9e1b27] text-white flex items-center justify-center font-bold">
                  {item.agent?.name?.[0] || item.seller?.name?.[0] || 'T'}
                </div>
                <div>
                  <h5 className="font-bold text-slate-900">{item.agent?.name || item.seller?.name || 'Dasho Tashi Dorji'}</h5>
                  <span className="text-[10px] text-slate-500">{item.agent?.role || item.seller?.role || 'Principal Broker'}</span>
                </div>
              </div>

              {/* Instant WhatsApp & Direct Call Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleWhatsAppChat}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow transition-all cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>

                <a
                  href={`tel:${item.agent?.phone || '+97517123456'}`}
                  className="p-2 rounded-xl bg-white border border-stone-300 text-slate-700 hover:text-[#9e1b27] hover:border-[#9e1b27] transition-colors"
                  title="Call Broker"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  value={inquiryName}
                  onChange={(e) => setInquiryName(e.target.value)}
                  placeholder="e.g. Karma Dorji"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 focus:outline-none focus:border-[#9e1b27]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Contact Phone (+975) *</label>
                <input
                  type="tel"
                  value={inquiryPhone}
                  onChange={(e) => setInquiryPhone(e.target.value)}
                  placeholder="+975 17 XXX XXX"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 focus:outline-none focus:border-[#9e1b27]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Tour Date</label>
                <input
                  type="date"
                  value={tourDate}
                  onChange={(e) => setTourDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Preferred Time</label>
                <select
                  value={tourTime}
                  onChange={(e) => setTourTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 focus:outline-none"
                >
                  <option value="10:00 AM">10:00 AM (Morning)</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="02:00 PM">02:00 PM (Afternoon)</option>
                  <option value="04:00 PM">04:00 PM</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#9e1b27] hover:bg-[#80131d] active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              Book Viewing Tour & Send Inquiry
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};
