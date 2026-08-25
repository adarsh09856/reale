import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DASHBOARD_ROLES } from '../data/bhutanData';
import { BhutanKnot } from './BhutanKnot';
import { X, Lock, Mail, User, Phone, CheckCircle2, Loader2 } from 'lucide-react';
import { api } from '../api/client';

export const RoleLoginModal = () => {
  const { loginModal, closeRoleLogin, setCurrentUser, showToast } = useApp();
  const [isRegister, setIsRegister] = useState(loginModal.isRegister);
  const [selectedRole, setSelectedRole] = useState(loginModal.roleId || 'buyer');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  if (!loginModal.isOpen) return null;

  const roleObj = DASHBOARD_ROLES.find(r => r.id === selectedRole) || DASHBOARD_ROLES[4];

  // REAL API LOGIN CALL (Blocks on invalid credentials)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      showToast('Please enter your email and password', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await api.login(formData.email, formData.password);
      setCurrentUser(res.user);
      showToast(`Welcome, ${res.user.name}! Authenticated as ${res.user.role}.`, 'success');
      closeRoleLogin();
    } catch (err) {
      showToast(err.message || 'Invalid email or password.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Preset Real Seeded Logins (calls real backend API with verified hashes)
  const handleQuickSeedLogin = async (email, password, label) => {
    setLoading(true);
    try {
      const res = await api.login(email, password);
      setCurrentUser(res.user);
      showToast(`Logged in as ${res.user.name} (${label})`, 'success');
      closeRoleLogin();
    } catch (err) {
      showToast(err.message || 'Login failed. Please check credentials.', 'error');
    } finally {
      setLoading(false);
    }
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
                {isRegister ? 'Register Account' : 'Sign In to Account'}
              </h3>
              <p className="text-xs text-stone-400">
                {isRegister ? 'Join Bhutan’s certified real estate platform' : 'Enter your registered credentials to access your dashboard'}
              </p>
            </div>
          </div>
        </div>

        {/* Real Authenticated Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="admin@jigme.bt"
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
                placeholder="Enter password..."
                className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-[#9e1b27]"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 bg-[#9e1b27] hover:bg-[#80131d] disabled:bg-stone-400 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying credentials against database...</span>
              </>
            ) : (
              <span>Authenticate & Sign In</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
