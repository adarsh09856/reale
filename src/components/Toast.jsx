import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const Toast = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-200">
      <div className={`px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-2.5 text-xs font-bold ${
        toastMessage.type === 'error'
          ? 'bg-red-900 text-white border-red-700'
          : toastMessage.type === 'info'
          ? 'bg-slate-900 text-white border-slate-700'
          : 'bg-emerald-900 text-white border-emerald-700'
      }`}>
        {toastMessage.type === 'error' ? (
          <AlertCircle className="w-4 h-4 text-red-400" />
        ) : toastMessage.type === 'info' ? (
          <Info className="w-4 h-4 text-amber-400" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        )}
        <span>{toastMessage.msg}</span>
      </div>
    </div>
  );
};
