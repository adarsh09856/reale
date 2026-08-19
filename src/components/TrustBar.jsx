import React from 'react';
import { ShieldCheck, Users, CheckCircle, Headphones } from 'lucide-react';

export const TrustBar = () => {
  const trustItems = [
    {
      icon: ShieldCheck,
      title: 'Verified Listings',
      subtitle: '100% Approved',
      iconBg: 'bg-rose-100 text-[#9e1b27]'
    },
    {
      icon: Users,
      title: 'Multi-User Platform',
      subtitle: 'For All User Types',
      iconBg: 'bg-amber-100 text-amber-700'
    },
    {
      icon: CheckCircle,
      title: 'Easy & Transparent',
      subtitle: 'Simple Process',
      iconBg: 'bg-emerald-100 text-emerald-700'
    },
    {
      icon: Headphones,
      title: 'Local Support',
      subtitle: 'Across Bhutan',
      iconBg: 'bg-blue-100 text-blue-700'
    }
  ];

  return (
    <section className="bg-white border-b border-stone-200/90 py-5 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
        {trustItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div 
              key={idx} 
              className="flex items-center gap-3.5 p-3 rounded-2xl hover:bg-stone-50 transition-colors"
            >
              <div className={`w-11 h-11 rounded-2xl ${item.iconBg} flex items-center justify-center flex-shrink-0 shadow-2xs`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-500 font-medium">
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
