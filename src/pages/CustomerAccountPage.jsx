import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Package, Heart, FileText, User 
} from 'lucide-react';
import InvoicePDF from '../components/common/InvoicePDF';
import ProductCard from '../components/common/ProductCard';
import { storeCMS } from '../services/storeCMS';
import { invoicePdfService } from '../services/invoicePdfService';

export default function CustomerAccountPage() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'orders');
  const [orders, setOrders] = useState(storeCMS.getOrders());
  const [wishlistIds, setWishlistIds] = useState(storeCMS.getWishlist());
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);

  const products = storeCMS.getProducts();
  const wishlistProducts = products.filter(p => wishlistIds.includes(p.id));

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [activeTab]);

  useEffect(() => {
    const handleUpdate = () => {
      setOrders(storeCMS.getOrders());
      setWishlistIds(storeCMS.getWishlist());
    };
    window.addEventListener('bm_cms_update', handleUpdate);
    return () => window.removeEventListener('bm_cms_update', handleUpdate);
  }, []);

  const handleCancelOrder = (id) => {
    if (confirm("Are you sure you want to request cancellation for this order?")) {
      storeCMS.updateOrderStatus(id, 'Cancelled');
      setOrders(storeCMS.getOrders());
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 bg-[#050505] min-h-screen">
      
      {/* Account Profile Header */}
      {(() => {
        const currentUser = storeCMS.getUser();
        const handleLogout = () => {
          storeCMS.logout();
          window.location.reload();
        };

        return (
          <div className="p-7 rounded-[28px] bg-[#0D1117] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] reflection-sweep">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 p-0.5 shadow-md">
                <div className="w-full h-full bg-[#050505] rounded-[14px] flex items-center justify-center overflow-hidden">
                  {currentUser?.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-[#D4AF37]" />
                  )}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display font-black text-2xl text-[#F8F8F8]">
                    {currentUser ? currentUser.name : 'Welcome, VIP Client'}
                  </h1>
                  {currentUser && (
                    <span className="px-3 py-0.5 rounded-full bg-[#0FAE72]/15 border border-[#0FAE72]/30 text-[#10C480] font-mono text-[10px] font-bold">
                      {currentUser.authProvider || 'Verified Client'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#B8BDC8] font-mono mt-0.5">
                  {currentUser ? `${currentUser.email} • +91 ${currentUser.phone}` : 'Sign in to sync your orders & concierge updates'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {currentUser ? (
                <button
                  onClick={handleLogout}
                  className="px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-rose-400 font-mono text-xs font-bold hover:bg-rose-500 hover:text-white transition"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('bm_require_auth', {}))}
                  className="px-5 py-3 rounded-2xl bg-[#0FAE72] text-[#050505] font-mono text-xs font-bold hover:bg-[#D4AF37] transition"
                >
                  Customer Login
                </button>
              )}
            </div>
          </div>
        );
      })()}

      {/* Account Nav Tabs */}
      <div className="flex border-b border-white/[0.08] font-mono text-xs">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-6 py-3.5 border-b-2 font-bold transition flex items-center gap-2 ${
            activeTab === 'orders' ? 'border-[#D4AF37] text-[#E7C76A] bg-white/[0.04]' : 'border-transparent text-[#B8BDC8] hover:text-[#F8F8F8]'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Orders &amp; Deliveries ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`px-6 py-3.5 border-b-2 font-bold transition flex items-center gap-2 ${
            activeTab === 'wishlist' ? 'border-[#D4AF37] text-[#E7C76A] bg-white/[0.04]' : 'border-transparent text-[#B8BDC8] hover:text-[#F8F8F8]'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>My Wishlist ({wishlistProducts.length})</span>
        </button>
      </div>

      {/* Orders Tab Content */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="p-7 rounded-[28px] bg-[#0D1117] border border-white/[0.08] space-y-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08] font-mono text-xs">
                <div>
                  <span className="text-[#B8BDC8]">Order ID: </span>
                  <strong className="text-[#D4AF37]">#{order.id}</strong>
                  <span className="text-[#B8BDC8] ml-3">Placed on {new Date(order.placedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#050505] text-[#0FAE72] border border-[#0FAE72]/30">
                    {order.status || 'Processing'}
                  </span>
                  <button
                    onClick={() => invoicePdfService.downloadInvoicePdf(order)}
                    className="px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[#D4AF37] hover:border-[#D4AF37] transition flex items-center gap-1.5 text-xs font-bold font-mono"
                  >
                    <FileText className="w-3.5 h-3.5" /> PDF Tax Invoice
                  </button>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-4 text-xs font-mono text-[#F8F8F8]">
                    <div className="flex items-center gap-3">
                      <img src={item.images ? item.images[0] : item.image} alt="" className="w-12 h-12 object-contain rounded-xl bg-[#050505] p-1 border border-white/[0.08]" />
                      <div>
                        <p className="font-bold text-[#F8F8F8] text-sm">{item.title}</p>
                        <p className="text-[11px] text-[#B8BDC8]">Qty: {item.quantity} • ₹{item.bmPrice.toLocaleString('en-IN')} each</p>
                      </div>
                    </div>
                    <span className="font-bold text-[#F8F8F8]">₹{(item.bmPrice * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              {/* Order Total & Cancel */}
              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-[#B8BDC8]">Total Paid: </span>
                  <strong className="text-[#0FAE72] text-base font-display">₹{order.totalAmount.toLocaleString('en-IN')}</strong>
                </div>

                {order.status !== 'Cancelled' && (
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    className="text-xs text-rose-400 hover:underline font-bold"
                  >
                    Cancel Order
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Wishlist Tab Content */}
      {activeTab === 'wishlist' && (
        <div>
          {wishlistProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlistProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 space-y-4 rounded-[28px] bg-[#0D1117] border border-white/[0.08]">
              <Heart className="w-12 h-12 text-[#D4AF37] mx-auto" />
              <h3 className="font-display font-bold text-xl text-[#F8F8F8]">Your Wishlist is Empty</h3>
              <p className="text-xs text-[#B8BDC8] font-mono">Save your favorite flagship smartphones to acquire later.</p>
            </div>
          )}
        </div>
      )}

      {selectedInvoiceOrder && (
        <InvoicePDF
          order={selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}

    </div>
  );
}
