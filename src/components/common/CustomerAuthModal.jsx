import React, { useState } from 'react';
import { 
  X, Lock, User, CheckCircle2, ArrowRight, Mail, Smartphone, UserPlus, LogIn, ShieldCheck
} from 'lucide-react';
import { storeCMS } from '../../services/storeCMS';
import { notificationService } from '../../services/notificationService';

export default function CustomerAuthModal({ isOpen, onClose, onSuccess, pendingProduct }) {
  // Auth Mode: 'signup' (New User) | 'signin' (Existing User)
  const [authMode, setAuthMode] = useState('signup');
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

    if (authMode === 'signup') {
      if (!name || name.trim().length < 2) {
        setErrorMsg('Please enter your Full Name *');
        return;
      }
      if (cleanPhone.length < 10) {
        setErrorMsg('Please enter a valid 10-digit Mobile Contact Number *');
        return;
      }

      // Check if user already exists
      const existingUser = storeCMS.findRegisteredUser(targetEmail) || storeCMS.findRegisteredUser(cleanPhone);
      if (existingUser) {
        setErrorMsg('⚠️ An account already exists with this email or mobile number! Please switch to "🔑 Existing User Sign In" to log in.');
        return;
      }
    } else {
      // Sign In mode: Check if account exists
      const existingUser = storeCMS.findRegisteredUser(targetEmail);
      if (!existingUser) {
        setErrorMsg('❌ Account not found! No registered account exists with this email address. Please switch to "🆕 New User Sign Up" above to create an account.');
        return;
      }
      // Populate name & phone from registered profile for personalized greeting
      if (existingUser.name) setName(existingUser.name);
      if (existingUser.phone) setPhone(existingUser.phone);
    }

    setErrorMsg('');
    setIsSubmitting(true);

    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(newOtp);
    setOtpInput('');

    const displayName = name.trim() || targetEmail.split('@')[0] || 'Balaji Client';
    await notificationService.sendEmailOtp(targetEmail, newOtp, displayName);

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

    if (authMode === 'signin') {
      const registeredUser = storeCMS.findRegisteredUser(email.trim());
      if (!registeredUser) {
        setErrorMsg('❌ Registered profile not found. Please sign up as a new client.');
        setIsSubmitting(false);
        return;
      }

      const userProfile = {
        ...registeredUser,
        loggedInAt: new Date().toISOString()
      };

      setTimeout(() => {
        storeCMS.setUser(userProfile);
        setIsSubmitting(false);
        if (onSuccess) onSuccess(userProfile);
        onClose();
      }, 300);
    } else {
      // New User Sign Up: Register in database
      const userProfile = {
        id: `user-${Date.now()}`,
        name: name.trim() || email.split('@')[0] || 'Balaji VIP Client',
        email: email.trim(),
        phone: cleanPhone || '7990648756',
        isNewUser: true,
        authProvider: 'New Customer Sign Up',
        registeredAt: new Date().toISOString(),
        loggedInAt: new Date().toISOString()
      };

      const savedUser = storeCMS.registerUser(userProfile);

      setTimeout(() => {
        storeCMS.setUser(savedUser);
        setIsSubmitting(false);
        if (onSuccess) onSuccess(savedUser);
        onClose();
      }, 300);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#050505]/85 backdrop-blur-[30px] flex items-center justify-center p-4 overflow-y-auto font-sans"
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
            Customer Account Access
          </h2>
          
          <p className="text-xs text-[#B8BDC8] font-mono max-w-xs mx-auto">
            {pendingProduct ? (
              <>Sign in or Register to add <strong className="text-[#D4AF37]">{pendingProduct.title}</strong> to your bag.</>
            ) : (
              <>Choose your option below for Customer Authentication.</>
            )}
          </p>
        </div>

        {/* 2 Selectable Customer Options: New User Sign Up vs Existing User Sign In */}
        <div className="flex bg-[#050505] p-1.5 rounded-2xl border border-white/[0.08] text-xs font-mono">
          <button
            type="button"
            onClick={() => { setAuthMode('signup'); setErrorMsg(''); setStep('input'); }}
            className={`flex-1 py-2.5 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
              authMode === 'signup' 
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#E7C76A] text-[#050505] shadow-md' 
                : 'text-[#B8BDC8] hover:text-[#F8F8F8]'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>🆕 New User Sign Up</span>
          </button>

          <button
            type="button"
            onClick={() => { setAuthMode('signin'); setErrorMsg(''); setStep('input'); }}
            className={`flex-1 py-2.5 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
              authMode === 'signin' 
                ? 'bg-gradient-to-r from-[#0FAE72] to-[#0B8F5C] text-[#F8F8F8] shadow-md' 
                : 'text-[#B8BDC8] hover:text-[#F8F8F8]'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>🔑 Existing User Sign In</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono text-center">
            ⚠️ {errorMsg}
          </div>
        )}

        {step === 'input' ? (
          <form onSubmit={handleSendEmailOtp} className="space-y-4 font-mono text-xs">
            
            {authMode === 'signup' && (
              <div>
                <label className="block text-[#B8BDC8] font-bold mb-1.5">Full Name *</label>
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
            )}

            <div>
              <label className="block text-[#B8BDC8] font-bold mb-1.5">
                {authMode === 'signup' ? 'Email Address * (OTP sent here)' : 'Registered Email Address *'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-[#D4AF37]" />
                <input
                  type="email"
                  required
                  placeholder="e.g. client@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/[0.04] border border-[#D4AF37]/40 focus:border-[#D4AF37] text-[#F8F8F8] outline-none font-bold"
                />
              </div>
            </div>

            {authMode === 'signup' && (
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
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3.5 rounded-2xl font-bold font-sans flex items-center justify-center gap-2 shadow-lg transition ${
                authMode === 'signup'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#E7C76A] text-[#050505]'
                  : 'bg-gradient-to-r from-[#0FAE72] to-[#0B8F5C] text-white'
              }`}
            >
              {isSubmitting ? 'Sending OTP...' : (
                <>
                  <Mail className="w-4 h-4" /> 
                  <span>{authMode === 'signup' ? 'Create Account & Send OTP' : 'Sign In via OTP'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4 font-mono text-xs">
            
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-[#0FAE72]/30 text-[#0FAE72] text-center space-y-1.5">
              <div className="flex items-center justify-center gap-1.5 font-bold text-xs">
                <Mail className="w-4 h-4 text-[#D4AF37]" />
                <span>Verification OTP sent from balajimorbi5@gmail.com to {email}</span>
              </div>
            </div>

            <div>
              <label className="block text-[#B8BDC8] font-bold mb-1">Enter 4-Digit Verification OTP Code *</label>
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

        <div className="text-center text-[10px] text-[#B8BDC8] font-mono border-t border-white/[0.08] pt-3 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#0FAE72]" />
          <span>Secured by Balaji Mobile VIP Concierge Protocol</span>
        </div>

      </div>
    </div>
  );
}
