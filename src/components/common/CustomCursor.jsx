import React, { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);

  useEffect(() => {
    // Disable custom cursor on mobile touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsMobile(true);
      return;
    }

    const onMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!hasMoved) setHasMoved(true);
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setHasMoved(false);

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'SELECT' ||
        target.closest('.group') ||
        target.closest('button') ||
        target.closest('a')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [hasMoved]);

  if (isMobile || !hasMoved) return null;

  return (
    <>
      {/* Outer Magnetic Luxury Gold Glow Ring (Sleek & Compact) */}
      <div
        className={`fixed top-0 left-0 pointer-events-none z-[9999] transition-transform duration-100 ease-out -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D4AF37]/50 shadow-[0_0_12px_rgba(212,175,55,0.25)] backdrop-blur-[0.5px] ${
          isHovered
            ? 'w-7 h-7 bg-[#D4AF37]/10 border-[#E7C76A] scale-110 shadow-[0_0_16px_rgba(212,175,55,0.35)]'
            : isClicking
            ? 'w-4 h-4 scale-90 border-[#D4AF37]'
            : 'w-5 h-5'
        }`}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`,
        }}
      />

      {/* Center Precision Gold Micro Dot */}
      <div
        className={`fixed top-0 left-0 pointer-events-none z-[10000] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D4AF37] shadow-[0_0_6px_#D4AF37] transition-transform duration-75 ${
          isHovered ? 'w-1.5 h-1.5 scale-125' : 'w-1 h-1'
        }`}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`,
        }}
      />
    </>
  );
}
