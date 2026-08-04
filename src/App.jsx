import React, { useState, useEffect } from 'react';
import { storeCMS } from './services/storeCMS';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import MobileBottomNav from './components/layout/MobileBottomNav';
import CustomCursor from './components/common/CustomCursor';
import AISearchModal from './components/common/AISearchModal';
import AIChatDrawer, { AIChatFloatingButton } from './components/common/AIChatDrawer';
import WhatsAppFloatingButton from './components/common/WhatsAppFloatingButton';
import CustomerAuthModal from './components/common/CustomerAuthModal';
import { Zap } from 'lucide-react';

import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import CustomerAccountPage from './pages/CustomerAccountPage';
import ComparePage from './pages/ComparePage';
import StoreLocationsPage from './pages/StoreLocationsPage';
import BlogsPage from './pages/BlogsPage';
import StaticPage from './pages/StaticPage';
import AdminDashboard from './pages/AdminDashboard';
import SecondHandPage from './pages/SecondHandPage';

function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // Disable browser scroll restoration so back/forward & section navigation opens at top
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Unconditionally scroll window & document elements to top
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname, search, hash]);

  return null;
}

export default function App() {
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('bm_theme') === 'dark';
  });

  // Apply theme to <html> on mount (defaults to Light Mode)
  useEffect(() => {
    const savedTheme = localStorage.getItem('bm_theme');
    const dark = savedTheme === 'dark';
    if (dark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(prev => {
      const next = !prev;
      localStorage.setItem('bm_theme', next ? 'dark' : 'light');
      if (next) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
      return next;
    });
  };

  // Customer Auth Modal Interceptor State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [pendingAuthData, setPendingAuthData] = useState(null);

  // Real-time Cloud Sync Notification Toast State
  const [showLiveSyncToast, setShowLiveSyncToast] = useState(false);

  useEffect(() => {
    storeCMS.initSupabaseRealtimeSync();

    storeCMS.pullFromCloud();
    const interval = setInterval(() => {
      storeCMS.pullFromCloud();
    }, 15000);

    const handleFocus = () => {
      storeCMS.pullFromCloud();
    };
    window.addEventListener('focus', handleFocus);

    const handleRequireAuth = (e) => {
      setPendingAuthData(e.detail);
      setAuthModalOpen(true);
    };

    const handleCmsUpdate = (e) => {
      if (e.detail?.source === 'cloud') {
        setShowLiveSyncToast(true);
        setTimeout(() => setShowLiveSyncToast(false), 3000);
      }
    };

    window.addEventListener('bm_require_auth', handleRequireAuth);
    window.addEventListener('bm_cms_update', handleCmsUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('bm_require_auth', handleRequireAuth);
      window.removeEventListener('bm_cms_update', handleCmsUpdate);
    };
  }, []);

  const handleAuthSuccess = (user) => {
    if (pendingAuthData && pendingAuthData.product) {
      storeCMS.addToCart(pendingAuthData.product, 1);
      alert(`✅ Logged in as ${user.name}! ${pendingAuthData.product.title} added to your cart.`);
      if (pendingAuthData.action === 'checkout') {
        window.location.href = '/checkout';
      }
    }
    setPendingAuthData(null);
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-[#0C1E29] text-[#F9F9F9] selection:bg-[#A90E02] selection:text-[#F9F9F9] transition-colors duration-300 relative pb-28 lg:pb-0">
        
        {/* Custom Luxury Magnetic Cursor for Desktop */}
        <CustomCursor />

        {/* Realtime Live Store Sync Toast Banner */}
        {showLiveSyncToast && (
          <div className="fixed top-20 right-4 z-50 bg-emerald-500 text-titanium-950 px-4 py-2.5 rounded-2xl shadow-2xl font-mono text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-4 duration-300">
            <Zap className="w-4 h-4 fill-titanium-950 animate-bounce" />
            <span>⚡ Live Store Update Synced Realtime!</span>
          </div>
        )}

        <Navbar 
          onOpenSearch={() => setSearchModalOpen(true)}
          onToggleTheme={toggleTheme}
          isDark={isDark}
        />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/account" element={<CustomerAccountPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/stores" element={<StoreLocationsPage />} />
            <Route path="/blogs" element={<BlogsPage />} />
            <Route path="/second-hand" element={<SecondHandPage />} />

            {/* Static & Policy Pages */}
            <Route path="/faq" element={<StaticPage />} />
            <Route path="/about" element={<StaticPage />} />
            <Route path="/contact" element={<StaticPage />} />
            <Route path="/privacy-policy" element={<StaticPage />} />
            <Route path="/terms" element={<StaticPage />} />
            <Route path="/shipping-policy" element={<StaticPage />} />
            <Route path="/return-policy" element={<StaticPage />} />

            {/* Admin Dashboard CMS */}
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>

        <Footer />

        {/* Floating Direct WhatsApp Chat Button */}
        <WhatsAppFloatingButton />

        {/* Persistent Floating AI Chatbot Assistant Button */}
        <AIChatFloatingButton onClick={() => setAiChatOpen(true)} />

        {/* Mobile Quick Bottom Navigation */}
        <MobileBottomNav onOpenAiChat={() => setAiChatOpen(true)} />

        {/* AI Chatbot Assistant Drawer */}
        <AIChatDrawer 
          isOpen={aiChatOpen} 
          onClose={() => setAiChatOpen(false)} 
        />

        {/* Mandatory Customer Auth Modal (Add-to-Cart Interceptor) */}
        <CustomerAuthModal
          isOpen={authModalOpen}
          onClose={() => { setAuthModalOpen(false); setPendingAuthData(null); }}
          onSuccess={handleAuthSuccess}
          pendingProduct={pendingAuthData?.product}
        />

        {/* AI Live Search Popup */}
        {searchModalOpen && (
          <AISearchModal 
            onClose={() => setSearchModalOpen(false)} 
            onOpenAiChat={() => setAiChatOpen(true)}
          />
        )}

      </div>
    </Router>
  );
}
