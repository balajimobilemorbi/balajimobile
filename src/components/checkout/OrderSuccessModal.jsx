import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, MessageSquare, MapPin, Sparkles, Send, Mail
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { storeCMS } from '../../services/storeCMS';
import { notificationService } from '../../services/notificationService';
import { invoicePdfService } from '../../services/invoicePdfService';

export default function OrderSuccessModal({ order, onClose }) {
  const [autoSentWhatsApp, setAutoSentWhatsApp] = useState(false);

  if (!order) return null;

  const whatsappLinks = storeCMS.getWhatsAppLinks(order);
  const settings = storeCMS.getSettings();
  const ownerPhone = settings.supportPhone || '+91 79906 48756';

  const emailSubject = encodeURIComponent(`Order Confirmation & Invoice Bill #${order.id} - Balaji Mobile`);
  const emailBody = encodeURIComponent(whatsappLinks.customerMsgText);
  const mailtoUrl = `mailto:${order.email}?subject=${emailSubject}&body=${emailBody}`;

  useEffect(() => {
    try {
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
      setTimeout(() => {
        confetti({ particleCount: 80, spread: 120, origin: { y: 0.6 } });
      }, 500);

      notificationService.dispatchOrderNotifications(order);
    } catch (e) {
      console.warn('Error in OrderSuccessModal effect:', e);
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [order, onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-[#050505]/85 backdrop-blur-[30px] flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="bg-[#0D1117] border border-white/[0.08] text-[#F8F8F8] rounded-[28px] max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-[0_30px_70px_rgba(0,0,0,0.95)] relative my-8">
        
        {/* Header Icon */}
        <div className="text-center space-y-3">
          <div className="w-20 h-20 rounded-full bg-[#0FAE72]/15 border-2 border-[#0FAE72] text-[#0FAE72] flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(15,174,114,0.4)]">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#E7C76A] text-xs font-mono font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PAYMENT CONFIRMED & ORDER PLACED</span>
            </div>

            <h2 className="font-display font-black text-2xl sm:text-3xl text-[#F8F8F8]">
              Order Successfully Acquired! 🎉
            </h2>
            
            <p className="text-sm text-[#B8BDC8] font-sans mt-1">
              Thank you for choosing <strong>Balaji Mobile — Morbi Luxury Showroom!</strong>
            </p>
          </div>
        </div>

        {/* Auto Notification Alert Banner */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-[#0FAE72]/30 space-y-1.5 text-xs font-mono">
          <div className="flex items-center gap-2 text-[#0FAE72] font-bold">
            <Send className="w-4 h-4 text-[#0FAE72] animate-pulse shrink-0" />
            <span>Order Details Dispatched to Owner WhatsApp ({ownerPhone})!</span>
          </div>
          <p className="text-[#B8BDC8] text-[11px] pl-6">
            ✅ Customer Phone, Address &amp; Items sent to Store Owner (+91 79906 48756)<br />
            ✅ Official GST Tax Invoice generated for ({order.email})
          </p>
        </div>

        {/* Order Details Card */}
        <div className="p-5 rounded-2xl bg-[#050505] border border-white/[0.08] space-y-4 text-xs font-mono">
          <div className="flex justify-between items-center pb-3 border-b border-white/[0.08]">
            <div>
              <span className="text-[#B8BDC8] uppercase">Order ID</span>
              <h4 className="font-bold text-[#D4AF37] text-base">#{order.id}</h4>
            </div>
            <div className="text-right">
              <span className="text-[#B8BDC8] uppercase">Total Amount</span>
              <h4 className="font-bold text-[#F8F8F8] text-base">₹{order.totalAmount.toLocaleString('en-IN')}</h4>
            </div>
          </div>

          {/* Delivery Location */}
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-[#0FAE72] shrink-0 mt-0.5" />
            <div>
              <span className="text-[#B8BDC8] font-bold">Delivery Address:</span>
              <p className="text-[#F8F8F8] mt-0.5">
                <strong>{order.customerName}</strong> ({order.phone})<br />
                {order.address}, {order.city}, {order.district}, {order.state} - {order.pincode}
              </p>
            </div>
          </div>

          {/* Items Purchased */}
          <div className="space-y-2 pt-2 border-t border-white/[0.08]">
            <span className="text-[#B8BDC8] font-bold">Acquired Devices:</span>
            <div className="space-y-1">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-[#F8F8F8]">
                  <span className="truncate pr-2">{item.title} ({item.quantity}x)</span>
                  <span className="font-bold shrink-0">₹{(item.bmPrice * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 font-mono text-xs">
          <button
            onClick={() => invoicePdfService.downloadInvoicePdf(order)}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#0FAE72] to-[#0B8F5C] hover:from-[#D4AF37] hover:to-[#E7C76A] hover:text-[#050505] text-white font-bold font-sans text-sm shadow-[0_4px_20px_rgba(15,174,114,0.35)] transition flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>📄 Download Official Tax Invoice (PDF)</span>
          </button>

          <a
            href={whatsappLinks.ownerWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:border-[#D4AF37]/50 text-[#D4AF37] font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
            <span>📱 Send Details to Concierge WhatsApp ({ownerPhone})</span>
          </a>

          <div className="grid grid-cols-2 gap-3">
            <a
              href={whatsappLinks.customerWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[#F8F8F8] font-bold hover:text-[#D4AF37] transition flex items-center justify-center gap-1.5 text-center"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Bill</span>
            </a>

            <a
              href={mailtoUrl}
              className="py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[#F8F8F8] font-bold hover:text-[#D4AF37] transition flex items-center justify-center gap-1.5 text-center"
            >
              <Mail className="w-4 h-4" />
              <span>Email Invoice</span>
            </a>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-3 pt-2 font-mono text-xs">
          <Link
            to="/account?tab=orders"
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl bg-white/[0.04] text-[#F8F8F8] font-bold text-center border border-white/[0.08] hover:border-[#D4AF37]/50 transition"
          >
            Track Order
          </Link>

          <Link
            to="/products"
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#E7C76A] text-[#050505] font-bold text-center hover:opacity-90 transition"
          >
            Explore More
          </Link>
        </div>

      </div>
    </div>
  );
}
