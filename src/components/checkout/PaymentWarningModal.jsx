import React, { useState, useEffect } from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2, ArrowRight, X, Lock } from 'lucide-react';

export default function PaymentWarningModal({ isOpen, onClose, onConfirm, totalAmount = 0 }) {
  const [agreed, setAgreed] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto font-sans bm-modal-overlay animate-in fade-in duration-200"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.88)', backdropFilter: 'blur(16px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div 
        className="bg-[#0D1117] border-2 border-red-500 text-[#F8F8F8] rounded-[28px] max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-[0_25px_80px_rgba(0,0,0,0.95)] relative my-auto overflow-hidden bm-modal-card"
        style={{ backgroundColor: '#0D1117' }}
      >
        
        {/* Top Header Badge */}
        <div 
          className="rounded-xl py-2 px-3.5 text-center flex items-center justify-center gap-2 font-mono text-xs font-black uppercase tracking-wider text-red-300 border border-red-500/50"
          style={{ backgroundColor: '#2D060A' }}
        >
          <ShieldAlert className="w-4 h-4 text-red-500 animate-bounce shrink-0" />
          <span>MANDATORY PAYMENT VERIFICATION NOTICE</span>
        </div>

        {/* Big Alert Icon & Title */}
        <div className="text-center space-y-2 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-red-500/20 border-2 border-red-500 text-red-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(239,68,68,0.4)]">
            <AlertTriangle className="w-9 h-9 text-red-500 animate-pulse" />
          </div>

          <h3 className="font-display font-black text-xl sm:text-2xl text-[#F8F8F8] tracking-tight">
            Important Prepayment Notice
          </h3>
          <p className="text-xs font-mono text-red-300">
            Please read and accept before proceeding to pay ₹{totalAmount.toLocaleString('en-IN')}
          </p>
        </div>

        {/* Solid High-Contrast Red Warning Box */}
        <div 
          className="p-4 sm:p-5 rounded-2xl border-2 border-red-500 text-red-100 text-xs sm:text-sm font-sans space-y-3 relative z-10 bm-solid-red-card"
          style={{ backgroundColor: '#200508', borderColor: '#EF4444' }}
        >
          <div className="flex items-start gap-2.5">
            <span className="text-base sm:text-lg">📢</span>
            <p className="leading-relaxed font-medium">
              When you pay using an online transaction (<strong>GPay, PhonePe, Paytm, QR, UPI, Cards, Net Banking</strong>), an instant notification is sent directly to the <strong>Owner of Balaji Mobile (+91 79906 48756)</strong>.
            </p>
          </div>

          <div className="flex items-start gap-2.5 pt-1">
            <span className="text-base sm:text-lg">⚠️</span>
            <p className="font-bold text-white leading-relaxed">
              The store owner will check and verify if the payment is received and fulfilled in the official bank account. Your order will be confirmed &amp; dispatched IF AND ONLY IF payment is verified; otherwise, your order will fail or be cancelled.
            </p>
          </div>

          <div className="flex items-start gap-2.5 text-[11px] sm:text-xs text-red-200 font-mono pt-1 border-t border-red-500/30">
            <span>📸</span>
            <p>
              You must upload your <strong>payment screenshot proof</strong> and enter your <strong>12-digit UPI UTR / Ref ID</strong> on the next screen for instant verification.
            </p>
          </div>
        </div>

        {/* Agreement Checkbox */}
        <label className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/[0.1] cursor-pointer text-xs font-mono text-[#F8F8F8] hover:bg-white/[0.06] transition relative z-10">
          <input 
            type="checkbox" 
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-4 h-4 accent-red-500 rounded cursor-pointer"
          />
          <span className="leading-snug">
            I understand and accept that my order is subject to bank credit verification by the Balaji Mobile owner.
          </span>
        </label>

        {/* Action Buttons */}
        <div className="space-y-2.5 font-mono text-xs relative z-10 pt-1">
          <button
            type="button"
            disabled={!agreed}
            onClick={() => {
              if (agreed) {
                onConfirm();
              }
            }}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold font-sans text-sm sm:text-base shadow-[0_0_30px_rgba(239,68,68,0.45)] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>OK, I UNDERSTAND &amp; PROCEED TO PAYMENT</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-white/[0.03] text-[#B8BDC8] hover:text-[#F8F8F8] hover:bg-white/[0.06] transition text-[11px] text-center"
          >
            Cancel / Go Back
          </button>
        </div>

      </div>
    </div>
  );
}
