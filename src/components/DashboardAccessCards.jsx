import React from 'react';
import { useApp } from '../context/AppContext';
import { DASHBOARD_ROLES } from '../data/bhutanData';
import { Crown, User, Briefcase, Home, Users, UserPlus } from 'lucide-react';

export const DashboardAccessCards = () => {
  const { openRoleLogin } = useApp();

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Crown':
        return <Crown className="w-5 h-5" />;
      case 'User':
        return <User className="w-5 h-5" />;
      case 'Briefcase':
        return <Briefcase className="w-5 h-5" />;
      case 'Home':
        return <Home className="w-5 h-5" />;
      case 'Users':
        return <Users className="w-5 h-5" />;
      default:
        return <User className="w-5 h-5" />;
    }
  };

  return (
    <section className="py-12 px-4 sm:px-8 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Heading with Bhutanese Auspicious Flourish */}
        <div className="text-center max-w-xl mx-auto mb-9">
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <span className="text-amber-600 text-sm font-serif">❖</span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Access Your Dashboard
            </h2>
            <span className="text-amber-600 text-sm font-serif">❖</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Login as per your role to manage listings and activities
          </p>
        </div>

        {/* 5 Role Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5 mb-8">
          {DASHBOARD_ROLES.map((role) => (
            <div
              key={role.id}
              className="bg-white rounded-2xl p-5 border border-stone-200/85 shadow-sm hover:shadow-md hover:border-amber-400 transition-all flex flex-col justify-between text-center group"
            >
              <div>
                {/* Role Icon Circle */}
                <div className={`w-12 h-12 rounded-full ${role.iconColor} border mx-auto flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                  {getIcon(role.icon)}
                </div>

                {/* Role Title */}
                <h3 className="font-bold text-sm text-slate-900 mb-2">
                  {role.title}
                </h3>

                {/* Description */}
                <p className="text-[11px] text-slate-500 leading-relaxed min-h-[36px]">
                  {role.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3 border-t border-stone-100">
                <button
                  onClick={() => openRoleLogin(role.id, false)}
                  className="w-full py-2 px-3 rounded-xl border border-stone-300 hover:border-[#9e1b27] hover:bg-rose-50 text-xs font-bold text-slate-700 hover:text-[#9e1b27] transition-all cursor-pointer shadow-2xs"
                >
                  {role.btnText}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Center Register CTA Banner */}
        <div className="text-center">
          <button
            onClick={() => openRoleLogin(null, true)}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[#9e1b27] hover:bg-[#80131d] active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>New User? Register Here</span>
          </button>
        </div>

      </div>
    </section>
  );
};
