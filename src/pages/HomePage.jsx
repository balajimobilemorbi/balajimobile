import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, Zap, ShieldCheck, Award, Truck, ChevronRight, 
  ArrowRight, RotateCw, Star, Layers, Recycle, CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';
import ProductCard from '../components/common/ProductCard';
import { storeCMS } from '../services/storeCMS';

export default function HomePage() {
  const [banners, setBanners]               = useState(storeCMS.getBanners());
  const [heroMedia, setHeroMedia]           = useState(() => storeCMS.getHeroMedia());
  const [products, setProducts]             = useState(storeCMS.getProducts());
  const [secondHandProducts, setSecondHand] = useState(storeCMS.getSecondHandProducts());
  const [categories, setCategories]         = useState(storeCMS.getCategories());
  const [brands, setBrands]                 = useState(storeCMS.getBrands());
  const [testimonials, setTestimonials]     = useState(storeCMS.getReviews());
  const [newArrivalTime, setNewArrivalTime] = useState(storeCMS.getNewArrivalTimeLeft());
  const [flashDealTime, setFlashDealTime]   = useState(storeCMS.getFlashDealTimeLeft());
  const [newArrivalActive, setNewArrivalActive] = useState(storeCMS.isNewArrivalActive());
  const [flashDealActive, setFlashDealActive]   = useState(storeCMS.isFlashDealActive());

  // Cursor Spotlight & Parallax State for Hero
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const heroRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x, y });
  };

  useEffect(() => {
    const handleUpdate = () => {
      setBanners(storeCMS.getBanners());
      setHeroMedia(storeCMS.getHeroMedia());
      setProducts(storeCMS.getProducts());
      setSecondHand(storeCMS.getSecondHandProducts());
      setCategories(storeCMS.getCategories());
      setBrands(storeCMS.getBrands());
      setTestimonials(storeCMS.getReviews());
      setNewArrivalActive(storeCMS.isNewArrivalActive());
      setFlashDealActive(storeCMS.isFlashDealActive());
    };
    window.addEventListener('bm_cms_update', handleUpdate);
    const timer = setInterval(() => {
      setNewArrivalTime(storeCMS.getNewArrivalTimeLeft());
      setFlashDealTime(storeCMS.getFlashDealTimeLeft());
      setNewArrivalActive(storeCMS.isNewArrivalActive());
      setFlashDealActive(storeCMS.isFlashDealActive());
    }, 1000);
    return () => { window.removeEventListener('bm_cms_update', handleUpdate); clearInterval(timer); };
  }, []);

  const banner          = banners[0];
  const flashSaleProds  = products.filter(p => p.isFlashSale);
  const newArrivalProds = products.filter(p => p.isNewArrival);
  const trendingProds   = products.filter(p => p.isTrending);

  // Time formatting helper
  const timeBlocks = (timeObj) => [
    String(timeObj.hours).padStart(2,'0') + 'h',
    String(timeObj.minutes).padStart(2,'0') + 'm',
    String(timeObj.seconds).padStart(2,'0') + 's',
  ];

  return (
    <div className="space-y-24 pb-24 bg-[#050505]">

      {/* ══════════════════════════════════════════════════════ */}
      {/* 1. CINEMATIC HERO SECTION                             */}
      {/* ══════════════════════════════════════════════════════ */}
      <section 
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="relative min-h-[640px] lg:min-h-[720px] flex items-center justify-center overflow-hidden pt-12 pb-20 bg-[#050505]"
      >
        {/* Animated Aurora Lights Layer */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-[20%] left-[15%] w-[650px] h-[650px] bg-gradient-to-br from-[#0FAE72]/15 via-[#D4AF37]/10 to-transparent rounded-full blur-[140px] animate-aurora" />
          <div className="absolute top-[30%] -right-[10%] w-[550px] h-[550px] bg-gradient-to-l from-[#D4AF37]/15 via-[#0FAE72]/10 to-transparent rounded-full blur-[140px] animate-aurora" style={{ animationDelay: '-5s' }} />
        </div>

        {/* Dynamic Cursor-Following Radial Spotlight */}
        <div 
          className="absolute inset-0 pointer-events-none transition-all duration-300 ease-out"
          style={{
            background: `radial-gradient(700px circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(212, 175, 55, 0.08), transparent 70%)`
          }}
        />

        {/* Floating Particles Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none opacity-60" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Hero Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-8 text-center lg:text-left"
          >

            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-mono bg-white/[0.04] border border-[#D4AF37]/40 backdrop-blur-xl shadow-[0_0_20px_rgba(212,175,55,0.15)]">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-[#E7C76A] tracking-wider uppercase font-semibold">
                {banner?.tagline || 'BALAJI MOBILE — MORBI LUXURY SHOWROOM'}
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.08] text-[#F8F8F8]">
              {banner?.title || 'New & Pre-Owned Smartphones'}
            </h1>

            <p className="text-base sm:text-xl max-w-2xl font-sans text-[#B8BDC8] leading-relaxed">
              {banner?.subtitle || 'Genuine sealed smartphones with brand warranty, 360° product view, and fast delivery across India. Visit our Morbi showroom or shop online.'}
            </p>

            {/* CTAs */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-5">
              <Link 
                to={banner?.buttonLink || "/products"}
                className="px-9 py-4.5 rounded-2xl font-bold text-base transition-all duration-500 flex items-center gap-3 bg-gradient-to-r from-[#0FAE72] to-[#0B8F5C] hover:from-[#D4AF37] hover:to-[#E7C76A] hover:text-[#050505] text-white border border-white/10 shadow-[0_10px_30px_rgba(15,174,114,0.35)] hover:shadow-[0_12px_35px_rgba(212,175,55,0.45)] hover:scale-105"
              >
                <span>{banner?.buttonText || "Explore Showroom"}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link 
                to="/compare"
                className="px-9 py-4.5 rounded-2xl font-semibold text-base transition-all duration-500 flex items-center gap-3 bg-white/[0.04] backdrop-blur-xl border border-white/[0.12] text-[#F8F8F8] hover:border-[#D4AF37]/60 hover:text-[#E7C76A] hover:bg-[#D4AF37]/10"
              >
                <Layers className="w-5 h-5 text-[#D4AF37]" />
                <span>Compare Devices</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-mono text-[#B8BDC8]">
              <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#0FAE72]" /> 100% Genuine</span>
              <span className="flex items-center gap-2"><Award className="w-4 h-4 text-[#D4AF37]" /> Brand Warranty</span>
              <span className="flex items-center gap-2"><Truck className="w-4 h-4 text-[#0FAE72]" /> Fast Delivery</span>
            </div>
          </motion.div>

          {/* Hero Phone / Media Showcase Card with Parallax */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div 
              className="relative w-full max-w-md rounded-[32px] p-6 sm:p-8 bg-white/[0.05] backdrop-blur-[30px] border border-white/[0.1] shadow-[0_30px_70px_rgba(0,0,0,0.9),0_0_40px_rgba(212,175,55,0.2)] animate-float-slow reflection-sweep"
              style={{
                transform: `perspective(1000px) rotateY(${(mousePos.x - 0.5) * 8}deg) rotateX(${(mousePos.y - 0.5) * -8}deg)`
              }}
            >
              {/* Customizable Top Badge */}
              <div className="absolute top-5 right-5 z-20 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono bg-[#D4AF37]/20 text-[#E7C76A] border border-[#D4AF37]/40 backdrop-blur-md shadow-sm">
                {heroMedia?.badgeText || 'NEW ARRIVAL'}
              </div>

              {/* Media Content: Video or Image */}
              <div className="w-full h-64 sm:h-72 my-4 flex items-center justify-center overflow-hidden rounded-2xl relative bg-black/20">
                {heroMedia?.mediaType === 'video' && heroMedia?.mediaUrl ? (
                  <video 
                    src={heroMedia.mediaUrl} 
                    autoPlay={heroMedia.videoAutoplay ?? true} 
                    loop={heroMedia.videoLoop ?? true} 
                    muted={heroMedia.videoMuted ?? true} 
                    controls={Boolean(heroMedia.videoControls)}
                    playsInline
                    className="w-full h-full object-cover rounded-2xl filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)]"
                  />
                ) : (
                  <img 
                    src={heroMedia?.mediaUrl || banner?.bgImage || "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1000&auto=format&fit=crop"} 
                    alt={heroMedia?.title || "Hero Showcase"}
                    className="max-h-full max-w-full object-contain filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.9)] hover:scale-105 transition-transform duration-700 ease-out" 
                  />
                )}
              </div>

              {/* Customizable Card Footer Info */}
              <div className="pt-4 flex items-center justify-between border-t border-white/[0.08] relative z-10 bg-[#050505]/40 backdrop-blur-md rounded-2xl p-4">
                <div className="min-w-0 pr-2">
                  <h4 className="font-display font-bold text-base sm:text-lg text-[#F8F8F8] truncate">
                    {heroMedia?.title || 'iPhone 15 Pro Max'}
                  </h4>
                  <p className="text-xs font-mono font-bold text-[#D4AF37] mt-0.5 truncate">
                    {heroMedia?.subtitle || 'Showroom Price: ₹1,39,900'}
                  </p>
                </div>
                <Link 
                  to={heroMedia?.buttonLink || "/product/bm-prod-101"}
                  className="px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-[#0FAE72] to-[#0B8F5C] hover:from-[#D4AF37] hover:to-[#E7C76A] hover:text-[#050505] text-white transition-all shadow-md shrink-0 whitespace-nowrap"
                >
                  {heroMedia?.buttonText || "View Details"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════ */}
      {/* 2. STATS BAR (Secondary Dark Background #0D1117)       */}
      {/* ══════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 rounded-[28px] bg-[#0D1117] border border-white/[0.08] text-center font-mono shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          <div>
            <h3 className="font-display font-black text-3xl sm:text-4xl text-gradient-emerald">
              5,000+
            </h3>
            <p className="text-xs mt-2 text-[#B8BDC8]">Happy Customers</p>
          </div>
          <div>
            <h3 className="font-display font-black text-3xl sm:text-4xl text-gradient-gold">
              4.9 ★
            </h3>
            <p className="text-xs mt-2 text-[#B8BDC8]">Customer Rating</p>
          </div>
          <div>
            <h3 className="font-display font-black text-3xl sm:text-4xl text-[#0FAE72]">
              100%
            </h3>
            <p className="text-xs mt-2 text-[#B8BDC8]">Genuine Products</p>
          </div>
          <div>
            <h3 className="font-display font-black text-3xl sm:text-4xl text-[#F8F8F8]">
              0% EMI
            </h3>
            <p className="text-xs mt-2 text-[#B8BDC8]">Instant Approval</p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════ */}
      {/* 3. NEW ARRIVALS (Primary Background #050505 + Glow)    */}
      {/* ══════════════════════════════════════════════════════ */}
      {newArrivalActive && newArrivalProds.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="gold-glow-border rounded-[32px] bg-white/[0.04] backdrop-blur-[30px] border border-white/[0.08] relative overflow-hidden p-8 sm:p-10">

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/[0.08]">
              <div className="flex items-center gap-4">
                <div className="p-3.5 rounded-2xl bg-white/[0.05] border border-[#D4AF37]/40 text-[#D4AF37]">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-display font-black text-2xl sm:text-3xl text-[#F8F8F8]">New Arrivals</h2>
                  <p className="text-xs font-mono text-[#B8BDC8] mt-1">Just landed in our store</p>
                </div>
              </div>

              <div className="flex items-center gap-2 font-mono text-center">
                <span className="text-xs uppercase tracking-widest mr-2 font-bold text-[#B8BDC8]">Exclusive Until:</span>
                {timeBlocks(newArrivalTime).map((val, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <span className="font-black text-[#D4AF37]">:</span>}
                    <div className="px-3.5 py-2 rounded-xl font-black text-lg bg-[#0D1117] border border-[#D4AF37]/40 text-[#E7C76A]">
                      {val}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
              {newArrivalProds.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════ */}
      {/* 4. FLASH SALE DEALS (Secondary Background #0D1117)     */}
      {/* ══════════════════════════════════════════════════════ */}
      {flashDealActive && flashSaleProds.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[32px] bg-[#0D1117] border border-white/[0.08] relative overflow-hidden p-8 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.9)]">

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/[0.08]">
              <div className="flex items-center gap-4">
                <div className="p-3.5 rounded-2xl bg-white/[0.05] border border-[#0FAE72]/40 text-[#0FAE72]">
                  <Zap className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <h2 className="font-display font-black text-2xl sm:text-3xl text-[#F8F8F8]">Flash Deals</h2>
                  <p className="text-xs font-mono text-[#B8BDC8] mt-1">Limited time offers — grab before they're gone</p>
                </div>
              </div>

              <div className="flex items-center gap-2 font-mono text-center">
                <span className="text-xs uppercase tracking-widest mr-2 font-bold text-[#B8BDC8]">Ends In:</span>
                {timeBlocks(flashDealTime).map((val, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <span className="font-black text-[#0FAE72]">:</span>}
                    <div className="px-3.5 py-2 rounded-xl font-black text-lg bg-[#050505] border border-[#0FAE72]/40 text-[#10C480]">
                      {val}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
              {flashSaleProds.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════ */}
      {/* 5. SHOP BY CATEGORY                                    */}
      {/* ══════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-[#F8F8F8]">Shop by Category</h2>
          </div>
          <Link to="/products" className="text-xs font-mono hover:underline flex items-center gap-1 text-[#0FAE72]">
            <span>View All Categories</span><ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-5 overflow-x-auto sm:overflow-x-visible pb-3 sm:pb-0 scrollbar-none snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map(cat => (
            <Link key={cat.id} to={`/products?category=${cat.slug}`}
              className="group p-5 sm:p-6 rounded-[24px] sm:rounded-[28px] bg-white/[0.04] backdrop-blur-[20px] border border-white/[0.08] hover:border-[#D4AF37]/50 text-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col items-center justify-center space-y-3 sm:space-y-4 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)] min-w-[130px] sm:min-w-0 snap-start shrink-0 sm:shrink"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl p-2 sm:p-2.5 flex items-center justify-center bg-white/[0.05] border border-white/[0.1] group-hover:scale-110 group-hover:border-[#D4AF37]/50 transition-all duration-500">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-contain rounded-xl" />
              </div>
              <div>
                <h4 className="font-display font-bold text-xs sm:text-sm text-[#F8F8F8] group-hover:text-[#D4AF37] transition-colors line-clamp-1">{cat.name}</h4>
                <p className="text-[10px] sm:text-[11px] font-mono text-[#B8BDC8] mt-0.5">{cat.count} Models</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════ */}
      {/* 6. TRENDING FLAGSHIPS (Secondary Background #0D1117)   */}
      {/* ══════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-[#F8F8F8]">Popular Phones</h2>
          </div>
          <Link to="/products" className="text-xs font-mono hover:underline flex items-center gap-1 text-[#D4AF37]">
            <span>View All</span><ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingProds.slice(0,8).map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════ */}
      {/* 7. CERTIFIED PRE-OWNED                                 */}
      {/* ══════════════════════════════════════════════════════ */}
      {secondHandProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[32px] bg-[#0D1117] border border-white/[0.08] relative overflow-hidden p-6 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.9)]">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 pb-6 sm:pb-8 border-b border-white/[0.08]">
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-2xl bg-white/[0.05] border border-[#D4AF37]/40 text-[#D4AF37]">
                  <Recycle className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h2 className="font-display font-black text-2xl sm:text-3xl text-[#F8F8F8]">Pre-Owned Phones</h2>
                  <p className="text-xs font-mono text-[#B8BDC8] mt-0.5">Tested &amp; verified with shop warranty</p>
                </div>
              </div>
              <Link to="/second-hand"
                className="w-full sm:w-auto text-center px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-[#0FAE72] to-[#0B8F5C] hover:from-[#D4AF37] hover:to-[#E7C76A] hover:text-[#050505] text-white shadow-lg shrink-0"
              >
                <span>View All Pre-Owned</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 sm:pt-8">
              {secondHandProducts.slice(0,3).map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════ */}
      {/* 8. AUTHORIZED BRANDS                                   */}
      {/* ══════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        <div className="text-center">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#F8F8F8]">Brands We Sell</h2>
        </div>
        <div className="flex sm:grid sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4 overflow-x-auto sm:overflow-x-visible pb-3 sm:pb-0 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {brands.filter(b => b.count > 0).map(brand => (
            <Link key={brand.id} to={`/products?brand=${brand.name}`}
              className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:border-[#D4AF37]/50 text-center transition-all duration-300 flex flex-col items-center justify-center space-y-1 hover:-translate-y-1 min-w-[95px] sm:min-w-0 shrink-0 sm:shrink"
            >
              <span className="text-xs sm:text-sm font-mono font-bold text-[#F8F8F8]">{brand.name}</span>
              <span className="text-[9.5px] sm:text-[10px] font-mono text-[#B8BDC8]">{brand.count} models</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════ */}
      {/* 9. WHY CLIENTS CHOOSE BALAJI MOBILE                    */}
      {/* ══════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-10 sm:p-12 rounded-[32px] bg-[#0D1117] border border-white/[0.08] space-y-10 shadow-[0_25px_60px_rgba(0,0,0,0.9)]">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono uppercase tracking-[0.25em] font-bold text-[#D4AF37]">OUR PROMISE</span>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-[#F8F8F8]">Why Choose Balaji Mobile</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />, title:'100% Genuine Products', desc:'Every phone is sourced from official brand channels with GST bill and manufacturer warranty.' },
              { icon: <RotateCw className="w-6 h-6 text-[#D4AF37]" />, title:'Easy Exchange', desc:'Trade in your old phone at our Morbi store. Get instant valuation and exchange bonus on new purchase.' },
              { icon: <Truck className="w-6 h-6 text-[#D4AF37]" />, title:'Safe Home Delivery', desc:'Insured express delivery via BlueDart & Delhivery. Tracked and tamper-proof packaging across India.' },
            ].map((item, i) => (
              <div key={i} className="space-y-4 p-7 rounded-[24px] bg-white/[0.03] border border-white/[0.08] hover:border-[#D4AF37]/40 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/[0.05] border border-[#D4AF37]/30">
                  {item.icon}
                </div>
                <h3 className="font-display font-bold text-lg text-[#F8F8F8]">{item.title}</h3>
                <p className="text-xs leading-relaxed text-[#B8BDC8] font-sans">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════ */}
      {/* 10. VERIFIED CLIENT REVIEWS                            */}
      {/* ══════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono uppercase tracking-[0.25em] font-bold text-[#0FAE72]">CUSTOMER REVIEWS</span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-[#F8F8F8]">What Our Customers Say</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map(t => (
            <div key={t.id} className="p-7 rounded-[28px] bg-white/[0.04] backdrop-blur-[20px] border border-white/[0.08] space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover border border-[#D4AF37]/40" />
                  <div>
                    <h4 className="font-display font-bold text-sm text-[#F8F8F8]">{t.name}</h4>
                    <p className="text-xs font-mono text-[#B8BDC8]">{t.city}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[#D4AF37]">
                  <Star className="w-4 h-4 fill-[#D4AF37]" />
                  <span className="text-xs font-bold font-mono">{t.rating}.0</span>
                </div>
              </div>
              <p className="text-xs leading-relaxed italic text-[#B8BDC8] font-sans">"{t.comment}"</p>
              <div className="pt-3 text-[11px] font-mono font-bold text-[#0FAE72] border-t border-white/[0.08]">
                Purchased: {t.productBought}
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
