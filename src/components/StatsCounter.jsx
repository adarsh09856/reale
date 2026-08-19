import React from 'react';
import { Home, Car, Users, ShieldCheck } from 'lucide-react';

export const StatsCounter = () => {
  const stats = [
    {
      icon: Home,
      value: '1,245+',
      label: 'Properties Listed',
      iconColor: 'text-[#ef4444]',
      glow: 'from-rose-500/20'
    },
    {
      icon: Car,
      value: '356+',
      label: 'Vehicles Listed',
      iconColor: 'text-amber-400',
      glow: 'from-amber-500/20'
    },
    {
      icon: Users,
      value: '785+',
      label: 'Registered Users',
      iconColor: 'text-emerald-400',
      glow: 'from-emerald-500/20'
    },
    {
      icon: ShieldCheck,
      value: '100%',
      label: 'Verified Listings',
      iconColor: 'text-blue-400',
      glow: 'from-blue-500/20'
    }
  ];

  return (
    <section className="bg-[#0b1329] text-white py-9 px-4 sm:px-8 border-y border-stone-800">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div 
              key={idx} 
              className="flex items-center gap-4 group"
            >
              <div className="w-13 h-13 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <Icon className={`w-7 h-7 ${stat.iconColor}`} />
              </div>
              <div>
                <div className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight leading-none">
                  {stat.value}
                </div>
                <div className="text-xs text-stone-300 font-medium mt-1">
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
