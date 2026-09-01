import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, MessageSquare, MapPin, Sparkles, Send, Mail, Download, PackageCheck, Zap, ExternalLink,
  AlertTriangle, Image as ImageIcon, Camera
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { storeCMS } from '../../services/storeCMS';
import { notificationService } from '../../services/notificationService';
import { invoicePdfService } from '../../services/invoicePdfService';

/**
 * High-Energy Firecrackers (ફટાકડા) Celebration Animation
 */
const triggerFirecrackersCelebration = () => {
  const duration = 3500;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 35, spread: 360, ticks: 70, zIndex: 99999 };

  const randomInRange = (min, max) => Math.random() * (max - min) + min;

  // Immediate central big burst
  confetti({
    particleCount: 120,
    spread: 100,
    origin: { y: 0.4 },
    colors: ['#D4AF37', '#0FAE72', '#FF4500', '#FFD700', '#00E5FF', '#E7C76A']
  });

  // Continuous side firecrackers cannons
  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 40 * (timeLeft / duration);

    // Left firecracker cannon
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: ['#D4AF37', '#0FAE72', '#FF4500', '#FFD700', '#00E5FF']
    });

    // Right firecracker cannon
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: ['#D4AF37', '#0FAE72', '#FF4500', '#FFD700', '#00E5FF']
    });
  }, 300);
};

/**
 * Web Audio API Celebratory Sound Fanfare
 */
const playCelebratorySound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    // Sequence of celebratory fanfare notes (C5 -> E5 -> G5 -> C6)
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.12);
      osc.stop(ctx.currentTime + idx * 0.12 + 0.35);
    });
  } catch (e) {}
};

