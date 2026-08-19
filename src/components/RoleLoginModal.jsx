import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DASHBOARD_ROLES } from '../data/bhutanData';
import { BhutanKnot } from './BhutanKnot';
import { X, Lock, Mail, User, Phone, CheckCircle2 } from 'lucide-react';

export const RoleLoginModal = () => {
  const { loginModal, closeRoleLogin, setCurrentUser, showToast } = useApp();
  const [isRegister, setIsRegister] = useState(loginModal.isRegister);
  const [selectedRole, setSelectedRole] = useState(loginModal.roleId || 'buyer');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  if (!loginModal.isOpen) return null;

  const roleObj = DASHBOARD_ROLES.find(r => r.id === selectedRole) || DASHBOARD_ROLES[4];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      showToast('Please enter your email and password', 'error');
      return;
    }

    const user = {
      name: formData.name || formData.email.split('@')[0],
      email: formData.email,
      role: roleObj.title,
      roleId: selectedRole
    };

    setCurrentUser(user);
    showToast(`Logged in successfully as ${roleObj.title}!`, 'success');
    closeRoleLogin();
  };

  const handleDemoLogin = (roleId) => {
    const r = DASHBOARD_ROLES.find(item => item.id === roleId);
    const demoUser = {
      name: roleId === 'admin' ? 'Dasho Tashi Dorji' : roleId === 'broker' ? 'Karma Wangchuk' : 'Sangay Pelden',
      email: `${roleId}@jigmeestate.bt`,
      role: r.title,
      roleId: roleId
    };
    setCurrentUser(demoUser);
    showToast(`Logged in as ${demoUser.name} (${r.title})`, 'success');
    closeRoleLogin();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#0f172a] text-white p-5 relative">
          <button
            onClick={closeRoleLogin}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="p-1 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <BhutanKnot className="w-7 h-7" color="#ef4444" secondaryColor="#f59e0b" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                {isRegister ? 'Register Account' : `${roleObj.title} Access`}
              </h3>
              <p className="text-xs text-stone-400">
                {isRegister ? 'Join Bhutan’s certified real estate platform' : roleObj.description}
              </p>
            </div>
          </div>
        </div>

        {/* Role Selector Pills */}
        <div className="p-4 bg-stone-50 border-b border-stone-200 flex gap-1.5 overflow-x-auto">
          {DASHBOARD_ROLES.map(r => (
            <button
              key={r.id}
              onClick={() => setSelectedRole(r.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                selectedRole === r.id
                  ? 'bg-[#9e1b27] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              {r.title}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-3.5 text-xs">
          {isRegister && (
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Karma Tshering"
                  className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#9e1b27]"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@druknet.bt"
                className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#9e1b27]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#9e1b27]"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#9e1b27] hover:bg-[#80131d] text-white font-bold rounded-xl shadow-md transition-all mt-2"
          >
            {isRegister ? 'Complete Registration' : `Sign In as ${roleObj.title}`}
          </button>

          {/* 1-Click Fast Role Sign In */}
          <div className="pt-3 border-t border-stone-200 text-center">
            <p className="text-[10px] font-bold uppercase text-slate-400 mb-2">Or Quick 1-Click Role Login</p>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="p-1.5 rounded-lg border border-stone-200 text-[11px] font-bold text-[#9e1b27] hover:bg-rose-50"
              >
                👑 Admin
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('broker')}
                className="p-1.5 rounded-lg border border-stone-200 text-[11px] font-bold text-emerald-700 hover:bg-emerald-50"
              >
                💼 Broker
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('buyer')}
                className="p-1.5 rounded-lg border border-stone-200 text-[11px] font-bold text-purple-700 hover:bg-purple-50"
              >
                👥 Buyer
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
