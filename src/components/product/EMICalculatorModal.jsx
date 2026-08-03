import React, { useState, useEffect } from 'react';
import { X, Calculator } from 'lucide-react';

export default function EMICalculatorModal({ price, onClose }) {
  const [tenure, setTenure] = useState(12);
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const banks = ['HDFC Bank', 'ICICI Bank', 'Axis Bank', 'SBI Card', 'Kotak Mahindra'];
  const tenures = [3, 6, 9, 12, 18, 24];

  const calculateEmi = (months) => {
    const rate = months <= 6 ? 0 : 0.14 / 12;
    if (rate === 0) {
      return Math.round(price / months);
    }
    const emi = (price * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
    return Math.round(emi);
  };

  const currentEmi = calculateEmi(tenure);
  const totalCost = currentEmi * tenure;
  const interestCharged = totalCost - price;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#050505]/85 backdrop-blur-[30px] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[#0D1117] border border-white/[0.08] text-[#F8F8F8] rounded-[28px] max-w-lg w-full p-7 shadow-[0_30px_70px_rgba(0,0,0,0.95)] relative">
        
        <div className="flex items-center justify-between pb-5 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-white/[0.04] border border-[#D4AF37]/40 text-[#D4AF37]">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-[#F8F8F8]">0% No Cost EMI Calculator</h3>
              <p className="text-xs text-[#B8BDC8] font-mono">Balaji Mobile Showroom Concierge Financing</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/[0.05] text-[#B8BDC8]" title="Press ESC to close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6 py-5">
          
          {/* Select Bank */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-[0.2em] text-[#D4AF37] mb-2.5">Select Partner Bank</label>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {banks.map(bank => (
                <button
                  key={bank}
                  onClick={() => setSelectedBank(bank)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-medium border shrink-0 transition-all duration-300 ${
                    selectedBank === bank
                      ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#E7C76A] font-bold'
                      : 'bg-white/[0.04] border-white/[0.08] text-[#B8BDC8] hover:text-[#F8F8F8]'
                  }`}
                >
                  {bank}
                </button>
              ))}
            </div>
          </div>

          {/* Select Tenure */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-[0.2em] text-[#D4AF37] mb-2.5">Select Repayment Tenure</label>
            <div className="grid grid-cols-3 gap-3">
              {tenures.map(m => {
                const emi = calculateEmi(m);
                const isNoCost = m <= 6;
                return (
                  <button
                    key={m}
                    onClick={() => setTenure(m)}
                    className={`p-3.5 rounded-2xl border text-center transition-all duration-300 ${
                      tenure === m
                        ? 'bg-gradient-to-r from-[#0FAE72] to-[#0B8F5C] text-white border-transparent font-bold shadow-lg'
                        : 'bg-white/[0.04] border-white/[0.08] text-[#F8F8F8] hover:border-[#D4AF37]/50'
                    }`}
                  >
                    <div className="text-sm font-display">{m} Months</div>
                    <div className="text-xs font-mono font-bold mt-1">₹{emi.toLocaleString('en-IN')}/mo</div>
                    {isNoCost && (
                      <span className="inline-block text-[9px] px-1.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#E7C76A] font-mono mt-1 font-bold">
                        NO COST EMI
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Summary Box */}
          <div className="p-4 rounded-2xl bg-[#050505] border border-white/[0.08] space-y-2 font-mono text-xs">
            <div className="flex justify-between text-[#B8BDC8]">
              <span>Device Price:</span>
              <span className="text-[#F8F8F8] font-bold">₹{price.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-[#B8BDC8]">
              <span>Partner Bank:</span>
              <span className="text-[#F8F8F8] font-bold">{selectedBank}</span>
            </div>
            <div className="flex justify-between text-[#B8BDC8]">
              <span>Interest Rate:</span>
              <span className={tenure <= 6 ? "text-[#0FAE72] font-bold" : "text-[#D4AF37] font-bold"}>
                {tenure <= 6 ? "0% No Cost" : "14% p.a."}
              </span>
            </div>
            {interestCharged > 0 && (
              <div className="flex justify-between text-[#B8BDC8]">
                <span>Interest Charge:</span>
                <span className="text-[#D4AF37] font-bold">+ ₹{interestCharged.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="pt-2 border-t border-white/[0.08] flex justify-between text-[#F8F8F8] font-bold text-sm font-display">
              <span>Monthly Installment:</span>
              <span className="text-[#0FAE72]">₹{currentEmi.toLocaleString('en-IN')}/mo</span>
            </div>
          </div>

        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-white/[0.05] hover:bg-white/[0.08] text-[#F8F8F8] font-bold text-xs font-mono transition"
        >
          Close Calculator (ESC)
        </button>

      </div>
    </div>
  );
}
