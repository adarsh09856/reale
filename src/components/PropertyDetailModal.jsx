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
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PropertyDetailModal = () => {
  const { detailModal, closeDetail, formatCurrency, showToast } = useApp();
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [tourDate, setTourDate] = useState('2026-08-28');
  const [tourTime, setTourTime] = useState('11:00 AM');

  // Mini BoB Mortgage Estimator State
  const [loanDownpaymentPercent, setLoanDownpaymentPercent] = useState(20);
  const [loanTenureYears, setLoanTenureYears] = useState(20);
  const [loanInterestRate, setLoanInterestRate] = useState(8.5);

  if (!detailModal.isOpen || !detailModal.item) return null;

  const item = detailModal.item;
  const isVehicle = detailModal.type === 'vehicle';

  // Calculate Monthly EMI (Bank of Bhutan standard formula)
  const principal = item.priceNu * (1 - loanDownpaymentPercent / 100);
  const monthlyRate = (loanInterestRate / 100) / 12;
  const totalMonths = loanTenureYears * 12;
  const monthlyEmi = Math.round((principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1));

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Image Banner */}
        <div className="relative aspect-[16/9] w-full bg-slate-950 flex-shrink-0 overflow-hidden">
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
          
          {/* Close Button */}
          <button
            onClick={closeDetail}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          {/* Badges */}
          <div className="absolute bottom-3 left-4 flex gap-1.5">
            {item.badges?.map((b, idx) => (
              <span key={idx} className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow ${b.color}`}>
                {b.text}
              </span>
            ))}
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-900/80 text-amber-300 border border-amber-400/40 backdrop-blur-md">
              ✓ Lagthram Verified
            </span>
          </div>
        </div>

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

          {/* Bank of Bhutan Mortgage EMI Estimator */}
          {!isVehicle && item.priceNu > 1000000 && (
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <Calculator className="w-4 h-4 text-amber-700" />
                  <span>Bank of Bhutan Housing Loan Estimator (8.5% p.a.)</span>
                </div>
                <span className="font-extrabold text-[#9e1b27] text-sm">
                  {formatCurrency(monthlyEmi)} /mo EMI
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Down Payment (20%)</label>
                  <span className="font-bold text-slate-800">{formatCurrency(item.priceNu * 0.2)}</span>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Loan Tenure</label>
                  <span className="font-bold text-slate-800">20 Years (240 Mos)</span>
                </div>
              </div>
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

              <div className="flex items-center gap-1.5">
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
