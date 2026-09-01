import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Recycle, User, Layers, Search, Sparkles } from 'lucide-react';
import { storeCMS } from '../../services/storeCMS';

export default function MobileBottomNav() {
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const syncState = () => {
    const cart = storeCMS.getCart();
    const wish = storeCMS.getWishlist();
    setCartCount(cart.reduce((acc, i) => acc + i.quantity, 0));
    setWishlistCount(wish.length);
  };

  useEffect(() => {
    syncState();
    window.addEventListener('bm_cms_update', syncState);
    return () => window.removeEventListener('bm_cms_update', syncState);
  }, []);

  // Hide on checkout & admin page for focused task completion
  if (location.pathname === '/checkout' || location.pathname.startsWith('/admin')) {
    return null;
  }

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/products', label: 'Phones', icon: ShoppingBag },
    { path: '/second-hand', label: 'Pre-Owned', icon: Recycle, badge: 'LUX' },
    { path: '/cart', label: 'Bag', icon: ShoppingBag, count: cartCount },
    { path: '/account', label: 'Account', icon: User, count: wishlistCount > 0 ? wishlistCount : null }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#050505]/95 backdrop-blur-[30px] border-t border-white/[0.1] shadow-[0_-12px_40px_rgba(0,0,0,0.95)] pt-1.5 pb-[calc(env(safe-area-inset-bottom,0px)+8px)] px-2">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-2xl transition-all duration-300 active:scale-90 select-none ${
                isActive 
                  ? 'text-[#D4AF37] font-bold' 
                  : 'text-[#B8BDC8] hover:text-[#F8F8F8]'
              }`}
            >
              <div className={`relative p-1.5 rounded-xl transition-all duration-300 ${
                isActive ? 'bg-[#D4AF37]/15 shadow-[0_0_15px_rgba(212,175,55,0.25)]' : ''
              }`}>
                <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110 text-[#D4AF37]' : ''}`} />
                
                {item.count > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#0FAE72] text-white text-[9px] font-mono font-black flex items-center justify-center shadow-md animate-pulse">
                    {item.count}
                  </span>
                )}

                {item.badge && (
                  <span className="absolute -top-1.5 -right-3.5 px-1 py-0.2 rounded text-[7.5px] text-[#050505] font-mono font-black bg-[#D4AF37] shadow-sm">
                    {item.badge}
                  </span>
                )}
              </div>

              <span className={`text-[10.5px] font-mono tracking-tight transition-all duration-300 ${
                isActive ? 'text-[#D4AF37] font-bold' : 'text-[#B8BDC8]'
              }`}>
                {item.label}
              </span>

              {/* Active Dot Indicator */}
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#D4AF37] shadow-[0_0_6px_#D4AF37] mt-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
