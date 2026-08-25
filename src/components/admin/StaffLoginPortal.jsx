import React, { useState } from 'react';
import { BhutanKnot } from '../BhutanKnot';
import { Lock, Mail, ShieldAlert, ArrowLeft, Loader2 } from 'lucide-react';
import { api } from '../../api/client';

export const StaffLoginPortal = ({ onLoginSuccess, onBackToPublic }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleStaffLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter your staff email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.login(email, password);
      const isStaff = ['super_admin', 'admin', 'broker', 'agent', 'editor'].includes(res.user.role) ||
                      res.user.permissions?.includes('dashboard:read');
      
      if (!isStaff) {
        throw new Error('Access Denied. Your account does not have staff or broker administrative privileges.');
      }

      onLoginSuccess(res.user);
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B132B] flex flex-col justify-between items-center p-4 sm:p-8 text-slate-300 font-sans antialiased">
      {/* Top back link */}
      <div className="w-full max-w-md flex justify-between items-center">
        <button
          onClick={onBackToPublic}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer py-1 px-3 rounded-lg hover:bg-slate-800"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Marketplace</span>
        </button>
        <span className="text-[11px] font-mono text-slate-500 uppercase">Port: 5000 / TLS 1.3</span>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-[#131E3D] border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 flex items-center justify-center mx-auto shadow-lg p-2">
            <BhutanKnot className="w-full h-full" color="#ffffff" secondaryColor="#60a5fa" />
          </div>
          <h2 className="font-display font-black text-xl text-white tracking-tight">
            Infinity Enterprise Portal
          </h2>
          <p className="text-xs text-slate-400">
            Internal Staff, Broker & Administrator Management Access
          </p>
        </div>

        {/* Security Alert Notice */}
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-300">
          <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            Restricted access. All authentication attempts and administrative operations are cryptographically signed and logged.
          </p>
        </div>

        {/* Error Alert if any */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs animate-in fade-in">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleStaffLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1.5">Staff Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@jigme.bt"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Staff Credentials...</span>
              </>
            ) : (
              <span>Authenticate to Workspace</span>
            )}
          </button>
        </form>
      </div>

      {/* Footer info */}
      <div className="text-center text-[10px] text-slate-500">
        © {new Date().getFullYear()} Jigme Innovation System. Protected by Granular RBAC.
      </div>
    </div>
  );
};
