import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  MapPin, Phone, Mail 
} from 'lucide-react';
import { storeCMS } from '../services/storeCMS';

export default function StaticPage() {
  const location = useLocation();
  const settings = storeCMS.getSettings();
  const path = location.pathname.substring(1);

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [sent, setSent] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setContactName('');
    setContactEmail('');
    setContactMsg('');
  };

  const pagesContent = {
    'faq': {
      title: "Frequently Asked Questions",
      subtitle: "Everything you need to know about acquiring smartphones at Balaji Mobile Showroom",
      content: (
        <div className="space-y-6 text-xs font-mono">
          <div className="p-5 rounded-2xl bg-[#050505] border border-white/[0.08] space-y-2">
            <h4 className="font-bold text-[#D4AF37] text-sm">Q: Are all smartphones 100% genuine with official brand warranty?</h4>
            <p className="text-[#B8BDC8]">Yes! Every device sold on Balaji Mobile is 100% brand new, factory sealed, and carries an official Indian manufacturer warranty valid at all authorized service centers across India.</p>
          </div>
          <div className="p-5 rounded-2xl bg-[#050505] border border-white/[0.08] space-y-2">
            <h4 className="font-bold text-[#D4AF37] text-sm">Q: How does the 0% No-Cost EMI work?</h4>
            <p className="text-[#B8BDC8]">We partner with HDFC, ICICI, Axis, and SBI cards to offer 3 and 6-month zero-interest EMI plans with instant approval at checkout.</p>
          </div>
          <div className="p-5 rounded-2xl bg-[#050505] border border-white/[0.08] space-y-2">
            <h4 className="font-bold text-[#D4AF37] text-sm">Q: Can I claim GST input tax credit for my business?</h4>
            <p className="text-[#B8BDC8]">Absolutely. Check the 'GST Tax Invoice' box during checkout, enter your 15-digit GSTIN, and our automated system generates a tax-compliant invoice immediately.</p>
          </div>
        </div>
      )
    },
    'about': {
      title: "About Balaji Mobile",
      subtitle: "Redefining Luxury Smartphone Showrooms in India",
      content: (
        <div className="space-y-4 text-xs font-mono text-[#B8BDC8] leading-relaxed">
          <p>Founded in 2024, Balaji Mobile is India’s premier luxury smartphone e-commerce showroom designed for clients who demand flagship excellence, transparent pricing, and instant doorstep delivery.</p>
          <p>We combine cutting-edge 360-degree interactive rotation inspection with insured express logistics to deliver an unboxing experience that feels truly premium.</p>
        </div>
      )
    },
    'contact': {
      title: "Contact Balaji Mobile Concierge",
      subtitle: "Our VIP Concierge team is available 24/7",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4 text-xs font-mono text-[#B8BDC8]">
            <p className="flex items-center gap-2.5"><MapPin className="w-4 h-4 text-[#D4AF37]" /> <span className="text-[#F8F8F8]">{settings.address}</span></p>
            <p className="flex items-center gap-2.5"><Phone className="w-4 h-4 text-[#0FAE72]" /> <span className="text-[#F8F8F8]">+91 {settings.supportPhone}</span></p>
            <p className="flex items-center gap-2.5"><Mail className="w-4 h-4 text-[#D4AF37]" /> <span className="text-[#F8F8F8]">{settings.supportEmail}</span></p>
          </div>

          <form onSubmit={handleContactSubmit} className="p-6 rounded-2xl bg-[#050505] border border-white/[0.08] space-y-4">
            {sent && <p className="text-[#0FAE72] font-mono text-xs font-bold">Message sent! Our concierge team will contact you shortly.</p>}
            <input
              type="text"
              required
              placeholder="Your Full Name"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-[#F8F8F8] outline-none focus:border-[#D4AF37] font-mono"
            />
            <input
              type="email"
              required
              placeholder="Email Address"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-[#F8F8F8] outline-none focus:border-[#D4AF37] font-mono"
            />
            <textarea
              required
              rows="3"
              placeholder="How can our concierge assist you?"
              value={contactMsg}
              onChange={(e) => setContactMsg(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-[#F8F8F8] outline-none focus:border-[#D4AF37] font-mono"
            />
            <button type="submit" className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0FAE72] to-[#0B8F5C] hover:from-[#D4AF37] hover:to-[#E7C76A] hover:text-[#050505] text-white font-bold text-xs font-mono transition">Send Message</button>
          </form>
        </div>
      )
    },
    'privacy-policy': {
      title: "Privacy Policy",
      subtitle: "How we protect and secure your data at Balaji Mobile",
      content: (
        <div className="space-y-4 text-xs font-mono text-[#B8BDC8]">
          <p>Balaji Mobile respects your privacy. We collect personal information (name, address, email, phone) strictly to process smartphone orders, fulfill shipping logistics, and issue GST tax invoices.</p>
          <p>We do not store full credit card CVVs or net banking passwords. All payments are processed securely via PCI-DSS compliant Razorpay and Stripe gateways.</p>
        </div>
      )
    },
    'terms': {
      title: "Terms & Conditions",
      subtitle: "Terms of service governing use of Balaji Mobile showroom platform",
      content: (
        <div className="space-y-4 text-xs font-mono text-[#B8BDC8]">
          <p>By placing an order on Balaji Mobile, you agree to these terms. Prices, stock availability, and flash sale discounts are subject to change without prior notice.</p>
          <p>All smartphone products sold are covered under official brand manufacturer warranty terms.</p>
        </div>
      )
    },
    'shipping-policy': {
      title: "Insured Shipping Policy",
      subtitle: "White-glove, tamper-proof courier delivery pan-India",
      content: (
        <div className="space-y-4 text-xs font-mono text-[#B8BDC8]">
          <p>We partner with Shiprocket, BlueDart, and Delhivery to ship all orders in tamper-evident sealed boxes with transit insurance.</p>
          <p>Standard delivery timeline is 1-3 business days depending on destination PIN code.</p>
        </div>
      )
    },
    'return-policy': {
      title: "Return & Replacement Policy",
      subtitle: "7-Day replacement guarantee for defective or damaged items",
      content: (
        <div className="space-y-4 text-xs font-mono text-[#B8BDC8]">
          <p>If your device arrives damaged or physically defective, submit a return request within 7 days of delivery for an immediate replacement or full refund.</p>
        </div>
      )
    }
  };

  const page = pagesContent[path] || pagesContent['about'];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 bg-[#050505] min-h-screen">
      <div className="pb-6 border-b border-white/[0.08]">
        <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37] font-bold">SHOWROOM INFORMATION</span>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-[#F8F8F8] mt-1">{page.title}</h1>
        <p className="text-xs text-[#B8BDC8] font-mono mt-1">{page.subtitle}</p>
      </div>

      <div className="p-8 sm:p-10 rounded-[28px] bg-[#0D1117] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        {page.content}
      </div>
    </div>
  );
}
