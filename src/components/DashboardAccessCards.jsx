import React from 'react';
import { useApp } from '../context/AppContext';
import { DASHBOARD_ROLES } from '../data/bhutanData';
import { Crown, User, Briefcase, Home, Users, UserPlus, ArrowRight } from 'lucide-react';

export const DashboardAccessCards = () => {
  const { openRoleLogin, openRoleDashboard, currentUser } = useApp();

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Crown':
        return <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-[#9e1b27]" />;
      case 'User':
        return <User className="w-5 h-5 sm:w-6 sm:h-6 text-amber-700" />;
      case 'Briefcase':
        return <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-700" />;
      case 'Home':
        return <Home className="w-5 h-5 sm:w-6 sm:h-6 text-blue-700" />;
      case 'Users':
        return <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-700" />;
      default:
        return <User className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700" />;
    }
  };

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-8 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Heading with Bhutanese Auspicious Diamond Flourish */}
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <div className="flex items-center justify-center gap-2 mb-2">
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

        {/* 5 Role Cards Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5 mb-8 sm:mb-10">
          {DASHBOARD_ROLES.map((role) => (
            <div
              key={role.id}
              className="glass-card rounded-2xl p-5 sm:p-6 flex flex-col justify-between text-center hover:shadow-xl hover:-translate-y-1 hover:border-amber-400/80 transition-all duration-300 group"
            >
              <div>
                {/* Role Icon Circle */}
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${role.iconColor} border mx-auto flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-2xs`}>
                  {getIcon(role.icon)}
                </div>

                {/* Role Title */}
                <h3 className="font-bold text-sm sm:text-base text-slate-900 mb-2">
                  {role.title}
                </h3>

                {/* Description */}
                <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed min-h-[36px]">
                  {role.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3.5 border-t border-stone-100">
                <button
                  onClick={() => {
                    if (currentUser && currentUser.roleId === role.id) {
                      openRoleDashboard(role.id);
                    } else {
                      openRoleLogin(role.id, false);
                    }
                  }}
                  className="w-full py-2 px-3 rounded-xl border border-stone-300 hover:border-[#9e1b27] hover:bg-rose-50 text-xs font-bold text-slate-700 hover:text-[#9e1b27] transition-all cursor-pointer shadow-2xs group-hover:bg-[#9e1b27] group-hover:text-white group-hover:border-[#9e1b27]"
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
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#9e1b27] hover:bg-[#80131d] active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg shadow-[#9e1b27]/25 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>New User? Register Here</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};