export default function OrderSuccessModal({ order, onClose }) {
  const [waCountdown, setWaCountdown] = useState(3);
  const [waAutoOpened, setWaAutoOpened] = useState(false);

  if (!order) return null;

  const whatsappLinks = storeCMS.getWhatsAppLinks(order);
  const settings = storeCMS.getSettings();
  const ownerPhone = settings.supportPhone || '+91 79906 48756';
  const cleanOwnerPhone = (settings.supportPhone || '7990648756').replace(/[^0-9]/g, '');
  const fullOwnerPhone = cleanOwnerPhone.startsWith('91') ? cleanOwnerPhone : `91${cleanOwnerPhone}`;

  const isOnlinePayment = order.paymentMethod !== 'Cash on Delivery';

  const waScreenshotUrl = `https://wa.me/${fullOwnerPhone}?text=${encodeURIComponent(
    `📸 *BALAJI MOBILE — PAYMENT SCREENSHOT & VERIFICATION PROOF*\n` +
    `────────────────────────────────────────\n` +
    `🆔 *Order ID:* #${order.id}\n` +
    `👤 *Customer:* ${order.customerName} (+91 ${order.phone})\n` +
    `💰 *Amount Paid:* ₹${order.totalAmount.toLocaleString('en-IN')}\n` +
    `💳 *Payment Mode:* ${order.paymentMethod}\n` +
    `🔢 *UPI UTR / Reference ID:* ${order.paymentId || 'Attached'}\n\n` +
    `📎 *Clarification:* Hello Balaji Mobile! Here is my payment screenshot for bank verification. Please confirm my order and share dispatch details.`
  )}`;

  useEffect(() => {
    try {
      // 1. Launch Firecrackers (ફટાકડા) Celebration Burst
      triggerFirecrackersCelebration();

      // 2. Play celebratory audio sound
      playCelebratorySound();

      // 3. Automatically dispatch Real Email Bill to Customer from Balaji Mobile Email
      notificationService.dispatchOrderNotifications(order);
    } catch (e) {
      console.warn('Error in OrderSuccessModal effect:', e);
    }

    // 4. Automatically open WhatsApp AFTER customer sees the Congrats modal
    const waTimer = setTimeout(() => {
      try {
        window.open(whatsappLinks.ownerWhatsAppUrl, '_blank');
        setWaAutoOpened(true);
      } catch (e) {}
    }, 2500);

    const cdInterval = setInterval(() => {
      setWaCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 900);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Lock body scroll when modal is open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      clearTimeout(waTimer);
      clearInterval(cdInterval);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [order, onClose]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-sans bm-modal-overlay animate-in fade-in duration-200"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.88)', backdropFilter: 'blur(16px)' }}
    >
      <div 
        className="bg-[#0D1117] border-2 border-[#D4AF37]/50 text-[#F8F8F8] rounded-[28px] sm:rounded-[32px] max-w-lg sm:max-w-xl w-full p-4 sm:p-6 space-y-4 sm:space-y-5 shadow-[0_25px_80px_rgba(0,0,0,0.95)] relative my-auto max-h-[92vh] overflow-y-auto bm-modal-card"
        style={{ backgroundColor: '#0D1117' }}
      >
        
        {/* Top Celebration Banner - 100% English */}
        <div className="bg-gradient-to-r from-[#D4AF37]/20 via-[#0FAE72]/20 to-[#D4AF37]/20 border border-[#D4AF37]/40 rounded-xl py-2 px-3 text-center">
          <span className="font-mono text-[11px] sm:text-xs font-black tracking-wider text-[#E7C76A] uppercase flex items-center justify-center gap-1.5">
            <span>🎆</span> <span>🎇</span>
            <span>CONGRATULATIONS! ORDER PLACED SUCCESSFULLY!</span>
            <span>🎇</span> <span>🎆</span>
          </span>
        </div>

        {/* Header Icon */}
        <div className="text-center space-y-2 relative z-10 pt-1">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#0FAE72]/20 to-[#D4AF37]/20 border-2 border-[#0FAE72] text-[#0FAE72] flex items-center justify-center mx-auto shadow-[0_0_35px_rgba(15,174,114,0.4)] animate-bounce duration-1000">
            <CheckCircle2 className="w-9 h-9 sm:w-11 sm:h-11 text-[#0FAE72]" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#0FAE72]/15 border border-[#0FAE72]/40 text-[#0FAE72] text-[11px] font-mono font-bold mb-1.5 shadow-inner">
              <Zap className="w-3.5 h-3.5 fill-[#0FAE72] animate-pulse" />
              <span>{isOnlinePayment ? 'ONLINE PAYMENT SUBMITTED — UNDER VERIFICATION' : 'PAYMENT CONFIRMED & INVOICE GENERATED'}</span>
            </div>

            <h2 className="font-display font-black text-xl sm:text-2xl text-[#F8F8F8] tracking-tight">
              Order Successfully Acquired! 🎉
            </h2>
            
            <p className="text-xs text-[#B8BDC8] font-sans mt-0.5">
              Thank you for choosing <strong>Balaji Mobile — Morbi Luxury Showroom!</strong>
            </p>
          </div>
        </div>

        {/* SOLID HIGH-CONTRAST RED WARNING SECTION */}
        {isOnlinePayment && (
          <div 
            className="p-4 sm:p-5 rounded-2xl border-2 border-red-500 shadow-[0_10px_35px_rgba(220,38,38,0.35)] space-y-3 font-mono text-xs relative z-10 bm-solid-red-card"
            style={{ backgroundColor: '#200508', borderColor: '#EF4444' }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 animate-bounce" />
                <span className="font-black text-white text-xs sm:text-sm uppercase tracking-wide">
                  CRITICAL PAYMENT VERIFICATION WARNING
                </span>
              </div>
              <span className="bg-red-600 text-white text-[9.5px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 shadow-sm">
                VERIFYING BANK
              </span>
            </div>

            <p className="text-red-100 text-xs sm:text-[13px] leading-relaxed font-sans font-medium">
              When you pay using an online transaction, the <strong>Owner of Balaji Mobile</strong> checks and verifies if the payment is received and fulfilled in the store's official bank account. Your order will be confirmed &amp; dispatched IF AND ONLY IF payment is verified; otherwise, your order will fail or be cancelled.
            </p>

            {order.paymentScreenshot ? (
              <div className="pt-2 border-t border-red-500/40 flex items-center justify-between text-[11px] text-emerald-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Payment screenshot proof attached with order
                </span>
                <span className="text-red-300 text-[10px]">Sent to Owner</span>
              </div>
            ) : (
              <div className="pt-2 border-t border-red-500/40 text-[11px] text-amber-300 font-sans font-semibold flex items-center gap-1.5">
                <span>📸 Please share your payment screenshot on WhatsApp below for instant verification.</span>
              </div>
            )}
          </div>
        )}

        {/* AUTOMATIC EMAIL BILL & WHATSAPP STATUS BANNER */}
        <div className="p-3.5 rounded-2xl bg-[#050505] border border-[#0FAE72]/40 space-y-2 font-mono text-xs shadow-md">
          <div className="flex items-center justify-between text-[#0FAE72] font-bold text-[11px]">
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#0FAE72] animate-pulse" />
              <span>AUTOMATIC BILL EMAIL DISPATCHED</span>
            </div>
            <span className="bg-[#0FAE72]/20 text-[#0FAE72] text-[9px] px-2 py-0.5 rounded-full border border-[#0FAE72]/40">SENT</span>
          </div>

          <p className="text-[#B8BDC8] text-[10.5px] leading-relaxed">
            ✉️ Official Tax Invoice &amp; Bill automatically emailed to: <br/>
            <span className="text-[#E7C76A] font-bold font-sans underline">{order.email || 'Customer Email Inbox'}</span> directly from <strong className="text-[#F8F8F8]">balajimorbi5@gmail.com</strong>.
          </p>

          <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-[10px] text-[#D4AF37]">
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3 text-[#D4AF37]" />
              WhatsApp Concierge Link:
            </span>
            <span className="font-bold">
              {waAutoOpened ? '✅ Auto-Opened WhatsApp Tab' : `Opening WhatsApp in ${waCountdown}s...`}
            </span>
          </div>
        </div>

        {/* Order Details Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#050505] border border-white/[0.08] space-y-3 text-xs font-mono relative z-10 shadow-lg">
          <div className="flex justify-between items-center pb-2.5 border-b border-white/[0.08]">
            <div>
              <span className="text-[#B8BDC8] uppercase font-bold text-[9.5px]">Official Order Reference</span>
              <h4 className="font-bold text-[#D4AF37] text-sm sm:text-base font-display">#{order.id}</h4>
            </div>
            <div className="text-right">
              <span className="text-[#B8BDC8] uppercase font-bold text-[9.5px]">Total Amount</span>
              <h4 className="font-bold text-[#0FAE72] text-sm sm:text-base font-display">₹{order.totalAmount.toLocaleString('en-IN')}</h4>
            </div>
          </div>

          {/* Payment & UTR Details */}
          <div className="flex justify-between items-center text-[11px] pb-2 border-b border-white/[0.08]">
            <span className="text-[#B8BDC8]">Payment Mode:</span>
            <span className="text-[#F8F8F8] font-bold">{order.paymentMethod} {order.paymentId ? `(UTR: ${order.paymentId})` : ''}</span>
          </div>

          {/* Delivery Location */}
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-[#0FAE72] shrink-0 mt-0.5" />
            <div>
              <span className="text-[#B8BDC8] font-bold text-[11px]">Delivery Address:</span>
              <p className="text-[#F8F8F8] mt-0.5 text-[11px] leading-snug">
                <strong>{order.customerName}</strong> ({order.phone})<br />
                {order.address}, {order.city}, {order.district}, {order.state} - {order.pincode}
              </p>
            </div>
          </div>

          {/* Items Purchased */}
          <div className="space-y-1.5 pt-2 border-t border-white/[0.08]">
            <span className="text-[#B8BDC8] font-bold text-[11px]">Acquired Device(s):</span>
            <div className="space-y-1">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-[#F8F8F8] bg-white/[0.02] p-1.5 rounded-lg border border-white/[0.05] text-[11px]">
                  <span className="truncate pr-2 font-bold">{item.title} ({item.quantity}x)</span>
                  <span className="font-bold shrink-0 text-[#E7C76A]">₹{(item.bmPrice * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Estimate */}
          <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-[10.5px]">
            <span className="text-[#B8BDC8]">Est. Delivery:</span>
            <span className="text-[#F8F8F8] font-bold flex items-center gap-1">
              <PackageCheck className="w-3.5 h-3.5 text-[#0FAE72]" />
              2-3 Days via Shiprocket / BlueDart
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 font-mono text-xs relative z-10">
          {/* Direct WhatsApp Screenshot Share Button */}
          <a
            href={waScreenshotUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-[0_4px_25px_rgba(37,211,102,0.35)] transition flex items-center justify-center gap-2"
          >
            <Camera className="w-4 h-4 text-white" />
            <span>📸 Send Payment Screenshot &amp; Clarification on WhatsApp</span>
          </a>

          <button
            onClick={() => invoicePdfService.downloadInvoicePdf(order)}
            className="w-full py-3 rounded-2xl bg-white/[0.05] border border-white/[0.08] hover:border-[#0FAE72]/50 text-[#0FAE72] font-bold font-sans text-xs shadow-md transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>📄 Download Official GST Tax Invoice (PDF)</span>
          </button>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-2.5 pt-1 font-mono text-xs relative z-10">
          <Link
            to="/account?tab=orders"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-white/[0.04] text-[#F8F8F8] font-bold text-center border border-white/[0.08] hover:border-[#D4AF37]/50 transition text-[11px]"
          >
            Track Order
          </Link>

          <Link
            to="/products"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E7C76A] text-[#050505] font-bold text-center hover:opacity-90 transition text-[11px]"
          >
            Explore More
          </Link>
        </div>

      </div>
    </div>
  );
}
