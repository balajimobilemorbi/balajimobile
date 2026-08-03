import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, Truck, RotateCcw, Headphones, Send, 
  MapPin, Phone, Mail, Award, CheckCircle2, Recycle
} from 'lucide-react';
import { storeCMS } from '../../services/storeCMS';
import { EMBEDDED_BM_LOGO } from '../../assets/embeddedAssets';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const settings = storeCMS.getSettings();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(''); }
  };

  return (
    <footer className="bg-[#050505] text-[#F8F8F8] border-t border-white/[0.08] pt-20 pb-12 relative overflow-hidden">
      
      {/* Ambient Lighting Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#0FAE72]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Showroom Trust Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-16 border-b border-white/[0.08]">
          {[
            { icon: <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />, title: '100% Sealed Genuine', sub: 'Official Brand Manufacturer Warranty' },
            { icon: <Truck className="w-6 h-6 text-[#D4AF37]" />, title: 'Insured White-Glove Shipping', sub: 'Shiprocket & BlueDart Express Delivery' },
            { icon: <RotateCcw className="w-6 h-6 text-[#D4AF37]" />, title: '7-Day Replacement Guarantee', sub: 'Hassle-Free Store Concierge Exchange' },
            { icon: <Headphones className="w-6 h-6 text-[#D4AF37]" />, title: 'VIP Concierge Desk', sub: 'Personalized Smartphone Advisory' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-5 rounded-[24px] bg-[#0D1117] border border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-[#D4AF37]/30">
                {item.icon}
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#F8F8F8] font-display">
                  {item.title}
                </h4>
                <p className="text-xs text-[#B8BDC8] mt-0.5 font-sans">
                  {item.sub}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 py-16 border-b border-white/[0.08]">

          {/* Brand & Newsletter */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl overflow-hidden shadow-lg border border-[#D4AF37]/50">
                <img src="/bm-logo.png?v=3" alt="Balaji Mobile Logo"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = EMBEDDED_BM_LOGO; }} />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-2xl tracking-tight text-[#F8F8F8]">
                  BALAJI MOBILE
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-[#B8BDC8]">
                  LUXURY SHOWROOM
                </span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed pr-4 text-[#B8BDC8] font-sans">
              {settings.tagline || "Morbi's premier luxury e-commerce showroom for flagship smartphones, 360° product view, official manufacturer warranty & instant trade-in exchange at Gujarat, India."}
            </p>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-mono uppercase tracking-[0.2em] font-bold text-[#D4AF37]">
                VIP Concierge & Price Drop Alerts
              </h4>
              {subscribed ? (
                <div className="flex items-center gap-2 text-[#F8F8F8] text-sm bg-white/[0.05] border border-[#0FAE72] p-4 rounded-2xl">
                  <CheckCircle2 className="w-5 h-5 text-[#0FAE72]" />
                  <span>You are subscribed to Balaji Mobile VIP Concierge!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input type="email" required
                    placeholder="Enter your VIP email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl text-sm focus:outline-none bg-[#0D1117] border border-white/[0.08] focus:border-[#D4AF37] text-[#F8F8F8] placeholder-[#B8BDC8]"
                  />
                  <button type="submit"
                    className="px-6 py-3 rounded-2xl text-white font-bold transition-all duration-300 flex items-center gap-2 text-sm bg-gradient-to-r from-[#0FAE72] to-[#0B8F5C] hover:from-[#D4AF37] hover:to-[#E7C76A] hover:text-[#050505] shadow-[0_4px_20px_rgba(15,174,114,0.3)] shrink-0"
                  >
                    <span>Join</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] font-bold text-[#F8F8F8]">
              Explore Showroom
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { to: '/products', label: 'All Flagships' },
                { to: '/second-hand', label: 'Certified Pre-Owned', icon: <Recycle className="w-3.5 h-3.5 text-[#0FAE72]" /> },
                { to: '/products?category=flagship-titans', label: 'Flagship Titans' },
                { to: '/products?category=foldables-flips', label: 'Foldables & Flips' },
                { to: '/compare', label: 'Compare Devices' },
                { to: '/stores', label: 'Morbi Lounge' },
                { to: '/blogs', label: 'Tech Editorial' },
              ].map(item => (
                <li key={item.to}>
                  <Link to={item.to} className="flex items-center gap-1.5 transition-colors duration-300 text-[#B8BDC8] hover:text-[#D4AF37]">
                    {item.icon}{item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Support */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] font-bold text-[#F8F8F8]">
              Customer Support
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                { to: '/account', label: 'Customer Account & Orders' },
                { to: '/admin', label: '🔑 Store Owner Panel (Admin CMS)' },
                { to: '/account?tab=orders', label: 'Track Delivery' },
                { to: '/faq', label: 'Customer FAQ' },
                { to: '/privacy-policy', label: 'Privacy Policy' },
                { to: '/terms', label: 'Terms of Service' },
                { to: '/shipping-policy', label: 'White-Glove Shipping' },
                { to: '/return-policy', label: 'Return & Guarantee' },
              ].map(item => (
                <li key={item.to}>
                  <Link to={item.to} className="transition-colors duration-300 text-[#B8BDC8] hover:text-[#D4AF37]">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] font-bold text-[#F8F8F8]">
              Morbi Flagship Store
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-2.5 text-[#B8BDC8]">
                <MapPin className="w-4 h-4 shrink-0 mt-1 text-[#D4AF37]" />
                <span>{settings.address || "Sanala Road, Near Sky Mall, Morbi, Gujarat 363641, India"}</span>
              </li>
              <li className="flex items-center gap-2.5 text-[#B8BDC8]">
                <Phone className="w-4 h-4 shrink-0 text-[#0FAE72]" />
                <a href={`tel:${settings.supportPhone || '7990648756'}`} className="hover:text-[#D4AF37] font-mono font-bold text-[#F8F8F8]">
                  +91 {settings.supportPhone || '79906 48756'}
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-[#B8BDC8]">
                <Mail className="w-4 h-4 shrink-0 text-[#D4AF37]" />
                <a href={`mailto:${settings.supportEmail || 'balajimorbi5@gmail.com'}`} className="hover:text-[#D4AF37] font-mono text-[#F8F8F8]">
                  {settings.supportEmail || 'balajimorbi5@gmail.com'}
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-xs font-mono text-[#B8BDC8] pt-1">
                <Award className="w-4 h-4 text-[#0FAE72] shrink-0" />
                <span>GSTIN: {settings.gstNumber || '24AAACB1234C1Z5'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#B8BDC8]">
          <p>© {new Date().getFullYear()} Balaji Mobile Showroom. All rights reserved.</p>
          <div className="flex items-center gap-2 flex-wrap justify-center font-mono text-[10px]">
            {['UPI / GPay / PhonePe', 'Razorpay', 'Stripe', '0% No Cost EMI', 'Cash on Delivery'].map(label => (
              <span key={label} className="px-2.5 py-1 rounded-full bg-[#0D1117] border border-white/[0.08] text-[#B8BDC8]">
                {label}
              </span>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
