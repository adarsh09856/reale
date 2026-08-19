import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BhutanKnot } from './BhutanKnot';
import { X, MapPin, Bed, Bath, Maximize2, Fuel, Gauge, Settings, Phone, Calendar, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const PropertyDetailModal = () => {
  const { detailModal, closeDetail, showToast } = useApp();
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');

  if (!detailModal.isOpen || !detailModal.item) return null;

  const item = detailModal.item;
  const isVehicle = detailModal.type === 'vehicle';

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    if (!inquiryName || !inquiryPhone) {
      showToast('Please enter your name and phone', 'error');
      return;
    }
    confetti({ particleCount: 70, spread: 60 });
    showToast(`Inquiry sent to ${item.agent?.name || item.seller?.name || 'the broker'}! They will call you shortly.`, 'success');
    closeDetail();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Image Banner */}
        <div className="relative aspect-[16/9] w-full bg-slate-900 flex-shrink-0">
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
          <button
            onClick={closeDetail}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="absolute bottom-3 left-4 flex gap-2">
            {item.badges?.map((b, idx) => (
              <span key={idx} className={`text-xs font-bold px-2.5 py-1 rounded shadow ${b.color}`}>
                {b.text}
              </span>
            ))}
          </div>
        </div>

        {/* Modal Scroll Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{item.title}</h2>
                <div className="flex items-center gap-1 text-slate-500 mt-1">
                  <MapPin className="w-4 h-4 text-[#9e1b27]" />
                  <span>{item.location}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Price</span>
                <span className="text-xl font-extrabold text-[#9e1b27]">{item.priceDisplay}</span>
              </div>
            </div>
          </div>

          {/* Quick Specs */}
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-around">
            {isVehicle ? (
              <>
                <div className="text-center">
                  <span className="text-slate-400 block text-[10px]">Fuel</span>
                  <strong className="text-slate-800">{item.fuel}</strong>
                </div>
                <div className="text-center">
                  <span className="text-slate-400 block text-[10px]">Mileage</span>
                  <strong className="text-slate-800">{item.mileage}</strong>
                </div>
                <div className="text-center">
                  <span className="text-slate-400 block text-[10px]">Transmission</span>
                  <strong className="text-slate-800">{item.transmission}</strong>
                </div>
              </>
            ) : (
              <>
                <div className="text-center">
                  <span className="text-slate-400 block text-[10px]">Bedrooms</span>
                  <strong className="text-slate-800">{item.beds || 'N/A'}</strong>
                </div>
                <div className="text-center">
                  <span className="text-slate-400 block text-[10px]">Bathrooms</span>
                  <strong className="text-slate-800">{item.baths || 'N/A'}</strong>
                </div>
                <div className="text-center">
                  <span className="text-slate-400 block text-[10px]">Total Area</span>
                  <strong className="text-slate-800">{item.area}</strong>
                </div>
              </>
            )}
          </div>

          {/* Description */}
          <div>
            <h4 className="font-bold text-slate-900 mb-1">Description & Lagthram Status</h4>
            <p className="text-slate-600 leading-relaxed">{item.description}</p>
          </div>

          {/* Fast Inquiry Box */}
          <form onSubmit={handleInquirySubmit} className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-3">
            <h4 className="font-bold text-[#9e1b27]">Contact Broker / Request Site Tour</h4>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={inquiryName}
                onChange={(e) => setInquiryName(e.target.value)}
                placeholder="Your Name"
                className="px-3 py-2 rounded-lg bg-white border border-stone-300 focus:outline-none"
                required
              />
              <input
                type="tel"
                value={inquiryPhone}
                onChange={(e) => setInquiryPhone(e.target.value)}
                placeholder="+975 17 XXX XXX"
                className="px-3 py-2 rounded-lg bg-white border border-stone-300 focus:outline-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-[#9e1b27] hover:bg-[#80131d] text-white font-bold rounded-xl shadow transition-all"
            >
              Submit Tour Booking
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
