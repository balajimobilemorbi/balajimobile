import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, ShieldCheck, Truck, RotateCcw, Heart, ShoppingBag, 
  MessageSquare, PhoneCall, Layers, CheckCircle2, ChevronRight, 
  RotateCw, Play, MapPin, Calculator, Send, Zap, Award, Recycle, Share2 
} from 'lucide-react';
import Product360Viewer from '../components/product/Product360Viewer';
import EMICalculatorModal from '../components/product/EMICalculatorModal';
import ProductCard from '../components/common/ProductCard';
import { storeCMS } from '../services/storeCMS';
import { sharePhoneDetails } from '../utils/shareUtils';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('gallery'); // 'gallery' | '360'
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedRam, setSelectedRam] = useState('');
  const [selectedStorage, setSelectedStorage] = useState('');
  const [pincode, setPincode] = useState('');
  const [pinResult, setPinResult] = useState(null);
  const [showEmiModal, setShowEmiModal] = useState(false);
  const [added, setAdded] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [inCompare, setInCompare] = useState(false);

  // New Review State
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    let prod = storeCMS.getProductById(id) || storeCMS.getSecondHandProductById(id);
    if (prod) {
      setProduct(prod);
      const defaultColor = prod.variants?.[0]?.color || prod.color || (prod.colors ? prod.colors[0] : '');
      const defaultRam = prod.variants?.[0]?.ram || prod.ram || (prod.ramOptions ? prod.ramOptions[0] : '');
      const defaultStorage = prod.variants?.[0]?.storage || prod.storage || (prod.storageOptions ? prod.storageOptions[0] : '');
      setSelectedColor(defaultColor);
      setSelectedRam(defaultRam);
      setSelectedStorage(defaultStorage);
      setInWishlist(storeCMS.getWishlist().includes(prod.id));
      setInCompare(storeCMS.getCompare().includes(prod.id));
    }
  }, [id]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4 bg-[#050505] min-h-screen">
        <h2 className="text-2xl font-bold font-display text-[#F8F8F8]">Flagship Not Found</h2>
        <Link to="/products" className="text-[#D4AF37] hover:underline font-mono text-sm">Back to Showroom Catalog</Link>
      </div>
    );
  }

  // Find matching active variant from variants list
  const activeVariant = product.variants?.find(
    v => (selectedColor ? v.color === selectedColor : true) && (selectedStorage ? v.storage === selectedStorage : true)
  ) || product.variants?.find(v => v.color === selectedColor) || product.variants?.[0];

  const displayBmPrice = activeVariant ? activeVariant.bmPrice : product.bmPrice;
  const displayMarketPrice = activeVariant ? activeVariant.marketPrice : product.marketPrice;
  const displayStock = activeVariant ? activeVariant.stock : product.stock;
  const displayImages = (activeVariant && activeVariant.images && activeVariant.images.length > 0) ? activeVariant.images : product.images;

  const handleAddToCart = () => {
    const user = storeCMS.getUser();
    const itemToAdd = {
      ...product,
      bmPrice: displayBmPrice,
      marketPrice: displayMarketPrice,
      ram: selectedRam || product.ram,
      storage: selectedStorage || product.storage,
      color: selectedColor || product.color
    };
    if (!user) {
      window.dispatchEvent(new CustomEvent('bm_require_auth', { detail: { product: itemToAdd } }));
      return;
    }
    storeCMS.addToCart(itemToAdd, 1, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    const user = storeCMS.getUser();
    if (!user) {
      window.dispatchEvent(new CustomEvent('bm_require_auth', { detail: { product, action: 'checkout' } }));
      return;
    }
    storeCMS.addToCart(product, 1, selectedColor);
    navigate('/checkout');
  };

  const handleToggleWishlist = () => {
    const updated = storeCMS.toggleWishlist(product.id);
    setInWishlist(updated.includes(product.id));
  };

  const handleToggleCompare = () => {
    const updated = storeCMS.toggleCompare(product.id);
    setInCompare(updated.includes(product.id));
  };

  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (pincode.length === 6) {
      setPinResult({
        express: true,
        deliveryDate: 'Delivered by Tomorrow, 5 PM',
        courier: 'BlueDart Insured Air'
      });
    } else {
      setPinResult({ error: 'Please enter a valid 6-digit Indian PIN Code' });
    }
  };

  const handleAddReviewSubmit = (e) => {
    e.preventDefault();
    if (reviewName && reviewComment) {
      storeCMS.addReview({
        productId: product.id,
        name: reviewName,
        rating: reviewRating,
        comment: reviewComment,
        city: 'Verified Buyer',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
        productBought: product.title
      });
      setReviewSubmitted(true);
      setReviewName('');
      setReviewComment('');
    }
  };

  const emiPerMonth = Math.round(product.bmPrice / 24);
  const relatedProducts = storeCMS.getProducts().filter(p => p.brand === product.brand && p.id !== product.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 bg-[#050505] min-h-screen">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-mono text-[#B8BDC8]">
        <Link to="/" className="hover:text-[#D4AF37]">Showroom</Link>
        <ChevronRight className="w-3 h-3 text-[#B8BDC8]" />
        <Link to="/products" className="hover:text-[#D4AF37]">Flagships</Link>
        <ChevronRight className="w-3 h-3 text-[#B8BDC8]" />
        <span className="text-[#D4AF37] font-semibold">{product.brand}</span>
      </nav>

      {/* Main Grid: Gallery & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Visual Gallery & 360 Rotation Viewer */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-2 border-b border-white/[0.08] pb-4">
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-mono font-bold transition-all duration-300 ${
                activeTab === 'gallery'
                  ? 'bg-white/[0.05] text-[#D4AF37] border border-[#D4AF37]/50 shadow-md'
                  : 'bg-white/[0.03] text-[#B8BDC8] hover:text-[#F8F8F8]'
              }`}
            >
              HD Photo Gallery
            </button>

            {(product.videoUrl || (product.frames360 && product.frames360.length > 0)) && (
              <button
                onClick={() => setActiveTab('360')}
                className={`px-5 py-2.5 rounded-2xl text-xs font-mono font-bold transition-all duration-300 flex items-center gap-1.5 ${
                  activeTab === '360'
                    ? 'bg-white/[0.05] text-[#D4AF37] border border-[#D4AF37]/50 shadow-md'
                    : 'bg-white/[0.03] text-[#B8BDC8] hover:text-[#F8F8F8]'
                }`}
              >
                <RotateCw className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Interactive 360° Inspection</span>
              </button>
            )}
          </div>

          {/* View Container */}
          {activeTab === '360' ? (
            <Product360Viewer frames={product.frames360} videoUrl={product.videoUrl} title={product.title} />
          ) : (
            <div className="space-y-4">
              <div className="w-full h-[480px] rounded-[32px] bg-[#0D1117] border border-white/[0.08] p-10 flex items-center justify-center relative overflow-hidden group shadow-[0_20px_60px_rgba(0,0,0,0.9)] reflection-sweep">
                <img
                  src={displayImages[selectedImage] || displayImages[0]}
                  alt={product.title}
                  className="max-h-full max-w-full object-contain filter drop-shadow-[0_30px_45px_rgba(0,0,0,0.9)] group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                
                {product.discount > 0 && (
                  <span className="absolute top-6 left-6 px-3 py-1.5 rounded-full text-xs font-bold font-mono bg-[#0FAE72]/20 text-[#10C480] border border-[#0FAE72]/40 backdrop-blur-md">
                    {product.discount}% INSTANT DEDUCTION
                  </span>
                )}
              </div>

              {/* Thumbnail Selector */}
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {displayImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-2xl bg-[#0D1117] border p-2 shrink-0 transition-all duration-300 ${
                      selectedImage === idx ? 'border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.3)]' : 'border-white/[0.08] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/[0.08] text-center text-xs font-mono">
            <div className="p-4 rounded-2xl bg-[#0D1117] border border-white/[0.08]">
              <ShieldCheck className="w-5 h-5 text-[#0FAE72] mx-auto mb-1" />
              <span className="text-[#F8F8F8]">100% Sealed Box</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#0D1117] border border-white/[0.08]">
              <Award className="w-5 h-5 text-[#D4AF37] mx-auto mb-1" />
              <span className="text-[#F8F8F8]">Official Warranty</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#0D1117] border border-white/[0.08]">
              <Truck className="w-5 h-5 text-[#0FAE72] mx-auto mb-1" />
              <span className="text-[#F8F8F8]">Insured Express</span>
            </div>
          </div>

        </div>

        {/* Right Column: Product Specs & Direct Checkout */}
        <div className="lg:col-span-5 space-y-6">
          
          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono uppercase tracking-[0.25em] text-[#D4AF37] font-bold text-xs">
                {product.brand}
              </span>
              <span className="text-xs text-[#B8BDC8] font-mono">IMEI Verified</span>
            </div>

            <h1 className="font-display font-black text-3xl sm:text-4xl text-[#F8F8F8] mt-1 leading-tight">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1 text-[#D4AF37] font-bold text-sm">
                <Star className="w-4 h-4 fill-[#D4AF37]" />
                <span>{product.rating}</span>
              </div>
              <span className="text-xs text-[#B8BDC8] font-mono">({product.reviewsCount} Client Reviews)</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-7 rounded-[28px] bg-[#0D1117] border border-white/[0.08] space-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            <div className="flex items-baseline gap-3">
              <span className="font-display font-black text-3xl sm:text-4xl text-[#F8F8F8]">
                ₹{displayBmPrice.toLocaleString('en-IN')}
              </span>
              {displayMarketPrice > displayBmPrice && (
                <span className="text-sm text-[#B8BDC8] line-through font-mono">
                  ₹{displayMarketPrice.toLocaleString('en-IN')}
                </span>
              )}
              {displayMarketPrice > displayBmPrice && (
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-[#0FAE72]/20 text-[#10C480] border border-[#0FAE72]/40">
                  Save ₹{(displayMarketPrice - displayBmPrice).toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <p className="text-xs text-[#B8BDC8] font-mono">
              Inclusive of 18% GST Invoice &amp; White-Glove Insured Delivery
            </p>

            {/* EMI Trigger Bar */}
            <div className="pt-3 flex items-center justify-between border-t border-white/[0.08] text-xs">
              <span className="text-[#B8BDC8] font-mono">
                No Cost EMI from <strong className="text-[#0FAE72]">₹{emiPerMonth.toLocaleString('en-IN')}/mo</strong>
              </span>
              <button
                onClick={() => setShowEmiModal(true)}
                className="text-[#D4AF37] hover:underline font-mono font-bold flex items-center gap-1"
              >
                <Calculator className="w-3.5 h-3.5" /> Calculate EMI
              </button>
            </div>
          </div>

          {/* Multiple Color Options Selector */}
          {((product.colors && product.colors.length > 0) || product.color) && (
            <div className="p-5 rounded-2xl bg-[#0D1117] border border-white/[0.08] space-y-3 font-mono text-xs">
              <label className="block text-[#D4AF37] font-bold uppercase tracking-wider text-xs">
                Select Color Finish: <span className="text-[#F8F8F8] font-normal">{selectedColor || product.color}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {(product.colors && product.colors.length > 0 ? product.colors : [product.color]).map((c, cIdx) => (
                  <button
                    key={cIdx}
                    onClick={() => setSelectedColor(c)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all duration-300 ${
                      selectedColor === c
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#E7C76A] text-[#050505] shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                        : 'bg-[#050505] text-[#B8BDC8] border border-white/[0.08] hover:border-[#D4AF37]/50 hover:text-[#F8F8F8]'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* RAM & Storage (ROM) Options Selector */}
          {((product.ramOptions && product.ramOptions.length > 0) || (product.storageOptions && product.storageOptions.length > 0)) && (
            <div className="p-5 rounded-2xl bg-[#0D1117] border border-white/[0.08] space-y-4 font-mono text-xs">
              {product.ramOptions && product.ramOptions.length > 0 && (
                <div>
                  <label className="block text-[#D4AF37] font-bold uppercase tracking-wider text-xs mb-2">
                    RAM Memory Variant: <span className="text-[#F8F8F8] font-normal">{selectedRam || product.ram}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.ramOptions.map((r, rIdx) => (
                      <button
                        key={rIdx}
                        onClick={() => setSelectedRam(r)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all duration-300 ${
                          selectedRam === r
                            ? 'bg-[#0FAE72] text-[#050505] shadow-[0_0_15px_rgba(15,174,114,0.4)]'
                            : 'bg-[#050505] text-[#B8BDC8] border border-white/[0.08] hover:border-[#0FAE72]/50 hover:text-[#F8F8F8]'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.storageOptions && product.storageOptions.length > 0 && (
                <div>
                  <label className="block text-[#D4AF37] font-bold uppercase tracking-wider text-xs mb-2">
                    Storage (ROM) Capacity: <span className="text-[#F8F8F8] font-normal">{selectedStorage || product.storage}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.storageOptions.map((s, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => setSelectedStorage(s)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all duration-300 ${
                          selectedStorage === s
                            ? 'bg-[#0FAE72] text-[#050505] shadow-[0_0_15px_rgba(15,174,114,0.4)]'
                            : 'bg-[#050505] text-[#B8BDC8] border border-white/[0.08] hover:border-[#0FAE72]/50 hover:text-[#F8F8F8]'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Certified Pre-Owned Box */}
          {(product.batteryHealth || product.conditionBadge || product.deviceAge || product.hasBill) && (
            <div className="p-6 rounded-[28px] bg-white/[0.03] border border-[#D4AF37]/30 space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <span className="font-bold text-[#D4AF37] flex items-center gap-1.5 text-xs">
                  <Recycle className="w-4 h-4 text-[#0FAE72]" /> CERTIFIED PRE-OWNED INSPECTION
                </span>
                <span className="px-3 py-1 rounded-full bg-[#0FAE72]/15 text-[#10C480] border border-[#0FAE72]/30 text-[10px] font-bold">
                  35-Point Verified
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-[#050505] border border-white/[0.08]">
                  <span className="text-[#B8BDC8] block text-[10px]">Battery Health:</span>
                  <span className="text-[#0FAE72] font-bold text-xs sm:text-sm">
                    🔋 {product.batteryHealth || 'Not Applicable / N/A'}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-[#050505] border border-white/[0.08]">
                  <span className="text-[#B8BDC8] block text-[10px]">GST Invoice / Bill:</span>
                  <span className="text-[#F8F8F8] font-bold text-xs truncate block" title={product.hasBill}>
                    🧾 {product.hasBill || 'Original Brand GST Invoice'}
                  </span>
                </div>

                {product.deviceAge && (
                  <div className="p-3 rounded-2xl bg-[#050505] border border-white/[0.08]">
                    <span className="text-[#B8BDC8] block text-[10px]">Device Age:</span>
                    <span className="text-[#D4AF37] font-bold text-xs sm:text-sm">⏳ {product.deviceAge}</span>
                  </div>
                )}
                {product.conditionBadge && (
                  <div className="p-3 rounded-2xl bg-[#050505] border border-white/[0.08]">
                    <span className="text-[#B8BDC8] block text-[10px]">Grade Condition:</span>
                    <span className="text-[#F8F8F8] font-bold text-xs">💎 {product.conditionBadge}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Key Specs Pills */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3.5 rounded-2xl bg-[#0D1117] border border-white/[0.08]">
              <span className="text-[#B8BDC8] block">RAM / Storage:</span>
              <span className="text-[#F8F8F8] font-bold">{product.ram} / {product.storage}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#0D1117] border border-white/[0.08]">
              <span className="text-[#B8BDC8] block">Processor:</span>
              <span className="text-[#F8F8F8] font-bold truncate block">{product.processor}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#0D1117] border border-white/[0.08]">
              <span className="text-[#B8BDC8] block">Condition:</span>
              <span className="text-[#0FAE72] font-bold">{product.condition}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#0D1117] border border-white/[0.08]">
              <span className="text-[#B8BDC8] block">Warranty:</span>
              <span className="text-[#F8F8F8] font-bold truncate block">{product.warranty}</span>
            </div>
          </div>

          {/* PIN Code Checker */}
          <div className="p-5 rounded-2xl bg-[#0D1117] border border-white/[0.08] space-y-3">
            <label className="block text-xs font-mono uppercase text-[#D4AF37] tracking-wider font-bold flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#0FAE72]" /> Check Express Delivery
            </label>
            <form onSubmit={handleCheckPincode} className="flex gap-2">
              <input
                type="text"
                maxLength="6"
                placeholder="Enter 6-Digit PIN Code"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#050505] border border-white/[0.08] text-xs text-[#F8F8F8] focus:border-[#D4AF37] outline-none font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-[#D4AF37] font-mono text-xs font-bold hover:border-[#D4AF37] transition"
              >
                Check
              </button>
            </form>
            {pinResult && (
              <div className="text-xs font-mono pt-1">
                {pinResult.express ? (
                  <p className="text-[#0FAE72] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> {pinResult.deliveryDate} via {pinResult.courier}
                  </p>
                ) : (
                  <p className="text-rose-400">{pinResult.error}</p>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`flex-1 py-4 rounded-2xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                  added 
                    ? 'bg-[#0FAE72] text-[#050505]'
                    : 'bg-white/[0.04] border border-white/[0.1] text-[#F8F8F8] hover:border-[#D4AF37] hover:text-[#D4AF37]'
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                <span>{added ? 'Added to Bag!' : 'Add to Bag'}</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-[#0FAE72] to-[#0B8F5C] hover:from-[#D4AF37] hover:to-[#E7C76A] hover:text-[#050505] text-white font-bold text-sm shadow-[0_4px_20px_rgba(15,174,114,0.35)] hover:shadow-[0_0_25px_rgba(212,175,55,0.45)] transition-all duration-500 flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                <span>Acquire Now</span>
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleToggleWishlist}
                className={`flex-1 py-3 rounded-2xl border text-xs font-mono transition flex items-center justify-center gap-1.5 ${
                  inWishlist ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#E7C76A]' : 'bg-white/[0.04] border-white/[0.08] text-[#B8BDC8] hover:text-[#F8F8F8]'
                }`}
              >
                <Heart className={`w-4 h-4 ${inWishlist ? 'fill-[#E7C76A]' : ''}`} />
                <span>{inWishlist ? 'In Wishlist' : 'Wishlist'}</span>
              </button>

              <button
                onClick={handleToggleCompare}
                className={`flex-1 py-3 rounded-2xl border text-xs font-mono transition flex items-center justify-center gap-1.5 ${
                  inCompare ? 'bg-[#0FAE72]/20 border-[#0FAE72] text-[#10C480]' : 'bg-white/[0.04] border-white/[0.08] text-[#B8BDC8] hover:text-[#F8F8F8]'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>{inCompare ? 'In Compare' : 'Compare'}</span>
              </button>

              <button
                onClick={() => sharePhoneDetails(product)}
                className="py-3 px-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-[#D4AF37] hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 text-xs font-mono transition flex items-center justify-center gap-1.5"
                title="Share Phone Details"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>

            {/* Direct WhatsApp Concierge Button */}
            <a
              href={`https://wa.me/${storeCMS.getSettings().whatsappNumber}?text=Hi%20BM%20Mobile,%20I%20am%20interested%20in%20acquiring%20${encodeURIComponent(product.title)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] hover:border-[#D4AF37]/50 text-[#D4AF37] font-bold text-xs transition flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
              <span>Connect with Showroom Concierge on WhatsApp</span>
            </a>
          </div>

        </div>

      </div>

      {/* Technical Specs Table Section */}
      <div className="p-8 sm:p-10 rounded-[32px] bg-[#0D1117] border border-white/[0.08] space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        <h3 className="font-display font-black text-2xl sm:text-3xl text-[#F8F8F8]">Complete Technical Specifications</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-mono">
          <div className="space-y-3">
            <h4 className="font-bold text-[#D4AF37] uppercase tracking-wider border-b border-white/[0.08] pb-2">Hardware Architecture</h4>
            <div className="flex justify-between py-2 border-b border-white/[0.05] text-[#B8BDC8]">
              <span className="text-[#B8BDC8]">Processor:</span> <span className="text-[#F8F8F8] font-bold">{product.processor}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/[0.05] text-[#B8BDC8]">
              <span className="text-[#B8BDC8]">Display Technology:</span> <span className="text-[#F8F8F8] font-bold">{product.display}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/[0.05] text-[#B8BDC8]">
              <span className="text-[#B8BDC8]">Camera Optics:</span> <span className="text-[#F8F8F8] font-bold">{product.camera}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/[0.05] text-[#B8BDC8]">
              <span className="text-[#B8BDC8]">Battery &amp; Fast Charge:</span> <span className="text-[#F8F8F8] font-bold">{product.battery}</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-[#0FAE72] uppercase tracking-wider border-b border-white/[0.08] pb-2">Box Package &amp; Warranty</h4>
            <div className="flex justify-between py-2 border-b border-white/[0.05] text-[#B8BDC8]">
              <span className="text-[#B8BDC8]">In-Box Contents:</span> <span className="text-[#F8F8F8] font-bold">{product.accessories ? product.accessories.join(', ') : 'Sealed Box & Cable'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/[0.05] text-[#B8BDC8]">
              <span className="text-[#B8BDC8]">Condition Grade:</span> <span className="text-[#F8F8F8] font-bold">{product.condition}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/[0.05] text-[#B8BDC8]">
              <span className="text-[#B8BDC8]">Official Warranty:</span> <span className="text-[#F8F8F8] font-bold">{product.warranty}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="p-8 sm:p-10 rounded-[32px] bg-[#0D1117] border border-white/[0.08] space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        <h3 className="font-display font-black text-2xl sm:text-3xl text-[#F8F8F8]">Verified Client Endorsements</h3>

        <form onSubmit={handleAddReviewSubmit} className="p-6 rounded-2xl bg-[#050505] border border-white/[0.08] space-y-4">
          <h4 className="font-display font-bold text-[#F8F8F8] text-sm">Submit Client Experience</h4>
          {reviewSubmitted && (
            <p className="text-xs text-[#0FAE72] font-mono">Thank you! Your experience endorsement has been recorded.</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <input
              type="text"
              required
              placeholder="Your Full Name"
              value={reviewName}
              onChange={(e) => setReviewName(e.target.value)}
              className="px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[#F8F8F8] outline-none focus:border-[#D4AF37]"
            />
            <select
              value={reviewRating}
              onChange={(e) => setReviewRating(Number(e.target.value))}
              className="px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[#F8F8F8] outline-none font-mono"
            >
              <option value="5" className="bg-[#050505]">5 Stars - Outstanding</option>
              <option value="4" className="bg-[#050505]">4 Stars - Excellent</option>
              <option value="3" className="bg-[#050505]">3 Stars - Good</option>
            </select>
          </div>
          <textarea
            required
            rows="3"
            placeholder="Share your experience with this device..."
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-[#F8F8F8] outline-none focus:border-[#D4AF37] font-sans"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-[#0FAE72] text-[#050505] font-bold text-xs hover:bg-[#D4AF37] transition"
          >
            Submit Review
          </button>
        </form>
      </div>

      {/* Sticky Mobile Bottom Purchase Bar */}
      <div className="lg:hidden fixed bottom-[56px] left-0 right-0 z-30 bg-[#050505]/95 border-t border-white/[0.1] px-4 py-3 backdrop-blur-[25px] flex items-center justify-between shadow-[0_-10px_30px_rgba(0,0,0,0.9)]">
        <div className="min-w-0 flex-1 pr-3">
          <p className="text-[#F8F8F8] font-bold text-xs truncate">{product.title}</p>
          <p className="text-[#0FAE72] font-mono font-bold text-sm">₹{product.bmPrice?.toLocaleString('en-IN')}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
              added 
                ? 'bg-[#0FAE72] text-[#050505]'
                : 'bg-gradient-to-r from-[#0FAE72] to-[#0B8F5C] text-white shadow-lg'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{added ? 'Added!' : 'Add to Bag'}</span>
          </button>
        </div>
      </div>

      {/* EMI Modal */}
      {showEmiModal && (
        <EMICalculatorModal price={product.bmPrice} onClose={() => setShowEmiModal(false)} />
      )}

    </div>
  );
}
