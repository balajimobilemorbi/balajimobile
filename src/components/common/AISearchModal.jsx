import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, X, Tag, Smartphone, MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react';
import { storeCMS } from '../../services/storeCMS';

export default function AISearchModal({ onClose, onOpenAiChat }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const allProducts = [
    ...storeCMS.getProducts().map(p => ({ ...p, isSecondHand: false })),
    ...storeCMS.getSecondHandProducts().map(p => ({ ...p, isSecondHand: true }))
  ];

  // Listen for Escape (ESC) keypress to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults(allProducts.slice(0, 6));
    } else {
      const q = query.toLowerCase().trim();
      const filtered = allProducts.filter(p => 
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.processor && p.processor.toLowerCase().includes(q)) ||
        (p.ram && p.ram.toLowerCase().includes(q)) ||
        (p.storage && p.storage.toLowerCase().includes(q)) ||
        (p.color && p.color.toLowerCase().includes(q)) ||
        (p.bmPrice && p.bmPrice.toString().includes(q))
      );
      setResults(filtered);
    }
  }, [query]);

  const handleSelect = (product) => {
    onClose();
    if (product.isSecondHand) {
      navigate(`/second-hand?highlight=${product.id}`);
    } else {
      navigate(`/product/${product.id}`);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const suggestions = [
    "iPhone 15 Pro",
    "Samsung S24 Ultra",
    "OnePlus 12",
    "Pre-Owned",
    "16GB RAM",
    "Snapdragon 8 Gen 3"
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-[#050505]/90 backdrop-blur-[30px] flex items-start justify-center pt-16 sm:pt-20 px-4 animate-in fade-in duration-200"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[#0D1117] border border-[#D4AF37]/40 text-[#F8F8F8] rounded-[28px] max-w-2xl w-full shadow-[0_30px_70px_rgba(0,0,0,0.95)] overflow-hidden relative">
        
        {/* Search Input Form */}
        <form onSubmit={handleSearchSubmit} className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center gap-3 bg-white/[0.03]">
          <Search className="w-5 h-5 text-[#D4AF37] shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search mobile by title, brand, RAM, storage, price..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-[#F8F8F8] placeholder-[#B8BDC8] font-sans text-base focus:outline-none"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} className="p-1 text-[#B8BDC8] hover:text-[#F8F8F8]">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-[#B8BDC8] hover:text-[#F8F8F8] text-xs font-mono font-bold hover:border-[#D4AF37]/50 transition shrink-0"
            title="Press ESC to close"
          >
            ESC
          </button>
        </form>

        {/* Quick Suggestion Chips */}
        <div className="p-3.5 border-b border-white/[0.08] bg-[#050505]/60 flex items-center gap-2 overflow-x-auto text-xs scrollbar-none">
          <span className="text-[#B8BDC8] font-mono flex items-center gap-1 shrink-0 font-bold">
            <Tag className="w-3.5 h-3.5 text-[#0FAE72]" /> Popular:
          </span>
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setQuery(s)}
              className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[#B8BDC8] hover:text-[#D4AF37] hover:border-[#D4AF37]/40 shrink-0 transition"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-2.5">
          <div className="flex items-center justify-between px-1 pb-1 font-mono text-[11px] text-[#B8BDC8]">
            <span>{query.trim() ? `Found ${results.length} results for "${query}"` : 'Recommended Flagship Mobiles'}</span>
            {query.trim() && (
              <button 
                type="button" 
                onClick={handleSearchSubmit}
                className="text-[#D4AF37] hover:underline flex items-center gap-1 font-bold"
              >
                View all in Store <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>

          {results.length > 0 ? (
            results.map(product => (
              <div
                key={product.id}
                onClick={() => handleSelect(product)}
                className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-[#D4AF37]/50 hover:bg-white/[0.06] transition flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img 
                    src={product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=1000&auto=format&fit=crop'} 
                    alt={product.title} 
                    className="w-12 h-12 object-contain rounded-xl bg-[#050505] p-1.5 border border-white/[0.08] shrink-0" 
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-display font-semibold text-[#F8F8F8] text-sm group-hover:text-[#D4AF37] transition truncate">
                        {product.title}
                      </h4>
                      {product.isSecondHand && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-[#D4AF37]/15 text-[#E7C76A] border border-[#D4AF37]/30 shrink-0">
                          Pre-Owned
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#B8BDC8] font-mono mt-0.5 truncate">
                      {product.brand} • {product.ram} • {product.storage} • {product.processor}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 ml-3">
                  <span className="font-display font-bold text-[#0FAE72] text-sm block">
                    ₹{product.bmPrice ? product.bmPrice.toLocaleString('en-IN') : ''}
                  </span>
                  {product.marketPrice && (
                    <span className="text-[10px] text-[#B8BDC8] line-through font-mono">
                      ₹{product.marketPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-[#B8BDC8] font-mono text-xs space-y-2">
              <Smartphone className="w-8 h-8 text-[#D4AF37]/50 mx-auto" />
              <p>No matching mobiles found for "{query}".</p>
              <p className="text-[11px] text-[#B8BDC8]/70">Try searching for "iPhone", "Samsung", "8GB", "512GB", or "Pre-Owned".</p>
            </div>
          )}
        </div>

        {/* AI Concierge Chatbot Option Footer */}
        <div className="p-3.5 border-t border-white/[0.08] bg-[#050505] flex items-center justify-between text-xs font-mono">
          <span className="text-[#B8BDC8] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#0FAE72]" /> Balaji Mobile Official Showroom
          </span>

          {onOpenAiChat && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAiChat();
              }}
              className="px-3 py-1.5 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#E7C76A] hover:bg-[#D4AF37]/30 font-bold transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Ask AI Buying Assistant</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
