import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { EMBEDDED_BM_LOGO } from '../../assets/embeddedAssets';

export default function WelcomeOpeningAnimation({ onFinish }) {
  const [visible, setVisible] = useState(false);
  const [isDoorOpening, setIsDoorOpening] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Only show on first site visit per session and not on direct /admin visits
    const alreadySeen = sessionStorage.getItem('bm_welcome_intro_seen');
    const isDirectAdmin = window.location.pathname.startsWith('/admin');

    if (alreadySeen || isDirectAdmin) {
      if (onFinish) onFinish();
      return;
    }

    setVisible(true);

    const startTime = Date.now();
    const duration = 2200; // 2.2 seconds display

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(timer);
        openDoors();
      }
    }, 25);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        openDoors();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const openDoors = () => {
    if (isDoorOpening) return;
    sessionStorage.setItem('bm_welcome_intro_seen', 'true');
    setIsDoorOpening(true);

    // After grand door slide transition (1000ms), unmount overlay
    setTimeout(() => {
      setVisible(false);
      if (onFinish) onFinish();
    }, 1050);
  };

  if (!visible) return null;

  return (
    <div 
      onClick={openDoors}
      className="fixed inset-0 z-[99999] pointer-events-auto select-none overflow-hidden cursor-pointer"
    >
      {/* ── LEFT SHOWROOM DOOR ── */}
      <div 
        className={`absolute top-0 left-0 w-1/2 h-full bg-[#05080C] border-r border-[#D4AF37]/30 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform z-10 ${
          isDoorOpening ? '-translate-x-full' : 'translate-x-0'
        }`}
      >
        {/* Luxury Gold Shimmer Gradient on Door Edge */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,_rgba(212,175,55,0.08)_0%,_transparent_75%)] pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#D4AF37]/60 to-transparent shadow-[0_0_15px_#D4AF37]" />
      </div>

      {/* ── RIGHT SHOWROOM DOOR ── */}
      <div 
        className={`absolute top-0 right-0 w-1/2 h-full bg-[#05080C] border-l border-[#D4AF37]/30 transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform z-10 ${
          isDoorOpening ? 'translate-x-full' : 'translate-x-0'
        }`}
      >
        {/* Luxury Gold Shimmer Gradient on Door Edge */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,_rgba(212,175,55,0.08)_0%,_transparent_75%)] pointer-events-none" />
        <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#D4AF37]/60 to-transparent shadow-[0_0_15px_#D4AF37]" />
      </div>

      {/* ── GOLDEN VERTICAL CENTER LIGHT BEAM (Center Seam) ── */}
      <div 
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-full bg-[#FFF3B0] shadow-[0_0_30px_#D4AF37] transition-all duration-700 pointer-events-none z-20 ${
          isDoorOpening ? 'opacity-0 scale-y-125' : 'opacity-80'
        }`} 
      />

      {/* ── MINIMALIST BRAND CONTENT (Centered Over Doors) ── */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className={`absolute inset-0 z-30 flex flex-col items-center justify-center p-6 text-center transition-all duration-500 ease-out ${
          isDoorOpening ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
        }`}
      >
        {/* Ambient Back Glow */}
        <div className="absolute w-[380px] h-[380px] bg-[#D4AF37]/15 rounded-full blur-[130px] pointer-events-none animate-pulse" />

        {/* Official BM Logo Emblem - Round Circular Shape */}
        <div className="relative mb-6 group">
          <div className="absolute -inset-2 bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#0FAE72] rounded-full blur-md opacity-70 animate-pulse" />
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-[#0A0F14] border-2 border-[#D4AF37] shadow-[0_0_45px_rgba(212,175,55,0.5)] flex items-center justify-center">
            <img 
              src="/bm-logo.png?v=3" 
              alt="Balaji Mobile Logo" 
              className="w-full h-full object-cover rounded-full filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
              onError={(e) => { e.target.src = EMBEDDED_BM_LOGO; }}
            />
          </div>
        </div>

        {/* Clean Minimalist Typography */}
        <div className="space-y-1.5 max-w-md">
          <h1 className="font-display font-black text-3xl sm:text-5xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF3B0] to-[#E7C76A] drop-shadow-[0_4px_25px_rgba(212,175,55,0.35)]">
            BALAJI MOBILE
          </h1>
          <p className="font-display font-bold text-xs sm:text-sm text-[#F8F8F8] tracking-[0.25em] uppercase">
            WELCOME TO OUR STORE
          </p>
          <p className="text-[10px] font-mono tracking-widest text-[#B8BDC8]/60 uppercase pt-0.5">
            MORBI, GUJARAT
          </p>
        </div>

        {/* Minimal Progress Bar */}
        <div className="w-44 sm:w-56 space-y-2 mt-8">
          <div className="w-full h-1 bg-white/[0.08] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#0FAE72] via-[#D4AF37] to-[#FFF3B0] rounded-full transition-all duration-75 shadow-[0_0_10px_#D4AF37]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Minimalist Enter Store Button */}
        <button
          onClick={openDoors}
          className="mt-6 px-6 py-2 rounded-full bg-[#D4AF37] hover:bg-[#E7C76A] text-[#050505] font-bold text-xs flex items-center gap-2 transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.35)] hover:scale-105"
        >
          <span>Enter Store</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <p className="mt-4 text-[10px] text-[#B8BDC8]/40 font-mono">
          Click anywhere or press Esc to enter
        </p>
      </div>
    </div>
  );
}
