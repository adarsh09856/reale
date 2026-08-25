import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Compass, Home, Car, Calculator, ArrowRight } from 'lucide-react';

export const DashboardAccessCards = () => {
  const { openModal, openCalculatorModal } = useApp();

  const SERVICES = [
    {
      id: 'estates',
      title: 'Luxury Estates',
      description: 'Verified heritage villas, mountain retreats, and commercial real estate.',
      icon: Home,
      iconColor: 'bg-rose-50 text-[#9e1b27] border-rose-200',
      action: 'Browse Estates',
      handler: () => {
        const el = document.getElementById('featured-properties');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      id: 'motors',
      title: 'Certified 4x4 Motors',
      description: 'RSTA-inspected Toyota Land Cruisers, Hilux trucks, and AWD vehicles.',
      icon: Car,
      iconColor: 'bg-amber-50 text-amber-700 border-amber-200',
      action: 'Browse Motors',
      handler: () => {
        const el = document.getElementById('featured-vehicles');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      id: 'mortgage',
      title: 'BoB Mortgage Calc',
      description: 'Real-time interest amortization and loan eligibility estimates.',
      icon: Calculator,
      iconColor: 'bg-blue-50 text-blue-700 border-blue-200',
      action: 'Calculate EMI',
      handler: () => openCalculatorModal()
    },
    {
      id: 'legal',
      title: 'eSakor Thram Check',
      description: 'Government certified digital title deed verification & escrow protection.',
      icon: ShieldCheck,
      iconColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      action: 'Learn Verification',
      handler: () => {
        const el = document.getElementById('trust-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    {
      id: 'tours',
      title: 'Guided Site Tours',
      description: 'Schedule personal estate inspections with local Bhutanese specialists.',
      icon: Compass,
      iconColor: 'bg-purple-50 text-purple-700 border-purple-200',
      action: 'Schedule Tour',
      handler: () => openModal('schedule-tour', null)
    }
  ];

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-8 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Heading with Bhutanese Auspicious Diamond Flourish */}
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-amber-600 text-sm font-serif">❖</span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Client & Investor Services
            </h2>
            <span className="text-amber-600 text-sm font-serif">❖</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Certified transactions, legal title verification, and BoB mortgage escrow
          </p>
        </div>

        {/* 5 Service Cards Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5 mb-8 sm:mb-10">
          {SERVICES.map((srv) => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.id}
                className="glass-card rounded-2xl p-5 sm:p-6 flex flex-col justify-between text-center hover:shadow-xl hover:-translate-y-1 hover:border-amber-400/80 transition-all duration-300 group bg-white border border-stone-200"
              >
                <div>
                  {/* Service Icon Circle */}
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${srv.iconColor} border mx-auto flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-2xs`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 mb-2">
                    {srv.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed min-h-[36px]">
                    {srv.description}
                  </p>
                </div>

                {/* Action Button */}
                <div className="mt-5 pt-3.5 border-t border-stone-100">
                  <button
                    onClick={srv.handler}
                    className="w-full py-2 px-3 rounded-xl border border-stone-300 hover:border-[#9e1b27] hover:bg-rose-50 text-xs font-bold text-slate-700 hover:text-[#9e1b27] transition-all cursor-pointer shadow-2xs group-hover:bg-[#9e1b27] group-hover:text-white group-hover:border-[#9e1b27]"
                  >
                    {srv.action}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Center Register CTA Banner */}
        <div className="text-center">
          <button
            onClick={() => openModal('register')}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#9e1b27] hover:bg-[#80131d] active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg shadow-[#9e1b27]/25 transition-all cursor-pointer"
          >
            <span>Create Free Buyer / Investor Account</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};
