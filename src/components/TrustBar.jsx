import React from 'react';
import { ShieldCheck, Users, CheckCircle, Headphones, Sparkles } from 'lucide-react';

export const TrustBar = () => {
  const trustItems = [
    {
      icon: ShieldCheck,
      title: 'Verified Listings',
      subtitle: '100% Approved Lagthram',
      gradient: 'from-rose-500/15 to-red-500/5',
      iconColor: 'text-[#9e1b27]',
      iconBg: 'bg-rose-100/80 border-rose-200/80'
    },
    {
      icon: Users,
      title: 'Multi-User Platform',
      subtitle: 'For All User Types',
      gradient: 'from-amber-500/15 to-yellow-500/5',
      iconColor: 'text-amber-700',
      iconBg: 'bg-amber-100/80 border-amber-200/80'
    },
    {
      icon: CheckCircle,
      title: 'Easy & Transparent',
      subtitle: 'Simple Legal Process',
      gradient: 'from-emerald-500/15 to-teal-500/5',
      iconColor: 'text-emerald-700',
      iconBg: 'bg-emerald-100/80 border-emerald-200/80'
    },
    {
      icon: Headphones,
      title: 'Local Support',
      subtitle: '24/7 Across Bhutan',
      gradient: 'from-blue-500/15 to-indigo-500/5',
      iconColor: 'text-blue-700',
      iconBg: 'bg-blue-100/80 border-blue-200/80'
    }
  ];

  return (
    <section className="bg-stone-50/70 border-b border-stone-200/80 py-6 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
        {trustItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div 
              key={idx} 
              className="glass-card rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 sm:gap-3.5 hover:shadow-md hover:-translate-y-0.5 transition-all group"
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl ${item.iconBg} border flex items-center justify-center flex-shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}>
                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${item.iconColor}`} />
              </div>
              <div className="overflow-hidden">
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight truncate">
                  {item.title}
                </h4>
                <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate mt-0.5">
                  {item.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
