import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, X, Tag } from 'lucide-react';
import { storeCMS } from '../../services/storeCMS';

export default function AISearchModal({ onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const products = storeCMS.getProducts();
  const navigate = useNavigate();

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
      setResults(products.slice(0, 4));
    } else {
      const q = query.toLowerCase();
      const filtered = products.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.processor.toLowerCase().includes(q) ||
        p.ram.toLowerCase().includes(q) ||
        p.storage.toLowerCase().includes(q) ||
        p.color.toLowerCase().includes(q)
      );
      setResults(filtered);
    }
  }, [query]);

  const handleSelect = (id) => {
    onClose();
    navigate(`/product/${id}`);
  };

  const suggestions = [
    "iPhone 15 Pro Natural Titanium",
    "Samsung S24 Ultra 512GB",
    "Leica Camera Flagships",
    "Foldables & Flips",
    "16GB RAM Gaming Phone",
    "Phones under ₹70,000"
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-[#050505]/90 backdrop-blur-[30px] flex items-start justify-center pt-20 px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[#0D1117] border border-[#D4AF37]/30 text-[#F8F8F8] rounded-[28px] max-w-2xl w-full shadow-[0_30px_70px_rgba(0,0,0,0.9)] overflow-hidden relative">
        
        {/* Search Input Bar */}
        <div className="p-5 border-b border-white/[0.08] flex items-center gap-3 bg-white/[0.03]">
          <Sparkles className="w-5 h-5 text-[#D4AF37]" />
          <input
            type="text"
            autoFocus
            placeholder="Ask Concierge or search brand, RAM, camera, storage..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-[#F8F8F8] placeholder-[#B8BDC8] font-sans text-base focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-[#B8BDC8] hover:text-[#F8F8F8]">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/[0.05] border border-white/[0.08] text-[#B8BDC8] hover:text-[#F8F8F8] text-xs font-mono font-bold hover:border-[#D4AF37]/50 transition"
            title="Press ESC to close"
          >
            ESC
          </button>
        </div>

        {/* AI Quick Suggestion Chips */}
        <div className="p-4 border-b border-white/[0.08] bg-[#050505]/60 flex items-center gap-2 overflow-x-auto text-xs scrollbar-none">
          <span className="text-[#B8BDC8] font-mono flex items-center gap-1 shrink-0 font-bold">
            <Tag className="w-3.5 h-3.5 text-[#0FAE72]" /> Ideas:
          </span>
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setQuery(s)}
              className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[#B8BDC8] hover:text-[#D4AF37] hover:border-[#D4AF37]/40 shrink-0 transition"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-2">
          {results.length > 0 ? (
            results.map(product => (
              <div
                key={product.id}
                onClick={() => handleSelect(product.id)}
                className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-[#D4AF37]/50 hover:bg-white/[0.06] transition flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <img src={product.images[0]} alt={product.title} className="w-12 h-12 object-contain rounded-xl bg-[#050505] p-1.5 border border-white/[0.08]" />
                  <div>
                    <h4 className="font-display font-semibold text-[#F8F8F8] text-sm group-hover:text-[#D4AF37] transition">
                      {product.title}
                    </h4>
                    <p className="text-xs text-[#B8BDC8] font-mono mt-0.5">
                      {product.brand} • {product.ram} • {product.storage}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-display font-bold text-[#0FAE72] text-sm">
                    ₹{product.bmPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-[#B8BDC8] font-mono text-xs">
              No matching flagship smartphones found. Try searching "iPhone", "Samsung", "16GB", etc.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
