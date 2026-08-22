import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BhutanKnot } from './BhutanKnot';
import { 
  X, 
  Crown, 
  User, 
  Briefcase, 
  Home, 
  Users, 
  PlusCircle, 
  Trash2, 
  CheckCircle2, 
  Calendar, 
  DollarSign, 
  ShieldCheck, 
  Building, 
  Clock, 
  FileText,
  MapPin
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const RoleDashboardModal = () => {
  const { 
    roleDashboardModal, 
    closeRoleDashboard, 
    properties, 
    vehicles, 
    favorites, 
    formatCurrency, 
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview');

  if (!roleDashboardModal.isOpen) return null;

  const roleId = roleDashboardModal.roleId || 'admin';

  const roleDetails = {
    admin: {
      title: '👑 Admin Control Center',
      name: 'Dasho Tashi Dorji (Platform Director)',
      subtitle: 'Manage national listings, broker licenses, and Dzongkhag records'
    },
    agent: {
      title: '👤 Licensed Agent Portal',
      name: 'Sonam Pelden (Senior Realtor)',
      subtitle: 'Manage client viewing schedules and active listings'
    },
    broker: {
      title: '💼 Broker Enterprise Pipeline',
      name: 'Karma Wangchuk (Managing Broker)',
      subtitle: 'Track property portfolios, escrow transfers, and commissions'
    },
    owner: {
      title: '🏠 Property & Vehicle Owner Center',
      name: 'Ugyen Tshering (Private Landlord)',
      subtitle: 'Post new listings and view incoming buyer inquiries'
    },
    buyer: {
      title: '👥 Buyer & Investor Dashboard',
      name: 'Sangay Khandu (Verified Buyer)',
      subtitle: 'View saved properties, tour bookings, and loan pre-approvals'
    }
  };

  const currentRole = roleDetails[roleId] || roleDetails.admin;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="bg-[#0f172a] text-white p-5 sm:p-6 relative flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-amber-500/10 border border-amber-500/30">
              <BhutanKnot className="w-7 h-7" color="#ef4444" secondaryColor="#f59e0b" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-lg text-white">
                  {currentRole.title}
                </h3>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Active Session
                </span>
              </div>
              <p className="text-xs text-stone-400">
                {currentRole.name} • {currentRole.subtitle}
              </p>
            </div>
          </div>

          <button
            onClick={closeRoleDashboard}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body with Role-Specific Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs text-slate-700 flex-1">
          
          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] font-bold uppercase text-slate-400">Total Active Listings</span>
              <div className="text-xl font-display font-extrabold text-slate-900 mt-0.5">
                {properties.length + vehicles.length}
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold">Across 20 Dzongkhags</span>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] font-bold uppercase text-slate-400">Portfolio Value</span>
              <div className="text-xl font-display font-extrabold text-[#9e1b27] mt-0.5">
                {formatCurrency(365000000)}
              </div>
              <span className="text-[10px] text-slate-500 font-semibold">100% Lagthram Verified</span>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] font-bold uppercase text-slate-400">Pending Inquiries</span>
              <div className="text-xl font-display font-extrabold text-blue-700 mt-0.5">
                14 Clients
              </div>
              <span className="text-[10px] text-blue-600 font-semibold">4 Scheduled Tours</span>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] font-bold uppercase text-slate-400">Commission Earned</span>
              <div className="text-xl font-display font-extrabold text-emerald-700 mt-0.5">
                {formatCurrency(2450000)}
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold">BoB Wire Settled</span>
            </div>
          </div>

          {/* Role Specific Panels */}
          {roleId === 'admin' && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-600" />
                <span>National Bhutan Property Approvals</span>
              </h4>
              <div className="space-y-2">
                {properties.slice(0, 3).map(p => (
                  <div key={p.id} className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">{p.title}</div>
                      <div className="text-slate-500">{p.location} • {p.priceDisplay}</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      eSakor Approved ✓
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {roleId === 'broker' && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-600" />
                <span>Active Deals & Client Pipeline</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                  <div className="font-bold text-blue-900">1. Site Viewing Stage</div>
                  <p className="text-[11px] text-blue-700 mt-1">3 Prospective Buyers scheduled this weekend in Paro & Thimphu</p>
                </div>
                <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
                  <div className="font-bold text-purple-900">2. Thram Title Verification</div>
                  <p className="text-[11px] text-purple-700 mt-1">2 Changzamtog Villas under NLC legal clearance</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="font-bold text-emerald-900">3. Closed Won 🎉</div>
                  <p className="text-[11px] text-emerald-700 mt-1">Nu. 1.8 Cr Motithang transaction completed</p>
                </div>
              </div>
            </div>
          )}

          {roleId === 'owner' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-900">My Posted Listings</h4>
                <button
                  onClick={() => {
                    confetti({ particleCount: 50, spread: 60 });
                    showToast('Opening Listing Creator Wizard...', 'info');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#9e1b27] text-white font-bold text-xs flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+ Post New Property</span>
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {properties.slice(0, 2).map(p => (
                  <div key={p.id} className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center gap-3">
                    <img src={p.image} alt="" className="w-16 h-12 rounded-lg object-cover" />
                    <div>
                      <h5 className="font-bold text-slate-900 truncate">{p.title}</h5>
                      <span className="text-[#9e1b27] font-bold">{p.priceDisplay}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {roleId === 'buyer' && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-slate-900">My Saved Favorites & Scheduled Tours</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {properties.slice(0, 2).map(p => (
                  <div key={p.id} className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-slate-900">{p.title}</h5>
                      <span className="text-slate-500">{p.location}</span>
                    </div>
                    <span className="text-xs font-bold text-[#9e1b27]">{p.priceDisplay}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Jigme Real Estate Kingdom of Bhutan System
          </span>
          <button
            onClick={closeRoleDashboard}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs"
          >
            Close Dashboard
          </button>
        </div>

      </div>
    </div>
  );
};
