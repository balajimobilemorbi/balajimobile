import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Recycle, ShieldCheck, Tag, ArrowRight,
  BadgeCheck, Clock, Wrench
} from 'lucide-react';
import ProductCard from '../components/common/ProductCard';
import { storeCMS } from '../services/storeCMS';

export default function SecondHandPage() {
  const [products, setProducts] = useState(storeCMS.getSecondHandProducts());
  const [selectedBrand, setSelectedBrand] = useState('All');

  useEffect(() => {
    const handleUpdate = () => {
      setProducts(storeCMS.getSecondHandProducts());
    };
    window.addEventListener('bm_cms_update', handleUpdate);
    return () => window.removeEventListener('bm_cms_update', handleUpdate);
  }, []);

  const brands = ['All', ...new Set(products.map(p => p.brand))];
  const filtered = selectedBrand === 'All' ? products : products.filter(p => p.brand === selectedBrand);

  return (
    <div className="space-y-12 pb-24 bg-[#050505] min-h-screen">
      
      {/* Hero Banner for Second Hand */}
      <section className="relative bg-[#050505] py-20 px-4 overflow-hidden border-b border-white/[0.08]">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-[#D4AF37]/40 text-[#E7C76A] text-xs font-mono font-bold">
              <Recycle className="w-4 h-4 text-[#0FAE72]" />
              <span>BALAJI CERTIFIED PRE-OWNED</span>
            </div>

            <h1 className="font-display font-black text-4xl sm:text-6xl text-[#F8F8F8]">
              Certified Pre-Owned <span className="text-[#D4AF37]">Flagships</span>
            </h1>

            <p className="text-sm sm:text-base text-[#B8BDC8] max-w-2xl mx-auto leading-relaxed font-sans">
              Every pre-owned smartphone at Balaji Mobile is thoroughly inspected across 35 technical parameters.
              Includes GST invoice, original packaging, battery health rating &amp; showroom warranty.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-8 pt-4 text-xs font-mono">
              <span className="flex items-center gap-2 text-[#F8F8F8] font-semibold">
                <BadgeCheck className="w-4 h-4 text-[#0FAE72]" />
                Balaji Verified
              </span>
              <span className="flex items-center gap-2 text-[#F8F8F8] font-semibold">
                <Wrench className="w-4 h-4 text-[#D4AF37]" />
                35-Point Inspection
              </span>
              <span className="flex items-center gap-2 text-[#F8F8F8] font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#0FAE72]" />
                Showroom Warranty
              </span>
              <span className="flex items-center gap-2 text-[#F8F8F8] font-semibold">
                <Clock className="w-4 h-4 text-[#D4AF37]" />
                Battery Health Certified
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {brands.map(brand => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`px-6 py-3 rounded-2xl font-mono text-xs font-bold whitespace-nowrap transition-all duration-300 ${
                selectedBrand === brand
                  ? 'bg-gradient-to-r from-[#0FAE72] to-[#0B8F5C] text-white shadow-lg'
                  : 'bg-[#0D1117] text-[#B8BDC8] border border-white/[0.08] hover:border-[#D4AF37]/50 hover:text-[#F8F8F8]'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37] font-bold">CERTIFIED COLLECTION</span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-[#F8F8F8] mt-1">
              {filtered.length} Certified Devices Available
            </h2>
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(product => (
              <ProductCard key={product.id} product={{ ...product, isSecondHand: true }} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 space-y-4 rounded-[28px] bg-[#0D1117] border border-white/[0.08]">
            <Recycle className="w-16 h-16 mx-auto text-[#D4AF37]" />
            <h3 className="font-display font-bold text-xl text-[#F8F8F8]">No Certified Pre-Owned Devices Available</h3>
            <p className="text-sm text-[#B8BDC8] font-mono">We regularly update our certified pre-owned showroom inventory.</p>
            <Link to="/products" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#0FAE72] to-[#0B8F5C] text-white font-bold text-sm">
              Browse Flagships <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </section>

      {/* Why Buy Second Hand */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-10 sm:p-12 rounded-[32px] bg-[#0D1117] border border-white/[0.08] space-y-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          <div className="text-center">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37] font-bold">THE SHOWROOM STANDARD</span>
            <h2 className="font-display font-black text-3xl text-[#F8F8F8] mt-1">Why Choose Balaji Certified Pre-Owned?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-[24px] bg-white/[0.03] border border-white/[0.08] space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-white/[0.05] border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center">
                <BadgeCheck className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-[#F8F8F8] text-lg">35-Point Technical Audit</h3>
              <p className="text-xs text-[#B8BDC8] leading-relaxed font-sans">Every device undergoes rigorous testing including screen optics, camera sensors, battery health, and radio frequency connectivity.</p>
            </div>
            <div className="p-6 rounded-[24px] bg-white/[0.03] border border-white/[0.08] space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-white/[0.05] border border-[#0FAE72]/30 text-[#0FAE72] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-[#F8F8F8] text-lg">Balaji Shop Warranty</h3>
              <p className="text-xs text-[#B8BDC8] leading-relaxed font-sans">Backed by official Balaji Mobile warranty. Complete resolution or direct replacement guarantee.</p>
            </div>
            <div className="p-6 rounded-[24px] bg-white/[0.03] border border-white/[0.08] space-y-3">
              <div className="w-11 h-11 rounded-2xl bg-white/[0.05] border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center">
                <Tag className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-[#F8F8F8] text-lg">Transparent Valuation</h3>
              <p className="text-xs text-[#B8BDC8] leading-relaxed font-sans">Exact condition grade, battery health rating, and IMEI validation presented upfront with zero hidden fees.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
