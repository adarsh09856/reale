import React from 'react';
import { Home, Car, Users, ShieldCheck } from 'lucide-react';

export const StatsCounter = () => {
  const stats = [
    {
      icon: Home,
      value: '1,245+',
      label: 'Properties Listed',
      iconColor: 'text-[#ef4444]',
      bgGlow: 'from-rose-500/10 to-transparent'
    },
    {
      icon: Car,
      value: '356+',
      label: 'Vehicles Listed',
      iconColor: 'text-amber-400',
      bgGlow: 'from-amber-500/10 to-transparent'
    },
    {
      icon: Users,
      value: '785+',
      label: 'Registered Users',
      iconColor: 'text-emerald-400',
      bgGlow: 'from-emerald-500/10 to-transparent'
    },
    {
      icon: ShieldCheck,
      value: '100%',
      label: 'Verified Listings',
      iconColor: 'text-blue-400',
      bgGlow: 'from-blue-500/10 to-transparent'
    }
  ];

  return (
    <section className="bg-[#090d16] text-white py-10 sm:py-12 px-4 sm:px-8 border-y border-stone-800">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div 
              key={idx} 
              className="flex items-center gap-3 sm:gap-4 p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${stat.iconColor}`} />
              </div>
              <div className="overflow-hidden">
                <div className="font-display font-black text-xl sm:text-3xl text-white tracking-tight leading-none truncate">
                  {stat.value}
                </div>
                <div className="text-[11px] sm:text-xs text-stone-300 font-medium mt-1 truncate">
                  {stat.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
