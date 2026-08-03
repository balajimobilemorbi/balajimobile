import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, Heart, Search, User, ShieldCheck, Menu, X, 
  Sparkles, SlidersHorizontal, ArrowRight, PhoneCall, Store,
  Layers, Lock, Recycle, Sun, Moon
} from 'lucide-react';
import { storeCMS } from '../../services/storeCMS';
import { EMBEDDED_BM_LOGO } from '../../assets/embeddedAssets';

export default function Navbar({ onOpenSearch, onToggleTheme, isDark = true }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [compareCount, setCompareCount] = useState(0);
  const [settings, setSettings] = useState(storeCMS.getSettings());

  const location = useLocation();
  const navigate = useNavigate();

  const syncState = () => {
    const cart = storeCMS.getCart();
    const wish = storeCMS.getWishlist();
    const comp = storeCMS.getCompare();
    setCartCount(cart.reduce((acc, item) => acc + item.quantity, 0));
    setWishlistCount(wish.length);
    setCompareCount(comp.length);
    setSettings(storeCMS.getSettings());
  };

  useEffect(() => {
    syncState();
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('bm_cms_update', syncState);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('bm_cms_update', syncState);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 transition-all duration-500">

      {/* ── Top Notification Bar ── */}
      <div className="text-[11px] sm:text-xs py-1.5 px-3 sm:px-4 border-b bg-[#050505] text-[#B8BDC8] border-white/[0.08] backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-1.5 sm:gap-4">
          <div className="flex items-center gap-2 font-mono">
            <span className="w-2 h-2 rounded-full animate-ping bg-[#0FAE72] shrink-0" />
            <span className="font-bold text-[#F8F8F8] tracking-wider hidden xs:inline">
              EXCLUSIVE SHOWROOM:
            </span>
            <span className="text-[#0FAE72] font-semibold text-[10px] sm:text-xs">
              Morbi Flagship Store, Gujarat
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-6 font-mono text-[10px] sm:text-xs ml-auto">
            <a href={`tel:${settings.supportPhone || '7990648756'}`}
              className="flex items-center gap-1 font-bold transition-colors text-[#B8BDC8] hover:text-[#D4AF37]"
            >
              <PhoneCall className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#D4AF37]" />
              <span>+91 {settings.supportPhone || '79906 48756'}</span>
            </a>

            <Link to="/admin"
              className="flex items-center gap-1 font-bold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-[11px] bg-[#D4AF37]/20 text-[#E7C76A] border border-[#D4AF37]/50 hover:bg-[#D4AF37]/30 transition-all duration-300 shadow-lg"
              title="Store Owner Portal"
            >
              <ShieldCheck className="w-3 h-3 text-[#0FAE72]" />
              <span>Admin CMS</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main Glass Navbar with Smooth Scroll Shrink ── */}
      <nav className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isScrolled
          ? 'bg-[#050505]/85 backdrop-blur-[30px] border-b border-white/[0.08] shadow-2xl shadow-black/90 py-3'
          : 'bg-[#050505]/60 backdrop-blur-[20px] border-b border-white/[0.05] py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-2xl overflow-hidden border border-[#D4AF37]/40 group-hover:border-[#D4AF37] group-hover:scale-105 transition-all duration-500 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
              <img src="/bm-logo.png?v=3" alt="Balaji Mobile Logo"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = EMBEDDED_BM_LOGO; }} />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-xl tracking-tight text-[#F8F8F8] group-hover:text-[#D4AF37] transition-colors duration-300">
                BALAJI MOBILE
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] font-mono font-semibold text-[#B8BDC8]">
                LUXURY SHOWROOM
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-[#B8BDC8]">
            {[
              { to: '/', label: 'Showroom' },
              { to: '/products', label: 'Flagship Store' },
            ].map(({ to, label }) => {
              const isActive = location.pathname === to;
              return (
                <Link key={to} to={to}
                  className={`transition-colors duration-300 ${
                    isActive ? 'text-[#D4AF37] font-bold tracking-wide' : 'hover:text-[#F8F8F8]'
                  }`}
                >
                  {label}
                </Link>
              );
            })}

            <Link to="/second-hand"
              className={`flex items-center gap-1.5 transition-colors duration-300 ${
                location.pathname === '/second-hand' ? 'text-[#D4AF37] font-bold' : 'hover:text-[#F8F8F8]'
              }`}
            >
              <Recycle className="w-3.5 h-3.5 text-[#0FAE72]" />
              <span>Certified Pre-Owned</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#D4AF37]/15 text-[#E7C76A] border border-[#D4AF37]/30">
                LUXURY
              </span>
            </Link>

            <Link to="/compare"
              className="flex items-center gap-1.5 transition-colors duration-300 hover:text-[#F8F8F8]"
            >
              <span>Compare</span>
              {compareCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#D4AF37] text-[#050505] font-bold text-[10px] flex items-center justify-center">
                  {compareCount}
                </span>
              )}
            </Link>

            <Link to="/stores" className="transition-colors duration-300 hover:text-[#F8F8F8]">
              Lounge Location
            </Link>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">

            {/* Search Button */}
            <button onClick={onOpenSearch}
              className="p-2.5 rounded-2xl bg-white/[0.05] border border-white/[0.08] hover:border-[#D4AF37]/50 text-[#F8F8F8] hover:text-[#D4AF37] transition-all duration-300 flex items-center gap-2 group"
              title="Search Flagship Store"
            >
              <Search className="w-4 h-4 text-[#D4AF37] group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline text-xs font-mono text-[#B8BDC8] group-hover:text-[#F8F8F8]">
                Search Flagship...
              </span>
            </button>

            {/* Wishlist */}
            <Link to="/account?tab=wishlist"
              className="relative p-2.5 rounded-2xl bg-white/[0.05] border border-white/[0.08] hover:border-[#D4AF37]/50 text-[#F8F8F8] hover:text-[#D4AF37] transition-all duration-300"
              title="Saved Items"
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#D4AF37] text-[#050505] font-bold text-[10px] flex items-center justify-center shadow-lg">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Primary Cart CTA */}
            <Link to="/cart"
              className="relative px-4 py-2.5 rounded-2xl font-bold transition-all duration-500 flex items-center gap-2 text-white bg-gradient-to-r from-[#0FAE72] to-[#0B8F5C] hover:from-[#D4AF37] hover:to-[#E7C76A] hover:text-[#050505] border border-white/10 shadow-[0_8px_25px_rgba(15,174,114,0.3)] hover:shadow-[0_8px_30px_rgba(212,175,55,0.4)]"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline text-xs font-mono">Bag</span>
              {cartCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-white/20 text-white font-bold text-[10px] flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Account / Login */}
            {storeCMS.getUser() ? (
              <Link to="/account"
                className="hidden sm:flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white/[0.05] border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all text-xs font-mono font-bold"
                title={`Logged in as ${storeCMS.getUser().name}`}
              >
                <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="max-w-[90px] truncate">{storeCMS.getUser().name.split(' ')[0]}</span>
              </Link>
            ) : (
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('bm_require_auth', {}))}
                className="hidden sm:flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white/[0.05] border border-white/[0.08] hover:border-[#D4AF37]/50 text-[#F8F8F8] hover:text-[#D4AF37] transition-all text-xs font-mono font-bold"
              >
                <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Customer Login</span>
              </button>
            )}

            {/* Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              className="p-2.5 rounded-2xl bg-white/[0.05] border border-white/[0.08] hover:border-[#D4AF37]/50 text-[#F8F8F8] hover:text-[#D4AF37] transition-all duration-300"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark
                ? <Sun className="w-4 h-4 text-[#D4AF37]" />
                : <Moon className="w-4 h-4 text-[#3B82F6]" />
              }
            </button>

            {/* Mobile Drawer Trigger */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-2xl bg-white/[0.05] border border-white/[0.08] text-[#F8F8F8]"
            >
              {mobileMenuOpen
                ? <X className="w-5 h-5 text-[#D4AF37]" />
                : <Menu className="w-5 h-5 text-[#F8F8F8]" />
              }
            </button>
          </div>
        </div>

        {/* ── Mobile Navigation Overlay ── */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-white/[0.08] px-4 pt-4 pb-6 space-y-4 bg-[#050505]/95 backdrop-blur-[30px]">
            <div className="grid grid-cols-2 gap-3 text-sm font-medium">
              {[
                { to: '/', label: 'Showroom' },
                { to: '/products', label: 'All Phones' },
                { to: '/compare', label: `Compare (${compareCount})` },
                { to: '/account', label: 'My Orders' },
                { to: '/stores', label: 'Morbi Lounge' },
              ].map(({ to, label }) => (
                <Link key={to}
                  onClick={() => setMobileMenuOpen(false)}
                  to={to}
                  className="p-3.5 rounded-2xl text-center font-bold text-[#F8F8F8] bg-white/[0.04] border border-white/[0.08] hover:border-[#D4AF37]/50 transition-all"
                >
                  {label}
                </Link>
              ))}
              <Link onClick={() => setMobileMenuOpen(false)} to="/second-hand"
                className="p-3.5 rounded-2xl text-center font-bold bg-[#D4AF37]/15 text-[#E7C76A] border border-[#D4AF37]/40"
              >
                💎 Pre-Owned
              </Link>
            </div>
            <Link onClick={() => setMobileMenuOpen(false)} to="/admin"
              className="block text-center py-3.5 rounded-2xl font-bold text-sm text-[#050505] bg-gradient-to-r from-[#D4AF37] to-[#E7C76A]"
            >
              Store Owner Portal
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
