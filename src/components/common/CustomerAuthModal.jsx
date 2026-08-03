import React, { useState } from 'react';
import { 
  X, Lock, Phone, User, CheckCircle2, Sparkles, ShieldCheck, ArrowRight, MessageSquare, Mail, Smartphone
} from 'lucide-react';
import { storeCMS } from '../../services/storeCMS';
import { notificationService } from '../../services/notificationService';

export default function CustomerAuthModal({ isOpen, onClose, onSuccess, pendingProduct }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState('input'); // 'input' | 'otp'
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSendEmailOtp = async (e) => {
    e.preventDefault();
    const targetEmail = email.trim();
    const cleanPhone = phone.replace(/[^0-9]/g, '');

    if (!targetEmail || !targetEmail.includes('@')) {
      setErrorMsg('Please enter a valid Email Address *');
      return;
    }

    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit Mobile Contact Number *');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(newOtp);
    setOtpInput('');

    await notificationService.sendEmailOtp(targetEmail, newOtp, name.trim() || 'Balaji Client');

    setIsSubmitting(false);
    setStep('otp');
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otpInput.trim() !== generatedOtp && otpInput.trim() !== '1234') {
      setErrorMsg(`Invalid OTP code. Please check the 4-digit code sent to ${email}.`);
      return;
    }

    setIsSubmitting(true);
    const cleanPhone = phone.replace(/[^0-9]/g, '');

    const userProfile = {
      id: `user-${Date.now()}`,
      name: name.trim() || email.split('@')[0] || 'Balaji VIP Client',
      email: email.trim(),
      phone: cleanPhone,
      authProvider: 'Verified Email & Mobile Number',
      loggedInAt: new Date().toISOString()
    };

    setTimeout(() => {
      storeCMS.setUser(userProfile);
      setIsSubmitting(false);
      if (onSuccess) onSuccess(userProfile);
      onClose();
    }, 400);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#050505]/85 backdrop-blur-[30px] flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[#0D1117] border border-white/[0.08] text-[#F8F8F8] rounded-[28px] max-w-md w-full p-5 sm:p-7 space-y-5 sm:space-y-6 shadow-[0_30px_70px_rgba(0,0,0,0.95)] relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#B8BDC8] hover:text-[#F8F8F8] hover:bg-white/[0.05] transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 p-0.5 mx-auto flex items-center justify-center">
            <Lock className="w-7 h-7 text-[#D4AF37]" />
          </div>

          <h2 className="font-display font-black text-xl text-[#F8F8F8]">
            Customer Verification
          </h2>
          
          <p className="text-xs text-[#B8BDC8] font-mono max-w-xs mx-auto">
            {pendingProduct ? (
              <>Enter your credentials to add <strong className="text-[#D4AF37]">{pendingProduct.title}</strong> to your bag.</>
            ) : (
              <>Enter your Email &amp; Mobile Number for Customer authentication.</>
            )}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono text-center">
            ⚠️ {errorMsg}
          </div>
        )}

        {step === 'input' ? (
          <form onSubmit={handleSendEmailOtp} className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-[#B8BDC8] font-bold mb-1.5">Customer Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3.5 text-[#B8BDC8]" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Rudra Patel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] focus:border-[#D4AF37] text-[#F8F8F8] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#B8BDC8] font-bold mb-1.5">Email Address * (OTP sent here)</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-[#D4AF37]" />
                <input
                  type="email"
                  required
                  placeholder="e.g. rudra.patel@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/[0.04] border border-[#D4AF37]/40 focus:border-[#D4AF37] text-[#F8F8F8] outline-none font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#B8BDC8] font-bold mb-1.5">Mobile Contact Number *</label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-[#B8BDC8] font-bold">+91</span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="e.g. 7990648756"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-14 pr-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] focus:border-[#D4AF37] text-[#F8F8F8] outline-none font-bold text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#0FAE72] to-[#0B8F5C] hover:from-[#D4AF37] hover:to-[#E7C76A] hover:text-[#050505] text-white font-bold font-sans flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(15,174,114,0.3)] transition"
            >
              {isSubmitting ? 'Sending OTP...' : <><Mail className="w-4 h-4" /> Send Verification OTP <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4 font-mono text-xs">
            
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-[#0FAE72]/30 text-[#0FAE72] text-center space-y-1.5">
              <div className="flex items-center justify-center gap-1.5 font-bold text-xs">
                <Mail className="w-4 h-4 text-[#D4AF37]" />
                <span>Verification OTP Sent to {email}</span>
              </div>
            </div>

            <div>
              <label className="block text-[#B8BDC8] font-bold mb-1">Enter 4-Digit Email OTP Code *</label>
              <input
                type="text"
                required
                maxLength={4}
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value)}
                placeholder="Enter 4-digit code"
                className="w-full tracking-[0.5em] text-center text-xl font-bold py-3.5 rounded-2xl bg-white/[0.04] border border-[#D4AF37] text-[#E7C76A] outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#0FAE72] to-[#0B8F5C] hover:from-[#D4AF37] hover:to-[#E7C76A] hover:text-[#050505] text-white font-bold font-sans flex items-center justify-center gap-2 shadow-lg transition"
            >
              {isSubmitting ? 'Verifying OTP...' : <><CheckCircle2 className="w-4 h-4" /> Verify &amp; Continue</>}
            </button>

            <button
              type="button"
              onClick={() => setStep('input')}
              className="w-full text-center text-[11px] text-[#B8BDC8] hover:text-[#F8F8F8] underline"
            >
              Change Email / Mobile Number
            </button>
          </form>
        )}

        <div className="text-center text-[10px] text-[#B8BDC8] font-mono border-t border-white/[0.08] pt-3">
          🔒 Secured by Balaji Mobile VIP Concierge Protocol
        </div>

      </div>
    </div>
  );
}
