import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Recycle, User, Layers } from 'lucide-react';
import { storeCMS } from '../../services/storeCMS';

export default function MobileBottomNav() {
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);

  const syncState = () => {
    const cart = storeCMS.getCart();
    setCartCount(cart.reduce((acc, i) => acc + i.quantity, 0));
  };

  useEffect(() => {
    syncState();
    window.addEventListener('bm_cms_update', syncState);
    return () => window.removeEventListener('bm_cms_update', syncState);
  }, []);

  const navItems = [
    { path: '/', label: 'Showroom', icon: Home },
    { path: '/products', label: 'Phones', icon: ShoppingBag },
    { path: '/second-hand', label: 'Pre-Owned', icon: Recycle, badge: 'LUX' },
    { path: '/cart', label: 'Bag', icon: ShoppingBag, count: cartCount },
    { path: '/account', label: 'Account', icon: User }
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#050505]/90 backdrop-blur-[30px] py-2 px-3 border-t border-white/[0.08] shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
      <div className="flex items-center justify-around">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all duration-300 ${
                isActive ? 'text-[#D4AF37] scale-105 font-bold' : 'text-[#B8BDC8]'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.count > 0 && (
                  <span className="absolute -top-2 -right-2.5 w-4 h-4 rounded-full bg-[#0FAE72] text-white text-[9px] font-bold flex items-center justify-center shadow-md">
                    {item.count}
                  </span>
                )}
                {item.badge && (
                  <span className="absolute -top-2 -right-4 px-1 rounded text-[8px] text-[#050505] font-mono font-bold bg-[#D4AF37]">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-mono tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
