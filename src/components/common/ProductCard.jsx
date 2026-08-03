import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Zap, Check, Layers, Recycle, Share2 } from 'lucide-react';
import { storeCMS } from '../../services/storeCMS';
import { sharePhoneDetails } from '../../utils/shareUtils';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);
  const [inWishlist, setInWishlist] = useState(() => storeCMS.getWishlist().includes(product.id));
  const [inCompare, setInCompare] = useState(() => storeCMS.getCompare().includes(product.id));

  const handleCardClick = (e) => {
    if (e.target.closest('button')) return;
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const user = storeCMS.getUser();
    if (!user) {
      window.dispatchEvent(new CustomEvent('bm_require_auth', { detail: { product } }));
      return;
    }
    storeCMS.addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = storeCMS.toggleWishlist(product.id);
    setInWishlist(updated.includes(product.id));
  };

  const handleToggleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = storeCMS.toggleCompare(product.id);
    setInCompare(updated.includes(product.id));
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    sharePhoneDetails(product);
  };

  const emiPerMonth = Math.round(product.bmPrice / 24);

  return (
    <div onClick={handleCardClick} className="group relative rounded-[24px] sm:rounded-[28px] bg-white/[0.05] backdrop-blur-[30px] border border-white/[0.08] p-3.5 sm:p-5 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-between overflow-hidden hover:-translate-y-2 hover:border-[#D4AF37]/50 hover:shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(212,175,55,0.25)] reflection-sweep cursor-pointer">
      
      {/* Top Floating Glass Badges */}
      <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1 flex-wrap pointer-events-auto max-w-[65%]">
          {(product.batteryHealth || product.deviceAge || product.conditionBadge || product.id?.includes('sh') || product.isSecondHand) ? (
            <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-mono font-black bg-gradient-to-r from-[#D4AF37] to-[#E7C76A] text-[#050505] shadow-[0_4px_15px_rgba(212,175,55,0.4)] flex items-center gap-1">
              <Recycle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#050505]" />
              PRE-OWNED
            </span>
          ) : (
            <>
              {product.discount > 0 && (
                <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold font-mono bg-[#0FAE72]/20 text-[#10C480] border border-[#0FAE72]/40 backdrop-blur-md">
                  <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current inline mr-0.5 text-[#D4AF37]" />
                  {product.discount}% OFF
                </span>
              )}
              {product.isFlashSale && (
                <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold font-mono bg-[#D4AF37]/20 text-[#E7C76A] border border-[#D4AF37]/40 backdrop-blur-md hidden xs:inline">
                  FLASH
                </span>
              )}
            </>
          )}
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-1 pointer-events-auto">
          <button
            onClick={handleShare}
            className="p-1.5 sm:p-2 rounded-full border backdrop-blur-md transition-all duration-300 bg-[#050505]/80 border-white/10 text-[#F8F8F8] hover:text-[#D4AF37] hover:border-[#D4AF37]/40"
            title="Share Phone Details"
          >
            <Share2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#D4AF37]" />
          </button>

          <button
            onClick={handleToggleWishlist}
            className={`p-1.5 sm:p-2 rounded-full border backdrop-blur-md transition-all duration-300 ${
              inWishlist 
                ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#E7C76A]' 
                : 'bg-[#050505]/80 border-white/10 text-[#F8F8F8] hover:text-[#D4AF37] hover:border-[#D4AF37]/40'
            }`}
            title="Add to Wishlist"
          >
            <Heart className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${inWishlist ? 'fill-[#E7C76A] text-[#E7C76A]' : ''}`} />
          </button>

          <button
            onClick={handleToggleCompare}
            className={`p-1.5 sm:p-2 rounded-full border backdrop-blur-md transition-all duration-300 ${
              inCompare 
                ? 'bg-[#0FAE72]/20 border-[#0FAE72] text-[#10C480]' 
                : 'bg-[#050505]/80 border-white/10 text-[#F8F8F8] hover:text-[#0FAE72] hover:border-[#0FAE72]/40'
            }`}
            title="Add to Compare"
          >
            <Layers className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>
        </div>
      </div>

      {/* Product Showcase Image */}
      <Link to={`/product/${product.id}`} className="block relative pt-10 sm:pt-12 pb-2 flex items-center justify-center overflow-hidden">
        <div className="w-full h-40 sm:h-52 flex items-center justify-center p-2 relative">
          <img
            src={product.images[0]}
            alt={product.title}
            className="max-h-full max-w-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.85)] group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />
        </div>

        {/* Certified Pre-Owned Bottom Ribbon Banner */}
        {(product.batteryHealth || product.deviceAge || product.conditionBadge || product.id?.includes('sh') || product.isSecondHand) && (
          <div className="absolute bottom-1 left-1 right-1 sm:left-2 sm:right-2 px-2 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-[#050505]/95 border border-[#D4AF37]/50 text-[9px] sm:text-[10px] font-mono text-[#E7C76A] backdrop-blur-md font-bold flex items-center justify-between z-20 shadow-lg">
            <span className="flex items-center gap-1 truncate">
              <Recycle className="w-3 h-3 text-[#0FAE72] shrink-0" /> PRE-OWNED
            </span>
            {product.batteryHealth && (
              <span className="text-[#0FAE72] shrink-0">🔋 {product.batteryHealth}</span>
            )}
          </div>
        )}

        {/* 360 Badge Overlay */}
        {product.frames360 && product.frames360.length > 0 && !(product.batteryHealth || product.id?.includes('sh') || product.isSecondHand) && (
          <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-[#050505]/80 border border-[#D4AF37]/40 text-[9px] sm:text-[10px] font-mono text-[#D4AF37] backdrop-blur-md font-bold">
            360° VIEW
          </span>
        )}
      </Link>

      {/* Details Container */}
      <div className="space-y-2 sm:space-y-3 pt-2">
        
        {/* Brand */}
        <div className="flex items-center text-xs">
          <span className="font-mono uppercase tracking-[0.2em] font-bold text-[#D4AF37] text-[10px] sm:text-xs">
            {product.brand}
          </span>
        </div>

        {/* Product Title */}
        <Link
          to={`/product/${product.id}`}
          className="block font-display font-bold text-sm sm:text-lg text-[#F8F8F8] hover:text-[#D4AF37] transition-colors duration-300 line-clamp-1"
        >
          {product.title}
        </Link>

        {/* Specifications Pills */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap text-[10px] sm:text-[11px] text-[#F8F8F8] font-mono">
          <span className="px-1.5 py-0.5 rounded-lg bg-white/[0.04] border border-white/[0.08]">{product.ram}</span>
          <span className="px-1.5 py-0.5 rounded-lg bg-white/[0.04] border border-white/[0.08]">{product.storage}</span>
          {product.batteryHealth && (
            <span className="px-1.5 py-0.5 rounded-lg bg-[#D4AF37]/15 text-[#E7C76A] border border-[#D4AF37]/30 font-bold">
              🔋 {product.batteryHealth}
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5 text-xs">
          <div className="flex items-center gap-1 text-[#D4AF37] font-bold font-mono text-[11px] sm:text-xs">
            <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-[#D4AF37]" />
            <span>{product.rating}</span>
          </div>
          <span className="text-[#B8BDC8] font-mono text-[10px] sm:text-xs">({product.reviewsCount})</span>
        </div>

        {/* Pricing & Cart Action */}
        <div className="pt-2 sm:pt-3 flex items-end justify-between border-t border-white/[0.08]">
          <div className="min-w-0 pr-1">
            <div className="flex items-baseline gap-1 sm:gap-2 flex-wrap">
              <span className="font-display font-black text-base sm:text-xl text-[#F8F8F8]">
                ₹{product.bmPrice.toLocaleString('en-IN')}
              </span>
              {product.marketPrice > product.bmPrice && (
                <span className="text-[10px] sm:text-xs text-[#B8BDC8] line-through font-mono">
                  ₹{product.marketPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <p className="text-[9px] sm:text-[10px] font-mono mt-0.5 font-bold text-[#D4AF37] truncate">
              EMI ₹{emiPerMonth.toLocaleString('en-IN')}/mo
            </p>
          </div>

          {/* Luxury Emerald Gradient Button transitioning to Gold Glow on hover */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="p-3 rounded-2xl font-bold transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-center text-white bg-gradient-to-r from-[#0FAE72] to-[#0B8F5C] hover:from-[#D4AF37] hover:to-[#E7C76A] hover:text-[#050505] shadow-[0_4px_15px_rgba(15,174,114,0.35)] hover:shadow-[0_0_25px_rgba(212,175,55,0.45)] hover:scale-105"
            title="Add to Bag"
          >
            {added ? <Check className="w-4 h-4 text-[#050505]" /> : <ShoppingBag className="w-4 h-4" />}
          </button>
        </div>

      </div>

    </div>
  );
}
