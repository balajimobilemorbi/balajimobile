import React, { useState, useEffect } from 'react';
import {
  Lock, QrCode, CreditCard, ShieldCheck, CheckCircle2,
  Smartphone, Building2, RefreshCw, X,
  Clock, Copy, ExternalLink, Check, AlertTriangle, Zap,
  Upload, Image as ImageIcon, Trash2, Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { storeCMS } from '../../services/storeCMS';
import { paymentVerifier } from '../../services/paymentVerifier';
import { EMBEDDED_PAYMENT_QR } from '../../assets/embeddedAssets';

const loadRazorpay = () => new Promise((resolve) => {
  if (window.Razorpay) { resolve(true); return; }
  const s = document.createElement('script');
  s.src = 'https://checkout.razorpay.com/v1/checkout.js';
  s.onload = () => resolve(true);
  s.onerror = () => resolve(false);
  document.body.appendChild(s);
});

export default function PaymentGatewayModal({ orderDetails, onSuccess, onCancel }) {
  const [activeTab, setActiveTab] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [countdown, setCountdown] = useState(600);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [error, setError] = useState('');
  
  // UPI / Screenshot & UTR state
  const [utrInput, setUtrInput] = useState('');
  const [screenshotPreview, setScreenshotPreview] = useState(null);

  // Card Inputs
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv]   = useState('');

  const settings  = storeCMS.getSettings();
  const upiId     = (settings.paymentUpiId && !settings.paymentUpiId.includes('balajimobile')
    ? settings.paymentUpiId : 'javiya36p36-1@oksbi').trim();
  const rzpKey    = settings.razorpayKey || '';

  const upiDeepLink  = paymentVerifier.generateUpiDeepLink(upiId, orderDetails.totalAmount);
  const dynamicQrUrl = paymentVerifier.generateDynamicQrUrl(upiId, orderDetails.totalAmount);

  useEffect(() => {
    loadRazorpay();
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const t = setInterval(() => setCountdown(p => { if (p <= 1) { clearInterval(t); return 0; } return p - 1; }), 1000);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prev;
      clearInterval(t);
    };
  }, [onCancel]);

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const handleScreenshotChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, JPEG, WEBP).');
      return;
    }
    setError('');

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 800;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL('image/jpeg', 0.75);
        setScreenshotPreview(compressed);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const completeOrder = (method, payId, pendingVerification = false, screenshot = null) => {
    const payStatus = pendingVerification
      ? `${method} — Pending Owner Bank Verification`
      : method === 'Cash on Delivery' ? 'Pending COD' : 'Paid & Verified';

    onSuccess({
      paymentId: payId || `PAY-${Date.now()}`,
      utrNumber: payId || '',
      status: pendingVerification ? 'PENDING_VERIFICATION' : 'SUCCESS',
      method,
      payStatus,
      pendingVerification,
      screenshot: screenshot || screenshotPreview || null
    });
  };

  const handleUpiIPaid = () => {
    if (!utrInput && !screenshotPreview) {
      setError('Please enter your 12-digit UPI UTR number or upload payment screenshot to verify your payment.');
      return;
    }

    if (utrInput && utrInput.trim().length > 0) {
      const check = paymentVerifier.verifyUtrNumber(utrInput, orderDetails.totalAmount);
      if (!check.valid && !screenshotPreview) {
        setError(check.message);
        return;
      }
    }

    setError('');
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      try { confetti({ particleCount: 120, spread: 80 }); } catch (_) {}
      completeOrder('UPI / GPay / PhonePe', utrInput || `UPI-${Date.now()}`, true, screenshotPreview);
    }, 1200);
  };

  const handleCardPay = () => {
    if (!cardNumber || cardNumber.length < 16 || !cardExpiry || !cardCvv) {
      setError('Please enter a valid 16-digit card number, expiry and CVV.');
      return;
    }
    setError('');
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      try { confetti({ particleCount: 120, spread: 80 }); } catch (_) {}
      completeOrder('Credit / Debit Card', `CARD-${Date.now()}`, true, screenshotPreview);
    }, 1800);
  };

  const handleNetBankingPay = (bank) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      try { confetti({ particleCount: 120, spread: 80 }); } catch (_) {}
      completeOrder(`Net Banking (${bank})`, `NB-${Date.now()}`, true, screenshotPreview);
    }, 1800);
  };

  const handleRazorpay = async () => {
    setError('');
    if (!rzpKey) { setError('Razorpay Key not configured. Please choose UPI / GPay QR mode above.'); return; }
    setIsProcessing(true);
    const ok = await loadRazorpay();
    if (!ok) { setError('Could not load Razorpay. Check internet connection.'); setIsProcessing(false); return; }
    const rzp = new window.Razorpay({
      key: rzpKey,
      amount: orderDetails.totalAmount * 100,
      currency: 'INR',
      name: 'Balaji Mobile Showroom',
      description: 'Flagship Smartphone Acquisition',
      theme: { color: '#D4AF37' },
      prefill: { name: orderDetails.customerName, email: orderDetails.email, contact: orderDetails.phone },
      handler: (res) => {
        setIsProcessing(false);
        try { confetti({ particleCount: 150, spread: 90 }); } catch (_) {}
        completeOrder('Razorpay (Verified)', res.razorpay_payment_id, false, screenshotPreview);
      },
      modal: { ondismiss: () => { setIsProcessing(false); setError('Payment cancelled. Please try again.'); } },
    });
    rzp.on('payment.failed', (r) => { setIsProcessing(false); setError(`Payment failed: ${r.error.description}`); });
    rzp.open();
  };

  const TABS = [
    { id: 'upi',        icon: <QrCode      className="w-3.5 h-3.5" />, label: 'UPI / GPay' },
    { id: 'card',       icon: <CreditCard  className="w-3.5 h-3.5" />, label: 'Card' },
    { id: 'netbanking', icon: <Building2   className="w-3.5 h-3.5" />, label: 'Net Banking' },
    { id: 'razorpay',   icon: <Zap         className="w-3.5 h-3.5" />, label: 'Razorpay' },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto font-sans bm-modal-overlay animate-in fade-in duration-200"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.88)', backdropFilter: 'blur(16px)' }}
    >
      <div 
        className="bg-[#0D1117] border-2 border-[#D4AF37]/40 text-[#F8F8F8] rounded-[28px] max-w-lg w-full shadow-[0_30px_80px_rgba(0,0,0,0.95)] relative my-auto overflow-hidden max-h-[92vh] flex flex-col bm-modal-card"
        style={{ backgroundColor: '#0D1117' }}
      >

        {/* Header */}
        <div className="bg-white/[0.03] p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/[0.05] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-[#F8F8F8] text-base">Balaji Mobile — VIP Payment Desk</h3>
              <p className="text-[11px] text-[#D4AF37] font-mono">Encrypted Client Checkout Portal</p>
            </div>
          </div>
          <button onClick={onCancel} className="p-2 rounded-full hover:bg-white/[0.05] text-[#B8BDC8]"><X className="w-5 h-5" /></button>
        </div>

        {/* Amount + Timer */}
        <div className="px-5 py-3 bg-[#050505] border-b border-white/[0.08] flex justify-between items-center text-xs font-mono shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[#B8BDC8]">Acquisition Total:</span>
            <span className="font-display font-black text-[#0FAE72] text-lg">₹{orderDetails.totalAmount.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#D4AF37]">
            <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="font-bold">{fmt(countdown)}</span>
          </div>
        </div>

        {/* MANDATORY WARNING NOTIFICATION PROMPT - SOLID RED */}
        <div 
          className="border-b-2 border-red-500 p-3.5 sm:px-5 py-3 flex items-start gap-3 text-[11.5px] font-mono text-red-100 shadow-lg shrink-0"
          style={{ backgroundColor: '#200508' }}
        >
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5 animate-bounce" />
          <p className="leading-snug">
            <strong className="text-red-400 font-black tracking-wide uppercase">🚨 CRITICAL OWNER VERIFICATION WARNING:</strong> When you pay online, the store owner (+91 79906 48756) is notified immediately to verify bank credit. Your order will be confirmed &amp; dispatched IF AND ONLY IF payment is verified in our bank account; otherwise the order will fail or be cancelled.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/[0.08] text-[11px] font-mono overflow-x-auto shrink-0">
          {TABS.map(t => (
            <button key={t.id} onClick={() => { setActiveTab(t.id); setError(''); }}
              className={`flex-1 min-w-[75px] py-3 text-center border-b-2 transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                activeTab === t.id
                  ? 'border-[#D4AF37] text-[#E7C76A] font-bold bg-white/[0.04]'
                  : 'border-transparent text-[#B8BDC8] hover:text-[#F8F8F8]'
              }`}>
              {t.icon}<span>{t.label}</span>
            </button>
          ))}
        </div>

        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">

          {/* UPI */}
          {activeTab === 'upi' && (
            <div className="space-y-4">
              <div className="text-center space-y-3">
                <div className="inline-block p-3 rounded-3xl bg-white border-2 border-[#D4AF37] shadow-xl">
                  <img src={EMBEDDED_PAYMENT_QR} alt="Balaji Mobile GPay QR"
                    className="w-44 h-44 object-contain mx-auto"
                    onError={e => { e.target.src = dynamicQrUrl; }} />
                  <div className="mt-1.5 text-[10px] font-mono font-bold bg-[#050505] text-[#E7C76A] px-3 py-1 rounded-full inline-block border border-[#D4AF37]">
                    🔒 LOCKED AMOUNT: ₹{orderDetails.totalAmount.toLocaleString('en-IN')}
                  </div>
                </div>

                <a href={upiDeepLink}
                  className="w-full py-2.5 rounded-2xl bg-white/[0.05] border border-white/[0.08] hover:border-[#D4AF37]/50 text-[#F8F8F8] hover:text-[#D4AF37] font-mono font-bold text-xs flex items-center justify-center gap-2 transition">
                  <Smartphone className="w-4 h-4 text-[#D4AF37]" />
                  <span>Open GPay / PhonePe / Paytm App</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <div className="flex items-center justify-center gap-2 text-xs font-mono">
                  <span className="text-[#B8BDC8]">UPI ID:</span>
                  <span className="font-bold text-[#D4AF37]">{upiId}</span>
                  <button onClick={() => { navigator.clipboard.writeText(upiId); setCopiedUpi(true); setTimeout(() => setCopiedUpi(false), 2000); }} className="p-1 rounded bg-white/[0.05]">
                    {copiedUpi ? <Check className="w-3 h-3 text-[#0FAE72]" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              {/* UTR Input Field */}
              <div>
                <label className="block text-[11px] font-mono text-[#D4AF37] uppercase mb-1 font-bold">
                  12-Digit UPI UTR / Transaction Reference No. *
                </label>
                <input 
                  type="text" 
                  maxLength={22}
                  placeholder="e.g. 4289 1029 3847"
                  value={utrInput} 
                  onChange={e => { setUtrInput(e.target.value); setError(''); }}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-xs font-mono focus:border-[#D4AF37] outline-none text-[#F8F8F8] tracking-widest text-center"
                />
              </div>

              {/* PAYMENT SCREENSHOT UPLOADER */}
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono text-[#E7C76A] font-bold flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#D4AF37]" />
                    <span>Upload Payment Screenshot (Proof) *</span>
                  </label>
                  {screenshotPreview && (
                    <span className="text-[10px] text-[#0FAE72] font-mono font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Attached
                    </span>
                  )}
                </div>

                {screenshotPreview ? (
                  <div className="relative rounded-xl border border-[#0FAE72]/50 bg-[#050505] p-2 flex items-center gap-3">
                    <img 
                      src={screenshotPreview} 
                      alt="Payment Proof Screenshot" 
                      className="w-16 h-16 object-cover rounded-lg border border-white/[0.1]" 
                    />
                    <div className="flex-1 min-w-0 font-mono text-[11px]">
                      <p className="text-[#0FAE72] font-bold">Screenshot Attached</p>
                      <p className="text-[#B8BDC8] text-[10px] truncate">Will be verified by Balaji Owner</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setScreenshotPreview(null)}
                      className="p-2 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition text-xs font-mono"
                      title="Remove Screenshot"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-3.5 border border-dashed border-[#D4AF37]/50 hover:border-[#D4AF37] rounded-xl bg-white/[0.02] cursor-pointer hover:bg-white/[0.04] transition group text-center">
                    <Upload className="w-5 h-5 text-[#D4AF37] group-hover:scale-110 transition duration-200" />
                    <span className="text-[11px] text-[#F8F8F8] font-mono font-bold mt-1">Click to Upload GPay / UPI Screenshot</span>
                    <span className="text-[10px] text-[#B8BDC8] font-mono">PNG, JPG, JPEG or WEBP</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleScreenshotChange} 
                      className="hidden" 
                    />
                  </label>
                )}
              </div>

              {error && (
                <p className="text-xs font-mono text-rose-400 flex items-center gap-1.5 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/30">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </p>
              )}

              <button onClick={handleUpiIPaid} disabled={isProcessing || countdown === 0}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#0FAE72] to-[#0B8F5C] hover:from-[#D4AF37] hover:to-[#E7C76A] hover:text-[#050505] text-white font-bold text-sm transition flex items-center justify-center gap-2 disabled:opacity-50 font-sans shadow-lg">
                {isProcessing
                  ? <><RefreshCw className="w-5 h-5 animate-spin" /><span>Submitting Payment Proof...</span></>
                  : <><CheckCircle2 className="w-5 h-5" /><span>I Have Paid ₹{orderDetails.totalAmount.toLocaleString('en-IN')} — Place Order</span></>}
              </button>
            </div>
          )}

          {/* Card */}
          {activeTab === 'card' && (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-[#D4AF37] uppercase mb-1 font-bold">16-Digit Card Number</label>
                <input type="text" maxLength="16" placeholder="4532 8912 3456 7890"
                  value={cardNumber} onChange={e => { setCardNumber(e.target.value.replace(/\D/g, '')); setError(''); }}
                  className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-sm font-mono focus:border-[#D4AF37] outline-none text-[#F8F8F8] tracking-widest" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-[#D4AF37] uppercase mb-1 font-bold">Expiry (MM/YY)</label>
                  <input type="text" maxLength="5" placeholder="12/28" value={cardExpiry} onChange={e => setCardExpiry(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-sm font-mono focus:border-[#D4AF37] outline-none text-[#F8F8F8]" />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-[#D4AF37] uppercase mb-1 font-bold">CVV</label>
                  <input type="password" maxLength="4" placeholder="•••" value={cardCvv} onChange={e => setCardCvv(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-sm font-mono focus:border-[#D4AF37] outline-none text-[#F8F8F8]" />
                </div>
              </div>
              {error && <p className="text-xs font-mono text-rose-400 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" />{error}</p>}
              <button onClick={handleCardPay} disabled={isProcessing}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#0FAE72] to-[#0B8F5C] hover:from-[#D4AF37] hover:to-[#E7C76A] hover:text-[#050505] text-white font-bold text-sm transition flex items-center justify-center gap-2 font-sans shadow-lg disabled:opacity-50">
                {isProcessing ? <><RefreshCw className="w-5 h-5 animate-spin" /><span>Processing Card...</span></> : <><CreditCard className="w-5 h-5" /><span>Pay ₹{orderDetails.totalAmount.toLocaleString('en-IN')} by Card</span></>}
              </button>
            </div>
          )}

          {/* Net Banking */}
          {activeTab === 'netbanking' && (
            <div className="space-y-4">
              <p className="text-xs font-mono text-[#B8BDC8]">Select partner bank:</p>
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                {['HDFC Bank','ICICI Bank','State Bank of India','Axis Bank','Kotak Bank','Bank of Baroda','Punjab National Bank','IndusInd Bank'].map(bank => (
                  <button key={bank} disabled={isProcessing}
                    onClick={() => handleNetBankingPay(bank)}
                    className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-[#F8F8F8] hover:border-[#D4AF37] text-left transition disabled:opacity-50 font-semibold">
                    {isProcessing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : bank}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Razorpay */}
          {activeTab === 'razorpay' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-[#0FAE72]/30 space-y-2">
                <div className="flex items-center gap-2 text-[#0FAE72] font-bold text-sm">
                  <ShieldCheck className="w-5 h-5" />
                  <span>100% Verified Gateway</span>
                </div>
                <p className="text-xs text-[#B8BDC8] font-mono">Real-time payment confirmation across Cards, UPI, Wallets &amp; NetBanking.</p>
              </div>
              {error && (
                <div className="space-y-2">
                  <p className="text-xs font-mono text-rose-400 flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" />{error}</p>
                  <button 
                    type="button" 
                    onClick={() => setActiveTab('upi')} 
                    className="w-full py-2.5 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37] text-[#E7C76A] text-xs font-mono font-bold hover:bg-[#D4AF37]/30 transition"
                  >
                    ⚡ Switch to Instant UPI QR Payment
                  </button>
                </div>
              )}
              <button onClick={handleRazorpay} disabled={isProcessing || countdown === 0}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#0FAE72] to-[#0B8F5C] hover:from-[#D4AF37] hover:to-[#E7C76A] hover:text-[#050505] text-white font-bold text-base transition flex items-center justify-center gap-2 disabled:opacity-50 font-sans shadow-lg">
                {isProcessing ? <><RefreshCw className="w-5 h-5 animate-spin" /><span>Opening Gateway...</span></> : <><Zap className="w-5 h-5" /><span>Pay ₹{orderDetails.totalAmount.toLocaleString('en-IN')} via Razorpay</span></>}
              </button>
            </div>
          )}

          <p className="text-[10px] text-center text-[#B8BDC8] font-mono pt-1">
            Balaji Mobile Showroom · Morbi, Gujarat · +91 {settings.supportPhone || '79906 48756'}
          </p>
        </div>
      </div>
    </div>
  );
}
