import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, Trash2, Plus, Minus, Tag, ArrowRight, 
  Lock, Award 
} from 'lucide-react';
import { storeCMS } from '../services/storeCMS';

export default function CartPage() {
  const [cart, setCart] = useState(storeCMS.getCart());
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState(null);

  const navigate = useNavigate();

  const syncCart = () => setCart(storeCMS.getCart());

  useEffect(() => {
    window.addEventListener('bm_cms_update', syncCart);
    import('../services/userIntentService').then(({ userIntentService }) => {
      cart.forEach(item => userIntentService.trackCartItem(item));
    });
    return () => window.removeEventListener('bm_cms_update', syncCart);
  }, [cart]);

  const handleUpdateQty = (id, delta) => {
    const updated = storeCMS.updateCartQty(id, delta);
    setCart(updated);
  };

  const handleRemoveItem = (id) => {
    const updated = storeCMS.removeFromCart(id);
    setCart(updated);
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const res = storeCMS.validateCoupon(couponCode, subtotal);
    if (res.valid) {
      setAppliedCoupon(res);
      setCouponMessage({ type: 'success', text: res.message });
    } else {
      setAppliedCoupon(null);
      setCouponMessage({ type: 'error', text: res.message });
    }
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.bmPrice * item.quantity), 0);
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const shippingFee = subtotal > 5000 ? 0 : 499;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);
  const rewardPointsEarned = Math.floor(grandTotal / 100);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6 bg-[#050505] min-h-screen">
        <div className="w-20 h-20 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto text-[#D4AF37]">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="font-display font-black text-3xl text-[#F8F8F8]">Your Shopping Bag is Empty</h2>
        <p className="text-[#B8BDC8] font-mono text-xs max-w-md mx-auto">
          Explore our luxury showroom collection to select flagship smartphones and accessories.
        </p>
        <Link
          to="/products"
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#0FAE72] to-[#0B8F5C] hover:from-[#D4AF37] hover:to-[#E7C76A] hover:text-[#050505] text-white font-bold text-sm transition-all duration-500 inline-flex items-center gap-2"
        >
          <span>Explore Showroom</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 bg-[#050505] min-h-screen">
      
      <div className="pb-6 border-b border-white/[0.08]">
        <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37] font-bold">CLIENT SHOPPING BAG</span>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-[#F8F8F8] mt-1">Review Your Selection ({cart.length} items)</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Cart Item List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="p-5 sm:p-6 rounded-[28px] bg-[#0D1117] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <img src={item.images[0]} alt={item.title} className="w-20 h-20 object-contain rounded-2xl bg-[#050505] p-2 shrink-0 border border-white/[0.08]" />
                <div>
                  <Link to={`/product/${item.id}`} className="font-display font-bold text-[#F8F8F8] hover:text-[#D4AF37] transition text-base">
                    {item.title}
                  </Link>
                  <p className="text-xs text-[#B8BDC8] font-mono mt-1">
                    {item.brand} • {item.ram} • {item.storage} • {item.selectedColor || item.color}
                  </p>
                  <span className="inline-block text-[10px] font-mono text-[#0FAE72] mt-1 font-bold">
                    In Stock • Official Brand Warranty Included
                  </span>
                </div>
              </div>

              {/* Quantity Controls & Price */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-0 border-white/[0.08]">
                <div className="flex items-center gap-2 bg-[#050505] border border-white/[0.08] px-3 py-1.5 rounded-xl font-mono text-xs">
                  <button onClick={() => handleUpdateQty(item.id, -1)} className="p-1 text-[#B8BDC8] hover:text-[#F8F8F8]">
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center font-bold text-[#F8F8F8]">{item.quantity}</span>
                  <button onClick={() => handleUpdateQty(item.id, 1)} className="p-1 text-[#B8BDC8] hover:text-[#F8F8F8]">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right">
                  <span className="font-display font-bold text-[#F8F8F8] text-base">
                    ₹{(item.bmPrice * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>

                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="p-2 rounded-xl text-[#B8BDC8] hover:text-rose-400 hover:bg-white/[0.05] transition"
                  title="Remove Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Coupon Box */}
          <div className="p-6 rounded-[28px] bg-[#0D1117] border border-white/[0.08] space-y-3 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            <label className="block text-xs font-mono uppercase text-[#D4AF37] tracking-wider font-bold flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#0FAE72]" /> Apply Client Offer Code
            </label>
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. BM1000 or LUXURY5"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#050505] border border-white/[0.08] text-xs text-[#F8F8F8] uppercase font-mono outline-none focus:border-[#D4AF37]"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-2xl bg-white/[0.05] border border-white/[0.08] text-[#D4AF37] font-mono text-xs font-bold hover:border-[#D4AF37] transition"
              >
                Apply
              </button>
            </form>
            {couponMessage && (
              <p className={`text-xs font-mono ${couponMessage.type === 'success' ? 'text-[#0FAE72] font-bold' : 'text-rose-400'}`}>
                {couponMessage.text}
              </p>
            )}
          </div>

          {/* Pricing Summary */}
          <div className="p-6 rounded-[28px] bg-[#0D1117] border border-white/[0.08] space-y-4 font-mono text-xs shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            <h3 className="font-display font-bold text-[#F8F8F8] text-sm border-b border-white/[0.08] pb-3">
              Order Valuation Summary
            </h3>

            <div className="flex justify-between text-[#B8BDC8]">
              <span>Bag Subtotal:</span>
              <span className="text-[#F8F8F8] font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-[#0FAE72] font-bold">
                <span>Coupon Offer ({appliedCoupon.coupon.code}):</span>
                <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex justify-between text-[#B8BDC8]">
              <span>Insured White-Glove Freight:</span>
              <span className="text-[#0FAE72] font-bold">FREE</span>
            </div>

            <div className="flex justify-between text-[#B8BDC8]">
              <span>18% GST Invoice Included:</span>
              <span className="text-[#F8F8F8]">₹{Math.round(grandTotal * 0.18 / 1.18).toLocaleString('en-IN')}</span>
            </div>

            <div className="pt-3 border-t border-white/[0.08] flex justify-between text-[#F8F8F8] font-bold text-base font-display">
              <span>Total Payable:</span>
              <span className="text-[#0FAE72]">₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#050505] border border-white/[0.08] text-[11px] text-[#B8BDC8] flex items-center gap-2">
              <Award className="w-4 h-4 shrink-0 text-[#D4AF37]" />
              <span>You will earn <strong className="text-[#D4AF37]">+{rewardPointsEarned} VIP Points</strong> on this acquisition.</span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#0FAE72] to-[#0B8F5C] hover:from-[#D4AF37] hover:to-[#E7C76A] hover:text-[#050505] text-white font-bold text-sm transition-all duration-500 flex items-center justify-center gap-2 font-sans shadow-[0_4px_20px_rgba(15,174,114,0.35)]"
            >
              <Lock className="w-4 h-4" />
              <span>Proceed to Client Checkout</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
