import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BhutanKnot } from './BhutanKnot';
import { 
  X, 
  Calculator, 
  DollarSign, 
  Building2, 
  CheckCircle2, 
  Share2, 
  Percent, 
  Calendar, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const LoanCalculatorModal = () => {
  const { loanCalculatorOpen, setLoanCalculatorOpen, formatCurrency, showToast } = useApp();

  const [loanAmountNu, setLoanAmountNu] = useState(15000000); // 1.5 Cr
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [tenureYears, setTenureYears] = useState(20);
  const [selectedBank, setSelectedBank] = useState('bob');

  if (!loanCalculatorOpen) return null;

  const banks = {
    bob: { name: 'Bank of Bhutan (BoB)', rate: 8.5, desc: 'Bhutan’s oldest and largest commercial bank' },
    bnbl: { name: 'Bhutan National Bank (BNBL)', rate: 8.75, desc: 'Flexible repayment & construction overdraft' },
    bdbl: { name: 'Bhutan Development Bank (BDBL)', rate: 8.0, desc: 'Special subsidized rural & home loan scheme' },
    tbank: { name: 'T-Bank Ltd', rate: 9.0, desc: 'Fast processing & commercial mortgages' }
  };

  const currentBank = banks[selectedBank];
  const principal = loanAmountNu * (1 - downPaymentPercent / 100);
  const downPaymentAmount = loanAmountNu * (downPaymentPercent / 100);
  const monthlyRate = (currentBank.rate / 100) / 12;
  const totalMonths = tenureYears * 12;

  const monthlyEmi = Math.round(
    (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1)
  );
  const totalPayment = monthlyEmi * totalMonths;
  const totalInterest = totalPayment - principal;

  const handleShareWhatsApp = () => {
    confetti({ particleCount: 50, spread: 60 });
    const text = `Bank of Bhutan Mortgage Estimate: Property Value: Nu. ${loanAmountNu.toLocaleString()}, Monthly EMI: Nu. ${monthlyEmi.toLocaleString()} (${currentBank.rate}% at ${currentBank.name}). Calculated on Jigme Real Estate Bhutan.`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    showToast('Shared loan estimate to WhatsApp!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-stone-200 flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-[#0f172a] text-white p-5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-amber-500/10 border border-amber-500/30">
              <BhutanKnot className="w-7 h-7" color="#ef4444" secondaryColor="#f59e0b" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                <span>Bhutan Multi-Bank Housing Loan Estimator</span>
              </h3>
              <p className="text-xs text-stone-400">Compare RMA-approved interest rates and monthly EMIs</p>
            </div>
          </div>

          <button
            onClick={() => setLoanCalculatorOpen(false)}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scroll Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          
          {/* Bank Selector Grid */}
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-400 mb-2.5">
              Select Lending Financial Institution
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {Object.entries(banks).map(([key, b]) => (
                <button
                  key={key}
                  onClick={() => setSelectedBank(key)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    selectedBank === key
                      ? 'bg-rose-50 border-[#9e1b27] shadow-sm'
                      : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <div className="font-bold text-xs text-slate-900 truncate">{b.name.split(' ')[0]}</div>
                  <div className="text-sm font-black text-[#9e1b27] mt-0.5">{b.rate}% p.a.</div>
                </button>
              ))}
            </div>
          </div>

          {/* Slider 1: Property Value */}
          <div className="space-y-2 p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">Total Property / Land Value</span>
              <span className="text-base font-extrabold text-[#9e1b27]">{formatCurrency(loanAmountNu)}</span>
            </div>
            <input
              type="range"
              min="1000000"
              max="50000000"
              step="500000"
              value={loanAmountNu}
              onChange={(e) => setLoanAmountNu(Number(e.target.value))}
              className="w-full accent-[#9e1b27] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Nu. 10 Lakh</span>
              <span>Nu. 2.5 Cr</span>
              <span>Nu. 5.0 Cr</span>
            </div>
          </div>

          {/* Slider 2: Down Payment */}
          <div className="space-y-2 p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800">Down Payment ({downPaymentPercent}%)</span>
                <span className="text-[10px] text-slate-500 block">Required by Royal Monetary Authority</span>
              </div>
              <span className="text-sm font-bold text-slate-900">{formatCurrency(downPaymentAmount)}</span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              step="5"
              value={downPaymentPercent}
              onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
              className="w-full accent-[#9e1b27] cursor-pointer"
            />
          </div>

          {/* Slider 3: Loan Tenure */}
          <div className="space-y-2 p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">Loan Tenure</span>
              <span className="text-sm font-bold text-slate-900">{tenureYears} Years ({totalMonths} Months)</span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              step="1"
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full accent-[#9e1b27] cursor-pointer"
            />
          </div>

          {/* Results Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0f172a] to-slate-900 text-white space-y-4 shadow-xl border border-amber-500/30">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Estimated Monthly EMI</span>
                <div className="text-2xl sm:text-3xl font-display font-black text-white mt-0.5">
                  {formatCurrency(monthlyEmi)} <span className="text-xs font-normal text-stone-300">/month</span>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                {currentBank.rate}% APR
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-stone-400 block">Principal Borrowed</span>
                <strong className="text-white font-bold">{formatCurrency(principal)}</strong>
              </div>
              <div>
                <span className="text-[10px] text-stone-400 block">Total Interest</span>
                <strong className="text-amber-400 font-bold">{formatCurrency(totalInterest)}</strong>
              </div>
              <div>
                <span className="text-[10px] text-stone-400 block">Total Payable</span>
                <strong className="text-white font-bold">{formatCurrency(totalPayment)}</strong>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer with WhatsApp Share */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between flex-shrink-0">
          <button
            onClick={handleShareWhatsApp}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow cursor-pointer transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share via WhatsApp</span>
          </button>

          <button
            onClick={() => setLoanCalculatorOpen(false)}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
